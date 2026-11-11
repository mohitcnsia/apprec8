// services/push.js
// Weekly summaries as phone notifications (mockup V1, approved 2026-11-05): parents on Sunday evening, teachers on
// Monday morning. Only adults who turn it on; children never get notifications. Needs build 20.0.30+ (the messaging
// library): on older builds pushAvailable() is false and nothing here runs (an OTA must never crash an old build).

import { NativeModules, PermissionsAndroid, Platform } from "react-native";
import functions from "@react-native-firebase/functions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";

let lib = null;
export const pushAvailable = () => !!NativeModules.RNFBMessagingModule;

function messaging() {
  if (!pushAvailable()) return null;
  try {
    if (!lib) lib = require("@react-native-firebase/messaging").default;
    return lib();
  } catch (e) {
    return null;
  }
}

async function askPermission() {
  if (Platform.OS === "android" && Platform.Version >= 33) {
    const r = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    return r === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}

/** Turns the weekly summary on for a role ("parent" | "teacher"). → { ok, reason? } */
export async function turnOnWeekly(role, lang = "en") {
  const m = messaging();
  if (!m) return { ok: false, reason: "Update the app to get weekly summaries." };
  if (!(await askPermission())) return { ok: false, reason: "Notifications are off for Apprec8. Turn them on in your phone's Settings → Apps → Apprec8." };
  const token = await m.getToken();
  await functions().httpsCallable("savePushSettings")({ role, on: true, token, lang });
  return { ok: true };
}

export async function turnOffWeekly(role) {
  await functions().httpsCallable("savePushSettings")({ role, on: false });
  return { ok: true };
}

/** The owner's phone for Decisions notifications (utils/decisions.js). → { ok, token?, reason? } */
export async function ownerPhoneToken() {
  const m = messaging();
  if (!m) return { ok: false, reason: "This app build has no notifications. Update the app from Play." };
  if (!(await askPermission())) return { ok: false, reason: "Notifications are off for Apprec8. Turn them on in your phone's Settings → Apps → Apprec8." };
  return { ok: true, token: await m.getToken() };
}

/** Tapping a summary opens the right Progress view ("family" | "classes"). Call once at start. */
export function listenForSummaryTaps(open) {
  const m = messaging();
  if (!m) return () => {};
  const go = (msg) => msg?.data?.view && open(msg.data.view);
  m.getInitialNotification().then(go).catch(() => {});
  return m.onNotificationOpenedApp(go);
}

// ---- Never miss an alert (owner, 2026-11-11) ----
// 1. Teachers and the owner: this phone's alert address is saved again on every start (written only when it changed,
//    or once a week), so a reinstall or a new phone can't silently stop alerts. Children never get alerts.
// 2. Alerts that arrive while the app is open are shown as a banner (Android shows nothing by itself then).

const savedKey = (uid) => `pushSaved.v1.${uid}`;
const askedKey = (uid) => `pushAsked.v1.${uid}`;
const WEEK = 7 * 24 * 3600 * 1000;

async function allowed(uid) {
  if (Platform.OS !== "android" || Platform.Version < 33) return true;
  if (await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)) return true;
  // Ask once on this phone; after that the button in Decisions / the weekly card asks again.
  if (await AsyncStorage.getItem(askedKey(uid)).catch(() => null)) return false;
  await AsyncStorage.setItem(askedKey(uid), "1").catch(() => {});
  return askPermission();
}

async function saveToken(uid, token, { owner }) {
  const saved = JSON.parse((await AsyncStorage.getItem(savedKey(uid)).catch(() => null)) || "null");
  if (saved?.token === token && Date.now() - saved.at < WEEK) return "same";
  // The owner's Decisions phone first: it works even before savePushToken is deployed.
  if (owner) {
    await firestore().collection("ownerConfig").doc("device").set({ tokens: firestore.FieldValue.arrayUnion(token), updatedAt: Date.now() }, { merge: true });
  }
  await functions().httpsCallable("savePushToken")({ token });
  await AsyncStorage.setItem(savedKey(uid), JSON.stringify({ token, at: Date.now() })).catch(() => {});
  return "saved";
}

/** Call when Home has the user's profile. `who` = { uid, teacher, owner }. Returns an unsubscribe for token changes. */
export function keepPhoneSaved(who) {
  const m = messaging();
  if (!m || !who?.uid || !(who.teacher || who.owner)) return () => {};
  const run = async (token) => {
    try {
      if (!(await allowed(who.uid))) return;
      await saveToken(who.uid, token || (await m.getToken()), who);
    } catch (e) {
      console.warn("keepPhoneSaved:", e?.code || e?.message || e); // tried again on the next start
    }
  };
  run();
  return m.onTokenRefresh((t) => run(t));
}

/** Alerts that arrive while the app is open → `show({ title, body, view })`. Returns an unsubscribe. */
export function listenForOpenAlerts(show) {
  const m = messaging();
  if (!m) return () => {};
  return m.onMessage((msg) => {
    const n = msg?.notification || {};
    if (n.title || n.body) show({ title: n.title || "", body: n.body || "", view: msg?.data?.view || null });
  });
}

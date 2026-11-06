// services/push.js
// Weekly summaries as phone notifications (mockup V1, approved 2026-11-05): parents on Sunday evening, teachers on
// Monday morning. Only adults who turn it on; children never get notifications. Needs build 20.0.30+ (the messaging
// library): on older builds pushAvailable() is false and nothing here runs (an OTA must never crash an old build).

import { NativeModules, PermissionsAndroid, Platform } from "react-native";
import functions from "@react-native-firebase/functions";

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

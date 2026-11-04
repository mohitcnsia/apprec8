// services/playSession.js
// Keeps the child's play session (utils/playSession.js) on the phone and drives the Android lock (mockup N1).
// The lock is Android screen pinning (native module LockTask, android/.../LockTaskModule.kt, from build 20.0.29).
// On older builds NativeModules.LockTask is missing: lockAvailable() is false and the sheet explains App pinning instead.

import { NativeModules, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { newSession } from "../utils/playSession";

const KEY = "playSession_v1";
const Lock = NativeModules.LockTask;
const listeners = new Set();

export const lockAvailable = () => Platform.OS === "android" && !!Lock;

export async function getSession() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const notify = (s) => listeners.forEach((fn) => fn(s));
export function onSessionChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Before "Play as": save the session and, if asked, pin the app (Android asks the parent to confirm once). */
export async function startSession({ childUid, childName, minutes, lock }) {
  const s = newSession({ childUid, childName, minutes, locked: !!lock && lockAvailable() });
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // storage blocked: the session just isn't remembered after a restart
  }
  if (s.locked) {
    try {
      await Lock.start();
    } catch (e) {
      console.warn("playSession: lock failed", e?.message);
    }
  }
  notify(s);
  return s;
}

/** Back to the parent (PIN accepted): unpin and forget the session. */
export async function endSession() {
  if (lockAvailable()) {
    try {
      await Lock.stop();
    } catch {
      // not pinned: fine
    }
  }
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {
    // ignore
  }
  notify(null);
}

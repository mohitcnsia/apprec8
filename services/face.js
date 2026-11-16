// services/face.js: your face in the app (owner, 16 Nov 2026: "let child upload their picture which never goes to
// server"; plus Claude's suggestion, agreed: a character face everyone sees).
// - Character: users.avatar = a face id (e.g. "rocket"). Saved to the account, so teachers and classmates see it.
// - Photo: copied into this phone's own app folder; never uploaded. Only this phone shows it (yours, on your phone).
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { getFirestore, doc, updateDoc } from "@react-native-firebase/firestore";
import { getApp } from "@react-native-firebase/app";
import { authInstance } from "../config/firebaseConfig";
import { requireOptionalNativeModule } from "expo-modules-core";
import { FACE_IDS } from "../utils/faces";

/** The photo picker exists only from build 20.0.33 (older builds get the update without it: no photo option there). */
export const canPickPhoto = () => !!requireOptionalNativeModule("ExponentImagePicker");

const key = (uid) => `face:photo:${uid}`;
const subs = new Set();
let cache = {}; // uid → local photo uri | null

const notify = () => subs.forEach((f) => f({ ...cache }));

export async function loadPhoto(uid) {
  if (!uid) return null;
  if (uid in cache) return cache[uid];
  const uri = await AsyncStorage.getItem(key(uid)).catch(() => null);
  const ok = uri ? (await FileSystem.getInfoAsync(uri).catch(() => ({ exists: false }))).exists : false;
  cache[uid] = ok ? uri : null;
  notify();
  return cache[uid];
}

/** Opens the phone's photo picker, square crop; keeps the picture only on this phone. → uri or null. */
export async function pickPhoto() {
  const uid = authInstance.currentUser?.uid;
  if (!uid || !canPickPhoto()) return null;
  const ImagePicker = require("expo-image-picker");
  const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 0.6 });
  if (res.canceled || !res.assets?.length) return null;
  const dest = `${FileSystem.documentDirectory}face_${uid}_${Date.now()}.jpg`;
  await FileSystem.copyAsync({ from: res.assets[0].uri, to: dest });
  const old = cache[uid];
  if (old) FileSystem.deleteAsync(old, { idempotent: true }).catch(() => {});
  await AsyncStorage.setItem(key(uid), dest);
  cache[uid] = dest;
  notify();
  return dest;
}

export async function removePhoto() {
  const uid = authInstance.currentUser?.uid;
  if (!uid) return;
  const old = cache[uid];
  if (old) FileSystem.deleteAsync(old, { idempotent: true }).catch(() => {});
  await AsyncStorage.removeItem(key(uid)).catch(() => {});
  cache[uid] = null;
  notify();
}

/** Saves the character face to the account (rules: only `avatar` changes, a short id). */
export async function setCharacter(id) {
  const uid = authInstance.currentUser?.uid;
  if (!uid || !FACE_IDS.includes(id)) return;
  await updateDoc(doc(getFirestore(getApp()), "users", uid), { avatar: id });
}

/** This phone's photo for a uid (re-renders when it changes). */
export function useLocalPhoto(uid) {
  const [uri, setUri] = useState(uid ? cache[uid] ?? null : null);
  useEffect(() => {
    if (!uid) return undefined;
    const f = (c) => setUri(c[uid] ?? null);
    subs.add(f);
    loadPhoto(uid).then((u) => setUri(u ?? null));
    return () => subs.delete(f);
  }, [uid]);
  return uri;
}

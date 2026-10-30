// services/adminApi.js
// Admin dashboard v0 reads (admin account only; Firestore rules enforce it, see DR-5).
// One-time reads (no live listeners) to keep costs low.

import {
  getFirestore,
  collection,
  collectionGroup,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "@react-native-firebase/firestore";
import { getApp } from "@react-native-firebase/app";

const db = getFirestore(getApp());

/** Every kid's progress doc for one quest (≈ 1 read per kid). */
export async function listKidProgress(questId) {
  const snap = await getDocs(collectionGroup(db, "questProgress"));
  return snap.docs
    .filter((d) => d.id === questId)
    .map((d) => ({ uid: d.ref.parent.parent?.id, ...d.data() }))
    .filter((k) => k.uid);
}

/** A kid's latest attempts (needs index questAttempts: userId ASC, createdAt DESC). */
export async function listKidAttempts(uid, max = 20) {
  const snap = await getDocs(
    query(collection(db, "questAttempts"), where("userId", "==", uid), orderBy("createdAt", "desc"), limit(max))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** 🚩 report tallies (one doc per question). */
export async function listQuestionIssues() {
  const snap = await getDocs(collection(db, "questionIssues"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

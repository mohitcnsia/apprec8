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

/**
 * Every kid's progress doc for one quest: 1 read per kid (cost guard DR-14, 2026-11-05).
 * Progress docs carry a `questId` field, so we ask only for this quest. Until the collection-group index on
 * questProgress.questId is deployed (firestore.indexes.json), the query fails and we fall back to the old full read.
 */
export async function listKidProgress(questId) {
  let docs;
  try {
    docs = (await getDocs(query(collectionGroup(db, "questProgress"), where("questId", "==", questId)))).docs;
  } catch (e) {
    console.warn("listKidProgress: questId index not ready, reading every quest's progress", e?.code || e?.message);
    docs = (await getDocs(collectionGroup(db, "questProgress"))).docs;
  }
  return docs
    .filter((d) => d.id === questId)
    .map((d) => ({ uid: d.ref.parent.parent?.id, ...d.data() }))
    .filter((k) => k.uid && !String(k.uid).startsWith("demo_")); // Demo School kids never mix with real ones
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

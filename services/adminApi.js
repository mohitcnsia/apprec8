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
import functions from "@react-native-firebase/functions";
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

// The child's own first name (Tripti), not the Google account's name (her sister Jatin's), for the Dashboard (14 Nov).
// Through the server (rules keep other people's profiles private). Only the uids on screen, kept for the app session.
const firstNames = new Map();
export async function kidFirstNames(uids = []) {
  const need = [...new Set(uids)].filter((u) => u && !firstNames.has(u)).slice(0, 60);
  if (need.length) {
    const r = await functions().httpsCallable("kidNames")({ uids: need }).catch(() => null);
    need.forEach((u) => firstNames.set(u, r?.data?.names?.[u] || null));
  }
  return Object.fromEntries(uids.map((u) => [u, firstNames.get(u) || null]));
}

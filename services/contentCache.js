// services/contentCache.js
// Aggressive local cache for English Quest content (Spec v2 Step 3).
//
// Per visit the app reads ONE document: quests/{questId} (it carries contentVersion and knownIssues).
// Nodes, questions, study pages and readings are kept on the phone (AsyncStorage) and reused while
// their saved version matches contentVersion (and they're < 7 days old). Only the kid's own
// progress doc stays a live listener (see englishQuestApi.listenToQuestProgress).
//
// Every function falls back to the network if the cache is missing/stale, and to stale cache if
// the network fails (offline), so kids can keep playing.

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection, doc, getDoc, getDocs } from "@react-native-firebase/firestore";
import { getApp } from "@react-native-firebase/app";
import { fetchQuizQuestionsOnce, listenToStudyContent } from "./firestoreContentApi";
import { isFresh, makeEntry, cacheKeys, contentIdsForUnit } from "../utils/cachePolicy";

const db = getFirestore(getApp());

const readEntry = async (key) => {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const writeEntry = (key, version, data) =>
  AsyncStorage.setItem(key, JSON.stringify(makeEntry(version, data))).catch((e) =>
    console.warn("contentCache: could not save", key, e?.message)
  );

/** Cache-first loader: fresh cache → use it; else fetch; if fetch fails → stale cache (offline). */
async function cached(key, version, fetcher) {
  const entry = await readEntry(key);
  if (isFresh(entry, version)) return entry.data;
  try {
    const data = await fetcher();
    if (data !== null && data !== undefined) writeEntry(key, version, data);
    return data;
  } catch (e) {
    if (entry?.data) {
      console.warn("contentCache: network failed, using older copy for", key);
      return entry.data;
    }
    throw e;
  }
}

// --- Quest document: the only read per visit. Short memory cache so intro + map share one read. ---
const questMemo = new Map(); // questId -> { at, data }
const QUEST_MEMO_MS = 30 * 1000;

export async function getQuest(questId, { force = false } = {}) {
  const memo = questMemo.get(questId);
  if (!force && memo && Date.now() - memo.at < QUEST_MEMO_MS) return memo.data;
  const snap = await getDoc(doc(db, "quests", questId));
  const data = snap.exists() ? { id: snap.id, ...snap.data() } : null;
  questMemo.set(questId, { at: Date.now(), data });
  return data;
}

export const getQuestNodes = (questId, version) =>
  cached(cacheKeys.nodes(questId), version, async () => {
    const snap = await getDocs(collection(db, "quests", questId, "nodes"));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  });

export const getQuizQuestions = (quizId, version) =>
  cached(cacheKeys.quiz(quizId), version, () => fetchQuizQuestionsOnce(quizId));

export const getStudyDoc = (contentId, version) =>
  cached(cacheKeys.study(contentId), version, async () => {
    const snap = await getDoc(doc(db, "studyContent", contentId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  });

/** Downloads a unit's quizzes and pages in the background so the next steps open instantly/offline. */
const prefetched = new Set();
export async function prefetchUnit(nodes, unitId, version) {
  const tag = `${unitId}@${version}`;
  if (!unitId || prefetched.has(tag)) return;
  prefetched.add(tag);
  const { quizIds, studyIds } = contentIdsForUnit(nodes, unitId);
  for (const id of quizIds) await getQuizQuestions(id, version).catch(() => {});
  for (const id of studyIds) await getStudyDoc(id, version).catch(() => {});
}

/**
 * Drop-in for listenToStudyContent: with a contentVersion (English Quest) → one cached read;
 * without (Space, V1 lists) → the old live listener. Returns an unsubscribe function.
 */
export function loadStudyContent(contentId, version, onData, onError) {
  if (version === undefined || version === null) {
    return listenToStudyContent(contentId, onData, onError);
  }
  let cancelled = false;
  getStudyDoc(contentId, version)
    .then((data) => !cancelled && onData(data))
    .catch((e) => !cancelled && onError?.(e));
  return () => {
    cancelled = true;
  };
}

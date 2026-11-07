// services/englishQuestApi.js
// Firestore access for tile-based quests (English Quest and future ones).
//
// Data layout (kept separate from the Space quest's `quest_nodes`, so older app
// builds are never affected):
//   quests/{questId}                       quest info (title, description, image)
//   quests/{questId}/nodes/{nodeId}        units (trunk) and leaves (branches)
//   users/{uid}/questProgress/{questId}    { questId, nodes: { [nodeId]: { status, bestPercent, attempts } } }
//     (questId is also stored as a field so the admin dashboard can query one quest: cost guard 2026-11-05)
//   questAttempts/{autoId}                 one document per quiz attempt, with every answer

import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  addDoc,
  setDoc,
  getDoc,
  serverTimestamp,
  increment,
  deleteDoc,
  deleteField,
} from "@react-native-firebase/firestore";
import { getApp } from "@react-native-firebase/app";
import Constants from "expo-constants";
import { authInstance } from "../config/firebaseConfig";
import { scoreAnswers } from "../utils/questTree";
import { mistakeUpdates, paperMistakeUpdates } from "../utils/mistakes";
import { updateStats } from "../utils/kidStats";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  loadLocalProgress,
  saveLocalNodeProgress,
  saveLocalAttempt,
  getLocalStars,
  prepareLocalProgressUpload,
  clearLocalProgress,
} from "../utils/localProgress";
import { getCachedUserDoc } from "./firestoreContentApi";
import { needsParentConsent } from "../utils/consent";
import { APPREC8_TEAM_REVIEWER_UID, isTesterUser } from "../config/appConfig";

const db = getFirestore(getApp());

const currentUser = () => authInstance.currentUser;

/** Listens to the quest's info document. */
export function listenToQuest(questId, onData, onError) {
  return onSnapshot(
    doc(db, "quests", questId),
    (snap) => onData(snap.exists() ? { id: snap.id, ...snap.data() } : null),
    (error) => onError?.(error)
  );
}

/** Listens to all nodes (units + leaves) of a quest. */
export function listenToQuestTreeNodes(questId, onData, onError) {
  return onSnapshot(
    collection(db, "quests", questId, "nodes"),
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (error) => onError?.(error)
  );
}

// Latest progress seen by the live listener, per user+quest. Lets saves skip the read-before-write
// (Spec v2 Step 3: fewer reads). Falls back to one read if the listener hasn't delivered yet.
const latestProgress = new Map(); // `${uid}/${questId}` -> nodes map
const latestMistakes = new Map(); // `${uid}/${questId}` -> mistakes map ("My mistakes")
const latestStats = new Map(); // `${uid}/${questId}` -> stats summary (admin dashboard)
const localSubscribers = new Map(); // `${uid}/${questId}` -> Set of callbacks

function notifyLocalSubscribers(uid, questId, nodes, docData) {
  const set = localSubscribers.get(`${uid}/${questId}`);
  if (set) {
    for (const cb of set) {
      try {
        cb(nodes, docData);
      } catch (e) {
        console.warn("local subscriber error:", e);
      }
    }
  }
}

function isUserUnconsented(user) {
  if (!user) return false;
  const udoc = getCachedUserDoc();
  if (!udoc) return false;
  const exempt = isTesterUser(user) || user.uid === APPREC8_TEAM_REVIEWER_UID;
  return needsParentConsent(udoc, { exempt });
}

/** Listens to the signed-in kid's progress in a quest. Returns {} for new kids. */
export function listenToQuestProgress(questId, onData, onError) {
  const user = currentUser();
  if (!user) {
    onData({});
    return () => {};
  }
  const key = `${user.uid}/${questId}`;
  if (!localSubscribers.has(key)) {
    localSubscribers.set(key, new Set());
  }
  localSubscribers.get(key).add(onData);

  // Deliver local device progress if available
  loadLocalProgress(AsyncStorage, user.uid, questId)
    .then((local) => {
      if (local && Object.keys(local.nodes || {}).length > 0) {
        latestProgress.set(key, local.nodes);
        latestMistakes.set(key, local.mistakes || {});
        latestStats.set(key, local.stats || {});
        onData(local.nodes, local);
      }
    })
    .catch(() => {});

  const unsubFirestore = onSnapshot(
    doc(db, "users", user.uid, "questProgress", questId),
    (snap) => {
      if (snap.exists()) {
        const data = snap.data() || {};
        const nodes = data.nodes || {};
        latestProgress.set(key, nodes);
        latestMistakes.set(key, data.mistakes || {});
        latestStats.set(key, data.stats || {});
        onData(nodes, data); // 2nd arg: whole doc (e.g. data.mistakes for "My mistakes")
      }
    },
    (error) => onError?.(error)
  );

  return () => {
    localSubscribers.get(key)?.delete(onData);
    unsubFirestore();
  };
}

/**
 * Updates one node in the kid's progress. Keeps the best score.
 * gate:        { weak: string[] } for gate attempts (stores fails + weak sub-topics)
 * resetGateId: a practice leaf that was glowing was passed → that gate's fail counter resets
 */
async function updateNodeProgress(questId, nodeId, { percent, passed, gate = null, resetGateId = null }) {
  const user = currentUser();
  if (!user) return;

  // Always update local storage for learn-first & offline resilience
  await saveLocalNodeProgress(AsyncStorage, user.uid, questId, nodeId, { percent, passed, gate, resetGateId });
  const localDoc = await loadLocalProgress(AsyncStorage, user.uid, questId);
  notifyLocalSubscribers(user.uid, questId, localDoc.nodes, localDoc);

  // Unconsented kids stay on device only
  if (isUserUnconsented(user)) return;

  const progressRef = doc(db, "users", user.uid, "questProgress", questId);
  let known = latestProgress.get(`${user.uid}/${questId}`);
  if (!known) {
    const snap = await getDoc(progressRef); // only if the map's listener hasn't loaded yet
    known = snap.exists() ? snap.data()?.nodes || {} : {};
  }
  const previous = known[nodeId] || {};
  const previousBest = typeof previous.bestPercent === "number" ? previous.bestPercent : 0;

  const nodeUpdate = {
    attempts: increment(1),
    bestPercent: Math.max(previousBest, percent),
    lastPlayedAt: serverTimestamp(),
  };
  // Once completed, a node stays completed (a later failed replay never re-locks it).
  const alreadyCompleted = previous.status === "completed";
  if (passed || alreadyCompleted) nodeUpdate.status = "completed";
  if (passed && !alreadyCompleted) nodeUpdate.completedAt = serverTimestamp();

  // Gate memory (Spec v2): fails since last practice + weak sub-topics for the glow.
  if (gate) {
    if (passed || alreadyCompleted) {
      nodeUpdate.failsSinceLastPractice = 0;
      nodeUpdate.weakSubtopics = [];
    } else {
      nodeUpdate.failsSinceLastPractice = increment(1);
      nodeUpdate.weakSubtopics = gate.weak || [];
    }
  }

  const nodesUpdate = { [nodeId]: nodeUpdate };
  if (resetGateId && passed && resetGateId !== nodeId) {
    nodesUpdate[resetGateId] = { failsSinceLastPractice: 0 };
  }

  await setDoc(progressRef, { questId, nodes: nodesUpdate, updatedAt: serverTimestamp() }, { merge: true });
}

/** Marks a study page as read (completed). */
export function markStudyNodeCompleted(questId, nodeId) {
  return updateNodeProgress(questId, nodeId, { percent: 100, passed: true });
}

/**
 * Saves one quiz attempt with every answer, then updates progress.
 * Never throws: a failed save must not break the kid's game.
 *
 * @param {object} p
 * @param {string} p.questId
 * @param {string} p.nodeId
 * @param {string} p.quizId
 * @param {"training"|"exam"} p.mode
 * @param {Array<object>} p.answers - [{ questionId, questionText, chosen, correctAnswer, isCorrect, timeMs, mistakeTag }]
 * @param {number} p.totalQuestions
 * @param {number} p.passPercent
 * @param {number} p.startedAt - ms timestamp when the quiz started
 * @param {"finished"|"outOfHearts"} p.outcome
 * @param {object} [p.details] - extra info for this activity type
 * @param {object} [p.gateResult] - evaluateGate() result for gate attempts
 * @param {string} [p.resetGateId] - gate whose fail counter resets if this attempt passes
 * @param {boolean} [p.skipProgress] - record answers only (endless practice never "completes")
 * @param {string} [p.activity] - "practice" | "gate" | "boss" | "endless" | "mistakes" | "reading" (for "My mistakes")
 * @param {string} [p.branchId] / [p.unitId] - where the activity sits on the map
 * @param {string} [p.topicTag] - dashboard topic for answers without a sub-topic (Finding 20)
 * @returns {Promise<{ percent: number, passed: boolean } | null>}
 */
export async function saveQuestAttempt(p) {
  const user = currentUser();
  if (!user) return null;
  try {
    // 1. Always record locally for learn-first & offline resilience
    const localRes = await saveLocalAttempt(AsyncStorage, user.uid, p);
    const localDoc = await loadLocalProgress(AsyncStorage, user.uid, p.questId);
    notifyLocalSubscribers(user.uid, p.questId, localDoc.nodes, localDoc);

    // 2. Unconsented kids stay on device only (DPDP Act)
    if (isUserUnconsented(user)) {
      return { percent: localRes?.percent || 0, passed: !!localRes?.passed };
    }

    // 3. Consented: save to Firestore
    const scored = scoreAnswers(p.answers, p.totalQuestions);
    const gate = p.gateResult || null;
    // Gates use their own rule (score + every sub-topic). Out of hearts never passes.
    const correctCount = gate ? gate.correctCount : scored.correctCount;
    const total = gate ? gate.total : scored.total;
    const percent = gate ? gate.percent : scored.percent;
    const passed = p.outcome === "finished" && (gate ? gate.passed : percent >= p.passPercent);
    const endedAt = Date.now();

    await addDoc(collection(db, "questAttempts"), {
      userId: user.uid,
      userName: user.displayName || null,
      questId: p.questId,
      nodeId: p.nodeId,
      quizId: p.quizId,
      mode: p.mode,
      outcome: p.outcome,
      totalQuestions: total,
      answeredCount: p.answers.length,
      correctCount,
      percent,
      passPercent: p.passPercent,
      passed,
      startedAtMs: p.startedAt || null,
      durationMs: p.startedAt ? endedAt - p.startedAt : null,
      // Firestore rejects undefined, and one bad field loses the whole attempt: drop them.
      answers: p.answers.map((a) => Object.fromEntries(Object.entries(a).filter(([, v]) => v !== undefined))),
      details: gate
        ? { ...(p.details || {}), gate: { bySubtopic: gate.bySubtopic, weak: gate.weak } }
        : p.details || null, // e.g. reading: { readingMode, wordCount }
      appVersion: Constants.expoConfig?.version || null,
      createdAt: serverTimestamp(),
    });

    await saveMistakes(p);
    await saveStats(p, endedAt);

    if (!p.skipProgress) {
      await updateNodeProgress(p.questId, p.nodeId, {
        percent,
        passed,
        gate: gate ? { weak: gate.weak } : null,
        resetGateId: p.resetGateId || null,
      });
    }
    return { percent, passed };
  } catch (error) {
    console.error("saveQuestAttempt failed:", error);
    return null;
  }
}

/** Tester mode: deletes the signed-in user's own progress in a quest (rules allow own doc only). */
export async function resetMyQuestProgress(questId) {
  const user = currentUser();
  if (!user) return;
  latestProgress.delete(`${user.uid}/${questId}`);
  latestMistakes.delete(`${user.uid}/${questId}`);
  latestStats.delete(`${user.uid}/${questId}`);
  await deleteDoc(doc(db, "users", user.uid, "questProgress", questId));
}

/**
 * ♾️ Keep practising: keeps the best streak and total answered for the branch's endless node.
 * Never marks it "completed" (practice has no end). Uses the in-memory progress (no extra read).
 */
export async function updateEndlessStats(questId, nodeId, { bestStreak = 0, answered = 0 }) {
  const user = currentUser();
  if (!user || !answered) return;
  const known = latestProgress.get(`${user.uid}/${questId}`) || {};
  const prevBest = known[nodeId]?.bestStreak || 0;
  await setDoc(
    doc(db, "users", user.uid, "questProgress", questId),
    {
      questId,
      nodes: {
        [nodeId]: {
          bestStreak: Math.max(prevBest, bestStreak),
          answered: increment(answered),
          lastPlayedAt: serverTimestamp(),
        },
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * "My mistakes": updates users/{uid}/questProgress/{questId}.mistakes from one attempt's answers.
 * Wrong answers are added (gate/boss as topics), and inside "My mistakes" 2 right in a row clears one.
 * Uses the listener's copy of the list (no extra read). Never throws.
 */
async function saveMistakes(p) {
  const user = currentUser();
  if (!user || !p.activity) return;
  try {
    const key = `${user.uid}/${p.questId}`;
    const current = latestMistakes.get(key) || {};
    const updates = mistakeUpdates(current, p.answers, {
      mode: p.activity,
      quizId: p.quizId,
      branchId: p.branchId || null,
      unitId: p.unitId || null,
    });
    await writeMistakes(p.questId, current, updates);
  } catch (e) {
    console.warn("saveMistakes failed:", e);
  }
}

/** Practice paper: adds wrong / blank paper questions to this quest's "My mistakes" (one write). Never throws. */
export async function addPaperMistakes(questId, wrongs, paperId) {
  const user = currentUser();
  if (!user || !questId || !wrongs?.length) return;
  try {
    const current = latestMistakes.get(`${user.uid}/${questId}`) || {};
    await writeMistakes(questId, current, paperMistakeUpdates(current, wrongs, { paperId }));
  } catch (e) {
    console.warn("addPaperMistakes failed:", e);
  }
}

async function writeMistakes(questId, current, updates) {
  const user = currentUser();
  if (!user) return;
  const key = `${user.uid}/${questId}`;
  const keys = Object.keys(updates);
  if (!keys.length) return;
  const payload = {};
  keys.forEach((k) => (payload[k] = updates[k] === null ? deleteField() : updates[k]));
  // Keep the local copy in step so several saves in a row don't lose each other's changes.
  const next = { ...current };
  keys.forEach((k) => (updates[k] === null ? delete next[k] : (next[k] = updates[k])));
  latestMistakes.set(key, next);
  await setDoc(
    doc(db, "users", user.uid, "questProgress", questId),
    { questId, mistakes: payload, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

/**
 * Admin dashboard summary: updates users/{uid}/questProgress/{questId}.stats from one attempt.
 * Uses the listener's copy; if the map's listener hasn't loaded yet, reads the doc once
 * (never overwrite real totals with a fresh, empty summary). Never throws.
 */
async function saveStats(p, endedAt) {
  const user = currentUser();
  if (!user || !p.answers?.length) return;
  try {
    const key = `${user.uid}/${p.questId}`;
    const ref = doc(db, "users", user.uid, "questProgress", p.questId);
    let prev = latestStats.get(key);
    if (!prev) {
      const snap = await getDoc(ref);
      prev = snap.exists() ? snap.data()?.stats || {} : {};
    }
    const next = updateStats(prev, p.answers, {
      now: endedAt,
      durationMs: p.startedAt ? endedAt - p.startedAt : 0,
      questId: p.questId,
      userName: user.displayName || null,
      topicFallback: p.topicTag || null,
    });
    latestStats.set(key, next);
    // Days that dropped out of the 14-day window must be deleted (a merge would keep them).
    const daily = { ...next.daily };
    Object.keys(prev.daily || {}).forEach((d) => {
      if (!(d in next.daily)) daily[d] = deleteField();
    });
    await setDoc(ref, { questId: p.questId, stats: { ...next, daily } }, { merge: true });
  } catch (e) {
    console.warn("saveStats failed:", e);
  }
}

/**
 * Uploads local progress and attempts to Firestore once parent gives consent (mockup X9).
 * Merges into questProgress docs and appends to questAttempts.
 */
export async function uploadLocalProgressToServer(uid) {
  if (!uid) return null;
  const { progressDocs, attempts } = await prepareLocalProgressUpload(AsyncStorage, uid);
  const localStars = await getLocalStars(AsyncStorage, uid);

  // 1. Upload progress documents
  for (const { questId, data } of progressDocs) {
    const ref = doc(db, "users", uid, "questProgress", questId);
    await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
    latestProgress.set(`${uid}/${questId}`, data.nodes || {});
    latestMistakes.set(`${uid}/${questId}`, data.mistakes || {});
    latestStats.set(`${uid}/${questId}`, data.stats || {});
  }

  // 2. Upload attempts
  for (const att of attempts) {
    const { id, ...attData } = att;
    await addDoc(collection(db, "questAttempts"), {
      ...attData,
      createdAt: serverTimestamp(),
    });
  }

  // 3. Clear local device progress
  await clearLocalProgress(AsyncStorage, uid);

  return { stars: localStars, count: progressDocs.length + attempts.length };
}

// services/englishQuestApi.js
// Firestore access for tile-based quests (English Quest and future ones).
//
// Data layout (kept separate from the Space quest's `quest_nodes`, so older app
// builds are never affected):
//   quests/{questId}                       quest info (title, description, image)
//   quests/{questId}/nodes/{nodeId}        units (trunk) and leaves (branches)
//   users/{uid}/questProgress/{questId}    { nodes: { [nodeId]: { status, bestPercent, attempts } } }
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
} from "@react-native-firebase/firestore";
import { getApp } from "@react-native-firebase/app";
import Constants from "expo-constants";
import { authInstance } from "../config/firebaseConfig";
import { scoreAnswers } from "../utils/questTree";

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

/** Listens to the signed-in kid's progress in a quest. Returns {} for new kids. */
export function listenToQuestProgress(questId, onData, onError) {
  const user = currentUser();
  if (!user) {
    onData({});
    return () => {};
  }
  return onSnapshot(
    doc(db, "users", user.uid, "questProgress", questId),
    (snap) => {
      const nodes = snap.exists() ? snap.data()?.nodes || {} : {};
      latestProgress.set(`${user.uid}/${questId}`, nodes);
      onData(nodes);
    },
    (error) => onError?.(error)
  );
}

/**
 * Updates one node in the kid's progress. Keeps the best score.
 * gate:        { weak: string[] } for gate attempts (stores fails + weak sub-topics)
 * resetGateId: a practice leaf that was glowing was passed → that gate's fail counter resets
 */
async function updateNodeProgress(questId, nodeId, { percent, passed, gate = null, resetGateId = null }) {
  const user = currentUser();
  if (!user) return;
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

  await setDoc(progressRef, { nodes: nodesUpdate, updatedAt: serverTimestamp() }, { merge: true });
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
 * @returns {Promise<{ percent: number, passed: boolean } | null>}
 */
export async function saveQuestAttempt(p) {
  const user = currentUser();
  if (!user) return null;
  try {
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
      answers: p.answers,
      details: gate
        ? { ...(p.details || {}), gate: { bySubtopic: gate.bySubtopic, weak: gate.weak } }
        : p.details || null, // e.g. reading: { readingMode, wordCount }
      appVersion: Constants.expoConfig?.version || null,
      createdAt: serverTimestamp(),
    });

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

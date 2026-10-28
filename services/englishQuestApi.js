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

/** Listens to the signed-in kid's progress in a quest. Returns {} for new kids. */
export function listenToQuestProgress(questId, onData, onError) {
  const user = currentUser();
  if (!user) {
    onData({});
    return () => {};
  }
  return onSnapshot(
    doc(db, "users", user.uid, "questProgress", questId),
    (snap) => onData(snap.exists() ? snap.data()?.nodes || {} : {}),
    (error) => onError?.(error)
  );
}

/** Updates one node in the kid's progress. Keeps the best score. */
async function updateNodeProgress(questId, nodeId, { percent, passed }) {
  const user = currentUser();
  if (!user) return;
  const progressRef = doc(db, "users", user.uid, "questProgress", questId);
  const snap = await getDoc(progressRef);
  const previous = snap.exists() ? snap.data()?.nodes?.[nodeId] || {} : {};
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

  await setDoc(
    progressRef,
    { nodes: { [nodeId]: nodeUpdate }, updatedAt: serverTimestamp() },
    { merge: true }
  );
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
 * @returns {Promise<{ percent: number, passed: boolean } | null>}
 */
export async function saveQuestAttempt(p) {
  const user = currentUser();
  if (!user) return null;
  try {
    const { correctCount, total, percent } = scoreAnswers(p.answers, p.totalQuestions);
    const passed = p.outcome === "finished" && percent >= p.passPercent;
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
      appVersion: Constants.expoConfig?.version || null,
      createdAt: serverTimestamp(),
    });

    await updateNodeProgress(p.questId, p.nodeId, { percent, passed });
    return { percent, passed };
  } catch (error) {
    console.error("saveQuestAttempt failed:", error);
    return null;
  }
}

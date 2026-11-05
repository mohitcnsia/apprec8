// services/paperApi.js: saving practice papers (mockup Q).
// - The paper in progress is kept on the phone (AsyncStorage), so closing the app doesn't lose answers.
// - Past scores ("Last time: 41 / 60") are kept on the phone too: no reads.
// - One Firestore write per finished paper: a `questAttempts` doc with activity "paper" (existing rules: own doc, create only).

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection, addDoc, serverTimestamp } from "@react-native-firebase/firestore";
import { getApp } from "@react-native-firebase/app";
import Constants from "expo-constants";
import functions from "@react-native-firebase/functions";
import { authInstance } from "../config/firebaseConfig";
import { addPaperMistakes } from "./englishQuestApi";

const db = getFirestore(getApp());
const who = () => authInstance.currentUser?.uid || "guest";
const sessionKey = (paperId) => `paper:${who()}:${paperId}:v1`;
const historyKey = () => `paperHistory:${who()}:v1`;

async function readJson(key) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const loadPaperSession = (paperId) => readJson(sessionKey(paperId));

export async function savePaperSession(state) {
  try {
    if (state.phase === "paper" || state.phase === "check") await AsyncStorage.setItem(sessionKey(state.paperId), JSON.stringify(state));
    else await AsyncStorage.removeItem(sessionKey(state.paperId));
  } catch {
    // Not saved on the phone: the paper still works, it just won't resume after a restart.
  }
}

/** Past results, newest first: [{ paperId, score, max, usedMs, at }]. */
export async function loadPaperHistory() {
  const list = await readJson(historyKey());
  return Array.isArray(list) ? list : [];
}

async function addHistory(entry) {
  try {
    const list = await loadPaperHistory();
    await AsyncStorage.setItem(historyKey(), JSON.stringify([entry, ...list].slice(0, 30)));
  } catch {
    // ignore: only used for "Last time"
  }
}

/**
 * Saves a finished paper: phone history, one questAttempts doc, wrong answers into "My mistakes" (one write per quest),
 * and asks the server for stars (recordQuizResult, kind "paper"; DR-15). Never throws.
 * @returns {Promise<{ stars: number }>} stars awarded (0 until DR-15 is deployed, or within 7 days of the last reward)
 */
export async function savePaperResult(paper, outcome, { startedAt, submittedAt, wrongsByQuest = {} } = {}) {
  await addHistory({ paperId: paper.id, score: outcome.score, max: outcome.max, usedMs: outcome.usedMs, at: submittedAt || Date.now() });
  const user = authInstance.currentUser;
  if (!user) return { stars: 0 };
  await Promise.all(Object.entries(wrongsByQuest).map(([questId, wrongs]) => addPaperMistakes(questId, wrongs, paper.id)));
  let stars = 0;
  try {
    const res = await functions().httpsCallable("recordQuizResult")({
      quizId: paper.id,
      kind: "paper",
      mode: "exam",
      scoreAchieved: outcome.score,
      maxScore: outcome.max,
      passingScore: 0,
      answeredCount: outcome.rows.filter((r) => r.chosen != null).length,
      totalQuestions: outcome.rows.length,
    });
    stars = res?.data?.starsAwarded || 0;
  } catch (e) {
    console.warn("paper stars failed:", e?.message || e);
  }
  try {
    const answered = outcome.rows.filter((r) => r.chosen != null).length;
    const correctCount = outcome.rows.filter((r) => r.correct).length;
    await addDoc(collection(db, "questAttempts"), {
      userId: user.uid,
      userName: user.displayName || null,
      questId: "practice-papers",
      nodeId: paper.id,
      quizId: paper.id,
      mode: "paper",
      activity: "paper",
      outcome: outcome.timedOut ? "timeUp" : "finished",
      totalQuestions: outcome.rows.length,
      answeredCount: answered,
      correctCount,
      percent: outcome.max ? Math.round((outcome.score / outcome.max) * 100) : 0,
      passed: false, // papers have no pass mark
      startedAtMs: startedAt || null,
      durationMs: outcome.usedMs,
      answers: outcome.rows.map((r) => Object.fromEntries(Object.entries(r).filter(([, v]) => v !== undefined))),
      details: {
        score: outcome.score,
        max: outcome.max,
        parts: outcome.parts.map(({ id, right, wrong, blank, score, max }) => ({ id, right, wrong, blank, score, max })),
        practise: outcome.practise.map(({ quest, node, wrong }) => ({ quest, node, wrong })),
      },
      appVersion: Constants.expoConfig?.version || null,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("savePaperResult failed:", error);
  }
  return { stars };
}

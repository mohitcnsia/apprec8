// services/reportApi.js
// 🚩 "Report a problem" (Spec B). Writes straight to the existing `userFeedback` collection
// (rules already allow signed-in users to create their own), so it works offline:
// Firestore keeps the write on the phone and sends it when the connection is back.
// The server trigger `onQuestionReported` does the counting and auto-marking.

import { getFirestore, collection, addDoc, serverTimestamp } from "@react-native-firebase/firestore";
import { getApp } from "@react-native-firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { authInstance } from "../config/firebaseConfig";

const db = getFirestore(getApp());

export const REPORT_REASONS = [
  { id: "wrong_answer", label: "Wrong answer" },
  { id: "spelling", label: "Spelling / grammar" },
  { id: "confusing", label: "Confusing" },
  { id: "media_broken", label: "Image or audio broken" },
  { id: "other", label: "Other" },
];

const reportedKey = (questionId) => `reported_${questionId}`;

/** Has this kid already reported this question on this phone? */
export async function hasReported(questionId) {
  try {
    return (await AsyncStorage.getItem(reportedKey(questionId))) === "1";
  } catch {
    return false;
  }
}

/**
 * Sends a report. Never throws and never waits for the server (offline-safe).
 * @param {object} r
 * @param {string} r.questionId
 * @param {string} r.questionText
 * @param {string|null} r.quizId
 * @param {Array<{content: string, isCorrect: boolean}>} r.options
 * @param {string|null} r.chosen - the kid's answer (null if not answered yet)
 * @param {string} r.reason - one of REPORT_REASONS ids
 * @param {string} [r.note] - optional, max 300 chars
 * @param {object} [r.questContext] - { questId, nodeId } when inside a quest
 * @param {string} [r.mode] - "training" | "exam" | "reading"
 */
export function submitQuestionReport(r) {
  const user = authInstance.currentUser;
  if (!user) return false;
  const note = (r.note || "").trim().slice(0, 300);
  const options = (r.options || []).map((o) => String(o.content));
  const correctAnswer = (r.options || []).find((o) => o.isCorrect)?.content ?? null;

  addDoc(collection(db, "userFeedback"), {
    // Same shape as submitFeedback, so existing tooling keeps working.
    userId: user.uid,
    userName: user.displayName || null,
    contentContext: {
      type: "quest_question",
      id: r.questionId,
      parentId: r.quizId || null,
      titlePreview: (r.questionText || "").slice(0, 300),
    },
    entryPoint: "report_flag",
    reaction: null,
    feedbackType: "issue_report",
    issueCategory: r.reason,
    feedbackText: note,
    clientTimestamp: new Date().toISOString(),
    createdAt: serverTimestamp(),
    status: "new",
    // Details that make the fix easy
    questId: r.questContext?.questId || null,
    nodeId: r.questContext?.nodeId || null,
    options,
    correctAnswer,
    chosen: r.chosen ?? null,
    mode: r.mode || null,
    appVersion: Constants.expoConfig?.version || null,
  }).catch((e) => console.error("submitQuestionReport failed:", e));

  AsyncStorage.setItem(reportedKey(r.questionId), "1").catch(() => {});
  return true;
}

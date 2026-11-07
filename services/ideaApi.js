// services/ideaApi.js
// Client API for submitting children's ideas to userFeedback (G66).
// Offline-safe via Firestore queue; handles stars and 7-day frequency tracking.

import { getFirestore, collection, addDoc, doc, updateDoc, increment, serverTimestamp } from "@react-native-firebase/firestore";
import { getApp } from "@react-native-firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { authInstance } from "../config/firebaseConfig";
import { buildIdeaPayload, shouldShowWeeklyPrompt, pickWeeklyPrompt, SEVEN_DAYS_MS } from "../utils/feedbackPipeline";

const db = getFirestore(getApp());
const LAST_PROMPT_KEY = "last_idea_prompt_at";

export async function getLastIdeaPromptTime() {
  try {
    const val = await AsyncStorage.getItem(LAST_PROMPT_KEY);
    return val ? Number(val) : 0;
  } catch {
    return 0;
  }
}

export async function dismissIdeaPrompt() {
  try {
    await AsyncStorage.setItem(LAST_PROMPT_KEY, String(Date.now()));
  } catch {
    // ignore
  }
}

/**
 * Submits an idea from a child. Offline-safe, awards +5 ⭐.
 * @param {object} p
 * @param {string} [p.promptId]
 * @param {string} p.promptQuestion
 * @param {string} [p.choiceId]
 * @param {string} p.selectedChoice
 * @param {string} [p.choiceEmoji]
 * @param {string} [p.note] - typed text from supervised account
 * @param {string} [p.entryPoint] - "me_idea" | "home_idea_prompt"
 * @param {number|null} [p.userGrade]
 */
export async function submitChildIdea({
  promptId = null,
  promptQuestion,
  choiceId = null,
  selectedChoice,
  choiceEmoji = "💡",
  note = "",
  entryPoint = "me_idea",
  userGrade = null,
}) {
  const user = authInstance.currentUser;
  if (!user) return false;

  const payload = buildIdeaPayload({
    userId: user.uid,
    userName: user.displayName || null,
    userGrade,
    promptId,
    promptQuestion,
    choiceId,
    selectedChoice,
    choiceEmoji,
    note,
    entryPoint,
    appVersion: Constants.expoConfig?.version || null,
  });

  try {
    addDoc(collection(db, "userFeedback"), {
      ...payload,
      createdAt: serverTimestamp(),
    }).catch((e) => console.error("submitChildIdea write failed:", e));

    // Award +5 ⭐ to the child's stats (matching Chamak asks poll reward)
    updateDoc(doc(db, "users", user.uid), {
      "stats.totalStars": increment(5),
    }).catch(() => {});

    await AsyncStorage.setItem(LAST_PROMPT_KEY, String(Date.now()));
    return true;
  } catch (e) {
    console.error("submitChildIdea error:", e);
    return false;
  }
}

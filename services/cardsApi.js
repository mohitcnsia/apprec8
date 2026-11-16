// services/cardsApi.js: cards and team tasks (owner-approved mockup, 16 Nov 2026). Server: functions/callable/cardActions.js.
// Home reads one small list: your newest 10 cards (no index needed), shows the open ones.
import functions from "@react-native-firebase/functions";
import { getFirestore, collection, doc, onSnapshot, orderBy, limit, query, updateDoc, addDoc, serverTimestamp } from "@react-native-firebase/firestore";
import Constants from "expo-constants";
import { getApp } from "@react-native-firebase/app";
import { authInstance } from "../config/firebaseConfig";

const db = getFirestore(getApp());
const call = (name, data) => functions().httpsCallable(name)(data).then((r) => r.data);

/** Your open cards (new or opened), newest first. Returns unsubscribe. */
export function listenMyCards(onData) {
  const uid = authInstance.currentUser?.uid;
  if (!uid) {
    onData([]);
    return () => {};
  }
  return onSnapshot(
    query(collection(db, "users", uid, "cards"), orderBy("createdAt", "desc"), limit(10)),
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((c) => c.status === "new" || c.status === "opened")),
    () => onData([])
  );
}

/** "opened" | "closed" | "done" (rules: only these, only on your own cards). */
export function setCardStatus(cardId, status) {
  const uid = authInstance.currentUser?.uid;
  if (!uid || !cardId) return Promise.resolve();
  return updateDoc(doc(db, "users", uid, "cards", cardId), { status, statusAt: Date.now() }).catch(() => {});
}

export const sendCard = (card, audience) => call("sendCard", { card, audience });
export const sentCards = () => call("myCards", {}).then((r) => r.cards || []);

/**
 * A card's questions, answered (owner 16 Nov: "a few stars win"). Saved like a quiz attempt, so the server pays one star
 * per NEW question right under the same fair rules (functions/utils/starRules.js: replays pay nothing).
 * answers: [{ index, isCorrect }]
 */
export function recordCardAnswers(card, answers) {
  const uid = authInstance.currentUser?.uid;
  if (!uid || !card?.cardId || !answers.length) return Promise.resolve();
  const correctCount = answers.filter((a) => a.isCorrect).length;
  return addDoc(collection(db, "questAttempts"), {
    userId: uid,
    questId: "cards",
    nodeId: card.cardId,
    quizId: card.cardId,
    mode: "card",
    outcome: "finished",
    totalQuestions: answers.length,
    answeredCount: answers.length,
    correctCount,
    percent: Math.round((correctCount / answers.length) * 100),
    passed: true,
    answers: answers.map((a) => ({ questionId: `card-${card.cardId}-${a.index}`, isCorrect: !!a.isCorrect })),
    appVersion: Constants.expoConfig?.version || null,
    createdAt: serverTimestamp(),
  }).catch(() => {});
}

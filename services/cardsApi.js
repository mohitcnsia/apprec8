// services/cardsApi.js: cards and team tasks (owner-approved mockup, 16 Nov 2026). Server: functions/callable/cardActions.js.
// Home reads one small list: your newest 10 cards (no index needed), shows the open ones.
import functions from "@react-native-firebase/functions";
import { getFirestore, collection, doc, onSnapshot, orderBy, limit, query, updateDoc } from "@react-native-firebase/firestore";
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

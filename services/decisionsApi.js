// services/decisionsApi.js: the owner's Decisions inbox (utils/decisions.js). Owner only (rules: isAdmin).
// Reads: one listener on ownerDecisions (≤ 50 docs), only while the owner has Me or Decisions open.
import firestore from "@react-native-firebase/firestore";
import { db } from "../config/firebaseConfig";
import { answerPatch } from "../utils/decisions";
import { ownerPhoneToken } from "./push";

/** Calls back with all decisions (or [] when rules aren't deployed yet / offline). Returns unsubscribe. */
export function listenDecisions(cb) {
  return db
    .collection("ownerDecisions")
    .limit(50)
    .onSnapshot(
      (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })), null),
      (e) => cb([], e?.code || "error")
    );
}

export const answerDecision = (id, answer, note) => db.collection("ownerDecisions").doc(id).update(answerPatch(answer, note));

/** Saves this phone for Decisions notifications. → { ok, reason? } */
export async function notifyThisPhone() {
  const r = await ownerPhoneToken();
  if (!r.ok) return r;
  await db
    .collection("ownerConfig")
    .doc("device")
    .set({ tokens: firestore.FieldValue.arrayUnion(r.token), updatedAt: Date.now() }, { merge: true });
  return { ok: true };
}

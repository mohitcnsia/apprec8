// services/progressCache.js: other people's progress docs (a parent's children, a teacher's class), kept for 10 minutes
// so switching Progress tabs is instant and costs no reads (owner, 2026-11-10, option A). Pull down = fresh read.
// Keyed by the viewer too, so a different account on the same phone never sees another viewer's cached data.
import { getFirestore, doc, getDoc } from "@react-native-firebase/firestore";
import { authInstance } from "../config/firebaseConfig";
import { makeTtlCache } from "../utils/ttlCache";

const db = getFirestore();
const cache = makeTtlCache();
const viewer = () => authInstance.currentUser?.uid || "guest";
const key = (uid, questId) => `${viewer()}|${uid}|${questId}`;

/** Cached progress doc data (or null if none), possibly old; undefined = never loaded. */
export const peekProgress = (uid, questId) => cache.peek(key(uid, questId));

/** Progress doc data or null; read from the server only if not loaded in the last 10 minutes (or force). */
export function loadProgress(uid, questId, { force = false } = {}) {
  return cache.get(
    key(uid, questId),
    async () => {
      const snap = await getDoc(doc(db, "users", uid, "questProgress", questId));
      return snap.exists() ? snap.data() : null;
    },
    { force }
  );
}

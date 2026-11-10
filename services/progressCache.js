// services/progressCache.js: other people's progress docs (a parent's children, a teacher's class).
// Owner, 2026-11-10 (card "progress-refresh-rules"): read fresh at most twice a day, after 7:30 am and 7:30 pm. Until the
// next slot, the copy Firestore already keeps on this phone is used (no server read), even after the app restarts.
// The screens show "Updated 8:05 pm". Pull down = fresh read, while Remote Config `progress_pull_refresh` is on (pilot: on
// for everyone; later it may become premium). Keyed by the viewer, so another account on this phone never sees it.
import AsyncStorage from "@react-native-async-storage/async-storage";
import remoteConfig from "@react-native-firebase/remote-config";
import { getFirestore, doc, getDocFromCache, getDocFromServer } from "@react-native-firebase/firestore";
import { authInstance } from "../config/firebaseConfig";
import { isFreshBySlot } from "../utils/refreshSlots";

const db = getFirestore();
const STORE_KEY = "progressFetchedAt.v1";
const memory = new Map(); // key → { data, at }
const inflight = new Map(); // key → Promise
let fetchedAt = null; // key → ms, loaded once from AsyncStorage
const viewer = () => authInstance.currentUser?.uid || "guest";
const key = (uid, questId) => `${viewer()}|${uid}|${questId}`;

async function loadTimes() {
  if (fetchedAt) return fetchedAt;
  try {
    fetchedAt = JSON.parse((await AsyncStorage.getItem(STORE_KEY)) || "{}") || {};
  } catch {
    fetchedAt = {};
  }
  return fetchedAt;
}

let saveTimer = null;
function saveTimes() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    // keep the file small: drop entries older than 3 days
    const cutoff = Date.now() - 3 * 24 * 3600 * 1000;
    Object.keys(fetchedAt).forEach((k) => fetchedAt[k] < cutoff && delete fetchedAt[k]);
    AsyncStorage.setItem(STORE_KEY, JSON.stringify(fetchedAt)).catch(() => {});
  }, 500);
}

/** Pull-down refresh allowed? (Remote Config switch; on unless set to false.) */
export function pullRefreshAllowed() {
  try {
    const v = remoteConfig().getValue("progress_pull_refresh");
    return v.getSource() === "static" ? true : v.asBoolean();
  } catch {
    return true;
  }
}

/** Cached progress doc data (or null if none) from this session; undefined = not loaded yet. */
export const peekProgress = (uid, questId) => memory.get(key(uid, questId))?.data;

/** When this doc was last read from the server (ms), or undefined. */
export const progressReadAt = (uid, questId) => memory.get(key(uid, questId))?.at ?? fetchedAt?.[key(uid, questId)];

/** Progress doc data or null. Server read only after a 7:30 slot passed since the last read, or on pull-down. */
export function loadProgress(uid, questId, { force = false } = {}) {
  const k = key(uid, questId);
  if (inflight.has(k)) return inflight.get(k);
  const p = (async () => {
    try {
      const times = await loadTimes();
      const wantFresh = force && pullRefreshAllowed();
      const at = times[k];
      if (!wantFresh && isFreshBySlot(at)) {
        const hit = memory.get(k);
        if (hit) return hit.data;
        try {
          const snap = await getDocFromCache(doc(db, "users", uid, "questProgress", questId));
          const data = snap.exists() ? snap.data() : null;
          memory.set(k, { data, at });
          return data;
        } catch {
          // not on this phone (cache cleared): read from the server below
        }
      }
      let snap;
      try {
        snap = await getDocFromServer(doc(db, "users", uid, "questProgress", questId));
      } catch (e) {
        // offline: show the last copy on this phone (with its old "Updated" time) rather than nothing
        const cached = await getDocFromCache(doc(db, "users", uid, "questProgress", questId)).catch(() => null);
        if (!cached) throw e;
        const data = cached.exists() ? cached.data() : null;
        memory.set(k, { data, at });
        return data;
      }
      const data = snap.exists() ? snap.data() : null;
      const now = Date.now();
      memory.set(k, { data, at: now });
      times[k] = now;
      saveTimes();
      return data;
    } finally {
      inflight.delete(k);
    }
  })();
  inflight.set(k, p);
  return p;
}

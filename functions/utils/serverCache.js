// functions/utils/serverCache.js
// Cost guard (owner, 2026-11-05): leaderboards are computed at most once per 10 minutes and the result is kept in a
// server-only Firestore doc (no client rule matches it). Most calls then cost 1 read instead of one per kid.

const LEADERBOARD_CACHE_MS = 10 * 60 * 1000;

/** Pure: is a saved entry { at, key, value } still usable? `key` lets a change (e.g. a new week) force a recompute. */
function isFreshCache(entry, { now, maxAgeMs, key = null }) {
  if (!entry || typeof entry.at !== "number" || entry.value === undefined) return false;
  if ((entry.key ?? null) !== key) return false;
  const age = now - entry.at;
  return age >= 0 && age < maxAgeMs;
}

/** Keeps the top-N size sane whatever the app sends (an unbounded topN could read every user). */
function clampTopN(n, { fallback = 10, max = 50 } = {}) {
  const v = Math.floor(Number(n));
  if (!Number.isFinite(v) || v < 1) return fallback;
  return Math.min(v, max);
}

/** Firestore wrapper: fresh cache → its value; otherwise compute, save, return. A failed save never fails the call. */
async function cachedResult(ref, { maxAgeMs = LEADERBOARD_CACHE_MS, key = null, now = Date.now() }, compute) {
  const snap = await ref.get();
  const entry = snap.exists ? snap.data() : null;
  if (isFreshCache(entry, { now, maxAgeMs, key })) return entry.value;
  const value = await compute();
  await ref.set({ at: now, key, value }).catch((e) => console.warn("serverCache: could not save", ref.path, e?.message));
  return value;
}

module.exports = { LEADERBOARD_CACHE_MS, isFreshCache, clampTopN, cachedResult };

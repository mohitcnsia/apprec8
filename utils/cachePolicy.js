// utils/cachePolicy.js
// Pure cache rules for English Quest content (Spec v2 Step 3). No React / Firebase / storage here.
//
// A cached entry: { version, savedAt, data }
// It's fresh when it was saved for the quest's current contentVersion AND is younger than maxAge.
// maxAge is a safety net: old IEO questions can be edited in the Firebase console without the
// version changing, so they still refresh within a week.

export const DEFAULT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function isFresh(entry, version, { now = Date.now(), maxAgeMs = DEFAULT_MAX_AGE_MS } = {}) {
  if (!entry || entry.data === undefined || entry.data === null) return false;
  if (version === undefined || version === null) return false; // unknown version: never trust the cache
  if (entry.version !== version) return false;
  if (typeof entry.savedAt !== "number" || now - entry.savedAt > maxAgeMs) return false;
  return true;
}

export const makeEntry = (version, data, now = Date.now()) => ({ version, savedAt: now, data });

/** Storage keys (one per quest / quiz / study page). */
export const cacheKeys = {
  nodes: (questId) => `eqc:nodes:${questId}`,
  quiz: (quizId) => `eqc:quiz:${quizId}`,
  study: (contentId) => `eqc:study:${contentId}`,
};

/** Content ids (quizzes + study/reading pages) used by the nodes of one unit, for prefetching. */
export function contentIdsForUnit(nodes = [], unitId) {
  const quizIds = new Set();
  const studyIds = new Set();
  nodes
    .filter((n) => n.unitId === unitId)
    .forEach((n) => {
      (n.steps || []).forEach((s) => {
        if (s.type === "quiz" && s.quizId) quizIds.add(s.quizId);
        if ((s.type === "study" || s.type === "reading") && s.contentId) studyIds.add(s.contentId);
      });
      if ((n.kind === "gate" || n.kind === "boss") && n.quizId) quizIds.add(n.quizId);
    });
  return { quizIds: [...quizIds], studyIds: [...studyIds] };
}

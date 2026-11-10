// utils/kidStats.js
// Per-kid summary for the admin dashboard (CODE_REVIEW: "Admin dashboard v0"). Pure, testable.
// Stored in users/{uid}/questProgress/{questId}.stats and updated with every attempt save.

export const DAYS_KEPT = 14;
export const WEAK_MIN_ANSWERS = 3;
export const WEAK_BELOW = 0.6;
export const QUICK_MS = 3000; // G101: an answer faster than this is a "quick tap"

/** Topic key from a map title, e.g. "Kinds of sentences" → "kinds-of-sentences" (Finding 20). */
export const topicSlug = (title) =>
  String(title || "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Local date key YYYY-MM-DD (the kid's own day). */
export const dayKey = (ms) => {
  const d = new Date(ms);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

/**
 * New stats after one attempt.
 * @param {object} prev - previous stats (or undefined)
 * @param {Array} answers - [{ isCorrect, subtopic }]
 * @param {object} ctx - { now, durationMs, questId, userName, topicFallback }
 *   topicFallback: topic for answers without a sub-topic tag (e.g. Unit 0 questions, Finding 20)
 */
export function updateStats(
  prev = {},
  answers = [],
  { now = Date.now(), durationMs = 0, questId = null, userName = null, topicFallback = null } = {}
) {
  const answered = answers.length;
  const correct = answers.filter((a) => a.isCorrect).length;
  // Cap one attempt's time at 30 min, so an app left open doesn't inflate "time spent".
  const timeMs = Math.max(0, Math.min(Number(durationMs) || 0, 30 * 60 * 1000));

  const bySubtopic = { ...(prev.bySubtopic || {}) };
  answers.forEach((a) => {
    const key = a.subtopic || topicFallback;
    if (!key) return;
    const s = bySubtopic[key] || { correct: 0, total: 0 };
    bySubtopic[key] = { correct: s.correct + (a.isCorrect ? 1 : 0), total: s.total + 1 };
  });

  // G101: quick taps (under QUICK_MS) vs answers given a few seconds, so the child can see what slowing down does.
  const speed = { quick: { ...(prev.speed?.quick || { answered: 0, correct: 0 }) }, slow: { ...(prev.speed?.slow || { answered: 0, correct: 0 }) } };
  answers.forEach((a) => {
    if (!Number.isFinite(a.timeMs) || a.timeMs <= 0) return;
    const b = a.timeMs < QUICK_MS ? speed.quick : speed.slow;
    b.answered += 1;
    if (a.isCorrect) b.correct += 1;
  });

  const today = dayKey(now);
  const daily = { ...(prev.daily || {}) };
  const d = daily[today] || { answered: 0, correct: 0, timeMs: 0 };
  daily[today] = { answered: d.answered + answered, correct: d.correct + correct, timeMs: d.timeMs + timeMs };
  // keep only the last DAYS_KEPT days
  const cutoff = dayKey(now - (DAYS_KEPT - 1) * 24 * 60 * 60 * 1000);
  Object.keys(daily).forEach((k) => k < cutoff && delete daily[k]);

  return {
    questId: questId ?? prev.questId ?? null,
    userName: userName ?? prev.userName ?? null,
    lastActiveAt: now,
    totalTimeMs: (prev.totalTimeMs || 0) + timeMs,
    attempts: (prev.attempts || 0) + 1,
    answered: (prev.answered || 0) + answered,
    correct: (prev.correct || 0) + correct,
    bySubtopic,
    daily,
    speed,
  };
}

/** Totals for a range: "today" | "week" (last 7 days) | "all". */
export function summarize(stats = {}, range = "all", now = Date.now()) {
  if (range === "all") {
    return { answered: stats.answered || 0, correct: stats.correct || 0, timeMs: stats.totalTimeMs || 0 };
  }
  const days = range === "today" ? 1 : 7;
  const from = dayKey(now - (days - 1) * 24 * 60 * 60 * 1000);
  const out = { answered: 0, correct: 0, timeMs: 0 };
  Object.entries(stats.daily || {}).forEach(([k, v]) => {
    if (k >= from && k <= dayKey(now)) {
      out.answered += v.answered || 0;
      out.correct += v.correct || 0;
      out.timeMs += v.timeMs || 0;
    }
  });
  return out;
}

export const accuracy = ({ answered, correct }) => (answered > 0 ? Math.round((correct / answered) * 100) : null);

/** Weak sub-topics: at least WEAK_MIN_ANSWERS answers and below WEAK_BELOW accuracy, weakest first. */
export function weakTopics(stats = {}) {
  return Object.entries(stats.bySubtopic || {})
    .filter(([, v]) => v.total >= WEAK_MIN_ANSWERS && v.correct / v.total < WEAK_BELOW)
    .map(([subtopic, v]) => ({ subtopic, ...v, percent: Math.round((v.correct / v.total) * 100) }))
    .sort((a, b) => a.percent - b.percent);
}

/** Was the kid active in this range? */
export function activeIn(stats = {}, range = "all", now = Date.now()) {
  if (!stats.lastActiveAt) return false;
  if (range === "all") return true;
  return summarize(stats, range, now).answered > 0;
}

/** "5 min ago", "2 h ago", "yesterday", "3 days ago". */
export function timeAgo(ms, now = Date.now()) {
  if (!ms) return "never";
  const min = Math.floor((now - ms) / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} h ago`;
  const days = Math.floor(h / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}

/** "1 h 35 m" / "12 min". */
export function formatDuration(ms = 0) {
  const min = Math.round(ms / 60000);
  if (min < 60) return `${min} min`;
  return `${Math.floor(min / 60)} h ${min % 60} m`;
}

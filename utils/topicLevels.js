// utils/topicLevels.js: one learning measure per topic, per kid, shared by every screen ("Simpler Home, Progress and
// Me" doc: New → Practising → Learned → Still remembers, or Slipping). Rule-based and explainable; pure and tested.
// Saved inside the stats the app already writes after each quiz (questProgress.stats.levels): no extra writes.
//
// Learned = about 80% right on the kid's last 8+ answers to questions they hadn't seen before, on 2+ different days,
//           with at least one right answer in a Challenge, a Boss or a medium/hard step.
// Still remembers / Slipping = at least 6 days after Learned, the next answers on that topic (3+) are ≥80% / <60% right.
// Topics practised before levels existed start as Practising (their old answers didn't record which were new).

export const LEARNED_MIN = 8; // new-question answers looked at
export const LEARNED_SHARE = 0.8;
export const RECHECK_AFTER_DAYS = 6;
export const RECHECK_MIN = 3;
export const SLIP_BELOW = 0.6;
const SEEN_KEPT = 40; // remembered question keys per topic (small, so the progress doc stays small)
const DAY = 864e5;

/** Short stable key for a question (quiz + question id), so "seen before" costs a few bytes. */
export function questionKey(quizId, questionId) {
  const s = `${quizId || ""}|${questionId ?? ""}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0).toString(36);
}

/** Does this attempt count as "medium or hard"? */
export const isHardAttempt = ({ activity = null, difficulty = null } = {}) =>
  activity === "gate" || activity === "boss" || difficulty === "medium" || difficulty === "hard";

/**
 * New levels after one attempt.
 * @param {object} prev - stats.levels before ({ [topic]: entry })
 * @param {Array} answers - [{ isCorrect, subtopic, questionId }]
 * @param {object} ctx - { now, quizId, activity, difficulty, topicFallback, dayKey }
 */
export function updateLevels(prev = {}, answers = [], { now = Date.now(), quizId = null, activity = null, difficulty = null, topicFallback = null, dayKey } = {}) {
  const levels = { ...(prev || {}) };
  const hard = isHardAttempt({ activity, difficulty });
  const today = dayKey ? dayKey(now) : new Date(now).toISOString().slice(0, 10);
  const touched = new Set();
  answers.forEach((a) => {
    const topic = a.subtopic || topicFallback;
    if (!topic) return;
    const e = levels[topic]
      ? { ...levels[topic], seen: [...(levels[topic].seen || [])], recent: [...(levels[topic].recent || [])], days: [...(levels[topic].days || [])], recheck: [...(levels[topic].recheck || [])] }
      : { seen: [], recent: [], days: [], hardOk: false, learnedAt: null, recheck: [] };
    const k = questionKey(quizId, a.questionId);
    const fresh = a.questionId != null && !e.seen.includes(k);
    const right = a.isCorrect ? 1 : 0;
    if (fresh) {
      e.seen = [...e.seen, k].slice(-SEEN_KEPT);
      e.recent = [...e.recent, right].slice(-LEARNED_MIN);
      if (!e.days.includes(today)) e.days = [...e.days, today].slice(-5);
    }
    if (hard && right) e.hardOk = true;
    if (e.learnedAt && now - e.learnedAt >= RECHECK_AFTER_DAYS * DAY) e.recheck = [...e.recheck, right].slice(-5);
    levels[topic] = e;
    touched.add(topic);
  });
  // Judged once per attempt, after all its answers (not halfway through a quiz the kid then gets wrong).
  touched.forEach((topic) => {
    const e = levels[topic];
    if (e.learnedAt) return;
    const n = e.recent.length;
    const share = n ? e.recent.reduce((x, y) => x + y, 0) / n : 0;
    if (n >= LEARNED_MIN && share >= LEARNED_SHARE && e.days.length >= 2 && e.hardOk) e.learnedAt = now;
  });
  return levels;
}

/** "new" | "practising" | "learned" | "remembers" | "slipping" for one topic. `answered` = any answers before levels. */
export function levelOf(entry, { answered = 0 } = {}) {
  if (!entry) return answered > 0 ? "practising" : "new";
  if (!entry.learnedAt) return entry.seen?.length || answered > 0 ? "practising" : "new";
  const r = entry.recheck || [];
  if (r.length >= RECHECK_MIN) {
    const share = r.reduce((x, y) => x + y, 0) / r.length;
    if (share >= LEARNED_SHARE) return "remembers";
    if (share < SLIP_BELOW) return "slipping";
  }
  return "learned";
}

export const LEVEL_LABEL = { new: "New", practising: "Practising", learned: "Learned", remembers: "Still remembers", slipping: "Slipping" };

/** One letter per topic for the class summary (keeps it ~0.5 KB per kid). */
export const LEVEL_CODE = { new: "n", practising: "p", learned: "l", remembers: "r", slipping: "s" };

/** Levels of every topic a kid touched, from stats ({ bySubtopic, levels }). → { [topic]: level } */
export function levelsFromStats(stats = {}) {
  const out = {};
  const topics = new Set([...Object.keys(stats.bySubtopic || {}), ...Object.keys(stats.levels || {})]);
  topics.forEach((t) => {
    out[t] = levelOf(stats.levels?.[t], { answered: stats.bySubtopic?.[t]?.total || 0 });
  });
  return out;
}

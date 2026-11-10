// utils/todayPractice.js: G101 "Today's practice" card on a child's Home (owner approved the mockup, 2026-11-10).
// Pure: the next unfinished paper, yesterday's Accuracy, papers done, and one tip from the child's own answer speed.
import { dayKey } from "./kidStats.js";

export const TIP_MIN_QUICK = 10; // enough quick taps to say something true
export const TIP_MIN_SLOW = 20;

/** Merges the `speed` counters of several quest stats docs. */
export function mergeSpeed(list = []) {
  const out = { quick: { answered: 0, correct: 0 }, slow: { answered: 0, correct: 0 } };
  list.forEach((s) =>
    ["quick", "slow"].forEach((k) => {
      out[k].answered += s?.[k]?.answered || 0;
      out[k].correct += s?.[k]?.correct || 0;
    })
  );
  return out;
}

const pct = (b) => Math.round((100 * b.correct) / b.answered);

/** Both numbers side by side (owner, 10 Nov), only when there are enough answers of each kind. */
export function speedTip(speed) {
  const q = speed?.quick, s = speed?.slow;
  if (!q || !s || q.answered < TIP_MIN_QUICK || s.answered < TIP_MIN_SLOW) return null;
  if (pct(s) - pct(q) < 10) return null; // no real gap: say nothing rather than something weak
  return `Quick taps (under 3 seconds): ${pct(q)}% right. Taking a few seconds: ${pct(s)}% right. Read every option before you tap.`;
}

/** Yesterday's Accuracy from merged daily counts ({ "YYYY-MM-DD": { answered, correct } }), or null. */
export function yesterdayAccuracy(daily = {}, now = Date.now()) {
  const d = daily[dayKey(now - 24 * 60 * 60 * 1000)];
  return d && d.answered > 0 ? Math.round((100 * d.correct) / d.answered) : null;
}

/**
 * @param {object} p
 * @param {Array} p.papers - fixed papers this child may sit, in order (English first)
 * @param {Array} p.history - finished papers on this phone [{ paperId }]
 * @returns {null | { paper, done, total, yesterday, tip }}  null = nothing to show (no papers, or all done)
 */
export function todayPractice({ papers = [], history = [], daily = {}, speed = null, now = Date.now() } = {}) {
  if (!papers.length) return null;
  const finished = new Set(history.map((h) => h.paperId));
  const done = papers.filter((p) => finished.has(p.id)).length;
  const paper = papers.find((p) => !finished.has(p.id));
  if (!paper) return null;
  return { paper, done, total: papers.length, yesterday: yesterdayAccuracy(daily, now), tip: speedTip(speed) };
}

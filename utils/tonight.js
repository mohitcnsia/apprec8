// utils/tonight.js: the parent's card on Home, "tonight" with each child (redesign doc, owner + Seema 2026-11-11).
// Practised today or not; 5 questions to ask, one at a time, each with its answer and Right / Needs help taps; then a
// praise prompt ("Tell her one thing she did well") with a ready line and an "I praised her" tap. No "did you scold?"
// question (owner agreed: few parents would answer it, and it feels like an accusation). Pure, so it is tested.
import { dayKey } from "./kidStats.js";

/** Did the child practise today (any quest)? quests = [{ stats }] */
export const practisedToday = (quests = [], now = Date.now()) => quests.some((q) => (q.stats?.daily?.[dayKey(now)]?.answered || 0) > 0);

/** Days practised in the last 7 (any quest). */
export function daysThisWeek(quests = [], now = Date.now()) {
  let n = 0;
  for (let i = 0; i < 7; i++) {
    const k = dayKey(now - i * 864e5);
    if (quests.some((q) => (q.stats?.daily?.[k]?.answered || 0) > 0)) n += 1;
  }
  return n;
}

/**
 * The ready praise line, matched to how tonight went (owner, 2026-11-11: never the same words for 0 right as for 5).
 * Praises effort when answers were hard; names the strong topic only if the child got it right tonight.
 * @param {object} t - { right, total, strongTopic, strongRight }
 */
export function praiseLine(name, { right = 0, total = 0, strongTopic = null, strongRight = false } = {}) {
  const topic = strongTopic && strongRight ? ` You really know ${strongTopic}.` : "";
  if (!total) return `"I'm proud of you for practising today. Keep going!"`;
  if (right / total >= 0.8) return `"You knew almost all of them!${topic} I'm proud of you."`;
  if (right > 0) return `"You got ${right} right, and you kept trying on the hard ones. That's how you get better."`;
  return `"These were hard, and you didn't give up. Let's practise them together tomorrow."`;
}

/** Saved taps on this phone: { [day]: { [childUid]: { answers: { [qKey]: "right"|"help" }, praised, done } } }, last 7 days. */
export function prune(saved, today) {
  const s = saved && typeof saved === "object" ? saved : {};
  const out = {};
  Object.entries(s).forEach(([d, v]) => {
    if (today - Number(d) < 7) out[d] = v;
  });
  return out;
}

export function recordAnswer(saved, today, childUid, qKey, answer) {
  const s = prune(saved, today);
  const day = { ...(s[today] || {}) };
  const c = { answers: {}, ...(day[childUid] || {}) };
  c.answers = { ...c.answers, [qKey]: answer };
  day[childUid] = c;
  s[today] = day;
  return s;
}

export function recordPraise(saved, today, childUid) {
  const s = prune(saved, today);
  const day = { ...(s[today] || {}) };
  day[childUid] = { answers: {}, ...(day[childUid] || {}), praised: true };
  s[today] = day;
  return s;
}

/** Where the parent is tonight: { step: index of the next question | "praise" | "done", right, help } */
export function tonightProgress(saved, today, childUid, questions = []) {
  const c = saved?.[today]?.[childUid] || { answers: {} };
  const answers = c.answers || {};
  const next = questions.findIndex((q) => !answers[q.key]);
  const right = questions.filter((q) => answers[q.key] === "right").length;
  const help = questions.filter((q) => answers[q.key] === "help").length;
  if (c.praised) return { step: "done", right, help };
  if (next >= 0) return { step: next, right, help };
  return { step: "praise", right, help };
}

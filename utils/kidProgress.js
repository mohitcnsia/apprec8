// utils/kidProgress.js: the kid's Progress screen (redesign doc, owner OK 2026-11-11). Pure, so it is tested.
// Kids don't need proof, they need encouragement (owner): a cheer first, then the near goal on the class board (never
// the gap), then topics as Learned / Doing well / Needs practice from the topic levels. No quest list.
import { dayKey } from "./kidStats.js";
import { levelOf } from "./topicLevels.js";

const DAY = 864e5;

function weekSum(daily = {}, now, offset = 0) {
  let answered = 0;
  let correct = 0;
  let days = 0;
  for (let i = 0; i < 7; i++) {
    const d = daily[dayKey(now - (i + offset * 7) * DAY)];
    if (d && d.answered > 0) {
      answered += d.answered;
      correct += d.correct || 0;
      days += 1;
    }
  }
  return { answered, correct, days };
}

/**
 * The cheer at the top: { headline, line }. Only good news or a next small step; a worse week is never pointed out.
 * Class 5 and below see "right" counts; older kids see accuracy (owner, 2026-11-11).
 */
export function encouragement({ daily = {}, now = Date.now(), grade = null, streak = 0 }) {
  const w = weekSum(daily, now, 0);
  const last = weekSum(daily, now, 1);
  const young = Number.isInteger(grade) && grade <= 5;
  const acc = w.answered ? Math.round((w.correct / w.answered) * 100) : null;
  const lastAcc = last.answered ? Math.round((last.correct / last.answered) * 100) : null;

  let headline;
  if (!w.answered) headline = "A new week! One quiz today starts your streak.";
  else if (w.correct > last.correct && last.answered) headline = `${w.correct - last.correct} more right than last week! 🎉`;
  else if (streak >= 2) headline = `${streak} days in a row. Keep it going! 🔥`;
  else if (w.days >= 2) headline = `You practised on ${w.days} days this week. Every day counts!`;
  else headline = "Great start this week! Come back tomorrow to build a streak.";

  let line = null;
  if (w.answered) {
    if (young) line = `${w.correct} right this week`;
    else line = acc !== null && lastAcc !== null && acc > lastAcc ? `${acc}% accuracy this week, up from ${lastAcc}%` : `${acc}% accuracy this week`;
  }
  return { headline, line };
}

/** The near goal on the class board (points = right answers this week). Never "you are behind". */
export function nearGoal(rows = [], myUid) {
  const i = rows.findIndex((r) => r.uid === myUid || r.id === myUid);
  if (i < 0 || rows.length < 2) return null;
  const me = rows[i];
  if (i === 0) return me.points > 0 ? "You're #1 in your class this week! 🏆" : null;
  const above = rows[i - 1];
  const need = Math.max(1, (above.points || 0) - (me.points || 0) + 1);
  const raw = String(above.firstName || above.name || "").trim();
  const name = raw ? raw.split(" ")[0] : "a classmate";
  return `${need} more right ${need === 1 ? "answer" : "answers"} to pass ${name} this week`;
}

/**
 * Topics in three honest lists from the levels:
 *   learned  = Learned / Still remembers (⭐)
 *   doingWell = no level yet, but 80%+ right over 5+ answers (answers from before levels existed)
 *   needs    = Slipping first, then Practising, lowest accuracy first
 * @param {Array<{ questId, stats, namer }>} quests
 */
export function topicLists(quests = []) {
  const learned = [];
  const doingWell = [];
  const needs = [];
  quests.forEach(({ questId, stats = {}, namer = (x) => x }) => {
    const topics = new Set([...Object.keys(stats.bySubtopic || {}), ...Object.keys(stats.levels || {})]);
    topics.forEach((subtopic) => {
      const acc = stats.bySubtopic?.[subtopic] || { correct: 0, total: 0 };
      const level = levelOf(stats.levels?.[subtopic], { answered: acc.total || 0 });
      const percent = acc.total ? Math.round((acc.correct / acc.total) * 100) : null;
      const t = { questId, subtopic, name: namer(subtopic), percent, total: acc.total || 0, level };
      if (level === "new") return;
      if (level === "learned" || level === "remembers") learned.push(t);
      else if (level === "slipping") needs.push(t);
      else if (acc.total >= 5 && percent >= 80) doingWell.push(t);
      else needs.push(t);
    });
  });
  needs.sort((a, b) => (a.level === "slipping" ? -1 : 0) - (b.level === "slipping" ? -1 : 0) || (a.percent ?? 0) - (b.percent ?? 0));
  learned.sort((a, b) => (b.level === "remembers") - (a.level === "remembers") || a.name.localeCompare(b.name));
  doingWell.sort((a, b) => b.percent - a.percent);
  return { learned, doingWell, needs };
}

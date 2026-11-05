// utils/weeklySummary.js
// The teacher's weekly "3 things" card (mockup V4, approved by the owner and Seema 2026-11-05). Pure, tested with the
// Demo School data (tests/weeklySummary.test.mjs). Works only from what the class screen already reads: each kid's
// questProgress docs (stats + nodes) and the class assignments. No extra reads.
//
// kids: [{ uid, firstName, quests: [{ questId, stats, nodes }] }]

import { summarize, accuracy } from "./kidStats.js";

const DAY = 24 * 60 * 60 * 1000;
export const WEAK_BELOW = 0.6;
export const MIN_ANSWERS = 3;

/** Answers + right answers in [from, to) days ago, from the 14-day daily stats. */
function windowTotals(stats = {}, fromDaysAgo, toDaysAgo, now) {
  const out = { answered: 0, correct: 0 };
  for (let d = fromDaysAgo; d < toDaysAgo; d++) {
    const dt = new Date(now - d * DAY);
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
    const v = stats.daily?.[key];
    if (v) {
      out.answered += v.answered || 0;
      out.correct += v.correct || 0;
    }
  }
  return out;
}

const lastActive = (kid) => Math.max(0, ...kid.quests.map((q) => q.stats?.lastActiveAt || 0));

/** 1 · The sub-topic most of the class finds hard (weak = below 60% with 3+ answers). */
export function reteachTopic(kids, namer = (s) => s) {
  const count = {};
  kids.forEach((k) => {
    const weakHere = new Set();
    k.quests.forEach((q) =>
      Object.entries(q.stats?.bySubtopic || {}).forEach(([sub, v]) => {
        if (v.total >= MIN_ANSWERS && v.correct / v.total < WEAK_BELOW) weakHere.add(sub);
      })
    );
    weakHere.forEach((s) => (count[s] = (count[s] || 0) + 1));
  });
  const [sub, n] = Object.entries(count).sort((a, b) => b[1] - a[1])[0] || [];
  if (!sub || n < 2) return null; // one kid is a "who needs you", not a class topic
  return { subtopic: sub, title: namer(sub), kids: n, of: kids.length };
}

/** 2 · Up to 3 kids who need the teacher, most urgent first. */
export function whoNeedsYou(kids, { now = Date.now(), gateTitle = (id) => id, max = 3 } = {}) {
  const out = [];
  kids.forEach((k) => {
    // away for a week or more (but has started): checked first, it hides everything else
    const last = lastActive(k);
    if (last && now - last >= 7 * DAY) {
      out.push({ uid: k.uid, name: k.firstName, why: `no practice for ${Math.floor((now - last) / DAY)} days`, rank: 1 });
      return;
    }
    // failed a challenge twice (or more) since last practising it
    for (const q of k.quests) {
      const stuck = Object.entries(q.nodes || {}).find(([, n]) => (n.failsSinceLastPractice || 0) >= 2 && n.status !== "completed");
      if (stuck) {
        out.push({ uid: k.uid, name: k.firstName, why: `failed the ${gateTitle(stuck[0])} ${stuck[1].failsSinceLastPractice === 2 ? "twice" : `${stuck[1].failsSinceLastPractice} times`}`, rank: 0 });
        return;
      }
    }
    // accuracy falling: this week vs the week before, 10+ answers in each, down 15+ points
    const tot = (a, b) => k.quests.reduce((s, q) => {
      const w = windowTotals(q.stats, a, b, now);
      return { answered: s.answered + w.answered, correct: s.correct + w.correct };
    }, { answered: 0, correct: 0 });
    const thisWeek = tot(0, 7);
    const before = tot(7, 14);
    if (thisWeek.answered >= 10 && before.answered >= 10) {
      const a = accuracy(thisWeek);
      const b = accuracy(before);
      if (b - a >= 15) out.push({ uid: k.uid, name: k.firstName, why: `accuracy ${b}% → ${a}% in 2 weeks`, rank: 2 });
    }
  });
  // One kid per reason first (a stuck kid, an absent kid, a falling kid), then fill: a teacher sees different problems.
  const byRank = [0, 1, 2].map((r) => out.filter((o) => o.rank === r));
  const picked = [];
  for (let round = 0; picked.length < max && byRank.some((g) => g.length > round); round++) {
    byRank.forEach((g) => g[round] && picked.length < max && picked.push(g[round]));
  }
  return picked;
}

/** 3 · The assignment due next (or the latest one): done / halfway / not started per kid. */
export function assignmentStatus(assignments = [], kids = [], now = Date.now()) {
  if (!assignments.length) return null;
  const today = new Date(now).toISOString().slice(0, 10);
  const upcoming = assignments.filter((a) => a.dueDate && a.dueDate >= today).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const a = upcoming[0] || [...assignments].sort((x, y) => String(y.dueDate || "").localeCompare(String(x.dueDate || "")))[0];
  const targets = a.kidIds?.length ? kids.filter((k) => a.kidIds.includes(k.uid)) : kids;
  let done = 0;
  let half = 0;
  targets.forEach((k) => {
    const nodes = k.quests.find((q) => q.questId === a.questId)?.nodes || {};
    const n = (a.nodeIds || []).filter((id) => nodes[id]?.status === "completed").length;
    if (n === (a.nodeIds || []).length && n > 0) done++;
    else if (n > 0 || (a.nodeIds || []).some((id) => nodes[id])) half++;
  });
  return { id: a.id, title: (a.nodeTitles || []).join(", "), dueDate: a.dueDate || null, done, half, notStarted: targets.length - done - half, total: targets.length };
}

/** 🚀 Kids ready for harder work: 85%+ this week with 30+ answers. */
export function readyForHarder(kids, now = Date.now()) {
  return kids.filter((k) => {
    const w = k.quests.reduce((s, q) => {
      const x = summarize(q.stats || {}, "week", now);
      return { answered: s.answered + x.answered, correct: s.correct + x.correct };
    }, { answered: 0, correct: 0 });
    return w.answered >= 30 && accuracy(w) >= 85;
  });
}

/** Everything for the card. */
export function teacherWeek({ kids = [], assignments = [], now = Date.now(), namer, gateTitle } = {}) {
  return {
    reteach: reteachTopic(kids, namer),
    needs: whoNeedsYou(kids, { now, gateTitle }),
    assignment: assignmentStatus(assignments, kids, now),
    ready: readyForHarder(kids, now),
    active: kids.filter((k) => now - lastActive(k) < 7 * DAY).length,
    total: kids.length,
  };
}

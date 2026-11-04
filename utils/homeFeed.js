// utils/homeFeed.js
// Pure helpers for the Home screen (owner-approved mockup "A · Home", 2026-11-04). Testable in Node.

import { dayKey } from "./kidStats.js";

const DAY_MS = 24 * 60 * 60 * 1000;

/** "Good morning" / "Good afternoon" / "Good evening" from the local hour. */
export const greeting = (now = Date.now()) => {
  const h = new Date(now).getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

/**
 * Days in a row with at least one answer, ending today (or yesterday, so the streak
 * doesn't show 0 in the morning before the kid has played).
 * @param {object} daily - { "YYYY-MM-DD": { answered } } from questProgress stats (kept 14 days)
 */
export function dayStreak(daily = {}, now = Date.now()) {
  const played = (ms) => (daily[dayKey(ms)]?.answered || 0) > 0;
  let start = now;
  if (!played(start)) start = now - DAY_MS;
  let streak = 0;
  for (let ms = start; played(ms); ms -= DAY_MS) streak += 1;
  return streak;
}

/** Whole days from today to a YYYY-MM-DD date (local). 0 = today, negative = past. */
export const daysUntil = (dateKey, now = Date.now()) => {
  const [y, m, d] = String(dateKey).split("-").map(Number);
  if (!y || !m || !d) return NaN;
  const target = new Date(y, m - 1, d).getTime();
  const t = new Date(now);
  const today = new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime();
  return Math.round((target - today) / DAY_MS);
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "Tue 17 Nov" */
export const shortDate = (dateKey) => {
  const [y, m, d] = String(dateKey).split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return `${WEEKDAYS[dt.getDay()]} ${d} ${MONTHS[m - 1]}`;
};

/** Task dueDate (Firestore Timestamp, Date, ms or ISO string) → YYYY-MM-DD, or null. */
export const toDateKey = (value) => {
  if (!value) return null;
  let ms = null;
  if (typeof value === "number") ms = value;
  else if (value instanceof Date) ms = value.getTime();
  else if (typeof value.toMillis === "function") ms = value.toMillis();
  else if (typeof value.seconds === "number") ms = value.seconds * 1000;
  else if (typeof value === "string") ms = Date.parse(value);
  return Number.isFinite(ms) ? dayKey(ms) : null;
};

/**
 * The "Coming up" carousel: exams and the kid's own reminders, soonest first, today or later.
 * @param {Array} exams - [{ id, tag, title, date: "YYYY-MM-DD", tone }]
 * @param {Array} tasks - kid's tasks [{ id, title, dueDate, completed }]
 * @returns [{ id, tag, title, sub, days, unit, tone, kind }]
 */
export function upcomingItems(exams = [], tasks = [], now = Date.now(), limit = 3) {
  const items = [];
  exams.forEach((e) => {
    const days = daysUntil(e.date, now);
    if (Number.isFinite(days) && days >= 0) {
      items.push({ id: `exam-${e.id}`, kind: "exam", tag: e.tag, title: e.title, date: e.date, days, tone: e.tone || "gold" });
    }
  });
  tasks.forEach((t) => {
    if (!t || t.completed) return;
    const date = toDateKey(t.dueDate);
    if (!date) return;
    const days = daysUntil(date, now);
    if (days >= 0) {
      items.push({ id: `task-${t.id}`, kind: "reminder", tag: "DUE", title: t.title || "Reminder", date, days, tone: "plum" });
    }
  });
  items.sort((a, b) => a.days - b.days || (a.kind === "exam" ? -1 : 1));
  return items.slice(0, limit).map((it) => ({
    ...it,
    unit: it.days === 0 ? "TODAY" : it.days === 1 ? "DAY" : "DAYS",
    sub: `${it.kind === "reminder" ? "Your reminder · " : ""}${shortDate(it.date)}`,
  }));
}

// ---------- Several tile quests (English, Science, ...), 2026-11-04 ----------

/** Adds up per-day stats of several quests: { day: { answered, correct, timeMs } }. */
export function mergeDaily(dailies = []) {
  const out = {};
  dailies.forEach((daily) =>
    Object.entries(daily || {}).forEach(([k, v]) => {
      const d = out[k] || { answered: 0, correct: 0, timeMs: 0 };
      out[k] = {
        answered: d.answered + (v?.answered || 0),
        correct: d.correct + (v?.correct || 0),
        timeMs: d.timeMs + (v?.timeMs || 0),
      };
    })
  );
  return out;
}

/** When the kid last played a quest (ms), from its progress doc. 0 = never. */
export const lastPlayed = (doc = {}) => {
  if (typeof doc?.stats?.lastActiveAt === "number") return doc.stats.lastActiveAt;
  const u = doc?.updatedAt;
  if (u && typeof u.toMillis === "function") return u.toMillis();
  if (u && typeof u.seconds === "number") return u.seconds * 1000;
  return 0;
};

/**
 * Which quest the Continue card shows: the one played most recently, else the first quest.
 * @param {Array} quests - [{ questId, ... }] in display order
 * @param {object} progressById - { questId: { nodes, doc } }
 */
export function pickContinue(quests = [], progressById = {}) {
  if (!quests.length) return null;
  let best = null;
  let bestAt = 0;
  quests.forEach((q) => {
    const at = lastPlayed(progressById[q.questId]?.doc);
    if (at > bestAt) {
      best = q;
      bestAt = at;
    }
  });
  return best || quests[0];
}

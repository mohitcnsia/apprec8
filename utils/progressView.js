// utils/progressView.js
// Pure helpers for the kid's Progress tab (owner-approved mockup "D · Progress", 2026-11-04).

import { dayKey, topicSlug } from "./kidStats.js";
import { buildQuestPath } from "./questTree.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const LETTERS = ["M", "T", "W", "T", "F", "S", "S"];

export const GREAT_MIN_ANSWERS = 5;
export const GREAT_FROM = 0.85;

/** This week Monday → Sunday: [{ key, letter, played, isToday, isFuture }]. */
export function weekStrip(daily = {}, now = Date.now()) {
  const d = new Date(now);
  const mondayOffset = (d.getDay() + 6) % 7; // Mon = 0
  const today = dayKey(now);
  return LETTERS.map((letter, i) => {
    const key = dayKey(now + (i - mondayOffset) * DAY_MS);
    return {
      key,
      letter,
      played: (daily[key]?.answered || 0) > 0,
      isToday: key === today,
      isFuture: key > today,
    };
  });
}

/** Topics the kid is great at: enough answers and high accuracy, best first. */
export function greatTopics(stats = {}, limit = 3) {
  return Object.entries(stats.bySubtopic || {})
    .filter(([, v]) => v.total >= GREAT_MIN_ANSWERS && v.correct / v.total >= GREAT_FROM)
    .map(([subtopic, v]) => ({ subtopic, ...v, percent: Math.round((v.correct / v.total) * 100) }))
    .sort((a, b) => b.percent - a.percent || b.total - a.total)
    .slice(0, limit);
}

/** Kid-friendly topic names: gate sub-topic titles + main topic titles (by slug), then a tidy id. */
export function topicNamer(nodes = []) {
  const names = {};
  nodes.forEach((n) => {
    if (n.kind === "gate" && n.subtopicTitles) Object.assign(names, n.subtopicTitles);
    if (n.kind === "main" && n.title) names[topicSlug(n.title)] = n.title;
  });
  return (id) => {
    if (names[id]) return names[id];
    const s = String(id || "").replace(/-/g, " ").trim();
    return s ? s[0].toUpperCase() + s.slice(1) : "Topic";
  };
}

/** Where the kid is in a quest: { cleared, total, current, unitOrder } (topics = main branches). */
export function questSummary(nodes = [], progressNodes = {}) {
  const { path, currentPathId } = buildQuestPath(nodes, progressNodes);
  const mains = path.filter((p) => p.kind === "main");
  const current = path.find((p) => p.id === currentPathId) || null;
  const unit = current ? nodes.find((n) => n.id === current.unitId) : null;
  return {
    cleared: mains.filter((m) => m.cleared).length,
    total: mains.length,
    current: current?.title || null,
    unitOrder: unit?.unitOrder ?? null,
  };
}

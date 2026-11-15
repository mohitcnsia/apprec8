// utils/homeTidy.js: pure helpers for Home tidy-up (G112).
// Parent focus child selection, owner row folding, and classmate cheer logic. Tested in Node.

import { practisedToday, daysThisWeek } from "./tonight.js";

/**
 * Evaluates children for parent Home:
 * - Drops a child once done for the day (practised today).
 * - Focuses on the child who needs most help (fewest days this week, or most mistakes).
 * - Calculates moreCount (+N more).
 *
 * @param {Array} children - array of child user objects [{ uid, firstName, ... }]
 * @param {object} questsByChild - map { [childUid]: questsArray }
 * @param {number} [now]
 * @returns {{ focusChild: object|null, remainingChildren: Array, allDone: boolean }}
 */
export function selectParentFocusChild(children = [], questsByChild = {}, now = Date.now()) {
  if (!children || !children.length) {
    return { focusChild: null, remainingChildren: [], allDone: false };
  }

  const notDone = [];
  const done = [];

  children.forEach((child) => {
    const quests = questsByChild[child.uid] || [];
    if (practisedToday(quests, now)) {
      done.push(child);
    } else {
      const days = daysThisWeek(quests, now);
      const mistakes = quests.reduce((sum, q) => sum + Object.keys(q.mistakes || {}).length, 0);
      notDone.push({ child, days, mistakes });
    }
  });

  if (!notDone.length) {
    return { focusChild: null, remainingChildren: [], allDone: true };
  }

  // Sort by need: fewest days this week first, then most mistakes
  notDone.sort((a, b) => a.days - b.days || b.mistakes - a.mistakes);

  const focusChild = notDone[0].child;
  const remainingChildren = notDone.slice(1).map((x) => x.child);

  return {
    focusChild,
    remainingChildren,
    allDone: false,
  };
}

/**
 * Summarizes pending owner items into a single count and string for the folded Owner row.
 * @param {object} [peopleCounts] - { newToday, stuck }
 * @param {Array} [needsYouRows] - array of pending report/decision rows
 * @returns {{ total: number, summary: string }}
 */
export function ownerRowSummary(peopleCounts = null, needsYouRows = []) {
  const needsCount = (needsYouRows || []).length;
  const newToday = peopleCounts?.newToday || 0;
  const stuck = peopleCounts?.stuck || 0;
  const peopleCount = newToday + stuck;
  const total = needsCount + peopleCount;

  const parts = [];
  if (needsCount > 0) parts.push(`${needsCount} to review`);
  if (newToday > 0) parts.push(`${newToday} new`);
  if (stuck > 0) parts.push(`${stuck} stuck`);

  return {
    total,
    summary: parts.join(" · ") || "All caught up",
  };
}

/**
 * Picks a classmate cheer message:
 * - Classmates only (not self), first name only.
 * - Cheering only, never comparisons.
 *
 * @param {object} summaryKids - classSummaries kids map { [uid]: { name, [questId]: { week, lv } } }
 * @param {string|null} myUid - signed-in user's UID
 * @param {object} [namers] - topic namers per quest { [questId]: (topicId) => string }
 * @returns {string|null}
 */
export function pickClassmateCheer(summaryKids = {}, myUid = null, namers = {}) {
  const classmates = Object.entries(summaryKids).filter(([id]) => id && id !== myUid);
  if (!classmates.length) return null;

  for (const [, kid] of classmates) {
    const name = String(kid.name || "").trim().split(" ")[0];
    if (!name) continue;

    for (const [key, qdata] of Object.entries(kid)) {
      if (key === "name" || typeof qdata !== "object" || !qdata) continue;
      const stars = qdata.week?.correct || 0;
      const lv = qdata.lv || {};

      const learnedTopic = Object.keys(lv).find((t) => lv[t] === "l" || lv[t] === "r");
      const namer = namers[key] || ((t) => t);
      const topicTitle = learnedTopic ? namer(learnedTopic) : null;

      if (stars > 0 && topicTitle) {
        return `${name} earned ${stars} ⭐ in ${topicTitle} 🎉`;
      }
      if (stars > 0) {
        return `${name} earned ${stars} ⭐ this week 🎉`;
      }
    }

    return `${name} practised today 🎉`;
  }
  return null;
}

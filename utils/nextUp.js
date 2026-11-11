// utils/nextUp.js: the kid's Home, "What do I do now?" (redesign doc, owner OK 2026-11-11). One big next thing with a
// START button, two small "then" lines, the rest folded ("+3 more"). Order: work from the teacher (or a family member)
// first, overdue and earliest due on top; then today's practice paper; then mistakes to fix; then continue a quest.
// Pure, so it is tested.

/** "Was due, still open" | "Due today" | "Due in 3 days" | "Open now" */
export function dueText(t, daysUntil) {
  if (!t.dueDate) return "Open now";
  if (t.overdue) return "Was due, still open";
  const d = daysUntil(t.dueDate);
  return d === 0 ? "Due today" : d === 1 ? "Due tomorrow" : `Due in ${d} days`;
}

/**
 * @param {object} p - { teacherTopics, today, mistakeCount, continueQuest, daysUntil }
 *   teacherTopics: assignedTopics() rows (already earliest due first); today: todayPractice() result or null;
 *   continueQuest: { questId, title, current } for the quest the kid was last on, or null.
 * @returns { main, then: [], more: number } items: { key, kind, label, title, sub }
 */
export function nextUp({ teacherTopics = [], today = null, mistakeCount = 0, continueQuest = null, daysUntil = () => 0 } = {}) {
  const items = [];
  const overdueFirst = [...teacherTopics].sort((a, b) => (b.overdue ? 1 : 0) - (a.overdue ? 1 : 0));
  overdueFirst.forEach((t) =>
    items.push({ key: `t:${t.key}`, kind: "teacher", label: "FROM YOUR TEACHER", title: t.title, sub: dueText(t, daysUntil), topic: t })
  );
  if (today?.paper) {
    const subject = today.paper.subject === "science" ? "Science" : "English";
    items.push({ key: `p:${today.paper.id}`, kind: "paper", label: "TODAY'S PRACTICE", title: `${subject} ${today.paper.title}`, sub: `${today.paper.minutes} minutes`, paper: today.paper });
  }
  if (mistakeCount > 0) {
    items.push({ key: "m", kind: "mistakes", label: "FIX YOUR MISTAKES", title: `${mistakeCount} ${mistakeCount === 1 ? "mistake" : "mistakes"} to fix`, sub: "Two right in a row fixes one" });
  }
  if (continueQuest) {
    items.push({ key: `q:${continueQuest.questId}`, kind: "quest", label: "KEEP GOING", title: continueQuest.current || continueQuest.title, sub: continueQuest.title, quest: continueQuest });
  }
  return { main: items[0] || null, then: items.slice(1, 3), more: Math.max(0, items.length - 3), rest: items.slice(3) };
}

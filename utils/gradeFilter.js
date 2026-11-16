// utils/gradeFilter.js
// Class-tagged quests (owner design, 2026-11-04: "one tree, hide what isn't the kid's class").
// A node may carry `grades: [3, 4, 5]` (the classes it is for). Nodes without `grades` are for everyone,
// so English Quest (no tags) is unchanged. Pure: run it on the nodes before buildQuestPath.
//
// - A unit or main topic not for the kid's class is hidden with everything in it (practice, gate,
//   endless, boss), so it never blocks what comes after.
// - A practice leaf can have its own `grades` (e.g. a Class 6 challenge inside a Class 4–6 topic).
// - A unit left with no topics is hidden too (its Boss would otherwise open straight away).
// - Unknown class (not set yet) → nothing is hidden.

const fits = (n, grade) => !Array.isArray(n.grades) || n.grades.length === 0 || n.grades.includes(grade);

export function nodesForGrade(nodes = [], grade) {
  if (!Array.isArray(nodes) || nodes.length === 0) return [];
  if (!Number.isInteger(grade)) return nodes;
  const hiddenUnits = new Set(nodes.filter((n) => n.kind === "unit" && !fits(n, grade)).map((n) => n.id));
  const hiddenBranches = new Set(
    nodes
      .filter((n) => n.kind === "main" && (!fits(n, grade) || hiddenUnits.has(n.unitId)))
      .map((n) => n.branchId || n.id)
  );
  let kept = nodes.filter((n) => {
    if (n.kind === "unit") return !hiddenUnits.has(n.id);
    if (hiddenUnits.has(n.unitId)) return false;
    if (n.kind === "main") return !hiddenBranches.has(n.branchId || n.id);
    if (n.branchId && hiddenBranches.has(n.branchId)) return false;
    return fits(n, grade);
  });
  // Units with no topics left for this class disappear (keep "coming soon" teaser units).
  const unitsWithTopics = new Set(kept.filter((n) => n.kind === "main").map((n) => n.unitId));
  const emptyUnits = new Set(
    kept.filter((n) => n.kind === "unit" && !n.comingSoon && !unitsWithTopics.has(n.id)).map((n) => n.id)
  );
  if (emptyUnits.size) kept = kept.filter((n) => !emptyUnits.has(n.id) && !emptyUnits.has(n.unitId));
  return kept;
}

/**
 * Returns true if the quest has at least one main topic for the given class.
 * When grade is not set (null/undefined), returns true if the quest has any main topics.
 * Quests with 0 main topics for a child's class should not show a Home tile or Progress row.
 */
export function questHasTopicsForGrade(nodes = [], grade, questId = null) {
  const visible = nodesForGradeOrAll(nodes, grade, questId).nodes; // older children also see quests made for younger classes (16 Nov)
  return visible.some((n) => n.kind === "main");
}

/** "Class 3–5" label for a topic, or null when it's for everyone. */
export const gradesLabel = (grades) => {
  if (!Array.isArray(grades) || grades.length === 0) return null;
  const sorted = [...grades].sort((a, b) => a - b);
  const contiguous = sorted.every((g, i) => i === 0 || g === sorted[i - 1] + 1);
  if (sorted.length === 1) return `Class ${sorted[0]}`;
  return contiguous ? `Class ${sorted[0]}–${sorted[sorted.length - 1]}` : `Class ${sorted.join(", ")}`;
};

/**
 * Owner, 16 Nov 2026: "even if a student is in class 10th, still they should see the nodes, with the note". When a quest
 * has no topic for the child's class, show all its topics and say which classes they were made for.
 * → { nodes, coveredClasses: null | { lo, hi } } (coveredClasses set only when we fell back to everything).
 */
// Quests whose easier topics still help older children (owner, 16 Nov 2026: words help at any age). Science stays
// hidden from older classes (G79: Class 3–6 science looked silly to Class 10).
export const OPEN_TO_OLDER = new Set(["word-power"]);

export function nodesForGradeOrAll(nodes = [], grade, questId = null) {
  if (!Array.isArray(nodes)) return { nodes: [], coveredClasses: null };
  const kept = nodesForGrade(nodes, grade);
  const hasTopic = (list) => list.some((n) => n.kind === "main");
  if (!Number.isInteger(grade) || hasTopic(kept) || !hasTopic(nodes)) return { nodes: kept, coveredClasses: null };
  const gs = nodes.flatMap((n) => (Array.isArray(n.grades) ? n.grades : [])).filter(Number.isInteger);
  if (!gs.length) return { nodes: kept, coveredClasses: null };
  const lo = Math.min(...gs), hi = Math.max(...gs);
  // Older children only: easier topics are a warm-up; harder ones would only discourage a younger child.
  if (grade <= hi || !OPEN_TO_OLDER.has(questId)) return { nodes: kept, coveredClasses: null };
  return { nodes, coveredClasses: { lo, hi } };
}

/** The topics a child sees in a quest (their class, or all of it when they're older than every topic). */
export const topicNodesFor = (nodes = [], grade, questId = null) => nodesForGradeOrAll(nodes, grade, questId).nodes;

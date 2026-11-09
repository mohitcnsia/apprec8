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
export function questHasTopicsForGrade(nodes = [], grade) {
  const visible = nodesForGrade(nodes, grade);
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

// utils/classClimb.js
// Owner, 16 Nov 2026: "if a class 3 child finishes her syllabus and quests then?" → when a child has cleared every topic
// for their class in a quest, the next class's topics open on the same map, one class at a time (earned, never given:
// a younger child never meets much harder topics on day one). First step of the per-child levels plan.
import { nodesForGrade, nodesForGradeOrAll } from "./gradeFilter.js";
import { buildQuestPath } from "./questTree.js";

const gradesIn = (nodes) => nodes.flatMap((n) => (Array.isArray(n.grades) ? n.grades : [])).filter(Number.isInteger);

/** Nodes kept for any of the grades, in the quest's own order. */
function unionForGrades(nodes, grades) {
  const keep = new Set();
  for (const g of grades) for (const n of nodesForGrade(nodes, g)) keep.add(n.id);
  return nodes.filter((n) => keep.has(n.id));
}

/**
 * The topics a child sees: their class (or all of it, for older children in OPEN_TO_OLDER quests), plus each next class
 * they've earned by clearing everything before it.
 * → { nodes, coveredClasses, openedTo } (openedTo: the highest class opened by climbing, or null).
 */
export function topicsWithClimb(nodes = [], grade, questId = null, progress = {}) {
  const base = nodesForGradeOrAll(nodes, grade, questId);
  if (!Array.isArray(nodes) || !Number.isInteger(grade) || base.coveredClasses) return { ...base, openedTo: null };
  const top = Math.max(...gradesIn(nodes), -Infinity);
  const grades = [grade];
  let shown = base.nodes;
  let openedTo = null;
  for (let g = grade + 1; g <= top; g++) {
    const mains = buildQuestPath(shown, progress).path.filter((p) => p.kind === "main");
    if (!mains.length || !mains.every((m) => m.cleared)) break;
    const next = unionForGrades(nodes, [...grades, g]);
    if (next.length === shown.length) {
      grades.push(g); // nothing new for this class: look one class higher
      continue;
    }
    grades.push(g);
    shown = next;
    openedTo = g;
  }
  return { nodes: shown, coveredClasses: null, openedTo };
}

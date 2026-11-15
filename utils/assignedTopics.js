// utils/assignedTopics.js
// Home's "From your teacher" list (2026-11-09: a student saw only the first assignment and landed on "Sentences").
// Every assigned topic the kid hasn't finished, one row each, soonest due first. Pure, tested.
// G87: An assignment is done only when steps are completed AND open mistakes are fixed.
import { topicDone } from "./questTree.js";

export function countTopicMistakes(mistakes = {}, nodeId) {
  if (!mistakes || typeof mistakes !== "object") return 0;
  let count = 0;
  for (const entry of Object.values(mistakes)) {
    if (entry && entry.branchId === nodeId) {
      count++;
    }
  }
  return count;
}

/**
 * @param assignments  [{ id, questId, nodeIds[], nodeTitles[], dueDate }]
 * @param nodesOf      questId → the quest's nodes (bundled data)
 * @param progressOf   questId → that quest's progress nodes map ({ [stepId]: { status } }) or { nodes, doc }
 * @param today        "YYYY-MM-DD"
 * @param mistakesOf   questId → that quest's mistakes map ({ [key]: { branchId, ... } }) (optional)
 * @returns [{ key, questId, nodeId, title, dueDate, overdue, allStepsDone, mistakesLeft }]
 */
export function assignedTopics(
  assignments = [],
  nodesOf = () => [],
  progressOf = () => ({}),
  today = "",
  mistakesOf = null
) {
  const byKey = new Map();
  for (const a of assignments) {
    const rawProg = progressOf(a.questId) || {};
    const progressNodes = rawProg.nodes || rawProg;
    const progressMistakes =
      (typeof mistakesOf === "function" ? mistakesOf(a.questId) : null) ||
      rawProg.doc?.mistakes ||
      rawProg.mistakes ||
      {};

    (a.nodeIds || []).forEach((nodeId, i) => {
      const node = (nodesOf(a.questId) || []).find((n) => n.id === nodeId);
      const allStepsDone = node ? topicDone(node, progressNodes) : false;
      const mistakesLeft = countTopicMistakes(progressMistakes, nodeId);

      // Done = steps completed AND no open mistakes for that topic (G87)
      if (node && allStepsDone && mistakesLeft === 0) return;

      const key = `${a.questId}:${nodeId}`;
      const row = {
        key,
        questId: a.questId,
        nodeId,
        title: (a.nodeTitles || [])[i] || node?.title || "A topic",
        dueDate: a.dueDate || null,
        overdue: !!(a.dueDate && today && a.dueDate < today),
        allStepsDone,
        mistakesLeft,
      };
      const old = byKey.get(key);
      if (!old || String(row.dueDate || "9999") < String(old.dueDate || "9999")) byKey.set(key, row);
    });
  }
  return [...byKey.values()].sort((x, y) => String(x.dueDate || "9999").localeCompare(String(y.dueDate || "9999")));
}

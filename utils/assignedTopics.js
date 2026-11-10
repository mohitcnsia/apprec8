// utils/assignedTopics.js
// Home's "From your teacher" list (2026-11-09: a student saw only the first assignment and landed on "Sentences").
// Every assigned topic the kid hasn't finished, one row each, soonest due first. Pure, tested.
import { topicDone } from "./questTree.js";

/**
 * @param assignments  [{ id, questId, nodeIds[], nodeTitles[], dueDate }]
 * @param nodesOf      questId → the quest's nodes (bundled data)
 * @param progressOf   questId → that quest's progress nodes map ({ [stepId]: { status } })
 * @param today        "YYYY-MM-DD"
 * @returns [{ key, questId, nodeId, title, dueDate, overdue }]
 */
export function assignedTopics(assignments = [], nodesOf = () => [], progressOf = () => ({}), today = "") {
  const byKey = new Map();
  for (const a of assignments) {
    (a.nodeIds || []).forEach((nodeId, i) => {
      const node = (nodesOf(a.questId) || []).find((n) => n.id === nodeId);
      if (node && topicDone(node, progressOf(a.questId))) return;
      const key = `${a.questId}:${nodeId}`;
      const row = {
        key,
        questId: a.questId,
        nodeId,
        title: (a.nodeTitles || [])[i] || node?.title || "A topic",
        dueDate: a.dueDate || null,
        overdue: !!(a.dueDate && today && a.dueDate < today),
      };
      const old = byKey.get(key);
      if (!old || String(row.dueDate || "9999") < String(old.dueDate || "9999")) byKey.set(key, row);
    });
  }
  return [...byKey.values()].sort((x, y) => String(x.dueDate || "9999").localeCompare(String(y.dueDate || "9999")));
}

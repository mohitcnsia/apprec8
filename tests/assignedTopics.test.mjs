// Tests for utils/assignedTopics.js. Run: npm test
import assert from "node:assert/strict";
import { assignedTopics, countTopicMistakes } from "../utils/assignedTopics.js";

const nodes = [
  { id: "t1", kind: "main", steps: [{ type: "study" }, { type: "quiz" }] },
  { id: "t2", kind: "main", steps: [{ type: "quiz" }] },
  { id: "t3", kind: "main", steps: [{ type: "quiz" }] },
];
const nodesOf = () => nodes;
const A = [
  { id: "a1", questId: "q", nodeIds: ["t1", "t2"], nodeTitles: ["Agreement", "Determiners"], dueDate: "2026-11-12" },
  { id: "a2", questId: "q", nodeIds: ["t3", "t2"], nodeTitles: ["Will", "Determiners"], dueDate: "2026-11-16" },
];

// Every unfinished topic, once, soonest due first (not only the first assignment).
let rows = assignedTopics(A, nodesOf, () => ({}), "2026-11-09");
assert.deepEqual(rows.map((r) => [r.nodeId, r.title, r.dueDate]), [["t1", "Agreement", "2026-11-12"], ["t2", "Determiners", "2026-11-12"], ["t3", "Will", "2026-11-16"]]);

// A finished topic with NO mistakes drops out; a half-done one stays.
rows = assignedTopics(A, nodesOf, () => ({ "t2__0": { status: "completed" }, "t1__0": { status: "completed" } }), "2026-11-09");
assert.deepEqual(rows.map((r) => r.nodeId), ["t1", "t3"]);

// G87: All steps completed, but mistakes left -> topic stays with allStepsDone: true, mistakesLeft: N
const mistakesWithT2 = {
  m1: { kind: "question", questionId: "q1", branchId: "t2" },
  m2: { kind: "topic", branchId: "t2" },
  m3: { kind: "question", questionId: "q3", branchId: "other" },
};
assert.equal(countTopicMistakes(mistakesWithT2, "t2"), 2);
assert.equal(countTopicMistakes(mistakesWithT2, "t1"), 0);

rows = assignedTopics(
  A,
  nodesOf,
  () => ({
    "t2__0": { status: "completed" },
    "t1__0": { status: "completed" },
    "t1__1": { status: "completed" },
  }),
  "2026-11-09",
  () => mistakesWithT2
);
// t1 has all steps done and 0 mistakes -> dropped
// t2 has all steps done but 2 mistakes left -> stays
// t3 not started -> stays
assert.deepEqual(rows.map((r) => r.nodeId), ["t2", "t3"]);
const t2Row = rows.find((r) => r.nodeId === "t2");
assert.equal(t2Row.allStepsDone, true);
assert.equal(t2Row.mistakesLeft, 2);

// Past the due date: still shown, marked overdue.
rows = assignedTopics(A, nodesOf, () => ({}), "2026-11-14");
assert.equal(rows.find((r) => r.nodeId === "t1").overdue, true);
assert.equal(rows.find((r) => r.nodeId === "t3").overdue, false);

// Unknown topic id (old app data): shown with its saved title, never a crash.
rows = assignedTopics([{ id: "x", questId: "q", nodeIds: ["gone"], nodeTitles: ["Old topic"], dueDate: null }], nodesOf, () => ({}), "2026-11-09");
assert.deepEqual(rows.map((r) => r.title), ["Old topic"]);
assert.deepEqual(assignedTopics(), []);
console.log("assignedTopics tests passed");

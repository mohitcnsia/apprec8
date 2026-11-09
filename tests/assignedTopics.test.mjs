// Tests for utils/assignedTopics.js. Run: npm test
import assert from "node:assert/strict";
import { assignedTopics } from "../utils/assignedTopics.js";

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

// A finished topic (all its steps) drops out; a half-done one stays.
rows = assignedTopics(A, nodesOf, () => ({ "t2__0": { status: "completed" }, "t1__0": { status: "completed" } }), "2026-11-09");
assert.deepEqual(rows.map((r) => r.nodeId), ["t1", "t3"]);

// Past the due date: still shown, marked overdue.
rows = assignedTopics(A, nodesOf, () => ({}), "2026-11-14");
assert.equal(rows.find((r) => r.nodeId === "t1").overdue, true);
assert.equal(rows.find((r) => r.nodeId === "t3").overdue, false);

// Unknown topic id (old app data): shown with its saved title, never a crash.
rows = assignedTopics([{ id: "x", questId: "q", nodeIds: ["gone"], nodeTitles: ["Old topic"], dueDate: null }], nodesOf, () => ({}), "2026-11-09");
assert.deepEqual(rows.map((r) => r.title), ["Old topic"]);
assert.deepEqual(assignedTopics(), []);
console.log("assignedTopics tests passed");

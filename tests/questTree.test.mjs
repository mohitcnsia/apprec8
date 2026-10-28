import assert from "node:assert/strict";
import { buildQuestTree, starsForPercent, scoreAnswers } from "../utils/questTree.js";
const nodes = [
  { id: "u1", kind: "unit", unitOrder: 1, title: "U1", quizId: "t1" },
  { id: "u0", kind: "unit", unitOrder: 0, title: "U0", quizId: "t0" },
  { id: "u2", kind: "unit", unitOrder: 2, title: "U2", comingSoon: true },
  { id: "a1", kind: "leaf", unitId: "u0", branchId: "A", branchOrder: 0, order: 1, type: "study" },
  { id: "a2", kind: "leaf", unitId: "u0", branchId: "A", branchOrder: 0, order: 2, type: "quiz" },
  { id: "b1", kind: "leaf", unitId: "u0", branchId: "B", branchOrder: 1, order: 1, type: "video" },
  { id: "b2", kind: "leaf", unitId: "u0", branchId: "B", branchOrder: 1, order: 2, type: "quiz" },
  { id: "c1", kind: "leaf", unitId: "u1", branchId: "C", branchOrder: 0, order: 1, type: "quiz" },
];
// Fresh kid
let t = buildQuestTree(nodes, {});
assert.deepEqual(t.units.map(u => u.id), ["u0","u1","u2"]);
assert.deepEqual(t.units.map(u => u.status), ["unlocked","locked","comingSoon"]);
const [A, B] = t.units[0].branches;
assert.deepEqual(A.leaves.map(l => l.status), ["unlocked","locked"]);
assert.deepEqual(B.leaves.map(l => l.status), ["comingSoon","locked"]); // unknown type never crashes
assert.equal(t.units[1].branches[0].leaves[0].status, "locked");
assert.equal(t.currentUnitId, "u0");
// Study done, quiz 85%
t = buildQuestTree(nodes, { a1: {status:"completed"}, a2: {status:"completed", bestPercent: 85} });
assert.deepEqual(t.units[0].branches[0].leaves.map(l => [l.status, l.stars]), [["completed",3],["completed",2]]);
// Unit test passed without finishing branch B -> unit 1 opens, unit 2 shows coming soon
t = buildQuestTree(nodes, { u0: {status:"completed", bestPercent: 90} });
assert.deepEqual(t.units.map(u => u.status), ["completed","unlocked","comingSoon"]);
assert.equal(t.units[1].branches[0].leaves[0].status, "unlocked");
assert.equal(t.currentUnitId, "u1");
assert.equal(t.stats.unitsTotal, 2);
// Stars and scoring
assert.equal(starsForPercent(59), 0); assert.equal(starsForPercent(60), 1);
assert.equal(starsForPercent(100), 3); assert.equal(starsForPercent(undefined), 0);
assert.deepEqual(scoreAnswers([{isCorrect:true},{isCorrect:false}], 4), {correctCount:1,total:4,percent:25});
console.log("questTree: all tests passed");
// Finding 5: unknown unit type or unit without a test -> coming soon, never playable
const t2 = buildQuestTree([
  { id: "x0", kind: "unit", unitOrder: 0, title: "OK", quizId: "t" },
  { id: "x1", kind: "unit", unitOrder: 1, title: "Future", type: "boss-battle", quizId: "t" },
  { id: "x2", kind: "unit", unitOrder: 2, title: "No test" },
], { x0: { status: "completed" } });
assert.deepEqual(t2.units.map(u => u.status), ["completed", "comingSoon", "comingSoon"]);
assert.equal(t2.stats.unitsTotal, 1);
console.log("unit guard: passed");

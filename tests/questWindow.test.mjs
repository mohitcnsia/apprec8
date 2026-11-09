// Tests for utils/questWindow.js (map windowing). Run: npm test
import assert from "node:assert/strict";
import { buildWindow } from "../utils/questWindow.js";
import { buildQuestPath, stepId } from "../utils/questTree.js";

const units = [
  { id: "u0", kind: "unit", unitOrder: 0, title: "Sentences" },
  { id: "u1", kind: "unit", unitOrder: 1, title: "Parts of Speech" },
  { id: "u2", kind: "unit", unitOrder: 2, title: "Articles" },
  { id: "u3", kind: "unit", unitOrder: 3, title: "Tenses" },
  { id: "u4", kind: "unit", unitOrder: 4, title: "Soon", comingSoon: true },
];
const unitNodes = (u, n) => [
  ...Array.from({ length: n }, (_, i) => ({ id: `${u}-m${i}`, kind: "main", unitId: u, branchId: `${u}-m${i}`, branchOrder: i, steps: [{ type: "quiz", quizId: "q" }] })),
  { id: `${u}-boss`, kind: "boss", unitId: u, quizId: "b" },
];
const nodes = [...units, ...unitNodes("u0", 2), ...unitNodes("u1", 3), ...unitNodes("u2", 2), ...unitNodes("u3", 2)];
const done = (...k) => Object.fromEntries(k.map((x) => [x, { status: "completed" }]));
const shape = (w) => w.rows.map((r) => (r.type === "node" ? r.item.id : r.type === "more" ? `more:${r.count}` : `${r.type}:${r.unitId}`));

// 1. New kid: unit 0 in full, unit 1 teaser, "2 more units ahead" (u2, u3, coming-soon u4 → 3).
let t = buildQuestPath(nodes, {});
let w = buildWindow({ path: t.path, units, currentPathId: t.currentPathId });
assert.deepEqual(shape(w), ["u0-m0", "u0-m1", "u0-boss", "teaser:u1", "more:3"]);
assert.equal(w.rows[3].needs, "Sentences Boss"); // boss without a title → "<unit> Boss"
const titled = nodes.map((n) => (n.id === "u0-boss" ? { ...n, title: "Unit 0 Boss" } : n));
const tt = buildQuestPath(titled, {});
assert.equal(buildWindow({ path: tt.path, units, currentPathId: tt.currentPathId }).rows[3].needs, "Unit 0 Boss");
assert.equal(w.rows[3].topicsTotal, 3);

// 2. Unit 0 finished → collapsed card, unit 1 in full, unit 2 teaser.
const u0done = done(stepId("u0-m0", 0), stepId("u0-m1", 0), "u0-boss");
t = buildQuestPath(nodes, u0done);
w = buildWindow({ path: t.path, units, currentPathId: t.currentPathId });
assert.deepEqual(shape(w), ["doneCard:u0", "u1-m0", "u1-m1", "u1-m2", "u1-boss", "teaser:u2", "more:2"]);
assert.equal(w.rows[0].topicsDone, 2);
assert.equal(w.rows[0].expanded, false);

// 3. Expanding a finished unit shows its nodes after its card.
w = buildWindow({ path: t.path, units, currentPathId: t.currentPathId, expanded: ["u0"] });
assert.deepEqual(shape(w).slice(0, 4), ["doneCard:u0", "u0-m0", "u0-m1", "u0-boss"]);
assert.equal(w.rows[0].expanded, true);

// 4. Coming-soon next unit → teaser marked comingSoon.
const allBut4 = { ...u0done, ...done(...["u1-m0", "u1-m1", "u1-m2"].map((m) => stepId(m, 0)), "u1-boss", ...["u2-m0", "u2-m1"].map((m) => stepId(m, 0)), "u2-boss") };
t = buildQuestPath(nodes, allBut4);
w = buildWindow({ path: t.path, units, currentPathId: t.currentPathId });
assert.deepEqual(shape(w), ["doneCard:u0", "doneCard:u1", "doneCard:u2", "u3-m0", "u3-m1", "u3-boss", "teaser:u4"]);
assert.equal(w.rows[6].comingSoon, true);

// 5. Tester unlockAll → every playable unit in full; the coming-soon unit still shows as a teaser.
t = buildQuestPath(nodes, {}, { unlockAll: true });
w = buildWindow({ path: t.path, units, currentPathId: t.currentPathId, unlockAll: true });
assert.equal(w.rows.filter((r) => r.type === "node").length, 3 + 4 + 3 + 3);
assert.deepEqual(w.rows.filter((r) => r.type !== "node").map((r) => [r.type, r.unitId, r.comingSoon]), [["teaser", "u4", true]]);

// 6. Empty input never crashes.
assert.deepEqual(buildWindow({}).rows, []);
console.log("questWindow: all tests passed");

// Assigned topics (2026-11-09): a teacher's topic in a later unit is drawn so the kid can tap it.
{
  const tA = buildQuestPath(nodes, {}, { extraUnlocked: ["u3-m1"] });
  const wA = buildWindow({ path: tA.path, units, currentPathId: tA.currentPathId, assigned: ["u3-m1"] });
  assert.deepEqual(shape(wA), ["u0-m0", "u0-m1", "u0-boss", "teaser:u1", "u3-m1", "more:3"]);
  assert.equal(wA.rows.find((r) => r.type === "node" && r.item.id === "u3-m1").item.status, "unlocked");
  // Nothing assigned → unchanged.
  assert.deepEqual(shape(buildWindow({ path: tA.path, units, currentPathId: tA.currentPathId })), ["u0-m0", "u0-m1", "u0-boss", "teaser:u1", "more:3"]);
  console.log("questWindow assigned-topic tests passed");
}

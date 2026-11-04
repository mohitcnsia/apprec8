// Tests for utils/questTree.js (Spec v2 path + unlock rules). Run: npm test
import assert from "node:assert/strict";
import { buildQuestPath, stepId, starsForPercent, scoreAnswers } from "../utils/questTree.js";

const nodes = [
  { id: "u0", kind: "unit", unitOrder: 0, title: "U0" },
  { id: "u1", kind: "unit", unitOrder: 1, title: "U1" },
  { id: "u2", kind: "unit", unitOrder: 2, title: "Soon", comingSoon: true },
  // Unit 0, branch A (with gate) and branch B (no gate)
  { id: "a", kind: "main", unitId: "u0", branchId: "A", branchOrder: 0, title: "A", steps: [{ type: "study", contentId: "s" }, { type: "quiz", quizId: "q" }] },
  { id: "a-p1", kind: "practice", unitId: "u0", branchId: "A", order: 1, difficulty: "easy", steps: [{ type: "quiz", quizId: "p1" }] },
  { id: "a-p2", kind: "practice", unitId: "u0", branchId: "A", order: 2, difficulty: "hard", steps: [{ type: "video" }] },
  { id: "a-gate", kind: "gate", unitId: "u0", branchId: "A", quizId: "g", passPercent: 80 },
  { id: "a-end", kind: "endless", unitId: "u0", branchId: "A" },
  { id: "b", kind: "main", unitId: "u0", branchId: "B", branchOrder: 1, title: "B", steps: [{ type: "reading", contentId: "r" }] },
  { id: "u0-boss", kind: "boss", unitId: "u0", quizId: "boss0" },
  { id: "c", kind: "main", unitId: "u1", branchId: "C", branchOrder: 0, title: "C", steps: [{ type: "quiz", quizId: "c" }] },
  { id: "u1-boss", kind: "boss", unitId: "u1", quizId: "boss1" },
];
const done = (...keys) => Object.fromEntries(keys.map((k) => [k, { status: "completed", bestPercent: 100 }]));
const statuses = (t) => t.path.map((p) => `${p.id}:${p.status}`);

// 1. New kid: only the first main node is open; path order is start -> end.
let t = buildQuestPath(nodes, {});
assert.deepEqual(statuses(t), ["a:unlocked", "b:locked", "u0-boss:locked", "c:locked", "u1-boss:locked", "u2:comingSoon"]);
assert.equal(t.currentPathId, "a");
assert.equal(t.path[0].nextStep.type, "study");
assert.deepEqual(t.path[0].practices.map((p) => p.status), ["locked", "locked"]);
assert.equal(t.path[0].gate.status, "locked");

// 2. Study done: main still in progress (1/2), next step is the quiz.
t = buildQuestPath(nodes, done(stepId("a", 0)));
assert.equal(t.path[0].status, "unlocked");
assert.equal(t.path[0].doneCount, 1);
assert.equal(t.path[0].nextStep.type, "quiz");

// 3. Main done: side row opens (practice any order, unknown type = comingSoon), gate open, next branch still locked.
t = buildQuestPath(nodes, done(stepId("a", 0), stepId("a", 1)));
assert.equal(t.path[0].status, "completed");
assert.deepEqual(t.path[0].practices.map((p) => p.status), ["unlocked", "comingSoon"]);
assert.equal(t.path[0].gate.status, "unlocked");
assert.equal(t.path[0].endless.status, "unlocked"); // ♾️ opens with the side row (Step 4)
assert.equal(t.path[1].status, "locked");
assert.equal(t.currentPathId, "a"); // still on A: the gate is waiting

// 4. Gate passed WITHOUT doing practice: next branch opens (practice stays optional).
t = buildQuestPath(nodes, done(stepId("a", 0), stepId("a", 1), "a-gate"));
assert.equal(t.path[0].cleared, true);
assert.equal(t.path[0].mastered, false);
assert.equal(t.path[1].status, "unlocked");
assert.equal(t.currentPathId, "b");

// 5. Branch without a gate is cleared by its main node -> boss opens; boss passed -> next unit opens.
t = buildQuestPath(nodes, done(stepId("a", 0), stepId("a", 1), "a-gate", stepId("b", 0)));
assert.equal(t.path[2].status, "unlocked");
assert.equal(t.currentPathId, "u0-boss");
t = buildQuestPath(nodes, done(stepId("a", 0), stepId("a", 1), "a-gate", stepId("b", 0), "u0-boss"));
assert.deepEqual(statuses(t).slice(2, 4), ["u0-boss:completed", "c:unlocked"]);
assert.equal(t.stats.unitsDone, 1);
assert.equal(t.stats.unitsTotal, 2);

// 6. Mastered = main + every practice + gate (a comingSoon practice blocks mastery until it exists).
t = buildQuestPath(nodes.filter((n) => n.id !== "a-p2"), done(stepId("a", 0), stepId("a", 1), "a-gate", stepId("a-p1", 0)));
assert.equal(t.path[0].mastered, true);
assert.equal(t.path[0].practices[0].stars, 3);

// 7. Everything done: current points at the last completed node, never null.
const all = done(stepId("a", 0), stepId("a", 1), "a-gate", stepId("b", 0), "u0-boss", stepId("c", 0), "u1-boss");
t = buildQuestPath(nodes, all);
assert.equal(t.currentPathId, "u1-boss");

// 8. Robustness: missing steps / unknown step on a main node -> comingSoon, never crash.
t = buildQuestPath([{ id: "u", kind: "unit", unitOrder: 0 }, { id: "m", kind: "main", unitId: "u", branchId: "X", steps: [{ type: "hologram" }] }], {});
assert.equal(t.path[0].status, "comingSoon");
assert.deepEqual(buildQuestPath([], {}).path, []);

// 9. Gate memory: fails + weak sub-topics make matching practice leaves glow; 2 fails lock retries.
const gnodes = nodes.map((n) => (n.id === "a-p1" ? { ...n, subtopic: "gender" } : n));
const mainDone = done(stepId("a", 0), stepId("a", 1));
t = buildQuestPath(gnodes, { ...mainDone, "a-gate": { failsSinceLastPractice: 1, weakSubtopics: ["gender"] } });
assert.equal(t.path[0].gate.retryLocked, false);
assert.equal(t.path[0].practices[0].glow, true);
assert.equal(t.path[0].practices[1].glow, false);
t = buildQuestPath(gnodes, { ...mainDone, "a-gate": { failsSinceLastPractice: 2, weakSubtopics: ["gender"] } });
assert.equal(t.path[0].gate.retryLocked, true);
assert.equal(t.path[0].gate.status, "unlocked"); // still shown as open, the lock is explained on tap
// Passing the gate clears glow and lock
t = buildQuestPath(gnodes, { ...mainDone, "a-gate": { status: "completed", failsSinceLastPractice: 0, weakSubtopics: ["gender"] } });
assert.equal(t.path[0].practices[0].glow, false);
assert.equal(t.path[0].gate.retryLocked, false);

// 9b. No practice leaf for the weak sub-topic → the gate never locks (kid can't get stuck).
t = buildQuestPath(gnodes, { ...mainDone, "a-gate": { failsSinceLastPractice: 2, weakSubtopics: ["articles"] } });
assert.equal(t.path[0].gate.retryLocked, false, "no glowing leaf → no lock");
t = buildQuestPath(nodes.filter((n) => n.kind !== "practice"), { ...mainDone, "a-gate": { failsSinceLastPractice: 5, weakSubtopics: ["gender"] } });
assert.equal(t.path[0].gate.retryLocked, false, "branch without practice leaves never locks");

// 10. Tester mode (unlockAll): everything open, coming-soon stays, progress object untouched.
const before = JSON.stringify({});
const prog = {};
t = buildQuestPath(nodes, prog, { unlockAll: true });
assert.deepEqual(statuses(t), ["a:unlocked", "b:unlocked", "u0-boss:unlocked", "c:unlocked", "u1-boss:unlocked", "u2:comingSoon"]);
assert.deepEqual(t.path[0].practices.map((p) => p.status), ["unlocked", "comingSoon"]);
assert.equal(t.path[0].gate.status, "unlocked");
assert.equal(JSON.stringify(prog), before, "progress must not change");
assert.equal(t.stats.unitsDone, 0, "stats still reflect real progress");

// Stars + scoring helpers
assert.equal(starsForPercent(59), 0); assert.equal(starsForPercent(60), 1);
assert.equal(starsForPercent(85), 2); assert.equal(starsForPercent(100), 3);
assert.deepEqual(scoreAnswers([{ isCorrect: true }, { isCorrect: false }], 4), { correctCount: 1, total: 4, percent: 25 });

console.log("questTree (Spec v2): all tests passed");

// RB-7: a teacher-assigned topic opens even if the path hasn't reached it; the rest stays locked
{
  const { buildQuestPath: build } = await import("../utils/questTree.js");
  const N = [
    { id: "u1", kind: "unit", unitOrder: 1, title: "U1" },
    { id: "a", kind: "main", unitId: "u1", branchId: "a", branchOrder: 1, title: "A", steps: [{ type: "quiz", quizId: "qa" }] },
    { id: "b", kind: "main", unitId: "u1", branchId: "b", branchOrder: 2, title: "B", steps: [{ type: "quiz", quizId: "qb" }] },
    { id: "c", kind: "main", unitId: "u1", branchId: "c", branchOrder: 3, title: "C", steps: [{ type: "quiz", quizId: "qc" }] },
  ];
  const plain = build(N, {});
  assert.equal(plain.path.find((p) => p.id === "c").status, "locked");
  const t = build(N, {}, { extraUnlocked: ["c"] });
  assert.equal(t.path.find((p) => p.id === "c").status, "unlocked");
  assert.equal(t.path.find((p) => p.id === "b").status, "locked");
  console.log("questTree extraUnlocked: ok");
}

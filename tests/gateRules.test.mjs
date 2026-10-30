// Tests for utils/gateRules.js. Run: npm test
import assert from "node:assert/strict";
import { drawBalanced, evaluateGate, canRetryAfter, shuffle } from "../utils/gateRules.js";

// Seeded random so tests are repeatable.
const seeded = (seed) => () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);

const pool = [
  ...["a1", "a2", "a3", "a4"].map((id) => ({ id, subtopic: "A" })),
  ...["b1", "b2", "b3", "b4"].map((id) => ({ id, subtopic: "B" })),
  ...["c1", "c2", "c3", "c4"].map((id) => ({ id, subtopic: "C" })),
  ...["d1", "d2", "d3"].map((id) => ({ id, subtopic: "D" })),
];

// 1. Draw 10 from 15: at least 2 per sub-topic, no duplicates, across many random seeds.
for (let seed = 1; seed <= 200; seed++) {
  const drawn = drawBalanced(pool, { count: 10, minPerGroup: 2 }, seeded(seed));
  assert.equal(drawn.length, 10);
  assert.equal(new Set(drawn.map((q) => q.id)).size, 10, "no duplicates");
  for (const t of ["A", "B", "C", "D"]) {
    assert.ok(drawn.filter((q) => q.subtopic === t).length >= 2, `seed ${seed}: sub-topic ${t} needs 2`);
  }
}
// 2. Different seeds give different tests (retries are fresh).
const ids = (s) => drawBalanced(pool, { count: 10 }, seeded(s)).map((q) => q.id).sort().join();
assert.notEqual(ids(1), ids(7));
// 3. Small pool: everything is used, nothing invented.
assert.equal(drawBalanced(pool.slice(0, 5), { count: 10 }).length, 5);
// 4. Too many sub-topics for the count: never exceeds count.
assert.equal(drawBalanced(pool, { count: 5, minPerGroup: 2 }, seeded(3)).length, 5);
// 5. shuffle keeps every item
assert.deepEqual(shuffle([1, 2, 3, 4], seeded(5)).sort(), [1, 2, 3, 4]);

// Gate evaluation
const asked = [
  { id: "a1", subtopic: "A" }, { id: "a2", subtopic: "A" },
  { id: "b1", subtopic: "B" }, { id: "b2", subtopic: "B" },
  { id: "c1", subtopic: "C" }, { id: "c2", subtopic: "C" },
  { id: "d1", subtopic: "D" }, { id: "d2", subtopic: "D" },
  { id: "a3", subtopic: "A" }, { id: "b3", subtopic: "B" },
];
const answer = (correctIds) => asked.map((q) => ({ questionId: q.id, isCorrect: correctIds.includes(q.id), subtopic: q.subtopic }));

// 8/10 with every sub-topic → pass
let r = evaluateGate(answer(["a1", "a2", "b1", "b2", "c1", "d1", "a3", "b3"]), asked);
assert.equal(r.percent, 80); assert.equal(r.passed, true); assert.deepEqual(r.weak, []);
// 8/10 but nothing right in D → fail with D weak ("no weak spot" rule)
r = evaluateGate(answer(["a1", "a2", "b1", "b2", "c1", "c2", "a3", "b3"]), asked);
assert.equal(r.percent, 80); assert.equal(r.passed, false); assert.deepEqual(r.weak, ["D"]);
assert.deepEqual(r.bySubtopic.D, { correct: 0, total: 2 });
// 7/10 everywhere covered → fail on score
r = evaluateGate(answer(["a1", "b1", "b2", "c1", "c2", "d1", "a3"]), asked);
assert.equal(r.percent, 70); assert.equal(r.passed, false); assert.deepEqual(r.weak, []);
// Unanswered (e.g. out of hearts) counts as wrong
r = evaluateGate(answer(["a1", "a2"]).slice(0, 2), asked);
assert.equal(r.total, 10); assert.equal(r.correctCount, 2); assert.equal(r.passed, false);
// Rule can be switched off (normal quizzes)
r = evaluateGate(answer(["a1", "a2", "b1", "b2", "c1", "c2", "a3", "b3"]), asked, { passPercent: 80, requireEverySubtopic: false });
assert.equal(r.passed, true);

// 2-fails lock
assert.equal(canRetryAfter(0), true); assert.equal(canRetryAfter(1), true); assert.equal(canRetryAfter(2), false);

console.log("gateRules: all tests passed");

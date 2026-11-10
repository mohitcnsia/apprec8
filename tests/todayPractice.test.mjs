// tests/todayPractice.test.mjs: G101 Today's practice card + speed counters in quest stats.
import assert from "node:assert/strict";
import { todayPractice, speedTip, mergeSpeed, yesterdayAccuracy } from "../utils/todayPractice.js";
import { updateStats } from "../utils/kidStats.js";

const papers = [{ id: "en-1" }, { id: "en-2" }, { id: "sci-1" }];
const now = new Date(2026, 10, 10, 18).getTime();
const y = "2026-11-09";

let t = todayPractice({ papers, history: [{ paperId: "en-1" }], daily: { [y]: { answered: 10, correct: 8 } }, now });
assert.equal(t.paper.id, "en-2");
assert.equal(t.done, 1);
assert.equal(t.total, 3);
assert.equal(t.yesterday, 80);
assert.equal(t.tip, null);
assert.equal(todayPractice({ papers, history: papers.map((p) => ({ paperId: p.id })) }), null, "all done: no card");
assert.equal(todayPractice({ papers: [] }), null);
assert.equal(yesterdayAccuracy({}, now), null, "no practice yesterday: no number");

// Tip only with enough answers and a real gap; both numbers shown.
assert.equal(speedTip({ quick: { answered: 9, correct: 4 }, slow: { answered: 50, correct: 45 } }), null);
assert.equal(speedTip({ quick: { answered: 20, correct: 17 }, slow: { answered: 50, correct: 45 } }), null, "no real gap");
assert.match(speedTip({ quick: { answered: 109, correct: 58 }, slow: { answered: 607, correct: 523 } }), /53% right.*86% right/);
assert.deepEqual(mergeSpeed([{ quick: { answered: 1, correct: 1 } }, null, { slow: { answered: 2, correct: 1 } }]), { quick: { answered: 1, correct: 1 }, slow: { answered: 2, correct: 1 } });

// updateStats counts quick taps (< 3 s) and slower answers; answers without a time are skipped.
const s1 = updateStats({}, [{ isCorrect: false, timeMs: 1000 }, { isCorrect: true, timeMs: 5000 }, { isCorrect: true }], { now });
assert.deepEqual(s1.speed, { quick: { answered: 1, correct: 0 }, slow: { answered: 1, correct: 1 } });
const s2 = updateStats(s1, [{ isCorrect: true, timeMs: 2999 }], { now });
assert.deepEqual(s2.speed.quick, { answered: 2, correct: 1 });
assert.deepEqual(s1.speed.quick, { answered: 1, correct: 0 }, "previous stats not mutated");
console.log("todayPractice tests passed!");

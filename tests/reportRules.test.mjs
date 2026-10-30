// Tests for functions/utils/reportRules.js (🚩 report auto-marking). Run: npm test
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const R = require("../functions/utils/reportRules.js");

// Distinct kids: the same kid reporting 3 times counts once.
let rep = {};
rep = R.addReporter(rep, { uid: "k1", reason: "spelling", answered: false });
rep = R.addReporter(rep, { uid: "k1", reason: "spelling", answered: false });
rep = R.addReporter(rep, { uid: "k1", reason: "spelling", answered: false });
assert.equal(R.countReporters(rep).distinct, 1);
assert.deepEqual(R.decideStatus(R.countReporters(rep)), { status: "none", needsAdmin: false });

// 3 different kids, any reason -> known
rep = R.addReporter(rep, { uid: "k2", reason: "confusing" });
rep = R.addReporter(rep, { uid: "k3", reason: "wrong_answer", answered: true });
let c = R.countReporters(rep);
assert.equal(c.distinct, 3);
assert.deepEqual(R.decideStatus(c), { status: "known", needsAdmin: false });

// Hide needs 5 kids with "wrong_answer" who ANSWERED (anti-gaming)
let w = {};
for (const k of ["a", "b", "c", "d"]) w = R.addReporter(w, { uid: k, reason: "wrong_answer", answered: true });
w = R.addReporter(w, { uid: "e", reason: "wrong_answer", answered: false }); // looked, didn't answer
c = R.countReporters(w);
assert.equal(c.wrongAnswerAnswered, 4);
assert.equal(R.decideStatus(c).status, "known");
w = R.addReporter(w, { uid: "f", reason: "wrong_answer", answered: true });
assert.deepEqual(R.decideStatus(R.countReporters(w)), { status: "hidden", needsAdmin: false });

// Pool starvation (gate: pool 15, draw 10, >= 2 per sub-topic)
assert.equal(R.canHide({ isGate: true, visibleTotal: 15, visibleInSubtopic: 4 }), true);
assert.equal(R.canHide({ isGate: true, visibleTotal: 15, visibleInSubtopic: 2 }), false, "sub-topic would drop to 1");
assert.equal(R.canHide({ isGate: true, visibleTotal: 10, visibleInSubtopic: 4 }), false, "pool would drop below draw count");
assert.equal(R.canHide({ isGate: true, visibleTotal: 11, visibleInSubtopic: 3 }), true);
// Non-gate quizzes keep at least 5 visible
assert.equal(R.canHide({ isGate: false, visibleTotal: 6 }), true);
assert.equal(R.canHide({ isGate: false, visibleTotal: 5 }), false);
// Starved -> known + needsAdmin instead of hidden
assert.deepEqual(R.decideStatus(R.countReporters(w), R.DEFAULT_SETTINGS, false), { status: "known", needsAdmin: true });

// Settings are respected
assert.equal(R.decideStatus({ distinct: 2, wrongAnswerAnswered: 0 }, { knownAt: 2, hideAt: 9 }).status, "known");

// Never downgrade automatically
assert.deepEqual(R.mergeStatus({ status: "hidden", needsAdmin: false }, { status: "known", needsAdmin: false }), { status: "hidden", needsAdmin: false });
assert.deepEqual(R.mergeStatus({ status: "known", needsAdmin: false }, { status: "hidden", needsAdmin: false }), { status: "hidden", needsAdmin: false });
assert.deepEqual(R.mergeStatus(null, { status: "known", needsAdmin: true }), { status: "known", needsAdmin: true });

assert.deepEqual(R.REASONS, ["wrong_answer", "spelling", "confusing", "media_broken", "other"]);
console.log("reportRules: all tests passed");

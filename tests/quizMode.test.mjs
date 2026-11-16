import assert from "node:assert/strict";
import { modeFor, isExamOnly } from "../utils/quizMode.js";
assert.equal(modeFor("gate", "training"), "exam", "a Challenge is always exam style");
assert.equal(modeFor("boss", "training"), "exam", "a Unit Boss is always exam style");
assert.equal(modeFor("practice", "training"), "training", "practice keeps the choice");
assert.equal(modeFor(undefined, "exam"), "exam");
assert.equal(modeFor(undefined, "anything"), "training");
assert.ok(isExamOnly("gate") && !isExamOnly("practice"));
console.log("quizMode tests passed");

// Tests for utils/celebrate.js (map confetti). Run: npm test
import assert from "node:assert/strict";
import { achievementSnapshot, shouldCelebrate } from "../utils/celebrate.js";

const path = (a, b, boss) => [
  { id: "a", kind: "main", cleared: a !== null, mastered: a === "mastered" },
  { id: "b", kind: "main", cleared: b !== null, mastered: b === "mastered" },
  { id: "boss", kind: "boss", status: boss ? "completed" : "unlocked" },
];
const s0 = achievementSnapshot(path(null, null, false));
const s1 = achievementSnapshot(path("cleared", null, false));
const s2 = achievementSnapshot(path("mastered", null, false));
const s3 = achievementSnapshot(path("mastered", "cleared", true));
assert.equal(shouldCelebrate(null, s1), false, "first load never celebrates");
assert.equal(shouldCelebrate(s0, s0), false, "no change");
assert.equal(shouldCelebrate(s0, s1), true, "new topic cleared");
assert.equal(shouldCelebrate(s1, s2), true, "cleared → mastered");
assert.equal(shouldCelebrate(s2, s3), true, "boss passed");
assert.equal(shouldCelebrate(s2, s1), false, "going down (e.g. tester reset) never celebrates");
assert.deepEqual(achievementSnapshot([{ id: "x", kind: "practice" }]), {});
console.log("celebrate: all tests passed");

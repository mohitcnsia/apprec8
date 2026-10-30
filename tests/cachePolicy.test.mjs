// Tests for utils/cachePolicy.js. Run: npm test
import assert from "node:assert/strict";
import { isFresh, makeEntry, contentIdsForUnit, DEFAULT_MAX_AGE_MS, cacheKeys } from "../utils/cachePolicy.js";

const now = 1_000_000_000_000;
const e = makeEntry(42, [1, 2], now);
assert.equal(isFresh(e, 42, { now }), true);
assert.equal(isFresh(e, 43, { now }), false, "new content version → refetch");
assert.equal(isFresh(e, undefined, { now }), false, "unknown version → never trust");
assert.equal(isFresh(e, 42, { now: now + DEFAULT_MAX_AGE_MS + 1 }), false, "older than 7 days → refetch");
assert.equal(isFresh(e, 42, { now: now + DEFAULT_MAX_AGE_MS - 1 }), true);
assert.equal(isFresh(null, 42, { now }), false);
assert.equal(isFresh(makeEntry(42, null, now), 42, { now }), false, "empty data is never fresh");
assert.equal(isFresh({ version: 42, data: [] }, 42, { now }), false, "missing savedAt → refetch");

const nodes = [
  { id: "m", kind: "main", unitId: "u1", steps: [{ type: "study", contentId: "s1" }, { type: "quiz", quizId: "q1" }] },
  { id: "p", kind: "practice", unitId: "u1", steps: [{ type: "reading", contentId: "r1" }, { type: "quiz", quizId: "q1" }] },
  { id: "g", kind: "gate", unitId: "u1", quizId: "gate" },
  { id: "b", kind: "boss", unitId: "u1", quizId: "boss" },
  { id: "x", kind: "main", unitId: "u2", steps: [{ type: "quiz", quizId: "other" }] },
];
assert.deepEqual(contentIdsForUnit(nodes, "u1"), { quizIds: ["q1", "gate", "boss"], studyIds: ["s1", "r1"] });
assert.deepEqual(contentIdsForUnit(nodes, "nope"), { quizIds: [], studyIds: [] });
assert.equal(cacheKeys.quiz("q1"), "eqc:quiz:q1");
console.log("cachePolicy: all tests passed");

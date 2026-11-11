// Tests for utils/topicLevels.js (New → Practising → Learned → Still remembers / Slipping). Run: npm test
import assert from "node:assert/strict";
import { updateLevels, levelOf, levelsFromStats, questionKey, isHardAttempt } from "../utils/topicLevels.js";
import { dayKey } from "../utils/kidStats.js";

const DAY = 864e5;
const t0 = new Date(2026, 10, 2, 10).getTime();
const ans = (n, right, from = 0, topic = "tenses") => Array.from({ length: n }, (_, i) => ({ isCorrect: i < right, subtopic: topic, questionId: `q${from + i}` }));

assert.notEqual(questionKey("a", 1), questionKey("a", 2));
assert.equal(questionKey("a", 1), questionKey("a", 1));
assert.ok(isHardAttempt({ activity: "gate" }) && isHardAttempt({ difficulty: "hard" }) && !isHardAttempt({ activity: "practice", difficulty: "easy" }));

// Never practised = New; some answers = Practising.
assert.equal(levelOf(undefined), "new");
let L = updateLevels({}, ans(4, 4), { now: t0, quizId: "z", dayKey });
assert.equal(levelOf(L.tenses), "practising");

// 8 new questions, all right, but on ONE day and no hard step: still Practising.
L = updateLevels({}, ans(8, 8), { now: t0, quizId: "z", dayKey });
assert.equal(levelOf(L.tenses), "practising");

// Same 8 questions again the next day (repeats don't count), with a gate: still not Learned (only one day of new questions).
L = updateLevels(L, ans(8, 8), { now: t0 + DAY, quizId: "z", activity: "gate", dayKey });
assert.equal(levelOf(L.tenses), "practising", "repeated questions don't count");

// New questions on a second day + a right answer in a gate → Learned.
L = updateLevels(L, ans(4, 4, 100), { now: t0 + DAY, quizId: "z", activity: "gate", dayKey });
assert.equal(levelOf(L.tenses), "learned");
const learnedAt = L.tenses.learnedAt;
assert.equal(learnedAt, t0 + DAY);

// Under 80% on new questions: not Learned.
let M = updateLevels({}, ans(5, 5, 0, "modals"), { now: t0, quizId: "m", activity: "boss", dayKey });
M = updateLevels(M, ans(5, 2, 50, "modals"), { now: t0 + DAY, quizId: "m", dayKey });
assert.equal(levelOf(M.modals), "practising");

// A week later: right again → Still remembers; mostly wrong → Slipping.
const later = learnedAt + 7 * DAY;
const R = updateLevels(L, ans(3, 3, 200), { now: later, quizId: "z", dayKey });
assert.equal(levelOf(R.tenses), "remembers");
const S = updateLevels(L, ans(3, 1, 300), { now: later, quizId: "z", dayKey });
assert.equal(levelOf(S.tenses), "slipping");
// Answers within 6 days of Learned don't count as the re-check.
const E = updateLevels(L, ans(3, 0, 400), { now: learnedAt + 2 * DAY, quizId: "z", dayKey });
assert.equal(levelOf(E.tenses), "learned");

// Old answers (before levels) = Practising, not New; levelsFromStats covers both.
assert.deepEqual(levelsFromStats({ bySubtopic: { nouns: { correct: 3, total: 5 } }, levels: { tenses: L.tenses } }), { nouns: "practising", tenses: "learned" });

// Small: a topic keeps at most 40 question keys.
let big = {};
for (let i = 0; i < 10; i++) big = updateLevels(big, ans(10, 10, i * 10), { now: t0 + i * DAY, quizId: "b", dayKey });
assert.ok(big.tenses.seen.length <= 40);
assert.ok(JSON.stringify(big).length < 1200, "one topic stays under ~1 KB");

console.log("topicLevels tests passed");

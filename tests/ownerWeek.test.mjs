// Tests for functions/callable/ownerActions.js (owner's weekly "Is it working?"). Run: npm test
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { _ownerForTests: o } = require("../functions/callable/ownerActions.js");

const DAY = 864e5;
const now = Date.UTC(2026, 10, 12, 8); // Thursday 12 Nov, 1:30 pm India
const ws = o.weekStartMs(now);
assert.equal(new Date(ws + 5.5 * 3600e3).toISOString().slice(0, 10), "2026-11-09", "week starts Monday (India)");
const key = (ms) => new Date(ms).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

const strongStats = { answered: 100, correct: 90, daily: { [key(now)]: { answered: 10, correct: 9 }, [key(now - DAY)]: { answered: 5, correct: 5 } }, levels: { tenses: { learnedAt: now - DAY, recheck: [] }, nouns: { learnedAt: now - 20 * DAY, recheck: [1, 1, 1] } } };
const weakStats = { answered: 20, correct: 8, daily: { [key(ws - 2 * DAY)]: { answered: 6, correct: 2 } } };
const r = o.summarizeWeek({
  progressDocs: [
    { uid: "a", stats: strongStats },
    { uid: "b", stats: strongStats },
    { uid: "c", stats: strongStats },
    { uid: "w", stats: weakStats },
  ],
  attempts: ["a", "b", "c", "w"].map((u) => ({ userId: u, quizId: "z", answers: [{ questionId: "q1", questionText: "Pick the verb", correctAnswer: "run", isCorrect: u === "w", chosen: "fast" }] })),
  moods: [{ mood: "happy" }, { mood: "sad", flag: "asked" }],
  appreciations: [{ names: ["A", "B"] }],
  now,
});
assert.deepEqual(r.kids, { practised: 3, practisedLast: 1, twoPlusDays: 3, total: 4 });
assert.equal(r.topics.learnedThisWeek, 3);
assert.equal(r.topics.remembersNow, 3);
assert.equal(r.problems.length, 1, "strong kids all wrong, the weak kid right → a likely wrong answer key");
assert.deepEqual([r.problems[0].text, r.problems[0].strongWrong, r.problems[0].strongTotal, r.problems[0].topWrong], ["Pick the verb", 3, 3, "fast"]);
assert.deepEqual(r.mood, { answered: 2, counts: { happy: 1, sad: 1 }, flagged: 1 });
assert.equal(r.appreciated, 2);
assert.equal(r.answers.accuracy, 93);

console.log("ownerWeek tests passed");

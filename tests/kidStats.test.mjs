// Tests for utils/kidStats.js (admin dashboard summary). Run: npm test
import assert from "node:assert/strict";
import { updateStats, summarize, accuracy, weakTopics, activeIn, timeAgo, formatDuration, dayKey, DAYS_KEPT } from "../utils/kidStats.js";

const DAY = 24 * 60 * 60 * 1000;
const t0 = new Date(2026, 10, 1, 10, 0).getTime(); // 1 Nov 2026, 10:00 local

let s = updateStats(undefined, [
  { isCorrect: true, subtopic: "gender" },
  { isCorrect: false, subtopic: "gender" },
  { isCorrect: true },
], { now: t0, durationMs: 120000, questId: "eq", userName: "Riya" });
assert.equal(s.answered, 3); assert.equal(s.correct, 2); assert.equal(s.attempts, 1);
assert.deepEqual(s.bySubtopic.gender, { correct: 1, total: 2 });
assert.equal(s.daily[dayKey(t0)].answered, 3);
assert.equal(s.userName, "Riya"); assert.equal(s.questId, "eq"); assert.equal(s.lastActiveAt, t0);

// time per attempt is capped at 30 min (app left open)
s = updateStats(s, [{ isCorrect: false, subtopic: "gender" }], { now: t0 + 1000, durationMs: 5 * 60 * 60 * 1000 });
assert.equal(s.totalTimeMs, 120000 + 30 * 60 * 1000);
assert.equal(s.userName, "Riya", "keeps the name when not given");

// next day + old days are dropped after DAYS_KEPT
s = updateStats(s, [{ isCorrect: true, subtopic: "plural" }], { now: t0 + DAY });
assert.ok(s.daily[dayKey(t0)] && s.daily[dayKey(t0 + DAY)]);
const later = updateStats(s, [{ isCorrect: true }], { now: t0 + DAYS_KEPT * DAY });
assert.ok(!later.daily[dayKey(t0)], "days older than DAYS_KEPT are removed");

// ranges
const now = t0 + DAY;
assert.deepEqual(summarize(s, "today", now), { answered: 1, correct: 1, timeMs: 0 });
assert.equal(summarize(s, "week", now).answered, 5);
assert.equal(summarize(s, "all", now).answered, 5);
assert.equal(accuracy({ answered: 4, correct: 3 }), 75);
assert.equal(accuracy({ answered: 0, correct: 0 }), null);
assert.equal(activeIn(s, "today", now), true);
assert.equal(activeIn(s, "today", now + 2 * DAY), false);
assert.equal(activeIn({}, "all"), false);

// weak topics: >= 3 answers and < 60%
const w = weakTopics({ bySubtopic: { gender: { correct: 1, total: 4 }, plural: { correct: 5, total: 5 }, articles: { correct: 0, total: 2 }, verbs: { correct: 2, total: 5 } } });
assert.deepEqual(w.map((x) => x.subtopic), ["gender", "verbs"]);
assert.equal(w[0].percent, 25);

// formatting
assert.equal(timeAgo(now - 5 * 60000, now), "5 min ago");
assert.equal(timeAgo(now - 2 * 3600000, now), "2 h ago");
assert.equal(timeAgo(now - 30 * 3600000, now), "yesterday");
assert.equal(timeAgo(null), "never");
assert.equal(formatDuration(12 * 60000), "12 min");
assert.equal(formatDuration(95 * 60000), "1 h 35 m");
console.log("kidStats: all tests passed");

// Finding 20: answers without a sub-topic count under the topic fallback (Unit 0)
{
  const { topicSlug } = await import("../utils/kidStats.js");
  assert.equal(topicSlug("Kinds of sentences"), "kinds-of-sentences");
  assert.equal(topicSlug("Reading: Tara's paper boat"), "reading-taras-paper-boat");
  assert.equal(topicSlug(""), "");
  const f = updateStats(undefined, [
    { isCorrect: true },
    { isCorrect: false },
    { isCorrect: true, subtopic: "gender" },
  ], { now: t0, topicFallback: "kinds-of-sentences" });
  assert.deepEqual(f.bySubtopic["kinds-of-sentences"], { correct: 1, total: 2 });
  assert.deepEqual(f.bySubtopic.gender, { correct: 1, total: 1 });
  // no fallback → untagged answers still skipped
  const g = updateStats(undefined, [{ isCorrect: true }], { now: t0 });
  assert.deepEqual(g.bySubtopic, {});
}
console.log("kidStats topic fallback: ok");

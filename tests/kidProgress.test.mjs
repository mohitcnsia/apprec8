// Tests for utils/kidProgress.js (the kid's Progress screen). Run: npm test
import assert from "node:assert/strict";
import { encouragement, nearGoal, topicLists } from "../utils/kidProgress.js";
import { dayKey } from "../utils/kidStats.js";

const now = new Date(2026, 10, 11, 18).getTime();
const DAY = 864e5;
const daily = (entries) => Object.fromEntries(entries.map(([ago, answered, correct]) => [dayKey(now - ago * DAY), { answered, correct }]));

// Encouragement: good news first; a worse week is never pointed out.
assert.equal(encouragement({ daily: {}, now }).headline, "A new week! One quiz today starts your streak.");
let e = encouragement({ daily: daily([[0, 10, 9], [1, 10, 8], [8, 10, 5]]), now, grade: 4 });
assert.match(e.headline, /12 more right than last week/);
assert.equal(e.line, "17 right this week", "Class 5 and below: right counts");
e = encouragement({ daily: daily([[0, 10, 9], [8, 10, 5]]), now, grade: 10 });
assert.equal(e.line, "90% accuracy this week, up from 50%");
e = encouragement({ daily: daily([[0, 10, 4], [8, 10, 9]]), now, grade: 10, streak: 3 });
assert.match(e.headline, /3 days in a row/);
assert.equal(e.line, "40% accuracy this week", "a drop is not pointed out");
assert.doesNotMatch(JSON.stringify(e), /down|less|worse|behind/);

// Near goal: the next classmate up, never the gap to the top.
const rows = [
  { uid: "a", firstName: "Meera", points: 30 },
  { uid: "b", firstName: "Aman Kumar", points: 20 },
  { uid: "me", firstName: "Riya", points: 18 },
];
assert.equal(nearGoal(rows, "me"), "3 more right answers to pass Aman this week");
assert.equal(nearGoal([{ uid: "x", points: 5 }, { uid: "me", points: 5 }], "me"), "1 more right answer to pass a classmate this week");
assert.equal(nearGoal(rows, "a"), "You're #1 in your class this week! 🏆");
assert.equal(nearGoal(rows, "nobody"), null);
assert.equal(nearGoal([{ uid: "me", points: 9 }], "me"), null, "alone in the class: no board talk");

// Topic lists: Learned from levels; old answers 80%+ = Doing well; slipping first in Needs practice.
const lists = topicLists([
  {
    questId: "eq",
    namer: (t) => t.toUpperCase(),
    stats: {
      bySubtopic: { nouns: { correct: 9, total: 10 }, verbs: { correct: 2, total: 10 }, modals: { correct: 6, total: 10 }, tenses: { correct: 8, total: 10 } },
      levels: { tenses: { seen: ["x"], learnedAt: 1, recheck: [1, 0, 0] }, modals: { seen: ["y"], learnedAt: 1, recheck: [1, 1, 1] } },
    },
  },
]);
assert.deepEqual(lists.learned.map((t) => [t.name, t.level]), [["MODALS", "remembers"]]);
assert.deepEqual(lists.doingWell.map((t) => t.name), ["NOUNS"]);
assert.deepEqual(lists.needs.map((t) => [t.name, t.level]), [["TENSES", "slipping"], ["VERBS", "practising"]]);

console.log("kidProgress tests passed");

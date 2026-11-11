// Tests for utils/tonight.js (the parent's card on Home). Run: npm test
import assert from "node:assert/strict";
import { practisedToday, daysThisWeek, praiseLine, recordAnswer, recordPraise, tonightProgress, prune } from "../utils/tonight.js";
import { dayKey } from "../utils/kidStats.js";

const now = new Date(2026, 10, 11, 20).getTime();
const DAY = 864e5;
const q = (days) => ({ stats: { daily: Object.fromEntries(days.map((d) => [dayKey(now - d * DAY), { answered: 5, correct: 4 }])) } });

assert.equal(practisedToday([q([0])], now), true);
assert.equal(practisedToday([q([1])], now), false);
assert.equal(practisedToday([], now), false);
assert.equal(daysThisWeek([q([0, 2]), q([2, 5, 9])], now), 3, "each day once, last 7 days only");
// Praise matches tonight (owner, 2026-11-11): 0 right never gets the same words as 5 right.
assert.match(praiseLine("Riya", { right: 5, total: 5, strongTopic: "Tenses", strongRight: true }), /almost all of them! You really know Tenses/);
assert.doesNotMatch(praiseLine("Riya", { right: 4, total: 5, strongTopic: "Tenses", strongRight: false }), /Tenses/, "strong topic only if right tonight");
assert.match(praiseLine("Riya", { right: 2, total: 5 }), /You got 2 right, and you kept trying/);
assert.match(praiseLine("Riya", { right: 0, total: 5, strongTopic: "Tenses", strongRight: false }), /These were hard, and you didn't give up/);
assert.doesNotMatch(praiseLine("Riya", { right: 0, total: 5 }), /knew|really know/);
assert.match(praiseLine("Riya", { right: 0, total: 0 }), /proud of you for practising/);

const qs = [{ key: "a" }, { key: "b" }, { key: "c" }];
let s = null;
assert.deepEqual(tonightProgress(s, 100, "kid", qs), { step: 0, right: 0, help: 0 });
s = recordAnswer(s, 100, "kid", "a", "right");
s = recordAnswer(s, 100, "kid", "b", "help");
assert.deepEqual(tonightProgress(s, 100, "kid", qs), { step: 2, right: 1, help: 1 });
s = recordAnswer(s, 100, "kid", "c", "right");
assert.equal(tonightProgress(s, 100, "kid", qs).step, "praise");
s = recordPraise(s, 100, "kid");
assert.deepEqual(tonightProgress(s, 100, "kid", qs), { step: "done", right: 2, help: 1 });
assert.equal(tonightProgress(s, 101, "kid", qs).step, 0, "a new day starts again");
assert.equal(tonightProgress(s, 100, "other", qs).step, 0, "each child separately");
assert.deepEqual(Object.keys(prune({ 90: {}, 99: {} }, 100)), ["99"]);
assert.equal(tonightProgress(null, 100, "kid", []).step, "praise", "no questions: straight to praise");

console.log("tonight tests passed");
import { praiseLine as pl } from "../utils/tonight.js";
if (/almost all/.test(pl("Riya", { right: 1, total: 2 }))) throw new Error("1 of 2 is not almost all");
if (!/almost all/.test(pl("Riya", { right: 4, total: 5 }))) throw new Error("4 of 5 is almost all");
console.log("tonight praise edge passed");

// Tests for utils/mood.js (weekly mood check). Run: npm test
import assert from "node:assert/strict";
import { MOODS, MESSAGES, shouldAskMood, moodFlag, CALM, HELPLINES } from "../utils/mood.js";

// Once a week, never on the first day.
assert.equal(shouldAskMood({ today: 100 }), true);
assert.equal(shouldAskMood({ today: 100, firstDay: 100 }), false);
assert.equal(shouldAskMood({ today: 106, lastAnsweredDay: 100 }), false);
assert.equal(shouldAskMood({ today: 107, lastAnsweredDay: 100 }), true);
assert.equal(shouldAskMood({ today: null }), false);

// One sad tap alone reaches nobody; "for a while", asking, or sad two weeks running does.
assert.equal(moodFlag({ mood: "happy", day: 100 }), null);
assert.equal(moodFlag({ mood: "sad", span: "today", day: 100 }), null);
assert.equal(moodFlag({ mood: "sad", span: "while", day: 100 }), "for-a-while");
assert.equal(moodFlag({ mood: "okay", tellCounsellor: true, day: 100 }), "asked");
assert.equal(moodFlag({ mood: "sad", span: "today", prev: { mood: "sad", day: 93 }, day: 100 }), "sad-2-weeks");
assert.equal(moodFlag({ mood: "sad", span: "today", prev: { mood: "sad", day: 98 }, day: 100 }), null, "same week");
assert.equal(moodFlag({ mood: "sad", span: "today", prev: { mood: "sad", day: 60 }, day: 100 }), null, "long ago");
assert.equal(moodFlag({ mood: "sad", span: "today", prev: { mood: "okay", day: 93 }, day: 100 }), null);

// Every mood has its message; helplines are the official numbers; Seema's 9 strategies.
MOODS.forEach((m) => assert.ok(MESSAGES[m.id], m.id));
assert.deepEqual(HELPLINES.map((h) => h.tel), ["1098", "14416"]);
assert.equal(CALM.length, 9);

console.log("mood tests passed");

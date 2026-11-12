// Tests for functions/utils/people.js (the owner's People screen). Run: npm test
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { personRow, kindOf, summarize } = require("../functions/utils/people.js");

const H = 3600e3, now = Date.parse("2026-11-13T10:00:00Z");
assert.equal(kindOf({ teachesClassIds: ["c"] }), "teacher");
assert.equal(kindOf({ isChild: true, grade: 5 }), "child");
assert.equal(kindOf({ childUids: ["k"], grade: 10 }), "parent");
assert.equal(kindOf({ grade: 7 }), "student");
assert.equal(kindOf({}), "none");

const joshi = personRow({ uid: "j", doc: { firstName: "Seema Joshi", createdAt: now - 4 * 24 * H }, auth: { email: "jo@x.com", lastRefreshTime: new Date(now - H).toUTCString(), providers: ["google.com"] }, now });
assert.equal(joshi.name, "Seema");
assert.equal(joshi.kind, "none");
assert.equal(joshi.stuck, true, "signed in days ago, picked nothing: stuck");
assert.equal(joshi.via, "Google");
assert.equal(joshi.lastSeenAt, Date.parse(new Date(now - H).toUTCString()));

const fresh = personRow({ uid: "f", doc: { createdAt: now - 10 * 60e3 }, now });
assert.equal(fresh.stuck, false, "under an hour: not stuck yet");

const kunal = personRow({ uid: "k", doc: { firstName: "Kunal", grade: 7, pendingClassIds: ["c7"], stats: { totalQuizzesCompleted: 3, totalStars: 12 }, createdAt: { _seconds: (now - 2 * H) / 1000 } }, className: { c7: "7-A" }, now });
assert.deepEqual([kunal.kind, kunal.grade, kunal.waiting[0], kunal.quizzes, kunal.stars, kunal.stuck], ["student", 7, "7-A", 3, 12, false]);

const child = personRow({ uid: "c", doc: { isChild: true, firstName: "Riya", grade: 5, createdAt: now - H }, auth: null, now });
assert.equal(child.via, "added by a parent");

const c = summarize([joshi, fresh, kunal, child], now);
assert.deepEqual(c, { total: 4, newToday: 3, stuck: 1 });
console.log("people tests passed");

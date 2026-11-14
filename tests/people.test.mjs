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

// Help buttons (owner 13-14 Nov).
{
  const { helpCheck } = require("../functions/utils/people.js");
  const owner = { uid: "own", appAdmin: true, adminOfSchools: [] };
  const seema = { uid: "see", appAdmin: false, adminOfSchools: ["glor"] };
  const kunal = { exists: true, uid: "k", data: { grade: 7, firstName: "Kunal" } };
  const c7 = { id: "c7", schoolId: "glor", grade: 7, name: "7-A", teacherIds: [] };
  const other = { id: "x", schoolId: "else", grade: 7 };
  assert.equal(helpCheck({ action: "class", target: kunal, cls: c7, caller: owner }).ok, true);
  assert.equal(helpCheck({ action: "class", target: kunal, cls: c7, caller: seema }).ok, true, "school admin, own school");
  assert.equal(helpCheck({ action: "class", target: kunal, cls: other, caller: seema }).error, "permission-denied", "not another school");
  assert.equal(helpCheck({ action: "class", target: { exists: true, uid: "k", data: { grade: 7, firstName: "Kunal", pendingClassIds: ["c7"] } }, cls: c7, caller: owner }).error, "already-exists");
  assert.equal(helpCheck({ action: "class", target: { exists: true, uid: "n", data: {} }, cls: c7, caller: owner }).error, "invalid-argument", "no name: ask for one");
  const named = helpCheck({ action: "class", target: { exists: true, uid: "n", data: {} }, cls: c7, caller: owner, firstName: "Ehsaas Kumari" });
  assert.deepEqual([named.firstName, named.grade], ["Ehsaas", 7], "name typed, class number from the class");
  assert.equal(helpCheck({ action: "class", target: { exists: true, uid: "p", data: { childUids: ["c"] } }, cls: c7, caller: owner }).error, "failed-precondition", "parents add the child first");
  assert.equal(helpCheck({ action: "teacher", target: kunal, cls: c7, caller: owner, subjects: [] }).error, "invalid-argument");
  assert.deepEqual(helpCheck({ action: "teacher", target: kunal, cls: c7, caller: owner, subjects: ["english", "hack"] }).subjects, ["english"]);
  assert.equal(helpCheck({ action: "delete", target: kunal, caller: seema, typed: "DELETE" }).error, "permission-denied", "only the owner deletes");
  assert.equal(helpCheck({ action: "delete", target: kunal, caller: owner, typed: "delete it" }).error, "invalid-argument", "typed confirmation");
  assert.equal(helpCheck({ action: "delete", target: kunal, caller: owner, typed: " DELETE " }).ok, true);
  assert.equal(helpCheck({ action: "delete", target: { ...kunal, isOwner: true }, caller: owner, typed: "DELETE" }).error, "failed-precondition");
  assert.equal(helpCheck({ action: "delete", target: { exists: true, uid: "own" }, caller: owner, typed: "DELETE" }).error, "failed-precondition", "not yourself");
  console.log("people: help checks ok");
}

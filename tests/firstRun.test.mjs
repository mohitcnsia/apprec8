// tests/firstRun.test.mjs — first-run sheet (utils/firstRun.js)
import assert from "node:assert/strict";
import { needsFirstRun, cleanName, canSave, firstRunUpdate, bubbleText } from "../utils/firstRun.js";

assert.equal(needsFirstRun(null), false, "wait until the doc exists");
assert.equal(needsFirstRun({ firstName: "", grade: 5 }), true);
assert.equal(needsFirstRun({ firstName: "Pratha" }), true, "no class yet");
assert.equal(needsFirstRun({ firstName: "Mohit" }, { grownUp: true }), false);
assert.equal(needsFirstRun({ firstName: "Pratha", grade: 5 }), false);
assert.equal(needsFirstRun({ isChild: true }), false);

assert.equal(cleanName("  Pratha   S  "), "Pratha S");
assert.equal(canSave({ name: "P", grade: 5 }), true);
assert.equal(canSave({ name: "P", role: "parent" }), true);
assert.equal(canSave({ name: " ", grade: 5 }), false);
assert.equal(canSave({ name: "P" }), false);

const STAMP = { server: true };
const u = firstRunUpdate({ photoURL: "" }, { name: " Pratha ", grade: 5 }, { stamp: STAMP, defaultAvatar: "A" });
assert.deepEqual(u, { firstName: "Pratha", lastName: "", photoURL: "A", lastUpdatedAt: STAMP, profileLastSavedAt: STAMP, grade: 5 });
// only rule-allowed keys
assert.ok(Object.keys(u).every((k) => ["firstName", "lastName", "photoURL", "lastUpdatedAt", "profileLastSavedAt", "grade"].includes(k)));
assert.equal(firstRunUpdate({ grade: 4 }, { name: "P", grade: 5 }, { stamp: STAMP, defaultAvatar: "A" }).grade, undefined, "class set once");
assert.equal(firstRunUpdate({}, { name: "M", grade: 5, role: "parent" }, { stamp: STAMP, defaultAvatar: "A" }).grade, undefined);
assert.equal(firstRunUpdate({ photoURL: "g.jpg", lastName: "C" }, { name: "M", role: "teacher" }, { stamp: STAMP, defaultAvatar: "A" }).photoURL, "g.jpg");

assert.equal(bubbleText({ name: "" }), "Hi! What's your name?");
assert.equal(bubbleText({ name: "pratha" }), "Hi pratha! 👋");
assert.equal(bubbleText({ name: "Pratha", grade: 5 }), "Class 5! Let's go, Pratha! 🚀");
assert.equal(bubbleText({ name: "Seema", role: "teacher" }), "Hello, Seema! 🍎");
// A grown-up by its data never sees the sheet again (new phone, Demo School logins)
assert.equal(needsFirstRun({ firstName: "Demo", isDemo: true }), false, "demo logins");
assert.equal(needsFirstRun({ firstName: "Mohit", childUids: ["k"] }), false, "parent on a new phone");
assert.equal(needsFirstRun({ firstName: "Seema", teachesClassIds: ["c"] }), false, "teacher on a new phone");
assert.equal(needsFirstRun({ firstName: "Asha" }), true, "unknown grown-up still asked once");
// No write when nothing changed (owner 2026-11-09)
{
  const { needsProfileSave } = await import("../utils/firstRun.js");
  assert.equal(needsProfileSave({ firstName: "Seema", photoURL: "x" }, { name: "Seema", role: "teacher" }), false, "same grown-up: no write");
  assert.equal(needsProfileSave({ firstName: "Seema", photoURL: "x" }, { name: "Seema J", role: "teacher" }), false, "grown-up with a name: never write here");
  assert.equal(needsProfileSave({ firstName: "Seema" }, { name: "Seema", role: "parent" }), false, "no photo either: still no write");
  assert.equal(needsProfileSave({ firstName: "Ria", photoURL: "x" }, { name: "Ria", grade: 5 }), true, "child without a class yet: write");
  assert.equal(needsProfileSave({ firstName: "Ria", photoURL: "x", grade: 5 }, { name: "Ria", grade: 5 }), false);
  assert.equal(needsProfileSave({}, { name: "Asha", role: "learner" }), true, "new account: write");
}
console.log("firstRun tests passed");

// Grown-up who just wants to learn (owner 14 Nov): a level, saved as a class number.
{
  const { LEVELS, levelLabel } = await import("../utils/firstRun.js");
  assert.deepEqual(LEVELS.map((l) => l.grade), [5, 8, 10]);
  assert.equal(canSave({ name: "Kamla", role: "learner" }), false, "a level is needed");
  assert.equal(canSave({ name: "Kamla", role: "learner", grade: 7 }), false, "only the three levels");
  assert.equal(canSave({ name: "Kamla", role: "learner", grade: 5 }), true);
  assert.equal(firstRunUpdate({}, { name: "Kamla", role: "learner", grade: 5 }, { stamp: 1, defaultAvatar: "a" }).grade, 5);
  assert.equal(firstRunUpdate({}, { name: "Sunita", role: "parent", grade: 5 }, { stamp: 1, defaultAvatar: "a" }).grade, undefined, "a parent gets no class");
  assert.equal(levelLabel(8), "Medium");
  assert.ok(bubbleText({ name: "Kamla", role: "learner" }).includes("every age"));
  console.log("firstRun: grown-up learner ok");
}

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
console.log("firstRun tests passed");

// tests/remindAssignment.test.mjs
// Verifies teacher assignment reminder logic, message formatting, and daily throttling
import assert from "node:assert/strict";
import { formatRemindMessage, canRemindStudent } from "../utils/assignmentResults.js";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { _remindForTests } = require("../functions/callable/remindActions.js");

console.log("Running remindAssignment tests...");

// 1. Message formatting
assert.equal(
  formatRemindMessage("Seema Ma'am", "Determiners", 6),
  "Seema Ma'am: finish Determiners — 6 mistakes to fix"
);
assert.equal(
  formatRemindMessage("Seema Ma'am", "Determiners", 1),
  "Seema Ma'am: finish Determiners — 1 mistake to fix"
);
assert.equal(
  formatRemindMessage("Seema Ma'am", "Determiners", 0),
  "Seema Ma'am: please complete Determiners"
);
assert.equal(
  _remindForTests.formatRemindMessage("Seema Ma'am", "Determiners", 6),
  "Seema Ma'am: finish Determiners — 6 mistakes to fix"
);

// 2. Daily throttling
const now = new Date("2026-11-15T10:00:00Z").getTime();
const studentDone = { uid: "s1", status: "done", lastRemindedAt: null };
assert.equal(canRemindStudent(studentDone, now), false, "Done students cannot be reminded");

const studentNotStarted = { uid: "s2", status: "notStarted", lastRemindedAt: null };
assert.equal(canRemindStudent(studentNotStarted, now), true, "Unreminded student can be reminded");

const studentRemindedYesterday = {
  uid: "s3",
  status: "fixingMistakes",
  lastRemindedAt: now - 24 * 60 * 60 * 1000,
};
assert.equal(canRemindStudent(studentRemindedYesterday, now), true, "Reminded yesterday can be reminded today");

const studentRemindedToday = {
  uid: "s4",
  status: "fixingMistakes",
  lastRemindedAt: now - 2 * 60 * 60 * 1000, // 2 hours ago today
};
assert.equal(canRemindStudent(studentRemindedToday, now), false, "Reminded today cannot be reminded again today");

console.log("✓ All remindAssignment tests passed!");

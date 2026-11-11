// tests/needsYou.test.mjs
// Tests for utils/needsYou.js ("Needs you" card logic, G84).

import assert from "node:assert/strict";
import {
  computeNeedsYou,
  formatDecisionLine,
  formatTeacherLine,
  formatStudentLine,
} from "../utils/needsYou.js";

// 1. Formatting tests
assert.equal(formatDecisionLine(0), null);
assert.equal(formatDecisionLine(1), "1 decision waiting · Tap to answer");
assert.equal(formatDecisionLine(3), "3 decisions waiting · Tap to answer");

assert.equal(formatTeacherLine("10-A", 0), null);
assert.equal(formatTeacherLine("10-A", 1), "10-A: 1 teacher waiting · Approve");
assert.equal(formatTeacherLine("10-B", 2), "10-B: 2 teachers waiting · Approve");
assert.equal(formatTeacherLine(null, 1), "Class: 1 teacher waiting · Approve");

assert.equal(formatStudentLine("10-A", 0), null);
assert.equal(formatStudentLine("10-A", 1), "10-A: 1 student waiting · Approve");
assert.equal(formatStudentLine("10-A", 3), "10-A: 3 students waiting · Approve");
assert.equal(formatStudentLine(null, 2), "Class: 2 students waiting · Approve");

// 2. Empty states: returns [] when nothing is pending
assert.deepEqual(computeNeedsYou(), []);
assert.deepEqual(computeNeedsYou({ decisions: [], teacherRequests: [], studentRequests: [] }), []);
assert.deepEqual(computeNeedsYou({ decisions: 0, teacherRequests: [], studentRequests: [] }), []);

// 3. Admin view: decisions and teacher requests
{
  const rows = computeNeedsYou({
    decisions: [{ id: "d1" }, { id: "d2" }],
    teacherRequests: [
      { classId: "c1", className: "10-A", count: 1 },
      { classId: "c2", className: "10-B", count: 2 },
    ],
  });

  assert.equal(rows.length, 3);
  assert.equal(rows[0].label, "2 decisions waiting · Tap to answer");
  assert.equal(rows[0].screen, "Decisions");

  assert.equal(rows[1].label, "10-A: 1 teacher waiting · Approve");
  assert.equal(rows[1].screen, "ClassDetail");
  assert.deepEqual(rows[1].params, { classId: "c1" });

  assert.equal(rows[2].label, "10-B: 2 teachers waiting · Approve");
  assert.equal(rows[2].screen, "ClassDetail");
  assert.deepEqual(rows[2].params, { classId: "c2" });
}

// 4. Teacher view: students waiting per class
{
  const rows = computeNeedsYou({
    studentRequests: [
      { classId: "c1", className: "10-A", count: 3 },
      { classId: "c2", className: "5-B", count: 1 },
    ],
  });

  assert.equal(rows.length, 2);
  assert.equal(rows[0].label, "10-A: 3 students waiting · Approve");
  assert.equal(rows[0].screen, "Progress");
  assert.deepEqual(rows[0].params, { view: "classes", classId: "c1" });

  assert.equal(rows[1].label, "5-B: 1 student waiting · Approve");
  assert.equal(rows[1].screen, "Progress");
  assert.deepEqual(rows[1].params, { view: "classes", classId: "c2" });
}

// 5. Parent view in v1: nothing pending -> []
{
  const rows = computeNeedsYou({
    decisions: [],
    teacherRequests: [],
    studentRequests: [],
    parentRequests: [],
  });
  assert.deepEqual(rows, []);
}

// 6. Combined role (teacher who is also admin)
{
  const rows = computeNeedsYou({
    decisions: 1,
    studentRequests: [{ classId: "c1", className: "10-A", count: 2 }],
  });
  assert.equal(rows.length, 2);
  assert.equal(rows[0].type, "decision");
  assert.equal(rows[1].type, "student");
}

console.log("needsYou tests passed!");

// Well-being: kids to see come first (2026-11-11).
{
  const { computeNeedsYou: cny } = await import("../utils/needsYou.js");
  const rows = cny({ decisions: 2, wellbeing: 1 });
  if (rows[0].id !== "needs-you-wellbeing" || rows[0].screen !== "MoodList" || !/1 kid to see/.test(rows[0].label)) throw new Error("wellbeing row first");
  if (cny({ wellbeing: 0 }).length !== 0) throw new Error("no wellbeing row at 0");
  console.log("needsYou wellbeing passed");
}

// New reports for the owner (2026-11-12), after well-being, before decisions.
{
  const { computeNeedsYou: cny } = await import("../utils/needsYou.js");
  const rows = cny({ decisions: 1, reports: 3, wellbeing: 1 });
  if (rows.map((r) => r.id).join() !== "needs-you-wellbeing,needs-you-reports,needs-you-decisions") throw new Error("order");
  if (!/3 new reports from kids/.test(rows[1].label)) throw new Error("label");
  console.log("needsYou reports passed");
}


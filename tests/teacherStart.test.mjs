// tests/teacherStart.test.mjs
// Verifies G54: Teachers' one-pager interactive DO IT ▶ buttons and guide step triggers.

import assert from "node:assert/strict";
import { TEACHER_JOBS, TEACHER_START_MD, TEACHER_START_SHARE } from "../data/teacherStart.js";
import { guideById } from "../utils/guides.js";

// 1. Verify TEACHER_JOBS structure
assert.equal(TEACHER_JOBS.length, 4, "Must have exactly 4 teacher jobs");

const expectedJobSteps = ["join", "share", "approve", "assign"];
assert.deepEqual(
  TEACHER_JOBS.map((j) => j.stepId),
  expectedJobSteps,
  "Job stepIds must match the teacher-class guide steps"
);

// 2. Verify all job steps exist in teacher-class guide
const guide = guideById("teacher-class");
assert.ok(guide, "teacher-class guide exists");
assert.equal(guide.steps.length, 5, "teacher-class guide has 5 steps total");

for (const job of TEACHER_JOBS) {
  const stepIndex = guide.steps.findIndex((s) => s.id === job.stepId);
  assert.ok(stepIndex >= 0, `Job step '${job.stepId}' found in teacher-class guide`);
  const step = guide.steps[stepIndex];
  assert.ok(step.hint, `Step '${job.stepId}' has a hint for GuideStrip`);
  assert.ok(step.go, `Step '${job.stepId}' has a target destination`);
}

// 3. Verify step targets match expected screens/tabs
const joinStep = guide.steps.find((s) => s.id === "join");
assert.equal(joinStep.go.screen, "JoinAsTeacher");

const shareStep = guide.steps.find((s) => s.id === "share");
assert.equal(shareStep.go.tab, "Stats");

const approveStep = guide.steps.find((s) => s.id === "approve");
assert.equal(approveStep.go.tab, "Stats");

const assignStep = guide.steps.find((s) => s.id === "assign");
assert.equal(assignStep.go.tab, "Stats");

// 4. Test simulate doJobStep function matching TeacherStartScreen.js
const testActiveState = [];
const testVisitedMarks = [];
const testNavCalls = [];

const mockSetActiveGuide = (payload) => testActiveState.push(payload);
const mockMarkGuide = (markKey) => testVisitedMarks.push(markKey);
const mockNavigation = {
  navigate: (target, params) => testNavCalls.push({ target, params }),
};

function simulateDoJobStep(stepId) {
  const g = guideById("teacher-class");
  if (!g) return;
  const idx = g.steps.findIndex((s) => s.id === stepId);
  if (idx === -1) return;
  const s = g.steps[idx];
  mockSetActiveGuide({
    guideId: g.id,
    stepId: s.id,
    n: idx + 1,
    total: g.steps.length,
    hint: s.hint,
  });
  mockMarkGuide(`${g.id}.${s.id}.visited`);
  if (s.go.tab) {
    mockNavigation.navigate(s.go.tab, {
      screen: s.go.screen || "ProgressScreen",
      params: s.go.params || { view: s.go.view || "classes" },
    });
  } else {
    mockNavigation.navigate(s.go.screen, s.go.params);
  }
}

// Run through each job
for (let i = 0; i < expectedJobSteps.length; i++) {
  const stepId = expectedJobSteps[i];
  simulateDoJobStep(stepId);
  assert.equal(testActiveState[i].guideId, "teacher-class");
  assert.equal(testActiveState[i].stepId, stepId);
  assert.equal(testActiveState[i].n, i + 1);
  assert.equal(testActiveState[i].total, 5);
  assert.equal(testVisitedMarks[i], `teacher-class.${stepId}.visited`);
}

assert.equal(testNavCalls[0].target, "JoinAsTeacher");
assert.equal(testNavCalls[1].target, "Stats");
assert.equal(testNavCalls[2].target, "Stats");
assert.equal(testNavCalls[3].target, "Stats");

// 5. Verify page markdown and share text
assert.ok(TEACHER_START_MD.includes("Your 4 jobs"));
assert.ok(TEACHER_START_MD.includes("1. Join as a teacher"));
assert.ok(TEACHER_START_MD.includes("2. Share your class code"));
assert.ok(TEACHER_START_MD.includes("3. Let your students in"));
assert.ok(TEACHER_START_MD.includes("4. Give one topic a week"));
assert.ok(TEACHER_START_SHARE.includes("Apprec8 for teachers: you only need 4 things"));

console.log("TeacherStart interactive tests passed!");

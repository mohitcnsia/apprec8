// tests/guides.test.mjs — guide quests (utils/guides.js)
import assert from "node:assert/strict";
import { GUIDES, guidesFor, guideState, guideById, newlyDone } from "../utils/guides.js";
import { TEACHER_JOBS, TEACHER_START_MD, TEACHER_START_SHARE } from "../data/teacherStart.js";

assert.deepEqual(guidesFor({ isChild: true }).map((g) => g.id), ["kid-first-day"], "children: their first day");
assert.deepEqual(guidesFor({}).map((g) => g.id), ["tour", "teacher-class", "parent"], "grown-ups: tour, teachers, parents");
assert.deepEqual(guidesFor({ isAdmin: true }).map((g) => g.id), ["tour", "admin-school", "teacher-class", "parent", "kid-first-day"], "admin: all");

for (const g of GUIDES) {
  assert.ok(g.steps.length >= 4 && g.steps.length <= 6, `${g.id}: 4–6 steps (owner)`);
  g.steps.forEach((s) => {
    assert.ok(s.title && s.why && s.hint && s.go && typeof s.done === "function", `${g.id}.${s.id} complete`);
    assert.ok(s.hint.length <= 140, `${g.id}.${s.id}: hint fits the strip`);
  });
}

const admin = guideById("admin-school");
let st = guideState(admin, {});
assert.equal(st.now.id, "school");
assert.equal(st.doneCount, 0);
st = guideState(admin, { schools: 1, classes: 1 });
assert.equal(st.now.id, "invite");
assert.equal(st.doneCount, 2);
st = guideState(admin, { schools: 1, classes: 1, marks: { "admin.invite": 1 } });
assert.equal(st.now.id, "approve-teacher", "invite made → waits for approval");
st = guideState(admin, { schools: 1, classes: 1, teachers: 1, approvedKids: 2 });
assert.ok(st.finished, "a teacher approved also ticks the invite step");

const teacher = guideById("teacher-class");
st = guideState(teacher, { marks: { "teacher-class.join.sent": 1 } });
assert.equal(st.now.id, "join");
assert.ok(st.now.waiting, "code sent → waiting for the admin");
st = guideState(teacher, { teaching: 1, kids: 2 });
assert.equal(st.now.id, "approve", "students asked to join → share step done");
st = guideState(teacher, { teaching: 1, kids: 2, approvedKids: 2, assignments: 1, marks: { "teacher.progress": 1 } });
assert.ok(st.finished);

assert.deepEqual(newlyDone(["a"], ["a", "b"]), ["b"]);
// New guides tick from real data or from a visit
{
  const parent = guideById("parent");
  assert.equal(guideState(parent, {}).now.id, "add");
  assert.equal(guideState(parent, { children: 1, marks: { "parent.play.visited": 1 } }).now.id, "week");
  assert.ok(guideState(parent, { children: 1, pushParent: true, marks: { "parent.play.visited": 1, "parent.week.visited": 1 } }).finished);
  const kid = guideById("kid-first-day");
  assert.equal(guideState(kid, { questsStarted: 1 }).now.id, "topic");
  assert.equal(guideState(kid, { questsStarted: 1, topicsDone: 2 }).now.id, "mistakes");
  const tour = guideById("tour");
  const marks = Object.fromEntries(tour.steps.map((s) => [`tour.${s.id}.visited`, 1]));
  assert.ok(guideState(tour, { marks }).finished, "the tour ticks by visiting each screen");
  for (const g of GUIDES) for (const s of g.steps) assert.ok(s.go && (s.go.screen || s.go.tab) && s.hint && s.why, `${g.id}.${s.id} has a target, hint and why`);
}
// G54: Teachers' one-pager interactive jobs
assert.equal(TEACHER_JOBS.length, 4, "4 teacher jobs");
assert.deepEqual(
  TEACHER_JOBS.map((j) => j.stepId),
  ["join", "share", "approve", "assign"],
  "jobs match teacher-class steps"
);
for (const j of TEACHER_JOBS) {
  assert.ok(teacher.steps.some((s) => s.id === j.stepId), `step ${j.stepId} exists in teacher-class guide`);
  assert.ok(TEACHER_START_MD.includes(j.title), `TEACHER_START_MD contains ${j.title}`);
}
assert.ok(TEACHER_START_SHARE.length > 50, "TEACHER_START_SHARE valid");

console.log("guides tests passed");

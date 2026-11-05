// tests/guides.test.mjs — guide quests (utils/guides.js)
import assert from "node:assert/strict";
import { GUIDES, guidesFor, guideState, guideById, newlyDone } from "../utils/guides.js";

assert.deepEqual(guidesFor({ isChild: true }), [], "children: no guides yet");
assert.deepEqual(guidesFor({}).map((g) => g.id), ["teacher-class"], "adults: teacher guide");
assert.deepEqual(guidesFor({ isAdmin: true }).map((g) => g.id), ["admin-school", "teacher-class"], "admin: both");

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
console.log("guides tests passed");

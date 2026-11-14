// Tests for utils/pickClass.js (join a class inside the app). Run: npm test
import assert from "node:assert/strict";
import { classesFor, firstSchool, needsClass } from "../utils/pickClass.js";

const school = { schoolId: "s1", schoolName: "KV", classes: [{ classId: "a", grade: 10 }, { classId: "b", grade: 5 }, { classId: "c", grade: 10 }] };
assert.deepEqual(classesFor(school, 10).mine.map((c) => c.classId), ["a", "c"]);
assert.deepEqual(classesFor(school, 10).others.map((c) => c.classId), ["b"]);
assert.equal(classesFor(school, null).mine.length, 3, "no class picked: show all");

assert.equal(firstSchool([school]), "s1", "only one school: open it");
assert.equal(firstSchool([school, { schoolId: "s2", classes: [{ grade: 7 }] }], 7), "s2", "the one school with my class");
assert.equal(firstSchool([school, { schoolId: "s2", classes: [{ grade: 10 }] }], 10), null, "two choices: the child picks");

assert.deepEqual(needsClass({ grade: 10 }), { who: "kid" });
assert.equal(needsClass({ grade: 10, pendingClassIds: ["a"] }), null, "already waiting");
assert.equal(needsClass({ grade: 10, classIds: ["a"] }), null, "already in a class");
assert.equal(needsClass({ teachesClassIds: ["a"] }), null, "teachers don't get it");
assert.equal(needsClass({ teachesClassIds: ["a"], grade: 10 }), null, "not for a teacher who has a class number");
assert.deepEqual(needsClass({ teachesClassIds: ["a"], childUids: ["k"] }, [{ firstName: "Pratha" }]), { who: "parent", name: "Pratha", grade: null }, "a teacher who is a parent gets it for their child");
assert.deepEqual(needsClass({ childUids: ["k"] }, [{ firstName: "Riya" }]), { who: "parent", name: "Riya", grade: null });
assert.equal(needsClass({ grade: 10, childUids: ["k"] }, [{ firstName: "Hazel", grade: 5 }]).grade, 5, "the child's class, not the parent's");
assert.equal(needsClass({ childUids: ["k"] }, [{ firstName: "Riya", classIds: ["a"] }]), null);
assert.equal(needsClass({}), null, "no class and no children: nothing to join for");
console.log("pickClass tests passed");

// A grown-up learner has no school class: no "Join your class" card (owner 14 Nov).
{
  const { needsClass } = await import("../utils/pickClass.js");
  assert.equal(needsClass({ grade: 5, selfLearner: true }), null);
  assert.deepEqual(needsClass({ grade: 5 }), { who: "kid" });
  console.log("pickClass: grown-up learner ok");
}

// Tests for utils/persona.js (the owner's "View as" in Admin tools). Run: npm test
import assert from "node:assert/strict";
import { applyPersona, cleanPersona, personaLabel, OWNER } from "../utils/persona.js";
import { nodesForGrade } from "../utils/gradeFilter.js";

const me = { firstName: "Owner", grade: 10, childUids: ["pratha"], teachesClassIds: ["c1"], classIds: ["c9"], stars: 5 };
assert.equal(applyPersona(me, OWNER), me, "owner: unchanged");
assert.equal(applyPersona(null, { role: "kid", grade: 7 }), null);

const kid = applyPersona(me, { role: "kid", grade: 7 });
assert.equal(kid.grade, 7);
assert.deepEqual([kid.childUids, kid.teachesClassIds], [[], []], "a kid has no children and teaches nothing");
assert.equal(kid.stars, 5, "everything else stays");
assert.equal(me.grade, 10, "the real doc is never changed");

const parent = applyPersona(me, { role: "parent" });
assert.ok(!("grade" in parent) && parent.childUids.length === 1 && parent.teachesClassIds.length === 0);
const teacher = applyPersona(me, { role: "teacher" });
assert.ok(!("grade" in teacher) && teacher.childUids.length === 0 && teacher.teachesClassIds.length === 1);

assert.deepEqual(cleanPersona({ role: "kid" }), { role: "kid", grade: 5 }, "kid without a class: Class 5");
assert.deepEqual(cleanPersona({ role: "kid", grade: 13 }), { role: "kid", grade: 5 });
assert.deepEqual(cleanPersona({ role: "boss" }), OWNER, "unknown role: owner");
assert.equal(personaLabel({ role: "kid", grade: 7 }), "Kid · Class 7");
assert.equal(personaLabel({ role: "teacher" }), "Teacher");

// Viewing as a Class 7 kid shows the Class 7 Science topics.
const sci = await import("../data/scienceQuestData.js");
assert.ok(nodesForGrade(sci.nodes, kid.grade).some((n) => n.id === "sq7-heat"));
console.log("persona tests passed");

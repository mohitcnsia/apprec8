// Tests for utils/classes.js (RB-2 phase A). Run: npm test
import assert from "node:assert/strict";
import { makeClassCode, normalizeCode, canJoin, MAX_CLASSES, questsForTeacher, teacherSubjectsIn, classLabel, consentRecord, CONSENT_TEXT, CODE_LENGTH } from "../utils/classes.js";

// codes: 6 characters, no look-alikes, typed input is tidied
let i = 0; const seq = [0, 0.99, 0.5, 0.25, 0.75, 0.1];
const code = makeClassCode(() => seq[i++ % seq.length]);
assert.equal(code.length, CODE_LENGTH);
assert.ok(!/[01OIL]/.test(code), code);
assert.equal(normalizeCode(" abc 2x9 "), "ABC2X9");
assert.equal(normalizeCode("ab-c2x9"), "ABC2X9");
assert.equal(normalizeCode("abc"), null);
assert.equal(normalizeCode("ABCD1Z"), null); // "1" never appears in codes

// joining
assert.equal(canJoin([], "c1").ok, true);
assert.equal(canJoin(["c1"], "c1").ok, false);
assert.equal(canJoin(Array.from({ length: MAX_CLASSES }, (_, k) => `c${k}`), "new").ok, false);
assert.equal(canJoin([], null).ok, false);

// teachers see only their subjects
const cls = { name: "5-B", teacherSubjects: { tE: ["english", "wordpower"], tS: ["science"], tX: ["cooking"] } };
assert.deepEqual(teacherSubjectsIn(cls, "tX"), []);
assert.deepEqual(questsForTeacher(cls, "tE").sort(), ["english-quest", "word-power"]);
assert.deepEqual(questsForTeacher(cls, "tS"), ["science-quest"]);
assert.deepEqual(questsForTeacher(cls, "nobody"), []);
assert.equal(classLabel(cls), "5-B · English, Word Power, Science, cooking");

// consent: both languages, a record with version
assert.ok(CONSENT_TEXT.en.body.includes("first name") && CONSENT_TEXT.hi.body.length > 50);
const rec = consentRecord({ kidUid: "k", classId: "c", parentName: " Seema ", relation: "mother", language: "hi", now: 5 });
assert.deepEqual(rec, { kidUid: "k", classId: "c", parentName: "Seema", relation: "mother", language: "hi", version: rec.version, acceptedAt: 5 });
assert.throws(() => consentRecord({ kidUid: "k", classId: "c", parentName: "", relation: "mother", language: "en" }));
assert.throws(() => consentRecord({ kidUid: "k", classId: "c", parentName: "Ravi", relation: "uncle", language: "en" }));
console.log("classes tests passed");

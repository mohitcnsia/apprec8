// Tests for utils/classes.js (RB-2 phase A). Run: npm test
import assert from "node:assert/strict";
import { makeClassCode, normalizeCode, canJoin, MAX_CLASSES, questsForTeacher, teacherSubjectsIn, classLabel, consentRecord, CONSENT_TEXT, CODE_LENGTH, classCodeMessage, teacherInviteMessage, classSubjects, joinGate } from "../utils/classes.js";

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

// teachers see class courses for their class (G81)
const cls10 = { id: "demo_class_10b", name: "10-B", teacherSubjects: { tE: ["english"] } };
const quests10 = questsForTeacher(cls10, "tE");
assert.ok(quests10.includes("course-seema-c10-english"), "class 10-b teacher can assign from course-seema-c10-english");
assert.ok(quests10.includes("english-quest"), "class 10-b teacher can also assign from english-quest");

// outside class does not see class-specific course
const cls5 = { id: "demo_class_5a", name: "5-A", teacherSubjects: { tE: ["english"] } };
const quests5 = questsForTeacher(cls5, "tE");
assert.ok(!quests5.includes("course-seema-c10-english"), "class 5-a teacher cannot assign from course-seema-c10-english");

// consent: both languages, a record with version
assert.ok(CONSENT_TEXT.en.body.includes("first name") && CONSENT_TEXT.hi.body.length > 50);
const rec = consentRecord({ kidUid: "k", classId: "c", parentName: " Seema ", relation: "mother", language: "hi", now: 5 });
assert.deepEqual(rec, { kidUid: "k", classId: "c", parentName: "Seema", relation: "mother", language: "hi", version: rec.version, acceptedAt: 5 });
assert.throws(() => consentRecord({ kidUid: "k", classId: "c", parentName: "", relation: "mother", language: "en" }));
assert.throws(() => consentRecord({ kidUid: "k", classId: "c", parentName: "Ravi", relation: "uncle", language: "en" }));
// Share messages: name the class, the code, and no email anywhere
const cm = classCodeMessage({ className: "5-A", schoolName: "Glorious Academy", code: "7A6NBB" });
assert.ok(cm.includes("5-A, Glorious Academy") && cm.includes("code 7A6NBB") && !/e-?mail/i.test(cm));
const tm = teacherInviteMessage({ className: "5-A", schoolName: "Glorious Academy", subjects: ["english", "wordpower"], code: "T4K9PX" });
assert.ok(tm.includes("as the English and Word Power teacher") && tm.includes("code T4K9PX") && tm.includes("7 days"));
assert.ok(teacherInviteMessage({ className: "5-A", subjects: [], code: "TX" }).includes("as a teacher"));
assert.deepEqual(classSubjects({ subjects: ["science"], teacherSubjects: { t: ["english"] } }), ["science"]);
assert.deepEqual(classSubjects({ teacherSubjects: { t: ["english", "wordpower"], u: ["english"] } }), ["english", "wordpower"]);
assert.deepEqual(classSubjects({}), []);
// G90: no parent consent = no class (Seema's decision 3)
assert.equal(joinGate({ parentUids: ["p1"] }), "parent");
assert.equal(joinGate({ parentUids: [] }), "blocked");
assert.equal(joinGate({}), "blocked");
assert.equal(joinGate(null), "blocked");
console.log("classes tests passed");

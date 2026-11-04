// Tests for utils/family.js (parent-first accounts). Run: npm test
import assert from "node:assert/strict";
import { childPayload, codeUsable, CHILD_CONSENT_TEXT, makeChildCode, normalizeChildCode } from "../utils/family.js";

const ok = childPayload({ firstName: "  Pratha  Chilkoti ", grade: 5, parentName: "Mohit", relation: "father", language: "hi" });
assert.equal(ok.firstName, "Pratha"); // first name only is stored
assert.equal(ok.grade, 5);
assert.equal(ok.consent.language, "hi");
assert.ok(ok.consent.version);
assert.throws(() => childPayload({ firstName: "P", grade: 5, parentName: "Mohit", relation: "father", language: "en" }));
assert.throws(() => childPayload({ firstName: "Pratha", grade: 0, parentName: "Mohit", relation: "father", language: "en" }));
assert.throws(() => childPayload({ firstName: "Pratha", grade: 5, parentName: "", relation: "father", language: "en" }));
assert.throws(() => childPayload({ firstName: "Pratha", grade: 5, parentName: "Mohit", relation: "uncle", language: "en" }));
assert.ok(CHILD_CONSENT_TEXT.en.body.includes("delete") && CHILD_CONSENT_TEXT.hi.body.includes("मिटा"));

const now = 1000;
assert.equal(codeUsable({ used: false, expiresAt: 2000 }, now), true);
assert.equal(codeUsable({ used: true, expiresAt: 2000 }, now), false);
assert.equal(codeUsable({ used: false, expiresAt: 500 }, now), false);
assert.equal(codeUsable(null, now), false);
assert.equal(normalizeChildCode(makeChildCode()).length, 6);
console.log("family tests passed");

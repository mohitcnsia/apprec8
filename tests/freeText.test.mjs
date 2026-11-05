// tests/freeText.test.mjs — who may type free text (utils/freeText.js)
import assert from "node:assert/strict";
import { canWriteFreeText } from "../utils/freeText.js";

assert.equal(canWriteFreeText({}), false, "unknown → tap only");
assert.equal(canWriteFreeText({ doc: { grade: 5 } }), false, "a student");
assert.equal(canWriteFreeText({ doc: { isChild: true } }), false, "a child profile");
assert.equal(canWriteFreeText({ doc: { firstName: "Mohit" } }), true, "an adult (no class)");
assert.equal(canWriteFreeText({ doc: { grade: 5 }, isTester: true }), true, "testers");
assert.equal(canWriteFreeText({ email: " Pratha@Example.com ", doc: { grade: 5 }, allowEmails: ["pratha@example.com"] }), true, "named exception");
console.log("freeText tests passed");

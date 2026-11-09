// tests/consentListen.test.mjs
// Tests for utils/consentListen.js (G58: listen on parent consent notes). Run: npm test
import assert from "node:assert/strict";
import { SPEECH_LANG, consentSpeechText, consentListenLabel } from "../utils/consentListen.js";
import { CONSENT_TEXT } from "../utils/classes.js";
import { CHILD_CONSENT_TEXT, LINK_CONSENT_TEXT } from "../utils/family.js";

// 1. Language mapping
assert.equal(SPEECH_LANG.en, "en-IN");
assert.equal(SPEECH_LANG.hi, "hi-IN");

// 2. Labels for idle and speaking states
assert.equal(consentListenLabel(false, "en"), "🔊 Listen");
assert.equal(consentListenLabel(true, "en"), "⏹️ Stop");
assert.equal(consentListenLabel(false, "hi"), "🔊 सुनें");
assert.equal(consentListenLabel(true, "hi"), "⏹️ रोकें");

// 3. Speech text generation
assert.equal(consentSpeechText(null), "");
assert.equal(consentSpeechText(""), "");
assert.equal(consentSpeechText("Direct text"), "Direct text");
assert.equal(
  consentSpeechText({ title: "Title", body: "Body." }, "en"),
  "Title. Body."
);
assert.equal(
  consentSpeechText({ title: "शीर्षक", body: "विवरण" }, "hi"),
  "शीर्षक। विवरण"
);
assert.equal(consentSpeechText({ title: "Only Title", body: "" }), "Only Title");
assert.equal(consentSpeechText({ title: "", body: "Only Body" }), "Only Body");

// 4. Verify all 3 parent consent notes have valid speech text
// Join class consent
const joinEn = consentSpeechText(CONSENT_TEXT.en, "en");
const joinHi = consentSpeechText(CONSENT_TEXT.hi, "hi");
assert.ok(joinEn.startsWith("For the parent or guardian. Your child is joining"));
assert.ok(joinHi.startsWith("माता-पिता या अभिभावक के लिए। आपका बच्चा Apprec8"));

// Add child consent
const childEn = consentSpeechText(CHILD_CONSENT_TEXT.en, "en");
const childHi = consentSpeechText(CHILD_CONSENT_TEXT.hi, "hi");
assert.ok(childEn.startsWith("Creating your child's account. You are creating"));
assert.ok(childHi.startsWith("अपने बच्चे का खाता बनाना। आप अपने बच्चे के लिए"));

// Link child consent
const linkEn = consentSpeechText(LINK_CONSENT_TEXT.en, "en");
const linkHi = consentSpeechText(LINK_CONSENT_TEXT.hi, "hi");
assert.ok(linkEn.startsWith("Link your child's own account. Your child already"));
assert.ok(linkHi.startsWith("अपने बच्चे का अपना खाता जोड़ें। आपका बच्चा पहले से"));

console.log("consentListen tests passed");

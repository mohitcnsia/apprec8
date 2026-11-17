// tests/uiLabels.test.mjs: Hindi labels on Hindi content (owner 17 Nov 2026), utils/uiLabels.js + utils/quizLang.js
import assert from "node:assert/strict";
import { langOf, cardsLang, voiceFor, glossHindi, LABELS, labelsFor } from "../utils/uiLabels.js";
import { quizLang } from "../utils/quizLang.js";
import { CARD_STARTERS } from "../data/cardStarters.js";

// language of a text
assert.equal(langOf("OTP किसी को न बताएँ"), "hi");
assert.equal(langOf("Which gas do leaves take in?"), "en");
assert.equal(langOf("Check the OTP (ओटीपी) message today please"), "en"); // mostly English stays English
assert.equal(langOf(""), "en");
assert.equal(langOf(["एक", null, undefined]), "hi");

// cards: the owner's Hindi starter cards are Hindi, the Moon card is English
const starter = (id) => CARD_STARTERS.find((c) => c.id === id).card;
assert.equal(cardsLang(starter("safety").cards, starter("safety").title), "hi");
assert.equal(cardsLang(starter("story").cards, starter("story").title), "hi");
assert.equal(cardsLang(starter("fact").cards, starter("fact").title), "en");

// voice
assert.equal(voiceFor("सवाल सुनें").language, "hi-IN");
assert.deepEqual(voiceFor("Listen"), { language: "en-IN", rate: 0.9 });

// Hindi spellings: once, first mention, Hindi text only, never twice
assert.equal(glossHindi("OTP किसी को न बताएँ"), "OTP (ओटीपी) किसी को न बताएँ");
assert.equal(glossHindi("OTP दें या OTP न दें"), "OTP (ओटीपी) दें या OTP न दें");
assert.equal(glossHindi("UPI PIN डालें"), "UPI (यूपीआई) PIN (पिन) डालें");
assert.equal(glossHindi("Share the OTP"), "Share the OTP"); // English untouched
assert.equal(glossHindi("OTP (ओटीपी) न बताएँ"), "OTP (ओटीपी) न बताएँ"); // already spelled
assert.equal(glossHindi("OTP (one time) बताएँ"), "OTP (one time) बताएँ"); // already explained in brackets
assert.equal(glossHindi("WhatsApp पर मैसेज"), "WhatsApp (व्हाट्सऐप) पर मैसेज");
assert.equal(glossHindi("PINK रंग"), "PINK रंग"); // whole words only
assert.equal(glossHindi(null), null);
assert.equal(glossHindi(glossHindi("OTP न बताएँ")), "OTP (ओटीपी) न बताएँ"); // safe to apply twice

// both languages have every label, of the same kind (text or function)
for (const k of Object.keys(LABELS.en)) {
  assert.ok(k in LABELS.hi, `Hindi label missing: ${k}`);
  assert.equal(typeof LABELS.hi[k], typeof LABELS.en[k], `label ${k}: different kind`);
}
assert.deepEqual(Object.keys(LABELS.hi).sort(), Object.keys(LABELS.en).sort());
// English labels are the app's existing words (nothing changes for English learners)
assert.equal(labelsFor("en").next, "NEXT");
assert.equal(labelsFor(undefined).tryQuiz(8), "TRY 8 QUESTIONS ▶");
assert.equal(labelsFor("en").whyNot("lives"), "Why not 'lives'?");
assert.equal(labelsFor("hi").tryQuiz(4), "4 सवाल करें ▶");
assert.equal(labelsFor("hi").learnedTitle(1), "आपने 1 बात सीखी");
// The why-sheet tells "See why" from "next" by its label: the Hindi labels must differ
const H = labelsFor("hi");
assert.equal(new Set([H.seeWhyCaps, H.continueCaps, H.gotItCaps]).size, 3);

// quest language: आओ जानें says Hindi; English quests fall back to their text
assert.equal(quizLang({ questId: "bharat-quest" }), "hi");
assert.equal(quizLang({ questId: "english-quest", texts: ["Nouns"] }), "en");
assert.equal(quizLang({ texts: ["महाभारत से"] }), "hi");

console.log("uiLabels tests passed");

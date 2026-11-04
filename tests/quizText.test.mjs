// Tests for utils/quizText.js (quiz redesign). Run: npm test
import assert from "node:assert/strict";
import { splitInstruction, fitsTiles, sheetExplanation } from "../utils/quizText.js";

assert.deepEqual(splitInstruction("Fill in the blank: 'There is ___ owl on the tree.'"), { label: "FILL IN THE BLANK", body: "There is ___ owl on the tree." });
assert.deepEqual(splitInstruction("Fill in the blanks so both sentences talk about the SAME cake: 'Mum baked ___ cake.'"), { label: "FILL IN THE BLANK", body: "Mum baked ___ cake." });
assert.deepEqual(splitInstruction("Choose the correct sentence."), { label: "CHOOSE THE CORRECT SENTENCE", body: "" });
assert.deepEqual(splitInstruction("Find the mistake: 'I saw a elephant.'"), { label: "FIND THE MISTAKE", body: "I saw a elephant." });
assert.deepEqual(splitInstruction("What is the plural of 'child'?"), { label: null, body: "What is the plural of 'child'?" });
assert.deepEqual(splitInstruction(""), { label: null, body: "" });
// generic "instruction? 'sentence'" (owner feedback 2026-11-04)
assert.deepEqual(splitInstruction("What kind of sentence is this? 'Don't touch the hot pan.'"), { label: "WHAT KIND OF SENTENCE IS THIS?", body: "Don't touch the hot pan." });
assert.deepEqual(splitInstruction("Identify the verb: 'The cat sleeps on the mat.'"), { label: "IDENTIFY THE VERB", body: "The cat sleeps on the mat." });
// quote in the middle, or instruction after the quote: unchanged
assert.deepEqual(splitInstruction("Which word is a demonstrative adjective in 'This apple is tasty.'?"), { label: null, body: "Which word is a demonstrative adjective in 'This apple is tasty.'?" });
assert.deepEqual(splitInstruction("What is the plural of 'child'?"), { label: null, body: "What is the plural of 'child'?" });

const t = (c) => ({ type: "text", content: c });
assert.equal(fitsTiles([t("an"), t("a"), t("many"), t("those")]), true);
assert.equal(fitsTiles([t("an"), t("She is an engineer.")]), false);
assert.equal(fitsTiles([t("a")]), false);
assert.equal(fitsTiles([{ type: "image", content: "x", mediaUrl: "u" }, t("a")]), false);

assert.deepEqual(sheetExplanation({ text: "Short reason." }), { text: "Short reason.", rich: false });
assert.deepEqual(sheetExplanation({ text: "Sun", mediaType: "image", mediaUrl: "u" }), { text: "", rich: true });
assert.deepEqual(sheetExplanation({ text: "Sun", trivia: "fact" }), { text: "", rich: true });
assert.deepEqual(sheetExplanation("plain"), { text: "plain", rich: false });
assert.deepEqual(sheetExplanation(null), { text: "", rich: false });
console.log("quizText: all tests passed");

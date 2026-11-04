// Tests for utils/listen.js (RB-5b ear training). Run: npm test
import assert from "node:assert/strict";
import { sentenceWithBlank, canTryAnswers, fillBlank, tryEachAnswerLines, speakableQuestion } from "../utils/listen.js";

assert.equal(sentenceWithBlank("Choose the adverb to fill the blank: 'She sang ___ at the concert.'"), "She sang ___ at the concert.");
assert.equal(sentenceWithBlank("My sister ___ the piano every evening."), "My sister ___ the piano every evening.");
assert.equal(sentenceWithBlank("What is the plural of 'wolf'?"), null);
assert.equal(canTryAnswers("Find the SUBJECT: 'The tall boy won the race.'"), false);
assert.equal(canTryAnswers("What is missing here? 'My little sister ___ a picture.'"), true);
assert.equal(fillBlank("She ___ to school.", " goes "), "She goes to school.");
assert.deepEqual(
  tryEachAnswerLines("Choose: 'My sister ___ the piano.'", [{ content: "plays" }, { content: "play" }, "playing"]),
  ["My sister plays the piano.", "My sister play the piano.", "My sister playing the piano."]
);
assert.deepEqual(tryEachAnswerLines("What is the plural of 'leaf'?", [{ content: "leaves" }]), []);
assert.equal(speakableQuestion("The baby ___."), "The baby  blank .");
console.log("listen: all tests passed");

// several blanks: "an, a" fills one part per blank; a mismatch keeps the old behaviour
assert.equal(fillBlank("I saw ___ owl and ___ crow.", "an, a"), "I saw an owl and a crow.");
assert.equal(fillBlank("I saw ___ owl and ___ crow.", "an"), "I saw an owl and ___ crow.");
assert.equal(fillBlank("___ dog", "a, b"), "a, b dog");
console.log("listen multi-blank: ok");

import assert from "node:assert/strict";
import { buildReadingFlow, nextCursor, splitParagraph, countWords } from "../utils/readingFlow.js";
const q = (after) => ({ afterParagraph: after });
// stepByStep: p0 q0 p1 p2 q1 q2
let f = buildReadingFlow({ mode: "stepByStep", paragraphs: ["a", "b", "c"], questions: [q(0), q(2), q(2)] });
assert.deepEqual(f.items.map(i => i.kind + (i.index ?? "")), ["p0","q0","p1","p2","q1","q2"]);
assert.equal(f.startCursor, 1);                 // first paragraph + its question
assert.equal(nextCursor(f.items, 1), 2);        // p1 has no question: show p1 alone
assert.equal(nextCursor(f.items, 2), 4);        // p2 is followed by a question: show both
assert.equal(nextCursor(f.items, 5), 5);        // never past the end
// fullPassage: p0 p1 gate q0 q1
f = buildReadingFlow({ mode: "fullPassage", paragraphs: ["a", "b"], questions: [{}, {}] });
assert.deepEqual(f.items.map(i => i.kind + (i.index ?? "")), ["p0","p1","gate","q0","q1"]);
assert.equal(f.startCursor, 2);
assert.equal(nextCursor(f.items, 2), 3);
// split: highlight + glossary, case-insensitive whole words
const segs = splitParagraph("The Monsoon came. Rain fell on the monsoon garden.", "Rain fell on the monsoon garden.", { monsoon: "rainy season" });
assert.deepEqual(segs.map(s => [s.text, s.highlight, s.glossaryWord]), [
  ["The ", false, null], ["Monsoon", false, "monsoon"], [" came. ", false, null],
  ["Rain fell on the ", true, null], ["monsoon", true, "monsoon"], [" garden.", true, null],
]);
assert.equal(segs.map(s => s.text).join(""), "The Monsoon came. Rain fell on the monsoon garden.");
// no partial-word matches, missing highlight is ignored
assert.deepEqual(splitParagraph("Rainbows!", "nope", { rain: "x" }).map(s => s.glossaryWord), [null]);
assert.equal(countWords(["one two", " three "]), 3);
console.log("readingFlow: all tests passed");

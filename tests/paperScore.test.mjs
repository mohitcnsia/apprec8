// tests/paperScore.test.mjs — practice paper scoring (utils/paperScore.js)
import assert from "node:assert/strict";
import { paperQuestionId, paperQuestions, timeLeftMs, clockLabel, checkSummary, scorePaper } from "../utils/paperScore.js";
import en1 from "../data/papers/englishPaper1.js";

const T = (node) => ({ quest: "english-quest", node });
const tiny = {
  id: "p",
  minutes: 10,
  parts: [
    { id: "a", title: "A", marks: 1, questions: [{ answer: "x", topic: T("n1") }, { answer: "y", topic: T("n2") }, { answer: "z", topic: T("n1") }] },
    { id: "b", title: "B", marks: 3, questions: [{ answer: "k", topic: T("n3") }, { answer: "m", topic: T("n2") }] },
  ],
};

// ids and numbering
assert.equal(paperQuestionId("p", "a", 0), "p-a-q1");
assert.deepEqual(paperQuestions(tiny).map((x) => x.number), [1, 2, 3, 4, 5]);
assert.equal(paperQuestions(tiny)[3].id, "p-b-q1");

// clock
assert.equal(timeLeftMs({ startedAt: 0, minutes: 10, now: 60_000 }), 9 * 60_000);
assert.equal(timeLeftMs({ startedAt: 0, minutes: 10, now: 11 * 60_000 }), 0, "never negative");
assert.equal(clockLabel(41 * 60_000 + 20_000), "41:20");
assert.equal(clockLabel(5_000), "0:05");
assert.equal(clockLabel(0), "0:00");

// check screen
const answers = { "p-a-q1": "x", "p-a-q2": "wrong", "p-b-q1": "k" };
assert.deepEqual(checkSummary(tiny, answers, { "p-a-q2": true }), { total: 5, answered: 3, blank: [3, 5], marked: [2] });

// scoring: part marks, blank vs wrong, practise topics by most missed then paper order
const r = scorePaper(tiny, answers);
assert.equal(r.score, 1 + 3);
assert.equal(r.max, 3 + 6);
assert.deepEqual(r.parts.map(({ right, wrong, blank }) => [right, wrong, blank]), [[1, 1, 1], [1, 0, 1]]);
// missed: q2 (n2), q3 (n1, blank), q5 (n2, blank) → n2 twice, then n1
assert.deepEqual(r.practise.map((p) => [p.node, p.wrong]), [["n2", 2], ["n1", 1]]);

// perfect paper: nothing to practise
const all = Object.fromEntries(paperQuestions(tiny).map((x) => [x.id, x.question.answer]));
assert.deepEqual(scorePaper(tiny, all).practise, []);
assert.equal(scorePaper(tiny, all).score, 9);

// real paper: 60 marks, empty paper scores 0 with 3 topics to practise
const empty = scorePaper(en1, {});
assert.equal(empty.max, 60);
assert.equal(empty.score, 0);
assert.equal(empty.practise.length, 3);

console.log("paperScore tests passed");

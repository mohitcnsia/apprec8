// tests/paperSession.test.mjs — practice paper session (utils/paperSession.js)
import assert from "node:assert/strict";
import { optionOrder, fitsTwoByTwo, initialPaperState, paperReducer, resumable, paperOutcome } from "../utils/paperSession.js";
import en1 from "../data/papers/englishPaper1.js";
import sc1 from "../data/papers/sciencePaper1.js";

const T = (node) => ({ quest: "english-quest", node });
const O = (correct, ...wrong) => [{ content: correct, isCorrect: true }, ...wrong.map((w) => ({ content: w, isCorrect: false, mistakeTag: "tag-" + w }))];
const paper = {
  id: "p",
  minutes: 10,
  parts: [
    { id: "a", title: "A", marks: 1, questions: [{ answer: "x", options: O("x", "y"), topic: T("n1") }, { answer: "y", options: O("y", "x"), topic: T("n2") }] },
    { id: "b", title: "B", marks: 3, questions: [{ answer: "k", options: O("k", "m"), topic: T("n3") }] },
  ],
};
const run = (actions, s = initialPaperState("p")) => actions.reduce((st, a) => paperReducer(paper, st, a), s);

// option order: shuffled but stable, nothing lost; the right answer isn't always first across a real paper
const opts = O("a", "b", "c", "d");
assert.deepEqual(optionOrder("q1", opts), optionOrder("q1", opts));
assert.deepEqual(optionOrder("q1", opts).map((o) => o.content).sort(), ["a", "b", "c", "d"]);
for (const p of [en1, sc1]) {
  const firsts = p.parts.flatMap((part) => part.questions.map((q, i) => optionOrder(`${p.id}-${part.id}-q${i + 1}`, q.options)[0].isCorrect));
  const share = firsts.filter(Boolean).length / firsts.length;
  assert.ok(share > 0.1 && share < 0.45, `${p.id}: right answer first in ${Math.round(share * 100)}% of questions`);
}

// 2 × 2 only when all four are short
assert.equal(fitsTwoByTwo(O("was", "were", "is", "has")), true);
assert.equal(fitsTwoByTwo(O("Many turtles arriving together", "b", "c", "d")), false);
assert.equal(fitsTwoByTwo(O("a", "b", "c")), false);

// start → answer → next → check → back → goto → submit
let s = run([{ type: "choose", id: "p-a-q1", text: "x" }]);
assert.deepEqual(s.answers, {}, "no answers before start");
s = run([{ type: "start", now: 1000, showClock: false }]);
assert.equal(s.phase, "paper");
assert.equal(s.showClock, false);
s = run([{ type: "start", now: 1000 }, { type: "choose", id: "p-a-q1", text: "x" }, { type: "choose", id: "p-a-q1", text: "y" }]);
assert.equal(s.answers["p-a-q1"], "y", "changing an answer keeps the last one");
s = run([{ type: "start", now: 0 }, { type: "back" }]);
assert.equal(s.index, 0, "back on question 1 stays");
s = run([{ type: "start", now: 0 }, { type: "next" }, { type: "next" }]);
assert.equal(s.index, 2);
s = paperReducer(paper, s, { type: "next" });
assert.equal(s.phase, "check", "NEXT on the last question opens the check screen");
s = paperReducer(paper, s, { type: "back" });
assert.deepEqual([s.phase, s.index], ["paper", 2], "back from check returns to the last question");
s = paperReducer(paper, paperReducer(paper, s, { type: "openCheck" }), { type: "goto", index: 0 });
assert.deepEqual([s.phase, s.index], ["paper", 0], "tapping a number on the check screen goes to it");
s = run([{ type: "start", now: 0 }, { type: "toggleMark", id: "p-a-q2" }]);
assert.deepEqual(s.marked, { "p-a-q2": true });
assert.deepEqual(paperReducer(paper, s, { type: "toggleMark", id: "p-a-q2" }).marked, {});

// clock: a tick before 0:00 changes nothing; at 0:00 the paper submits itself at the deadline
s = run([{ type: "start", now: 0 }, { type: "choose", id: "p-a-q1", text: "x" }]);
assert.equal(paperReducer(paper, s, { type: "tick", now: 9 * 60_000 }), s);
const timed = paperReducer(paper, s, { type: "tick", now: 25 * 60_000 });
assert.deepEqual([timed.phase, timed.submittedAt, timed.timedOut], ["result", 10 * 60_000, true]);
assert.equal(paperReducer(paper, timed, { type: "choose", id: "p-a-q2", text: "y" }).answers["p-a-q2"], undefined, "no answers after submit");

// submit + outcome
s = run([
  { type: "start", now: 0 },
  { type: "choose", id: "p-a-q1", text: "x" },
  { type: "choose", id: "p-a-q2", text: "x" },
  { type: "submit", now: 4 * 60_000 },
]);
assert.equal(s.phase, "result");
const out = paperOutcome(paper, s);
assert.deepEqual([out.score, out.max, out.usedMs, out.timedOut], [1, 5, 4 * 60_000, false]);
assert.deepEqual(out.rows.map((r) => [r.correct, r.mistakeTag]), [[true, null], [false, "tag-x"], [false, null]]);
assert.equal(paperReducer(paper, s, { type: "showAnswers" }).phase, "answers");

// resume: only a paper in progress, only the same paper
assert.equal(resumable({ paperId: "p", phase: "paper" }, "p")?.phase, "paper");
assert.equal(resumable({ paperId: "p", phase: "result" }, "p"), null);
assert.equal(resumable({ paperId: "other", phase: "paper" }, "p"), null);
assert.equal(resumable(null, "p"), null);
const restored = paperReducer(paper, initialPaperState("p"), { type: "restore", state: { paperId: "p", phase: "check", answers: { a: 1 } } });
assert.deepEqual([restored.phase, restored.answers, restored.marked], ["check", { a: 1 }, {}]);

console.log("paperSession tests passed");

// ---- owner feedback 2026-11-05: medal, mistakes, stars ----
const { paperMedal, paperWrongsByQuest } = await import("../utils/paperSession.js");
const { paperMistakeUpdates, buildMistakeItems, MAX_MISTAKES } = await import("../utils/mistakes.js");
import { createRequire } from "node:module";
const { paperStars, PAPER_REWARD_GAP_MS } = createRequire(import.meta.url)("../functions/utils/paperStars.js");

assert.equal(paperMedal(55, 60).emoji, "🥇");
assert.equal(paperMedal(47, 60).emoji, "🥈");
assert.equal(paperMedal(10, 60).emoji, "🥉");

// wrong + blank answers grouped by quest; right ones left out
const w = paperWrongsByQuest(paper, { answers: { "p-a-q1": "x", "p-a-q2": "x" } });
assert.deepEqual(Object.keys(w), ["english-quest"]);
assert.deepEqual(w["english-quest"].map((x) => [x.questionId, x.branchId]), [["p-a-q2", "n2"], ["p-b-q1", "n3"]]);

// mistakes carry the question itself; reading (passage) questions skipped; replayable without any read
const real = en1.parts.flatMap((part) => part.questions.map((q, i) => ({ questionId: `${en1.id}-${part.id}-q${i + 1}`, question: q, branchId: q.topic.node })));
const up = paperMistakeUpdates({}, real, { paperId: en1.id, now: 5 });
const passageCount = real.filter((x) => x.question.passage).length;
assert.ok(passageCount > 0);
assert.equal(Object.keys(up).length, real.length - passageCount);
const e0 = up[real[0].questionId];
assert.deepEqual([e0.kind, e0.quizId, e0.inline.answer, e0.inline.options.filter((o) => o.isCorrect).length], ["question", "paper-en-1", real[0].question.answer, 1]);
assert.ok(!JSON.stringify(up).includes("undefined") && !Object.values(up).some((v) => v && Object.values(v.inline).includes(undefined)), "no undefined for Firestore");
const items = buildMistakeItems(up, {}, () => 0);
assert.equal(items.length, Object.keys(up).length, "every paper mistake can be practised");
assert.equal(items[0].question.options.length, 4);
// cap still applies
const many = {};
for (let i = 0; i < MAX_MISTAKES; i++) many[`old${i}`] = { kind: "question", questionId: `old${i}`, lastWrongAt: i };
const capped = paperMistakeUpdates(many, real.slice(0, 5), { paperId: "x", now: 1000 });
assert.equal(Object.values(capped).filter((v) => v === null).length, 5, "oldest 5 dropped");

// stars (DR-15): 10 for finishing + up to 20 for marks; blank submit 0; once a week
const now = 1_800_000_000_000;
assert.equal(paperStars({ score: 47, max: 60, answered: 50, total: 50, nowMs: now }), 26);
assert.equal(paperStars({ score: 60, max: 60, answered: 50, total: 50, nowMs: now }), 30);
assert.equal(paperStars({ score: 0, max: 60, answered: 3, total: 50, nowMs: now }), 0);
assert.equal(paperStars({ score: 30, max: 60, answered: 40, total: 50, nowMs: now }), 20);
assert.equal(paperStars({ score: 47, max: 60, answered: 50, total: 50, nowMs: now, lastRewardMs: now - 1000 }), 0);
assert.equal(paperStars({ score: 47, max: 60, answered: 50, total: 50, nowMs: now, lastRewardMs: now - PAPER_REWARD_GAP_MS }), 26);
console.log("paper rewards + mistakes tests passed");

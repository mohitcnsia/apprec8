// Tests for utils/mistakes.js ("My mistakes"). Run: npm test
import assert from "node:assert/strict";
import { mistakeUpdates, buildMistakeItems, topicKey, RIGHT_TO_CLEAR, MAX_MISTAKES } from "../utils/mistakes.js";

const apply = (m, u) => {
  const out = { ...m };
  Object.entries(u).forEach(([k, v]) => (v === null ? delete out[k] : (out[k] = v)));
  return out;
};

// 1. Wrong practice answers become question entries; right ones add nothing.
let m = {};
let u = mistakeUpdates(m, [
  { questionId: "q1", isCorrect: false, subtopic: "gender" },
  { questionId: "q2", isCorrect: true },
], { mode: "practice", quizId: "quizA", branchId: "nouns", now: 100 });
assert.deepEqual(Object.keys(u), ["q1"]);
assert.deepEqual(u.q1, { kind: "question", questionId: "q1", quizId: "quizA", generator: null, subtopic: "gender", branchId: "nouns", lastWrongAt: 100, rightInARow: 0 });
m = apply(m, u);

// 2. Generated questions keep their generator so they can be rebuilt from the word table.
u = mistakeUpdates(m, [{ questionId: "gen:plural:leaf:s2p", isCorrect: false, generator: "plural", quizId: "eq-wt-plural", subtopic: "singular-plural" }], { mode: "endless", branchId: "nouns" });
assert.equal(u["gen:plural:leaf:s2p"].generator, "plural");
assert.equal(u["gen:plural:leaf:s2p"].quizId, "eq-wt-plural");
m = apply(m, u);

// 3. Gate/Boss mistakes are stored as TOPICS, never the exact question.
u = mistakeUpdates(m, [
  { questionId: "gate-q7", isCorrect: false, subtopic: "gender" },
  { questionId: "gate-q8", isCorrect: false, subtopic: "gender" },
], { mode: "gate", branchId: "nouns", unitId: "u1" });
assert.deepEqual(Object.keys(u), [topicKey({ branchId: "nouns", subtopic: "gender" })]);
assert.equal(u["topic:nouns:gender"].kind, "topic");
assert.ok(!("gate-q7" in u), "assessment question ids never stored");
m = apply(m, u);
assert.equal(Object.keys(mistakeUpdates(m, [{ questionId: "boss-q1", isCorrect: false }], { mode: "boss", unitId: "u0" })).join(), "topic:u0:all");

// 4. Reading answers are skipped.
assert.deepEqual(mistakeUpdates(m, [{ questionId: "r1", isCorrect: false }], { mode: "reading" }), {});

// 5. Inside "My mistakes": 2 right in a row clears; a wrong answer resets the count.
u = mistakeUpdates(m, [{ questionId: "q1", isCorrect: true }], { mode: "mistakes" });
assert.equal(u.q1.rightInARow, 1);
m = apply(m, u);
u = mistakeUpdates(m, [{ questionId: "q1", isCorrect: false }], { mode: "mistakes", now: 200 });
assert.equal(u.q1.rightInARow, 0);
m = apply(m, u);
u = mistakeUpdates(m, [{ questionId: "q1", isCorrect: true }, { questionId: "q1", isCorrect: true }], { mode: "mistakes" });
assert.equal(u.q1, null, `cleared after ${RIGHT_TO_CLEAR} right in a row (even within one session)`);
m = apply(m, u);
assert.ok(!("q1" in m));
// Topic entries are cleared by right answers to SIMILAR questions (mistakeKey points to the topic).
u = mistakeUpdates(m, [
  { questionId: "noun-gender-quiz-q3", mistakeKey: "topic:nouns:gender", isCorrect: true },
  { questionId: "gen:gender:king:m2f", mistakeKey: "topic:nouns:gender", isCorrect: true },
], { mode: "mistakes" });
assert.equal(u["topic:nouns:gender"], null);
// Answers in "mistakes" mode never ADD new entries.
assert.deepEqual(mistakeUpdates({}, [{ questionId: "zz", isCorrect: false }], { mode: "mistakes" }), {});

// 6. The list is capped: oldest dropped first.
const big = Object.fromEntries(Array.from({ length: MAX_MISTAKES }, (_, i) => [`old${i}`, { kind: "question", questionId: `old${i}`, lastWrongAt: i }]));
u = mistakeUpdates(big, [{ questionId: "new1", isCorrect: false }], { mode: "practice", now: 10_000 });
assert.equal(u.old0, null, "oldest removed");
assert.ok(u.new1);
assert.equal(Object.keys(apply(big, u)).length, MAX_MISTAKES);

// 7. Building a session: exact questions by id, topics get a similar question, unknown ids skipped, newest first.
const items = buildMistakeItems(
  {
    a: { kind: "question", questionId: "qa", lastWrongAt: 1 },
    gone: { kind: "question", questionId: "deleted", lastWrongAt: 5 },
    "topic:nouns:gender": { kind: "topic", branchId: "nouns", subtopic: "gender", lastWrongAt: 3 },
  },
  { byId: new Map([["qa", { id: "qa" }]]), similar: (e) => (e.subtopic === "gender" ? [{ id: "sim1" }] : []) }
);
assert.deepEqual(items.map((i) => [i.question.id, i.mistakeKey]), [["sim1", "topic:nouns:gender"], ["qa", "a"]]);
console.log("mistakes: all tests passed");

// similarQuestions: a gate sub-topic with no tagged practice question falls back to the branch
{
  const { similarQuestions } = await import("../utils/mistakes.js");
  const all = [
    { id: 1, branchId: "adv", subtopic: "kinds" },
    { id: 2, branchId: "adv", subtopic: null },
    { id: 3, branchId: "conj", subtopic: null },
  ];
  const ids = (xs) => xs.map((x) => x.id);
  assert.deepEqual(ids(similarQuestions(all, { branchId: "adv", subtopic: "kinds" })), [1]);
  assert.deepEqual(ids(similarQuestions(all, { branchId: "adv", subtopic: "forming" })), [1, 2]); // fallback
  assert.deepEqual(ids(similarQuestions(all, { branchId: "conj", subtopic: "pairs" })), [3]);
  assert.deepEqual(ids(similarQuestions(all, { unitId: "u1" }, { u1: ["adv", "conj"] })), [1, 2, 3]); // Boss
  assert.deepEqual(similarQuestions(all, { branchId: "none", subtopic: "x" }), []);
  console.log("mistakes similarQuestions: ok");
}

// Dead mistakes (owner's note, 13 Nov: Home said 5, practice had nothing to fix).
{
  const { deadMistakeKeys } = await import("../utils/mistakes.js");
  const m = {
    q_mistake_1: { kind: "question", questionId: "q_mistake_1", branchId: "b" }, // no quiz: can never load
    gone: { kind: "question", questionId: "gone", quizId: "qz1" }, // quiz loaded, question removed
    here: { kind: "question", questionId: "here", quizId: "qz1" },
    offline: { kind: "question", questionId: "x", quizId: "qz2" }, // quiz failed to load: keep
    paper: { kind: "question", questionId: "p1", inline: { text: "?" } },
    "topic:b": { kind: "topic", branchId: "b" },
  };
  const dead = deadMistakeKeys(m, { byId: new Map([["here", {}]]), loadedQuizIds: new Set(["qz1"]) });
  assert.deepEqual(dead.sort(), ["gone", "q_mistake_1"]);
  console.log("mistakes: dead entries ok");
}

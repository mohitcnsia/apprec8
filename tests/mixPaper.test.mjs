// tests/mixPaper.test.mjs — Mix papers built from quest questions (data/papers/mix.js)
import assert from "node:assert/strict";
import { buildMixPaper, mixPaperId, parseMixId } from "../data/papers/mix.js";
import { QUESTS } from "../data/quests/index.js";
import { paperQuestions, scorePaper } from "../utils/paperScore.js";

assert.equal(mixPaperId("english", 5, 3), "mix-en-g5-3");
assert.deepEqual(parseMixId("mix-sci-g4-12"), { subject: "science", grade: 4, n: 12 });
assert.equal(parseMixId("paper-en-1"), null);
assert.equal(buildMixPaper("nope"), null);

// Questions that must never appear: Challenge (gate) pools and Unit Boss tests.
const hidden = new Set();
for (const m of QUESTS)
  for (const n of m.nodes)
    if ((n.kind === "gate" || n.kind === "boss") && n.quizId) (m.quizzes[n.quizId] || []).forEach((q) => hidden.add(q.question.content));

for (const subject of ["english", "science"]) {
  for (const grade of [4, 5]) {
    const texts = [];
    for (let n = 1; n <= 6; n++) {
      const id = mixPaperId(subject, grade, n);
      const p = buildMixPaper(id);
      assert.deepEqual(buildMixPaper(id), p, `${id}: same id, same paper`);
      const qs = paperQuestions(p);
      assert.equal(qs.length, 50, `${id}: 50 questions (got ${qs.length})`);
      assert.equal(scorePaper(p, {}).max, 60, `${id}: 60 marks`);
      const own = new Set();
      for (const { question: q } of qs) {
        assert.ok(q.options.length === 4 && q.options.filter((o) => o.isCorrect).length === 1, `${id}: one right option`);
        assert.ok(q.options.some((o) => o.content === q.answer), `${id}: answer is an option`);
        assert.ok(q.topic?.quest && q.topic?.node, `${id}: topic for "practise next"`);
        assert.ok(!hidden.has(q.question.content), `${id}: uses a Challenge/Boss question: ${q.question.content}`);
        const k = `${q.passage || ""}|${q.question.content}`; // "What is the best title?" may sit under two stories
        assert.ok(!own.has(k), `${id}: repeats a question`);
        own.add(k);
        if (q.passage) assert.ok(p.passages[q.passage]?.paragraphs?.length, `${id}: passage present`);
      }
      texts.push(own);
    }
    // consecutive papers differ a lot
    const overlap = [...texts[0]].filter((t) => texts[1].has(t)).length;
    assert.ok(overlap < 25, `${subject} class ${grade}: papers 1 and 2 share ${overlap} questions`);
  }
}
console.log("mixPaper tests passed");

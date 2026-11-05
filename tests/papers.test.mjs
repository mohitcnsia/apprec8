// tests/papers.test.mjs — practice papers (mockup Q, draft): shape, answers, topics, reading evidence, no exam names.
import assert from "node:assert/strict";
import en1 from "../data/papers/englishPaper1.js";
import sci1 from "../data/papers/sciencePaper1.js";
import * as science from "../data/scienceQuestData.js";
import * as english from "../data/englishQuestData.js";
import * as wordPower from "../data/wordPowerQuestData.js";

const NODES = { "english-quest": new Set(english.nodes.map((n) => n.id)), "word-power": new Set(wordPower.nodes.map((n) => n.id)), "science-quest": new Set(science.nodes.map((n) => n.id)) };
const EXAM = /\b(IEO|NSO|IMO|SOF|Olympiad)\b/i;

function check(paper, { counts, totalMarks }) {
  assert.deepEqual(paper.parts.map((p) => p.questions.length), counts, `${paper.id}: questions per part`);
  assert.equal(paper.parts.reduce((s, p) => s + p.marks * p.questions.length, 0), totalMarks, `${paper.id}: total marks`);
  let longest = 0, n = 0;
  for (const part of paper.parts) {
    for (const x of part.questions) {
      const where = `${paper.id}/${part.id}: ${x.question.content}`;
      assert.equal(x.options.length, 4, where);
      assert.equal(new Set(x.options.map((o) => o.content)).size, 4, `${where} (options must differ)`);
      assert.equal(x.options.filter((o) => o.isCorrect).length, 1, where);
      x.options.filter((o) => !o.isCorrect).forEach((o) => assert.ok(o.mistakeTag, `${where}: wrong option without mistake tag`));
      assert.ok(x.topic && NODES[x.topic.quest]?.has(x.topic.node), `${where}: unknown topic ${JSON.stringify(x.topic)}`);
      const text = [x.question.content, ...x.options.map((o) => o.content), x.explanation.text].join(" ");
      assert.ok(!EXAM.test(text), `${where}: exam name in kid-facing text`);
      if (x.passage) {
        const passage = paper.passages[x.passage];
        assert.ok(passage, `${where}: unknown passage`);
        assert.ok(passage.paragraphs[x.evidence.paragraph]?.includes(x.evidence.text), `${where}: evidence not found in paragraph`);
      }
      const lens = x.options.map((o) => o.content.length);
      if (x.options.find((o) => o.isCorrect).content.length === Math.max(...lens) && lens.filter((l) => l === Math.max(...lens)).length === 1) longest++;
      n++;
    }
  }
  const pct = Math.round((100 * longest) / n);
  assert.ok(pct <= 40, `${paper.id}: right answer is the longest option in ${pct}% of questions (max 40%)`);
  Object.values(paper.passages || {}).forEach((p) => assert.ok(!EXAM.test(p.paragraphs.join(" ")), `${paper.id}: exam name in a passage`));
  console.log(`${paper.id}: ${n} questions, ${totalMarks} marks, longest-option tell ${pct}%`);
}

// Every bundled paper (data/papers/index.js), so new papers are checked as soon as they are listed.
const { PAPERS } = await import("../data/papers/index.js");
const SHAPES = { english: [30, 10, 5, 5], science: [10, 35, 5] };
for (const paper of PAPERS) check(paper, { counts: SHAPES[paper.subject], totalMarks: 60 });
assert.equal(new Set(PAPERS.map((p) => p.id)).size, PAPERS.length, "paper ids are unique");
// New, unseen questions: no paper question is a quest question, and no two papers share one (stories may share
// generic questions like "What is the passage mainly about?", so passage questions are keyed by their passage).
{
  const quest = new Set();
  // Same question = same text AND same answer ("Which sentence is punctuated correctly?" is a common stem).
  const id = (x) => `${x.question.content}|${x.answer ?? x.options.find((o) => o.isCorrect)?.content}`;
  for (const m of [english, wordPower, science]) Object.values(m.quizzes).flat().forEach((x) => quest.add(id(x)));
  const seen = new Map();
  for (const paper of PAPERS)
    for (const part of paper.parts)
      for (const x of part.questions) {
        const text = x.question.content;
        if (!x.passage) assert.ok(!quest.has(id(x)), `${paper.id}: "${text}" is already a quest question`);
        const key = x.passage ? `${paper.id}|${id(x)}` : id(x);
        assert.ok(!seen.has(key), `${paper.id}: "${text}" is also in ${seen.get(key)}`);
        seen.set(key, paper.id);
      }
}

// Thinking-skills answers recomputed (same rules as tests/reasoningCheck.test.mjs)
{
  const all = sci1.parts.flatMap((p) => p.questions);
  const ans = (start) => all.find((x) => x.question.content.startsWith(start)).answer;
  const shift = (w, n) => [...w].map((c) => String.fromCharCode(((c.charCodeAt(0) - 65 + n + 26) % 26) + 65)).join("");
  const sum = (w) => [...w].reduce((a, c) => a + c.charCodeAt(0) - 64, 0);
  assert.equal(shift("PLANT", 1), "QMBOU");
  assert.equal(ans("In a code, PLANT"), shift("SEED", 1));
  assert.equal(ans("If A = 1, B = 2 and so on, what do the letters of FISH"), String(sum("FISH")));
  assert.equal(ans("What comes next? B, E, H, K"), String.fromCharCode(64 + 11 + 3));
  assert.equal(ans("In a row of 25 students"), `${25 - 9 + 1}th`);
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  assert.equal(ans("If 5 March is a Tuesday"), DAYS[(DAYS.indexOf("Tuesday") + 10) % 7]);
}
console.log("papers tests passed");

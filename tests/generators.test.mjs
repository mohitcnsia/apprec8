// Tests for utils/generators.js + the word tables in data/englishQuestData.js. Run: npm test
// CONTENT ACCURACY: every table entry must produce a question with exactly one correct option,
// and no wrong option may be a correct form.
import assert from "node:assert/strict";
import { wrongPlurals, pluralQuestions, genderQuestions, explainPlural, nextEndlessQuestion } from "../utils/generators.js";
import { wordTables } from "../data/englishQuestData.js";

const seeded = (seed) => () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
const lower = (s) => s.toLowerCase();

// ---- Plural table
const plural = wordTables["eq-wt-plural"].entries;
assert.equal(new Set(plural.map((e) => lower(e.singular))).size, plural.length, "duplicate singular");
for (let seed = 1; seed <= 20; seed++) {
  const qs = pluralQuestions(plural, seeded(seed));
  assert.equal(qs.length, plural.length, "every plural entry must produce a question (else remove it from the table)");
  qs.forEach((q, i) => {
    const e = plural[i];
    const correctForms = new Set([lower(e.plural), ...(e.alsoCorrect || []).map(lower)]);
    assert.equal(q.options.length, 4, q.id);
    assert.equal(q.options.filter((o) => o.isCorrect).length, 1, q.id);
    assert.equal(q.options.find((o) => o.isCorrect).content, lower(e.plural), q.id);
    assert.equal(new Set(q.options.map((o) => o.content)).size, 4, `${q.id}: duplicate options`);
    q.options.filter((o) => !o.isCorrect).forEach((o) => {
      assert.ok(!correctForms.has(o.content), `${q.id}: wrong option '${o.content}' is a correct form`);
      assert.equal(o.mistakeTag, "plural-rule-error");
    });
    assert.ok(q.explanation.text.length > 10 && q.subtopic === "singular-plural" && q.generated && q.generator === "plural");
  });
}
// alsoCorrect forms are never offered as wrong
assert.ok(!wrongPlurals({ singular: "scarf", plural: "scarves", alsoCorrect: ["scarfs"] }).includes("scarfs"));
assert.ok(!wrongPlurals({ singular: "bus", plural: "buses", alsoCorrect: ["busses"] }).includes("busses"));
// realistic mistakes are generated
assert.ok(wrongPlurals({ singular: "child", plural: "children" }).includes("childrens"));
assert.ok(wrongPlurals({ singular: "leaf", plural: "leaves" }).includes("leafs"));
assert.ok(wrongPlurals({ singular: "baby", plural: "babies" }).includes("babys"));
assert.ok(wrongPlurals({ singular: "book", plural: "books" }).includes("book's"));
// explanations pick the right rule
assert.match(explainPlural({ singular: "baby", plural: "babies" }), /change y to i/);
assert.match(explainPlural({ singular: "wolf", plural: "wolves" }), /-ves/);
assert.match(explainPlural({ singular: "box", plural: "boxes" }), /add -es/);
assert.match(explainPlural({ singular: "pen", plural: "pens" }), /add -s/);
assert.match(explainPlural({ singular: "boy", plural: "boys" }), /Vowel \+ y/);
assert.match(explainPlural({ singular: "chief", plural: "chiefs" }), /just add -s. Learn these/);
assert.match(explainPlural({ singular: "giraffe", plural: "giraffes" }), /just add -s. Learn these/);
assert.match(explainPlural({ singular: "mouse", plural: "mice" }), /special plural/);

// ---- Gender table
const gender = wordTables["eq-wt-gender"].entries;
const ms = gender.map((e) => lower(e.masculine));
const fs = gender.map((e) => lower(e.feminine));
assert.equal(new Set(ms).size, ms.length, "each masculine must appear once");
assert.equal(new Set(fs).size, fs.length, "each feminine must appear once");
ms.forEach((m) => assert.ok(!fs.includes(m), `'${m}' is both masculine and feminine`));
const gq = genderQuestions(gender, seeded(3));
assert.equal(gq.length, gender.length * 2, "both directions for every pair");
gq.forEach((q) => {
  assert.equal(q.options.filter((o) => o.isCorrect).length, 1, q.id);
  assert.equal(new Set(q.options.map((o) => o.content)).size, 4, q.id);
  q.options.filter((o) => !o.isCorrect).forEach((o) => assert.equal(o.mistakeTag, "gender-error"));
  // the right answer pairs with the asked word in the table
  const asked = q.question.content.match(/'(.+)'/)[1].toLowerCase();
  const pair = gender.find((e) => lower(e.masculine) === asked || lower(e.feminine) === asked);
  const expected = lower(pair.masculine) === asked ? lower(pair.feminine) : lower(pair.masculine);
  assert.equal(q.answer, expected, q.id);
});
const ids = [...pluralQuestions(plural), ...gq].map((q) => q.id);
assert.equal(new Set(ids).size, ids.length, "generated ids must be unique (reports group by id)");

// ---- Endless feed: mixes sources, never repeats within the last 10
const pool = Array.from({ length: 12 }, (_, i) => ({ id: `p${i}` }));
const generated = Array.from({ length: 30 }, (_, i) => ({ id: `g${i}` }));
let st = { pool, generated };
const seen = [];
let fromGen = 0;
const rng = seeded(11);
for (let i = 0; i < 300; i++) {
  const r = nextEndlessQuestion(st, { genShare: 0.5, noRepeat: 10 }, rng);
  st = r.state;
  assert.ok(!seen.slice(-10).includes(r.question.id), `repeat within 10 at step ${i}`);
  seen.push(r.question.id);
  if (r.source === "gen") fromGen++;
}
assert.ok(fromGen > 100 && fromGen < 200, `mix about 50/50 (got ${fromGen}/300 generated)`);
// pool only, tiny pool (fewer than 10 questions) still works
st = { pool: pool.slice(0, 3), generated: [] };
for (let i = 0; i < 10; i++) { const r = nextEndlessQuestion(st, {}, rng); st = r.state; assert.ok(r.question); }
assert.equal(nextEndlessQuestion({ pool: [], generated: [] }).question, null);

// wordMeaning: 4 options, one right, all from the same table; emoji and **bold** stripped from the question;
// a meaning that contains its word is skipped (it would give the answer away).
{
  const { meaningQuestions } = await import("../utils/generators.js");
  const { WORD_BANK } = await import("../data/wordPower/wordBank.js");
  let total = 0;
  for (const g of WORD_BANK) {
    const words = new Set(g.words.map((w) => w.word.toLowerCase()));
    for (const mq of meaningQuestions(g.words, seeded(3))) {
      total++;
      assert.equal(mq.options.length, 4, mq.id);
      assert.equal(mq.options.filter((o) => o.isCorrect).length, 1, mq.id);
      assert.equal(new Set(mq.options.map((o) => o.content)).size, 4, `duplicate option in ${mq.id}`);
      mq.options.forEach((o) => assert.ok(words.has(o.content), `${o.content} not in ${g.name}`));
      assert.ok(!/\*\*|^Which word means: '\p{Extended_Pictographic}/u.test(mq.question.content), mq.question.content);
      assert.ok(!mq.question.content.toLowerCase().includes(mq.answer), `gives away ${mq.answer}`);
    }
  }
  assert.ok(total > 350, `word-meaning questions: ${total}`);
}

console.log(`generators: ${plural.length} plural words, ${gender.length} gender pairs, all questions verified`);

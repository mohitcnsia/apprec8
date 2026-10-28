// Validates data/englishQuestData.js. Run: npm test
import assert from "node:assert/strict";
import fs from "node:fs";
import * as D from "../data/englishQuestData.js";
import { buildQuestTree } from "../utils/questTree.js";
// Optional: a Firestore snapshot of old IEO questions (tests/fixtures/ieo_questions.json, not in git).
const snapshotUrl = new URL("./fixtures/ieo_questions.json", import.meta.url);
const old = fs.existsSync(snapshotUrl) ? JSON.parse(fs.readFileSync(snapshotUrl)) : null;
if (!old) console.log("(no IEO snapshot: skipping checks that reused IEO quizzes have questions)");
const existingStudy = "noun-intro-study noun-basic-study noun-sing-plu-study noun-gender-study noun-adv-study ieo-pronouns-intro-study ieo-pronouns-basic-study ieo-pronouns-adv-1-study ieo-pronouns-adv-2-study verbs-intro-study verbs-link-study verbs-trans-study verbs-finite-study 4ieo8-study 4ieo8-adj-degrees 4ieo6-study 4ieo6-fixed-prep 4ieo7-study".split(" ");
const nodes = [...D.units, ...D.leaves];
assert.equal(new Set(nodes.map(n => n.id)).size, nodes.length, "duplicate node ids");
let qCount = 0;
for (const [quizId, qs] of Object.entries(D.quizzes)) {
  qs.forEach((q, i) => {
    qCount++;
    const correct = q.options.filter(o => o.isCorrect);
    assert.equal(correct.length, 1, `${quizId} q${i+1}: needs exactly one correct`);
    assert.equal(correct[0].content, q.answer);
    assert.equal(new Set(q.options.map(o => o.content)).size, q.options.length, `${quizId} q${i+1}: duplicate options`);
    q.options.filter(o => !o.isCorrect).forEach(o => assert.ok(o.mistakeTag, `${quizId} q${i+1}: wrong option without mistakeTag`));
    assert.ok(q.explanation?.text, `${quizId} q${i+1}: no explanation`);
  });
}
for (const n of nodes) {
  if (n.kind === "leaf" && n.type === "quiz") assert.ok(D.quizzes[n.quizId] || !old || old[n.quizId]?.length, `missing quiz ${n.quizId}`);
  if (n.kind === "leaf" && n.type === "study") assert.ok(D.studyPages[n.contentId] || existingStudy.includes(n.contentId), `missing study ${n.contentId}`);
  if (n.kind === "leaf" && n.type === "reading") assert.ok(D.readings[n.contentId], `missing reading ${n.contentId}`);
  if (n.kind === "unit" && !n.comingSoon) assert.ok(D.quizzes[n.quizId], `unit test missing ${n.quizId}`);
  if (n.kind === "leaf") assert.ok(D.units.some(u => u.id === n.unitId), `leaf ${n.id} has unknown unit`);
}
import { buildReadingFlow, countWords } from "../utils/readingFlow.js";
for (const [id, r] of Object.entries(D.readings)) {
  assert.ok(["stepByStep", "fullPassage"].includes(r.mode), `${id}: bad mode`);
  r.questions.forEach((q, i) => {
    const tag = `${id} q${i+1}`;
    assert.equal(q.options.filter(o => o.isCorrect).length, 1, `${tag}: one correct`);
    assert.equal(new Set(q.options.map(o => o.content)).size, q.options.length, `${tag}: dup options`);
    q.options.filter(o => !o.isCorrect).forEach(o => assert.ok(o.mistakeTag, `${tag}: missing mistakeTag`));
    assert.ok(q.explanation?.text, `${tag}: explanation`);
    assert.ok(r.paragraphs[q.evidence.paragraph]?.includes(q.evidence.text), `${tag}: evidence not found in paragraph ${q.evidence.paragraph}`);
    if (r.mode === "stepByStep") assert.ok(q.afterParagraph >= 0 && q.afterParagraph < r.paragraphs.length, `${tag}: afterParagraph`);
  });
  Object.keys(r.glossary || {}).forEach(w => {
    assert.equal(w, w.toLowerCase(), `${id}: glossary key must be lowercase`);
    assert.ok(new RegExp(`\\b${w}\\b`, "i").test(r.paragraphs.join(" ")), `${id}: glossary word '${w}' not in passage`);
  });
  const f = buildReadingFlow(r);
  assert.equal(f.items.filter(x => x.kind === "q").length, r.questions.length, `${id}: every question in flow`);
  console.log(`reading ${id}: ${r.mode}, ${countWords(r.paragraphs)} words, ${r.questions.length} questions OK`);
}
const t = buildQuestTree(nodes, {});
console.log("units:", t.units.map(u => `${u.title} [${u.status}] branches=${u.branches.length}`).join(" | "));
console.log(`OK: ${nodes.length} nodes, ${Object.keys(D.quizzes).length} new quizzes, ${qCount} new questions`);

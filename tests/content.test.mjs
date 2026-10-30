// Validates data/englishQuestData.js. Run: npm test
import assert from "node:assert/strict";
import fs from "node:fs";
import * as D from "../data/englishQuestData.js";
import { buildQuestPath } from "../utils/questTree.js";
// Optional: a Firestore snapshot of old IEO questions (tests/fixtures/ieo_questions.json, not in git).
const snapshotUrl = new URL("./fixtures/ieo_questions.json", import.meta.url);
const old = fs.existsSync(snapshotUrl) ? JSON.parse(fs.readFileSync(snapshotUrl)) : null;
if (!old) console.log("(no IEO snapshot: skipping checks that reused IEO quizzes have questions)");
const existingStudy = "noun-intro-study noun-basic-study noun-sing-plu-study noun-gender-study noun-adv-study ieo-pronouns-intro-study ieo-pronouns-basic-study ieo-pronouns-adv-1-study ieo-pronouns-adv-2-study verbs-intro-study verbs-link-study verbs-trans-study verbs-finite-study 4ieo8-study 4ieo8-adj-degrees 4ieo6-study 4ieo6-fixed-prep 4ieo7-study".split(" ");
const nodes = D.nodes;
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
const KINDS = ["unit", "main", "practice", "gate", "endless", "boss"];
const unitIds = new Set(nodes.filter(n => n.kind === "unit").map(n => n.id));
const mainIds = new Set(nodes.filter(n => n.kind === "main").map(n => n.id));
const quizExists = (id) => !!D.quizzes[id] || !old || !!old[id]?.length;
const stepOk = (s, where) => {
  if (s.type === "quiz") assert.ok(quizExists(s.quizId), `${where}: missing quiz ${s.quizId}`);
  else if (s.type === "study") assert.ok(D.studyPages[s.contentId] || existingStudy.includes(s.contentId), `${where}: missing study ${s.contentId}`);
  else if (s.type === "reading") assert.ok(D.readings[s.contentId], `${where}: missing reading ${s.contentId}`);
  else assert.fail(`${where}: unknown step type ${s.type}`);
};
for (const n of nodes) {
  assert.ok(KINDS.includes(n.kind), `${n.id}: unknown kind ${n.kind}`);
  if (n.kind !== "unit") assert.ok(unitIds.has(n.unitId), `${n.id}: unknown unit ${n.unitId}`);
  if (["practice", "gate", "endless"].includes(n.kind)) assert.ok(mainIds.has(n.branchId), `${n.id}: unknown branch ${n.branchId}`);
  if (n.kind === "main" || n.kind === "practice") {
    assert.ok(n.steps?.length, `${n.id}: no steps`);
    n.steps.forEach((s, i) => stepOk(s, `${n.id} step ${i}`));
  }
  if (n.kind === "practice") assert.ok(["easy", "medium", "hard"].includes(n.difficulty), `${n.id}: difficulty`);
  if (n.kind === "gate" || n.kind === "boss") assert.ok(quizExists(n.quizId), `${n.id}: missing quiz ${n.quizId}`);
  if (n.kind === "boss" && n.story) {
    assert.ok(n.story.length >= 40 && n.story.length <= 400, `${n.id}: story should be 40–400 characters`);
    assert.ok(!/\d/.test(n.story), `${n.id}: keep numbers out of the story (the app adds the pass rule)`);
  }
}
// ♾️ endless generators must point at existing word tables of the right type
for (const e of nodes.filter((n) => n.kind === "endless")) {
  (e.generators || []).forEach((g) => {
    const t = D.wordTables?.[g.table];
    assert.ok(t, `${e.id}: missing word table ${g.table}`);
    assert.equal(t.tableType, g.type, `${e.id}: table ${g.table} is ${t.tableType}, not ${g.type}`);
  });
}
for (const b of mainIds) assert.ok(nodes.filter(n => n.kind === "gate" && n.branchId === b).length <= 1, `${b}: more than one gate`);
// Gate pools (Spec v2 Step 2): every question tagged with a known sub-topic, enough questions to draw
// a fresh balanced test, and every practice sub-topic of the branch named on the gate.
for (const g of nodes.filter(n => n.kind === "gate")) {
  const pool = D.quizzes[g.quizId];
  if (!pool) continue; // reused old quiz (no sub-topics yet)
  const titles = g.subtopicTitles || {};
  assert.ok(Object.keys(titles).length > 0, `${g.id}: subtopicTitles missing`);
  assert.ok(pool.length >= (g.drawCount || 10), `${g.id}: pool smaller than drawCount`);
  pool.forEach((q, i) => assert.ok(titles[q.subtopic], `${g.id} q${i+1}: sub-topic '${q.subtopic}' not in subtopicTitles`));
  for (const t of Object.keys(titles)) {
    assert.ok(pool.filter(q => q.subtopic === t).length >= 3, `${g.id}: sub-topic '${t}' needs at least 3 questions`);
  }
  nodes.filter(n => n.kind === "practice" && n.branchId === g.branchId && n.subtopic)
    .forEach(p => assert.ok(titles[p.subtopic], `${p.id}: sub-topic '${p.subtopic}' not named on ${g.id}`));
  console.log(`gate ${g.id}: ${pool.length} questions, sub-topics ${Object.keys(titles).map(t => `${t}=${pool.filter(q => q.subtopic === t).length}`).join(" ")}`);
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
const t = buildQuestPath(nodes, {});
assert.equal(t.path[0].status, "unlocked", "first main node must be open");
console.log("path:", t.path.map(p => `${p.title}${p.kind === "boss" ? " [boss]" : ""}`).join(" → "));
console.log(`OK: ${nodes.length} nodes, ${Object.keys(D.quizzes).length} new quizzes, ${qCount} new questions`);

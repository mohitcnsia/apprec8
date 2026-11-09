// Validates every tile quest in data/quests/index.js (English, Science, ...). Run: npm test
import assert from "node:assert/strict";
import fs from "node:fs";
import { QUESTS } from "../data/quests/index.js";
import { buildQuestPath } from "../utils/questTree.js";
import { buildReadingFlow, countWords } from "../utils/readingFlow.js";
// Optional: a Firestore snapshot of old IEO questions (tests/fixtures/ieo_questions.json, not in git).
const snapshotUrl = new URL("./fixtures/ieo_questions.json", import.meta.url);
const old = fs.existsSync(snapshotUrl) ? JSON.parse(fs.readFileSync(snapshotUrl)) : null;
if (!old) console.log("(no IEO snapshot: skipping checks that reused IEO quizzes have questions)");
const existingStudy = "noun-intro-study noun-basic-study noun-sing-plu-study noun-gender-study noun-adv-study ieo-pronouns-intro-study ieo-pronouns-basic-study ieo-pronouns-adv-1-study ieo-pronouns-adv-2-study verbs-intro-study verbs-link-study verbs-trans-study verbs-finite-study 4ieo8-study 4ieo8-adj-degrees 4ieo6-study 4ieo6-fixed-prep 4ieo7-study".split(" ");
function checkQuest(D) {
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
  // Only English Quest reuses old IEO quizzes/pages; course quests can reuse English Quest content.
  const reusesEnglish = D.QUEST_ID === "course-seema-c10-english";
  const englishQuest = reusesEnglish ? QUESTS.find(q => q.QUEST_ID === "english-quest") : null;
  const reusesIeo = D.QUEST_ID === "english-quest";
  const quizExists = (id) =>
    !!D.quizzes[id] ||
    (reusesIeo && (!old || !!old[id]?.length)) ||
    (reusesEnglish && !!englishQuest?.quizzes[id]);
  const stepOk = (s, where) => {
    if (s.type === "quiz") assert.ok(quizExists(s.quizId), `${where}: missing quiz ${s.quizId}`);
    else if (s.type === "study")
      assert.ok(
        D.studyPages[s.contentId] ||
          (reusesIeo && existingStudy.includes(s.contentId)) ||
          (reusesEnglish && !!englishQuest?.studyPages[s.contentId]),
        `${where}: missing study ${s.contentId}`
      );
    else if (s.type === "reading")
      assert.ok(
        D.readings[s.contentId] ||
          (reusesEnglish && !!englishQuest?.readings[s.contentId]),
        `${where}: missing reading ${s.contentId}`
      );
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
    const pool = D.quizzes[g.quizId] || (reusesEnglish ? englishQuest?.quizzes[g.quizId] : null);
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
    // "My mistakes" practises a gate mistake with practice questions of the same sub-topic. When the
    // branch's practice is all new content, every gate sub-topic needs at least one (else the app falls
    // back to any branch question, and older builds can't clear the mistake at all).
    const practiceSteps = [nodes.find(n => n.id === g.branchId), ...nodes.filter(n => n.kind === "practice" && n.branchId === g.branchId)]
      .flatMap(n => (n.steps || []).filter(s => s.type === "quiz").map(s => ({ quizId: s.quizId, node: n })));
    const getQuiz = (qid) => D.quizzes[qid] || (reusesEnglish ? englishQuest?.quizzes[qid] : null);
    if (practiceSteps.every(s => getQuiz(s.quizId))) {
      const tagged = new Set(practiceSteps.flatMap(s => getQuiz(s.quizId).map(q => q.subtopic || s.node.subtopic)));
      for (const t of Object.keys(titles)) assert.ok(tagged.has(t), `${g.id}: no practice question for sub-topic '${t}' (My mistakes can't fix it)`);
    }
    console.log(`gate ${g.id}: ${pool.length} questions, sub-topics ${Object.keys(titles).map(t => `${t}=${pool.filter(q => q.subtopic === t).length}`).join(" ")}`);
  }
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
  console.log(`OK ${D.QUEST_ID}: ${nodes.length} nodes, ${Object.keys(D.quizzes).length} new quizzes, ${qCount} new questions`);

  // "Pick the longest answer" must not work (lesson from G16, 2026-11-04): with 4 options the right one should be the
  // longest about a quarter of the time. Checked per quest once it has 20+ new questions.
  const allQs = Object.values(D.quizzes).flat();
  if (allQs.length >= 20) {
    const longest = allQs.filter((q) => {
      const c = q.options.find((o) => o.isCorrect).content.length;
      return q.options.every((o) => o.isCorrect || o.content.length < c);
    }).length;
    const share = longest / allQs.length;
    console.log(`${D.QUEST_ID}: right answer is the longest option in ${Math.round(share * 100)}% of questions`);
    assert.ok(share <= 0.4, `${D.QUEST_ID}: the right answer is the longest option in ${Math.round(share * 100)}% of questions (max 40%). Make wrong options as long and detailed as the right one.`);
    // ...and not the opposite tell either ("never pick the longest"): 0% is as easy to game as 68%.
    assert.ok(share >= 0.1, `${D.QUEST_ID}: the right answer is the longest option in only ${Math.round(share * 100)}% of questions (min 10%). Mix it up: sometimes the right one is the longest.`);
  }
  // Kid-sized options: Class 3–5 kids read every option under time pressure.
  for (const [quizId, qs] of Object.entries(D.quizzes)) {
    qs.forEach((q, i) => q.options.forEach((o) => {
      const words = String(o.content).split(/\s+/).length;
      assert.ok(words <= 14, `${quizId} q${i + 1}: option too long (${words} words, max 14): "${o.content}"`);
    }));
  }

  // Class tags: whole numbers 1–12
  for (const n of nodes.filter((x) => x.grades !== undefined)) {
    assert.ok(Array.isArray(n.grades) && n.grades.length && n.grades.every((g) => Number.isInteger(g) && g >= 1 && g <= 12), `${n.id}: grades must be classes 1–12`);
  }
  // No exam labels in anything a kid reads (owner 2026-11-04: kids learn without labels). Ids are not shown, so skipped.
  const LABEL = /\b(IEO|NSO|IMO|SOF|Olympiads?)\b/i;
  const scanText = (where, v, key = "") => {
    if (typeof v === "string") {
      if (!/(^|[a-z])Id$|^id$|^(steps|branchId|unitId|table|questId|parentId)$/i.test(key)) {
        assert.ok(!LABEL.test(v), `${D.QUEST_ID} ${where}: exam label in kid-facing text: "${(v.match(/[^\n]{0,30}\b(IEO|NSO|IMO|SOF|Olympiads?)\b[^\n]{0,30}/i) || [v])[0]}"`);
      }
    } else if (v && typeof v === "object") for (const k of Object.keys(v)) scanText(`${where}.${k}`, v[k], k);
  };
  scanText("quest", D.quest); scanText("tile", D.tile); scanText("studyPages", D.studyPages);
  scanText("quizzes", D.quizzes); scanText("readings", D.readings || {});
  nodes.forEach((n) => scanText(`node ${n.id}`, { title: n.title, description: n.description, story: n.story, subtopicTitles: n.subtopicTitles }));

  assert.ok(D.QUEST_ID && D.quest?.title && D.tile?.questId === D.QUEST_ID, `${D.QUEST_ID}: quest/tile/QUEST_ID mismatch`);
  if (D.quest.draft) assert.equal(D.tile.carouselGroup, "quest_draft", `${D.QUEST_ID}: draft quests must use carouselGroup quest_draft`);
  else assert.equal(D.tile.carouselGroup, "quest", `${D.QUEST_ID}: tile carouselGroup`);
}

// Node / quiz / page ids must be unique across quests (they share Firestore collections).
const seen = new Map();
for (const D of QUESTS) {
  for (const id of [...D.nodes.map((n) => n.id), ...Object.keys(D.quizzes), ...Object.keys(D.studyPages), ...Object.keys(D.readings || {})]) {
    assert.ok(!seen.has(id) || seen.get(id) === D.QUEST_ID, `id ${id} used by ${seen.get(id)} and ${D.QUEST_ID}`);
    seen.set(id, D.QUEST_ID);
  }
  checkQuest(D);
}

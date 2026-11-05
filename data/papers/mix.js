// data/papers/mix.js: "Mix papers" (owner 2026-11-05: "we will need far more practice papers… no dearth of practice").
// Built on the phone from questions already in the quests (reviewed and approved), in the same shape as Paper 1, so a
// child can sit as many papers as she likes. Never uses Challenge (gate) or Unit Boss questions: those stay hidden.
// A paper is fully decided by its id `mix-<subject>-g<class>-<n>`: the same id always gives the same paper (resume, review).
// Pure (no React / Firebase): tests/mixPaper.test.mjs.

import { QUESTS } from "../quests/index.js";
import { nodesForGrade } from "../../utils/gradeFilter.js";
import { seededRandom } from "../../utils/readingFlow.js";

const byId = (id) => QUESTS.find((m) => m.QUEST_ID === id);

function shuffled(list, rng) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Text of every Challenge (gate) and Unit Boss question: a practice copy of the same question is left out too.
const HIDDEN = new Set();
for (const m of QUESTS)
  for (const n of m.nodes)
    if ((n.kind === "gate" || n.kind === "boss") && n.quizId) (m.quizzes[n.quizId] || []).forEach((q) => q?.question?.content && HIDDEN.add(q.question.content));

const isChampion = (n) => n.kind === "practice" && (n.difficulty === "hard" || /champion/i.test(n.title || ""));

/** Practice-safe questions of one quest for a class: [{ question, topic, unitId, champion }]. Gates and Bosses left out. */
function questPool(questId, grade) {
  const m = byId(questId);
  if (!m) return [];
  const nodes = nodesForGrade(m.nodes, grade);
  const out = [];
  for (const n of nodes) {
    if (n.kind !== "main" && n.kind !== "practice") continue;
    for (const step of n.steps || []) {
      if (step.type !== "quiz") continue;
      (m.quizzes[step.quizId] || []).forEach((q, i) => {
        if (!q?.answer || q.question?.type !== "text" || (q.options || []).length !== 4 || HIDDEN.has(q.question.content)) return;
        out.push({
          key: `${step.quizId}#${i}`,
          question: q,
          topic: { quest: questId, node: n.branchId || n.id },
          unitId: n.unitId,
          champion: isChampion(n),
        });
      });
    }
  }
  return out;
}

/** Reading passages (with their questions) a class can see. */
function readingPool(questId, grade) {
  const m = byId(questId);
  if (!m) return [];
  const out = [];
  for (const n of nodesForGrade(m.nodes, grade)) {
    for (const step of n.steps || []) {
      if (step.type !== "reading") continue;
      const doc = m.readings?.[step.contentId];
      if (doc?.paragraphs?.length && doc.questions?.length >= 5) out.push({ id: step.contentId, doc, topic: { quest: questId, node: n.branchId || n.id } });
    }
  }
  return out;
}

/** Takes up to `count` items, skipping questions already used (same text) in this paper. */
function take(pool, count, rng, used) {
  const picked = [];
  for (const item of shuffled(pool, rng)) {
    if (picked.length >= count) break;
    const text = item.question.question.content;
    if (used.has(text)) continue;
    used.add(text);
    picked.push(item);
  }
  return picked;
}

const asPaperQuestion = ({ question, topic }) => ({
  question: question.question,
  options: question.options,
  answer: question.answer,
  explanation: question.explanation || null,
  topic,
});

export const mixPaperId = (subject, grade, n) => `mix-${subject === "science" ? "sci" : "en"}-g${grade}-${n}`;

export function parseMixId(id = "") {
  const m = /^mix-(en|sci)-g(\d+)-(\d+)$/.exec(String(id));
  return m ? { subject: m[1] === "sci" ? "science" : "english", grade: Number(m[2]), n: Number(m[3]) } : null;
}

/** Builds Mix paper `id`, or null. Shape as Paper 1 (60 marks). */
export function buildMixPaper(id) {
  const info = parseMixId(id);
  if (!info) return null;
  const { subject, grade, n } = info;
  const rng = seededRandom(id);
  const used = new Set();
  const base = { id, subject, title: `Mix paper ${n}`, minutes: 60, grades: [grade], mix: true, passages: {} };

  if (subject === "english") {
    const eq = questPool("english-quest", grade);
    const wp = questPool("word-power", grade);
    const everydayUnits = new Set(["wp-u2"]);
    const words = take([...eq, ...wp].filter((x) => !x.champion && !everydayUnits.has(x.unitId)), 30, rng, used);
    const everyday = take(wp.filter((x) => everydayUnits.has(x.unitId) && !x.champion), 5, rng, used);
    const champion = take([...eq, ...wp].filter((x) => x.champion), 5, rng, used);
    // Reading: two passages, five questions each (in story order).
    const readings = shuffled([...readingPool("english-quest", grade), ...readingPool("word-power", grade)], rng).slice(0, 2);
    const reading = [];
    readings.forEach((r, k) => {
      const key = `p${k + 1}`;
      base.passages[key] = { title: r.doc.name || "Read the story", paragraphs: r.doc.paragraphs };
      r.doc.questions
        .filter((q) => q?.answer || q?.options?.some((o) => o.isCorrect))
        .slice(0, 5)
        .forEach((q) =>
          reading.push({
            question: q.question,
            options: q.options,
            answer: q.answer || q.options.find((o) => o.isCorrect).content,
            explanation: q.explanation || null,
            topic: r.topic,
            passage: key,
          })
        );
    });
    return {
      ...base,
      parts: [
        { id: "words", title: "Words & Grammar", marks: 1, questions: words.map(asPaperQuestion) },
        { id: "reading", title: "Reading", marks: 1, questions: reading },
        { id: "everyday", title: "Everyday English", marks: 1, questions: everyday.map(asPaperQuestion) },
        { id: "champion", title: "Champion questions", marks: 3, questions: champion.map(asPaperQuestion) },
      ].filter((p) => p.questions.length),
    };
  }

  const sq = questPool("science-quest", grade);
  const thinking = take(sq.filter((x) => x.unitId === "sq-u6"), 10, rng, used);
  const champion = take(sq.filter((x) => x.champion && x.unitId !== "sq-u6"), 5, rng, used);
  const science = take(sq.filter((x) => x.unitId !== "sq-u6" && !x.champion), 35 + (5 - champion.length), rng, used);
  return {
    ...base,
    parts: [
      { id: "thinking", title: "Thinking skills", marks: 1, questions: thinking.map(asPaperQuestion) },
      { id: "science", title: "Science", marks: 1, questions: science.map(asPaperQuestion) },
      { id: "champion", title: "Champion questions", marks: 3, questions: champion.map(asPaperQuestion) },
    ].filter((p) => p.questions.length),
  };
}

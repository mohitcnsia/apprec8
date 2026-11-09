// data/papers/mix.js: "Mix papers" (owner 2026-11-05: "we will need far more practice papers… no dearth of practice").
// Built on the phone from questions already in the quests (reviewed and approved), in the same shape as Paper 1, so a
// child can sit as many papers as she likes. Never uses Challenge (gate) or Unit Boss questions: those stay hidden.
// A paper is fully decided by its id `mix-<subject>-g<class>-<n>`: the same id always gives the same paper (resume, review).
// Pure (no React / Firebase): tests/mixPaper.test.mjs.

import { QUESTS } from "../quests/index.js";
import { nodesForGrade } from "../../utils/gradeFilter.js";
import { seededRandom } from "../../utils/readingFlow.js";
import { pictureQuestionsFor } from "./pictureQuestions.js";

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
  // Thinking skills: 3 picture questions (spec U) + 7 from the Patterns & Puzzles unit.
  const pictures = take(pictureQuestionsFor().map((q) => ({ question: q, topic: q.topic, picture: q })), 3, rng, used);
  const thinking = [...pictures, ...take(sq.filter((x) => x.unitId === "sq-u6"), 10 - pictures.length, rng, used)];
  const champion = take(sq.filter((x) => x.champion && x.unitId !== "sq-u6"), 5, rng, used);
  const science = take(sq.filter((x) => x.unitId !== "sq-u6" && !x.champion), 35 + (5 - champion.length), rng, used);
  return {
    ...base,
    parts: [
      { id: "thinking", title: "Thinking skills", marks: 1, questions: thinking.map((x) => (x.picture ? x.picture : asPaperQuestion(x))) },
      { id: "science", title: "Science", marks: 1, questions: science.map(asPaperQuestion) },
      { id: "champion", title: "Champion questions", marks: 3, questions: champion.map(asPaperQuestion) },
    ].filter((p) => p.questions.length),
  };
}

// ---------- G91 Check-up (pilot week 1, 2026-11-10) ----------
// For Classes 9–10 (Seema's Class 10 pilot): every Grammar Pro topic of the class, 3 questions each, one part per unit,
// so each child gets an Accuracy per topic (utils/paperTopics.js). Same rules as Mix papers: reviewed quest questions
// only, never Challenge or Boss questions. Check-up 2 uses different questions where the pool allows (seeded by id).
export const CHECKUP_GRADES = [9, 10];
const PER_TOPIC = 3;
export const checkupPaperId = (grade, n) => `checkup-en-g${grade}-${n}`;
export function parseCheckupId(id = "") {
  const m = /^checkup-en-g(\d+)-(\d+)$/.exec(String(id));
  return m && CHECKUP_GRADES.includes(Number(m[1])) ? { subject: "english", grade: Number(m[1]), n: Number(m[2]) } : null;
}

export function buildCheckupPaper(id) {
  const info = parseCheckupId(id);
  if (!info) return null;
  const { grade, n } = info;
  const m = byId("english-quest");
  if (!m) return null;
  // The class's own level: topics only for Classes 9–10 (not the younger units they can also open).
  const own = nodesForGrade(m.nodes, grade).filter((x) => x.kind === "main" && (x.grades || []).length && Math.min(...x.grades) >= 9);
  const ownIds = new Set(own.map((x) => x.id));
  const pool = questPool("english-quest", grade).filter((x) => ownIds.has(x.topic.node));
  const rng = seededRandom(id);
  const used = new Set();
  // Check-up n skips the questions the earlier check-ups used, while each topic still has enough left.
  for (let k = 1; k < n; k++) {
    const earlier = buildCheckupPaper(checkupPaperId(grade, k));
    const texts = new Set((earlier?.parts || []).flatMap((p) => p.questions.map((q) => q.question.content)));
    for (const t of own) {
      const left = pool.filter((x) => x.topic.node === t.id && !texts.has(x.question.question.content) && !used.has(x.question.question.content));
      if (left.length >= PER_TOPIC) pool.filter((x) => x.topic.node === t.id && texts.has(x.question.question.content)).forEach((x) => used.add(x.question.question.content));
    }
  }
  const units = m.nodes.filter((u) => u.kind === "unit" && own.some((t) => t.unitId === u.id));
  const parts = units.map((u) => {
    const qs = own.filter((t) => t.unitId === u.id).flatMap((t) => take(pool.filter((x) => x.topic.node === t.id), PER_TOPIC, rng, used));
    return { id: u.id, title: String(u.title || "").replace(/^Grammar Pro:\s*/, ""), marks: 1, questions: qs.map(asPaperQuestion) };
  }).filter((p) => p.questions.length);
  if (!parts.length) return null;
  const count = parts.reduce((s, p) => s + p.questions.length, 0);
  return { id, subject: "english", title: `Check-up ${n}`, minutes: Math.max(20, Math.round(count * 0.9)), grades: [grade], mix: true, checkup: true, passages: {}, parts };
}

// utils/generators.js
// Question generators for ♾️ Keep practising (Spec v2 Step 4). Pure: no React / Firebase.
// CONTENT ACCURACY FIRST: answers come only from verified word tables. Wrong options are
// filtered so they can never be a correct form (plural + alsoCorrect).
//
// Word tables (studyContent docs with kind "wordTable"):
//   plural:     [{ singular, plural, alsoCorrect?: [] }]
//   nounGender: [{ masculine, feminine }]
//
// Generated question shape = V2 question used by the quiz screens:
//   { id, question: { type, content }, options: [{ content, isCorrect, mistakeTag }], answer,
//     explanation: { text }, subtopic, generated: true }

import { shuffle } from "./gateRules.js";

const lower = (s) => String(s || "").trim().toLowerCase();
const VOWELS = "aeiou";

/** Common WRONG ways kids form plurals (never returns the correct forms). */
export function wrongPlurals({ singular, plural, alsoCorrect = [] }) {
  const w = lower(singular);
  const candidates = new Set();
  candidates.add(w + "s"); // add -s
  candidates.add(w + "es"); // add -es (treees, boxes when wrong)
  candidates.add(w); // unchanged
  candidates.add(w + "'s"); // apostrophe mistake: book's (a possessive, never a plural)
  if (w.endsWith("y")) candidates.add(w.slice(0, -1) + "ies"); // y → ies
  if (w.endsWith("y") && !VOWELS.includes(w[w.length - 2])) candidates.add(w + "s"); // babys
  if (w.endsWith("fe") && !w.endsWith("ffe")) candidates.add(w.slice(0, -2) + "ves"); // fe → ves
  if (w.endsWith("f") && !w.endsWith("ff")) candidates.add(w.slice(0, -1) + "ves"); // f → ves
  const p = lower(plural);
  if (!p.endsWith("s")) candidates.add(p + "s"); // double plural: childrens, mens
  if (p.endsWith("ves")) candidates.add(w + "s"); // leafs
  if (p.endsWith("ies")) candidates.add(w + "s"); // babys
  if (p.endsWith("es") && !p.endsWith("ies") && !p.endsWith("ves")) candidates.add(w + "s"); // boxs

  const correct = new Set([p, ...alsoCorrect.map(lower)]);
  return [...candidates].filter((c) => c && !correct.has(c));
}

/** Kid-friendly explanation of why the plural is what it is. */
export function explainPlural({ singular, plural }) {
  const s = lower(singular);
  const p = lower(plural);
  if (p === s) return `'${singular}' stays the same: one ${singular}, two ${plural}.`;
  if (s.endsWith("y") && p === s.slice(0, -1) + "ies")
    return `Consonant + y: change y to i and add -es. ${singular} → ${plural}.`;
  if (p.endsWith("ves") && (s.endsWith("f") || s.endsWith("fe")))
    return `Many words ending in -f or -fe change to -ves. ${singular} → ${plural}.`;
  if (p === s + "es") return `Words ending in -s, -sh, -ch, -x, -z (and some ending in -o) add -es. ${singular} → ${plural}.`;
  if (p === s + "s" && s.endsWith("y") && VOWELS.includes(s[s.length - 2]))
    return `Vowel + y: just add -s. ${singular} → ${plural}.`;
  if (p === s + "s" && (s.endsWith("f") || s.endsWith("fe")))
    return `Some words ending in -f or -fe just add -s. Learn these! ${singular} → ${plural}.`;
  if (p === s + "s") return `Most words just add -s. ${singular} → ${plural}.`;
  return `'${singular}' has a special plural: ${plural}. Learn it by heart!`;
}

/** Plural questions (singular → plural). Entries without 3 safe wrong options are skipped. */
export function pluralQuestions(table = [], rng = Math.random) {
  const out = [];
  for (const e of table) {
    const wrong = shuffle(wrongPlurals(e), rng).slice(0, 3);
    if (wrong.length < 3) continue;
    const answer = lower(e.plural);
    out.push({
      id: `gen:plural:${lower(e.singular)}:s2p`,
      question: { type: "text", content: `What is the plural of '${e.singular}'?` },
      options: shuffle(
        [
          { type: "text", content: answer, isCorrect: true },
          ...wrong.map((c) => ({ type: "text", content: c, isCorrect: false, mistakeTag: "plural-rule-error" })),
        ],
        rng
      ),
      answer,
      explanation: { text: explainPlural(e) },
      subtopic: "singular-plural",
      generated: true,
    });
  }
  return out;
}

/** Noun gender questions, both directions. Wrong options are other table words of the same gender. */
export function genderQuestions(table = [], rng = Math.random) {
  const out = [];
  const masculines = table.map((e) => lower(e.masculine));
  const feminines = table.map((e) => lower(e.feminine));
  table.forEach((e) => {
    const m = lower(e.masculine);
    const f = lower(e.feminine);
    const wrongF = shuffle(feminines.filter((x) => x !== f && x !== m), rng).slice(0, 3);
    const wrongM = shuffle(masculines.filter((x) => x !== m && x !== f), rng).slice(0, 3);
    if (wrongF.length === 3) {
      out.push({
        id: `gen:gender:${m}:m2f`,
        question: { type: "text", content: `What is the feminine of '${e.masculine}'?` },
        options: shuffle(
          [{ type: "text", content: f, isCorrect: true }, ...wrongF.map((c) => ({ type: "text", content: c, isCorrect: false, mistakeTag: "gender-error" }))],
          rng
        ),
        answer: f,
        explanation: { text: `${e.masculine} (male) → ${e.feminine} (female).` },
        subtopic: "gender",
        generated: true,
      });
    }
    if (wrongM.length === 3) {
      out.push({
        id: `gen:gender:${f}:f2m`,
        question: { type: "text", content: `What is the masculine of '${e.feminine}'?` },
        options: shuffle(
          [{ type: "text", content: m, isCorrect: true }, ...wrongM.map((c) => ({ type: "text", content: c, isCorrect: false, mistakeTag: "gender-error" }))],
          rng
        ),
        answer: m,
        explanation: { text: `${e.feminine} (female) → ${e.masculine} (male).` },
        subtopic: "gender",
        generated: true,
      });
    }
  });
  return out;
}

export const GENERATORS = { plural: pluralQuestions, nounGender: genderQuestions };

/**
 * Endless feed: picks the next question, mixing pool and generated questions,
 * never repeating one of the last `noRepeat` questions. Reshuffles when a source runs out.
 * state = { pool: [], generated: [], poolQueue: [], genQueue: [], recent: [] } (mutated copy returned)
 */
export function nextEndlessQuestion(state, { genShare = 0.5, noRepeat = 10 } = {}, rng = Math.random) {
  const s = { ...state, poolQueue: [...(state.poolQueue || [])], genQueue: [...(state.genQueue || [])], recent: [...(state.recent || [])] };
  const hasPool = (s.pool || []).length > 0;
  const hasGen = (s.generated || []).length > 0;
  if (!hasPool && !hasGen) return { state: s, question: null };
  const useGen = hasGen && (!hasPool || rng() < genShare);
  const source = useGen ? "gen" : "pool";
  const all = useGen ? s.generated : s.pool;
  const queueKey = useGen ? "genQueue" : "poolQueue";

  const recent = new Set(s.recent);
  for (let tries = 0; tries < 2; tries++) {
    if (s[queueKey].length === 0) s[queueKey] = shuffle(all, rng);
    const idx = s[queueKey].findIndex((q) => !recent.has(q.id));
    if (idx >= 0) {
      const [q] = s[queueKey].splice(idx, 1);
      s.recent = [...s.recent, q.id].slice(-noRepeat);
      return { state: s, question: q, source };
    }
    s[queueKey] = []; // everything queued was recent: reshuffle once
  }
  // Tiny sources (< noRepeat questions): allow a repeat rather than stopping.
  const q = shuffle(all, rng)[0];
  s.recent = [...s.recent, q.id].slice(-noRepeat);
  return { state: s, question: q, source };
}

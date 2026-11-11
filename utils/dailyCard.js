// utils/dailyCard.js: "Word and fact of the day" on the kid's Home (owner + Seema, 2026-11-11; spec in the
// "Simpler Home, Progress and Me" doc). Pure, so it is tested without a phone.
// - Words: Treasure Words Learn cards for the kid's class (already checked content).
// - Facts: Science quest Learn cards for Classes 3–5; Space quest fun facts for Classes 6–10; none for Classes 1–2 yet.
// - Same word and fact for every kid of a class on a given day (so a class or a family can talk about it), and the
//   whole list is gone through before anything repeats.
import { seededRandom } from "./readingFlow.js";

/** The phone's calendar day as a number (changes at local midnight). */
export function dayNumber(now = Date.now()) {
  const d = new Date(now);
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
}

/** A fixed shuffle of `list` for `key` (the same order every time). */
export function shuffled(list, key) {
  const out = list.slice();
  const rand = seededRandom(key);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Item for `day`: walks a fixed shuffle, one step a day, so nothing repeats until the list is used up. */
export function pickForDay(list, day, key) {
  if (!list?.length) return null;
  const order = shuffled(list, key);
  const n = order.length;
  return order[((day % n) + n) % n];
}

/** Learn cards of a bundled quest that a kid of `grade` can see (main topics → study steps → cards). */
export function learnCardsFor(quest, grade, nodesForGrade) {
  if (!quest?.nodes) return [];
  return nodesForGrade(quest.nodes, grade)
    .filter((n) => n.kind === "main")
    .flatMap((n) => (n.steps || []).filter((s) => s.type === "study").map((s) => ({ s, nodeId: n.id })))
    .flatMap(({ s, nodeId }) => (quest.studyPages?.[s.contentId]?.cards || []).map((c) => ({ ...c, nodeId }))); // nodeId: "Learn more" opens that topic
}

/** Word cards → { word, meaning, emoji } (quick-check cards left out). */
export const toWords = (cards) =>
  cards
    .filter((c) => c.kind === "word" && c.word && c.meaning)
    .map((c) => ({ word: c.word, meaning: c.meaning, emoji: c.emoji || null }));

/** Science Learn cards → { title, text, emoji } (quick-check cards left out). */
export const toScienceFacts = (cards) =>
  cards
    .filter((c) => !c.kind && c.text)
    .map((c) => ({ title: c.title || null, text: c.text, emoji: c.emoji || null, image: null, nodeId: c.nodeId || null }));

const IMAGE_HOST = "https://cdn.jsdelivr.net/gh/mohitcnsia/images@main/"; // project rule 1: our own image repo only

/** Space quest fun facts ("trivia" under each explanation) → { text, image }, duplicates dropped. */
export function toSpaceFacts(spaceData) {
  const seen = new Set();
  const out = [];
  (spaceData?.quizzes || []).forEach((quiz) =>
    (quiz.questions || []).forEach((q) => {
      const ex = q.explanation || {};
      const text = String(ex.trivia || "").trim();
      if (!text || seen.has(text)) return;
      seen.add(text);
      const image = ex.mediaType === "image" && String(ex.mediaUrl || "").startsWith(IMAGE_HOST) ? ex.mediaUrl : null;
      out.push({ title: null, text, emoji: null, image });
    })
  );
  return out;
}

/** Which fact list a class gets. */
export const factSourceFor = (grade) => (!Number.isInteger(grade) || grade < 3 ? null : grade <= 5 ? "science" : "space");

/** Today's card for a kid: { day, word, fact } (word or fact may be null). */
export function dailyCardFor({ grade, now = Date.now(), words = [], scienceFacts = [], spaceFacts = [] }) {
  const day = dayNumber(now);
  const source = factSourceFor(grade);
  const facts = source === "science" ? scienceFacts : source === "space" ? spaceFacts : [];
  return {
    day,
    word: pickForDay(words, day, `word|${grade}`),
    fact: pickForDay(facts, day, `fact|${grade}`),
  };
}

/** Saved state on this phone: drop old days, keep the "new for me" word list short. */
export function pruneSaved(saved, today, { keepDays = 14, maxWords = 200 } = {}) {
  const s = saved && typeof saved === "object" ? saved : {};
  const taps = {};
  Object.entries(s.taps || {}).forEach(([d, v]) => {
    if (today - Number(d) < keepDays) taps[d] = v;
  });
  const newWords = Array.isArray(s.newWords) ? s.newWords.slice(-maxWords) : [];
  return { closedDay: Number.isFinite(s.closedDay) ? s.closedDay : null, closedFactDay: Number.isFinite(s.closedFactDay) ? s.closedFactDay : null, taps, newWords };
}

/** Record a tap ("knew" | "new") on the word or the fact; a "new" word joins the kid's word list once. */
export function recordTap(saved, today, which, answer, word = null) {
  const s = pruneSaved(saved, today);
  s.taps[today] = { ...(s.taps[today] || {}), [which]: answer };
  if (which === "word" && word?.word) {
    s.newWords = s.newWords.filter((w) => w.word !== word.word);
    if (answer === "new") s.newWords.push({ word: word.word, meaning: word.meaning, day: today });
  }
  return s;
}

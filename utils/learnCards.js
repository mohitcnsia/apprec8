// utils/learnCards.js: bite-size Learn cards (spec R, owner OK 2026-11-05). Pure: no React / Firebase.
// A studyContent doc may carry `cards`; pages without cards show the old long page, so pages move over one by one.
//
// Card kinds:
//   idea  { kind: "idea", emoji?, title, text, examples?: ["big = large", ...], image? }
//   check { kind: "check", question, answer, wrong: ["...", ...], explain? }   one tap, answer shown at once, nothing lost
//   word  { kind: "word", emoji?, word, meaning, example?, opposite? }          Treasure Words: tap to flip
// Later (spec R, media plan): `audio` and `video` on idea cards.

import { seededRandom } from "./readingFlow.js";

const str = (x) => (typeof x === "string" ? x.trim() : "");

function cleanCard(c) {
  if (!c || typeof c !== "object") return null;
  const kind = c.kind || (c.word ? "word" : c.question ? "check" : "idea");
  if (kind === "idea" && str(c.title) && str(c.text)) {
    return {
      kind,
      emoji: str(c.emoji) || null,
      title: str(c.title),
      text: str(c.text),
      examples: Array.isArray(c.examples) ? c.examples.map(str).filter(Boolean).slice(0, 4) : [],
      image: str(c.image) || null,
    };
  }
  if (kind === "check" && str(c.question) && str(c.answer) && Array.isArray(c.wrong) && c.wrong.some(str)) {
    return { kind, question: str(c.question), answer: str(c.answer), wrong: c.wrong.map(str).filter(Boolean).slice(0, 3), explain: str(c.explain) || null };
  }
  if (kind === "word" && str(c.word) && str(c.meaning)) {
    return { kind, emoji: str(c.emoji) || null, word: str(c.word), meaning: str(c.meaning), example: str(c.example) || null, opposite: str(c.opposite) || null };
  }
  return null;
}

/** The doc's cards, cleaned; null when the page has none (show the old page). */
export function learnCards(doc) {
  const list = Array.isArray(doc?.cards) ? doc.cards.map(cleanCard).filter(Boolean) : [];
  return list.length ? list : null;
}

/** Options of a check card in a fixed shuffled order (same every time for the same card). */
export function checkOptions(card, key = "") {
  const rng = seededRandom(`${key}:${card.question}`);
  const a = [card.answer, ...card.wrong];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** What 🔊 reads for a card. */
export function cardSpeech(card) {
  if (!card) return "";
  if (card.kind === "word") return [card.word, `It means: ${card.meaning}`, card.example].filter(Boolean).join(". ");
  if (card.kind === "check") return card.question.replace(/_{2,}/g, " blank ");
  const say = (e) => e.replace(/\s*=\s*/g, " means the same as ").replace(/\s*↔\s*/g, " is the opposite of ").replace(/\s*→\s*/g, " becomes ");
  return [card.title, card.text, ...(card.examples || []).map(say)].map((t) => t.replace(/[.!?]+$/, "")).join(". ");
}

/**
 * The Learn step counts as done only when every card has been seen (owner 2026-11-05: a child may skip to the quiz,
 * but the topic still needs both). `seen` = set or array of card indexes.
 */
export function allSeen(seen, total) {
  const s = seen instanceof Set ? seen : new Set(seen || []);
  for (let i = 0; i < total; i++) if (!s.has(i)) return false;
  return total > 0;
}

/** Step id of the step after a study step: "node__0" → "node__1". */
export function nextStepId(stepId) {
  const m = /^(.*)__(\d+)$/.exec(String(stepId || ""));
  return m ? `${m[1]}__${Number(m[2]) + 1}` : null;
}

/** Label of the last card's button: "TRY 8 QUESTIONS ▶" when the quiz size is known. */
export const tryLabel = (count) => (Number.isInteger(count) && count > 0 ? `TRY ${count} QUESTIONS ▶` : "TRY THE QUIZ ▶");

/** Treasure Words: one flip card per word, plus a quick check after every 4 words (wrong options = other words). */
export function wordCards(words = [], { every = 4, key = "" } = {}) {
  const cards = [];
  words.forEach((w, i) => {
    const m = /^(\p{Extended_Pictographic}️?)\s*(.*)$/u.exec(w.meaning || "");
    cards.push({ kind: "word", emoji: m ? m[1] : null, word: w.word, meaning: m ? m[2] : w.meaning });
    const done = i + 1;
    if (done % every === 0 && words.length >= 4) {
      const target = words[i - Math.floor(seededRandom(`${key}:${i}`)() * every)];
      const others = words.filter((x) => x.word !== target.word);
      const rng = seededRandom(`${key}:w${i}`);
      const wrong = [];
      while (wrong.length < 3 && others.length) wrong.push(others.splice(Math.floor(rng() * others.length), 1)[0].word);
      const meaning = (/^(\p{Extended_Pictographic}️?)\s*(.*)$/u.exec(target.meaning || "") || [null, null, target.meaning])[2];
      cards.push({ kind: "check", question: `Which word means: "${meaning}"`, answer: target.word, wrong });
    }
  });
  return cards;
}

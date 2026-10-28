// utils/readingFlow.js
// Pure helpers for the Reading activity (no React / Firebase, testable with Node).
//
// A reading document (stored in studyContent with kind: "reading"):
// {
//   kind: "reading", name, mode: "stepByStep" | "fullPassage",
//   paragraphs: ["...", "..."],
//   glossary: { "word": "meaning" },            // optional, keys in lowercase
//   questions: [{
//     afterParagraph: 0,                         // stepByStep only: shown after this paragraph
//     question: { type: "text", content }, options: [{ content, isCorrect, mistakeTag }],
//     explanation: { text },
//     evidence: { paragraph: 0, text: "exact sentence from the paragraph" }  // for "Show me where"
//   }]
// }

/**
 * Builds the order in which a kid sees things.
 * stepByStep:  p0, (questions after p0), p1, (questions after p1), ...
 * fullPassage: p0, p1, ..., gate ("Start questions"), q0, q1, ...
 * @returns {{ items: Array<{kind: "p"|"q"|"gate", index?: number}>, startCursor: number }}
 */
export function buildReadingFlow(doc) {
  const paragraphs = Array.isArray(doc?.paragraphs) ? doc.paragraphs : [];
  const questions = Array.isArray(doc?.questions) ? doc.questions : [];
  const items = [];

  if (doc?.mode === "stepByStep") {
    paragraphs.forEach((_, p) => {
      items.push({ kind: "p", index: p });
      questions.forEach((q, i) => {
        const after = Number.isInteger(q.afterParagraph) ? q.afterParagraph : paragraphs.length - 1;
        if (after === p) items.push({ kind: "q", index: i });
      });
    });
    // Questions pointing past the last paragraph still get shown at the end.
    questions.forEach((q, i) => {
      if (Number.isInteger(q.afterParagraph) && q.afterParagraph >= paragraphs.length) {
        items.push({ kind: "q", index: i });
      }
    });
    // Show the first paragraph, plus its question if it has one.
    const startCursor = items[1]?.kind === "q" ? 1 : 0;
    return { items, startCursor };
  }

  // fullPassage (default)
  paragraphs.forEach((_, p) => items.push({ kind: "p", index: p }));
  items.push({ kind: "gate" });
  questions.forEach((_, i) => items.push({ kind: "q", index: i }));
  return { items, startCursor: paragraphs.length }; // all paragraphs + the gate
}

/**
 * Next cursor after the kid finishes the current item.
 * Moving onto a paragraph that is directly followed by a question shows both at once.
 */
export function nextCursor(items, cursor) {
  let next = cursor + 1;
  if (items[next]?.kind === "p" && items[next + 1]?.kind === "q") next += 1;
  return Math.min(next, items.length - 1);
}

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Splits a paragraph into segments for rendering.
 * Each segment: { text, highlight: boolean, glossaryWord: string|null }
 * - `highlightText` (exact substring) is marked for "Show me where".
 * - Words found in `glossary` (whole words, any case) become tappable.
 */
export function splitParagraph(text, highlightText, glossary = {}) {
  const parts = [];
  const hlIndex = highlightText ? text.indexOf(highlightText) : -1;
  if (hlIndex >= 0) {
    if (hlIndex > 0) parts.push({ text: text.slice(0, hlIndex), highlight: false });
    parts.push({ text: highlightText, highlight: true });
    const rest = text.slice(hlIndex + highlightText.length);
    if (rest) parts.push({ text: rest, highlight: false });
  } else {
    parts.push({ text, highlight: false });
  }

  const words = Object.keys(glossary || {}).filter(Boolean);
  if (words.length === 0) return parts.map((p) => ({ ...p, glossaryWord: null }));

  // Longest words first so "rain gauge" wins over "rain".
  const pattern = new RegExp(
    `\\b(${words.sort((a, b) => b.length - a.length).map(escapeRegExp).join("|")})\\b`,
    "gi"
  );

  const segments = [];
  parts.forEach((part) => {
    let last = 0;
    part.text.replace(pattern, (match, _g, offset) => {
      if (offset > last) segments.push({ text: part.text.slice(last, offset), highlight: part.highlight, glossaryWord: null });
      segments.push({ text: match, highlight: part.highlight, glossaryWord: match.toLowerCase() });
      last = offset + match.length;
      return match;
    });
    if (last < part.text.length) {
      segments.push({ text: part.text.slice(last), highlight: part.highlight, glossaryWord: null });
    }
  });
  return segments;
}

/** Word count of all paragraphs (shown on the screen, stored with the attempt). */
export function countWords(paragraphs = []) {
  return paragraphs.join(" ").split(/\s+/).filter(Boolean).length;
}

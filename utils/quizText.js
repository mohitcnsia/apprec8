// utils/quizText.js
// Splits a question into a small instruction label and the part kids read (quiz redesign).
// "Fill in the blank: 'There is ___ owl on the tree.'" → { label: "FILL IN THE BLANK", body: "There is ___ owl on the tree." }
// Pure, testable.

const INSTRUCTIONS = [
  [/^fill in the blanks?\b[^:]*:\s*/i, "FILL IN THE BLANK"],
  [/^choose the correct sentence\.?\s*/i, "CHOOSE THE CORRECT SENTENCE"],
  [/^choose the correct one\.?\s*/i, "CHOOSE THE CORRECT ONE"],
  [/^which is correct\?\s*/i, "WHICH IS CORRECT?"],
  [/^find the mistake:\s*/i, "FIND THE MISTAKE"],
  [/^pick the correct sentence\.?\s*/i, "PICK THE CORRECT SENTENCE"],
];

/** Strip one pair of matching outer quotes: 'text' → text. */
const unquote = (s) => {
  const t = String(s).trim();
  const m = t.match(/^['"‘“](.*)['"’”]$/s);
  return m ? m[1] : t;
};

/**
 * @returns {{ label: string|null, body: string }} body is the question when no instruction matches.
 * When the instruction is the whole question (e.g. "Choose the correct sentence."), body is "".
 */
export function splitInstruction(text = "") {
  const s = String(text).trim();
  for (const [re, label] of INSTRUCTIONS) {
    const m = s.match(re);
    if (m) return { label, body: unquote(s.slice(m[0].length)) };
  }
  return { label: null, body: s };
}

/** Short answers fit big 2×2 tiles: 2–4 text options, each at most `max` characters. */
export function fitsTiles(options = [], max = 12) {
  return (
    options.length >= 2 &&
    options.length <= 4 &&
    options.every((o) => (o?.type || "text") === "text" && !o?.mediaUrl && String(o?.content || "").length <= max)
  );
}

/** A plain-text explanation fits the feedback sheet; one with a picture or a fun fact keeps its own screen. */
export function sheetExplanation(explanation) {
  if (!explanation) return { text: "", rich: false };
  if (typeof explanation === "string") return { text: explanation.length <= 320 ? explanation : "", rich: explanation.length > 320 };
  const text = explanation.text || "";
  const rich = !!(explanation.mediaUrl || explanation.trivia || explanation.mediaType === "video" || text.length > 320);
  return { text: rich ? "" : text, rich };
}

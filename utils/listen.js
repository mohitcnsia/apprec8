// utils/listen.js
// RB-5b "Ear training": what to read aloud for a question. Pure, testable.
// Kids often hear that a sentence "sounds right" before they know the rule.
// ONLY for practice (practice leaves in Training, ♾️, My mistakes), never gates/Boss/Exam:
// hearing each option filled in would answer an assessment for the kid.

const BLANK = /_{2,}/;

/** The part of the question that is the sentence: the quoted bit with the blank, else the whole text. */
export function sentenceWithBlank(questionText = "") {
  const text = String(questionText);
  const quoted = text.match(/['"‘“]([^'"’”]*_{2,}[^'"’”]*)['"’”]/);
  if (quoted) return quoted[1].trim();
  return BLANK.test(text) ? text.trim() : null;
}

/** Does this question have a blank we can fill with each option? */
export const canTryAnswers = (questionText) => sentenceWithBlank(questionText) !== null;

/**
 * Fill the blank with an option. With several blanks and an option like "an, a" (one part per
 * blank), each part goes into its own blank; otherwise only the first blank is filled.
 */
export function fillBlank(sentence, option) {
  const text = String(sentence);
  const blanks = text.match(/_{2,}/g) || [];
  const parts = String(option).split(",").map((x) => x.trim());
  if (blanks.length > 1 && parts.length === blanks.length) {
    let i = 0;
    return text.replace(/_{2,}/g, () => parts[i++]);
  }
  return text.replace(BLANK, String(option).trim());
}

/**
 * Lines to speak for "try each answer": the sentence with every option filled in.
 * Returns [] when the question has no blank.
 */
export function tryEachAnswerLines(questionText, options = []) {
  const sentence = sentenceWithBlank(questionText);
  if (!sentence) return [];
  return options.map((o) => fillBlank(sentence, typeof o === "string" ? o : o.content));
}

/** Text to read for the question itself (blanks read as "blank"). */
export const speakableQuestion = (questionText = "") => String(questionText).replace(/_{2,}/g, " blank ");

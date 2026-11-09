// utils/whyNot.js
// "Why not this option?" for wrong options in quiz feedback (G82).
// Pure logic, tested with Node in tests/whyNot.test.mjs.
//
// Training mode (FeedbackSheet):
// - WRONG answer: show "Why not '<chosen>'?" + its why first, then main explanation.
// - RIGHT answer: a folded "Why not the others?" lists each wrong option with its why.
// - Options without why are omitted. If none have why, no why-not UI is shown.
// Exam mode / Review:
// - Same logic for reviewing completed questions.

/**
 * Returns formatted heading for a wrong chosen option.
 * e.g. "Why not 'lives'?"
 */
export function formatWhyNotHeading(chosenText) {
  if (!chosenText) return null;
  return `Why not '${chosenText}'?`;
}

/**
 * Formats a single item for "Why not the others?".
 * e.g. "'lives': Simple present means a regular habit, not continuing since 2019."
 */
export function formatWhyNotOtherLine(optionText, whyText) {
  if (!optionText || !whyText) return null;
  return `'${optionText}': ${whyText}`;
}

/**
 * Checks if a question has any option with a `why` field.
 */
export function hasAnyWhys(question) {
  if (!question || !Array.isArray(question.options)) return false;
  return question.options.some((o) => !o.isCorrect && Boolean(o.why));
}

/**
 * Computes feedback lines and speech text for right/wrong/no-why scenarios.
 *
 * @param {Object} params
 * @param {Object} params.question - { options: [{ content, isCorrect, why }], explanation, answer }
 * @param {string|Object} params.chosen - Selected option text or option object
 * @param {boolean} [params.isCorrect] - Optional override for correctness
 * @param {string} [params.explanationText] - Main explanation text override
 * @returns {Object} {
 *   isCorrect: boolean,
 *   wrongWhy: { heading: string, why: string, option: string } | null,
 *   otherWhys: Array<{ option: string, why: string, line: string }>,
 *   speechText: string
 * }
 */
export function getWhyNotFeedback({
  question,
  chosen,
  isCorrect: explicitIsCorrect,
  explanationText: explicitExplanation,
} = {}) {
  const options = Array.isArray(question?.options) ? question.options : [];
  const chosenText = typeof chosen === "string" ? chosen : chosen?.content ?? null;

  const chosenOption = options.find((o) => o.content === chosenText) || (typeof chosen === "object" ? chosen : null);

  const isCorrect =
    explicitIsCorrect !== undefined
      ? Boolean(explicitIsCorrect)
      : Boolean(chosenOption?.isCorrect || (chosenText && question?.answer && chosenText === question.answer));

  const explanationText =
    explicitExplanation !== undefined
      ? explicitExplanation
      : question?.explanation?.text || (typeof question?.explanation === "string" ? question.explanation : "");

  // Scenario 1: WRONG answer
  if (!isCorrect) {
    const wrongWhy =
      chosenOption && chosenOption.why
        ? {
            heading: formatWhyNotHeading(chosenText),
            why: chosenOption.why,
            option: chosenText,
          }
        : null;

    const parts = [];
    if (wrongWhy) {
      parts.push(`Why not ${chosenText}? ${wrongWhy.why}`);
    }
    if (explanationText) {
      parts.push(explanationText);
    }
    const speechText = parts.join(". ");

    return {
      isCorrect: false,
      wrongWhy,
      otherWhys: [],
      speechText,
    };
  }

  // Scenario 2: RIGHT answer
  const otherWhys = options
    .filter((o) => !o.isCorrect && Boolean(o.why))
    .map((o) => ({
      option: o.content,
      why: o.why,
      line: formatWhyNotOtherLine(o.content, o.why),
    }));

  const speechParts = [];
  if (explanationText) {
    speechParts.push(explanationText);
  }
  const speechText = speechParts.join(". ");

  return {
    isCorrect: true,
    wrongWhy: null,
    otherWhys,
    speechText,
  };
}

/**
 * Builds speech text when user expands "Why not the others?".
 */
export function buildOthersSpeechText(otherWhys = []) {
  if (!Array.isArray(otherWhys) || otherWhys.length === 0) return "";
  return "Why not the others? " + otherWhys.map((w) => `${w.option}: ${w.why}`).join(". ");
}

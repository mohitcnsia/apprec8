// utils/quizLeave.js — ask before a back swipe throws away a quiz in progress (owner, 2026-11-09).
// Pure, so it can be tested with plain Node.

/** Ask only mid-quiz with something to lose: at least one question answered. */
export function shouldConfirmLeave({ status, currentIndex = 0 } = {}) {
  if (status === "reviewing") return true; // just answered a question
  return status === "answering" && currentIndex > 0;
}

/** The popup's words, kid-friendly. */
export function leaveMessage({ currentIndex = 0, total = 0, status } = {}) {
  const done = currentIndex + (status === "reviewing" ? 1 : 0);
  const of = total ? ` of ${total}` : "";
  return `You've answered ${done}${of}. If you leave now, you'll start this quiz again next time.`;
}

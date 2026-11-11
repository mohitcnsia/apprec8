// utils/breakPrompt.js: "Take a breath?" during practice (Calm corner, owner OK 2026-11-12).
// Offered after 3 wrong answers in a row (frustration) or after 20 minutes of practice (a long session), at most once
// every 30 minutes, never in Exam mode. A "session" spans quizzes: a gap of 10+ minutes without answers starts a new
// one. Pure, so it is tested; the quiz keeps the small state object in memory.

export const WRONG_IN_A_ROW = 3;
export const LONG_SESSION_MS = 20 * 60 * 1000;
export const QUIET_MS = 30 * 60 * 1000;
export const NEW_SESSION_GAP_MS = 10 * 60 * 1000;

export const newBreakState = () => ({ sessionStart: null, lastAnswerAt: null, wrongStreak: 0, lastOfferedAt: null });

/** Record one answer; returns the new state. */
export function recordBreakAnswer(state, isCorrect, now = Date.now()) {
  const s = { ...(state || newBreakState()) };
  if (!s.lastAnswerAt || now - s.lastAnswerAt >= NEW_SESSION_GAP_MS) {
    s.sessionStart = now;
    s.wrongStreak = 0;
  }
  s.lastAnswerAt = now;
  s.wrongStreak = isCorrect ? 0 : s.wrongStreak + 1;
  return s;
}

/** "hard" | "long" | null. */
export function breakReason(state, { now = Date.now(), mode = "training" } = {}) {
  if (!state || mode === "exam") return null;
  if (state.lastOfferedAt && now - state.lastOfferedAt < QUIET_MS) return null;
  if (state.wrongStreak >= WRONG_IN_A_ROW) return "hard";
  if (state.sessionStart && now - state.sessionStart >= LONG_SESSION_MS) return "long";
  return null;
}

/** Mark that a break was offered (resets the streak, so the next tricky run counts from zero). */
export const markOffered = (state, now = Date.now()) => ({ ...state, lastOfferedAt: now, wrongStreak: 0 });

export const BREAK_TEXT = {
  hard: { title: "That was a tricky run. Take a breath? 🌿", line: "\"I can handle difficult things.\"" },
  long: { title: "20 minutes of practice. Great effort! Take a short break? 🌿", line: "Have a sip of water or stretch, then come back fresh." },
};

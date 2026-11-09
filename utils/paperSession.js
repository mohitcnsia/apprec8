// utils/paperSession.js: what happens while a child sits a practice paper (mockup Q, owner OK 2026-11-05).
// Pure (no React / Firebase / storage), so tests can drive it. The screen keeps this state with useReducer and saves it
// on the phone after every change, so a closed app resumes where it was. The clock keeps running while away, like a real test.

import { paperQuestions, scorePaper, timeLeftMs } from "./paperScore.js";
import { topicAccuracy } from "./paperTopics.js";
import { seededRandom } from "./readingFlow.js";

/** Options in a fixed shuffled order per question (the data lists the right answer first). Same order on every resume. */
export function optionOrder(questionId, options = []) {
  const rng = seededRandom(questionId);
  const a = [...options];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Short options sit 2 × 2 (owner 2026-11-05); any long one makes them stack. */
export const fitsTwoByTwo = (options = [], maxChars = 14) =>
  options.length === 4 && options.every((o) => String(o?.content ?? o ?? "").length <= maxChars);

export const initialPaperState = (paperId) => ({
  paperId,
  phase: "start", // start → paper ⇄ check → result → answers
  startedAt: null,
  showClock: true,
  index: 0,
  answers: {}, // questionId → chosen text
  marked: {}, // questionId → true
  submittedAt: null,
  timedOut: false,
});

/**
 * @param {object} paper - the paper data (data/papers/*.js)
 * Actions: start {now, showClock} · choose {id, text} · next · back · goto {index} · toggleMark {id} · openCheck ·
 *          submit {now} · tick {now} (submits at 0:00) · showAnswers · restore {state}
 */
export function paperReducer(paper, state, action) {
  const total = paperQuestions(paper).length;
  const submit = (now, timedOut = false) => ({ ...state, phase: "result", submittedAt: now, timedOut });
  const live = state.phase === "paper" || state.phase === "check";
  switch (action.type) {
    case "start":
      if (state.phase !== "start") return state;
      return { ...state, phase: "paper", startedAt: action.now, showClock: action.showClock !== false, index: 0 };
    case "choose":
      if (!live) return state;
      return { ...state, answers: { ...state.answers, [action.id]: action.text } };
    case "toggleMark": {
      if (!live) return state;
      const marked = { ...state.marked };
      if (marked[action.id]) delete marked[action.id];
      else marked[action.id] = true;
      return { ...state, marked };
    }
    case "next":
      if (state.phase !== "paper") return state;
      return state.index >= total - 1 ? { ...state, phase: "check" } : { ...state, index: state.index + 1 };
    case "back":
      if (state.phase === "check") return { ...state, phase: "paper", index: total - 1 };
      if (state.phase !== "paper") return state;
      return { ...state, index: Math.max(0, state.index - 1) };
    case "goto":
      if (!live) return state;
      return { ...state, phase: "paper", index: Math.min(Math.max(0, action.index), total - 1) };
    case "openCheck":
      return state.phase === "paper" ? { ...state, phase: "check" } : state;
    case "submit":
      return live ? submit(action.now) : state;
    case "tick":
      if (!live) return state;
      return timeLeftMs({ startedAt: state.startedAt, minutes: paper.minutes, now: action.now }) <= 0
        ? submit(state.startedAt + paper.minutes * 60 * 1000, true)
        : state;
    case "showAnswers":
      return state.phase === "result" ? { ...state, phase: "answers" } : state;
    case "restore":
      return action.state && action.state.paperId === paper.id ? { ...initialPaperState(paper.id), ...action.state } : state;
    default:
      return state;
  }
}

/** A saved session worth resuming (paper / check), or null. A finished one is not resumed. */
export function resumable(saved, paperId) {
  if (!saved || saved.paperId !== paperId) return null;
  return saved.phase === "paper" || saved.phase === "check" ? saved : null;
}

/** Everything the result screen and the saved attempt need. */
export function paperOutcome(paper, state) {
  const result = scorePaper(paper, state.answers);
  const usedMs = state.startedAt != null && state.submittedAt != null ?Math.max(0, state.submittedAt - state.startedAt) : null;
  const rows = paperQuestions(paper).map(({ id, number, partId, question }) => {
    const chosen = state.answers[id] ?? null;
    const picked = chosen == null ? null : (question.options || []).find((o) => o.content === chosen);
    return {
      questionId: id,
      number,
      partId,
      chosen,
      correct: chosen === question.answer,
      mistakeTag: picked && !picked.isCorrect ? picked.mistakeTag || null : null,
      topicNode: question.topic?.node || null,
    };
  });
  return { ...result, usedMs, rows, timedOut: !!state.timedOut, topics: topicAccuracy(paper, state.answers) };
}

/** Medal for finishing a paper (shown at once, no server needed): 🥇 90%+, 🥈 70%+, 🥉 for finishing. */
export function paperMedal(score, max) {
  const pct = max > 0 ? (score / max) * 100 : 0;
  if (pct >= 90) return { emoji: "🥇", title: "Gold medal!" };
  if (pct >= 70) return { emoji: "🥈", title: "Silver medal!" };
  return { emoji: "🥉", title: "You finished a whole paper!" };
}

/** Wrong and blank answers, grouped by quest, for "My mistakes" (reading questions are skipped later). */
export function paperWrongsByQuest(paper, state) {
  const byQuest = {};
  paperQuestions(paper).forEach(({ id, question }) => {
    if (state.answers[id] === question.answer || !question.topic?.quest) return;
    (byQuest[question.topic.quest] = byQuest[question.topic.quest] || []).push({ questionId: id, question, branchId: question.topic.node || null });
  });
  return byQuest;
}

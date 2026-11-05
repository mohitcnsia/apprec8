// utils/paperScore.js: pure logic for practice papers (mockup Q, draft spec in CODE_REVIEW.md). No React / Firebase.
// A paper: { id, minutes, parts: [{ id, title, marks, questions: [{ answer, topic: { quest, node } , … }] }] }.
// Answers: { [questionId]: chosenText } where questionId = paperQuestionId(paperId, partId, index).

export const paperQuestionId = (paperId, partId, index) => `${paperId}-${partId}-q${index + 1}`;

/** Every question with its id, part and number in the paper (1…50), in paper order. */
export function paperQuestions(paper) {
  let number = 0;
  return paper.parts.flatMap((part) =>
    part.questions.map((question, i) => ({ id: paperQuestionId(paper.id, part.id, i), number: ++number, partId: part.id, question }))
  );
}

/** Milliseconds left; never below 0. */
export function timeLeftMs({ startedAt, minutes, now = Date.now() }) {
  return Math.max(0, startedAt + minutes * 60 * 1000 - now);
}

/** "41:20" for the quiet clock. */
export function clockLabel(ms) {
  const total = Math.ceil(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

/** Numbers for the check screen (Q3): how many answered, blank and marked. */
export function checkSummary(paper, answers = {}, marked = {}) {
  const qs = paperQuestions(paper);
  const blank = qs.filter((x) => answers[x.id] == null).map((x) => x.number);
  return { total: qs.length, answered: qs.length - blank.length, blank, marked: qs.filter((x) => marked[x.id]).map((x) => x.number) };
}

/**
 * Result screen (Q4): marks per part, total, and up to `topN` topics to practise next
 * (most wrong or blank answers first; ties keep paper order).
 */
export function scorePaper(paper, answers = {}, { topN = 3 } = {}) {
  const parts = paper.parts.map((part) => {
    let right = 0, wrong = 0, blank = 0;
    part.questions.forEach((q, i) => {
      const chosen = answers[paperQuestionId(paper.id, part.id, i)];
      if (chosen == null) blank++;
      else if (chosen === q.answer) right++;
      else wrong++;
    });
    return { id: part.id, title: part.title, right, wrong, blank, score: right * part.marks, max: part.questions.length * part.marks };
  });
  const missed = new Map(); // "quest/node" -> { topic, count, firstAt }
  paperQuestions(paper).forEach(({ id, number, question }) => {
    if (answers[id] === question.answer || !question.topic) return;
    const key = `${question.topic.quest}/${question.topic.node}`;
    const m = missed.get(key) || { topic: question.topic, count: 0, firstAt: number };
    m.count++;
    missed.set(key, m);
  });
  const practise = [...missed.values()].sort((a, b) => b.count - a.count || a.firstAt - b.firstAt).slice(0, topN).map(({ topic, count }) => ({ ...topic, wrong: count }));
  return {
    score: parts.reduce((s, p) => s + p.score, 0),
    max: parts.reduce((s, p) => s + p.max, 0),
    parts,
    practise,
  };
}

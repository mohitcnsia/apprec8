// utils/gateRules.js
// Pure rules for English Quest gates (Spec v2, Step 2). No React / Firebase.
//  - drawBalanced: pick N questions from a pool with at least K per sub-topic.
//  - evaluateGate: pass = score >= passPercent AND at least one correct in every sub-topic asked.

/** Fisher–Yates shuffle with an injectable random source (for tests). */
export function shuffle(list, rng = Math.random) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Picks `count` questions so every sub-topic gets at least `minPerGroup` (when the pool allows),
 * then fills the rest at random. The result is shuffled so sub-topics are mixed.
 * Questions without a sub-topic are only used to fill.
 */
export function drawBalanced(questions = [], { count = 10, groupBy = "subtopic", minPerGroup = 2 } = {}, rng = Math.random) {
  if (questions.length <= count) return shuffle(questions, rng);
  const groups = new Map();
  shuffle(questions, rng).forEach((q) => {
    const key = q[groupBy] || null;
    if (!key) return;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(q);
  });

  const picked = [];
  const used = new Set();
  // Round 1: the minimum from each sub-topic (never more than `count` in total).
  for (const [, qs] of groups) {
    for (const q of qs.slice(0, minPerGroup)) {
      if (picked.length >= count) break;
      picked.push(q);
      used.add(q.id);
    }
  }
  // Round 2: fill at random from what's left.
  for (const q of shuffle(questions, rng)) {
    if (picked.length >= count) break;
    if (!used.has(q.id)) {
      picked.push(q);
      used.add(q.id);
    }
  }
  return shuffle(picked, rng);
}

/**
 * @param {Array<{questionId, isCorrect, subtopic}>} answers - one entry per answered question
 * @param {Array<{id, subtopic}>} askedQuestions - every question shown in this attempt
 * @param {{ passPercent?: number, requireEverySubtopic?: boolean }} rules
 * @returns {{ percent, correctCount, total, passed, bySubtopic: Object<string,{correct,total}>, weak: string[] }}
 */
export function evaluateGate(answers = [], askedQuestions = [], { passPercent = 80, requireEverySubtopic = true } = {}) {
  const byId = new Map(answers.map((a) => [a.questionId, a]));
  const bySubtopic = {};
  let correctCount = 0;
  askedQuestions.forEach((q) => {
    const correct = !!byId.get(q.id)?.isCorrect; // unanswered counts as wrong
    if (correct) correctCount += 1;
    if (q.subtopic) {
      bySubtopic[q.subtopic] = bySubtopic[q.subtopic] || { correct: 0, total: 0 };
      bySubtopic[q.subtopic].total += 1;
      if (correct) bySubtopic[q.subtopic].correct += 1;
    }
  });
  const total = askedQuestions.length;
  const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const weak = Object.keys(bySubtopic).filter((k) => bySubtopic[k].correct === 0);
  const passed = percent >= passPercent && (!requireEverySubtopic || weak.length === 0);
  return { percent, correctCount, total, passed, bySubtopic, weak };
}

/** After this attempt, may the kid retry straight away? (Spec: 2 fails → practise first.) */
export const MAX_FAILS_BEFORE_PRACTICE = 2;
export const canRetryAfter = (failsSoFar) => failsSoFar < MAX_FAILS_BEFORE_PRACTICE;

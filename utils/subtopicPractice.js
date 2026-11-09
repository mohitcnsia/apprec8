// utils/subtopicPractice.js — Progress → "Work on these" → Practise opens practice on that one topic (owner, 2026-11-09:
// "I see the quest tree but how and what to practise?"). Pure, so it can be tested with plain Node.
// Uses only topic + practice quizzes: gate/boss questions are tests and never used for practice (same rule as the map).

/** @returns {{ poolQuizIds, poolSubtopics, branchId, nodeId } | null} */
export function subtopicPractice(quest, subtopic) {
  const nodes = quest?.nodes || [];
  const quizzes = quest?.quizzes || {};
  const poolQuizIds = [];
  const poolSubtopics = {};
  let branchId = null;
  for (const n of nodes) {
    if (n.kind !== "main" && n.kind !== "practice") continue;
    for (const s of n.steps || []) {
      if (s.type !== "quiz" || !s.quizId || poolQuizIds.includes(s.quizId)) continue;
      const hit = n.subtopic === subtopic || (quizzes[s.quizId] || []).some((q) => q.subtopic === subtopic);
      if (!hit) continue;
      poolQuizIds.push(s.quizId);
      if (n.subtopic) poolSubtopics[s.quizId] = n.subtopic;
      branchId = branchId || n.branchId || null;
    }
  }
  if (!poolQuizIds.length) return null;
  const endless = nodes.find((n) => n.kind === "endless" && n.branchId === branchId);
  return { poolQuizIds, poolSubtopics, branchId, nodeId: endless?.id || branchId };
}

/** Keep only this topic's questions; if none are tagged, keep them all (never an empty practice). */
export function onlyTopic(pool = [], subtopic = null) {
  if (!subtopic) return pool;
  const some = pool.filter((q) => q.subtopic === subtopic);
  return some.length ? some : pool;
}

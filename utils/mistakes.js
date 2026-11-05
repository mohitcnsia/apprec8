// utils/mistakes.js
// "My mistakes" (owner priority, CODE_REVIEW.md). Pure rules, no React / Firebase.
//
// The kid's mistakes live in users/{uid}/questProgress/{questId}.mistakes as a map key → entry:
//   question entry (practice / warm-up / endless / generated):
//     { kind: "question", questionId, quizId, generator: null | "plural" | "nounGender",
//       subtopic, branchId, lastWrongAt, rightInARow }
//   topic entry (gate / Unit Boss: the exact assessment question is NEVER replayed):
//     { kind: "topic", branchId, unitId, subtopic, lastWrongAt, rightInARow }
// A mistake leaves the list after RIGHT_TO_CLEAR correct answers in a row inside "My mistakes".
// Reading questions are skipped (they need their passage).

export const RIGHT_TO_CLEAR = 2;
export const MAX_MISTAKES = 60; // keep the progress doc small; oldest are dropped first

const ASSESSMENT_MODES = ["gate", "boss"];

export const topicKey = ({ branchId, unitId, subtopic }) =>
  `topic:${branchId || unitId || "unit"}:${subtopic || "all"}`;

/**
 * Turns one attempt's answers into updates for the mistakes map.
 * @param {object} mistakes - current map (from the progress doc)
 * @param {Array} answers - [{ questionId, isCorrect, subtopic, generator?, mistakeKey? }]
 * @param {object} ctx - { mode: "practice"|"gate"|"boss"|"endless"|"mistakes"|"reading",
 *                         quizId, branchId, unitId, now }
 * @returns {object} updates: key → entry (add/update) or null (remove)
 */
export function mistakeUpdates(mistakes = {}, answers = [], ctx = {}) {
  const now = ctx.now ?? Date.now();
  const updates = {};
  if (ctx.mode === "reading") return updates;
  const current = (key) => (key in updates ? updates[key] : mistakes[key]);

  for (const a of answers) {
    if (!a || !a.questionId) continue;

    if (ctx.mode === "mistakes") {
      // Practising mistakes: count right answers in a row for the entry this question stands for.
      const key = a.mistakeKey || a.questionId;
      const entry = current(key);
      if (!entry) continue;
      if (a.isCorrect) {
        const right = (entry.rightInARow || 0) + 1;
        updates[key] = right >= RIGHT_TO_CLEAR ? null : { ...entry, rightInARow: right };
      } else {
        updates[key] = { ...entry, rightInARow: 0, lastWrongAt: now };
      }
      continue;
    }

    if (a.isCorrect) continue; // outside "My mistakes", right answers don't clear anything

    if (ASSESSMENT_MODES.includes(ctx.mode)) {
      const t = { kind: "topic", branchId: ctx.branchId || null, unitId: ctx.unitId || null, subtopic: a.subtopic || null };
      updates[topicKey(t)] = { ...t, lastWrongAt: now, rightInARow: 0 };
    } else {
      updates[a.questionId] = {
        kind: "question",
        questionId: a.questionId,
        quizId: a.quizId || ctx.quizId || null,
        generator: a.generator || null,
        subtopic: a.subtopic || null,
        branchId: ctx.branchId || null,
        lastWrongAt: now,
        rightInARow: 0,
      };
    }
  }

  return capMistakes(mistakes, updates);
}

/** Keep the list small: drop the oldest entries beyond MAX_MISTAKES (adds `null` updates for them). */
function capMistakes(mistakes, updates) {
  const merged = { ...mistakes };
  Object.entries(updates).forEach(([k, v]) => (v === null ? delete merged[k] : (merged[k] = v)));
  const keys = Object.keys(merged);
  if (keys.length > MAX_MISTAKES) {
    keys
      .sort((x, y) => (merged[x].lastWrongAt || 0) - (merged[y].lastWrongAt || 0))
      .slice(0, keys.length - MAX_MISTAKES)
      .forEach((k) => (updates[k] = null));
  }
  return updates;
}

/**
 * Practice paper (owner 2026-11-05: "wrong questions must be added to My mistakes"). Paper questions are not in any quest
 * quiz, so the entry carries the question itself (`inline`). Reading questions are skipped (they need their passage).
 * @param {Array} wrongs - [{ questionId, question (paper question), branchId (the quest topic) }]
 */
export function paperMistakeUpdates(mistakes = {}, wrongs = [], { paperId, now = Date.now() } = {}) {
  const updates = {};
  for (const w of wrongs) {
    const q = w?.question;
    // Reading and picture questions are skipped: "My mistakes" shows text only.
    if (!w?.questionId || !q || q.passage || q.figure || !Array.isArray(q.options) || q.options.some((o) => o.figure)) continue;
    updates[w.questionId] = {
      kind: "question",
      questionId: w.questionId,
      quizId: paperId || null,
      generator: null,
      subtopic: null,
      branchId: w.branchId || null,
      inline: {
        question: q.question,
        options: q.options.map(({ type = "text", content, isCorrect, mistakeTag }) => ({ type, content, isCorrect: !!isCorrect, ...(mistakeTag ? { mistakeTag } : {}) })),
        answer: q.answer,
        explanation: q.explanation || null,
      },
      lastWrongAt: now,
      rightInARow: 0,
    };
  }
  return capMistakes(mistakes, updates);
}

export const countMistakes = (mistakes = {}) => Object.keys(mistakes).length;

/**
 * Builds the questions for a "My mistakes" session.
 * @param {object} mistakes - the map
 * @param {object} available - { byId: Map(questionId → question), similar: (entry) → question[] }
 *   byId: questions we can replay exactly (pool + regenerated); similar: questions for a topic entry
 * @returns {Array<{ question, mistakeKey }>} one item per playable mistake (topic entries pick a similar question)
 */
/**
 * Practice questions for a topic mistake (gate/Boss): same branch(es), same sub-topic when known.
 * If no practice question has that sub-topic, any question from the branch(es) will do, so the
 * mistake can still be fixed (otherwise it stays on the map forever).
 * @param {Array} all - practice questions [{ branchId, subtopic }]
 * @param {object} entry - { branchId, unitId, subtopic }
 * @param {object} unitBranches - { [unitId]: [branchId] }
 */
export function similarQuestions(all = [], entry = {}, unitBranches = {}) {
  const branches = entry.branchId ? [entry.branchId] : unitBranches[entry.unitId] || [];
  const inBranch = all.filter((q) => branches.includes(q.branchId));
  if (!entry.subtopic) return inBranch;
  const same = inBranch.filter((q) => q.subtopic === entry.subtopic);
  return same.length ? same : inBranch;
}

export function buildMistakeItems(mistakes = {}, { byId = new Map(), similar = () => [] } = {}, rng = Math.random) {
  const items = [];
  Object.entries(mistakes)
    .sort(([, a], [, b]) => (b.lastWrongAt || 0) - (a.lastWrongAt || 0)) // newest first
    .forEach(([key, entry]) => {
      if (entry.kind === "topic") {
        const options = similar(entry) || [];
        if (options.length) items.push({ question: options[Math.floor(rng() * options.length)], mistakeKey: key });
      } else {
        const q =
          byId.get(entry.questionId) ||
          (entry.inline ? { ...entry.inline, id: entry.questionId, quizId: entry.quizId, branchId: entry.branchId, subtopic: null } : null);
        if (q) items.push({ question: q, mistakeKey: key });
      }
    });
  return items;
}

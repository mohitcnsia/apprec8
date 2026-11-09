// data/englishQuest/helpers.js
// Builders for English Quest content (questions and map nodes). Shared by data/englishQuestData.js
// and the unit files in data/englishQuest/units/. How to write content: docs/CONTENT_GUIDE.md.

/** Small helper to write questions compactly. */
export const q = (content, correct, wrongs, explanation) => ({
  question: { type: "text", content },
  options: [
    { type: "text", content: correct, isCorrect: true },
    ...wrongs.map(([text, mistakeTag, why]) => ({
      type: "text",
      content: text,
      isCorrect: false,
      mistakeTag,
      ...(why ? { why } : {}),
    })),
  ],
  answer: correct,
  explanation: { text: explanation },
});

// ---------- The quest path (Spec v2, see gemini.md) ----------
// unit     = a group of branches, ends with a Unit Boss
// main     = node on the path (Learn + warm-up). Steps run in order.
// practice = optional side leaf (any order), difficulty easy | medium | hard
// gate     = harder quiz; passing it opens the next branch (pool of questions with sub-topics)
// endless  = "Keep practising"
// boss     = Unit Boss on the path; passing it opens the next unit
export const study = (contentId) => ({ type: "study", contentId });
export const quiz = (quizId) => ({ type: "quiz", quizId });
export const reading = (contentId) => ({ type: "reading", contentId });

export const unit = (id, unitOrder, title, extra = {}) => ({ id, kind: "unit", unitOrder, title, ...extra });
export const main = (id, unitId, branchOrder, title, steps) => ({ id, kind: "main", unitId, branchId: id, branchOrder, title, steps });
export const practice = (id, branch, order, title, difficulty, steps) => ({
  id, kind: "practice", unitId: branch.unitId, branchId: branch.id, order, title, difficulty, steps,
});
export const gate = (id, branch, title, quizId, subtopicTitles, passPercent = 80) => ({
  id, kind: "gate", unitId: branch.unitId, branchId: branch.id, title, quizId, passPercent,
  drawCount: 10, subtopicTitles, // { [subtopicId]: "Title shown on the result screen" }
});
export const withSubtopic = (node, subtopic) => ({ ...node, subtopic });
// generators: [{ type: "plural" | "nounGender", table: <wordTable id> }]; pool = the branch's
// main + practice quizzes (gate/boss questions are never used, they're assessments).
export const endless = (branch, generators = []) => ({
  id: `${branch.id}-endless`, kind: "endless", unitId: branch.unitId, branchId: branch.id, title: `Keep practising`,
  generators,
});
// story (RB-5c "Grammar Gremlin"): a playful mission shown on the Boss start card, to turn test
// nerves into a rescue mission. Keep numbers out of it: the pass rule is added by the app.
export const boss = (id, unitId, title, quizId, story = null, passPercent = 70) => ({
  id, kind: "boss", unitId, title, quizId, passPercent, ...(story ? { story } : {}),
});
// Class tags (Science Quest, 2026-11-04): the classes a unit / topic / practice leaf is for, e.g. [3, 4, 5].
// The app hides nodes that aren't for the kid's class (utils/gradeFilter.js). No tag = for everyone.
export const forGrades = (node, grades) => ({ ...node, grades });

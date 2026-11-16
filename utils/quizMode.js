// utils/quizMode.js: which play modes a quest step offers (owner, 16 Nov 2026 bug: "the nodes unlock even if kids don't
// do exam mode"). Agreed spec (CODE_REVIEW Step 2): the Challenge (gate) and the Unit Boss are exam style, so passing
// them, which opens the next topic or unit, is a real test. Every other step keeps the choice (Training or Exam).
export const EXAM_ONLY = ["gate", "boss"];
export const isExamOnly = (activity) => EXAM_ONLY.includes(activity);
/** The mode a quiz actually runs in. */
export const modeFor = (activity, chosen) => (isExamOnly(activity) ? "exam" : chosen === "exam" ? "exam" : "training");

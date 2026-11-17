// data/scienceQuest/units/c6.js: Science for Class 6 (owner 17 Nov 2026: ISO science exam, Level 1 on 3 Dec). One topic per
// chapter of the Class 6 book (NCERT "Curiosity", 2024), each a Learn page (idea cards + a check) and 8 practice questions.
// Every topic is open from the start (openTopics), so a kid can go straight to the chapter they need. Plan doc:
// https://claude.ai/artifact/5GrheovRHncDQhzQe1bski
// Split (plan doc): Claude writes chapters 1–8 here; Gemini drafts chapters 9–12 in c6b.js (G126), Claude checks them.
// Papers and the SOF books are a guide to coverage and level only: every question is original.
// Quality rules: 4 options, a why-not on every wrong option, at least one near miss, exactly one defensible answer.
import { q, study, quiz, unit, main, forGrades } from "../../englishQuest/helpers.js";

export const C6 = [6];
// Units shared with c6b.js (Gemini's chapters join these units, after Claude's topics).
export const C6_UNITS = {
  living: forGrades(unit("sq6-u1", 7.5, "Living World & Health", { openTopics: true }), C6),
  materials: forGrades(unit("sq6-u2", 7.6, "Materials & Water", { openTopics: true }), C6),
  measure: forGrades(unit("sq6-u3", 7.7, "Magnets, Measuring & Space", { openTopics: true }), C6),
};
/** A Class 6 topic: Learn page `<id>-study` + 8 questions `<id>-quiz`. */
export const topic6 = (id, u, order, title) => forGrades(main(id, u.id, order, title, [study(`${id}-study`), quiz(`${id}-quiz`)]), C6);

/** A Learn page: idea cards [emoji, title, text (≤ 40 words), examples[]] + 1 check card (4 options), and a plain page for old app versions. */
export const page6 = (name, cards, check) => ({
  name,
  author: "Apprec8",
  cards: [...cards.map(([emoji, title, text, examples]) => ({ emoji, title, text, examples })), { kind: "check", ...check }],
  content: cards.map(([emoji, title, text, examples]) => `### ${emoji} ${title}\n\n${text}\n\n${examples.map((e) => `- ${e}`).join("\n")}`).join("\n\n"),
});

const { living, materials, measure } = C6_UNITS;

export default {
  studyPages: {},
  quizzes: {},
  nodes: [living, materials, measure],
};

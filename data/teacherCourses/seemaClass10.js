// data/teacherCourses/seemaClass10.js
// Seema Ma'am · Class 10 English Course (G81).
// Reuses Grammar Pro units b1–b6 questions and study pages from English Quest.
// No duplicated questions or study pages.
// Tile is shown only to students in Seema's class (and teachers / admin) via forClassIds.

import b1 from "../englishQuest/units/b1.js";
import b2 from "../englishQuest/units/b2.js";
import b3 from "../englishQuest/units/b3.js";
import b4 from "../englishQuest/units/b4.js";
import b5 from "../englishQuest/units/b5.js";
import b6 from "../englishQuest/units/b6.js";

export const QUEST_ID = "course-seema-c10-english";

let realClassId = null;
try {
  // eslint-disable-next-line import/no-unresolved
  realClassId = require("../../docs/agents/private/seemaClassId.js")?.SEEMA_REAL_CLASS_ID || null;
} catch {
  // Ignored in repo: falls back to demo class
}

export const FOR_CLASS_IDS = [
  "demo_class_10b",
  ...(realClassId ? [realClassId] : []),
];

export const quest = {
  id: QUEST_ID,
  title: "Seema Ma'am · Class 10 English",
  description: "Class 10 CBSE English grammar with Seema Ma'am.",
  subject: "english",
  forGrades: [10],
  forClassIds: FOR_CLASS_IDS,
  version: 1,
  draft: false,
};

export const tile = {
  id: QUEST_ID,
  questId: QUEST_ID,
  title: "Seema Ma'am · Class 10 English",
  subtitle: "Class 10 CBSE Grammar",
  description: "Class 10 CBSE English grammar with Seema Ma'am.",
  image: "https://cdn.jsdelivr.net/gh/mohitcnsia/images@main/english_quest_tile.png",
  carouselGroup: "quest",
  forClassIds: FOR_CLASS_IDS,
  type: "COURSE",
};

export const studyPages = {};
export const quizzes = {};
export const readings = {};
export const wordTables = {};

const bUnits = [b1, b2, b3, b4, b5, b6];

export const nodes = bUnits.flatMap((u, uIdx) => {
  return u.nodes.map((n) => {
    const copy = { ...n };
    copy.id = n.id.replace(/^eq-/, "sc10-");
    if (n.unitId) copy.unitId = n.unitId.replace(/^eq-/, "sc10-");
    if (n.branchId) copy.branchId = n.branchId.replace(/^eq-/, "sc10-");
    if (n.kind === "unit") {
      copy.unitOrder = uIdx + 1;
      copy.title = n.title.replace(/^Grammar Pro:\s*/, `Unit ${uIdx + 1}: `);
    }
    copy.grades = [10];
    return copy;
  });
});

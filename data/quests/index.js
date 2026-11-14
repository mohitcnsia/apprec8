// data/quests/index.js
// Every tile quest bundled in the app (2026-11-04). Each module exports the same shape:
// QUEST_ID, quest, tile, studyPages, quizzes, readings, wordTables, nodes.
// Used by the seed button (Admin tools), the Progress tab (topic names, counts) and the content tests.

import * as english from "../englishQuestData.js";
import * as wordPower from "../wordPowerQuestData.js";
import * as science from "../scienceQuestData.js";
import * as wordBank from "../wordBankQuestData.js";
import * as academy from "../academyQuestData.js";
import * as seemaClass10 from "../teacherCourses/seemaClass10.js";
import * as bharat from "../bharatQuestData.js";

export const QUESTS = [english, wordPower, science, wordBank, academy, seemaClass10, bharat];

export const bundledQuest = (questId) => QUESTS.find((m) => m.QUEST_ID === questId) || null;

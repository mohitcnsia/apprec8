// data/quests/index.js
// Every tile quest bundled in the app (2026-11-04). Each module exports the same shape:
// QUEST_ID, quest, tile, studyPages, quizzes, readings, wordTables, nodes.
// Used by the seed button (Admin tools), the Progress tab (topic names, counts) and the content tests.

import * as english from "../englishQuestData.js";
import * as science from "../scienceQuestData.js";

export const QUESTS = [english, science];

export const bundledQuest = (questId) => QUESTS.find((m) => m.QUEST_ID === questId) || null;

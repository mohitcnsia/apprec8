// data/papers/index.js: every practice paper bundled in the app (mockup Q, owner OK 2026-11-05).
// Papers live in the app code, not Firestore: no reads, no seeding, no rules change; new papers ship by OTA.
// `draft: true` = testers only (until the owner approves the questions). `grades` = classes that see it.

import englishPaper1 from "./englishPaper1.js";
import sciencePaper1 from "./sciencePaper1.js";
import { bundledQuest } from "../quests/index.js";

export const PAPERS = [englishPaper1, sciencePaper1];

export const SUBJECTS = [
  { id: "english", title: "English" },
  { id: "science", title: "Science" },
];

/** Papers this child may sit: testers see all; others see approved papers for their class. */
export function papersFor({ grade = null, isTester = false } = {}) {
  return PAPERS.filter((p) => isTester || (!p.draft && Array.isArray(p.grades) && p.grades.includes(grade)));
}

export const paperById = (id) => PAPERS.find((p) => p.id === id) || null;

/** Name of the quest topic to practise ("Linking Words"), falling back to the node id. */
export function topicTitle({ quest, node } = {}) {
  const n = bundledQuest(quest)?.nodes?.find((x) => x.id === node);
  return n?.title || node || "";
}

// data/papers/index.js: every practice paper bundled in the app (mockup Q, owner OK 2026-11-05).
// Papers live in the app code, not Firestore: no reads, no seeding, no rules change; new papers ship by OTA.
// `draft: true` = testers only (until the owner approves the questions). `grades` = classes that see it.

import englishPaper1 from "./englishPaper1.js";
import sciencePaper1 from "./sciencePaper1.js";
import englishPaper2 from "./englishPaper2.js";
import englishPaper3 from "./englishPaper3.js";
import englishPaper4 from "./englishPaper4.js";
import sciencePaper2 from "./sciencePaper2.js";
import sciencePaper3 from "./sciencePaper3.js";
import sciencePaper4 from "./sciencePaper4.js";
import sciencePaper5 from "./sciencePaper5.js";
import class7SciencePaper1 from "./class7SciencePaper1.js";
import { bundledQuest } from "../quests/index.js";
import { buildMixPaper, mixPaperId, parseMixId, buildCheckupPaper, checkupPaperId, parseCheckupId, CHECKUP_GRADES } from "./mix.js";
export { CHECKUP_GRADES } from "./mix.js";

export const PAPERS = [englishPaper1, englishPaper2, englishPaper3, englishPaper4, sciencePaper1, sciencePaper2, sciencePaper3, sciencePaper4, sciencePaper5, class7SciencePaper1];

export const SUBJECTS = [
  { id: "english", title: "English" },
  { id: "science", title: "Science" },
];

/** Papers this child may sit: testers see all; others see approved papers for their class. */
export function papersFor({ grade = null, isTester = false } = {}) {
  return PAPERS.filter((p) => isTester || (!p.draft && Array.isArray(p.grades) && p.grades.includes(grade)));
}

const mixCache = new Map();
/** A fixed paper, or a Mix paper built from its id (kept in memory once built). */
export function paperById(id) {
  const fixed = PAPERS.find((p) => p.id === id);
  if (fixed) return fixed;
  const build = parseMixId(id) ? buildMixPaper : parseCheckupId(id) ? buildCheckupPaper : null;
  if (!build) return null;
  if (!mixCache.has(id)) mixCache.set(id, build(id));
  return mixCache.get(id);
}

/** G91: the next Check-up for a Class 9–10 child (one after the highest finished; an unfinished one resumes). */
export function nextCheckupId(grade, history = []) {
  if (!CHECKUP_GRADES.includes(grade)) return null;
  const done = history.map((h) => parseCheckupId(h.paperId)).filter((x) => x && x.grade === grade).map((x) => x.n);
  return checkupPaperId(grade, (done.length ? Math.max(...done) : 0) + 1);
}

/** Classes that get Mix papers (owner 2026-11-05: "no dearth of practice material"). */
export const MIX_GRADES = [3, 4, 5, 6];

/** The next Mix paper for this subject and class: one after the highest finished (an unfinished one resumes). */
export function nextMixId(subject, grade, history = []) {
  const done = history
    .map((h) => parseMixId(h.paperId))
    .filter((x) => x && x.subject === subject && x.grade === grade)
    .map((x) => x.n);
  return mixPaperId(subject, grade, (done.length ? Math.max(...done) : 0) + 1);
}

/** Name of the quest topic to practise ("Linking Words"), falling back to the node id. */
export function topicTitle({ quest, node } = {}) {
  const n = bundledQuest(quest)?.nodes?.find((x) => x.id === node);
  return n?.title || node || "";
}

// tests/studyReport.test.mjs
// Tests for pure study report logic (G65: 🚩 Report a mistake on reading pages).

import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { STUDY_REPORT_REASONS, OPINION_REASONS, studyReportId, buildStudyReportPayload } from "../utils/studyReport.js";

const require = createRequire(import.meta.url);
const R = require("../functions/utils/reportRules.js");

// 1. Target ID generation (studyReportId)
assert.equal(studyReportId(), "", "empty args give empty string");
assert.equal(studyReportId({ contentId: "nouns-study" }), "nouns-study");
assert.equal(studyReportId({ contentId: "science-earth", cardIndex: 0 }), "science-earth#card-0");
assert.equal(studyReportId({ contentId: "science-earth", cardIndex: 3 }), "science-earth#card-3");
assert.equal(studyReportId({ contentId: "science-earth", cardIndex: "summary" }), "science-earth#card-summary");
assert.equal(studyReportId({ contentId: "plants-study", section: "roots" }), "plants-study#section-roots");
// cardIndex takes precedence over section when both present
assert.equal(studyReportId({ contentId: "verbs-study", cardIndex: 2, section: "page" }), "verbs-study#card-2");

// 2. Reason definitions & server compatibility
const expectedIds = ["wrong_fact", "confusing", "messy", "too_long", "too_easy", "too_hard", "spelling", "picture_missing"];
const actualIds = STUDY_REPORT_REASONS.map((r) => r.id);
assert.deepEqual(actualIds, expectedIds, "the child-facing reasons, one tap each");

// Mistake reasons map to a category the server counts; opinions (messy, too easy...) must never count.
for (const r of STUDY_REPORT_REASONS) {
  if (OPINION_REASONS.includes(r.id)) {
    assert.ok(!R.REASONS.includes(r.serverCategory), `Opinion ${r.id} must not count on the server`);
  } else {
    assert.ok(
      R.REASONS.includes(r.serverCategory),
      `Reason ${r.id} maps to '${r.serverCategory}' which must be accepted by onQuestionReported (${R.REASONS.join(", ")})`
    );
  }
}

// 3. Payload builder (buildStudyReportPayload)
assert.throws(() => buildStudyReportPayload({ contentId: "abc" }), /userId is required/);
assert.throws(() => buildStudyReportPayload({ userId: "u1" }), /contentId is required/);

const p1 = buildStudyReportPayload({
  userId: "kid123",
  userName: "Pratha",
  contentId: "science-earth",
  cardIndex: 2,
  title: "Earth's Atmosphere",
  text: "The troposphere is the closest layer.",
  reason: "wrong_fact",
  note: "It says 50 km but text says 12 km",
  questContext: { questId: "science-quest", nodeId: "sq-earth" },
  appVersion: "20.0.30",
  clientTimestamp: "2026-11-07T10:00:00.000Z",
});

assert.equal(p1.userId, "kid123");
assert.equal(p1.userName, "Pratha");
assert.equal(p1.entryPoint, "report_flag");
assert.equal(p1.feedbackType, "issue_report");
assert.equal(p1.issueCategory, "wrong_answer", "wrong_fact maps to wrong_answer on server");
assert.equal(p1.childReason, "wrong_fact");
assert.equal(p1.feedbackText, "It says 50 km but text says 12 km");
assert.equal(p1.questId, "science-quest");
assert.equal(p1.nodeId, "sq-earth");
assert.equal(p1.contentId, "science-earth");
assert.equal(p1.cardIndex, 2);
assert.equal(p1.contentContext.type, "study_content");
assert.equal(p1.contentContext.id, "science-earth#card-2");
assert.equal(p1.contentContext.parentId, "science-earth");
assert.equal(p1.contentContext.titlePreview, "Earth's Atmosphere");
assert.equal(p1.appVersion, "20.0.30");

// 4. Picture missing mapping
const p2 = buildStudyReportPayload({
  userId: "kid456",
  contentId: "plants-study",
  reason: "picture_missing",
});
assert.equal(p2.issueCategory, "media_broken");
assert.equal(p2.childReason, "picture_missing");
assert.equal(p2.contentContext.id, "plants-study");

// 5. Truncation guards
const longText = "a".repeat(500);
const p3 = buildStudyReportPayload({
  userId: "kid789",
  contentId: "c1",
  title: longText,
  note: longText,
  reason: "confusing",
});
assert.equal(p3.contentContext.titlePreview.length, 300);
assert.equal(p3.feedbackText.length, 300);
assert.equal(p3.issueCategory, "confusing");

console.log("studyReport tests passed");


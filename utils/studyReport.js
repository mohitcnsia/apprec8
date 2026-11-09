// utils/studyReport.js
// Pure functions and reason definitions for 🚩 study/reading page issue reporting (G65).
// Compatible with the onQuestionReported trigger and userFeedback collection.

// Kids can't type, so every common problem is one tap (owner, 2026-11-09).
// Reasons whose serverCategory is outside the server's list (messy, too long/easy/hard) are saved for us to read
// but never count towards marking a card as a known problem.
export const STUDY_REPORT_REASONS = [
  { id: "wrong_fact", label: "Wrong fact", serverCategory: "wrong_answer" },
  { id: "confusing", label: "Confusing", serverCategory: "confusing" },
  { id: "messy", label: "Looks messy", serverCategory: "messy" },
  { id: "too_long", label: "Too long", serverCategory: "too_long" },
  { id: "too_easy", label: "Too easy", serverCategory: "too_easy" },
  { id: "too_hard", label: "Too hard", serverCategory: "too_hard" },
  { id: "spelling", label: "Spelling", serverCategory: "spelling" },
  { id: "picture_missing", label: "Picture missing", serverCategory: "media_broken" },
];

/** Reasons that are opinions or layout, not mistakes: the server never counts them. */
export const OPINION_REASONS = ["messy", "too_long", "too_easy", "too_hard"];

/**
 * Creates a stable target id for a card or section within study content.
 * e.g. "science-earth#card-2" or "plants-study#section-roots" or "nouns-study"
 */
export function studyReportId({ contentId, cardIndex = null, section = null } = {}) {
  if (!contentId) return "";
  if (cardIndex !== null && cardIndex !== undefined) return `${contentId}#card-${cardIndex}`;
  if (section !== null && section !== undefined) return `${contentId}#section-${section}`;
  return String(contentId);
}

/**
 * Builds the exact userFeedback payload for a study page or learn card report.
 * Pure function: testable without React or Firebase.
 */
export function buildStudyReportPayload({
  contentId,
  cardIndex = null,
  section = null,
  title = "",
  text = "",
  reason,
  note = "",
  questContext = null,
  userId,
  userName = null,
  appVersion = null,
  clientTimestamp = new Date().toISOString(),
} = {}) {
  if (!userId) throw new Error("userId is required to build a study report");
  if (!contentId) throw new Error("contentId is required to build a study report");

  const reasonObj = STUDY_REPORT_REASONS.find((r) => r.id === reason || r.serverCategory === reason) || {
    id: reason || "other",
    serverCategory: "other",
    label: "Other",
  };

  const targetId = studyReportId({ contentId, cardIndex, section });
  const preview = String(title || text || "").trim().slice(0, 300);

  return {
    userId,
    userName: userName || null,
    contentContext: {
      type: "study_content",
      id: targetId,
      parentId: String(contentId),
      cardIndex: cardIndex ?? null,
      section: section ?? null,
      titlePreview: preview,
    },
    entryPoint: "report_flag",
    reaction: null,
    feedbackType: "issue_report",
    issueCategory: reasonObj.serverCategory,
    childReason: reasonObj.id,
    feedbackText: String(note || "").trim().slice(0, 300),
    clientTimestamp,
    status: "new",
    questId: questContext?.questId || null,
    nodeId: questContext?.nodeId || null,
    contentId: String(contentId),
    cardIndex: cardIndex ?? null,
    section: section ?? null,
    appVersion: appVersion || null,
  };
}


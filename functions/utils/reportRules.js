// functions/utils/reportRules.js
// Pure rules for 🚩 question reports (Spec B, CODE_REVIEW.md). No Firebase here, so they
// can be tested with plain Node (tests/reportRules.test.mjs).
//
// - Count DISTINCT kids, not reports.
// - >= knownAt kids (any reason)                         -> "known"  (kids see 🔧, no more reports)
// - >= hideAt kids with reason "wrong_answer" who answered -> "hidden" (question removed from quizzes)
//   ...unless hiding would starve the pool -> "known" + needsAdmin.

const REASONS = ["wrong_answer", "spelling", "confusing", "media_broken", "other"];
const DEFAULT_SETTINGS = { knownAt: 3, hideAt: 5 };
const NON_GATE_MIN_VISIBLE = 5;

/** Adds/updates one kid's report. Returns a new reporters map (a kid counts once; latest report wins). */
function addReporter(reporters = {}, { uid, reason, answered, at }) {
  return { ...reporters, [uid]: { reason, answered: !!answered, at: at ?? null } };
}

/** Distinct-kid counts from the reporters map. */
function countReporters(reporters = {}) {
  const entries = Object.values(reporters);
  const byReason = {};
  entries.forEach((r) => (byReason[r.reason] = (byReason[r.reason] || 0) + 1));
  return {
    distinct: entries.length,
    byReason,
    wrongAnswerAnswered: entries.filter((r) => r.reason === "wrong_answer" && r.answered).length,
  };
}

/**
 * Would hiding this question leave enough questions to play?
 * @param {object} p
 * @param {boolean} p.isGate
 * @param {number} p.visibleTotal - visible questions in the quiz INCLUDING this one
 * @param {number} p.visibleInSubtopic - visible questions in this question's sub-topic INCLUDING this one
 * @param {number} [p.drawCount=10]
 * @param {number} [p.minPerGroup=2]
 */
function canHide({ isGate, visibleTotal, visibleInSubtopic, drawCount = 10, minPerGroup = 2 }) {
  const remaining = visibleTotal - 1;
  if (isGate) {
    return remaining >= drawCount && visibleInSubtopic - 1 >= minPerGroup;
  }
  return remaining >= NON_GATE_MIN_VISIBLE;
}

/**
 * Decides the issue status after a new report.
 * @returns {{ status: "none"|"known"|"hidden", needsAdmin: boolean }}
 */
function decideStatus(counts, settings = DEFAULT_SETTINGS, hideAllowed = true) {
  const knownAt = settings.knownAt ?? DEFAULT_SETTINGS.knownAt;
  const hideAt = settings.hideAt ?? DEFAULT_SETTINGS.hideAt;
  if (counts.wrongAnswerAnswered >= hideAt) {
    return hideAllowed ? { status: "hidden", needsAdmin: false } : { status: "known", needsAdmin: true };
  }
  if (counts.distinct >= knownAt) return { status: "known", needsAdmin: false };
  return { status: "none", needsAdmin: false };
}

const STATUS_RANK = { none: 0, known: 1, hidden: 2 };
/** Never downgrade automatically (only the admin un-hides). */
function mergeStatus(previous, next) {
  if (!previous) return next;
  if (STATUS_RANK[next.status] > STATUS_RANK[previous.status]) return next;
  return { status: previous.status, needsAdmin: !!(previous.needsAdmin || next.needsAdmin) };
}

module.exports = {
  REASONS,
  DEFAULT_SETTINGS,
  NON_GATE_MIN_VISIBLE,
  addReporter,
  countReporters,
  canHide,
  decideStatus,
  mergeStatus,
};

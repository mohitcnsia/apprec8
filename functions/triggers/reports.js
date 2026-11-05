// functions/triggers/reports.js
// 🚩 Report auto-marking (Spec B, CODE_REVIEW.md).
// Runs on every new userFeedback document sent by the 🚩 button (entryPoint "report_flag").
// Old feedback (FeedbackFAB) is ignored, so the old app is unaffected.
//
// Writes:
//   questionIssues/{questionId}             tally of DISTINCT kids + status (admin-only)
//   quests/{questId}.knownIssues.{questionId} { status: "known"|"hidden", needsAdmin, reasons, since }
//                                            (read by the app with the quest doc; no extra reads)

const functions = require("firebase-functions");
const { db, FieldValue } = require("../common/admin");
const { region, runtimeOptions } = require("../common/config");
const R = require("../utils/reportRules");

exports.onQuestionReported = functions
  .region(region)
  .runWith(runtimeOptions)
  .firestore.document("userFeedback/{feedbackId}")
  .onCreate(async (snap) => {
    const data = snap.data() || {};
    if (data.entryPoint !== "report_flag") return null; // only the 🚩 button

    const questionId = data.contentContext?.id;
    const quizId = data.contentContext?.parentId || null;
    const questId = data.questId || null;
    const uid = data.userId;
    const reason = data.issueCategory;
    // Demo School accounts never count towards hiding a question from real kids (Gemini G38 review).
    if (String(uid || "").startsWith("demo_")) {
      functions.logger.info("onQuestionReported: demo account, not counted", { id: snap.id });
      return null;
    }
    if (!questionId || !uid || !R.REASONS.includes(reason)) {
      functions.logger.warn("onQuestionReported: ignoring incomplete report", { id: snap.id });
      return null;
    }

    const issueRef = db.collection("questionIssues").doc(questionId);
    const questRef = questId ? db.collection("quests").doc(questId) : null;

    await db.runTransaction(async (tx) => {
      // ---- reads (all before writes) ----
      const issueSnap = await tx.get(issueRef);
      const questSnap = questRef ? await tx.get(questRef) : null;
      const quest = questSnap?.exists ? questSnap.data() : {};
      const settings = { ...R.DEFAULT_SETTINGS, ...(quest.reportSettings || {}) };
      const knownIssues = quest.knownIssues || {};
      const issue = issueSnap.exists ? issueSnap.data() : {};

      const reporters = R.addReporter(issue.reporters || {}, {
        uid,
        reason,
        answered: data.chosen !== null && data.chosen !== undefined,
        at: Date.now(),
      });
      const counts = R.countReporters(reporters);

      // Pool-starvation check, only when the question would be hidden.
      let hideAllowed = true;
      if (counts.wrongAnswerAnswered >= settings.hideAt) {
        hideAllowed = await checkCanHide(tx, { questionId, quizId, questRef, knownIssues });
      }

      const previous = knownIssues[questionId] || (issue.status ? { status: issue.status, needsAdmin: !!issue.needsAdmin } : null);
      const decision = R.mergeStatus(previous, R.decideStatus(counts, settings, hideAllowed));

      // ---- writes ----
      tx.set(
        issueRef,
        {
          questionId,
          quizId,
          questId,
          questionText: data.contentContext?.titlePreview || issue.questionText || null,
          reporters,
          counts,
          status: decision.status,
          needsAdmin: decision.needsAdmin,
          lastReportAt: FieldValue.serverTimestamp(),
          ...(issueSnap.exists ? {} : { firstReportAt: FieldValue.serverTimestamp() }),
        },
        { merge: true }
      );

      const changed =
        !previous || previous.status !== decision.status || !!previous.needsAdmin !== decision.needsAdmin;
      if (questRef && questSnap?.exists && decision.status !== "none" && changed) {
        tx.set(
          questRef,
          {
            knownIssues: {
              [questionId]: {
                status: decision.status,
                needsAdmin: decision.needsAdmin,
                reasons: counts.byReason,
                since: FieldValue.serverTimestamp(),
              },
            },
          },
          { merge: true }
        );
      }
    });
    return null;
  });

/** Would hiding this question still leave a playable quiz? (gate: pool >= drawCount, sub-topic >= 2) */
async function checkCanHide(tx, { questionId, quizId, questRef, knownIssues }) {
  if (!questRef) return false;
  const hidden = new Set(Object.keys(knownIssues).filter((id) => knownIssues[id]?.status === "hidden"));

  // V2 question (English Quest content) or V1 (reused old IEO quiz). Reading questions are never auto-hidden.
  const v2 = await tx.get(db.collection("questions").doc(questionId));
  let siblings = [];
  let subtopic = null;
  let poolQuizId = quizId;
  if (v2.exists) {
    poolQuizId = v2.data().quizId || quizId;
    subtopic = v2.data().subtopic || null;
    const q = await tx.get(db.collection("questions").where("quizId", "==", poolQuizId));
    siblings = q.docs.map((d) => ({ id: d.id, subtopic: d.data().subtopic || null }));
  } else {
    const v1 = await tx.get(db.collection("quizQuestions").doc(questionId));
    if (!v1.exists) return false; // e.g. a reading question
    poolQuizId = v1.data().parentId || quizId;
    const q = await tx.get(db.collection("quizQuestions").where("parentId", "==", poolQuizId));
    siblings = q.docs.map((d) => ({ id: d.id, subtopic: null }));
  }
  if (!poolQuizId) return false;

  const gates = await tx.get(questRef.collection("nodes").where("kind", "==", "gate").where("quizId", "==", poolQuizId));
  const gate = gates.empty ? null : gates.docs[0].data();

  const visible = siblings.filter((s) => !hidden.has(s.id));
  return R.canHide({
    isGate: !!gate,
    visibleTotal: visible.length,
    visibleInSubtopic: visible.filter((s) => s.subtopic === subtopic).length,
    drawCount: gate?.drawCount || 10,
    minPerGroup: 2,
  });
}

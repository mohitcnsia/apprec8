// functions/utils/family.js
// Pure helper to identify student accounts, matching utils/family.js (G118).

/**
 * Is this account treated as a student?
 * Grown-up learners (selfLearner: true) have a grade (5/8/10) but are NOT students.
 * Parents and teachers may have picked a grade in past runs but are NOT students.
 */
function isStudentAccount(doc) {
  if (!doc) return false;
  return (
    !!doc.isChild ||
    (Number.isInteger(doc.grade) &&
      !doc.selfLearner &&
      !doc.isParent &&
      !(doc.childUids || []).length &&
      !(doc.teachesClassIds || []).length)
  );
}

module.exports = {
  isStudentAccount,
};


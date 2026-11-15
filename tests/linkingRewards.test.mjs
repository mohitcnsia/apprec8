// tests/linkingRewards.test.mjs
// Unit tests for G113 & G118 linking rewards & safety rules. Run: node tests/linkingRewards.test.mjs
import assert from "node:assert/strict";
import { isStudentAccount } from "../utils/family.js";
import { isStudentAccount as isStudentAccountFn } from "../functions/utils/family.js";

for (const [name, fn] of [["client isStudentAccount", isStudentAccount], ["functions isStudentAccount", isStudentAccountFn]]) {
  // 1. Server safety check: student account detection
  // Grown-up learner (selfLearner: true) with grade -> NOT a student
  assert.equal(fn({ grade: 5, selfLearner: true }), false, `${name}: selfLearner with grade 5 is not student`);
  assert.equal(fn({ grade: 8, selfLearner: true, childUids: [] }), false, `${name}: selfLearner is not student`);

  // Parent with grade + isParent -> NOT a student
  assert.equal(fn({ grade: 6, isParent: true }), false, `${name}: parent with grade is not student`);

  // Teacher with grade -> NOT a student
  assert.equal(fn({ grade: 7, teachesClassIds: ["class123"] }), false, `${name}: teacher with grade is not student`);

  // Parent who picked a class in past runs (has childUids) -> NOT a student
  assert.equal(fn({ grade: 7, childUids: ["kid123"] }), false, `${name}: parent with childUids is not student`);

  // Parent with no grade -> NOT a student
  assert.equal(fn({ firstName: "Sunita", isParent: true }), false, `${name}: parent with no grade is not student`);

  // Regular student with grade and empty childUids -> student
  assert.equal(fn({ grade: 5, childUids: [] }), true, `${name}: kid with grade 5 is student`);
  assert.equal(fn({ grade: 10 }), true, `${name}: kid with grade 10 is student`);

  // Child profile -> student
  assert.equal(fn({ isChild: true }), true, `${name}: isChild is student`);

  // Null / empty
  assert.equal(fn(null), false, `${name}: null is not student`);
  assert.equal(fn({}), false, `${name}: empty is not student`);
}

// 2. Linking bonus grant condition: grant +100 stars ONCE per child
function computeBonusAward(kidDoc) {
  if (kidDoc?.linkBonusAt) {
    return { shouldGrant: false, bonusStars: 0 };
  }
  return { shouldGrant: true, bonusStars: 100 };
}

// First time unlinked kid: gets bonus
assert.deepEqual(computeBonusAward({ stats: { totalStars: 50 } }), { shouldGrant: true, bonusStars: 100 });

// Kid who already received linkBonusAt: skipped
assert.deepEqual(computeBonusAward({ linkBonusAt: 123456789, stats: { totalStars: 150 } }), { shouldGrant: false, bonusStars: 0 });

// 3. Leaderboard lock check: locked only for unlinked students
function needsParentLink(userData) {
  return isStudentAccount(userData) && !(userData?.parentUids || []).length;
}

// Unlinked kid -> locked
assert.equal(needsParentLink({ grade: 5, parentUids: [] }), true);
assert.equal(needsParentLink({ isChild: true, parentUids: [] }), true);

// Linked kid -> unlocked
assert.equal(needsParentLink({ grade: 5, parentUids: ["parent1"] }), false);

// Grown-ups / selfLearners -> NEVER locked
assert.equal(needsParentLink({ grade: 5, selfLearner: true, parentUids: [] }), false);
assert.equal(needsParentLink({ teachesClassIds: ["c1"], parentUids: [] }), false);
assert.equal(needsParentLink({ childUids: ["k1"], parentUids: [] }), false);
assert.equal(needsParentLink({ isParent: true, grade: 6, parentUids: [] }), false);

// 4. Me tab linking card visibility: shown only for unlinked students
function showLinkingCard(userData) {
  return isStudentAccount(userData) && !(userData?.parentUids || []).length;
}

// Unlinked student -> card shown
assert.equal(showLinkingCard({ grade: 5, parentUids: [] }), true);

// Linked student -> card hidden
assert.equal(showLinkingCard({ grade: 5, parentUids: ["parent1"] }), false);

// Grown-up learner / parent / teacher -> card hidden
assert.equal(showLinkingCard({ grade: 5, selfLearner: true, parentUids: [] }), false);
assert.equal(showLinkingCard({ isParent: true, childUids: ["k1"], parentUids: [] }), false);
assert.equal(showLinkingCard({ teachesClassIds: ["c1"], parentUids: [] }), false);

console.log("linkingRewards unit tests passed");

// tests/linkingRewards.test.mjs
// Unit tests for G113 linking rewards & safety rules. Run: node tests/linkingRewards.test.mjs
import assert from "node:assert/strict";

// 1. Server safety check: student account detection
function isStudentAccount(doc) {
  if (!doc) return false;
  return Number.isInteger(doc.grade) && !(doc.childUids || []).length;
}

// Student with grade 5 and empty childUids -> refused
assert.equal(isStudentAccount({ grade: 5, childUids: [] }), true);
assert.equal(isStudentAccount({ grade: 10 }), true);

// Parent with no grade -> allowed
assert.equal(isStudentAccount({ firstName: "Sunita", isParent: true }), false);

// Parent who is also a student somewhere (has grade AND childUids) -> allowed
assert.equal(isStudentAccount({ grade: 7, childUids: ["kid123"] }), false);

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

// 3. Leaderboard lock check: locked until parentUids is set for kids
function needsParentLink(userData) {
  if (userData === null) return false; // loading state
  const isLinked = (userData?.parentUids || []).length > 0;
  const isAdult = !userData?.isChild && ((userData?.childUids || []).length > 0 || (userData?.teachesClassIds || []).length > 0);
  return !isLinked && !isAdult;
}

// Unlinked kid -> locked
assert.equal(needsParentLink({ grade: 5, parentUids: [] }), true);
assert.equal(needsParentLink({ isChild: true, parentUids: [] }), true);
assert.equal(needsParentLink({ firstName: "Rohan", childUids: [], parentUids: [] }), true);

// Linked kid -> unlocked
assert.equal(needsParentLink({ grade: 5, parentUids: ["parent1"] }), false);

// Adults (teachers / parents) -> not locked
assert.equal(needsParentLink({ teachesClassIds: ["c1"], parentUids: [] }), false);
assert.equal(needsParentLink({ childUids: ["k1"], parentUids: [] }), false);

// 4. Me tab linking card visibility: shown until linked
function showLinkingCard(userData) {
  if (!userData) return false;
  const isLinked = (userData?.parentUids || []).length > 0;
  const isParent = !userData?.isChild && (!Number.isInteger(userData?.grade) || (userData?.childUids || []).length > 0);
  const isTeacher = (userData?.teachesClassIds || []).length > 0;
  const isAdmin = false;
  return !isLinked && !isParent && !isTeacher && !isAdmin;
}

// Unlinked student -> card shown
assert.equal(showLinkingCard({ grade: 5, parentUids: [] }), true);

// Linked student -> card hidden
assert.equal(showLinkingCard({ grade: 5, parentUids: ["parent1"] }), false);

// Parent -> card hidden
assert.equal(showLinkingCard({ isParent: true, childUids: ["k1"], parentUids: [] }), false);

// Teacher -> card hidden
assert.equal(showLinkingCard({ teachesClassIds: ["c1"], parentUids: [] }), false);

console.log("linkingRewards unit tests passed");

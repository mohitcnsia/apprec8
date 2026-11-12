// utils/pickClass.js: the in-app class list (owner, 12 Nov: kids pick their class in the app, no link to come back to).
// Pure, tested in tests/pickClass.test.mjs.

/** One school's classes split for this child: their own class first, the rest folded. */
export function classesFor(school, grade) {
  const all = school?.classes || [];
  if (!Number.isInteger(grade)) return { mine: all, others: [] };
  return { mine: all.filter((c) => c.grade === grade), others: all.filter((c) => c.grade !== grade) };
}

/** The school to open first: the only one, or the one with a class for this child's grade (else none). */
export function firstSchool(schools = [], grade = null) {
  if (schools.length === 1) return schools[0].schoolId ?? "none";
  const withMine = schools.filter((s) => (s.classes || []).some((c) => c.grade === grade));
  return withMine.length === 1 ? withMine[0].schoolId ?? "none" : null;
}

/** Home's "Join your class" card: a child (or a parent of a child) who is in no class and waiting for none. */
export function needsClass(userDoc, children = []) {
  if (!userDoc) return null;
  const free = (d) => !(d?.classIds || []).length && !(d?.pendingClassIds || []).length;
  const teaches = (userDoc.teachesClassIds || []).length > 0;
  // A teacher never gets it for themselves, but a teacher who is also a parent does for their children (walk, 12 Nov:
  // the owner and Seema both teach and are parents).
  if (Number.isInteger(userDoc.grade) && !(userDoc.childUids || []).length) return !teaches && free(userDoc) ? { who: "kid" } : null;
  const kid = children.find(free);
  // The child's own class (walk, 12 Nov: a parent's list opened on the parent's class, not the child's).
  return kid ? { who: "parent", name: kid.firstName || "your child", grade: Number.isInteger(kid.grade) ? kid.grade : null } : null;
}

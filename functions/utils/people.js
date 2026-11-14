// functions/utils/people.js: one person's row on the owner's People screen (owner, 12-13 Nov: "show all the user details,
// who joined and when"). Pure, so tests/people.test.mjs checks it. No child data beyond first name, class, counts.

const HOUR = 3600e3;
const ms = (t) => (t == null ? null : typeof t === "number" ? t : t.toMillis ? t.toMillis() : t._seconds ? t._seconds * 1000 : Date.parse(t) || null);

/** What this account is, from what it did. */
function kindOf(d = {}) {
  if ((d.teachesClassIds || []).length) return "teacher";
  if (d.isChild) return "child";
  if ((d.childUids || []).length) return "parent";
  if (Number.isInteger(d.grade)) return "student";
  return "none"; // signed in, picked nothing yet
}

/**
 * doc: users/{uid} data · auth: { email, creationTime, lastRefreshTime, lastSignInTime, providers } or null (child
 * profiles have no sign-in) · className: id → "10-A" · now: ms.
 */
function personRow({ uid, doc = {}, auth = null, className = {}, now = Date.now() }) {
  const kind = kindOf(doc);
  const joinedAt = ms(doc.createdAt) || ms(auth?.creationTime);
  const lastSeenAt = ms(auth?.lastRefreshTime) || ms(auth?.lastSignInTime) || null;
  const names = (ids) => (ids || []).map((id) => className[id] || "a class");
  const row = {
    uid,
    name: String(doc.firstName || doc.displayName || "").trim().split(/\s+/)[0] || null,
    email: auth?.email || doc.email || null,
    kind,
    grade: Number.isInteger(doc.grade) ? doc.grade : null,
    joinedAt,
    lastSeenAt,
    quizzes: doc.stats?.totalQuizzesCompleted || 0,
    stars: doc.stats?.totalStars || 0,
    classes: names(doc.classIds),
    waiting: names(doc.pendingClassIds),
    teaches: names(doc.teachesClassIds),
    children: (doc.childUids || []).length,
    via: (auth?.providers || []).includes("google.com") ? "Google" : (auth?.providers || []).includes("password") ? "email" : kind === "child" ? "added by a parent" : null,
    deletionRequested: !!doc.deletionRequestedAt,
  };
  // Stuck: signed in over an hour ago and still picked nothing (no class number, no child, not a teacher).
  row.stuck = kind === "none" && !!joinedAt && now - joinedAt > HOUR;
  return row;
}

/** India-time day key of a time (for "New today"). */
const istDay = (t) => new Date(t + 5.5 * HOUR).toISOString().slice(0, 10);

function summarize(rows, now = Date.now()) {
  const today = istDay(now);
  return {
    total: rows.length,
    newToday: rows.filter((r) => r.joinedAt && istDay(r.joinedAt) === today).length,
    stuck: rows.filter((r) => r.stuck).length,
  };
}

/**
 * Help buttons on People (owner 13-14 Nov): checks one request before anything is written. Pure (tests/people.test.mjs).
 * action "class": put a learner on a class's waiting list (the teacher still checks every child);
 * "teacher": make this account a teacher of a class; "delete": erase the account, owner only, typed confirmation.
 * Returns { ok: true } or { error: "<code>", message }.
 */
const SUBJECTS = ["english", "science", "maths", "wordpower"];
function helpCheck({ action, target = {}, cls = null, caller = {}, typed = "", subjects = [], firstName = "" } = {}) {
  const fail = (error, message) => ({ error, message });
  if (!target.exists) return fail("not-found", "No such account.");
  if (target.uid === caller.uid) return fail("failed-precondition", "Not on your own account.");
  if (action === "delete") {
    if (!caller.appAdmin) return fail("permission-denied", "Only the owner can delete an account.");
    if (target.isOwner) return fail("failed-precondition", "The owner's account can't be deleted here.");
    if (String(typed).trim() !== "DELETE") return fail("invalid-argument", "Type DELETE to confirm.");
    return { ok: true };
  }
  if (!cls) return fail("not-found", "Class not found.");
  if (!caller.appAdmin && !caller.adminOfSchools?.includes(cls.schoolId)) return fail("permission-denied", "Only the owner and this school's admins can do this.");
  const d = target.data || {};
  if (action === "class") {
    if ((d.childUids || []).length && !d.isChild) return fail("failed-precondition", "This is a parent's account: add the child, then put the child in the class.");
    if ((d.teachesClassIds || []).length) return fail("failed-precondition", "This account is a teacher.");
    if ((d.classIds || []).includes(cls.id)) return fail("already-exists", "Already in this class.");
    if ((d.pendingClassIds || []).includes(cls.id)) return fail("already-exists", "Already waiting for this class.");
    const name = String(d.firstName || firstName || "").trim().split(/\s+/)[0];
    if (name.length < 2) return fail("invalid-argument", "Type their first name, so the teacher knows who it is.");
    return { ok: true, firstName: name, grade: Number.isInteger(d.grade) ? d.grade : Number.isInteger(cls.grade) ? cls.grade : null };
  }
  if (action === "teacher") {
    const subs = (subjects || []).filter((x) => SUBJECTS.includes(x));
    if (!subs.length) return fail("invalid-argument", "Pick at least one subject.");
    if (d.isChild) return fail("failed-precondition", "A child profile can't be a teacher.");
    if ((cls.teacherIds || []).includes(target.uid)) return fail("already-exists", "Already a teacher of this class.");
    return { ok: true, subjects: subs };
  }
  return fail("invalid-argument", "Unknown help.");
}

module.exports = { personRow, kindOf, summarize, istDay, helpCheck };

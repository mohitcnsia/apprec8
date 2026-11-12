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

module.exports = { personRow, kindOf, summarize, istDay };

// utils/firstRun.js: the first-run sheet (mockup T4, owner OK 2026-11-05): first name + class, or "I'm a parent / teacher".
// Pure, so tests can check it. Saves only fields today's rules allow (Finding 22: firstName, lastName, photoURL, grade,
// the two timestamps), so no rules change is needed. "Grown-up" (parent / teacher) is remembered on the phone.

/** True when a signed-in user should see the first-run sheet. */
export function needsFirstRun(doc, { grownUp = false } = {}) {
  if (!doc) return false; // not loaded yet (or not created yet): the caller waits
  if (doc.isChild) return false; // a parent set the child's name and class
  const hasName = typeof doc.firstName === "string" && doc.firstName.trim().length > 0;
  const hasClass = Number.isInteger(doc.grade);
  return !hasName || (!hasClass && !grownUp);
}

export const cleanName = (name = "") =>
  String(name)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 24);

export const canSave = ({ name, grade, role }) => cleanName(name).length >= 1 && (Number.isInteger(grade) || role === "parent" || role === "teacher");

/**
 * Fields for users/{uid}.update(). `stamp` = the server timestamp value. The class is set once (rules), so it's only sent
 * when the doc has none.
 */
export function firstRunUpdate(doc = {}, { name, grade, role }, { stamp, defaultAvatar }) {
  const out = {
    firstName: cleanName(name),
    lastName: typeof doc.lastName === "string" ? doc.lastName : "",
    photoURL: typeof doc.photoURL === "string" && doc.photoURL ? doc.photoURL : defaultAvatar,
    lastUpdatedAt: stamp,
    profileLastSavedAt: stamp,
  };
  if (!role && Number.isInteger(grade) && !Number.isInteger(doc.grade)) out.grade = grade;
  return out;
}

/** What Chamak says in the speech bubble while the child fills it in (mockup T4). */
export function bubbleText({ name, grade, role }) {
  const n = cleanName(name).split(" ")[0];
  if (role === "parent") return n ? `Welcome, ${n}! 👋` : "Welcome! 👋";
  if (role === "teacher") return n ? `Hello, ${n}! 🍎` : "Hello, teacher! 🍎";
  if (n && Number.isInteger(grade)) return `Class ${grade}! Let's go, ${n}! 🚀`;
  if (n) return `Hi ${n}! 👋`;
  return "Hi! What's your name?";
}

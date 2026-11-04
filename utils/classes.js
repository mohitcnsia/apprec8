// utils/classes.js
// RB-2 phase A (owner 2026-11-04): Schools → Classes → Kids. Pure helpers, tested in tests/classes.test.mjs.
// - A class belongs to a school, has a class level (grade) and several teachers, each for some subjects
//   ("5-B": English teacher + Science teacher). A kid is in at most MAX_CLASSES classes (school + tuitions).
// - Kids join with a class code, and only after a parent accepts the consent text (English + Hindi).

export const MAX_CLASSES = 3;
export const SUBJECTS = ["english", "science", "maths", "wordpower"];
export const SUBJECT_NAMES = { english: "English", science: "Science", maths: "Maths", wordpower: "Word Power" };
// Quest → subject, so a teacher sees only their subjects' progress.
export const QUEST_SUBJECT = { "english-quest": "english", "science-quest": "science", "word-power": "wordpower" };

// No look-alike characters (0/O, 1/I/L): kids and parents type these codes.
const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const CODE_LENGTH = 6;

export function makeClassCode(rand = Math.random) {
  let c = "";
  for (let i = 0; i < CODE_LENGTH; i++) c += CODE_CHARS[Math.floor(rand() * CODE_CHARS.length)];
  return c;
}

/** Tidy what a parent typed: "abc 2x9" → "ABC2X9"; null if it can't be a code. */
export function normalizeCode(input) {
  const c = String(input || "").toUpperCase().replace(/[\s-]/g, "");
  if (c.length !== CODE_LENGTH) return null;
  return [...c].every((ch) => CODE_CHARS.includes(ch)) ? c : null;
}

/** Can this kid join that class? → { ok, reason } (reason is kid-friendly). */
export function canJoin(myClassIds = [], classId) {
  if (!classId) return { ok: false, reason: "That code doesn't match a class. Check it with your teacher." };
  if (myClassIds.includes(classId)) return { ok: false, reason: "You're already in this class." };
  if (myClassIds.length >= MAX_CLASSES) {
    return { ok: false, reason: `You can be in ${MAX_CLASSES} classes at most. Leave one first (Me → My classes).` };
  }
  return { ok: true, reason: null };
}

/** What a class learns: its own subjects (set when created), else its teachers' subjects (older classes). */
export function classSubjects(cls) {
  const own = Array.isArray(cls?.subjects) && cls.subjects.length ? cls.subjects : null;
  return own || [...new Set(Object.values(cls?.teacherSubjects || {}).flat())];
}

/** Subjects a teacher has in a class (teacherSubjects: { uid: ["english"] }). */
export const teacherSubjectsIn = (cls, uid) => (cls?.teacherSubjects?.[uid] || []).filter((s) => SUBJECTS.includes(s));

/** Which quests a teacher may see for a class. */
export function questsForTeacher(cls, uid) {
  const subjects = teacherSubjectsIn(cls, uid);
  return Object.entries(QUEST_SUBJECT)
    .filter(([, subject]) => subjects.includes(subject))
    .map(([questId]) => questId);
}

/** "5-B · English, Science" */
export function classLabel(cls) {
  const subjects = [...new Set(Object.values(cls?.teacherSubjects || {}).flat())].map((s) => SUBJECT_NAMES[s] || s);
  return [cls?.name || "Class", subjects.join(", ")].filter(Boolean).join(" · ");
}

// ---- Parent consent (shown before a kid joins a class). Bump CONSENT_VERSION when the text changes. ----
export const CONSENT_VERSION = "2026-11-04";
export const CONSENT_TEXT = {
  en: {
    title: "For the parent or guardian",
    body:
      "Your child is joining a class on Apprec8. Their teacher will see their first name, class, progress, scores and " +
      "mistakes in Apprec8 quests, to help them learn. Other children see only their first name and class on leaderboards. " +
      "We never show your child's email or phone number, and there are no ads. You can remove your child from the class " +
      "or delete their data at any time (Me → My classes, or write to us).",
    confirm: "I am the parent or guardian, and I agree.",
  },
  hi: {
    title: "माता-पिता या अभिभावक के लिए",
    body:
      "आपका बच्चा Apprec8 पर एक कक्षा से जुड़ रहा है। उसकी पढ़ाई में मदद के लिए शिक्षक Apprec8 क्वेस्ट में बच्चे का पहला नाम, " +
      "कक्षा, प्रगति, अंक और गलतियाँ देख सकेंगे। दूसरे बच्चे लीडरबोर्ड पर केवल पहला नाम और कक्षा देखेंगे। हम आपके बच्चे का ईमेल " +
      "या फ़ोन नंबर कभी नहीं दिखाते, और ऐप में कोई विज्ञापन नहीं है। आप कभी भी बच्चे को कक्षा से हटा सकते हैं या उसका डेटा मिटवा " +
      "सकते हैं (Me → My classes, या हमें लिखें)।",
    confirm: "मैं माता-पिता / अभिभावक हूँ, और मैं सहमत हूँ।",
  },
};

/** The consent record we store (who, when, which text). */
export function consentRecord({ kidUid, classId, parentName, relation, language, now = Date.now() }) {
  const name = String(parentName || "").trim();
  if (!kidUid || !classId) throw new Error("kidUid and classId are required");
  if (name.length < 2) throw new Error("Please write the parent's name");
  if (!["mother", "father", "guardian"].includes(relation)) throw new Error("Choose mother, father or guardian");
  if (!CONSENT_TEXT[language]) throw new Error("Unknown language");
  return { kidUid, classId, parentName: name, relation, language, version: CONSENT_VERSION, acceptedAt: now };
}

// ---------- Share messages (owner 2026-11-05: share anywhere, WhatsApp, SMS…; no emails) ----------
const subjectList = (subjects = []) => {
  const names = subjects.map((s) => SUBJECT_NAMES[s] || s);
  return names.length <= 1 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
};

/** The text a teacher or admin shares with parents. */
export function classCodeMessage({ className, schoolName, code }) {
  const where = [className, schoolName].filter(Boolean).join(", ");
  return [
    `Namaste! Join ${where} on Apprec8, the learning app.`,
    "",
    "1. Install Apprec8 from the Play Store",
    "2. Sign in and add your child (Me → Add a child)",
    `3. Play as your child, then Me → Join a class → code ${code}`,
    "",
    "The teacher approves every child, so only our class can join.",
  ].join("\n");
}

/** The text an admin shares with a new teacher (one-time code, 7 days). */
export function teacherInviteMessage({ className, schoolName, subjects, code }) {
  const where = [className, schoolName].filter(Boolean).join(", ");
  const subs = subjectList(subjects);
  return [
    `Namaste! Please join ${where} on Apprec8${subs ? ` as the ${subs} teacher` : " as a teacher"}.`,
    "",
    "1. Install Apprec8 from the Play Store",
    "2. Sign in with Google (the account on your phone)",
    `3. Me → Join as a teacher → code ${code}`,
    "",
    "The code works once, for 7 days.",
  ].join("\n");
}

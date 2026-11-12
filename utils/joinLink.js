// utils/joinLink.js: the class link families tap instead of typing codes (owner + parents + teachers, 2026-11-10/11,
// doc "Simpler sign-up: one WhatsApp link"). Pure, tested in tests/joinLink.test.mjs.
// The server keeps its own copy of normalizeMobile (functions/utils/joinLink.js); the tests check both agree.

// Link tokens: 10 lowercase letters/digits without look-alikes, so a link read out loud still works.
export const TOKEN_CHARS = "abcdefghjkmnpqrstuvwxyz23456789";
export const TOKEN_LENGTH = 10;
const TOKEN_RE = new RegExp(`^[${TOKEN_CHARS}]{${TOKEN_LENGTH}}$`);
export const isJoinToken = (t) => typeof t === "string" && TOKEN_RE.test(t);

/** "https://…/j/<token>" or "apprec8://join/<token>" → the token, or null. */
export function parseJoinLink(url) {
  if (typeof url !== "string") return null;
  const m = url.trim().match(/^(?:https:\/\/[^/\s]+\/j\/|apprec8:\/\/join\/)([a-z0-9]+)\/?(?:[?#].*)?$/i);
  const token = m ? m[1].toLowerCase() : null;
  return isJoinToken(token) ? token : null;
}

/** The address shared on WhatsApp. `base` ends with "/j/" (config/appConfig.js JOIN_LINK_BASE). */
export const joinUrl = (base, token) => `${base}${token}`;

/** The WhatsApp message a teacher shares with the class's parents. */
export function classLinkMessage({ className, schoolName, teacherName, url }) {
  const where = [className, schoolName].filter(Boolean).join(", ");
  return [
    `Namaste! Our class ${where} is on Apprec8, the learning app.`,
    "",
    `Tap to join (students on their own phone, or a parent for their child): ${url}`,
    "",
    teacherName ? `${teacherName} approves every child, so only our class can join.` : "The teacher approves every child, so only our class can join.",
  ].join("\n");
}

// ---------- Mobile numbers (no text messages: the number is how a child finds their parent, and how the teacher calls) ----------
/** What a parent typed → "+919876543210", or null if it can't be a mobile number. Indian numbers without +91 are the
 * usual case; families abroad type "+" and their country code. */
export function normalizeMobile(input) {
  const raw = String(input || "").trim().replace(/[\s\-().]/g, "");
  if (!raw) return null;
  if (raw.startsWith("+")) {
    const d = raw.slice(1);
    if (!/^\d{8,15}$/.test(d)) return null;
    if (d.startsWith("91")) return /^91[6-9]\d{9}$/.test(d) ? `+${d}` : null;
    return `+${d}`;
  }
  if (!/^\d+$/.test(raw)) return null;
  let d = raw;
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  else if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? `+91${d}` : null;
}

/** "+919876543210" → "98765 43210" (other countries keep their + form). */
export function formatMobile(e164) {
  const s = String(e164 || "");
  const m = s.match(/^\+91(\d{5})(\d{5})$/);
  return m ? `${m[1]} ${m[2]}` : s;
}

export const telUrl = (e164) => `tel:${e164}`;
/** WhatsApp chat with this number (no "+", as wa.me wants it). */
export const whatsappUrl = (e164) => `https://wa.me/${String(e164 || "").replace(/^\+/, "")}`;

// ---------- Join form ----------
export const MAX_CHILDREN_FREE = 4; // owner 2026-11-11: up to 4; a 5th = "Need more? Tell us"
const RELATIONS = ["mother", "father", "guardian"];

/** Roll numbers as schools write them ("23", "12B"); optional. → tidy string, "" (none) or null (not valid). */
export function normalizeRoll(input) {
  const r = String(input || "").trim().toUpperCase().replace(/\s+/g, "");
  if (!r) return "";
  return /^[A-Z0-9-]{1,6}$/.test(r) ? r : null;
}

/** Validates the parent's join screen → the payload for joinClassByLink, or throws a parent-friendly error. */
export function joinPayload({ token, classId, kidUid, firstName, rollNo, mobile, relation, agreed, language, version }) {
  // A class picked in the app (classId) or a class link (token), owner 12 Nov.
  if (!classId && !isJoinToken(token)) throw new Error("This class link doesn't work. Ask the teacher to share it again.");
  const name = String(firstName || "").trim().replace(/\s+/g, " ").split(" ")[0];
  if (!kidUid && (name.length < 2 || name.length > 30)) throw new Error("Write your child's first name");
  const roll = normalizeRoll(rollNo);
  if (roll === null) throw new Error("A roll number has up to 6 letters or numbers");
  const m = normalizeMobile(mobile);
  if (!m) throw new Error("Write your 10-digit mobile number");
  if (!RELATIONS.includes(relation)) throw new Error("Choose mother, father or guardian");
  if (!agreed) throw new Error("Please read the form and tick that you agree");
  if (!["en", "hi"].includes(language) || !version) throw new Error("Please read the form again");
  return { ...(classId ? { classId } : { token }), ...(kidUid ? { kidUid } : { firstName: name }), rollNo: roll, mobile: m, relation, language, version };
}

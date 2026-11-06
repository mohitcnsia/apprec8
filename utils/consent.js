// utils/consent.js
// A parent says yes (mockup row X, spec in CODE_REVIEW.md 2026-11-06). India's DPDP Act: a child (under 18) needs a
// parent's consent before their data is processed. Pure, so tests can check it.

/**
 * True when this account is a student with no parent's consent yet: it has a class, and none of the three ways a parent
 * said yes (a profile the parent made, a link to a parent, or a class join with the parent's form).
 */
export function needsParentConsent(doc, { exempt = false } = {}) {
  if (exempt || !doc) return false;
  if (!Number.isInteger(doc.grade)) return false; // grown-ups have no class
  if (doc.isChild) return false; // a profile a parent made (consent recorded then)
  if (doc.isDemo || String(doc.uid || "").startsWith("demo_")) return false;
  const any = (a) => Array.isArray(a) && a.length > 0;
  return !(any(doc.parentUids) || any(doc.classIds) || any(doc.pendingClassIds));
}

/** Neutral age screen (Google Families policy): an adult is 18 or older this year. */
export const isAdultByYear = (year, now = new Date()) => Number.isInteger(year) && now.getFullYear() - year >= 18 && year >= now.getFullYear() - 110;

/** Decades for the year picker, oldest first, none pre-selected (neutral). */
export function birthDecades(now = new Date()) {
  const last = Math.floor(now.getFullYear() / 10) * 10;
  const out = [];
  for (let d = last - 80; d <= last; d += 10) out.push(d);
  return out;
}

export const yearsOf = (decade, now = new Date()) => Array.from({ length: 10 }, (_, i) => decade + i).filter((y) => y <= now.getFullYear());

/** The WhatsApp message a child sends to a parent (mockup X3). */
export function parentAskMessage(name, link = "https://play.google.com/store/apps/details?id=com.mohitchilkoti.apprec8") {
  const n = String(name || "").trim().split(/\s+/)[0] || "Your child";
  return [
    `${n} wants to learn on Apprec8 (English and Science practice; free, no ads).`,
    "",
    "To say yes:",
    `1. Install Apprec8: ${link}`,
    "2. Sign in with your own account → Me → Link my child's own account",
    `3. Send ${n} the 6-number code.`,
    "",
    `You'll see ${n}'s weekly progress, and you can delete ${n}'s data any time.`,
  ].join("\n");
}

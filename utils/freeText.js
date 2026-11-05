// utils/freeText.js: who may type free text to us (owner 2026-11-05). Children only tap choices, so a child can't
// disclose something personal in a box that reaches us (no safeguarding process yet). Adults (no class), testers and
// named exceptions (Pratha, supervised by the owner) may type. Unknown user doc → tap-only (safe default). Pure.

export function canWriteFreeText({ email = null, doc = null, isTester = false, allowEmails = [] } = {}) {
  if (isTester) return true;
  const e = String(email || "").trim().toLowerCase();
  if (e && allowEmails.map((x) => String(x).trim().toLowerCase()).includes(e)) return true;
  if (!doc) return false;
  if (doc.isChild) return false;
  if (Number.isInteger(doc.grade)) return false; // a student
  return true; // parents and teachers have no class
}

export const ASK_A_GROWN_UP = "Something else? Ask a grown-up to tell us.";

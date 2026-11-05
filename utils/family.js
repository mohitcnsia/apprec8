// utils/family.js
// RB-6 parent-first accounts (owner 2026-11-04): a parent signs in, adds their child (first name, class, consent in
// English or Hindi) and gets a one-time code to sign the child in on any phone. Pure helpers (tests/family.test.mjs).
// The server (functions/callable/familyActions.js) creates the child's account and checks the codes.

import { makeClassCode, normalizeCode } from "./classes.js";

export const CHILD_CODE_HOURS = 48; // a login code works once, within 48 hours
export const MAX_CHILDREN = 6;
export const makeChildCode = makeClassCode; // 6 characters, no look-alikes
export const normalizeChildCode = normalizeCode;

export const CHILD_CONSENT_VERSION = "2026-11-04";
export const CHILD_CONSENT_TEXT = {
  en: {
    title: "Creating your child's account",
    body:
      "You are creating an Apprec8 account for your child. We store their first name, class, and what they learn " +
      "(answers, scores, mistakes) so the app can help them. There are no ads. Other children see only their first name " +
      "and class. If your child joins a class, their teacher sees their progress. You can see their progress, and you can " +
      "delete the account and all its data at any time (Me → My children, or write to us).",
    confirm: "I am this child's parent or guardian, and I agree.",
  },
  hi: {
    title: "अपने बच्चे का खाता बनाना",
    body:
      "आप अपने बच्चे के लिए Apprec8 खाता बना रहे हैं। ऐप बच्चे की मदद कर सके, इसलिए हम उसका पहला नाम, कक्षा और वह क्या सीखता है " +
      "(जवाब, अंक, गलतियाँ) सहेजते हैं। ऐप में कोई विज्ञापन नहीं है। दूसरे बच्चे केवल उसका पहला नाम और कक्षा देखते हैं। अगर " +
      "बच्चा किसी कक्षा से जुड़ता है, तो उसके शिक्षक उसकी प्रगति देखते हैं। आप उसकी प्रगति देख सकते हैं, और कभी भी खाता व उसका " +
      "सारा डेटा मिटा सकते हैं (Me → My children, या हमें लिखें)।",
    confirm: "मैं इस बच्चे का माता-पिता / अभिभावक हूँ, और मैं सहमत हूँ।",
  },
};

// Linking a child's EXISTING account (decision 9). The owner checks the Hindi.
export const LINK_CONSENT_VERSION = "2026-11-06";
export const LINK_CONSENT_TEXT = {
  en: {
    title: "Link your child's own account",
    body:
      "Your child already uses Apprec8 with their own login. Linking lets you see their progress: what they practised, " +
      "how they did and what to practise next. Your child keeps their own login and everything they have done. " +
      "We store what they learn (answers, scores, mistakes) so the app can help them. There are no ads.",
    confirm: "I am this child's parent or guardian, and I agree.",
  },
  hi: {
    title: "अपने बच्चे का अपना खाता जोड़ें",
    body:
      "आपका बच्चा पहले से अपने लॉगिन से Apprec8 इस्तेमाल करता है। जोड़ने से आप उसकी प्रगति देख पाएँगे: उसने क्या अभ्यास किया, " +
      "कैसा किया और आगे क्या अभ्यास करना है। बच्चे का लॉगिन और उसका सारा काम वैसा ही रहेगा। " +
      "ऐप बच्चे की मदद कर सके, इसलिए हम उसके जवाब, अंक और गलतियाँ सहेजते हैं। ऐप में कोई विज्ञापन नहीं है।",
    confirm: "मैं इस बच्चे का माता-पिता / अभिभावक हूँ, और मैं सहमत हूँ।",
  },
};

/** Validates the "add a child" form → the payload for the server, or throws a parent-friendly error. */
export function childPayload({ firstName, grade, parentName, relation, language }) {
  const name = String(firstName || "").trim().replace(/\s+/g, " ");
  if (name.length < 2 || name.length > 30) throw new Error("Write your child's first name (2–30 letters)");
  if (!Number.isInteger(grade) || grade < 1 || grade > 12) throw new Error("Choose your child's class (1–12)");
  const p = String(parentName || "").trim();
  if (p.length < 2) throw new Error("Write your own name (parent or guardian)");
  if (!["mother", "father", "guardian"].includes(relation)) throw new Error("Choose mother, father or guardian");
  if (!CHILD_CONSENT_TEXT[language]) throw new Error("Unknown language");
  return { firstName: name.split(" ")[0], grade, consent: { parentName: p, relation, language, version: CHILD_CONSENT_VERSION } };
}

/** Is a stored code still usable? */
export const codeUsable = (code, now = Date.now()) => !!code && !code.used && typeof code.expiresAt === "number" && code.expiresAt > now;

// src/config/appConfig.js
import Constants from "expo-constants";
import { APPREC8_TEAM_REVIEWER_UID as UID_FROM_ENV } from "@env";

export const APP_VARIANT = Constants?.expoConfig?.extra?.appVariant || "real";
export const IS_TEST_VARIANT = APP_VARIANT === "test";

// Class links shared on WhatsApp (sign-up without codes, 2026-11-11). The page at this address opens the app on the
// class (web/public/j.html, Firebase Hosting). The test app has its own project and page.
export const JOIN_LINK_BASE = IS_TEST_VARIANT ? "https://apprec8-test.web.app/j/" : "https://apprec8-ca229.web.app/j/";

/**
 * The owner's (admin) user ID. Shows the Dashboard, seed buttons and team-review features.
 * Not a secret: Firestore rules decide what the admin can read or write.
 * Kept in code because release builds leave out the gitignored .env (20.0.23 shipped without it).
 */
export const ADMIN_UID = "ThOziLzf1INR9K9hxZQxOMgjcJD3";

/** The "Apprec8 Team" reviewer (the admin). .env can override it for local testing. */
export const APPREC8_TEAM_REVIEWER_UID = UID_FROM_ENV || ADMIN_UID;

/**
 * Tester accounts for English Quest "Tester mode" (Spec A, CODE_REVIEW.md).
 * Compared case-insensitively. The admin (APPREC8_TEAM_REVIEWER_UID) is always a tester.
 */
export const TESTER_EMAILS = ["mohitchilkoti@gmail.com"];
// While the app is in Play closed testing, families first join the tester group and become testers (owner, 12 Nov).
// Set IN_CLOSED_TESTING to false once the app is public: the two steps drop out of every invite.
export const IN_CLOSED_TESTING = true;
export const TESTER_GROUP_URL = "https://groups.google.com/g/apprec8-testers";
export const TESTER_OPTIN_URL = "https://play.google.com/apps/testing/com.mohitchilkoti.apprec8";
export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.mohitchilkoti.apprec8";
// Children who may type free text (owner 2026-11-05: Pratha, supervised by the owner). Never list a child's email in
// code (it would be published with the repo): the list lives in Remote Config, key "free_text_emails" (JSON array or
// comma-separated). This constant stays empty.
export const FREE_TEXT_EMAILS = [];

export const isTesterUser = (user) => {
  if (!user) return false;
  if (APPREC8_TEAM_REVIEWER_UID && user.uid === APPREC8_TEAM_REVIEWER_UID) return true;
  const email = (user.email || "").trim().toLowerCase();
  return !!email && TESTER_EMAILS.map((e) => e.trim().toLowerCase()).includes(email);
};

// src/config/appConfig.js
import { APPREC8_TEAM_REVIEWER_UID as UID_FROM_ENV } from "@env";

/**
 * The User ID of the designated "Apprec8 Team" reviewer.
 * 🚨 This UID is loaded from environment variables at build time.
 */
export const APPREC8_TEAM_REVIEWER_UID = UID_FROM_ENV; //|| "fallback_uid_if_any_or_error"; // Handle if UID_FROM_ENV is undefined

// It's good practice to ensure critical env vars are present.
if (!UID_FROM_ENV) {
  console.error(
    "FATAL ERROR: APPREC8_TEAM_REVIEWER_UID is not defined in .env file."
  );
  // You might throw an error or have a default behavior,
  // but for a UID, not having it is usually a critical issue.
}

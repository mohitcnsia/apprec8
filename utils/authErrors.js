// utils/authErrors.js: sign-in / registration helpers (owner 2026-11-05: "email password flow seems broken").
// Pure, so tests can check them. Messages are for parents and kids: short, no error codes.

/** Keyboards often add a space after an email suggestion; Firebase then says "badly formatted". */
export const cleanEmail = (email = "") => String(email).trim();

export const looksLikeEmail = (email = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail(email));

export const MIN_PASSWORD = 6;

/**
 * @param {{ code?: string, message?: string }} error - from @react-native-firebase/auth
 * @param {"signIn"|"signUp"|"reset"} action
 */
export function authMessage(error, action = "signIn") {
  const code = String(error?.code || "").replace(/^auth\//, "");
  switch (code) {
    case "invalid-email":
      return "That email address doesn't look right. Check for typos or spaces.";
    case "invalid-credential":
    case "invalid-login-credentials":
    case "wrong-password":
    case "user-not-found":
      return action === "reset"
        ? "If an account exists for this email, we've sent a reset link."
        : "Email or password is wrong. Try again, or tap \"Forgot password?\".";
    case "email-already-in-use":
      return "This email already has an account. Switch to Login (or tap \"Forgot password?\").";
    case "weak-password":
      return `Choose a longer password: at least ${MIN_PASSWORD} characters.`;
    case "user-disabled":
      return "This account is switched off. Please contact us.";
    case "too-many-requests":
      return "Too many tries. Wait a few minutes, then try again.";
    case "network-request-failed":
      return "No internet connection. Check Wi-Fi or mobile data and try again.";
    case "operation-not-allowed":
      return "Email sign-in is switched off right now. Please use Google or contact us.";
    default:
      return action === "signUp" ? "Could not create the account. Please try again." : "Could not sign in. Please try again.";
  }
}

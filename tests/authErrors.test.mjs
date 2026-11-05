// tests/authErrors.test.mjs — sign-in helpers (utils/authErrors.js)
import assert from "node:assert/strict";
import { cleanEmail, looksLikeEmail, authMessage } from "../utils/authErrors.js";

assert.equal(cleanEmail("  pratha@gmail.com "), "pratha@gmail.com", "keyboard spaces removed");
assert.equal(looksLikeEmail("pratha@gmail.com "), true);
assert.equal(looksLikeEmail("pratha@gmail"), false);
assert.equal(looksLikeEmail("pratha gmail.com"), false);

assert.match(authMessage({ code: "auth/invalid-credential" }), /wrong/);
assert.match(authMessage({ code: "auth/invalid-login-credentials" }), /wrong/);
assert.match(authMessage({ code: "auth/user-not-found" }, "reset"), /If an account exists/);
assert.match(authMessage({ code: "auth/email-already-in-use" }, "signUp"), /already has an account/);
assert.match(authMessage({ code: "auth/network-request-failed" }), /internet/);
assert.match(authMessage({}, "signUp"), /Could not create/);
assert.ok(!/auth\//.test(authMessage({ code: "auth/weird-new-code", message: "[auth/x] boom" })), "no raw codes for kids");
console.log("authErrors tests passed");

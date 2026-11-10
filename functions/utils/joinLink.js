// functions/utils/joinLink.js: server copy of the pure helpers in utils/joinLink.js (the app's copy is ESM).
// tests/joinLink.test.mjs checks that both copies agree.
const crypto = require("crypto");

const TOKEN_CHARS = "abcdefghjkmnpqrstuvwxyz23456789";
const TOKEN_LENGTH = 10;
const TOKEN_RE = new RegExp(`^[${TOKEN_CHARS}]{${TOKEN_LENGTH}}$`);
const isJoinToken = (t) => typeof t === "string" && TOKEN_RE.test(t);

/** A fresh, hard-to-guess link token (31^10 ≈ 8e14 possibilities). */
function makeToken() {
  const bytes = crypto.randomBytes(TOKEN_LENGTH);
  return [...bytes].map((b) => TOKEN_CHARS[b % TOKEN_CHARS.length]).join("");
}

function normalizeMobile(input) {
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

function normalizeRoll(input) {
  const r = String(input || "").trim().toUpperCase().replace(/\s+/g, "");
  if (!r) return "";
  return /^[A-Z0-9-]{1,6}$/.test(r) ? r : null;
}

module.exports = { TOKEN_CHARS, TOKEN_LENGTH, isJoinToken, makeToken, normalizeMobile, normalizeRoll };

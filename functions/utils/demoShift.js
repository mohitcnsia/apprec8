// functions/utils/demoShift.js
// Demo School (CODE_REVIEW.md, owner 2026-11-05). Pure helpers, tested in tests/demoShift.test.mjs:
// - checkDemoOps: the server writes only demo documents (ids start with "demo_", isDemo: true, known collections);
// - shift*: move every demo date forward so the class always looks current (weekly job), keeping the same patterns.

const DAY = 24 * 60 * 60 * 1000;
const MAX_OPS = 3000;
// path pattern → allowed. Odd segments are collections, even segments are ids.
const ALLOWED = [
  /^schools\/demo_[\w-]+$/,
  /^users\/demo_[\w-]+$/,
  /^users\/demo_[\w-]+\/questProgress\/[\w-]+$/,
  /^classes\/demo_[\w-]+$/,
  /^classes\/demo_[\w-]+\/members\/demo_[\w-]+$/,
  /^classes\/demo_[\w-]+\/assignments\/demo_[\w-]+$/,
  /^classes\/demo_[\w-]+\/teacherRequests\/demo_[\w-]+$/,
  /^questAttempts\/demo_[\w-]+$/,
  /^demo\/meta$/,
];

/** Throws a plain Error (message for the admin) if any op isn't a demo document. */
function checkDemoOps(ops) {
  if (!Array.isArray(ops) || !ops.length) throw new Error("No demo data sent.");
  if (ops.length > MAX_OPS) throw new Error(`Too many documents (${ops.length} > ${MAX_OPS}).`);
  ops.forEach((op, i) => {
    if (!op || typeof op.path !== "string" || !ALLOWED.some((re) => re.test(op.path))) throw new Error(`Not a demo path at ${i}: ${op && op.path}`);
    if (!op.data || op.data.isDemo !== true) throw new Error(`Missing isDemo at ${op.path}`);
    if (op.ts && !Array.isArray(op.ts)) throw new Error(`Bad ts at ${op.path}`);
  });
  return true;
}

/** Calls fn(container, key) for a ts spec like "createdAt", "a.b" or "nodes.*.lastPlayedAt". */
function eachTsField(data, spec, fn) {
  const parts = spec.split(".");
  const walk = (obj, i) => {
    if (!obj || typeof obj !== "object") return;
    const k = parts[i];
    if (i === parts.length - 1) {
      if (typeof obj[k] === "number") fn(obj, k);
      return;
    }
    if (k === "*") Object.keys(obj).forEach((key) => walk(obj[key], i + 1));
    else walk(obj[k], i + 1);
  };
  walk(data, 0);
}

/** ms fields named in op.ts → toTimestamp(ms). Returns a new data object. */
function withTimestamps(op, toTimestamp) {
  const data = JSON.parse(JSON.stringify(op.data));
  (op.ts || []).forEach((spec) => eachTsField(data, spec, (obj, k) => (obj[k] = toTimestamp(obj[k]))));
  return data;
}

const pad = (n) => String(n).padStart(2, "0");
/** "2026-11-28" + 7 → "2026-12-05" (calendar days, timezone-safe). */
function shiftDayKey(key, n) {
  const [y, m, d] = String(key).split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}

/** Whole days to move forward since the data was last placed (anchor). */
function shiftDays(anchorMs, now) {
  return Math.max(0, Math.floor((now - anchorMs) / DAY));
}

/** Shifted stats (questProgress.stats): lastActiveAt + daily keys. */
function shiftStats(stats, days) {
  if (!stats) return stats;
  const out = { ...stats };
  if (typeof out.lastActiveAt === "number") out.lastActiveAt += days * DAY;
  if (out.daily) out.daily = Object.fromEntries(Object.entries(out.daily).map(([k, v]) => [shiftDayKey(k, days), v]));
  return out;
}

module.exports = { checkDemoOps, withTimestamps, eachTsField, shiftDayKey, shiftDays, shiftStats, DAY, MAX_OPS };

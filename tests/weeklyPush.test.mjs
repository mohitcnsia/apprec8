// tests/weeklyPush.test.mjs — weekly summary notification text + counting (functions/utils/weeklyPush.js)
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { weekFromStats, parentMessage, teacherMessage, mergeTokens, istKey } = require("../functions/utils/weeklyPush.js");

// Sunday 8 Nov 2026, 18:30 IST = 13:00 UTC
const now = Date.UTC(2026, 10, 8, 13, 0);
assert.equal(istKey(now), "2026-11-08");
assert.equal(istKey(Date.UTC(2026, 10, 8, 19, 0)), "2026-11-09", "after IST midnight it's the next day");
const stats = [
  { daily: { "2026-11-08": { answered: 10, timeMs: 20 * 60000 }, "2026-11-05": { answered: 5, timeMs: 10 * 60000 }, "2026-10-30": { answered: 9, timeMs: 1 } } },
  { daily: { "2026-11-08": { answered: 3, timeMs: 5 * 60000 }, "2026-11-03": { answered: 2, timeMs: 60 * 60000 } } },
];
assert.deepEqual(weekFromStats(stats, now), { days: 3, minutes: 95, answered: 20 }, "3 days (8th counted once), old days ignored");

const en = parentMessage({ name: "Pratha", days: 5, minutes: 100, lang: "en" });
assert.equal(en.title, "Pratha's weekly report is ready 🌟");
assert.equal(en.body, "Practised 5 of 7 days · 1 h 40 min. One idea for home inside.");
const hi = parentMessage({ name: "Pratha", days: 5, minutes: 100, lang: "hi" });
assert.equal(hi.title, "Pratha की साप्ताहिक रिपोर्ट तैयार है 🌟");
assert.match(hi.body, /^7 में से 5 दिन अभ्यास · 1 घंटा 40 मिनट।/);
assert.match(parentMessage({ name: "Om", days: 0, minutes: 0 }).body, /No practice/, "gentle when nothing happened");
assert.equal(teacherMessage({ className: "10-B", active: 24, total: 32 }).body, "24 of 32 students practised. 3 things to look at inside.");
assert.deepEqual(mergeTokens(["a", "b", "c", "d", "e"], "f"), ["b", "c", "d", "e", "f"]);
assert.deepEqual(mergeTokens(["a", "b"], "a"), ["b", "a"]);
console.log("weeklyPush tests passed");

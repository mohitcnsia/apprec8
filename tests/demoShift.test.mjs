// tests/demoShift.test.mjs — server-side Demo School guards + weekly date shift (functions/utils/demoShift.js)
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { QUESTS } from "../data/quests/index.js";
import { buildDemoSchool } from "../utils/demoSchool.js";
const require = createRequire(import.meta.url);
const { checkDemoOps, withTimestamps, shiftDayKey, shiftDays, shiftStats, DAY } = require("../functions/utils/demoShift.js");

const now = new Date(2026, 10, 9, 19, 0).getTime();
const { ops } = buildDemoSchool({ quests: QUESTS, now });
assert.equal(checkDemoOps(ops), true, "everything the app builds passes the server check");

const bad = (op, why) => assert.throws(() => checkDemoOps([op]), undefined, why);
bad({ path: "users/realKid123", data: { isDemo: true } }, "a real user id");
bad({ path: "users/demo_x", data: {} }, "no isDemo");
bad({ path: "quests/english-quest", data: { isDemo: true } }, "content collection");
bad({ path: "classCodes/demo_ABC", data: { isDemo: true } }, "no join codes");
bad({ path: "users/demo_x/questProgress/english-quest/extra/doc", data: { isDemo: true } }, "deep path");
assert.throws(() => checkDemoOps([]), undefined, "empty");

// ts conversion incl. nested nodes.*
const progress = ops.find((o) => o.path === "users/demo_kid_login/questProgress/english-quest");
const conv = withTimestamps(progress, (ms) => ({ ts: ms }));
const someNode = Object.values(conv.nodes).find((n) => n.lastPlayedAt);
assert.equal(typeof someNode.lastPlayedAt.ts, "number", "nested Timestamp fields converted");
assert.equal(typeof conv.stats.lastActiveAt, "number", "stats stay ms (the app reads ms there)");
const attempt = ops.find((o) => o.path.startsWith("questAttempts/"));
assert.equal(typeof withTimestamps(attempt, (ms) => ({ ts: ms })).createdAt.ts, "number");

// shift
assert.equal(shiftDayKey("2026-12-29", 7), "2027-01-05");
assert.equal(shiftDays(now, now + 6 * DAY), 6);
assert.equal(shiftDays(now, now - DAY), 0, "never backwards");
const st = shiftStats({ lastActiveAt: now, daily: { "2026-11-09": { answered: 3 } } }, 7);
assert.equal(st.lastActiveAt, now + 7 * DAY);
assert.deepEqual(Object.keys(st.daily), ["2026-11-16"]);

// Only the login kid has global stars (others never rank above real children)
const users = ops.filter((o) => /^users\/demo_[^/]+$/.test(o.path) && o.data.grade);
assert.ok(users.every((u) => u.path === "users/demo_kid_login" || u.data.stats.totalStars === 0));
const size = JSON.stringify(ops).length;
assert.ok(size < 9_000_000, `payload fits a callable (${Math.round(size / 1e6 * 10) / 10} MB)`);
console.log(`demoShift tests passed (payload ${Math.round(size / 1e5) / 10} MB)`);

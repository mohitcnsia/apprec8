// tests/demoSchool.test.mjs — Demo School generator (utils/demoSchool.js)
import assert from "node:assert/strict";
import { QUESTS } from "../data/quests/index.js";
import { buildDemoSchool, shiftDayKey, shiftDays, DEMO_LOGINS } from "../utils/demoSchool.js";
import { summarize, accuracy, weakTopics } from "../utils/kidStats.js";

const now = new Date(2026, 10, 9, 19, 0).getTime(); // Sunday 9 Nov 2026, 7 pm
const { ops, summary } = buildDemoSchool({ quests: QUESTS, now });
const DAY = 86400000;

// Same seed → same school
assert.deepEqual(buildDemoSchool({ quests: QUESTS, now }).ops.length, ops.length, "deterministic");

// Every doc is demo, every id is demo_, no real email anywhere
for (const op of ops) {
  assert.equal(op.data.isDemo, true, `isDemo on ${op.path}`);
  const ids = op.path.split("/").filter((_, i) => i % 2 === 1);
  ids.forEach((id) => assert.ok(id.startsWith("demo_") || ["english-quest", "science-quest", "meta"].includes(id), `demo id: ${op.path}`));
}
const text = JSON.stringify(ops);
assert.ok(!/@(?!example\.com)[a-z0-9-]+\.[a-z]/i.test(text.replace(/"[^"]*@example\.com"/g, "")), "no real email");
DEMO_LOGINS.forEach((l) => assert.ok(l.email.endsWith("@example.com") && l.uid.startsWith("demo_")));
assert.ok(!ops.some((o) => o.path.startsWith("classCodes/")), "no join codes: nobody can join a demo class");

// Nothing in the future; attempts only for the last 14 days
const attempts = ops.filter((o) => o.path.startsWith("questAttempts/")).map((o) => o.data);
assert.ok(attempts.length > 200, `enough attempts (${attempts.length})`);
attempts.forEach((a) => assert.ok(a.createdAt <= now && a.createdAt > now - 15 * DAY, "attempt date"));
assert.ok(summary.writes < 2500, `writes per reset ${summary.writes}`);

const doc = (path) => ops.find((o) => o.path === path)?.data;
const kidsOf = (cls) => ops.filter((o) => o.path.startsWith(`classes/${cls}/members/`)).map((o) => o.path.split("/")[3]);
assert.equal(kidsOf("demo_class_10b").length, 32);
assert.equal(kidsOf("demo_class_5a").length, 12);

// Patterns the teacher card must catch (mockup V4)
const progress = (uid, q = "english-quest") => doc(`users/${uid}/questProgress/${q}`);
const tenB = kidsOf("demo_class_10b");
const byPersona = (p) => tenB.find((u) => doc(`users/${u}`).demoPersona === p);
const away = progress(byPersona("away")).stats;
assert.ok(now - away.lastActiveAt >= 9 * DAY, "away kid: 9+ days without practice");
const twice = progress(byPersona("twiceFailed")).nodes;
assert.ok(Object.values(twice).some((n) => n.failsSinceLastPractice === 2 && n.status !== "completed"), "failed a challenge twice");
const drop = progress(byPersona("dropping")).stats;
const lastWeek = accuracy(summarize(drop, "week", now));
assert.ok(lastWeek < 72, `dropping kid's last week is low (${lastWeek}%)`);
const weakCount = tenB.filter((u) => weakTopics(progress(u).stats).some((w) => /question|reported/i.test(w.subtopic))).length;
assert.ok(weakCount >= 12, `most of 10-B weak in reported/questions (${weakCount}/32)`);

// The parent's child: Class 5, both subjects, linked to the demo parent
const riya = doc("users/demo_kid_login");
assert.equal(riya.grade, 5);
assert.deepEqual(riya.parentUids, ["demo_parent"]);
assert.ok(progress("demo_kid_login", "science-quest").stats.answered > 0, "Riya practised Science");
assert.ok(doc("classes/demo_class_10b/assignments/demo_assign_passive").nodeIds.length > 0, "assignment has topics");

// Weekly shift helpers
assert.equal(shiftDayKey("2026-11-28", 7), "2026-12-05");
assert.equal(shiftDays(now, now + 7 * DAY + 3600000), 7);
console.log(`demoSchool tests passed (${summary.writes} writes, ${attempts.length} attempts)`);

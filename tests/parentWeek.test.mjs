// tests/parentWeek.test.mjs — parent's week at a glance (utils/parentWeek.js), with the Demo School's Riya (Class 5)
import assert from "node:assert/strict";
import { QUESTS, bundledQuest } from "../data/quests/index.js";
import { buildDemoSchool } from "../utils/demoSchool.js";
import { parentWeek, TIPS, WORDS, weekIndexOf } from "../utils/parentWeek.js";
import { topicNamer } from "../utils/progressView.js";

const now = new Date(2026, 10, 9, 19, 0).getTime();
const { ops } = buildDemoSchool({ quests: QUESTS, now });
const doc = (p) => ops.find((o) => o.path === p)?.data;
const quests = ["english-quest", "science-quest"].map((id) => {
  const d = doc(`users/demo_kid_login/questProgress/${id}`) || {};
  const qn = bundledQuest(id).nodes;
  return { questId: id, title: bundledQuest(id).quest.title, stats: d.stats, nodes: d.nodes, questNodes: qn, namer: topicNamer(qn) };
});

const en = parentWeek({ name: "Riya", grade: 5, quests, now, lang: "en" });
assert.equal(en.title, "Riya's week");
assert.equal(en.days.length, 7);
assert.equal(en.days[6].key, "2026-11-09", "ends today");
assert.equal(en.days[6].label, "M", "9 Nov 2026 is a Monday");
assert.ok(en.daysOn >= 3, `Riya practised most days (${en.daysOn})`);
assert.match(en.timeText, /^Practised \d of 7 days · /);
assert.equal(en.subjects.length, 2, "English and Science");
en.subjects.forEach((s) => {
  assert.ok(s.total > 0 && s.done <= s.total);
  assert.ok(s.next === null || typeof s.next === "string");
});
assert.ok(en.subjects.some((s) => s.strong), "something she is strong in");
assert.ok(en.home.length > 20);

const hi = parentWeek({ name: "Riya", grade: 5, quests, now, lang: "hi" });
assert.equal(hi.title, "Riya का हफ़्ता");
assert.match(hi.timeText, /^7 में से \d दिन अभ्यास/);
assert.equal(TIPS.en.length, TIPS.hi.length, "every tip has a Hindi version");
assert.deepEqual(Object.keys(WORDS.en).sort(), Object.keys(WORDS.hi).sort(), "every word has a Hindi version");

// A child with no practice: calm message, no crash
const none = parentWeek({ name: "Om", grade: 5, quests: [{ questId: "x", title: "English", stats: {}, nodes: {}, questNodes: [] }], now });
assert.equal(none.daysOn, 0);
assert.ok(none.nothingText);
assert.equal(none.subjects.length, 0);
assert.ok(Number.isInteger(weekIndexOf(now)));
console.log(`parentWeek tests passed (${en.timeText}; ${en.subjects.map((s) => `${s.title}: strong ${s.strong}, practise ${s.practise}, next ${s.next}`).join(" / ")})`);

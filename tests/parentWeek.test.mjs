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

// Missed questions for the parent
const { missedQuestions } = await import("../utils/parentWeek.js");
const quizzes = { qz: [{ question: { content: "Q one?" }, options: [{ content: "A", isCorrect: true }, { content: "B" }] }, { question: { content: "Q two?" }, options: [{ content: "C", isCorrect: true }] }] };
const missed = missedQuestions([
  {
    questId: "english-quest",
    quizzes,
    namer: (s) => s.toUpperCase(),
    mistakes: {
      "qz-q2": { kind: "question", quizId: "qz", questionId: "qz-q2", subtopic: "tense", lastWrongAt: 30 },
      "qz-q1": { kind: "question", quizId: "qz", questionId: "qz-q1", lastWrongAt: 10 },
      "topic:b:gate": { kind: "topic", subtopic: "modals", lastWrongAt: 20 },
      gen: { kind: "question", quizId: "x", questionId: "x-q1", generator: "plural", lastWrongAt: 40 },
    },
  },
]);
assert.deepEqual(missed.map((m) => m.text || m.topic), ["Q two?", "MODALS", "Q one?"], "newest first; generated skipped; gate = topic only");
assert.equal(missed[0].answer, "C");
assert.equal(missed[1].text, null, "Challenge question text never shown");
console.log("parentWeek missed-questions tests passed");

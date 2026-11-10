// tests/parentWeek.test.mjs — parent's week at a glance (utils/parentWeek.js), with the Demo School's Riya (Class 5)
import assert from "node:assert/strict";
import { QUESTS, bundledQuest } from "../data/quests/index.js";
import { buildDemoSchool } from "../utils/demoSchool.js";
import { parentWeek, TIPS, WORDS, weekIndexOf } from "../utils/parentWeek.js";
import { topicNamer } from "../utils/progressView.js";

const now = new Date(2026, 10, 15, 19, 0).getTime(); // a Sunday evening, when the week closes
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
// Weeks run Monday to Sunday (owner, 2026-11-10): Sunday 15 Nov closes the week of 9–15 Nov.
assert.equal(en.days[0].key, "2026-11-09", "starts on Monday");
assert.equal(en.days[0].label, "M");
assert.equal(en.days[6].key, "2026-11-15", "ends on Sunday");
assert.ok(en.days.every((d) => !d.future), "on Sunday no day is still to come");
assert.equal(en.rangeText, "9–15 Nov");
assert.ok(en.daysOn >= 3, `Riya practised most days (${en.daysOn})`);
const monday = parentWeek({ name: "Riya", grade: 5, quests, now: new Date(2026, 10, 9, 19).getTime(), lang: "en" });
assert.ok(monday.days[6].future && !monday.days[0].future, "on Monday the rest of the week is still to come");
const { weekRangeText, weekStartOf } = await import("../utils/parentWeek.js");
assert.equal(weekRangeText(new Date(2026, 10, 1, 9).getTime()), "26 Oct – 1 Nov", "a Sunday ends its week; across months");
assert.equal(new Date(weekStartOf(new Date(2026, 10, 15, 23).getTime())).getDate(), 9, "Sunday night still belongs to the week from Monday 9");
assert.equal(weekRangeText(now, "hi"), "9–15 नवं");
assert.match(en.timeText, /^This week: \d days? · /);
assert.ok(en.timeText.includes("English Quest") && en.timeText.includes("Science Quest"), "timeText includes combined subject breakdown");
assert.equal(en.subjects.length, 2, "English and Science");
en.subjects.forEach((s) => {
  assert.ok(s.total > 0 && s.done <= s.total);
  assert.ok(s.next === null || typeof s.next === "string");
});
assert.ok(en.subjects.some((s) => s.strong), "something she is strong in");
assert.ok(en.home.length > 20);

// With an unpractised subject: folded into unpractisedText
const withUnpractised = parentWeek({
  name: "Riya",
  grade: 5,
  quests: [
    ...quests,
    { questId: "word-power", title: "Word Power", stats: {}, nodes: {}, questNodes: [{ kind: "main", grades: [5] }] },
  ],
  now,
  lang: "en",
});
assert.ok(withUnpractised.unpractisedText?.includes("Word Power"), "unpractised folded into one line");

const hi = parentWeek({ name: "Riya", grade: 5, quests, now, lang: "hi" });
assert.equal(hi.title, "Riya का हफ़्ता");
assert.match(hi.timeText, /^इस हफ़्ते: \d दिन · /);
assert.ok(hi.timeText.includes("English Quest") && hi.timeText.includes("Science Quest"), "Hindi includes subject breakdown");
assert.equal(TIPS.en.length, TIPS.hi.length, "every tip has a Hindi version");
assert.deepEqual(Object.keys(WORDS.en).sort(), Object.keys(WORDS.hi).sort(), "every word has a Hindi version");

// A child with no practice: calm message, no crash
const none = parentWeek({ name: "Om", grade: 5, quests: [{ questId: "x", title: "English", stats: {}, nodes: {}, questNodes: [{ kind: "main", grades: [5] }] }], now });
assert.equal(none.daysOn, 0);
assert.ok(none.nothingText);
assert.equal(none.subjects.length, 0);
assert.ok(none.unpractisedText?.includes("English"), "shows unpractised subject");
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
assert.deepEqual(missed.map((m) => m.text), ["Q two?", "Q one?"], "newest first; generated skipped; a Challenge miss with no practice question is left out (no empty topic)");
assert.equal(missed[0].answer, "C");

// A Challenge miss gets a similar PRACTICE question on the same sub-topic, with its answer; the gate pool stays secret.
const ch = missedQuestions([
  {
    questId: "science-quest",
    namer: () => "The 3Rs",
    questNodes: [{ kind: "gate", quizId: "gatepool" }, { kind: "practice", subtopic: "three-rs", steps: [{ type: "quiz", quizId: "pr" }] }],
    quizzes: {
      gatepool: [{ subtopic: "three-rs", question: { content: "SECRET?" }, options: [{ content: "S", isCorrect: true }] }],
      pr: [{ question: { content: "Which R means using a jar again?" }, options: [{ content: "Reuse", isCorrect: true }, { content: "Reduce" }] }],
    },
    mistakes: { "topic:x:gate": { kind: "topic", subtopic: "three-rs", lastWrongAt: 5 }, "topic:y:gate": { kind: "topic", subtopic: null, lastWrongAt: 6 } },
  },
]);
assert.equal(ch.length, 1, "no-topic Challenge miss left out");
assert.equal(ch[0].text, "Which R means using a jar again?");
assert.equal(ch[0].answer, "Reuse");
assert.equal(ch[0].topic, "The 3Rs");
assert.match(WORDS.en.topicMiss("The 3Rs"), /“The 3Rs”/);
console.log("parentWeek missed-questions tests passed");

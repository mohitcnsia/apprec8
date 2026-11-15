// Tests for utils/assignmentResults.js. Run: node tests/assignmentResults.test.mjs
import assert from "node:assert/strict";
import {
  computeAssignmentResults,
  canRemindStudent,
  formatRemindMessage,
  computeStarOfTheWeek,
} from "../utils/assignmentResults.js";

console.log("Running assignmentResults tests...");

const nodes = [
  { id: "t1", kind: "main", steps: [{ type: "study" }, { type: "quiz" }], subtopic: "nouns" },
  { id: "t2", kind: "main", steps: [{ type: "quiz" }], subtopic: "verbs" },
];
const nodesOf = () => nodes;

const assignment = {
  id: "a1",
  questId: "english-quest",
  nodeIds: ["t1", "t2"],
  nodeTitles: ["Nouns", "Verbs"],
  dueDate: "2026-11-20",
};

// 4 kids testing each of the 4 states:
// 1. Aman: not started
// 2. Bharat: halfway (started t1 step 0)
// 3. Chetan: all steps done, but 2 open mistakes in t1 -> fixingMistakes
// 4. Divya: all steps done, 0 mistakes -> done
const kids = [
  {
    uid: "k1",
    firstName: "Aman",
    quests: [{ questId: "english-quest", nodes: {}, mistakes: {} }],
  },
  {
    uid: "k2",
    firstName: "Bharat",
    quests: [
      {
        questId: "english-quest",
        nodes: { "t1__0": { status: "completed" } },
        mistakes: {},
      },
    ],
  },
  {
    uid: "k3",
    firstName: "Chetan",
    quests: [
      {
        questId: "english-quest",
        nodes: {
          "t1__0": { status: "completed" },
          "t1__1": { status: "completed" },
          "t2__0": { status: "completed" },
        },
        mistakes: {
          m1: { branchId: "t1", questionId: "q1" },
          m2: { branchId: "t1", questionId: "q2" },
        },
        stats: {
          bySubtopic: {
            nouns: { correct: 8, total: 10 },
            verbs: { correct: 6, total: 10 },
          },
        },
      },
    ],
  },
  {
    uid: "k4",
    firstName: "Divya",
    quests: [
      {
        questId: "english-quest",
        nodes: {
          "t1__0": { status: "completed" },
          "t1__1": { status: "completed" },
          "t2__0": { status: "completed" },
        },
        mistakes: {},
        stats: {
          bySubtopic: {
            nouns: { correct: 10, total: 10 },
            verbs: { correct: 9, total: 10 },
          },
        },
      },
    ],
  },
];

const res = computeAssignmentResults(assignment, kids, nodesOf);

// Summary verification
assert.equal(res.summary.total, 4);
assert.equal(res.summary.done, 1);
assert.equal(res.summary.fixingMistakes, 1);
assert.equal(res.summary.halfway, 1);
assert.equal(res.summary.notStarted, 1);
assert.equal(
  res.summary.topLine,
  "1 of 4 done · 1 fixing mistakes · 1 halfway · 1 not started"
);

// Sorting verification: Not started (0) -> Halfway (1) -> Fixing mistakes (2) -> Done (3)
const sortedNames = res.students.map((s) => s.name);
assert.deepEqual(sortedNames, ["Aman", "Bharat", "Chetan", "Divya"]);

// Status checks
assert.equal(res.students[0].status, "notStarted");
assert.equal(res.students[0].statusLabel, "Not started");
assert.equal(res.students[0].accuracyLabel, "—");

assert.equal(res.students[1].status, "halfway");
assert.equal(res.students[1].statusLabel, "Halfway");

assert.equal(res.students[2].status, "fixingMistakes");
assert.equal(res.students[2].statusLabel, "Fixing mistakes (2)");
assert.equal(res.students[2].mistakesLeft, 2);
assert.equal(res.students[2].accuracy, 70); // (8 + 6) / 20 = 70%
assert.equal(res.students[2].accuracyLabel, "Accuracy 70%");

assert.equal(res.students[3].status, "done");
assert.equal(res.students[3].statusLabel, "Done ✓");
assert.equal(res.students[3].mistakesLeft, 0);
assert.equal(res.students[3].accuracy, 95); // (10 + 9) / 20 = 95%
assert.equal(res.students[3].accuracyLabel, "Accuracy 95%");

// Remind throttling tests
const now = Date.parse("2026-11-15T12:00:00Z");
assert.equal(canRemindStudent({ status: "done" }, now), false);
assert.equal(canRemindStudent({ status: "notStarted", lastRemindedAt: null }, now), true);
// Reminded today (same date) -> false
assert.equal(canRemindStudent({ status: "halfway", lastRemindedAt: "2026-11-15T08:00:00Z" }, now), false);
// Reminded yesterday -> true
assert.equal(canRemindStudent({ status: "halfway", lastRemindedAt: "2026-11-14T18:00:00Z" }, now), true);

// Reminder message formatting
assert.equal(
  formatRemindMessage("Seema Ma'am", "Determiners", 2),
  "Seema Ma'am: finish Determiners — 2 mistakes to fix"
);
assert.equal(
  formatRemindMessage("Seema Ma'am", "Determiners", 1),
  "Seema Ma'am: finish Determiners — 1 mistake to fix"
);
assert.equal(
  formatRemindMessage("Seema Ma'am", "Determiners", 0),
  "Seema Ma'am: please complete Determiners"
);

// Star of the week computation
const weeklyKids = [
  {
    uid: "k1",
    firstName: "Tripti",
    quests: [{ week: { answered: 35, correct: 33 } }],
  },
  {
    uid: "k2",
    firstName: "Rohan",
    quests: [{ week: { answered: 20, correct: 15 } }],
  },
  {
    uid: "k3",
    firstName: "Anu",
    quests: [{ week: { answered: 5, correct: 5 } }], // under 10 answers threshold
  },
];
const star = computeStarOfTheWeek(weeklyKids, now);
assert.ok(star);
assert.equal(star.student.firstName, "Tripti");
assert.equal(star.student.accuracy, 94);
assert.equal(star.shortShareText, "This week's star: Tripti 🌟");

console.log("✓ All assignmentResults tests passed!");

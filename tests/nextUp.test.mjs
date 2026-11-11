// Tests for utils/nextUp.js (the kid's one next thing on Home). Run: npm test
import assert from "node:assert/strict";
import { nextUp, dueText } from "../utils/nextUp.js";

const days = (iso) => ({ "2026-11-11": 0, "2026-11-12": 1, "2026-11-14": 3 })[iso] ?? 9;
assert.equal(dueText({ dueDate: null }, days), "Open now");
assert.equal(dueText({ dueDate: "2026-11-01", overdue: true }, days), "Was due, still open");
assert.equal(dueText({ dueDate: "2026-11-11" }, days), "Due today");
assert.equal(dueText({ dueDate: "2026-11-12" }, days), "Due tomorrow");
assert.equal(dueText({ dueDate: "2026-11-14" }, days), "Due in 3 days");

// Teacher's work first, overdue on top; then paper, mistakes, quest; two "then" lines; the rest counted.
const r = nextUp({
  teacherTopics: [
    { key: "a", title: "Tenses", dueDate: "2026-11-14" },
    { key: "b", title: "Modals", dueDate: "2026-11-01", overdue: true },
  ],
  today: { paper: { id: "p1", subject: "science", title: "Paper 2", minutes: 20 } },
  mistakeCount: 3,
  continueQuest: { questId: "eq", title: "English Quest", current: "Reported speech" },
  daysUntil: days,
});
assert.deepEqual([r.main.title, ...r.then.map((x) => x.title)], ["Modals", "Tenses", "Science Paper 2"]);
assert.equal(r.main.sub, "Was due, still open");
assert.equal(r.more, 2);
assert.deepEqual(r.rest.map((x) => x.kind), ["mistakes", "quest"]);

// No teacher work: today's paper leads; nothing at all: no card.
assert.equal(nextUp({ today: { paper: { id: "p", title: "Paper 1", minutes: 10 } }, mistakeCount: 1 }).main.kind, "paper");
assert.equal(nextUp({ mistakeCount: 1 }).main.title, "1 mistake to fix");
assert.equal(nextUp({}).main, null);

console.log("nextUp tests passed");

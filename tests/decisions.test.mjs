// tests/decisions.test.mjs: the owner's Decisions inbox (utils/decisions.js).
import assert from "node:assert/strict";
import { validQuestion, questionDoc, newQuestions, answerPatch, inbox, mergeAnswers, pushText, answerLabel } from "../utils/decisions.js";

const q = { id: "row-x", title: "Approve row X", ask: "Ship the parent gate?", details: "**Long** story", link: "https://claude.ai/artifact/x" };
assert.ok(validQuestion(q));
assert.ok(!validQuestion({ ...q, id: "Bad Id" }) && !validQuestion({ ...q, ask: " " }) && !validQuestion(null));
const doc = questionDoc({ ...q, link: "javascript:alert(1)", from: "x" }, 5);
assert.equal(doc.link, null, "only https links");
assert.equal(doc.from, "claude");
assert.equal(doc.status, "open");
assert.equal(doc.createdAt, 5);

assert.deepEqual(newQuestions([q, { ...q, id: "old" }, { ...q, id: "done", answer: "yes" }, { id: "x" }], ["old"]).map((x) => x.id), ["row-x"], "only valid, unanswered, not yet sent");

const yes = answerPatch("yes", "  go ahead ", 1000);
assert.deepEqual(yes, { answer: "yes", note: "go ahead", status: "answered", answeredAt: 1000, laterUntil: null });
const later = answerPatch("later", "", 1000);
assert.equal(later.status, "later");
assert.equal(later.laterUntil, 1000 + 24 * 3600 * 1000);
assert.equal(later.note, null);
assert.equal(answerPatch("more", "x".repeat(900)).note.length, 500);
assert.throws(() => answerPatch("maybe"));

const now = 10 * 24 * 3600 * 1000;
const box = inbox(
  [
    { id: "a", status: "open", createdAt: 3 },
    { id: "b", status: "open", createdAt: 1 },
    { id: "c", status: "later", laterUntil: now + 1 },
    { id: "d", status: "later", laterUntil: now - 1, createdAt: 2 },
    { id: "e", status: "answered", answeredAt: 7 },
  ],
  now
);
assert.deepEqual(box.waiting.map((d) => d.id), ["b", "d", "a"], "oldest first; a 'later' comes back after a day");
assert.deepEqual(box.later.map((d) => d.id), ["c"]);
assert.deepEqual(box.done.map((d) => d.id), ["e"]);

const merged = mergeAnswers([q, { ...q, id: "b" }], [{ id: "row-x", answer: "no", note: "wait", answeredAt: 0 }, { id: "b", answer: null }]);
assert.equal(merged[0].answer, "no");
assert.equal(merged[0].note, "wait");
assert.equal(merged[0].answeredAt, "1970-01-01T00:00:00.000Z");
assert.equal(merged[1].answer, undefined);

assert.equal(pushText([]), null);
assert.equal(pushText([q]).title, "Apprec8: 1 decision for you");
assert.match(pushText([q, q, q]).body, /\+ 2 more/);
assert.equal(answerLabel("more"), "MORE DETAILS");
console.log("decisions tests passed");

import assert from "node:assert/strict";
import { topicAccuracy, looksOffline, WEAK_BELOW, checkupRecord, classCheckup } from "../utils/paperTopics.js";
import { paperQuestionId } from "../utils/paperScore.js";

const q = (node, answer = "a", quest = "english-quest") => ({ answer, options: [], topic: { quest, node } });
const paper = { id: "p", parts: [{ id: "A", marks: 1, questions: [q("n1"), q("n1"), q("n2"), q("n2"), q("n2"), { answer: "a", options: [] }] }] };
const id = (i) => paperQuestionId("p", "A", i);
const rows = topicAccuracy(paper, { [id(0)]: "a", [id(1)]: "b", [id(2)]: "a", [id(3)]: "a", [id(4)]: "a" });
assert.deepEqual(rows.map((r) => [r.node, r.right, r.total, r.accuracy, r.weak]), [["n1", 1, 2, 50, true], ["n2", 3, 3, 100, false]]);
assert.equal(WEAK_BELOW, 60);
assert.deepEqual(topicAccuracy(paper, {}).map((r) => r.accuracy), [0, 0]);
assert.equal(topicAccuracy(paper, {})[0].node, "n2", "ties: more questions first");

assert.equal(looksOffline({ code: "functions/unavailable" }), true);
assert.equal(looksOffline(new Error("Network request failed")), true);
assert.equal(looksOffline({ code: "functions/permission-denied" }), false);

// Every real paper + the Class 10 check-ups: every topic row is sane.
import { PAPERS, paperById, nextCheckupId } from "../data/papers/index.js";
let papers = 0, topics = 0;
for (const p of [...PAPERS, paperById(nextCheckupId(10, [])), paperById(nextCheckupId(9, [])), paperById("checkup-en-g10-2")]) {
  papers++;
  const r = topicAccuracy(p, {});
  topics += r.length;
  r.forEach((x) => assert.ok(x.total > 0 && x.accuracy === 0 && x.weak));
}
// G91: the Class 10 check-up = 18 Grammar Pro topics x 3 questions; check-up 2 shares no question with check-up 1.
const c1 = paperById("checkup-en-g10-1"), c2 = paperById("checkup-en-g10-2");
assert.equal(topicAccuracy(c1, {}).length, 18);
assert.ok(topicAccuracy(c1, {}).every((t) => t.total === 3));
const t1 = new Set(c1.parts.flatMap((p) => p.questions.map((q) => q.question.content)));
assert.equal(c2.parts.flatMap((p) => p.questions).filter((q) => t1.has(q.question.content)).length, 0);
assert.equal(nextCheckupId(5, []), null, "Class 5 uses its own papers");
assert.equal(nextCheckupId(10, [{ paperId: "checkup-en-g10-1" }]), "checkup-en-g10-2");
// Seema's class view: latest check-up per kid, class Accuracy per topic, who is under 60%.
const rec = checkupRecord([{ node: "a", right: 1, total: 3 }, { node: "b", right: 3, total: 3 }], 100);
assert.deepEqual(rec, { at: 100, topics: { a: [1, 3], b: [3, 3] } });
const cls = classCheckup([
  { firstName: "Asha", checkups: { c1: { at: 1, topics: { a: [0, 3] } }, c2: rec } }, // latest = c2
  { firstName: "Ravi", checkups: { c1: { at: 5, topics: { a: [3, 3], b: [1, 3] } } } },
  { firstName: "Noor" }, // did not take it
]);
assert.equal(cls.took, 2);
assert.deepEqual(cls.topics.map((t) => [t.node, t.accuracy, t.weakKids]), [["a", 67, ["Asha"]], ["b", 67, ["Ravi"]]]);
console.log(`paperTopics tests passed (${papers} papers, ${topics} topic rows)`);

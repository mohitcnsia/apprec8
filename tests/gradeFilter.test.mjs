// Tests for utils/gradeFilter.js (class-tagged quests). Run: npm test
import assert from "node:assert/strict";
import { nodesForGrade, gradesLabel, questHasTopicsForGrade } from "../utils/gradeFilter.js";
import { buildQuestPath } from "../utils/questTree.js";
import * as English from "../data/englishQuestData.js";
import * as Science from "../data/scienceQuestData.js";
import * as WordPower from "../data/wordPowerQuestData.js";

const N = [
  { id: "u1", kind: "unit", unitOrder: 1, title: "Living things" },
  { id: "a", kind: "main", unitId: "u1", branchId: "a", branchOrder: 1, title: "Plants", grades: [3, 4, 5], steps: [{ type: "quiz", quizId: "qa" }] },
  { id: "a-p1", kind: "practice", unitId: "u1", branchId: "a", order: 1, title: "Easy", difficulty: "easy", steps: [{ type: "quiz", quizId: "qa1" }] },
  { id: "a-p2", kind: "practice", unitId: "u1", branchId: "a", order: 2, title: "Class 5 challenge", difficulty: "hard", grades: [5], steps: [{ type: "quiz", quizId: "qa2" }] },
  { id: "a-gate", kind: "gate", unitId: "u1", branchId: "a", title: "Gate", quizId: "ga" },
  { id: "b", kind: "main", unitId: "u1", branchId: "b", branchOrder: 2, title: "Cells", grades: [7, 8], steps: [{ type: "quiz", quizId: "qb" }] },
  { id: "b-gate", kind: "gate", unitId: "u1", branchId: "b", title: "Gate", quizId: "gb" },
  { id: "c", kind: "main", unitId: "u1", branchId: "c", branchOrder: 3, title: "Animals", steps: [{ type: "quiz", quizId: "qc" }] },
  { id: "u1-boss", kind: "boss", unitId: "u1", title: "Boss", quizId: "boss1" },
  { id: "u2", kind: "unit", unitOrder: 2, title: "Class 8 only" },
  { id: "d", kind: "main", unitId: "u2", branchId: "d", branchOrder: 1, title: "Atoms", grades: [8], steps: [{ type: "quiz", quizId: "qd" }] },
  { id: "u2-boss", kind: "boss", unitId: "u2", title: "Boss 2", quizId: "boss2" },
  { id: "u3", kind: "unit", unitOrder: 3, title: "Teaser", comingSoon: true },
];
const ids = (ns) => ns.map((n) => n.id);

// no class → nothing hidden
assert.equal(nodesForGrade(N, null).length, N.length);
assert.equal(nodesForGrade(N, undefined).length, N.length);

// Class 4: Cells (7–8) and its gate hidden, Class 5 challenge hidden, Class-8-only unit hidden with its boss; teaser kept
assert.deepEqual(ids(nodesForGrade(N, 4)), ["u1", "a", "a-p1", "a-gate", "c", "u1-boss", "u3"]);
// Class 5 sees the challenge leaf
assert.ok(ids(nodesForGrade(N, 5)).includes("a-p2"));
// Class 8: Plants hidden, Cells + unit 2 shown
assert.deepEqual(ids(nodesForGrade(N, 8)), ["u1", "b", "b-gate", "c", "u1-boss", "u2", "d", "u2-boss", "u3"]);

// A hidden topic never blocks the next one: for Class 4, after Plants is cleared, Animals opens
const progress = { "a__0": { status: "completed" }, "a-gate": { status: "completed" } };
const t = buildQuestPath(nodesForGrade(N, 4), progress);
assert.equal(t.path.find((p) => p.id === "c").status, "unlocked");

// English Quest: class tags only on Champion leaves (one level up) and on whole older-class units (every node of the unit,
// e.g. Unit 7 for Class 5+). Untagged nodes show for every class.
const tagged = English.nodes.filter((n) => n.grades);
const taggedUnits = new Set(English.nodes.filter((n) => n.kind === "unit" && n.grades).map((n) => n.id));
assert.ok(tagged.every((n) => n.kind === "practice" || taggedUnits.has(n.unitId) || taggedUnits.has(n.id)), "English: only Champion leaves and whole units are class-tagged");
for (const u of taggedUnits) {
  const inUnit = English.nodes.filter((n) => n.unitId === u || n.id === u);
  assert.ok(inUnit.every((n) => n.grades), `${u}: every node of a class-tagged unit needs the tag`);
}
assert.ok(ids(nodesForGrade(English.nodes, 5)).includes("eq-u7-boss") && !ids(nodesForGrade(English.nodes, 4)).some((id) => id.startsWith("eq-u7")));
for (const g of [3, 5, 10]) {
  assert.equal(nodesForGrade(English.nodes, g).length, English.nodes.length - tagged.filter((n) => !n.grades.includes(g)).length);
}
assert.ok(ids(nodesForGrade(English.nodes, 5)).includes("eq-u5-perfect-p2") && !ids(nodesForGrade(English.nodes, 4)).includes("eq-u5-perfect-p2"));

// labels
assert.equal(gradesLabel([5, 3, 4]), "Class 3–5");
assert.equal(gradesLabel([6]), "Class 6");
assert.equal(gradesLabel([3, 5]), "Class 3, 5");
assert.equal(gradesLabel(undefined), null);

// questHasTopicsForGrade
assert.equal(questHasTopicsForGrade(N, 4), true, "N has topics for Class 4");
assert.equal(questHasTopicsForGrade(N, 8), true, "N has topics for Class 8");
assert.equal(questHasTopicsForGrade([], 4), false, "empty quest has no topics");
assert.equal(questHasTopicsForGrade(null, 4), false, "null quest has no topics");

const taggedOnlyTree = [
  { id: "u1", kind: "unit" },
  { id: "t1", kind: "main", unitId: "u1", grades: [3, 4, 5] },
  { id: "t2", kind: "main", unitId: "u1", grades: [7, 8] },
];
assert.equal(questHasTopicsForGrade(taggedOnlyTree, 4), true, "has topics for Class 4");
assert.equal(questHasTopicsForGrade(taggedOnlyTree, 10), false, "no topics for Class 10");

// Real quests for Class 10 (G79 bug report: Class 10 must hide Science and Word Power)
assert.equal(questHasTopicsForGrade(English.nodes, 10), true, "English Quest has topics for Class 10");
assert.equal(questHasTopicsForGrade(English.nodes, 4), true, "English Quest has topics for Class 4");
assert.equal(questHasTopicsForGrade(Science.nodes, 4), true, "Science Quest has topics for Class 4");
assert.equal(questHasTopicsForGrade(Science.nodes, 10), false, "Science Quest has 0 topics for Class 10 (only teaser unit)");
assert.equal(questHasTopicsForGrade(WordPower.nodes, 4), true, "Word Power has topics for Class 4");
assert.equal(questHasTopicsForGrade(WordPower.nodes, 10), false, "Word Power has 0 topics for Class 10 (only teaser unit)");

console.log("gradeFilter tests passed");

// Class 7 (2026-11-12): their own topics only, every topic open from the start (openTopics), the teaser unit hidden.
{
  const sci = await import("../data/scienceQuestData.js");
  const seven = nodesForGrade(sci.nodes, 7);
  assert.ok(!seven.some((n) => n.id === "sq-u7"), "Class 7 doesn't see the Class 3–6 teaser unit");
  assert.ok(seven.every((n) => n.id.startsWith("sq7-")), "Class 7 sees only Class 7 topics");
  const p7 = buildQuestPath(seven, {});
  const mains7 = p7.path.filter((x) => x.kind === "main");
  assert.equal(mains7.length, 13);
  assert.ok(mains7.every((m) => m.status === "unlocked"), "every Class 7 topic is open");
  assert.equal(p7.stats.unitsDone, 0, "nothing counts as done before it is played");
  // Class 5 still unlocks in order.
  const p5 = buildQuestPath(nodesForGrade(sci.nodes, 5), {});
  assert.equal(p5.path.filter((x) => x.kind === "main" && x.status === "unlocked").length, 1);
  console.log("Class 7 science: 13 open topics");
}

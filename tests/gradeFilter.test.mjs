// Tests for utils/gradeFilter.js (class-tagged quests). Run: npm test
import assert from "node:assert/strict";
import { nodesForGrade, gradesLabel } from "../utils/gradeFilter.js";
import { buildQuestPath } from "../utils/questTree.js";
import * as English from "../data/englishQuestData.js";

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

// English Quest: only Champion leaves carry class tags (one level up). Untagged nodes show for every class.
const tagged = English.nodes.filter((n) => n.grades);
assert.ok(tagged.every((n) => n.kind === "practice"), "English: only practice (Champion) leaves are class-tagged");
for (const g of [3, 5, 10]) {
  assert.equal(nodesForGrade(English.nodes, g).length, English.nodes.length - tagged.filter((n) => !n.grades.includes(g)).length);
}
assert.ok(ids(nodesForGrade(English.nodes, 5)).includes("eq-u5-perfect-p2") && !ids(nodesForGrade(English.nodes, 4)).includes("eq-u5-perfect-p2"));

// labels
assert.equal(gradesLabel([5, 3, 4]), "Class 3–5");
assert.equal(gradesLabel([6]), "Class 6");
assert.equal(gradesLabel([3, 5]), "Class 3, 5");
assert.equal(gradesLabel(undefined), null);

console.log("gradeFilter tests passed");

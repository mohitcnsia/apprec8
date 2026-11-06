// tests/nextStep.test.mjs — tests for utils/nextStep.js. Run: npm test
import assert from "node:assert/strict";
import { findNextStep, getNextStepTitle } from "../utils/nextStep.js";
import { stepId } from "../utils/questTree.js";

const nodes = [
  { id: "u0", kind: "unit", unitOrder: 0, title: "U0" },
  {
    id: "a",
    kind: "main",
    unitId: "u0",
    branchId: "A",
    branchOrder: 0,
    title: "Kinds of Sentences",
    steps: [
      { type: "study", contentId: "s-sentences" },
      { type: "quiz", quizId: "q-sentences" },
    ],
  },
  {
    id: "a-p1",
    kind: "practice",
    unitId: "u0",
    branchId: "A",
    order: 1,
    subtopic: "exclamatory-sentences",
    title: "Exclamatory Sentences",
    steps: [{ type: "quiz", quizId: "p-exclamatory" }],
  },
  {
    id: "a-gate",
    kind: "gate",
    unitId: "u0",
    branchId: "A",
    title: "Sentences Challenge",
    quizId: "g-sentences",
    passPercent: 80,
  },
  {
    id: "b",
    kind: "main",
    unitId: "u0",
    branchId: "B",
    branchOrder: 1,
    title: "Nouns & Pronouns",
    steps: [{ type: "study", contentId: "s-nouns" }, { type: "quiz", quizId: "q-nouns" }],
  },
  {
    id: "u0-boss",
    kind: "boss",
    unitId: "u0",
    title: "Unit 0 Boss",
    quizId: "boss0",
    passPercent: 70,
  },
];

const done = (...keys) => Object.fromEntries(keys.map((k) => [k, { status: "completed", bestPercent: 100 }]));

// 1. Brand new student: first step of first main node is study
let res = findNextStep(nodes, {});
assert.ok(res);
assert.equal(res.targetType, "main");
assert.equal(res.step.type, "study");
assert.equal(res.step.contentId, "s-sentences");
assert.equal(getNextStepTitle(res), "Kinds of Sentences");

// 2. Study done: next step is the practice quiz for this main node
res = findNextStep(nodes, done(stepId("a", 0)));
assert.ok(res);
assert.equal(res.targetType, "main");
assert.equal(res.step.type, "quiz");
assert.equal(res.step.quizId, "q-sentences");
assert.equal(getNextStepTitle(res), "Kinds of Sentences");

// 3. Main done: gate challenge is open
res = findNextStep(nodes, done(stepId("a", 0), stepId("a", 1)));
assert.ok(res);
assert.equal(res.targetType, "gate");
assert.equal(res.step.quizId, "g-sentences");
assert.equal(res.passPercent, 80);
assert.equal(getNextStepTitle(res), "Sentences Challenge");

// 4. Gate failed twice with weak sub-topic: glowing practice leaf must be recommended
const progressWithFailures = {
  ...done(stepId("a", 0), stepId("a", 1)),
  "a-gate": {
    status: "unlocked",
    failsSinceLastPractice: 2,
    weakSubtopics: ["exclamatory-sentences"],
  },
};
res = findNextStep(nodes, progressWithFailures);
assert.ok(res);
assert.equal(res.targetType, "practice");
assert.equal(res.step.quizId, "p-exclamatory");
assert.equal(res.extraContext.resetGateId, "a-gate");
assert.equal(getNextStepTitle(res), "exclamatory-sentences");

// 5. Gate cleared: branch B opens
res = findNextStep(nodes, done(stepId("a", 0), stepId("a", 1), "a-gate"));
assert.ok(res);
assert.equal(res.targetType, "main");
assert.equal(res.node.id, "b");
assert.equal(res.step.type, "study");
assert.equal(getNextStepTitle(res), "Nouns & Pronouns");

// 6. Branch B cleared: Boss node opens
res = findNextStep(nodes, done(stepId("a", 0), stepId("a", 1), "a-gate", stepId("b", 0), stepId("b", 1)));
assert.ok(res);
assert.equal(res.targetType, "boss");
assert.equal(res.step.quizId, "boss0");
assert.equal(res.passPercent, 70);
assert.equal(getNextStepTitle(res), "Unit 0 Boss");

console.log("nextStep tests passed");

// tests/classSummaryFixes.test.mjs
// Verifies G119 fixes:
// 1. Stale results: skip write only when lv, mistakes AND completed all match.
// 2. Doc size: completed stores only topic IDs (via topicDone over bundled nodes), not raw step keys.
// 3. Kid's reminder card: nudgeText handles kind: "remind" with mistakesLeft.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { nudgeText } from "../utils/nudge.js";

const require = createRequire(import.meta.url);
const { _classSummaryForTests: cs } = require("../functions/triggers/classSummary.js");

console.log("Running G119 classSummaryFixes tests...");

// --- 1. Stale Results & Throttling Comparisons ---
console.log("1. Testing comparison helpers (sameMap, sameArray, and skip logic)...");

assert.equal(cs.sameMap({ a: 1, b: 2 }, { b: 2, a: 1 }), true, "sameMap handles out-of-order keys");
assert.equal(cs.sameMap({ a: 1 }, { a: 2 }), false, "sameMap detects different values");
assert.equal(cs.sameMap({ a: 1 }, { a: 1, b: 2 }), false, "sameMap detects extra keys");
assert.equal(cs.sameMap({}, {}), true, "sameMap handles empty maps");

assert.equal(cs.sameArray(["topicA", "topicB"], ["topicB", "topicA"]), true, "sameArray handles different order");
assert.equal(cs.sameArray(["topicA"], ["topicA", "topicB"]), false, "sameArray detects length difference");
assert.equal(cs.sameArray([], []), true, "sameArray handles empty arrays");

// Throttling decision helper
const shouldSkip = (prev, entry, now, minGapMs = 5 * 60 * 1000) => {
  return (
    prev &&
    now - (prev.at || 0) < minGapMs &&
    cs.sameMap(prev.lv, entry.lv) &&
    cs.sameMap(prev.mistakes, entry.mistakes) &&
    cs.sameArray(prev.completed, entry.completed)
  );
};

const now = 1000000;
const prevEntry = {
  at: now - 60000, // 1 minute ago (< 5 min)
  lv: { nouns: "p", tenses: "l" },
  mistakes: { nouns: 1 },
  completed: ["eq-u0-sentence"],
};

// Case A: Everything identical within 5 minutes -> skip write
assert.equal(
  shouldSkip(prevEntry, { lv: { nouns: "p", tenses: "l" }, mistakes: { nouns: 1 }, completed: ["eq-u0-sentence"] }, now),
  true,
  "Skips write when lv, mistakes, and completed are all identical"
);

// Case B: Kid fixed their mistake (mistakes changed) -> DO NOT skip write
assert.equal(
  shouldSkip(prevEntry, { lv: { nouns: "p", tenses: "l" }, mistakes: {}, completed: ["eq-u0-sentence"] }, now),
  false,
  "Does NOT skip when mistakes changed (e.g. kid fixed mistake 1 min later)"
);

// Case C: Kid completed another topic -> DO NOT skip write
assert.equal(
  shouldSkip(prevEntry, { lv: { nouns: "p", tenses: "l" }, mistakes: { nouns: 1 }, completed: ["eq-u0-sentence", "eq-u0-kinds"] }, now),
  false,
  "Does NOT skip when completed topics changed"
);

// Case D: Kid leveled up -> DO NOT skip write
assert.equal(
  shouldSkip(prevEntry, { lv: { nouns: "l", tenses: "l" }, mistakes: { nouns: 1 }, completed: ["eq-u0-sentence"] }, now),
  false,
  "Does NOT skip when topic levels changed"
);

// Case E: Gap >= 5 minutes -> DO NOT skip write
assert.equal(
  shouldSkip(prevEntry, { lv: { nouns: "p", tenses: "l" }, mistakes: { nouns: 1 }, completed: ["eq-u0-sentence"] }, now + 6 * 60 * 1000),
  false,
  "Does NOT skip when >= 5 minutes elapsed"
);

// --- 2. Doc Size: Completed Topics vs Step Keys ---
console.log("2. Testing completed topics storage (topicDone over quest nodes)...");

const questWith3StepTopics = [
  { id: "determiners", kind: "main", steps: [{ type: "study" }, { type: "quiz" }, { type: "quiz" }] },
  { id: "prepositions", kind: "main", steps: [{ type: "study" }, { type: "quiz" }, { type: "quiz" }] },
  { id: "gate_grammar", kind: "gate" }, // 0 steps
  { id: "unit_header", kind: "unit" }, // unit header: should be excluded
];

// Test: 0 steps completed
const e0 = cs.entryOf({ nodes: {} }, now, questWith3StepTopics);
assert.deepEqual(e0.completed, [], "0 steps gives empty completed array");

// Test: 2 of 3 steps completed for determiners (not done yet!)
const e1 = cs.entryOf(
  {
    nodes: {
      "determiners__0": { status: "completed" },
      "determiners__1": { status: "completed" },
    },
  },
  now,
  questWith3StepTopics
);
assert.deepEqual(e1.completed, [], "2 of 3 steps completed does NOT count as topic done");

// Test: 3 of 3 steps completed for determiners -> gives topic ID only
const e2 = cs.entryOf(
  {
    nodes: {
      "determiners__0": { status: "completed" },
      "determiners__1": { status: "completed" },
      "determiners__2": { status: "completed" },
      "prepositions__0": { status: "completed" }, // partial prepositions
    },
  },
  now,
  questWith3StepTopics
);
assert.deepEqual(e2.completed, ["determiners"], "Gives topic ID only (no step keys like determiners__0)");
assert.ok(!e2.completed.includes("determiners__0"), "Never includes step keys");
assert.ok(!e2.completed.includes("determiners__1"), "Never includes step keys");
assert.ok(!e2.completed.includes("determiners__2"), "Never includes step keys");
assert.ok(!e2.completed.includes("prepositions"), "Does not include incomplete topic");

// Test: gate completed (0 steps)
const e3 = cs.entryOf(
  {
    nodes: {
      "determiners__0": { status: "completed" },
      "determiners__1": { status: "completed" },
      "determiners__2": { status: "completed" },
      "gate_grammar": { status: "completed" },
    },
  },
  now,
  questWith3StepTopics
);
assert.deepEqual(e3.completed, ["determiners", "gate_grammar"], "Includes completed gate and main topic");

// Test with bundled questId string ("english-quest")
const eEnglish = cs.entryOf(
  {
    nodes: {
      "eq-u0-sentence__0": { status: "completed" },
      "eq-u0-sentence__1": { status: "completed" }, // eq-u0-sentence has 2 steps
    },
  },
  now,
  "english-quest"
);
assert.deepEqual(eEnglish.completed, ["eq-u0-sentence"], "Bundled english-quest resolves topic ID");

// --- 3. Kid's Nudge Card: Remind Case ---
console.log("3. Testing NudgeCard remind formatting...");

assert.equal(
  nudgeText({ kind: "remind", from: "Seema Ma'am", topic: "Determiners", mistakesLeft: 6 }),
  "Seema Ma'am reminded you: finish Determiners — 6 mistakes to fix"
);

assert.equal(
  nudgeText({ kind: "remind", from: "Seema Ma'am", topic: "Determiners", mistakesLeft: 1 }),
  "Seema Ma'am reminded you: finish Determiners — 1 mistake to fix"
);

assert.equal(
  nudgeText({ kind: "remind", from: "Seema Ma'am", topic: "Determiners", mistakesLeft: 0 }),
  "Seema Ma'am reminded you: finish Determiners"
);

assert.equal(
  nudgeText({ kind: "remind", from: "Seema Ma'am", topic: "Determiners" }),
  "Seema Ma'am reminded you: finish Determiners"
);

// Fallbacks
assert.equal(
  nudgeText({ kind: "remind" }),
  "Your teacher reminded you: finish your topic"
);

// Cheer and default
assert.equal(
  nudgeText({ kind: "cheer", topic: "Nouns" }),
  "Keep going on Nouns. You're getting there! 💪"
);
assert.equal(
  nudgeText({ kind: "practice", topic: "Nouns" }),
  "Let's practise Nouns today. You can do it! 🌱"
);

console.log("✓ All G119 classSummaryFixes tests passed!");

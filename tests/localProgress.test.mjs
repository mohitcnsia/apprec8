// tests/localProgress.test.mjs
// Unit tests for utils/localProgress.js (Learn first: offline device storage for unconsented kids).
import assert from "node:assert/strict";
import {
  loadLocalProgress,
  saveLocalNodeProgress,
  saveLocalAttempt,
  calculateAttemptStars,
  getLocalStars,
  addLocalStars,
  prepareLocalProgressUpload,
  clearLocalProgress,
} from "../utils/localProgress.js";

function createMemoryStorage() {
  const map = new Map();
  return {
    async getItem(k) {
      return map.has(k) ? map.get(k) : null;
    },
    async setItem(k, v) {
      map.set(k, String(v));
    },
    async removeItem(k) {
      map.delete(k);
    },
    dump() {
      return Object.fromEntries(map.entries());
    },
  };
}

const storage = createMemoryStorage();
const uid = "kid_test_123";
const questId = "english-quest";

// 1. Empty progress default
const empty = await loadLocalProgress(storage, uid, questId);
assert.equal(empty.questId, questId);
assert.deepEqual(empty.nodes, {});
assert.deepEqual(empty.mistakes, {});
assert.deepEqual(empty.stats, {});

// 2. Stars calculation
assert.equal(calculateAttemptStars(100, true), 3);
assert.equal(calculateAttemptStars(90, true), 3);
assert.equal(calculateAttemptStars(89, true), 2);
assert.equal(calculateAttemptStars(60, true), 2);
assert.equal(calculateAttemptStars(59, true), 1);
assert.equal(calculateAttemptStars(20, false), 0);
assert.equal(calculateAttemptStars(0, false), 0);

// 3. Save node progress
const node1 = await saveLocalNodeProgress(storage, uid, questId, "leaf-nouns", {
  percent: 85,
  passed: true,
  now: 1000,
});
assert.equal(node1.nodes["leaf-nouns"].status, "completed");
assert.equal(node1.nodes["leaf-nouns"].bestPercent, 85);
assert.equal(node1.nodes["leaf-nouns"].attempts, 1);
assert.equal(node1.nodes["leaf-nouns"].completedAt, 1000);

// Replay with lower score does not downgrade bestPercent or completed status
const replay = await saveLocalNodeProgress(storage, uid, questId, "leaf-nouns", {
  percent: 40,
  passed: false,
  now: 2000,
});
assert.equal(replay.nodes["leaf-nouns"].status, "completed");
assert.equal(replay.nodes["leaf-nouns"].bestPercent, 85);
assert.equal(replay.nodes["leaf-nouns"].attempts, 2);

// 4. Gate failure & reset
const gateFail = await saveLocalNodeProgress(storage, uid, questId, "gate-nouns", {
  percent: 40,
  passed: false,
  gate: { weak: ["proper-nouns"] },
  now: 3000,
});
assert.equal(gateFail.nodes["gate-nouns"].failsSinceLastPractice, 1);
assert.deepEqual(gateFail.nodes["gate-nouns"].weakSubtopics, ["proper-nouns"]);

// Recommended practice passes → gate fails counter resets
const practicePass = await saveLocalNodeProgress(storage, uid, questId, "leaf-proper-nouns", {
  percent: 90,
  passed: true,
  resetGateId: "gate-nouns",
  now: 4000,
});
assert.equal(practicePass.nodes["gate-nouns"].failsSinceLastPractice, 0);

// 5. Save attempt
const attemptRes = await saveLocalAttempt(
  storage,
  uid,
  {
    questId,
    nodeId: "leaf-verbs",
    quizId: "quiz-verbs-1",
    answers: [
      { questionId: "q1", isCorrect: true, subtopic: "action-verbs" },
      { questionId: "q2", isCorrect: false, subtopic: "action-verbs" },
      { questionId: "q3", isCorrect: true, subtopic: "linking-verbs" },
    ],
    totalQuestions: 3,
    passPercent: 60,
    outcome: "finished",
    activity: "practice",
    startedAt: 5000,
  },
  { now: 5500 }
);

assert.equal(attemptRes.passed, true); // 2/3 = 66.7% >= 60%
assert.equal(attemptRes.starsAwarded, 2); // 66.7% >= 60% → 2 stars

// Check that stars were recorded locally
const stars = await getLocalStars(storage, uid);
assert.equal(stars, 2);

// Check that attempt was saved to attempts list
const prep = await prepareLocalProgressUpload(storage, uid, [questId]);
assert.equal(prep.attempts.length, 1);
assert.equal(prep.attempts[0].quizId, "quiz-verbs-1");
assert.equal(prep.attempts[0].correctCount, 2);
assert.equal(prep.attempts[0].totalQuestions, 3);
assert.equal(prep.progressDocs.length, 1);
assert.equal(prep.progressDocs[0].questId, questId);
assert.ok(prep.progressDocs[0].data.nodes["leaf-verbs"]);

// Check that mistake was recorded
assert.ok(prep.progressDocs[0].data.mistakes["q2"]);

// 6. Clear local progress
await clearLocalProgress(storage, uid, [questId]);
const cleared = await prepareLocalProgressUpload(storage, uid, [questId]);
assert.equal(cleared.attempts.length, 0);
assert.equal(cleared.progressDocs.length, 0);
const clearedStars = await getLocalStars(storage, uid);
assert.equal(clearedStars, 0);

console.log("localProgress tests passed cleanly");

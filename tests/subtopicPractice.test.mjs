// tests/subtopicPractice.test.mjs — "Work on these → Practise" finds the right questions, never test questions.
import assert from "node:assert/strict";
import { topicPractice, subtopicPractice, onlyTopic } from "../utils/subtopicPractice.js";
import { bundledQuest } from "../data/quests/index.js";

const quest = bundledQuest("english-quest");
const p = subtopicPractice(quest, "each-every-all");
assert.ok(p, "Each, Every & All has practice questions");
assert.ok(p.poolQuizIds.includes("eq-b3-determiners-quiz") && p.poolQuizIds.includes("eq-b3-determiners-board"));
assert.ok(!p.poolQuizIds.some((id) => /gate|test/.test(id)), "never gate/boss questions");
assert.equal(p.branchId, "eq-b3-determiners");
assert.equal(p.nodeId, "eq-b3-determiners-endless");
assert.equal(subtopicPractice(quest, "no-such-topic"), null);

// Every weak topic a kid can see must open a practice (all tagged sub-topics in non-test quizzes).
const tags = new Set();
quest.nodes.filter((n) => n.kind === "main" || n.kind === "practice").forEach((n) =>
  (n.steps || []).forEach((s) => s.quizId && (quest.quizzes[s.quizId] || []).forEach((q) => q.subtopic && tags.add(q.subtopic))));
for (const t of tags) assert.ok(subtopicPractice(quest, t), `practice for ${t}`);

const pool = [{ subtopic: "a" }, { subtopic: "b" }, { subtopic: "a" }];
assert.equal(onlyTopic(pool, "a").length, 2);
assert.equal(onlyTopic(pool, "zzz").length, 3, "nothing tagged: keep all");
assert.equal(onlyTopic(pool, null).length, 3);
// G91: check-up "Practise this" → one topic's quizzes (main + practice), never gate/boss.
{
  const eq = bundledQuest("english-quest");
  const tp = topicPractice(eq, "eq-b1-cont");
  assert.ok(tp && tp.poolQuizIds.length >= 1 && tp.branchId === "eq-b1-cont");
  const kinds = new Set(eq.nodes.filter((n) => n.steps?.some((st) => tp.poolQuizIds.includes(st.quizId))).map((n) => n.kind));
  assert.ok(!kinds.has("gate") && !kinds.has("boss"));
  assert.equal(topicPractice(eq, "nope"), null);
}
console.log(`subtopicPractice tests passed (${tags.size} topics)`);

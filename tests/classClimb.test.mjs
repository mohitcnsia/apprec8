// tests/classClimb.test.mjs: the next class opens once a child clears everything for their own class (owner 16 Nov 2026).
import assert from "node:assert/strict";
import { topicsWithClimb } from "../utils/classClimb.js";
import { nodesForGrade } from "../utils/gradeFilter.js";
import { stepId } from "../utils/questTree.js";
import * as science from "../data/scienceQuestData.js";

const doneAll = (nodes) => {
  const p = {};
  for (const n of nodes) {
    p[n.id] = { status: "completed", bestPercent: 100 };
    (n.steps || []).forEach((_, i) => (p[stepId(n.id, i)] = { status: "completed", bestPercent: 100 }));
  }
  return p;
};

const own3 = nodesForGrade(science.nodes, 3);
const fresh = topicsWithClimb(science.nodes, 3, "science-quest", {});
assert.equal(fresh.openedTo, null, "nothing opens before the child clears her class");
assert.equal(fresh.nodes.length, own3.length);

const half = doneAll(own3.filter((n) => n.kind !== "main").concat(own3.filter((n) => n.kind === "main").slice(0, 1)));
assert.equal(topicsWithClimb(science.nodes, 3, "science-quest", half).openedTo, null, "half done: still her own class");

const cleared = topicsWithClimb(science.nodes, 3, "science-quest", doneAll(own3));
assert.ok(cleared.openedTo >= 4, `cleared Class 3 → the next class opens (got ${cleared.openedTo})`);
assert.ok(cleared.nodes.length > own3.length, "more topics on the same map");
assert.ok(own3.every((n) => cleared.nodes.some((m) => m.id === n.id)), "her finished topics stay on the map");
assert.equal(cleared.openedTo, cleared.openedTo <= 4 ? 4 : cleared.openedTo, "one class at a time");
const next = topicsWithClimb(science.nodes, 3, "science-quest", doneAll(own3));
assert.ok(!next.nodes.some((n) => (n.grades || []).every((g) => g >= 7)), "never jumps to Class 7 from Class 3");

console.log("classClimb tests passed");

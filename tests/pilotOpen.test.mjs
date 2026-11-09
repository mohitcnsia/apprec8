import assert from "node:assert/strict";
import { isPilotOpen } from "../utils/pilotOpen.js";
import { buildQuestPath } from "../utils/questTree.js";
import { bundledQuest } from "../data/quests/index.js";
import { nodesForGrade } from "../utils/gradeFilter.js";

assert.equal(isPilotOpen([]), false);
assert.equal(isPilotOpen([{ pilotUnlockAll: false }, null]), false);
assert.equal(isPilotOpen([{}, { pilotUnlockAll: true }]), true);
assert.equal(isPilotOpen(undefined), false);

// A Class 10 pilot kid with no progress: grade-filtered topics, none locked.
const q = bundledQuest("english-quest");
const nodes = nodesForGrade(q.nodes, 10);
const closed = buildQuestPath(nodes, {}, {});
const open = buildQuestPath(nodes, {}, { unlockAll: true });
const locked = (t) => t.path.filter((n) => n.status === "locked").length;
assert.ok(locked(closed) > 0, "without the flag some topics are locked");
assert.equal(locked(open), 0, "with the flag nothing is locked");
console.log(`pilotOpen tests passed (${locked(closed)} locked → 0)`);

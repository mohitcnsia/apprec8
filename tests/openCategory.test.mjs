// Tests for utils/openCategory.js (where a tile tap goes). Run: npm test
import assert from "node:assert/strict";
import { openCategory } from "../utils/openCategory.js";

const nav = () => { const calls = []; return { calls, navigate: (n, p) => calls.push(["navigate", n, p]), push: (n, p) => calls.push(["push", n, p]) }; };
// 12 Nov walk: a teacher's course that is a tile quest opens the quest, not the old category screen.
let n = nav(); openCategory(n, { id: "course-seema-c10-english", type: "COURSE", questId: "course-seema-c10-english", title: "Seema Ma'am" });
assert.deepEqual(n.calls[0], ["navigate", "EnglishQuestIntro", { questId: "course-seema-c10-english" }]);
// An old course (no questId) keeps the old screen.
n = nav(); openCategory(n, { id: "old1", type: "COURSE", title: "Old" });
assert.equal(n.calls[0][1], "LinkScreen");
n = nav(); openCategory(n, { id: "english-quest", type: "QUEST" });
assert.deepEqual(n.calls[0], ["navigate", "EnglishQuestIntro", { questId: "english-quest" }]);
console.log("openCategory tests passed");

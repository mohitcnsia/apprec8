// tests/questNodesSnapshot.test.mjs: the server's quest topic list must match the app's quest data, or teachers see
// wrong "done" counts (G119 review). Fix a failure with: node scripts/genQuestNodes.mjs
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { snapshot } from "../scripts/genQuestNodes.mjs";
const require = createRequire(import.meta.url);
const { NODES_BY_QUEST } = require("../functions/utils/bundledQuestNodes.js");
assert.deepEqual(NODES_BY_QUEST, snapshot(), "functions/utils/bundledQuestNodes.js is stale: run node scripts/genQuestNodes.mjs");
console.log("questNodesSnapshot: server topic list matches the app's quests");

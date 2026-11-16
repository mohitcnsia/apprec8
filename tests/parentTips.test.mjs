import assert from "node:assert/strict";
import { PARENT_TIPS, tipForDay } from "../data/parentTips.js";
assert.ok(PARENT_TIPS.length >= 30, "a month of tips");
assert.equal(new Set(PARENT_TIPS).size, PARENT_TIPS.length, "no repeats");
for (const t of PARENT_TIPS) {
  assert.ok(t.length <= 110, `short enough for a card: ${t}`);
  assert.ok(!/\b(medicine|doctor|disorder|diagnos|therapy|ADHD|depress|anxiety|rank|topper)\b/i.test(t), `no medical/psych/exam claims: ${t}`);
}
assert.equal(tipForDay(0), PARENT_TIPS[0]);
assert.equal(tipForDay(PARENT_TIPS.length), PARENT_TIPS[0], "cycles");
assert.equal(typeof tipForDay(-1), "string");
console.log("parentTips tests passed");

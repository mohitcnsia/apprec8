// Tests for utils/breakPrompt.js ("Take a breath?" during practice). Run: npm test
import assert from "node:assert/strict";
import { newBreakState, recordBreakAnswer, breakReason, markOffered } from "../utils/breakPrompt.js";

const MIN = 60 * 1000;
let s = newBreakState();
let t = 1_000_000;
s = recordBreakAnswer(s, false, t);
s = recordBreakAnswer(s, false, (t += 20000));
assert.equal(breakReason(s, { now: t }), null, "2 wrong is fine");
s = recordBreakAnswer(s, false, (t += 20000));
assert.equal(breakReason(s, { now: t }), "hard", "3 wrong in a row");
assert.equal(breakReason(s, { now: t, mode: "exam" }), null, "never in Exam mode");
s = markOffered(s, t);
s = recordBreakAnswer(s, false, (t += 20000));
s = recordBreakAnswer(s, false, (t += 20000));
s = recordBreakAnswer(s, false, (t += 20000));
assert.equal(breakReason(s, { now: t }), null, "at most once every 30 minutes");

// A right answer resets the streak.
let r = newBreakState();
r = recordBreakAnswer(r, false, 0);
r = recordBreakAnswer(r, false, 1000);
r = recordBreakAnswer(r, true, 2000);
r = recordBreakAnswer(r, false, 3000);
assert.equal(breakReason(r, { now: 3000 }), null);

// Long session: 20 minutes of steady answers → "long"; a 10-minute gap starts over.
let l = newBreakState();
for (let i = 0; i <= 21; i++) l = recordBreakAnswer(l, true, i * MIN);
assert.equal(breakReason(l, { now: 21 * MIN }), "long");
let g = newBreakState();
g = recordBreakAnswer(g, true, 0);
g = recordBreakAnswer(g, true, 15 * MIN); // gap: new session
assert.equal(breakReason(g, { now: 15 * MIN }), null);

console.log("breakPrompt tests passed");

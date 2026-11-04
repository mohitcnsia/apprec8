import assert from "node:assert/strict";
import { newSession, sessionStatus, durationLabel } from "../utils/playSession.js";

const s = newSession({ childUid: "k", childName: " Pratha ", minutes: 30, locked: true, now: 1000 });
assert.deepEqual(s, { childUid: "k", childName: "Pratha", minutes: 30, locked: true, startedAt: 1000 });
// Only for the child it was started for
assert.equal(sessionStatus(s, { uid: "parent", now: 2000 }).active, false);
assert.deepEqual(sessionStatus(s, { uid: "k", now: 1000 + 10 * 60000 }), { active: true, timeUp: false, minutesLeft: 20 });
assert.deepEqual(sessionStatus(s, { uid: "k", now: 1000 + 30 * 60000 }), { active: true, timeUp: true, minutesLeft: 0 });
// No limit never runs out; odd durations become "no limit"
const free = newSession({ childUid: "k", minutes: 999 });
assert.equal(free.minutes, null);
assert.deepEqual(sessionStatus(free, { uid: "k", now: Date.now() + 1e9 }), { active: true, timeUp: false, minutesLeft: null });
assert.equal(newSession({ childUid: "k" }).childName, "your child");
assert.throws(() => newSession({}));
assert.equal(durationLabel(15), "15 min");
assert.equal(durationLabel(null), "No limit");
assert.equal(sessionStatus(null, { uid: "k" }).active, false);
console.log("playSession tests passed");

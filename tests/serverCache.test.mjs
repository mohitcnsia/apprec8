// tests/serverCache.test.mjs — leaderboard cost guard (functions/utils/serverCache.js)
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { isFreshCache, clampTopN, cachedResult } = require("../functions/utils/serverCache.js");

const MIN = 60 * 1000;
const now = 1_800_000_000_000;

// isFreshCache
assert.equal(isFreshCache(null, { now, maxAgeMs: 10 * MIN }), false);
assert.equal(isFreshCache({ at: now - 5 * MIN, key: null, value: [] }, { now, maxAgeMs: 10 * MIN }), true);
assert.equal(isFreshCache({ at: now - 11 * MIN, key: null, value: [] }, { now, maxAgeMs: 10 * MIN }), false);
assert.equal(isFreshCache({ at: now - MIN, key: "2026-W44", value: [] }, { now, maxAgeMs: 10 * MIN, key: "2026-W45" }), false, "new week → recompute");
assert.equal(isFreshCache({ at: now - MIN, key: "2026-W45", value: [] }, { now, maxAgeMs: 10 * MIN, key: "2026-W45" }), true);
assert.equal(isFreshCache({ at: now + MIN, key: null, value: [] }, { now, maxAgeMs: 10 * MIN }), false, "clock skew → recompute");
assert.equal(isFreshCache({ at: now, key: null }, { now, maxAgeMs: 10 * MIN }), false, "no value");

// clampTopN
assert.equal(clampTopN(20), 20);
assert.equal(clampTopN(1e9), 50);
assert.equal(clampTopN(-3), 10);
assert.equal(clampTopN("abc"), 10);
assert.equal(clampTopN(undefined), 10);

// cachedResult with a fake doc ref
function fakeRef() {
  let stored = null;
  return {
    path: "x/y",
    sets: 0,
    async get() { return { exists: !!stored, data: () => stored }; },
    async set(v) { this.sets++; stored = v; },
  };
}
const ref = fakeRef();
let computes = 0;
const compute = async () => { computes++; return ["board"]; };
assert.deepEqual(await cachedResult(ref, { now }, compute), ["board"]);
assert.deepEqual(await cachedResult(ref, { now: now + 5 * MIN }, compute), ["board"]);
assert.equal(computes, 1, "second call within 10 min uses the saved board");
await cachedResult(ref, { now: now + 11 * MIN }, compute);
assert.equal(computes, 2, "after 10 min it recomputes");

// a failed save still returns the value
const bad = { path: "b", async get() { return { exists: false }; }, async set() { throw new Error("denied"); } };
assert.deepEqual(await cachedResult(bad, { now }, compute), ["board"]);

console.log("serverCache tests passed");

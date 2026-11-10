// tests/ttlCache.test.mjs: Progress tabs read each child once per 10 minutes (owner, 2026-11-10).
import assert from "node:assert/strict";
import { makeTtlCache } from "../utils/ttlCache.js";

const c = makeTtlCache({ freshMs: 1000 });
let reads = 0;
const fetch = async () => ++reads;
assert.equal(await c.get("k", fetch, { now: 0 }), 1);
assert.equal(await c.get("k", fetch, { now: 500 }), 1, "fresh: no second read");
assert.equal(reads, 1);
assert.equal(await c.get("k", fetch, { now: 1500 }), 2, "old: read again");
assert.equal(await c.get("k", fetch, { now: 1600, force: true }), 3, "pull to refresh: always read");
assert.equal(c.peek("k"), 3);
assert.equal(c.peek("none"), undefined);
// Two screens asking at the same moment share one read.
reads = 0;
const c2 = makeTtlCache();
const [a, b] = await Promise.all([c2.get("x", fetch), c2.get("x", fetch)]);
assert.equal(reads, 1);
assert.equal(a, b);
// A failed read is not cached.
const c3 = makeTtlCache();
await assert.rejects(c3.get("e", async () => { throw new Error("offline"); }));
assert.equal(c3.peek("e"), undefined);
console.log("ttlCache tests passed!");

// Tests for utils/people.js (People screen filters and dates). Run: npm test
import assert from "node:assert/strict";
import { filterPeople, whenText } from "../utils/people.js";

const now = Date.parse("2026-11-13T10:00:00Z"); // 3:30 pm India time
const people = [
  { uid: "a", name: "Kunal", email: "pus@gmail.com", joinedAt: now - 3600e3, stuck: false },
  { uid: "b", name: "Seema", email: "josh@gmail.com", joinedAt: now - 4 * 864e5, stuck: true },
  { uid: "c", name: null, email: "abhi@gmail.com", joinedAt: now - 864e5, stuck: true },
];
assert.deepEqual(filterPeople(people, { tab: "new", now }).map((p) => p.uid), ["a"]);
assert.deepEqual(filterPeople(people, { tab: "stuck", now }).map((p) => p.uid), ["b", "c"]);
assert.deepEqual(filterPeople(people, { query: "JOSH", now }).map((p) => p.uid), ["b"], "email search, any case");
assert.deepEqual(filterPeople(people, { query: "abhi", tab: "stuck", now }).map((p) => p.uid), ["c"]);
assert.ok(whenText(now - 3600e3, now).startsWith("today "));
assert.ok(whenText(now - 864e5, now).startsWith("yesterday "));
assert.ok(/2026/.test(whenText(now - 4 * 864e5, now)), "older: with the year");
assert.equal(whenText(null, now), "—");
console.log("peopleView tests passed");

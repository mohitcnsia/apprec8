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
assert.deepEqual(filterPeople(people, { tab: "stuck", now }).map((p) => p.uid), ["c", "b"], "newest first");
assert.deepEqual(filterPeople(people, { query: "JOSH", now }).map((p) => p.uid), ["b"], "email search, any case");
assert.deepEqual(filterPeople(people, { query: "abhi", tab: "stuck", now }).map((p) => p.uid), ["c"]);
assert.ok(whenText(now - 3600e3, now).startsWith("today "));
assert.ok(whenText(now - 864e5, now).startsWith("yesterday "));
assert.ok(/2026/.test(whenText(now - 4 * 864e5, now)), "older: with the year");
assert.equal(whenText(null, now), "—");
console.log("peopleView tests passed");

// 13 Nov walk: Play robots and 2025 accounts were counted as stuck.
{
  const { shapePerson, peopleCounts, isPlayRobot } = await import("../utils/people.js");
  const robot = shapePerson({ kind: "none", email: "jeffflowers.93150@gmail.com", joinedAt: now - 864e5, quizzes: 0 }, now);
  assert.equal(robot.robot, true); assert.equal(robot.stuck, false); assert.equal(robot.kind, "robot");
  assert.equal(isPlayRobot({ kind: "none", email: "seemachilkoti@gmail.com" }), false);
  assert.equal(isPlayRobot({ kind: "student", email: "jeffflowers.93150@gmail.com" }), false, "a real student is never a robot");
  const old = shapePerson({ kind: "none", email: "old@gmail.com", joinedAt: now - 200 * 864e5, quizzes: 0 }, now);
  assert.equal(old.stuck, false, "2025 accounts are not 'stuck'");
  const joshi = shapePerson({ kind: "none", email: "josh@gmail.com", joinedAt: now - 4 * 864e5, quizzes: 0 }, now);
  assert.equal(joshi.stuck, true);
  const played = shapePerson({ kind: "none", email: "p@gmail.com", joinedAt: now - 4 * 864e5, quizzes: 3 }, now);
  assert.equal(played.stuck, false, "someone learning is not stuck");
  assert.deepEqual(peopleCounts([robot, old, joshi, played], now), { total: 3, newToday: 0, stuck: 1, robots: 1, tests: 0 });
  const t = shapePerson({ kind: "none", email: "claude.parenttest.1109@example.com", joinedAt: now - 4 * 864e5, quizzes: 0 }, now);
  assert.deepEqual([t.kind, t.stuck], ["test", false], "our own test accounts are not stuck people");
  assert.deepEqual(filterPeople([robot, joshi], { tab: "stuck", now }).map((p) => p.email), ["josh@gmail.com"]);
  console.log("peopleView: robots and old accounts ok");
}

// Contact buttons for stuck people (owner, 13 Nov).
{
  const { nudgeMessage, whatsappNudgeUrl, emailNudgeUrl } = await import("../utils/people.js");
  assert.ok(nudgeMessage({ name: "Khushboo" }).startsWith("Namaste Khushboo!"));
  assert.ok(nudgeMessage({}).startsWith("Namaste! "));
  assert.ok(nudgeMessage({}).includes('"Join your class"'));
  assert.ok(whatsappNudgeUrl({ name: "Lokendra" }).startsWith("https://wa.me/?text=Namaste%20Lokendra"), "no number: owner picks the contact");
  assert.ok(emailNudgeUrl({ email: "a@b.com" }).startsWith("mailto:a@b.com?subject="));
  assert.equal(emailNudgeUrl({ email: null }), null);
  console.log("peopleView: contact buttons ok");
}

// Hide bots + sort (owner, 13 Nov: "All shows 125 people ... filter bots and sort by date").
{
  const ppl = [
    { uid: "r", robot: true, kind: "robot", joinedAt: now - 1000, lastSeenAt: now - 1000 },
    { uid: "old", joinedAt: now - 9 * 864e5, lastSeenAt: now - 60e3 },
    { uid: "new", joinedAt: now - 3600e3, lastSeenAt: now - 5 * 864e5 },
  ];
  assert.deepEqual(filterPeople(ppl, { now }).map((p) => p.uid), ["new", "old"], "All hides bots, newest first");
  assert.deepEqual(filterPeople(ppl, { now, showBots: true }).map((p) => p.uid), ["r", "new", "old"]);
  assert.deepEqual(filterPeople(ppl, { now, sort: "oldest" }).map((p) => p.uid), ["old", "new"]);
  assert.deepEqual(filterPeople(ppl, { now, sort: "seen" }).map((p) => p.uid), ["old", "new"]);
  console.log("peopleView: hide bots + sort ok");
}

// Who is who (owner, 13 Nov: "kids say they joined but are not in the app").
{
  const ppl = [
    { uid: "kunal", kind: "student", classes: [], waiting: [], joinedAt: now - 3 },
    { uid: "aar", kind: "student", classes: [], waiting: ["10-A"], joinedAt: now - 2 },
    { uid: "riya", kind: "child", classes: ["5-A"], waiting: [], joinedAt: now - 1 },
    { uid: "sunita", kind: "parent", classes: [], waiting: [], joinedAt: now - 4 },
    { uid: "seema", kind: "teacher", classes: [], waiting: [], joinedAt: now - 5 },
  ];
  const ids = (show) => filterPeople(ppl, { now, show }).map((p) => p.uid).sort().join(",");
  assert.equal(ids("noclass"), "kunal");
  assert.equal(ids("waiting"), "aar");
  assert.equal(ids("students"), "aar,kunal,riya");
  assert.equal(ids("parents"), "sunita");
  assert.equal(ids("teachers"), "seema");
  assert.equal(ids("everyone"), "aar,kunal,riya,seema,sunita");
  console.log("peopleView: show filters ok");
}

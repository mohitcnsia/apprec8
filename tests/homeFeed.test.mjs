// Tests for utils/homeFeed.js (Home screen helpers). Run: npm test
import assert from "node:assert/strict";
import { greeting, dayStreak, daysUntil, shortDate, toDateKey, upcomingItems } from "../utils/homeFeed.js";
import { dayKey } from "../utils/kidStats.js";

const DAY = 24 * 60 * 60 * 1000;
const now = new Date(2026, 10, 4, 9, 30).getTime(); // Wed 4 Nov 2026, 09:30 local

// greeting
assert.equal(greeting(new Date(2026, 10, 4, 8).getTime()), "Good morning");
assert.equal(greeting(new Date(2026, 10, 4, 14).getTime()), "Good afternoon");
assert.equal(greeting(new Date(2026, 10, 4, 20).getTime()), "Good evening");

// dayStreak: today + 2 days before = 3; a gap stops it
const daily = {
  [dayKey(now)]: { answered: 5 },
  [dayKey(now - DAY)]: { answered: 2 },
  [dayKey(now - 2 * DAY)]: { answered: 1 },
  [dayKey(now - 4 * DAY)]: { answered: 9 },
};
assert.equal(dayStreak(daily, now), 3);
// not played yet today: streak still counts from yesterday
const noToday = { ...daily };
delete noToday[dayKey(now)];
assert.equal(dayStreak(noToday, now), 2);
// days with 0 answers don't count
assert.equal(dayStreak({ [dayKey(now)]: { answered: 0 } }, now), 0);
assert.equal(dayStreak(undefined, now), 0);

// daysUntil / shortDate
assert.equal(daysUntil("2026-11-04", now), 0);
assert.equal(daysUntil("2026-11-17", now), 13);
assert.equal(daysUntil("2026-11-03", now), -1);
assert.ok(Number.isNaN(daysUntil("bad", now)));
assert.equal(shortDate("2026-11-17"), "Tue 17 Nov");

// toDateKey accepts Firestore Timestamps, {seconds}, Date, ms, ISO
const ms = new Date(2026, 10, 8, 12).getTime();
assert.equal(toDateKey({ toMillis: () => ms }), "2026-11-08");
assert.equal(toDateKey({ seconds: ms / 1000 }), "2026-11-08");
assert.equal(toDateKey(new Date(ms)), "2026-11-08");
assert.equal(toDateKey(ms), "2026-11-08");
assert.equal(toDateKey(null), null);
assert.equal(toDateKey("nonsense"), null);

// upcomingItems: soonest first, past and completed dropped, max 3
const exams = [
  { id: "ieo", tag: "IEO", title: "English Olympiad", date: "2026-11-17" },
  { id: "nso", tag: "NSO", title: "Science Olympiad", date: "2026-11-19" },
  { id: "old", tag: "OLD", title: "Past exam", date: "2026-10-01" },
];
const tasks = [
  { id: "t1", title: "Science project", dueDate: { toMillis: () => ms }, completed: false },
  { id: "t2", title: "Done already", dueDate: { toMillis: () => ms }, completed: true },
  { id: "t3", title: "Late", dueDate: { toMillis: () => now - 3 * DAY }, completed: false },
  { id: "t4", title: "No date" },
  { id: "t5", title: "Today", dueDate: now, completed: false },
];
const items = upcomingItems(exams, tasks, now);
assert.deepEqual(items.map((i) => i.title), ["Today", "Science project", "English Olympiad"]);
assert.equal(items[0].unit, "TODAY");
assert.equal(items[1].days, 4);
assert.equal(items[1].sub, "Your reminder · Sun 8 Nov");
assert.equal(items[2].sub, "Tue 17 Nov");
assert.equal(upcomingItems(exams, [], now).length, 2);
assert.equal(upcomingItems([], [], now).length, 0);
// one day left says DAY
assert.equal(upcomingItems([{ id: "x", tag: "X", title: "X", date: "2026-11-05" }], [], now)[0].unit, "DAY");

console.log("homeFeed tests passed");

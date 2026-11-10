// tests/refreshSlots.test.mjs: parents/teachers read fresh twice a day; kids' board hourly (owner, 2026-11-10).
import assert from "node:assert/strict";
import { lastSlot, nextSlot, isFreshBySlot, nextHour, clockText, updatedText, nextUpdateText } from "../utils/refreshSlots.js";

const at = (d, h, m = 0) => new Date(2026, 10, d, h, m).getTime(); // Nov 2026, phone's local time

assert.equal(lastSlot(at(10, 20, 0)), at(10, 19, 30), "evening: tonight's 7:30 pm");
assert.equal(lastSlot(at(10, 12, 0)), at(10, 7, 30), "midday: this morning");
assert.equal(lastSlot(at(10, 6, 0)), at(9, 19, 30), "before 7:30 am: last night");
assert.equal(lastSlot(at(10, 7, 30)), at(10, 7, 30), "exactly at the slot");
assert.equal(nextSlot(at(10, 20, 0)), at(11, 7, 30), "after 7:30 pm: tomorrow morning");
assert.equal(nextSlot(at(10, 12, 0)), at(10, 19, 30));

assert.equal(isFreshBySlot(at(10, 8, 0), at(10, 19, 0)), true, "read at 8 am, still fresh at 7 pm");
assert.equal(isFreshBySlot(at(10, 8, 0), at(10, 19, 31)), false, "7:30 pm passed: read again");
assert.equal(isFreshBySlot(at(9, 21, 0), at(10, 7, 0)), true, "late-night read lasts till 7:30 am");
assert.equal(isFreshBySlot(undefined, at(10, 9)), false, "never read");
assert.equal(isFreshBySlot(at(10, 23), at(10, 9)), false, "a future time (clock changed) is not trusted");

assert.equal(nextHour(at(10, 17, 42)), at(10, 18, 0));
assert.equal(nextHour(at(10, 23, 5)), at(11, 0, 0), "rolls over midnight");

assert.equal(clockText(at(10, 7, 30)), "7:30 am");
assert.equal(clockText(at(10, 21, 0)), "9 pm");
assert.equal(clockText(at(10, 0, 5)), "12:05 am");
assert.equal(clockText(at(10, 12, 0)), "12 pm");

assert.equal(updatedText(at(10, 20, 5), at(10, 21)), "Updated 8:05 pm");
assert.equal(updatedText(at(9, 19, 40), at(10, 7)), "Updated yesterday 7:40 pm");
assert.equal(updatedText(at(3, 9), at(10, 7)), "Updated 3 Nov");
assert.equal(updatedText(undefined), "");
assert.equal(updatedText(at(10, 20, 5), at(10, 21), "hi"), "अपडेट 8:05 pm");

assert.equal(nextUpdateText(at(10, 21), at(10, 20, 10)), "Keep practising! Next update at 9 pm");
assert.equal(nextUpdateText(at(10, 21), at(10, 20, 55)), "Keep practising! Next update in 5 minutes");
assert.equal(nextUpdateText(at(10, 21), at(10, 20, 59, 30)), "Keep practising! Next update in a minute");

console.log("refreshSlots tests passed");

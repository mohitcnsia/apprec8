// Tests for utils/reminders.js. Run: npm test
import assert from "node:assert/strict";
import { activeReminders, canAddReminder, MAX_REMINDERS } from "../utils/reminders.js";

const mine = (n, extra = {}) => Array.from({ length: n }, (_, i) => ({ id: `t${i}`, userId: "kid", completed: false, ...extra }));
assert.equal(MAX_REMINDERS, 5);
assert.equal(activeReminders(mine(3), "kid"), 3);
assert.equal(activeReminders([...mine(3), ...mine(4, { completed: true })], "kid"), 3); // done ones don't count
assert.equal(activeReminders([...mine(2), { id: "x", userId: "other", completed: false }], "kid"), 2); // others' don't count
assert.equal(canAddReminder(mine(4), "kid"), true);
assert.equal(canAddReminder(mine(5), "kid"), false);
assert.equal(canAddReminder(mine(5), "kid", { isAdmin: true }), true);
assert.equal(canAddReminder(undefined, "kid"), true);
console.log("reminders tests passed");

// tests/pendingPush.test.mjs
// Tests for functions/utils/pendingPush.js (G84).

import assert from "node:assert/strict";
import {
  TEN_MINUTES_MS,
  canSendPush,
  teacherWaitingMessage,
  studentWaitingMessage,
} from "../functions/utils/pendingPush.js";

// 1. Rate limiting throttle window (10 minutes)
assert.equal(TEN_MINUTES_MS, 600000);

const baseTime = 1000000;
// First push (no previous push): allowed
assert.deepEqual(canSendPush(null, baseTime), { allowed: true, remainingMs: 0 });
assert.deepEqual(canSendPush(undefined, baseTime), { allowed: true, remainingMs: 0 });

// Immediate subsequent push (after 1 minute): throttled
assert.deepEqual(canSendPush(baseTime, baseTime + 60000), { allowed: false, remainingMs: 540000 });

// Subsequent push after 9.9 minutes: throttled
assert.deepEqual(canSendPush(baseTime, baseTime + 599000), { allowed: false, remainingMs: 1000 });

// Subsequent push after 10 minutes: allowed
assert.deepEqual(canSendPush(baseTime, baseTime + 600000), { allowed: true, remainingMs: 0 });

// Subsequent push after 15 minutes: allowed
assert.deepEqual(canSendPush(baseTime, baseTime + 900000), { allowed: true, remainingMs: 0 });

// 2. Teacher waiting message formatting
{
  const msg1 = teacherWaitingMessage({ teacherName: "Seema", className: "10-A", count: 1 });
  assert.equal(msg1.title, "Apprec8: Teacher waiting");
  assert.equal(msg1.body, "Seema waiting to join 10-A · Approve");

  const msg2 = teacherWaitingMessage({ teacherName: "Seema", className: "10-A", count: 3 });
  assert.equal(msg2.body, "Seema + 2 new waiting to join 10-A · Approve");

  const msgDefault = teacherWaitingMessage({});
  assert.equal(msgDefault.body, "A teacher waiting to join your class · Approve");
}

// 3. Student waiting message formatting
{
  const msg1 = studentWaitingMessage({ studentName: "Riya", className: "5-B", count: 1 });
  assert.equal(msg1.title, "Apprec8: Student waiting");
  assert.equal(msg1.body, "Riya wants to join 5-B · Approve");

  const msg2 = studentWaitingMessage({ studentName: "Riya", className: "5-B", count: 4 });
  assert.equal(msg2.body, "Riya + 3 new waiting to join 5-B · Approve");

  const msgDefault = studentWaitingMessage({});
  assert.equal(msgDefault.body, "A student wants to join your class · Approve");
}

console.log("pendingPush tests passed!");

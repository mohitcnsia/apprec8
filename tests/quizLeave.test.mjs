// tests/quizLeave.test.mjs — the "Leave this quiz?" popup shows only when something would be lost.
import assert from "node:assert/strict";
import { shouldConfirmLeave, leaveMessage } from "../utils/quizLeave.js";

assert.equal(shouldConfirmLeave({ status: "answering", currentIndex: 0 }), false, "nothing answered yet");
assert.equal(shouldConfirmLeave({ status: "reviewing", currentIndex: 0 }), true, "first answer given");
assert.equal(shouldConfirmLeave({ status: "answering", currentIndex: 3 }), true);
for (const s of ["loading", "ready", "error", "finished", "failed"]) {
  assert.equal(shouldConfirmLeave({ status: s, currentIndex: 5 }), false, `${s}: leave freely`);
}
assert.equal(leaveMessage({ currentIndex: 3, total: 10, status: "answering" }), "You've answered 3 of 10. If you leave now, you'll start this quiz again next time.");
assert.match(leaveMessage({ currentIndex: 0, total: 10, status: "reviewing" }), /answered 1 of 10/);
console.log("quizLeave tests passed");

// tests/dialogButtons.test.mjs — app popup button rules (utils/dialogButtons.js)
import assert from "node:assert/strict";
import { dialogLayout, dismissButton, looksDestructive } from "../utils/dialogButtons.js";

assert.deepEqual(dialogLayout().map((b) => [b.text, b.role]), [["OK", "primary"]]);
// normal: last non-cancel is big
assert.deepEqual(
  dialogLayout([{ text: "Not now", style: "cancel" }, { text: "Go to Challenge" }]).map((b) => [b.text, b.role]),
  [["Go to Challenge", "primary"], ["Not now", "quiet"]]
);
// destructive: the safe choice is big, destructive is red
assert.deepEqual(
  dialogLayout([{ text: "Stay", style: "cancel" }, { text: "Leave", style: "destructive" }]).map((b) => [b.text, b.role]),
  [["Stay", "primary"], ["Leave", "danger"]]
);
assert.deepEqual(dialogLayout([{ text: "Delete", style: "destructive" }, { text: "Keep" }]).map((b) => b.role), ["primary", "danger"]);
assert.equal(dialogLayout([null, { text: "OK" }]).length, 1);
// back / outside
assert.equal(dismissButton([{ text: "Go back", style: "cancel" }, { text: "Submit" }]).text, "Go back");
assert.equal(dismissButton([{ text: "OK" }]).text, "OK");
assert.equal(dismissButton([{ text: "A" }, { text: "B" }]), null);
assert.equal(looksDestructive("Delete"), true);
assert.equal(looksDestructive("Sign out"), true);
assert.equal(looksDestructive("Confirm"), false);
console.log("dialogButtons tests passed");

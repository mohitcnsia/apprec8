// tests/helplines.test.mjs — the "Need help?" numbers must never change by accident (data/helplines.js)
import assert from "node:assert/strict";
import { HELPLINES, HELP_TEXT } from "../data/helplines.js";

const by = Object.fromEntries(HELPLINES.map((h) => [h.id, h]));
assert.equal(by.childline.number, "1098");
assert.equal(by.telemanas.number, "14416");
assert.equal(by.emergency.number, "112");
assert.equal(by.emergency.call, false, "no call button for 112 (children)");
assert.ok(HELP_TEXT.privacy.includes("not saved") || HELP_TEXT.privacy.includes("saved or shown"), "privacy line present");
console.log("helplines tests passed");

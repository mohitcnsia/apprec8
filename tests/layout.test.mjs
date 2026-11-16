import assert from "node:assert/strict";
import { columnStyle, contentWidth, isTablet } from "../utils/layout.js";
assert.equal(columnStyle(390), null, "phones unchanged");
assert.equal(contentWidth(390), 390);
assert.ok(isTablet(800) && columnStyle(800).maxWidth === 640, "10-inch tablet: centred 640 column");
assert.equal(contentWidth(1280), 640);
console.log("layout tests passed");

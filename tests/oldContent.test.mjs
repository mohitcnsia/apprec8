// tests/oldContent.test.mjs — old content hidden for everyone except the owner (utils/oldContent.js)
import assert from "node:assert/strict";
import { visibleOldTiles, showOldSpace } from "../utils/oldContent.js";

const tiles = [{ title: "IEO" }, { title: "Dog Quiz" }, { title: "Animal Kingdom" }, { title: "Biographies" }];
assert.equal(visibleOldTiles(tiles, { isAdmin: true }).length, 4, "owner sees all");
assert.deepEqual(visibleOldTiles(tiles), [], "others see none, dogs and animals included");
assert.equal(showOldSpace({}), false);
assert.equal(showOldSpace({ isAdmin: true }), true);
console.log("oldContent tests passed");

// tests/oldContent.test.mjs — old content hidden except favourites (utils/oldContent.js)
import assert from "node:assert/strict";
import { visibleOldTiles, showOldSpace } from "../utils/oldContent.js";

const tiles = [{ title: "IEO" }, { title: "Dog Quiz" }, { title: "Animal Kingdom" }, { title: "Biographies" }, { title: "Facts", subtitle: "German Shepherds" }, { title: "Dogmatic" }];
assert.deepEqual(visibleOldTiles(tiles, { isAdmin: true }).length, 6, "owner sees all");
assert.deepEqual(visibleOldTiles(tiles).map((t) => t.title), ["Dog Quiz", "Animal Kingdom", "Facts"], "others: favourites only");
assert.equal(showOldSpace({}), false);
assert.equal(showOldSpace({ isAdmin: true }), true);
console.log("oldContent tests passed");

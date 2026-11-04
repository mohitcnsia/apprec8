// Tests for utils/leaderName.js. Run: npm test
import assert from "node:assert/strict";
import { leaderName } from "../utils/leaderName.js";

assert.equal(leaderName({ firstName: "Pratha", lastName: "Chilkoti", grade: 5 }), "Pratha · Class 5");
assert.equal(leaderName({ firstName: "Pratha", lastName: "Chilkoti" }), "Pratha"); // no last name, ever
assert.equal(leaderName({ firstName: "Anna Maria", grade: 13 }), "Anna"); // first word only; bad class ignored
assert.equal(leaderName({ username: "riya.k@gmail.com" }), "riya.k"); // never the email domain
assert.equal(leaderName({ id: "abcdef" }), "Kid #abcd");
assert.equal(leaderName(null), "Kid");
console.log("leaderName tests passed");

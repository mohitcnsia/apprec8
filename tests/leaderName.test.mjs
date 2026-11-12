// Tests for utils/leaderName.js. Run: npm test
import assert from "node:assert/strict";
import { leaderName } from "../utils/leaderName.js";

assert.equal(leaderName({ firstName: "Pratha", lastName: "Chilkoti", grade: 5 }), "Pratha · Class 5");
assert.equal(leaderName({ firstName: "Pratha", lastName: "Chilkoti" }), "Pratha"); // no last name, ever
assert.equal(leaderName({ firstName: "Anna Maria", grade: 13 }), "Anna"); // first word only; bad class ignored
assert.equal(leaderName({ username: "riya.k@gmail.com" }), "Learner"); // never someone else's username (= start of their email)
assert.equal(leaderName({ username: "riya.k@gmail.com", isCurrentUser: true }), "riya.k"); // your own row only, never the domain
assert.equal(leaderName({ id: "abcdef" }), "Learner"); // no name: a plain word, not part of an id
assert.equal(leaderName(null), "Kid");
console.log("leaderName tests passed");

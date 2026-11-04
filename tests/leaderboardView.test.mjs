import assert from "node:assert/strict";
import { leaderboardView } from "../utils/leaderboardView.js";

const rows = [
  { id: "r", name: "Riya", points: 58, rank: 1 },
  { id: "a", name: "Aarav", points: 51, rank: 2 },
  { id: "i", name: "Ishita", points: 47, rank: 3 },
  { id: "p", name: "Pratha", points: 42, rank: 4 },
  { id: "k", name: "Kabir", points: 33, rank: 5 },
];

// Podium in 2nd, 1st, 3rd order; list skips the podium and me; my row has a "to pass" hint
let v = leaderboardView(rows, "p");
assert.deepEqual(v.podium.map((r) => r.name), ["Aarav", "Riya", "Ishita"]);
assert.deepEqual(v.list.map((r) => r.name), ["Kabir"]);
assert.equal(v.mine.rank, 4);
assert.equal(v.mine.hint, "6 more points to pass Ishita");

// On top
v = leaderboardView(rows, "r");
assert.equal(v.mine.hint, "You're on top. Amazing!");
// Tied with the kid ahead: 1 more
v = leaderboardView([{ id: "x", name: "X", points: 5, rank: 1 }, { id: "y", name: "Y", points: 5, rank: 2 }], "y", { unit: "stars" });
assert.equal(v.mine.hint, "1 more star to pass X");
// Not on the board: no row
assert.equal(leaderboardView(rows, "zzz").mine, null);
// Fewer than 3
assert.deepEqual(leaderboardView(rows.slice(0, 2), "a").podium.map((r) => r.name), ["Aarav", "Riya"]);
assert.deepEqual(leaderboardView([], "a"), { podium: [], list: [], mine: null });

console.log("leaderboardView tests passed");

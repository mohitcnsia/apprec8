// Tests for utils/chessPgn.js (paste-a-PGN upload, owner's chess trainer). Run: npm test
import assert from "node:assert/strict";
import { parsePastedPgn } from "../utils/chessPgn.js";

// A short real game pasted with tags, comments, a variation, NAGs and glued move numbers.
const GOOD = `
[Event "Test"]
[White "Greco"]
[Black "NN"]
[Result "1-0"]

{Scholar's mate pattern.} 1. e4 e5 2.Bc4 Nc6 3. Qh5 $2 Nf6?? ( 3... g6 4. Qf3 ) 4. Qxf7# {The classic trap.} 1-0
`;

const good = parsePastedPgn(GOOD);
assert.equal(good.ok, true, good.error);
const g = good.game;
assert.equal(g.white, "Greco");
assert.equal(g.result, "1-0");
assert.equal(g.guessSide, "White"); // winner by default
assert.equal(g.gameComment, "Scholar's mate pattern.");
assert.equal(g.moves.length, 7);
assert.equal(g.moves[2].san, "Bc4"); // glued "2.Bc4" parsed
assert.equal(g.moves[5].san, "Nf6"); // "Nf6??" accepted, marks stripped
assert.equal(g.moves[6].san, "Qxf7#");
assert.equal(g.moves[6].comment, "The classic trap.");
assert.equal(g.moves[6].uci, "h5f7");
// variation was dropped, not attached
assert.ok(!g.moves[4].variations && !g.moves[5].variations);
// every ply replayable by the app
for (const m of g.moves) {
  assert.ok(m.fenAfter && Array.isArray(m.legal) && m.legal.length > 0);
}
// final position: it is Black to move and mate
assert.ok(g.moves[6].fenAfter.includes(" b "));

// Black wins -> guess side defaults to Black; explicit tags win over defaults
const blackWin = parsePastedPgn(`[Result "0-1"]\n1. f3 e5 2. g4 Qh4# 0-1`);
assert.equal(blackWin.ok, true, blackWin.error);
assert.equal(blackWin.game.guessSide, "Black");
const tagged = parsePastedPgn(`[Result "0-1"]\n[GuessSide "White"]\n[GuessFrom "2"]\n1. f3 e5 2. g4 Qh4# 0-1`);
assert.equal(tagged.game.guessSide, "White");
assert.equal(tagged.game.guessFrom, 2);

// Illegal move is rejected with the move named, not a crash
const bad = parsePastedPgn(`1. e4 e5 2. Nf6 Nc6 3. d4 exd4`);
assert.equal(bad.ok, false);
assert.ok(bad.error.includes("2.Nf6"), bad.error);

// Empty / junk pastes get readable errors
assert.equal(parsePastedPgn("").ok, false);
assert.equal(parsePastedPgn("[Event \"x\"]").ok, false);
assert.equal(parsePastedPgn("1. e4 e5").ok, false); // too short to train on

console.log("chessPgn tests passed");

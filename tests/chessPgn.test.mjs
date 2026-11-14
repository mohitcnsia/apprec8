// Tests for utils/chessPgn.js (paste-a-PGN upload, owner's chess trainer). Run: npm test
import assert from "node:assert/strict";
import { parsePastedPgn, resolvePgnUrl, splitMultiPgn, fetchPgnFromUrl } from "../utils/chessPgn.js";

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

// Phone keyboards capitalise pawn moves after "1." — forgiven, since E/A/C/D/F/G/H are not pieces
const caps = parsePastedPgn(`1. E4 e5 2. Qh5 Nc6 3. Bc4 Nf6 4. Qxf7# 1-0`);
assert.equal(caps.ok, true, caps.error);
assert.equal(caps.game.moves[0].san, "e4");

// Empty / junk pastes get readable errors
assert.equal(parsePastedPgn("").ok, false);
assert.equal(parsePastedPgn("[Event \"x\"]").ok, false);
assert.equal(parsePastedPgn("1. e4 e5").ok, false); // too short to train on

// ---- URL resolution tests (G108)
// 1. lichess game: 8-char id exported cleanly
const lichess1 = resolvePgnUrl("https://lichess.org/x8f2Yy7B");
assert.equal(lichess1.ok, true);
assert.equal(lichess1.url, "https://lichess.org/game/export/x8f2Yy7B");

// 2. lichess game with trailing /white#12
const lichess2 = resolvePgnUrl("https://lichess.org/WnLwVv8F/black#25");
assert.equal(lichess2.ok, true);
assert.equal(lichess2.url, "https://lichess.org/game/export/WnLwVv8F");

// 3. lichess study chapter: https://lichess.org/study/{id}/{chapter}
const study = resolvePgnUrl("https://lichess.org/study/mK4yDq1A/4xKj5f3B");
assert.equal(study.ok, true);
assert.equal(study.url, "https://lichess.org/study/mK4yDq1A/4xKj5f3B.pgn");

// 4. chess.com: must inform user to copy PGN there
const chessCom = resolvePgnUrl("https://www.chess.com/game/live/105432198");
assert.equal(chessCom.ok, false);
assert.ok(chessCom.error.includes("chess.com: copy the PGN there"), chessCom.error);

// 5. direct .pgn link
const direct = resolvePgnUrl("https://www.pgnmentor.com/players/Tal.pgn");
assert.equal(direct.ok, true);
assert.equal(direct.url, "https://www.pgnmentor.com/players/Tal.pgn");

// 6. invalid or non-http links
assert.equal(resolvePgnUrl("").ok, false);
assert.equal(resolvePgnUrl("ftp://foo.bar/game.pgn").ok, false);

// ---- Multi-game split tests
const MULTI = `
[Event "Game 1"]
[Site "London"]
[Date "1851.06.21"]
[White "Anderssen, Adolf"]
[Black "Kieseritzky, Lionel"]
[Result "1-0"]

1. e4 e5 2. f4 exf4 3. Bc4 Qh4+ 4. Kf1 b5 1-0

[Event "Game 2"]
[Site "Paris"]
[Date "1858.??.??"]
[White "Morphy, Paul"]
[Black "Duke Karl"]
[Result "1-0"]

1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 1-0
`;

const splitGames = splitMultiPgn(MULTI);
assert.equal(splitGames.length, 2);
assert.equal(splitGames[0].white, "Anderssen, Adolf");
assert.equal(splitGames[0].black, "Kieseritzky, Lionel");
assert.ok(splitGames[0].title.includes("Anderssen, Adolf vs Kieseritzky, Lionel"));
assert.equal(splitGames[1].white, "Morphy, Paul");
assert.ok(splitGames[1].title.includes("Morphy, Paul vs Duke Karl"));

// ---- fetchPgnFromUrl mocked tests
const origFetch = globalThis.fetch;
try {
  // Test 1: Chess.com rejection
  const resChess = await fetchPgnFromUrl("https://www.chess.com/game/live/123");
  assert.equal(resChess.ok, false);
  assert.ok(resChess.error.includes("chess.com"));

  // Test 2: HTML error response
  globalThis.fetch = async () => ({
    ok: true,
    text: async () => "<!DOCTYPE html><html><body>Error</body></html>",
  });
  const resHtml = await fetchPgnFromUrl("https://example.com/not-a-pgn");
  assert.equal(resHtml.ok, false);
  assert.ok(resHtml.error.includes("web page, not a PGN"));

  // Test 3: 404 error
  globalThis.fetch = async () => ({
    ok: false,
    status: 404,
  });
  const res404 = await fetchPgnFromUrl("https://example.com/missing.pgn");
  assert.equal(res404.ok, false);
  assert.ok(res404.error.includes("status 404"));

  // Test 4: Single game valid fetch
  globalThis.fetch = async () => ({
    ok: true,
    text: async () => `[Event "Immortal"]\n[White "Anderssen"]\n[Black "Kieseritzky"]\n[Result "1-0"]\n\n1. e4 e5 2. f4 exf4 3. Bc4 Qh4+ 4. Kf1 b5 1-0`,
  });
  const resSingle = await fetchPgnFromUrl("https://lichess.org/x8f2Yy7B");
  assert.equal(resSingle.ok, true);
  assert.equal(resSingle.game.white, "Anderssen");

  // Test 5: Multi-game fetch returns multiple: true
  globalThis.fetch = async () => ({
    ok: true,
    text: async () => MULTI,
  });
  const resMulti = await fetchPgnFromUrl("https://example.com/collection.pgn");
  assert.equal(resMulti.ok, true);
  assert.equal(resMulti.multiple, true);
  assert.equal(resMulti.games.length, 2);
} finally {
  globalThis.fetch = origFetch;
}

console.log("chessPgn tests passed");

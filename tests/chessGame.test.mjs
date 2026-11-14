// Tests for utils/chessGame.js + the bundled game JSON (owner's chess trainer). Run: npm test
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  START_FEN,
  parseFen,
  flattenComment,
  guessStartPly,
  isGuessPly,
  legalDestinations,
  movableSquares,
  resolveGuess,
  guessVerdict,
  fenBeforePly,
  guessPlies,
  strengthReport,
} from "../utils/chessGame.js";

const game = JSON.parse(readFileSync(new URL("../data/chess/opera-game.json", import.meta.url), "utf8"));

// ---- bundled game sanity: produced by scripts/chess/validate_pgn.py, so every ply must carry
// what the app renders from (uci, fenAfter) and every main-line ply its legal-move list.
assert.equal(game.white, "Morphy, Paul");
assert.equal(game.guessSide, "White");
assert.equal(game.moves.length, 33);
for (const [i, m] of game.moves.entries()) {
  assert.ok(m.san && m.uci && m.fenAfter, `ply ${i} incomplete`);
  assert.ok(Array.isArray(m.legal) && m.legal.length > 0, `ply ${i} has no legal list`);
  assert.ok(m.legal.includes(m.uci.length > 4 ? m.uci : m.uci.slice(0, 4)) || m.legal.includes(m.uci), `ply ${i}: played move not in legal list`);
}
// the knight-sacrifice variation is playable: every ply has a fen
const nxb5 = game.moves[18];
assert.equal(nxb5.san, "Nxb5");
assert.ok(nxb5.variations?.[0].every((m) => m.fenAfter));

// ---- parseFen
const start = parseFen(START_FEN);
assert.equal(start.squares.e1, "wK");
assert.equal(start.squares.d8, "bQ");
assert.equal(start.squares.a7, "bP");
assert.equal(Object.keys(start.squares).length, 32);
assert.equal(start.turn, "w");
const after1 = parseFen(game.moves[0].fenAfter); // 1. e4
assert.equal(after1.squares.e4, "wP");
assert.equal(after1.squares.e2, undefined);
assert.equal(after1.turn, "b");

// ---- flattenComment folds the PGN file's hard line breaks
assert.equal(flattenComment("a\nb   c "), "a b c");

// ---- guess phase: White guesses from move 6 => ply 10; Black plies are never guessed
assert.equal(guessStartPly(game), 10);
assert.equal(isGuessPly(game, 9), false); // 5...dxe5 (watch phase)
assert.equal(isGuessPly(game, 10), true); // 6. Bc4
assert.equal(isGuessPly(game, 11), false); // 6...Nf6 (Black)
assert.equal(isGuessPly(game, 32), true); // 17. Rd8#
assert.deepEqual(guessPlies(game).slice(0, 3), [10, 12, 14]);
assert.equal(guessStartPly({ guessSide: "Black", guessFrom: 3 }), 5);

// ---- tap handling on the real move-10 position (before 10. Nxb5)
const legal = nxb5.legal;
assert.ok(movableSquares(legal).includes("c3"));
assert.ok(legalDestinations(legal, "c3").includes("b5"));
assert.equal(resolveGuess(legal, "c3", "b5"), "c3b5");
assert.equal(resolveGuess(legal, "c3", "c7"), null); // not legal
// promotion collapses to the queen
assert.equal(resolveGuess(["e7e8q", "e7e8n", "e7e8r"], "e7", "e8"), "e7e8q");

// ---- verdicts
assert.equal(guessVerdict("c3b5", "c3b5", null).verdict, "green");
assert.equal(guessVerdict("e7e8q", "e7e8", null).verdict, "green"); // promotion default still green
assert.equal(guessVerdict("a2a4", "c3b5", null).verdict, "book"); // no engine data yet
const evals = { c3b5: 250, a2a4: 230, h2h3: 40, d1d2: 300 };
assert.equal(guessVerdict("d1d2", "c3b5", evals).verdict, "blue"); // 0.5 pawns better than the book
assert.equal(guessVerdict("a2a4", "c3b5", evals).verdict, "amber"); // within 1.0 of best
const red = guessVerdict("h2h3", "c3b5", evals);
assert.equal(red.verdict, "red");
assert.equal(red.cpLoss, 260); // vs best (d1d2 = 300)

// ---- strengthReport
// Without evals: only the counts.
const noEvals = strengthReport(game, [
  { ply: 10, verdict: "green", cpLoss: 0 },
  { ply: 12, verdict: "book", cpLoss: null },
]);
assert.deepEqual(
  { total: noEvals.total, found: noEvals.found, avg: noEvals.avgLossCp, master: noEvals.masterAvgLossCp },
  { total: 12, found: 1, avg: 0, master: null } // the green's 0 still averages; master needs evals
);
// With evals on a tiny synthetic game: 2 guess plies for White.
const tiny = {
  guessSide: "White",
  guessFrom: 1,
  moves: [
    { uci: "e2e4", fenAfter: "x" },
    { uci: "e7e5", fenAfter: "x" },
    { uci: "g1f3", fenAfter: "x" },
    { uci: "b8c6", fenAfter: "x" },
  ],
  evals: {
    0: { e2e4: 30, d2d4: 30, h2h4: -80 }, // book move is joint best: master loss 0
    2: { g1f3: 20, f1c4: 50, f2f3: -200 }, // book move loses 30 to best
  },
};
const rep = strengthReport(tiny, [
  { ply: 0, verdict: "green", cpLoss: 0 },
  { ply: 2, verdict: "red", cpLoss: 250 }, // guessed f2f3
]);
assert.equal(rep.total, 2);
assert.equal(rep.found, 1);
assert.equal(rep.avgLossCp, 125);
assert.equal(rep.masterAvgLossCp, 15); // (0 + 30) / 2
assert.deepEqual(rep.worstMiss, { moveNo: 2, cpLoss: 250 });
// Mate-scale losses are capped so averages stay readable.
const capped = strengthReport(tiny, [{ ply: 0, verdict: "red", cpLoss: 99000 }]);
assert.equal(capped.avgLossCp, 900);
assert.equal(capped.worstMiss.cpLoss, 900);
// Blues are counted.
assert.equal(strengthReport(tiny, [{ ply: 0, verdict: "blue", cpLoss: 0 }]).blues, 1);

// ---- fenBeforePly
assert.equal(fenBeforePly(game, 0), START_FEN);
assert.equal(fenBeforePly(game, 18), game.moves[17].fenAfter);

console.log("chessGame tests passed");

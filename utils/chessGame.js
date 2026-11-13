// utils/chessGame.js
// Pure logic for the owner's "Guess the Move" chess trainer (spec: Claude Doc, 13 Nov 2026).
// Games arrive as precomputed JSON (scripts/chess/validate_pgn.py --json): every move carries
// `uci`, `fenAfter` and — on main-line moves — `legal` (all legal moves of the position before
// it). So this file never needs a chess engine: it only reads what the pipeline proved.
// Tested in tests/chessGame.test.mjs.

export const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const PIECE_OF = { k: "K", q: "Q", r: "R", b: "B", n: "N", p: "P" };

/** FEN -> { squares: { e4: "wP", ... }, turn: "w"|"b" }. Only string parsing, no chess rules. */
export function parseFen(fen) {
  const [placement, turn] = String(fen || START_FEN).split(" ");
  const squares = {};
  const ranks = placement.split("/");
  for (let r = 0; r < 8; r += 1) {
    let file = 0;
    for (const ch of ranks[r] || "") {
      if (ch >= "1" && ch <= "8") {
        file += Number(ch);
      } else {
        const color = ch === ch.toUpperCase() ? "w" : "b";
        const square = "abcdefgh"[file] + String(8 - r);
        squares[square] = color + PIECE_OF[ch.toLowerCase()];
        file += 1;
      }
    }
  }
  return { squares, turn: turn === "b" ? "b" : "w" };
}

/** PGN comments keep the file's hard line breaks; show them as flowing text. */
export const flattenComment = (text) => String(text || "").replace(/\s+/g, " ").trim();

/** Ply index (0-based into game.moves) where guessing starts: the guess side's move `guessFrom`. */
export function guessStartPly(game) {
  const from = Math.max(1, Number(game.guessFrom) || 1);
  const sideOffset = game.guessSide === "Black" ? 1 : 0;
  return (from - 1) * 2 + sideOffset;
}

/** Is ply `i` one the player should guess (right side of the board, past the watch phase)? */
export function isGuessPly(game, i) {
  if (i < guessStartPly(game)) return false;
  const whiteToMove = i % 2 === 0;
  return game.guessSide === "Black" ? !whiteToMove : whiteToMove;
}

/** Squares a tapped piece may move to, read off the precomputed legal-move list. */
export const legalDestinations = (legal, fromSquare) =>
  (legal || []).filter((u) => u.startsWith(fromSquare)).map((u) => u.slice(2, 4));

/** Squares that may move at all (for first-tap highlighting). */
export const movableSquares = (legal) => [...new Set((legal || []).map((u) => u.slice(0, 2)))];

/**
 * Resolve a tap pair into a legal uci move. Underpromotions collapse to the queen in v1:
 * if several legal moves share from+to (promotion square), the "q" one is chosen.
 */
export function resolveGuess(legal, fromSquare, toSquare) {
  const hits = (legal || []).filter((u) => u.startsWith(fromSquare + toSquare));
  if (hits.length === 0) return null;
  return hits.find((u) => u.endsWith("q")) || hits[0];
}

/**
 * Verdict for a guess, per the agreed spec:
 *   green — exactly the master's move
 *   blue  — engine says the guess is >= 0.3 pawns BETTER than the master's move
 *   amber — within 1.0 pawn of the best move
 *   red   — loses >= 1.0 pawn against the best move
 *   book  — no engine data yet (evals missing): neutral "the master played X instead"
 * `evals` (when present, written later by analyze.py) maps uci -> centipawns for the side to
 * move, for THIS position. Returns { verdict, cpLoss, cpDelta } (cp numbers null without evals).
 */
export function guessVerdict(guessUci, bookUci, evals) {
  const same =
    guessUci === bookUci ||
    (guessUci && bookUci && guessUci.slice(0, 4) === bookUci.slice(0, 4));
  if (same) return { verdict: "green", cpLoss: 0, cpDelta: null };
  if (!evals || evals[guessUci] == null || evals[bookUci] == null) {
    return { verdict: "book", cpLoss: null, cpDelta: null };
  }
  const cpGuess = evals[guessUci];
  const cpBook = evals[bookUci];
  const best = Math.max(...Object.values(evals));
  const cpLoss = best - cpGuess;
  const cpDelta = cpGuess - cpBook;
  if (cpDelta >= 30) return { verdict: "blue", cpLoss, cpDelta };
  if (cpLoss >= 100) return { verdict: "red", cpLoss, cpDelta };
  return { verdict: "amber", cpLoss, cpDelta };
}

/** FEN of the position BEFORE ply i (fenAfter of the previous main-line move). */
export const fenBeforePly = (game, i) =>
  i <= 0 ? START_FEN : game.moves[i - 1]?.fenAfter || START_FEN;

/** { score, total }: how many guess plies there are and are matched, for the result line. */
export function guessPlies(game) {
  return game.moves.map((_, i) => i).filter((i) => isGuessPly(game, i));
}

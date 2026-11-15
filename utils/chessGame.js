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

const CP_CAP = 900; // one missed mate shouldn't turn an average into nonsense

/**
 * Maps Average Centipawn Loss (ACPL) to an estimated Elo performance rating.
 *
 * A ROUGH heuristic (Claude review 14 Nov: not Regan's model, which is far more involved): a straight line that
 * matches the commonly quoted ballpark (super-GM games ~10-20 cp ACPL, club players ~80-100 cp):
 *   Elo ≈ 3000 - 15 * ACPL
 *
 * Calibration against Stockfish 16+ evaluations:
 *   - ACPL <= 10 cp  => 2850 Elo (Super Grandmaster level)
 *   - ACPL ≈ 20 cp   => 2700 Elo (Grandmaster level)
 *   - ACPL ≈ 50 cp   => 2250 Elo (Master / Expert level)
 *   - ACPL ≈ 93.3 cp => 1600 Elo (Club / Intermediate level)
 *   - ACPL >= 160 cp => 600 Elo  (Casual / Beginner floor)
 *
 * Clamped between 600 (floor) and 2850 (ceiling).
 */
export function eloFromAcpl(avgLossCp) {
  if (avgLossCp == null || typeof avgLossCp !== "number" || isNaN(avgLossCp)) return null;
  const raw = Math.round(3000 - 15 * Math.max(0, avgLossCp));
  return Math.max(600, Math.min(2850, raw));
}

/**
 * Aggregates player stats and average strength across all played games in progressMap (chessProgress:v1).
 */
export function computePlayerStats(progressMap) {
  if (!progressMap || typeof progressMap !== "object") {
    return { gamesCompleted: 0, totalGuesses: 0, overallElo: null, avgLossCp: null };
  }
  let totalLoss = 0;
  let count = 0;
  let gamesCompleted = 0;
  for (const entry of Object.values(progressMap)) {
    if (!entry) continue;
    if (entry.done) gamesCompleted += 1;
    if (Array.isArray(entry.guessLog)) {
      for (const g of entry.guessLog) {
        if (typeof g.cpLoss === "number") {
          totalLoss += Math.min(g.cpLoss, CP_CAP);
          count += 1;
        }
      }
    }
  }
  const avgLossCp = count > 0 ? Math.round(totalLoss / count) : null;
  const overallElo = eloFromAcpl(avgLossCp);
  return { gamesCompleted, totalGuesses: count, overallElo, avgLossCp };
}

/**
 * End-of-game strength report (owner, 13 Nov 2026: "how well did I play, compared to Morphy?").
 * guessLog: [{ ply, verdict, cpLoss }] — one entry per guess the player made.
 * Pawn-loss numbers need `evals` (the offline Stockfish pass); without them only the
 * found/total counts are filled and the cp fields stay null.
 */
export function strengthReport(game, guessLog, progressMap = null) {
  const total = guessPlies(game).length;
  const found = guessLog.filter((g) => g.verdict === "green").length;
  const blues = guessLog.filter((g) => g.verdict === "blue").length;
  const withCp = guessLog.filter((g) => typeof g.cpLoss === "number");
  const avgLossCp = withCp.length
    ? Math.round(withCp.reduce((s, g) => s + Math.min(g.cpLoss, CP_CAP), 0) / withCp.length)
    : null;

  const gameElo = eloFromAcpl(avgLossCp);
  const overallStats = progressMap ? computePlayerStats(progressMap) : null;
  const overallElo = overallStats?.overallElo || gameElo;
  const gamesCount = overallStats?.gamesCompleted || 0;

  // The master's own average loss over the same positions — the bar to compare against.
  let masterAvgLossCp = null;
  if (game.evals) {
    const losses = [];
    for (const i of guessPlies(game)) {
      const e = game.evals[String(i)];
      if (!e) continue;
      const book = game.moves[i].uci;
      const bookCp = e[book] != null ? e[book] : e[book.slice(0, 4)];
      if (bookCp == null) continue;
      losses.push(Math.min(Math.max(...Object.values(e)) - bookCp, CP_CAP));
    }
    if (losses.length) masterAvgLossCp = Math.round(losses.reduce((a, b) => a + b, 0) / losses.length);
  }
  const masterElo = eloFromAcpl(masterAvgLossCp);

  let worst = null;
  for (const g of withCp) {
    if (g.cpLoss >= 100 && (!worst || g.cpLoss > worst.cpLoss)) worst = g;
  }
  const worstMiss = worst
    ? { moveNo: Math.floor(worst.ply / 2) + 1, cpLoss: Math.min(worst.cpLoss, CP_CAP) }
    : null;

  return { total, found, blues, avgLossCp, masterAvgLossCp, worstMiss, gameElo, overallElo, masterElo, gamesCount };
}

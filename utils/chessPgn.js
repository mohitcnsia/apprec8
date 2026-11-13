// utils/chessPgn.js
// Pasted-PGN -> the same game JSON the Python pipeline produces (owner's chess trainer).
// Uses chess.js for legality: every move is REPLAYED, so an illegal or garbled PGN is
// rejected with the exact move, same as scripts/chess/validate_pgn.py. Differences from the
// pipeline, on purpose (v1): variations in ( ) are dropped (kept only as book text when they
// were inside { }), and there are no engine evals. Tested in tests/chessPgn.test.mjs.

import { Chess } from "chess.js";
import { flattenComment } from "./chessGame.js";

const TAG_RE = /^\s*\[(\w+)\s+"([^"]*)"\]\s*$/;

/** Split raw PGN text into { tags, movetext }. */
function splitPgn(text) {
  const tags = {};
  const lines = String(text || "").replace(/\r/g, "").split("\n");
  const rest = [];
  let inHeader = true;
  for (const line of lines) {
    const m = inHeader ? line.match(TAG_RE) : null;
    if (m) {
      tags[m[1]] = m[2];
      continue;
    }
    if (inHeader && !line.trim()) continue; // blank lines before/between tags
    inHeader = false;
    rest.push(line);
  }
  return { tags, movetext: rest.join("\n").trim() };
}

/** Remove ( ... ) variations, nested ones too. Comments inside them go with them. */
function stripVariations(movetext) {
  let out = "";
  let depth = 0;
  for (const ch of movetext) {
    if (ch === "(") depth += 1;
    else if (ch === ")") depth = Math.max(0, depth - 1);
    else if (depth === 0) out += ch;
  }
  return out;
}

/** Tokenise into moves and comments: { kind: "san"|"comment", value }. */
function tokenize(movetext) {
  const tokens = [];
  const re = /\{([^}]*)\}|(\S+)/g;
  let m;
  while ((m = re.exec(movetext)) !== null) {
    if (m[1] !== undefined) {
      tokens.push({ kind: "comment", value: flattenComment(m[1]) });
      continue;
    }
    const word = m[2];
    if (/^\d+\.+$/.test(word)) continue; // move numbers: 12. or 12...
    if (/^\$\d+$/.test(word)) continue; // numeric NAGs
    if (word === "1-0" || word === "0-1" || word === "1/2-1/2" || word === "*") continue;
    // Strip a glued move number ("12.e4") and trailing !/? marks chess.js won't accept.
    const san = word.replace(/^\d+\.+/, "").replace(/[!?]+$/, "");
    if (san) tokens.push({ kind: "san", value: san });
  }
  return tokens;
}

/**
 * Parse pasted PGN text into the app's game shape.
 * Returns { ok: true, game } or { ok: false, error } — the error is written for the owner,
 * naming the move that failed, never a stack trace.
 */
export function parsePastedPgn(text) {
  const { tags, movetext } = splitPgn(text);
  if (!movetext) return { ok: false, error: "No moves found. Paste the whole PGN, tags and moves." };

  const chess = new Chess();
  const moves = [];
  let gameComment = "";
  const tokens = tokenize(stripVariations(movetext));

  for (const token of tokens) {
    if (token.kind === "comment") {
      if (!token.value) continue;
      if (moves.length === 0) gameComment = gameComment ? `${gameComment} ${token.value}` : token.value;
      else {
        const last = moves[moves.length - 1];
        last.comment = last.comment ? `${last.comment} ${token.value}` : token.value;
      }
      continue;
    }
    const legal = chess.moves({ verbose: true }).map((v) => v.from + v.to + (v.promotion || "")).sort();
    let made;
    try {
      made = chess.move(token.value);
    } catch (e) {
      made = null;
    }
    // Phone keyboards auto-capitalise after "1." ("E4"). A,C,D,E,F,G,H are not piece
    // letters, so a capitalised pawn move is unambiguous — forgive it. (B stays strict.)
    if (!made && /^[ACDEFGH]/.test(token.value)) {
      try {
        made = chess.move(token.value[0].toLowerCase() + token.value.slice(1));
      } catch (e) {
        made = null;
      }
    }
    if (!made) {
      const moveNo = Math.floor(moves.length / 2) + 1;
      const dots = moves.length % 2 === 0 ? "." : "...";
      return { ok: false, error: `Illegal move ${moveNo}${dots}${token.value} — the moves don't replay on a real board. Check the PGN.` };
    }
    moves.push({
      san: made.san,
      uci: made.from + made.to + (made.promotion || ""),
      legal,
      fenAfter: chess.fen(),
    });
  }

  if (moves.length < 4) return { ok: false, error: "That PGN has almost no moves — paste the full game." };

  const result = tags.Result && ["1-0", "0-1", "1/2-1/2"].includes(tags.Result) ? tags.Result : "1-0";
  const guessSide =
    tags.GuessSide === "White" || tags.GuessSide === "Black"
      ? tags.GuessSide
      : result === "0-1"
        ? "Black"
        : "White"; // winner's side by default; draws default to White
  const guessFrom = /^\d+$/.test(tags.GuessFrom || "") ? Number(tags.GuessFrom) : 1;

  return {
    ok: true,
    game: {
      event: tags.Event || "Pasted game",
      site: tags.Site || "",
      date: tags.Date || "",
      round: tags.Round || "",
      white: tags.White || "White",
      black: tags.Black || "Black",
      result,
      guessSide,
      guessFrom: Math.min(guessFrom, Math.floor((moves.length + 1) / 2)),
      sourceBook: tags.SourceBook || "My PGN",
      gameComment,
      moves,
      evals: null,
    },
  };
}

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
export function splitPgn(text) {
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

/** Split a multi-game PGN file into individual PGN game entries. */
export function splitMultiPgn(text) {
  const lines = String(text || "").replace(/\r/g, "").split("\n");
  const games = [];
  let currentLines = [];
  let currentTags = {};
  let inHeader = false;
  let hasMoves = false;

  const pushGame = () => {
    if (currentLines.length === 0) return;
    const pgnText = currentLines.join("\n").trim();
    if (!pgnText) return;
    const white = currentTags.White || "White";
    const black = currentTags.Black || "Black";
    const date = currentTags.Date ? currentTags.Date.split(".")[0] : "";
    const event = currentTags.Event || "";
    const opening = currentTags.Opening || currentTags.ECO || "";
    const titleParts = [`${white} vs ${black}`];
    if (date && date !== "????") titleParts.push(date);
    if (opening) titleParts.push(opening);
    games.push({
      id: `game-${games.length + 1}`,
      title: titleParts.join(" · "),
      white,
      black,
      date,
      event,
      opening,
      pgnText,
    });
  };

  for (const line of lines) {
    const isTag = TAG_RE.test(line);
    // If we were already reading moves and now hit a new [Event ...], that's a new game
    if (isTag && hasMoves && /^\s*\[Event\s/i.test(line)) {
      pushGame();
      currentLines = [];
      currentTags = {};
      inHeader = true;
      hasMoves = false;
    }
    if (isTag) {
      inHeader = true;
      const m = line.match(TAG_RE);
      if (m) currentTags[m[1]] = m[2];
    } else if (line.trim()) {
      inHeader = false;
      hasMoves = true;
    }
    currentLines.push(line);
  }
  pushGame();
  return games;
}

/**
 * Resolve a user-supplied URL to a direct PGN download URL.
 * Handles lichess games, lichess study chapters, and checks for chess.com.
 */
export function resolvePgnUrl(rawUrl) {
  const url = String(rawUrl || "").trim();
  if (!url) return { ok: false, error: "Please enter a valid link." };
  if (!/^https?:\/\//i.test(url)) {
    return { ok: false, error: "Please enter a valid link starting with http:// or https://" };
  }

  // chess.com games do not have an open unauthenticated single-game PGN export API
  if (/^https?:\/\/(?:[a-zA-Z0-9-]+\.)?chess\.com\b/i.test(url)) {
    return {
      ok: false,
      error: "chess.com: copy the PGN there (Share → PGN) and paste it here",
    };
  }

  // lichess study chapter: https://lichess.org/study/{studyId}/{chapterId}
  const studyMatch = url.match(/^https?:\/\/(?:[a-zA-Z0-9-]+\.)?lichess\.org\/study\/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)(?:\.pgn)?/i);
  if (studyMatch) {
    return {
      ok: true,
      url: `https://lichess.org/study/${studyMatch[1]}/${studyMatch[2]}.pgn`,
      type: "lichess-study",
    };
  }

  // lichess game: https://lichess.org/{gameId} (gameId is 8 or 12 alphanumeric chars)
  const lichessGameMatch = url.match(/^https?:\/\/(?:[a-zA-Z0-9-]+\.)?lichess\.org\/([a-zA-Z0-9]{8})(?:[a-zA-Z0-9]{4})?(?:\/.*)?$/i);
  if (lichessGameMatch) {
    return {
      ok: true,
      url: `https://lichess.org/game/export/${lichessGameMatch[1]}`,
      type: "lichess-game",
    };
  }

  // Direct link (e.g. pgnmentor, raw github, or any .pgn link)
  return { ok: true, url, type: "direct" };
}

/**
 * Fetch PGN text from a link (lichess, direct .pgn download, etc.)
 * Returns { ok: true, game } for single games, or { ok: true, multiple: true, games } for files with multiple games.
 */
export async function fetchPgnFromUrl(rawUrl) {
  const resolved = resolvePgnUrl(rawUrl);
  if (!resolved.ok) return { ok: false, error: resolved.error };

  let res;
  try {
    res = await fetch(resolved.url, {
      headers: { Accept: "application/x-chess-pgn, text/plain, */*" },
    });
  } catch (err) {
    return { ok: false, error: "No internet connection or link is unreachable. Check your network." };
  }

  if (!res.ok) {
    return { ok: false, error: `Could not download from that link (status ${res.status}). Check the URL.` };
  }

  let text;
  try {
    text = await res.text();
  } catch (err) {
    return { ok: false, error: "Could not read data from that link." };
  }

  if (!text || !text.trim()) {
    return { ok: false, error: "That link returned an empty file." };
  }

  // Reject web page HTML (e.g. when an HTML page was returned instead of raw text)
  if (/^\s*<!DOCTYPE|^\s*<html/i.test(text)) {
    return { ok: false, error: "That link returned a web page, not a PGN. Copy the PGN text instead." };
  }

  const games = splitMultiPgn(text);
  if (games.length === 0) {
    return { ok: false, error: "No chess moves found in that link." };
  }

  if (games.length === 1) {
    const parsed = parsePastedPgn(games[0].pgnText);
    if (!parsed.ok) return { ok: false, error: parsed.error };
    return { ok: true, game: parsed.game, rawPgn: games[0].pgnText };
  }

  return { ok: true, multiple: true, games };
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

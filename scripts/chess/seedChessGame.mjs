// scripts/chess/seedChessGame.mjs: upload analysed chess games to Firestore (owner's trainer).
//   node scripts/chess/seedChessGame.mjs content-private/chess/evals/opera-game.json [...]
//   node scripts/chess/seedChessGame.mjs --id opera-game content-private/chess/evals/opera-game.json
// One doc per game in `chessGames/{gameId}` (admin-only rules; the owner is the only reader).
// The doc id defaults to the file name without .json. Evals live here, never in git
// (owner, 13 Nov 2026). Credentials: GOOGLE_APPLICATION_CREDENTIALS or the Firebase CLI's
// application-default login — same as scripts/admin/*.
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const admin = require("../../functions/node_modules/firebase-admin");
admin.initializeApp({ projectId: "apprec8-ca229" });
const db = admin.firestore();

const args = process.argv.slice(2);
const idFlag = args.indexOf("--id");
const forcedId = idFlag >= 0 ? args[idFlag + 1] : null;
const files = args.filter((a, i) => a !== "--id" && (idFlag < 0 || i !== idFlag + 1));
if (files.length === 0) {
  console.error("Usage: node scripts/chess/seedChessGame.mjs [--id gameId] game.json [...]");
  process.exit(1);
}
if (forcedId && files.length > 1) {
  console.error("--id works with exactly one file");
  process.exit(1);
}

function mergePreservingAnnotations(incoming, existing) {
  if (!existing) return incoming;

  const merged = { ...existing, ...incoming };

  // 1. Preserve top-level annotations / trivia / notes if present in existing
  if (existing.gameComment && existing.gameComment.trim()) {
    merged.gameComment = existing.gameComment;
  }
  if (existing.trivia !== undefined) {
    merged.trivia = existing.trivia;
  }
  if (existing.notes !== undefined) {
    merged.notes = existing.notes;
  }
  if (existing.annotations !== undefined) {
    merged.annotations = existing.annotations;
  }

  // 2. Preserve existing evals if incoming has no evals
  if ((!incoming.evals || Object.keys(incoming.evals).length === 0) && existing.evals) {
    merged.evals = existing.evals;
    merged.evalsDepth = existing.evalsDepth;
  }

  // 3. Preserve per-move annotations, trivia, and custom fields
  if (Array.isArray(incoming.moves) && Array.isArray(existing.moves)) {
    merged.moves = incoming.moves.map((incMove, i) => {
      const extMove = existing.moves[i];
      if (!extMove) return incMove;

      const move = { ...incMove };

      // Preserve existing comment if it was present
      if (extMove.comment && extMove.comment.trim()) {
        move.comment = extMove.comment;
      }
      // Preserve existing commentBefore if present
      if (extMove.commentBefore && extMove.commentBefore.trim()) {
        move.commentBefore = extMove.commentBefore;
      }
      // Preserve existing trivia if present
      if (extMove.trivia !== undefined) {
        move.trivia = extMove.trivia;
      }

      // Preserve any custom user-added fields on the move
      const standardKeys = new Set(["san", "uci", "nags", "comment", "commentBefore", "legal", "variations", "fenAfter", "trivia"]);
      for (const [k, v] of Object.entries(extMove)) {
        if (!standardKeys.has(k) && v !== undefined) {
          move[k] = v;
        }
      }

      return move;
    });
  }

  // 4. Preserve any custom top-level fields added by the owner
  const standardTopKeys = new Set([
    "event", "site", "date", "round", "white", "black", "result", "eco",
    "guessSide", "guessFrom", "sourceBook", "collection", "source", "license",
    "gameComment", "moves", "evals", "evalsDepth", "seededAt"
  ]);
  for (const [k, v] of Object.entries(existing)) {
    if (!standardTopKeys.has(k) && v !== undefined) {
      merged[k] = v;
    }
  }

  return merged;
}

for (const file of files) {
  const game = JSON.parse(readFileSync(file, "utf8"));
  if (!game.moves?.length || !game.guessSide) {
    console.error(`SKIP ${file}: not a validated game JSON (run validate_pgn.py --json first)`);
    process.exitCode = 1;
    continue;
  }
  const gameId = forcedId || basename(file).replace(/\.json$/, "");
  const docRef = db.collection("chessGames").doc(gameId);
  const existingSnap = await docRef.get();
  const existingData = existingSnap.exists ? existingSnap.data() : null;

  const dataToSave = mergePreservingAnnotations(game, existingData);
  const bytes = JSON.stringify(dataToSave).length;
  if (bytes > 900_000) {
    console.error(`SKIP ${gameId}: ${bytes} bytes is too close to Firestore's 1 MB doc limit`);
    process.exitCode = 1;
    continue;
  }
  await docRef.set({ ...dataToSave, seededAt: admin.firestore.FieldValue.serverTimestamp() });
  const preservedCount = existingData ? "preserved annotations" : "new";
  console.log(`chessGames/${gameId} <- ${file} (${(bytes / 1024).toFixed(0)} KB, evals: ${dataToSave.evals ? Object.keys(dataToSave.evals).length + " positions" : "none"}, ${preservedCount})`);
}

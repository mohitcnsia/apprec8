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

for (const file of files) {
  const game = JSON.parse(readFileSync(file, "utf8"));
  if (!game.moves?.length || !game.guessSide) {
    console.error(`SKIP ${file}: not a validated game JSON (run validate_pgn.py --json first)`);
    process.exitCode = 1;
    continue;
  }
  const gameId = forcedId || basename(file).replace(/\.json$/, "");
  const bytes = JSON.stringify(game).length;
  if (bytes > 900_000) {
    console.error(`SKIP ${gameId}: ${bytes} bytes is too close to Firestore's 1 MB doc limit`);
    process.exitCode = 1;
    continue;
  }
  await db.collection("chessGames").doc(gameId).set({ ...game, seededAt: admin.firestore.FieldValue.serverTimestamp() });
  console.log(`chessGames/${gameId} <- ${file} (${(bytes / 1024).toFixed(0)} KB, evals: ${game.evals ? Object.keys(game.evals).length + " positions" : "none"})`);
}

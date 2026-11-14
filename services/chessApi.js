// services/chessApi.js: Firestore reads for the owner's "Guess the Move" trainer.
// One collection, `chessGames/{gameId}` (admin-only rules): validated game JSON + Stockfish
// evals, seeded from the Mac (scripts/chess/seedChessGame.mjs) — evals never live in git
// (owner, 13 Nov 2026). Cost: the owner is the only reader; one get per screen open, no
// listeners (docs/COSTS.md).

import { getFirestore, collection, getDocs } from "@react-native-firebase/firestore";
import { getApp } from "@react-native-firebase/app";

const db = getFirestore(getApp());

/**
 * All seeded games, as [{ gameId, game }]. Returns [] on any error (offline, not admin),
 * so the bundled games still work without the network.
 */
export async function loadSeededChessGames() {
  try {
    const snap = await getDocs(collection(db, "chessGames"));
    return snap.docs.map((d) => {
      const { seededAt, ...game } = d.data();
      return { gameId: d.id, game };
    });
  } catch (e) {
    console.warn("chessApi: loadSeededChessGames failed (bundled games still work)", e?.message);
    return [];
  }
}

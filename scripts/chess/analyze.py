#!/usr/bin/env python3
"""Chess pipeline, step 2: offline Stockfish pass (owner's "Guess the Move" trainer).

For every GUESS position of a validated game JSON (from validate_pgn.py --json), evaluates
EVERY legal move and writes the centipawn map into the JSON's `evals`:

    "evals": { "<plyIndex>": { "<uci>": cp, ... }, ... }

cp is from the side-to-move's view, so bigger = better for the guesser. Mate in N maps to
±(100000 - N). The app's verdicts (green/blue/amber/red + pawn loss) switch on automatically
once `evals` is present — results go to Firestore via seedChessGame.mjs, never into git.

Usage:
  .venv/bin/python analyze.py game.json [...]            # in place, depth 20
  .venv/bin/python analyze.py --depth 22 --out DIR *.json
Runs overnight on the Mac; ~1-3 min per position at depth 20.
"""
import argparse
import json
import pathlib
import sys

import chess
import chess.engine

MATE_BASE = 100000


def guess_plies(game):
    """Same rule as utils/chessGame.js guessStartPly/isGuessPly."""
    start = (max(1, int(game.get("guessFrom") or 1)) - 1) * 2 + (1 if game["guessSide"] == "Black" else 0)
    white_guesses = game["guessSide"] != "Black"
    return [i for i in range(len(game["moves"])) if i >= start and (i % 2 == 0) == white_guesses]


def fen_before(game, i):
    return chess.STARTING_FEN if i == 0 else game["moves"][i - 1]["fenAfter"]


def analyze_game(engine, game, depth, log):
    plies = guess_plies(game)
    evals = {}
    for n, i in enumerate(plies, 1):
        board = chess.Board(fen_before(game, i))
        legal = list(board.legal_moves)
        log(f"  ply {i} ({n}/{len(plies)}): {len(legal)} moves at depth {depth}")
        infos = engine.analyse(board, chess.engine.Limit(depth=depth), multipv=len(legal))
        per_move = {}
        for info in infos:
            if "pv" not in info or not info["pv"]:
                continue
            move = info["pv"][0]
            score = info["score"].pov(board.turn)
            if score.is_mate():
                m = score.mate()
                cp = MATE_BASE - m if m and m > 0 else -MATE_BASE - (m or 0)
            else:
                cp = score.score()
            per_move[move.uci()] = cp
        # Sanity: the game's own move must be in the map, or something is off.
        played = game["moves"][i]["uci"]
        key = played if played in per_move else played[:4]
        if key not in per_move:
            raise RuntimeError(f"ply {i}: played move {played} missing from analysis")
        evals[str(i)] = per_move
    game["evals"] = evals
    game["evalsDepth"] = depth
    return game


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("json_files", nargs="+")
    parser.add_argument("--depth", type=int, default=20)
    parser.add_argument("--out", help="write results here instead of in place")
    parser.add_argument("--engine", default="stockfish")
    args = parser.parse_args()

    engine = chess.engine.SimpleEngine.popen_uci(args.engine)
    engine.configure({"Threads": 4, "Hash": 256})
    try:
        for path in args.json_files:
            p = pathlib.Path(path)
            game = json.loads(p.read_text(encoding="utf-8"))
            print(f"{p.name}: {game.get('white','?')} vs {game.get('black','?')}")
            analyze_game(engine, game, args.depth, lambda s: print(s, flush=True))
            out = pathlib.Path(args.out) / p.name if args.out else p
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(json.dumps(game, ensure_ascii=False, indent=1), encoding="utf-8")
            print(f"  -> {out} ({len(game['evals'])} positions)")
    finally:
        engine.quit()
    return 0


if __name__ == "__main__":
    sys.exit(main())

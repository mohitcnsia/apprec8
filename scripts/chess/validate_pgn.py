#!/usr/bin/env python3
"""Chess book pipeline, step 1: the gate every game must pass (spec: "Chess: Guess the Move", 13 Nov 2026).

Replays every move of every game in the given PGN files — main line AND all parenthesised
variations — and rejects a game on the first illegal move. Partial/"obvious" lines an author
leaves unplayable belong inside { } comments as prose, never in ( ).

Usage:
  .venv/bin/python validate_pgn.py file1.pgn [file2.pgn ...]        # report only
  .venv/bin/python validate_pgn.py --json OUTDIR file1.pgn [...]    # + one JSON per PASSING game

Exit code 0 = every game passed; 1 = at least one failed (so CI / Gemini runs can gate on it).
Book PGNs and JSON output live in content-private/ (gitignored) — never in the repo.
"""
import argparse
import io
import json
import logging
import pathlib
import re
import sys

import chess
import chess.pgn

REQUIRED_TAGS = ["Event", "White", "Black", "Result", "GuessSide", "GuessFrom", "SourceBook"]

# python-chess logs parse errors; keep them out of our report output.
logging.getLogger("chess.pgn").setLevel(logging.CRITICAL)


def game_id(headers, index):
    white = headers.get("White", "?").split(",")[0].strip()
    black = headers.get("Black", "?").split(",")[0].strip()
    date = headers.get("Date", "????").split(".")[0]
    return f"{index:02d} {white}-{black} {date}"


def check_tags(headers):
    problems = []
    for tag in REQUIRED_TAGS:
        if not headers.get(tag, "").strip() or headers.get(tag, "?").strip() in {"?", "??"}:
            problems.append(f"missing or empty tag [{tag}]")
    side = headers.get("GuessSide", "")
    if side and side not in ("White", "Black"):
        problems.append(f'[GuessSide "{side}"] must be "White" or "Black"')
    guess_from = headers.get("GuessFrom", "")
    if guess_from and not guess_from.isdigit():
        problems.append(f'[GuessFrom "{guess_from}"] must be a move number')
    src = headers.get("SourceBook", "")
    if src and (".pdf" in src.lower() or len(src) > 80):
        problems.append('[SourceBook] should be short: "book name (author), page" — not a filename')
    result = headers.get("Result", "")
    if result not in ("1-0", "0-1", "1/2-1/2"):
        problems.append(f'[Result "{result}"] must be 1-0, 0-1 or 1/2-1/2')
    return problems


def describe_errors(game):
    """python-chess collects every illegal/unparseable move as an exception on game.errors."""
    out = []
    for err in game.errors:
        msg = str(err)
        # Typical message: "illegal san: 'Ne3' in <FEN> while parsing <Game ...>"
        m = re.search(r"illegal san: '([^']+)' in ([^ ]+ [^ ]+ [^ ]+ [^ ]+ [^ ]+ [^ ]+)", msg)
        if m:
            san, fen = m.group(1), m.group(2)
            board = chess.Board(fen)
            move_no = board.fullmove_number
            dots = "." if board.turn == chess.WHITE else "..."
            out.append(f"illegal move {move_no}{dots}{san}")
        else:
            out.append(msg.splitlines()[0][:160])
    return out


def node_to_dict(node, board):
    """One move node -> dict; recurses into its variations. `board` is the position BEFORE the move."""
    move = node.move
    san = board.san(move)
    entry = {"san": san, "uci": move.uci()}
    if node.nags:
        entry["nags"] = sorted(node.nags)
    comment = node.comment.strip()
    if comment:
        entry["comment"] = comment
    starting = node.starting_comment.strip()
    if starting:
        entry["commentBefore"] = starting
    # Sibling variations hang off the PARENT: node.parent.variations[1:], but we attach
    # them to the mainline move they replace, which is this node when node is variations[0].
    return entry


def walk_line(parent_node, board):
    """All moves of one line (the first child chain), with alternatives attached per move."""
    moves = []
    node = parent_node
    while node.variations:
        main_child = node.variations[0]
        entry = node_to_dict(main_child, board)
        alternatives = []
        for alt in node.variations[1:]:
            alt_board = board.copy()
            alt_entry = node_to_dict(alt, alt_board)
            alt_board.push(alt.move)
            alt_line = [alt_entry] + walk_line(alt, alt_board)
            alternatives.append(alt_line)
        if alternatives:
            entry["variations"] = alternatives
        board.push(main_child.move)
        moves.append(entry)
        node = main_child
    return moves


def game_to_json(game):
    headers = game.headers
    board = game.board()
    moves = walk_line(game, board)
    return {
        "event": headers.get("Event", ""),
        "site": headers.get("Site", ""),
        "date": headers.get("Date", ""),
        "round": headers.get("Round", ""),
        "white": headers.get("White", ""),
        "black": headers.get("Black", ""),
        "result": headers.get("Result", ""),
        "guessSide": headers.get("GuessSide", ""),
        "guessFrom": int(headers.get("GuessFrom", "1")),
        "sourceBook": headers.get("SourceBook", ""),
        "gameComment": game.comment.strip(),
        "moves": moves,
        # Per-position engine data is added later by the analysis step (analyze.py, not built yet).
        "evals": None,
    }


def slugify(headers, index):
    raw = f"{headers.get('White','x')}-{headers.get('Black','x')}-{headers.get('Date','x').split('.')[0]}"
    slug = re.sub(r"[^A-Za-z0-9]+", "-", raw).strip("-").lower()
    return f"{index:02d}-{slug}"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("pgn_files", nargs="+")
    parser.add_argument("--json", metavar="OUTDIR", help="write one JSON per PASSING game into OUTDIR")
    args = parser.parse_args()

    total = passed = 0
    for path in args.pgn_files:
        text = pathlib.Path(path).read_text(encoding="utf-8", errors="replace")
        stream = io.StringIO(text)
        index = 0
        while True:
            game = chess.pgn.read_game(stream)
            if game is None:
                break
            index += 1
            total += 1
            gid = game_id(game.headers, index)
            problems = check_tags(game.headers)
            problems += describe_errors(game)
            mainline = list(game.mainline_moves())
            if len(mainline) < 2:
                problems.append("main line has fewer than 2 plies — movetext not parsed?")
            guess_from = game.headers.get("GuessFrom", "")
            if guess_from.isdigit() and mainline and int(guess_from) > (len(mainline) + 1) // 2:
                problems.append(f"[GuessFrom {guess_from}] is beyond the last move of the game")
            if problems:
                print(f"FAIL  {path} · {gid}")
                for p in problems:
                    print(f"      - {p}")
            else:
                passed += 1
                print(f"PASS  {path} · {gid} ({(len(mainline) + 1) // 2} moves)")
                if args.json:
                    outdir = pathlib.Path(args.json)
                    outdir.mkdir(parents=True, exist_ok=True)
                    out = outdir / f"{slugify(game.headers, index)}.json"
                    out.write_text(json.dumps(game_to_json(game), ensure_ascii=False, indent=1), encoding="utf-8")
                    print(f"      -> {out}")
    print(f"\n{passed}/{total} game(s) passed")
    sys.exit(0 if passed == total and total > 0 else 1)


if __name__ == "__main__":
    main()

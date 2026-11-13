# Chess book pipeline (owner's "Guess the Move" trainer)

Spec: Claude Doc "Chess: Guess the Move" (13 Nov 2026). The feature is owner-only (Fun tab);
**book PGNs, book text and JSON output never enter this public repo** — they live in
`content-private/chess/` (gitignored).

## Setup (once)

```
python3 -m venv scripts/chess/.venv
scripts/chess/.venv/bin/pip install python-chess
```

## The gate: validate_pgn.py

Every extracted game must pass before it goes anywhere:

```
scripts/chess/.venv/bin/python scripts/chess/validate_pgn.py content-private/chess/book1.pgn
scripts/chess/.venv/bin/python scripts/chess/validate_pgn.py --json content-private/chess/out content-private/chess/book1.pgn
```

Exit 0 = all games passed (JSON written per game with `--json`). Any illegal move anywhere —
main line or a parenthesised variation — fails the game and prints the exact move.

Self-test (must print 1/2 passed, failing on `23.Rag1`):

```
scripts/chess/.venv/bin/python scripts/chess/validate_pgn.py scripts/chess/fixtures/sample_pass.pgn scripts/chess/fixtures/sample_fail.pgn
```

## Extraction rules (frozen 13 Nov 2026)

1. **No AI writes moves from memory.** Moves are transcribed from the book's own text
   (the PDFs are real text — copy the moves, don't recall them), or taken from a trusted
   game database. The two failed samples both invented moves; the checker exists because
   even a hand review missed one (23.Rag1).
2. **Words in `{ }`, playable lines in `( )`.** Everything inside parentheses must replay
   legally — the app makes those lines tappable. A partial/"obvious" fragment the author
   didn't mean to be played stays inside the comment braces as prose, exactly as printed.
3. **Keep the author's symbols** (!, ?, !?, ±, +−) as printed.
4. **Required tags per game:** standard seven plus `[GuessSide "White"]`,
   `[GuessFrom "6"]` (move where guessing starts; default = first annotated move),
   `[SourceBook "short book name (author), page"]` — never a filename.
5. **One game at a time.** A game goes to the next one only after `validate_pgn.py` says
   PASS. The first game of each book also gets a human read-through of the comments
   against the book page (Claude reviews, owner spot-checks).

## Later steps (not built yet)

- `analyze.py`: Stockfish offline pass — every legal move of every guess position evaluated
  (depth 20+), written into the game JSON (`evals`). Runs overnight on the Mac.
- Seeding: JSON → Firestore `chessBooks/{bookId}/games/{gameId}` (admin-only rules).
  Comes with the app build, which is not approved yet.

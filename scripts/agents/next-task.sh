#!/usr/bin/env bash
# Gemini's "wait for my next task" command (docs/agents/GEMINI_ONBOARDING.md).
# Reads the task board from the MAIN checkout (Claude writes it; Gemini only reads it) and prints the
# first task for Gemini that is still open. Waits (checking every 60 s) until one appears.
#
#   scripts/agents/next-task.sh [max_wait_seconds]     default 1200
#
# Exit codes: 0 = task printed · 2 = no task yet (run it again) · 3 = STOP on the board (stop working)
# A task is open when its heading says [todo] (or [fixes N]) and git has no commit
# "gemini(<id>): done" / "gemini(<id>): blocked" (for [fixes N]: no "gemini(<id>): fixed N").
set -uo pipefail
MAIN="$(git worktree list --porcelain | awk '/^worktree /{print $2; exit}')"
BOARD="$MAIN/docs/agents/BOARD.md"
WAIT="${1:-1200}"
START=$SECONDS

while :; do
  if grep -qiE '^STOP: *yes' "$BOARD" 2>/dev/null; then
    echo "STOP: the board says stop. Finish nothing new; commit what you have and end the session."
    exit 3
  fi
  OUT="$(git log --all --format=%s | python3 -c '
import re, sys
subjects = sys.stdin.read().splitlines()
board = open(sys.argv[1], encoding="utf-8").read()
blocks = re.split(r"(?m)^(?=### )", board)
for b in blocks:
    m = re.match(r"### (G\d+) · \[(todo|fixes (\d+))\] · gemini · ", b)
    if not m:
        continue
    tid, state, n = m.group(1), m.group(2), m.group(3)
    if n:
        finished = any(s.startswith(f"gemini({tid}): fixed {n}") for s in subjects)
    else:
        finished = any(re.match(rf"gemini\({tid}\): (done|blocked)", s) for s in subjects)
    if not finished:
        print(b.strip())
        break
' "$BOARD")"
  if [ -n "$OUT" ]; then
    echo "$OUT"
    echo
    echo "---------------- READ BEFORE YOU START (docs/agents/LESSONS.md) ----------------"
    cat "$MAIN/docs/agents/LESSONS.md" 2>/dev/null
    exit 0
  fi
  if [ $((SECONDS - START)) -ge "$WAIT" ]; then
    echo "NO_TASK: nothing for Gemini yet. Run scripts/agents/next-task.sh again."
    exit 2
  fi
  sleep 60
done

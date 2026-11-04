# Gemini onboarding: working under Claude

**From 2026-11-04 (owner decision):** Claude is the lead and manages Gemini directly. The owner talks only to Claude and
watches progress on `docs/agents/BOARD.md`. Gemini takes tasks only from that board (not from chat, not from old notes).

## 1. Setup (once)
- **Your folder:** `/Users/mohitchilkoti/Documents/projects/apprec8-gemini` (a git worktree of the same repo, already
  created, `node_modules` linked). **Work only there.** Never edit files in `/Users/mohitchilkoti/Documents/projects/apprec8`
  (Claude's folder): that is what broke things before. You may *read* the board there.
- Branches you create are visible to Claude at once (same repo); no push needed. Pushing your own branches to GitHub is fine.
- Never check out or commit to `feat/quiz-redesign`, `feat/tile-quests` or `main`; Claude merges.

## 2. The loop
**Never end your turn to report or to wait.** Nobody reads your chat (the owner talks only to Claude), and when your turn ends
the loop stops until someone restarts you. Report only through commits and report files. Keep calling the script in the same
turn; end only on exit 3 (STOP) or after NO_TASK three times in a row (then say "No tasks, idle" once and stop).
If you must wait (a build is running), run `sleep 300` and check again; don't stop.
1. `scripts/agents/next-task.sh` (run it from your folder). It waits until a task for you is open, then prints it.
   - exit 0 → do that task · exit 2 → nothing yet: run it again · exit 3 → **STOP**: commit what you have and end.
2. Start: `git checkout -b <branch from the task> <base from the task>`; commit `gemini(Gxx): start` (empty commit is fine).
3. Work. Run `npm test` before every commit. Commit small and often, messages starting `gemini(Gxx): …`.
4. Finish: write `docs/agents/reports/Gxx.md` (what you did, counts, anything unsure, anything you skipped and why), commit it
   with **`gemini(Gxx): done — <one line>`**. Then go to step 1. Don't wait for Claude's review: the next task is independent.
5. Stuck (a tool hangs twice, missing info, a rule unclear)? Write the problem in the report and commit
   **`gemini(Gxx): blocked — <reason>`**, then go to step 1. Never retry the same failing command more than twice.
6. Claude's review comes back on the board as `[fixes N]` on that task, with notes. Fix on the same branch, commit
   `gemini(Gxx): fixed N — <one line>`.

## 3. Never without the owner's OK (Claude passes it on in the task as "owner-approved: yes")
Deploys (functions, rules, indexes), seeding live Firestore, Remote Config, Play Console, anything that costs money,
merging into shared branches, deleting branches or data, changing `firestore.rules`. If a task seems to need one of these,
stop and report it as blocked.

## 4. Quality rules (from the QA review, 2026-11-04)
- **Report what you actually see / check, not what you expect.** "OK" means you checked it. Unsure = say UNSURE.
- **Commit every file you write** (reports, data, docs). Nothing left uncommitted at the end of a task.
- **Content:** `docs/CONTENT_GUIDE.md` is the law. Accuracy first: if a question could have two right answers, drop it.
  Original questions only; past papers are a pattern guide, never copied. Ids are positions: append, fix in place, never reorder.
- **Keep it short.** Reports are tables and bullets, not essays. Don't edit `gemini.md`, `CODE_REVIEW.md` or `docs/TEAM.md`
  unless a task says so (Claude keeps them).

## 5. What Claude does
Writes and orders tasks, reviews every `done` commit (diff + `npm test` + accuracy spot checks), merges, updates the board
and `CODE_REVIEW.md`, and asks the owner for anything in §3.

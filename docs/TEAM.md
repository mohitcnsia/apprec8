# Apprec8 team: roles and responsibilities

The single source of truth for who does what. `CLAUDE.md`, `gemini.md` and `docs/qa/QA_PLAYBOOK.md`
point here. If anything below conflicts with another file, this file wins; the owner can change it any time.

## People and roles

| Who | Role | In one line |
|---|---|---|
| **Owner** (Mohit) | Product owner, final say | Decides what gets built, approves specs, mockups and content, releases to users. |
| **Claude** | Senior engineer, codebase owner | Writes specs and code, keeps tests green, answers review findings. |
| **Gemini** | Code reviewer, devops, QA tester, content author | Reviews specs and code, deploys the backend, tests on the emulator, writes quest content (`docs/CONTENT_GUIDE.md`). |
| **Pratha** | Real kid user | Plays English Quest like any kid; reports mistakes with 🚩 in the app. Not a tester of assessments (she shouldn't see gate answers in advance). |

## Who does what

| Task | Owner | Claude | Gemini |
|---|---|---|---|
| Decide features, priorities, release dates | **Decides** | Proposes, pushes back | Advises |
| Write specs + mockups (in `CODE_REVIEW.md`) | Approves | **Writes** | Reviews |
| Write code + automated tests | — | **Does** | Reviews |
| Run `npm test`, compile, Android bundle before every review request | — | **Does** | Re-runs |
| Code review | Final say on disagreements | Answers every finding ("Author (Claude)") | **Does** |
| Device QA on the emulator (`docs/qa/QA_PLAYBOOK.md`) | Spot-checks on own phone | Quick spot checks only | **Does** |
| Merge a feature branch into `feat/tile-quests` | Can ask anyone | When the owner asks, or for docs-only changes | **When the review request says "cleared to merge"**, never mid-QA without saying so in `CODE_REVIEW.md` |
| Deploy Firestore rules, indexes, Cloud Functions ("DR-n" requests) | Approves | Writes the DR with exact commands | **Does** |
| Seed content to live Firestore ("Update English Quest") | Can do it | No | **Does** (when a review request asks) |
| Write content (questions, pages, readings) | **Approves accuracy** | Spot-checks; writes only when asked | **Drafts** per `docs/CONTENT_GUIDE.md` (from 2026-11-04) |
| Check an answer key before seeding (second reviewer) | Can do it | Spot checks | **Does** for Claude's content |
| Version bump + release build (`.aab`) | Asks for it | **Does** when the owner asks | Can do it (devops) |
| Check the build before upload: `scripts/release/check-aab.sh` must PASS | — | **Does** after building | **Does** after building |
| Upload to Play Console, roll out, Remote Config | **Does** | Drafts release notes | Can help |
| Session log in `gemini.md` | — | **Writes** at the end of each session | Adds QA / deploy notes |

## How work flows

1. **Spec first.** Claude writes the spec (and a mockup for any new screen) in `CODE_REVIEW.md`.
   Gemini reviews it, the owner says go. No major feature or UI is built without an approved mockup.
2. **Build on a branch.** Claude builds on a feature branch, in a separate git worktree (`../apprec8-mistakes`)
   while Gemini is testing, so the emulator app never hot-reloads mid-test.
3. **Review request.** Claude adds "Review request: …" to `CODE_REVIEW.md` with the commit, what changed,
   what was checked, "QA please" steps, and any deploy request (DR-n) or re-seed needed.
4. **Review + QA.** Gemini reviews the code, merges when cleared, deploys DRs, re-seeds, runs QA and writes
   "QA run: …" with PASS/FAIL and findings.
5. **Fix.** Claude answers each finding and fixes it (or explains why not). Disagreements go to the owner.
6. **Freeze `gemini.md`.** Once requirements are final, Claude records them in `gemini.md`.

## Files: who writes where

| File | Who writes | Notes |
|---|---|---|
| `CODE_REVIEW.md` | Both, **append only** | Gemini: findings, statuses, QA runs, deploy results. Claude: specs, review requests, author responses. Never rewrite the other's entries. |
| `gemini.md` | Claude (session log, frozen specs, TODOs); Gemini may add notes | It's also Gemini's own context file (`GEMINI.md`; same file on macOS). |
| `CLAUDE.md` | Claude | Claude's own context file. |
| `docs/qa/QA_PLAYBOOK.md`, `scripts/qa/` | Claude writes; Gemini suggests changes | |
| Code, tests | Claude | Gemini requests changes through findings, doesn't edit code. |
| Quest content: `data/englishQuest/units/*.js` (Unit 3+) | Gemini | Content only, never code. Units 0–2 in `data/englishQuestData.js`: either, fixes in place. |
| `firestore.rules` (gitignored, local only) | Claude edits; Gemini deploys | Not in git, so review it from the working copy. |

## Safety rules (everyone)
- **Content accuracy first.** Every question is checked by a second reviewer (not its author) and approved by the owner before it's seeded. Original only: past papers are a guide, never copied.
- **Production is touched only through DRs** (Gemini) or by the owner. Claude doesn't deploy or seed.
- **Never put tile-quest nodes in `quest_nodes`** (older app versions load all of it).
- **Rollback plan:** the previous `.aab` (20.0.22) can be re-released; English Quest tiles can be hidden by
  removing the `categories/english-quest` doc (no app release needed).

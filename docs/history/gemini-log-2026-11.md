# Gemini log (archive), November 2026
Moved out of `gemini.md` to keep it under 24 KB (Antigravity reads only the first 24 KB).

## 2026-11-04 (covers 2026-10-31 → 2026-11-04)
- **Goal:** ship English Quest to Play as 20.0.23 and push the update to kids.
- **Completed Steps:**
  1. "My mistakes", rewards, admin dashboard v0, RB-5c/5b, 5 new gate challenges (owner approved all 75 questions), the permanent-gate-lock fix. Gemini merged `feat/gate-pools` (`c9afd4b`). Details in `CODE_REVIEW.md`.
  2. **Release 20.0.23** (`9c9ac56`): built locally and verified (version, signature). Uploaded to Play by the owner. DR-5 deployed (Gemini), re-seed done (owner, via the emulator). Roles written down in `docs/TEAM.md`.
  3. **Update push:** Remote Config v30 (owner): `active_message` = hard update `update_20_0_23`, `min_version` 20.0.23. `update_url_android` stays the internal-testing link: the public store link showed Google's "13 or older" page on a kid's account. Rollback: Remote Config version 29.
  4. Owner played English Quest on a OnePlus 9 Pro (20.0.23): works.
  5. **Bug found:** no 📊 Dashboard for the owner in the Play build, because the admin ID lived only in `.env`. Fixed on `fix/admin-uid` (`5ecd6c4`): the ID is in code, plus `tests/releaseConfig.test.mjs` and `scripts/release/check-aab.sh`. Ships in 20.0.24.
  6. **Backup:** `feat/tile-quests` pushed to GitHub (it existed only on the laptop). GitHub `main` is an unrelated 2025 initial commit; owner: don't merge into it.
  7. **Admin endpoints:** they're protected by Cloud IAM (tokenless call → 403), so Finding 12 was downgraded to MEDIUM. DR-6 makes them private in code (`499f7f4`); deploy pending (Gemini/owner).
  8. **QA run by Claude** (`CODE_REVIEW.md`): found and fixed **Finding 19 (HIGH)**: ♾️ Keep practising never saved an attempt since 20.0.23. Version bumped to **20.0.24** (`f0d8d27`); built `build-1793737167228.aab`, check script PASS.
- **How to test:** `scripts/release/check-aab.sh build-1793723069242.aab 20.0.23` → ❌ admin ID (the bug). After 20.0.24: the same script → PASS; on the phone, signed in as the owner, Profile → 📊 Dashboard lists Pratha's English Quest results.


## 2026-11-04 (part 2): app redesign + Science Quest groundwork, branch `feat/quiz-redesign` (Claude)
- **Goal:** finish the owner-approved redesign (quiz, Home + tabs) and prepare NSO (Science Quest) for 19 Nov.
- **Completed Steps:** (details + commit ids in `CODE_REVIEW.md`, entries dated 2026-11-04)
  1. Quiz screens redesigned (mockups A–D); answers sit in the thumb zone above CHECK.
  2. Tabs Home · Fun · Progress · Me. Study tab gone (its screens are in the Home stack); Space quest = hidden tab opened from Home. Reminders (= Tasks, max 5 per kid) in Home's Coming up. Progress merges Stats + Dashboard; Me replaces Profile, seed buttons in Admin tools.
  3. Leaderboard shows first name + class (Class 1–12 in Edit profile, set once). DR-8 + Finding 22 wait for deploy (G10).
  4. Multi-quest: `data/quests/index.js`, generic `SeedTileQuestButton`, class filter `utils/gradeFilter.js` (`grades` on nodes), Dashboard quest switch, Home/Progress show every quest. Science Quest draft (`data/scienceQuestData.js`, 1 sample topic) visible to testers only (`quest_draft`).
- **How to test:** `npm test` (all suites); then `docs/qa/OWNER_TESTING.md`, newest sections first (G8, G9, G13). Nothing is deployed or seeded.

(Older session: 2026-10-31 → 2026-11-04 release work, moved to `docs/history/gemini-log-2026-11.md`.)

## 2026-11-05 (evening): practice paper built, specs R + S, DR-14 → G32 (Claude)
- **Goal:** act on the owner's evening feedback.
- **Done:** practice paper (mockup Q approved) built: Home → Explore → Practice paper; bundled papers, resume, clock,
  check grid, result by part, answers; testers only until the paper questions are approved (`2dfefec`). DR-14 approved →
  Gemini G32 (index + backfill; backfill again after the next publish). Help sheet: Call opens the dialer only, no call
  button for 112 (prank-call worry). Draft specs **R Learn cards** (mockup row R) and **S word ladders** in CODE_REVIEW.md.
- **How to test:** docs/qa/OWNER_TESTING.md → "Practice paper" (after "publish").

## 2026-11-05 (day): costs, Unit 8, Science Unit 5, safety mockup, branch `feat/quiz-redesign` (Claude)
- **Goal:** owner away 8 h: cost guards (owner: "extremely cautious about costs"), more Class 3–5 content, safety mockup, clean-up.
- **Completed Steps:**
  1. OTA `4aeab2e5` (20.0.29) with Units 5–7, Science 4, G28 Word Power mixes (reviewed + fixed by Claude). Owner seeded; IAM step done.
  2. Cost guards: DR-12 `maxInstances` on every function; DR-13 leaderboards cached 10 min server-side, top-N ≤ 50 (both owner OK → G30);
     DR-14 dashboard reads one quest (`questId` on progress, index + backfill script; waiting for OK).
  3. English Unit 8 Linking Words (120 Qs) + Science Unit 5 Light, Sound & Magnets (105 Qs): review page + G31 second review.
  4. Mockup P (child safety & privacy, draft for owner + Seema). Old unused screens deleted. Owner tests = 7 in-app reminders.
  5. Later: English Unit 9 Punctuation (128 Qs), Science Unit 6 Patterns & Puzzles (105 Qs, answers recomputed by a test),
     cost guard 4 (Vocab / Spelling Bee / Space map phone copy, docs/COSTS.md), mockup Q practice paper + draft Papers 1
     (English + Science, 50 Qs each) + scoring logic, accuracy pass on Science Units 1–3 (3 fixes).
- **How to test:** `npm test`; docs/qa/OWNER_TESTING.md (new sections at the top).

## 2026-11-05 (night): 20.0.28 → 20.0.29, Word Bank, schools, leaderboard, lock, English Units 5–6, branch `feat/quiz-redesign` (Claude)
- **Goal:** ship owner feedback over the air (OTA from 20.0.28), redesign Schools + Leaderboard (mockups L, M), keep kids in the app (N1), English content for Class 3–5.
- **Completed Steps:**
  1. 20.0.28 built + check PASS; OTA updates published (`eas update`): Treasure Words quest (owner's 370 words, `data/wordBankQuestData.js`), reminder fix (`userId`), one-restart updates (`hooks/useStartupUpdate.js`), leaderboard M1, Schools L1–L4, no status bar in quests, loader text.
  2. G27 deploy done by Gemini (DR-8/9/10). DR-11 (4 teacher-invite functions) approved → G29 (Gemini).
  3. N1 lock: native `LockTask` module (screen pinning) + Play-as sheet + time-up overlay → needs build 20.0.29 (built overnight).
  4. English Unit 5 Tenses + Unit 6 Modals & Question Tags (~250 questions), not seeded; review page for Seema.
  5. Test guard: no exam labels in kid-facing quest text.
- **How to test:** `npm test`; `docs/qa/OWNER_TESTING.md` newest sections (OTA update, Treasure Words); 20.0.29 on the phone: Me → Play as Pratha → Lock & play (Android asks "Pin this app?").
## 2026-11-06 (day): closed-testing push (Claude)
- **Goal:** owner: "make app ready for closed testing soon"; plan = docs/LAUNCH_CHECKLIST.md "Road to closed testing" (C1–C11).
- **Done:** published 3× (20.0.29 once, then 20.0.30): old content owner-only (dogs too), My notes (Admin tools: checklist,
  testing, store listing), Me → Delete my account + delete a child profile. DR-16/17/18 live (G41). DR-19 "delete means
  delete" (eraseUser): G42 found 7 issues, all fixed → G44 re-check + deploy. New policy pages (docs/policies/, waiting
  for repo access: C1). Spec + mockup row X (parent consent), built on branch `feat/consent-gate` (waits for owner OK).
  Store text + feature graphic drafts. 22 broken Space image links fixed (repo is `mohitcnsia/images`).
- **How to test:** Admin tools → My notes → Testing (top sections).

## 2026-11-06 (night, owner: "keep building and documenting"): closer to closed testing (Claude)
- **Goal:** everything Seema's pilot and the closed test need that Claude can build; owner + Seema test in the morning.
- **Published (OTA):** guides (Me → Guides: admin "Set up a school", teacher "Start your class"; real screens + guide
  strip; steps tick from real data). **Not yet published (needs "publish"):** "Need help?" sheet (Me tab), old content
  hidden except dogs/animals, teacher "This week" card, parent "My children" week card (EN/हिंदी), link a child's
  existing account, Unit 10 Word Building (Gemini G37 + 19 fixes; needs an English re-seed), Demo School button.
- **Server, waiting for owner OK → Gemini deploys:** DR-16 Demo School (+ G38 fixes), DR-17 account linking,
  DR-18 weekly notifications (branch `feat/push-20.0.30`).
- **Build 20.0.30** (branch `feat/push-20.0.30`, native): weekly summary notifications + unused permissions removed.
  `.aab` built locally overnight; owner: `check-aab.sh`, upload to internal testing, test, then merge the branch.
- **Gemini:** G37 + G38 done and merged; G39 (QA run) and G40 (dog fact sheet) queued.
- **For the owner:** Play Console steps + draft form answers in `docs/release/PLAY_CONSOLE.md`; Dog Squad plan and
  pricing decisions in CODE_REVIEW.md; Seema's review page for Grammar Pro 1–6 + Unit 10.
- **How to test:** `docs/qa/OWNER_TESTING.md` (sections from "Guide quests" down).


## 2026-11-09/10: pilot reset around Seema's decisions (Claude)
- **Goal:** stop going in circles; freeze the pilot (free tuition at home, Class 10 English + Class 5) and build only what was agreed.
- **Done:** published leave-quiz popup, report reasons, card formatting, Progress → Practise; pilot plan doc rewritten from the
  owner's 17 comments; Seema's 6 decisions → board G89 two-way cards (mockup https://claude.ai/artifact/RkCWYMsYCRjHuHcx1q5op4),
  G90 pilot ready, G91 check-up by topic, G92 weekly report (mockup https://claude.ai/artifact/MeWYtUYoSFQedEx5BB6buj; parents see
  only their own child), G93 challenge track (waits for the owner's olympiad books).
- **How to test:** after each G task, Claude reviews; the owner tests on his phone (OWNER_TESTING.md).

## 2026-11-12 (evening): Class 7 science, join a class in the app, first real device walk (Claude)
**Goal:** Class 7 exam in 3 days; kids installed but never reached a class; blank screens. **Done:** 13 Class 7 topics
(open, 114 Qs) + Papers 1–2 · in-app "Join your class" (school → class; learning opens at once, classmates after the
teacher confirms) · no automatic deletion (90-day request; scripts locked) · View as · safety net for screen errors.
**Device walk on the owner's phone** (test build + Metro, evidence: artifact FwXSochP7K8Zs7qwhbV2Tt) found + fixed: Progress
re-subscribe loop (984 → 1; the "dark screen"), Seema's course never seeded + tile lacked `order`, COURSE tile opened the
old screen, usernames on the leaderboard, join card for teacher-parents, parent list on the child's class.
**Test:** `npm test`, `npm run test:emulator:join`, then walk new student / teacher confirm / parent on a phone before any
publish (owner rule: never skip). **Next:** publish; deploy `functions:getLeaderboard`; People screen (doc); Class 7 Paper 3.

## 2026-11-13: chess book pipeline, step 1 (Claude)
- **Goal:** owner's "Guess the Move" chess trainer (spec + mockups agreed; app build NOT approved yet). Gemini's two PGN
  samples had invented moves, so extraction is now machine-gated before any bulk work.
- **Done:** `scripts/chess/validate_pgn.py` (replays every move incl. variations; FAIL names the move — it caught 23.Rag1,
  which a hand review missed) + fixtures + README with the frozen extraction rules; `content-private/` gitignored (book
  content never enters the public repo). Board: **G105** = book 1, game 1 through the gate.
- **How to test:** `scripts/chess/.venv/bin/python scripts/chess/validate_pgn.py scripts/chess/fixtures/sample_pass.pgn
  scripts/chess/fixtures/sample_fail.pgn` → 1/2 passed, fail at 23.Rag1.
- **Evening — the app itself (owner approved: app first, extraction later; G105 parked):** Fun tab → "Guess the Move"
  (owner extras only). Bundled Opera Game (free, `data/chess/opera-game.json` from the validator's `--json`), paste-a-PGN
  (`utils/chessPgn.js`, chess.js replays every move before accepting), play screen with green/book verdicts + tappable
  variations (`screens/fun/chess/`, `utils/chessGame.js`); progress on-phone (AsyncStorage, zero Firestore). Engine
  verdicts (red/blue + centipawns) wait for analyze.py. JS-only (chess.js is pure JS) → ships as an OTA update.
- **Test:** `npm test` (chessGame + chessPgn), bundle export clean; owner's phone walk before any publish.

## 2026-11-11/12: redesign built piece by piece + alerts that can't be missed (Claude)
- **Goal:** the owner + Seema's "Simpler Home, Progress and Me" doc (https://claude.ai/artifact/RWQn8euh8aakH6LJhjzJks), built and
  phone-tested one piece at a time; every publish goes to both 20.0.31 and 20.0.30 phones.
- **Done:** word + fact of the day (two cards); alerts (DR-33: phones re-saved on start, banner while open, separate from the weekly
  summary); mood check ×5 + Calm corner + counsellor list (DR-34); topic levels + one summary per class + teacher topic view (DR-35);
  parent "tonight" card; kid Progress (cheer, near goal, lists by subject); Me with More; kid Home one next thing; Appreciate /
  Nudge / Cheer on + stickers + parents' alert (DR-36); "Take a breath?" in practice. Build 20.0.31 (5 pm reminder, Crashlytics).
- **Found:** a reinstall restored Firebase's encrypted sign-in without its key → signed out every start (fix: no app backup, next build).
- **How to test:** docs/qa/OWNER_TESTING.md (top), also in the app under Admin tools → My notes.

## 2026-11-10/11: sign-up without codes + students join from their own phones (Claude)
- **Goal:** parents and teachers found 3 codes "difficult as hell"; owner + Seema approved doc + mockups "Simpler sign-up:
  one WhatsApp link" (https://claude.ai/artifact/Qp9hkoLhrYYbADza2Pur8b). Claude builds stage by stage, phone test between.
- **Done + deployed (DR-31, DR-32):** pull-down on Progress fixed; class link (Share class link / New link) + web page
  `web/public/j.html` (tester steps until the app is public); parent's one join screen; student's join screen (own phone);
  teacher card Approve · Not sure · Decline + follow-up list; Approve asks "Did the parent say yes?" (WhatsApp YES = test only,
  launch checklist B11). Owner's 15 family testers join apprec8-testers (12 × 14 days → production).
- **How to test:** docs/qa/OWNER_TESTING.md, top two sections. Local: `npm test`, `npm run test:emulator:join` (37 checks).


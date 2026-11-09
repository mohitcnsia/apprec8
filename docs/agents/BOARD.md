# Agent board

STOP: no
AWAY: yes
<!-- AWAY: yes = the owner is away for 1 h+, so heavy work (emulator, builds) may run. Claude sets it when the owner says so. -->
<!-- Owner or Claude: change the line above to "STOP: yes" to halt Gemini at its next check. -->

**Updated:** 2026-11-04 by Claude · **Goal:** Pratha ready for IEO (17 Nov) and NSO (19 Nov) · **Base branch:** `feat/quiz-redesign`
**Owner priorities (2026-11-04):** 1) content accuracy, 2) a great app for kids, as soon as possible. Only the owner and Pratha use it now, so
breaking it is OK: ship often to internal testing, test on the owner's phone, keep emulator use short (slow Mac).
Accuracy pipeline: Gemini writes → Claude checks every question → Pratha's mother (English teacher) 🚩 in the app → owner OK → kids.
**How this works:** Claude (lead) writes tasks here; Gemini picks them up with `scripts/agents/next-task.sh`, works in its own
folder (`../apprec8-gemini`), and reports by commit (`gemini(Gxx): done …`) + `docs/agents/reports/Gxx.md` on its branch.
Claude reviews, merges and moves the task to done. The owner talks only to Claude. Rules: `docs/agents/GEMINI_ONBOARDING.md`.

## Claude's plan, 2026-11-05 day (owner out ~8 h; feedback this evening)
1. ~~English Unit 8 Linking Words~~ done (`a419e73`, 120 Qs) → review page (same link) + G31 second review.
2. ~~Science Unit 5 Light, Sound & Magnets~~ done (`3c5f77e`, 105 Qs, draft/testers) → review page + G31.
3. Gemini G30: second-reviewer accuracy pass on Units 8 + Science 5 (after G29).
4. ~~Mockup P (child safety & privacy)~~ done → waiting for owner + Seema.
10. ~~Accuracy pass Science Units 1–3~~ (300 Qs): 3 fixes (`273777e`); reach the app with the next publish + Science re-seed.
9. Mockup Q practice paper + spec (waiting for owner); draft English Paper 1 + Science Paper 1 (`0f565fe`, 100 Qs) → review page + G31.
7. ~~Science Unit 6 Patterns & Puzzles~~ done (`e1ec069`, 105 Qs; NSO opens with 10 reasoning questions and nothing covered them) → review page + G31.
8. ~~Cost guard 4~~ (Vocab / Spelling Bee / Space map phone copy) done, docs/COSTS.md.
6. ~~English Unit 9 Punctuation Power~~ done (`0e87c13`, 128 Qs) → review page + G31.
5. ~~Clean-up~~ done: old Home, StudyScreen, ProfileScreen, StatsScreen + StudyNavigator deleted (bundle builds, tests green).
Owner's test list = 7 reminders in the app (Reminders, due from 17:00), same as OWNER_TESTING.md.

## Waiting for the owner (Claude asks; nobody does these without the owner's OK)
- **Class 6 sample papers** (owner will share): Level 2 for Class 5 uses Class 6 questions → Level 2 papers + Champion sets (TODO in gemini.md).
- ~~Review page (550 Qs + Paper 2 + Same & Opposite)~~ owner 2026-11-05: **"Content approved"**; misses get reported in play (🚩 flag). English Paper 2 live for Class 5.
- **Science quest live for everyone**: published `6bde38b2`; **owner re-seeds Science** (Admin tools) so Pratha sees it.
- ~~Mockups T1–T4~~ owner OK 2026-11-05 → **built** (login, email, create account, forgot sheet, first run, animations); ships with the next "publish".
- ~~DR-15 stars for practice papers~~ **deployed** 2026-11-05 17:41 (Gemini G34).
- **Owner 2026-11-05 evening: "everything approved"** (review page 550 Qs, both practice papers, spec S, mockup P screens).
  Seema reviews on her phone afterwards. Published `cb0fc89e` (paper testers-only, Learn cards, cost guard 4).
  **Owner seeds** (Me → Admin tools): English (Units 8–9), Word Power (cards), Treasure Words (cards), Science (Units 5–6 + 1–3 fixes).
  Papers opened to Class 5: **published** `fa97c6b4` (with the owner's paper feedback fixes). Mockup P build waits for Seema's wording + safeguarding plan (RB-8).
- ~~Mockup Q practice paper~~ owner: "excellent" 2026-11-05 → **built** (testers only until the paper questions are approved; ships with the next "publish"; short options 2 × 2). Open questions: Claude's defaults in CODE_REVIEW.md Q; owner can change them.
- ~~Mockup R Learn cards~~ owner OK 2026-11-05 → **built** (Word Power first page + all Treasure Words); needs "publish" + re-seed of Word Power and Treasure Words. Seema: review the 10 Word Power cards.
- **Spec S word ladders** (Word Power + Treasure Words start too hard, owner 2026-11-05): CODE_REVIEW.md S. Owner OK?
- **Mockup P (child safety & privacy, draft)**: P1 'Need help?' row on the child's Me tab, P2 help sheet (1098 / 14416 / 112, tap to call),
  P3 parent: what we keep + who sees it + consent, P4 delete child data (PIN). Same canvas: https://claude.ai/artifact/DtBmVc472p7WgANEc12YvL
  (row P). Owner approves the screens; **Seema reviews the words**; safeguarding plan before any build (RB-8). Before build Claude
  checks the claims are true (e.g. no child photo stored from Google sign-in; delete removes attempts + codes).
- **Review page (same link): English Units 8 + 9 + English Paper 1 (Seema) + Science Units 5 + 6 + Science Paper 1 (owner)**, 550 questions: https://claude.ai/artifact/U6LynNNiAXnAAxdWGUU9Tx (codes T8-, T9-, S5-, S6-, PE1-, PS1-). Seed only after OK + G31.
- ~~Review page (English Units 5–7, Science Unit 4)~~ owner: "looks good" 2026-11-05 → published 2026-11-05 (update `4aeab2e5`, runtime 20.0.29). **Owner: install 20.0.29, restart once, then Me → Admin tools → seed English, Word Power, Science.**
- ~~Mockup N1~~ owner approved 2026-11-05 → built (`161934d`), ships in 20.0.29.
- **Build 20.0.29** (lock + play time): `build-1793820561489.aab`, check PASS, lock module inside. **Owner uploads to Play.**
- ~~DR-11 deploy~~ **deployed** by Gemini (G29) 2026-11-05 07:07: teacher invites work.
- ~~IAM step~~ done by owner 2026-11-05 (Token Creator on the App Engine account): Play as / child codes work.
- ~~DR-13 leaderboard cache~~ owner OK 2026-11-05 ("OK DR-13") → merged → **G30 (Gemini)**.
- **Cost guard 4 (app only, ships with the next "publish")**: Vocab game (~480 reads per open → 0, refresh weekly), Spelling Bee and Space quest map kept on the phone for 7 days (admin: 2 min). Summary of all guards: docs/COSTS.md.
- ~~DR-14 dashboard query~~ owner OK 2026-11-05 → **G32 (Gemini)**; run the backfill again after the next publish.
- ~~DR-12 cost guard~~ owner OK 2026-11-05 ("as long as it doesn't break stuff") → **G30 (Gemini)**. Budget alert: owner has had one since 2025.
- ~~Publish~~ done 2026-11-05 (update `7e9bc848`): leaderboard, Schools & classes, status bar, loader text.
- ~~Mockups L + M~~ owner approved 2026-11-05 → built (`723fe34` leaderboard, Schools: this commit).
- ~~Seema's review~~ done 2026-11-04: **go-ahead to seed English (Units 3–4) and Word Power** (owner, from the phone after 20.0.28: Me → Admin tools).
- ~~DR-8/9/10 + Finding 22~~ owner OK 2026-11-04 → G27 **deployed** 21:46 (functions + rules live).
- **Owner, one click (needed for child sign-in codes / "Play as"):** Google Cloud Console → IAM → give
  `apprec8-ca229@appspot.gserviceaccount.com` the role **Service Account Token Creator** (gcloud isn't installed here).
- ~~**Word Bank quest**~~ renamed **Treasure Words** (`ebc69b8`): **published** OTA 2026-11-04 (update group `d2217c51`, runtime 20.0.28). Build 20.0.28 = `build-1793814372830.aab` (check PASS), owner uploads.
0. **Fix 46 old IEO questions:** owner OK 2026-11-04. The emulator froze twice, so the fix button ships in the next build; the owner presses it once on the phone (Me → Admin tools).
1. **Nov 6 build:** which branch goes in (`feat/nov6-improvements` only, or also the redesign on `feat/quiz-redesign`)?
2. **DR-8** deploy `getLeaderboard` (first name + class) and **Finding 22** rules fix (`CODE_REVIEW.md`).
3. **Seed the Science Quest draft** (testers only) so it can be tested on the emulator.
7. **20.0.26 build** (owner feedback fixes + IEO fix button) is ready to build: **owner, tell Claude when you are away ~1 h.** Then upload + press "Fix 46 old IEO questions".
8. **Mockups E–G** (quiz canvas): instruction vs sentence, one start screen, Challenge on the path + Test out + Champion. Owner reacts.
4. ~~Seed English Unit 2~~ done. **Seed English Unit 3** (merged, Claude-reviewed): owner OK? Ideally Seema glances at it first.
5. ~~Sample papers~~ NSO in `docs/exam/papers/nso/`, IEO in `docs/exam/papers/ieo/` (owner, 2026-11-04): IEO → task G21.
6. RB-2 questions (4, in `CODE_REVIEW.md`) — after the exams is fine.

## Now

| Task | Who | State | Branch | Result |
|---|---|---|---|---|
| G15 English Unit 2 answer-key review | Gemini | done → Claude accepted as structure check | `gemini/g15-unit2-review` | 111 checked, 0 fixed. Claude spot-checked; notes were templated (feedback in G18) |
| G16 Science Unit 1 | Gemini | **done, merged** | | |
| G18 NSO pattern notes | Gemini | **done, merged** | `gemini/g18-exam-patterns` | Good: `docs/exam/nso-pattern.md` (sections, weightage, 9 question styles, gap list) |
| G17 English Unit 3 Subject-Verb Agreement | Gemini | **done, merged** | `content/eq-u3-sva` | All 5 fixes checked by Claude. Seeding waits for owner OK |
| G21 IEO pattern notes | Gemini | **done, merged** | `gemini/g21-ieo-patterns` | Gaps: no vocabulary (20–25% of IEO), no spot-the-error, no dialogue/idioms, easy distractors |
| G19 Science Unit 2 Human Body | Gemini | **done, merged** | | |
| G24 Syllabus check: NSO + IEO Class 5 vs our quests | Gemini | todo (next after G19) | `gemini/g24-syllabus` | |
| G22 "Word Power" vocabulary unit | Gemini | done → restructure in G25 | `content/eq-u4-vocab` | 108 questions; Claude reviews after G25 |
| G23 Spot the error, dialogue & idioms | Gemini | done → restructure in G25 | `content/eq-u5-error-dialogue` | 108 questions; Claude reviews after G25 |
| G27 ⭐ Deploy DR-8, Finding 22, DR-9, DR-10 (owner OK) | Gemini | **done** 2026-11-04 21:46 | from Claude's folder | Functions + rules live; IAM token role → owner (Console) |
| G45 List students without a parent's yes (read-only) | Gemini | todo (after G43) | report only | |
| G43 Store screenshots for Play (emulator, tester account) | Gemini | todo (after G42) | `gemini/g43-screens` | |
| G44 ⭐ Re-check fixes + deploy DR-19 (owner OK) | Gemini | **todo (next)** | from Claude's folder | |
| G42 ⭐ Review + deploy DR-19 account deletion (owner OK 2026-11-06) | Gemini | **blocked → fixed by Claude** (7 findings, all accepted; 2 blocking) | from Claude's folder | |
| G41 ⭐ Deploy DR-16 + DR-17 + DR-18 (owner OK 2026-11-06) | Gemini | **done** (12 functions live, 3 scheduler jobs, rules check OK) | from Claude's folder | |
| G39 QA run: Guides, "Need help?", old content hidden (emulator, tester account) | Gemini | **done** (20 pass; Claude: a code read, not a device run: no screenshots. Next QA tasks must attach screenshots) | `gemini/g39-qa` | |
| G40 Dog fact sheet with sources (research only, for Pratha's dog content) | Gemini | **done** (49 facts; bite first-aid matches WHO/NCDC. To fix before use: homepage links → exact pages; "rabies vaccine legally mandatory" → a city licence rule) | `gemini/g40-dog-facts` | |
| G38 ⭐ Review the Demo School spec (CODE_REVIEW.md, 2026-11-05) | Gemini | **done** (good catches: 🚩 auto-hide by demo kids, rank count, demo↔real joins; all fixed by Claude) | review only | |
| G37 English Unit 10 Word Building (Classes 3–8) | Gemini | **done, reviewed by Claude: 19 fixes** (loveable/useable/duteous are real words → second right answers; "busy → business" misleading; bandage and politeness stems allowed two answers; il-/ir- missing from the Learn page; "solar battery" → solar panel; 2 Boss repeats) | `gemini/g37-word-building` | |
| G36 Grammar Pro 2–6 (Class 9–10 grammar, 555 Qs) | Gemini | **done, reviewed by Claude: 91 fixes** (27 Modals, 9 Agreement, 7 Reported, 31 Passive, 17 Editing): wrong options that were also right ("Might I…?", "should have" vs "could have", "is being uploaded tomorrow"), "error" options that were the same correction reworded, style debates sold as errors (congratulate for, who/whom, committee have), a wrong key, sentences with two errors | `gemini/g36-grammar-pro` | |
| G35 Science Papers 2–4 (150 original Qs) | Gemini | **done, reviewed, live** (Claude fixed: pasteurisation wording, ship floats "balances" not "exceeds", a second right answer on shadows, padded options, jargon in explanations; Paper 3 had dropped from the paper list) | `gemini/g35-papers` | |
| G34 ⭐ Deploy DR-15 paper stars (owner OK) | Gemini | **done** 17:41 (recordQuizResult only) | from Claude's folder | |
| G33 ⭐ DR-14 backfill, second run (owner OK) | Gemini | **done** (5 docs, 0 missing) | from Claude's folder | |
| G32 ⭐ Deploy DR-14 dashboard index + backfill (owner OK) | Gemini | **done** (index live, 3 docs backfilled; run the backfill again after the next publish) | from Claude's folder | |
| G31 Second review: English Units 8 + 9 (248 Qs) + Science Units 5 + 6 (210 Qs) + 2 practice papers (100 Qs) | Gemini | done: **0 findings** (Claude: too clean to trust on 558 Qs; not counted as the second review. Seema + owner on the review page remain the gate; Claude spot-checks) | report only | |
| G30 ⭐ Deploy DR-12 + DR-13 cost guards (maxInstances; leaderboard cache) (owner OK) | Gemini | **done** 2026-11-05 evening (42 functions live, report G30) | from Claude's folder | |
| G29 ⭐ Deploy DR-11 teacher invite functions (owner OK) | Gemini | **done** 07:07 (4 functions live, report G29) | from Claude's folder | |
| G28 Move old vocab quizzes (150 Qs) into Word Power | Gemini | **done, merged** | `content/wp-old-vocab` | 136 kept, 14 duplicates dropped. Claude fixed: 2 weak antonyms replaced (potential, cringe), 4 keys (inquire→ask, strive→try hard, certainty→sureness, sickness→health), 1 second right answer removed (repulsive/hateful), appetiser + circle wording, meet/meat options; quiz ids `4ieo11-*` → `wp-*-mix` (no clash with old quizzes); leaf names → Same Meaning Mix, Opposites Mix, Word Mix, Idiom Mix (no clash with Treasure Words). Seed with Word Power. |
| Treasure Words quest (owner's 370 words, 17 topics, generated quizzes) | Claude | **done** `ebc69b8` | `feat/quiz-redesign` | Not in 20.0.28; OTA (owner OK) |
| G25 Separate "Word Power" quest | Gemini | **done, merged** | `content/word-power` | Fixes checked; Claude fixed 1 backslash + 2 wrong Learn-page rules. Seeding waits for owner (Seema to review) |
| G26 Emulator smoke test (calm pass 1) | Gemini | **done** 5 pass / 1 fail | `gemini/g26-smoke` | Fail = second Start page; Claude fixed (`d67b0ba`, `3329b72`) |
| G20 Science Unit 3 Matter, Forces & Earth | Gemini | **done, merged** (Claude fixed 4 items) | | 300 Science questions in total; still draft (testers) |
| G14 Seed English Unit 2 + 10-min smoke test | Claude (Gemini idle) | **done** 2026-11-04 15:13 | — | Seeded: 4 units, 64 nodes, 270 questions, 3 readings. Map shows 3 units; Home "Coming up" fix confirmed |
| G11 Policy research (Play Families, DPDP) | Gemini | parked (after exams) | | |

**Done:** G1 DR-7 old function images kept 1 day (Gemini, 2026-11-04) · G8 quiz redesign QA (findings fixed in `0ae2db2`).

---

## Task details (Gemini reads these; one task at a time, top to bottom)

### G15 · [later] · gemini · English Unit 2 answer-key review
**Why:** Unit 2 (Articles & Determiners) is written but not seeded; IEO is on 17 Nov. **Base:** `feat/quiz-redesign`.
**Do:** read every Unit 2 question in `data/englishQuestData.js` (section "Unit 2: Articles & Determiners", quizzes `eq-u2-*`
and reading `eq-read-rooftop-garden`). For each: exactly one correct option; no wrong option also defensible; facts true;
explanation clear for a Class 5 kid; read-aloud rule (practice questions: one blank, no apostrophe inside the quoted sentence).
**Fix in place** (never reorder or delete: ids are positions). Gate/Boss questions: review them too, but don't show them to Pratha.
**Deliver:** branch `gemini/g15-unit2-review`; `docs/agents/reports/G15.md` = table (question id · OK / FIXED / UNSURE · note);
`npm test` green. Commit `gemini(G15): done — N checked, M fixed, K unsure`.

### G14 · [done] · claude · Seed English Unit 2, then QA the redesign on the emulator
**Owner-approved: yes** (2026-11-04) for ONE production step: seeding English Quest. Nothing else.
**Wait first:** start the emulator only while the board says `AWAY: yes` (the owner's Mac is slow when they use it), and never
while a build runs (`pgrep -f "eas build"`). Until then, skip G14 for now: commit `gemini(G14): blocked — waiting for AWAY: yes`
and go on with the next task; Claude reopens G14 as `[fixes 1]` when the window comes.
**Setup:** in your folder `git checkout --detach feat/quiz-redesign` (latest), `npx expo start`, emulator `Pixel_8a_API_35`,
`scripts/qa/eq.sh prep`, restart the app; sign in as the tester/admin account (mohitchilkoti@gmail.com), never a kid's.
**1. Seed:** Me → Admin tools → **Update English Quest** → confirm "LIVE". Check the alert says 3 units (+ teaser). Do NOT press
the Science or other seed buttons. Open English Quest: Unit 2 "Articles & Determiners" appears after Unit 1's Boss.
**2. Short smoke test only, max 10 minutes** (owner 2026-11-04: the Mac is slow and the owner tests on the phone): light mode
only. Home shows the "Coming up" card text; open Unit 2's first topic and answer 2 questions (one wrong: Chamak's kind "oops"
face); Progress and Me open. Then close the emulator (it slows the Mac a lot).
**Rules:** 2 tries per step then move on (`docs/qa/QA_PLAYBOOK.md`). Report what the screenshot shows.
**Deliver:** branch `gemini/g14-qa`; `docs/agents/reports/G14.md` = table (item · PASS / FAIL / SKIPPED · screenshot · note),
FAILs first with steps to repeat. Commit `gemini(G14): done — P pass, F fail`. Then `eq.sh unprep`.

### G18 · [later] · gemini · NSO (and IEO) exam pattern notes from the owner's papers
**Feedback on G15 first:** your table notes were generated from a template ("Clean: egg before target noun/phrase"), so
they don't show what you checked. A review note must say what you actually verified, or the review doesn't count.
Quality over speed: one honest UNSURE is worth more than 111 OKs.
**Papers:** `/Users/mohitchilkoti/Documents/projects/apprec8/docs/exam/papers/` (Claude's folder, **read only**; not in git and
not in your folder on purpose). Never copy a question or passage into git or the app: notes describe patterns only.
**Do:** for each PDF note class, level (1 / 2), subject, year. Then write `docs/exam/nso-pattern.md` (and `ieo-pattern.md` if
any IEO papers): sections and marks; topics per class with how often they appear; question styles (e.g. "which of these",
odd one out, assertion–reason, picture-based, 2-statement true/false) with an *invented* example of each; difficulty of the
Achievers section; **gap list** = what Science Quest Unit 1 (your G16) and planned units don't cover yet, Class 5 first.
**Deliver:** branch `gemini/g18-exam-patterns` (base `feat/quiz-redesign`), the pattern files, `docs/agents/reports/G18.md`;
commit `gemini(G18): done — N papers read`. Then re-check your G16 questions against the patterns and note changes for Claude.

### G27 · [done] · gemini · ⭐ Deploy DR-8 + Finding 22 + DR-9 + DR-10 (owner-approved: yes, 2026-11-04)
**Owner-approved: yes** for exactly these production steps. Run them from **Claude's folder**
`/Users/mohitchilkoti/Documents/projects/apprec8` (it has `firestore.rules` and `firebase.json`; don't edit any file there).
Claude already merged all the new rules into `firestore.rules` (backup: `~/apprec8-backups/firestore.rules.before-DR9-10`).
1. `git -C /Users/mohitchilkoti/Documents/projects/apprec8 status`: must show no uncommitted code changes except docs. Branch `feat/quiz-redesign`.
2. `cd functions && npm test` (if present) / `node -e "require('./index.js')"` must load without errors.
3. `firebase deploy --only functions --project apprec8-ca229` (all functions; they're backward compatible).
4. `firebase deploy --only firestore:rules --project apprec8-ca229`. If it fails to compile, STOP, don't retry: report the error.
5. IAM (custom tokens for child sign-in):
   `gcloud projects add-iam-policy-binding apprec8-ca229 --member=serviceAccount:apprec8-ca229@appspot.gserviceaccount.com --role=roles/iam.serviceAccountTokenCreator`
   (if gcloud isn't available, report it: the owner does it in Google Cloud Console → IAM).
6. Check: Firebase Console → Functions lists approveMember, createChildProfile, switchToChild; Rules tab shows today's version.
**Not yours:** making Seema an admin (needs her uid after she signs in; owner/Claude do it).
**Deliver:** `docs/agents/reports/G27.md` (each step: done / error text), commit `gemini(G27): done — …` on your branch.
**Rollback if the app breaks:** Rules tab → previous version → publish; functions: redeploy from `backup/2026-11-04/feat/quiz-redesign`.

### G41 · [done] · gemini · ⭐ Deploy DR-16 + DR-17 + DR-18: Demo School, account linking, weekly notifications (owner-approved: yes, 2026-11-06)
**Owner-approved: yes** for exactly these functions ("Waiting for your OK, then Gemini deploys the server parts: go ahead", 2026-11-06).
Run from **Claude's folder** `/Users/mohitchilkoti/Documents/projects/apprec8` (branch `feat/quiz-redesign`, commit `fb65e92` or later:
`feat/push-20.0.30` is merged in, so `pushActions` is there). Specs: CODE_REVIEW.md DR-16, DR-17, DR-18.
1. `git -C /Users/mohitchilkoti/Documents/projects/apprec8 status`: clean except docs; branch `feat/quiz-redesign`.
2. `cd functions && node -e "require('./index.js')"`: loads without errors; `npm test` in the main folder passes.
3. Deploy only these 12 (not `--only functions`, not rules):
   `firebase deploy --only functions:seedDemoSchool,functions:shiftDemoSchool,functions:getLeaderboard,functions:onQuestionReported,functions:approveMember,functions:createParentLinkCode,functions:redeemParentLinkCode,functions:deleteChildProfile,functions:switchToChild,functions:savePushSettings,functions:weeklyParentPush,functions:weeklyTeacherPush --project apprec8-ca229`
   If the CLI asks to enable Cloud Scheduler or Pub/Sub APIs, say yes (3 jobs total = the free limit). If it asks to
   DELETE any function, answer **No** and report. If a function fails, STOP and report the error text (no retry loops).
4. `firebase functions:list --project apprec8-ca229`: all 12 listed; `gcloud scheduler jobs list --project apprec8-ca229 --location us-central1`
   : exactly 3 jobs (shiftDemoSchool, weeklyParentPush, weeklyTeacherPush) with IST times
   Sun 19:00, Sun 18:30, Mon 07:30. If gcloud isn't available, say so.
5. **Rules check (read only):** under the live rules, can the demo teacher read members + questProgress of the demo classes
   (members are written `status: "approved"`), and can `demo_parent` read `users/demo_kid_login`? Answer from the rules file; don't deploy rules.
6. Do NOT seed the Demo School (the owner presses Reset Demo School in Admin tools), do NOT publish an app update.
**Deliver:** `docs/agents/reports/G41.md` (each step: output or error text), commit `gemini(G41): done — …` on your branch.
**Rollback if something breaks:** redeploy the same function names from commit `7b0eac7` (before the merge); the new
functions can be deleted with `firebase functions:delete <name>` after the owner's OK.

### G42 · [done] · gemini · ⭐ Review, then deploy DR-19 "delete means delete" (owner-approved: yes, 2026-11-06: "ok for DR-19")
Read "Privacy policy check + Review request + DR-19" at the end of CODE_REVIEW.md, then `functions/utils/eraseUser.js`,
`tests/eraseUser.test.mjs`, the two callers (`requestAccountDeletion` in userActions.js, `deleteChildProfile` in
familyActions.js) and `scripts/admin/eraseAccount.cjs`. Check: (1) any collection or field holding a user's personal data
that eraseUser misses (search functions/, services/, screens/ for every write that stores a uid, name or email);
(2) anything it deletes that belongs to someone else; (3) batch sizes and the function timeout for an account with
thousands of attempts; (4) does `docs/policies/privacy-policy.html` say anything the code doesn't do?
Write findings under "Review: DR-19 (Gemini)" in CODE_REVIEW.md. **Blocking** = it deletes someone else's data, or
it can fail half-way and leave an account broken. If any finding is blocking: STOP, commit `gemini(G42): blocked — …`.
Otherwise deploy from Claude's folder (branch `feat/quiz-redesign`, commit `3155de0` or later; `npm test` passes first):
`firebase deploy --only functions:requestAccountDeletion,functions:deleteChildProfile --project apprec8-ca229`
(answer **No** to any delete prompt). Then test with a throwaway account you create in the emulator app (never a real
kid): sign up, play one quiz, Me → Delete my account → Firebase Console shows no `users/<uid>` and no questAttempts
for it. Report in `docs/agents/reports/G42.md`, commit `gemini(G42): done — N findings, deployed`. No code changes.

### G44 · [done] · gemini · ⭐ Re-check the 7 fixes, then deploy DR-19 (owner-approved: yes, 2026-11-06: "ok for DR-19")
Read "Author Response: DR-19 review" in CODE_REVIEW.md and the diff since your G42 commit (`git diff a89a9a5 -- functions tests scripts`).
If every fix holds and you find nothing new that is blocking (same definition as G42), deploy from Claude's folder
(branch `feat/quiz-redesign`; `npm test` passes; `cd functions && node -e "require('./index.js')"` loads):
`firebase deploy --only functions:requestAccountDeletion,functions:deleteChildProfile,functions:redeemTeacherInvite,functions:decideTeacherRequest --project apprec8-ca229`
(answer **No** to any delete prompt). Then the G42 test: a throwaway account you create in the emulator app (never a
real kid) → play one quiz → Me → Delete my account → Firebase Console: no `users/<uid>`, no questAttempts with its uid.
**Make sure Metro serves `feat/quiz-redesign`** (Claude's folder; check `git -C /Users/mohitchilkoti/Documents/projects/apprec8 branch --show-current`).
Report in `docs/agents/reports/G44.md`, commit `gemini(G44): done — deployed` (or `gemini(G44): blocked — …`). No code changes.

### G43 · [done] · gemini · Play Store screenshots (after G42)
Dev app on the emulator (`docs/qa/QA_PLAYBOOK.md`), latest `feat/quiz-redesign`, the **tester account** (never a kid's).
Light theme first, then the same set in dark. 8 portrait screenshots (`adb exec-out screencap -p > file.png`), no status
bar clutter (`adb shell settings put global sysui_demo_allowed 1` + demo mode clock 10:00, full battery, no notifications):
1. Home (quests) · 2. English Quest map · 3. A quiz question (picture or Learn card if one shows) · 4. Right-answer
screen with the explanation · 5. Progress tab · 6. My mistakes · 7. Teacher view of a class (log in as the demo teacher
only if the owner has pressed Reset Demo School; otherwise skip) · 8. Me tab with "Need help?".
No real children's names on screen (tester account + demo data only). Save to `docs/release/screenshots/{light,dark}/NN-name.png`,
commit `gemini(G43): done — N screenshots` on your branch. No code changes, no Firestore writes beyond normal play.

### G47 · [done] · gemini · ⭐ URGENT: start the Decisions sync again (it stopped at ~19:00 on 6 Nov; script updated)
`scripts/admin/decisions.mjs` now also closes inbox cards the owner answered in the chat (`via: "chat"` in
decisions.json). In Claude's folder: stop the running `node scripts/admin/decisions.mjs --watch`, run
`node scripts/admin/decisions.mjs --dry` (read-only; expect "closed in the inbox" to list 4 ids on the real run), then
start `--watch` again in the background. Commit `gemini(G47): done` with the dry-run output (no emails, no uids).

### G48 · [done] · gemini · ⭐ Brand set: 3 logo + icon directions (owner asked 2026-11-06)
Owner: "app-specific logos and images will give us much better control and feel". **His logo idea:** the 8 lies down
as **∞**, and its **right loop breaks into small digital blocks that scatter into space** (infinite learning, digital).
Rough sketch by Claude: `docs/release/graphics/feature-graphic-v4.png`; make it beautiful. He **dislikes green check
circles**. **Warmth:** the current Play feature graphic (purple, illustrated Indian children: one with a heart, one with a
book and medal, a brain icon; tagline **"Learn. Grow. Shine."**) is warmer than Claude's text-only drafts and the owner
likes its feel. Keep that warmth (children + well-being + the tagline) in one consistent illustration style; avoid
competition symbols like medals. Use your image generation. If you have none, commit
`gemini(G48): blocked — no image tool` and stop.
**Brand facts:** name "Apprec8", said "appreciate" (8 = "ate"). Learning + well-being for Classes 1–12 in India, for
children, parents and teachers. Calm, warm, kid-friendly; never neon. Palette from the app: plum #3b0940, #85508a,
light #F5D2F8, star gold #dcb51b; must work on the dark theme. Mascot: **Chamak**, the smiling star already in the app
(components/auth/HeroScene.js): keep him. References: `feature-graphic-v4.png` (the dissolving ∞), `feature-graphic-v3.png` (plain ∞).
**Per direction (3 different directions, all built on the dissolving ∞):** wordmark in **both spellings**, "apprec∞" and "appreci∞" (owner is thinking of renaming to Appreci8, so it reads "appreciate" by itself), app icon 512×512 (no small text), Android adaptive icon
foreground (1024×1024, logo inside the central 66%), a one-colour notification mark (white on transparent, 96×96),
7 subject icons 256×256 (English, Science, Word Power, Treasure Words, Maths, Reasoning, Well-being), and a
1024×500 feature graphic. Original work only (no copying other brands' styles or characters). No green checks.
**Output:** `docs/release/brand/<direction-name>/…` PNGs + one overview sheet per direction (all assets on one image),
report `docs/agents/reports/G48.md` (what each direction means, 3 lines each). Don't change any app files.
Commit `gemini(G48): done — 3 directions`. Claude puts them in the owner's Decisions inbox to pick one.

### RULE · 2026-11-09 (Claude) · NEVER SHOW MADE-UP DATA
Claude's review of G49 found the mockup's numbers hard-coded in the real screens ("52 minutes", "86% right",
"Tenses (had done)" for every child; "3 waiting", "24 of 38 practised", "Reported questions (52% right)" as
fallbacks; a hidden `devRole` that injects a fake class and a fake Pratha). Shown to a real parent or teacher this is
false information about their own children. **Always real data or an honest empty / loading state** ("No practice
yet this week", "—"). Demo data only through the Demo School logins. No test switches in shipped screens.
Neutral wording ("their week", not "her week"). Grep your diff for mockup numbers before "done". **Also never a dead end:** every
screen a person can get stuck on (sign-up sheets, gates, errors) has a way back or out ("Not you? Use a different
account", Sign out, Back).

### PRIORITY · 2026-11-09 evening (Claude) · REPLACES the order below · Google review takes a few days: owner wants the high-value features built before the pilot starts
**1) G77 DR-24 deploy + test (owner YES)**, **2) G73 the other 24 Grammar Pro issues (Claude fixed the 5 High)**, **3) G78 offline messages + offline PIN (owner YES)**, **4) G49-R rework row Z (guide card first on Home: Seema)**, 5) G75 rehearsal fixes, 6) G76 DR-23 deploy, 7) G69 Chamku asks, 8) G70 teacher class screen, 9) G55 plan v2 (PIN safety; share the secure-store PIN module with G78), 10) G68 Challenge words, 11) G67, G53, G71 (after G50 review).

### PRIORITY · 2026-11-09 (Claude) · (older order, kept for history) (last time G51–G63 were done before G64–G68)
**00) G72 URGENT Seema's account (done)**, **000) G74 deploy DR-22 after owner OK**, **0a) G73 Grammar Pro fixes (Seema's pilot content)**, **0) G49-R rework row Z (real data only; blocks the owner's testing)**, **1) G66 feedback pipeline (plan first) — owner: highest priority**, 1b) G69 build Chamku asks (with G66), 2) G64 parent's week fix, 3) G65 🚩 on reading
pages, 4) G68 Challenge words for strong readers (owner: proper fix within 2–3 days), 4b) G70 teacher class screen, 5) G67 Progress facts (no
code), 6) G53 ∞ alone, 7) G71 parent web page (after G50 review). [review] = Claude reviews; don't build on top of them yet. Mockups approved by the owner come
back as new build tasks.

### G77 · [todo] · gemini · Deploy DR-24 (owner YES, 2026-11-09) + test Ideas & reports
The feedback update is live (OTA 2026-11-09, update group 08480483). Deploy the local rules from CLAUDE's folder (firestore.rules is
git-ignored; take it from /Users/mohitchilkoti/Documents/projects/apprec8): `firebase deploy --only firestore:rules --project apprec8-ca229`.
Then test on the emulator with a throwaway child account: Me → 💡 I have an idea → send; a 🚩 on a reading page. As an admin:
Admin tools → Ideas & reports shows both; the done tick saves. A child account must NOT be able to read userFeedback (try it).
Delete the throwaway account. Report G77.md. `gemini(G77): done — deployed + verified`.

### G78 · [todo] · gemini · No internet = a clear message, and the parent PIN works offline (owner YES, 2026-11-09)
**Why:** demo to a parent with the internet off: "Play as" failed with a confusing message. Going back to the parent also needs the
server, so a dropped connection mid-session leaves Time's up unclosable (never-lock-out rule). JS only (ships over the air): no new
native library (NetInfo needs a build: later).
1. `utils/netError.js` (pure, tested): `friendlyError(e)` → "No internet. Turn on mobile data or Wi-Fi, then try again." for
   network failures (callable codes `unavailable`, `deadline-exceeded`, `functions/unavailable`, auth `network-request-failed`,
   messages with "network"/"offline"), else the existing message. Use it in every alert that shows a server error
   (grep `e?.message || String(e)`: 14 places, plus familyApi/ideaApi/class join callers).
2. **Play as:** get the token from `switchToChild` FIRST; only if that works, pin + start the timer + sign in. Offline = the
   message, the phone is never pinned.
3. **Offline PIN** (`services/parentPinLocal.js`, expo-secure-store + expo-crypto, both installed): when the parent sets the PIN,
   or switches back successfully online, store a salted SHA-256 of the PIN on the phone. In a child session, if `switchToParent`
   fails with a network error and the typed PIN matches the local copy: `endSession()` (unpin, stop timer, close Time's up) and say
   "Lock off. You'll be back in your account as soon as the internet is on." Retry the switch when the app comes to the foreground
   and every 30 s while that note shows; never more than that. No local copy yet → "Turn on the internet to switch back. Your
   phone's own PIN or pattern also unpins the phone." Wrong PIN offline counts toward the same 5-try / 15-min wait (store it locally).
4. Tests for friendlyError and the local PIN check (match / no copy / wrong / lockout). Mention in docs/qa/OWNER_TESTING.md:
   airplane mode → Play as → message, no pin; Play as online → airplane mode → Time's up → PIN → lock off → internet on → back.
Branch from the latest `feat/quiz-redesign`. Report G78.md. `gemini(G78): done — review please`.

### G74 · [done] · gemini · Verify DR-22 (the OWNER deployed the rules himself, 2026-11-09 09:10) — test only
Don't deploy. Test with a NEW throwaway account on the emulator: sign up → first name → Class 5 → LET'S GO must save;
also a grown-up: "I'm a parent" with a new account. Delete both accounts afterwards (Me → Delete my account).
Report G74.md. `gemini(G74): done — verified`.

### G72 · [done] · gemini · 🚨 URGENT: Seema can't get past the first-run sheet ("Couldn't save your profile (not allowed)")
The owner gives you Seema's sign-in email **in Antigravity** (never write it in the repo). Her account is from 2025
(old app). Every first-run save is refused by the users-update rule even though it isn't the 10-minute limit.
1. **Read only her `users/{uid}` doc** and report in `docs/agents/reports/G72.md` the **field names and types**
   (no values except: is firstName set? type of `profileLastSavedAt`, `lastUpdatedAt`, `photoURL`, `lastName`, `grade`,
   `isChild`). Claude's guess: `profileLastSavedAt` (or another field the rule reads) has an old type (number / string),
   so `request.time - resource.data.profileLastSavedAt` errors and the rule denies.
2. **Fix her doc** with a one-off admin write (owner asked for it, 2026-11-09): set `firstName` to "Seema" if missing,
   and fix the bad-type field (e.g. delete `profileLastSavedAt`). Nothing else.
3. Check how many other user docs have the same old-type field (count only, no names) and say so.
4. Ask her to reopen the app: it should go straight through. `gemini(G72): done — fixed`.
Claude then makes the rule robust to old types (a DR for the owner).

### G73 · [todo] · gemini · Fix the 29 Grammar Pro issues from your G52 report (Claude reviewed it, 2026-11-09)
**Update 2026-11-09 evening: Claude already fixed the 5 High** (b4 questions-gate-pool-11, b5 test-8, modals-gate-pool-14,
agent-board-7, test-12): pull first, skip those 5, do the 11 Medium + 13 Low.
Apply your suggested fixes from docs/agents/reports/G52.md to `data/englishQuest/units/b1.js`–`b6.js`: all 5 High,
11 Medium, 13 Low. Also bring the **"right answer is the longest option"** rate in b1 (56%) and b4 (52%) below 40%
(lengthen distractors or shorten keys; don't change what's right). Keep ids. `npm test` passes. Report what changed per
id in `docs/agents/reports/G73.md`. **Claude checks every High + Medium and a sample of Low before the owner re-seeds
English.** `gemini(G73): done — review please`.

### G75 · [todo] · gemini · Fixes from your G56 rehearsal (Claude triaged, 2026-11-09)
#1 fixed by DR-22. #3 is covered by G70 (teacher class screen). Fix the rest, small, on a branch from the latest
`feat/quiz-redesign` (NOT from feat/simple-home):
- **#2 never trapped on "Switch to parent":** if the signed-in account isn't a child session, ParentPinScreen says in
  plain words "You're already in your own account; this is for switching back from a child's profile" + a Back
  button. Every exit visible (board rule: never a dead end).
- **#4 Demo School teacher code:** Admin tools → Demo School card shows a teacher invite code for the demo class
  (create one at reset, reusable), so teachers can practise "Join as a teacher".
- **#5 explain the demo wall:** when a real account types a Demo School class code: "The Demo School is only for
  looking around with the demo logins. To try with real children, create your own class (Me → Guides → Set up a
  school)."
- **#6:** no trailing "code " when a class has no join code.
Also: list in G75.md which real classes / accounts the G56 rehearsal created (e.g. "Glorious Academy 5-A",
"Kabir", "Pooja") and delete the throwaway accounts if any remain. `gemini(G75): done`.

### G76 · [todo] · gemini · Deploy DR-23: delete the 26 old HTTP content functions (owner-approved: yes, 2026-11-09 "OK (DR-23)")
CODE_REVIEW.md "DR-23". They're IAM-private (403 without a token) and unused by the app; no longer exported from
functions/index.js. Run the `firebase functions:delete … --region us-central1 --project apprec8-ca229 --force` command
from CODE_REVIEW.md (drop any name the CLI says doesn't exist), then `firebase functions:list` and report the remaining
count in G76.md. Don't delete anything else from G60 yet. `gemini(G76): done`.

### G49-R · [todo] · gemini · ⭐ REWORK row Z (Claude's review, 2026-11-09): real data only
Branch feat/simple-home. **Rebase on the latest `feat/quiz-redesign` first** (it changed HomeScreen, MeScreen,
ProgressScreen: Owner extras, Decisions, guide/teacher pages). Then:
1. **Delete `devRole`** and every injected demo object (demo_pratha, demo_class_10b). Test roles with the Demo School
   logins (demo.parent / demo.teacher / demo.kid) or the tester account instead.
2. **Parent card:** real numbers from the same logic as `components/parent/ParentWeekCard.js` / `utils/parentWeek.js`
   (all subjects combined, see G64): days, minutes, % right, the real "to practise together" topic; if no practice
   this week: "No practice yet this week" + LET <NAME> PLAY. Pronoun-free ("their week"). Real class, no "Class 5" default.
3. **Teacher card:** real values from the data `screens/progress/TeacherClasses.js` loads (members with status pending =
   waiting; approved count; active this week; current assignment; weakest topic). Missing → hide the line or "—",
   never a number from the mockup.
4. Grep the whole diff for 52, 86, 38, 24, "Reported", "Tenses (had done)", "10-B", "Pratha" before finishing.
5a. **Owner (2026-11-09): not just Seema: every new user, and every NEW guide or guide step.** Each guide in
   `data/guides*` gets a `version` (bump it when steps are added). Home shows, as the FIRST card, the newest guide for this
   person's role whose version they haven't finished or dismissed (one card at a time, never a stack). ✕ → card goes away
   with a one-time line "You'll find it in Me → Guides" (with a tap to go there). Remember finished/dismissed per account
   as `users.guidesSeen: { [guideId]: version }` (one small write on ✕ / finish, no reads beyond the user doc already
   loaded; check the rules allow this field). New guide or bumped version → it comes back on Home once. Pure logic in
   `utils/homeGuide.js` + tests (new user, finished, dismissed, version bump, role filter, two-role person).
5. **Seema (2026-11-09): "the first guide should appear on Home before all else."** For a new user the guide card is the **first card on Home**, above subjects / children / classes, until finished or ✕ (then the one-time "guides are in Me → Guides" note). Teachers: the first card is "For teachers: start here" (the one-pager with DO IT buttons), then "Start your class"; parents: "For parents"; children: "Your first day". Add the other later spec items if not done yet: the Home guide card (Y1–Y3), "this phone or their own phone?" after Add a
   child, explanations on code screens, short Progress "Me" view, and the two-role (teacher + parent) layout.
6. Screenshots with the Demo School logins (parent, teacher) and the tester account (child) in G49-R.md.
Then G50 (learn first) is rebased on the fixed branch. `gemini(G49-R): done — review please`.

### G66 · [done] · gemini · ⭐ Feedback pipeline: children's ideas reach the owner and Claude (owner 2026-11-07)
Owner: "Pratha loves Duolingo and says lots of good things, but the app has no way to capture her feedback in a way
that you and I can review and plan." Plan first (`gemini(G66): plan — review please`), then build:
1. **Children:** Me → "💡 I have an idea for Apprec8!" + Home prompt once a week: prompts "What do you love in another
   app?", "What should we add?", "What's boring here?"; tap answers for everyone, a text box only for supervised
   accounts (free-text list; Remote Config `free_text_emails`), voice later (needs consent, see G62). Reuse the G62
   "Chamak asks" data shape if it exists by then.
2. **Owner:** Admin tools → "Ideas & reports": userFeedback + 🚩 reports + poll answers, newest first, filter by type,
   a "done" tick (owner-only rules: DR).
3. **Claude:** `scripts/admin/feedback.mjs` (like decisions.mjs, `--watch` optional) exports to
   `docs/agents/private/feedback.json`, which is **git-ignored** (add the folder to `.gitignore`): children's words never
   go to the public repo. First name + class only, no emails or uids.
Costs: one small read per owner visit; the export reads only new docs since the last run.

### G69 · [todo] · gemini · ⭐ Build "Chamku asks" (owner approved the G62 mockup, 2026-11-09)
Build the G62 mockups (docs/mockups/chamak-asks/) together with G66's pipeline: sticky on Home, one question at a
time, chains ("One more?" / "That's all for today", max ~5), thank-you with ⭐, owner results in Admin tools. Questions
from Remote Config / a Firestore doc (new polls without an app update); rollout `chamku_asks_uids` (Pratha first) →
`chamku_asks_all`. Tap answers for all, text only for supervised accounts; voice = v2. Rename the star to **Chamku**
in the app strings. **Theme (owner 2026-11-09): use the app's own theme, not the mockup's colours: `quizPalette` tokens (plum + gold), Nunito, light AND dark mode, calm style (docs/DESIGN_RULES.md), our cast instead of emojis where an icon is shown.** Plan first if it needs rules (DR). `gemini(G69): done`.

### G64 · [done] · gemini · ⭐ Parent's week misses today's practice (owner 2026-11-07, small fix)
Owner: "I can't see Pratha's progress for today." `components/parent/ParentWeekCard.js` loads the child's
questProgress only once per mount (useEffect on child.uid), so an open Progress screen never refreshes; and it
counts only quests for the child's class (practice papers are left out). Fix: reload on screen focus
(useFocusEffect) + pull-to-refresh on the family view (same reads, no extra cost beyond the reload); count practice
paper attempts in the week if they are stored per user (check `screens/paper/` storage; if they're only on the phone,
say so in the report). Also check the teacher's class view (TeacherClasses) refreshes on focus. **And (owner: "I had to select Science
because she only did Science; with 10 subjects I'd click every subject. Not intuitive"):** the week opens on **all
subjects combined** ("This week: 3 days · 42 min · Science 30 min, English 12 min"), then each subject practised
this week, most recent first, already expanded; subjects not practised this week fold into one line ("Not practised
this week: English, Word Power"). No subject picker as the first step. Same rule for the Sunday summary text if it is
per subject. Tests for the pure parts (utils/parentWeek.js). `gemini(G64): done`.

### G65 · [done] · gemini · ⭐ 🚩 Report a mistake on reading pages too (owner 2026-11-07: Pratha found a mistake, no way to report it)
Quiz questions have 🚩; study pages (old reader `components/common/reader/Apprec8Reader.js` and Learn cards
`components/learn/LearnCards.js`) don't. Add the same 🚩 "Something's wrong here" button (top corner, small) that
creates the same kind of report the quiz 🚩 creates (userFeedback / onQuestionReported path; check what the quiz
uses and reuse it) with contentId + card index / section, and tap-only reasons for children ("wrong fact", "confusing",
"spelling", "picture missing"). Children tap only (no free text, except supervised accounts). Tests for pure parts.
`gemini(G65): done`. Also bump **G59 Science pages up**: do Science right after Class 9–10 (owner: "old reading sheet,
no images, nothing fun, a dumpyard of text"), with a picture idea per card.

### G62 · [review] · gemini · Mockup first: "Chamak asks" (polls for children on Home; owner 2026-11-07)
Owner: "instead of me asking Pratha 3 questions: a sticky note on her Home, the mascot asks, she answers the app in
her own time, fun acknowledgements, a poll." **Draw, don't build:** HTML mockups (390 px, plum style, thumb zone) in
`docs/mockups/chamak-asks/` + PNGs: 1) Home with a sticky-note card "Chamak asks: Quick question!" (low on the
screen, ✕ = not now); 2) the question screen: Chamak's speech bubble, ONE question, 3–4 big tappable answers with
emoji (+ a text box only for children allowed to type, e.g. supervised accounts); 3) the thank-you: Chamak dances,
confetti, "+5 ⭐ for helping!"; 4) owner view: Admin tools → "Chamak asks results" (counts per answer + the typed
answers). Questions come from a Firestore doc / Remote Config so new polls need no app update. **Voice (🎤 Say it)
is v2:** note in the mockup that it needs a native speech library (next build), parent consent and a privacy-policy
update because a child's voice is sensitive data. First 3 questions: "What's the most fun thing you'd want here?"
(stories / games / challenges with friends / making quests), "Would you like to make a quest for other kids?",
"What would you do if a friend challenged you?". **Owner 2026-11-07:** it is also the children's feedback channel
(G66 part 1 = this) and a fun activity when there's no question (a riddle, a word of the day, "+5 ⭐"). Rollout:
**one child first** (Remote Config `chamku_asks_uids` list; the owner adds Pratha), then **everyone** (`chamku_asks_all`).
**Chains (owner):** one sticky can lead to the next (a poll → "why?" → a follow-up idea) **as long as the child
is happy to answer**: after each answer, Chamku offers "One more?" (big YES) or "That's all for today" (easy exit,
still thanked with ⭐). Questions are a small tree in the config (`next` per answer), max ~5 in a row, never pushy.
After the owner approves the mockup in the inbox, build it (JS only, OTA). `gemini(G62): done — mockup`.

### G70 · [todo] · gemini · Build the teacher's class screen (owner approved G57, 2026-11-09)
Build docs/mockups/teacher-class/ 1–3 in `screens/progress/TeacherClasses.js` (and the teacher Home card from G49
links here). Claude's two fixes: **"Remind all" goes to the parents** (never children); the "Turn on" summary button
uses the calm style. Demo School already has 2 pending students (G57). Same reads as today (no extra cost). **Owner 2026-11-09:** a teacher needs both "what do I do today" (the action cards) **and** "what's happening with my
students" (who practised, who's improving, who's stuck) on the same screen. **Every teacher is also a parent:** Home and
Progress must handle both roles cleanly: clearly separate "My class" (work) and "My children" (personal) sections,
both visible, the last one used opened first, no mixing of a teacher's own child into class lists. **Theme (owner 2026-11-09): use the app's own theme, not the mockup's colours: `quizPalette` tokens (plum + gold), Nunito, light AND dark mode, calm style (docs/DESIGN_RULES.md), our cast instead of emojis where an icon is shown.**
`gemini(G70): done`.

### G71 · [todo] · gemini · Build the parent's "yes" web page (owner approved G51, 2026-11-09) — after Claude reviews G50
Build docs/mockups/parent-link/ on GitHub Pages (FailedCommit/app-policies or a /yes page) + the one-time link
(expires 7 days) + a small HTTP function that records the consent like the in-app one and links the child. Plan first
(`gemini(G71): plan — review please`): rules + function = a deploy request for the owner. Privacy policy line.
**Theme (owner 2026-11-09): use the app's own theme, not the mockup's colours: `quizPalette` tokens (plum + gold), Nunito, light AND dark mode, calm style (docs/DESIGN_RULES.md), our cast instead of emojis where an icon is shown.** (the web page follows the same palette and font).

### G67 · [todo] · gemini · ⭐ Facts for the Progress redesign discussion (no code changes)
Owner 2026-11-07: "The Progress tab also needs a review. Pratha played but the weekly summary is blank, and the
Kids · Reported section is quite messy. A fresh discussion (not a rushed build) is required." Collect, don't fix:
1. **Screenshots** of every Progress view on the emulator: child (tester account, after playing 2 topics in 2
   subjects), parent (demo.parent), teacher (demo.teacher), and the owner's "Kids · Reported" view if you can reach
   it (else describe it from the code). Into `docs/agents/reports/G67/`.
2. **Why the weekly summary is blank:** play with the tester account (one Science topic, one English topic), then
   trace in code which fields the week reads (`stats` in questProgress? attempts? papers?) and whether they were
   written for that play (read only the TESTER's own docs; no real children's data). Say exactly what is missing.
3. **What each view shows today:** a short list per view (sections, order, what's empty, what repeats), and anything
   confusing or broken. Report `docs/agents/reports/G67.md`. `gemini(G67): done — facts for the Progress review`.

### G68 · [todo] · gemini · ⭐ Challenge words for strong readers (owner 2026-11-07: Pratha found the app boring)
Pratha (strong Class 5 reader) went back to paper sheets: "no good practice for antonyms and synonyms"; last year's
old Olympiad vocabulary quizzes had **real good words, high difficulty** and fun explanations ("Gemini's jokes").
(A stopgap that showed old tiles was reverted: the owner wants this proper fix within 2–3 days.)
1. Find where G28's 150 old vocabulary questions went in `data/wordPowerQuestData.js` (ids no longer say ieo) and
   check whether a Class 5 child can actually reach them (grade tags, locks). Report.
2. Add a **Champion** rung to Word Power's Synonyms & Antonyms (and Idioms): harder words (Classes 6–9 vocabulary),
   **open to any class** (no grade filter on this leaf; label "Challenge: for word lovers"), unlocked after the
   class-level topic or straight away for supervised / tester accounts. At least 60 new original questions + the best
   old ones, each with a **fun, witty explanation** (a short joke or memorable image, kid-safe), one right answer,
   Indian English, no exam names.
3. **G60 cleanup must keep** the old vocab quizzes and their explanations until this is live.
Report `docs/agents/reports/G68.md`; Claude spot-checks; owner re-seeds Word Power. `gemini(G68): done`.

### G56 · [done] · gemini · ⭐ Rehearse Seema's path with fresh accounts (find every stumble before she does)
Owner (2026-11-07): "I'm trying everything privately; an app that embarrasses her in front of her peers loses her
trust." On the emulator, latest published code (feat/quiz-redesign), **fresh throwaway accounts** (never real
people): 1) a new teacher signs up (first-run sheet → "I'm a teacher" → year of birth if shown), 2) Me → Join as a
teacher with a code from the Demo School admin flow if possible (else note what's missing), 3) a new parent signs up,
Add a child (this phone) → Play as → a topic, 4) the parent joins the teacher's class for that child with the consent
note, 5) the teacher approves, assigns a Grammar Pro topic, sees progress, 6) Me → Guides → For teachers: start here,
Start your class. **Write down every stumble:** confusing words, dead ends, errors, slow screens, anything that would
embarrass a teacher in front of colleagues: `docs/agents/reports/G56.md` with screenshots, sorted worst first, each
with a suggested fix. Don't change code. Delete the throwaway accounts afterwards (Me → Delete my account).
`gemini(G56): done — N stumbles`.

### G57 · [review] · gemini · ⭐ Mockup first: the teacher's class screen (owner tested it as demo.teacher, 2026-11-07)
Owner: "Reteach one thing asks to assign from below, several topics listed, very difficult to find; a direct action
button right there would be easy. Turning on the weekly summary is way below and not easy to see; colour difference
and bringing it up would be better. In a class of 32 the list is very long, teachers will have a hard time finding
kids. Need thinking before building." **Draw, don't build:** static HTML mockups, 390 px, plum app style, thumb zone,
in `docs/mockups/teacher-class/` (+ PNGs), 3 screens:
1. **Class screen:** header "10-B · English · 32 students" + SHARE CODE + a clear coloured switch "🔔 Monday summary:
   Off · Turn on". **Action cards at the top:** "3 waiting to join → Approve" (only if any); "Teach again: Reported
   questions (52% right) → ASSIGN PRACTICE ▶" (one tap, due in 3 days, changeable); "8 didn't practise this week ›".
   Summary line: "This week: 24 of 32 practised · Assigned: Reported speech, due Fri".
2. **Students list:** filter chips "Needs help (5) · Didn't practise (8) · Doing well (19) · All (32)" + search by name;
   one short row per student (name, one coloured status chip) → tap = that student's week.
3. **Assign a topic:** "Suggested" first (next in order, weakest for this class), each with ASSIGN; "All topics ›"
   folded, grouped by unit, with search; due-date chips (3 days / 1 week / pick).
Commit `gemini(G57): done — mockup`; Claude sends it to the owner's inbox. Also: **Demo School gets 2 students
waiting** to be approved (utils/demoSchool.js: two members with status "pending"; keep tests green) so teachers and
Google's reviewer can try approving.

### G52 · [done] · gemini · ⭐ Accuracy pass: Grammar Pro 1–6 (Class 9–10) before Seema and the owner check
Owner: accuracy first; Seema + owner check the questions while Google reviews, so find problems first. Read every
question in the Grammar Pro units (data/englishQuest/units: unitOrder 10+, grades 9–10; ~666 questions). For each one
check: exactly one correct option, the answer key matches, the explanation says why, Indian English spelling, CBSE
level, kid-friendly wording, no copied board-paper text. **Don't edit content.** Report in
`docs/agents/reports/G52.md`: a table (question id, problem, suggested fix), sorted most serious first, plus the count
of questions checked. Commit `gemini(G52): done — N issues`. Claude fixes them.

### G59 · [done] · gemini · ⭐ Learn cards for every study page (owner 2026-11-07: "lots of study pages are still the old reader")
66 study pages still open as the old long page (Claude's count): English 44 (26 bundled in data/englishQuestData.js
`studyPages` without `cards`, 18 old IEO pages that live only in Firestore `studyContent`), Science 18, Word Power 4.
Treasure Words is done (17/17). Give every one `cards` in the format of `utils/learnCards.js` (spec R), like the 21
English pages that already have them: **4–7 cards** each, `idea` cards (emoji, title, short text, ≤4 examples) and at
least **one `check` card** (one right answer + 2–3 wrong), same facts as the old page, kid-friendly, Indian English,
**no exam names** (IEO/NSO/IMO). The 18 old Firestore pages: read them (read-only), write NEW bundled pages with
cards under new ids, and point the nodes' study steps to them (keep the old docs; nothing deleted).
**Order:** Class 9–10 pages first (Seema's pilot), then Science, then the rest. `npm test` (learnCards + content tests)
passes. Commit per quest; report `docs/agents/reports/G59.md` (pages converted, any facts you were unsure of).
`gemini(G59): done — N pages`. Claude spot-checks; then the owner re-seeds (content only, no app update).

### G61 · [review] · gemini · Fun names for English units and topics (plan: docs/PRODUCT_LOVE_PLAN.md, Phase 1)
Owner: "I liked the chapter names, it was fun for kids, but things got very boring in text only." Propose a fun,
story-like name for every English Quest **unit** ("Noun Town", "Verb Volcano", "The Tense Time Machine"…) and a
playful subtitle for each **main topic**, keeping the grammar term visible (e.g. "Noun Town · Nouns"). Classes 1–5
playful, Classes 9–10 cool not childish. Indian setting welcome; no exam names; no brands or other games' names.
Also list the old chapter names you find (G60) that are worth reusing. Output a table in
`docs/agents/reports/G61-names.md` (current name → proposed name → why). **Don't change the app**: Seema checks the
English, Pratha votes, then Claude applies the chosen ones. `gemini(G61): done — names to review`.

### G63 · [review] · gemini · Character cast: concept sheet for the owner and Pratha to vote (owner 2026-11-07)
Owner: "why just one mascot? Many fun creatures: a Yoda-like (wise mentor), a tortoise, a monkey, a bee, an ant,
sometimes wearing specs, sometimes a lab coat." Make ONE concept sheet (image) in the app's style, original designs
(nothing that looks like Yoda or other film/game characters): ⭐ the star host (now "Chamak"; also show 4 name
options: Chamak, Chamku, Jugnu, Sitara, Dhruv), 🐢 wise old tortoise (mentor, explains hard things), 🐒 monkey
(playful, challenges and "oops, let's fix it"), 🐝 bee (spelling, words), 🐜 ant (teamwork, class goal), 🦉 owl
(storyteller, read-aloud). Each: a name idea (Indian-friendly, easy for 6-year-olds), one line of personality, its job
in the app, and 2 outfits (specs for reading, lab coat for Science). Consistent style, works on the dark theme,
calm colours. **Owner 2026-11-07: the star is "Chamku"** (Pratha confirms by vote); **characters replace small
emojis** in the app, so also deliver each character as small PNG icons (64, 128, 256 px; transparent) in 4 moods
(happy, thinking, cheering, oops) for guide cards, empty screens, celebrations and help. **Pratha (via owner):
Duolingo's mascot is far more fun to look at**, so make ours **expressive**: big eyes, clear emotions, simple shapes
that can animate (wave, jump, slump, dance). Also sketch an **avatar builder** for children (face, skin, hair, clothes,
glasses, hats; Indian children should see themselves) whose items are won from the treasure chest.
`docs/release/brand/cast/` + `gemini(G63): done — cast sheet`. Claude sends it to the inbox to vote.

### G60 · [review] · gemini · ⭐ Old content + cloud functions: inventory first (read-only), then cleanup after owner OK
Owner 2026-11-07: "get rid of older content and cloud functions; they waste space and might cost money or cause bugs.
Pratha is comfortable with the new stuff." **Step 1 now, read-only:** `docs/agents/reports/G60-inventory.md`:
- **Firestore:** every old collection / category group (Space `quest_nodes`, `categories` groups popular_quiz,
  classroom, story, book_summary, popular_read, olympiad tiles, old `quizQuestions`, `studyContent` IEO pages, games
  `gameVocabCategories`, `gameSpellingBee`, …): doc counts, approximate size, and **who still uses each** (grep the
  app + quest data: e.g. English Unit 1 reuses IEO study pages and quizzes; G59 moves the study pages, the quizzes need
  moving too). Mark each: delete / keep (still used). Owner 2026-11-07: old dogs / animals / plants content can go too (they come back as new quests). Keep a list of the old chapter names (owner liked them: fun for kids) in the report.
- **Cloud Functions:** deployed list (`firebase functions:list`) vs `functions/index.js`; for each: still called by
  the app? last used? Flag risky ones (HTTP admin endpoints in `functions/api/`). Also Storage folders and Firestore
  indexes no longer needed, and Artifact Registry / Cloud Scheduler leftovers. Rough monthly cost of each.
- A proposed **deletion plan in stages** (functions first, then content once nothing points to it) and a **backup
  plan** (export every doc to delete as JSON into a local folder outside git before deleting).
Commit `gemini(G60): inventory — review please`. **Deletes only after Claude reviews and the owner says OK** (DR).

### G54 · [done] · gemini · Teachers' one-pager → interactive (owner 2026-11-07)
Owner: "the teachers' guide is a one-pager; make it like the other guides, interactive, step by step."
In `screens/guides/TeacherStartScreen.js` (+ `data/teacherStart.js`): under each of the 4 jobs put a small
**DO IT ▶** button that starts the matching step of the "teacher-class" guide in `utils/guides.js` exactly like
GuideScreen.doStep does (setActiveGuide + markGuide + navigate), so the guide strip shows what to tap:
job 1 → step "join", job 2 → "share", job 3 → "approve", job 4 → "assign". Keep the page text and SHARE button.
Small change; branch from your G49 branch. `gemini(G54): done`.

### G58 · [done] · gemini · 🔊 Listen on the parent's consent note (owner: yes, 2026-11-07)
For parents who read little. On the consent notes (Join a class, Add a child, Link my child's own account): a
"🔊 Listen" button that reads the note aloud in the chosen language (Hindi `hi-IN`, English `en-IN`) with
expo-speech (already in the app, see components/quiz/ListenButtons.js); tap again = stop. JS only (ships by OTA).
`gemini(G58): done`.

### G55 · [todo] · gemini · PIN safety: plan approved WITH A REQUIRED CHANGE (Claude review 2026-11-09), build after owner OK
Your plan (docs/agents/reports/G55.md) is right on the UX (phone lock first, 1-hour delay without a lock, alert on
every change, Locked-out help, admin reset). **Security hole:** `switchToParentWithDeviceLock` trusts the client's
claim that a biometric check passed, so any child session (or a modified app) could get the parent's token. Replace
it with a **device-bound return ticket**:
1. `startPlaySession` (called by the **parent** session when starting Play as) creates a random one-time ticket, stores
   only its hash in `parentPins/{parentUid}.tickets` with expiry (12 h) and the child uid; returns the raw ticket.
2. The app stores it with **expo-secure-store `requireAuthentication: true`** (Android Keystore: opens only after the
   phone's fingerprint / face / device PIN).
3. `switchToParentWithTicket({ ticket })` (child session): server checks hash, unused, unexpired, child matches,
   then marks it used and issues the parent custom token. No ticket / no phone lock → the app PIN path as today.
4. `resetParentPin` only from the **parent** session; "delayed" (1 h) when the phone has no screen lock.
**Base on `feat/quiz-redesign`, not feat/simple-home.** Native libs (expo-local-authentication, expo-secure-store via
`npx expo install`) → ships with the next build; guard so OTA on 20.0.30 falls back to the PIN. Server parts = DR for
the owner. Write the revised plan section first (`gemini(G55): plan v2 — review please`).

### G53 · [todo] · gemini · ∞ redo, attempt 3: THE INFINITY ALONE (Claude's review of attempt 2)
Attempt 2 made the wordmark again; the owner asked to see **only the ∞ symbol**, and in the wordmark the ∞ still
reads like a fish / "∝", not an 8 lying down. Do exactly this: **no letters at all.** One sheet with 4 variants of
the ∞ alone, each large (400 px) and small (48 px): a perfectly **symmetric figure-8 on its side** (both loops the same
size, even stroke, like the maths symbol ∞), the **right loop's outer edge** breaking into small square pixels that
drift up-right; variants: solid gold, plum, white on plum, gold→plum gradient. Judge by: does a child instantly see
"8 lying down" / infinity? `docs/release/brand/infinity-v3/sheet.png`. `gemini(G53): done — infinity alone`.

### G51 · [review] · gemini · Mockup: the parent's "yes" web page (no app needed)
Spec: CODE_REVIEW.md "learn first + parent web link". Make a static HTML mockup (no backend), 390 px wide, in
`docs/mockups/parent-link/index.html` + a PNG screenshot: Apprec8 header, "<Child> wants to learn on Apprec8",
3 lines on what is kept (first name, class, answers; no ads, no chat; delete any time), a Hindi / English switch,
🔊 read-aloud button (browser speech), parent's name field, Mother / Father / Guardian chips, a tick "I am this child's
parent or guardian and I agree", big button "हाँ, मैं सहमत हूँ / YES, I AGREE", and a done state "Thank you! <Child>'s
stars are saved now." Calm, plum palette, thumb zone (button at the bottom), plain words for parents who read little.
Commit `gemini(G51): done — mockup`. Claude puts it in the owner's inbox.

### G49 · [rework] · gemini · ⭐ Build row Z: the simpler Home and Me (owner-approved 2026-11-06)
Owner: "earlier anyone could log in and learn right away; now too many taps". Approved mockups (with his fixes):
`docs/mockups/rowZ/Z1…Z4.png`. Claude is short on budget: **you build, Claude reviews.** Branch `feat/simple-home`
from `feat/quiz-redesign`, in your worktree. Small commits. Rules: docs/DESIGN_RULES.md (thumb zone, calm, fold
don't delete), no new Firestore reads beyond what Home/Progress already read (docs/COSTS.md).
1. **Child Home (Z1)** `screens/home/HomeScreen.js`: content sits LOW (empty space on top). Order: "FROM YOUR TEACHER"
   (assigned topics, existing teacher-task data, each row with ▶), "YOUR SUBJECTS" (one row per quest the child sees:
   icon, name, "Up next: <next leaf title>", thin progress bar, ▶), the My mistakes card, a small "Practice paper ›".
   Subjects ordered by last used (progress doc `updatedAt`). **▶ opens the next step directly** (the same step the map
   would glow): put the "next step" logic in a pure util (`utils/nextStep.js` + `tests/nextStep.test.mjs`) using
   `utils/questTree.js`; the screen navigates like EnglishQuestMapScreen.openStep does (study → Apprec8Reader, quiz →
   QuizDetails/QuizScreenV2, reading → ReadingScreen) with the same questContext. Tapping the row (not ▶) opens the map.
   No single global CONTINUE (owner: kids do English + Science + teacher work in one sitting).
2. **Parent Home (Z2)**: a grown-up with linked children sees one card per child, low on the screen: "<name>'s week"
   (days, minutes, % right, one topic to practise, from the data Progress → My children already uses) → tap = that
   child's week in Progress; bottom button "▶ LET <NAME> PLAY" (opens the existing Play as sheet).
3. **Teacher Home (Z3)**: a teacher sees one card per class, low: name, students, "N waiting" pill, "this week: X of Y
   practised", topic + due date, "Teach again: <weakest topic>" (same data as Progress → My classes) → tap = that class
   in Progress; bottom button "ASSIGN NEXT TOPIC" (opens the assign part of that class). Parent + teacher: both cards.
4. **Progress opens on the right view**: family for parents, classes for teachers, Me for children (today always "me").
   **Progress "Me" view stays short (owner 2026-11-07: "the list of all quests will grow too long"):** top = this
   week (stars, streak, minutes, one topic to practise); then "Your subjects" = only quests the child has started,
   most recent first, ONE line each (name, % done, strongest + weakest topic) → tap to expand its topics; quests not
   started fold under "Not started yet (N)" at the bottom. Same data as today (no new reads).
5. **Me (Z4)** `screens/profile/MeScreen.js`: content low. Need help (green row) + My class + My children + Guides,
   then one "More" row opening a sheet/screen with everything else (reminders, messages, join a class, link parent,
   edit profile, delete account, sign out…). Nothing deleted. ADMIN section stays for the owner.
6. **Empty states (owner's top confusion: "how do I add a child? how would a parent or teacher figure it out?"):**
   a grown-up with **no children and no class** sees, low on Home, one card "Who is learning?" with 3 big choices:
   **"My child, on this phone"** (→ Add a child: name + class + agree, then Play as), **"My child has their own
   phone"** (→ Link my child's own account: shows the 6-number code + one line "on your child's phone: Me → Link to my
   parent → type this code"), **"I'm a teacher"** (→ Join as a teacher). Each choice opens the existing screen. Plain
   words, no jargon. A parent with children but no class sees a small "+ Add another child" under the child cards.
   A teacher with no class yet sees "Type your school's code" (→ Join as a teacher).
   **Owner 2026-11-07:** after "Add a child" the app shows a login code even for a child who will use the parent's
   phone, which confused him ("test is a dummy child, how do I share this?"). After saving the child, ask first:
   "Will <name> use **this phone** or **their own phone**?" → this phone: go straight to Play as (no code);
   their own phone: show the code + SHARE CODE.
   **Every code screen explains itself (owner 2026-11-07: "this can confuse parents and teachers; add explanations for
   edge cases").** At the top, in plain words: who the code is for, when it's needed, and what to do if it isn't.
   - Child login code: "Only if <name> has their own phone or tablet. Uses your phone? You don't need this: tap
     **Play as** instead." + "Works once, for N hours. Lost it? Make a new one here."
   - Link my child's own account: "For a child who already has Apprec8 on their own phone. They type this code in
     Me → Link to my parent." + "No phone of their own? Use **Add a child** instead."
   - Class code (teacher / admin SHARE CODE): "Send it to parents. A parent types it with the child in Me → Join a
     class, agrees, and the child waits for you to approve." + "A child without a phone? The parent adds them on the
     parent's phone first (Add a child), then joins the class from Play as." (Check this path really works on the emulator; if not, report it instead of writing it.)
   - Teacher invite code (admin): "For the teacher only. They type it in Me → Join as a teacher; you approve them."
7. **Guide card on Home (owner 2026-11-06, mockups docs/mockups/rowY/Y1–Y3):** after sign-up, everyone sees their own
   guide as one calm card on Home (child: "Your first day · 1 of 4", parent: "For parents", teacher: "Start your
   class", grown-up with nobody yet: the tour), with progress, › to open it and ✕ to close. It shows on **every open
   until the guide is finished or ✕ is tapped**; after ✕, one green note "The guides are always in Me → Guides"
   (Got it), shown once, then never again (AsyncStorage per uid). It sits above the subject rows / child cards, still
   in the lower half. Reuse utils/guides.js state (guideState, loadGuideFacts).
8. Don't touch QuestMap/quiz screens, rules or functions. `npm test` passes; a Metro bundle builds.
9. QA on the emulator with the tester account (child view) + Demo School logins (parent, teacher): screenshots of the
   4 screens into `docs/agents/reports/G49/`, compare with the mockups, report differences in `G49.md`.
Commit `gemini(G49): done — review please` (Claude reviews, then the owner tests on the phone before any publish).

### G50 · [review] · gemini · Build learn first (only after Claude has reviewed G49)
Spec: CODE_REVIEW.md "learn first + parent web link" + mockups docs/mockups/rowX-learn-first/X6–X9. Branch
`feat/learn-first` from the G49 branch. Start by writing the plan in `docs/agents/reports/G50-plan.md` (which files,
how progress is kept on the phone and moved on the parent's yes, tests) and commit it **before** coding:
`gemini(G50): plan — review please`. Claude approves the plan, then you build.

### G46 · [done] · gemini · ⭐ Decisions inbox: review DR-21, deploy + start the sync (owner-approved: yes, 2026-11-06 "ok for DR-21")
Owner asked 2026-11-06: "implement push notifications and get approval on the app itself… Yes, No, More details,
Later" (CODE_REVIEW.md "Decisions inbox + DR-21"). Work in **Claude's folder** (`/Users/mohitchilkoti/Documents/projects/apprec8`).
1. Review: `utils/decisions.js`, `services/decisionsApi.js`, `screens/admin/DecisionsScreen.js`, `scripts/admin/decisions.mjs`,
   and the DR-21 block at the end of the local `firestore.rules` (`ownerDecisions`, `ownerConfig`, owner only).
   Blocking = anyone but the owner can read/write them, or the rules file differs from the live rules by more than
   the DR-21 block (check the live rules in Firebase console → Firestore → Rules). If blocking: `gemini(G46): blocked — …`.
**Steps 2–3 wait** until Claude changes "owner-approved: not yet" in this title to "yes". Without it: do step 1 + 4
(`node scripts/admin/decisions.mjs --dry` is fine: read-only) and commit `gemini(G46): reviewed — waiting for owner OK`.
2. Deploy: `firebase deploy --only firestore:rules --project apprec8-ca229` (from Claude's folder).
3. `node scripts/admin/decisions.mjs --dry`, then `node scripts/admin/decisions.mjs`, then leave
   `node scripts/admin/decisions.mjs --watch` running in the background (sync every 10 min). At every later check-in:
   if it stopped, start it again. Don't commit `docs/agents/decisions.json` (Claude does).
4. Report in `docs/agents/reports/G46.md`: review findings + the script's output lines (no emails, no uids).

### G45 · [done] · gemini · List students without a parent's yes (read-only, for spec X; after G43)
From Claude's folder: `cd /Users/mohitchilkoti/Documents/projects/apprec8 && node scripts/admin/unconsented.cjs`.
**List mode only: never `--apply`.** Report in `docs/agents/reports/G45.md`: how many, and for each only the first name,
class and sign-up date (no emails or uids: the repo is public). Commit `gemini(G45): done — N students`.

### G39 · [done] · gemini · QA run: tonight's changes (emulator, tester account)
Build: the dev app on the emulator (`docs/qa/QA_PLAYBOOK.md`, `scripts/qa/eq.sh`), latest `feat/quiz-redesign`.
Follow `docs/qa/OWNER_TESTING.md` sections **Guide quests**, **"Need help?" sheet** and **Old content hidden** (the tester
account is not the owner: old tiles except dog/animal ones must be gone, Space hidden). Check: the guide strip shows on
other screens and folds; "Guide ›" returns and the step ticks; Call opens the dialer only (never press call); dark and
light theme; no overlap of the strip with the main button. Report bugs with screenshots in `docs/agents/reports/G39.md`.
No code changes, no Firestore writes except what the tester account does in the app (no seeding, no deploys).

### G40 · [done] · gemini · Research: dog fact sheet with sources (no app content yet)
Pratha (Class 5) loves dogs, especially German Shepherds. Before any content is written, make a fact sheet in
`docs/content/dogs-factsheet.md`: each fact one line, kid-level, with a reliable source link (vet schools, AKC/Kennel
Club, WHO, Indian health ministry/NCDC, peer-reviewed). Cover: German Shepherd origin (Germany, 1899, herding), body and
senses (smell, hearing: give ranges and say when numbers vary by source), wolves → dogs, working dogs in India (police,
army, rescue, guide dogs), caring for a dog (food, exercise, vet, vaccines), **staying safe around dogs** (approaching,
body language, stray dogs, what to do after a bite: wash the wound with soap and running water for 15 minutes, tell an
adult, see a doctor the same day for rabies vaccine; check against WHO/NCDC wording). Mark anything disputed. Also list
3 places to get **free-licence photos** (licence named) of German Shepherds. No questions, no images, no app changes.

### G38 · [todo] · gemini · ⭐ Review: Demo School spec (do first, before G37: Seema wants to start the pilot)
Read "Spec for review: Demo School" at the end of CODE_REVIEW.md. Check against the code: will demo users really stay
out of `getLeaderboard` (functions/callable/userActions.js), `listKidProgress` (services/adminApi.js), class joins
(services/classesApi.js, functions/callable/schoolActions.js) and 🚩 tallies? Anything else that reads all users or all
attempts? Cost and security of an admin-only `seedDemoSchool` function. Write findings under a "Review: Demo School
spec (Gemini)" heading in CODE_REVIEW.md. No code.
**Update (Claude, night 5→6 Nov):** the code is built too: review it with the spec (section "Review request + Deploy
request DR-16"). Check the rules questions there. Deploy DR-16 only after the owner says OK.

### G37 · [todo] · gemini · English Unit 10 "Word Building: Prefixes & Suffixes" (Classes 3–8, draft)
The "coming soon" unit after Unit 9 (`nextUnitTeaser` in `data/englishQuest/units/index.js`). Olympiad papers test it.
**Model to copy:** `data/englishQuest/units/u8.js` (Class 3–5 style, Learn `cards` + `content`, warm-up 8, one practice
leaf per topic, a Champion leaf for Classes 5+, gates of 15 = 3 sub-topics × 5, endless, a short reading, Boss 12).
Make it `u10.js`, unitOrder 10, **grades [3, 4, 5, 6, 7, 8] on every node** (`forGrades`), add it to `extraUnits` after
u9, and set `nextUnitTeaser` to null (or to a new Unit 11 idea, Classes 1–8 only).
Topics: **un- / dis- / im- / in- / mis- / re- / pre-** (meaning + spelling: impossible, irregular, misspell) ·
**-ful / -less / -ness / -ment / -er / -or / -ist** (word class changes: careful, kindness, enjoyment, visitor) ·
**word families & spelling changes** (happy → happiness, beauty → beautiful, decide → decision).
**Read the "Lessons from review" section at the end of `docs/agents/GEMINI_ONBOARDING.md` first: Claude rejects
questions that break any of the 5 self-checks.** Words Class 3–5 children meet; kid-friendly sentences; one right answer;
no padded options. `npm test` must pass.
**Deliver:** `gemini(G37): Unit 10 Word Building` then `gemini(G37): done — N questions`. Claude reviews before seeding.

### G36 · [done] · gemini · Grammar Pro 2–6: the rest of Class 9–10 grammar (draft, CBSE board style)
Owner 2026-11-05: finish the Class 10 grammar syllabus for Seema's pilot; Claude reviews every question for accuracy.
**Model to copy exactly:** `data/englishQuest/units/b1.js` (Grammar Pro 1: Tenses): same helpers, `GRADES = [9, 10]`,
every node passed through `forGrades` (the `.map` at the end), Learn `cards` + `content` per topic, warm-up (8), one
"Board Style" practice leaf (10, "hard"), a Challenge gate (15 = 3 sub-topics × 5, sub-topic tags on every question),
`endless`, and a unit Boss (12). Read `docs/exam/cbse10-english-pattern.md` first (board format + topics).
Write one unit file per unit, add each to `data/englishQuest/units/index.js` after `b1`, unitOrder 11, 12, …:
- **b2 Modals** (unitOrder 11): ability / permission / possibility (can, could, may, might) · obligation & advice (must,
  have to, should, ought to) · deduction & past (must be, can't be, should have, could have, would for past habit).
- **b3 Agreement & Determiners** (12): subject–verb agreement (as well as / along with / each / neither…nor / a number of
  vs the number of / news, jury, scissors) · determiners (each, every, all, both, few, a few, little, less vs fewer,
  this/that/these) · editing lines with one agreement or determiner error.
- **b4 Reported Speech** (13): statements · questions (yes/no with if/whether; wh- with statement word order) ·
  commands, requests, thanks and dialogues with a frame ("The customer asked the worker …").
- **b5 Active & Passive** (14): all tenses incl. continuous passive · modal passive (must be done) and questions ·
  when to leave out the doer / which part starts the passive sentence.
- **b6 Editing & Prepositions** (15): error + correction across all topics · prepositions (since/for, prefer … to,
  superior to, within, unnecessary ones like "where is he at") · clauses (when that/which can be dropped).
**Rules (Claude rejects anything that breaks them):**
1. **Original questions only.** Board papers are a guide; never copy or lightly reword a board / CBSE question.
2. **Exactly one right answer.** Try every option in the sentence: if a wrong option also works in standard British/Indian
   English, change it. No style splits (no optional backshift in reported speech unless the frame forces it, no
   singular "their", no "took a decision"). In "Error → Correction" options, no second change may also fix the sentence.
3. Real-life frames like the board (message, notice, report, letter, diary, poster, conversation), teen-appropriate,
   no exam names in questions. Explanations: one clear line.
4. Right answer is the longest option in at most 40% of a unit's questions; every wrong option has a `mistakeTag`.
5. `npm test` passes after each unit.
**Deliver:** one commit per unit `gemini(G36): Grammar Pro N <topic>`, then `gemini(G36): done — 5 units, N questions`.
Claude reviews each before it goes to Seema.

### G35 · [done] · gemini · Science Papers 2, 3 and 4 (draft, original questions, Class 5)
Owner 2026-11-05: Pratha finished Paper 1; "we will need far more practice papers". Write **three new Science papers**,
each exactly like `data/papers/sciencePaper1.js` (copy its shape, helpers and comments):
- Files `data/papers/sciencePaper2.js`, `sciencePaper3.js`, `sciencePaper4.js`; ids `paper-sci-2/3/4`, titles "Paper 2/3/4",
  `minutes: 60`, `grades: [5]`, **`draft: true`**. Add each to `PAPERS` in `data/papers/index.js`.
- Parts: 10 Thinking skills (series, codes, directions, ranking, calendar, family; **work every answer out twice**)
  · 35 Science (spread over Science Units 1–5: living world, body & health, matter/forces/earth, environment,
  light/sound/magnets) · 5 Champion (3 marks each, harder, two-step).
- **Make them harder than Paper 1** (Pratha, 2026-11-05: "the paper was easier than the real exam"). Aim at the real
  Class 5 paper's level: more two-step questions (read a table / an experiment, then reason), fewer one-fact recalls,
  wrong options that are tempting (common misconceptions), Champion questions that need two ideas together.
- **Original questions only.** Use `docs/exam/nso-pattern.md` and the papers in `docs/exam/papers/nso/` only as a guide to
  topics, styles and difficulty. Never copy or reword a past-paper question. No question already in a quest or in Paper 1.
- Every question: 4 options, one right, every wrong option has a `mistakeTag`, `topic` = a real Science quest node,
  a one-line kid-friendly `explanation`. No wrong option that is also true. No exam names anywhere.
- The right answer may be the longest option in at most 40% of questions (the test checks).
- Run `npm test` (tests/papers.test.mjs checks every paper in `PAPERS`). All must pass.
**Deliver:** one commit per paper `gemini(G35): Science Paper N`, then `gemini(G35): done — 3 papers, 150 questions`.
Claude reviews every question before the owner sees them; nothing is shown to Pratha until then (`draft: true`).

### G34 · [done] · gemini · ⭐ Deploy DR-15: stars for practice papers (owner-approved: yes, 2026-11-05)
**Owner-approved: yes** ("OK for stars", 2026-11-05). From Claude's folder (branch `feat/quiz-redesign`, commit `ce8b151` or later):
1. `cd functions && node -e "require('./index.js')"`: loads without errors.
2. `firebase deploy --only functions:recordQuizResult --project apprec8-ca229`. Only this one function. If it fails, STOP and report.
**Deliver:** `docs/agents/reports/G34.md` (outputs), commit `gemini(G34): done — …`.
**Rollback:** redeploy `recordQuizResult` from the commit before `06dee6e` (papers then earn 0 stars; nothing else changes).

### G33 · [done] · gemini · ⭐ DR-14 backfill, second run (owner-approved: yes, 2026-11-05)
**Owner-approved: yes** (part of DR-14: "run the backfill again after the next publish"; publish `cb0fc89e` done 2026-11-05).
From Claude's folder: `node scripts/admin/backfillQuestId.cjs` (dry run), then `node scripts/admin/backfillQuestId.cjs --apply`
if it lists any docs. Nothing else. **Deliver:** `docs/agents/reports/G33.md` with both outputs, commit `gemini(G33): done — …`.

### G32 · [done] · gemini · ⭐ Deploy DR-14: dashboard index + backfill (owner-approved: yes, 2026-11-05)
**Owner-approved: yes** for exactly these steps ("DR-14 OK to deploy? yes", 2026-11-05). Do this after G30, before G31.
Run from **Claude's folder** `/Users/mohitchilkoti/Documents/projects/apprec8` (branch `feat/quiz-redesign`).
1. `firebase deploy --only firestore:indexes --project apprec8-ca229` (adds the `questProgress.questId` field index).
   If the CLI asks to DELETE indexes that are not in the file, answer **No** and report.
2. `node scripts/admin/backfillQuestId.cjs` (dry run; expect about 2 docs), then `node scripts/admin/backfillQuestId.cjs --apply`.
3. Do NOT deploy rules or functions here. Do NOT publish an app update.
**Deliver:** `docs/agents/reports/G32.md` (each step's output or error text), commit `gemini(G32): done — …` on your branch.
**Rollback:** nothing to undo (one extra index and one extra field; the app works with or without them).

### G31 · [done] · gemini · Second review of English Unit 8 + Science Unit 5 (accuracy, report only: change nothing)
Read `data/englishQuest/units/u8.js`, `u9.js` and `data/scienceQuest/units/u5.js`, `u6.js` (commit `e1ec069` or later). For EVERY question
(558, incl. `data/papers/englishPaper1.js` + `sciencePaper1.js`; Science Unit 6 answers are recomputed by `tests/reasoningCheck.test.mjs`, so check its wording and level): warm-ups, practice leaves, gates, Champion, Boss, reading) check (for Science: is the fact true for Class 3–5 textbooks?):
1. The ✓ answer is right in standard British/Indian school English.
2. **No wrong option also works** (in grammar AND in meaning). Linking words overlap, so try each option in the sentence:
   e.g. "The baby slept although the dog barked" makes sense, so "although" can't be a wrong option there.
3. Learn pages state each rule correctly for a Class 3–5 child; the reading's `evidence.text` is an exact part of its paragraph.
4. Kid-friendly wording; no exam names.
**Deliver:** `docs/agents/reports/G31.md`: a table `quizId · question # · problem · suggested fix` (empty table = all fine),
commit `gemini(G31): done — N findings`. Don't edit u8.js; Claude fixes.

### G30 · [done] · gemini · ⭐ Deploy DR-12 + DR-13: cost guards (owner-approved: yes, 2026-11-05)
**Owner-approved: yes** for exactly this step (DR-12: "cap server copies as long as it doesn't break stuff"; DR-13: "OK DR-13", 2026-11-05).
Run from **Claude's folder** `/Users/mohitchilkoti/Documents/projects/apprec8` (branch `feat/quiz-redesign`, commit `72d0c27` or later).
What changes: DR-12 `functions/common/config.js` (`maxInstances: 10`, long admin jobs `2`); DR-13 `getLeaderboard` and
`getClassLeaderboard` keep a 10-min server-only cache (`leaderboardCache/*`, `classes/{id}/cache/board`), `approveMember` clears it.
Since the last full deploy (G27) the only other function change is DR-11, already live (G29). Rules: no change.
1. `git -C /Users/mohitchilkoti/Documents/projects/apprec8 status`: clean except docs; branch `feat/quiz-redesign`.
2. `cd functions && node -e "require('./index.js')"`: loads without errors.
3. `firebase deploy --only functions --project apprec8-ca229`. If any function fails, STOP and report the error text (don't retry in a loop).
4. `firebase functions:list --project apprec8-ca229`: every function still listed.
5. Smoke test from the CLI is not needed; Claude checks the app.
**Deliver:** `docs/agents/reports/G30.md` (each step: done / error text), commit `gemini(G30): done — …` on your branch.
**Rollback:** remove the `maxInstances` lines and redeploy (owner OK already covers the rollback).

### G29 · [done] · gemini · ⭐ Deploy DR-11: teacher invite functions (owner-approved: yes, 2026-11-05)
**Owner-approved: yes** for exactly this step ("OK to deploy", 2026-11-05). Run from **Claude's folder**
`/Users/mohitchilkoti/Documents/projects/apprec8` (don't edit any file there). No rules change.
1. `git -C /Users/mohitchilkoti/Documents/projects/apprec8 status`: no uncommitted code changes (docs are fine). Branch `feat/quiz-redesign`.
2. `cd functions && node -e "require('./index.js')"` must load without errors.
3. `firebase deploy --only functions:createTeacherInvite,functions:redeemTeacherInvite,functions:classTeam,functions:decideTeacherRequest --project apprec8-ca229`
   (only these four; if it fails, STOP and report the error text).
4. Check: `firebase functions:list --project apprec8-ca229` shows all four in us-central1.
**Deliver:** `docs/agents/reports/G29.md` (each step: done / error text), commit `gemini(G29): done — …` on your branch.
**Rollback:** `firebase functions:delete <name> --project apprec8-ca229` for the four (nothing else uses them).

### G28 · [done] · gemini · Move the old vocabulary quizzes into Word Power (accuracy-checked)
**Why (owner 2026-11-04):** the old IEO content is being retired; its 6 vocabulary quizzes (150 questions) must not be lost.
**Source:** `tests/fixtures/ieo_questions.json` (in Claude's folder; read only): `4ieo11-synonyms-q1`, `-q2`, `4ieo11-antonyms-q1`,
`-q2`, `4ieo11-idioms`, `4ieo11-vocab-q1`.
**Do:** on a new branch from `feat/quiz-redesign`, convert them to V2 questions with `q()` in `data/wordPowerQuestData.js`: put
synonyms/antonyms into the synonym topic (as an extra practice leaf "Word bank 1/2", subtopic-tagged), idioms into the idioms
topic (extra practice leaf), vocab into word choice. **Check every question** like Claude did for the old IEO quizzes (two right
answers, wrong meanings, US spelling, kid-unfriendly words, no explanation → write one) and fix it; drop duplicates of questions
Word Power already has. Every wrong option gets a mistakeTag. Lessons file applies (no joke options, length tell, no labels).
Prefer plain questions over "Fill in the blank:" when the blank is obvious (Seema: the phrase is too repetitive).
**Deliver:** branch `content/wp-old-vocab`, report G28 (counts kept / fixed / dropped, with ids), `npm test` green,
commit `gemini(G28): done — …`.

### G25 · [done] · gemini · Separate "Word Power" quest (owner decision): restructure G22 + G23 (do this first)
**Why (owner 2026-11-04):** vocabulary is its own tree, not English Quest Unit 4: it must be open from day one (Pratha is in
Unit 1; IEO is on 17 Nov) and not locked behind grammar Bosses.
**Do (base: your `content/eq-u5-error-dialogue` branch, which has G22 + G23):**
1. New quest module `data/wordPowerQuestData.js` (`QUEST_ID = "word-power"`, title "Word Power", tile `carouselGroup: "quest"`,
   `order: 2`, description e.g. "Words, spelling, idioms and everyday English", `draft: false`), registered in `data/quests/index.js`.
2. Move into it: G22's three topics (synonyms & antonyms, spelling, word choice) as Unit 1 "Word Power", and G23's dialogue +
   idioms topics as Unit 2 "Everyday English". Renumber unitOrder from 1. Keep question content and order; ids may stay as they are
   (they must stay unique; nothing is seeded yet).
3. **Spot the error stays in English Quest** (it's grammar): make it English Quest Unit 4 "Spot the Error" (its own gate + Boss),
   after Unit 3; teaser → Unit 5.
4. Class tags per `docs/CONTENT_GUIDE.md` §9 (topic from its first class; harder leaves tagged by class).
5. `npm test` green (all quests checked, ids unique). Report G25: what moved where, counts.
Commit `gemini(G25): done — …`. Claude then reviews all G22/G23 questions for accuracy.

**Claude's review (`c186564`), fixes 1.** All Word Power + Spot the Error questions read; every key is right. Fix in place:
1. **Two right answers:** `wp-colloc-nature-quiz` q1 (baking / burning heat are natural too: use non-collocations, e.g. "fried / toasted");
   `wp-dialogue-gate-pool` q14 (ignited / kindled curiosity are fine too); `wp-spelling-gate-pool` q15 ("program" is a correct US
   spelling: use another word, e.g. colleague / collegue / colleage / coleague); `wp-synant-gate-pool` q12 (a "dangerous" cave fits:
   add "and stayed warm and safe" to the sentence).
2. **Two errors in one sentence:** `eq-u4-test` q4 part C "to the teacher question" → "to the question". `eq-u4-test` q8: "o'clock".
3. **Answer given away / wrong meaning:** `wp-spelling-gate-pool` q12 ("calendar record of days" → "a chart of the days and months of
   a year"); q13 (twelfth = "coming after the eleventh", not "twelve in count"); q3 (occurred = "happened, past tense of occur").
4. **Idiom form:** `wp-idioms-gate-pool` q10 → "the lion's share" (apostrophes are fine in gates).
5. **Modern usage:** `eq-u4-errors-gate-pool` q6 ("their own pencil" is accepted today): replace with a clear error.
6. **"No error" is never right** in 37 Spot-the-Error questions: make it the right answer in ~4 of them (rewrite those sentences correctly).
7. **Joke / rude replies in dialogues** (lesson 3): e.g. "Give me money instead", "I will ignore you", "You are noisy too",
   "We were forced to come". IEO options are polite but wrong for the situation or ungrammatical ("Yes, I mind", "Certainly not").
   Fix in all dialogue gates + `wp-u2-test`; practice quizzes too if time.
8. Small: `wp-synant-context-quiz` q2 tranquil ≠ silent (use "hushed"); `wp-u2-test` q5 "a kind and thoughtful thought" → "a kind idea".
Seema reviews English after this. Commit `gemini(G25): fixed 1 — …`.

### G26 · [todo] · gemini · Emulator smoke test: calm pass 1 (20 min max)
**Owner-approved:** emulator use while `AWAY: yes`. No seeding, no deploys.
**Wait first:** don't start while a build runs (`pgrep -f "eas build"`): run `sleep 300` and check again (don't end your turn).
**Setup:** your folder → `git checkout --detach feat/quiz-redesign`, `npx expo start`, emulator `Pixel_8a_API_35`,
`scripts/qa/eq.sh prep`, restart the app, tester account. If the emulator says "isn't responding" twice, stop and report blocked.
**Check (light mode, screenshots):** Home (dark "Next up" card, two chips, shelves, CONTINUE at the bottom) · open a quiz node:
ONE start screen, START at the bottom, quiz starts at once · a "What kind of sentence…" question shows a small label + big
sentence card · answer most questions wrong → results say "Let's try that again" with a thinking Chamak · map: finished
topics show one chip that opens on tap · Me: big profile picture, no "Me" title.
**Deliver:** branch `gemini/g26-smoke`, `docs/agents/reports/G26.md` (item · PASS/FAIL · screenshot · note), commit
`gemini(G26): done — P pass, F fail`, then `eq.sh unprep` and close the emulator.

### G21 · [done] · gemini · IEO exam pattern notes (do this before anything else)
**Why:** IEO is on 17 Nov; Claude needs the real difficulty to judge English Quest (the teacher says it's too easy for aspirants).
**Papers:** `/Users/mohitchilkoti/Documents/projects/apprec8/docs/exam/papers/ieo/` (read only; never copy questions).
**Do:** like G18: per paper class / level / year; `docs/exam/ieo-pattern.md` with sections and marks, topic weightage for Class 5,
question styles with *invented* examples, the Achievers section's difficulty, and a **gap list vs English Quest Units 0–3**
(topics missing, and where our questions are easier than the papers: name 3–5 concrete examples of each).
**Deliver:** branch `gemini/g21-ieo-patterns` (base `feat/quiz-redesign`), report G21, commit `gemini(G21): done — N papers read`.

### G16 · [done] · gemini · Science Unit 1 "The Living World" for Class 5
**Why:** NSO on 19 Nov; Pratha is Class 5. **Base:** `feat/quiz-redesign`. **Guide:** `docs/CONTENT_GUIDE.md` (all of it, §8 for Science).
**Do:** in `data/scienceQuestData.js`, unit `sq-u1`: keep or improve `sq-living`, then add 2–3 more topics from SOF's published
NSO Class 5 syllabus that fit "living world" (e.g. plants, animals and adaptations, human body / food and health). Each topic:
Learn page + warm-up quiz (6–8 questions), 1–2 practice leaves tagged by sub-topic, a gate (pool ≥ 15, 3 sub-topics × 5),
then a Unit Boss (pool ≥ 15). Tag every node with `forGrades` (Class 5 must see all of them; add 4 / 6 only where true).
Original questions only; NSO style (some "Which of these…", some picture-free reasoning); kid-friendly explanations.
Keep `quest.draft: true`.
**Deliver:** branch `content/sq-u1-living-world`; `docs/agents/reports/G16.md` (topics, question counts, anything unsure);
`npm test` green. Commit `gemini(G16): done — N topics, Q questions`. Claude checks accuracy before the owner sees it.

**Claude's review of your G16 (`a043ebb`), fixes 1. Do this after G18 so the fixes follow the real NSO patterns.**
Good: all 102 answer keys are right, explanations are clear, grade tags make sense. Fix on the same branch, append-only rules apply
(fix in place, keep positions):
1. **Outdated fact:** Siberian cranes no longer reach India (last seen at Bharatpur in 2002). `sq-animals-warmup` q6 and
   `sq-u1-test` q11 say they come every winter. Use a bird that still does (e.g. Amur falcon to Nagaland, bar-headed goose,
   greater flamingo to Gujarat), or ask in the past tense.
2. **Unclear wording:** `sq-plants-warmup` q6 "plants potato tubers with small 'eyes' cut out" reads as "eyes removed". Say
   "plants pieces of potato, each with an 'eye'".
3. **Joke distractors (the big one).** Many wrong options can be ruled out without knowing any science, which makes NSO
   practice too easy: e.g. "Because crystals can run", "They turn the leopard into a herbivore", "Apples and mangoes",
   "They turn into metal objects", "Because the balloon eats food", "made of cotton" (clouds). NSO options are all plausible.
   Replace them with real misconceptions (e.g. for "how do fish breathe": lungs / skin / spiracles), one per wrong option,
   with a fitting mistakeTag. Priority: gates and the Boss, then warm-ups and practice.
5. **Length tell:** the right answer is the longest option in 69 of 102 questions (68%); a kid can score by picking the
   longest. `npm test` now fails above 40% (`tests/content.test.mjs`). Make wrong options as long and specific as the right one.
4. Small: `sq-plants-warmup` q2 says food is in the cotyledons; true for beans and gram, but maize and rice keep it in the
   endosperm. Add "in beans and gram" or pick a dicot in the question. Ferns have sori, mosses have capsules (gate q14 explanation).
**Deliver:** commit `gemini(G16): fixed 1 — <counts>`, and add a "fixes 1" section to `docs/agents/reports/G16.md` listing every changed question id.

**Claude's review of fixes 1 (`031392a`), fixes 2:** facts and wording are fixed and the distractors are much more plausible. Two problems:
1. **Overcorrected length:** the right answer is now never the longest option (0%). "Never pick the longest" is as easy to game as
   "always pick it". Aim for 20–35%. `npm test` now fails below 10% and above 40%.
2. **Too wordy for Class 5:** e.g. "It grows by external deposition of molecules, lacking cells, metabolism, or reproduction",
   "inert mineral stone". Options must be short (≤ 14 words; `npm test` checks) in words a 10-year-old uses. Same length
   for all four options of a question, not all long.
3. **NSO styles** (from your `docs/exam/nso-pattern.md`): make at least 5 gate/Boss questions in styles A (analogy),
   B (multi-statement), E (experiment) or G (matching). Append new questions at the end of the pools; don't reorder.
Commit `gemini(G16): fixed 2 — …` with a "fixes 2" section in the report.

### G17 · [done] · gemini · English Unit 3 Subject-Verb Agreement
**Why:** next IEO grammar unit. **Base:** `feat/quiz-redesign`. **Guide:** `docs/CONTENT_GUIDE.md` §2–7 (unit file template,
`data/englishQuest/units/u3.js`, register in `units/index.js`, `nextUnitTeaser` → Unit 4).
**Do:** 3 topics (e.g. singular/plural subjects, tricky subjects: each / everyone / pair nouns, there is / there are), each with
Learn page, warm-up, practice leaves by sub-topic, gate; Unit Boss + one reading. Same rules as Unit 2.
**Deliver:** branch `content/eq-u3-sva`; `docs/agents/reports/G17.md`; `npm test` green. Commit `gemini(G17): done — …`.

**Claude's review (`f57fea2`), fixes 1.** All 105 questions + the Clock Tower reading read; keys are right. Fix in place:
1. **British spelling (IEO uses it):** `eq-u3-test` q5 answer "practice" (verb) → "practise" (options: practises / practised /
   is practising; explanation too). Reading `eq-read-clock-tower`: "cozy" → "cosy".
2. **Grammar error:** `eq-u3-tricky-quiz` q2 "Rohan and Kabir ___ best friends since kindergarten": "since" needs "have been",
   so no option is right. Drop "since kindergarten" (e.g. "best friends in class").
3. **Apostrophe dodge broke the grammar:** `eq-u3-tricky-pairs-quiz` q6 "on the teacher table" and `eq-u3-tricky-gate-pool` q15
   "from the captain belt". Rephrase without a possessive ("on the table", "from a hook").
4. `eq-u3-tricky-gate-pool` q9: "Pencil or pen" → "A pencil or a pen".
5. UNSURE (keep, just note it in the report): `eq-u3-tricky-pairs-quiz` q5 "The cricket team ___ practising": British usage also
   allows "are". Indian school grammar says "is", so keep.
Commit `gemini(G17): fixed 1 — …`.

### G19 · [done] · gemini · Science Unit 2 "Human Body & Health" for Class 5
**Why:** your G18 notes: Human Body & Health is the biggest NSO Class 5 domain (8–10 questions per paper), and we have none.
**Base:** `feat/quiz-redesign` (has your pattern notes). **Guide:** `docs/CONTENT_GUIDE.md` §8, `docs/exam/nso-pattern.md`, `docs/agents/LESSONS.md`.
**Do:** unit `sq-u2` in `data/scienceQuestData.js` (or `data/scienceQuest/units/u2.js` + registration, your choice): 3 topics,
e.g. bones, joints and muscles · digestion, teeth and food (nutrients, balanced diet, deficiency diseases) · nervous system and
sense organs (+ communicable diseases if it fits). Same shape as Unit 1 (Learn page, warm-up, practice by sub-topic, gate ≥ 15,
Boss ≥ 15). Tag `forGrades` honestly. At least a third of gate/Boss questions in NSO styles A/B/E/G (one right answer only).
Short, kid-level options; the right answer is the longest about a quarter of the time. Change Unit 1's `nextUnitTeaser` /
teaser unit so Unit 3 shows as "coming soon". Keep `quest.draft: true`.
**Deliver:** branch `content/sq-u2-human-body` (base: your G16 branch once fixes 2 is done, so Unit 1 + 2 sit together);
`docs/agents/reports/G19.md` incl. your 5 least-sure questions; `npm test` green. Commit `gemini(G19): done — …`.

**Claude's review (`43c599c`), fixes 1:** all 96 answer keys right, NSO styles well done. Fix in place:
1. Joke distractors → real misconceptions: `sq-bones-gate-pool` q10 ("knee joint rotating in full circles", "knee bone turning
   into muscle"), `sq-food-gate-pool` q10 ("saliva turns into solid rock", "enamel evaporates"), `sq-nervous-gate-pool` q7
   ("closes and turns yellow"), `sq-u2-test` q13 ("long written message to the cactus", "electric shock").
2. `sq-food-gate-pool` q14: apples have little iron; use dates or green leafy vegetables.
3. British spelling: "orthopedic" → "orthopaedic" (`sq-bones-gate-pool` q9).
Commit `gemini(G19): fixed 1 — …`.

### G24 · [todo] · gemini · Syllabus check: NSO + IEO Class 5 vs our quests (before writing more units)
**Source:** `/Users/mohitchilkoti/Documents/projects/apprec8/docs/exam/syllabus/syllabusclass5.pdf` (owner: Class 5 syllabus for IEO,
NSO and IMO + last 5 years' patterns; read only, never copy text into git).
**Do:** write `docs/exam/syllabus-class5.md` in your own words: for NSO and IEO, the official topic list for Class 5, each topic
marked **covered** (unit + topic id) / **partly** / **missing**, plus the section pattern (questions, marks) per year if it
changed. Note IMO topics briefly for later. Then the **plan**: which topics G22, G23 and G20 must include so nothing on the
syllabus is missed, in priority order (what appears most in the papers first). If a Science node's `forGrades` contradicts the
syllabus, list it.
**Owner decision (read `docs/CONTENT_GUIDE.md` §9):** quests are subject quests for every olympiad; each topic is a ladder by
class. So in the plan, give each topic its **first class** and what changes in difficulty per class (3 → 8), not only Class 5.
**Deliver:** branch `gemini/g24-syllabus` (base `feat/quiz-redesign`), report G24, commit `gemini(G24): done — …`. Claude updates
G22 / G23 / G20 from your plan.

### G22 · [todo] · gemini · English Unit 4 "Word Power" (IEO vocabulary) for Class 5
**Why:** your G21 notes: synonyms, antonyms, spelling and word choice are 20–25% of IEO, and we have none. IEO is on 17 Nov.
**Base:** `feat/quiz-redesign` (has Unit 3). File `data/englishQuest/units/u4.js`, register it, teaser → Unit 5.
**Do:** 3 topics: synonyms & antonyms (Class 5 IEO level, e.g. brave/courageous, scarce/plentiful) · spelling (pick the
correctly spelt word; common traps: separate, necessary, beautiful, receive) · word choice & collocations (flames flicker,
people shiver). Each: Learn page with word lists + examples, warm-up, practice by sub-topic, gate ≥ 15; Unit Boss ≥ 15.
Distractors must be near-misses (all four words close in meaning or spelling), never silly. British spelling.
Practice questions: one blank, no apostrophe inside the quoted sentence. Include 1 reading with a glossary.
**Deliver:** branch `content/eq-u4-vocab`, report G22 with your 5 least-sure questions, `npm test` green, commit `gemini(G22): done — …`.

### G23 · [todo] · gemini · English Unit 5 "Spot the error, dialogue & idioms"
**Base:** your G22 branch. **Do:** 3 topics: spot the error (a sentence in 4 parts A/B/C/D, one wrong; or "No error"), dialogue
(choose the right reply in a short conversation, as in IEO Q41–45), common idioms (meaning, in context). Same shape and rules.
**Deliver:** branch `content/eq-u5-error-dialogue`, report G23, commit `gemini(G23): done — …`.

### G20 · [done] · gemini · Science Unit 3 "Matter, Forces & Earth" for Class 5
**Base:** your G19 branch. Same rules as G19. 3 topics, e.g. states of matter, changes and separation · forces, energy and
simple machines · Earth, rocks and the Moon. **Deliver:** branch `content/sq-u3-matter-forces-earth`, report G20, commit `gemini(G20): done — …`.

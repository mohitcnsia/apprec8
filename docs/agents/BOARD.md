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

### G15 · [todo] · gemini · English Unit 2 answer-key review
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

### G18 · [todo] · gemini · NSO (and IEO) exam pattern notes from the owner's papers
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

### G27 · [todo] · gemini · ⭐ Deploy DR-8 + Finding 22 + DR-9 + DR-10 (owner-approved: yes, 2026-11-04)
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

### G47 · [todo] · gemini · ⭐ URGENT: start the Decisions sync again (it stopped at ~19:00 on 6 Nov; script updated)
`scripts/admin/decisions.mjs` now also closes inbox cards the owner answered in the chat (`via: "chat"` in
decisions.json). In Claude's folder: stop the running `node scripts/admin/decisions.mjs --watch`, run
`node scripts/admin/decisions.mjs --dry` (read-only; expect "closed in the inbox" to list 4 ids on the real run), then
start `--watch` again in the background. Commit `gemini(G47): done` with the dry-run output (no emails, no uids).

### G48 · [todo] · gemini · ⭐ Brand set: 3 logo + icon directions (owner asked 2026-11-06)
Owner: "app-specific logos and images will give us much better control and feel". **His logo idea:** the 8 lies down
as **∞**, and its **right loop breaks into small digital blocks that scatter into space** (infinite learning, digital).
Rough sketch by Claude: `docs/release/graphics/feature-graphic-v4.png`; make it beautiful. He **dislikes green check
circles**. Use your image generation. If you have none, commit
`gemini(G48): blocked — no image tool` and stop.
**Brand facts:** name "Apprec8", said "appreciate" (8 = "ate"). Learning + well-being for Classes 1–12 in India, for
children, parents and teachers. Calm, warm, kid-friendly; never neon. Palette from the app: plum #3b0940, #85508a,
light #F5D2F8, star gold #dcb51b; must work on the dark theme. Mascot: **Chamak**, the smiling star already in the app
(components/auth/HeroScene.js): keep him. References: `feature-graphic-v4.png` (the dissolving ∞), `feature-graphic-v3.png` (plain ∞).
**Per direction (3 different directions, all built on the dissolving ∞):** wordmark "apprec∞", app icon 512×512 (no small text), Android adaptive icon
foreground (1024×1024, logo inside the central 66%), a one-colour notification mark (white on transparent, 96×96),
7 subject icons 256×256 (English, Science, Word Power, Treasure Words, Maths, Reasoning, Well-being), and a
1024×500 feature graphic. Original work only (no copying other brands' styles or characters). No green checks.
**Output:** `docs/release/brand/<direction-name>/…` PNGs + one overview sheet per direction (all assets on one image),
report `docs/agents/reports/G48.md` (what each direction means, 3 lines each). Don't change any app files.
Commit `gemini(G48): done — 3 directions`. Claude puts them in the owner's Decisions inbox to pick one.

### G46 · [todo] · gemini · ⭐ Decisions inbox: review DR-21, deploy + start the sync (owner-approved: yes, 2026-11-06 "ok for DR-21")
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

# Gemini Engineering Log

## Project Ground Rules & Architecture
0. **Team roles:** owner decides, Claude builds, Gemini reviews + deploys + runs QA. Who merges, deploys, seeds and releases is written down in `docs/TEAM.md` (single source of truth).
1. **Media Asset Management:** All images must be hosted on the `data/media_backup` GitHub repository to save space, and accessed via `cdn.jsdelivr.net` links (e.g., `https://cdn.jsdelivr.net/gh/mohitcnsia/media_backup@main/[filename]`). Avoid direct Wikimedia links as they are prone to breaking or rate-limiting.
2. **Release Strategy:** Differentiate between dynamic data updates (updating `space_olympiad_data.json` and seeding Firestore via the "Update Quest Map" button) which do NOT require an app update, versus native/UI changes (like bumping `expo-image` or adding `react-native-image-zoom-viewer`) which DO require a production build.
3. **Database Seeding:** Every node must ship together with its content, or it opens to a blank screen.
   - **Space Olympiad (legacy):** `quest_nodes` entry + `studyContent`/`categories`/`topics` payload in `components/quiz/SeedQuestNodesButton.js`.
   - **Tile quests (English, Science, ...):** node in `quests/{questId}/nodes` + its study page (`studyContent`) or questions (`questions`, or reused `quizQuestions`) in the quest's data file (`data/englishQuestData.js`, `data/scienceQuestData.js`; all listed in `data/quests/index.js`), seeded by `components/quiz/SeedTileQuestButton.js` (Me → Admin tools, one button per quest). Never add tile-quest nodes to `quest_nodes` (old app builds load all of it).
4. **Target Audience (Kids):** The content is designed for kids (Space Olympiad). All answers, images, and reading materials (like the biographies) must be engaging, highly visual, and kid-friendly.
5. **Content accuracy is the highest priority.** No AI-generated questions live in the app. AI may only draft content offline, and it's checked before it goes live. Generated practice comes from verified word tables only.
6. **Confirm before building.** Any major feature or new screen gets a plan + mockup approved by the owner first. Reuse existing patterns (Space quest map, `ResultsScreen`, `recordQuizResult`) and the app theme (`ThemeContext`).
7. **Stars and money:** stars are awarded by the existing `recordQuizResult` rules. Scoring is client-side today because stakes are low. **If stars ever become real money, prizes or scholarships, move scoring to the server first.**
8. **Release builds don't include `.env`** (gitignored, so EAS skips it). Anything the app reads from `@env` is `undefined` in a Play build; runtime values go in `config/appConfig.js`. **Before every Play upload, run `scripts/release/check-aab.sh <file.aab> <version>`; it must say PASS.**


## 📥 START HERE, Gemini (owner decision 2026-11-04)
**Claude is the lead and manages you directly; the owner talks only to Claude.** Your tasks come only from
`docs/agents/BOARD.md`. Read `docs/agents/GEMINI_ONBOARDING.md` now, then run `scripts/agents/next-task.sh` from
your folder `/Users/mohitchilkoti/Documents/projects/apprec8-gemini` and do what it prints. Work only in that folder.
The old inbox (G1–G14) is retired: open items moved to the board (G2 → G15, G12 → G16, G6 → G17; G3/G4/G5/G10 wait for
the owner; G14/G11 parked).

**Reference:** frozen specs and session logs before 2026-10-31 are in `docs/history/gemini-log-2026-09-to-10.md`.

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

## 2026-11-04 (part 2): app redesign + Science Quest groundwork, branch `feat/quiz-redesign` (Claude)
- **Goal:** finish the owner-approved redesign (quiz, Home + tabs) and prepare NSO (Science Quest) for 19 Nov.
- **Completed Steps:** (details + commit ids in `CODE_REVIEW.md`, entries dated 2026-11-04)
  1. Quiz screens redesigned (mockups A–D); answers sit in the thumb zone above CHECK.
  2. Tabs Home · Fun · Progress · Me. Study tab gone (its screens are in the Home stack); Space quest = hidden tab opened from Home. Reminders (= Tasks, max 5 per kid) in Home's Coming up. Progress merges Stats + Dashboard; Me replaces Profile, seed buttons in Admin tools.
  3. Leaderboard shows first name + class (Class 1–12 in Edit profile, set once). DR-8 + Finding 22 wait for deploy (G10).
  4. Multi-quest: `data/quests/index.js`, generic `SeedTileQuestButton`, class filter `utils/gradeFilter.js` (`grades` on nodes), Dashboard quest switch, Home/Progress show every quest. Science Quest draft (`data/scienceQuestData.js`, 1 sample topic) visible to testers only (`quest_draft`).
- **How to test:** `npm test` (all suites); then `docs/qa/OWNER_TESTING.md`, newest sections first (G8, G9, G13). Nothing is deployed or seeded.

(Older session: 2026-10-31 → 2026-11-04 release work, moved to `docs/history/gemini-log-2026-11.md`.)

## Future TODOs
- **Nov 10 release (open):**
  1. Gemini: deploy DR-6 (`firebase deploy --only functions --project apprec8-ca229`) + check no function grants Invoker to `allUsers`.
  2. Owner: upload the 20.0.24 `.aab` (after `scripts/release/check-aab.sh` PASS) to internal testing; check Profile → 📊 Dashboard on the phone and that ♾️ practice shows on the Dashboard.
  3. Gemini: QA Reading + Space quest regression on 20.0.24 (not run on 2026-11-04).
  4. Owner: promote to **production** on Play (the app is testers-only today).
  5. Owner: Remote Config hard update `update_20_0_24`, `min_version` 20.0.24, only after it's live.
- **Small follow-ups (LOW):** Finding 20 (topic data for Unit 0 on the Dashboard), Finding 21 (My mistakes button over a leaf), proper-noun question wording ("Which is a PROPER noun?", owner to approve).
- **Update link for kids:** once the app is public (production), switch `update_url_android` to a link that opens the Play Store app directly (`market://details?id=com.mohitchilkoti.apprec8`), tested on a kid's supervised account first. Later: Google Play in-app updates (native library) so kids update without leaving the app.
- **QA by Gemini (owner, 2026-10-31):** device testing goes to Gemini using `docs/qa/QA_PLAYBOOK.md` + `scripts/qa/eq.sh` (taps by text/accessibility label, not coordinates). Claude still runs `npm test`, compile and bundle checks before each review request.
- **⭐ PRIORITY (owner, 2026-10-30): "My mistakes" node, in the Nov 6 build right after Step 4** (reuses the Step 4 endless screen; mistakes list in the progress doc; leaves after 2 right in a row; gate/Boss mistakes practised as sub-topics, not exact questions). Spec in CODE_REVIEW.md. If time runs short, cut rewards polish first, never this.
- **RB-5 engagement ideas (owner: "great ideas"; author sizing in CODE_REVIEW.md, 2026-10-31):**
  - **Nov 6 build, after "My mistakes" / rewards / dashboard v0:** RB-5c Grammar Gremlin story on Boss start cards (~1 h + content); RB-5b 🔊 ear training **practice/endless only, never gates/Boss/Exam** (~3–4 h, if time allows).
  - **First update after launch:** RB-5a WhatsApp certificate (needs native `react-native-view-shot` + `expo-sharing`; parent opt-in, first name only); RB-5d class progress as a **class total, not a shared streak** (with RB-2).
  - **Later:** RB-5e Secret Rule stamps (rule texts reviewed for accuracy, reuse Learn page rules).
- **Retire old IEO, Maths and Science content once English Quest is stable (owner, 2026-10-30).** Order matters, because **English Quest Unit 1 still reuses old IEO content** (~20 `quizQuestions` quizzes + ~18 `studyContent` pages for Nouns, Pronouns, Verbs, Adjectives, Prepositions, Conjunctions, via the V1 converter):
  1. Copy every reused quiz/page into English Quest's own data (V2 `questions` format), adding `subtopic` + `mistakeTag` to each question (also needed for RB-1 revision sets), and apply fixes from 🚩 reports.
  2. Point Unit 1 at the copies; `npm test` (content test lists every reused id) must pass with no reused IEO ids left.
  3. Then remove the `ieo` tile and its topics/quizzes, and delete the V1 converter in `listenToV2QuizQuestions`.
  4. Maths (`imo`) and Science (`nso`) follow the same path once they have their own quests (nothing in English Quest depends on them).
- **Cost assessment for 1,000 active kids + what can be removed (owner, 2026-10-30).**
  - **Model per feature:** Firestore reads/writes per session (map, quizzes, reading, Space quest, V1 lists, leaderboard, Word Inspector, games), Cloud Function invocations (`recordQuizResult`, feedback, report trigger, leaderboard), Auth, Storage/CDN bandwidth for images, Remote Config. Use the Firebase usage dashboard for real numbers from the pilot (50 students) and scale up.
  - **Scenarios:** 1,000 daily active kids × 1–3 sessions/day; best case (with Step 3 caching) vs today; monthly cost in ₹ against the Firebase free tier and Blaze pricing.
  - **Known heavy spots to check:** live listeners on whole collections (e.g. the Space quest's `quest_nodes`, Study screen carousels, leaderboard), V1 fallback reads in `listenToV2QuizQuestions`, re-downloads after 30 min offline.
  - **Removal candidates (decide with usage data, not guesses):** unused/dead code (e.g. `components/common/reader/Apprec8ReaderTester.js`, `DummyScreen`/`DummyNavigator`, `to-be-deleted` category group, the unused `react-native-tts`), rarely used features and duplicate quiz paths (V1 vs V2 screens). The app has no usage analytics today, so first add simple per-feature open counts (or Firebase Analytics) to know what kids actually use.
  - **Output:** a short report with cost per feature, total for 1,000 kids, and a keep / simplify / remove list for the owner to decide.
- **Admin HTTP endpoints (`functions/api/*.js`):** protected by Cloud IAM (owner calls them with a short-lived token; a tokenless call gets 403). DR-6 adds `invoker: "private"` in code so a deploy can't make one public. Later (with RB-3): move to admin-checked callables and remove unused endpoints.
- **After DR-6 deploy (owner, not urgent):** on your next admin call, check that your token call still works. The app doesn't use these endpoints, so kids aren't affected. A 403 means your account lacks "Cloud Functions Invoker": grant it in the Cloud Console; no app build needed.
- **Refactor: dynamic content instead of hardcoded seeding (new branch, after the Nov 10 release).** Today content lives in code (`data/englishQuestData.js`, `data/space_olympiad_data.json`, `data/biographies.js`, `SeedQuestNodesButton.js`) and reaches Firestore only by pressing seed buttons in the app. Goal: edit and publish content without code changes, app releases or re-seeding.
  - **Branch:** `refactor/dynamic-content` from `feat/tile-quests` (after release).
  - **Firestore is the single source of truth.** Migrate all hardcoded content once, then delete the JS/JSON content files and the client seed buttons.
  - **Admin content API:** authenticated Cloud Functions (admin custom claim, not a hardcoded UID) for create/update/delete/reorder of quests, nodes, questions, study pages and readings. Validate on the server with the same checks as `tests/content.test.mjs` (one correct answer, mistake tags, "Show me where" sentence exists, every node's content exists). Reuse/replace the existing `functions/api` endpoints once they're secured.
  - **Admin editor (web):** build it inside the same web app as the teacher dashboard (shared sign-in and roles). Edit nodes on a tree view, edit questions in a form, preview as a kid would see it.
  - **Draft → publish:** edits are drafts until published, so kids never see half-edited content. Keep a change history (who changed what, when) and allow rollback.
  - **Bulk import:** CSV / Google Sheets import for question sets, so teachers can contribute.
  - **App side:** almost no change needed: the app already reads quests, nodes and questions live from Firestore. Unknown node types already show "Coming soon".
- **🚩 Report button** in `QuizScreenV2` + fix `submitFeedback` (save `issueCategory`, accept short reports when a category is chosen). Next up.
- **Reading activity: device test.** Built (see 2026-10-28 step 8). Test on device; tune font size, scrolling and read-aloud voice/speed with Pratha.
- **Deploy Firestore rules (owner, manual):** `firebase deploy --only firestore:rules --project apprec8-ca229`. Local `firestore.rules` now locks all content writes to the admin (`isAdmin()`) and adds the quest rules. Before this change it matched the live rules exactly. `firestore.rules` is gitignored; consider tracking it in git.
- **`.exists` bug:** `WordInspectorScreen.js:102` and `ProfileScreen.js:91` use `snap.exists` without `()`. In this Firebase version it's a method, so the check is always true.
- **IEO data fixes:** `4ieo11-topic8-quiz4` has one question whose answer doesn't match any option (quote marks). `4ieo9-quiz`, `tenses-boss-1`, `tenses-boss-1-quiz` have no questions. No `4ieo9-study` page exists (English Quest uses its own Adverbs page).
- **English Quest tile image:** currently reuses the IEO tile image. Make a proper one and host it on the media_backup CDN.
- **English Quest, batch 1: test on device.** Code is done (see 2026-10-28). Deploy rules, seed, play through Unit 0 with Pratha, fix issues.
- **Word Bank (next release after Nov 10):** separate vocabulary feature with packs, per-word mastery, spaced-repetition daily review and a spell bee mode. Seed from the existing `4ieo11` vocabulary quizzes plus easier starter words.
- **Dashboard v1 (in the app, phone-first; owner decision 2026-10-30, after Nov 6):** who played, scores, time, mistakes, reported issues. Teachers and parents mostly have phones, not laptops. CSV export via the share sheet. See CODE_REVIEW RB-2 (pending review).
- **Server-checked unit tests (after Nov 10, only if tests become formally graded):** callable `submitQuestAttempt` that scores unit tests against a server-only `questionKeys` collection.
- **Auto-generated review nodes (after Nov 10):** the tree grows "Fix your mistakes" nodes from each kid's wrong answers, so kids come back to review after finishing.
- **Daily quiz + push notifications (after Nov 10):** needs `@react-native-firebase/messaging` (native change → app release). Daily mix pulls from the kid's mistakes.
- **Fix Spelling Bee:** The game is a mess and was removed from the Quest Map on 2026-10-28. Fix `SpellingBeeGame.js` before adding its nodes back. The `gameSpellingBee` puzzles are still seeded but nothing uses them yet.
- **Study Content Revamp:** Study content is hardcoded and very poor. We need to add significant content with at least 2-3 images and possibly a YouTube video. Add a 1000-word kid-friendly biography of all prominent space scientists and astronauts. Cover their early life, struggles, how they studied despite their limited resources, and made it big for their country.
- **Image Optimization:** Use Squoosh (or a similar tool) to compress all images. Keep large images for a zoomed-in view when kids click on them, but use compressed versions by default to speed things up and save bandwidth.
- **Reading Nodes Creation:** Use the new images (Apollo launch, Isaac Newton, etc.) to write fun articles as reading nodes. Create lots of good reading material and quizzes around topics like "Best space scientist every kid should know", "Most famous astronauts", "Most successful space missions", and "Famous rockets".
- **Daily Challenges (End-Game):** Send a push notification with a random mix of 10 questions to users who have finished the quest map to maintain engagement and a daily streak.
- **Role-Based Progress Dashboard:** Implement deep analytics and tracking dashboards for different roles:
  - **Parents:** View the progress and stats of their children.
  - **Teachers:** Track the progress and quiz scores of all students in their class.
  - **Admins:** Global view of all users and overall engagement metrics.
- **Zen Mode / Guided Access:** Once the app is opened, ask the user to enter Zen Mode. In this mode, apart from the app, nothing else should work on the device without an admin password (parent or admin passcode). Also, download educational videos and host them on GitHub or a CDN to keep them ad-free and prevent kids from drifting to YouTube.

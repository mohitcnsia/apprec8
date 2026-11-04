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


## 📥 Gemini inbox (read this first, every session)
Tasks assigned by Claude or the owner. Do them **top first**. Details for each: `CODE_REVIEW.md` → "Plan to Nov 19".
When a task is done: (1) write the result in `CODE_REVIEW.md` (append), (2) commit with a message starting `gemini:`,
(3) tick it here (`[x]` + date). Claude verifies from git (diff, `npm test`) and answers in `CODE_REVIEW.md`.
Blocked or unsure? Ask the owner. Production (deploy, seed, Play) only as `docs/TEAM.md` allows.

- [ ] **G1 DR-7 (cost):** `firebase functions:artifacts:setpolicy --project apprec8-ca229 --days 1` (owner wants the ₹5/month bill gone; the cause is confirmed).
- [ ] **G2 Unit 2 answer-key review** (`data/englishQuestData.js`, "Unit 2: Articles"): one correct answer each, no other option also right, true facts, clear explanations.
- [ ] **G3 QA `feat/nov6-improvements`** in dark AND light mode: Reading options + word popup, My mistakes from an Adverbs gate, map button space, Dashboard Unit 0 topics.
- [ ] **G4 After the owner's OK:** merge `feat/nov6-improvements` → `feat/tile-quests`, then seed (Profile → Update English Quest).
- [ ] **G5 Exam pattern notes** once papers are in `docs/exam/papers/`: `docs/exam/ieo-pattern.md`, `docs/exam/nso-pattern.md` (patterns + gap list, never copied questions).
- [ ] **G6 New English Quest units** per `docs/CONTENT_GUIDE.md` (Unit 3 Subject-Verb Agreement next), one branch + one content review request each.
- [ ] **G8 QA the quiz redesign** (branch `feat/quiz-redesign`, after G3), light AND dark: see `CODE_REVIEW.md` → "Review request: quiz redesign". Screenshot each screen into the review entry.
- [ ] **G9 QA Home + tabs redesign** (same branch, after G8), light AND dark, tester account only: follow `docs/qa/OWNER_TESTING.md` → "steps 1", "step 2", "steps 3–4". Report failures with screenshots under `CODE_REVIEW.md` → "Home + tabs redesign: step 1 built". Do not press seed buttons.
- [ ] **G10 Deploys after owner OK:** DR-8 (`getLeaderboard` first name + class) and Finding 22 (profile rule `hasOnly`), both in `CODE_REVIEW.md` (2026-11-04 "Thumb zone + leaderboard names"). Check other `users/{uid}` writes first for Finding 22.
- [ ] **G11 Research (low priority, after exam work):** what Google Play Families policy and India's DPDP Act 2023 require for an app where parents create kid profiles (consent, data shown to other users, ads/analytics). Write a short summary with links under `CODE_REVIEW.md` → "RB-6 update".
- [ ] **G12 ⭐ Science Quest content (NSO 19 Nov, Pratha = Class 5):** write units in `data/scienceQuestData.js` per `docs/CONTENT_GUIDE.md` §8 (class tags with `forGrades`). Start with Class 5 NSO syllabus topics (SOF's published syllabus; refine with `docs/exam/nso-pattern.md` once papers arrive), one unit per branch `content/sq-uN-<topic>`, `npm test` green, then a "Content review request: Science Unit N" in `CODE_REVIEW.md`. Keep `quest.draft: true`; seed as draft only (testers see it). Claude's sample topic `sq-living` may be kept, fixed or replaced. Owner approves before `draft: false`.
- [ ] **G13 QA multi-quest** (branch `feat/quiz-redesign`, tester account): `docs/qa/OWNER_TESTING.md` → "Science Quest + class filter".
- [ ] **G7 Audit old IEO/NSO quizzes** (now under Home → Olympiad practice) for wrong answers; list them in `CODE_REVIEW.md`.

**Reference:** frozen specs and session logs before 2026-10-31 are in `docs/history/gemini-log-2026-09-to-10.md`.

## 2026-11-04 (part 2): app redesign + Science Quest groundwork, branch `feat/quiz-redesign` (Claude)
- **Goal:** finish the owner-approved redesign (quiz, Home + tabs) and prepare NSO (Science Quest) for 19 Nov.
- **Completed Steps:** (details + commit ids in `CODE_REVIEW.md`, entries dated 2026-11-04)
  1. Quiz screens redesigned (mockups A–D); answers sit in the thumb zone above CHECK.
  2. Tabs Home · Fun · Progress · Me. Study tab gone (its screens are in the Home stack); Space quest = hidden tab opened from Home. Reminders (= Tasks, max 5 per kid) in Home's Coming up. Progress merges Stats + Dashboard; Me replaces Profile, seed buttons in Admin tools.
  3. Leaderboard shows first name + class (Class 1–12 in Edit profile, set once). DR-8 + Finding 22 wait for deploy (G10).
  4. Multi-quest: `data/quests/index.js`, generic `SeedTileQuestButton`, class filter `utils/gradeFilter.js` (`grades` on nodes), Dashboard quest switch, Home/Progress show every quest. Science Quest draft (`data/scienceQuestData.js`, 1 sample topic) visible to testers only (`quest_draft`).
- **How to test:** `npm test` (all suites); then `docs/qa/OWNER_TESTING.md`, newest sections first (G8, G9, G13). Nothing is deployed or seeded.

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

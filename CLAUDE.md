# Apprec8 — CLAUDE.md

Gamified learning app for kids (K-12), currently focused on **Space Olympiad / ISRO** content.
Expo + React Native frontend, Firebase backend (Firestore, Auth, Cloud Functions, Remote Config).

## Commands
- `npm start` — Metro bundler (`expo start`)
- `npm run android` / `npm run ios` — dev build on emulator (uses `expo-dev-client`, not Expo Go)
- `npx eas build --profile production --platform android --local` — Play Store `.aab`
- `cd functions && npm run serve` — Functions emulator; `npm run deploy` to deploy (Node 22)
- `firebase deploy --only firestore:rules` — needed before seeding if rules changed
- **Owner testing:** `docs/qa/OWNER_TESTING.md` (no build: dev app on the emulator + `npx expo start`). Add every branch's test checklist there.
- `npm test` — Node tests in `tests/` for the English Quest logic and content (no linter configured).

## Layout
- `App.js`, `AppContent.js`, `navigation/` — React Navigation (bottom tabs + per-tab stacks: Home, Study, Quest, Profile)
- `screens/quest/QuestScreen.js` — Quest map; routes by node `type` (Quiz / Study / VocabBuilder / SpellingBee)
- `screens/quiz/QuizScreenV2.js` — Quiz V2 (Training/Exam modes, useReducer + context); `QuizScreen.js` is the legacy V1, keep it working
- `components/common/reader/Apprec8Reader.js` — study/biography reader; `components/quiz/Apprec8ReaderV2.js` — quiz explanations
- `components/SpellingBeeGame.js`, `VocabBuilder.js`, `SudokuGame.js`, `Minesweeper.js`, `ClockPracticeGenerator.js` — mini-games
- `components/quiz/SeedQuestNodesButton.js` — **the Space quest seeding script** (in-app "Update Quest Map" button)
- **Tabs (2026-11-04 redesign):** Home (`screens/home/`, stack also holds the old Study screens) · Fun (`screens/fun/`) · Progress
  (`screens/progress/`, route `Stats`; admin Kids view = embedded Dashboard) · Me (`screens/profile/MeScreen.js`, route `ProfileScreen`;
  seed buttons in `screens/admin/AdminToolsScreen.js`). Space quest = hidden tab `Quest`. Old `Home.js`, `StudyScreen.js`, `ProfileScreen.js` unused.
- **Tile quests:** all listed in `data/quests/index.js` (English, Science draft). Seed: `components/quiz/SeedTileQuestButton.js`.
  Class tags: `grades` on nodes, filtered by `utils/gradeFilter.js` (kid's class = `users.grade`). Draft quest tile = `carouselGroup: "quest_draft"` (testers only).
- **English Quest (tile-based quest):** `screens/englishQuest/` (intro + tree map), `utils/questTree.js` (unlock rules, pure),
  `services/englishQuestApi.js` (progress + attempt recording), content in `data/englishQuestData.js`,
  seeded by `components/quiz/SeedEnglishQuestButton.js` (wrapper of SeedTileQuestButton, admin only). Opened from a `QUEST` tile on Home.
  Leaf types: `study` (Apprec8Reader), `quiz` (QuizScreenV2), `reading` (`screens/englishQuest/ReadingScreen.js`, logic in
  `utils/readingFlow.js`, content = `studyContent` doc with `kind: "reading"`). Read-aloud uses `expo-speech`.
- `services/firestoreContentApi.js` — client reads (onSnapshot listeners)
- `hooks/` — `useInAppMessaging` (Remote Config popups + hard update), `useQuizEngine`, `useSoundEffects`, `useFirebaseAuth`
- `functions/` — `callable/` (recordQuizResult, getLeaderboard, submitFeedback…), `api/` (HTTP CRUD/bulk admin), `triggers/auth.js` (initializeNewUser)
- `data/` — `space_olympiad_data.json` (quiz content), `biographies.js`, `media_backup/` (images), Python image helper scripts
- `scripts/` — content generation helpers (Python + `seedSpaceQuiz.js`)

## Firestore collections (names as used in code)
- Content tree: `categories` → `topics` (`parentTopicId`, `categoryId`, `type`, `hasSubtopics`, `order`) → `studyContent` (doc ID == STUDY topic ID) / `quizQuestions` (`parentId` = QUIZ topic ID). See `SCHEMA-README.md`.
- Quest (Space, old): `quest_nodes` (`id`, `title`, `type`, `contentId`, order). Old app builds load *all* of it; never put other quests here.
- Tile quests (new): `quests/{questId}`, `quests/{questId}/nodes` (units + leaves), `users/{uid}/questProgress/{questId}`,
  `questAttempts` (one doc per attempt with every answer, time and `mistakeTag`). Tile = `categories` doc with
  `type: "QUEST"`, `carouselGroup: "quest"`.
- Old V1 quizzes (`quizQuestions`) play in `QuizScreenV2` via an automatic converter in `listenToV2QuizQuestions`.
- Quiz V2: `quizzes`, `questions` (`quizId`), `users/{uid}/quizAttempts`. See `docs/QuizFeatureV2.md`.
- Games: `gameVocabCategories/{id}/words`, `gameSpellingBee`
- Users: `users` (stars, streaks, messages)
- Note: `gemini.md` says `study_content`, but the code uses `studyContent`.

## Rules of the project
1. **Images**: host in `data/media_backup` (GitHub repo `mohitcnsia/media_backup`) and link via
   `https://cdn.jsdelivr.net/gh/mohitcnsia/media_backup@main/<file>`. Don't link Wikimedia directly.
2. **Seeding**: every node needs its content seeded with it, or it opens to a blank screen.
   Space (legacy): `quest_nodes` + content in `SeedQuestNodesButton.js`. Tile quests: `quests/{questId}/nodes` + content
   in `data/englishQuestData.js` via `SeedEnglishQuestButton.js`. Never put tile-quest nodes in `quest_nodes`.
7. **Team workflow** (full roles: `docs/TEAM.md`): **Claude leads and manages Gemini** via `docs/agents/BOARD.md` (Gemini: `docs/agents/GEMINI_ONBOARDING.md`, own worktree `../apprec8-gemini`, `scripts/agents/next-task.sh`); the owner talks only to Claude. Each time the owner checks in: review new `gemini(Gxx)` commits, update the board, report briefly. Order: **spec/requirements →
   review in `CODE_REVIEW.md` → owner go-ahead → implementation → code review.** Draft specs live in `CODE_REVIEW.md`;
   `gemini.md` is updated only once requirements are frozen. Claude answers findings under "Author Response" and files
   "Deploy requests" there. Claude does not deploy to production. Never build a major feature/UI without an approved mockup.
3. **Content vs native release**: content changes (JSON + seeding to Firestore) ship without an app update.
   Native/dependency/UI changes need a production build.
4. **Audience is kids**: text, images and explanations must be kid-friendly, visual and engaging.
5. **Session log**: at the end of each working day/session, add a dated entry at the top of the log in `gemini.md`
   (Goal, Completed Steps, How to test) and add any unfinished work to its "Future TODOs" section. Remove TODOs once done.
6. Quest sub-activities receive `completedQuizId` / `contentId` via route params and navigate back to `"QuestMap"` when done.

## Releasing
- Bump `patchVersion` in `app.config.js` (versionCode = major*1e6 + minor*1e4 + patch*100 + iteration).
- **Also** update the hardcoded `versionCode` / `versionName` in `android/app/build.gradle` — they are not derived automatically. Current: 20.0.28.
- **And** `expo_runtime_version` in `android/app/src/main/res/values/strings.xml` (= app version; `tests/releaseConfig.test.mjs` checks).
- **Over-the-air updates (from 20.0.28):** JS/asset-only changes ship without a build:
  `npx eas update --channel production --message "<what changed>"` → phones get it on their next app start (`hooks/useStartupUpdate.js` loads it behind the start loader, up to 6 s; on a slow network, the start after).
  An update reaches only builds with the same version (runtime version). Native changes (new libraries, android/) still need a build.
- **Release builds don't include `.env`** (gitignored, so EAS skips it): anything read from `@env` is `undefined` there.
  Values the app needs at runtime go in code (`config/appConfig.js`); `tests/releaseConfig.test.mjs` guards this.
- Before every upload: `scripts/release/check-aab.sh <file.aab> <version>` must say PASS (version, admin ID, signature).
- If a local build dies in the `expo doctor` step with `kill ESRCH` (an EAS tooling glitch), rerun with
  `EAS_BUILD_DISABLE_EXPO_DOCTOR_STEP=1` in front. Local builds take ~35–40 min and slow the Mac: run them when the owner is away.
- Force-update: set Remote Config `active_message` with `type: "hard_update"` and a `min_version`. See `docs/in-app-messaging.md`.

## Other docs
- `docs/architecture_summary.md`, `docs/features_summary.md`, `docs/build_and_run_guide.md`
- `docs/investor_pitch.md` — product pitch + roadmap
- `gemini.md` — session log from a previous AI assistant plus future TODOs
- `README.md` — only covers Apprec8Reader manual testing, not the whole app

## Gotchas
- `firestore.rules` and `.env` are gitignored; `app.config.js` reads `.env` (e.g. `IOS_REVERSED_CLIENT_ID`).
- A keystore (`*.jks`) and `.aab` build outputs sit in the repo root — never commit or move them.
- `gemini.md` must stay **under 24 KB**: Antigravity (Gemini) reads only the first 24 KB. Move old sessions to `docs/history/`.
  Assign Gemini work through its **inbox at the top of `gemini.md`**; verify from git (`gemini:` commits) + `npm test`.
- `expo-image` must match the Expo SDK (use `npx expo install`); a mismatch crashes Android with a Kotlin `AnyTypeCache` error.

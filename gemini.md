# Gemini Engineering Log

## Project Ground Rules & Architecture
1. **Media Asset Management:** All images must be hosted on the `data/media_backup` GitHub repository to save space, and accessed via `cdn.jsdelivr.net` links (e.g., `https://cdn.jsdelivr.net/gh/mohitcnsia/media_backup@main/[filename]`). Avoid direct Wikimedia links as they are prone to breaking or rate-limiting.
2. **Release Strategy:** Differentiate between dynamic data updates (updating `space_olympiad_data.json` and seeding Firestore via the "Update Quest Map" button) which do NOT require an app update, versus native/UI changes (like bumping `expo-image` or adding `react-native-image-zoom-viewer`) which DO require a production build.
3. **Database Seeding:** Every node must ship together with its content, or it opens to a blank screen.
   - **Space Olympiad (legacy):** `quest_nodes` entry + `studyContent`/`categories`/`topics` payload in `components/quiz/SeedQuestNodesButton.js`.
   - **Tile quests (English Quest and future ones):** node in `quests/{questId}/nodes` + its study page (`studyContent`) or questions (`questions`, or reused `quizQuestions`) in `data/englishQuestData.js`, seeded by `components/quiz/SeedEnglishQuestButton.js`. Never add tile-quest nodes to `quest_nodes` (old app builds load all of it).
4. **Target Audience (Kids):** The content is designed for kids (Space Olympiad). All answers, images, and reading materials (like the biographies) must be engaging, highly visual, and kid-friendly.
5. **Content accuracy is the highest priority.** No AI-generated questions live in the app. AI may only draft content offline, and it's checked before it goes live. Generated practice comes from verified word tables only.
6. **Confirm before building.** Any major feature or new screen gets a plan + mockup approved by the owner first. Reuse existing patterns (Space quest map, `ResultsScreen`, `recordQuizResult`) and the app theme (`ThemeContext`).
7. **Stars and money:** stars are awarded by the existing `recordQuizResult` rules. Scoring is client-side today because stakes are low. **If stars ever become real money, prizes or scholarships, move scoring to the server first.**

## 2026-10-30
- **Goal:** Owner tested batch 1 on device. The English Quest map was not what was expected (own forest colours, trunk/branch-row layout nobody had approved). Redesign agreed through discussion, **no code written yet**.
- **Completed Steps:**
  1. Reviewed the Space quest map (`screens/quest/QuestScreen.js`): one dashed zigzag path, first node at the bottom, nodes alternate left/right quarter, only the first unfinished node is open, auto-scroll puts the current node in the vertical middle after 300 ms, confetti on completion. Uses a hardcoded mock theme (not `ThemeContext`), and the current node lands left or right depending on node count. Space quest stays untouched until English Quest is done; lessons get applied app-wide afterwards.
  2. Reviewed `ResultsScreen` + `recordQuizResult`: stars only at 100% (15 first try, 10 later, 10 again after 7+ days), +5 daily bonus, streaks, anti-farming; `mode: "training"` is ignored by the server.
  3. Agreed **Spec v2** below. Next step: owner's final OK, then build in the listed order.

### Spec v2: English Quest map, gates and practice (agreed 2026-10-30, replaces the tree layout of 2026-10-28)
**Map (Space style, app theme)**
```
   🏆 Unit 1 Boss            (gold when passed)
    │
   📘 Pronouns ─ ○ ○ ○ ─ 🛡 ─ ♾️
    │
   📘 NOUNS ── ○🟢 ○🟢 ○🟡 ○🔴 ─ 🛡 Noun Challenge ─ ♾️ Keep practising
   ◔ 2/6   (main node, LEFT side, lower part of the screen when current)
    │
   🏆 Unit 0 Boss ✅
    │
   🚩 Start
```
- One dashed winding path from the bottom up, weaving along the **left half**. Main nodes = **one per branch** (e.g. Unit 1: Nouns, Pronouns, Verbs, Adjectives, Adverbs, Prepositions, Conjunctions, Reading → Unit Boss = 9 main nodes).
- On open, auto-scroll so the **current main node is on the left, about 70% down the screen** (left-thumb zone).
- **Colours: app `ThemeContext`** (same background gradient and colours as the Study tab, light + dark). Also applied to the intro and reading screens. Remove `questColors.js`.
- Confetti on completion (as Space). Locked nodes don't open.

**One branch**
- **Main node** = "Learn" page + short warm-up quiz. Shows a progress ring (◔ → ●) for leaves done. Finishing it opens the row.
- **Practice leaves**, one per sub-topic (e.g. common & proper, singular & plural, gender, advanced). Difficulty colour 🟢🟡🔴 (visual only). Optional, **any order**, open once the main node is done.
- **🛡 Gate** (last fixed item of the row), open right after the main node. Pass = **≥80% overall and at least one correct in every sub-topic**. Pool of **15** questions per gate, **10 drawn** per attempt, balanced (≥2 per sub-topic), options shuffled. After **2 failed tries**, the 3rd try needs one recommended practice leaf done first. Result screen names strong ✅ and weak ⚠️ sub-topics, and weak leaves glow on the map. Passing opens the next main node.
- **100% is encouraged, never required:** below 100% the result shows "Try for 100% to earn ⭐".
- **♾️ Keep practising** (end of row): endless, one question at a time, no hearts, no end, stop anytime with a summary. Streak counter only (no global stars, it would be farmable). Questions from the branch's pools + generated questions.
- **Branch mastered** (all leaves done): main node turns gold with a crown + confetti.

**Training vs Exam (owner decision 2026-10-30):** every English Quest quiz (warm-up, practice, gate, Unit Boss) opens **Quiz Details**, like the Space quest, so the kid chooses **Training** (instant feedback, hearts) or **Exam** (no hearts, review at the end). **Hearts exist only in Training mode.** Pass marks apply in either mode.

**Unit Boss** (replaces the "unit test" as a trunk node): short mixed quiz over all branches. Passing opens the next unit and shows a trophy.

**Stars:** existing `recordQuizResult` rules, unchanged (no Cloud Function change). Every quest activity (practice leaf, gate, Unit Boss, reading) reports with `mode: "quest"` so the server awards stars. Endless practice: no global stars.

**Results:** reuse `screens/common/ResultsScreen.js` for every activity (quizzes, gates, Unit Boss, reading, endless summary). The Reading screen's own result card goes.

**Practice sources (content accuracy first)**
1. Hand-written pools per practice leaf (existing IEO quizzes + new), random draw.
2. **Generated questions from verified word tables** (plurals, noun gender, a/an, irregular verbs; later subject-verb agreement). Answer and mistake tag come from the table. Word tables are content (extendable without a release); each generator *type* is code.
3. **No live AI** in the app.
4. "My mistakes" node (questions the kid got wrong + similar generated ones), later the daily quiz.

**Caching (aggressive, cut network + cost)**
- `quests/{questId}.contentVersion` (bumped by the seeder / future editor). On open, read only that doc. If the version matches the phone's copy, nodes, questions, study pages and readings come from local storage.
- No live listeners for content; one fetch + cache. Only the kid's own progress doc stays live.
- Pre-download a unit's questions when the unit opens (instant + offline).
- Progress writes use the in-memory progress (no read before write).
- Target: about 1 read per visit instead of ~60–100.

**Build order (freeze Nov 6; cut 💎 badges and "My mistakes" first if late)**
1. Map redesign (Space-style path + side rows, app theme, left-thumb positioning) + switch intro/reading to the theme: ½ day
2. Gates (balanced draw, 80% + no weak spot, 2-tries lock, per-topic result): 1 day
3. Caching layer: ½ day
4. ♾️ Endless practice + generator engine + 3–4 generators: 1½ days
5. Rewards (progress ring, gold crown, confetti) + `recordQuizResult` with `mode: "quest"`: ½ day
6. "My mistakes" node: ½ day
7. Content alongside: gate pools (15 each), more practice for Adverbs and Conjunctions, Unit Boss pools.

## 2026-10-28
- **Goal:** Review project docs, set up `CLAUDE.md`, and clean up the Quest Map.
- **Completed Steps:**
  1. Reviewed all markdown docs and created `CLAUDE.md` (commands, layout, Firestore collections, project rules, release steps). Agreed that daily progress and TODOs are logged in this file.
  2. Removed the 4 Spelling Bee nodes (`game-spell-1` to `game-spell-4`) from the quest node list in `SeedQuestNodesButton.js`. The Spelling Bee game itself is buggy right now.
  3. Noted doc mismatches: the study collection is `studyContent` in code (not `study_content`). Android `versionCode`/`versionName` in `android/app/build.gradle` are hardcoded and must be bumped by hand along with `app.config.js`.
  4. Created branch `feat/tile-quests` from `jul-features` (20.0.22). This becomes the primary branch; the previous AAB is the rollback plan. (`main` is only the initial commit.)
  5. Agreed the plan for the **English Olympiad (IEO) quest** (see "Plan: English Olympiad Quest" below).
  6. **Built English Quest, batch 1 (code):**
     - `services/firestoreContentApi.js`: `listenToV2QuizQuestions` falls back to old V1 `quizQuestions` and converts them (`convertV1QuestionToV2`). Checked against Firestore: 3,113 IEO questions in 137 quizzes; only 1 skipped (answer/option quote mismatch in `4ieo11-topic8-quiz4`).
     - `utils/questTree.js`: unlock rules (unit test passes → next unit; branches open with their unit; leaves unlock in order; unknown node types → "Coming soon"). Tested with Node.
     - `services/englishQuestApi.js`: quest/nodes/progress listeners, `saveQuestAttempt` (every answer + time + mistake tag → `questAttempts`), progress in `users/{uid}/questProgress/{questId}`.
     - `screens/englishQuest/`: `EnglishQuestIntroScreen` (asks guests to sign in), `EnglishQuestMapScreen` (tree: trunk of unit tests, swipeable branch rows, stars, auto-scroll to current unit), `questColors.js`.
     - `QuizScreenV2`: optional `questContext` param → records answers and time, saves attempt on finish / out of hearts, "Back to Quest" exit. Space quest flow unchanged.
     - `Apprec8Reader`: optional `questContext` → "I've read it! Back to Quest" button.
     - Study tab: new "Quests" carousel (`carouselGroup: "quest"`, only read by the new app), tile type `QUEST` in `CustomCarousal`. Screens registered in `StudyNavigator`; tab bar hidden on them.
     - Content `data/englishQuestData.js`: Unit 0 Sentences (2 new study pages, 4 new quizzes, unit test), Unit 1 Parts of Speech (7 branches reusing IEO content + new Adverbs page/quiz + new unit test), Unit 2 "Coming soon". 60 new questions, every wrong option has a `mistakeTag`.
     - `SeedEnglishQuestButton` on Profile, visible only to the admin account (`APPREC8_TEAM_REVIEWER_UID`).
     - `firestore.rules`: added rules for `quests`, `questProgress`, `questAttempts` (**not deployed yet**).
     - Checks: all changed files compile; full Android JS bundle builds (`npx expo export --platform android`); data validation script passes (unique ids, one correct answer, mistake tags, all referenced content exists).
  7. Answered Gemini's review round 1 in `CODE_REVIEW.md` and fixed findings 3, 4, 5, 8, 9, 10, 11 (`627b46b`). Deploy requests DR-1 (rules) and DR-2 (one IEO question) filed for devops. Hid all seed buttons from non-admins and locked content writes to the admin in `firestore.rules` (not deployed yet).
  8. **Built the Reading activity** (new leaf type `reading`, must ship in the Nov 6 build):
     - `screens/englishQuest/ReadingScreen.js`: own screen (not inside Apprec8Reader, to avoid breaking Space/V1). Modes: `stepByStep` (paragraph → question → next paragraph) and `fullPassage` (read all → questions under the passage). "Show me where" highlights the proving sentence; underlined glossary words show their meaning; 🔊 read-aloud per paragraph; saves attempts like quizzes (+ `details.readingMode`, `details.wordCount`).
     - Read-aloud uses **`expo-speech`** (new native dependency; `react-native-tts` was installed but unused and unmaintained). Needs a fresh native build (`npm run android`).
     - `utils/readingFlow.js`: pure helpers (order of paragraphs/questions, text splitting for highlight + glossary).
     - Content: reading documents live in `studyContent` with `kind: "reading"` (no new rules needed). Added "Tara's Paper Boat" (Unit 0, step by step, 4 Qs), "The Seed Library" (Unit 1, IEO style, 7 Qs) and a "Reading Detective Tips" study page.
     - Tests moved into the repo: `npm test` runs `tests/` (tree rules, reading flow, content validation incl. every "Show me where" sentence exists). Optional Firestore snapshot in `tests/fixtures/` (gitignored).
- **How to test:**
  1. Press "Update Quest Map to Full Space Olympiad". Seeding deletes all existing `quest_nodes` first, so the Spelling Bee nodes disappear.
  2. Check the map goes straight from Level 4 to the U. R. Rao biography (and likewise around Levels 8, 14, 18), and progression still unlocks correctly.
  3. English Quest: deploy rules (`firebase deploy --only firestore:rules`), run `npm run android`, sign in with the admin account, press **Update English Quest** on Profile. The Study tab shows a **Quests** row with the English Quest tile → intro → tree. Play "Sentence or not?", then check `questAttempts` and `users/{uid}/questProgress/english-quest` in the Firebase console. Pass the Unit 0 test (≥70%) and check Unit 1 opens.
  4. Reading: in English Quest open Unit 0 → Reading → "Tara's paper boat". Check the next paragraph appears after each answer, "Show me where" highlights the sentence, underlined words show meanings, 🔊 reads aloud, and finishing saves a `questAttempts` doc with `mode: "reading"`. In Unit 1 try "The seed library" (full passage mode).

### RB-2 frozen: parents and teachers (agreed 2026-10-30, reviewed by Gemini)
- **Dashboard in the app, phone-first** (teachers and parents mostly have phones). CSV export via the share sheet.
- **Parent** (linked to child): progress, time, weak topics, Learn pages, and the practice questions their child got wrong *with* answers.
- **Teacher** (linked to class): the same for the class, plus a syllabus view (units, topics, Learn pages, sample practice questions) and mistake patterns.
- **Gate/Unit Boss questions and answers are visible to nobody except the admin.** Teacher preview plays nodes without recording and hides gate/Boss answers.
- **Teachers' own stats** (if they play normally) are visible only to themselves and the admin.
- The admin (owner) can see everyone's data.

### Plan: English Olympiad Quest (agreed 2026-10-28)
**Who:** Anyone who wants to learn. Main pilot users: Class 5 IEO kids (incl. Pratha) and ~50 Class 10 students whose teacher will track them. Android only. Both groups start on the same day (date TBD). App is public, so no consent flow for now.

**Release date: 10 November 2026.** App code freeze + Play Store submission by **6 November** (store review takes 1–3+ days). Content can be seeded after release.

**Entry & navigation**
- Quests open from a **tile** (Study tab carousels), not from the bottom bar. The Quest tab stays as it is, hidden behind the V2 switch (off by default).
- **New, separate tile named "English Quest"** in a new `carouselGroup: "quest"` that only the new app reads. The existing IEO tile (`categories/ieo`) is **not modified**, so kids can keep using it. If the new quest breaks, delete/hide the new tile in Firestore; no release needed.
- Tile → intro → **one mixed tree** (no separate tracks).
- *(Superseded by Spec v2 on 2026-10-30.)* **Tree layout:** a vertical trunk of units. Reaching a trunk node unlocks its horizontal, swipeable row of branches. Leaves get harder the further out they are, and kids don't have to finish every leaf. The **trunk node is the unit test**; passing it unlocks the next trunk node. Branch depth earns stars and is tracked.
- **The tree holds grammar + reading only** (both are finite skill ladders). Each unit has 1–2 reading leaves whose passages grow with the grammar level. The map auto-scrolls so the next node sits near the kid's thumb.
- **Vocabulary is NOT in the tree** (decided 2026-10-28). It grows without limit and words get forgotten, so a "done once" tree is the wrong model. It becomes a separate **Word Bank** (next release, not Nov 10):
  - Word packs on a shelf (Starter → IEO L1 → IEO L2 → Achievers, ~20 words each), unlocked in order.
  - Per-word mastery (new → learning → known → mastered; mastered only after being right on several separate days).
  - Daily review via spaced repetition; the future daily notification opens this.
  - Spell bee = a mode on the same words (hear the word, pick the spelling).
  - Later the tree can get "Word check" leaves that pull 5 words from the kid's own Word Bank (variety without the tree owning vocab content).
  - Until then, kids keep using the vocabulary quizzes in the old IEO tile.

**Release scope for Nov 10**
- In: English Quest tree (grammar + reading), answer/time recording, 🚩 report button.
- Out: Word Bank (next release), dashboard (web, not tied to the app release; ships after, and shows data recorded from day one).
- **Code freeze rule:** content can be seeded any time, but every node *type* needed in the coming weeks must be in the Nov 6 build (quiz, study, reading-with-questions, unit test). Unknown node types must render as "Coming soon", not crash, so future types don't break older builds.
- Stay about **two units ahead** of the fastest kid (they may do 2–3 levels a day).
- V1 tile/list screens stay untouched (reusable for short lists with a header image).

**Reuse existing content (big time saver)**
- The `ieo` category already has 202 topics: Nouns, Pronouns, Verbs, Tenses (7 sub-sections), Articles (done); Prepositions, Conjunctions, Adjectives, Adverbs (in progress); Vocabulary (10 themed groups, ~80 quizzes = the ~450 past-paper words); Word & Structure (10 mixed quizzes).
- Old quizzes live in `quizQuestions` (V1 format: `parentId`, string `options`, `answer`, `explanation` array). The V2 quiz screen reads `questions` (`quizId`, `options: [{content, isCorrect}]`). Add a converter in `listenToV2QuizQuestions` that falls back to `quizQuestions` when `questions` is empty. No changes to old data.
- Old questions have no mistake labels; the dashboard shows the chosen option for those. Add labels gradually.

**Rollback safety (old AAB must keep working on the same Firestore)**
- New quest data lives in `quests/{questId}` + `quests/{questId}/nodes`, never in `quest_nodes` (the old app loads all of `quest_nodes`, and the old seed button deletes all of it).
- The new tile uses a new `carouselGroup: "quest"` that only the new app reads (old app would show "not yet defined" for an unknown tile type).
- New seed button only writes the English quest; it never touches Space data.

**Content areas** (grammar + reading live in the tree; vocabulary is the separate Word Bank, see above)
1. **Grammar (zero → master):** 0 Sentence basics · 1 Parts of speech · 2 Articles & determiners · 3 Subject-verb agreement · 4–5 Tenses · 6 Modals · 7 Gerunds/infinitives/participles · 8 Clauses & connectors (incl. conditionals) · 9 Voice · 10 Reported speech · 11 Transformation & question tags · 12 Error spotting → Mastery Test. Covers the Class 10 teacher's list (tenses, determiners, modals, clauses, voice, transformation).
2. **Reading:** uses Apprec8Reader with built-in questions (not the quiz screen). Ideas: questions between paragraphs for beginners, full passage + 5 IEO-style questions later; "show me where" highlights the proving sentence; tap a word for its meaning; read-aloud via `react-native-tts`. Passages grow from ~80 to ~400 words. Strategy pages for each IEO question type (incorrect statement, Statement I/II, word in context, sequencing).
3. **Vocabulary / Spell Bee → Word Bank (next release):** built from the ~450 past-paper words in the `4ieo11` quizzes plus easier starter words. Spelling = app speaks the word, kid picks the correct spelling from 4 (no typing).

**Rules**
- **Multiple choice only** (typing on a phone is hard). Free-text past-paper questions get converted to MCQ.
- **No skipping.** Everyone starts at Level 0; older kids just move faster. Keeps tracking clean and avoids placement logic.
- **Mistake labels:** every wrong option is tagged with the error it represents (e.g. `sv-agreement`, `wrong-time-frame`), so the dashboard can show *kinds* of mistakes.
- **Original content only.** IEO (SOF) and CBSE papers are used as guides for style/difficulty; questions are reworded, never copied.

**Tracking (record from day one; dashboard comes later)**
- Sign-in required for quests. Later: class codes for teachers, roll number/display name, parent links.
- Per attempt: student, quest, node, start/end time, score, and per question: chosen option, correct?, time taken, mistake label.
- Scoring is client-side for the Nov 10 release (decided 2026-10-28, CODE_REVIEW Finding 2): answer keys already reach the phone for instant feedback, so server scoring alone wouldn't stop cheating. Attempts are create-only and store per-answer time, so faked runs are visible.
- Dashboard: web (Firebase Hosting) with role-based access (teacher → class, parent → child, admin → all). Starts simple.

**Reporting mistakes in content (review of `FeedbackFAB` done 2026-10-28)**
- Current state: `components/common/FeedbackFAB.js` → callable `submitFeedback` → `userFeedback` collection. Used in V1 QuizScreen (hidden behind a gesture), result/explanation screens and Apprec8Reader.
- Problems: (1) not in `QuizScreenV2`, so quest players can't report; (2) the server drops `issueCategory`; (3) server needs ≥3 words but the app only checks 10 chars, so short reports fail; (4) hard to discover in V1; (5) nobody views the reports.
- Plan: a 🚩 Report button on every question → reason chips (Wrong answer · Spelling mistake · Confusing question · Image broken · Other), optional text → saves quizId, questionId and the chosen option. Fix (2) and (3) in the function, keeping it compatible with the old app (functions deploy, separate from the app release). Show a "Reported issues" list with status in the dashboard.

**Delivery in batches / timeline**
- Oct 28–31: old-quiz converter, tree map screen, intro, new tile, attempt recording, 🚩 report button. Grammar tree wired to existing content + new **Level 0** (study page + ~10 MCQs with mistake labels).
- Nov 1–3: the owner + Pratha test, fixes.
- Nov 4–5: Reading v1 (Apprec8Reader with built-in questions, a few passages). All node types done.
- Nov 6: code freeze, production build, Play Store.
- Nov 7 onward: content-only additions by seeding; dashboard v1 (web).

## 2026-09-08
- **Goal:** Automate Wikipedia image downloading for 100 new ISRO Space Olympiad questions, and fix quest map progression blockers.
- **Steps:**
  1. Developed Python/JS scripts to map 100 ISRO question answers to specific Wikipedia subjects, fetch their images using Wikipedia's API, and download them to `data/media_backup/`.
  2. Replaced the `image` URLs in `space_olympiad_data.json` to point to the CDN paths for the 100 downloaded images.
  3. Fixed a progression bug where `study-node-6` through `study-node-10` were blocking quest progression by injecting missing rich markdown content and new CDN images into `SeedQuestNodesButton.js`.
  4. Clarified release strategy: dynamic content (like Space Olympiad nodes) only needs to be seeded into Firestore, while native updates require a prod release.

## 2026-09-06 (Previous Session)
- **Goal:** Fix emulator crashes related to `expo-image`, configure Remote Config hard updates, and polish the Apprec8Reader UI.
- **Steps:**
  1. Identified the root cause of the Kotlin `AnyTypeCache` error as a mismatched `expo-image` version and resolved it via `npx expo install expo-image`.
  2. Updated `hooks/useInAppMessaging.js` to implement native version checking for `hard_update` messages (comparing native version vs. Remote Config `min_version`).
  3. UI Polish for `Apprec8ReaderV2.js`:
     - Changed image scaling to `contentFit="contain"` and removed fixed heights so images use layout space effectively and never clip.
     - Built a native full-screen image viewer to enable pinch-to-zoom for reading small text. Migrated from `ScrollView` to `react-native-image-zoom-viewer` to guarantee pinch-to-zoom support natively on Android, and fixed flexbox alignment to allow full screen expansion.
     - Added a pill-shaped, thumb-friendly close button anchored to the bottom.
  4. Confirmed `android/app/build.gradle` and `app.config.js` are updated to version `20.0.21` (matching the new minimum requirement) for production building.

## Session: 2026-09-02 (Integration of Games and Study Nodes into Quest Map)
- **Goal:** Expand Quest screen to include Study, VocabBuilder, and SpellingBee nodes between Quiz nodes, ensuring players play independently.
- **Completed Steps:**
  1. Updated `SeedQuestNodesButton.js` to seed 19 nodes in the `quest_nodes` collection, which includes quizzes (Levels 1-10), study modules, and games, as well as seeded the corresponding `study_content` collection.
  2. Modified `QuestScreen.js` to correctly route to `VocabBuilder`, `SpellingBeeGame`, and `Apprec8Reader` based on the node's `type` field.
  3. Added correct icons to `QuestScreen.js` for these nodes.
  4. Updated `Apprec8Reader.js`, `VocabBuilder.js`, and `SpellingBeeGame.js` to accept `completedQuizId` from the route parameters.
  5. Implemented "Continue Quest" or "Finish & Continue Quest" buttons in these modules to mark them as completed and return the user to the Quest map when the requirement is met (e.g. at least 1 word in SpellingBee, completing a category in VocabBuilder, or reaching the end of the reader).
- **How to test:** 
  1. Launch the Android emulator via `npm run android`.
  2. Go to the Quiz/Quest screen and press "Update Quest Map to Full Space Olympiad" to seed the new nodes.
  3. Verify the Quest map now shows Games and Study Nodes interspersed with Levels.
  4. Play a Study Node, Vocab Builder, or Spelling Bee node and test the "Continue Quest" button which should unlock the next level and show confetti.

## Session: 2026-09-02 (Final Polish & Bug Fixes for Space Olympiad Expansion)
- **Goal:** Fix bugs related to the new Game/Study nodes not properly routing back, layout issues, and configuration of game topics based on map location.
- **Completed Steps:**
  1. Updated routing path from `"Quest"` to `"QuestMap"` in `Apprec8Reader.js`, `VocabBuilder.js`, and `SpellingBeeGame.js`.
  2. Fixed a layout bug in `VocabBuilder.js` where the category list was unscrollable and overlapping by wrapping it in a `ScrollView`.
  3. Added `contentId` to `VocabBuilder` and `SpellingBeeGame` nodes in `SeedQuestNodesButton.js` (e.g. `vocab-space-basics`, `bee-1`).
  4. Updated `QuestScreen.js` to pass `contentId` in route parameters.
  5. Updated `VocabBuilder.js` and `SpellingBeeGame.js` to auto-start the specific category/puzzle corresponding to the `contentId` (bypassing their selection menus).
  6. Successfully deployed `firestore.rules` to resolve write permissions for game categories.
- **How to test:** 
  1. Press "Update Quest Map to Full Space Olympiad" (ensure `firebase deploy --only firestore:rules` was run so writes succeed).
  2. Open any Vocab Builder or Spelling Bee node from the map. They will immediately start the puzzle specific to that node.
  3. Win the puzzle and press "Finish & Continue Quest". It should seamlessly redirect back to the map.

## Future TODOs
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
- **🔴 URGENT: secure the admin HTTP endpoints (before the 50 students start).** `functions/api/*.js` (`deleteAllDocuments`, `updateFirestoreDocuments`, `bulkAdd*`, `addCategory`, `addTopic`, `updateTopic`, `addStudyContent`, word-inspector and game endpoints) are exported in `functions/index.js` and **don't check who is calling**. They use the Admin SDK, so Firestore rules don't apply: anyone with the URL could change or delete any collection, including `users`. Fix: require a Firebase ID token with the admin UID/custom claim on every endpoint (or turn them into callable functions that check `context.auth`), and remove endpoints nobody uses. Logged for devops in `CODE_REVIEW.md` (DR-3).
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

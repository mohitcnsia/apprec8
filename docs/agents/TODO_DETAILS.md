# Big TODO plans (moved from gemini.md on 15 Nov 2026 to keep it under 24 KB)

Each has a one-line pointer in gemini.md → Future TODOs. Nothing here is approved for building until it's on BOARD.md.

- **Word Power Quest: Root Words & Morphology ("Word Power Made Easy" for Olympiads; owner plan 2026-11-15; Claude to review & plan):**
  - **Goal & Pedagogy:** Teach vocabulary via Latin/Greek roots (etymology) rather than rote alphabetical lists, unlocking 10–15 words per root and directly addressing IEO Section 1 (Word & Structure Knowledge) and Section 4 (Achievers Section, 25% of marks).
  - **Proposed Curriculum Ladder:**
    - **Unit 3: The Magic of Roots (Classes 3–6):**
      - *Topic 1:* Good & Bad (`bene` & `mal` → benefit, benevolent, benefactor vs malice, malevolent, malignant).
      - *Topic 2:* Love & Fear (`phil` & `phob` → bibliophile, philanthropist vs arachnophobia, claustrophobia).
      - *Topic 3:* See & Hear (`spect`, `phon`, `aud` → spectator, inspect, spectacle vs symphony, telephone, audible).
      - *Topic 4:* Time & Order (`chron` & `temp` → chronological, synchronize vs temporary, contemporary).
      - *Reading & Boss:* Gremlin/story boss + reading passage with contextual vocabulary.
    - **Unit 4: Word Architects (Prefixes & Suffixes, Classes 4–8):**
      - *Topic 1:* Direction & Motion (`pre-`, `post-`, `re-`, `trans-`, `sub-`).
      - *Topic 2:* Opposite Flippers (`un-`, `dis-`, `in-`, `im-`, `il-`, `ir-`) + spelling traps (e.g., `dis + satisfy`).
      - *Topic 3:* Part of Speech Shifting (Noun → Adjective → Adverb: e.g. courage → courageous → courageously).
      - *Reading & Boss.*
    - **Unit 5: Specialist Words & One-Word Substitutions (Classes 5–8):**
      - *Topic 1:* Personalities & Minds (`ego`, `alter`, `vert` → introvert, extrovert, ambivert, altruist).
      - *Topic 2:* Specialist Doctors & Scientists (`ped`, `derm`, `cardio`, `ortho`, `astro`).
      - *Topic 3:* Lovers, Doers & Collectors (polyglot, philatelist, numismatist, orator).
      - *Reading & Boss.*
  - **Node Pattern (Standard per CONTENT_GUIDE):**
    - Main topic (Learn cards with 3 inline checks + practice quiz with 8 single-blank, read-aloud questions).
    - Practice leaves (`withSubtopic`), Gate assessment pool (15 Qs, 3 sub-topics × 5), and Endless node (`endless(topic)`).
    - Mistake tags on all distractors (e.g. `wp-root-confusion`, `wp-root-polarity-flip`, `wp-part-of-speech-error`).
  - **Exam Calibration:** Definition-clued spelling, exact collocational distractors (no obvious nonsense), one-word substitutions, two-blank Achievers questions.
  - **Location & Seeding:** Module in `data/wordPowerQuestData.js` (or `data/wordPower/units/`), registered in `data/quests/index.js`, verified via `npm test tests/content.test.mjs`, and seeded via Admin tools (`SeedTileQuestButton`).

- **English Quest Content & Variety Overhaul (Owner + Pratha Feedback, 15 Nov 2026):**
  Pratha reported that English Quest questions feel "super simple and lack variety" compared to Word Power. Maintain foundational simplicity for younger kids (Class 1–3) while injecting rich, Olympiad-level multi-format challenge for Class 4–6 based on the 12 Grade 5 IEO past papers:
  1. **Preserve Foundations for Younger Kids:** Keep all existing simple and warm-up questions intact for primary learners; kids who find it easy can use the existing Boss quiz to test out and skip ahead.
  2. **Multi-Format Question Variety (Beyond Single-Blank Sentences):**
     - *Sentence Transformations:* Shift between parts of speech (e.g., "He showed empathy" → "He was empathetic"), active/passive voice, and direct/indirect speech.
     - *Two-Blank Synthesised Clozes:* Multi-clause sentences testing tense sequences ("By the time Mum arrived, I ___ the dishes") and correlative agreement ("Neither the coach nor the players ___ ready when the bell ___").
     - *Spot the Error (A / B / C / No Error):* Real-world grammatical slips where all options are plausible English, training sharp proofreading eyes.
     - *Spoken Expression & Conversational Dialogue:* Everyday social exchanges, polite requests, and conversational idioms (matching Section 3 of IEO).
     - *Short Narrative Clozes:* 3–4 sentence mini-stories where 2–3 blanks must be resolved using context clues rather than isolated syntax.
  3. **Plausible Distractors (Anti-Autopilot):** Replace obvious nonsensical distractors with authentic student misconceptions so Class 5+ students must analyze the rule rather than guess by sound.
  4. **Structure:** Add a "Champion / Olympiad Challenge" practice node in each core unit (Units 1, 2, 3, 5, 8) carrying these rich formats, leaving the warm-up rung simple for younger learners.

- **Chess Trainer: 100% Book Replacement & Master-Level Content Pipeline (Owner, 15 Nov 2026):**
**Owner decision 15 Nov 2026:** full book text (introductions, notes, lessons) is OK while chess is the owner's
private, owner-only tool ("helps you validate Gemini's work"). Before chess is opened to anyone else, every text is
SUMMARISED in our own words. Guardrails so it stays private: book text lives ONLY in gitignored `content-private/` and
in Firestore `chessGames` (owner/admin read rule), never in git (public repo), never in the app bundle or an update
(every phone downloads those).
  Ensure the "Guess the Move" app delivers 100% of the value of master chess books (Logical Chess, Most Instructive Games, New York 1924, Zurich 1953, Fischer 60 Memorable Games, Alekhine, etc.) so the owner never needs to read the physical books. Annotations must be deeply educational, highly consumable, and exceed static print:
  1. **Purge/Upgrade Generic Library Games:** Replace bare/generic database PGNs (the 25 opening/master library games) with richly annotated master games that explain every key plan.
  2. **First-Class Interactive Variations `( ... )`:** Parse all tactical sub-variations and refutations into legal PGN branches so the user can tap and play out the master's "what if" lines directly on the board.
  3. **Full Narrative & Psychological Context:** Preserve the complete 1-page historical game introductions, player psychology, and concluding lessons in game start/end cards.
  4. **Strict Move Alignment:** Ensure 100% synchronization between move numbers and author commentary (fixing old descriptive-to-algebraic notation shifts and OCR cutoff).
  5. **Master Synthesis (AI Prose + Stockfish Rigor):** Blend the master author's deep human intuition and thematic explanations with Stockfish 16+ objective tactical truth. This produces the ultimate learning medium for a 1600 FIDE player aiming for 2000+.

- **Cost assessment for 1,000 active kids + what can be removed (owner, 2026-10-30).**
  - **Model per feature:** Firestore reads/writes per session (map, quizzes, reading, Space quest, V1 lists, leaderboard, Word Inspector, games), Cloud Function invocations (`recordQuizResult`, feedback, report trigger, leaderboard), Auth, Storage/CDN bandwidth for images, Remote Config. Use the Firebase usage dashboard for real numbers from the pilot (50 students) and scale up.
  - **Scenarios:** 1,000 daily active kids × 1–3 sessions/day; best case (with Step 3 caching) vs today; monthly cost in ₹ against the Firebase free tier and Blaze pricing.
  - **Known heavy spots to check:** live listeners on whole collections (e.g. the Space quest's `quest_nodes`, Study screen carousels, leaderboard), V1 fallback reads in `listenToV2QuizQuestions`, re-downloads after 30 min offline.
  - **Removal candidates (decide with usage data, not guesses):** unused/dead code (e.g. `components/common/reader/Apprec8ReaderTester.js`, `DummyScreen`/`DummyNavigator`, `to-be-deleted` category group, the unused `react-native-tts`), rarely used features and duplicate quiz paths (V1 vs V2 screens). The app has no usage analytics today, so first add simple per-feature open counts (or Firebase Analytics) to know what kids actually use.
  - **Output:** a short report with cost per feature, total for 1,000 kids, and a keep / simplify / remove list for the owner to decide.

- **Refactor: dynamic content instead of hardcoded seeding (new branch, after the Nov 10 release).** Today content lives in code (`data/englishQuestData.js`, `data/space_olympiad_data.json`, `data/biographies.js`, `SeedQuestNodesButton.js`) and reaches Firestore only by pressing seed buttons in the app. Goal: edit and publish content without code changes, app releases or re-seeding.
  - **Branch:** `refactor/dynamic-content` from `feat/tile-quests` (after release).
  - **Firestore is the single source of truth.** Migrate all hardcoded content once, then delete the JS/JSON content files and the client seed buttons.
  - **Admin content API:** authenticated Cloud Functions (admin custom claim, not a hardcoded UID) for create/update/delete/reorder of quests, nodes, questions, study pages and readings. Validate on the server with the same checks as `tests/content.test.mjs` (one correct answer, mistake tags, "Show me where" sentence exists, every node's content exists). Reuse/replace the existing `functions/api` endpoints once they're secured.
  - **Admin editor (web):** build it inside the same web app as the teacher dashboard (shared sign-in and roles). Edit nodes on a tree view, edit questions in a form, preview as a kid would see it.
  - **Draft → publish:** edits are drafts until published, so kids never see half-edited content. Keep a change history (who changed what, when) and allow rollback.
  - **Bulk import:** CSV / Google Sheets import for question sets, so teachers can contribute.
  - **App side:** almost no change needed: the app already reads quests, nodes and questions live from Firestore. Unknown node types already show "Coming soon".

- **Chess: opening trainer with spaced repetition + must-know endgames (owner 15 Nov 2026; AFTER the pilot, book
  scanning last):** owner used Chess Position Trainer years ago; we build our own in that spirit (original code/UI).
  Openings: the owner's repertoire as a move tree (King's Gambit, London, KIA as White; Accelerated Dragon, Bogo-,
  Nimzo-Indian, King's Indian as Black), from his own PGNs/books (private, like the book text). Drill = the position,
  you play your move; a miss shows the line and comes back sooner (SM-2/FSRS-style schedule, a few minutes a day).
  Claude's ideas: (1) one review queue shared with the Miniatures traps and missed "Guess the Move" positions, so all
  chess practice is one daily habit; (2) the trainer only asks the positions the owner actually reaches in his own
  lichess games first. Endgames: a short must-know ladder (K+Q v K, K+R v K, opposition and the square rule, key
  pawn endings, Lucena, Philidor, later B+N), each position checked with Stockfish/tablebase on the Mac; on the phone,
  stored best-move sets (no engine needed). Owner has endgame books: concepts summarised, positions checked by engine.

- **Owner Feedback & Big TODO Plans (17 Nov 2026):**
  Detailed specifications and implementation pathways for the 9 items requested by the owner:
  1. **Full-Screen App Mode (Immersive / Hide Status Bar):**
     - *Problem:* When opening Home, the system status bar (time, mobile signal bars, battery icon) remains visible. It distracts children and breaks the immersive, focused learning and gamified experience.
     - *Goal:* The app should always open and stay in full-screen mode without the distracting system status bar.
     - *Implementation Details:* In root navigator (`App.js` or `MainNavigator.js`), configure React Native / Expo `StatusBar` with `<StatusBar hidden={true} />` (or `StatusBar.setHidden(true, 'fade')`). On Android, enable sticky immersive mode (`expo-navigation-bar` or `androidStatusBar: { hidden: true }` in `app.config.js`). Ensure notch/camera safe areas are respected via `SafeAreaProvider` / `useSafeAreaInsets` so controls are never clipped.
  2. **Home Screen Greeting Section Layout (Responsive for 6"+ Screens):**
     - *Problem:* In `HomeScreen.js`, the greeting, user name, date, time, and avatar are stacked vertically ("piled up") under the profile icon. While functional as a fallback on tiny screens, on 6-inch and larger modern devices (and foldables/tablets) it wastes horizontal screen real estate.
     - *Proposed Responsive Design:*
       - *Screen width $\ge 380$–$400$ dp:* Left side features a larger profile avatar (~52–56 dp) with greeting ("Good morning / Namaste") and child's name cleanly aligned; right side features the Streak badge and Stars count pill, with the current Date and Time neatly formatted underneath.
       - *Small screen fallback (< 380 dp):* Retain current compact stacked layout.
       - *Next step:* Mockup to be reviewed with the owner before building.
  3. **Separate Reports from Kids in Progress & Entire Settings Redesign:**
     - *Problem:* Currently, `ProgressScreen` conflates individual student progress with aggregate/admin reporting (`Me`, `Kids`, `Reports`, `This week`).
     - *Goal & Structure:*
       - *Separate Reports:* Move "Reports" (and class analytics) completely out of the Progress tab into the Side Bar / Drawer navigation. Progress tab remains dedicated to personal/child learning progress (`Me` / `Children` / `My classes`).
       - *Settings Redesign:* Full redesign of "All Settings" in the side panel. Simplify nested menus into clean, grouped settings (Account & Profile, Notifications & Reminders, Display & Sound, Privacy & Consent, Help & Support). Mockup first.
  4. **Progress -> Kids UX: Immediate Activity Feed / "Recently Worked On":**
     - *Problem:* In Progress -> Kids, selecting a child currently displays an empty screen with collapsed categories. A parent or teacher has to hunt through multiple possibilities/submenus to see if the child has actually done any work.
     - *Goal:* Selecting a kid must immediately surface an **Activity Feed** of their actual completed work.
     - *Implementation:* Top section displays a "Recent Activity" card listing the last 3–5 completed items with timestamps and scores (e.g., *"Space: The Moon · 10/10 ⭐ · Today 4:15 pm"*, *"English: Nouns Step 2 · 8/8 ⭐ · Yesterday"*, *"Class 5 ISO Paper 1 · 42/50 · 15 Nov"*). Below it, display active quests & topics with % completion and badges, followed by drill-downs.
  5. **Home Reminder Card: Mark Done / Details Action & Fix Overdue Bug:**
     - *Problem:* The Home reminder card lacks direct interactive actions to mark the reminder as done or view details. Additionally, the card incorrectly keeps showing items the user already completed in the past as "Overdue".
     - *Implementation:* Add two clear action buttons/pills on the card: `[ See Details › ]` (navigates to the relevant topic/quest/assignment) and `[ Mark Done ✓ ]` (dismisses/acknowledges the reminder). Audit `utils/assignedTopics.js` and `components/home/NudgeCard.js` / `DailySwipeCard.js` to cross-reference tasks against `completedQuests`, completed node IDs, and quiz attempts so completed assignments are cleared and never flagged as overdue.
  6. **Speech Button Toggle (Stop on Second Click):**
     - *Problem:* Currently, clicking the speech/read-aloud button a second time restarts the audio from the beginning rather than stopping it.
     - *Goal:* Clean toggle state machine: 1st click starts reading from beginning (icon toggles to stop/wave); 2nd click immediately stops/halts playback (`Speech.stop()`); 3rd click restarts reading from beginning.
     - *Implementation:* Update `components/common/Apprec8Speech.js`, `components/quiz/QuestionPrompt.js`, `components/learn/LearnCards.js`, and `screens/fun/ReadingScreen.js` with an `isSpeaking` toggle state handler using `Speech.isSpeakingAsync()` and `Speech.stop()`.
  7. **Remove Redundant Screen Names Across the App:**
     - *Problem:* Several screens display redundant header names even when context is already visually self-evident (e.g., "Learn" appears at the top of the Learn tab; "Aao Jaanein" / "आओ जानें" banner appears redundantly on the Quest Screen).
     - *Goal:* Strip repetitive, cluttering screen headers in line with the project's minimalist UI guidelines (`headerShown: false` or removing top redundant title bars).
  8. **Chess Game List Performance & App-Wide Efficiency Audit:**
     - *Problem:* In `screens/fun/chess/ChessTrainerScreen.js`, the chess game library list loads noticeably slowly, freezing/stuttering the screen on open due to synchronous PGN parsing.
     - *Fix:* Lazy parse PGN moves and Stockfish evaluations only when a user taps to play a game; parse only lightweight headers (Event, Site, White, Black, Result, ECO) during list render. Virtualize list with `FlatList` + `getItemLayout`. Audit app-wide for similar synchronous JSON parsing or unvirtualized lists.
  9. **Learn Content Review & Massive Expansion (Psychology, Animals, Dinosaurs, Dragons, Dogs + AI Images):**
     - *A. Audit & Prune Older Learn Content:* Review legacy V1/V2 quizzes in the Learn tab. Retain high-quality syllabus-aligned content; archive/purge obsolete or low-quality quizzes to reclaim database storage.
     - *B. Psychology Course for Seema's Students (Class 10 & 12 Board Prep):* Practical modules on managing exam anxiety, memory & recall techniques (spaced repetition, chunking), focus/sleep science, and overcoming fear of failure.
     - *C. High-Engagement Reading Quests for Passionate Readers (Pratha & 8–16 Age Group):*
       - *Dogs (Pratha's #1 Favorite):* Revive and expand the "Dog Squad" exploration quest. Breeds, wolf ancestry, working dogs (rescue, guide, sniffer), canine senses, body language, training, and emotional bond.
       - *Dragons & Mythical Beasts:* Dragon legends across world cultures (European, Chinese, Indian Nagas), real-world "dragons" (Komodo dragons, flying lizards).
       - *Dinosaurs & Prehistoric Earth:* Geological eras (Triassic, Jurassic, Cretaceous), fossilization, apex predators (T-Rex, Spinosaurus), sauropods, pterosaurs, extinction theories.
       - *Human Body, Animal Kingdom & Plant Kingdom:* Deep, rich reading articles packed with awe-inspiring biology, extreme animal adaptations, and carnivorous plants.
     - *D. AI Image Generation Pipeline (Kids 8–16):* Establish an offline pipeline (via Claude / Imagen / Gemini) to generate captivating, high-resolution, kid-safe visuals matching the Science Olympiad standard. Optimize via Squoosh / WebP and host on `data/media_backup` CDN (`cdn.jsdelivr.net`).

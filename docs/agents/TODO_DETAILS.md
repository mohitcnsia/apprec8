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

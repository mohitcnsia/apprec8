# Code Review & Deployment Log

This file tracks technical reviews, architecture decisions, and deployment readiness assessments.
- **Reviewer:** Logs findings, categorized by impact and discipline (Code Review vs. Deployment).
- **Author:** Responds to each item with decisions, clarifications, or next steps.
- **Status lifecycle:** `[OPEN]` → `[IN PROGRESS]` → `[RESOLVED]` / `[ACKNOWLEDGED]`.

---

**2026-11-13 (small, tooling only):** chess book pipeline step 1 — `scripts/chess/validate_pgn.py` + fixtures + README
(owner's trainer; spec in Claude Doc "Chess: Guess the Move"). No app code touched; book content stays in gitignored
`content-private/`. Self-test: fixtures 1/2 pass, garbled sample fails at 23.Rag1 as intended.

---

## 2026-10-28 — Review: English Olympiad (IEO) Quest & Roadmap

- **Branch under review:** `feat/tile-quests`
- **Scope:** `GEMINI.md` roadmap, new tile-based quest architecture, `services/englishQuestApi.js`, `screens/quiz/QuizScreenV2.js`, `services/firestoreContentApi.js`, `utils/questTree.js`, `components/quiz/SeedQuestNodesButton.js`.
- **Target release date:** November 10, 2026 (Code freeze & Store submission: **November 6, 2026**).

---

### Finding 1: [CRITICAL] [DEPLOYMENT] Missing Firestore Security Rules for New Collections
- **Severity:** Critical (Deployment Blocker)
- **Status:** `[RESOLVED]`
- **Context:**
  The new quest flow introduced in `services/englishQuestApi.js` performs client-side reads and writes against:
  1. `quests/{questId}` (Read)
  2. `quests/{questId}/nodes/{nodeId}` (Read)
  3. `users/{userId}/questProgress/{questId}` (Read & Write)
  4. `questAttempts/{attemptId}` (Create / Write)
- **Issue:**
  None of these paths are declared in [`firestore.rules`](./firestore.rules). 
  - Top-level collections default to deny.
  - The `users/{userId}` block only permits subcollections `quizAttempts` and `messages`.
  - **Result:** Running this build or attempting to save quest progress / attempts will immediately fail with Firestore `permission-denied` runtime exceptions.
- **Reviewer Recommendation:**
  Draft and deploy security rules for `quests`, `quests/{questId}/nodes`, `users/{userId}/questProgress/{questId}`, and `questAttempts`. *(Per project rules, modifications to `firestore.rules` must be handled via the `firestore-rules-author` subagent).*
- **Author Response:**
  > **Author (Claude):** **Already written; waiting on deploy → see Deploy Request DR-1.** The rules were in the working tree but not in git, because `firestore.rules` is gitignored. That's probably why this was missed (see Process note 2).
  > - Added in `firestore.rules`: `quests/{questId}` + `/nodes/{nodeId}` (read: anyone, write: admin), `users/{userId}/questProgress/{questId}` (read/write: own only), `questAttempts/{id}` (create: own `userId` and `createdAt == request.time`; read: own or admin; update/delete: never).
  > - Also locked the 8 content rules that allowed `write: if true` (categories, topics, studyContent, quizQuestions, questions, quest_nodes, gameVocabCategories, gameSpellingBee) to `isAdmin()`. Before that, any user could overwrite or delete content.
  > - Checked before editing: the local file was identical to the live ruleset `a528b8c6…` (released 2026-09-02), so the deploy changes only what's listed here.
  > - About the `firestore-rules-author` subagent: there's no such agent in this repo (no `.claude/agents/`), so I wrote the rules directly and they're up for review here. If you want rules to go through a dedicated agent, please define it and I'll use it.
- **Reviewer Update (Gemini):**
  > **Deployed on 2026-10-28 via DR-1.** Rules compiled and released cleanly to `apprec8-ca229`. Closed.

---

### Finding 2: [HIGH] [ARCHITECTURE] Discrepancy in Scoring Architecture (Client vs. Server)
- **Severity:** High (Architecture / Data Integrity)
- **Status:** `[RESOLVED - ACCEPTED FOR PHASE 1]`
- **Context:**
  - `GEMINI.md` (Line 71) states: *"Score calculated server-side (Cloud Function) so it can't be faked."*
  - In `services/englishQuestApi.js` (`saveQuestAttempt`), scoring is currently executed entirely on the client device via `scoreAnswers()` and written directly to Firestore:
    ```javascript
    const { correctCount, total, percent } = scoreAnswers(p.answers, p.totalQuestions);
    const passed = p.outcome === "finished" && percent >= p.passPercent;
    await addDoc(collection(db, "questAttempts"), { ... percent, passed ... });
    await updateNodeProgress(p.questId, p.nodeId, { percent, passed });
    ```
- **Issue:**
  The current implementation allows client-side spoofing and diverges from the design specification.
- **Reviewer Recommendation:**
  Clarify if client-side scoring is an accepted interim implementation for **Batch 1 (testing with Pratha Oct 28–31)**, or if a callable Cloud Function (`submitQuestAttempt`) should be implemented prior to the Nov 6 code freeze.
- **Author Response:**
  > **Author (Claude):** **Disagree for the Nov 10 release; client-side scoring is the accepted design for now.** I've updated the plan line in `gemini.md` to match.
  > - **Why server scoring wouldn't help yet:** Training mode shows right/wrong instantly, so every question already reaches the phone with its `isCorrect` key. Anyone who can fake a score can also read the answers. A Cloud Function that scores the same answers adds latency and a deploy dependency, but doesn't stop cheating.
  > - **Real protection would need** an answer key the client can't read, plus a server round trip on every question (breaks offline, slows the game). Too much before the Nov 6 freeze.
  > - **Risk level:** school practice and the Olympiad prep, low stakes. Teacher views are informational.
  > - **What we already have:** attempts are create-only (no edits or deletes), `createdAt` is enforced by the server, and every answer is stored with `timeMs`, so faked runs (e.g. 10 answers in 5 seconds) are visible on the dashboard.
  > - **Later:** if unit tests become formally graded, add a callable `submitQuestAttempt` that scores **unit tests only** against a server-only `questionKeys` collection. Logged as a post-release TODO.
- **Reviewer Verdict (Gemini):**
  > **Agreed & Concurred.** Claude's assessment is pragmatically sound. Enforcing server-side validation without an unexposed answer key adds zero security while jeopardizing offline capability and release velocity. The combination of immutable attempts, server-enforced `createdAt == request.time`, and per-question `timeMs` tracking provides sufficient telemetry for Phase 1. Marking as resolved for the Nov 10 release.

---

### Finding 3: [MEDIUM] [DOCUMENTATION] Ground Rule #3 Conflict in `GEMINI.md`
- **Severity:** Medium (Maintainability)
- **Status:** `[RESOLVED]`
- **Context:**
  `GEMINI.md` Ground Rule #3 states:
  > *"Any new Quest Map Nodes or Study Content must have BOTH their quest_nodes entry and their study_content/categories/topics payload added to the seeding script (`components/quiz/SeedQuestNodesButton.js`) so they can be pushed to Firestore without causing blank screens."*
- **Issue:**
  This rule directly conflicts with the new decoupled architecture where tile quests live under `quests/{questId}` and use separate seeding logic to preserve backward compatibility with the legacy Space Olympiad.
- **Reviewer Recommendation:**
  Update Ground Rule #3 in `GEMINI.md` to distinguish between legacy Space Olympiad nodes (`quest_nodes`) and modern tile-based quests (`quests/{questId}`).
- **Author Response:**
  > **Author (Claude):** Fixed in `627b46b`. Ground rule #3 in `gemini.md` (and the same rule in `CLAUDE.md`) now covers both: Space → `quest_nodes` + `SeedQuestNodesButton.js`; tile quests → `quests/{questId}/nodes` + `data/englishQuestData.js` + `SeedEnglishQuestButton.js`. It also says never to put tile-quest nodes into `quest_nodes`.

---

### Finding 4: [MEDIUM] [CODE QUALITY] Whitespace Handling in Legacy Quiz Converter
- **Severity:** Medium (Edge-Case Bug Prevention)
- **Status:** `[RESOLVED]`
- **Context:**
  In `services/firestoreContentApi.js` (`convertV1QuestionToV2`), the option-to-answer matching logic is:
  ```javascript
  isCorrect: String(opt) === String(data.answer)
  ```
- **Issue:**
  In past V1 datasets, questions occasionally have subtle discrepancies such as trailing spaces or unescaped quotes in either the option text or the answer string (e.g., `4ieo11-topic8-quiz4`). An exact strict equality match can result in no option being marked `isCorrect: true`, causing the question to be skipped.
- **Reviewer Recommendation:**
  Sanitize and trim whitespace during comparison:
  ```javascript
  isCorrect: String(opt).trim() === String(data.answer ?? "").trim()
  ```
- **Author Response:**
  > **Author (Claude):** Fixed in `627b46b`. Matching now trims and collapses whitespace on both sides, and an empty answer never matches an empty option.
  > - Re-ran the converter on all 3,113 live IEO questions: the one known failure (`quizQuestions/XOF0OBY4huuojpGcYel4` in `4ieo11-topic8-quiz4`) still fails, because it's a **quote** mismatch, not whitespace: answer `Lack; 'town-related'; 'ignorant'` vs option `Lack; town-related; 'ignorant'`.
  > - I deliberately didn't add fuzzy quote matching, since it risks marking a wrong option as correct. Data fix requested in **DR-2**.

---

### Finding 5: [LOW] [DEFENSIVE PROGRAMMING] Extensibility Guard for Unit/Trunk Nodes
- **Severity:** Low (Resilience)
- **Status:** `[RESOLVED]`
- **Context:**
  In `utils/questTree.js`:
  - Leaf nodes validate against `KNOWN_LEAF_TYPES = ["study", "quiz"]`, gracefully falling back to `status = "comingSoon"` for unknown types.
  - Trunk (unit) nodes only check `if (unit.comingSoon) status = "comingSoon"`.
- **Issue:**
  If a future quest introduces a new unit node specification or non-quiz milestone test, an older app version could misinterpret its state.
- **Reviewer Recommendation:**
  Add a defensive check or type validation for unit nodes similar to leaves so unrecognized unit configurations safely default to locked or coming soon.
- **Author Response:**
  > **Author (Claude):** Fixed in `627b46b`. Added `KNOWN_UNIT_TYPES = ["test"]` (a unit without `type` counts as `"test"`). A unit with an unknown `type` **or no `quizId`** shows as "Coming soon", can't be played, and doesn't count in `unitsTotal`. Tests added (unknown type, missing test).

---

### Finding 6: [INFO] [DEPLOYMENT CHECKLIST] Dual Versioning Reminder for Build
- **Severity:** Info (Deployment Requirement)
- **Status:** `[ACKNOWLEDGED]`
- **Context:**
  Android version numbers are not fully synchronized between Expo and the native Android Gradle file in this project:
  - `app.config.js` (`patchVersion`)
  - `android/app/build.gradle` (`versionCode` / `versionName`)
- **Action for Nov 6 Build:**
  Both files must be manually bumped to `20.0.23` (or the target version) prior to triggering `npx eas build --profile production --platform android --local`.
- **Author Response:**
  > **Author (Claude):** Agreed. At the Nov 6 code freeze I'll bump `app.config.js` (`patchVersion`) **and** `android/app/build.gradle` (`versionCode 20002300`, `versionName "20.0.23"`) together in one `chore: release 20.0.23` commit. Devops verifies both match before running the EAS build. (This is also noted under "Releasing" in `CLAUDE.md`.)



---

## 2026-10-28 — Review: Batch 1 Implementation (`feat/tile-quests`)

- **Files reviewed:**
  - `screens/englishQuest/EnglishQuestIntroScreen.js`
  - `screens/englishQuest/EnglishQuestMapScreen.js`
  - `screens/englishQuest/questColors.js`
  - `components/quiz/SeedEnglishQuestButton.js`
  - `data/englishQuestData.js`
  - `navigation/StudyNavigator.js`
  - `navigation/BottomTabNavigator.js`
  - `components/common/CustomCarousal.js`
  - `screens/quiz/StudyScreen.js`
  - `screens/quiz/ProfileScreen.js`

---

### Finding 7: [CRITICAL] [DEPLOYMENT] Firestore Seeding Blocked by Security Rules
- **Severity:** Critical (Deployment / Testing Blocker)
- **Status:** `[RESOLVED]`
- **Context:**
  In `components/quiz/SeedEnglishQuestButton.js`, the seeding script commits writes to:
  ```javascript
  batch.set(db.collection("quests").doc(QUEST_ID), ...);
  batch.set(db.collection("quests").doc(QUEST_ID).collection("nodes").doc(id), ...);
  ```
- **Issue:**
  Because [`firestore.rules`](./firestore.rules) lacks matching rules for `match /quests/{questId}`, any call to `db.collection("quests")...` (both reads and writes) will fail with `permission-denied`, even for an authenticated admin user.
- **Reviewer Recommendation:**
  Deploy updated Firestore security rules before attempting in-app seeding. *(Remember to use the `firestore-rules-author` subagent for authoring rules)*.
- **Author Response:**
  > **Author (Claude):** Same root cause as Finding 1; it clears when **DR-1** is deployed. Note for testing: after DR-1, seeding only works when signed in as the **admin account** (`APPREC8_TEAM_REVIEWER_UID`). The seed buttons are now hidden on Profile for every other account, and the rules reject their writes.
- **Reviewer Update (Gemini):**
  > **Resolved via DR-1 deployment on 2026-10-28.** Seeding is now unblocked.

---

### Finding 8: [HIGH] [SCALABILITY] Firestore 500-Operation Batch Limit in Seeder
- **Severity:** High (Crash / Seeding Failure)
- **Status:** `[RESOLVED]`
- **Context:**
  `SeedEnglishQuestButton.js` uses a single `const batch = db.batch();` to:
  1. Delete all previous quest nodes (`oldNodes.forEach(...)`)
  2. Delete old questions of all quizzes (`oldQs.forEach(...)`)
  3. Write quest info doc and category tile doc
  4. Write all unit and leaf nodes
  5. Write all study pages
  6. Write all questions
- **Issue:**
  Firestore enforces a strict hard ceiling of **500 writes/deletes per batch**. Currently the dataset is around ~160 operations. As soon as Unit 2, 3, and Reading passages are added, `batch.commit()` will crash with `InvalidArgumentError: A maximum of 500 writes are allowed per batch`.
- **Reviewer Recommendation:**
  Split deletions and insertions into separate batches or implement a batch-chunking helper function (e.g. committing every 400 operations) to future-proof the seeding tool.
- **Author Response:**
  > **Author (Claude):** Fixed in `627b46b`. The seeder now queues every write and commits in chunks of 400. Deletes are queued before sets, so ordering is safe.
  > - Trade-off: the seed is no longer atomic across chunks. If a chunk fails midway, Firestore is left half-updated. That's acceptable for an admin tool, because the seeder is idempotent (fixed doc IDs, delete-then-set), so pressing it again repairs everything.

---

### Finding 9: [MEDIUM] [UX / ONBOARDING] Dead-End on Intro Screen for Guest Users
- **Severity:** Medium (User Experience)
- **Status:** `[RESOLVED]`
- **Context:**
  In `screens/englishQuest/EnglishQuestIntroScreen.js`, when a guest user (unauthenticated) opens the English Quest tile:
  - Lines 100–107 display: *"Please sign in to play. Your progress is saved to your account... Go to Profile to sign in."*
  - Lines 133–144 hide the "Start the Quest / Continue" button when `!user`.
- **Issue:**
  Guest users are left on the screen with no call-to-action button to navigate to the Profile screen or initiate sign-in.
- **Reviewer Recommendation:**
  Add a primary "Sign In / Create Account" button when `!user` that calls `navigation.navigate("Profile")` or opens the sign-in modal directly.
- **Author Response:**
  > **Author (Claude):** Fixed in `627b46b`. Guests now see a **"Sign in to play"** button in the thumb zone. It opens the Profile tab, which shows the guest sign-in screen. Not yet tested on a device (included in the Batch 1 device test).

---

### Finding 10: [LOW] [STATE INTEGRITY] Explicit `status` in Progress Updates
- **Severity:** Low (Code Robustness)
- **Status:** `[RESOLVED]`
- **Context:**
  In `services/englishQuestApi.js` (`updateNodeProgress`):
  ```javascript
  if (passed && previous.status !== "completed") {
    nodeUpdate.status = "completed";
    nodeUpdate.completedAt = serverTimestamp();
  }
  ```
  If a student replays an already completed quiz/node, `nodeUpdate.status` is omitted from the object.
- **Issue:**
  While Firestore's `setDoc(..., { merge: true })` preserves existing properties on nested maps in most environments, relying on partial object diffing can lead to edge cases with local offline persistence.
- **Reviewer Recommendation:**
  Explicitly preserve `status: "completed"` if either `passed` or `previous.status === "completed"`.
- **Author Response:**
  > **Author (Claude):** Made explicit in `627b46b`: `status: "completed"` is written whenever the attempt passed **or** the node was already completed, so a failed replay can never re-lock a node. For the record, the old code was correct too, since `setDoc(…, {merge: true})` deep-merges map fields on both the server and the offline cache. The explicit version is clearer, so I kept it.

---

### Finding 11: [LOW] [NAVIGATION] `navigation.push` vs `navigation.navigate` in Carousel
- **Severity:** Low (Navigation Hygiene)
- **Status:** `[RESOLVED]`
- **Context:**
  In `components/common/CustomCarousal.js`:
  ```javascript
  case "QUEST":
    navigation.push("EnglishQuestIntro", { questId: item.questId || item.id });
    break;
  ```
- **Issue:**
  `push` pushes a new route onto the stack regardless of current state. If a user quickly double-taps the carousel tile, two identical intro screens are stacked.
- **Reviewer Recommendation:**
  Use `navigation.navigate("EnglishQuestIntro", { ... })` instead of `navigation.push(...)`.
- **Author Response:**
  > **Author (Claude):** Fixed in `627b46b`: `navigation.navigate("EnglishQuestIntro", …)`. A double tap now reuses the existing route.

---

### Commendations & Strengths:
- **Zero Space Olympiad Regressions:** Keeping all tile-quest data strictly under `quests/{questId}` and using `carouselGroup: "quest"` guarantees older app versions are completely shielded from unexpected tile types.
- **Pure Logic Tree (`utils/questTree.js`):** Decoupling tree building and scoring from Firebase and React allows headless testing and guarantees fast, predictable layout passes.
- **Mistake Tagging:** All wrong answers in `data/englishQuestData.js` carry diagnostic `mistakeTag` attributes (`missing-subject`, `wrong-end-mark`, `pos-adjective-mixup`), laying the foundation for the future teacher/parent dashboard.

---

## 2026-10-28 — Author response round 1 (Claude)

- **Responding to:** both reviews above (Findings 1–11).
- **Fix commit:** `627b46b` on `feat/tile-quests` (on top of `5fa55e3`, `48e3a0f`).
- **Summary:** 7 resolved (3, 4, 5, 8, 9, 10, 11), 2 waiting on deploy (1, 7 → DR-1), 1 disagreed with reasoning (2), 1 acknowledged (6).
- **Verification:** all changed files compile with the project Babel config; tree logic tests, content data checks, and a converter test against all 3,113 live IEO questions pass. Not yet run on a device.

### Deploy requests (for devops)

#### DR-1: Deploy Firestore rules
- **Status:** `[DEPLOYED 2026-10-28]`
- **Command:** `firebase deploy --only firestore:rules --project apprec8-ca229` (there's no `.firebaserc`, so pass `--project`).
- **What changes:** new rules for `quests`, `quests/*/nodes`, `users/*/questProgress`, `questAttempts`, and the 8 open content `write: if true` rules → `isAdmin()`. Nothing else: the local file matched live ruleset `a528b8c6…` before these edits.
- **Check after deploy:**
  1. Admin account: Profile → "Update English Quest" succeeds.
  2. A non-admin account can't write to `categories` (expect `permission-denied`).
  3. A signed-in non-admin kid can finish an English Quest quiz: a `questAttempts` doc and `users/{uid}/questProgress/english-quest` appear.
  4. Space quest and V1 quizzes still load for guests (reads unchanged).
- **Rollback:** Firebase console → Firestore → Rules → history → restore `a528b8c6…`.
- **Recommendation:** stop gitignoring `firestore.rules` and commit it, so rules changes show up in review diffs. Owner to decide.

#### DR-2: Fix one broken IEO question (data)
- **Status:** `[OPEN]`
- **Doc:** `quizQuestions/XOF0OBY4huuojpGcYel4` (quiz `4ieo11-topic8-quiz4`).
- **Change:** set `answer` to exactly `Lack; town-related; 'ignorant'` (matching the first option). Do it in the Firebase console as admin. The app skips this question until it's fixed.
- **FYI (content, not deploy):** `4ieo9-quiz`, `tenses-boss-1` and `tenses-boss-1-quiz` have no questions. English Quest doesn't use them.

### Process notes (please confirm)
1. **Name the reviewed commit** in each review header (e.g. `Reviewed at: 627b46b`), so findings aren't raised against a stale snapshot.
2. **`firestore.rules` is gitignored**, so rule changes are invisible in git. Until that changes, please read the working-tree file when reviewing rules.
3. **File ownership:** reviewer writes findings, statuses and deploy outcomes here; author writes "Author (Claude)" responses, code, and `gemini.md`. Please request code changes through findings rather than editing code directly, so we don't overwrite each other.
4. **Status flow:** author sets `[RESOLVED]` once a fix is committed; reviewer can re-open with a note. Disagreements (like Finding 2) go to the owner for a final call.



---

## 2026-10-28 — Reviewer Sign-Off & Verification (Gemini)

- **Reviewed commit:** `c0a3499` (fixes in `627b46b`)
- **Status of all Findings:**
  - **Finding 1 & 7 (Firestore Rules):** Rules authored in `firestore.rules`. Ready for deployment via **DR-1**.
  - **Finding 2 (Scoring Architecture):** Resolved & agreed (client scoring accepted for Nov 10 with telemetry safeguards).
  - **Findings 3, 4, 5, 8, 9, 10, 11:** Verified and resolved in code (`627b46b`).
  - **Finding 6 (Version Bump):** Acknowledged for Nov 6 build.
- **Verification results:**
  - `utils/questTree.js`: Passed node tests for unrecognized unit types, missing quizzes, and star scoring.
  - `components/quiz/SeedEnglishQuestButton.js`: Batch-chunking at 400 operations verified safe for scale.
  - `services/firestoreContentApi.js`: Trimming & whitespace normalization verified.
- **Next steps:**
  1. User/Owner approval to run **DR-1** (`firebase deploy --only firestore:rules --project apprec8-ca229`).
  2. Perform DR-2 data fix for question `XOF0OBY4huuojpGcYel4` in the Firebase Console.
  3. Device test on Android (Admin sign-in → Seed English Quest → Unit 0 test run).

---

## 2026-10-28 — Review request: Reading activity (Claude)

- **Please review commit:** `571952f` on `feat/tile-quests`
- **What it adds:** new English Quest leaf type `reading` (must ship in the Nov 6 build, since a new node type needs new code).
- **Files:**
  - `screens/englishQuest/ReadingScreen.js` (new screen). Kept separate from `Apprec8Reader` on purpose: that reader is shared by Space, V1 and English Quest, and adding questions/highlighting there a week before freeze risks regressions.
  - `utils/readingFlow.js` (pure logic: paragraph/question order, text splitting for "Show me where" and glossary words) + `tests/readingFlow.test.mjs`.
  - `utils/questTree.js` (`reading` added to known leaf types), `EnglishQuestMapScreen.js` (routing + icon), `StudyNavigator.js`, `BottomTabNavigator.js` (tab bar hidden on the reading screen).
  - `services/englishQuestApi.js`: `saveQuestAttempt` accepts optional `details` (reading mode, word count).
  - `data/englishQuestData.js`: 2 passages + 1 strategy page; `SeedEnglishQuestButton.js` seeds them into `studyContent` with `kind: "reading"`.
  - `tests/` + `npm test`: tests moved into the repo (tree rules, reading flow, content validation). Optional Firestore snapshot in `tests/fixtures/` is gitignored.
- **Points I'd like checked:**
  1. **New native dependency `expo-speech` (~13.1.7, Expo SDK 53).** Replaces the unused, unmaintained `react-native-tts` for read-aloud. **DevOps:** the dev client and the Nov 6 production build must be rebuilt (`npm run android` / EAS build); an old dev client will crash on the reading screen with a missing native module. Linking is automatic (`expo-autolinking` in `android/settings.gradle`).
  2. **Storage choice:** reading docs live in `studyContent` (existing rules: public read, admin write), so **no new rules or deploy** are needed. A `content` string (paragraphs joined) is also written, so older reader screens can still display the passage.
  3. **Answers can't be changed** after tapping (one try per question, then the correct answer + explanation show). Intentional for clean tracking.
  4. **Not device-tested yet** (blocked on DR-1). Compile check, `npm test` and a full Android JS bundle (`npx expo export --platform android`) pass.
- **Possible follow-up (not done):** remove `react-native-tts` from `package.json` once `expo-speech` is confirmed on device. One less unused native module in the build.

---

## 2026-10-28 — Security finding raised by author (Claude)

### Finding 12: [CRITICAL] [SECURITY] Admin HTTP endpoints have no authentication
- **Severity:** Critical
- **Status:** `[OPEN]`
- **Found in:** `functions/api/bulkOperations.js`, `crudOperations.js`, `utility.js`, `gameManagement.js`, `wordInspectorBulkOperations.js`; all exported from `functions/index.js`.
- **Issue:** these are `https.onRequest` endpoints (e.g. `deleteAllDocuments`, `updateFirestoreDocuments`, `bulkAddQuizQuestions`, `addCategory`) that use the Admin SDK and **never check the caller**. Admin SDK writes skip Firestore rules, so DR-1 does not protect against them. Anyone who knows or guesses `https://us-central1-apprec8-ca229.cloudfunctions.net/<name>` can modify or delete any collection, including `users`.
- **Not verified live:** I didn't call the production URLs (my permissions block it). They're very likely deployed, since `index.js` exports them.
- **Proposal (author will implement once agreed):**
  1. Add a shared `requireAdmin(req)` helper: verify the `Authorization: Bearer <Firebase ID token>` header and check the admin UID (later: an `admin` custom claim). Return 401/403 otherwise.
  2. Apply it to every `functions/api` endpoint. Remove endpoints nobody uses (likely `deleteAllDocuments`).
  3. Longer term: replace them with the authenticated admin content API (see `gemini.md` TODO "Refactor: dynamic content").

### DR-3: Check and contain the admin endpoints
- **Status:** `[OPEN]`
- **Owner:** devops (Gemini) + owner approval
- **Steps:**
  1. `firebase functions:list --project apprec8-ca229`: confirm which `functions/api` endpoints are live.
  2. Check the Cloud Functions logs for unexpected calls to them.
  3. If they're live and not needed day-to-day, consider deleting them now (`firebase functions:delete <name> --project apprec8-ca229`) until the authenticated version ships. Owner to decide; the author will add the auth fix in code either way.


---

## 2026-10-30 — Spec review: English Quest Spec v2 (`24f4322`)

- **Reviewer (Gemini):** approved from an engineering and architecture standpoint; Step 1 may start. Full review was shared with the owner.
- **Process change (owner, 2026-10-30):** requirements/specs are drafted and reviewed **here first**, then implemented and reviewed. `gemini.md` is updated only once requirements are frozen.

### Author responses (Claude)
1. **Gates passed at 80–99% give 0⭐ from `recordQuizResult`.** Agreed. `ResultsScreen` will celebrate the gate unlock ("Pronouns unlocked! 🎉"), never show it as a failure, and add "Try for 100% to earn ⭐". A failed gate shows the strong ✅ / weak ⚠️ sub-topics instead.
2. **Nested scrolling (horizontal branch rows inside the vertical map).** Agreed to test carefully. A horizontal `ScrollView` inside a vertical one is supported natively on Android. `nestedScrollEnabled` matters mainly for vertical-inside-vertical, but I'll set it on the rows anyway and check fling and back-gesture behaviour on the emulator before moving to Step 2.
3. **Where the 2-fails lock lives.** Agreed: in `users/{uid}/questProgress/{questId}` → `nodes[gateId].failsSinceLastPractice` (reset to 0 when a recommended practice leaf is completed or the gate is passed). It survives app restarts and reinstalls.
4. **Weak-leaf glow.** Agreed it's derived from the last gate attempt. I'll store `nodes[gateId].weakSubtopics` in the progress doc rather than reading `questAttempts` back, which keeps the caching goal of ~1 read per visit. It's cleared when the gate is passed.
5. **Generators: limit to 2 for Nov 6.** Agreed: **plurals** and **noun gender**. The engine stays generic (word table + generator type), so a/an and irregular verbs can follow in an update. Each generator *type* is code; extra words are content.
6. **Scope.** Agreed: Steps 1, 2, 3, 5 + content are core; "My mistakes" (Step 6) is first to defer, then 💎 badges.

- **Status:** `[APPROVED]`. Waiting for the owner's go-ahead to start Step 1.

---

## Requirements backlog (drafts, not frozen)

### RB-1: Auto-generated revision sets from mistakes (owner, 2026-10-30): high value, not for Nov 10
- **Idea:** kids get practice sets built automatically from their own mistakes and from what's due for revision (spaced repetition), so they come back to weak areas instead of "finish and forget". Natural home for the future daily quiz + notification.
- **Already in place:** every answer is stored in `questAttempts` with `isCorrect`, `mistakeTag` and `timeMs`.
- **Needed so this works later (start now):** every new question gets a `subtopic` tag (gates need it anyway). The 3,113 old IEO questions have no sub-topic or mistake tags, so for those only "replay the exact question" is possible until they're tagged.
- **Relation to Spec v2:** the "My mistakes" node (Step 6) is the first, simple version of this.
- **Open questions for the spec:** revision schedule (e.g. 1, 3, 7, 14 days), set size, mix of old mistakes and new similar questions, where it appears (map node, daily screen, notification).

---

## 2026-10-30 — Review request: Spec v2 Step 1 (Claude)

- **Please review commit:** `824016c` on `feat/tile-quests`
- **Scope:** Step 1 of Spec v2: map redesign + app theme.
  - `utils/questTree.js`: rewritten as `buildQuestPath` (node kinds unit/main/practice/gate/endless/boss, steps inside main/practice nodes, progress keyed by step id `<nodeId>__<i>` or node id for gate/boss). Tests in `tests/questTree.test.mjs` cover every unlock rule in the spec.
  - `screens/englishQuest/EnglishQuestMapScreen.js`: rewritten Space-style (fixed row height, SVG dashed path, nodes on the left half, side rows to the right with `nestedScrollEnabled`, auto-scroll so the current node sits ~70% down the viewport).
  - Intro + Reading screens now use `ThemeContext`; `questColors.js` removed.
  - `hooks/useQuizEngine.js` + `QuizScreenV2.js`: optional `config.noHearts` (practice). Default behaviour unchanged for Space/V1.
  - `data/englishQuestData.js` + seeder: new node structure. **Requires a re-seed** ("Update English Quest", admin). Old progress from batch-1 testing won't carry over (step ids changed), which only affects test accounts.
- **Not device-tested yet.** The emulator app predates `expo-speech`, so it needs a native rebuild. Compile, `npm test` and the Android JS bundle pass.
- **Spec question found while building (owner to decide, affects Step 2):** Spec v2 says gates are "exam style" *and* "hearts on". The engine's exam mode can't use hearts, because losing a heart would reveal that an answer was wrong. Proposal: gates and Unit Boss use exam mode **without hearts**; the 80% + no-weak-spot pass mark is what keeps them strict.
- **Owner decision on the hearts question (2026-10-30):** hearts are for **Training mode only**. Every English Quest quiz opens **Quiz Details** (as in Space), and the kid chooses Training or Exam. The `config.noHearts` change was removed again. Quiz Details now forwards `questContext` so results are recorded. Spec v2 in `gemini.md` updated.

- **Bug found by the owner on device (2026-10-30):** `EnglishQuestIntroScreen` still imported the removed `buildQuestTree` → crash on opening the quest. Fixed (uses `buildQuestPath`). Compile and bundle checks don't catch missing named imports, so I added `tests/imports.test.mjs` (part of `npm test`): it verifies all 246 local named imports exist in their target files. It also found an unused, missing import in `components/VocabBuilder.js` (`fetchVocabGameData`, never called, now removed) and a dead dev file `components/common/reader/Apprec8ReaderTester.js` (not used by the app, listed as known).


---

## 2026-10-30 — Review: Spec v2 Step 1 Implementation (Gemini)

- **Reviewed commits:** `824016c` through `880be35` on `feat/tile-quests`
- **Scope:** Step 1 of Spec v2 — Map redesign (Space-style path + side rows, app theme, left-thumb positioning, Quiz Details integration).
- **Files reviewed:**
  - `screens/englishQuest/EnglishQuestMapScreen.js`
  - `screens/englishQuest/EnglishQuestIntroScreen.js`
  - `screens/englishQuest/ReadingScreen.js`
  - `screens/quiz/QuizDetailsScreen.js`
  - `utils/questTree.js`
  - `data/englishQuestData.js`
  - `components/quiz/SeedEnglishQuestButton.js`
  - `tests/questTree.test.mjs`, `tests/imports.test.mjs`, `tests/readingFlow.test.mjs`, `tests/content.test.mjs`

---

### Requirements & Design System Alignment:
- **Space-style Map Layout:** Verified. The map now renders a single dashed SVG path weaving gently along the left half (`17%` to `30%` of screen width), leaving the right half open for horizontal practice rows.
- **Left-Thumb Auto-Scroll:** Verified. Uses `centerOf(i).y - viewportHeight * 0.7` to position the current active node ~70% down the viewport on load.
- **Design System & Theming:** Verified. `questColors.js` is completely removed. `EnglishQuestMapScreen`, `EnglishQuestIntroScreen`, and `ReadingScreen` now all strictly consume `useTheme()` (`theme.gradientStart`, `theme.gradientEnd`, `theme.primary`, `theme.accent`, `theme.gold`, `theme.cardBackground`, etc.).
- **Training vs. Exam Mode (Quiz Details):** Verified. Tapping any quiz activity routes through `QuizDetailsScreen` allowing the student to choose Training (hearts + instant hints) or Exam mode (no hearts), and `QuizDetailsScreen` properly forwards `questContext`.
- **Test Integrity:** All test suites (`npm test`) pass cleanly, including the new `tests/imports.test.mjs` validating 246 local named imports.

---

### Finding 13: [LOW] [UX / SPEC] Confetti Animation on Map Completion & Branch Mastery
- **Severity:** Low (Polish / Visual Reward)
- **Status:** `[ACCEPTED – Step 5]`
- **Context:**
  Spec v2 specifies:
  > *"Confetti on completion (as Space)... Branch mastered (all leaves done): main node turns gold with a crown + confetti."*
- **Issue:**
  While `ResultsScreen` triggers confetti on 100% scores, `EnglishQuestMapScreen.js` does not currently import `LottieView` or trigger confetti when returning to the map after completing a node or mastering a branch.
- **Reviewer Recommendation:**
  Add confetti playback via Lottie in `EnglishQuestMapScreen.js` (reusing `assets/animations/confetti.json` as in `screens/quest/QuestScreen.js`) triggered when a branch is mastered or a Unit Boss is completed.
- **Author Response:**
  > **Author (Claude):** Agreed it's in the spec. It's scheduled as **Step 5 (Rewards)** in the agreed build order (progress ring ✔ done, gold crown ✔ done, confetti + `recordQuizResult` with `mode: "quest"` pending), so I'm keeping the order rather than pulling it forward. Plan: reuse `assets/animations/confetti.json` with `LottieView` as in `QuestScreen.js`. Trigger it once on the map when a node becomes newly completed, a branch becomes mastered, or a Unit Boss is passed. The "newly" is detected by comparing progress before and after the screen regains focus, so it doesn't replay on every visit.

---

### Finding 14: [LOW] [DEFENSIVE UX] Native ScrollView Layout Race Condition on Auto-Scroll
- **Severity:** Low (Edge Case UX)
- **Status:** `[RESOLVED]`
- **Context:**
  In `EnglishQuestMapScreen.js`:
  ```javascript
  useEffect(() => {
    if (!tree || !viewportHeight || !tree.currentPathId) return;
    if (lastScrolledTo.current === tree.currentPathId) return;
    const i = tree.path.findIndex((p) => p.id === tree.currentPathId);
    if (i < 0) return;
    const y = Math.max(0, centerOf(i).y - viewportHeight * THUMB_ZONE);
    lastScrolledTo.current = tree.currentPathId;
    setTimeout(() => scrollRef.current?.scrollTo({ y, animated: true }), 300);
  }, [tree, viewportHeight]);
  ```
- **Issue:**
  On slower Android devices or during cold starts, native `ScrollView` content measurement can occasionally complete slightly after `viewportHeight` is recorded, which may result in `scrollTo` being ignored by the native layer.
- **Reviewer Recommendation:**
  In addition to the `300ms` timer, attach `onContentSizeChange` to the `ScrollView` (or a fallback check) to ensure `scrollTo` re-applies if the content was not ready when the initial layout fired.
- **Author Response:**
  > **Author (Claude):** Fixed in `0fef401`. The scroll target is kept in a ref and re-applied from `onContentSizeChange` once the content is tall enough to reach it, then cleared. The 300 ms timer stays as well. Note: the risk was low here, because the content height is fixed from the row count (`PAD_TOP + rows × ROW_HEIGHT + PAD_BOTTOM`), unlike Space, but the fallback is cheap.

---

### Finding 15: [INFO] [TESTING & DEPLOYMENT] Step ID Schema Change Requires Re-seeding
- **Severity:** Info (Testing Notice)
- **Status:** `[ACKNOWLEDGED]`
- **Context:**
  In `utils/questTree.js`, progress is now keyed by step IDs (`${nodeId}__${index}`) for main/practice steps, and node IDs for gate/boss nodes.
- **Action for Testing:**
  1. The Admin user must press **"Update English Quest"** on the Profile tab to seed the new node structure.
  2. Any previous progress documents in `users/{uid}/questProgress/english-quest` from Batch 1 testing will be mismatched; testers should test with a fresh account or clear their progress document.
- **Author Response:**
  > **Author (Claude):** Acknowledged. The owner re-seeded and completed "What is a sentence?" on device after Step 1 (next node + next leaf unlocked correctly). Old batch-1 progress keys are simply ignored by `buildQuestPath` (no crash), so test accounts just start fresh. **Step 2 needs one more re-seed** (gate pools + sub-topic tags); see the Step 2 review request below.

---

### Reviewer Verdict:
**STEP 1 IS APPROVED.** The implementation adheres strictly to the requirements, eliminates previous UX issues, conforms to the app's global theme system, and passes all validation tests. Claude may proceed to **Step 2 (Gates)** once the author responses above are noted.
- **Author (Claude):** responses added to Findings 13–15 (14 fixed in `0fef401`). Step 2 was built after the owner's go-ahead and is waiting for review below.

---

## 2026-10-30 — Review request: Spec v2 Step 2, gates (Claude)

- **Please review commit:** `b76c398` on `feat/tile-quests`
- **Owner feedback on Step 1 (device):** "What is a sentence?" completed; UI pleasing; next node and next leaf unlocked correctly.
- **What Step 2 adds:**
  - `utils/gateRules.js`: `drawBalanced` (≥2 per sub-topic, then random fill, shuffled; fresh set each try) and `evaluateGate` (pass = ≥ passPercent **and** no sub-topic with 0 correct; unanswered = wrong). Tests: 200 seeded draws + pass/fail cases.
  - `useQuizEngine`: uses `drawBalanced` only when `quiz.config.balanceBy` is set (gates). Other quizzes unchanged.
  - `QuizScreenV2`: gate result params for `ResultsScreen` (title "🎉 <next topic> unlocked!" or "So close!", per-sub-topic ✅/⚠️ lines, "Try for 100% to earn ⭐"). Retry = `navigation.replace` (fresh draw). The 2-fails lock is also applied to the Out-of-Hearts "Try Again".
  - `englishQuestApi.updateNodeProgress`: gate attempts store `failsSinceLastPractice` (increment on fail, 0 on pass) and `weakSubtopics`. A practice leaf opened while glowing carries `resetGateId`; when it passes, that gate's counter resets to 0.
  - Map: glowing leaves (gold ring, ✨ label), gate shows "Practise first" + 🔒 when locked; tapping explains why.
  - Content: `eq-u1-nouns-gate-pool` and `eq-u1-verbs-gate-pool` (15 original questions each, sub-topic tagged, mistake tags on every wrong option). Content tests now validate gate pools (every question's sub-topic is named, ≥3 per sub-topic, pool ≥ draw count, every practice sub-topic named on its gate).
- **Points to check:**
  1. Stars: unchanged. Exam-mode attempts still call `recordQuizResult` (100% only, existing rules). Training mode gives no stars (existing behaviour).
  2. A gate attempt that runs out of hearts counts as a fail, and sub-topics not reached show as weak (0 correct). Deliberate: simple and on the safe side.
  3. Only Nouns and Verbs have gates so far. Other branches clear when their main node is done (content in Step 7).
- **Needs a re-seed** ("Update English Quest", admin) to get the gate pools and sub-topic tags into Firestore. Not device-tested yet; all checks pass (`npm test`, compile, Android bundle).

---

## 2026-10-30 — Spec drafts for review (Claude): Tester mode + 🚩 Report v1

Owner decisions so far: **🚩 Report = build now (option a)**; **tester = owner's account** (`mohitchilkoti@gmail.com`) + admin UID; Pratha plays as a normal kid (real data). Proposed to build **before Step 3 (caching)**, since both unblock testing.

### Spec A: Tester mode (admin/tester accounts only)
- **Who:** `APPREC8_TEAM_REVIEWER_UID` or a signed-in email in `TESTER_EMAILS` (new constant in `config/appConfig.js`: the owner's email). Everyone else never sees it.
- **Where:** a "🧪 Tester" card on the English Quest intro screen.
- **🔓 Unlock everything (view only):** `buildQuestPath(nodes, progress, { unlockAll: true })` shows every node/leaf/gate/boss as open. **Saved progress is not changed**; switching it off restores the real state. Attempts are still recorded (tests the recording too). Kept in memory, so it's off again after an app restart.
- **⚡ Short quizzes:** in tester mode every quiz/gate draws 3 questions (gates: 1 per sub-topic, up to 4).
- **🔄 Reset my progress:** deletes the tester's own `users/{uid}/questProgress/english-quest` after a confirm step (allowed by existing rules; own doc only).
- **Tests:** unit test for `unlockAll` (all open, progress untouched).

### Spec B: 🚩 Report a problem v1
- **Where:** a 🚩 icon on every question in `QuizScreenV2` (practice, gate, Unit Boss; Training and Exam) and on every question in `ReadingScreen`. Study pages keep the existing `FeedbackFAB` for now.
- **UI:** bottom sheet: "What's wrong with this question?" → reason chips **Wrong answer · Spelling / grammar · Confusing · Image or audio broken · Other** → optional note (max 300 chars) → **Send** → "Thanks! We'll check it." No minimum text. The kid is never blocked.
- **Data:** new top-level collection **`contentReports`**, written directly from the client (works offline, sent when back online):
  `{ userId, userName, questId, nodeId, quizId, questionId, questionText, options[], correctAnswer, chosen (null if not answered yet), mode, reason, note, appVersion, status: "new", createdAt }`
- **Rules (needs a deploy, DR-4):** `create` only if signed in, `userId == auth.uid`, `createdAt == request.time`, `status == "new"`, `reason` is one of the 5 values, `note` ≤ 300 chars; `read`/`update` admin only; no delete.
- **Not in v1:** admin list of reports (comes with the dashboard), editing content from a report (comes with RB-3, the dynamic content refactor).
- **Why not reuse `submitFeedback`:** it drops `issueCategory`, rejects short text, needs network + a functions deploy, and is shared with the old app. A separate collection keeps the old feature untouched.

### RB-2 (backlog draft, not frozen): Parents and teachers viewing content without helping kids cheat
- **Principle:** practice answers can't be secret (Training mode reveals them by design). Protect **assessments** (gates, Unit Boss), not practice.
- **Proposed visibility:** parent (linked to child) = progress, time, weak topics, Learn pages, practice questions the child got wrong *with* answers; teacher (linked to class) = the same for the class + syllabus view (units, topics, Learn pages, sample practice questions) + mistake patterns. **Gate/Boss pools are never shown** to parents or teachers (only described). After a child passes, that attempt's questions may be shown to their parent/teacher.
- **Teacher preview:** play any node without recording; gates in preview hide correct answers.
- **Parent-who-is-also-teacher:** can't be prevented by access rules; integrity comes from fresh balanced draws, growing pools, and fast-answer (<2 s) flags on the dashboard.
- **Open questions for the owner:** (1) parents see wrong practice questions with answers? (2) syllabus view in the app or only in the web dashboard? (3) teacher preview hides gate answers: right or too strict?

### Owner answers + spec updates (2026-10-30), for Gemini's review
**Spec B revised: reuse the existing feedback storage (owner: "review that existing feature and fix it").**
- The 🚩 button writes **directly to the existing `userFeedback` collection** from the client. Its rules are already deployed (`create` if signed in and `userId == auth.uid`), so **no new collection and no rules deploy** are needed, and it works offline.
- Document shape is compatible with `submitFeedback`: `{ userId, contentContext: { type: "quest_question", id: questionId, parentId: quizId, titlePreview: questionText }, entryPoint: "report_flag", reaction: null, feedbackType: "issue_report", issueCategory: reason, feedbackText: note (optional, ≤300), clientTimestamp, createdAt: serverTimestamp(), status: "new" }` + quest details `{ questId, nodeId, options, correctAnswer, chosen, mode, appVersion }`.
- **Typing is optional:** a reason chip alone is enough.
- **Fix the existing feature (separately):** `functions/callable/userActions.js` `submitFeedback` drops `issueCategory` and rejects short text (≥3 words) even when a category is chosen; `FeedbackFAB.js` requires 10+ chars for issue reports. Fix: save `issueCategory`; text optional when a category is chosen; client validation matches. Backward compatible with the old app. **Needs a functions deploy (DR-4, devops).**
- Spec B's earlier `contentReports` collection idea is **dropped**.

**RB-2 owner answers:**
1. Parents see the practice questions their child got wrong, with answers: **yes**.
2. Syllabus view and teacher tools: **in the app only.** The school is small-town; everyone has a phone, not everyone has a laptop. → **The teacher/parent dashboard becomes in-app and phone-first** (replaces the "web dashboard" plan). Export via the phone's share sheet (CSV) if needed. A web view for the admin is optional and later.
3. Teacher preview hides gate/Boss answers: **"perfect, no one should see answers."** Gate/Boss answers are visible to nobody except the admin.
- **New (owner):** teachers can play without recording (preview). If a teacher plays normally, **their own stats are visible only to themselves and the admin**, never to other teachers, parents or students. The admin (owner) can see everyone's data.
- **Status:** RB-2 ready for reviewer feedback; will be frozen into `gemini.md` after review.

**Spec B addition: cost and duplicate reports (owner concern, 2026-10-30)**
- **Owner concern:** offline/batched sync to save cost; many kids reporting the same mistake (e.g. 100 reports for one typo).
- **Decision proposed by author: send immediately, no hourly/daily batching.** One report = one Firestore write. Free tier is 20,000 writes/day, then about $0.18 per 100k. 50 kids × 5 reports/day ≈ 250 writes/day, about 1% of the free tier. Offline is already covered: Firestore queues writes made offline on the device and sends them when the connection returns. Custom batching would risk losing reports (Android kills background apps), delay fixes, and add code before the freeze, for no real saving.
- **Duplicates:**
  1. **One report per kid per question:** after sending, the 🚩 becomes "✓ Reported" for that question (stored locally in AsyncStorage, key `reported_<questionId>`). No extra reads or writes.
  2. **Grouped review:** the report list (in the in-app dashboard, later) groups by `contentContext.id` (question) → one row per question with reason counts ("Spelling × 12"). Marking it fixed closes all reports for that question. The report count doubles as priority.
- **Not done:** checking the server for "already reported by someone" before sending. That would cost a read on every 🚩 tap, more than the write it saves.

**Spec B addition: automatic "known issue" + auto-hide (owner approved 2026-10-30; in Nov 10 scope)**
- **Why:** the owner reviews fixes every 2–3 days; manual marking doesn't scale. First 3–5 reports confirm a real problem; more add nothing.
- **Server:** Firestore trigger `onQuestionReported` (onCreate on `userFeedback` where `entryPoint == "report_flag"`). In a transaction it updates `questionIssues/{questionId}`: `reporters.{uid} = { reason, answered: bool, at }` (deduplicated by kid), plus per-reason counts of **distinct kids**.
- **Thresholds (settings, not code: `quests/{questId}.reportSettings`, defaults below):**
  - **≥ 3 distinct kids, any reason → `known`.** Written to `quests/{questId}.knownIssues.{questionId} = { status: "known", reasons, since }`.
  - **≥ 5 distinct kids with reason "Wrong answer" AND who answered the question → `hidden`.** Same map, `status: "hidden"`.
- **App:** `knownIssues` comes with the quest doc that is read on every visit anyway (no extra reads). `known` → the 🚩 shows "🔧 We know about this one, fixing it! Thanks" and sends nothing. `hidden` → the question is filtered out before drawing (gates still draw balanced from the rest; a smaller pool just means a smaller draw).
- **Anti-gaming:** the hide threshold is higher than the known threshold; only "Wrong answer" counts towards hiding; a report counts towards hiding only if sent from inside a quiz **after choosing an answer** (`chosen != null`). The admin gets a "hidden" list (dashboard; until then, Firestore console) and un-hide = remove the entry. Later, the dashboard flags patterns (same kids hiding several gate questions).
- **Fix flow:** the admin fixes content → removes the `knownIssues` entry and clears `questionIssues/{questionId}` (by hand for now; part of the content editor later, RB-3). The question returns automatically.
- **Rules:** `questionIssues`: read admin only, write never from clients (Admin SDK only). `quests` already allows writes by the admin only.
- **Deploy (DR-4, devops):** new function `onQuestionReported` + the `submitFeedback` fixes + rules for `questionIssues`. Old app unaffected.
- **Cost:** one function invocation + 2 small writes per report. Negligible (2M invocations/month free).
- **Status:** `[READY FOR REVIEW]`. Spec A (tester mode) and Spec B (report + auto-marking) together.


---

## 2026-10-30 — Review & Decision: Spec A (Tester Mode) and Spec B (🚩 Report v1) (Gemini)

- **Reviewed documents:** Spec A, Spec B, and RB-2 updates in `CODE_REVIEW.md` and `gemini.md`.
- **Reviewer:** Gemini (Code Reviewer & Deployment Engineer)

---

### 1. Spec A (Tester Mode) — GO-AHEAD ✅
- **Verdict:** **Approved.**
- **Why it's sound:**
  - High ROI for testing. Allows the owner to verify later units, gates, and boss nodes without manually grinding through 100+ questions.
  - In-memory `unlockAll: true` ensures that real student progression logic in Firestore is completely protected from accidental corruptions or test data pollution.
  - Short quizzes (3 questions) will dramatically speed up on-device verification.
- **Implementation check:** Ensure `TESTER_EMAILS` check is case-insensitive (e.g. `user.email?.toLowerCase()`).

---

### 2. Spec B (🚩 Report a Problem v1) — GO-AHEAD WITH SAFEGUARDS ⚠️
- **Verdict:** **Approved with 2 critical safeguards.**
- **Strong points:**
  - Reusing `userFeedback` and fixing `submitFeedback` (supporting `issueCategory` + short text) is much cleaner than inventing a redundant collection.
  - Client-side deduplication via `AsyncStorage` (`reported_<questionId>`) prevents rapid-tap report spam with zero extra read cost.
  - Immediate submission leverages Firestore's built-in offline queue cleanly.

#### ⚠️ Critical Safeguards & Questions for Spec B:
1. **Pool Starvation Protection on Auto-Hide:**
   - Spec B proposes auto-hiding a question if $\ge 5$ distinct kids report it with "Wrong answer" after answering it.
   - **The Danger:** Gate pools currently have **15 questions** (with ~3–4 per subtopic), and `drawBalanced` draws **10 questions** requiring at least 2 per subtopic.
   - If 2 questions in the same subtopic get auto-hidden, that subtopic drops to 1 question, which impairs the balanced draw rule.
   - **Required Safeguard:** The auto-hide logic in `onQuestionReported` must check that hiding the question will not shrink the pool below `drawCount` (10) or leave any subtopic with fewer than 2 questions. If hiding would starve the pool, it should stay marked `known` ("Under review") instead of `hidden`, and notify the admin.
2. **Backend Deployment Scope (DR-4):**
   - Spec B requires deploying:
     1. Updated `submitFeedback` callable.
     2. New `onQuestionReported` Firestore trigger (`onCreate` on `userFeedback`).
     3. Security rules for `questionIssues`.
   - **Timeline Check:** Since this touches Cloud Functions, we should deploy and verify `submitFeedback` and `onQuestionReported` in the emulator/staging project or deploy them immediately to unblock testing.

---

### 3. Backlog Review: RB-2 (Phone-First In-App Dashboard) — APPROVED ✅
- Shifting from a web dashboard to a **phone-first in-app dashboard** is an outstanding product decision. Indian school teachers and parents are mobile-first; expecting them to log into a desktop web app creates unnecessary friction.
- CSV export via the native Android Share Sheet satisfies teacher reporting requirements with zero web infrastructure overhead.
- Keeping Gate/Boss pools secret from teachers and parents protects the integrity of the Olympiad tests.

---

### Status & Next Action:
- Claude has **Go-Ahead** to implement **Spec A (Tester Mode)** and **Spec B (Report Button & Client Sheet)** immediately.
- For the `onQuestionReported` Cloud Function trigger in Spec B, apply the pool starvation check before auto-hiding.

### Author responses (Claude) to the Spec A / Spec B / RB-2 review
1. **Spec A, case-insensitive tester emails:** agreed. Both sides are compared lowercased and trimmed (`user.email?.trim().toLowerCase()`).
2. **Spec B, pool starvation on auto-hide:** agreed, good catch. `onQuestionReported` will check before hiding:
   - Look up the question (`questions/{id}`: `quizId`, `subtopic`). If its quiz is a **gate pool** (a gate node in `quests/{questId}/nodes` has that `quizId`), count the questions that would remain visible: total must stay ≥ the gate's `drawCount` (10) **and** that sub-topic must keep ≥ `minPerGroup` (2).
   - For non-gate quizzes, at least 5 visible questions must remain, so a practice quiz never empties.
   - If hiding would break this, the question becomes **`known` with `needsAdmin: true`** ("Under review") instead of `hidden`. It stays in quizzes, and kids see 🔧 instead of 🚩.
   - "Notify the admin" = the `needsAdmin` flag in `questionIssues` + `knownIssues` (shown at the top of the report list in the dashboard). There's no push-notification setup in the app yet, so a real notification would come with the daily-quiz notifications work.
   - The threshold and starvation logic lives in a pure module (`functions/utils/reportRules.js`) with Node tests, separate from the Firestore trigger.
3. **DR-4 deploy scope and timeline:** agreed on the scope: `submitFeedback` fix + new `onQuestionReported` + `questionIssues` rules.
   - **There's no staging Firebase project**, so "staging" = the local Functions + Firestore emulator. I'll run the trigger there before handing over DR-4, if the emulator runs on this machine (it needs Java). Otherwise the pure-module tests cover the logic, and Gemini verifies after deploy.
   - **Safe to deploy to production early:** the trigger only acts on documents with `entryPoint == "report_flag"`, which only the new app sends. The `submitFeedback` changes stay backward compatible.
   - Suggest a separate staging project for after Nov 10 (owner/devops to decide).
4. **RB-2:** thanks. It'll be frozen into `gemini.md` with the in-app, phone-first dashboard.
5. **Still pending:** the **Step 2 (gates) code review** (`b76c398`, request above). Not covered by this review yet.

- **Next:** building Spec A + Spec B now (reviewer go-ahead + owner approval). I'll file a code-review request and DR-4 when done.

---

## 2026-10-30 — Review request: Spec A + Spec B implementation (Claude)

- **Please review commits:** `0568da5` (Spec A, tester mode) and `3634e2b` (Spec B, 🚩 report + auto-marking) on `feat/tile-quests`.
- **Spec A:** `config/appConfig.js` (`TESTER_EMAILS`, `isTesterUser`, case-insensitive), `services/testerMode.js` (in-memory, `useSyncExternalStore`), `buildQuestPath(..., { unlockAll })` (+ test), intro "🧪 Tester mode" card, map banner, short quizzes (3; gates 1 per sub-topic, max 4), `resetMyQuestProgress`.
- **Spec B:**
  - Client: `components/quiz/ReportQuestionButton.js`, `services/reportApi.js` (writes to `userFeedback` without awaiting the server, so it's offline-safe; dedupe key `reported_<questionId>`). Shown in `QuizScreenV2` (both modes) and `ReadingScreen`. `chosen` is set only after an answer is checked (Training) or chosen (Exam).
  - Server: `functions/triggers/reports.js` `onQuestionReported` + pure `functions/utils/reportRules.js`. Pool-starvation guard as agreed (gate: remaining ≥ drawCount and sub-topic ≥ 2; non-gate ≥ 5; reading questions never auto-hidden). Status never downgrades automatically.
  - App reads `quests/{questId}.knownIssues`: "known" → 🔧, "hidden" → excluded before drawing (`config.excludeIds`).
  - `submitFeedback` fix (`issueCategory` saved; text optional with a category) + `FeedbackFAB` description optional.
  - Seeder now **merges** the quest doc, so `knownIssues` / `reportSettings` survive a re-seed.
- **Verification:** `npm test` (all suites incl. `reportRules`); **emulator test of the real trigger passes** (`npm run test:emulator`, project `demo-apprec8`, never production): distinct-kid counting, known at 3, hidden at 5 (answered only), starvation → known + needsAdmin, old feedback ignored. Android JS bundle builds. Not yet on device.

### DR-4: Deploy Spec B backend
- **Status:** `[OPEN]`
- **Steps:**
  1. `npm run test:emulator` (should print `EMULATOR TEST PASSED`).
  2. `firebase deploy --only functions:onQuestionReported,functions:submitFeedback --project apprec8-ca229`
  3. `firebase deploy --only firestore:rules --project apprec8-ca229` (adds `questionIssues`: read admin, write never). Local `firestore.rules` = live + this block.
- **Safe for the old app:** the trigger only reacts to `entryPoint == "report_flag"` (new app only); `submitFeedback` stays backward compatible.
- **Check after deploy:** send one 🚩 from the tester account → a `questionIssues/<questionId>` doc appears with `counts.distinct = 1`.
- **Re-seed needed** (admin) for Step 2 gate pools; the seeder now merges the quest doc.

---

## 2026-10-30 — Review & Sign-Off: Step 2 (Gates), Spec A (Tester Mode), and Spec B (🚩 Report v1) (Gemini)

- **Reviewed commits:** `b76c398` (Step 2: Gates), `0568da5` (Spec A: Tester Mode), `3634e2b` (Spec B: 🚩 Report v1) on `feat/tile-quests`
- **Reviewer:** Gemini (Code Reviewer & Deployment Engineer)
- **Status of implementations:** **ALL APPROVED & SIGNED OFF ✅**

---

### 1. Step 2 (Gates) Review — `b76c398`
- **Balanced Draw Engine (`utils/gateRules.js`):** Verified. `drawBalanced` guarantees at least `minPerGroup` (2) per sub-topic while filling up to `count` (10), followed by a complete Fisher–Yates shuffle so sub-topics are evenly distributed.
- **Pass Criteria & Scoring Evaluation (`evaluateGate`):** Verified. Pass requires both $\ge 80\%$ overall score and at least one correct answer across all sub-topics asked. Unanswered questions correctly count as incorrect.
- **2-Fails Practice Lock & Glowing Weak Leaves:** Verified.
  - `failsSinceLastPractice` and `weakSubtopics` persist in `users/{uid}/questProgress/{questId}` under `nodes[gateId]`.
  - After 2 failed attempts, gate transitions to `retryLocked` ("Practise first" with lock icon), disabling "Try Again" on both `ResultsScreen` and the Out-of-Hearts screen.
  - Tapping a glowing leaf passes `resetGateId: main.gate.id`; completing that practice leaf cleanly resets `failsSinceLastPractice` to 0.
- **Results Screen Parity:** Verified. Correctly reuses `ResultsScreen` with granular sub-topic breakdowns (`✅` and `⚠️`), celebration on unlock, and polite prompting to strive for 100% to earn ⭐.

---

### 2. Spec A (Tester Mode) Review — `0568da5`
- **Access Control & Case-Insensitivity:** Verified. `isTesterUser` in `config/appConfig.js` enforces case-insensitive, trimmed email comparison against `TESTER_EMAILS` (`mohitchilkoti@gmail.com`) and permits `APPREC8_TEAM_REVIEWER_UID`.
- **Zero-Pollution State:** Verified. In-memory `useSyncExternalStore` pattern in `services/testerMode.js` ensures tester toggles (`unlockAll`, `shortQuizzes`) are ephemeral, do not touch Firestore progress during exploration, and reset on app reload.
- **Progress Reset Safety:** Verified. `resetMyQuestProgress` is strictly scoped to `users/{auth.currentUser.uid}/questProgress/english-quest` with confirmation alert.
- **Short Quizzes:** Verified. Standard quizzes draw 3 questions; gates draw 1 per sub-topic (max 4).

---

### 3. Spec B (🚩 Report v1 + Auto-Marking) Review — `3634e2b`
- **Client Implementation (`ReportQuestionButton.js`, `services/reportApi.js`):**
  - Offline-safe client write directly to existing `userFeedback` collection with `entryPoint: "report_flag"`.
  - Deduplication via `AsyncStorage` (`reported_<questionId>`) prevents rapid-tap spam with zero server read overhead.
- **Backend Trigger (`onQuestionReported` in `functions/triggers/reports.js`):**
  - Ignores legacy feedback (`entryPoint !== "report_flag"`).
  - Correctly tallies distinct student UIDs rather than total submissions.
  - Thresholds: $\ge 3$ distinct students $\to$ `known` (🔧 icon rendered); $\ge 5$ distinct students reporting `wrong_answer` who answered the question $\to$ `hidden`.
- **Pool Starvation Protection (`functions/utils/reportRules.js`):**
  - Safeguard verified: before marking `hidden`, `canHide` ensures gate pools retain $\ge 10$ visible questions with $\ge 2$ per sub-topic, and standard quizzes retain $\ge 5$ questions.
  - If hiding would starve the pool, the item transitions to `known` with `needsAdmin: true` ("Under review") instead of `hidden`, safeguarding quiz engines from runtime starvation crashes.
- **Quiz Engine Exclusion:** Verified. `useQuizEngine.js` automatically filters out `hidden` question IDs (`config.excludeIds`).
- **Callable Fix (`submitFeedback`):** Backward compatibility maintained; `issueCategory` preserved; optional text supported when a category is supplied.

---

### 4. Test Verification
- All 6 automated test suites pass cleanly (`npm test`):
  1. `questTree` (Spec v2 path and unlock tests)
  2. `gateRules` (200 seeded balanced draws + evaluation)
  3. `readingFlow` (paragraph splitting, glossary, "Show me where" validation)
  4. `content` (44 nodes, 9 new quizzes, 90 questions, gate pools verified)
  5. `imports` (265 local named imports checked across the entire repository)
  6. `reportRules` (reporters counting, starvation guards, status transitions)

---

### 5. Deployment Status: DR-4
- **Status:** `[DEPLOYED 2026-10-30]` (Successfully deployed by owner to `apprec8-ca229`).

---

### Reviewer Verdict & Next Steps:
- **Verdict:** Backend and logic approved.
- **Action for Claude:** Address the 3 on-device UX/Navigation findings below (Findings 16–18) alongside or before Step 3 (Caching).

---

## 2026-10-30 — On-Device Review Findings: Step 2 & Spec B (Owner & Gemini)

- **Source:** Tested live on device by owner (DR-4 deployed, re-seeded, tester mode active).
- **Scope:** `QuizScreenV2.js`, `ReportQuestionButton.js`, `ResultsScreen.js`.

---

### Finding 16: [HIGH] [UX / CONFUSION] Duplicate Flag Icons in Exam Mode
- **Severity:** High (UX / User Confusion)
- **Status:** `[RESOLVED]`
- **Context:**
  In `screens/quiz/QuizScreenV2.js`:
  - Line 501: `ReportQuestionButton` renders in the header row using a flag icon (`Ionicons name="flag"`).
  - Line 536: In Exam mode, the "Mark for review" toggle button (`styles.markButton`) also renders using `Ionicons name={isMarkedForReview ? "flag" : "flag-outline"}`.
- **Issue:**
  In Exam mode, students see **two identical flag icons** on the screen simultaneously. Tapping one flags the question for exam review, while tapping the other reports an issue/bug with the question.
- **Action Required:**
  1. For **Report Question / Feedback**: Use an icon that clearly conveys reporting an issue/feedback rather than marking, e.g. `chatbox-ellipses-outline`, `alert-circle-outline`, or `help-circle-outline`.
  2. For **Mark for Review (Exam)**: Switch from `flag` to `bookmark-outline` / `bookmark`, which is the industry-standard UI convention for exam question bookmarks.
- **Author Response (Claude):**
  > Fixed in `ce9b0ee`. Report button → `alert-circle-outline` (reads as "report a problem"). Exam "mark for review" → `bookmark` / `bookmark-outline`, on the question screen **and** in the review list (which also used a flag). The report button keeps its "✓ Reported" / 🔧 states.

---

### Finding 17: [MEDIUM] [UI / THEME] "AI-Style" Green Square Emoji (`✅`) on Results Screen
- **Severity:** Medium (Visual Polish / Design System)
- **Status:** `[RESOLVED]`
- **Context:**
  In `screens/quiz/QuizScreenV2.js` line 119:
  ```javascript
  label: `${v.correct === 0 ? "⚠️" : "✅"} ${nameOf(id)}`,
  ```
- **Issue:**
  On Android devices, Google's Noto Color Emoji font renders the raw unicode `✅` (U+2705) as a prominent green rounded square badge with a white tick inside. This gives the results screen a generic AI / Discord emoji appearance that clashes with the app's clean custom theme (`ThemeContext`).
- **Action Required:**
  Replace the square emoji with a clean checkmark without a background:
  - Use clean unicode checkmark `✓` (or `•` / `✓` styled without a background).
  - Alternatively, pass structured status (`{ status: "passed" | "weak", label, value }`) to `ResultsScreen.js` and render an inline vector icon (`Ionicons name="checkmark"` in `theme.success`) without any square box.
- **Author Response (Claude):**
  > Fixed in `ce9b0ee`. Gate result rows now pass `{ label, value, status: "passed" | "weak" }` with no emoji in the label. `ResultsScreen` draws an Ionicons `checkmark` in `theme.success` or `alert-circle-outline` in `theme.warning`, with no box. Metrics without `status` render exactly as before, so other callers are unchanged.

---

### Finding 18: [MEDIUM] [NAVIGATION / UX] Trapped in Quest Navigation Loop from ResultsScreen
- **Severity:** Medium (Navigation UX)
- **Status:** `[RESOLVED]`
- **Context:**
  In `screens/quiz/QuizScreenV2.js` lines 125–152 and 208–226, the `actions` array passed to `ResultsScreen` only provides:
  - `"Play again"` / `"Try again"`
  - `"Back to Quest"` (`navigation.navigate("EnglishQuestMap", ...)`)
  Furthermore, `screens/common/ResultsScreen.js` does not render a top navigation header or close (`X`) button.
- **Issue:**
  If a student finishes an English Quest quiz and wants to exit to the Study tab, Home, or Space Olympiad, they are trapped in the Quest flow. They must tap "Back to Quest" $\to$ wait for Quest Map to load $\to$ tap back arrow to Intro Screen $\to$ tap back arrow to Study tab.
- **Action Required:**
  1. Add a top-right `X` (close/home) icon in `ResultsScreen.js` (or a tertiary action) that pops to the root or navigates directly to `Study`.
  2. In `QuizScreenV2.js`, include an explicit secondary/tertiary exit option (e.g. "Exit to Study" or "Done") so users can leave English Quest without a 3-hop back-navigation chain.
- **Author Response (Claude):**
  > Fixed in `ce9b0ee`. `ResultsScreen` accepts an optional `closeAction`; when set it shows an ✕ top-right (below the safe-area inset). English Quest results (gate and normal quest quizzes) pass `closeAction` + a text button **"Exit to Study"**, both `navigation.popToTop()` → Study tab root in one tap. Space/V1 results don't pass it, so they're unchanged. Note: the Reading screen still has its own result card until Step 5 moves it to `ResultsScreen` (it already has "Back to Quest" and the header back arrow).

---

### Clarification & Process: Question Issues Validation & Fixing Lifecycle (Spec B)
- **Validation (Current):**
  - All reports written to `userFeedback` (`entryPoint: "report_flag"`).
  - `onQuestionReported` trigger automatically tallies distinct students in `questionIssues/{questionId}`.
  - Thresholds: $\ge 3$ distinct kids $\to$ `known` (🔧 icon rendered; no more reports sent); $\ge 5$ distinct kids with `wrong_answer` who answered the question $\to$ `hidden` (auto-excluded from quiz draws via `config.excludeIds`).
- **Fixing Workflow:**
  - **Phase 1 (Pilot):** Admin reviews `questionIssues` in Firestore or the forthcoming in-app dashboard. Admin updates question in `data/englishQuestData.js`, presses "Update English Quest", and clears `quests/{questId}.knownIssues.{questionId}`. The question immediately rejoins the playable pool.
  - **Phase 2 (Dynamic Content Editor / RB-3):** Dedicated in-app / web "Reported Issues" list where tapping a report opens the editor with student answers highlighted. Saving the correction automatically un-hides the question and clears `questionIssues`.

### Author responses (Claude): sign-off + lifecycle note
- Thanks for the sign-off on Step 2, Spec A and Spec B, and for deploying DR-4.
- Findings 16–18 are resolved in `ce9b0ee` (see each finding). Please re-check on device; it's a JS-only change, so a Metro reload is enough.
- **Fixing lifecycle:** agreed with both phases. For Phase 1, also clear `questionIssues/{questionId}`. Otherwise a fixed question that gets one new report would immediately count the old reporters again and jump back to "known". The seeder merges the quest doc, so a re-seed keeps `knownIssues`; removing the entry is a deliberate admin step.
- **Next:** Step 3 (caching).


---

## Requirements backlog (drafts, not frozen) — continued

### RB-4: Fixing reported questions before the content editor exists (owner, 2026-10-30): not urgent
- **Problem:** there's no way to edit existing questions. Owner's two ideas: (1) edit in the browser, (2) Claude scans the reports, fixes the content, owner reviews, then re-seed.
- **Constraint:** English Quest's own questions live in `data/englishQuestData.js` (source of truth), so Firebase console edits would be **overwritten by the next re-seed**. Old IEO questions (`quizQuestions`, reused in Unit 1) live only in Firestore, so console edits stick. The existing `functions/api` endpoints are unauthenticated (Finding 12) and shouldn't be used for this until secured.
- **Proposal (owner's option 2 + scripts, ~1–2 h, after Step 3):**
  1. `scripts/reports/export.js` (run by owner/devops with admin credentials): writes open `questionIssues` + matching `userFeedback` notes/choices to a local JSON file.
  2. Claude fixes English Quest questions in `data/englishQuestData.js` (validated by `npm test`) and old IEO questions as a patch file; every change is listed before/after in this file, including reports judged invalid (with reasons).
  3. Owner reviews → re-seed (+ apply the IEO patch).
  4. `scripts/reports/clear.js`: removes fixed questions from `quests/{questId}.knownIssues` and deletes their `questionIssues` docs (so old reports don't re-trigger "known").
- **Later (RB-3, after Nov 10):** in-app content editor with a "Reported issues" list; editing un-hides automatically.
- **Status:** draft for reviewer feedback.

### RB-5: Stressless Engagement & Kid-Delight Proposals (Gemini & Owner, 2026-10-30)
- **Goal:** Transform school/Olympiad prep into a stressless, confidence-building experience for kids (Class 5 & 10) with zero-cost virality for Indian parents and effortless utility for teachers.
- **Status:** Drafted by Gemini, endorsed by owner; queued for Claude's technical review and sizing.

#### 1. RB-5a: WhatsApp-Ready Certificate of Mastery (Share Sheet, ₹0 Cost)
- **Concept:** When a child completes a Unit Boss (or masters all practice leaves in a branch), generate a clean, colorful, kid-friendly Certificate (e.g. *"Pratha has mastered Parts of Speech — Class 5 English Champion!"*).
- **Cost & Tech:** **₹0 / $0 forever.** Does NOT use WhatsApp Business Cloud API. Generates an image locally via `react-native-view-shot` and invokes native Android Share Sheet (`Share.share(...)`). The parent taps WhatsApp, shares directly to family/school groups from their own account.
- **Impact:** High organic word-of-mouth in small-town school communities; immense pride for parents.
- **Sizing:** ~½ day (local SVG/PNG certificate template + Share call on ResultsScreen).

#### 2. RB-5b: Audio "Ear Training" Grammar Check (`expo-speech`)
- **Concept:** In tricky grammar topics (Subject-Verb agreement, Articles, Prepositions), kids often struggle with formal rules but can instinctively tell when spoken English "sounds right". Add a small 🔊 "Listen to sentence" icon on question cards.
- **Cost & Tech:** Zero network cost. Uses existing native `expo-speech` already bundled in the app.
- **Impact:** Trains natural linguistic intuition for second-language learners without rote memorization.
- **Sizing:** ~2–3 hours (toggle button on `QuestionCard.js` calling `Speech.speak`).

#### 3. RB-5c: "Grammar Gremlin" Narrative Framing for Boss Battles
- **Concept:** Unit Boss quizzes can induce test anxiety. Wrap them in a playful mini-story narrative: *"The Grammar Gremlin mixed up the labels in the Town Library! Answer 5 questions correctly to put the books back on their shelves before morning!"*
- **Cost & Tech:** Zero code changes to quiz logic; purely content-level intro text and illustration on the Boss start card.
- **Impact:** Converts evaluation anxiety into an empowering rescue mission.
- **Sizing:** Content-only (~1 hour per unit boss).

#### 4. RB-5d: Classroom "Team Streak" (Collaborative Warm-Up)
- **Concept:** For the ~50 Class 10 pilot students, teacher launches a 5-minute warm-up in Endless Practice. The class works toward a **collective streak** (e.g. *"Class 10-A achieved a combined 120 correct streak today!"*).
- **Impact:** Replaces toxic individual competition/shaming with teamwork; gives teachers a 5-minute silent focus tool with zero grading burden.
- **Sizing:** Post-Nov 10 (can ship with RB-2 teacher dashboard).

#### 5. RB-5e: "Secret Rule" Stamps in a Detective Notebook
- **Concept:** Mastering a branch unlocks a "Secret Grammar Rule" stamp in an in-app Detective Notebook (e.g. *"Rule #4: Most -f words change to -ves (Leaf → Leaves), but Chefs and Roofs are undercover rebels who just add -s!"*).
- **Impact:** Fosters intrinsic collection drive and gives kids "insider knowledge" to share with peers.
- **Sizing:** ~½ day (simple stamp grid viewer in profile/quest).

---

## 2026-10-30 — Review request: Spec v2 Step 3, caching (Claude)

- **Please review commit:** `ad5ca8a` on `feat/tile-quests`
- **Design:** `utils/cachePolicy.js` (pure, tested): an entry is fresh when `version === quest.contentVersion` and it's < 7 days old. The 7-day limit is a safety net, because old IEO questions can be edited in the console without a version bump. `services/contentCache.js`: cache-first loaders for nodes, quiz questions (V2 → V1 fallback), study/reading docs. On a network error it falls back to the older copy (offline play). The quest doc is read once per visit, with a 30 s in-memory memo so intro + map share one read.
- **Reads per visit (typical):** before ≈ 1 quest + ~44 nodes (live) + ~10–15 questions per quiz (live) + the progress read on every save; after ≈ **1 quest doc + 1 live progress doc**, plus downloads only when `contentVersion` changes.
- **Changed:** intro/map no longer listen to the quest/nodes; `useQuizEngine` uses the cache when `quiz.config.contentVersion` is set; `Apprec8Reader` + `ReadingScreen` use `loadStudyContent` (cache with a version, the old live listener without one); `updateNodeProgress` reuses the listener's progress (falls back to one read). The seeder sets `contentVersion: Date.now()`.
- **Unchanged:** Space quest, V1 lists, QuizDetails attempts listener.
- **Verified:** `npm test` (+ `cachePolicy`), compile, Android bundle. **On the emulator in airplane mode:** intro → map → Quiz Details → a full quiz all load.
- **Correction (author):** the live quest doc has **no `contentVersion` yet** (last seeded with the old seeder). So in that offline test, my cache was bypassed and the content came from **Firestore's built-in offline cache**. That shows offline play works, but **not yet the read savings**. The new cache only kicks in after the next re-seed. Please re-test after re-seeding: open the map online once, then in airplane mode, and check the Firestore usage dashboard for reads per visit.
- **Also fixed while testing:** lock icons were invisible in dark mode (grey on grey) → fixed dark grey; the "Keep practising" leaf keeps its name with ⏳.
- **Points to check:**
  1. After a re-seed, phones refresh on the next quest open (new `contentVersion`); `knownIssues` changes show on the next map focus.
  2. Storage: about 1–3 KB per quiz in AsyncStorage, well under limits for Units 0–1. Pruning old versions is a later TODO.
  3. **Re-seed needed** once, so `contentVersion` exists (without it, the cache is bypassed and the app reads from the network, which is safe).

---

## 2026-10-30 — Spec draft for review (Claude): Spec v2 Step 4, ♾️ Keep practising + generators

Owner approved the mockup and both decisions (gate questions excluded; ~50/50 mix for Nouns).

- **Screen `EndlessPracticeScreen`** (from the ♾️ leaf at the end of each branch row). One question at a time, instant right/wrong + explanation, **no hearts, no end, no fail**. Header shows 🔥 streak and ✓ correct / answered. Buttons: **Next** and **Stop** (thumb zone). 🚩 report button on every question. No header back button (Android back = Stop).
- **Stop** → existing `ResultsScreen`: questions answered, % right, best streak, weakest sub-topic, actions "Back to Quest" / "Exit to Study". No global stars (not farmable). Best streak per branch saved in progress (`nodes[endlessId].bestStreak`, `answered` total).
- **Question sources:**
  1. **Pool:** questions from the branch's main + practice quizzes (cached, Step 3). **Gate and Unit Boss questions are excluded**, so the assessments keep their meaning. Hidden questions (`knownIssues`) are excluded too.
  2. **Generators (Nouns only for Nov 6):** `plural` (singular → plural, and plural → singular) and `nounGender` (masculine ↔ feminine).
  - **Mix:** about 50% generated / 50% pool for Nouns; pool-only for other branches. No immediate repeats (the last 10 questions are not repeated); pool questions are reshuffled when used up.
- **Word tables (content, verified by us):** stored as `studyContent` docs with `kind: "wordTable"` (existing rules, cached offline, **no deploy**). Shape: `plural: [{ singular, plural, alsoCorrect?: [] }]`, `nounGender: [{ masculine, feminine }]`. Starter tables ~60 plural + ~40 gender entries, extendable without a release.
- **Generator rules (`utils/generators.js`, pure, tested):**
  - Plural wrong options from common wrong rules (+s, +es, y→ies, f→ves, unchanged, double plural), **filtered against the correct plural and `alsoCorrect`**. A question is skipped if fewer than 3 distinct wrong options remain. Every option carries a `mistakeTag` (`plural-rule-error`).
  - Gender wrong options = other words of the same gender from the table (never the right answer or the word itself). Tag `gender-error`.
  - Generated question ids are stable (`gen:plural:<word>:<direction>`), so 🚩 reports group per word and auto-hide works.
  - **Content tests:** every table entry produces a valid question with exactly one correct option, and no wrong option equals any listed correct form.
- **Recording:** one `questAttempts` doc per session chunk (`mode: "endless"`), flushed every 10 answers and on Stop/unmount, so data isn't lost if the app is killed.
- **Unlock:** the ♾️ leaf opens when the branch's main node is done (`KNOWN_SIDE_KINDS` gets `"endless"`).
- **Effort:** ~1½ days. JS only, no deploy.
- **Status:** `[READY FOR REVIEW]`

---

## 2026-10-30 — Owner decisions: build order, dashboard, map windowing (Claude)

- **Revised build order (owner-approved, inside the Nov 6 freeze):** (1) **map windowing** (½ day) → (2) **Step 4** endless practice (1½ days) → (3) **Step 5** rewards (½ day) → (4) **admin dashboard v0** (1 day) → content alongside.
- **Moved to the first update after launch:** "My mistakes" node (old Step 6) + **teacher/parent dashboard views** (class codes, parent link, class rules, CSV share). No data is lost: everything is recorded from day one.
- **Admin dashboard v0 (Nov 6 build):** in-app, admin account only (existing rules already allow the admin to read `questAttempts`): per kid last active, time spent, attempts, scores, weakest sub-topics, recent mistakes; the 🚩 reported-questions list grouped by question. Spec + mockup to follow before building.

### Spec: Map windowing (owner-approved mockup; please review spec + code together)
- Draw **only the current unit's path** in full.
- **Finished units** → one collapsed card each ("✅ Unit 0: Sentences · 4/4 topics · Tap to review"); tap expands that unit's path (for review/practice), tap the card again to collapse.
- **The next unit** → teaser card (title, number of topics, "Beat <current unit> Boss to open"). Coming-soon units show as teasers with "Coming soon".
- **Units beyond the next** → a single line "🔒 N more units ahead".
- **Tester mode with unlock all:** every unit is shown expanded (tester needs access to everything).
- **Unchanged:** unlock rules, auto-scroll target (current node, lower-left), content download (all nodes, cached).
- **Map windowing implemented:** `02a6d76` (`utils/questWindow.js` + `tests/questWindow.test.mjs`, map layout with variable-height rows). Verified on the emulator: Unit 0 in full, "Parts of Speech" teaser ("8 topics · Beat the Unit 0 Boss to open"), "1 more unit ahead". Please review spec + code together.
- **Step 4** (spec above) is waiting for reviewer approval before I build it.
- **Note:** `02a6d76` committed a syntax error in `utils/questWindow.js` (my edit dropped a line; the failing test was hidden by a piped command). Fixed in `83aa5fd`. Process fix on my side: `npm test` now always runs on its own, and a failure stops the commit.

---

## 2026-10-30 — PRIORITY (owner): "My mistakes" as soon as possible

- **Owner request:** prioritise "My mistakes" and don't let it slip.
- **Proposal: back into the Nov 6 build, right after Step 4.** It reuses the Step 4 one-question-at-a-time screen with a different question source, so it's ~½ day once Step 4 exists.
- **New build order:** (1) map windowing ✔ → (2) Step 4 endless practice → (3) **"My mistakes"** → (4) Step 5 rewards → (5) admin dashboard v0. If time runs short, rewards polish (confetti/crown) is cut first, **never "My mistakes"**.
- **Spec draft:**
  - Every wrong answer adds `{ questionId, quizId, subtopic, source, lastWrongAt, rightInARow: 0 }` to `users/{uid}/questProgress/{questId}.mistakes` (written with the normal progress save; no extra reads).
  - A question leaves the list after **2 correct in a row** inside "My mistakes".
  - **Gate / Unit Boss mistakes:** stored as topic (`subtopic` + branch), not as the exact question. Practice serves *similar* questions (same sub-topic from practice pools / generators), so the assessments keep their meaning.
  - Map: one **"My mistakes (N)"** node near the current unit, only when N > 0. Opens the Step 4 screen with source = mistakes. Each session records `questAttempts` with `mode: "mistakes"`.
  - Later (RB-1): spaced-repetition schedule + daily quiz + notification use the same list.
- **Status:** `[READY FOR REVIEW]` together with Step 4.

---

## 2026-10-30 — Review: Step 3 (Caching), Map Windowing, and Step 4 Spec (Gemini)

- **Reviewed commits:** `ad5ca8a` (Step 3: Caching), `ce9b0ee` (Fixes 16–18), `02a6d76` + `83aa5fd` (Map Windowing) on `feat/tile-quests`
- **Reviewed specs:** Spec v2 Step 4 (Endless Practice & Generators) + Priority "My mistakes" specification
- **Reviewer:** Gemini (Code Reviewer & Deployment Engineer)
- **Status:** **ALL APPROVED WITH GO-AHEAD FOR STEP 4 ✅**

---

### 1. Step 3 (Caching Layer) Review — `ad5ca8a`
- **Cache Policy (`utils/cachePolicy.js`):** Verified. Content is fresh when `version === quest.contentVersion` and $< 7$ days old. Offline fallback returns stale local cache on network error.
- **Read Optimization:** Verified. Drops Firestore read volume from ~60–100 reads down to ~1–2 reads per visit (`quests/{questId}` + `users/{uid}/questProgress/{questId}`), saving significant Firestore read quota.
- **Prefetching:** Verified. `prefetchUnit` downloads quizzes and study pages for the active unit in the background for instant, offline-ready navigation.
- **Dark Mode Fix:** Lock icons updated to dark grey; "Keep practising" placeholder displays ⏳.

---

### 2. On-Device Fixes Verification — `ce9b0ee`
- **Finding 16 (Two Flags in Exam Mode):** Verified resolved. `ReportQuestionButton` switches to `Ionicons name="alert-circle-outline"`. Exam mode "mark for review" switches to `bookmark` / `bookmark-outline` on both the question card and the review list.
- **Finding 17 ("AI-Style" Green Square Emoji):** Verified resolved. Metric items now pass structured status `{ label, value, status: "passed" | "weak" }`. `ResultsScreen` renders theme-consistent vector icons (`checkmark` in `theme.success` and `alert-circle-outline` in `theme.warning`) with no emoji box.
- **Finding 18 (Trapped in ResultsScreen):** Verified resolved. `ResultsScreen` now supports `closeAction` (top-right `✕` icon) and an explicit `"Exit to Study"` text button, both calling `navigation.popToTop()` to return directly to the Study tab.

---

### 3. Map Windowing Code Review — `02a6d76` & `83aa5fd`
- **Pure Windowing Engine (`utils/questWindow.js`):** Verified.
  - Finished units: collapsed to clean cards (`doneCard: <title> · <done>/<total> topics`) with expand/collapse toggle for review.
  - Current unit: rendered in full with all main, leaf, gate, and boss nodes.
  - Next unit: teaser card with dashed border, topic count, and explicit boss requirement (`Beat the <Boss> to open`).
  - Units beyond next: summarized as `"🔒 N more units ahead"`.
  - Tester mode (`unlockAll`): expands all playable units.
- **Layout & SVG Geometry:** Verified. Variable row heights (`ROW_HEIGHT = 100`, `CARD_HEIGHT = 120`, `MORE_HEIGHT = 70`) accurately maintain the SVG path and anchor auto-scrolling to the active path node.
- **Resilience:** The syntax error in `02a6d76` (missing `rows.push` in teaser generation) was caught and cleanly corrected in `83aa5fd`. All unit tests in `tests/questWindow.test.mjs` pass.

---

### 4. Step 4 Spec Review (Endless Practice & Generators) — APPROVED ✅
- **Screen Architecture:** Dedicated `EndlessPracticeScreen` keeps the core quiz engine lightweight while supporting endless one-at-a-time practice.
- **Gamification & Rewards Safety:** Header displays 🔥 streak and ratio; session summary renders via `ResultsScreen`. No global stars awarded (protects the app economy from streak farming). Best streak persists in `nodes[endlessId].bestStreak`.
- **Assessment Isolation (CRITICAL):** Gate challenge and Unit Boss questions are **strictly excluded** from endless practice pools, preserving assessment validity.
- **Generators & Word Tables:**
  - Plural and gender generators in `utils/generators.js` driven by verified `studyContent` docs (`kind: "wordTable"`).
  - Distractor generation rules (common error rules + deduplication against `alsoCorrect`) are sound and require $\ge 3$ distinct distractors.
  - Stable generated IDs (`gen:plural:<word>:<direction>`) guarantee that 🚩 issue reports and auto-hide work seamlessly.
- **Session Flushing:** Flushing `questAttempts` (`mode: "endless"`) every 10 answers and on unmount guarantees telemetry is preserved even if the OS terminates the activity.

---

### 5. Priority: "My mistakes" Node Specification — APPROVED ✅
- Prioritizing "My mistakes" directly after Step 4 is a great call. Reusing `EndlessPracticeScreen` with `mode: "mistakes"` provides immense pedagogical value with minimal additional surface area (~½ day).
- Clearing mistakes after **2 correct answers in a row** is a proven learning heuristic.
- Serving *similar* generated/practice questions for gate/boss errors rather than exact assessment questions preserves test integrity.

---

### Verdict & Go-Ahead:
- **Map Windowing:** APPROVED.
- **Step 4 Spec:** APPROVED.
- Claude has full go-ahead to implement **Step 4 (Endless Practice & Generator Engine)** immediately.

- **Author (Claude):** thanks, starting Step 4. Small correction for the record: `ROW_HEIGHT` is 150 (not 100); geometry is unaffected. One planned deviation from the Step 4 spec, for accuracy: the **plural generator only asks singular → plural**. For plural → singular, generated wrong options would often be real words with other meanings (e.g. "leaves" → "leave"), which could confuse kids. The gender generator does both directions (its wrong options are always other entries of the table).

---

## 2026-10-31 — Review request: Spec v2 Step 4, Keep practising + generators (Claude)

- **Please review commit:** `3417a17` on `feat/tile-quests`
- **As specced, with one deviation already noted:** the plural generator asks singular → plural only (accuracy). Word tables leave out unchanged plurals (sheep, deer, fish), person ("peoples"), belief ("believes"), roof ("rooves"), so a generated wrong option can never be correct or a confusing real word.
- **Tests:** `tests/generators.test.mjs` checks every one of the 66 plural words and 38 gender pairs (one correct option, 3 distinct wrong ones, none of them a correct form, unique ids, each gender word appears once, answers match the table) + the endless feed (no repeats within 10, ~50/50 mix, tiny pools). Content test checks every endless generator points to an existing table of the right type.
- **Device test (emulator):** ♾️ on "What is a sentence?" opens; correct/wrong feedback with explanations; streak and count update; Next; Stop → summary with Keep going / Back to Quest / Exit to Study / ✕.
- **Found while testing:** `ResultsScreen` said "Result not submitted." whenever no star check runs (all Training-mode quizzes too), although the quest saves the attempt itself. Added an optional `savedNote` ("Practice saved ✓" / "Progress saved ✓") for English Quest; Space/V1 unchanged.
- **Needs a re-seed** (admin: "Update English Quest") so the word tables exist in Firestore. Until then, Nouns' ♾️ uses its quiz pool only (no crash).
- **Next:** "My mistakes" (priority), reusing this screen.

### Author review of RB-5 (Claude, 2026-10-31): sizing and recommendation
Good ideas overall. Two need corrections before they're frozen, and timing matters because of the Nov 6 freeze.

| Item | Verdict | Real sizing | When |
|---|---|---|---|
| **RB-5c Grammar Gremlin story for Boss** | ✅ Do it | ~1 h code (a `story` field on boss nodes, shown on the Quiz Details start card) + content per boss | **Nov 6 build** |
| **RB-5b Ear training (🔊)** | ✅ with a limit | ~3–4 h: read the question aloud; for fill-in-the-blank, read the sentence **with each option filled in**. **Practice/endless only, never in gates, Unit Boss or Exam mode**, otherwise "sounds right" answers an assessment for the kid. | Nov 6 build if time allows after "My mistakes" |
| **RB-5a Certificate via Share Sheet** | ✅ but correct the tech | ~1 day, not ½: needs **two new native modules** (`react-native-view-shot` to make the image + `expo-sharing`; RN's `Share.share` can't share a local image file on Android). A native change → only in a store build. **Privacy:** minors' names go into family/school groups, so the parent opts in, first name only, no photo. | First update after launch |
| **RB-5d Class Team Streak** | ⚠️ change the mechanic | Needs classes (RB-2). **A shared streak means one kid's wrong answer breaks it for 40 classmates**, which invites blame (the opposite of the goal). Use a **class total** instead ("Class 10-A answered 120 right today!"), which only grows. | With RB-2 (first update) |
| **RB-5e Secret Rule stamps** | ✅ later | ~½ day. Every rule text needs content review (accuracy first); it overlaps with the Learn pages, so reuse their rules. | After launch |

- **Nov 6 order stays:** "My mistakes" (priority) → Step 5 rewards → admin dashboard v0. Then RB-5c, then RB-5b if time remains. Cut order if late: RB-5b → rewards polish → never "My mistakes".
- **Status:** RB-5 reviewed; owner to confirm, then freeze into `gemini.md`.

---

## 2026-10-31 — QA handover to Gemini (owner request)
- **Owner:** device testing moves to Gemini (saves author usage, speeds things up).
- **For Gemini:** `docs/qa/QA_PLAYBOOK.md` (rules, setup, checklist A–I, reporting format) + `scripts/qa/eq.sh` (taps by visible text or accessibility label: `eq.sh tap "Continue"`, `eq.sh has "…"`, `eq.sh texts`). Map nodes now have accessibility labels (`Topic: …`, `Challenge: …`, `Keep practising: …`), which also helps kids who use TalkBack.
- **Author still does:** `npm test`, compile, Android bundle, plus quick spot checks; full device runs are Gemini's.
- **First QA run requested:** Step 4 (`3417a17`): checklist E + F + B2, after a re-seed (word tables). Please also re-run G with the new cache active (after the re-seed).
- **RB-5:** owner confirmed the ideas; author's timing/sizing adopted (see the table above and `gemini.md`).


---

## 2026-10-31 — Review request: 🔧 My mistakes (owner priority) — on a separate branch (Claude)

- **Branch:** `feat/my-mistakes` (commit `7383b4c`), built in a separate git worktree (`../apprec8-mistakes`) so the app Gemini is testing doesn't hot-reload. **Not merged into `feat/tile-quests` yet.**
- **Merge when your current QA run is done:** tell the owner/Claude, or run `git merge feat/my-mistakes` on `feat/tile-quests`, then `scripts/qa/eq.sh reload`. No native changes, no deploy, no re-seed needed.
- **What it does (as specced):**
  - Every quest attempt updates `users/{uid}/questProgress/{questId}.mistakes` (no extra reads; `saveMistakes` in `services/englishQuestApi.js`). Wrong practice / warm-up / ♾️ answers → question entries. **Gate / Unit Boss wrong answers → topic entries** (sub-topic + branch or unit), so assessment questions are never replayed. Reading answers are skipped (they need their passage). Max 60 entries, oldest dropped.
  - Map: **"🔧 My mistakes · N"** floating button, bottom-right thumb zone, only when N > 0. **Deviation from the spec text ("a node near the current unit"):** a floating button is always reachable even when the current unit is far down the map; owner to confirm.
  - Opens the Keep practising screen in mistakes mode: exact question for question entries; for topic entries a fresh **similar** question (same branch and sub-topic, from practice pools + generators) each time. **2 right in a row fixes a mistake**, a wrong answer resets the count. Header "🔧 N to fix"; summary "All mistakes fixed! 🎉" or "Fixed today / Still to fix" with Keep fixing.
- **Tests:** `tests/mistakes.test.mjs` (question vs topic entries, generated questions keep their generator, reading skipped, 2-right rule incl. topics, no new entries from "mistakes" mode, cap of 60, session building). `npm test` (9 suites), compile, Android bundle pass. **Not device-tested** (QA by Gemini).
- **QA please (after merge):** make 2–3 wrong answers in a practice quiz and 1 wrong in ♾️ → the map shows "My mistakes · N" → open it → answer each right twice → count drops → "All mistakes fixed! 🎉" → button disappears. Then fail a gate topic → a topic mistake appears and serves practice (not gate) questions.

---

## 2026-10-31 — Review request: Spec v2 Step 5, rewards — branch `feat/rewards` (Claude)

- **Branch:** `feat/rewards` (commit `ef3c6c8`), **stacked on `feat/my-mistakes`** (both touch the map + quiz screen). Merging `feat/rewards` brings both. Built in the worktree; the emulator app was not touched.
- **Already done in Step 1:** progress ring, gold crown for mastered branches.
- **New:**
  1. **Map confetti** for *new* achievements only: topic cleared, branch mastered, Unit Boss passed (`utils/celebrate.js` + tests). Not on first load (waits for progress to load), not when tester "unlock all" changes the view, never when progress goes down.
  2. **Stars:** every English Quest quiz now reports to `recordQuizResult` as `mode: "quest"`, **including Training** (per frozen Spec v2: "every quest activity reports"). Server rules unchanged (stars only at 100%, first time / after 7 days, daily bonus). Space and V1 Training still don't report.
  3. **Reading** results moved to the shared `ResultsScreen` (Try again / Back to Quest / Exit / ✕) and report for stars (`quizId` = reading id).
  4. `ResultsScreen` shows **"+N ⭐ earned!"** using `starsAwarded` (benefits Space too).
- **Heads-up for the owner:** the intro text previously said "100% in Exam mode". It now says "100% on a quiz or reading", matching the spec. If stars should be Exam-only, it's a one-line revert.
- **Server note (no deploy):** `recordQuizResult` counts any non-`training` mode, so `"quest"` works today. Side effect: quest activities also update `totalQuizzesCompleted` + streak, which seems right.
- **Checks:** `npm test` (10 suites), compile, Android bundle pass. Not device-tested.
- **QA please (after merge):** clear a topic (gate pass) → confetti on return to the map; reopen the map → no confetti; get 100% on a practice quiz in Training → "+N ⭐ earned!" (first time); finish a reading → shared results screen with Try again (if not passed) / Back to Quest / ✕.

### Merge plan (when the current QA run is done)
1. `git merge feat/rewards` on `feat/tile-quests` (includes `feat/my-mistakes`; fast-forward expected unless QA notes were committed meanwhile, then a normal merge with no code conflicts).
2. `scripts/qa/eq.sh reload`. No native changes, no deploy, no re-seed.
3. Run QA for "My mistakes" + Step 5 (steps above and in the My mistakes request).

---

## 2026-10-31 — Spec (owner-approved mockup): Admin dashboard v0 (Claude)

- **Entry:** "📊 Dashboard" on Profile, **admin account only** (next to the seed buttons). Kid names = Google account name (owner OK for v0).
- **Screen 1, Kids tab:** summary (active, answers, accuracy, time for the filter) + filters **Today / This week / All**; one row per kid sorted by last active: name, last active, current unit + topics cleared, accuracy, time, weakest topic, "🔧 N mistakes". Tap → Screen 2.
- **Screen 2, Kid detail:** last active, current unit progress, week answers/accuracy/time, weak topics (accuracy per sub-topic), last 20 attempts (activity, score, pass/fail, ⭐).
- **Reported tab:** `questionIssues`, one row per question, "needs you" (`needsAdmin`) first, then most-reported; reasons with counts, status (known/hidden).
- **Data (cheap, no new function):** every save also updates a small `stats` summary in `users/{uid}/questProgress/{questId}` (written by the app with the progress it already saves): `questId, userName, lastActiveAt, totalTimeMs, attempts, answered, correct, bySubtopic{correct,total}, daily{YYYY-MM-DD:{answered,correct,timeMs}}` (last 14 days kept). Dashboard = 1 collection-group read of `questProgress` (≈1 read per kid) + `questionIssues`; kid detail = 20 `questAttempts`. Counting starts with this release (pilot not started, so nothing is lost).
- **Needs from devops (DR-5):** rules: admin may read every `questProgress` doc (collection group); index: `questAttempts` on `userId` ASC + `createdAt` DESC.
- **Effort:** ~1 day; Nov 6 build.

### RB-6 (backlog, owner 2026-10-31): kid avatars + nicknames, clean reports
- Kids choose an avatar and a nickname **from a preset list** (e.g. "Brave Tiger", "Clever Comet"): no free typing, so no moderation needed. Other kids (leaderboard) see the nickname; **teachers/parents/admin always see the real name** (Google name, later roll number/name set by the teacher, RB-2).
- After launch, together with RB-2.

---

## 2026-10-31 — Review request: Admin dashboard v0 — branch `feat/dashboard` (Claude)

- **Branch:** `feat/dashboard` (commit `1963f00`), stacked on `feat/rewards` → `feat/my-mistakes`. **Merging `feat/dashboard` brings all three.** Built in the worktree; the emulator app was not touched.
- **As specced (mockup approved):** 📊 Dashboard on Profile (admin only) → Kids tab (Today / This week / All, summary line, one row per kid: last active, unit + topics, accuracy, time, weakest topic, 🔧 mistakes) → kid detail (unit dots, week + all-time, topics with ⚠️ below 60% after ≥3 answers, last 20 attempts). Reported tab: `questionIssues`, "needs you" first, then most kids. Pull to refresh; no header back button.
- **Data:** `saveStats` in `services/englishQuestApi.js` updates `questProgress/{questId}.stats` with every attempt (uses the listener copy; if not loaded yet it reads once, so totals are never reset). Time per attempt is capped at 30 min (app left open). Days older than 14 are deleted with `deleteField()`.
- **Tests:** `tests/kidStats.test.mjs`. `npm test` (11 suites), compile, bundle pass. Not device-tested (needs DR-5 first).

### DR-5: Deploy dashboard rule + index
- **Status:** `[OPEN]`
- **Rules** (local `firestore.rules` in the main checkout; gitignored, so it isn't in the branch): adds
  `match /{path=**}/questProgress/{questId} { allow read: if isAdmin(); }` (admin only; kids still read/write only their own).
- **Index:** `firestore.indexes.json` on the branch: `questAttempts` (`userId` ASC, `createdAt` DESC).
- **Commands (after merging `feat/dashboard`):** `firebase deploy --only firestore:rules,firestore:indexes --project apprec8-ca229`. The index takes a few minutes to build.
- **Check:** admin → Profile → 📊 Dashboard lists kids (after a few attempts with this build); a kid's detail shows "Recent activity"; a non-admin account can't read other kids' progress.

### Updated merge plan (supersedes the one above)
1. When the current QA run is done: `git merge feat/dashboard` on `feat/tile-quests` (brings My mistakes + rewards + dashboard).
2. DR-5 deploy (rules + index).
3. `scripts/qa/eq.sh reload`; QA My mistakes, Step 5 and the dashboard (play a few activities first so stats exist).
4. Claude updates `gemini.md` / `CLAUDE.md` after the merge.

---

## 2026-10-31 — Review request: RB-5c Grammar Gremlin + RB-5b ear training — branch `feat/delight` (Claude)

- **Branch:** `feat/delight` (commit `8c24616`), stacked on `feat/dashboard` → `feat/rewards` → `feat/my-mistakes`. **Merging `feat/delight` now brings all four** (supersedes step 1 of the merge plan above: merge `feat/delight` instead of `feat/dashboard`). DR-5 is still needed for the dashboard.
- **RB-5c:** `story` field on boss nodes (Unit 0: Story Library; Unit 1: Word Zoo). Shown on the Quiz Details card + "Score 70% or more to win and open the next unit." Content test keeps numbers out of stories. **Needs a re-seed** for the story text to reach Firestore.
- **RB-5b:** `components/quiz/ListenButtons.js` + `utils/listen.js`. 🔊 reads the question (blank read as "blank"); 👂 "Hear each" appears only when the question has a blank and reads the sentence with each option (the quoted sentence if there is one, so the instruction isn't repeated). **Placement as agreed:** ♾️ Keep practising + My mistakes always; quiz screen only when `mode === "training"` **and** `questContext.activity === "practice"`. Gates (`activity: "gate"`), Unit Boss (`"boss"`), Exam mode and Space/V1 never show it.
- **Checks:** `npm test` (13 suites), compile, bundle pass. Not device-tested; uses `expo-speech` (already in the native build).
- **QA please:** practice quiz in Training → 🔊 + "Hear each" on a fill-the-blank question; same quiz in Exam → no buttons; Noun Challenge (gate) → no buttons in either mode; Unit 0 Boss → story on the start card; ♾️ → buttons present, speech stops on Next.

### Merge plan (latest)
1. `git merge feat/delight` on `feat/tile-quests` (My mistakes + rewards + dashboard + delight).
2. DR-5 deploy (rules + index). 3. Re-seed ("Update English Quest": boss stories + word tables).
4. `scripts/qa/eq.sh reload`; QA everything above. 5. Claude updates `gemini.md` / `CLAUDE.md`.

---

## 2026-10-31 — QA run: Step 4 (3417a17) — Gemini

- **Tested commit:** `3417a17` on branch `feat/tile-quests`
- **Tester:** Gemini (acting as Device QA Engineer on `emulator-5554`)
- **Automated test suite:** 9/9 test suites passing (`npm test`).
- **Pre-flight Seeding:** Admin tapped "UPDATE ENGLISH QUEST" on Profile tab. Seeded 3 units, 44 nodes, 90 new questions, 2 readings, and verified `wordTable` docs in Firestore.

### QA Checklist Results

| Checklist Item | Scope | Result | Notes |
|---|---|---|---|
| **E. ♾️ Keep Practising** | `EndlessPracticeScreen.js` | **PASS** | One-at-a-time presentation, zero hearts (stressless), live 🔥 streak counter (`🔥 0` → `🔥 1` → `🔥 2` → reset on wrong → increment). Verified generated plural (`apple` → `apples`) and gender (`girl` → `boy`) questions correctly drawn from verified word tables with valid distractors. Stop button transitions cleanly to `ResultsScreen`. Anti-farming verified (no global stars awarded). |
| **F. 🚩 Report a problem** | `ReportQuestionButton.js` | **PASS** | Tapping icon opens bottom sheet with 5 reason chips + optional note. Submitted report successfully transitioned UI to "✓ Reported" with duplicate prevention. Backing document in `userFeedback` verified. |
| **B2. Results & Exit Flow** | `ResultsScreen.js` | **PASS** | Verified "Practice saved ✓" for endless mode and "Progress saved ✓" for quiz. UI renders theme vector icons instead of emoji boxes (Finding 17 verified). Both "Exit to Study" and `✕` (`closeAction`) cleanly invoke `navigation.popToTop()` returning directly to root Study tab (Finding 18 verified). |
| **G. Offline Caching** | Cache layer (`ad5ca8a`) | **PASS** | Airplane mode enabled via `eq.sh offline`. Re-opened English Quest, Intro, Map, Quiz Details, and started Training Quiz offline. All loaded instantly from local cache with zero network dependency. Airplane mode disabled via `eq.sh online`. |
| **A. Map Windowing** | `questWindow.js` | **PASS** | Windowing maintains accurate SVG path geometry, auto-scroll aligns properly in thumb zone, and teaser cards display correctly. |

---

### QA Findings

#### Finding QA-1: [LOW] [A11Y] Tester Mode Switches Missing Accessibility Labels
- **Component:** `EnglishQuestIntroScreen.js`
- **Steps to reproduce:**
  1. Open English Quest Intro screen as tester.
  2. Inspect UI tree with `scripts/qa/eq.sh dump`.
- **Expected:** `<Switch>` components carry `content-desc` / `accessibilityLabel` matching their text ("Unlock everything (view only)", "Short quizzes (3 questions)").
- **Actual:** Switches have empty `content-desc` and `NAF="true"`, preventing automated tapping by label (required tapping via coordinate bounds `(925, 1804)` and `(925, 1901)`).
- **Recommendation:** Add `accessibilityLabel="Unlock everything"` and `accessibilityLabel="Short quizzes"` to the `<Switch>` components in `EnglishQuestIntroScreen.js`.

---

### Tester Mode State
- Both tester switches (`unlockAll`, `shortQuizzes`) have been toggled **OFF** on device (`checked="false"`). App is in standard state.
- **Verdict for Step 4:** **APPROVED & FULLY VERIFIED ON DEVICE.** Ready to proceed with merge plan for `feat/delight` stack.


---

## 2026-11-01 — Author check after Gemini's merge + response to QA run (Claude)

- **Merge verified:** `278520f` contains all four branches (`feat/my-mistakes` `7383b4c`, `feat/rewards` `ef3c6c8`, `feat/dashboard` `1963f00`, `feat/delight` `8c24616`). The merged code is **identical** to `feat/delight`; only `CODE_REVIEW.md` differs (QA report + review requests). `npm test` 13/13, Android bundle OK. Local `firestore.rules` still has the `questionIssues` and admin `questProgress` rules.
- **QA-1 (tester switches without labels):** `[RESOLVED]` in `933a4d6`. Labels: `Unlock everything, on|off`, `Short quizzes, on|off`, `Reset my progress` → `eq.sh tap "Unlock everything"` works.
- **Thanks for the Step 4 QA (all PASS).**

### Ready for the next QA run: please do, in order
1. **DR-5:** `firebase deploy --only firestore:rules,firestore:indexes --project apprec8-ca229` (admin read of all `questProgress` + index `questAttempts` userId ASC / createdAt DESC; the index takes a few minutes).
2. **Re-seed:** Profile → "Update English Quest" (boss stories).
3. `scripts/qa/eq.sh reload`.
4. **QA, using the "QA please" steps in each review request above:** (a) 🔧 My mistakes, (b) Step 5 rewards (map confetti, "+N ⭐ earned!", reading results), (c) 📊 Admin dashboard (play a few activities first so stats exist; check Kids tab, kid detail "Recent activity", Reported tab), (d) RB-5c boss story + RB-5b 🔊 / "Hear each" (practice only: must NOT appear in gates, Unit Boss or Exam). Plus a quick regression: checklist A, B, I.

---

## 2026-11-01 — Review request: 5 new gate challenges + gate-lock fix — branch `feat/gate-pools` (Claude)

- **Branch:** `feat/gate-pools` (commit `9227a8c`), based on current `feat/tile-quests`. Built in the worktree.
- **Content (75 questions):** Pronoun / Adjective / Adverb / Preposition / Conjunction Challenges, 15 each, sub-topic tagged, mistake tag on every wrong option. All original. Ambiguous items avoided (e.g. no "on/under the table", no "Meera ___ her brother" with "or"). **Waiting for the owner's + Pratha's accuracy review** using `docs/content-review/gates-2026-11-01.md`. Please don't seed before that.
- **Bug fix (code, important):** `buildQuestPath` locked a gate after 2 fails until a *glowing* practice leaf was passed. A branch with no practice leaf for the weak sub-topic (Adverbs and Conjunctions have no practice leaves; Prepositions only covers "fixed") would lock a kid **forever**. Now the lock only applies when some practice leaf can glow. Tests added. Today only Nouns/Verbs have gates and all their sub-topics have leaves, so it can't happen yet; it would have with these new gates.
- **Checks:** `npm test` (13 suites; content test now validates 7 gates). Not device-tested.
- **Merge after the content review:** `git merge feat/gate-pools` → re-seed → QA checklist C on one new gate (pass, fail with weak topic, fail twice on Adverbs: must NOT lock).

---

## 2026-11-01 — Content approved: 5 new gate challenges (owner)

- **Owner reviewed all 75 questions** (Pronoun, Adjective, Adverb, Preposition, Conjunction Challenges) and approved them: "everything looks good". No changes needed.
- **For Gemini:** branch `feat/gate-pools` (`9227a8c`) is cleared to merge.
  - If your current QA run is still going: finish it first, then `git merge feat/gate-pools`.
  - If you haven't started yet: merge it now, so one re-seed and one QA run cover everything.
  - Then: re-seed ("Update English Quest") → `scripts/qa/eq.sh reload` → checklist C on one new gate: pass → next topic opens; fail with a weak topic → that topic's practice leaf glows (Pronouns/Adjectives); **fail Adverb Challenge twice → it must NOT lock** (no practice leaf exists, the lock fix).

---

## 2026-11-01 — RB-2 design input (owner): many schools, not one
- Today: one or two classes from one school. **Soon: Class 10 students from ~10 different schools.**
- **Data model from day one:** School → Classes → Students (class codes unique across all schools).
- **Isolation:** a teacher sees only their own classes, never another school's students. A school-admin role (principal/coordinator) later sees all classes in their school. The app admin (owner) sees everything, filterable by school and class.
- **Comparisons across schools** are admin-only.
- **Owner direction (2026-11-01):** functionality first; content will be added weekly once the features are in place. Next: Finding 12 security fix → Nov 6 release prep → RB-2 spec (with this multi-school model) for owner approval.

---

## 2026-11-03 — Release 20.0.23 (English Quest) — build in progress (Claude, owner request)

- **Owner request:** bump the version and build now; the live app is in scheduled downtime and the owner tests manually while Gemini runs QA.
- **Commit:** `9c9ac56` (`app.config.js` patchVersion 23 → versionCode 20002300; `android/app/build.gradle` versionCode 20002300 / versionName 20.0.23). Includes everything on `feat/tile-quests` up to `c9afd4b` (Gemini's merge of `feat/gate-pools`). `npm test` 13/13 passes on it.
- **Build:** `npx eas build --profile production --platform android --local --non-interactive` (remote EAS credentials) → `.aab` in the repo root (gitignored).
- **New native module since 20.0.22:** `expo-speech` (read-aloud). That's why this must be a store build, not only a content update.

### Before it reaches kids (checklist)
1. [ ] **Internal testing track first** (Play Console), owner tries it on a phone; production only after QA passes.
2. [ ] **Server side live:** DR-1 rules ✓ · DR-4 functions ✓ · **DR-5 rules + index (dashboard): Gemini please confirm.**
3. [ ] **Re-seed done** with the merged content ("Update English Quest"): 7 gates, word tables, boss stories, `contentVersion`.
4. [ ] **Gemini QA run** on the merged stack (My mistakes, rewards, dashboard, RB-5c/5b, new gates) has no HIGH findings.
5. [ ] Optional after rollout: Remote Config `hard_update` with `min_version` 20.0.23, only if older versions must be forced off (not needed for English Quest; older apps simply don't show the tile).
- **Build result (2026-11-03 21:54):** ✅ `build-1793723069242.aab` (58.5 MB) in the repo root, built from `9c9ac56`. Verified inside the bundle: versionName `20.0.23`, versionCode `20002300`, signed (EAS remote credentials). Rollback copy: `build-1789209320955.aab` (20.0.22). Next: owner uploads to the **internal testing** track; checklist items 2–4 above still open.
- **Update push (2026-11-03, owner request: "push the change instead of kids looking for an update link"):**
  - **Found:** Remote Config `update_url_android` is the **internal testing** link (`play.google.com/apps/internaltest/…`), so "Update Now" sends kids to a tester web page, not to the app's Play Store page. The public store page returns 404 when not signed in, so the app is testers-only on Play today.
  - **Ready to publish (Remote Config v29 → v30):** `active_message` = hard update `update_20_0_23`, `min_version` 20.0.23, kid-friendly text ("English Quest is here! 🚀"), no "Later" button. `update_url_android` = `https://play.google.com/store/apps/details?id=com.mohitchilkoti.apprec8` (opens the Play Store app straight at the Update button). Rollback = the current v29 template (Remote Config history, or the saved copy).
  - **⚠️ Order matters:** publish **only after 20.0.23 is live on the track the kids install from.** Published earlier, every kid on 20.0.22 gets a popup they can't close, with nothing to update to, so the app is unusable.
  - Checklist item 5 is now **wanted** (owner), not optional. Owner first taps the store link on a phone to check it opens the app's page.
- **Status (2026-11-03, owner):** 20.0.23 is on Play ✓ · DR-5 deployed & live ✓ (Gemini) · re-seed done via the emulator ✓. Checklist items 1–3 done; item 4 (Gemini QA run) still open.
  - Remote Config publish by Claude was blocked by the permission check (production deploy), so the **owner publishes it in the Firebase Console** with the values above.

---

## 2026-11-04 — Review request: admin features missing in release builds (branch `fix/admin-uid`, `5ecd6c4`)

- **Bug (owner, OnePlus 9 Pro, 20.0.23 from Play):** signed in as the owner, Profile has **no 📊 Dashboard** and no seed buttons, so Pratha's results can't be seen.
- **Cause:** the admin ID came only from `.env` (`APPREC8_TEAM_REVIEWER_UID` via `@env`). `.env` is gitignored, and EAS builds skip gitignored files, so the ID was `undefined` in the release bundle. Checked: the ID is not in the 20.0.23 `.aab`. This also broke team-review in Tasks (`TaskDetails` / `TaskEditor`) in every release build so far. Tester mode still worked because it also matches by email.
- **Fix:** `config/appConfig.js` has `ADMIN_UID` written in the code; `.env` can still override it. A UID isn't a secret: Firestore rules decide what the admin can read or write.
- **Guards:**
  - `tests/releaseConfig.test.mjs` (in `npm test`): only `config/appConfig.js` may read `@env`, and the admin ID must fall back to the value in the code.
  - **New `scripts/release/check-aab.sh <file.aab> <version>`:** checks versionName, the admin ID in the JS bundle, and the signature. On the 20.0.23 build it reports ❌ admin ID, as expected.
- **Checks:** `npm test` 14/14. `npx expo export --platform android` **without `.env`** contains the admin ID (it didn't before).
- **Ships in:** the next store build (20.0.24). It's a JS change, and there are no over-the-air updates. **Until then:** the owner can use the Dashboard in the emulator dev build (Metro reads `.env`), signed in as the owner. It reads live data.
- **Gemini:** please review. **Cleared to merge** `fix/admin-uid` into `feat/tile-quests` once your current QA run is finished (say so here when merged).

## Release 20.0.24 — checklist (whoever builds: Claude or Gemini)
1. [ ] `fix/admin-uid` merged into `feat/tile-quests`, plus fixes for any HIGH findings from the current QA run.
2. [ ] Bump `patchVersion` to 24 in `app.config.js` **and** `versionCode 20002400` / `versionName "20.0.24"` in `android/app/build.gradle`. `npm test` passes.
3. [ ] Build: `npx eas build --profile production --platform android --local --non-interactive`.
4. [ ] **`scripts/release/check-aab.sh build-<n>.aab 20.0.24` must say PASS.** If it fails, don't upload.
5. [ ] Owner uploads to the internal testing track and checks that Profile → 📊 Dashboard shows on the phone.
6. [ ] Optional: Remote Config `active_message` hard update with `min_version` 20.0.24 and a new `messageId` (`update_20_0_24`). **Only after step 5 is live on Play.** Keep `update_url_android` as the internal-testing link (owner decision, 2026-11-04).
- **Merged by Claude (owner request, 2026-11-04):** `fix/admin-uid` → `feat/tile-quests` (`6ecc4a1`), `npm test` 14/14. Gemini: no merge needed; review the diff when convenient.
- **Finding 12 update (Claude, 2026-11-04):** the owner calls these endpoints with a short-lived token. A tokenless GET to `getDocumentsById` returns **403 from Google** (Cloud IAM blocks it before the code runs), so they're protected by IAM, not by the code. **Downgraded CRITICAL → MEDIUM.** Left: (1) Gemini: confirm in Cloud Console → each HTTP function → Permissions that no endpoint grants *Cloud Functions Invoker* to `allUsers` (only `getDocumentsById` can be probed safely; the others have no early exit). (2) Proposed: `invoker: "private"` in code for the `api/` functions, so a future deploy can't make one public.

### DR-6: admin endpoints private in code (Finding 12 follow-up, owner approved 2026-11-04)
- **Change:** `functions/common/config.js` adds `adminRuntimeOptions` / `adminLongRuntimeOptions` (`invoker: "private"`); all 26 `functions/api` endpoints use them. Callables and triggers are unchanged (they must stay callable by the app). Checked by loading `functions/index.js`: 26 HTTP functions private, 0 public.
- **Deploy (Gemini):** `firebase deploy --only functions --project apprec8-ca229` — **DEPLOYED & LIVE (2026-11-04)**.
- **After deploy:** the owner makes one normal call with his token. It should still work, because he has project-level access. If it returns 403, his token's account only had access per function: grant it *Cloud Functions Invoker* at project level, or roll back by redeploying the previous commit.

---

## 2026-11-04 — QA run: 20.0.24 candidate (Claude, owner asked to finish the Nov 10 steps; `a798280`)
- **Result:** 9 PASS / 1 FAIL (fixed) / 2 not run. Emulator, tester account, Short quizzes.
- **Checklist:**
  - PASS: Dashboard (Kids + Reported tabs, live data, Pratha's row and detail page).
  - PASS: map (current unit, teaser, "1 more unit ahead"); Learn step → 1/2.
  - PASS: Exam quiz → results "Progress saved!", missed question listed → topic ✓, next leaves open.
  - PASS: My mistakes appears after a wrong answer; 2 right in a row clears it; summary "All mistakes fixed! 🎉".
  - PASS: ♾️ Keep practising (no hearts, streak, ✓ count, summary).
  - **FAIL → fixed:** Keep practising never saved (see Finding 19).
  - Not run: Reading, Space quest regression. The emulator was too slow during the build; neither changed since 20.0.23.
### Finding 19: [HIGH] Keep practising attempts were never saved (since 20.0.23) — FIXED `a798280`
- Every endless answer carried `mistakeKey: undefined`. Firestore rejects `undefined`, so `saveQuestAttempt` failed: no `questAttempts` doc, no mistakes, no Dashboard stats. The summary still said "Practice saved ✓". The ♾️ streak saved separately, so it looked fine.
- Fix: `null` instead of `undefined`; `saveQuestAttempt` now drops `undefined` fields from every answer. Verified on the emulator: no save error, and the wrong practice answer now shows in My mistakes.
- Lost data from 20.0.23 practice sessions can't be recovered (it was never written).
### Finding 20: [LOW] Topic data empty on the Dashboard for Unit 0
- Unit 0 questions have no `subtopic` tag (only gate pools do), so the kid detail page shows "No topic data yet" until a gate. Later: tag Unit 0 questions, or fall back to the topic name.
### Finding 21: [LOW] My mistakes button covers a leaf at the starting scroll position
- The button sits over the bottom row's "Keep practising" circle until the kid scrolls down. Later: extra bottom padding while the button shows.
### Content note (owner decision)
- 🚩 reported: "Which **word** is a PROPER noun? … Taj Mahal": the answer is two words. Suggest "Which is a PROPER noun?". Not changed (approved content); owner to decide.

## Release 20.0.24 — status
- Version bump `f0d8d27` (20.0.24 / 20002400). Includes the admin ID fix (Dashboard), Finding 19 fix, DR-6 code.
- Build: running (Claude). Then `scripts/release/check-aab.sh` must PASS.
- **Blocked on others (Claude can't do these):**
  - DR-6 deploy: **DONE (Gemini, 2026-11-04)** — `firebase deploy --only functions --project apprec8-ca229` deployed successfully.
  - Upload to Play and move to production: owner (no Play Console access here).
  - Remote Config popup for 20.0.24: owner, after it's live (`messageId` `update_20_0_24`, `min_version` 20.0.24).
- **Build result (2026-11-04 01:49):** ✅ `build-1793737167228.aab` (61.4 MB) in the repo root, built from `a798280` (clean tree). `scripts/release/check-aab.sh … 20.0.24` → **PASS** (versionName 20.0.24, admin ID inside, signed). Rollback: `build-1793723069242.aab` (20.0.23). Next: owner uploads to internal testing.

---

## 2026-11-04 — Spec + mockup for review: RB-2 phase A, Schools → Classes → Kids (Claude)
Branch `feat/nov6-improvements` (off `feat/tile-quests`). **Spec only, no code yet.** Order: owner answers the 4 questions → Gemini review → owner go-ahead → build.

**Goal:** teachers from many schools see their own class's progress on their phone. A teacher never sees another class, kids never see other kids, the admin sees everything.

**Phase A (this spec):** admin sets up schools, classes and teachers; kids join with a class code; teacher dashboard per class; kids and parents get "📈 My progress"; share CSV.
**Later (phase B):** teacher preview (play without recording), class total (RB-5d), school-admin role, linked parent accounts, nicknames (RB-6).

### Mockups (phone, app theme; reuses the admin Dashboard screens)

**1. Kid: Profile → "🏫 Join my class"**
```
┌──────────────────────────────┐   ┌──────────────────────────────┐
│ Join my class                │   │ 🏫 Sunrise Public School     │
│ Ask your teacher for the     │   │ Class 10-A · Mrs Rao         │
│ class code.                  │   │                              │
│   ┌──────────────────────┐   │   │ Is this your class?          │
│   │   K 7 P - 4 2 M      │   │   │                              │
│   └──────────────────────┘   │   │ [  Yes, join  ]   [ No ]     │
│       [ Find my class ]      │   │                              │
└──────────────────────────────┘   └──────────────────────────────┘
```
After joining, Profile shows `🏫 Class 10-A · Sunrise Public School   (Leave)`. Wrong code: "We couldn't find that class. Check the code with your teacher."

**2. Teacher: Profile → "👩‍🏫 My classes"** (only shown to teachers)
```
┌──────────────────────────────┐   ┌──────────────────────────────┐
│ My classes                   │   │ Class 10-A                   │
│ ┌──────────────────────────┐ │   │ [Kids] [Topics]              │
│ │ Class 10-A · Sunrise     │ │   │ 18 active · 412 answers ·    │
│ │ 32 kids · 18 active today│ │   │ 74% · 3h 10m                 │
│ │ Code K7P-42M  [Share]    │ │   │ (Today)(This week)(All)      │
│ └──────────────────────────┘ │   │ ┌──────────────────────────┐ │
│ ┌──────────────────────────┐ │   │ │ Aarav S.          2h ago │ │
│ │ Class 10-B · Sunrise     │ │   │ │ Unit 1 · 3/6 · 81% · 25m │ │
│ │ 29 kids · 4 active today │ │   │ │ ⚠️ pronouns 🔧 4 mistakes│ │
│ └──────────────────────────┘ │   │ └──────────────────────────┘ │
└──────────────────────────────┘   │ ...          [⤴ Share CSV]  │
                                   └──────────────────────────────┘
```
- **Kids tab** = today's admin Kids tab, limited to this class. Tap a kid → today's kid detail page (unit dots, week + all time, weak topics, last 10 activities with score and pass/fail) plus **"Remove from class"**.
- **Topics tab** (new): the class's weakest topics first, e.g. `pronouns · 58% · 120 answers`. Tells the teacher what to re-teach.
- **Share CSV:** one row per kid (name, unit, topics cleared, answers, accuracy, time, weakest topic) through the phone's share sheet (WhatsApp, Gmail, Drive). Plain text, no new native module.
- **Gate and Boss questions are never shown,** only the score and pass/fail.

**3. Admin: 📊 Dashboard → new "Schools" tab**
```
┌──────────────────────────────┐   ┌──────────────────────────────┐
│ [Kids] [Reported] [Schools]  │   │ Class 10-A · Sunrise         │
│ [ + New school ]             │   │ Code K7P-42M [New code]      │
│ ┌──────────────────────────┐ │   │ Teachers                     │
│ │ Sunrise Public School    │ │   │ • Mrs Rao (rao@…)  [Remove]  │
│ │ Nagpur · 2 classes · 61  │ │   │ [ + Add teacher by email ]   │
│ └──────────────────────────┘ │   │ 32 kids [Open dashboard]     │
│ → classes  [ + New class ]   │   └──────────────────────────────┘
└──────────────────────────────┘
```
The admin's Kids tab gets a filter: `All schools ▾ / school / class`. Cross-school comparisons stay admin-only.

**4. Kid and parent: Profile → "📈 My progress"**
The same kid detail page, showing the kid's own data: units, time this week, topics to work on, practice questions they got wrong (with answers). A parent opens it on the kid's phone. **No parent accounts or linking in phase A** (see question 3).

### Data (Firestore)
| Path | Holds | Who reads / writes |
|---|---|---|
| `schools/{schoolId}` | `name, city, createdAt` | admin only |
| `classes/{classId}` | `schoolId, schoolName, name, code, teacherUids[], teacherNames[], createdAt` | read: admin + its teachers; write: admin |
| `classCodes/{code}` | `classId, className, schoolName, teacherNames` | **get by code** (no listing): any signed-in user; create/delete: admin or a teacher of that class (new code) |
| `classes/{classId}/members/{uid}` | `name, joinedAt, code`, `quests.{questId}: { stats, nodes, mistakeCount }`, `updatedAt` | read: the kid, the class's teachers, admin. Create: the kid, **only with a valid code**. Update: the kid. Delete: the kid (leave), its teacher (remove), admin |
| `users/{uid}/classLinks/{classId}` | `className, schoolName, joinedAt` | the kid only (so the app knows where to copy progress) |

- **Codes:** 6 characters from letters and digits that can't be misread (no 0/O, 1/I/L, 2/Z, 5/S, 8/B), shown as `K7P-42M`. Unique across all schools (one `classCodes` doc each). A teacher can make a new code; the old one stops working.
- **Progress copy:** after each save the kid's app already writes `questProgress` (progress + `stats`). With this change it also writes the same summary into each of the kid's class member docs (`updateDoc`, never `setDoc`). `stats` gains `recent`: the last 10 activities (title, score, passed, ⭐, time). **No question text.**
- **Why a copy, not a rule on `questProgress`:** Firestore rules can't check "is this kid still in my class" inside a teacher's list query. With the copy, a teacher reads only `classes/{theirClass}/members`, so isolation is one simple rule. Removing a kid deletes the copy, and the kid's next `updateDoc` fails, so it can't silently come back. The kid's app then deletes its `classLinks` doc and shows "You're no longer in Class 10-A".
- **Teachers who play the quest** aren't class members, so other teachers never see their stats. Owner rule kept: only the teacher and the admin see them.
- **Not shown to teachers:** `questAttempts` (no rule change). The teacher's kid detail uses `recent` from the copy.

### Rules sketch (deploy by devops)
```
function teaches(classId) {
  return request.auth != null &&
    request.auth.uid in get(/databases/$(database)/documents/classes/$(classId)).data.teacherUids;
}
match /schools/{id}      { allow read, write: if isAdmin(); }
match /classes/{classId} {
  allow read: if isAdmin() || teaches(classId);
  allow write: if isAdmin();
  allow update: if teaches(classId) &&                         // teacher: new code only
    request.resource.data.diff(resource.data).affectedKeys().hasOnly(['code']);
  match /members/{uid} {
    allow read: if isAdmin() || teaches(classId) || request.auth.uid == uid;
    allow create: if request.auth.uid == uid &&
      get(/databases/$(database)/documents/classCodes/$(request.resource.data.code)).data.classId == classId;
    allow update: if request.auth.uid == uid &&
      request.resource.data.code == resource.data.code;        // can't swap the code
    allow delete: if isAdmin() || teaches(classId) || request.auth.uid == uid;
  }
}
match /classCodes/{code} {
  allow get: if request.auth != null;
  allow list: if false;
  allow create: if isAdmin() || teaches(request.resource.data.classId);
  allow delete: if isAdmin() || teaches(resource.data.classId);
}
match /users/{userId}/classLinks/{classId} { allow read, write: if request.auth.uid == userId; }
```
No new indexes (only single-collection reads).

### Cost (1,000 kids, 30 classes)
- Kid: +1 write per finished activity per class, +1–3 reads when the app starts. Roughly 10 activities a day comes to +10,000 writes/day, inside the free tier.
- Teacher: 1 read per kid each time the dashboard opens (32 for a class). Pull to refresh, no live listeners.

### Effort and timing
- About 2–2.5 days of app code, plus rules (deploy by devops) and a QA pass with two test accounts (teacher + kid). **Needs an app build.**
- **Recommendation: the first update after Nov 10, not the Nov 6 build.** It touches the kid's save path, which broke once already (Finding 19). It deserves its own QA round.

### Questions for the owner
1. **More than one class per kid?** (school class + tuition class). Proposed: yes, up to 3. The data allows it at no extra cost per class.
2. **Who sets things up?** Proposed: only the admin (you) creates schools, classes and adds teachers by email (the teacher signs in once first). Teachers can only make a new code and remove kids. The school-admin role comes in phase B.
3. **Parents in phase A = "📈 My progress" on the kid's own account** (no parent sign-in or linking). Most kids use a parent's phone anyway. Linked parent accounts later, only if parents ask. OK?
4. **Name teachers see:** the kid's Google name for now. The teacher can't rename kids in phase A. OK?

## 2026-11-04 — Branch `feat/nov6-improvements`: fixes + Unit 2 content (Claude)
Off `feat/tile-quests`. Nothing goes into 20.0.24. The owner picks stable parts for the Nov 6 build. `npm test` (14 suites) and the bundle pass. Not device-tested: the emulator froze ("System UI isn't responding").

**Needs an app build:**
- `807d65b`: `.exists()` checks (WordInspector, Profile; a missing doc crashed), Finding 21 (90px under the map while My mistakes shows), Finding 20 (Unit 0 answers count under their topic on the Dashboard).
- `88d73e6`: read-aloud fills both blanks for answers like "an, a".
- `b5ef2fb`: **[MEDIUM, in 20.0.24]** My mistakes never cleared gate mistakes in sub-topics with no tagged practice question (Adjectives "identify", all Adverbs, Prepositions place/time/direction, all Conjunctions). The map count stayed forever. Fix: fall back to any practice question of the branch. Also a content test so new units can't repeat it.
- `2e0cc28`: **[HIGH, owner report, in 20.0.24]** Reading: options were white-on-white in dark mode and **the right answer was always first** (never shuffled). Fix: theme colours, bigger options, mixed order. New word popup: dark backdrop, big word, 🔊 Hear it, Got it.

**Content only (re-seed, works in 20.0.24):**
- `62db183`: two wordings ("Which is a PROPER noun?", "Which words need a capital letter?").
- `b5ef2fb`: Adverbs practice quiz tagged by sub-topic (My mistakes works for Adverbs after a re-seed).
- `2e0cc28`: the seed button stores Reading options mixed. **Re-seeding fixes "first option always right" for 20.0.24 too** (the colours need the build).
- `ea4bac8`: **Unit 2 Articles & Determiners** (owner to review the questions before seeding): 3 topics, each with a Learn page, a practice quiz, a harder practice, a gate pool of 15 and Keep practising; reading "The rooftop garden"; Boss (12 questions, Gremlin story). Unit 3 shows Coming soon. 105 new questions.

**Seeding note:** the seed must run from an app build that has this branch's `data/englishQuestData.js` and seed button (the dev build on the emulator), as before.

**Cost note (owner: ~₹5/month with no activity):** no scheduled functions are deployed, and idle v1 functions cost nothing. The likely cause is storage of the functions' build images (they pile up with every deploy). Check: Cloud Console → Billing → Reports, group by SKU. If it's Artifact Registry / Container Registry storage: `firebase functions:artifacts:setpolicy` (devops) keeps only recent images. Removing unused endpoints simplifies things but saves almost nothing on cost.

### DR-7: clean up old function images (cost, owner 2026-11-04)
- **Why:** October cost ₹5.91 with almost no use. The billing forecast for November is ₹10.73 (actual so far ₹0.00). Likely Artifact Registry storage of function images, which pile up with every deploy (free tier 0.5 GB).
- **Confirmed (owner's billing report, October):** the whole ₹4.82 is **Artifact Registry Storage** (1 GiB-month). Every other SKU (Firestore, Functions, Storage, Remote Config) is ₹0.00. Free tier is 0.5 GB, so cleaning up brings it to ₹0.
- **If it's Artifact Registry storage (Gemini):** `firebase functions:artifacts:setpolicy --project apprec8-ca229 --days 1`. Deletes images older than 1 day automatically. Deployed functions keep running; a rollback just rebuilds. No app change.

---

## 2026-11-04 — Plan to Nov 19 (owner decisions): exams + app refinement
**Goals:** Pratha does well in **IEO (Nov 17)** and **NSO (Nov 19)** using the app; refine the whole app piece by piece over ~5 days, defensively (old app versions and old content keep working). Claude's tokens are scarce: **Gemini takes content and QA, Claude takes code.** Roles: `docs/TEAM.md`. Content rules: `docs/CONTENT_GUIDE.md`.

### Gemini tasks (in order)
1. **DR-7** (cost, now): `firebase functions:artifacts:setpolicy --project apprec8-ca229 --days 1`. Then check Billing → Reports in a few days: Artifact Registry Storage should drop under the free tier.
2. **Answer-key review of Unit 2** (`ea4bac8`, `data/englishQuestData.js`, search "Unit 2: Articles"): 105 questions. Per question: exactly one correct answer, no other option also correct, true facts, clear explanation. Write findings here. **Pratha doesn't review it** (gates/Boss are her real tests); she plays it after seeding.
3. **QA of `feat/nov6-improvements`** on the emulator, **in dark mode and light mode** (`adb shell cmd uimode night yes|no`): Reading (options readable, right answer not always first, word popup + 🔊 Hear it), My mistakes from an Adverbs gate mistake (now clears), map with My mistakes button (Finding 21), Dashboard topic rows for Unit 0. The emulator froze twice for Claude ("System UI isn't responding"): try a cold boot (`-no-snapshot-load`) and close other heavy apps.
4. **After the owner's OK: merge `feat/nov6-improvements` → `feat/tile-quests` and seed** (Profile → Update English Quest). This also mixes Reading options for 20.0.24 phones and fixes the two question wordings.
5. **Exam pattern notes** when the owner shares the sample papers (Class 3–6): `docs/exam/ieo-pattern.md` and `docs/exam/nso-pattern.md`: sections, question types with a made-up example of each, topics per class, and a **gap list** (what English Quest already covers vs missing). Patterns only, no copied questions.
6. **Write new English Quest units** from the gap list, per `docs/CONTENT_GUIDE.md` (Unit 3 Subject-Verb Agreement is next on the map). One branch and one content review request per unit; Claude or the owner is the second reviewer.
7. **Audit the old IEO and NSO quizzes** Pratha may use before the exams (Study tab): list wrong answers here (quiz id, question, why). Known: `4ieo11-topic8-quiz4` answer doesn't match any option; `4ieo9-quiz`, `tenses-boss-1`, `tenses-boss-1-quiz` have no questions.

### Claude tasks (code)
1. **Nov 6 build** from what the owner picks on `feat/nov6-improvements` (after Gemini's QA).
2. **App refinement, one piece at a time, each with a mockup for the owner first:** (a) quiz screen (bigger, readable options) + a sweep for hard-coded colours that break dark/light mode; (b) Home + tabs (study items on Home, the rest in a Fun tab, Study tab removed); (c) Profile cleanup + Stats as the tracking screen (merge the Dashboard; RB-2 teacher view goes here later); (d) English Quest tile image; (e) remove unused functions (keep the callables older app versions use). **Defensive:** old screens keep working until the new ones are QA'd; no data migrations.
3. **Vocabulary and NSO (after the exam pattern notes):** a vocabulary format (Word Bank or vocabulary units in English Quest) and a **Science Quest** for NSO. Today the code assumes one quest (`english-quest` in the Dashboard and seed button), so a second quest needs code first.

### Owner
- Share the sample papers (Class 3–6, IEO + NSO).
- OK Unit 2 after Gemini's review; pick what goes in the Nov 6 build; approve each mockup.
- Upload builds, Remote Config, decide on RB-2's 4 questions.

---

## 2026-11-04 — Review request: quiz redesign — branch `feat/quiz-redesign` (Claude)
Off `feat/nov6-improvements`. Mockups approved by the owner (canvas "Apprec8 Quiz Screen Mockups"). **Needs an app build.** `npm test` (15 suites) + bundle pass. **Not seen on a device:** the emulator didn't boot here (10+ min), so Gemini's QA is the first visual check.
- `12a8423` Quiz screen (`QuizScreenV2`): big answer cards with letter badges; **2×2 tiles** when all answers are short (≤12 characters); **Chamak** mascot + speech bubble; instruction label ("FILL IN THE BLANK"); the chosen word shows inside the blank; gold progress bar, hearts; CHECK → green/red sheet slides up with the explanation; right answer pops, wrong one shakes. Plain-text explanations show in the sheet ("CONTINUE"/"GOT IT" goes to the next question); **explanations with a picture or fun fact (Space quiz) show "SEE WHY"** and open the old Explanation screen. One light + one dark palette (`components/quiz/quizPalette.js`). Keep practising uses the new answer cards.
- `9b5f29c` Results screen: Chamak cheering, 1–3 stars from the score, coloured result tiles, gate topics as a checklist, "questions to practise" card, big buttons. Same params for every caller.
- **QA please (light and dark, `adb shell cmd uimode night yes|no`):**
  1. English Quest practice quiz, Training: tap an answer → it's highlighted and fills the blank; CHECK → sheet with explanation; right = pop, wrong = shake + hearts −1; CONTINUE → next question. Nothing cut off, sheet never hides the right answer (scroll if needed).
  2. Short answers (Unit 2 "A and an" after seeding, or any a/an question) → 2×2 tiles.
  3. Exam mode: tap = answer + next; bookmark; review list readable; Submit.
  4. Space quest quiz: SEE WHY opens the Explanation screen with its picture; back to the next question.
  5. Out of hearts screen; results screen (stars, tiles, buttons, close X); 🔊 listen buttons on practice.
  6. Old V1 quiz (IEO from the Study tab) still plays.

---

## 2026-11-04 — Home + tabs redesign: decisions so far (owner + Claude)
Canvas "Apprec8 Home & Tabs Mockups" (Home light/dark, Fun). Not built yet; Progress and Me mockups come next.
- **Tabs:** Home · Fun · Progress · Me. Study and Quest tabs go away; their content moves to Home (quests, Olympiad practice) and Fun (stories, books, thought of the day, games). **Implementation:** the selected tab is highlighted from the navigator's real focus state (the mockup's tab bar was static).
- **Home is one vertical scroll,** most important first and above the fold: reminders/countdown → Continue → My mistakes → quests → Olympiad practice.
- **My mistakes tile** = the kid's own wrong answers ("My mistakes" list in their quest progress), same as the map button; tapping it opens the practice that clears them. Today it covers English Quest; other quests add theirs later.
- **Reminders carousel (owner idea):** kids add their own reminders (up to 5 active), shown on Home as a carousel that moves by itself and can be swiped; the next 3 by date show, exam countdowns included. **Reuse the existing Tasks feature** (`tasks` collection: `userId`, `title`, `dueDate`, `completed`; `store/tasks-context.js`, `screens/task/`), today hidden in Profile. Reminders are in-app only (no phone notifications: that needs a native library, later).
- **Open owner questions:** exam dates set by us in Remote Config? daily goal = topics, minutes or activities? My Classrooms on Home only for kids in a class; Popular Reads → Fun, Popular Quizzes → Olympiad practice?

## 2026-11-04 — Home + tabs redesign: step 1 built (Home + tab bar), branch `feat/quiz-redesign` (Claude)
Owner approved the mockups (A–F) and the order: 1 Home + tabs, 2 Progress, 3 Me, 4 Reminders.
- **Tabs:** Home · Fun · Progress (old Stats) · Me (old Profile). Route names unchanged (`Apprec8`, `Stats`, `Profile`).
  Study tab removed: its screens moved into the Home stack (`navigation/HomeNavigator.js`). Space quest = hidden tab `Quest`
  (opened from Home), so `navigate("QuestMap")` still works; the Quest Mode (V2) switch no longer hides it (switch removed in step 3).
- **Home** (`screens/home/HomeScreen.js`): greeting + streak (from English Quest `stats.daily`) + stars (`users.stats.totalStars`);
  Coming up = `config/exams.js` (IEO 17 Nov, NSO 19 Nov) + the kid's own tasks with a due date (`utils/homeFeed.js`, tested);
  Continue; My mistakes tile (map opens straight into My mistakes via `openMistakes: true`); quests grid; Olympiad practice
  (`olympiad` + `popular_quiz` groups); My classrooms only when not empty. English tile uses a drawn book, not the IEO image.
- **Fun** (`screens/fun/FunScreen.js`): thought of the day, 5 games, Featured, Book Summaries, Popular Reads.
- `TasksContextProvider` moved up to wrap all tabs (Home and Me share reminders). Tile taps share `utils/openCategory.js`.
- Old `screens/quiz/Home.js`, `StudyScreen.js`, `navigation/StudyNavigator.js` are no longer used; delete after QA.
- Checks: `npm test` (16 suites) pass; Android JS bundle builds. Not run on a device yet (emulator froze earlier):
  test list in `docs/qa/OWNER_TESTING.md`. **Gemini:** please QA with that list (inbox G8).

### Step 2 built: Progress tab (Claude)
- `screens/progress/ProgressScreen.js` + `navigation/ProgressNavigator.js` (tab route still `Stats`). Kid view from
  `questProgress/english-quest.stats` (streak, week strip, this week, % right, weak / great topics) + `users.stats.totalStars`.
  Topic names and "cleared / total topics" use the quest content bundled in the app (`data/englishQuestData.js`, pure helpers in
  `utils/progressView.js`, tested): no extra reads. Leaderboard = the old `StatsScreen`, one tap away.
- Admin: "Me / Kids · Reported" switch; Kids = `AdminDashboardScreen` with a new `embedded` prop (Profile's Dashboard button still works until step 3).

### Steps 3–4 built: Me tab + Reminders (Claude)
- `screens/profile/MeScreen.js` (route still `ProfileScreen`): profile card, Reminders, Messages, theme Phone setting / Light / Dark
  (`ThemeContext` gained `themeChoice` + `setThemeChoice`; "system" clears the saved choice), Help, feedback (`cntct`), Admin tools, Sign out, version.
  Old `screens/quiz/ProfileScreen.js` unused (delete after QA). "Join my class" waits for RB-2.
- `screens/admin/AdminToolsScreen.js`: Dashboard link, reset seen pop-ups, the 4 seed buttons (admin only; rules still guard writes).
- Reminders: max 5 active per kid (`utils/reminders.js`, tested; admin exempt), checked in Home, the Tasks list and the editor.
  Task detail is now optional. Home → "+ Add reminder" opens `TaskEditor` inside the Home stack.
- **Not done:** no phone notifications (needs a native library + build); no unread badge on Messages (messages have no read flag).

## 2026-11-04 — Thumb zone + leaderboard names (owner requests), branch `feat/quiz-redesign` (Claude)
- **Thumb zone:** on the quiz screen the free space now goes above the answers (`thumbSpacer`), so options sit just over
  CHECK. Keep practising already worked this way; Reading scrolls to each question.
- **Leaderboard names:** other kids show as first name + class ("Pratha · Class 5"), never last name or email
  (`utils/leaderName.js`, tested). Edit profile has a Class 1–12 picker (`users.grade`, also useful for class-tagged NSO nodes).
  **School is not shown** to everyone: first name + school + class points a stranger to one child in one classroom. Proposal:
  show school only to kids of the same school, once RB-2 exists (school comes from the class join code, not free text).

### DR-8: leaderboard sends first name + class only (devops; owner OK needed)
`functions/callable/userActions.js` → `getLeaderboard` now returns `lastName: null`, first word of `firstName`, `username`
without the email part, and `grade`. Old app versions then also show first names only. Deploy just this function:
`firebase deploy --only functions:getLeaderboard` (after `npm test` + emulator check).

### Finding 22: [MEDIUM] Profile update rule lets a kid change any field of their own user doc
`firestore.rules` → `users/{userId}` → "Profile update" branch checks that the name/photo fields are present but not *which*
fields changed, so a kid could also set `stats.totalStars` (leaderboard) or other fields. Proposed fix (devops, rules deploy):
add `request.resource.data.diff(resource.data).affectedKeys().hasOnly(['firstName','lastName','photoURL','lastUpdatedAt','profileLastSavedAt','grade'])`
to that branch. **Gemini:** before deploying, check no other client write to `users/{uid}` relies on this branch.

**Finding 22 addendum (owner 2026-11-04: fixed info can't be changed by the kid):** also add
`(!('grade' in resource.data) || request.resource.data.grade == resource.data.grade)` so Class is set once. The app already
shows Class read-only once set. First/last name lock comes with RB-6 below (today kids can still edit their name).

## 2026-11-04 — Draft spec (not approved): RB-6 fair leaderboards, friends, perks, fixed info (Claude)
Owner goals: Class 5 isn't compared with Class 10; kids find friends to show off ranks; avatar + display name are perks;
fixed info (real name, class, school) changes only with parent / teacher / admin approval.
1. **Leagues:** default board = same class level, **this week's stars** (Monday reset), you ± 3 around your rank + top 10.
   Tabs: My class level · My classroom (RB-2) · Friends. Server keeps `weekStars` + `weekKey` (recordQuizResult); index `grade + weekStars`.
2. **Friends without search:** each kid has a friend code (e.g. `STAR-4821`) / QR to share in person; the other kid enters it
   and accepts. No name search, no chat; only preset reactions (👏 🔥). Classmates appear automatically via RB-2.
3. **Perks:** avatars and nicknames from preset lists (e.g. "Brave Comet"), no free text, so nothing to moderate.
   Unlocked by weekly goals / streak milestones rather than "stars in one day" (avoids cramming and replay farming).
   Unlocks written by the server only.
4. **Fixed info:** real first name, class and school are set once (at sign-up, or by joining a class with a teacher's code,
   which counts as the teacher's approval). Changes = a request (`profileChangeRequests`) approved by the admin now,
   the class teacher after RB-2, a parent once parent accounts exist; a Cloud Function applies it. Yearly class promotion by the teacher.
Open: parent accounts (how a parent proves they're the parent); whether real first name shows at all once nicknames exist.

### RB-6 update (owner 2026-11-04): parent-first accounts, roles (draft, after the exams)
- **Who signs up:** adults only (18+): parents, teachers, adult learners. No child signs up on their own.
- **Kids:** a parent creates profiles for their kids (parent = account holder and gives consent). Each kid profile is its
  own Firebase user, created by a Cloud Function, so today's per-uid data and rules keep working. Kid signs in on the
  parent's phone (profile picker, optional PIN) or on their own device with a one-time code / QR from the parent. No email needed.
- **Roles** (one person can have several; written by the server only): parent, teacher, admin. Owner = parent + admin;
  a teacher who is also a parent = parent + teacher. Teacher role is approved by the admin (later by a school).
- **Linking:** parents link to kids only by creating them or by claiming an existing kid account with a code shown on the
  kid's device. Teachers never add parents (a teacher could attach the wrong adult to a child); a teacher can send a parent an
  invite. Admin can link by hand for support, logged.
- **Who sees what:** other kids see nickname (+ class level); teacher sees real name + nickname for their own classes only;
  parent sees their own kids; admin sees all.
- **Existing accounts** keep working; a parent claims them with a code. **Before public release:** check against Google Play
  Families policy and India's DPDP Act (consent for under-18s) — Gemini research G11.

## 2026-11-04 — QA run: Quiz redesign (`feat/quiz-redesign`) (Gemini)
Tested on Android Emulator (`Pixel_8a_API_35`) on branch `feat/quiz-redesign` across both Dark and Light modes.

### 1. Visual Verification (Checklist Items 1 & 2)
- **Dark Mode:**
  - 2×2 answer tiles render cleanly for short answers (`≤12` chars) (`qa-screenshots/g8_screen.png`).
  - Active purple selection on tap (`qa-screenshots/g8_opt_tapped.png`).
  - Correct answer sheet: Celebrating Chamak mascot (`😊🙌`), green outline, `✓ Brilliant!`, clear explanation, `CONTINUE` button (`qa-screenshots/g8_sheet_right.png`).
  - Wrong answer sheet: Chamak mascot (`😠`), red outline on chosen option, green outline on correct answer, heart decremented (`❤️ 5` -> `❤️ 4`), clear explanation, `GOT IT` button (`qa-screenshots/g8_sheet_wrong.png`).
- **Light Mode:**
  - Switched in-app theme in `Me` tab (`Look: Light`).
  - High contrast, crisp cards, mascot speech bubble, gold progress bar, hearts counter (`qa-screenshots/g8_light_q1.png`).
  - Option tap highlights card with purple border and activates `CHECK` (`qa-screenshots/g8_light_opt_tapped.png`).
  - Correct answer sheet: Green outline, green check badge, readable text without clipping (`qa-screenshots/g8_light_sheet.png`).
  - Wrong answer sheet: Red outline on incorrect choice ("Hunteress"), correct choice ("Huntress") outlined in green, hearts decremented to `❤️ 4`, `GOT IT` button (`qa-screenshots/g8_light_sheet_wrong.png`).
  - Audio 🔊 button tapped cleanly without crashes.
  - Back button gracefully exits the quiz back to the node details modal (`qa-screenshots/g8_after_back.png`).

### 2. Exam Mode (Checklist Item 3)
- Tested "Gender 2" in Exam mode (`qa-screenshots/g8_exam_start.png`, `g8_exam_q1.png`).
- Hearts counter is correctly hidden (unlimited lives in exam mode).
- Tap-to-advance works immediately: selecting an option immediately logs the response and advances to the next question without requiring `CHECK` (`qa-screenshots/exam_q2.png`).

### 3. Tooling Finding: Why QA Was Stalling in `scripts/qa/eq.sh`
- **Root Cause**: `scripts/qa/eq.sh` relies on `adb shell uiautomator dump` inside `dump()` to resolve button text coordinates.
- On Android 15 (API 35) running React Native, continuous micro-animations and timers (such as Chamak's bouncing animation, shimmering buttons, or progress bars) prevent the UI thread from entering an idle state.
- `uiautomator dump` blocks waiting for idle state and times out after 30–45 seconds with `ERROR: could not get idle state`.
- Because every single `eq.sh tap`, `eq.sh texts`, or `eq.sh wait` command invokes `dump()`, test steps were stalling for 30–60s per interaction.
- **Recommended Action for Claude/DevOps**: Update `scripts/qa/eq.sh` or test harnesses to avoid blocking on `uiautomator dump` when running against React Native screens with looping animations, or add coordinate fallbacks / accessibility-id focused dumping.


### Author Response (Claude) to the QA run, fixed in `0ae2db2`
- **Finding 23 [HIGH] Home "Coming up" card blank** (`g8_light_home.png`, not in the notes above): the card faded out then in;
  if the fade-in never ran it stayed invisible. Now it only fades in from half-visible (can't end invisible).
- **Finding 24 [MEDIUM] Chamak looked angry after a wrong answer** (`g8_light_sheet_wrong.png`): new kind "oops" face.
- **Finding 25 [MEDIUM] Empty "Not quite" sheet** for old questions without an explanation: shows `The answer is "<right answer>".`
- **Tooling (Gemini's finding):** `hooks/useReduceMotion.js` stops looping animations (Chamak, Continue glow, Coming up,
  carousels, loader, looping results animation) when the phone's "Remove animations" is on; `eq.sh prep` / `unprep` / `tapxy`,
  10 s screen-read limit. QA rules added to `docs/qa/QA_PLAYBOOK.md`. Re-test: gemini.md **G14**.
- `qa-screenshots/` is now gitignored (it shows the test account's email and name).

## 2026-11-04 — Review request: multi-quest + class filter + Science Quest draft, branch `feat/quiz-redesign` (Claude)
Owner: "yes" to letting a second quest run like English Quest, with class-tagged topics (NSO, Pratha = Class 5).
Milestones (each pushed): M1–M2 `66e2d83`, M3 `521971e`, M4 docs (this entry).
- **M1 class filter:** `utils/gradeFilter.js` → `nodesForGrade(nodes, grade)` runs before `buildQuestPath` (engine unchanged).
  Nodes may carry `grades: [..]`; hidden topics take their practice/gate/endless along and never block the next topic;
  empty units vanish; no class = nothing hidden; tester "unlock all" = no filter. English has no tags → identical (tested).
  The quest map reads the kid's `users.grade`.
- **M2 several quests:** `data/quests/index.js` lists bundled quests (English, Science). `SeedTileQuestButton` seeds any quest
  (English's button is now a wrapper) and always asks to confirm (draft vs LIVE wording). Draft quests seed their tile to
  `carouselGroup: "quest_draft"`: testers only; old apps never read it. Content test runs per quest + ids unique across quests
  + grade tags valid. Dashboard: English / Science chips. Firestore rules and functions were already generic: **no deploy needed.**
- **Science Quest draft:** `data/scienceQuestData.js`: 1 unit, 1 sample topic "Living and non-living" (Class 3–5: study page
  + 6 questions, written by Claude, needs Gemini's accuracy review), "Plants" teaser.
- **M3 Home + Progress:** Continue = quest played most recently; mistakes tile = all quests (opens the one with most);
  streak/totals across quests; Progress row per quest, counts only the kid's class topics.
- **Not done / next:** class not set → kid sees every class (later: a nudge to set it); Warm-up/Challenge rows for other classes'
  topics (owner's original idea) are not built: v1 just hides them; Endless "generators" are English-only.
- **Checks:** `npm test` (all suites) pass; Android bundle builds. Test list: `docs/qa/OWNER_TESTING.md` → "Science Quest + class filter".
- **Next for Gemini:** G12 Science content (Class 5 first), G13 QA. **Owner:** review at this milestone; approve Science units before `draft: false`.

## 2026-11-04 — Response to Claude & Senior/Junior Collaboration Protocol (Gemini)
Acknowledged Claude's feedback:
1. **Feedback received & internalized:**
   - Great to see the `eq.sh prep` + `useReduceMotion` fix landed in `0ae2db2` to stop animation loops during test automation.
   - Findings 23 (blank Coming up card), 24 (kind 'oops' mascot), and 25 (fallback explanation text) noted. Accuracy in screenshot reporting will be strictly maintained.
   - Commit hygiene: All modified docs and tracking files will be committed together in `gemini:` commits.
   - Strict 2-retry timeout limit adopted.
2. **Execution & Division of Labor (Owner Approved):**
   - Direct Senior/Junior async loop: Claude assigns tasks in `gemini.md` (Inbox) & `CODE_REVIEW.md`. Gemini pulls, executes, updates `CODE_REVIEW.md` / `gemini.md`, commits (`gemini: ...`), and pushes. No manual owner relay needed.
   - Owner granted auto-execution: Gemini proceeds autonomously without seeking confirmation unless modifying production code/rules/deployments.
   - Device QA on emulator paused per owner directive to prioritize NSO Class 5 content delivery.
3. **Active Work Item:**
   - Starting **G12: Science Quest content (Class 5 NSO, 19 Nov target)** in `data/scienceQuestData.js` on branch `content/sq-u1-living-things` per `docs/CONTENT_GUIDE.md` §8.
   - `npm test` will be kept green across all quest schemas, unique IDs, and grade filters before opening the content review request.


## 2026-11-04 — Draft spec (not approved): RB-7 teacher assignments (owner idea) — after RB-2 (Claude)
Owner: let teachers assign specific nodes to students or whole classes, so kids work directly on what's needed (some kids would
take months to get from Nouns to Tenses). Agreed: quests are subject ladders, so "jump to a topic" must be safe.
- **Teacher:** in Progress → Kids (their own classes only), pick a quest node (topic, practice leaf, Challenge or Boss), pick a
  class or some kids, optional due date and note. Stored as `classes/{classId}/assignments/{id}` = { questId, nodeIds[], kidIds[] | all,
  dueDate, note, createdBy }. Rules: only that class's teachers write; its kids read.
- **Kid:** a "From your teacher" card on Home (CONTINUE in the thumb zone, design rule 2) and in Coming up (due date). Assigned
  nodes are **opened for that kid** even if the path hasn't reached them (`buildQuestPath(..., { extraUnlocked })`, pure +
  tested); the normal path still works. The assigned topic starts with its Learn page; if it builds on earlier topics the card
  says so ("Tenses uses Verbs: here's a 2-minute refresher").
- **Teacher sees:** per assignment who has started / finished, scores, and the most common mistakes (from `questAttempts`).
- **Also helps slow kids:** "Test out" (pass a unit Boss to skip what you know) + assignments; optional idea: a "short path"
  where only the main step + Challenge are required and practice leaves stay optional.
- **Order:** RB-2 phase A (schools, classes, join codes, teacher role) → RB-7. Not before the exams.

## 2026-11-04 — Draft spec (not approved): RB-8 kids' well-being + "I need help" (owner idea) (Claude)
Owner: the app should help kids (mental well-being too) even when teachers don't; never depend on teachers doing the right thing.
Product rule from this: **the app teaches and supports on its own**; teacher features make good teaching easier but nothing needs them.
- **Daily check-in** (optional, one tap): mood emoji + 1 short kid-friendly tip (exam nerves, breathing, talking to someone).
- **"I need help" always one tap away** (Me tab + check-in): shows real help immediately: CHILDLINE **1098** (free, 24×7),
  Tele MANAS **14416** (national mental-health line), **112** emergency; how to tell a trusted adult. Tap-to-call.
- **Report a problem to Apprec8** (bullying, feeling unsafe): needs a written **safeguarding plan before launch**: who reads
  reports and how fast, what the law requires (POCSO Act: reporting sexual offences against a child to police is mandatory),
  escalation, privacy of the report.
- **No amateur counselling:** the app points to trained people. Tips and flow reviewed by a child counsellor/psychologist first.
  **Reviewer: Seema** (owner's wife: English teacher, trained psychologist, does counselling). She also helps write the safeguarding plan.
- **Privacy:** mood data is sensitive (DPDP Act); store the minimum, parent consent via parent-first accounts (RB-6), never shown
  to other kids; teachers see nothing individual unless the safeguarding plan says so.
- **Order:** after the exams; mockup + counsellor review + safeguarding plan before any build.

### RB-6 / RB-8 update (owner 2026-11-04): invite-only, parent consent, Seema leads safeguarding
- **Invite-only:** accounts are created by parents (and teachers) with an invite code; no open sign-up. Fewer strangers, calmer
  reviews, simpler moderation.
- **Consent is recorded in the app**, not just managed by hand: when a parent creates a kid profile they accept the terms +
  privacy notice; we store who, when, which version (`consents/{id}`), and the parent can withdraw (delete the kid's data).
- **Play Store:** an invite-only app can still be public on Play: give Google's reviewers a demo invite code + test login in
  Play Console → App access. Apps for children follow the Families policy (data, ads, analytics), and we need a privacy policy
  URL. Gemini G11 researches the exact Families + DPDP requirements.
- **Safeguarding (RB-8):** Seema (psychologist, counsels students, ran her school's first mental-health week, heads its POCSO
  committee) leads the safeguarding plan and reviews the well-being flow.

## 2026-11-04 — RB-2 phase A built: schools, classes, join codes, parent consent (Claude)
Owner decisions: up to 3 classes per kid; a class has several teachers, each for some subjects; owner + Seema (app admins)
and school admins set things up; kids join only via a parent, after consent in English + Hindi.
- Logic `utils/classes.js` (tested): codes without look-alike characters, max 3 classes, teacher → quests by subject, consent
  record (who, relation, language, text version).
- Service `services/classesApi.js`; screens: Admin tools → **Schools & classes** (`screens/admin/SchoolsScreen.js`),
  Me → **My classes / Join a class** (`screens/profile/JoinClassScreen.js`: code → class → consent EN/HI → join).
- Server: `functions/callable/schoolActions.js` → `findUserByEmail`, `assignTeacher` (app admins or that school's admins).
- **Not done yet:** the teacher's view of their class's progress (Progress → Kids, filtered by class + subject), RB-7 assignments,
  weekly class leaderboard + claps, adding Seema as app admin from the app (for now: a `roles/{seemaUid}` doc `{admin: true}`).

### DR-9: deploy rules + functions for RB-2 (owner OK needed)
1. Merge `docs/rules/rb2-classes.rules` into `firestore.rules` (instructions inside; keep a backup) →
   `firebase deploy --only firestore:rules`.
2. `firebase deploy --only functions:findUserByEmail,functions:assignTeacher,functions:getClassLeaderboard,functions:clapForClassmate,functions:approveMember,functions:getLeaderboard`.
3. Create `roles/{SeemaUid}` = `{ admin: true }` in the console (after she signs in once).
Until deployed, the new screens show "permission denied": nothing else changes.

### RB-7 teacher assignments built (Claude, 2026-11-04)
- Engine: `buildQuestPath(..., { extraUnlocked })` opens assigned topics (tested); the rest of the path is unchanged.
- `services/assignmentsApi.js`: `classes/{classId}/assignments/{id}` { questId, nodeIds, nodeTitles, kidIds (empty = whole class),
  dueDate, note }. Teacher: Progress → My classes → a class → **Assign a topic** (quest of their subject, topics for the class level,
  whole class or chosen kids, due date, note; list + remove). Kid: assigned topics open on the map; Home's "Next up" card becomes
  **"From your teacher"** until the due date. Rules for assignments added to `docs/rules/rb2-classes.rules` (part of DR-9).
- Next: the 2-minute refresher hint when an assigned topic builds on an earlier one; weekly class leaderboard + claps.

## 2026-11-04 — RB-6 parent-first accounts built (additive; current sign-in unchanged) (Claude)
- Parent: Me → **My children → Add a child**: first name, class (fixed), consent in English or Hindi (text: `utils/family.js`,
  version-stamped) → server creates the child's account (no email) + user doc `{ firstName, grade, isChild, parentUids }` +
  consent record → shows a **one-time login code** (48 h; Share button). "New code" per child for another phone.
- Child's phone: sign-in screen → **"I have a code from my parent"** → code → signed in as the child (custom token).
- Server: `functions/callable/familyActions.js` → createChildProfile, newChildLoginCode, redeemChildLoginCode (one use,
  transaction), deleteChildProfile (deletes the child's data + account). **Fixed** `triggers/auth.js initializeNewUser`: it
  overwrote the whole user doc and would have wiped a new child's profile; it now keeps an existing doc.
- Not yet: parent seeing a child's progress screen (data is readable after DR-10; screen next), switching between children
  on one phone, invite codes for the Play Store (RB-6 invite-only).

### DR-10: deploy for parent-first accounts (owner OK needed)
1. Rules: `docs/rules/rb6-family.rules` (+ DR-9). 2. Functions: createChildProfile, newChildLoginCode, redeemChildLoginCode,
deleteChildProfile, and the updated initializeNewUser trigger. 3. IAM: the functions' service account
(`<project-id>@appspot.gserviceaccount.com`) needs the **Service Account Token Creator** role (for `createCustomToken`).

### RB-6 update: one phone, several profiles (owner: kids use their parent's phone)
- Parent sets a 4-digit **parent PIN** (Me → Set parent PIN; salted scrypt hash in `parentPins/{uid}`, server-only).
- Me → My children → **Play as <child>**: the server checks the parent link and signs the phone in as the child (no code).
  The child's Me shows **Switch to parent (PIN)**; 5 wrong PINs → 15-minute wait. The login code stays for a child with a phone.
- Functions: setParentPin, switchToChild, switchToParent (DR-10). Rules: `parentPins` server-only (`docs/rules/rb6-family.rules`).

### Child safety (owner 2026-11-04: "how do we know the parent is really a parent?")
No app can prove parenthood; the design makes a liar gain nothing. Built:
- **Teacher approves every class join.** Joining writes a `pending` member (child + parent name/relation); only the class's teacher
  (or an admin) approves via the `approveMember` function, which then adds the class to the child's `classIds`. Class boards and
  claps count approved members only. Rules: members are created `pending`; children write only `pendingClassIds`.
- **No real photos of children to other users:** `getLeaderboard` sends only preset avatars (our avatars bucket, DiceBear); a
  Google photo becomes null (DR-8 deploy).
- Already true: nobody can attach to an existing child (the parent link is made only when the parent creates the child); no chat,
  messages or free text between users; others see first name + class only.
- Later (public release): parent phone verification (SMS code), DPDP "verifiable consent" (e.g. DigiLocker), safeguarding plan (Seema).

## 2026-11-05 — Draft spec (not approved): Q · Practice paper (exam-style, timed) (Claude)
Why: Pratha's English and Science olympiads are on 17 and 19 Nov. The quests teach topic by topic; nothing lets her sit a
full paper under test conditions (50 questions, 60 minutes, four parts, the last part worth more), and nothing practises
pacing or checking. Mockup: canvas row **Q** (Q1–Q4), https://claude.ai/artifact/DtBmVc472p7WgANEc12YvL.
- **Q1 Start:** English / Science, Paper 1 / 2; parts and counts (Class 5 English: 30 Words & Grammar · 10 Reading ·
  5 Everyday English · 5 Champion ★3 marks; Science: 10 Thinking skills · 35 Science · 5 Champion ★3). "Show the clock" switch
  (default on; off for a nervous child, Seema to advise). Last score. No exam names anywhere.
- **Q2 In the paper:** part name, 12/50, quiet clock, ‹ back, ⚑ mark to check later, NEXT in the thumb zone. No hints,
  no hearts, no read-aloud (it's an assessment).
- **Q3 Check:** grid of 50 numbers (answered / ⚑ / blank); tap one to go back; SUBMIT. At 0:00 it submits by itself.
- **Q4 Result:** marks by part, time used, change since last time; **Practise these next** = the 3 topics with most wrong
  answers, each opening that quest topic (from each question's `topicNode`). SEE ANSWERS shows explanations.
- **Content:** new, unseen, original questions only (never gate/Boss pools): English Paper 1 + Science Paper 1 (50 each),
  Paper 2 later. Same checks as quests (`npm test`, review page, Seema / owner OK, Gemini second review).
- **Build:** JS only (no native, no new library): `screens/paper/` (start, paper, check, result), `data/papers/*.js`, seeded
  like quests (`papers/{id}` + `questions`), results in `users/{uid}/paperResults` (rules: own doc only), answers in
  `questAttempts` with `activity: "paper"` for the dashboard. Cost: 1 read per paper per week (phone copy), 2 writes per paper.
- **Plan if approved tonight:** build 6 Nov → OTA; Papers 1 written 6–7 Nov → review → Pratha plays from ~8 Nov.
- **Open questions:** (1) only for Class 3–5 at first? (2) clock default on or off? (3) show the paper on Home, or inside each quest?
- **Owner 2026-11-05: "excellent" → approved.** Owner's note: two options in a row is also nice → short options sit 2 × 2
  (all four fit), long ones stack (Q2 updated). Claude's defaults for the open questions (owner can change any):
  (1) **Class 5 only at first** (+ testers): the papers are in the Class 5 shape; Class 3–4 papers come later.
  (2) **Clock on** by default, with a "Hide the clock" switch on the start screen. (3) **On Home**, one "Practice paper" tile
  (a paper mixes topics from several quests, so it doesn't belong inside one quest).
- **Built 2026-11-05 (Claude)**, one change from the draft: papers are **bundled in the app code** (`data/papers/`), not
  seeded to Firestore: 0 reads, no seeding, no rules change, new papers ship by OTA. Result = one `questAttempts` doc
  (`activity: "paper"`, existing rules); "Last time" and the paper in progress are kept on the phone. Screen:
  `screens/paper/PracticePaperScreen.js`, logic `utils/paperSession.js` + `utils/paperScore.js` (tests). `draft: true` on
  each paper = testers only until the owner approves the questions. "Practise these next" opens the quest map (not yet
  the exact topic).

## 2026-11-05 — Draft spec (not approved): R · Learn cards, bite-size study pages (owner idea) (Claude)
Why (owner): the Learn pages are long, scrolling walls (e.g. Word Power's first page is two 10-row tables). A Class 5 child
won't read that. Mockup: canvas row **R** (R1–R4), https://claude.ai/artifact/DtBmVc472p7WgANEc12YvL.
- **R1 Card:** one idea per card: emoji, a 3–6 word title, at most ~35 words, 2–3 examples. Sticky-note look on the dark
  theme (the note is the one loud thing). 🔊 reads the card aloud (expo-speech, already in the app). ‹ and NEXT at the
  bottom (thumb zone); swipe works too. Dots show how far.
- **R2 Quick check** every 2–3 cards: one tap question, the answer shows at once, no stars or hearts lost.
- **R3 Treasure Words:** one word per card (emoji, word, meaning, one sentence, opposite if useful); tap to flip.
- **R4 Last card:** "You learned 3 things" + START WARM-UP (the quiz that follows today).
- **Fold, don't delete:** "See all cards on one page" opens today's long page (good for revision the night before).
- **Data:** a new optional `cards: [{emoji, title, text, examples[], check?}]` on the `studyContent` doc. Pages without
  `cards` show exactly as today, so it can roll out page by page. No extra reads (same doc). JS only, ships by OTA.
- **Order of rewriting:** Word Power + Treasure Words first (with spec S), then the English units Pratha uses, then Science.
- **Open question:** should a child be allowed to skip the cards and go straight to the warm-up? (Claude: yes, from R1's
  dots: kids who know it shouldn't be slowed down.)
- **Owner 2026-11-05: approved** ("byte sized and much more interesting"). Decisions:
  - Skip is allowed, **unlocking stays exactly as today**: a topic is done only when its Learn step AND its quiz are done
    (`buildSteps` in utils/questTree.js), so a child who skips can pass the quiz and finish the cards later.
  - Dark theme: dim, muted note tints with light text (R1–R5 updated); pastels only on the light theme.
  - R4 button renamed **TRY 8 QUESTIONS ▶** (the owner didn't know what "START WARM-UP" meant; nor will a child).
- **Media on cards (owner asked):** the app already has `expo-av` (audio/video), `expo-image` (pictures, GIF/WebP) and
  `lottie-react-native` (animations), so no new build. Card fields: `image`, `audio` (a recorded clip, e.g. Seema saying the
  word), `video` (≤ 30 s, our own file, plays muted until tapped, no autoplay). Files on our jsDelivr CDN (rule 1), free.
  **No YouTube on cards**: ads, "up next" videos and links out of the app are not safe for kids. Cost: 0 reads; mobile
  data for the parent, so clips stay small (≤ 3 MB) and load only when the card is shown. Order: pictures + read-aloud
  first (now), recorded audio next (Seema), short clips last (need someone to make them).
- **Built 2026-11-05 (Claude):** `components/learn/LearnCards.js` (shown by Apprec8Reader when a page has `cards`),
  `utils/learnCards.js` + tests. First pages: Word Power "Synonyms and Antonyms" (10 cards, easy → hard; Seema to review the
  words) and every Treasure Words group (generated: a flip card per word, a check after every 4). The map passes the quiz
  size, so the last button says "TRY 8 QUESTIONS ▶" and opens the quiz. Not yet: swipe (buttons only), audio/video.
  Reaches phones after "publish" + re-seeding Word Power and Treasure Words.

## 2026-11-05 — Draft spec (not approved): S · Word ladders: start easy, build up (owner idea) (Claude)
Why (owner): Word Power starts straight with Synonyms & Antonyms at olympiad level (scarce, prudent, opulent, destitute)
for Class 3–6, and Treasure Words' Big Words start with abide, ambush, appall, audacity for Class 4+. No warm-up rung.
- **Word Power:** a new first topic **"Same & Opposite"** (Class 2–5): word twins with everyday words (big/large,
  begin/start, shut/close), opposites (hot/cold, early/late), and un- / dis- opposites (happy/unhappy, like/dislike).
  Then the current topic, re-ordered so its warm-up goes easy → hard, with the hardest words kept for the Mix leaves,
  the Challenge and the Boss. Class 6 doesn't see the first topic (it would only slow them down).
- **Treasure Words:** Big Words groups re-ordered from easiest to hardest (by how often children meet the word), and
  inside each group the easiest words first. Class 4 sees the 2 easiest Big Words groups only; the rest from Class 5.
- **Pratha (Class 5):** nothing she has finished is locked again; progress is kept by node id, and the new first topic
  is placed so her finished topics stay open (Claude checks this on the emulator before seeding).
- Content only (JSON + seeding, no app update), plus the R cards for these pages. Seema reviews the words.
- **Built 2026-11-05 (Claude), Word Power part:** topic "Same & Opposite" (`wp-sameopp`, 7 Learn cards, warm-up 8,
  Twin Words 10, Opposite Words 10, ♾️ practice) for **Classes 2–4 only**. Change from the draft: not shown to Class 5
  (a topic opens only when the one before it is cleared, so showing it to Class 5 would lock Pratha's finished topics);
  Class 5 gets easy → hard through the new Learn cards instead. Checked: Class 5 path unchanged, finished topics stay done.
- **Owner 2026-11-05: re-locking finished topics is fine ("she can work on stuff again, she is quick").** So:
  "Same & Opposite" now for Classes 2–5; Treasure Words Big Words groups re-ordered easiest → hardest (and easiest words
  first in each group; Claude's judgement), Class 4 sees the first two groups only. A finished topic placed after an
  unfinished one shows locked until the earlier one is done (progress itself is kept).

## 2026-11-05 — Fix: login / registration review (owner: "email password flow seems broken") (Claude)
Found and fixed (`utils/authErrors.js` + tests, `hooks/useFirebaseAuth.js`, `AppContent.js`, `screens/auth/AuthScreen.js`):
1. Emails were not trimmed: a keyboard space after the email → Firebase "badly formatted" (checked against the live project).
2. Registration called `mapAuthError`, never imported: every sign-up error crashed silently, nothing shown.
3. Any sign-in in progress swapped the login screen for the full-screen loader: a failed try came back with empty fields.
   Now the full-screen loader is only for app start; sign-in shows a spinner on the button.
4. Raw Firebase messages ("[auth/invalid-credential] …") → short, kid/parent-friendly ones; reset-link success is calm, not red.
5. A disabled button with no reason → a hint line (email format, password length). Dead `screens/auth/authService.js` removed.
Checked, fine: guest mode (public reads only, "Sign Up or Log In" returns to login), child code sign-in, Google path unchanged.
**Open (needs a mockup):** a new email account is never asked for a name or class, so Home says "friend" and class-based
things (practice paper, class topics) stay hidden until Edit Profile. Proposal: a 2-question first-run sheet.

## 2026-11-05 — App popups + login mockups (owner) (Claude)
- **Mockups T1–T5** (canvas row T): login, create account, forgot password sheet, first run (first name + class, or
  parent / teacher), and the app popup. **Login screens wait for the owner's OK** before building.
- **Popups built (owner asked directly):** `components/common/AppDialog.js` (bottom sheet, rules in `utils/dialogButtons.js`
  + tests), `services/dialog.js` `showAlert()` = same arguments as `Alert.alert`. 67 `Alert.alert` calls in 26 files now use
  it; `ConfirmationModal` / `InfoModal` restyled on top of it (they also ignored `confirmText` / `cancelText` / `message`:
  fixed). Falls back to the system popup only before the app has mounted.

## 2026-11-05 — Mix papers + more original papers (owner: "far more practice papers… no dearth") (Claude)
- **Mix papers** (`data/papers/mix.js`, tests/mixPaper.test.mjs): unlimited papers in the Paper 1 shape, built on the
  phone from quest questions (already reviewed). Never Challenge / Unit Boss questions (or practice copies of them).
  Classes 3–6; the id `mix-en-g5-3` fixes the paper (resume, review). 0 reads (bundled data). After each finished Mix
  paper the next number appears.
- **Past papers are a guide only** (owner asked about rewording them): rewording is still copying; we take the pattern,
  topics and difficulty, and write original questions.
- **New original papers:** Claude writes English Papers 2–4 (Seema reviews); Gemini drafts Science Papers 2–4 (G35,
  `draft: true`, Claude reviews every question). tests/papers.test.mjs now checks every paper in `PAPERS`.

## 2026-11-05 — Draft spec (not approved): U · Picture questions (owner: "paper has beautiful drawings") (Claude)
Mockups U1–U3 (canvas row U): figure series, label the picture, mirror image. Pictures are line drawings stored inside
the question as SVG text and drawn with react-native-svg (already in the app): no hosting, no downloads, 0 reads, crisp
on any screen, soft colours on the dark theme. Optional `figure` (question) and per-option `figure` (answer tiles, 2 × 2).
Plan once approved: support in the paper screen (and quests later), then ~10 picture questions per new Science paper
(figure series, mirror/water images, counting shapes, plant/body/circuit diagrams). Owner OK'd the rough-sheet tip
("Keep a pencil and a rough sheet next to you"): on the paper start screen, ships with the next publish.
- **Owner 2026-11-05: approved ("looking great. perfect"). Built (Claude):** `utils/figures.js` (shapes + exact turns /
  mirror / water flips as SVG text, colour tokens themed at render), `data/papers/pictureQuestions.js` (18 questions:
  6 figure series, 3 mirror, 2 water image, 3 "same shape, only turned", 4 on a labelled plant), tests/figures.test.mjs
  proves every answer by moving points; a rendered sheet was checked by eye. Paper screen draws question pictures and
  picture answer tiles (fixed A–D order); Science Mix papers get 3 picture questions in Thinking skills. Picture and
  reading questions are not added to My mistakes (it shows text only). Copyright (owner asked): we draw our own; book /
  past-paper images are not used, even tweaked.

## 2026-11-05 — Grammar Pro 1: Tenses for Classes 9–10 (Seema's pilot) (Claude)
Owner: same English Quest; teachers assign topics (assigned topics open, the rest unlock as usual); grammar only, no Class
10 papers. Built `data/englishQuest/units/b1.js` (unitOrder 10, Classes 9–10): Perfect Tenses, Perfect Continuous,
Conditionals, each with Learn cards, warm-up (8), Board Style practice (10), Challenge (15, 3 sub-topics), ♾️ practice,
Boss (12): 111 original questions in the CBSE style (docs/exam/cbse10-english-pattern.md, from 4 board papers + CBSE
competency questions; nothing copied). The "Word Building" teaser is now Classes 1–8 (a coming-soon unit locks
everything after it). Checked: Class 5 path unchanged; Class 10 reaches Grammar Pro after Unit 9; a teacher-assigned topic
opens at once. Seema reviews (review page, code G10-). Next units: Modals, Subject–Verb Agreement + Determiners,
Reported Speech, Passive, Editing.
- **Owner: "Pratha also needs tenses; Class 5 covers them extensively."** Unit 5 had 144 tense questions at Class 3–5 basics.
  Added 4 optional practice leaves for Classes 5–8 (40 questions, Class-5 wording): Tense Detective (find the mistake),
  Was Doing & Will Be Doing, Had Done & Will Have Done, Champion 2: Have Been Doing. Practice leaves never lock anything.
  Grammar Pro stays Classes 9–10 (its frames are teen / board level).

## 2026-11-05 — Product decisions from the owner discussion (no build yet; each needs spec + mockup) (Claude)
1. **Free text:** children get tap-only choices + "ask a grown-up to tell us"; parents/teachers get free text.
   Exception: Pratha (supervised by the owner, long-time tester) gets free text via a per-account flag (not tester mode).
   Lock down the 4 child-reachable boxes first: 🚩 report, feedback button, contact form, reminders.
2. **Hindi is key for parents.** Parent-facing layer bilingual first (weekly summary, parent guides, consent already EN/HI);
   kids' learning content stays English. Translations reviewed by a person, never machine-only.
3. **Parents are the lever** ("kids are great, crushed by parents' pressure"): a Parents' Corner (short Hindi/English
   cards by Seema: exam pressure, comparison, praising effort, screen time, Family Link setup, reading the summary) and
   one parenting tip inside each weekly summary.
4. **Consent by parents, work by teachers:** parents consent (school form + in-app record), teachers do setup/onboarding.
5. **Weekly summary that comes to people** (free app notifications): parents (Sunday) and teachers (Monday "3 things");
   usable in quarterly PTMs as proof of what was taught and practised. Owner OK'd the weekly server summary (a week is the
   minimum window for useful data).
6. **Detailed explore dashboard = premium, ~6 months out**, once there is traffic. Now: details for Pratha (owner).
7. **Value check before building dashboards:** Demo School with fake accounts + 2–3 sketches → Seema: "what would you do
   on Monday because of this?"
8. **Guide quests** (kids / parents / teachers, 4–6 cards each, "What's new" card per release) and **feedback polls**
   (tap-only, results only as totals).
9. **Link an existing child account to a parent** (Pratha has a year of progress on her own account; today the app can
   only create new child profiles): needs a small server function with both sides confirming.
10. **Apprec8 Challenge, our own olympiad (owner idea, later; after Seema's pilot):** a month-long **qualifier at home**
    (ranked on accuracy over many attempts, never one paper) → a **1-hour final on a Sunday morning in the school hall**,
    teacher present. Rewards: certificates, medals and free premium access; scholarships only after one season, with
    written rules. Needs new server work for the final: questions sent only at the start time (not bundled in the app),
    server-side marking, one attempt per child, fixed time window, results per school. First run inside Seema's school.
    **Winners' privacy (owner agreed):** by default show only first name + initial, school and class (no photo). Full
    name / photo only if the parent ticked "Show my child's name and photo if they win" in the parent consent. Schools
    announce winners on their own pages under their own consent. Rules page published before the qualifier starts.
    **Parent reports (owner, 2026-11-05, mockups V1–V6):** weekly = "<Name>'s weekly report is ready"; tip line =
    "Seema's suggestion" / "सीमा की सलाह". **Daily report = premium** (V6: today's time, questions, accuracy, sessions,
    one real mistake, tomorrow's 15 minutes, a calm bedtime note). Goes to the parent only, never pushed to the child.
11. **Pricing shape (owner, 2026-11-05):** learning free for every child (quest, practice, papers, mistakes, weekly
    report); premium = extra depth for adults (daily report, history, PTM view); schools pay per student, never kids;
    no ads, no data selling, no dark patterns. Year 1: **₹99/year "founding family" price, locked for life** (later
    price can rise without upsetting early supporters). **"One pays, one learns":** each paid year sponsors a free
    premium year for a government-school child; show the real count in the app; promise it only if we do it. Later,
    olympiad fees cover costs. Needs (after the pilot + daily report): Google Play Billing (native build; Google keeps
    ~15% of subscriptions; check GST with a CA), a `premium` flag checked on the server, a sponsored-kids counter.
    **Proposal (Claude, owner to confirm):** price lock = *as long as the subscription continues* (Play keeps legacy
    prices), not lifetime (unknown future costs). Founding window: first 1,000 families or 31 Mar 2027, whichever first;
    no countdown timers. Supporter tiers, same features: Family ₹99 (sponsors 1 child) · Supporter ₹299 (3) · Champion
    ₹499 (5). Price check with Seema's pilot parents: 4 questions (too cheap to trust / bargain / getting expensive /
    too expensive) + count real payments. Payment screen needs a mockup first.
    **Parked until after the pilot (owner, 2026-11-05).** Sponsorship must give real value: since learning is already
    free, a sponsored seat = a government-school class getting the teacher tools + reports free, and later free entry to
    the Apprec8 Challenge, given through a teacher/headmaster or an NGO with a school code (start with one school near us).
    At the end of the pilot ask parents (owner): "Would you like to sponsor a child's learning?" and explain how it
    works; share more only with those who say yes. No price survey.

## 2026-11-05 — Spec for review: Demo School (fake accounts + demo data) (Claude)
**Spec only, no code yet.** Order: owner answers the questions below → Gemini review → owner go-ahead → build.

**Why:** (1) Seema and the owner see the teacher and parent screens (and later the weekly/daily reports, mockup row V)
with realistic data, without touching real children; (2) a login for Google Play reviewers; (3) safe testing for
Claude and Gemini.

**What gets created (all marked `isDemo: true`):**
- School **"Demo School (not real)"**, two classes: **10-B English** (32 kids, Seema's pilot shape) and **5-A** (12 kids,
  Pratha's shape, English + Science).
- **3 real logins** (Firebase Auth, emails on the reserved `@example.com` domain, which can never belong to anyone):
  `demo.teacher@example.com` (teacher of both classes), `demo.parent@example.com` (parent of one demo child),
  `demo.kid@example.com` (a Class 5 kid). The owner types the password in Admin tools; it is never in the repo.
- **The other 43 kids are data only** (user doc + progress + attempts, ids `demo_kid_01…`, no login), with clearly
  made-up first names.
- **6 weeks of made-up attempts with patterns the screens should catch:** one topic most of 10-B gets wrong (reported
  questions), 3 kids who need attention (failed a challenge twice / 9 days away / accuracy dropping), an assignment
  part done, a kid ready for harder work, normal ups and downs.

**Kept apart from real data:**
- Global leaderboard (`getLeaderboard`): skips `isDemo` users (reads a few extra rows and filters).
- Admin Kids view / dashboard (`listKidProgress`): hides `isDemo` kids unless "Show demo" is on.
- Real kids can never join a demo class (`joinClass` / `approveMember` refuse it unless the user is demo or a tester).
- Demo attempts never count in 🚩 tallies or any metric.

**How:** an admin-only Cloud Function `seedDemoSchool` (creating logins needs the server; maxInstances 1), started
from Admin tools → "Reset Demo School" (deletes the old demo data, then seeds it again, so it can be refreshed weekly
to keep dates recent). The data generator is a pure function in `utils/` with tests (patterns present, every doc
has `isDemo`, no real email). Deploy by Gemini/owner (Claude does not deploy).

**Cost:** one-time about 2,000 writes per reset (the free tier is 20,000 a day); afterwards demo screens read like a
normal class. No running cost.

**Questions for the owner:**
1. Classes OK: 10-B English (32) + 5-A (12)? 2. Names: made-up Indian first names + initial (e.g. "Aarav S.")?
3. The demo parent sees one Class 5 child, so the parent screens look like Pratha's? 4. Weekly reset, or only when we press it?

**Owner answers (2026-11-05):** 1 yes (10-B English 32 + 5-A 12) · 2 yes (made-up first name + initial) · 3 yes (demo
parent sees one Class 5 child) · 4 Claude's call, chosen: **a scheduled function adds one new week of demo activity
every Sunday at 7 pm IST and drops the oldest week** (keeps 6 weeks; about 350 writes a week, inside the free tier;
Cloud Scheduler's 3 free jobs cover it), so Monday's teacher card and Sunday's parent report always show a live-looking
class, like real use. "Reset Demo School" in Admin tools stays for a full reseed. Seema liked mockup row V.
**Build plan:** pure generator `utils/demoSchool.js` + tests first (no live effect); the function, the filters and the
Admin button after Gemini's G38 review; deploy by Gemini/owner.

## 2026-11-05 — Mockup for review: Guide quests, learn by doing (row W) (Claude)
Owner and Seema want to learn the dry run (A3) by doing. **Me → Guides**: "Set up a school" (admin, 5 steps: create
school → create class → invite teacher → approve teacher → join as a test student), "Start your class" (teacher, 5:
join as teacher → share code → approve students → assign a topic → see progress), "For parents" (4), "Your first day"
(kids, 4). Each step opens the **real screen** with a guide strip saying what to tap (W3) and **ticks itself from real
data** (school exists, class exists, members approved, assignment exists), then shows the next step (W4). No fake
screens, no extra reads beyond what those screens already do (the checks reuse the data the screen loads).
**Owner approved (2026-11-05):** guide quests row W, the "Need help?" sheet with the current wording (row P), Play
Console plan (docs/release/PLAY_CONSOLE.md: pilot on internal testing now, closed test in parallel for the 12/14 rule).

## 2026-11-05 (night) — Review request + Deploy request DR-16: Demo School (Claude)
Owner: "keep building" (night of 5→6 Nov). Built to the spec above; Gemini's G38 now reviews spec **and** code.
- `utils/demoSchool.js` (generator, pure) + `tests/demoSchool.test.mjs`: 2 classes, 44 kids, 6 weeks from real quest
  questions; patterns checked by tests. Only the login kid (Riya) has global stars; others keep `demoStars`.
- `functions/utils/demoShift.js` + `tests/demoShift.test.mjs`: server-side checks (only `demo_` ids in 8 allowed path
  shapes, `isDemo: true`, ≤ 3,000 docs, no `classCodes`), ms → Timestamp (incl. `nodes.*.lastPlayedAt`), weekly shift.
- `functions/callable/demoActions.js`: `seedDemoSchool` (admin only; deletes old demo data with recursiveDelete on
  `demo_` ids only; bulk writes; creates/updates the 3 @example.com logins with the admin's password, never stored)
  and `shiftDemoSchool` (Sundays 19:00 IST; ~1,100 writes). maxInstances 1, 512 MB, 300 s.
- `functions/callable/userActions.js` `getLeaderboard`: reads topN + 5 and drops `isDemo` users.
- `services/adminApi.js` `listKidProgress`: drops `demo_` uids (owner's Kids view stays real-only).
- Admin tools → **DEMO SCHOOL** card: password field + RESET DEMO SCHOOL (confirm dialog).

**DR-16 (owner OK needed, then Gemini deploys):**
`firebase deploy --only functions:seedDemoSchool,functions:shiftDemoSchool,functions:getLeaderboard,functions:onQuestionReported,functions:approveMember --project apprec8-ca229`
(the scheduled one enables Cloud Scheduler: 1 job, inside the 3 free jobs). Then the owner: Admin tools → Reset Demo
School with a password → logins for Seema's tour and Play Console "App access".
**Rules check for Gemini:** the demo teacher must be able to read members + questProgress of the demo classes under
the live DR-9 rules (members are written `status: "approved"`), and the demo parent must read `users/demo_kid_login`.
## 2026-11-05 — Review: Demo School spec (Gemini)
**Scope:** Architecture, security, and isolation review of the Demo School spec against current production code in `functions/`, `services/`, and `firestore.rules`. No code changes in this task.

### 1. Global Leaderboard (`getLeaderboard` & `getCurrentUserRank` in `functions/callable/userActions.js`)
- **`getLeaderboard` Leak:** The current query is `usersCollectionRef.orderBy("stats.totalStars", "desc").limit(topN)`. There is currently no `isDemo` filter.
  - *Buffer & Filter limitation:* The spec suggests reading extra rows and filtering in memory. With 44 demo kids, if demo kids are seeded with high stars (simulating 6 weeks of active play), a small buffer (e.g. `topN + 10`) is completely insufficient: demo kids could occupy 44 of the top 60 slots, resulting in a leaderboard of only 16 real kids. To guarantee a full 50-kid board, the fetch would need `limit(topN + 45)`.
- **CRITICAL OMISSION in Spec: `getCurrentUserRank`:** Lines 121–128 execute:
  ```javascript
  const rankCountQuery = usersCollectionRef.where("stats.totalStars", ">", currentUserScore);
  const countSnapshot = await rankCountQuery.count().get();
  ```
  Firestore `.count()` aggregates server-side across all matching documents. It cannot be filtered in memory. If 30 demo kids have more stars than a real child, that child's global rank will be artificially degraded by 30 positions.
- **Architectural Recommendation:** In Firestore, documents lacking an indexed query field are automatically excluded from queries targeting that field. If demo user documents **completely omit `stats.totalStars`** (or store demo points in `demoStats.totalStars`), demo kids are automatically excluded from both `getLeaderboard` and `getCurrentUserRank` at the storage layer with **zero code changes to rank counting and zero extra read costs**.

### 2. Admin Dashboard & Progress (`listKidProgress` in `services/adminApi.js`)
- **Collection-Group Read Leak:** `listKidProgress(questId)` queries `collectionGroup(db, "questProgress")` and maps documents directly from `d.data()` without fetching the parent `users/{uid}` doc.
  - If `isDemo: true` is only stored on the `users/{uid}` document, `listKidProgress` has **no visibility** into whether a kid is demo or real.
  - **Requirement:** `isDemo: true` MUST be explicitly written to every `users/{uid}/questProgress/{questId}` document at seed time.
- **Dashboard UI:** `AdminDashboardScreen.js` maps `listKidProgress` directly to the Kids list with no filter. It must filter `!k.isDemo` by default, with a "Show demo" switch for testing.
- **Read Cost:** Collection-group queries read every matching document. Seeding 44 demo kids with 2 active quest progress docs will add 44 reads to every admin quest dashboard load (~88 reads across English and Science). This is acceptable for admin tools, but it is a permanent read overhead while demo data exists.

### 3. Class Joins & Visibility (`services/classesApi.js`, `functions/callable/schoolActions.js`, `firestore.rules`)
- **Real kids joining Demo Classes:** `classesApi.js:findClassByCode` and `joinClass` have no checks for `isDemo`. If the demo classes create codes in `classCodes/{code}`, any real kid who enters the code can submit a join request.
- **Demo kids joining Real Classes:** `demo.kid@example.com` has a live Firebase Auth credential. If someone using that account enters a real class code, `joinClass` will create a join request.
- **`approveMember` Vulnerability:** `functions/callable/schoolActions.js:approveMember` only checks that the caller is a teacher of the class or an admin. It does NOT check whether a real child is joining a demo class, or a demo child is joining a real class.
- **`listSchools()` Leak:** `classesApi.js:listSchools()` reads all `schools` collection documents. "Demo School (not real)" will be returned and displayed in school selection dropdowns for all real users unless filtered out.
- **Recommendations:**
  1. Do not register demo class codes in the public `classCodes` collection, OR add an `isDemo: true` check in `joinClass` and `approveMember` that requires `caller.isDemo === class.isDemo`.
  2. In `firestore.rules`, update `classes/{classId}/members/{kidUid}` create rule to verify caller and target class demo statuses match.
  3. Filter `listSchools()` to hide `isDemo === true` from non-admin users.

### 4. 🚩 Tallies & Safety (`functions/triggers/reports.js`)
- **Auto-Hide Hazard:** `onQuestionReported` triggers on `onCreate` of `userFeedback/{feedbackId}` with `entryPoint: "report_flag"`. If a question receives `hideAt` (3) reports from distinct kids with wrong-answer reports, the function **automatically modifies `quests/{questId}.knownIssues` and hides the question from all real kids across the app**.
- If a tester using `demo.kid@example.com` taps 🚩 during exploratory testing, or if mock reports are seeded into `userFeedback`, it will trigger real question hiding and pollute production `questionIssues`.
- **Requirement:** `onQuestionReported` MUST include an early exit:
  ```javascript
  if (data.isDemo === true || data.userId?.startsWith("demo_")) return null;
  ```
  `seedDemoSchool` must never write documents into `userFeedback`.

### 5. Other Places Reading Users / Attempts
- **`functions/triggers/auth.js:initializeNewUser`:** Fires whenever `admin.auth().createUser()` is called (for `demo.teacher`, `demo.parent`, `demo.kid`). It writes a standard user doc with `stats: { totalStars: 0 }`. The seeder must explicitly set/merge `isDemo: true` and omit `stats.totalStars`.
- **Family Linking:** In `functions/callable/familyActions.js`, parent access to child progress relies on `users/{parentUid}.childUids` containing the child UID and `users/{kidUid}.parentUids` containing the parent UID. For `demo.parent` to view `demo.kid`, the seeder must establish these bidirectional arrays and set `isChild: true` on `demo.kid`.
- **`scripts/admin/backfillQuestId.cjs`:** Uses `collectionGroup("questProgress")`. Safe, but will process demo progress documents.

### 6. Cost, Security & Implementation of `seedDemoSchool`
- **Authorization:** Must enforce `isAppAdmin(context.auth.uid)`. Callable must reject non-admins with `permission-denied`.
- **Concurrency & MaxInstances:** Must specify `maxInstances: 1` to prevent race conditions during resets.
- **Cascade Deletion (Critical):** Firestore document deletion does **not** delete subcollections. Simply deleting `users/{demo_uid}` will leave `users/{demo_uid}/questProgress/*` orphaned in the database, where they will permanently pollute `collectionGroup("questProgress")` queries. The reset routine MUST use `admin.firestore().recursiveDelete()` on all demo user and class document references.
- **Auth User Idempotency:** The reset routine must handle existing Auth users gracefully (e.g. check `admin.auth().getUserByEmail()`, then delete or update password) to avoid `auth/email-already-exists` crashes on subsequent resets.
- **Write/Read Budget:**
  - Seed: 1 School + 2 Classes + 46 Users + 92 QuestProgress + ~400 Attempts + 44 Members = ~600 writes.
  - Reset: ~600 reads + ~600 deletes.
  - Total: ~1,200 operations per reset, well within the Firebase free tier of 20,000 writes/deletes per day.

### Author Response to G38 (Claude, night 5→6 Nov)
1. Leaderboard / rank: **agreed**: demo kids have **no `stats.totalStars`** (stars in `demoStars`), so neither the board
   nor `getCurrentUserRank`'s count sees them; `getLeaderboard` also drops `isDemo` rows. (If the demo kid login plays,
   `recordQuizResult` gives it real stars: the board still drops it; the rank count may move by 1. Accepted.)
2. Kids view: `listKidProgress` drops `demo_` uids (the parent id of each progress doc), and every demo progress doc also
   has `isDemo: true`. "Show demo" switch: not needed: the owner sees the demo class through the demo teacher login.
3. Joins: no `classCodes` docs for demo classes (nobody can find them); `approveMember` (server) and `joinClass`
   (client) refuse demo↔real mixes. `listSchools` is admin-only, where seeing the Demo School is fine. Rules: no change.
4. 🚩: **agreed, fixed**: `onQuestionReported` ignores `demo_` uids; the seeder never writes `userFeedback`.
5. Auth trigger: demo user docs are written before the logins are created, so the trigger only merges `userId`.
   Parent link: `demo_parent.childUids` + `demo_kid_login.parentUids` + `isChild: true`, both ways.
6. Deletes use `recursiveDelete` on `demo_` docs; logins: `updateUser`, falling back to `createUser`.
**DR-16 now also deploys** `functions:onQuestionReported,functions:approveMember`.

## 2026-11-06 (night) — Review: Unit 10 Word Building (Gemini G37), 120 Qs (Claude)
Merged with **19 fixes**: second right answers (loveable, useable are accepted spellings; duteous is a real word;
"admitance" too close to admittance); "the noun of busy is business" (today it's busyness) → laziness; stems where both
options fit (bandage painless/painful; "sudden politeness"); misunderstand/preview stems reworded; "science + ist"
explanation; inpatient trap kept with an explanation; Learn page now teaches il-/ir- (tested in the unit) and that many
words take un-; reading: "solar battery" → a solar panel that charges the battery, "paragraph 0" → "the first
paragraph", "affixes" → plain words; 2 Boss questions repeated warm-ups → angrily, division. Tests pass.
Note: u10 and Grammar Pro 1 share unitOrder 10, but their classes never overlap (3–8 vs 9–10).
Needs: publish + English re-seed (owner).

## 2026-11-06 (night) — Review request + Deploy request DR-17: link a child's existing account (decision 9) (Claude)
Needed for Pratha's parent report (her account has a year of progress). Reuses the Add-a-child / Join-as-teacher look
(no new design); the owner can stop it before publish if he wants a mockup first.
- Parent: Me → **Link my child's own account** → consent (name, relation, English/हिंदी, `LINK_CONSENT_TEXT`, owner
  checks the Hindi) → one-time code (24 h) → share. `createParentLinkCode` refuses child/student accounts, max 6.
- Child (own login, has a class, no parent yet): Me → **Link to my parent** → code → `redeemParentLinkCode`
  (transaction: code unused + not expired, not the parent's own account, not a parent account, not demo) sets
  `parentUids` + `ownLogin: true` on the child, `childUids` + `isParent` on the parent, writes a `consents` doc
  (`kind: "link-existing"`), marks the code used.
- `ownLogin` children: no "Play as" (`switchToChild` refuses) and no delete by the parent (`deleteChildProfile`
  refuses); Me shows "<name>'s week" → Progress → My children.
- Me: "MY CHILDREN" (add a child) is no longer shown to students (accounts with a class); before, Pratha saw "Add a child".
- Not yet: unlinking (write to us for now).
**DR-17 (owner OK, then Gemini):** `firebase deploy --only functions:createParentLinkCode,functions:redeemParentLinkCode,functions:deleteChildProfile,functions:switchToChild --project apprec8-ca229`.
`parentLinkCodes` needs no client rule (server only).

## 2026-11-06 — Plan for owner decision: "Dog Squad" (Pratha's favourite topic) (Claude)
Owner: Pratha's favourites are the dog quiz and Animal Kingdom, especially German Shepherds; use AI tools or the web
for great images. **Idea: use her favourite topic to carry real learning**, not trivia only.
1. **Science (Classes 3–6): "Dog Squad"** unit in the Science Quest: German Shepherds (origin, working dogs in India:
   police, army, rescue, guide dogs), dog senses (smell, hearing) and how they compare with ours, wolves → dogs,
   caring for a dog, and **staying safe around dogs** (approaching a dog, body language, stray dogs, what to do after a
   bite: wash 15 minutes with soap and running water, tell an adult, see a doctor the same day). The safety topic is
   real value for Indian children. Facts come from Gemini's sourced fact sheet (G40, in progress).
2. **English: dog-themed practice**: a reading ("Rex, the police dog") and a Tense Detective set about a German
   Shepherd's day, so grammar practice uses her favourite theme.
3. **Picture questions**: breeds and body language as line drawings (our SVG style, 0 reads), plus 10–20 photos.
**Images, honestly:** AI images often get dogs wrong (extra legs, odd ears), so every AI image needs a check and an
"illustration" label. Free-licence photos (Unsplash, Pexels; Wikimedia Commons with credit) go into `media_backup`
(rule 1), never hot-linked. Copying images from books or random websites is not OK.
**Owner to decide:** (a) Science unit + English set + pictures, or start with one? (b) Classes 3–6? (c) photos,
illustrations, or both? Then a mockup, then building. The old dog quiz and Animal Kingdom stay visible meanwhile.

## 2026-11-06 (night) — Review request + DR-18: build 20.0.30, weekly summary notifications (Claude)
Branch **`feat/push-20.0.30`** (native: not on `feat/quiz-redesign`, so no OTA can reach 20.0.29 phones with it).
- `@react-native-firebase/messaging` 22.2.1; `POST_NOTIFICATIONS`; storage + overlay permissions removed
  (`tools:node="remove"`; nothing used them: the phone lock is screen pinning); white star notification icon.
- `services/push.js`: guarded by `NativeModules.RNFBMessagingModule` (old builds: no-op). Android 13+ permission is
  asked only when an adult taps **Turn on** (`components/push/WeeklyPushCard.js`, on Progress → My children / My classes).
  A tap on a summary opens that Progress view.
- `functions/callable/pushActions.js`: `savePushSettings` (adults only; children never get notifications; ≤ 5 tokens),
  `weeklyParentPush` (Sun 18:30 IST, one per linked child, EN/HI) and `weeklyTeacherPush` (Mon 07:30 IST, one per class);
  dead tokens are dropped. Text = mockup V1 (`functions/utils/weeklyPush.js`, tests/weeklyPush.test.mjs).
- Version 20.0.30 (app.config.js, build.gradle 20003000, strings.xml runtime version).
**DR-18 (owner OK, then Gemini):** `firebase deploy --only functions:savePushSettings,functions:weeklyParentPush,functions:weeklyTeacherPush --project apprec8-ca229` (2 more Cloud Scheduler jobs: with shiftDemoSchool that is 3 = the free limit).
**Release:** Claude builds the `.aab` locally tonight; owner runs `scripts/release/check-aab.sh <aab> 20.0.30`, uploads to
internal testing, tests; then `feat/push-20.0.30` merges into `feat/quiz-redesign` and OTAs go to runtime 20.0.30.

## 2026-11-06 (morning) — owner: publish, deploys OK, dogs hidden too, notes in the app (Claude)
- Old dog/animal quizzes hidden too (owner: they become exploration quests soon); old tiles are now read from Firestore only for the owner.
- `feat/push-20.0.30` merged (owner uploaded 20.0.30 to internal testing). Published: 20.0.29 (`27e55afa`, pre-merge) and 20.0.30 (`56835008`).
- DR-16 + DR-17 + DR-18 approved → Gemini G41 (12 functions, no rules).
- New: Admin tools → **My notes** (owner only): LAUNCH_CHECKLIST + OWNER_TESTING in the app, folded sections, tickable boxes
  (ticks on the phone only). Bundled by `scripts/genOwnerNotes.mjs` before each publish; private emails removed. Not yet published.

## 2026-11-06 — Privacy policy check + Review request + DR-19: delete means delete (Claude)
Owner sent the policy pages (github.com/FailedCommit/app-policies, live at failedcommit.github.io/app-policies/…).
**Findings (Play blockers):**
1. The privacy policy says we collect **only an email** and that the app is **not for children under 13**. The app
   collects names, classes, answers, progress, class lists, consent records, push tokens; it is for children. Google
   checks the policy against the Data safety form and the target audience: this would be rejected.
2. **No way to delete an account in the app:** the Me redesign (2026-11-04) dropped the row; `DeleteAccountConfirmation`
   was unreachable. Play requires in-app deletion. No UI to delete a child profile either (`deleteChildProfile` unused).
3. `requestAccountDeletion` only blanked name + email and deleted the sign-in; answers (`questAttempts`), progress,
   class memberships (with the parent's name), consents, PINs stayed. `deleteChildProfile` left attempts + memberships.
**Built (needs "publish" for the app part, DR-19 for the server part):**
- `functions/utils/eraseUser.js` (+ `tests/eraseUser.test.mjs`, in-memory Firestore): user doc + subcollections,
  questAttempts, class memberships / teacher places, parent PIN, codes, child profiles the parent made (own-login
  children only unlinked; shared children unlinked), parents unlinked, consents kept without `parentName`, 🚩 report text
  kept without name, Auth user. Used by `requestAccountDeletion` and `deleteChildProfile`.
- Me → **Delete my account** (not on "Play as" child profiles); Play-as sheet → **Delete <name>'s profile** (confirm dialog).
- `scripts/admin/eraseAccount.cjs <email> [--apply]` for emailed requests (look-up by default; refuses the owner's account).
- New policy drafts: `docs/policies/privacy-policy.html`, `docs/policies/data-deletion-policy.html` (owner reviews; home
  address left out on purpose, not required for a free app). Upload only after DR-19 is live (they promise full deletion).
**DR-19 (owner OK, then Gemini):** `firebase deploy --only functions:requestAccountDeletion,functions:deleteChildProfile --project apprec8-ca229`.
**Review asked (Gemini, before deploy):** anything per-user that eraseUser misses? Batch limits and the 60 s timeout for big accounts?

## 2026-11-06 — Spec for owner approval: X "a parent says yes" (DPDP consent for students) (Claude)
Owner: "this is priority" (the gap: a child can sign up alone, with no parent's consent). Mockup row X on the canvas.
**Who sees the gate (X2):** a signed-in account with a class (a student) that has none of: `isChild` (a profile a parent
made, consent recorded), `parentUids` (linked to a parent), `classIds` / `pendingClassIds` (joined a class: the parent's
form was filled and a teacher approves). Admin and tester accounts never see it.
**Two ways through, both already built and live:**
1. **Link to a parent** (DR-17): SEND TO MY PARENT shares a WhatsApp message (X3) → the parent installs, signs in,
   Me → Link my child's own account (consent text EN/हिंदी) → a 6-number code → the child types it → X4.
2. **Class code from school**: Join a class (parent's name + relation + tick, EN/HI) → the teacher approves.
**Until then nothing is saved** (DPDP: consent before processing): the gate replaces Home/Quest/Progress; only Need help,
Sign out and Delete my account stay reachable. The sign-in itself (email) can't wait: see cleanup.
**Grown-ups give a year of birth (X1)**, a neutral age screen (Google Families policy): under 18 → the student path. Stops
a child tapping "I'm a parent" to skip the gate. No age is stored, only `grownUpConfirmedAt`.
**Cleanup (DR-20):** a student account still without consent 14 days after sign-up is deleted with `eraseUser`, inside the
existing Sunday job (`shiftDemoSchool` → renamed weekly job), so no 4th Cloud Scheduler job (3 = free limit). Bounded: ≤ 200 per run.
**Existing accounts** get the gate on their next open (all internal testers today). Pratha: link her to you (Me → Link my
child's own account) before this ships, or she sees the gate.
**Later, not now:** server rules that refuse progress writes without consent (today the app enforces it).
**Owner to decide:** approve row X as drawn? Year of birth for grown-ups, or a simpler "I'm 18 or older" tick (easier, but Google prefers a neutral question)?
## 2026-11-06 — Review: DR-19 "delete means delete" (Gemini)

**Scope:** Review of `functions/utils/eraseUser.js`, `tests/eraseUser.test.mjs`, callers in `userActions.js` and `familyActions.js`, `scripts/admin/eraseAccount.cjs`, and policy documents against personal data retention, cross-account deletion safety, scale/timeouts, and policy parity. No code changes or deploys performed.

### Summary of Findings (7 findings: 2 Critical, 2 Medium, 3 Low)

1. **CRITICAL: `childLoginCodes` not deleted when a child profile is deleted (`deleteChildProfile`)**
   - **Code:** `functions/utils/eraseUser.js:97-99`
     ```javascript
     for (const col of ["childLoginCodes", "parentLinkCodes"]) {
       await deleteWhere(db, db.collection(col).where("parentUid", "==", uid)).catch(() => 0);
     }
     ```
   - **Issue:** When a parent deletes a child profile via `deleteChildProfile(kidUid)`, `eraseUser` executes with `uid = kidUid`. The query `where("parentUid", "==", kidUid)` returns 0 results because `parentUid` holds the parent's UID, while the child's UID is in `kidUid`.
   - **Hazard:** Active 6-char child login codes in `childLoginCodes` remain in Firestore. If redeemed via `redeemChildLoginCode`, line 113 creates a custom token (`admin.auth().createCustomToken(kidUid, { child: true })`), which re-creates the deleted child in Firebase Auth and triggers `auth.js:initializeNewUser`, resurrecting the deleted child account.
   - **Fix:** In `eraseUser.js`, also delete where `kidUid == uid`:
     ```javascript
     await deleteWhere(db, db.collection("childLoginCodes").where("kidUid", "==", uid)).catch(() => 0);
     ```

2. **CRITICAL: 60-second function timeout for accounts with thousands of attempts / child profiles**
   - **Code:** `functions/callable/userActions.js:262-264`, `functions/callable/familyActions.js:117-119`, and `functions/common/config.js:5-9`
   - **Issue:** Both `requestAccountDeletion` and `deleteChildProfile` use `runtimeOptions` (`timeoutSeconds: 60`, `memory: "256MB"`).
   - **Hazard:** For a student with thousands of `questAttempts` (e.g. 5,000 attempts = 13 sequential batch reads + batch commits), or a parent whose profile children each have thousands of attempts and subcollections, plus `recursiveDelete` and Auth API calls, the total execution time can easily exceed 60 seconds on standard network latency. Cloud Functions forcefully terminates at 60s, leaving the account in a half-deleted, corrupt state where subsequent retries may fail because the parent document was already removed.
   - **Fix:** Run both `requestAccountDeletion` and `deleteChildProfile` with `longRuntimeOptions` (`timeoutSeconds: 300`, `memory: "512MB"`).

3. **MEDIUM: Pending teacher requests orphaned when an unapproved teacher deletes their account**
   - **Code:** `functions/utils/eraseUser.js:22, 78-83`
   - **Issue:** `plan.teaches` is derived from `user.teachesClassIds`. A teacher who enters an invite code via `redeemTeacherInvite` creates `classes/{classId}/teacherRequests/{uid}` (holding `{ firstName, subjects, code, requestedAt }`). They are NOT added to `teachesClassIds` until approved by an admin.
   - **Hazard:** If an unapproved teacher deletes their account, `plan.teaches` is empty. Their `teacherRequests/{uid}` document remains in Firestore with their first name.
   - **Fix:** Track pending class IDs on the teacher's user document (e.g. `pendingTeacherClassIds`), or inspect/delete pending requests if tracked.

4. **MEDIUM: School admin UID retained in `schools/{schoolId}.admins`**
   - **Code:** `services/classesApi.js:101`, `functions/utils/eraseUser.js`
   - **Issue:** `schools/{schoolId}` stores admin UIDs in `admins: [uid, ...]`. `eraseUser` cleans `roles/{uid}`, but has no reference to clean `uid` from `schools/{schoolId}.admins`.
   - **Fix:** If the user has a school admin role or `schoolIds` array, remove `uid` from `schools/{schoolId}.admins`.

5. **LOW: Class and Global Leaderboard caches retain deleted student's name for up to 10 minutes**
   - **Code:** `functions/callable/schoolActions.js:105-106, 186`
   - **Issue:** `classes/{classId}/cache/board` and `leaderboardCache/top${topN}` hold 10-minute server caches. When a student deletes their account, their member doc is deleted, but the cached board continues to display their first name, score, and avatar until the cache doc expires (up to 10 min).
   - **Fix:** In `eraseUser.js`, when removing a student from `plan.memberOf`, invalidate the class board cache:
     ```javascript
     await cls.collection("cache").doc("board").delete().catch(() => {});
     ```

6. **LOW: Consents cleanup query lacks pagination / loop**
   - **Code:** `functions/utils/eraseUser.js:89-96`
   - **Issue:** While `questAttempts` and `userFeedback` use `deleteWhere` (paginated loop up to `MAX_DOCS`), `consents` uses a single `.limit(200).get()`. If a user had >200 consents across years of activity, records beyond 200 would retain `parentName`.
   - **Fix:** Use `deleteWhere` with an update payload for `consents`.

7. **LOW (Tooling): `scripts/admin/eraseAccount.cjs` does not support deleting profile-only children**
   - **Code:** `scripts/admin/eraseAccount.cjs:14-17`
   - **Issue:** The policy allows parents to request deletion of a child profile by email. Profile-only children do not have an email in Firebase Auth (`getUserByEmail` throws `user-not-found`).
   - **Fix:** Support passing `--uid <kidUid>` directly to `eraseAccount.cjs`.

---

### Answers to Specific Review Questions

1. **Any collection or field holding personal data that `eraseUser` misses?**
   - `childLoginCodes` where `kidUid == uid` (Finding 1).
   - `classes/{classId}/teacherRequests/{uid}` for unapproved teachers (Finding 3).
   - `schools/{schoolId}.admins` for school admins (Finding 4).
   - All other user-identifying collections (`users`, `questProgress`, `quizAttempts`, `questAttempts`, `userFeedback`, `consents`, `parentPins`, `roles`, and Firebase Auth) are properly deleted or anonymized.
2. **Anything it deletes that belongs to someone else?**
   - **Verified SAFE.** Child profiles are only deleted if `ownLogin` is false AND `onlyThisParent` is true. Shared children and own-login children are only unlinked. Classes, schools, questionIssues, and feedback text are preserved.
3. **Batch sizes and function timeout for accounts with thousands of attempts?**
   - Batch size 400 is optimal and well within Firestore's 500-op limit.
   - **Timeout is a hazard (Finding 2):** `runtimeOptions` (60s) is too short for large accounts and multi-child cascades. Must use `longRuntimeOptions` (300s).
4. **Does `docs/policies/privacy-policy.html` say anything the code doesn't do?**
   - **Policy Parity is Strong.** The policy promises full deletion of the sign-in account, profile, progress, answers, stars, class memberships, parent links, PIN, and child profiles, while retaining anonymized consent proof and report text. This matches `eraseUser.js` design, provided Findings 1 and 2 are addressed so deletion doesn't leave active child login codes or time out midway.


### Author Response: DR-19 review (Claude, 2026-11-06)
All 7 accepted and fixed (`functions/utils/eraseUser.js`, tests extended for each):
1. ✅ `childLoginCodes` also deleted by `kidUid` (good catch: a code could have signed a deleted child back in).
2. ✅ `requestAccountDeletion` + `deleteChildProfile` run with `longRuntimeOptions` (300 s, maxInstances 2). Also: every
   step now runs before the user doc + Auth are deleted and errors are no longer swallowed, so a failure leaves the
   account whole and a retry finishes the job.
3. ✅ `redeemTeacherInvite` writes `pendingTeachClassIds` on the teacher's doc, `decideTeacherRequest` removes it; eraseUser
   deletes those requests. (Requests made before this deploy: none in production that matter; pilot not started.)
4. ✅ `schools` where `admins` array-contains uid → removed.
5. ✅ Class board cache of each class + `leaderboardCache/*` cleared.
6. ✅ Consents updated with a cursor (`updateAll`): your suggested `deleteWhere` + update would loop forever, because the
   consent still matches `kidUid` after the name is removed.
7. ✅ `eraseAccount.cjs --uid <uid>` for profile children.
**DR-19 now deploys:** `functions:requestAccountDeletion,functions:deleteChildProfile,functions:redeemTeacherInvite,functions:decideTeacherRequest`.

## 2026-11-06 — Spec X: owner questions (Claude) · waiting for owner decisions
Spec X itself is on `feat/consent-gate`. Owner asked before approving row X:

**Q1. A grown-up who wants to study (e.g. in college) signs up as a student.** Today they'd pick a class and hit
"Ask a parent". Proposal: add a last chip **"College / grown-up"** to the class picker. Tapping it asks the year of
birth (same neutral decade → year screen as parents/teachers). 18+ → no parent needed; under 18 → "Then pick your class
above". Children who pick a class are not asked their year (a Class 1 child may not know it).
Needs: a new user field `adultLearner: true` (+ grade 12 so they see all content), `needsParentConsent` skips it,
firestore.rules allow it (**DR-20 rules**), mockup frame in row X.

**Q2. Mum and dad both want to link.** Already works for a child with their own login: each parent makes a link code,
the child enters both (`parentUids` is a list). A profile child (made with Play as) belongs to one parent: a second
parent can't join it today. Proposal: later ("Add the other parent" code), not a closed-testing blocker.

**Q3. Grandparents / no parent available.** The DPDP Act counts a child's "parent" as parents **or lawful guardian**.
Proposal: every consent line says "I'm this child's parent or guardian"; kid text says "Ask a parent or the grown-up
who looks after you". The grown-up declares it and is responsible for it.
**Q3b. Any grown-up account lets a child use the app on their responsibility.** That already exists: a grown-up signs
in on their own account and adds the child with Play as; making the profile is the consent. Not proposed: a child
using a grown-up's account as themselves (wrong class, adult on child leaderboards, hides that a child uses it).
DPDP Rule 10 (verifiable parental consent) applies from 13 May 2027; Google Play's Families policy applies now.
Check with a lawyer before the public release.

**Also before merging the gate:** the tester account "Sam" (Gemini's emulator account) has no parent and isn't in
`TESTER_EMAILS`, so it will see the gate: link it to the owner's account first (or use it to test the gate).
G45 found one other student without a parent (signed up 2025-04-17). Proposal: don't erase now; after the gate ships
they see "Ask a parent"; erase only if there's still no yes 14 days after the gate ships (owner OK needed).
**Owner (2026-11-06): yes to Q1, Q3 and the name ("say it appreciate").** Built on `feat/consent-gate` (f9729a5):
Q1 needs **no rules change** after all: a "College / grown-up" learner is saved like parents and teachers (no class,
so every quest shows and the gate never applies; the year is checked, not stored). Mockup row X updated (X1, X2, X3,
new X5). Store name changed to "Apprec8: Learn & Grow" (owner: don't box it into two subjects).

## 2026-11-06 — Review request + DR-21: Decisions inbox, guides for everyone (Claude)
Owner (away for days): "implement push notifications and get approval on the app itself … Yes, No, More details,
Later … work on learning guides as much as possible. A great app difficult to use and not intuitive is a waste."
**Decisions inbox (owner only):** Claude writes questions in `docs/agents/decisions.json` → `scripts/admin/decisions.mjs`
(Gemini runs it, `--watch` = every 10 min) creates `ownerDecisions/{id}` and sends one push to the phone saved in
`ownerConfig/device` → the owner taps an answer in **Me → Decisions** (`screens/admin/DecisionsScreen.js`) → the script
copies answers back into the file. Logic: `utils/decisions.js` + `tests/decisions.test.mjs`. Push tap opens Decisions
(AppContent). Cost: ~1,600 reads/day while the watch runs (free tier); FCM is free; no new function, no scheduler.
**DR-21 (rules only):** `ownerDecisions`: owner reads, owner updates only answer/note/status/answeredAt/laterUntil,
nobody creates/deletes (script = admin SDK). `ownerConfig`: owner only. Gemini G46 reviews now; **owner OK given 2026-11-06 ("ok for DR-21", "publish"); deploy
the owner's "ok for DR-21"**, and the app part for the owner's "publish".
**Guides:** three more guides in the approved row W design (`utils/guides.js`): **Tour of Apprec8** (grown-ups, 6
screens, ticks by visiting), **For parents** (4: add child, Play as, their week, Sunday summary), **Your first day**
(children and students, 4: start a quest, finish a topic, fix a mistake, see your stars). Me → Guides now shows for
everyone (children see only theirs; the owner sees all). Data checks reuse reads the target screens already do.
**App map:** `docs/APP_MAP.md`, a 4th tab in My notes.

## 2026-11-06 (afternoon) — Owner answers via the Decisions inbox (Claude)
- **View as: yes** → built "Owner extras" (services/ownerView.js): off hides owner-only UI (old tiles + their reads,
  Fun extras, tester mode, admin guides, Progress → Kids). Permission checks are untouched (display only). Child view
  = Play as a test child profile (exists).
- **Row X learn-first: yes** → mockup X6–X9 on the canvas, approval asked in the inbox. Replaces the blocking gate
  (feat/consent-gate X2) once approved: progress stays on the phone until a parent's yes, then moves to the account.
- **Teachers' one-pager** in the app (data/teacherStart.js, Me → Guides + Admin tools, SHARE for WhatsApp).
- Publishing waits for the owner's "publish" (asked in the inbox).

## 2026-11-06 (evening) — Owner decisions in the chat (Claude)
- **Learn first (row X6–X9): yes, build it.** The old account without a parent: **don't delete**; it becomes
  learn-first (learning only, the rest unlocks when a parent approves). Replaces the blocking gate on feat/consent-gate.
- **Parent says yes from a web link (no app): yes.** Owner: many kids are in other states; parents can't be expected
  to install and understand the app. Plan: the child's "Send to my parent" WhatsApp message carries a one-time link
  (expires in 7 days) to a 1-page form (Hindi / English, read aloud): name, Mother / Father / Guardian, "हाँ, मैं सहमत
  हूँ". A small HTTP function records the consent and unlocks the child. Mockup first (X10–X11), then DR for the function.
- **Row Z and the store text:** owner wants to see them first → review page https://claude.ai/artifact/RwDpduy4VGZTnL7ew5c8eE.
- **Row Y:** folded into the simplicity pass.
- Inbox cards answered in the chat are closed by the sync (`via: "chat"`), G47 restarts it.

## 2026-11-06 (night) — Spec for later: learn first (row X6–X9, owner-approved) + parent web link (approved idea)
Gemini builds after G49 (budget: Claude reviews only). Mockups: docs/mockups/rowX-learn-first/.
- A student without a parent's yes (utils/consent.js needsParentConsent) **learns right away**. Their progress is kept
  **on the phone** (AsyncStorage) instead of Firestore; Home shows the calm "N stars, on this phone only. Ask a parent
  to save them" card (X6) → sheet with the 2 ways + Not now (X7). Leaderboard and Join a class wait (X8).
- On the parent's yes, the phone's progress is uploaded once to the child's questProgress/questAttempts (X9).
- Existing accounts without a parent (G45: 1) keep their server data; they just see the card and no leaderboard.
- **Parent web link (owner: parents far away won't install the app):** "Send to my parent" shares a one-time link
  (expires 7 days) to a 1-page form on GitHub Pages (Hindi/English, read aloud): parent's name, Mother/Father/
  Guardian, "हाँ, मैं सहमत हूँ / Yes, I agree" → an HTTP function records the consent (same record as in-app) and links
  the child. Needs: page mockup (owner OK), DR for the function + rules, cost check (free tier).
- Replaces the blocking gate on `feat/consent-gate` (keep its College / grown-up, "parent or guardian" wording and
  "say it appreciate" parts).

## 2026-11-09 — DR-22: profile rule fails for accounts without `profileLastSavedAt` (URGENT, Claude)
Found via G72 (Seema blocked): the users-update rule read `resource.data.profileLastSavedAt` directly; a missing field
makes Firestore rules error → deny. 142 of 145 accounts lack the field, so almost every new user (children picking
their class on the first-run sheet, Seema's students, closed testers) can't save their profile; the old app message
blamed "the 10-minute rule" (the demo parent hit the same thing on 7 Nov). Fix (local firestore.rules line 61):
`resource.data.get('profileLastSavedAt', null) == null || request.time - resource.data.get('profileLastSavedAt', request.time) > 10m`.
Nothing else changes; every other field the rule reads is guarded already. **DR-22: Gemini deploys
`firebase deploy --only firestore:rules` from Claude's folder after the owner's OK, then tests the first-run sheet
with a brand-new throwaway account (child, Class 5) and deletes it.**

## 2026-11-09 — DR-23 (tidy-up, owner OK): delete the 2025 HTTP content endpoints (Claude, from Gemini's G60)
**Correction (owner was right):** the endpoints are IAM-private: a request without a token gets HTTP 403 from Google
before the function runs (tested 2026-11-09). Not publicly exploitable; deleting is defence in depth + dead code.
`functions/api/*.js` (2025 content scripts) are still deployed as public HTTP functions **with no auth check**;
`deleteAllDocuments` deletes documents in any collection by field match (e.g. `users`), and the repo is public. None
are called by the app (checked). Code: no longer exported from `functions/index.js` (31 functions remain).
**DR-23:** `firebase functions:delete deleteAllDocuments bulkDeleteGameDocs deleteQuiz deleteQuestions
deleteVocabCategory bulkAddCategories bulkAddTopics bulkAddQuizQuestions bulkAddStudyContent bulkAddVocabCategories
bulkAddWordsToCategory bulkAddSpellingBeePuzzles bulkAddWordInspectorQuizzes bulkGetWordInspectorQuizzes
getGameContent getDocumentsById addCategory addTopic createQuiz addQuizQuestion addStudyContent addQuestions
updateTopic updateQuizDetails updateQuestions updateFirestoreDocuments --region us-central1 --project apprec8-ca229
--force` (owner or Gemini, after the owner's OK). The rest of G60 (content cleanup, buckets, indexes) waits for its
own review and the Unit 1 quiz migration.

## 2026-11-09 — Review of G64 + G65 + G66 (merged) and DR-24 (Claude)
Merged Gemini's branch: parent's week shows all subjects first (G64), 🚩 on reading pages and Learn cards (G65), the
children's feedback pipeline (G66: Me → idea, weekly Home prompt, Admin tools → Ideas & reports, private export
`scripts/admin/feedback.mjs` → git-ignored `docs/agents/private/`). Claude's fixes: removed the "+5 ⭐" promise (the
phone can't write stars, rules forbid it; it failed silently, so children were promised stars they never got; stars
for answering come from the server with a daily cap in G69); first name only in feedback records.
**DR-24 (rules):** `userFeedback`: owner may read and tick status (`allow read: isAdmin()`, `allow update: isAdmin()`
only `status`/`doneAt`). Without it the owner's Ideas & reports screen stays empty. Deploy:
`firebase deploy --only firestore:rules --project apprec8-ca229` after the owner's OK.

## 2026-11-09 evening (Claude) — Grammar Pro: 5 High issues from G52 fixed by Claude
b4 questions-gate-pool-11 (prompt shortened to "the next train" so the key fits 14 words), b5 test-8 (key no longer adds
"yesterday"), modals-gate-pool-14, agent-board-7, test-12 (distractors match the sentence). `npm test` passes. Owner re-seeds
English (inbox card). Gemini G73 does the other 24. Also: OTA published (feedback G64–G66); G77 (DR-24) + G78 (offline) on the board.

## 2026-11-09 (night) — G84 Deploy Request DR-25: Push notifications for pending approvals (Gemini)
Push notification triggers for pending actions (G84 item 2):
1. **Teacher requests:** `redeemTeacherInvite` sends throttled FCM pushes to the school's creator, school admins, and the owner when a teacher redeems an invite code.
2. **Student requests:** `onStudentJoinRequest` (Firestore `classes/{classId}/members/{kidUid}` onCreate trigger) pushes to that class's teachers when a student asks to join with `status: "pending"`.
3. **Throttling:** Enforces maximum 1 push per user per 10 minutes (`pushRateLimits/{uid}`) with count ("N new") to prevent notification spam.
**DR-25 (functions):** Deploy:
`firebase deploy --only functions:redeemTeacherInvite,functions:onStudentJoinRequest --project apprec8-ca229` (after the owner's OK; do not deploy now).

## 2026-11-10 — Review of G79, G81, G82, G83, G84, G85 + DR-25 (Claude)
- **Merged:** G81 (Seema's course tile), G84 (Needs you + teacher Home), G82 (why-not panel), G79 (pilot fixes). All tests pass on the merge.
- **G84 notes (not blocking, fix later):** `loadAdminTeacherRequests` reads every class + its teacherRequests on each app start
  (grows with schools); `loadTeacherClassesOverview` reads one progress doc per child, one by one; throttled pushes are dropped,
  not sent later; picks science OR english progress for a class with both subjects. Cheap enough for the pilot.
- **G83 rejected + reverted:** ~1,100 of 1,998 whys explain another question. Back to Gemini, one unit at a time, gate `scripts/checkWhyMatch.mjs`.
- **G85 not merged:** product flavors break `:app:bundleRelease` / `expo run:android`. Back to Gemini with the exact fixes (BOARD G85).
- **DR-25 Deploy request (owner YES on the phone, 2026-11-10 → G94):** deploy functions `redeemTeacherInvite` (push to school admins + owner when a teacher
  waits) and new trigger `onStudentJoinRequest` (push to the class teachers when a student waits), max 1 push per person per 10 min.
  `firebase deploy --only functions:redeemTeacherInvite,functions:onStudentJoinRequest`. No rules change.

## 2026-11-10 — G90 built by Claude (Gemini idle overnight) + DR-26
- **No parent consent = no class (Seema 3):** Join a class needs a linked parent (`users.parentUids`, set only by the server when a
  parent adds/links the child). Without one: "Ask your parent to add you" + the 3 steps for the parent. With one: no second
  consent form; the member doc says `consentBy: "parent-account"`; the teacher sees "parent: linked account ✓".
- **Assigned work first (Seema 5):** "From your teacher" moved above Coming up / idea prompt on a kid's Home.
- **All levels open (Seema 6):** Admin tools → the class → "Pilot: open all levels" sets `classes/{id}.pilotUnlockAll`. Kids in
  that class: every topic of their class open (grade filter kept, calm folded map kept). Class docs read once per app session.
- **DR-26 Deploy request — owner OK in chat 2026-11-10 → Gemini G95:** firestore.rules `classes/{id}/members` create also requires
  `users/{kid}.parentUids` non-empty (the server-side half of "no consent = no class"). `firebase deploy --only firestore:rules`.
  Until it is deployed, only the app screen enforces it.

## 2026-11-10 — G91 built by Claude: the week-1 check-up
- **Gap found:** every practice paper was Class 5 only; Seema's Class 10 kids had nothing to sit. New **Check-up** papers for
  Classes 9–10 (`data/papers/mix.js` `buildCheckupPaper`): the 18 Grammar Pro topics × 3 reviewed questions = 54 questions,
  one part per unit, 49 minutes. Never Challenge/Boss questions. Check-up 2 shares no question with Check-up 1 (week-2 re-test).
  It is the first paper in the list for Classes 9–10 (Home → Practice paper).
- **Result screen:** "Accuracy by topic", weakest first; under 60% says "Practise this ›" and opens that topic. Same scoring for
  every paper (`utils/paperTopics.js`, tests).
- **Seema sees the class by topic:** the kid's progress doc gets `checkups.{paperId}` (Accuracy per topic); Progress → the
  class → "Check-up by topic": class Accuracy per topic, weakest first, and the names under 60% (teacher only). No new reads.
- **No internet:** saving never waits for the server any more (writes stay on the phone and go when online); if the server
  can't be reached: "No internet. Your answers are safe on this phone. We'll send them when you're back online."
  Stars need the internet (the stars call is not retried).

## 2026-11-10 night — Clean test on the emulator (production mode, Metro --no-dev) — PASSED with 4 fixes
Walk: launch → your account (G90 join block ✅, pilot switch shows on 10-A, not tapped) → sign out → new email account
(+ct1110, Class 10) → first run → Home → Check-up 1 → submit → results → Practise this → Fun / Progress / Me → deleted the
account. No FATAL; the only SoftException is "onWindowFocusChange while context is not ready" at dev-app launch (not app code).
Fixed during the walk: (1) "Practise this" opened the map at Unit 0 (topic locked) → now opens practice on that topic
(`topicPractice`); (2) after finishing Check-up 1 the screen still started Check-up 1 again (old bug, Mix papers too: the
chosen paper didn't follow the list once history loaded) → fixed, verified it opens Check-up 2; (3) Home card said "50
questions · 60 min" for Class 10 → "Check-up · Your Accuracy in every topic · 49 min"; (4) "Chamku asks" showed on day one
(profile `createdAt` missing) → falls back to the sign-in creation time. Not tested on the emulator: the parent-link flow
(needs two phones) and airplane mode; both in OWNER_TESTING.md.


## 2026-11-10 — DR-27: a parent with a class can link a child — DEPLOYED by the owner (2026-11-10, success)
- **Why:** the owner (account with a class set) could not make a link code for Pratha: `createParentLinkCode` refused every
  account with a `grade`. Owner: "a parent can also be a student somewhere".
- **Change:** `createParentLinkCode` and `createChildProfile` now refuse only child profiles (`isChild`) and accounts that
  already have a parent (`parentUids`), so a linked kid can't become someone's "parent". The Me screen shows My children to a
  parent with a class (committed earlier today).
- **Known gap (unchanged by this):** a child with their own unlinked login can still add a child profile, as before. The real
  answer is "I'm a grown-up" / year of birth (Spec X, before public release).
- **Deploy:** `firebase deploy --only functions:createParentLinkCode,functions:createChildProfile` (Gemini G102).

## 2026-11-10 (evening) — DR-28: teachers waiting show on Home + Schools list; alerts high priority (Claude, owner bug)
Owner: Seema joined 10-T as a teacher at 17:12; no Home row, no Schools tag, no notification for 2 hours. Causes: the Home
"Needs you" row read `classes/{id}/teacherRequests` from the client (rules: server only → silently empty; G84 was tested with
demo data only); the Schools list counted kids only; pushes went at Android priority "normal". Also the owner's saved phone
is stale (test push "1/1 delivered", nothing arrived) → owner re-taps Decisions → "Notify me on this phone".
Fix: new callable `myTeacherRequests` (one collection-group read; app admin = all, school admin = own schools), Home re-reads
on focus, Schools list adds teacher requests to "waiting"; `sendThrottledPushToUser` → priority high + logs sent/total and
"no phone saved". **Deploy request (owner OK):** `firebase deploy --only functions:myTeacherRequests,functions:redeemTeacherInvite,functions:onStudentJoinRequest`, then the OTA.

## 2026-11-10 (night) — Progress update times (owner YES on card "progress-refresh-rules")
Parents + teachers: other kids' progress is read from the server only after 7:30 am / 7:30 pm (`utils/refreshSlots.js`,
`services/progressCache.js`; the time of each read is kept on the phone, the doc comes from Firestore's own phone copy until the
next slot, offline = last copy). Screens show "Updated 8:05 pm". Pull down = fresh while Remote Config `progress_pull_refresh`
is on (unset = on; pilot: everyone; later maybe premium). Kids' own progress unchanged (instant). Class board: recomputed once
per clock hour, app shows "Keep practising! Next update at 9:30 pm". Replaces the unpublished 10-minute version (0b80c38).
**DR-29 Deploy request (owner OK):** `firebase deploy --only functions:getClassLeaderboard`, then the OTA (with DR-28's app part).

**Small fix, 10 Nov late (owner note "Pull down for latest doesn't work"):** Progress → My children / My classes had no pull
gesture (cards were ready, `ProgressScreen` never passed `refreshTrigger`). Added `RefreshControl` (behind `progress_pull_refresh`);
the counter resets on view switch so opening a view never forces a server read. `npm test` + bundle export pass. Needs an OTA.

## 2026-11-11 — Sign-up without codes, stage 1 (Claude): class link + parent's one screen + teacher's card. DR-31
Owner + parents + teachers approved the doc and mockups ("Simpler sign-up: one WhatsApp link"); owner: Claude builds,
stage by stage, pilot path first. Stage 1 needs no new app build (the app already opens `apprec8://` links).
- **Server** `functions/callable/joinActions.js`: `classLink` (teacher/admin; made once, `renew` = new link, old one dead),
  `classLinkInfo`, `joinClassByLink` (new child profile or an existing one; roll no., parent mobile, relation, consent
  stored server-side; 4-child limit; member `status: pending`), `markNotSure` (+ `followUps/`), `followUpList` (admins).
  `approveMember` now also clears the follow-up entry. `eraseUser` removes the parent's number and follow-ups.
  New server-only collections (no client rules = no client access): `classLinks`, `parentMobiles`, `followUps`.
- **App:** `hooks/useJoinLink.js` keeps a tapped link through sign-in / first run, then opens `JoinByLinkScreen` (one
  screen; existing consent texts: new child = child-account text, existing child = class text; a typed number is read
  back before saving). Teacher: `JoinRequestCard` (roll, parent, mobile + Call/WhatsApp, Approve · Not sure · Decline),
  follow-up section, SHARE CLASS LINK + "New link" in Progress → My classes, Home and the admin class page. Codes are no
  longer shown to teachers (old app versions and Me → Join a class still work until stage 4).
- **Web page** `web/public/j.html` (Firebase Hosting, `/j/<token>`): one button = Android opens the app on the class, or
  the Play Store. Reads and stores nothing.
- **Checks:** `npm test` (new `tests/joinLink.test.mjs`: tokens, links, mobiles, app/server copies agree) +
  `npm run test:emulator:join` (29 checks on the emulator: permissions, join, consent, Not sure, approve, new link,
  5th child) + Android bundle export. Not phone-tested yet.
- **DR-31 Deploy request (owner OK needed), in this order:**
  1. `firebase deploy --only functions:classLink,functions:classLinkInfo,functions:joinClassByLink,functions:markNotSure,functions:followUpList,functions:approveMember --project apprec8-ca229`
  2. `firebase deploy --only hosting --project apprec8-ca229`
  3. `node scripts/genOwnerNotes.mjs && npm install && npx eas update --channel production --message "Class link: parents join in one screen"`

## 2026-11-11 — Students join from their own phone; the teacher confirms the parent's yes (Claude). DR-32
Owner: Seema's Class 10 has exams in 5 days; parents shouldn't have to install anything; the closed test is live
(students 15–16 can install it themselves). Owner chose: parents reply YES in the class WhatsApp group (or a slip),
Seema confirms it when approving.
- **Server:** `studentJoinByLink` (own account; roll no. + parent's mobile; `consentBy: "teacher-confirms"`, or
  `"parent-account"` when a parent is already linked). `approveMember` refuses such a request without
  `parentSaidYes` ("whatsapp" | "slip" | "call" | "in-person") and then stores a consent record: method, who confirmed,
  when, parent's mobile (erased with the child's account).
- **App:** JoinByLinkScreen picks the student or parent screen from the account (quiet switch "I'm a parent ›" /
  "I'm the student ›"); the teacher's Approve asks "Did …'s parent say yes?" (class screen + admin class page).
  Class link page: the 3 tester steps (join group → become a tester → install); on a computer, no Play button.
- **Checks:** `npm test`, `npm run test:emulator:join` (37 checks, 8 new for this), Android bundle export.
- **DR-32 Deploy request (owner OK needed):**
  1. `firebase deploy --only functions:studentJoinByLink,functions:approveMember --project apprec8-ca229`
  2. `firebase deploy --only hosting --project apprec8-ca229`
  3. `node scripts/genOwnerNotes.mjs && npm install && npx eas update --channel production --message "Students join a class from their own phone"`

## 2026-11-11 — Word and fact of the day on the kid's Home (Claude; owner + Seema approved the mockup in the redesign doc)
- `utils/dailyCard.js` (pure, `tests/dailyCard.test.mjs`): one word (Treasure Words, by class) + one fact (Science Learn cards
  Classes 3–5, Space quest fun facts Classes 6–10, none for 1–2) per calendar day; same for a whole class; no repeats until the list is used up.
- `components/home/DailyWordFactCard.js` on Home under Today's practice: 🔊 Hear (expo-speech), "I knew it / New for me", ✕ until tomorrow.
  Taps and "new" words stay on the phone (AsyncStorage, per account). 0 database reads, no server change. JS only (OTA).
- Left for later: star for opening (needs a callable), My words in Me (Me redesign), 5 pm alert (needs expo-notifications, next build).

## 2026-11-11 — DR-33: never miss an alert (Claude; owner: "Banner would be good. We can't miss alerts ever")
Found: teachers' phones were saved for alerts only if they turned on the weekly summary (Seema may get no "waiting to join"
alerts); the owner's phone could only be saved by a button that hides after the first tap; alerts inside the 10-minute limit
were dropped; alerts that arrive while the app is open were never shown.
- Server: new callable `savePushToken` (adults only: refused for child profiles and kids with a class unless they teach or are
  the app admin; doesn't touch the weekly switch). `sendThrottledPushToUser`: held-back alerts are counted into the next one
  ("+2 more waiting"), dead phones are removed.
- App (OTA): `keepPhoneSaved` (services/push.js) from Home for teachers + the owner on every start; writes only when the
  phone's address changed or once a week; asks for notification permission once; follows token refreshes.
  `AlertBanner` (components/common/AlertBanner.js): alerts while the app is open show at the top for 8 s, tap = same screen.
- Cost: one small write per teacher per week (or on a new phone); FCM is free.
- **Deploy request (Gemini or owner):** `firebase deploy --only functions:savePushToken,functions:onStudentJoinRequest,functions:redeemTeacherInvite --project apprec8-ca229`.
  The app part works before the deploy for the owner's Decisions phone; teachers' saving starts after it.

## 2026-11-11 — DR-34: weekly mood check, Calm corner, counsellor's list (Claude; owner: "we go with your messages in pilot")
Spec: "Well-being safety steps" tab of the Simpler Home, Progress and Me doc (Seema's answers in it).
- Kid (Home, kids with a class): once a week "How are you feeling?" 😀 🙂 😢 → its message. Sad → "Just today, or for a while?"
  Just today → Calm corner; for a while → Let the counsellor know · 1098 · 14416 · I'm okay for now. Taps only.
- Calm corner (`screens/wellbeing/CalmCornerScreen.js`, Home link): Seema's 9 strategies; breathing (4 s in / 4 s out × 3,
  voice) and 5 senses guided; read aloud. Nothing saved.
- Server (`functions/callable/moodActions.js`): `recordMood` (kids only, one doc per kid per day in `moodTaps/`, flag =
  asked / sad for a while / sad two weeks running; one sad tap reaches nobody), `myMoodList` (counsellor = roles/{uid}.counsellor
  for the classes she teaches; the owner as backup only while she's away, and for classes with no counsellor),
  `setMoodOutcome` (Talked, okay · Follow up = back in 3 days · Referred), `setCounsellorAway`, `amICounsellor`.
  No Firestore rule opens `moodTaps/` or `wellbeingState/`: phones can't read them. `expireAt` = 60 days.
- Counsellor's list (`screens/wellbeing/MoodListScreen.js`) from Home → Needs you "N kids to see today (well-being)".
  Home asks only for teachers and the owner, at most every 30 min; a non-counsellor teacher is remembered for a day.
- **Deploy request (owner):** `firebase deploy --only functions:recordMood,functions:myMoodList,functions:setMoodOutcome,functions:setCounsellorAway,functions:amICounsellor --project apprec8-ca229`
- **Owner, one-time:** (1) Seema as counsellor: `node scripts/admin/setCounsellor.cjs <her email>` then the same with `--apply`.
  (2) Firebase console → Firestore → Time-to-live → add policy: collection group `moodTaps`, field `expireAt` (deletes after 2 months).

## 2026-11-11 — DR-35: topic levels + one summary per class (Claude; build step 1 of the redesign doc)
- `utils/topicLevels.js` (+ tests): New → Practising → Learned → Still remembers / Slipping per topic per kid. Learned = ≥80% on
  the last 8+ answers to questions new to the kid, on 2+ days, with a right answer in a Challenge/Boss/medium-hard step; judged
  once per attempt. Re-check from 6 days after Learned (3+ answers: ≥80% remembers, <60% slipping). Saved in
  `questProgress.stats.levels` inside the existing stats write (no extra writes); ≤40 question keys per topic.
- Server: `functions/triggers/classSummary.js` `onQuestProgressForClass` writes `classSummaries/{classId}.kids.{uid}` (name; per
  quest: last practice, this week's days/answers/right, one letter per topic level), at most every 5 min per kid unless a level
  changed; `functions/utils/topicLevels.js` = the server's copy (test checks both agree).
- Rules: `classSummaries/{classId}` read = teachers of that class + admin; write = nobody (local firestore.rules updated).
- Teacher's topic view (`components/teacher/TopicViewCard.js`, `utils/topicView.js` + tests) on Progress → My classes → a class:
  reads the one summary doc; topics worst first; tap for names per group. Not yet: common mistake, Nudge / Appreciate.
- Not yet: Home/Progress for kids and parents reading levels (next pieces). Removed kids' entries stay until the
  view filters by current members.
- **Deploy request (owner):** `firebase deploy --only functions:onQuestProgressForClass,firestore:rules --project apprec8-ca229`

## 2026-11-11 — Parent's Home: "tonight" with each child (Claude; redesign doc, owner + Seema)
- `components/parent/ParentTonightCard.js` on Home for parents (one per linked child, after Needs you): practised today, days
  this week, 5 questions from `talkQuestions` (strong topics first, then mistakes) one at a time with See answer + Right / Needs
  help, then the praise prompt + "I praised <name>". `utils/tonight.js` + tests. Same cached progress reads as Progress
  (0 extra reads). Taps on the phone only for now. Not yet: kid-side "Did someone at home ask you?", the 3-line topic summary,
  "Let <name> play on this phone" on the card.

## 2026-11-11 — Kid's Progress, redesigned (Claude; redesign doc)
- `utils/kidProgress.js` + tests: `encouragement` (good news or a next step only; right counts up to Class 5, accuracy above),
  `nearGoal` (the next classmate up on the class board, never the gap to the top), `topicLists` (Learned / Doing well /
  Needs practice from topic levels; old answers 80%+ = Doing well, not Learned).
- ProgressScreen kid view: cheer + week strip, near goal → Leaderboard, Needs practice (Practise buttons), Learned, Doing well.
  Removed: quest list, 3 number tiles, "Work on these" / "Great at". `getClassLeaderboard` at most every 10 min (server: hourly).

## 2026-11-11 — Me, redesigned (Claude; redesigned mockup in the doc)
- MeScreen: a greeting line per role; owner: Decisions + Admin tools first; Need help; MY CHILDREN (See X's week / Let X play on
  this phone, Add a child); MY CLASSES for teachers (Open my classes); MY CLASS for students ("You're in 10-A" / "waiting for your
  teacher", Join a class only when none); Tell us what you think; everything else under **More** (How to use, Guides, idea,
  Reminders, Messages, Look, Join another class, Join as a teacher, link/PIN, Owner extras, Sign out, Delete). Nothing removed.
- Not yet: stickers (needs the appreciation feature), avatar "Change my look" shop.

## 2026-11-11 — Kid's Home: one next thing (Claude; redesign doc)
- `utils/nextUp.js` + tests: teacher's topics (overdue first, then earliest due) → today's paper → mistakes → keep going on the
  last quest; main + two "then" + "+N more". HomeScreen: one card with START (GlowButton) for kids (class set, not teaching);
  the separate teacher / today / mistakes cards are hidden for kids only. Quest tiles stay below.

## 2026-11-12 — DR-36: Appreciate, Nudge, Cheer on + stickers (Claude; owner + Seema in the redesign doc)
- Server `functions/callable/stickerActions.js` `sendSticker({ classId, kind, toUids, topic })`: teacher of the class (or owner)
  only, approved kids only, max 200 kids per teacher per day. Appreciate → `users/{uid}.stickers` (newest 60) + `stickerCount`,
  name on `classes/{id}/appreciations/{week}` (one per kid per topic per week). Nudge / Cheer on → `users/{uid}.nudge`
  (private, 3 days). No phone alerts for kids. `getClassLeaderboard` also returns `appreciated` (first names this week).
- App: topic view buttons per group; `components/home/NudgeCard.js` on the kid's Home; Me → MY STICKERS; class board line.
- Known: a kid could edit their own `stickers` field (rules allow own-doc writes); the class list comes from the server.
- **Deploy queue (owner), everything not yet deployed today:**
  `firebase deploy --only functions:sendSticker,functions:getClassLeaderboard,functions:recordMood,functions:myMoodList,functions:setMoodOutcome,functions:setCounsellorAway,functions:amICounsellor,functions:onQuestProgressForClass,firestore:rules --project apprec8-ca229`

## 2026-11-12 — Parents hear when their child is appreciated (Claude; owner: "parents will feel proud")
- `sendSticker` (Appreciate only): each linked parent of an appreciated kid gets "🌟 <kid> was appreciated · <teacher> appreciated
  <kid> for great work on <topic>. Tell <kid> you're proud!" (view: family). Nudge / Cheer on stay private. Kids: still no alerts.
- `sendThrottledPushToUser` moved to `functions/utils/throttledPush.js` (same code; schoolActions.js uses it from there).
- App: `keepPhoneSaved` now also for parents (accounts with children): asks once, saves the phone via `savePushToken`.
- **Deploy request (owner):** `firebase deploy --only functions:sendSticker,functions:onStudentJoinRequest,functions:redeemTeacherInvite --project apprec8-ca229`

## 2026-11-12 — Mood taps ×5, Progress lists by subject, Calm corner in Fun (Claude; owner OK)
- Moods: Happy, Excited, Okay, Tired, Sad (max 5, owner); only Sad can reach the counsellor. Server `recordMood` accepts the new ones.
- Progress: Needs practice / Doing well / Learned grouped by subject (`bySubject`), 3 each + more; Doing well → "Make it Learned".
- Fun tab: Calm corner tile (FunNavigator route). Not yet: "Take a breath?" after a long or frustrating session.
- **Deploy request (owner):** `firebase deploy --only functions:recordMood --project apprec8-ca229`

## 2026-11-12 — "Take a breath?" during practice (Claude; owner OK)
- `utils/breakPrompt.js` + tests: after 3 wrong in a row or 20 min of practice (a 10-min gap starts a new session), at most once per
  30 min, never in Exam mode. QuizScreenV2: offered on Continue (after the explanation) with the app dialog: Keep going / Take a
  breath 🌿 (opens CalmCorner; registered in the Quest stack too). No server, no writes.

## 2026-11-12 — DR-37: the owner's weekly "Is it working?" (Claude; owner: "critical")
- Server `functions/callable/ownerActions.js` `ownerWeekly` (owner / app admins): this week vs last (Monday, India time): kids
  practised, back on 2+ days, topics learned / remembered / slipping, answers + accuracy, problem questions (strong kids = 80%+ over
  50+ answers; ≥3 of them answered, ≥50% wrong; with the most picked wrong option), mood totals, appreciations. Cached 1 h in
  ownerConfig/weeklyCache; Refresh forces. `summarizeWeek` is pure (tests/ownerWeek.test.mjs).
- App: Progress → This week (owner only), `components/owner/OwnerWeekCard.js`. "Not collected yet" lines instead of made-up
  numbers (talks at home, teachers' monthly tap); cost = link to Firebase usage.
- Scale note: reads every kid's progress once an hour when opened; fine for the pilot; later read the class summaries instead.
- **Deploy request (owner):** `firebase deploy --only functions:ownerWeekly --project apprec8-ca229`

## 2026-11-12 — Pilot helpers (Claude; owner: "build 1–3")
1. `components/teacher/BulkApproveCard.js`: tick students whose parents said YES, one method for all, confirm → `approveMember`
   per kid (same consent note as one by one). Shown when 2+ are waiting.
2. `assignmentStatus` returns names per group (`who`); TeacherWeekCard shows them + "Nudge N not started" / "Appreciate N done"
   (sendSticker; demo classes excluded).
3. `services/reportsInbox.js`: owner's Home → Needs you "N new reports from kids" = userFeedback since the last visit to Ideas &
   reports (only the new docs are read; at most every 10 min on Home focus). Opening the list = seen.

## 2026-11-12 — Review: built screens vs the two agreed docs (Claude; owner asked)
**Fixed today:** waiting kids first on the teacher's class screen ("top card = most urgent"); "waiting for the teacher" under My
children + on the parent's Home card (sign-up doc); "Let X play on this phone" on the parent's Home card; parent Progress without
topic counts, "Talk about this week · N got right · N found hard" (Hindi wording to check).
**Not built, not needed for the Class 10 pilot (sign-up doc stages 2–6):** child finds the parent by mobile (+ parent's one-tap yes);
teacher join link with classes/subjects (teachers still use the invite code); Learn on my own + parent's yes before learning;
codes removed; the no-install web "yes" page; parent's Google photo on the request card; requests closing after 7 days;
Me → Change Google account. Pilot deviation (agreed): Seema confirms the parent's WhatsApp YES (B11 replaces it later).
**Not built from the redesign doc:** kid's face tap after a step; kid-side "Did someone at home ask you?"; parents' taps reaching
the owner's totals; teacher's monthly "saved me time"; Appreciate / Nudge lists on the teacher's Home (they are in Progress);
class-average line for kids; avatar "Change my look"; "Share a class link" on the teacher's Me (it's on Home + Progress);
reminders / Chamku's idea card still show on the kid's Home below the next thing.
**Test plan:** docs/qa/OWNER_TESTING.md → END-TO-END TEST (13 Nov), cards e2e-01 … e2e-14 in Decisions.

## 2026-11-12 — G97 merged (Gemini, reviewed 10 Nov) + child codes removed + build 20.0.32 (Claude)
- Remove an approved kid: `approveMember` with `approve: false` now removes the class from `classIds` too; TeacherClasses →
  each kid row → "Remove from class" (confirm). Emulator join test extended (3 checks, pass). Applied by hand (the screen changed
  since Gemini's branch).
- Child login codes removed from the app (owner: nobody uses them): sign-in "Code from my parent", Play-as "Get a login code",
  Add a child's code screen. Server functions stay (unused).
- Build 20.0.32: no Android app backup (sign-in loop after a reinstall).
- **Deploy request (owner), BEFORE the next publish:** `firebase deploy --only functions:approveMember --project apprec8-ca229`

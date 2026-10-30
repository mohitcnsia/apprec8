# Code Review & Deployment Log

This file tracks technical reviews, architecture decisions, and deployment readiness assessments.
- **Reviewer:** Logs findings, categorized by impact and discipline (Code Review vs. Deployment).
- **Author:** Responds to each item with decisions, clarifications, or next steps.
- **Status lifecycle:** `[OPEN]` → `[IN PROGRESS]` → `[RESOLVED]` / `[ACKNOWLEDGED]`.

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

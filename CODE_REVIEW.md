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

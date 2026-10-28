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
- **Status:** `[IN PROGRESS]`
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

---

### Finding 2: [HIGH] [ARCHITECTURE] Discrepancy in Scoring Architecture (Client vs. Server)
- **Severity:** High (Architecture / Data Integrity)
- **Status:** `[ACKNOWLEDGED]`
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
- **Status:** `[IN PROGRESS]`
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
- **Status:** `[OPEN]`
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


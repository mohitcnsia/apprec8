# G50 Plan: Children Learn First (Row X6–X9)

**Task:** Build "Learn First" (screens X6–X9, spec in `CODE_REVIEW.md` 2026-11-06, decisions.json `row-x-learn-first-mockup`).  
**Branch:** `feat/learn-first` (branched from `origin/feat/simple-home`).  
**Commit to request review:** `gemini(G50): plan — review please`.

---

## 1. Goal & Product Rationale

- **Problem:** A student who installs the app or signs up alone hit a blocking consent gate ("Ask a parent"), preventing them from learning immediately. Many kids lose motivation, and parents may be away at work.
- **Solution (Learn First):** The student can immediately start learning and earning stars without any blocking screen.
- **Privacy & Regulatory Compliance (DPDP Act 2023 & Google Play Families Policy):**
  - Personal data and learning activity of a child without verified parental consent must **NOT** be stored or processed on the server/cloud.
  - While unconsented, all learning progress (nodes, quiz attempts, answers, mistakes, stars, stats) is stored **strictly on the phone (AsyncStorage)**.
  - Zero writes to Firestore `questProgress` and `questAttempts`.
  - The Leaderboard and class interactions are locked until consent is recorded.
- **Unlock & Migration (X9):**
  - Once parental consent arrives (via parent's 6-digit link code, class code, or parent web link), the accumulated phone progress is merged and uploaded **once** to Firestore.
  - The app displays the cheerful confirmation: *"Your N stars are saved now! 🎉"*, unlocking the Leaderboard and school class.

---

## 2. Architecture & State Management

### A. Detection of Mode
A pure function `isLearnFirstMode(userDoc, { exempt = false })` in `utils/consent.js`:
- Returns `true` if `needsParentConsent(userDoc, { exempt })` is `true`.
- Returns `false` for adults (no grade / born 18+ years ago), profile kids (`isChild: true`), demo users, and students who have `parentUids`, `classIds`, or `pendingClassIds`.

### B. Local Storage Layout (`utils/localProgress.js`)
All local data is stored under scoped AsyncStorage keys per `uid`:
1. `@apprec8:local_progress:${uid}:${questId}`:
   ```json
   {
     "questId": "english-quest",
     "nodes": {
       "eq-u1-common-nouns": { "status": "completed", "bestPercent": 100, "attempts": 1, "completedAt": 1730960000000 }
     },
     "mistakes": { ... },
     "stats": { ... },
     "updatedAt": 1730960000000
   }
   ```
2. `@apprec8:local_attempts:${uid}`:
   Array of serialized attempt documents matching Firestore `questAttempts` schema.
3. `@apprec8:local_stars:${uid}`:
   Numeric total of stars earned on this phone.

### C. Local Progress API (`utils/localProgress.js`)
Pure, testable functions accepting a storage adapter (AsyncStorage or in-memory map):
- `loadLocalQuestProgress(storage, uid, questId)`: returns `{ nodes, mistakes, stats, updatedAt }`.
- `saveLocalNodeProgress(storage, uid, questId, nodeId, { percent, passed, gate, resetGateId })`: mirrors `updateNodeProgress` logic locally.
- `saveLocalQuestAttempt(storage, uid, attemptParams)`: scores attempt, updates local mistakes and stats, updates local node, appends to local attempts array.
- `getLocalStars(storage, uid)`: returns current local stars count.
- `prepareLocalProgressUpload(storage, uid)`: compiles all local quest progress documents and attempt records into clean Firestore batch/setDoc payloads.
- `clearLocalProgress(storage, uid)`: clears all `@apprec8:local_*` keys for the user upon confirmed server upload.

---

## 3. Screen & Component Changes

### 1. Home Screen (`screens/home/HomeScreen.js`) — Mockup X6
- If `isLearnFirstMode`:
  - Show the calm banner card right above the subject rows (thumb-friendly, non-blocking):
    - `⭐ {localStars} stars, on this phone only. Ask a parent to save them ›`
  - Tapping this card opens the `AskParentSheet` (X7).
  - All subject rows (`English Quest`, `Science Quest`, `Treasure Words`) and ▶ buttons remain **100% interactive**. The child can play immediately.

### 2. Ask Parent Action Sheet (`components/consent/AskParentSheet.js`) — Mockup X7
- Modal bottom sheet with warm plum styling:
  - Title: *"Save your stars & lessons"*
  - Subtitle: *"A parent or guardian's approval saves your stars and keeps your streak safe."*
  - 3 Action choices:
    1. **Send to parent on WhatsApp:** Shares `parentAskMessage(firstName, webLinkOrStoreLink)`.
    2. **Enter parent's 6-number code:** Quick input field for linking code if the parent already installed Apprec8.
    3. **Enter school class code:** Quick input for school-led consent.
  - Secondary button: *"Not now"* (closes sheet without interrupting play).

### 3. Progress Screen (`screens/progress/ProgressScreen.js`) — Mockup X8
- Weekly streak, local stars, and quest completion bars display local progress seamlessly.
- **Leaderboard Card:**
  - In `isLearnFirstMode`, the card shows:
    `"Leaderboard opens when a parent says yes 🔒"`
  - Tapping opens a gentle explanation dialog with a direct button to *"Ask a parent"*.

### 4. Results Screen (`screens/common/ResultsScreen.js`)
- In `isLearnFirstMode`:
  - Skip calling Cloud Function `recordQuizResult`.
  - Calculate stars awarded client-side using standard project rules (3 for 90%+, 2 for 60%+, 1 for passing/any right).
  - Update local progress and stars.
  - Celebrate with confetti and score-appropriate Mascot mood.

### 5. Consent Upload & Welcome (`AppContent.js`) — Mockup X9
- In `AppContent.js`, watch `userDoc`:
  - When `needsParentConsent` switches from `true` to `false`:
    - Call `uploadLocalProgressToServer(uid, db)`.
    - On successful sync, clear local phone storage for this uid.
    - Display congratulatory message (X9):
      *"Your {N} stars are saved now! 🎉 Leaderboard and class are open."*

---

## 4. Edge Cases Handled

1. **Existing unconsented accounts (G45: 1):**
   - Existing server data is preserved. They see the calm card on Home and locked leaderboard, without deleting any existing server progress.
2. **Offline play:**
   - Works naturally since progress is written to AsyncStorage.
3. **App uninstall before consent:**
   - Progress was on the phone only, consistent with privacy regulations (no orphaned server records).
4. **Network error during migration:**
   - If server upload fails, local AsyncStorage is NOT cleared; it will retry on next launch or next connection.

---

## 5. Files to Touch & Create

| Action | File | Responsibility |
|---|---|---|
| **Create** | `utils/localProgress.js` | Pure storage, update, scoring, and upload preparation logic for local-only progress |
| **Create** | `components/consent/AskParentSheet.js` | Action sheet for Mockup X7 (WhatsApp share, 6-digit code, class code, Not now) |
| **Create** | `tests/localProgress.test.mjs` | Automated unit test suite verifying storage, attempt saving, stats, stars, and upload payloads |
| **Modify** | `utils/consent.js` | Export `isLearnFirstMode` and integrate web-link URL into `parentAskMessage` |
| **Modify** | `services/englishQuestApi.js` | Dispatch to local progress when user is in learn-first mode |
| **Modify** | `screens/home/HomeScreen.js` | Render calm X6 banner card + connect to X7 sheet |
| **Modify** | `screens/progress/ProgressScreen.js` | Show locked/calm Leaderboard state (X8) when in learn-first mode |
| **Modify** | `screens/common/ResultsScreen.js` | Client-side stars awarding in local-only mode without calling `recordQuizResult` |
| **Modify** | `AppContent.js` | Trigger one-time upload when consent flips to true and show X9 confirmation |
| **Modify** | `package.json` | Register `tests/localProgress.test.mjs` in test runner |

---

## 6. Verification & Test Plan

1. **Unit Tests:**
   - Run `npm test` with `tests/localProgress.test.mjs`.
   - Verify node updates, bestPercent retention, gate fail tracking, and stats accumulation in local storage.
   - Verify upload payload matches exact Firestore `questProgress` and `questAttempts` schemas.
2. **Full Test Suite:**
   - Verify all 49 existing test suites continue to pass (`npm test`).
3. **Metro Bundle Verification:**
   - `npx expo export --platform android --no-bytecode` to confirm 0 packaging or syntax errors.

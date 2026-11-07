# G66 Plan: Children's Feedback Pipeline (Ideas, 🚩 & Polls)

**Date:** 2026-11-07  
**Task:** G66 · Feedback pipeline: children's ideas reach the owner and Claude  
**Owner Problem Addressed:**
> "Pratha loves Duolingo and says lots of good things, but the app has no way to capture her feedback in a way that you and I can review and plan."

---

## 1. Pipeline Overview & Architecture

```
[ Child in App ] ───► Me tab ("💡 I have an idea!") ──┐
                 ───► Home Feed weekly prompt       ──┼──► Firestore: userFeedback
                 ───► 🚩 Question/Reading Report    ──┤    (existing collection, offline-safe)
                 ───► Chamak Asks Polls             ──┘
                                                              │
                     ┌────────────────────────────────────────┴──────────────────────────┐
                     ▼                                                                   ▼
       [ Owner: In-App Admin Tools ]                                       [ Claude & Owner CLI ]
   Me → Admin tools → "Ideas & reports"                              scripts/admin/feedback.mjs
   • Live feed, newest first                                         • Exports to docs/agents/private/feedback.json
   • Filter: Ideas | Mistakes | Contact | Polls                      • 100% git-ignored (.gitignore)
   • "✓ Done" action toggle                                          • First name & Class only (privacy redacted)
   • Real-time updates                                               • Incremental read guard (reads only new docs)
```

---

## 2. Component 1: Children's Input

### A. Two Entry Points in the App
1. **On-Demand (Me tab):**
   - Location: `screens/profile/MeScreen.js` under `HELP`.
   - Row: `icon="bulb-outline"`, `label="💡 I have an idea for Apprec8!"`.
   - Always accessible whenever a child or parent has a spontaneous idea or comparison with another app.
2. **Weekly Proactive Prompt (Home Feed):**
   - Location: `screens/home/HomeScreen.js`, low in the thumb zone (above bottom tab bar).
   - Frequency Guard: Appears at most **once every 7 days** (stored locally in `AsyncStorage`: `last_idea_prompt_at`).
   - Dismissible: `✕ Not now` suppresses it for 7 days.
   - Reward: Awards `+5 ⭐` totalStars when completed (matching Chamak asks).

### B. Kid-Friendly Rotating Prompts & Tap Options
Children tap big emoji chips. No blank page intimidation. 3 core prompts:

| Prompt | Emoji Choices (Tap-Only for Kids) |
|---|---|
| **1. "What do you love in another app?"** | 🎮 Mini-games & puzzles<br>🏆 Cool badges & avatar outfits<br>👥 Playing & challenges with friends<br>🎵 Fun sound effects & voice read-aloud |
| **2. "What should we add to Apprec8?"** | 📚 More funny stories & picture books<br>🔬 Science experiments to do at home<br>🧠 Maths riddles & daily puzzles<br>💎 More Treasure Words & vocabulary quests |
| **3. "What's boring here?"** | 😴 Too much text on one page<br>⏱️ Quizzes are too long<br>🎨 Need more colours & animations<br>🌟 Nothing, I love it as it is! |

### C. Child Safety & Free-Text Guard
- **General Rule:** 100% of children tap predefined choices.
- **Supervised Accounts Only:** Uses `useCanWriteFreeText()` (backed by Remote Config `free_text_emails` and verified supervised accounts).
  - If allowed: shows optional text box: `"Tell us more in your own words (optional)..."` (max 300 chars).
  - If not allowed: renders `ASK_A_GROWN_UP` (`"Something else? Ask a grown-up to tell us."`) with no input field.

### D. Firestore Document Schema (`userFeedback`)
Writes directly to the existing `userFeedback` collection (rules already permit signed-in users to create their own documents; offline-safe via Firestore queue):

```typescript
interface IdeaFeedbackDoc {
  userId: string;
  userName: string;           // First name only (e.g. "Pratha")
  userGrade: number | null;   // e.g. 5
  feedbackType: "idea";       // "idea" | "issue_report" | "contact" | "poll"
  entryPoint: "me_idea" | "home_idea_prompt";
  promptQuestion: string;     // e.g. "What do you love in another app?"
  selectedChoice: string;     // e.g. "Cool badges & avatar outfits"
  choiceEmoji: string;        // e.g. "🏆"
  feedbackText: string;       // Note from supervised account, or ""
  clientTimestamp: string;    // ISO timestamp
  createdAt: FieldValue;      // serverTimestamp()
  status: "new" | "done";     // Default "new"
  appVersion: string;
}
```

---

## 3. Component 2: Owner View in Admin Tools ("Ideas & reports")

### A. Location & Navigation
- Path: **Me → Admin tools → "Ideas & reports (feedback, 🚩, polls)"**
- Admin Guard: Visible and accessible strictly to `APPREC8_TEAM_REVIEWER_UID`.

### B. Screen Design (`screens/admin/IdeasReportsScreen.js`)
- **Header:** Title "Ideas & reports", refresh indicator, count of open items.
- **Filter Tabs:**
  - `All` (everything)
  - `Ideas 💡` (`feedbackType == "idea"`)
  - `Mistakes 🚩` (`feedbackType == "issue_report"`, question & study reports)
  - `Contact 💬` (`entryPoint == "cntct"` / `feedbackType == "contact"`)
  - `Polls 📊` (`entryPoint == "chamak_asks"`)
- **Card Items:**
  - Badge with icon/color according to type.
  - Sender: `FirstName · Class N` (e.g. `Pratha · Class 5`).
  - Relative time: `timeAgo` (e.g. `10 min ago`, `Yesterday`).
  - Prompt / Context:
    - Ideas: The question prompt and selected choice chip.
    - Mistakes: Question ID / study page ID, reason chip ("Wrong fact", "Spelling", etc.).
    - Notes: Any typed message from the child or parent.
  - Action Button:
    - `✓ Done` toggle: Marks item as done (`status: "done"`). Done items show dimmed with a green checkmark or can be filtered out.

### C. Security & Firestore Rules (DR-21)
- Currently, `userFeedback` allows `create` if signed in.
- For the owner to read and update `status: "done"` from the app:
  ```
  match /userFeedback/{feedbackId} {
    allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
    allow read, update: if isAdmin();
  }
  ```
  *(Documented as Deploy Request DR-21 for owner approval; Admin CLI script bypasses rules via Admin SDK).*

---

## 4. Component 3: Claude Sync Script (`scripts/admin/feedback.mjs`)

### A. CLI Command & Usage
```bash
node scripts/admin/feedback.mjs            # Sync new feedback to docs/agents/private/feedback.json
node scripts/admin/feedback.mjs --dry      # Dry run: prints pending count without writing
node scripts/admin/feedback.mjs --watch    # Runs sync every 10 minutes in background
```

### B. Privacy & Git Safety
- **Git-Ignored:** Added `docs/agents/private/` to `.gitignore`. Children's thoughts and messages are **never pushed to the public GitHub repository**.
- **Data Redaction:**
  - Strips user email, phone number, full name, and raw UID.
  - Formats output for review:
    ```json
    [
      {
        "id": "docId",
        "type": "idea",
        "name": "Pratha",
        "class": 5,
        "prompt": "What do you love in another app?",
        "choice": "🏆 Cool badges & avatar outfits",
        "note": "Duolingo has hats for the owl",
        "status": "new",
        "createdAt": "2026-11-07T12:00:00.000Z"
      }
    ]
    ```

### C. Cost Guard (Incremental Reads)
- Stores `last_sync_timestamp` in `docs/agents/private/.feedback_sync.json`.
- Only queries documents where `createdAt > lastSyncTimestamp`.
- If 0 new reports exist, it performs 0 extra writes and minimal read cost (~1 read per check).

---

## 5. Implementation Steps & Verification Plan

1. **Step 1: Privacy Configuration**
   - Add `docs/agents/private/` to `.gitignore`.
2. **Step 2: Pure Logic & Utilities (`utils/feedbackPipeline.js`)**
   - Pure functions for prompt definitions, choice selection, frequency check, and payload building.
   - Unit tests in `tests/feedbackPipeline.test.mjs` verifying validation, redaction, and cost guards.
3. **Step 3: Children's UI**
   - Modal component `components/feedback/IdeaModal.js` with prompt cards and emoji chips.
   - Entry point in `screens/profile/MeScreen.js`.
   - Weekly prompt card on `screens/home/HomeScreen.js`.
4. **Step 4: Owner Admin Screen**
   - Create `screens/admin/IdeasReportsScreen.js`.
   - Wire route into `screens/admin/AdminToolsScreen.js`.
5. **Step 5: Claude Export Script**
   - Build `scripts/admin/feedback.mjs` using `firebase-admin`.
6. **Step 6: Test Suite & Verification**
   - Run `npm test` to ensure all existing and new test suites pass cleanly.

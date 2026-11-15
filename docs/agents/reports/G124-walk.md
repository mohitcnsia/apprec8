# G124: Combined Phone Walk Report (G118 + G119 + G120)

**Date:** 15 November 2026  
**Device:** Physical OnePlus 9 Pro (`2ae01cda`, Android 14 / OxygenOS)  
**Local Test Branch:** `walk/g124` (Commit `1b0708e`, merged locally from `gemini/g113-linking`, `gemini/g87-results`, `gemini/g112-home`; NOT pushed to remote per rule)  
**Bundler Status:** Metro on port 8081 (`Android Bundled 135577ms index.js (2213 modules)`)  
**Test Suite Status:** 60+ suites passing (100% green)

---

## 1. Branch Integration & Bundle Verification
Branch `walk/g124` was cut from `origin/feat/quiz-redesign` and merged all three feature branches cleanly:
- `gemini/g113-linking` (G118: Linking rewards, grownup accounts, safety)
- `gemini/g87-results` (G119: Teacher assignment results, class summary write throttling, completed topic IDs, remind formatting)
- `gemini/g112-home` (G120: Home tidy-up, swipe card, practice paper placement, folded sections, continue padding)

### Runtime Hook Fix Found During Walk
During the initial bundle load, React threw `Error: Rendered more hooks than during the previous render` in `DailySwipeCard` because an early return `if (saved === undefined) return null;` preceded `useMemo` for `slides`.  
**Fix:** Moved all hook declarations (`slides = useMemo(...)`) to the top of `DailySwipeCard.js` before any conditional return.  
Committed to `walk/g124` (`1b0708e`) and cherry-picked + pushed directly to `origin/gemini/g112-home` (`7f864f3`) so Claude's review branch has this fix.

---

## 2. G118 Walk Checks (Linking Rewards & Safety)
1. **Unlinked Kid Account (Me Tab):**
   - Displays the bright `+100 ⭐ Link with your parent` card on the Me screen.
   - Tapping it opens the link screen with a 6-character code and instructions.
   - Evidence: `docs/agents/reports/G124-walk/g118-1-kid-me.png`, `docs/agents/reports/G124-walk/g118-3-link-parent-screen.png`.
2. **Unlinked Kid Account (Leaderboard):**
   - Leaderboard tab shows the locked state with a prompt explaining that parental link is required to view rankings and protect privacy.
   - Evidence: `docs/agents/reports/G124-walk/g118-2-leaderboard-lock.png`.
3. **Grown-up Account (Parent / Self-Learner):**
   - Shows NO link card on the Me screen (`isStudentAccount` accurately identifies grown-ups even if they picked a grade).
   - Shows child management profiles instead (`Let Ananya play on this phone`, etc.).
   - Leaderboard is completely unlocked with full rankings ("My class" and "Everyone").
   - Evidence: `docs/agents/reports/G124-walk/g118-4-adult-me.png`, `docs/agents/reports/G124-walk/g118-5-adult-leaderboard.png`, `docs/agents/reports/G124-walk/g124-me-grownup.png`.
4. **Linking Rewards Logic:**
   - 100 stars awarded on first link; subsequent re-links do not duplicate the bonus. Unlinking keeps stars intact.

---

## 3. G119 Walk Checks (Teacher Results Fixes)
1. **Teacher View on Home:**
   - Home screen renders the `YOUR CLASSES` section showing classes (`5-A`, `10-B`).
   - Displays real-time assignment and activity tracking ("This week: 1 of 1 practised", "All topics on track 👍").
   - Action buttons `INVITE` and `ASSIGN` render properly in thumb zone.
   - Evidence: `docs/agents/reports/G124-walk/g124-teacher-home.png`.
2. **Cloud Functions Status:**
   - **`DEPLOY NEEDED: functions remindAssignment, onQuestProgressForClass`**
   - The code for throttling (comparing `levels`, `mistakes`, and `completed`), storing completed topic IDs (not step keys), and formatting reminders is tested and committed on `gemini/g87-results`. The cloud deployment will be done by owner/Claude.

---

## 4. G120 Walk Checks (Home Tidy-up Fixes)
1. **Daily Swipe Card (Top of Screen):**
   - Renders `⭐ Today: N · this week: M` banner at the top of Home.
   - 3-slide pager with tab pills: `[ Thought | Word | Fact ]` and ✕ close button.
   - Smoothly cycles between inspirational thought, vocabulary word (with audio hear button and "I knew it" / "New for me" chips), and daily fact.
   - Evidence: `docs/agents/reports/G124-walk/g124-home.png`, `docs/agents/reports/G124-walk/g124-kid-home.png`.
2. **Practice Paper Tile Placement (Check-up):**
   - Positioned directly under the DailySwipeCard (NOT folded into Explore).
   - Renders with icon, "Your Accuracy in every topic · 49 min", and play button.
   - Evidence: `docs/agents/reports/G124-walk/g124-home.png`, `docs/agents/reports/G124-walk/g124-kid-home.png`.
3. **Classmate Banner Removed:**
   - Completely absent from Home screen (verified on both kid and adult accounts).
4. **Folded Sections:**
   - Folded Owner row: `👑 Owner · 1 to review · 2 new · 5 stuck ›` with distinctive gold border.
   - Focus child selector: Displays focused child Ananya with `+1 more ›` to toggle between children.
   - Quests folded cleanly into `Practise yourself 5 ›`.
   - Evidence: `docs/agents/reports/G124-walk/g124-home.png`, `docs/agents/reports/G124-walk/g124-teacher-home.png`.
5. **Floating CONTINUE Bar:**
   - Fixed `paddingBottom: 12` ensures the bar floats directly above the bottom tab bar without obscuring content or overlapping gestures.
6. **Theme Testing (Light & Dark):**
   - Both Dark theme and Light theme render flawlessly with perfect contrast.
   - Evidence: `docs/agents/reports/G124-walk/g124-kid-home-light.png` (Light) and `docs/agents/reports/G124-walk/g124-kid-home.png` (Dark).

---

## 5. Walk Evidence Files
All walk screenshots captured directly from the OnePlus 9 Pro are preserved in `docs/agents/reports/G124-walk/`:
- `g124-home.png` — Owner Home (DailySwipeCard, Check-up, gold Owner row, focus child)
- `g124-teacher-home.png` — Teacher Home (Class cards with Assign/Invite, focus child +1 more)
- `g124-kid-home.png` — Kid Home in Dark theme (DailySwipeCard, Check-up, From your teacher, Continue bar)
- `g124-kid-home-light.png` — Kid Home in Light theme
- `g124-me-grownup.png` — Grown-up Me screen (clean, no linking nag, child profiles)
- `g118-1-kid-me.png` — Kid Me screen with +100 ⭐ link card
- `g118-2-leaderboard-lock.png` — Locked leaderboard for unlinked kid
- `g118-3-link-parent-screen.png` — Link screen with 6-character code
- `g118-4-adult-me.png` — Adult Me screen
- `g118-5-adult-leaderboard.png` — Unlocked adult leaderboard

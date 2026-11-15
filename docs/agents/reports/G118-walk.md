# G118 Walk Report: G113 Fixes (Linking Rewards & Grown-Up Learner Safety)

**Task:** G118 · G113 fixes (linking rewards & grown-up safety)  
**Branch:** `gemini/g113-linking` (in `/Users/mohitchilkoti/Documents/projects/apprec8-gemini`)  
**Phone Walk Device:** Physical OnePlus 9 Pro (`2ae01cda`, Android 14 / OxygenOS)  
**Metro Bundler:** `http://localhost:8081`  
**Walk Date:** 15 Nov 2026, 21:58 IST  

---

## 1. Summary of Changes

1. **Grown-ups Must Never Be Blocked or Nagged (`isStudentAccount`):**
   - Implemented single unified pure helper `isStudentAccount(doc)` in `utils/family.js` and identical logic in `functions/utils/family.js`:
     ```javascript
     export function isStudentAccount(doc) {
       if (!doc) return false;
       return (
         !!doc.isChild ||
         (Number.isInteger(doc.grade) &&
           !doc.selfLearner &&
           !doc.isParent &&
           !(doc.childUids || []).length &&
           !(doc.teachesClassIds || []).length)
       );
     }
     ```
   - Server blocks only student accounts when creating a parent link code (`functions/callable/familyActions.js`):
     ```javascript
     if (isStudentAccount(meData) && !meData.isChild) {
       throw new functions.https.HttpsError(
         "permission-denied",
         "This account is set up as a student. If you're a parent, tap Need help on Me and we'll fix it."
       );
     }
     ```
   - `MeScreen.js`: "Link with your parent: +100 ⭐" card is displayed only when:
     `isStudentAccount(userData) && !(userData?.parentUids || []).length`
   - `LeaderboardScreen.js`: Leaderboard is locked only when:
     `isStudentAccount(userData) && !(userData?.parentUids || []).length`
2. **One-Time Bonus Guarantee:**
   - In `redeemParentLinkCode` (`functions/callable/familyActions.js`), +100 stars and `linkBonusAt` timestamp are set only if `!kidData.linkBonusAt`. Linking with a second parent preserves existing stars without duplicate bonus.

---

## 2. Test Verifications

`npm test` passing 100% across all 60+ suites:
- `tests/family.test.mjs`:
  - `selfLearner` with grade 5 is NOT student
  - Parent with grade is NOT student
  - Teacher with grade is NOT student
  - Parent with `childUids` is NOT student
  - Kid with grade 5 IS student
  - Child profile (`isChild: true`) IS student
- `tests/linkingRewards.test.mjs`:
  - Client and functions `isStudentAccount` logic verified identical.
  - Bonus award verified: first time child gets 100 stars; subsequent link yields 0 bonus.
  - Leaderboard lock verified: unlinked kid is locked; linked kid is unlocked; grown-ups/self-learners are never locked.
  - Me tab card visibility verified: unlinked kid sees card; linked kid and grown-up learners do not.

---

## 3. Physical Phone Walk Verification (PASS)

The phone walk was executed on the physical OnePlus 9 Pro (`2ae01cda`):

### Evidence Screenshots:
1. **Unlinked Kid Me Screen (`g118-1-kid-me.png`):**
   - Viewing as Kid (Class 5): "Link with your parent: +100 ⭐" card is displayed under "Need help? Talk to someone".
2. **Unlinked Kid Leaderboard Lock (`g118-2-leaderboard-lock.png`):**
   - Progress -> Leaderboard shows lock card:
     `🔒 Link with your parent to join the leaderboard`
     `Connect with your parent to see where you stand with classmates, cheer on friends, and earn +100 ⭐ bonus stars!`
     Button: `Link with parent · +100 ⭐`.
3. **Link Parent Screen (`g118-3-link-parent-screen.png`):**
   - Tapping the lock card button opens `Link to my parent` with the 6-character code input field.
4. **Grown-Up / Parent Me Screen (`g118-4-adult-me.png`):**
   - Grown-up account: "Link with your parent: +100 ⭐" card is NOT shown; direct access to `MY CHILDREN` section.
5. **Grown-Up / Parent Leaderboard Unlocked (`g118-5-adult-leaderboard.png`):**
   - Progress -> Leaderboard opens directly to the class leaderboard with full podium (Reyansh, Meera, Isha) and rankings; no lock card.

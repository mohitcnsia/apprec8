# Pending deploys (owner OK needed) — 2026-11-04

Everything below is already in the code on `feat/quiz-redesign`. Nothing works in the app until it's deployed; nothing
else breaks meanwhile. Gemini (devops) can run it after the owner says OK. Details: `CODE_REVIEW.md` → DR-8, DR-9, DR-10.

**Before:** back up the live rules (`firebase firestore:rules:get` or copy `firestore.rules`; a copy from 2026-11-04 is in
`~/apprec8-backups/`). Firebase Console also keeps rule history (one-click rollback).

| # | What it switches on | Steps |
|---|---|---|
| **DR-8** | Leaderboard: first name + class only, preset avatars only (no real photos) | `firebase deploy --only functions:getLeaderboard` |
| **Finding 22** | Kids can't edit their own stars / fixed info | Add the `hasOnly([...])` line to the profile rule (CODE_REVIEW.md → Finding 22), deploy rules |
| **DR-9** | Schools, classes, join codes, teacher approval, teacher view, assignments, class board + claps | 1. Merge `docs/rules/rb2-classes.rules` into `firestore.rules` (instructions inside). 2. Deploy functions: `findUserByEmail, assignTeacher, approveMember, getClassLeaderboard, clapForClassmate`. 3. Deploy rules. 4. Console: create `roles/<SeemaUid>` = `{ admin: true }` (after she signs in once). |
| **DR-10** | Parent-first accounts: add a child, "Play as" with parent PIN, child login codes | 1. Merge `docs/rules/rb6-family.rules`. 2. Deploy functions: `createChildProfile, newChildLoginCode, redeemChildLoginCode, deleteChildProfile, setParentPin, switchToChild, switchToParent` + the updated `initializeNewUser` trigger. 3. Google Cloud IAM: give the functions' service account the **Service Account Token Creator** role. 4. Deploy rules. |

**One command for all functions:** `firebase deploy --only functions` (deploys every function; fine, they're all backward compatible).

**After:** the next app build (20.0.28) has the screens. Test list: `docs/qa/OWNER_TESTING.md` → "Next build (20.0.28)".

# Deploys: owner approved 2026-11-04 → Gemini task G27

> **Status 2026-11-04 21:46: DEPLOYED** (all functions + rules; report `docs/agents/reports/G27.md` in Gemini's folder).
> **Left for the owner:** DR-10 step 3 (IAM role, below: `apprec8-ca229@appspot.gserviceaccount.com` → Service Account Token
> Creator, in Google Cloud Console → IAM & Admin → IAM → edit that account → Add role) and DR-9 step 4 (Seema's `roles` doc, after she signs in).

Claude has merged all rule changes into `firestore.rules` (backup in `~/apprec8-backups/firestore.rules.before-DR9-10`).

Everything below is already in the code on `feat/quiz-redesign`. Nothing works in the app until it's deployed; nothing
else breaks meanwhile. Gemini (devops) can run it after the owner says OK. Details: `CODE_REVIEW.md` → DR-8, DR-9, DR-10.

**Before:** back up the live rules (`firebase firestore:rules:get` or copy `firestore.rules`; a copy from 2026-11-04 is in
`~/apprec8-backups/`). Firebase Console also keeps rule history (one-click rollback).

## DR-11 · Teacher invites without email (mockup L, owner-approved 2026-11-05) · **waiting for owner OK to deploy**

New callable functions in `functions/callable/schoolActions.js`: `createTeacherInvite`, `redeemTeacherInvite`, `classTeam`,
`decideTeacherRequest`. **No rules change** (the new `invites` and `classes/*/teacherRequests` data is server-only: no client rule
matches it, so phones can't read it). Backward compatible: old app versions never call them.

**Deploy:** `firebase deploy --only functions:createTeacherInvite,functions:redeemTeacherInvite,functions:classTeam,functions:decideTeacherRequest --project apprec8-ca229`
**Until then:** the new Schools screens work, except "Share invite" (says it couldn't make the invite) and teacher names on the
class page ("names show after the next server update").

## Owner: the IAM step, click by click (~3 min, on the laptop)

Why: "Play as <child>" and child login codes sign the child in with a special token. Firebase can only make that
token if its server account has permission to "create tokens". Without it those two features fail; everything else works.

1. Open **https://console.cloud.google.com/iam-admin/iam?project=apprec8-ca229** and sign in with mohitchilkoti@gmail.com.
2. Top of the page: check the project picker says **apprec8-ca229**.
3. In the list (tab **"View by principals"**), find the row
   **apprec8-ca229@appspot.gserviceaccount.com** (name: "App Engine default service account").
   Not in the list? Tick **"Include Google-provided role grants"** (top right of the table).
4. On that row, click the **pencil** icon (Edit principal) at the right end.
5. Click **"+ Add another role"**, type **Service Account Token Creator** in the role box, pick it.
6. Click **Save**. Done; it works within a minute (no app update, no deploy).
7. Test on the phone: Me → add a child (or "Play as"), enter your PIN. If it still says "permission", tell Claude.

| # | What it switches on | Steps |
|---|---|---|
| **DR-8** | Leaderboard: first name + class only, preset avatars only (no real photos) | `firebase deploy --only functions:getLeaderboard` |
| **Finding 22** | Kids can't edit their own stars / fixed info | Add the `hasOnly([...])` line to the profile rule (CODE_REVIEW.md → Finding 22), deploy rules |
| **DR-9** | Schools, classes, join codes, teacher approval, teacher view, assignments, class board + claps | 1. Merge `docs/rules/rb2-classes.rules` into `firestore.rules` (instructions inside). 2. Deploy functions: `findUserByEmail, assignTeacher, approveMember, getClassLeaderboard, clapForClassmate`. 3. Deploy rules. 4. Console: create `roles/<SeemaUid>` = `{ admin: true }` (after she signs in once). |
| **DR-10** | Parent-first accounts: add a child, "Play as" with parent PIN, child login codes | 1. Merge `docs/rules/rb6-family.rules`. 2. Deploy functions: `createChildProfile, newChildLoginCode, redeemChildLoginCode, deleteChildProfile, setParentPin, switchToChild, switchToParent` + the updated `initializeNewUser` trigger. 3. Google Cloud IAM: give the functions' service account the **Service Account Token Creator** role. 4. Deploy rules. |

**One command for all functions:** `firebase deploy --only functions` (deploys every function; fine, they're all backward compatible).

**After:** the next app build (20.0.28) has the screens. Test list: `docs/qa/OWNER_TESTING.md` → "Next build (20.0.28)".

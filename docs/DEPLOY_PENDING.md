# Deploys: owner approved 2026-11-04 → Gemini task G27

> **Status 2026-11-04 21:46: DEPLOYED** (all functions + rules; report `docs/agents/reports/G27.md` in Gemini's folder).
> **Left for the owner:** DR-10 step 3 (IAM role, below: `apprec8-ca229@appspot.gserviceaccount.com` → Service Account Token
> Creator, in Google Cloud Console → IAM & Admin → IAM → edit that account → Add role) and DR-9 step 4 (Seema's `roles` doc, after she signs in).

Claude has merged all rule changes into `firestore.rules` (backup in `~/apprec8-backups/firestore.rules.before-DR9-10`).

Everything below is already in the code on `feat/quiz-redesign`. Nothing works in the app until it's deployed; nothing
else breaks meanwhile. Gemini (devops) can run it after the owner says OK. Details: `CODE_REVIEW.md` → DR-8, DR-9, DR-10.

**Before:** back up the live rules (`firebase firestore:rules:get` or copy `firestore.rules`; a copy from 2026-11-04 is in
`~/apprec8-backups/`). Firebase Console also keeps rule history (one-click rollback).

## DR-14 · Cost guard 3: dashboard reads only the chosen quest · **deployed 2026-11-05 (Gemini G32)**; run the backfill once more after the next publish

Why: the admin dashboard read every kid's progress for EVERY quest, then kept one quest (≈ kids × 4 reads per open).
Now progress docs carry a `questId` field and the dashboard asks only for that quest (≈ 1 read per kid).
Code is safe before the deploy: the app falls back to the old read until the index exists.
Steps (Gemini, once the owner says OK), from Claude's folder:
1. `firebase deploy --only firestore:indexes --project apprec8-ca229` (adds one index: questProgress.questId). If the CLI
   asks to DELETE indexes that are not in the file, answer **No** and report.
2. `node scripts/admin/backfillQuestId.cjs` (dry run: today 2 docs), then `node scripts/admin/backfillQuestId.cjs --apply`.
3. Report both outputs. App side ships with the next over-the-air update (owner's "publish").
4. After that publish: run the backfill once more (`--apply`). A phone still on the old app could start a new quest
   between the two runs, and that doc would have no `questId`, so the dashboard would not show it.

## DR-13 · Cost guard 2: cache the leaderboards · **deployed 2026-11-05 (Gemini G30)**

Why: the class board read 1 doc per kid per quest on every open (a class of 40 ≈ 200 reads per open; one busy class could
use most of the free 50,000 reads/day). Now: computed at most once per 10 min per class and kept in a server-only doc;
most opens cost ~2 reads. The "Everyone" board: same (10 min), and the row count is capped at 50 (the app could ask for
any number before). Also: Treasure Words now counts for class points; approving a kid refreshes the class board at once.
What kids notice: points on the boards can be up to 10 min behind. No app update, no rules change.
On OK: Claude merges into `feat/quiz-redesign`; Gemini deploys with G30 (`firebase deploy --only functions`).

## DR-12 · Cost guard: cap every function at 10 running copies (long admin jobs: 2) · **deployed 2026-11-05 (Gemini G30)**

Why: today nothing limits how many copies of a function can run, so a bug, a loop or someone spamming the app could
grow the bill without limit. `functions/common/config.js` now sets `maxInstances` for every function (all use it).
No app change, nothing for users to notice at today's size. Deploy (Gemini, once the owner says OK):

```
cd functions && node -e "require('./index.js')" && cd .. && firebase deploy --only functions --project apprec8-ca229
```
Then `firebase functions:list --project apprec8-ca229` and report.

## Owner: budget alert, click by click (~3 min, on the laptop)
A budget only **emails you**; it never stops the app. With DR-12 it is the safety net against surprise bills.
1. Open **https://console.cloud.google.com/billing/budgets** (signed in as mohitchilkoti@gmail.com) → pick the billing
   account that pays for apprec8-ca229.
2. **+ Create budget** → Name `apprec8 monthly` → Projects: **apprec8-ca229** → Next.
3. Budget type **Specified amount** → **₹1,000** (monthly) → Next.
4. Alert thresholds: **50%, 90%, 100%** (actual) and add **100% forecasted** → tick "Email alerts to billing admins".
5. **Finish.** If an alert email ever comes, forward it to Claude before doing anything else.

## DR-11 · Teacher invites without email (mockup L, owner-approved 2026-11-05) · **owner OK to deploy 2026-11-05 → Gemini G29**

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

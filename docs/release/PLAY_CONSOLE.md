# Play Console: from internal testing to closed testing to production (Claude, 2026-11-05)

Draft answers for the owner. Check each answer against the app before submitting; Google can reject or suspend apps
for wrong declarations, especially apps for children.

## 1. Does the "12 testers for 14 days" rule apply to us? (2 minutes)
Google requires it for **personal** developer accounts created **after 13 November 2023**.
- Play Console → ⚙️ Settings → Developer account → Account details: is the account type **Personal** or **Organisation**?
- Or open Play Console → Dashboard: if it shows **"Apply for production access"** or "Run a closed test", the rule applies.

If it applies: at least **12 testers must stay opted in to a closed test for 14 days in a row**, then you apply for
production access (a short form about the test). **Internal testing does not count**, only closed testing.

## 2. Internal vs closed testing
| | Internal testing (today) | Closed testing |
|---|---|---|
| Who | up to 100 testers, email list | any number; email lists **or a Google Group** |
| Google review | none, live in minutes | yes, usually hours to a few days |
| Forms needed | none | the "App content" forms below |
| Counts for the 12/14 rule | no | **yes** |

**Plan:** start Seema's pilot on internal testing now (it works the same way, as you said). In parallel, open a closed
test with the same build. Once Google approves it, move the pilot group to the closed test. The 14 days start when
12 testers have opted in.

## 3. Open the closed test (about 30 minutes, after the forms)
1. Testing → Closed testing → **Create track** (or use "Closed testing - Alpha").
2. Testers tab → **Google Groups** → add the pilot group (e.g. `apprec8-pilot@googlegroups.com`); students join the
   group first with the Google account they use on their phone. Add family and teachers too, to reach 12 quickly.
3. Countries: India.
4. Releases → **Promote release** from internal testing (same `.aab`, no new build).
5. Send for review. After approval, copy the **opt-in link** and share it with the group.
6. Remote Config `update_url_android` → the Play Store link (A8).

## 4. "App content" forms: draft answers
**Updated in Play Console 2026-11-06 (owner + Claude):** Sign in details = Parent / Teacher / Student demo logins with
one shared note ("Use email instead"); target ages 6–8, 9–12, 13–15, 16–17, 18+ (not 5 and under: no pre-reader
content yet); Data safety = Name, Email, User IDs, App interactions, Other user-generated content (optional), Device or
other IDs; all collected, none shared, App functionality (+ Account management for the 3 personal ones). The other 6
declarations from May 2025 were still right.
Policy → App content. Each one must say "Completed".

**Privacy policy:** `https://failedcommit.github.io/app-policies/privacy-policy.html` (rewritten 2026-11-06 to match the app; live once C1 is done).
**Delete account URL** (Data safety asks for it): `https://failedcommit.github.io/app-policies/data-deletion-policy.html`.

**App access:** "Some functionality is restricted" → give the Demo School logins (Admin tools → Reset Demo School; DR-16 is live)
(`demo.teacher@example.com`, `demo.parent@example.com`, `demo.kid@example.com` + password, written only in Play
Console). Until then, a tester account the owner controls.

**Ads:** No, the app has no ads.

**Content rating (IARC questionnaire):** Category: Reference, News or Educational. Violence, sex, language, drugs,
gambling: none. Users can interact or exchange content: **No** for children (tap-only); adults can send feedback to us
only, not to other users. Shares location: no. Digital purchases: no (today). Expected: rated for everyone (3+).

**Target audience and content:** ages include **under 13** (6–8, 9–12, 13–15, 16–17; add 18+ only if teachers and
parents count, which they do → include 18+). This puts the app under the **Families policy**: no ads SDKs, no
precise location, no device IDs for ads, child-friendly content, a privacy policy. We meet these today.
"Could the app unintentionally appeal to children?": not asked once under-13 is selected.

**Data safety** (what the app collects; nothing is sold or shared for ads):
| Data type | Collected | Why | Optional? |
|---|---|---|---|
| Name (first name; adults' full name from Google) | yes | account, class lists | required |
| Email address | yes | sign-in | required (child profiles made by a parent have none) |
| User IDs | yes | account | required |
| Photos | Google profile photo URL (adults); children see only preset avatars | account | — |
| App activity: in-app actions (quiz answers, scores, time spent) | yes | app functionality, progress reports for the child, parent and teacher | required |
| App info and performance: crash logs | **no** (no crash reporting yet; change this when B7 adds it) | | |
| Device or other IDs | yes (Firebase installation ID used by Remote Config; from 20.0.30 a notification token for parents/teachers who turn on the weekly summary) | app functionality | required (token: optional) |
| Other: parent's name + relation in the consent record | yes | consent (DPDP) | required to join a class |
- Shared with third parties: **No** (Google Firebase is our processor, which counts as a service provider, not sharing).
- Encrypted in transit: **Yes** (HTTPS).
- Users can request deletion: **Yes** (in-app Me → Delete my account, parents: Delete a child's profile; + the deletion web page). Data is deleted, not just hidden (DR-19).
- Committed to the Families policy: Yes.

**Government app / Financial features / Health / News / COVID:** No / No / No / No / No.

## 5. Before the full Families review (production), not needed for closed testing
- **Done in 20.0.30:** the release manifest asked for `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE` and `SYSTEM_ALERT_WINDOW`
  (`android/app/src/main/AndroidManifest.xml`). A children's app should not ask for permissions it doesn't use:
  remove them in the next native build (Claude checks nothing uses them first).
- Store listing: short and full description, 2+ phone screenshots, feature graphic, app icon (Claude drafts the text).

## 6. Apply for production access (after 14 days, only if the rule applies)
Google asks: how testers were recruited, what feedback came in, what changed, whether the app is ready. Seema's pilot
answers all of it: keep a short log of feedback and fixes during the pilot (CODE_REVIEW.md already has it).

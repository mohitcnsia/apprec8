# C5 + C9 step by step (Claude, 2026-11-06)

**Status (10 Nov):** C5 done, C9 done (6 Nov). 20.0.30 is **in Google's review** on the closed track (managed
publishing is on: when approved, Play Console → Publishing overview → **Publish**). C10 testers: you add people once
the app is ready from our side. The steps below stay for reference (and for the next app).


Do C5 first (C9 needs its logins). Use a laptop for C9: Play Console forms are hard on a phone.
If anything looks different from these steps, stop and ask Claude (a screenshot helps).

## C5 · Demo School logins for Google's reviewer (5 minutes, in the app)
Google's reviewer must sign in to see a parent's and a teacher's screens. The Demo School gives them fake accounts
(no real children).
- [ ] Pick a password for the demo logins, e.g. 3 words + a number (`MangoRiverKite42`). Write it down: you type it again in C9.
- [ ] Apprec8 → Me → Admin tools → **DEMO SCHOOL** card → type the password → **RESET DEMO SCHOOL** → confirm.
- [ ] Wait for "Done" (~30 seconds). The logins are `demo.teacher@example.com`, `demo.parent@example.com`, `demo.kid@example.com`, all with your password.
- [ ] Optional check: sign out, sign in with "Use email instead" as demo.parent → you see a parent with a child. Sign back in as yourself.

## C9 · Play Console → App content (about 45 minutes, laptop)
Open play.google.com/console → Apprec8 → left menu **Policy and programs → App content**. Do each card below and
press **Save** on each page. When every card says ✓, C9 is done. The answers are already checked against the app.

**1. Privacy policy** → paste `https://failedcommit.github.io/app-policies/privacy-policy.html` → Save.

**2. Ads** → "No, my app does not contain ads" → Save.

**3. App access** → "All or some functionality is restricted" → **Add instructions** three times:
- Name "Parent", username `demo.parent@example.com`, password = yours, note: "Sign in with 'Use email instead'. Shows a parent with a linked child: Progress → family."
- Name "Teacher", `demo.teacher@example.com`, note: "Progress → classes: a class with students, assignments."
- Name "Student", `demo.kid@example.com`, note: "Home → quests; Progress."
→ Save.

**4. Content rating** → Start questionnaire → email: yours → Category **"Reference, News, or Educational"** →
answer **No** to every violence, fear, sex, language, drugs, gambling question. "Can users interact or exchange
content?" → **No** (children only tap; no chat). "Does the app share the user's location?" → No. "Digital purchases?" → No.
→ Save → **Submit**. Expect "Everyone / 3+".

**5. Target audience and content** → tick ages **5 and under? No**; tick **6–8, 9–12, 13–15, 16–17, 18 and over** →
Next. "Appeals to children" is then assumed. Store presence: "Yes, my app is designed for children" if asked → Save.
(This puts us under Google's Families policy: no ads, no precise location, a privacy policy. We meet all of it.)

**6. Data safety** (the longest; ~20 minutes) → Next through each page:
- Does the app collect or share user data? **Yes**. Is all data encrypted in transit? **Yes**.
  How can users request deletion? **"Users can request that data be deleted"** → URL `https://failedcommit.github.io/app-policies/data-deletion-policy.html`.
- Data types, tick only these:
  - **Personal info → Name** and **Email address**: Collected ✓, Shared ✗, required, purpose **App functionality** + **Account management**.
  - **Personal info → User IDs**: same answers.
  - **App activity → App interactions** ("quiz answers, scores, time"): Collected, not shared, required, App functionality.
  - **Device or other IDs**: Collected, not shared, **optional** (notification token), App functionality.
  - **Photos and videos**: leave unticked. The app never uploads or stores photos: children pick preset avatars, and
    for adults we keep only a link to their Google account picture.
- For each ticked type: "Is this data processed ephemerally?" No. "Is collection required?" as above.
- Preview → Save → **Submit**.

**7. Government apps** No · **Financial features** None · **Health** None · **News** No · **COVID-19** No →
Save each.

**8. Families: "Comply with the Families policy"** (if a card asks) → tick that you've read it → Save.

When all cards are ✓: tell Claude "C9 done". Next: C10 (Google Group) and C11 (promote 20.0.30 to closed testing).

## C10 · 12+ testers in a Google Group (15 minutes to set up)
Testers = the grown-up whose Google account is on the phone (parents, family, friends, Seema and colleagues). Children
under 13 can't join Google Groups. Everyone with an Android phone already has the Google account (Play Store →
profile picture). A test app can't be found by search: testers need the links.
- [ ] groups.google.com → Create group: name "Apprec8 testers", email `apprec8-testers`. Who can join: anyone on the
  web. Who can see members / post / view conversations: **group managers only** (testers never see each other's emails).
- [ ] Play Console → Test and release → Testing → Closed testing → Apprec8 → **Testers** → Google Groups →
  `apprec8-testers@googlegroups.com` → Save. Copy the **Join on the web** link (opt-in link).
- [ ] WhatsApp message: 1) join the group (groups.google.com/g/apprec8-testers), 2) the opt-in link → Become a tester,
  3) install: https://play.google.com/store/apps/details?id=com.mohitchilkoti.apprec8 . "Please stay 2 weeks."
- [ ] Aim for 15–16 people: Google's 14-day clock needs 12 opted in, without a break. Opting in counts, not installing.

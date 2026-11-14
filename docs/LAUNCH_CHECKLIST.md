# Launch checklist (updated 2026-11-11)

Two steps: **A. Seema's class pilot** → **B. public release**. Done steps and old notes: docs/history/LAUNCH_CHECKLIST_LOG.md.

## 📍 Where we are (12 Nov)
- **How students join (Seema's guide, messages to paste, Class 7):** https://claude.ai/artifact/RaQCrzE8k1ZPghSz1TXkRt
- **Sign-up and consent, server side:** the 38-check emulator test passes (parent join, consent record, student join, no approval without the parent's yes, Not sure, follow-up list). The phone side is tested in the E2E test (steps 3–5).
- **Your tests are cards now:** Me → Decisions (YES works · NO broke, say which step · MORE DETAILS · LATER).
- **Test next:** a student joins Seema's class from the class link, on your second phone (brand-new Google account, 15-year-old birthday).
- **Ready to publish (say "publish"):** word and fact of the day on kids' Home · Owner extras off by default · you always see every quest.
- **Agreed, not built yet:** Simpler Home, Progress and Me (https://claude.ai/artifact/RWQn8euh8aakH6LJhjzJks). First build: topic levels + one summary per class.
- **Next full app build:** 5 pm word reminder + crash reporting.
- **Your phone gets no alerts yet:** Me → Decisions → "Notify me on this phone".

## 🅿️ Parked (agreed, not built yet; review together once joining works)
Core flow now: deploy → publish → walk on the phone (kids join a class in the app, learn at once; classmates after the teacher confirms).
1. **Deletion (owner, 12 Nov):** no automatic deletion. "Delete my account" → kept 90 days, a pending decision on your Home, erased only by your tap. Delete scripts locked today.
2. **Class 7 exam 15 Nov:** Paper 3 + more topic questions (Papers 1–2 are live).
3. **Empty screens say why** (Fable): "Pick your class to see your quests", "Your class course opens once…".
4. **Kids can't type:** the student join form still asks a roll number + parent's mobile. Keep, shorten or drop?
5. **Parents' yes for kids on their own phone:** Seema confirms in one batch later (consent record).
6. **People screen** (owner, 12 Nov: "who joined, who they are, what they did"): search, Stuck list, person page with Help buttons; nothing deletes. Mockup in the sign-ups doc, waiting for your answers. Next after the walk.
7. **Full name on "Join your class" (owner, 12 Nov):** only on that form, never at sign-up. Wording: "Your full name, so {Teacher's name} (Teacher) knows it's you. Required to join the class." Last name kept only on the join request (teacher-only), removed when the teacher confirms or removes the child, or after 30 days. Plus a one-time "What should we call you?" card for older accounts with no first name (they show as "Learner").
8. **Fable plan:** delete the old code screens; retire V1 quizzes + old Space path; apply for production after 14 days (you).

## 📥 From the reports review (13 Nov: 62 items read, all closed in Ideas & reports)
Fixed already or today: Pratha's grammar flags (IEO fixes), reading options invisible, mistakes count stuck at 5, "Send E-mail Coming
Soon", reports row in View as, practice explanation text bigger (15 → 17). Answers checked and right: digestion finishes in the
small intestine, a seed needs water, cheetah "!", "I wonder…" = statement, horse–mare (explanation names the stallion too).
To do (small, next walk):
- Dashboard (Progress → Kids): pull down to refresh doesn't reload (owner 10 Nov) — check on the phone; likely the list sits inside another scroll.
- Gender practice: "48/50, 33 in a row" keeps counting past 50 (owner 9 Nov) — say what the number means, or stop at the goal.
- Practice paper list: highlight the paper in progress, not Paper 1 (walk 13 Nov).
- New parent's Home: "Add your child" card on top (walk 13 Nov).
- Kid's Me: "My class" row wraps badly (walk 13 Nov).
- View as: Home scrolls to the top when switching (walk 13 Nov).
- Stars earned today / last 24 h on Progress (owner 13 Nov).
Content (Seema / Claude):
- Science Class 5: more on rabi and kharif crops (Pratha 10 Nov: "not enough content").
- English Grammar Pro: "Time and Place Shifts" card (reported speech) marked confusing (9 Nov) — Seema to look.
Waiting for decisions (cards in your inbox): Home tidy-up (mockup), delete our own test accounts from People.
Already planned: see what happened to my feedback = two-way cards (G89).
Closed without a change: May–June reports on old quizzes (hidden for everyone but you), test notes, emoji-only notes.

## 🌏 Owner's ideas, 14 Nov (parked; plan + mockup before building)
- **Hindi everywhere ("a massive success factor")**: app text, notifications and the WhatsApp/Email nudges in Hindi, picked
  on first run (English · हिंदी). Start with what grown-ups read (first run, join, parent screens, nudges), then kids' UI.
- **Quests for Indian elders (roots and history)**: Ramayana, Mahabharata, Gita, Indian history and festivals, in Hindi with
  read-aloud. Books like Gita Press and Ami Ganatra's are inspiration only: their translations and text are copyrighted, so
  every line and question is written fresh (the Sanskrit originals themselves are public domain). Kamla and Mohan
  (no English) are the first users to test with.
- **Stuck-person nudge**: when someone who picked nothing opens the app, one easy question (in their language) → a star →
  "Who are you? Student · Parent · Teacher". Push needs a phone token, which stuck people don't have yet, so until then
  the WhatsApp button (People) is the way.
- **Chess board colours** (owner: ignore for now).

## Road to production (open steps)
| # | Step | State |
|---|---|---|
| C10 | 12+ testers opted in for 14 days | 11 Nov: you opted in, 3 testers added, 15 family adults invited. Under-13s can't be testers |
| C11 | Closed testing 20.0.30 | approved; then Dashboard → Apply for production after the 14 days |
| C7 | Store screenshots | before public release: redo Home (0 stars, empty card) and Me (shows the test email) |

## A. Seema's Class 10 pilot (closed testing on Play)
| # | Item | Who | State |
|---|---|---|---|
| A1 | **Class 9–10 English content** (CBSE): tenses, modals, subject–verb agreement, determiners, reported speech, active/passive, editing & omission, gap filling, case-based reading. Seema names the topics + order; Claude writes; Seema reviews. Hide English Quest Units 0–2 from Classes 9–10. | Seema → Claude | **done**: Grammar Pro 1–6 (666 Qs, Classes 9–10), live after the English re-seed |
| A2 | ~~Class 10 practice papers~~ dropped (owner: grammar only for the pilot) | — | dropped |
| A3 | **Teacher dry run**: Seema creates the school + class (Admin tools → Schools & classes), 2 test students join with the code, she approves, assigns a topic, sees progress + class leaderboard | Seema + owner | **through guide quests** (mockup row W): owner and Seema learn by doing |
| A4 | **Parent consent**: students are under 18. In-app consent at "Join a class" (EN/HI) is the consent: no paper form (owner 2026-11-06: principals won't do it). Optional: Hindi voice note in a parents' WhatsApp group; 🔊 Listen on the consent note (inbox question) | Seema / school | in-app ready |
| A5 | **"Need help?" sheet** (mockup P1–P2: 1098, Tele-MANAS 14416) before teens use it; Seema finalises the wording | Seema → Claude | **built 2026-11-05** (Me tab, everyone); Seema refines words later |
| A6 | **Distribution** (steps + form answers: [release/PLAY_CONSOLE.md](release/PLAY_CONSOLE.md)): start on internal testing (≤100, works today); in parallel Play Console → Closed testing → testers = the 50 students' Google accounts (or a Google Group) → opt-in link. Upload the latest build there | Owner | not done |
| A7 | **Privacy policy page + "delete my account" web page** (public URLs; Play asks for both) | owner | **exists** (owner 2026-11-05); Claude to check it mentions classes, teachers, parent consent, attempts |
| A8 | Remote Config `update_url_android` → the Play link the students use (today: internal-testing link) | Owner | pending |
| A10 | **Demo School** (fake class for Seema to try the teacher screens + Play reviewer login): generator done; server function, filters, Admin button after Gemini's review; deploy by Gemini/owner | Claude → Gemini | in progress |
| A11 | **Assignment done = mistakes fixed**; teacher sees results **by name** with **Accuracy**; **Remind** a child (owner 2026-11-09) | Gemini (G87, G84b) → Claude review | todo (Check-up by topic with names: done 10 Nov) |
| A13 | **Seema's 6 decisions** (pilot plan doc): consent rule, assigned work first, pilot switch, check-up | Claude (G90, G91) | **done, published 10 Nov**; weekly report G92 + two-way cards G89: Gemini |
| A12 | ⭐ **Class report for school management, pilot week 2 (owner: don't forget)**: active kids, Accuracy start vs now per topic, mistakes fixed, printable | Mockup → owner → Gemini (G88) | todo, week 2 |
| A14 | ⭐ **Learning-only until the family link is approved (owner, 13 Nov; was B9)**: kids join on a parent's Gmail. A student account with no approved parent link sees learning only (quests, practice, class, own Progress, Need help); Add a child, parent codes, a child's week wait for the link. "I'm the parent on this phone": grown-up check (year of birth 18+) → the child's progress moves into a child profile → parent agrees in the app. Server refuses child profiles / parent codes from student accounts. Spec: sign-ups doc, "Added 13 Nov: learning-only" | Claude spec → owner → build | spec written, 3 questions in Decisions |
| A15 | **DPDP deletion (owner, 13 Nov: agreed)**: "Delete my account" → 30 days to undo ("erased on <date> · Keep my account"), then erased by the server unless the owner keeps it; owner still sees each request and can erase sooner. Then privacy policy text (parked, owner publishes): section 8 window + what is kept; section 5 pilot WhatsApp YES; section 4 teacher sees waiting child's first name + roll no. | Claude spec → build; owner publishes policy | todo |
| A9 | Cost check: 50 students ≈ 15,000 reads/day at most (free tier 50,000), writes far below 20,000. Budget alert in place | done | ok |

## B. Public release (after the pilot)
| # | Item | Who |
|---|---|---|
| B1 | **Families policy** (the app is for children): check every SDK we ship (Firebase etc.) is allowed in Families apps; no ads | Gemini G11 research → Claude |
| B2 | Play Console: Data safety form, content rating, target audience (age groups), App access (a demo login for reviewers), store listing (screenshots, short text) | Owner (Claude drafts text) |
| B3 | **DPDP Act (India)**: verifiable parental consent for under-18s, data minimum, deletion on request, a grievance contact. Our parent-first + consent records follow it; get a short legal check before scale | Owner (+ lawyer once) |
| B4 | **Safeguarding plan (RB-8)**: who reads reports, how fast, when to call parents / 1098 | Seema leads |
| B9 | (moved to the pilot as A14, 13 Nov) ⭐ **Grown-up check before public release (owner, 2026-11-10: "don't miss this")**: today a child with their own login who isn't linked to a parent can still add a child profile or make a link code, and so pass "no parent = no class". Fix: "Are you a grown-up?" / year of birth (Spec X) and only grown-ups get parent features; server rules too (createChildProfile, createParentLinkCode) | Claude spec → owner → build |
| B11 | ⭐ **Parent's consent in the app, not WhatsApp (owner, 2026-11-11)**: for the Class 10 pilot, Seema collects YES in the parents' WhatsApp group and ticks "parent said yes" when approving (`consentBy: "teacher-confirmed"`). Before more classes or public release: every parent gives consent themselves in the app or on the no-install web page ("Simpler sign-up" doc, stage 6), stored server-side with name, relation, form version and time. Then ask the pilot parents to confirm once in the app, so their WhatsApp YES is replaced by a stored record | Claude build (stage 6) → owner |
| B10 | ⭐ **Progress reads only what changed (G103, owner: do soon)**: one class summary doc per class so teachers read 1 doc, not 33+, before more schools join | Claude spec → owner → build + deploy |
| B5 | Sign-up policy: today anyone can register (email / Google). Decision from 2026-11-04 was invite-only; keep open for the pilot or switch? | Owner |
| B6 | Production build from `main` (merge `feat/quiz-redesign` after the pilot), `check-aab.sh` PASS, release notes | Claude builds, owner uploads |
| B7 | Crash reporting: none today (we only hear from users). Add before public | Claude |
| B8 | **Money, later** (owner 2026-11-06: competitions with fees + scholarships, sponsors for children): when fees start → Play "trader" status = yes (ideally a business entity, so its address shows, not home); in-app fees need Google Play Billing + a parent gate (children's app), or collect outside the app (website / school); contests with fees and prizes need a Play policy + Indian law check; donations/sponsorship best via a website or trust, outside the app. Today: "not a trader" (no sales) | Owner (+ CA/lawyer once) |

Not blockers: My mistakes for picture / reading questions, English Units 10+, Science Unit 7, Paper 2–4 for Science (Gemini G35).

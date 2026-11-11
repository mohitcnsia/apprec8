# Launch checklist (updated 2026-11-11)

Two steps: **A. Seema's class pilot** → **B. public release**. Done steps and old notes: docs/history/LAUNCH_CHECKLIST_LOG.md.

## 📍 Where we are (11 Nov)
- **Your tests are cards now:** Me → Decisions (YES works · NO broke, say which step · MORE DETAILS · LATER).
- **Test next:** a student joins Seema's class from the class link, on your second phone (brand-new Google account, 15-year-old birthday).
- **Ready to publish (say "publish"):** word and fact of the day on kids' Home · Owner extras off by default · you always see every quest.
- **Agreed, not built yet:** Simpler Home, Progress and Me (https://claude.ai/artifact/RWQn8euh8aakH6LJhjzJks). First build: topic levels + one summary per class.
- **Next full app build:** 5 pm word reminder + crash reporting.
- **Your phone gets no alerts yet:** Me → Decisions → "Notify me on this phone".

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
| A9 | Cost check: 50 students ≈ 15,000 reads/day at most (free tier 50,000), writes far below 20,000. Budget alert in place | done | ok |

## B. Public release (after the pilot)
| # | Item | Who |
|---|---|---|
| B1 | **Families policy** (the app is for children): check every SDK we ship (Firebase etc.) is allowed in Families apps; no ads | Gemini G11 research → Claude |
| B2 | Play Console: Data safety form, content rating, target audience (age groups), App access (a demo login for reviewers), store listing (screenshots, short text) | Owner (Claude drafts text) |
| B3 | **DPDP Act (India)**: verifiable parental consent for under-18s, data minimum, deletion on request, a grievance contact. Our parent-first + consent records follow it; get a short legal check before scale | Owner (+ lawyer once) |
| B4 | **Safeguarding plan (RB-8)**: who reads reports, how fast, when to call parents / 1098 | Seema leads |
| B9 | ⭐ **Grown-up check before public release (owner, 2026-11-10: "don't miss this")**: today a child with their own login who isn't linked to a parent can still add a child profile or make a link code, and so pass "no parent = no class". Fix: "Are you a grown-up?" / year of birth (Spec X) and only grown-ups get parent features; server rules too (createChildProfile, createParentLinkCode) | Claude spec → owner → build |
| B11 | ⭐ **Parent's consent in the app, not WhatsApp (owner, 2026-11-11)**: for the Class 10 pilot, Seema collects YES in the parents' WhatsApp group and ticks "parent said yes" when approving (`consentBy: "teacher-confirmed"`). Before more classes or public release: every parent gives consent themselves in the app or on the no-install web page ("Simpler sign-up" doc, stage 6), stored server-side with name, relation, form version and time. Then ask the pilot parents to confirm once in the app, so their WhatsApp YES is replaced by a stored record | Claude build (stage 6) → owner |
| B10 | ⭐ **Progress reads only what changed (G103, owner: do soon)**: one class summary doc per class so teachers read 1 doc, not 33+, before more schools join | Claude spec → owner → build + deploy |
| B5 | Sign-up policy: today anyone can register (email / Google). Decision from 2026-11-04 was invite-only; keep open for the pilot or switch? | Owner |
| B6 | Production build from `main` (merge `feat/quiz-redesign` after the pilot), `check-aab.sh` PASS, release notes | Claude builds, owner uploads |
| B7 | Crash reporting: none today (we only hear from users). Add before public | Claude |
| B8 | **Money, later** (owner 2026-11-06: competitions with fees + scholarships, sponsors for children): when fees start → Play "trader" status = yes (ideally a business entity, so its address shows, not home); in-app fees need Google Play Billing + a parent gate (children's app), or collect outside the app (website / school); contests with fees and prizes need a Play policy + Indian law check; donations/sponsorship best via a website or trust, outside the app. Today: "not a trader" (no sales) | Owner (+ CA/lawyer once) |

Not blockers: My mistakes for picture / reading questions, English Units 10+, Science Unit 7, Paper 2–4 for Science (Gemini G35).

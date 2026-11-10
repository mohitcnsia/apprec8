# Launch checklist (Claude, 2026-11-05; updated 2026-11-10)

Owner asked: what is pending before a public release, and before Seema can use the app with her 50 Class 10 students?
Two steps: **A. Seema's class pilot** (a closed group on Play, ~1–2 weeks of work) → **B. public release**.

## 📍 Where we are (10 Nov)
- **Pilot starts 15 Nov** (plan: the **Seema's pilot** tab). Kids start only after the clean test passes and you say "publish".
- **Published 10 Nov:** no parent = no class, assigned work first, pilot switch, Class 10 Check-up (Accuracy by topic),
  "No internet" message, Seema's course tile, teacher Home, "Why not this option?".
- **Gemini next:** G94 approval pushes → G95 DR-26 rule → G96 offline stars → G89 two-way cards → G92 weekly report → G97 remove a kid.
- **Google Play:** closed test 20.0.30 in review since 6 Nov. Testers: added once our side is ready.

## What a Class 10 student sees today (checked in code, 10 Nov)
- Home: assigned work first, then Seema's course tile and English Quest starting at **Grammar Pro** (18 topics, Classes 9–10).
- Home → Explore → **Check-up** (54 questions, Accuracy by topic). Treasure Words: 13 Big Words topics.
- Quests with no Class 10 topics (Word Power, Science) are hidden.

## 🚦 Road to closed testing (plan 2026-11-06)
Goal: send the closed test for Google's review as soon as these are done. Order = what blocks what.
**Your review today:** row X mockup (parent consent) → [canvas, scroll to row X](https://claude.ai/artifact/DtBmVc472p7WgANEc12YvL); store text + graphic → the **Store listing** tab here.
| # | Step | Who | Time | State |
|---|---|---|---|---|
| C1 | Policy pages updated (privacy + deletion): add `mohitcnsia` as collaborator on FailedCommit/app-policies, Claude pushes | Owner 2 min → Claude | done | live 2026-11-06 (both pages load) |
| C2 | Delete in the app: Me → Delete my account, Delete a child's profile | Claude | done | published 2026-11-06 (20.0.30) |
| C3 | DR-19 server deletion (everything goes) | Gemini G42/G44 | done | deployed + tested with a throwaway account 2026-11-06 |
| C4 | **Parent consent (row X)** | Owner OK → Claude → Gemini | — | for the pilot: Seema's rule "no parent = no class" (published 10 Nov; server rule DR-26 = G95). The full "learn first" gate: before public release |
| C5 | Demo School logins for Google's reviewer: Admin tools → Reset Demo School | Owner | 5 min | done 2026-11-06 (password only in Play Console) |
| C6 | Store listing | Owner + Claude | — | done 2026-11-06: name "Apprec8: Learn & Grow", descriptions, 6 new phone screenshots, old tablet shots removed; submitted with 20.0.30 (9 changes) |
| C7 | Store screenshots (4–8 phone screenshots, tester account) | Gemini G43 | done | 14 in docs/release/screenshots/ (light + dark). Before public release: redo Home (0 stars, empty card) and Me (shows the test email) |
| C8 | App icon + feature graphic | Claude drafts, owner picks | — | draft 3 approved for now (no green checks); Gemini G48 makes the brand set (dissolving ∞) |
| C9 | Play Console → App content forms | Owner + Claude | ~45 min | done 2026-11-06: sign-in details = 3 demo logins; ages 6–18+; Data safety 6 types, nothing shared (2025 form said email was shared: fixed). Sent for review |
| C10 | 12+ testers | Owner + Seema | — | Google Group apprec8-testers on the closed track (6 Nov). Owner, 10 Nov: add people once the app is ready from our side |
| C11 | Closed testing track → 20.0.30 | Owner + Claude | — | **in review since 6 Nov** (10 Nov: still in review). **Managed publishing is on: after approval, Publishing overview → Publish.** |
Not blocking: Hindi check, Seema's 4 tips, crash reporting (B7), Dog Squad (owner: later).

## ⏰ Owner, 2026-11-06 (reminders)
- [x] DR-19 OK (Gemini reviews + deploys, G42). Policy pages: see C1.
- [ ] Google Group for the 50 pilot students; check the Play "12 testers / 14 days" rule ([release/PLAY_CONSOLE.md](release/PLAY_CONSOLE.md)).
- [ ] **Re-seed English** (Grammar Pro 2–6, Unit 5 practice, Unit 10 Word Building): close and reopen the app first so it has today's update.
- [ ] Test **20.0.30** on your phone (Testing → "20.0.30 on your phone").
- [ ] Read the **Hindi** on the parent card (utils/parentWeek.js) and the link consent (utils/family.js); Seema: the 4 tips.
- [ ] Approve **row X** (parent consent) on the canvas. Dog Squad: later (owner).
- [x] "publish": done 2026-11-06 for 20.0.29 and 20.0.30 phones (old content hidden for everyone but you, dogs too).
- [x] Build 20.0.30 uploaded to internal testing (check-aab PASS); `feat/push-20.0.30` merged into `feat/quiz-redesign`.
- [x] Deploys DR-16 / DR-17 / DR-18 live (Gemini G41).
- [ ] Admin tools → **Reset Demo School** (type a password; gives the demo logins for Seema and Play Console).

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
| B10 | ⭐ **Progress reads only what changed (G103, owner: do soon)**: one class summary doc per class so teachers read 1 doc, not 33+, before more schools join | Claude spec → owner → build + deploy |
| B5 | Sign-up policy: today anyone can register (email / Google). Decision from 2026-11-04 was invite-only; keep open for the pilot or switch? | Owner |
| B6 | Production build from `main` (merge `feat/quiz-redesign` after the pilot), `check-aab.sh` PASS, release notes | Claude builds, owner uploads |
| B7 | Crash reporting: none today (we only hear from users). Add before public | Claude |
| B8 | **Money, later** (owner 2026-11-06: competitions with fees + scholarships, sponsors for children): when fees start → Play "trader" status = yes (ideally a business entity, so its address shows, not home); in-app fees need Google Play Billing + a parent gate (children's app), or collect outside the app (website / school); contests with fees and prizes need a Play policy + Indian law check; donations/sponsorship best via a website or trust, outside the app. Today: "not a trader" (no sales) | Owner (+ CA/lawyer once) |

Not blockers: My mistakes for picture / reading questions, English Units 10+, Science Unit 7, Paper 2–4 for Science (Gemini G35).

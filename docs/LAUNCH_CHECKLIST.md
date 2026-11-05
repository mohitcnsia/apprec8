# Launch checklist (Claude, 2026-11-05)

Owner asked: what is pending before a public release, and before Seema can use the app with her 50 Class 10 students?
Two steps: **A. Seema's class pilot** (a closed group on Play, ~1–2 weeks of work) → **B. public release**.

## What a Class 10 student sees today (checked in code)
- English Quest: 40 topics, starting at "What is a sentence?", "Nouns" (written for Classes 3–5: too easy, feels childish).
- Treasure Words: 13 Big Words topics (fits Class 10).
- Word Power, Science: nothing (tagged Classes 2–6 / 3–5). Practice papers and Mix papers: nothing (Class 5 / Classes 3–6).

## ⏰ Owner, 2026-11-06 (reminders)
- Send Claude the privacy policy + delete-account page links (A7 check).
- Google Group for the 50 pilot students; check the Play "12 testers / 14 days" rule ([release/PLAY_CONSOLE.md](release/PLAY_CONSOLE.md)).
- Re-seed English (Grammar Pro 2–6, Unit 5 practice) if not done.
- Say **"publish"** for last night's app changes, then **re-seed English** (adds Unit 10 Word Building).
- **OK the deploys** DR-16 (Demo School), DR-17 (link Pratha's account), DR-18 (weekly notifications): Gemini deploys.
- **Build 20.0.30 is ready:** `build-1793902963993.aab` (repo root, 61 MB). `check-aab.sh` says **PASS** (version,
  admin ID, signed); storage + overlay permissions are gone, no advertising ID. Upload to internal testing, install, test
  the weekly-summary switch (Progress → My children / My classes). Then Claude merges `feat/push-20.0.30`.
- Read the **Hindi** on the parent card (utils/parentWeek.js) and the link consent (utils/family.js); Seema: the 4 tips.
- Decide the **Dog Squad** plan (CODE_REVIEW.md, 2026-11-06).

## A. Seema's Class 10 pilot (closed testing on Play)
| # | Item | Who | State |
|---|---|---|---|
| A1 | **Class 9–10 English content** (CBSE): tenses, modals, subject–verb agreement, determiners, reported speech, active/passive, editing & omission, gap filling, case-based reading. Seema names the topics + order; Claude writes; Seema reviews. Hide English Quest Units 0–2 from Classes 9–10. | Seema → Claude | **done**: Grammar Pro 1–6 (666 Qs, Classes 9–10), live after the English re-seed |
| A2 | ~~Class 10 practice papers~~ dropped (owner: grammar only for the pilot) | — | dropped |
| A3 | **Teacher dry run**: Seema creates the school + class (Admin tools → Schools & classes), 2 test students join with the code, she approves, assigns a topic, sees progress + class leaderboard | Seema + owner | **through guide quests** (mockup row W): owner and Seema learn by doing |
| A4 | **Parent consent**: students are under 18. In-app consent at "Join a class" exists (EN/HI); for the pilot also the school's usual signed consent form | Seema / school | in-app ready |
| A5 | **"Need help?" sheet** (mockup P1–P2: 1098, Tele-MANAS 14416) before teens use it; Seema finalises the wording | Seema → Claude | **built 2026-11-05** (Me tab, everyone); Seema refines words later |
| A6 | **Distribution** (steps + form answers: [release/PLAY_CONSOLE.md](release/PLAY_CONSOLE.md)): start on internal testing (≤100, works today); in parallel Play Console → Closed testing → testers = the 50 students' Google accounts (or a Google Group) → opt-in link. Upload the latest build there | Owner | not done |
| A7 | **Privacy policy page + "delete my account" web page** (public URLs; Play asks for both) | owner | **exists** (owner 2026-11-05); Claude to check it mentions classes, teachers, parent consent, attempts |
| A8 | Remote Config `update_url_android` → the Play link the students use (today: internal-testing link) | Owner | pending |
| A10 | **Demo School** (fake class for Seema to try the teacher screens + Play reviewer login): generator done; server function, filters, Admin button after Gemini's review; deploy by Gemini/owner | Claude → Gemini | in progress |
| A9 | Cost check: 50 students ≈ 15,000 reads/day at most (free tier 50,000), writes far below 20,000. Budget alert in place | done | ok |

## B. Public release (after the pilot)
| # | Item | Who |
|---|---|---|
| B1 | **Families policy** (the app is for children): check every SDK we ship (Firebase etc.) is allowed in Families apps; no ads | Gemini G11 research → Claude |
| B2 | Play Console: Data safety form, content rating, target audience (age groups), App access (a demo login for reviewers), store listing (screenshots, short text) | Owner (Claude drafts text) |
| B3 | **DPDP Act (India)**: verifiable parental consent for under-18s, data minimum, deletion on request, a grievance contact. Our parent-first + consent records follow it; get a short legal check before scale | Owner (+ lawyer once) |
| B4 | **Safeguarding plan (RB-8)**: who reads reports, how fast, when to call parents / 1098 | Seema leads |
| B5 | Sign-up policy: today anyone can register (email / Google). Decision from 2026-11-04 was invite-only; keep open for the pilot or switch? | Owner |
| B6 | Production build from `main` (merge `feat/quiz-redesign` after the pilot), `check-aab.sh` PASS, release notes | Claude builds, owner uploads |
| B7 | Crash reporting: none today (we only hear from users). Add before public | Claude |

Not blockers: My mistakes for picture / reading questions, English Units 10+, Science Unit 7, Paper 2–4 for Science (Gemini G35).

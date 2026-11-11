# Launch checklist: done steps and old notes (moved 2026-11-11)

# Launch checklist (Claude, 2026-11-05; updated 2026-11-10)

Owner asked: what is pending before a public release, and before Seema can use the app with her 50 Class 10 students?
Two steps: **A. Seema's class pilot** (a closed group on Play, ~1–2 weeks of work) → **B. public release**.

## 📍 Where we are (10 Nov night)
- **Seema's walk-through on the real app:** she joined test class 10-T as a teacher (17:12). **Next: you approve her**
  (Home → "Needs you", after tonight's update; or Admin tools → Schools & classes → her school → 10-T), then she walks Parts 1–5:
  https://claude.ai/artifact/VoQCLoAojbQGfCvzhyrKbs. Nobody else joins until she is comfortable (owner).
- **Published 10 Nov night:** teachers waiting on Home + Schools list; alerts high priority; Progress "Updated 8:05 pm"
  (parents + teachers: fresh after 7:30 am / 7:30 pm; pull down = now); class board hourly ("Keep practising! Next update at …").
- **Your phone gets no alerts yet:** Me → Decisions → "Notify me on this phone" (the saved phone is out of date).
- **Testing:** you test on your phone (top of the Testing tab); Claude and Gemini no longer use the emulator.
- **Pilot scope:** ~100 kids (Class 10 + ~50 Class 7 on the existing quests) after Seema is comfortable; Class 7 Science: later.
- **Google Play:** closed test 20.0.30 approved (green tick). Testers: added once our side is ready.
- **Test app (G104):** built; Gemini sends it once you give the testers' emails. After the pilot starts, every change goes there first.
- **Open for the pilot:** G87 assignment done = mistakes fixed + results by name (Gemini) · G89 two-way cards · G92 weekly
  report · A12 class report for management (week 2) · one-tap "which answer is right?" report (spec + mockup: Claude).

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
| C10 | 12+ testers | Owner + Seema | — | Google Group apprec8-testers on the closed track (6 Nov). **11 Nov: owner opted in ("You are a tester"), added 3 testers, invited 15 family adults (EN + Hindi message); expect ~20 in 2–3 days.** 14 days start at 12 opted in; then Dashboard → Apply for production. Under-13s (Pratha) can't be testers |
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


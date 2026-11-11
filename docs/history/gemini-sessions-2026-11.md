# gemini.md sessions moved out (stays under 24 KB)

## 2026-11-06 (day): closed-testing push (Claude)
- **Goal:** owner: "make app ready for closed testing soon"; plan = docs/LAUNCH_CHECKLIST.md "Road to closed testing" (C1–C11).
- **Done:** published 3× (20.0.29 once, then 20.0.30): old content owner-only (dogs too), My notes (Admin tools: checklist,
  testing, store listing), Me → Delete my account + delete a child profile. DR-16/17/18 live (G41). DR-19 "delete means
  delete" (eraseUser): G42 found 7 issues, all fixed → G44 re-check + deploy. New policy pages (docs/policies/, waiting
  for repo access: C1). Spec + mockup row X (parent consent), built on branch `feat/consent-gate` (waits for owner OK).
  Store text + feature graphic drafts. 22 broken Space image links fixed (repo is `mohitcnsia/images`).
- **How to test:** Admin tools → My notes → Testing (top sections).

## 2026-11-06 (night, owner: "keep building and documenting"): closer to closed testing (Claude)
- **Goal:** everything Seema's pilot and the closed test need that Claude can build; owner + Seema test in the morning.
- **Published (OTA):** guides (Me → Guides: admin "Set up a school", teacher "Start your class"; real screens + guide
  strip; steps tick from real data). **Not yet published (needs "publish"):** "Need help?" sheet (Me tab), old content
  hidden except dogs/animals, teacher "This week" card, parent "My children" week card (EN/हिंदी), link a child's
  existing account, Unit 10 Word Building (Gemini G37 + 19 fixes; needs an English re-seed), Demo School button.
- **Server, waiting for owner OK → Gemini deploys:** DR-16 Demo School (+ G38 fixes), DR-17 account linking,
  DR-18 weekly notifications (branch `feat/push-20.0.30`).
- **Build 20.0.30** (branch `feat/push-20.0.30`, native): weekly summary notifications + unused permissions removed.
  `.aab` built locally overnight; owner: `check-aab.sh`, upload to internal testing, test, then merge the branch.
- **Gemini:** G37 + G38 done and merged; G39 (QA run) and G40 (dog fact sheet) queued.
- **For the owner:** Play Console steps + draft form answers in `docs/release/PLAY_CONSOLE.md`; Dog Squad plan and
  pricing decisions in CODE_REVIEW.md; Seema's review page for Grammar Pro 1–6 + Unit 10.
- **How to test:** `docs/qa/OWNER_TESTING.md` (sections from "Guide quests" down).


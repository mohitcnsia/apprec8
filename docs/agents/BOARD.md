# Agent board

STOP: no
AWAY: yes
<!-- AWAY: yes = the owner is away for 1 h+, so heavy work (emulator, builds) may run. Claude sets it when the owner says so. -->
<!-- Owner or Claude: change the line above to "STOP: yes" to halt Gemini at its next check. -->

**Updated:** 2026-11-16 by Claude (tidied: closed and outdated tasks → docs/history/BOARD_ARCHIVE_2026-11-16.md) · **Base branch:** `feat/quiz-redesign`
**Owner priorities (2026-11-04):** 1) content accuracy, 2) a great app for kids, as soon as possible. Only the owner and Pratha use it now, so
breaking it is OK: ship often to internal testing, test on the owner's phone, keep emulator use short (slow Mac).
Accuracy pipeline: Gemini writes → Claude checks every question → Pratha's mother (English teacher) 🚩 in the app → owner OK → kids.
**How this works:** Claude (lead) writes tasks here; Gemini picks them up with `scripts/agents/next-task.sh`, works in its own
folder (`../apprec8-gemini`), and reports by commit (`gemini(Gxx): done …`) + `docs/agents/reports/Gxx.md` on its branch.
Claude reviews, merges and moves the task to done. The owner talks only to Claude. Rules: `docs/agents/GEMINI_ONBOARDING.md`.

## Open work (owner reviewed 16 Nov; keep this list short: tidy it every few days)
Priority order. New ideas, decisions and parked items live in docs/LAUNCH_CHECKLIST.md; history in docs/history/.

| # | Task | Who | State |
|---|---|---|---|
| 1 | ~~Owner cards + push~~ done 16 Nov (Admin tools → Send a card) | Claude | done |
| 2 | ~~Team tasks~~ done 16 Nov (a card of kind Task, with hat + due + Done) | Claude | done |
| 2a | ⭐ Computer Science quest, Unit 1 AI (Class 8+, kids practise from 23 Nov) + "Computer" subject for teachers (LAUNCH_CHECKLIST A16–A17) | Claude | now |
| 3 | G88 one-page class report for school management | Claude | next |
| 4 | G55 "Locked out?" help + admin PIN reset | Claude | next |
| 5 | ~~Full Me page shows the chosen face~~ done 16 Nov | Claude | done |
| 6 | Levels stage 2: one Word Power with levels, Treasure Words folded in | Claude | plan |
| 7 | "How Apprec8 works" quest (stars explained) | Claude | plan |
| 8 | Notification buttons (Start / Later) + round picture: app draws notifications (next build) | Claude | plan |
| 9 | Quiz two-part tablet view | Claude | later |
| – | G88 One-page class report for school management (school demo) | Claude | next |
| – | G55 PIN safety: "Locked out?" help + admin reset (never lock out) | Claude | next |
| – | G78 No internet = a clear message; parent PIN works offline | Gemini | later |
| – | G89 Two-way cards on Home: we ask, they answer, we reply | Gemini | later |
| – | G86 ♡ Like on learn cards and reading pages | Gemini | later |
| – | G99 Reasoning quest: picture-puzzle bank (spec + mockup first) | Claude | later |
| – | G100 "How you learn" insights for kids (spec + mockup first) | Claude | later |
| – | G53 ∞ brand art from the owner's Nano Banana image (data/media_backup/brand-infinity-ref.png) | Gemini | later |
| – | G63 Character cast drawings (replace the icon faces, same ids in utils/faces.js) | Gemini | later |
| – | G61 Fun names for English units and topics | Gemini | later |
| – | G69 Build "Chamak asks" (G62 mockup approved) | Gemini | later |
| – | G73 Fix the 29 Grammar Pro issues (G52 report) | Gemini | later |
| – | G75 Fixes from the G56 rehearsal | Gemini | later |
| – | G83 why-not for every wrong option in Grammar Pro b1–b6 | Gemini | later |
| – | G76 Delete the 26 old HTTP content functions (DR-23, owner OK) | Gemini | later |
| – | G24 Syllabus check NSO + IEO Class 5 vs our quests | Gemini | later |
| – | G105 Chess book extraction (after the app; owner shares PDFs) | Gemini | parked |
| – | G122 G117 proof: test-app route (after Gemini's quota resets ~21 Nov) | Gemini | later |
| – | G104 Send the test app to testers (owner gives emails) | Gemini | waiting |

## Task details (Gemini reads these; a task is handed out only when its heading says [todo])

### ⚙️ HOW WE WORK FROM 14 NOV (owner): Gemini builds + walks, Claude specs + reviews
**Accuracy and app engagement are non-negotiable.** Claude writes the spec; Gemini drafts/builds AND does the phone walk;
Claude reviews the diff + the walk evidence, re-walks anything suspicious or touching core flows, and publishes.
**Every task ends with a walk report** `docs/agents/reports/G<n>-walk.md`:
- **Phone only (owner 14 Nov: "the emulator is a mess"): never start or use the Android emulator.** If `adb devices`
  doesn't show `2ae01cda`, write "phone needed" in your report and stop; the owner plugs it in. Always
  `export ANDROID_SERIAL=2ae01cda`. Test build on the owner's OnePlus: `adb install -r
  android/app/build/outputs/apk/real/debug/app-real-debug.apk`, Metro, `adb reverse tcp:8081 tcp:8081`.
- **Never wait silently (owner 14 Nov: 2 hours lost on a hidden "waiting for device"):** before any adb step run
  `adb devices`; if `2ae01cda` isn't listed, print "PHONE NEEDED: please plug in the OnePlus (unlocked, File transfer)"
  and stop. Never run `adb wait-for-device` or anything that can wait without a limit. If any step is stuck for more
  than 5 minutes, stop it, write what you were doing and what you need in the report, and say so in chat.
- **Prove it's the NEW code (owner 14 Nov: "else it is wasted effort"):** uninstall the Play app, install the DEBUG
  test build, start Metro from your branch's folder, `adb reverse tcp:8081 tcp:8081`, open it through the dev launcher
  (localhost:8081). The report must include (a) a screenshot of the dev launcher showing localhost:8081, (b) the Metro
  log line "Android Bundled … index.js" with its time, (c) `git log -1 --oneline` of the folder Metro ran from. A walk
  on the Play/production app doesn't count. Afterwards reinstall the Play app for the owner.
- One screenshot per checklist step (in `docs/agents/reports/G<n>-walk/`, PNG, no personal data: test accounts only),
  each with one line: what you tapped, what you expected, what you saw.
- `adb logcat -d | grep -E "FATAL|SoftException|E ReactNativeJS"` output pasted (must be empty).
- Screenshot first, tap second: never tap from a remembered layout (a blind tap once landed on Delete account).
- Never publish, deploy or seed live content: say "ready" and Claude does it.
- **Keep the owner's Play app backup somewhere permanent** (16 Nov: the backup in /tmp vanished mid-walk and the owner's
  phone was left without Apprec8). Before uninstalling: `adb shell pm path com.mohitchilkoti.apprec8` → pull every APK
  into `content-private/play-backup/` (gitignored), and only uninstall once all files are there. If anything goes wrong,
  the owner reinstalls from the Play Store.
- **Never tap "Update …"/"Seed …" in Admin tools during a walk** (15 Nov, G123: it wrote the unit to the LIVE
  database before review). The debug build talks to the real Firebase. Walk with what's already seeded, or say
  "SEED NEEDED" in the report and stop; Claude seeds after review.
- **Never switch branches in the main folder `apprec8`** (15 Nov: it was moved to `gemini/g113-linking`, so next-task.sh
  read an old board). Work only in `../apprec8-gemini`: `git -C ../apprec8-gemini checkout <your branch>`.
**Content rules:** every fact checkable (name the source in the report), health/tradition = "माना जाता है", never a
promise; why-not on every wrong option; exactly one defensible answer; no copied text (books are inspiration only).

### G88 · [next] · claude · One-page class report for school management (school demo)
For Seema to show the school after 2–3 weeks. Per class: kids active / total, questions answered, **Accuracy at the start vs
now per topic**, mistakes fixed, assignments done on time, the weakest topic. Real data only (never made up; "not enough data
yet" when < 1 week). Printable / share as PDF from the teacher's class screen. Mockup to the owner first (rule), then build.

### G55 · [next] · claude · PIN safety: "Locked out?" help + admin reset (never lock out)
Your plan (docs/agents/reports/G55.md) is right on the UX (phone lock first, 1-hour delay without a lock, alert on
every change, Locked-out help, admin reset). **Security hole:** `switchToParentWithDeviceLock` trusts the client's
claim that a biometric check passed, so any child session (or a modified app) could get the parent's token. Replace
it with a **device-bound return ticket**:
1. `startPlaySession` (called by the **parent** session when starting Play as) creates a random one-time ticket, stores
   only its hash in `parentPins/{parentUid}.tickets` with expiry (12 h) and the child uid; returns the raw ticket.
2. The app stores it with **expo-secure-store `requireAuthentication: true`** (Android Keystore: opens only after the
   phone's fingerprint / face / device PIN).
3. `switchToParentWithTicket({ ticket })` (child session): server checks hash, unused, unexpired, child matches,
   then marks it used and issues the parent custom token. No ticket / no phone lock → the app PIN path as today.
4. `resetParentPin` only from the **parent** session; "delayed" (1 h) when the phone has no screen lock.
**Base on `feat/quiz-redesign`, not feat/simple-home.** Native libs (expo-local-authentication, expo-secure-store via
`npx expo install`) → ships with the next build; guard so OTA on 20.0.30 falls back to the PIN. Server parts = DR for
…(full spec: docs/history/BOARD_ARCHIVE_2026-11-16.md)

### G78 · [later] · gemini · No internet = a clear message; parent PIN works offline
**Why:** demo to a parent with the internet off: "Play as" failed with a confusing message. Going back to the parent also needs the
server, so a dropped connection mid-session leaves Time's up unclosable (never-lock-out rule). JS only (ships over the air): no new
native library (NetInfo needs a build: later).
1. `utils/netError.js` (pure, tested): `friendlyError(e)` → "No internet. Turn on mobile data or Wi-Fi, then try again." for
   network failures (callable codes `unavailable`, `deadline-exceeded`, `functions/unavailable`, auth `network-request-failed`,
   messages with "network"/"offline"), else the existing message. Use it in every alert that shows a server error
   (grep `e?.message || String(e)`: 14 places, plus familyApi/ideaApi/class join callers).
2. **Play as:** get the token from `switchToChild` FIRST; only if that works, pin + start the timer + sign in. Offline = the
   message, the phone is never pinned.
3. **Offline PIN** (`services/parentPinLocal.js`, expo-secure-store + expo-crypto, both installed): when the parent sets the PIN,
   or switches back successfully online, store a salted SHA-256 of the PIN on the phone. In a child session, if `switchToParent`
   fails with a network error and the typed PIN matches the local copy: `endSession()` (unpin, stop timer, close Time's up) and say
…(full spec: docs/history/BOARD_ARCHIVE_2026-11-16.md)

### G89 · [later] · gemini · Two-way cards on Home: we ask, they answer, we reply
Why (owner): "Users have no way of connecting with you or me." Seema must see what we decided and push back; kids, parents and
teachers must reach us in one tap. **Approved mockup:** https://claude.ai/artifact/RkCWYMsYCRjHuHcx1q5op4 (5 screens; follow it).
1. **Cards.** Admin (owner) posts a card: title, one line, optional link, target = everyone / one class / one person. Kid targets
   may carry 2–4 tap choices ("Loved it / Too easy / Too hard / Confusing"). It shows at the TOP of Home for those users only.
2. **Answer on the card, no new screen.** Adults: Yes / No + optional one line ("+ Add a line"). Kids: taps only, never a text box.
   "Later" hides it until the next app start.
3. **Two-way.** The admin's reply shows on the same card ("MOHIT REPLIED"). The user can Reply again as often as they like.
   **Only the user closes it** ("Got it"). Admin can mark it done ("Mohit marked this done. You can still reply"), it stays open.
   Closed cards fold into one quiet line at the bottom of Home: "Past cards · N ›" → list, any card can be reopened.
4. **Anyone starts a card**: "Tell us" on Home (top-right, quiet) → sheet: Something's wrong / An idea + one line (kids: choices
   instead) + Send at the bottom. Screen name, app version and user attached automatically. **Reuse** the existing pieces
…(full spec: docs/history/BOARD_ARCHIVE_2026-11-16.md)

### G86 · [later] · gemini · ♡ Like on learn cards and reading pages
Owner: "Some pages I like the formatting and colouring. If kids could tell us, we'd know what they like." Today we only hear 🚩.
1. **Where:** a ♡ right next to the 🚩 (`ReportStudyButton`) in `components/learn/LearnCards.js` and
   `components/common/reader/Apprec8Reader.js`. Not on quiz explanations yet. Same size and spacing as 🚩, thumb-friendly.
2. **Tap:** ♡ → ♥ (tap again = undo). Then an optional one-tap row under the card: "What did you like?" Colours · Pictures ·
   Easy to read · Fun · Examples (multi-select, no typing). Ignored → it folds away. Kids never see counts.
3. **Save rule (owner):** NO write per tap. Keep the like in state; write **one** `userFeedback` doc when the child leaves the
   card/page (swipe to next card, close, back, app to background) and only if it ends liked: `{ userId, feedbackType: "like",
   entryPoint: "like_heart", contentId, cardIndex|section, questId, nodeId, titlePreview, liked: ["colours", ...],
   clientTimestamp, createdAt, status: "new", appVersion }`. Offline is fine (Firestore queues). A local key `liked_<targetId>`
   shows ♥ again on return and stops a second doc for the same card on this phone.
4. **Pure + tests:** `utils/likes.js` (`LIKE_REASONS`, `buildLikePayload`, `shouldSendLike({ liked, alreadySent })`) and
…(full spec: docs/history/BOARD_ARCHIVE_2026-11-16.md)

### G99 · [later] · claude · Reasoning quest: picture-puzzle bank (spec + mockup first)
Owner: "a massive bunch of reasoning questions, an entire quest; the bank works for every subject". Build on
`utils/figures.js` (code-drawn figures, answers right by construction, tests re-check): figure series, mirror/water images,
rotation, embedded figures, paper folding/cutting, counting shapes, dice, Venn, plus text types (series, codes, directions,
ranking, calendar). Generators → unlimited questions per type and level; tagged so Science/Maths papers can draw from it.
Claude writes the spec + mockup first; no build before the owner's OK.

### G100 · [later] · claude · "How you learn" insights for kids (spec + mockup first)
From the child's own answers: speed vs accuracy (e.g. "When you take a few seconds, you get 86% right"), the topics that trip
them up, what improved this week. A calm card on Home now and then to reflect on (one at a time, never pressure; Pratha
rule). Same numbers for the parent report (G92). Mockup first.

### G53 · [later] · gemini · ∞ brand art from the owner's Nano Banana image (data/media_backup/brand-infinity-ref.png)
**Owner, 16 Nov: found the one.** A Nano Banana image: a glowing ∞ (purple + cyan light), the right loop breaking into
digital pieces. "This icon is perfect": polish it for Apprec8, and the pieces flying off are **books, game pieces, stars,
pencils, puzzle pieces** (kid stuff), not binary digits. Owner to save the image as `data/media_backup/brand-infinity-ref.jpg`.
Claude's notes: keep a large version with the glow (store page, splash); app icon = a simpler version (thick ∞, 4-5 chunky
pieces, it must read at 48 px); notification icon = a one-colour outline (∞ + 3 small squares breaking off).
Attempt 2 made the wordmark again; the owner asked to see **only the ∞ symbol**, and in the wordmark the ∞ still
reads like a fish / "∝", not an 8 lying down. Do exactly this: **no letters at all.** One sheet with 4 variants of
the ∞ alone, each large (400 px) and small (48 px): a perfectly **symmetric figure-8 on its side** (both loops the same
size, even stroke, like the maths symbol ∞), the **right loop's outer edge** breaking into small square pixels that
drift up-right; variants: solid gold, plum, white on plum, gold→plum gradient. Judge by: does a child instantly see
"8 lying down" / infinity? `docs/release/brand/infinity-v3/sheet.png`. `gemini(G53): done — infinity alone`.

### G63 · [later] · gemini · Character cast drawings (replace the icon faces, same ids in utils/faces.js)
Owner: "why just one mascot? Many fun creatures: a Yoda-like (wise mentor), a tortoise, a monkey, a bee, an ant,
sometimes wearing specs, sometimes a lab coat." Make ONE concept sheet (image) in the app's style, original designs
(nothing that looks like Yoda or other film/game characters): ⭐ the star host (now "Chamak"; also show 4 name
options: Chamak, Chamku, Jugnu, Sitara, Dhruv), 🐢 wise old tortoise (mentor, explains hard things), 🐒 monkey
(playful, challenges and "oops, let's fix it"), 🐝 bee (spelling, words), 🐜 ant (teamwork, class goal), 🦉 owl
(storyteller, read-aloud). Each: a name idea (Indian-friendly, easy for 6-year-olds), one line of personality, its job
in the app, and 2 outfits (specs for reading, lab coat for Science). Consistent style, works on the dark theme,
calm colours. **Owner 2026-11-07: the star is "Chamku"** (Pratha confirms by vote); **characters replace small
emojis** in the app, so also deliver each character as small PNG icons (64, 128, 256 px; transparent) in 4 moods
(happy, thinking, cheering, oops) for guide cards, empty screens, celebrations and help. **Pratha (via owner):
Duolingo's mascot is far more fun to look at**, so make ours **expressive**: big eyes, clear emotions, simple shapes
that can animate (wave, jump, slump, dance). Also sketch an **avatar builder** for children (face, skin, hair, clothes,
…(full spec: docs/history/BOARD_ARCHIVE_2026-11-16.md)

### G61 · [later] · gemini · Fun names for English units and topics
Owner: "I liked the chapter names, it was fun for kids, but things got very boring in text only." Propose a fun,
story-like name for every English Quest **unit** ("Noun Town", "Verb Volcano", "The Tense Time Machine"…) and a
playful subtitle for each **main topic**, keeping the grammar term visible (e.g. "Noun Town · Nouns"). Classes 1–5
playful, Classes 9–10 cool not childish. Indian setting welcome; no exam names; no brands or other games' names.
Also list the old chapter names you find (G60) that are worth reusing. Output a table in
`docs/agents/reports/G61-names.md` (current name → proposed name → why). **Don't change the app**: Seema checks the
English, Pratha votes, then Claude applies the chosen ones. `gemini(G61): done — names to review`.

### G69 · [later] · gemini · Build "Chamak asks" (G62 mockup approved)
Build the G62 mockups (docs/mockups/chamak-asks/) together with G66's pipeline: sticky on Home, one question at a
time, chains ("One more?" / "That's all for today", max ~5), thank-you with ⭐, owner results in Admin tools. Questions
from Remote Config / a Firestore doc (new polls without an app update); rollout `chamku_asks_uids` (Pratha first) →
`chamku_asks_all`. Tap answers for all, text only for supervised accounts; voice = v2. Rename the star to **Chamku**
in the app strings. **Theme (owner 2026-11-09): use the app's own theme, not the mockup's colours: `quizPalette` tokens (plum + gold), Nunito, light AND dark mode, calm style (docs/DESIGN_RULES.md), our cast instead of emojis where an icon is shown.** Plan first if it needs rules (DR). `gemini(G69): done`.

### G73 · [later] · gemini · Fix the 29 Grammar Pro issues (G52 report)
**Update 2026-11-09 evening: Claude already fixed the 5 High** (b4 questions-gate-pool-11, b5 test-8, modals-gate-pool-14,
agent-board-7, test-12): pull first, skip those 5, do the 11 Medium + 13 Low.
Apply your suggested fixes from docs/agents/reports/G52.md to `data/englishQuest/units/b1.js`–`b6.js`: all 5 High,
11 Medium, 13 Low. Also bring the **"right answer is the longest option"** rate in b1 (56%) and b4 (52%) below 40%
(lengthen distractors or shorten keys; don't change what's right). Keep ids. `npm test` passes. Report what changed per
id in `docs/agents/reports/G73.md`. **Claude checks every High + Medium and a sample of Low before the owner re-seeds
English.** `gemini(G73): done — review please`.

### G75 · [later] · gemini · Fixes from the G56 rehearsal
#1 fixed by DR-22. #3 is covered by G70 (teacher class screen). Fix the rest, small, on a branch from the latest
`feat/quiz-redesign` (NOT from feat/simple-home):
- **#2 never trapped on "Switch to parent":** if the signed-in account isn't a child session, ParentPinScreen says in
  plain words "You're already in your own account; this is for switching back from a child's profile" + a Back
  button. Every exit visible (board rule: never a dead end).
- **#4 Demo School teacher code:** Admin tools → Demo School card shows a teacher invite code for the demo class
  (create one at reset, reusable), so teachers can practise "Join as a teacher".
- **#5 explain the demo wall:** when a real account types a Demo School class code: "The Demo School is only for
  looking around with the demo logins. To try with real children, create your own class (Me → Guides → Set up a
  school)."
- **#6:** no trailing "code " when a class has no join code.
Also: list in G75.md which real classes / accounts the G56 rehearsal created (e.g. "Glorious Academy 5-A",
"Kabir", "Pooja") and delete the throwaway accounts if any remain. `gemini(G75): done`.

### G83 · [later] · gemini · why-not for every wrong option in Grammar Pro b1–b6
**Claude's review 2026-11-10: REJECTED and reverted.** About 1,100 of 1,998 whys explain a DIFFERENT question (copied by mistake
tag): the courier question's why talks about "how much this camera cost"; "explained → asked" gets a why about "whether he had
seen"; "Meera said that I would visit…" says "'I' refers to the listener" (wrong). A wrong why is worse than none (content
accuracy rule 5). Start a new branch from `feat/quiz-redesign` (G83 is reverted there; your g87 branch still has the old whys). Fix 1, ONE UNIT AT A TIME, b4 first (Seema's weakest topic), then b3, b1, b2, b5, b6:
- Write each why for THAT question and THAT option: name the words in the option that are wrong and say the rule in ≤ 20 words.
  Never reuse a why across questions; quoted words must appear in the question or the option.
- Gate: `node scripts/checkWhyMatch.mjs .` must report bad = 0 for the unit (it flags quoted words not in the question/option),
  then read every why of the unit once yourself. Commit per unit: `gemini(G83): fixed 1 — b4` … Claude spot-checks each unit.
For each of the ~666 questions: write `why` for each wrong option (≤ 20 words, kid-friendly, says what rule it breaks). Also
check each question has **at least one near miss** (looks right, isn't) and **exactly one defensible answer**; list any
…(full spec: docs/history/BOARD_ARCHIVE_2026-11-16.md)

### G76 · [later] · gemini · Delete the 26 old HTTP content functions (DR-23, owner OK)
CODE_REVIEW.md "DR-23". They're IAM-private (403 without a token) and unused by the app; no longer exported from
functions/index.js. Run the `firebase functions:delete … --region us-central1 --project apprec8-ca229 --force` command
from CODE_REVIEW.md (drop any name the CLI says doesn't exist), then `firebase functions:list` and report the remaining
count in G76.md. Don't delete anything else from G60 yet. `gemini(G76): done`.

### G24 · [later] · gemini · Syllabus check NSO + IEO Class 5 vs our quests
**Source:** `/Users/mohitchilkoti/Documents/projects/apprec8/docs/exam/syllabus/syllabusclass5.pdf` (owner: Class 5 syllabus for IEO,
NSO and IMO + last 5 years' patterns; read only, never copy text into git).
**Do:** write `docs/exam/syllabus-class5.md` in your own words: for NSO and IEO, the official topic list for Class 5, each topic
marked **covered** (unit + topic id) / **partly** / **missing**, plus the section pattern (questions, marks) per year if it
changed. Note IMO topics briefly for later. Then the **plan**: which topics G22, G23 and G20 must include so nothing on the
syllabus is missed, in priority order (what appears most in the papers first). If a Science node's `forGrades` contradicts the
syllabus, list it.
**Owner decision (read `docs/CONTENT_GUIDE.md` §9):** quests are subject quests for every olympiad; each topic is a ladder by
class. So in the plan, give each topic its **first class** and what changes in difficulty per class (3 → 8), not only Class 5.
**Deliver:** branch `gemini/g24-syllabus` (base `feat/quiz-redesign`), report G24, commit `gemini(G24): done — …`. Claude updates
G22 / G23 / G20 from your plan.

### G105 · [parked] · gemini · Chess book extraction (after the app; owner shares PDFs)
**Why:** the owner's "Guess the Move" chess trainer (spec frozen 13 Nov). Your two earlier samples failed because moves
were written partly from memory — both had moves no piece could play. The pipeline now gates every game by machine.
**Read first:** `scripts/chess/README.md` (rules are frozen there). **Base:** `feat/quiz-redesign`.
**Do:** extract exactly ONE game from the owner's London System book PDF (ask Claude via your report if you don't have the
path). The PDF is real text: COPY the moves from the page, never recall them. Words in `{ }`, playable lines in `( )`,
tags `GuessSide` / `GuessFrom` / `SourceBook` ("short name (author), page"). Write it to `content-private/chess/book1.pgn`
— that folder is gitignored; **book content must never be committed to this public repo**.
**Gate:** `scripts/chess/.venv/bin/python scripts/chess/validate_pgn.py content-private/chess/book1.pgn` must print PASS
(venv setup: README). Iterate until it does.
**Deliver:** `docs/agents/reports/G105.md` = the PASS output + book page number + any line you demoted to prose and why.
No batch extraction: game 2 only after Claude reads game 1's comments against the book page and accepts.

### G122 · [later] · gemini · G117 proof: test-app route (after Gemini's quota resets ~21 Nov)
The config is reasonable, but "done" needed the proof and the report has none: (a) screenshot of "Apprec8 (Test)"
installed next to the Play app on the owner's phone, (b) `eas update --channel preview` with a visible change (e.g.
the version line on Me says "preview test"), (c) screenshots: the test app shows it, the Play app does NOT. Also
answer in the report: EAS builds already inject the channel; does your new manifest `expo-channel-name` meta-data
clash with it in an `eas build` (check the merged manifest of a `real` build has exactly one entry, value
`production`)? Never run `--channel production`.

### G104 · [waiting] · gemini · Send the test app to testers (owner gives emails)
**Owner changed the plan (10 Nov):** Seema's walk-through runs NOW on the REAL app in a test class 10-T (pretend accounts deleted
after); then the pilot starts; from then on EVERY change goes through the test app before production. So this task = the
route for every future change, not Seema's first check. Walk-through (what she will do):
https://claude.ai/artifact/VoQCLoAojbQGfCvzhyrKbs
1. Build the test app APK (G85's `preview` profile) and send it with **Firebase App Distribution** (project apprec8-test):
   `firebase appdistribution:distribute <apk> --app <test app id> --testers "<emails the owner gives>" --release-notes "…"`.
   Emails only from the owner, never in the repo. Write the steps in `docs/release/TEST_VS_REAL.md` ("Send the test app").
2. In the TEST project only: a test school + class **10-T** (Class 10, English) and "Pilot: open all levels" ON, so the
   same walk-through can be re-run on every change. Check that content was copied (G85 step 4): Grammar Pro, Check-up questions.
3. Walk the walk-through yourself on the emulator with the test app first (Parts 1–5); fix-or-report anything that doesn't
   match it. Report `docs/agents/reports/G104.md`. `gemini(G104): done — review please`.


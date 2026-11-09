# Testing the app yourself (owner guide)

**No build needed.** The emulator already has the Apprec8 *dev app*. It loads the latest code from your Mac
(Metro) every time it opens, so you can test any branch in a few minutes. The slow, Mac-freezing part was the
**build** (`npx expo run:android`, Gradle); you only need that when a review request says
"native change: rebuild". None so far.

## 1. Start (about 5 minutes)

1. **Free up memory:** quit heavy apps (Antigravity, extra Chrome windows). The emulator needs about 4 GB.
2. **Terminal:**
   ```bash
   cd ~/Documents/projects/apprec8
   git checkout feat/quiz-redesign      # the branch you want to test
   npx expo start                       # leave this running
   ```
3. **Emulator:** Android Studio → Device Manager → ▶ next to *Pixel_8a_API_35*
   (or in a second terminal: `~/Library/Android/sdk/emulator/emulator -avd Pixel_8a_API_35`). Wait for the home screen.
4. Open the **apprec8** app on the emulator → tap **http://10.0.2.2:8081**. The first load takes 1–2 minutes.
5. Sign in with **mohitchilkoti@gmail.com** (the tester account). Never test with a kid's account.

**Dark / light mode:** emulator Settings → Display → Dark theme (or `adb shell cmd uimode night yes` / `no`).
**Another branch:** in the Metro terminal press Ctrl+C, `git checkout <branch>`, `npx expo start`, then press `r` to reload.

## 2. If something goes wrong

| Problem | Fix |
|---|---|
| "System UI isn't responding" / frozen | Tap *Wait* once. Still stuck: Device Manager → ⋮ → **Cold Boot Now**. |
| Keeps freezing | Device Manager → ⋮ → **Wipe Data**, then reinstall the dev app (no build): `adb install android/app/build/outputs/apk/debug/app-debug.apk` |
| Red error screen | Take a screenshot, add it to `CODE_REVIEW.md` (or tell Claude). Press `r` in Metro to reload. |
| App shows old code | Press `r` in the Metro terminal. |

**A spare Android phone instead of the emulator:** connect it by USB, `adb install android/app/build/outputs/apk/debug/app-debug.apk`,
then in the dev app enter `http://<your Mac's Wi-Fi IP>:8081` (same Wi-Fi). **Not on your main phone:** the dev app
replaces the Play Store app (same app id).

---

## 3. What to test (running list, newest first)

Tick items as you go. Details and expected results for each are in the named `CODE_REVIEW.md` entry.

### ⭐⭐ PILOT PATH on your phone (after the next "publish"), ~15 min — Claude runs it on the emulator first
Accounts: you (admin), **+teacher** (Seema's role), **+parent**, **+student** (the kid). Each step: what to tap → what you
should see. ✅ = Claude passed it on the emulator (date). Tell Claude the step number that fails (chat or Me → Tell us).

**A. Already merged (G81, G84, G82, G79)**
1. As **+teacher**: Home shows **"Needs you"** at the top when a kid is waiting, then your class card (kids active, weakest
   topic). Tap the waiting row → approve screen.
2. As **+student** in Seema's Class 10 class: Home shows the tile **"Seema Ma'am · Class 10 English"**. As a kid NOT in that
   class: no such tile.
3. As **+student**, Class 10: Home and Progress show only quests with Class 10 topics (no empty Science / Word Power, no 0/0).
4. In any Grammar Pro quiz: answer wrong → the "why not this option?" panel opens (explanations are empty for now; G83 redo).
5. Me → Delete my account: the screen looks like the rest of the app (cards, same font). Don't confirm.
6. After G94 (deploy): a kid asks to join → **+teacher**'s phone buzzes "Student waiting · Approve" (max 1 per 10 min).

**B. Built tonight (G90, G91) — ✅ = Claude passed it on the emulator, 2026-11-10 night**
7. ✅ As a kid with NO parent linked (your own account works): Me → Join a class → "Ask your parent to add you" + 3 steps for
   the parent, button OK. No consent form.
8. As **+parent**: Me → Link my child's own account → name + agree → code. On **+student**: Me → Link to my parent → code.
   Then +student: Me → Join a class → code VF244M → **no second consent form**, just JOIN → "Your parent already said yes".
   As **+teacher** (Seema's role): approve → the kid's row says "parent: linked account ✓".
9. ✅ Admin tools → Schools & classes → 10-A: a quiet line "Pilot: open all levels for these kids". Tap it ONLY when you
   start the pilot (it changes Seema's real class). Then +student (in 10-A): every Class 10 topic is open.
10. As +student: assigned work ("From your teacher") is the first card on Home.
11. ✅ As a Class 10 kid: Home → Explore → **Check-up** ("Your Accuracy in every topic · 49 min") → 54 questions in 6 parts.
    Submit → "Accuracy by topic", weakest first → "Practise this ›" opens practice on that topic. The next time it is
    **Check-up 2** (different questions).
12. As +teacher: Progress → 10-A → "Check-up by topic": class Accuracy per topic, names under 60%.
13. Airplane mode, then submit a check-up → "No internet. Your answers are safe on this phone…". Airplane mode off.
14. G89 two-way cards and G92 weekly report: not built yet (Gemini).

### ⭐ Teachers' page + Owner extras (after the next "publish"), ~3 min
- [ ] Me → Guides: first card **For teachers: start here** → the one-pager → **SHARE WITH A TEACHER** opens WhatsApp. Also in Admin tools.
- [ ] Me → ADMIN → **Owner extras** → Off: Home loses Explore / More practice / old classrooms, Progress loses "Kids",
  Guides shows the grown-up set, quest maps follow the normal locks. Tap again → On: everything is back.
- [ ] Child's view: My children → add "Test" (Class 10) → Play as → you see exactly what a Class 10 student sees.

### ⭐ Decisions on your phone + push (after the next "publish" and Gemini's G46), ~3 min
- [ ] Me → **Decisions** (under ADMIN; also at the top of Me when something waits). Questions from Claude show with
  👍 YES · ✋ NO · ❓ MORE DETAILS · ⏰ LATER. "More details" first opens the full story; tapping it again asks Claude to explain more.
- [ ] Tap **🔔 NOTIFY ME ON THIS PHONE** (bottom) → allow notifications. Within ~10 minutes a notification arrives
  ("Apprec8: … decisions for you"); tapping it opens Decisions. Answer "Test: did the notification work?".
- [ ] Optional note: type a short note before tapping an answer; Claude reads it.

### ⭐ Guides for everyone (after the next "publish"), ~5 min
- [ ] Me → **Guides**: you see all five. **Tour of Apprec8** (6 screens): DO STEP opens the real screen with a tip on
  top; "Guide ›" comes back and the step is ticked.
- [ ] **For parents** (4 steps) and **Your first day** (children, 4 steps). On Pratha's phone, Me → Guides shows only
  "Your first day".
- [ ] My notes has a new tab **App map**: every feature, who sees it and where.

### ⭐ My notes in the app (after the next "publish"), ~2 min
- [ ] Me → Admin tools → **My notes**: two tabs, Launch checklist and Testing. Sections are folded; tap to open.
- [ ] Tick a box, leave the screen, come back: still ticked (saved on this phone only).
- [ ] Only you see the row. The notes are refreshed with every "publish".

### ⭐ 20.0.30 on your phone (Play internal testing), ~5 min
- [ ] Play Store → Apprec8 → Update (internal testing). Me → About / version shows 20.0.30.
- [ ] Progress tab → as a parent or teacher: **Weekly summary** card → Turn on → Android asks to allow notifications → Allow.
- [ ] After DR-18 is deployed: parents get the summary on Sunday 18:30, teachers on Monday 07:30. Tap it → the Progress tab opens.
- [ ] Pratha's account never shows the switch (children get no notifications).

### Link Pratha's account to yours (after DR-17 is deployed)
1. Your phone: Me → **Link my child's own account** → your name, Father, tick → MAKE THE CODE → share it to Pratha.
2. Pratha's phone (signed in as her): Me → **Link to my parent** → type the code → "Linked ✓".
3. Your phone: Me shows "Pratha's week"; Progress → **My children** shows her week (English/हिंदी switch).
4. Her login, stars and progress are unchanged. "Play as" and delete are not offered for her (she has her own login).

### Parent "week at a glance" (mockups V2/V3, 2026-11-06)
A parent account with children (yours after you add / link a child, or demo.parent after DR-16): Progress tab →
**My children**: practised days (7 boxes, Monday first) and time, ↑/↓ vs last week; per subject Strong / Practise /
done count / next topic; **One thing to do at home**; Seema's suggestion (changes each week). English / हिंदी switch at
the top (remembered on the phone). **Owner: please read the Hindi** (utils/parentWeek.js, WORDS.hi and TIPS.hi) and
tell Claude what to change. Seema: please check the 4 tips (TIPS.en).
Folded at the bottom: **Questions to talk about**: her latest mistakes with the right answer (Challenge questions show
only the topic, so the answers stay secret).

### Teacher "This week" card (mockup V4, 2026-11-06)
Progress tab → tap a class you teach (best with the demo teacher login after DR-16): above SHARE CODE you see
**This week**: how many practised; **1 · Reteach one thing** (the topic most students are below 60% in);
**2 · Who needs you** (up to 3: away 7+ days, failed a challenge twice, accuracy falling); **3 · Assignment** with a
done / started / not started bar; 🚀 who is ready for harder work. No extra reads: it uses what the screen loads.

### Demo School (after DR-16 is deployed)
1. Admin tools → DEMO SCHOOL → type a password (8+ characters, keep it in your password manager) → RESET → about 1 min.
2. Sign out, sign in with `demo.teacher@example.com` + that password → Progress tab: classes 10-B and 5-A with kids,
   weak topics, an assignment (Passive voice, due Friday).
3. `demo.parent@example.com` → Me: one child, Riya (Class 5). `demo.kid@example.com` → Riya's own app.
4. Your own account: the main leaderboard and your Kids view show no demo kids.

### Old content hidden (Seema's feedback, 2026-11-05)
- **You (owner):** Home and Fun look as before (More practice, My classrooms, Space, Featured / Book Summaries).
- **Everyone else (check with the tester account or Pratha's):** all old tiles are gone, the dog quiz and Animal
  Kingdom too (owner 2026-11-06: they come back as exploration quests). Space is hidden. "Explore" only shows when a practice paper fits the child's class.

### "Need help?" sheet (row P1–P2, 2026-11-05)
1. Me tab: a calm green **Need help? Talk to someone** row under your profile card (everyone sees it).
2. Tap it: CHILDLINE 1098 and Tele MANAS 14416 have **Call** buttons. Call opens the dialer with the number typed;
   **don't press the green button** while testing. 112 has no call button (by design).
3. Close, Android back and tapping outside all close it. Nothing is saved.

### Guide quests (row W, 2026-11-05)
1. Me → **Guides** (you see "Set up a school" and "Start your class"; Pratha sees no Guides row).
2. Set up a school → **DO STEP 1** → the Schools screen opens with a 🧭 strip at the top saying what to tap.
   Tap the strip text: it folds to a small "Step 1/5" pill; tap again to open. ✕ stops it.
3. Create the school → tap **Guide ›** on the strip → "✅ Step 1 done!" and step 2 is next.
4. Steps tick themselves: class created; invite code made (or a teacher added); teacher approved; a test student approved.
5. Seema: Me → Guides → Start your class → join with your invite code ("waiting for the admin" until you approve her)
   → Progress tab: tap the class → **SHARE CODE** → approve students → assign a topic → see progress.

### Free text only for grown-ups (after "publish"), ~3 min
1. Your account (adult/tester): 🚩 report on a question still has the "Tell us more" box; Help → Email us works.
2. Pratha's account: 🚩 report shows reason chips + "Something else? Ask a grown-up to tell us." (no box); the reader's
   feedback button has no text box; Help → email form says "Ask a grown-up…". Once her email is in FREE_TEXT_EMAILS, she
   gets the boxes back.

### Grammar Pro 1: Tenses, Classes 9–10 (after "publish" + seeding English), ~10 min
1. Tester with unlock-all (or a Class 10 test account): English Quest ends with "Grammar Pro: Tenses" (Perfect Tenses,
   Perfect Continuous, Conditionals, Boss). Learn cards, warm-up, Board Style practice, Challenge.
2. Class 5 (Pratha): nothing new appears, the "Word Building" coming-soon unit is still last.
3. Teacher (Seema): Schools & classes → her Class 10 class → assign "Perfect Continuous" → a Class 10 student sees it open.

### ⭐ Picture questions (after "publish"), ~5 min
1. Practice paper → Science → Mix paper: Thinking skills has 3 picture questions (figure series / mirror / water image /
   turned shape / plant). Pictures are soft on the dark theme; answer tiles show drawings A–D.
2. Start screen says "✏️ Keep a pencil and a rough sheet next to you."
3. SEE ANSWERS shows the picture and the right drawing.

### ⭐ Mix papers (after "publish"), ~5 min to look, 60 min to sit one
1. Practice paper → English: Paper 1 ✓ and **Mix paper 1** ("a new mix of quest questions every time").
2. Finish a Mix paper → next time it offers Mix paper 2 (new questions). An unfinished one resumes.
3. Science the same. Every Mix paper: 50 questions, 60 marks, stars, wrong answers into My mistakes.

### Word ladder: "Same & Opposite" (after "publish" + seeding Word Power), ~5 min. Tester: unlock all, or a Class 2–4 child
1. Word Power map: first topic "Same & Opposite" (Classes 2–4): 7 Learn cards → TRY 8 QUESTIONS.
2. Practice leaves: Twin Words (10), Opposite Words (10).
3. Pratha (Class 5): her map looks the same as before.

### ⭐ New login screens + first run + Science for everyone (after "publish"), ~10 min
1. Sign out → login screen: Chamak floats in a starry sky (tap it: it jumps and sparkles), a planet circles, a shooting
   star now and then. CONTINUE WITH GOOGLE is the big bottom button.
2. "Use email instead" → form low on the screen, LOG IN at the bottom. "New? Create account" → a plant grows, Chamak blooms.
3. Typing hides the animation so the form stays in view. "Forgot password?" opens a sheet.
4. Log in with Google → on YOUR account you'll see the first-run screen once (you have no class): type a name and watch
   the bubble, tap "I'm a parent" → LET'S GO. It won't ask again on this phone.
5. Admin tools → seed **Science** again → Pratha (and every Class 3–5 child) now sees the Science tile, not only testers.
6. Phone set to "Remove animations" (Accessibility) → the pictures stand still.

### ⭐ App popups (raw Android popups replaced), after this "publish", ~5 min
Every popup should now slide up from the bottom in the app's colours, the safe choice big, red outline for Delete/Leave.
1. Me → Sign out → popup says "Sign out" / "Cancel" (it used to say "Confirm"). Tap Cancel.
2. A quest map → tap a locked topic → "🔒 … is locked" popup with "Go to Challenge" big, "Not now" quiet.
3. Practice paper → CHECK with blanks → SUBMIT PAPER → "N left blank" popup.
4. Me → Reminders → delete one → "Delete" in a red outline, the safe choice big.
5. Android back on a popup = its Cancel button.

### ⭐ Login, registration, guest (after the next "publish"), ~8 min. Sign out first (Me → Sign out)
1. Login with an email that ends in a space (pick it from the keyboard suggestion) + a wrong password → "Email or password
   is wrong…" and what you typed is still there (before: "badly formatted", or the form came back empty).
2. Short password / half-typed email → a grey line under the fields says why the button is off.
3. Register with an email that already has an account → "This email already has an account…" (before: nothing at all).
4. Forgot password? → calm "If an account exists… reset link" message (not red).
5. Continue as Guest → Home works → Me → "Sign Up or Log In" → back to the login screen.
6. Google sign-in and "I have a code from my parent" still work.

### ⭐ Practice paper, round 2 (your feedback, after this "publish"), ~10 min
1. Reading questions: the story looks like a book page (serif, margin line, "READ: …"), the question below has a QUESTION label.
2. Options are bigger and sit low, near your thumb.
3. Finish a paper → medal (🥇 90%+, 🥈 70%+, 🥉 finished) + "N questions added to My mistakes 🔧".
4. Home → "mistakes to fix" → the paper's wrong questions come up (reading ones are left out: they need the story).
5. Stars: "Stars for this paper: once a week" until DR-15 is deployed; then e.g. +26 ⭐.

### ⭐ Learn cards (after the next "publish" AND re-seeding Word Power + Treasure Words), ~10 min
1. Word Power → Synonyms and Antonyms → Learn: 10 cards, not a long page. Soft colours, nothing bright on dark mode.
2. 🔊 reads each card. NEXT / ‹ at the bottom. Quick checks: tap an answer, it shows right away, nothing lost.
3. Last card "You learned …" → **TRY 8 QUESTIONS ▶** opens the quiz straight away. After it, the topic shows done.
4. Skip test: open Learn again on a fresh topic → "Skip to quiz ›" → pass the quiz → the topic is NOT done until you
   finish the cards (as you asked: unlocking unchanged).
5. "See everything on one page" (first and last card) shows the old page.
6. Treasure Words → any group → Learn: one word per card, tap to see the meaning, a check every 4 words.

### ⭐ Practice paper (after the next "publish"), your tester account only, ~15 min
Pratha can't see it yet (draft, testers only) until you approve the paper questions.
1. Home → Explore → **Practice paper** tile → English / Science switch, parts and counts, "Show the clock" switch.
2. START PAPER → answer 3 questions. Short options sit 2 × 2, long ones stack. ⚑ turns gold; ‹ goes back.
3. Reading questions (English Q31–40): the story shows above the question; tap its title to fold it.
4. Close the app fully, open it again → tile → **CONTINUE (3 / 50 done)**, your answers are still there, clock kept running.
5. Jump: on Q50 press CHECK → the number grid (blank = dashed, marked = gold) → tap a number → it opens.
6. SUBMIT PAPER → "N left blank" warning → Submit → marks by part, "Practise these next" (opens that quest) → SEE ANSWERS
   (only mistakes, switch to see all) → Done. Start again: "Last time: x / 60".
7. Optional: hide the clock and do the whole paper as Pratha would (60 min); tell me if anything felt confusing.

### After you approve the review page + G31: English Unit 8, Science Unit 5 (needs a "publish" first), ~15 min
1. Me → Admin tools → seed **English** and **Science**.
2. English Quest: after Unit 7 comes **Unit 8 Linking Words** (a Class 3–4 child goes straight from Unit 6 to Unit 8). Pratha sees
   the **Champion: Not Only… But Also** leaf; a Class 4 child doesn't.
3. Science (testers): **Unit 5 Light, Sound & Magnets** for Classes 3–5; "Water, Air & Weather" shows as coming soon.

### After Gemini's G30 deploy (DR-12 + DR-13): leaderboards, ~2 min
1. Progress → Leaderboard opens as before. Points can be **up to 10 minutes behind** (they're saved and reused to keep costs down).
2. Approving a child on a class page shows them on the class board straight away. Treasure Words now counts for class points.

### ⭐ 20.0.29 (lock the phone + play time), ~5 min. Needs the IAM step first (DEPLOY_PENDING.md)
1. Upload `build-1793820561489.aab` to Play internal testing; install.
2. Me → MY CHILDREN → **Play as Pratha** → a sheet: lock card, HOW LONG? (15/30/45 min, No limit), LOCK & PLAY.
3. Pick 15 min → LOCK & PLAY → Android asks "Pin this app?" → Got it. Try Home/Recents: you can't leave Apprec8
   (unpinning asks for the phone's own PIN/pattern).
4. After 15 min: Chamak "Great work, Pratha! Time is up…" covers the app. Your app PIN → back to you, the phone is unpinned.
5. "Play without lock" still works; "Login code (another phone)" link is at the bottom of the sheet.

### Over-the-air update (after you say "publish"): new leaderboard, Schools & classes, no status bar in quests, ~10 min
1. **Start screen:** "Appreciate" is not cut off (dark mode too).
2. **Quests:** open English Quest → map, a Learn page, a quiz start screen, a quiz: no time/battery bar at the top anywhere.
   Back on Home, the bar is there again.
3. **Leaderboard** (Progress → Leaderboard): tabs "My class" / "Everyone" (tabs only show for a kid in a class), top-3 podium,
   👏 next to classmates (once a day each), your own row pinned at the bottom with "N more to pass …".
4. **Schools** (Me → Admin tools → Schools & classes): only the list. "+ New school" at the bottom opens a sheet that closes
   after Create. "Add a class" in a school opens the class sheet (name, class 1–12, subjects, tuition switch) → after Create
   you land on the class page.
5. **Class page** (tap 5-A): big code; WAITING FOR YOU shows children added by parents (Approve / ✕); TEACHERS; Kids in
   this class; **SHARE CODE** at the bottom opens the phone's share menu (WhatsApp, SMS, Copy…).
6. **Invite a teacher** (class page → Invite a teacher): pick subjects, see the message. **SHARE INVITE works only after the
   DR-11 deploy** (until then it says it couldn't make the invite). After it: send it to Seema → on her phone Me → Join as a
   teacher → code → her request shows on the class page → Approve.

### Treasure Words quest (your 370 vocabulary words). Arrives by an over-the-air update after 20.0.28, ~5 min
1. Me → Admin tools → **Update Treasure Words** (seeds the quest + its Home tile).
2. Home → Your quests → **Treasure Words** tile. As Pratha (Class 5) the path starts at **Actions & Change** (13 "big word" topics);
   a Class 1–3 child sees only **Everyday Words** (Animals, Food, Plants, School); Class 4 sees both.
3. Open a topic: Learn page = table of word + meaning → quiz "Which word means …?" (10 of the group's words, no emoji hint)
   → ♾️ Keep practising never runs out.
4. Not in it: the 83 Space words (they go to the Space quest later).

### Next build (20.0.28): schools, classes, assignments, class leaderboard. Needs DR-9 deployed first
- [ ] Me → Admin tools → **Schools & classes**: add your school (Banbasa), add class "5-B" (level 5) → note the join code.
- [ ] Add Seema as teacher of 5-B for English + Word Power (she signs in once first). Add yourself for Science.
- [ ] On Pratha's phone, with you: Me → **Join a class** → code → read the consent (try हिंदी) → your name, Father → tick → AGREE AND JOIN.
- [ ] Seema's phone: Progress → **My classes** → 5-B → Pratha's English progress only. **Assign a topic** (e.g. Verbs, 1 week).
- [ ] Pratha's phone: Home "Next up" says **From your teacher: Verbs**; the map opens Verbs even if she hasn't reached it.
- [ ] Pratha's Progress: **5-B · this week** board with 👏; clap once (a second clap the same day says "already clapped").

### ⭐ 20.0.27 (calm pass 1, after 20.0.26): what to look at
- [ ] **Home:** one dark "Next up" card; IEO countdown and mistakes as two small chips (countdown still changes; "+" adds a
      reminder); shelves OLYMPIAD PREP / EXPLORE / MORE PRACTICE; **CONTINUE at the bottom** (one thumb).
- [ ] **Quiz:** "What kind of sentence is this?" is a small label; the sentence sits in its own big card.
- [ ] **Start screen:** tapping a quiz node opens ONE screen (stars, best, Training / Exam, START at the bottom) and the quiz starts at once.
- [ ] **Map:** finished topics show one chip ("⭐ 3/3 practice · 🏆 ✓ ›"); tap it to open the leaves. Locked topics show one faint line.
- [ ] Light and dark. Anything that feels cluttered still: screenshot + one line.

### ⭐ 20.0.26 on your phone (~10 min). Your feedback, fixed
- [ ] **First:** Me → Admin tools → **Fix 46 old IEO questions** → Fix. The alert says "46 fixed". (Press once; pressing again says "already fixed".)
- [ ] A short-answer quiz (e.g. "What kind of sentence…"): "Exclamation" and "Statement" fit on one line, no split words.
- [ ] A quiz, a reading, a study page, Keep practising: the phone's top bar is hidden; it comes back on Home.
- [ ] Finish a quiz with confetti: you can tap the buttons while the confetti falls.
- [ ] Map: after finishing a topic, its Challenge is first in the side row with a gold border ("opens the next topic").
      Tap the next (locked) topic: it says which Challenge opens it, and **Go to Challenge** opens it.
- [ ] 🚩 report box, feedback, reminders: the hint says to use the keyboard mic. Try speaking into the keyboard mic.
- [ ] The Gender 2 quiz: "Dog → …" is now "Tiger → Tigress"; a wrong answer shows an explanation.

### ⭐ 20.0.25 on your phone (Play internal testing), ~15 min. Do this first.
Install from the internal-testing link, open the app, signed in as you.
- [ ] **Tabs:** Home · Fun · Progress · Me; the one you're on is highlighted.
- [ ] **Home:** your name, streak, stars; "Coming up" shows IEO / NSO days and changes by itself; Continue opens English Quest.
- [ ] **A quiz:** answers sit low (thumb reach), CHECK, green/red sheet, Chamak's faces look friendly.
- [ ] **English Quest:** Unit 2 "Articles & Determiners" shows after Unit 1 (after Gemini seeds it, G14).
- [ ] **Progress:** your streak week and topics; Kids · Reported shows the Dashboard.
- [ ] **Me:** theme Light / Dark / Phone setting; Edit profile → set Class; Admin tools opens (don't press seed buttons).
- [ ] **+ Add reminder** on Home: add one with a date → it shows in Coming up.
- [ ] Anything odd: screenshot + one line to Claude.

**Then Pratha (her account, her phone):** play one Unit 2 topic and a practice; does it feel easy to use, anything confusing?
**Her mother (English teacher):** play Unit 2 and 🚩 any question that's wrong or unclear (the flag is next to each question).
School release only after both say OK.

### `feat/quiz-redesign`: Science Quest + class filter ("Multi-quest + Science Quest draft")
Tester account. Needs one seed: Me → Admin tools → **Update Science Quest (draft)** → confirm (draft = testers only).
- [ ] Admin tools shows one Update button per quest (English, Science (draft)); each asks to confirm before writing.
- [ ] After the draft seed, Home → Your quests shows **Science** ("Draft · testers only"), and the greyed "Science · Coming for NSO" tile is gone. A non-tester account sees neither.
- [ ] Science opens its intro → map: "The Living World" with "Living and non-living", then "Plants · coming soon". Study page + 6-question warm-up play and save.
- [ ] Class filter: Edit profile Class 5 → the topic shows. (A Class 8 account would see no Science unit; tester "unlock all" shows everything.)
- [ ] English Quest looks and plays exactly as before for every class.
- [ ] Home: Continue shows the quest played last; mistakes tile counts both quests. Progress shows a row per quest; Dashboard has English / Science chips.
- [ ] Re-seed English Quest (Update English Quest → confirm) still works, and kids' progress is kept.

### `feat/quiz-redesign`: thumb zone + leaderboard names ("Thumb zone + leaderboard names")
- [ ] Quiz on a tall phone (emulator Pixel 7 Pro or bigger): the answers sit just above CHECK, not under the question with a big gap below.
- [ ] Long question / small phone: everything still scrolls; nothing hidden behind CHECK or the green/red sheet.
- [ ] Me → Edit profile: pick a Class (1–12), save; Me shows "Class N".
- [ ] Progress → Leaderboard: kids show as "Pratha · Class 5" (first name only). Full effect after DR-8 is deployed (until then the server still sends last names; the new app hides them).

### `feat/quiz-redesign`, steps 3–4: Me tab + Reminders ("Home + tabs redesign: steps 3–4")
Mockup board F. Light and dark mode.
- [ ] **Me:** profile card (photo or first letter, name, email), Edit profile works.
- [ ] Reminders row shows how many are active and opens the list; Messages opens.
- [ ] **Look:** Phone setting / Light / Dark switch the app at once; after a restart the choice is kept. "Phone setting" follows the phone's dark mode.
- [ ] Help and "Tell us what you think" open. Sign out asks first, then signs out.
- [ ] No stats, no seed buttons, no "Quest Mode (V2)" switch on Me.
- [ ] **Admin (your account):** Admin tools row → Dashboard, reset pop-ups, the 4 seed buttons (don't press them unless you mean to seed).
- [ ] **Reminders:** Home → "+ Add reminder" opens the add form; title + date are enough (no detail needed); Save returns to Home and the reminder shows in Coming up.
- [ ] With 5 active reminders (kid account), a 6th says "You can have 5 reminders…" (from Home and from the list). Tick one off → you can add again.

### `feat/quiz-redesign`, step 2: Progress tab ("Home + tabs redesign: step 2")
Mockup boards D (kid) and E (admin). Light and dark mode.
- [ ] As a kid (tester account): "My progress", streak with this week's days (gold ✓ = played; today has a ring).
- [ ] Tiles: stars, questions this week, % right. English row: "Unit N", topics cleared / total, "Now: <topic>"; tap opens the map.
- [ ] "Work on these" lists weak topics with readable names (not ids); Practise opens the map. "Great at" shows strong topics.
- [ ] Brand-new kid: no numbers break; it says to play English Quest. Guest: "Sign in" button.
- [ ] Leaderboard row opens the old leaderboard; back returns to Progress.
- [ ] **Admin (your account):** Me / Kids · Reported switch. Kids shows the Dashboard (Today / This week / All, kid rows, Reported tab); a kid row opens the detail; back returns.

### `feat/quiz-redesign`, step 1: Home + tab bar ("Home + tabs redesign: step 1")
Test in **light and dark** mode. Mockup: canvas "Apprec8 Home & Tabs Mockups", boards A–C.
- [ ] Tab bar shows **Home · Fun · Progress · Me**; the tab you're on is highlighted (pill behind the icon). No Study or Quest tab.
- [ ] Home top: Chamak, "Good morning/afternoon/evening, <your name>", streak 🔥 (days in a row with English Quest answers) and stars.
- [ ] **Coming up:** IEO and NSO countdowns change by themselves every few seconds; tap the card or a dot to switch (it then pauses ~10 s).
- [ ] Add a task with a due date (Coming up → "+ Add reminder" opens Tasks). Restart the app: it shows in Coming up, sorted by date (max 3 items).
- [ ] **Continue** opens the English Quest map (or the intro for a kid who never started). Back gesture returns to Home.
- [ ] With mistakes in English Quest: the red "N mistakes to fix" tile shows; tapping it opens the map and goes straight into My mistakes.
- [ ] **Your quests:** English opens the intro; **Space** opens the Space map (no tab bar), back returns to Home; Science/Maths are greyed "coming".
- [ ] **Olympiad practice** row: old IEO/NSO quizzes open and play; My classrooms row only if you have classrooms.
- [ ] **Fun** tab: thought of the day, 5 games open (Sudoku, Minesweeper, Tell the time, Word builder, Spelling bee), Featured / Book Summaries / Popular Reads open.
- [ ] Progress (old Stats) and Me (old Profile) still work. Tasks in Me still work (add, edit, complete).
- [ ] As a guest: Home shows "friend", Continue opens the intro, which asks to sign in.

### `feat/quiz-redesign` ("Review request: quiz redesign")
Test in **light and dark** mode.
- [ ] Practice quiz (Training): answer highlights and fills the blank → CHECK → green/red sheet with the reason → CONTINUE goes to the next question.
- [ ] Right answer pops, wrong one shakes, hearts go down; Chamak cheers / looks thoughtful.
- [ ] Short answers (a / an / the) show as four big tiles.
- [ ] Exam mode: tap = answer + next; bookmark; review list readable; Submit.
- [ ] Space quest quiz: SEE WHY opens the picture explanation, then the next question.
- [ ] Out of hearts screen; results screen (stars, tiles, buttons, X).
- [ ] An old IEO quiz (now under Home → Olympiad practice) still plays.

### `feat/nov6-improvements` ("Branch feat/nov6-improvements: fixes + Unit 2 content")
- [ ] Reading (Tara's paper boat), **dark mode**: options readable; the right answer isn't always first.
- [ ] Tap an underlined word: big word, 🔊 Hear it says the word then its meaning, Got it closes.
- [ ] Map with My mistakes showing: scroll to the bottom, the button doesn't cover a circle.
- [ ] Get an Adverbs Challenge question wrong → My mistakes → it can be fixed (2 right in a row).
- [ ] Dashboard → a kid who played Unit 0 shows topic rows.
- [ ] Unit 2 content (after seeding): play A and an, Using 'the', Determiners.

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

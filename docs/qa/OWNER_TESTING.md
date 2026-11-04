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

### `feat/quiz-redesign` ("Review request: quiz redesign")
Test in **light and dark** mode.
- [ ] Practice quiz (Training): answer highlights and fills the blank → CHECK → green/red sheet with the reason → CONTINUE goes to the next question.
- [ ] Right answer pops, wrong one shakes, hearts go down; Chamak cheers / looks thoughtful.
- [ ] Short answers (a / an / the) show as four big tiles.
- [ ] Exam mode: tap = answer + next; bookmark; review list readable; Submit.
- [ ] Space quest quiz: SEE WHY opens the picture explanation, then the next question.
- [ ] Out of hearts screen; results screen (stars, tiles, buttons, X).
- [ ] An old IEO quiz from the Study tab still plays.

### `feat/nov6-improvements` ("Branch feat/nov6-improvements: fixes + Unit 2 content")
- [ ] Reading (Tara's paper boat), **dark mode**: options readable; the right answer isn't always first.
- [ ] Tap an underlined word: big word, 🔊 Hear it says the word then its meaning, Got it closes.
- [ ] Map with My mistakes showing: scroll to the bottom, the button doesn't cover a circle.
- [ ] Get an Adverbs Challenge question wrong → My mistakes → it can be fixed (2 right in a row).
- [ ] Dashboard → a kid who played Unit 0 shows topic rows.
- [ ] Unit 2 content (after seeding): play A and an, Using 'the', Determiners.

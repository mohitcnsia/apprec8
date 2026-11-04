# Apprec8 QA Playbook (device testing on the Android emulator)

**Who:** the QA agent (Gemini, as reviewer + devops). **Author:** Claude. **Owner:** final say. Roles in full: `docs/TEAM.md`.
**Goal:** check every change on a real Android screen before the owner and Pratha test it, so the
author spends its time building, not tapping.

## 1. Rules
- **Never write to production data on your own**, except pressing **"Update English Quest"** when a
  review request says a re-seed is needed (devops task). Don't press the other seed buttons.
- Test with the **tester account** (`mohitchilkoti@gmail.com`). Never use a real kid's account.
- **Tester mode is in-memory:** turn its switches off when you finish (or restart the app).
- **Content accuracy is the top priority.** If a question, answer or explanation looks wrong,
  report it (section 5) even if it isn't in the test list.
- Don't change code. Report findings; the author fixes them.
- **Report what you see, not what you expect.** Check each screenshot against the checklist before writing PASS. Anything
  odd (blank area, missing text, a face or colour that feels wrong for kids) is a finding with a severity, even if the
  checklist doesn't mention it.
- **Commit everything you write** (`CODE_REVIEW.md`, `gemini.md`) in your `gemini:` commit. Screenshots stay in
  `qa-screenshots/` (gitignored: they show the test account).

## 2. Setup
1. Emulator: `~/Library/Android/sdk/emulator/emulator -avd Pixel_8a_API_35 &`, then `adb devices` shows `emulator-5554`.
2. Metro: `npx expo start` in the project root (leave it running).
3. App: already installed as a dev build. **After a native change** (a new native library in `package.json`)
   rebuild with `npx expo run:android` (~10 min). For JS-only changes `scripts/qa/eq.sh reload` is enough.
4. `npm test` must pass first (the author runs it too).
5. **`scripts/qa/eq.sh prep` once per emulator session, then restart the app.** It turns phone animations off, so the app
   stops its looping animations and screen reads don't hang (2026-11-04: they stalled 30–60 s per tap). `unprep` turns them
   back on, e.g. to look at an animation once.
6. **Time limit:** if the same command times out twice, stop, write what happened in `CODE_REVIEW.md` and move to the next
   item. Never loop on retries (the owner had to kill the QA process twice).

## 3. The helper: `scripts/qa/eq.sh`
Taps by **visible text or accessibility label**, not by coordinates, so tests survive layout changes.

| Command | Does |
|---|---|
| `eq.sh texts` | list all visible texts (cheap way to "see" the screen) |
| `eq.sh tap "Continue"` | tap the element whose label/text contains "Continue" (`tap "Stop" 2` = 2nd match) |
| `eq.sh has "Practice saved"` | exit 0 if on screen |
| `eq.sh wait "Keep going" 15` | wait up to 15 s for a text |
| `eq.sh shot name` | screenshot to `/tmp/apprec8-qa/name.png` (only when you must check visuals) |
| `eq.sh reload` / `back` / `offline` / `online` | reload JS / Android back / airplane mode on / off |
| `eq.sh prep` / `unprep` | phone animations off / on (run `prep` first) |
| `eq.sh tapxy 540 1200` | tap a position: fallback when a text can't be found |

**Map labels** (for `tap`): `Topic: <title>, <status>`, `Boss: <title>, <status>`,
`Practice: <title>, <status>`, `Challenge: <title>, <status>`, `Keep practising: <topic>, <status>`,
`Finished unit: <title>, …`. Other icons: `Report a problem` (🚩), `Close` (✕ on results).
Prefer `texts` / `has` over screenshots: it's faster and cheaper. Use screenshots for colours, layout and dark mode.

**Getting to English Quest (since the 2026-11-04 redesign, no Study tab):** on Home, `eq.sh tap "CONTINUE"` (opens
the map) or `eq.sh tap "English"` under "Your quests" (opens the intro). Tabs: `Home`, `Fun`, `Progress`, `Me`.
Theme: Me → Look → Light / Dark. Seed buttons: Me → Admin tools (only when a task says so).

## 4. Regression checklist (run the relevant parts for each review request)
Mark each **PASS / FAIL** with a one-line note.

**A. Map (Spec v2 + windowing)**
1. Current unit drawn in full; finished units are cards ("Tap to review" expands); next unit is a teaser
   ("Beat the <Boss> to open"); further units show "N more units ahead".
2. On opening, the current node sits on the left, in the lower part of the screen.
3. Locked items show a lock and an explanation when tapped; nothing opens.
4. No back-arrow buttons in headers; Android back works everywhere.
5. Light and dark mode both readable (Me → Look → Light / Dark).

**B. Steps and quizzes**
1. Main node opens Learn first, then its quiz (Quiz Details: Training / Exam).
2. Training mode has hearts; Exam mode has none. Results show "Progress saved ✓" and ✕ / "Exit to Study".
3. Finishing the main node opens its practice leaves, Challenge and ♾️.

**C. Gates** (turn on Tester mode → Short quizzes to save time)
1. Pass: "🎉 <next> unlocked!", per-topic ✓ marks, next topic opens on the map.
2. Fail with one topic all wrong: "So close!", ⚠️ on that topic, that practice leaf glows ✨.
3. Fail twice: Challenge shows "Practise first" with a lock; finishing a glowing leaf unlocks it again.

**D. Reading**: step-by-step mode reveals the next paragraph after each answer; "Show me where" highlights;
underlined words show meanings; 🔊 reads aloud and stops when leaving the screen.

**E. ♾️ Keep practising**: no hearts; streak and ✓ count update; Next / Stop; summary shows questions,
% right, best streak, "Practice saved ✓"; Nouns mixes generated plural/gender questions (after a re-seed).

**F. 🚩 Report**: reason chips, optional note, "✓ Reported" afterwards (same question can't be reported twice).

**G. Offline**: open the map once online, then `eq.sh offline`: intro, map, Quiz Details and a quiz still work.
`eq.sh online` afterwards.

**H. Tester mode**: visible only on the tester account; "Unlock everything" opens all units (view only);
switching it off restores the real progress.

**I. Space quest regression**: Quest tab (V2 switch on) still loads and opens a quiz as before.

## 5. Reporting
Add a section to `CODE_REVIEW.md`:

```
## <date> — QA run: <what> (<commit>)
- Result: X PASS / Y FAIL
- Checklist: A1 PASS, A2 FAIL (current node on the right after expanding Unit 0), …
### Finding N: [SEVERITY] [QA] <title>
- Steps: …   - Expected: …   - Actual: …   - Screenshot: /tmp/apprec8-qa/<name>.png
```
Severity: **HIGH** = blocks a kid / wrong content / crash; **MEDIUM** = confusing; **LOW** = polish.

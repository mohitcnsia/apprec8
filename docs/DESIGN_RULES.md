# Apprec8 design rules (owner-approved direction, 2026-11-04)

The app is for kids on phones: **easy, calm and intelligent**. Every screen follows these rules.
Mockups: quiz canvas boards E–I. Colours come from `components/quiz/quizPalette.js` (light + dark).

1. **One loud thing per screen.** Only the kid's next step is big, coloured or moving. Everything else is quiet.
2. **The main action is in the thumb zone:** the primary button is at the bottom (sticky, full width, ≥ 56 px tall), never
   high on the screen. One hand must be enough. A card at the top may say what's next, but the button stays low.
   Answers in quizzes sit just above CHECK.
3. **Colours have one job each.** Purple = you are here / main action; gold = Challenges, stars, rewards; green = ✓ done
   (small); red = mistakes only; everything else neutral (white / light grey, or dark grey in dark mode). No new colours.
   One exception: Learn cards (mockup R) use soft note tints, **dim and muted in dark mode** (owner 2026-11-05: nothing
   bright may jump out of the dark theme; it hurts the eyes).
4. **Fold, don't delete.** Finished things collapse into a one-line chip ("⭐⭐⭐ · 3 practice · 👑 Champion ›"); tap to open.
   Locked things are faint. Nothing the kid needs is removed.
5. **Same spacing everywhere** (8 / 12 / 16 / 24 px), thin borders (1–2 px), short labels (full text on tap).
6. **Details in tap cards.** New information goes into cards that open on tap, not onto the main screen.
7. **Text never breaks mid-word;** instructions are small labels, the thing to look at is big (board E).
8. **Calm motion:** one small animation at a time; nothing blocks taps (confetti passes touches through);
   respect "Remove animations" (`hooks/useReduceMotion.js`). Hide the status bar while reading or playing.
9. **Both themes, always:** test light AND dark; never white-on-white.

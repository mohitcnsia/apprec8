# Feedback log, 2026-11-04 (kept for planning; not acted on yet, per owner)

## Seema (English teacher, Pratha's school) — reviewed English Quest Units 0–1
1. **Too slow for older kids:** a Class 10 student would waste a lot of time on easy early nodes before reaching their level.
2. **Too easy overall:** good for motivation, but there should be leaves that give Olympiad aspirants a real challenge.

## Owner's observations (phone test of 20.0.25)
1. **Tile answers break mid-word** ("Exclamati-on", "Statemen-t") in the 2×2 tiles. Confusing and looks bad.
2. **Instruction and the sentence to look at look the same** ("What kind of sentence is this? 'Don't touch the hot pan.'"):
   no distinction between the instruction and what the kid must examine. Lots of empty space below the question and between
   options could be used better. (Discuss.)
3. **Confetti on the results page blocks taps:** the teacher thought the app was stuck. (Discuss.)
4. **Where does the Space quest belong?** Inside Science, or keep IEO / NSO / IMO as "Olympiad quests" (syllabus untouched) and
   add separate quests for interesting topics (space, agriculture, discoveries, encyclopedic). (Discuss.)
5. **While reading/playing, hide the top and bottom bars and extra icons:** too much on screen, not clean.
6. **Too many hops to start a quiz:** node → details screen (description, Training / Exam, stars) → the new start screen → quiz.
   Merge into the newer screen with all needed info.
7. **The Challenge (gate) that unlocks the next topic is tiny and far right:** after Pronouns, Verbs didn't open because the
   Pronoun Challenge wasn't done, and the teacher barely noticed it. Confusing.
8. **Voice typing for kids** (feedback and answering questions): is speech-to-text easy / costly?

## Later the same day (owner + teacher)
9. **Every screen feels cluttered**, though all the information is logical: keep it all (and add more value), but calmer.
   Plan (Claude): one design system for all screens: one loud thing per screen, colours with one job each, fold finished
   things into chips (tap to open), consistent spacing, shorter labels, details in tap-to-open cards. Mockups first.
10. **TODO (owner): clap for the leaders.** Kids see who leads the leaderboard and can 👏 clap for them, to appreciate hard work.
    Fits RB-6 (no chat, preset reactions only). Notes: one clap per kid per leader per day, counted by the server (no spam,
    no faking); the leader sees "👏 12 claps this week"; first names + class only.

11. **Teacher assignments (owner):** teachers assign specific nodes to students or classes, so lagging kids work on what is needed. Spec draft: `CODE_REVIEW.md` → RB-7.
12. **Well-being + "don't depend on teachers" (owner):** kids report problems and the app helps even if teachers don't. Spec draft: `CODE_REVIEW.md` → RB-8.

## Pratha's first session on 20.0.26 (via owner)
13. **Mascot cheered on a very low score** (she answered everything wrong on purpose): results must match performance:
    encouraging, not congratulating, when the score is low.
14. **Kids' own questions** ("when do I use who, whose, whom?"): help kids get precise answers while keeping the app free
    (live AI for every question would be costly).
15. **Mistake bank:** for each mistake, more similar questions so kids master it; common mistakes across kids → weekly
    training set / daily question.
16. **Screen titles waste space** ("My progress", "Fun", "Me"): remove; use the space better. **Me:** profile picture and name
    are too small; kids love seeing their picture: make it big.
17. **Voice:** Pratha used the keyboard mic fine; in-app mic OK; can it handle Hindi?
18. Owner: build the "later" specs (RB-2, 6, 7, 8) today if possible; don't open all units for Pratha (she works her way up).

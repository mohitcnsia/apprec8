# Agent board

STOP: no
AWAY: no
<!-- AWAY: yes = the owner is away for 1 h+, so heavy work (emulator, builds) may run. Claude sets it when the owner says so. -->
<!-- Owner or Claude: change the line above to "STOP: yes" to halt Gemini at its next check. -->

**Updated:** 2026-11-04 by Claude · **Goal:** Pratha ready for IEO (17 Nov) and NSO (19 Nov) · **Base branch:** `feat/quiz-redesign`
**Owner priorities (2026-11-04):** 1) content accuracy, 2) a great app for kids, as soon as possible. Only the owner and Pratha use it now, so
breaking it is OK: ship often to internal testing, test on the owner's phone, keep emulator use short (slow Mac).
Accuracy pipeline: Gemini writes → Claude checks every question → Pratha's mother (English teacher) 🚩 in the app → owner OK → kids.
**How this works:** Claude (lead) writes tasks here; Gemini picks them up with `scripts/agents/next-task.sh`, works in its own
folder (`../apprec8-gemini`), and reports by commit (`gemini(Gxx): done …`) + `docs/agents/reports/Gxx.md` on its branch.
Claude reviews, merges and moves the task to done. The owner talks only to Claude. Rules: `docs/agents/GEMINI_ONBOARDING.md`.

## Waiting for the owner (Claude asks; nobody does these without the owner's OK)
0. **Fix 46 old IEO questions:** owner OK 2026-11-04. The emulator froze twice, so the fix button ships in the next build; the owner presses it once on the phone (Me → Admin tools).
1. **Nov 6 build:** which branch goes in (`feat/nov6-improvements` only, or also the redesign on `feat/quiz-redesign`)?
2. **DR-8** deploy `getLeaderboard` (first name + class) and **Finding 22** rules fix (`CODE_REVIEW.md`).
3. **Seed the Science Quest draft** (testers only) so it can be tested on the emulator.
7. **20.0.25 internal-testing build** (Claude building now): owner uploads to Play internal testing, tests on own phone, then Pratha + her mother. School release only after their OK (owner).
4. ~~Seed English Unit 2~~ owner OK 2026-11-04 → in G14.
5. ~~Sample papers~~ NSO added (in `docs/exam/papers/nso/`); **IEO papers** → `docs/exam/papers/ieo/` (owner, soon).
6. RB-2 questions (4, in `CODE_REVIEW.md`) — after the exams is fine.

## Now

| Task | Who | State | Branch | Result |
|---|---|---|---|---|
| G15 English Unit 2 answer-key review | Gemini | done → Claude accepted as structure check | `gemini/g15-unit2-review` | 111 checked, 0 fixed. Claude spot-checked; notes were templated (feedback in G18) |
| G16 Science Unit 1 "The Living World" (Class 5) | Gemini | fixes 2 | `content/sq-u1-living-world` | Facts + wording fixed; overcorrected: right answer now NEVER longest (0%), options too wordy |
| G18 NSO pattern notes | Gemini | **done, merged** | `gemini/g18-exam-patterns` | Good: `docs/exam/nso-pattern.md` (sections, weightage, 9 question styles, gap list) |
| G17 English Unit 3 Subject-Verb Agreement | Gemini | fixes 1 | `content/eq-u3-sva` | 105 questions + reading; Claude read all: 5 fixes (British spelling, 1 grammar error, 2 wording) |
| G19 Science Unit 2 "Human Body & Health" (Class 5) | Gemini | todo | `content/sq-u2-human-body` | |
| G20 Science Unit 3 "Matter, Forces & Earth" (Class 5) | Gemini | todo | `content/sq-u3-matter-forces-earth` | |
| G14 Seed English Unit 2 + 10-min smoke test | Claude (Gemini idle) | **done** 2026-11-04 15:13 | — | Seeded: 4 units, 64 nodes, 270 questions, 3 readings. Map shows 3 units; Home "Coming up" fix confirmed |
| G11 Policy research (Play Families, DPDP) | Gemini | parked (after exams) | | |

**Done:** G1 DR-7 old function images kept 1 day (Gemini, 2026-11-04) · G8 quiz redesign QA (findings fixed in `0ae2db2`).

---

## Task details (Gemini reads these; one task at a time, top to bottom)

### G15 · [todo] · gemini · English Unit 2 answer-key review
**Why:** Unit 2 (Articles & Determiners) is written but not seeded; IEO is on 17 Nov. **Base:** `feat/quiz-redesign`.
**Do:** read every Unit 2 question in `data/englishQuestData.js` (section "Unit 2: Articles & Determiners", quizzes `eq-u2-*`
and reading `eq-read-rooftop-garden`). For each: exactly one correct option; no wrong option also defensible; facts true;
explanation clear for a Class 5 kid; read-aloud rule (practice questions: one blank, no apostrophe inside the quoted sentence).
**Fix in place** (never reorder or delete: ids are positions). Gate/Boss questions: review them too, but don't show them to Pratha.
**Deliver:** branch `gemini/g15-unit2-review`; `docs/agents/reports/G15.md` = table (question id · OK / FIXED / UNSURE · note);
`npm test` green. Commit `gemini(G15): done — N checked, M fixed, K unsure`.

### G14 · [done] · claude · Seed English Unit 2, then QA the redesign on the emulator
**Owner-approved: yes** (2026-11-04) for ONE production step: seeding English Quest. Nothing else.
**Wait first:** start the emulator only while the board says `AWAY: yes` (the owner's Mac is slow when they use it), and never
while a build runs (`pgrep -f "eas build"`). Until then, skip G14 for now: commit `gemini(G14): blocked — waiting for AWAY: yes`
and go on with the next task; Claude reopens G14 as `[fixes 1]` when the window comes.
**Setup:** in your folder `git checkout --detach feat/quiz-redesign` (latest), `npx expo start`, emulator `Pixel_8a_API_35`,
`scripts/qa/eq.sh prep`, restart the app; sign in as the tester/admin account (mohitchilkoti@gmail.com), never a kid's.
**1. Seed:** Me → Admin tools → **Update English Quest** → confirm "LIVE". Check the alert says 3 units (+ teaser). Do NOT press
the Science or other seed buttons. Open English Quest: Unit 2 "Articles & Determiners" appears after Unit 1's Boss.
**2. Short smoke test only, max 10 minutes** (owner 2026-11-04: the Mac is slow and the owner tests on the phone): light mode
only. Home shows the "Coming up" card text; open Unit 2's first topic and answer 2 questions (one wrong: Chamak's kind "oops"
face); Progress and Me open. Then close the emulator (it slows the Mac a lot).
**Rules:** 2 tries per step then move on (`docs/qa/QA_PLAYBOOK.md`). Report what the screenshot shows.
**Deliver:** branch `gemini/g14-qa`; `docs/agents/reports/G14.md` = table (item · PASS / FAIL / SKIPPED · screenshot · note),
FAILs first with steps to repeat. Commit `gemini(G14): done — P pass, F fail`. Then `eq.sh unprep`.

### G18 · [todo] · gemini · NSO (and IEO) exam pattern notes from the owner's papers
**Feedback on G15 first:** your table notes were generated from a template ("Clean: egg before target noun/phrase"), so
they don't show what you checked. A review note must say what you actually verified, or the review doesn't count.
Quality over speed: one honest UNSURE is worth more than 111 OKs.
**Papers:** `/Users/mohitchilkoti/Documents/projects/apprec8/docs/exam/papers/` (Claude's folder, **read only**; not in git and
not in your folder on purpose). Never copy a question or passage into git or the app: notes describe patterns only.
**Do:** for each PDF note class, level (1 / 2), subject, year. Then write `docs/exam/nso-pattern.md` (and `ieo-pattern.md` if
any IEO papers): sections and marks; topics per class with how often they appear; question styles (e.g. "which of these",
odd one out, assertion–reason, picture-based, 2-statement true/false) with an *invented* example of each; difficulty of the
Achievers section; **gap list** = what Science Quest Unit 1 (your G16) and planned units don't cover yet, Class 5 first.
**Deliver:** branch `gemini/g18-exam-patterns` (base `feat/quiz-redesign`), the pattern files, `docs/agents/reports/G18.md`;
commit `gemini(G18): done — N papers read`. Then re-check your G16 questions against the patterns and note changes for Claude.

### G16 · [fixes 2] · gemini · Science Unit 1 "The Living World" for Class 5
**Why:** NSO on 19 Nov; Pratha is Class 5. **Base:** `feat/quiz-redesign`. **Guide:** `docs/CONTENT_GUIDE.md` (all of it, §8 for Science).
**Do:** in `data/scienceQuestData.js`, unit `sq-u1`: keep or improve `sq-living`, then add 2–3 more topics from SOF's published
NSO Class 5 syllabus that fit "living world" (e.g. plants, animals and adaptations, human body / food and health). Each topic:
Learn page + warm-up quiz (6–8 questions), 1–2 practice leaves tagged by sub-topic, a gate (pool ≥ 15, 3 sub-topics × 5),
then a Unit Boss (pool ≥ 15). Tag every node with `forGrades` (Class 5 must see all of them; add 4 / 6 only where true).
Original questions only; NSO style (some "Which of these…", some picture-free reasoning); kid-friendly explanations.
Keep `quest.draft: true`.
**Deliver:** branch `content/sq-u1-living-world`; `docs/agents/reports/G16.md` (topics, question counts, anything unsure);
`npm test` green. Commit `gemini(G16): done — N topics, Q questions`. Claude checks accuracy before the owner sees it.

**Claude's review of your G16 (`a043ebb`), fixes 1. Do this after G18 so the fixes follow the real NSO patterns.**
Good: all 102 answer keys are right, explanations are clear, grade tags make sense. Fix on the same branch, append-only rules apply
(fix in place, keep positions):
1. **Outdated fact:** Siberian cranes no longer reach India (last seen at Bharatpur in 2002). `sq-animals-warmup` q6 and
   `sq-u1-test` q11 say they come every winter. Use a bird that still does (e.g. Amur falcon to Nagaland, bar-headed goose,
   greater flamingo to Gujarat), or ask in the past tense.
2. **Unclear wording:** `sq-plants-warmup` q6 "plants potato tubers with small 'eyes' cut out" reads as "eyes removed". Say
   "plants pieces of potato, each with an 'eye'".
3. **Joke distractors (the big one).** Many wrong options can be ruled out without knowing any science, which makes NSO
   practice too easy: e.g. "Because crystals can run", "They turn the leopard into a herbivore", "Apples and mangoes",
   "They turn into metal objects", "Because the balloon eats food", "made of cotton" (clouds). NSO options are all plausible.
   Replace them with real misconceptions (e.g. for "how do fish breathe": lungs / skin / spiracles), one per wrong option,
   with a fitting mistakeTag. Priority: gates and the Boss, then warm-ups and practice.
5. **Length tell:** the right answer is the longest option in 69 of 102 questions (68%); a kid can score by picking the
   longest. `npm test` now fails above 40% (`tests/content.test.mjs`). Make wrong options as long and specific as the right one.
4. Small: `sq-plants-warmup` q2 says food is in the cotyledons; true for beans and gram, but maize and rice keep it in the
   endosperm. Add "in beans and gram" or pick a dicot in the question. Ferns have sori, mosses have capsules (gate q14 explanation).
**Deliver:** commit `gemini(G16): fixed 1 — <counts>`, and add a "fixes 1" section to `docs/agents/reports/G16.md` listing every changed question id.

**Claude's review of fixes 1 (`031392a`), fixes 2:** facts and wording are fixed and the distractors are much more plausible. Two problems:
1. **Overcorrected length:** the right answer is now never the longest option (0%). "Never pick the longest" is as easy to game as
   "always pick it". Aim for 20–35%. `npm test` now fails below 10% and above 40%.
2. **Too wordy for Class 5:** e.g. "It grows by external deposition of molecules, lacking cells, metabolism, or reproduction",
   "inert mineral stone". Options must be short (≤ 14 words; `npm test` checks) in words a 10-year-old uses. Same length
   for all four options of a question, not all long.
3. **NSO styles** (from your `docs/exam/nso-pattern.md`): make at least 5 gate/Boss questions in styles A (analogy),
   B (multi-statement), E (experiment) or G (matching). Append new questions at the end of the pools; don't reorder.
Commit `gemini(G16): fixed 2 — …` with a "fixes 2" section in the report.

### G17 · [fixes 1] · gemini · English Unit 3 Subject-Verb Agreement
**Why:** next IEO grammar unit. **Base:** `feat/quiz-redesign`. **Guide:** `docs/CONTENT_GUIDE.md` §2–7 (unit file template,
`data/englishQuest/units/u3.js`, register in `units/index.js`, `nextUnitTeaser` → Unit 4).
**Do:** 3 topics (e.g. singular/plural subjects, tricky subjects: each / everyone / pair nouns, there is / there are), each with
Learn page, warm-up, practice leaves by sub-topic, gate; Unit Boss + one reading. Same rules as Unit 2.
**Deliver:** branch `content/eq-u3-sva`; `docs/agents/reports/G17.md`; `npm test` green. Commit `gemini(G17): done — …`.

**Claude's review (`f57fea2`), fixes 1.** All 105 questions + the Clock Tower reading read; keys are right. Fix in place:
1. **British spelling (IEO uses it):** `eq-u3-test` q5 answer "practice" (verb) → "practise" (options: practises / practised /
   is practising; explanation too). Reading `eq-read-clock-tower`: "cozy" → "cosy".
2. **Grammar error:** `eq-u3-tricky-quiz` q2 "Rohan and Kabir ___ best friends since kindergarten": "since" needs "have been",
   so no option is right. Drop "since kindergarten" (e.g. "best friends in class").
3. **Apostrophe dodge broke the grammar:** `eq-u3-tricky-pairs-quiz` q6 "on the teacher table" and `eq-u3-tricky-gate-pool` q15
   "from the captain belt". Rephrase without a possessive ("on the table", "from a hook").
4. `eq-u3-tricky-gate-pool` q9: "Pencil or pen" → "A pencil or a pen".
5. UNSURE (keep, just note it in the report): `eq-u3-tricky-pairs-quiz` q5 "The cricket team ___ practising": British usage also
   allows "are". Indian school grammar says "is", so keep.
Commit `gemini(G17): fixed 1 — …`.

### G19 · [todo] · gemini · Science Unit 2 "Human Body & Health" for Class 5
**Why:** your G18 notes: Human Body & Health is the biggest NSO Class 5 domain (8–10 questions per paper), and we have none.
**Base:** `feat/quiz-redesign` (has your pattern notes). **Guide:** `docs/CONTENT_GUIDE.md` §8, `docs/exam/nso-pattern.md`, `docs/agents/LESSONS.md`.
**Do:** unit `sq-u2` in `data/scienceQuestData.js` (or `data/scienceQuest/units/u2.js` + registration, your choice): 3 topics,
e.g. bones, joints and muscles · digestion, teeth and food (nutrients, balanced diet, deficiency diseases) · nervous system and
sense organs (+ communicable diseases if it fits). Same shape as Unit 1 (Learn page, warm-up, practice by sub-topic, gate ≥ 15,
Boss ≥ 15). Tag `forGrades` honestly. At least a third of gate/Boss questions in NSO styles A/B/E/G (one right answer only).
Short, kid-level options; the right answer is the longest about a quarter of the time. Change Unit 1's `nextUnitTeaser` /
teaser unit so Unit 3 shows as "coming soon". Keep `quest.draft: true`.
**Deliver:** branch `content/sq-u2-human-body` (base: your G16 branch once fixes 2 is done, so Unit 1 + 2 sit together);
`docs/agents/reports/G19.md` incl. your 5 least-sure questions; `npm test` green. Commit `gemini(G19): done — …`.

### G20 · [todo] · gemini · Science Unit 3 "Matter, Forces & Earth" for Class 5
**Base:** your G19 branch. Same rules as G19. 3 topics, e.g. states of matter, changes and separation · forces, energy and
simple machines · Earth, rocks and the Moon. **Deliver:** branch `content/sq-u3-matter-forces-earth`, report G20, commit `gemini(G20): done — …`.

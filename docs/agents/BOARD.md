# Agent board

STOP: no
AWAY: yes
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
- ~~DR-8/9/10 + Finding 22~~ owner OK 2026-11-04 → G27 (Gemini deploys).
0. **Fix 46 old IEO questions:** owner OK 2026-11-04. The emulator froze twice, so the fix button ships in the next build; the owner presses it once on the phone (Me → Admin tools).
1. **Nov 6 build:** which branch goes in (`feat/nov6-improvements` only, or also the redesign on `feat/quiz-redesign`)?
2. **DR-8** deploy `getLeaderboard` (first name + class) and **Finding 22** rules fix (`CODE_REVIEW.md`).
3. **Seed the Science Quest draft** (testers only) so it can be tested on the emulator.
7. **20.0.26 build** (owner feedback fixes + IEO fix button) is ready to build: **owner, tell Claude when you are away ~1 h.** Then upload + press "Fix 46 old IEO questions".
8. **Mockups E–G** (quiz canvas): instruction vs sentence, one start screen, Challenge on the path + Test out + Champion. Owner reacts.
4. ~~Seed English Unit 2~~ done. **Seed English Unit 3** (merged, Claude-reviewed): owner OK? Ideally Seema glances at it first.
5. ~~Sample papers~~ NSO in `docs/exam/papers/nso/`, IEO in `docs/exam/papers/ieo/` (owner, 2026-11-04): IEO → task G21.
6. RB-2 questions (4, in `CODE_REVIEW.md`) — after the exams is fine.

## Now

| Task | Who | State | Branch | Result |
|---|---|---|---|---|
| G15 English Unit 2 answer-key review | Gemini | done → Claude accepted as structure check | `gemini/g15-unit2-review` | 111 checked, 0 fixed. Claude spot-checked; notes were templated (feedback in G18) |
| G16 Science Unit 1 "The Living World" (Class 5) | Gemini | **done** (fixes 2 accepted) | `content/sq-u1-living-world` | 108 questions, length tell 24%, 6 NSO-style; merges with G19 |
| G18 NSO pattern notes | Gemini | **done, merged** | `gemini/g18-exam-patterns` | Good: `docs/exam/nso-pattern.md` (sections, weightage, 9 question styles, gap list) |
| G17 English Unit 3 Subject-Verb Agreement | Gemini | **done, merged** | `content/eq-u3-sva` | All 5 fixes checked by Claude. Seeding waits for owner OK |
| G21 IEO pattern notes | Gemini | **done, merged** | `gemini/g21-ieo-patterns` | Gaps: no vocabulary (20–25% of IEO), no spot-the-error, no dialogue/idioms, easy distractors |
| G19 Science Unit 2 "Human Body & Health" (Class 5) | Gemini | fixes 1 | `content/sq-u2-human-body` | 96 questions, all keys right (Claude read all); 5 joke distractors, 2 small facts |
| G24 Syllabus check: NSO + IEO Class 5 vs our quests | Gemini | todo (next after G19) | `gemini/g24-syllabus` | |
| G22 "Word Power" vocabulary unit | Gemini | done → restructure in G25 | `content/eq-u4-vocab` | 108 questions; Claude reviews after G25 |
| G23 Spot the error, dialogue & idioms | Gemini | done → restructure in G25 | `content/eq-u5-error-dialogue` | 108 questions; Claude reviews after G25 |
| G27 ⭐ Deploy DR-8, Finding 22, DR-9, DR-10 (owner OK) | Gemini | todo (next) | from Claude's folder | |
| G25 Separate "Word Power" quest | Gemini | **done, merged** | `content/word-power` | Fixes checked; Claude fixed 1 backslash + 2 wrong Learn-page rules. Seeding waits for owner (Seema to review) |
| G26 Emulator smoke test (calm pass 1) | Gemini | **done** 5 pass / 1 fail | `gemini/g26-smoke` | Fail = second Start page; Claude fixed (`d67b0ba`, `3329b72`) |
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

### G27 · [todo] · gemini · ⭐ Deploy DR-8 + Finding 22 + DR-9 + DR-10 (owner-approved: yes, 2026-11-04)
**Owner-approved: yes** for exactly these production steps. Run them from **Claude's folder**
`/Users/mohitchilkoti/Documents/projects/apprec8` (it has `firestore.rules` and `firebase.json`; don't edit any file there).
Claude already merged all the new rules into `firestore.rules` (backup: `~/apprec8-backups/firestore.rules.before-DR9-10`).
1. `git -C /Users/mohitchilkoti/Documents/projects/apprec8 status`: must show no uncommitted code changes except docs. Branch `feat/quiz-redesign`.
2. `cd functions && npm test` (if present) / `node -e "require('./index.js')"` must load without errors.
3. `firebase deploy --only functions --project apprec8-ca229` (all functions; they're backward compatible).
4. `firebase deploy --only firestore:rules --project apprec8-ca229`. If it fails to compile, STOP, don't retry: report the error.
5. IAM (custom tokens for child sign-in):
   `gcloud projects add-iam-policy-binding apprec8-ca229 --member=serviceAccount:apprec8-ca229@appspot.gserviceaccount.com --role=roles/iam.serviceAccountTokenCreator`
   (if gcloud isn't available, report it: the owner does it in Google Cloud Console → IAM).
6. Check: Firebase Console → Functions lists approveMember, createChildProfile, switchToChild; Rules tab shows today's version.
**Not yours:** making Seema an admin (needs her uid after she signs in; owner/Claude do it).
**Deliver:** `docs/agents/reports/G27.md` (each step: done / error text), commit `gemini(G27): done — …` on your branch.
**Rollback if the app breaks:** Rules tab → previous version → publish; functions: redeploy from `backup/2026-11-04/feat/quiz-redesign`.

### G25 · [done] · gemini · Separate "Word Power" quest (owner decision): restructure G22 + G23 (do this first)
**Why (owner 2026-11-04):** vocabulary is its own tree, not English Quest Unit 4: it must be open from day one (Pratha is in
Unit 1; IEO is on 17 Nov) and not locked behind grammar Bosses.
**Do (base: your `content/eq-u5-error-dialogue` branch, which has G22 + G23):**
1. New quest module `data/wordPowerQuestData.js` (`QUEST_ID = "word-power"`, title "Word Power", tile `carouselGroup: "quest"`,
   `order: 2`, description e.g. "Words, spelling, idioms and everyday English", `draft: false`), registered in `data/quests/index.js`.
2. Move into it: G22's three topics (synonyms & antonyms, spelling, word choice) as Unit 1 "Word Power", and G23's dialogue +
   idioms topics as Unit 2 "Everyday English". Renumber unitOrder from 1. Keep question content and order; ids may stay as they are
   (they must stay unique; nothing is seeded yet).
3. **Spot the error stays in English Quest** (it's grammar): make it English Quest Unit 4 "Spot the Error" (its own gate + Boss),
   after Unit 3; teaser → Unit 5.
4. Class tags per `docs/CONTENT_GUIDE.md` §9 (topic from its first class; harder leaves tagged by class).
5. `npm test` green (all quests checked, ids unique). Report G25: what moved where, counts.
Commit `gemini(G25): done — …`. Claude then reviews all G22/G23 questions for accuracy.

**Claude's review (`c186564`), fixes 1.** All Word Power + Spot the Error questions read; every key is right. Fix in place:
1. **Two right answers:** `wp-colloc-nature-quiz` q1 (baking / burning heat are natural too: use non-collocations, e.g. "fried / toasted");
   `wp-dialogue-gate-pool` q14 (ignited / kindled curiosity are fine too); `wp-spelling-gate-pool` q15 ("program" is a correct US
   spelling: use another word, e.g. colleague / collegue / colleage / coleague); `wp-synant-gate-pool` q12 (a "dangerous" cave fits:
   add "and stayed warm and safe" to the sentence).
2. **Two errors in one sentence:** `eq-u4-test` q4 part C "to the teacher question" → "to the question". `eq-u4-test` q8: "o'clock".
3. **Answer given away / wrong meaning:** `wp-spelling-gate-pool` q12 ("calendar record of days" → "a chart of the days and months of
   a year"); q13 (twelfth = "coming after the eleventh", not "twelve in count"); q3 (occurred = "happened, past tense of occur").
4. **Idiom form:** `wp-idioms-gate-pool` q10 → "the lion's share" (apostrophes are fine in gates).
5. **Modern usage:** `eq-u4-errors-gate-pool` q6 ("their own pencil" is accepted today): replace with a clear error.
6. **"No error" is never right** in 37 Spot-the-Error questions: make it the right answer in ~4 of them (rewrite those sentences correctly).
7. **Joke / rude replies in dialogues** (lesson 3): e.g. "Give me money instead", "I will ignore you", "You are noisy too",
   "We were forced to come". IEO options are polite but wrong for the situation or ungrammatical ("Yes, I mind", "Certainly not").
   Fix in all dialogue gates + `wp-u2-test`; practice quizzes too if time.
8. Small: `wp-synant-context-quiz` q2 tranquil ≠ silent (use "hushed"); `wp-u2-test` q5 "a kind and thoughtful thought" → "a kind idea".
Seema reviews English after this. Commit `gemini(G25): fixed 1 — …`.

### G26 · [todo] · gemini · Emulator smoke test: calm pass 1 (20 min max)
**Owner-approved:** emulator use while `AWAY: yes`. No seeding, no deploys.
**Wait first:** don't start while a build runs (`pgrep -f "eas build"`): run `sleep 300` and check again (don't end your turn).
**Setup:** your folder → `git checkout --detach feat/quiz-redesign`, `npx expo start`, emulator `Pixel_8a_API_35`,
`scripts/qa/eq.sh prep`, restart the app, tester account. If the emulator says "isn't responding" twice, stop and report blocked.
**Check (light mode, screenshots):** Home (dark "Next up" card, two chips, shelves, CONTINUE at the bottom) · open a quiz node:
ONE start screen, START at the bottom, quiz starts at once · a "What kind of sentence…" question shows a small label + big
sentence card · answer most questions wrong → results say "Let's try that again" with a thinking Chamak · map: finished
topics show one chip that opens on tap · Me: big profile picture, no "Me" title.
**Deliver:** branch `gemini/g26-smoke`, `docs/agents/reports/G26.md` (item · PASS/FAIL · screenshot · note), commit
`gemini(G26): done — P pass, F fail`, then `eq.sh unprep` and close the emulator.

### G21 · [done] · gemini · IEO exam pattern notes (do this before anything else)
**Why:** IEO is on 17 Nov; Claude needs the real difficulty to judge English Quest (the teacher says it's too easy for aspirants).
**Papers:** `/Users/mohitchilkoti/Documents/projects/apprec8/docs/exam/papers/ieo/` (read only; never copy questions).
**Do:** like G18: per paper class / level / year; `docs/exam/ieo-pattern.md` with sections and marks, topic weightage for Class 5,
question styles with *invented* examples, the Achievers section's difficulty, and a **gap list vs English Quest Units 0–3**
(topics missing, and where our questions are easier than the papers: name 3–5 concrete examples of each).
**Deliver:** branch `gemini/g21-ieo-patterns` (base `feat/quiz-redesign`), report G21, commit `gemini(G21): done — N papers read`.

### G16 · [done] · gemini · Science Unit 1 "The Living World" for Class 5
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

### G17 · [done] · gemini · English Unit 3 Subject-Verb Agreement
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

### G19 · [fixes 1] · gemini · Science Unit 2 "Human Body & Health" for Class 5
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

**Claude's review (`43c599c`), fixes 1:** all 96 answer keys right, NSO styles well done. Fix in place:
1. Joke distractors → real misconceptions: `sq-bones-gate-pool` q10 ("knee joint rotating in full circles", "knee bone turning
   into muscle"), `sq-food-gate-pool` q10 ("saliva turns into solid rock", "enamel evaporates"), `sq-nervous-gate-pool` q7
   ("closes and turns yellow"), `sq-u2-test` q13 ("long written message to the cactus", "electric shock").
2. `sq-food-gate-pool` q14: apples have little iron; use dates or green leafy vegetables.
3. British spelling: "orthopedic" → "orthopaedic" (`sq-bones-gate-pool` q9).
Commit `gemini(G19): fixed 1 — …`.

### G24 · [todo] · gemini · Syllabus check: NSO + IEO Class 5 vs our quests (before writing more units)
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

### G22 · [todo] · gemini · English Unit 4 "Word Power" (IEO vocabulary) for Class 5
**Why:** your G21 notes: synonyms, antonyms, spelling and word choice are 20–25% of IEO, and we have none. IEO is on 17 Nov.
**Base:** `feat/quiz-redesign` (has Unit 3). File `data/englishQuest/units/u4.js`, register it, teaser → Unit 5.
**Do:** 3 topics: synonyms & antonyms (Class 5 IEO level, e.g. brave/courageous, scarce/plentiful) · spelling (pick the
correctly spelt word; common traps: separate, necessary, beautiful, receive) · word choice & collocations (flames flicker,
people shiver). Each: Learn page with word lists + examples, warm-up, practice by sub-topic, gate ≥ 15; Unit Boss ≥ 15.
Distractors must be near-misses (all four words close in meaning or spelling), never silly. British spelling.
Practice questions: one blank, no apostrophe inside the quoted sentence. Include 1 reading with a glossary.
**Deliver:** branch `content/eq-u4-vocab`, report G22 with your 5 least-sure questions, `npm test` green, commit `gemini(G22): done — …`.

### G23 · [todo] · gemini · English Unit 5 "Spot the error, dialogue & idioms"
**Base:** your G22 branch. **Do:** 3 topics: spot the error (a sentence in 4 parts A/B/C/D, one wrong; or "No error"), dialogue
(choose the right reply in a short conversation, as in IEO Q41–45), common idioms (meaning, in context). Same shape and rules.
**Deliver:** branch `content/eq-u5-error-dialogue`, report G23, commit `gemini(G23): done — …`.

### G20 · [todo] · gemini · Science Unit 3 "Matter, Forces & Earth" for Class 5
**Base:** your G19 branch. Same rules as G19. 3 topics, e.g. states of matter, changes and separation · forces, energy and
simple machines · Earth, rocks and the Moon. **Deliver:** branch `content/sq-u3-matter-forces-earth`, report G20, commit `gemini(G20): done — …`.

# Agent board

STOP: no
<!-- Owner or Claude: change the line above to "STOP: yes" to halt Gemini at its next check. -->

**Updated:** 2026-11-04 by Claude · **Goal:** Pratha ready for IEO (17 Nov) and NSO (19 Nov) · **Base branch:** `feat/quiz-redesign`
**Owner priorities (2026-11-04):** 1) content accuracy, 2) a great app for kids, as soon as possible. Only the owner and Pratha use it now, so
breaking it is OK: ship often to internal testing, test on the owner's phone, keep emulator use short (slow Mac).
Accuracy pipeline: Gemini writes → Claude checks every question → Pratha's mother (English teacher) 🚩 in the app → owner OK → kids.
**How this works:** Claude (lead) writes tasks here; Gemini picks them up with `scripts/agents/next-task.sh`, works in its own
folder (`../apprec8-gemini`), and reports by commit (`gemini(Gxx): done …`) + `docs/agents/reports/Gxx.md` on its branch.
Claude reviews, merges and moves the task to done. The owner talks only to Claude. Rules: `docs/agents/GEMINI_ONBOARDING.md`.

## Waiting for the owner (Claude asks; nobody does these without the owner's OK)
1. **Nov 6 build:** which branch goes in (`feat/nov6-improvements` only, or also the redesign on `feat/quiz-redesign`)?
2. **DR-8** deploy `getLeaderboard` (first name + class) and **Finding 22** rules fix (`CODE_REVIEW.md`).
3. **Seed the Science Quest draft** (testers only) so it can be tested on the emulator.
7. **20.0.25 internal-testing build** (Claude building now): owner uploads to Play internal testing, tests on own phone, then Pratha + her mother. School release only after their OK (owner).
4. ~~Seed English Unit 2~~ owner OK 2026-11-04 → in G14.
5. ~~Sample papers~~ added by the owner 2026-11-04 (NSO Class 3–5 + Level 2): now task G18.
6. RB-2 questions (4, in `CODE_REVIEW.md`) — after the exams is fine.

## Now

| Task | Who | State | Branch | Result |
|---|---|---|---|---|
| G15 English Unit 2 answer-key review | Gemini | done → Claude accepted as structure check | `gemini/g15-unit2-review` | 111 checked, 0 fixed. Claude spot-checked; notes were templated (feedback in G18) |
| G16 Science Unit 1 "The Living World" (Class 5) | Gemini | in progress | `content/sq-u1-living-world` | |
| G18 NSO (+ IEO) pattern notes from the owner's papers | Gemini | todo (next) | `gemini/g18-exam-patterns` | |
| G17 English Unit 3 Subject-Verb Agreement | Gemini | todo | `content/eq-u3-sva` | |
| G14 Seed English Unit 2 + 10-min smoke test | Gemini | todo (next) | `gemini/g14-qa` | |
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

### G16 · [todo] · gemini · Science Unit 1 "The Living World" for Class 5
**Why:** NSO on 19 Nov; Pratha is Class 5. **Base:** `feat/quiz-redesign`. **Guide:** `docs/CONTENT_GUIDE.md` (all of it, §8 for Science).
**Do:** in `data/scienceQuestData.js`, unit `sq-u1`: keep or improve `sq-living`, then add 2–3 more topics from SOF's published
NSO Class 5 syllabus that fit "living world" (e.g. plants, animals and adaptations, human body / food and health). Each topic:
Learn page + warm-up quiz (6–8 questions), 1–2 practice leaves tagged by sub-topic, a gate (pool ≥ 15, 3 sub-topics × 5),
then a Unit Boss (pool ≥ 15). Tag every node with `forGrades` (Class 5 must see all of them; add 4 / 6 only where true).
Original questions only; NSO style (some "Which of these…", some picture-free reasoning); kid-friendly explanations.
Keep `quest.draft: true`.
**Deliver:** branch `content/sq-u1-living-world`; `docs/agents/reports/G16.md` (topics, question counts, anything unsure);
`npm test` green. Commit `gemini(G16): done — N topics, Q questions`. Claude checks accuracy before the owner sees it.

### G14 · [todo] · gemini · Seed English Unit 2, then QA the redesign on the emulator
**Owner-approved: yes** (2026-11-04) for ONE production step: seeding English Quest. Nothing else.
**Wait first:** if a build is running (`pgrep -f "eas build"` prints something), wait until it ends: the Mac can't run both.
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

### G17 · [todo] · gemini · English Unit 3 Subject-Verb Agreement
**Why:** next IEO grammar unit. **Base:** `feat/quiz-redesign`. **Guide:** `docs/CONTENT_GUIDE.md` §2–7 (unit file template,
`data/englishQuest/units/u3.js`, register in `units/index.js`, `nextUnitTeaser` → Unit 4).
**Do:** 3 topics (e.g. singular/plural subjects, tricky subjects: each / everyone / pair nouns, there is / there are), each with
Learn page, warm-up, practice leaves by sub-topic, gate; Unit Boss + one reading. Same rules as Unit 2.
**Deliver:** branch `content/eq-u3-sva`; `docs/agents/reports/G17.md`; `npm test` green. Commit `gemini(G17): done — …`.

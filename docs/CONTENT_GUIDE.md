# Tile quest content guide (English Quest, Science Quest)

**For:** whoever writes quest content (Gemini by default, see `docs/TEAM.md`). **Owner:** approves accuracy.
**Goal:** content that passes `npm test` the first time, is correct, and works on every app version.

---

## 1. The five rules that matter most

1. **Accuracy first.** One clearly correct answer. Every wrong option must be wrong in *every* reading of the
   question, not just "less good". If you're not sure, leave the question out.
2. **Original only.** Past papers (SOF IEO / NSO) show the *pattern, level and topics*. Never copy a question
   or passage from them: the app is public.
3. **Kid-friendly.** Class 5 level by default. Short sentences, Indian names and places, everyday situations,
   explanations a 10-year-old understands ("'apple' starts with a vowel sound, so AN apple.").
4. **Append, never reorder.** A question's id is its position (`<quizId>-q<n>`). Reordering or deleting
   questions in a seeded quiz mixes up kids' mistakes and 🚩 reports. Fix a question **in place**, add new
   ones **at the end**.
5. **`npm test` must pass** before you ask for review. It checks structure; it can't check meaning, so rule 1
   is still on you.

---

## 2. Where content goes

- **Units 0–2:** `data/englishQuestData.js` (don't add new units there).
- **Unit 3 onwards:** one file per unit, `data/englishQuest/units/uN.js`, then register it in
  `data/englishQuest/units/index.js`:
  ```js
  import u3 from "./u3.js";
  export const extraUnits = [u3];                    // in unit order
  export const nextUnitTeaser = { id: "eq-u4", unitOrder: 4, title: "Tenses" }; // "Coming soon" after it
  ```
- Work on a branch named `content/uN-<topic>` off `feat/tile-quests`.

### Unit file template
```js
// data/englishQuest/units/u3.js: Unit 3, Subject-Verb Agreement
import { q, study, quiz, reading, unit, main, practice, gate, withSubtopic, endless, boss } from "../helpers.js";

const svaBasics = main("eq-u3-basics", "eq-u3", 0, "One or many?", [study("eq-u3-basics"), quiz("eq-u3-basics-quiz")]);

export default {
  studyPages: {
    "eq-u3-basics": { name: "Subject and Verb: Best Friends", author: "Apprec8", content: `### 🤝 ...markdown...` },
  },
  quizzes: {
    // practice quiz (main step): 8 questions, every question tagged with a gate sub-topic
    "eq-u3-basics-quiz": [
      { subtopic: "singular-plural", ...q("Fill in the blank: 'The dog ___ loudly.'", "barks", [["bark", "sva-number-error"], ["barking", "verb-form-error"], ["are barking", "sva-number-error"]], "One dog → the verb takes -s: The dog barks.") },
    ],
    // gate pool: 15 questions, 3 sub-topics × 5
    "eq-u3-basics-gate-pool": [ /* { subtopic: "...", ...q(...) } × 15 */ ],
    "eq-u3-test": [ /* Unit Boss: 12 mixed questions, no subtopic needed */ ],
  },
  readings: {},
  wordTables: {},
  nodes: [
    unit("eq-u3", 3, "Subject-Verb Agreement"),
    svaBasics,
    withSubtopic(practice("eq-u3-basics-p1", svaBasics, 1, "Tricky subjects", "hard", [quiz("eq-u3-tricky")]), "tricky-subjects"),
    gate("eq-u3-basics-gate", svaBasics, "Agreement Challenge", "eq-u3-basics-gate-pool", {
      "singular-plural": "One or many",
      "tricky-subjects": "Tricky subjects",
      "there-is-are": "There is / there are",
    }),
    endless(svaBasics),
    // ...more topics, then a reading, then the Boss
    boss("eq-u3-boss", "eq-u3", "Unit 3 Boss", "eq-u3-test", "Oh no! 👾 The Grammar Gremlin ..."),
  ],
};
```
Look at Unit 2 in `data/englishQuestData.js` (search `Unit 2: Articles`) for a complete, reviewed example.

---

## 3. Shape of a unit

| Piece | What | Rules |
|---|---|---|
| `unit(id, order, title)` | Unit header | ids: `eq-uN`, everything inside starts with `eq-uN-` |
| `main(...)` per topic | Learn page + practice quiz | 2–4 topics per unit. Practice quiz: **8 questions** |
| `practice(...)` leaves | Extra practice beside the topic | `easy` / `medium` / `hard`; wrap in `withSubtopic(..., "<gate sub-topic>")` |
| `gate(...)` per topic | The test that opens the next topic | Pool of **15** (draws 10), **3 sub-topics × 5**, pass 80% + one right per sub-topic. Every question has `subtopic` |
| `endless(topic)` | ♾️ Keep practising | Uses the topic's practice questions automatically |
| Reading | `main(..., [reading("eq-read-<name>")])` | One per unit, see section 6 |
| `boss(...)` | Unit test, opens the next unit | **12 questions**, mixed from all topics. `story`: 40–400 characters, **no digits**, Grammar Gremlin style |

**Sub-topic coverage (important):** for every gate sub-topic there must be at least one *practice* question
(main quiz or practice leaf) with that `subtopic`. "My mistakes" uses those to practise a failed gate topic.
`npm test` fails if one is missing.

**Gate and Boss questions are assessments:** never reuse them in practice quizzes, and Pratha must not review
them (she plays them for real).

---

## 4. Writing questions

```js
q(question, correctAnswer, [[wrong1, mistakeTag], [wrong2, mistakeTag], [wrong3, mistakeTag]], explanation)
```
- **Exactly 4 options**, all different, exactly one correct.
- **Every wrong option has a mistake tag** (section 5).
- **Explanation:** 1–2 short sentences saying *why*, in kid language. Put the key word in CAPITALS if it helps.

### Practice questions (main quiz, practice leaves): one blank, readable aloud
Kids can tap 🔊 "try each answer" in practice. The app reads the quoted sentence with each option filled in:
- Put the sentence in single quotes: `Fill in the blank: 'There is ___ owl on the tree.'`
- **One blank only** (`___`).
- **No apostrophe inside the quoted sentence** (write "do not", not "don't"; avoid "Rahul's"). An apostrophe
  ends the quote early.
- Gate pools and the Boss may use two blanks with options like `"an, a"` (they're never read aloud).

### Avoiding ambiguity (mistakes we already caught)
- **Don't offer an option that is also grammatical.** "I saw ___ elephant" with option "the" is correct too.
  Leave "the" out, or force one answer with context.
- **"Which word…" needs a one-word answer.** For "Taj Mahal" or "my and pune" ask "Which is…" / "Which words…".
- **Near/far, one/many:** give a clue in the sentence ("in my hands", "far up in the sky").
- **No regional or style splits:** avoid items where British and American English differ ("at university",
  "plays flute"), or where both forms are common ("Earth / the earth").
- **Facts must be true:** rivers, capitals, science facts. Check them.

---

## 5. Mistake tags
Reuse existing tags (full list at the top of `data/englishQuestData.js`). Add a new one only for a new
*kind* of mistake, in the form `<topic>-<what>-mixup|error` (e.g. `sva-number-error`), and add it to the list.

---

## 6. Learn pages and readings

**Learn page (`studyPages`)**, markdown in a template string:
- `### 🍎 Heading` sections, separated by `---`; a table for rules + examples; `> ⚠️` for traps; `> 💡` for tips.
- End with `### 🎯 Now you can…` and 2–3 bullets.
- Short: one phone screen per section. Images only from the CDN: `https://cdn.jsdelivr.net/gh/mohitcnsia/media_backup@main/<file>` (CLAUDE.md rule 1).

**Reading (`readings`)**
- `mode: "stepByStep"` (questions between paragraphs, `afterParagraph`) for easy passages; `"fullPassage"` (questions at the end) for IEO-style ones.
- Length grows by unit: ~90 → ~200 → ~300 words. 4–7 questions, IEO types: detail, word meaning,
  INCORRECT statement, Statement I/II, sequencing, inference, plus one grammar tie-in.
- Every question has `evidence: { paragraph, text }`, and `text` must be an **exact** part of that paragraph
  ("Show me where" highlights it).
- `glossary`: lowercase keys that appear in the passage, short kid meanings (kids can tap 🔊 to hear them).
- Reading mistake tags: `detail-missed, not-in-passage, word-meaning, opposite-meaning, statement-check, sequence, inference`.

---

## 7. Check, review, seed

1. `npm test`: all suites pass. The content test prints each gate's sub-topic counts and the full path.
2. Read every question once more as a 10-year-old would: one answer only? Explanation clear?
3. Add "Content review request: Unit N" to `CODE_REVIEW.md`: branch, commit, question count, anything you're unsure of.
4. **Accuracy check by a second reviewer** (owner, or Claude for spot checks), then the owner's OK.
5. **Seed:** merge to `feat/tile-quests`, then from the emulator dev build signed in as the admin: Me → Admin tools →
   **Update English Quest** (or **Update Science Quest**). It asks to confirm. Phones pick up the new content
   automatically (no app update).
6. Pratha plays the new practice topics; 🚩 reports show on the Dashboard's Reported tab.

**Fixing a reported question:** change its text/options **in place** (same position), test, re-seed.

---

## 8. Science Quest (NSO): one tree, tagged by class

**File:** `data/scienceQuestData.js` (same helpers and rules as English Quest; ids start with `sq-`). When it grows,
split units into `data/scienceQuest/units/uN.js` the same way as English. All quests are listed in
`data/quests/index.js`; `npm test` checks every quest (ids must be unique across quests).

**Class tags.** Every unit, topic (main) and, if needed, practice leaf says which classes it is for:
```js
import { ..., forGrades } from "./englishQuest/helpers.js";
const plants = forGrades(main("sq-plants", u1.id, 2, "Parts of a plant", [study("sq-plants-study"), quiz("sq-plants-warmup")]), [3, 4, 5]);
const challenge = forGrades(practice("sq-plants-p3", plants, 3, "Photosynthesis challenge", "hard", [quiz("sq-plants-p3")]), [5, 6]);
```
- The app hides nodes that aren't for the kid's class (`utils/gradeFilter.js`). A hidden topic never blocks the next
  one, and a unit with no topics left for that class disappears. Kids with no class set see everything.
- Tag every Science node: untagged = "for everyone", which is rarely right in Science.
- A topic taught in several classes is **one** topic tagged `[4, 5, 6]`, not three copies. Put the harder questions
  in a practice leaf tagged for the higher classes.
- Order topics so each class's path still makes sense on its own (Class 3 sees only Class 3 topics, in order).
- Gate and Boss pools must work for every class that sees them (don't put Class 7 questions in a `[4, 5]` gate).

**Draft until approved.** `quest.draft: true` seeds the tile to `carouselGroup: "quest_draft"`: only tester accounts see
it, and old app versions never do. After the owner approves, set `draft: false` (the tile moves to `quest`) and re-seed.

**NSO level:** follow `docs/exam/nso-pattern.md` (G5) for topics per class and question styles. Mistake tags name the
misconception (e.g. `moves-means-alive`); list new ones at the top of the file.

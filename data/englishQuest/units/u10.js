// data/englishQuest/units/u10.js: Unit 10, Word Building: Prefixes & Suffixes (Gemini, 2026-11-05).
// Classes 3–8 focus. Covers prefixes (un-, dis-, im-, in-, mis-, re-, pre-), suffixes (-ful, -less, -ness, -ment,
// -er, -or, -ist), and word families with spelling changes (drop e, y to i, doubling consonants).
// Champion leaf (Class 5+): advanced root changes (decide → decision, protect → protection, permit → permission).
// Built per docs/CONTENT_GUIDE.md and docs/exam/ieo-pattern.md ("word building / prefixes & suffixes"). Original questions.
import { q, study, quiz, reading, unit, main, practice, gate, withSubtopic, endless, boss, forGrades } from "../helpers.js";

const t = (subtopic, question, correct, wrongs, explanation) => ({ subtopic, ...q(question, correct, wrongs, explanation) });
const GRADES = [3, 4, 5, 6, 7, 8];

const prefixes = main("eq-u10-prefixes", "eq-u10", 0, "Prefixes: un-, dis-, im- & re-", [study("eq-u10-prefixes"), quiz("eq-u10-prefixes-quiz")]);
const suffixes = main("eq-u10-suffixes", "eq-u10", 1, "Suffixes: -ful, -less, -ness & -ment", [study("eq-u10-suffixes"), quiz("eq-u10-suffixes-quiz")]);
const families = main("eq-u10-families", "eq-u10", 2, "Word Families & Spelling Rules", [study("eq-u10-families"), quiz("eq-u10-families-quiz")]);
const u10r = main("eq-u10-reading", "eq-u10", 3, "Reading: The Young Inventors' Fair", [reading("eq-read-young-inventors")]);

export default {
  // ---------- Study Pages ----------
  studyPages: {
    "eq-u10-prefixes": {
      name: "Prefixes: Word Starters",
      author: "Apprec8",
      cards: [
        {
          emoji: "🧲",
          title: "What is a prefix?",
          text: "A prefix is a group of letters added to the START of a root word to change its meaning.",
          examples: ["un + happy = unhappy", "re + play = replay"],
        },
        {
          emoji: "🔄",
          title: "un- and dis- mean NOT or OPPOSITE",
          text: "Add un- or dis- to turn a root word into its direct opposite.",
          examples: ["untrue = not true", "disagree = not agree"],
        },
        {
          kind: "check",
          question: "Which prefix makes 'kind' mean 'not kind'?",
          answer: "un-",
          wrong: ["dis-", "mis-", "re-"],
          explain: "un- + kind = unkind (not kind).",
        },
        {
          emoji: "🛑",
          title: "im- and in- mean NOT",
          text: "Use im- before words starting with m or p (impossible, immature). Use in- for others (invisible, incorrect).",
          examples: ["im + possible = impossible", "in + correct = incorrect"],
        },
        {
          emoji: "🔁",
          title: "mis-, re- and pre-",
          text: "mis- means wrong (misspell). re- means again (rewrite). pre- means before (preview).",
          examples: ["misspell = spell wrongly", "rewrite = write again", "preview = view beforehand"],
        },
        {
          kind: "check",
          question: "What does 'rewrite' mean?",
          answer: "to write again",
          wrong: ["to write badly", "to write before", "not to write"],
          explain: "re- means again: rewrite = write again.",
        },
      ],
      content: `### 🧲 What is a prefix?

A **prefix** is a small group of letters placed at the beginning of a base word to create a new word with a new meaning.

---

### 🔄 Making opposites: un-, dis-, in- and im-

| Prefix | Meaning | Root Word | New Word |
|---|---|---|---|
| **un-** | not / reverse | happy | **unhappy** |
| **dis-** | opposite of / not | agree | **disagree** |
| **in-** | not | correct | **incorrect** |
| **im-** | not (before m or p) | possible | **impossible** |

> 💡 **Spelling Tip:** Before words that start with **m** or **p**, use **im-**: *impatient*, *impolite*, *immature*.

---

### 🔁 Actions and time: re-, mis- and pre-

| Prefix | Meaning | Example |
|---|---|---|
| **re-** | again | **rebuild** (build again), **replay** |
| **mis-** | wrongly / badly | **misplace** (put in wrong spot), **misread** |
| **pre-** | before / in advance | **preheat** (heat before), **preview** |

> ⚠️ Keep both letters when prefix and root share a consonant: **mis** + **spell** = **misspell**.

---

### 🎯 Now you can…
- make opposites using **un-**, **dis-**, **in-** and **im-**
- understand words with **re-**, **mis-** and **pre-**
- spell tricky prefix words like **impossible** and **misspell**`,
    },

    "eq-u10-suffixes": {
      name: "Suffixes: Word Enders",
      author: "Apprec8",
      cards: [
        {
          emoji: "🧩",
          title: "What is a suffix?",
          text: "A suffix is a group of letters added to the END of a word. It often changes the word's job in a sentence.",
          examples: ["care (noun) + ful = careful (adjective)", "kind (adjective) + ness = kindness (noun)"],
        },
        {
          emoji: "🌟",
          title: "-ful and -less",
          text: "-ful means full of (joyful, careful). -less means without (careless, painless). Notice -ful has only one L!",
          examples: ["careful = full of care", "careless = without care"],
        },
        {
          kind: "check",
          question: "What does 'fearless' mean?",
          answer: "without fear",
          wrong: ["full of fear", "fearing everything", "fearful person"],
          explain: "-less means without: fearless = without fear.",
        },
        {
          emoji: "🏷️",
          title: "-ness and -ment make NOUNS",
          text: "Add -ness to an adjective (dark → darkness). Add -ment to an action word (enjoy → enjoyment).",
          examples: ["darkness (noun)", "enjoyment (noun)"],
        },
        {
          emoji: "🧑‍🍳",
          title: "People suffixes: -er, -or and -ist",
          text: "-er (teacher, singer), -or (actor, visitor, sailor), -ist (artist, scientist).",
          examples: ["teach → teacher", "act → actor", "art → artist"],
        },
        {
          kind: "check",
          question: "A person who visits a place is a ___.",
          answer: "visitor",
          wrong: ["visiting", "visitness", "visitation"],
          explain: "visit + or = visitor.",
        },
      ],
      content: `### 🧩 What is a suffix?

A **suffix** is a letter or group of letters added to the end of a root word. Suffixes can change a word into a noun, an adjective or an adverb.

---

### 🌟 Suffixes for qualities: -ful and -less

| Suffix | Meaning | Example |
|---|---|---|
| **-ful** | full of / having | **careful** (full of care), **helpful**, **joyful** |
| **-less** | without / lacking | **careless** (without care), **helpless**, **painless** |

> ⚠️ **Spelling alert:** The suffix **-ful** always has a single **l**: *peaceful*, not *peacefull*.

---

### 🏷️ Noun makers: -ness and -ment

- Add **-ness** to an adjective to name a quality: *kind* → **kindness**, *dark* → **darkness**.
- Add **-ment** to a verb to name an action or state: *enjoy* → **enjoyment**, *agree* → **agreement**.

---

### 🧑‍🏫 People who do jobs: -er, -or and -ist

| Suffix | Root | Person |
|---|---|---|
| **-er** | teach, sing, paint | **teacher**, **singer**, **painter** |
| **-or** | act, visit, sail | **actor**, **visitor**, **sailor** |
| **-ist** | art, science, violin | **artist**, **scientist**, **violinist** |

---

### 🎯 Now you can…
- build adjectives with **-ful** and **-less**
- create nouns using **-ness** and **-ment**
- identify person words ending in **-er**, **-or** and **-ist**`,
    },

    "eq-u10-families": {
      name: "Word Families and Spelling",
      author: "Apprec8",
      cards: [
        {
          emoji: "🌳",
          title: "What is a word family?",
          text: "Words that share the same base root word belong to one family and have related meanings.",
          examples: ["help → helper, helpful, helpless, unhelpful", "play → playful, replay, player"],
        },
        {
          emoji: "🪄",
          title: "Drop the final silent -e",
          text: "When a root word ends in silent -e, drop the -e before adding a suffix that starts with a vowel.",
          examples: ["write + er = writer", "make + ing = making", "love + able = lovable"],
        },
        {
          kind: "check",
          question: "Add -er to 'make':",
          answer: "maker",
          wrong: ["makeer", "makker", "makor"],
          explain: "Drop silent e before -er: maker.",
        },
        {
          emoji: "🔄",
          title: "Change -y to -i",
          text: "When a word ends in a consonant + y, change y to i before adding -ness, -ful, -ly or -est.",
          examples: ["happy → happiness", "beauty → beautiful", "heavy → heaviest"],
        },
        {
          emoji: "⚡",
          title: "Double the final consonant",
          text: "One syllable, one short vowel, one consonant at the end? Double the consonant before a vowel suffix.",
          examples: ["run + er = runner", "swim + ing = swimming", "big + est = biggest"],
        },
        {
          kind: "check",
          question: "What is the noun from 'happy'?",
          answer: "happiness",
          wrong: ["happyness", "happines", "happyment"],
          explain: "Change y to i before adding -ness: happiness.",
        },
      ],
      content: `### 🌳 Word families

A **word family** is a group of words formed from the same root word.
For example, from the root **care**:
- *careful* (adjective)
- *careless* (adjective)
- *carefully* (adverb)
- *caring* (verb/adjective)

---

### 🪄 The 3 Golden Spelling Rules

#### 1. Drop silent -e before a vowel suffix
Drop the final **-e** before suffixes like **-ing**, **-ed**, **-er**, **-able**:
- *write* + *-er* = **writer** (not *writeer*)
- *drive* + *-ing* = **driving**

#### 2. Change -y to -i
When a word ends in consonant + **y**, change **y** to **i**:
- *happy* + *-ness* = **happiness**
- *beauty* + *-ful* = **beautiful**
- *easy* + *-ly* = **easily**

#### 3. Double the final consonant (1-1-1 rule)
Short vowel + single consonant at the end of a one-syllable word? Double it:
- *run* + *-er* = **runner**
- *stop* + *-ed* = **stopped**
- *swim* + *-ing* = **swimming**

---

### 🎯 Now you can…
- spot root words in large word families
- drop silent **-e** correctly
- change **-y** to **-i** and double consonants accurately`,
    },
  },

  // ---------- Quizzes ----------
  quizzes: {
    // Topic A: Prefixes (practice, 8)
    "eq-u10-prefixes-quiz": [
      t("neg-prefixes", "Add a prefix to 'happy' to mean 'not happy':", "unhappy", [["dishappy", "prefix-choice-error"], ["imhappy", "prefix-choice-error"], ["mishappy", "prefix-choice-error"]], "The prefix un- combines with happy to mean not happy."),
      t("neg-prefixes", "Complete the sentence: 'Dev did not agree with the plan; he ___ with it.'", "disagreed", [["unagreed", "prefix-choice-error"], ["inagreed", "prefix-choice-error"], ["misagreed", "prefix-choice-error"]], "The opposite of agree is disagree: Dev disagreed."),
      t("neg-prefixes", "Pick the word that means 'not visible':", "invisible", [["unvisible", "prefix-choice-error"], ["disvisible", "prefix-choice-error"], ["imvisible", "prefix-choice-error"]], "The prefix in- combines with visible: invisible means cannot be seen."),
      t("mis-re-pre", "What does 'rewrite' mean in 'Please rewrite the story'?", "write again", [["write badly", "prefix-meaning-error"], ["write before", "prefix-meaning-error"], ["never write", "prefix-meaning-error"]], "The prefix re- means again: rewrite = write again."),
      t("mis-re-pre", "If you pack your suitcase again, you ___ it.", "repack", [["unpack", "prefix-meaning-error"], ["mispack", "prefix-meaning-error"], ["prepack", "prefix-meaning-error"]], "The prefix re- means again: repack means pack again."),
      t("mis-re-pre", "What does 'misplace' mean in 'I misplaced my spectacles'?", "placed in the wrong spot", [["placed carefully", "opposite-meaning"], ["placed in advance", "prefix-meaning-error"], ["placed again", "prefix-meaning-error"]], "The prefix mis- means wrongly: misplace = put in the wrong place."),
      t("prefix-spelling", "Which prefix is used before 'possible' to mean 'not possible'?", "im-", [["in-", "prefix-spelling-error"], ["un-", "prefix-choice-error"], ["dis-", "prefix-choice-error"]], "Words starting with p usually take im-: impossible."),
      t("prefix-spelling", "Complete the sentence: 'It is ___ to cross the flooded railway bridge safely.'", "impossible", [["unpossible", "prefix-spelling-error"], ["inpossible", "prefix-spelling-error"], ["mispossible", "prefix-spelling-error"]], "The prefix im- combines with possible: impossible."),
    ],

    // Practice leaf A: Tricky Negative Prefixes (8)
    "eq-u10-prefixes-p1": [
      t("prefix-spelling", "Which word is spelt correctly?", "irregular", [["inregular", "prefix-spelling-error"], ["unregular", "prefix-spelling-error"], ["imregular", "prefix-spelling-error"]], "Before words beginning with r, in- becomes ir-: irregular."),
      t("prefix-spelling", "Pick the correct spelling for 'not polite':", "impolite", [["inpolite", "prefix-spelling-error"], ["unpolite", "prefix-spelling-error"], ["dispolite", "prefix-spelling-error"]], "Polite begins with p, so it takes im-: impolite."),
      t("prefix-spelling", "Which word has two 's' letters because of its prefix?", "misspell", [["mispell", "prefix-spelling-error"], ["unspell", "prefix-choice-error"], ["disspell", "prefix-choice-error"]], "The prefix mis- plus spell keeps both s letters: misspell."),
      t("prefix-spelling", "What is the opposite of 'legal'?", "illegal", [["unlegal", "prefix-choice-error"], ["inlegal", "prefix-spelling-error"], ["dislegal", "prefix-choice-error"]], "Words starting with l take il-: illegal."),
      t("neg-prefixes", "Complete the sentence: 'The magician made the rabbit ___ inside his hat.'", "disappear", [["unappear", "prefix-choice-error"], ["inappear", "prefix-choice-error"], ["misappear", "prefix-choice-error"]], "The opposite of appear is disappear."),
      t("neg-prefixes", "Pick the word that means 'not tidy':", "untidy", [["distidy", "prefix-choice-error"], ["intidy", "prefix-choice-error"], ["mistidy", "prefix-choice-error"]], "un- + tidy = untidy."),
      t("neg-prefixes", "Complete the sentence: 'Leaving your bicycle unlocked outside was very ___.'", "unsafe", [["dissafe", "prefix-choice-error"], ["insafe", "prefix-choice-error"], ["missafe", "prefix-choice-error"]], "un- + safe = unsafe."),
      t("neg-prefixes", "What is the opposite of 'obedient'?", "disobedient", [["unobedient", "prefix-choice-error"], ["inobedient", "prefix-choice-error"], ["misobedient", "prefix-choice-error"]], "dis- + obedient = disobedient."),
    ],

    // Gate A: Prefixes Challenge (15 = 3 sub-topics × 5)
    "eq-u10-prefixes-gate-pool": [
      t("neg-prefixes", "Complete the sentence: 'It is ___ to tell lies to your parents.'", "dishonest", [["unhonest", "prefix-choice-error"], ["imhonest", "prefix-choice-error"], ["inhonest", "prefix-choice-error"]], "dis- goes with honest: dishonest."),
      t("neg-prefixes", "Choose the opposite of 'patient':", "impatient", [["unpatient", "prefix-choice-error"], ["inpatient", "prefix-spelling-error"], ["dispatient", "prefix-choice-error"]], "Patient begins with p, so it takes im-: impatient."),
      t("neg-prefixes", "Complete the sentence: 'The key was lost, so the wooden box remained ___.'", "unopened", [["disopened", "prefix-choice-error"], ["inopened", "prefix-choice-error"], ["misopened", "prefix-choice-error"]], "un- + opened = unopened."),
      t("neg-prefixes", "Which word means 'not complete'?", "incomplete", [["uncomplete", "prefix-choice-error"], ["discomplete", "prefix-choice-error"], ["imcomplete", "prefix-spelling-error"]], "in- combines with complete: incomplete."),
      t("neg-prefixes", "Choose the word that means 'not pure':", "impure", [["unpure", "prefix-choice-error"], ["dispure", "prefix-choice-error"], ["inpure", "prefix-spelling-error"]], "Pure begins with p, so it takes im-: impure."),
      t("mis-re-pre", "What does 'preheat' mean in 'Preheat the oven before baking'?", "heat beforehand", [["heat again", "prefix-meaning-error"], ["heat wrongly", "prefix-meaning-error"], ["stop heating", "prefix-meaning-error"]], "pre- means before: preheat = heat beforehand."),
      t("mis-re-pre", "Complete the sentence: 'If you misunderstand the question, you will ___ it.'", "answer wrongly", [["answer again", "prefix-meaning-error"], ["answer in advance", "prefix-meaning-error"], ["answer correctly", "opposite-meaning"]], "mis- means wrongly: misunderstand = understand wrongly."),
      t("mis-re-pre", "What does the prefix 're-' mean in 'rebuild'?", "again", [["wrongly", "prefix-meaning-error"], ["before", "prefix-meaning-error"], ["without", "prefix-meaning-error"]], "re- means again: rebuild = build again."),
      t("mis-re-pre", "Complete the sentence: 'A short film shown before the main movie is a ___.'", "preview", [["review", "prefix-meaning-error"], ["misview", "prefix-meaning-error"], ["unview", "prefix-meaning-error"]], "pre- means before: preview = view before."),
      t("mis-re-pre", "Complete the sentence: 'Because he was in a hurry, Kabir ___ the bus timetable.'", "misread", [["reread", "prefix-meaning-error"], ["preread", "prefix-meaning-error"], ["disread", "prefix-meaning-error"]], "misread means read incorrectly: Kabir misread the timetable."),
      t("prefix-spelling", "Which word is spelt correctly?", "immature", [["inmature", "prefix-spelling-error"], ["unmature", "prefix-choice-error"], ["dismature", "prefix-choice-error"]], "Mature begins with m, so it takes im-: immature."),
      t("prefix-spelling", "Pick the correct spelling for 'not responsible':", "irresponsible", [["inresponsible", "prefix-spelling-error"], ["unresponsible", "prefix-choice-error"], ["imresponsible", "prefix-spelling-error"]], "Before r, in- turns into ir-: irresponsible."),
      t("prefix-spelling", "Which prefix turns 'agree' into 'disagree'?", "dis-", [["un-", "prefix-choice-error"], ["in-", "prefix-choice-error"], ["mis-", "prefix-choice-error"]], "dis- + agree = disagree."),
      t("prefix-spelling", "Choose the correct spelling: 'un + necessary = ___'", "unnecessary", [["unecessary", "prefix-spelling-error"], ["inneccessary", "prefix-spelling-error"], ["disnecessary", "prefix-choice-error"]], "Keep both n letters: un + necessary = unnecessary."),
      t("prefix-spelling", "What is the opposite of 'mortal'?", "immortal", [["inmortal", "prefix-spelling-error"], ["unmortal", "prefix-choice-error"], ["dismortal", "prefix-choice-error"]], "Mortal begins with m, so it takes im-: immortal."),
    ],

    // Topic B: Suffixes (practice, 8)
    "eq-u10-suffixes-quiz": [
      t("ful-less", "Add a suffix to 'care' to mean 'taking great care':", "careful", [["carefull", "suffix-spelling-error"], ["careless", "opposite-meaning"], ["careness", "suffix-choice-error"]], "care + ful = careful (spelt with one l)."),
      t("ful-less", "Complete the sentence: 'The tiny puppy was completely ___ without its mother.'", "helpless", [["helpful", "opposite-meaning"], ["helpment", "suffix-choice-error"], ["helpable", "suffix-choice-error"]], "-less means without: helpless = without help."),
      t("ful-less", "What does 'hopeless' mean?", "without hope", [["full of hope", "opposite-meaning"], ["hoping deeply", "suffix-meaning-error"], ["one who hopes", "suffix-meaning-error"]], "-less means without: hopeless = without hope."),
      t("ness-ment", "What noun can be formed from the adjective 'kind'?", "kindness", [["kindment", "suffix-choice-error"], ["kindful", "suffix-choice-error"], ["kindless", "suffix-choice-error"]], "kind + ness = kindness."),
      t("ness-ment", "Complete the sentence: 'The funny clown brought great ___ to the children.'", "enjoyment", [["enjoyness", "suffix-choice-error"], ["enjoyful", "suffix-choice-error"], ["enjoyer", "suffix-choice-error"]], "enjoy + ment = enjoyment."),
      t("ness-ment", "Which word is a noun?", "darkness", [["darkly", "pos-adverb-mixup"], ["darker", "pos-adjective-mixup"], ["darkest", "pos-adjective-mixup"]], "-ness creates a noun naming a quality: darkness."),
      t("person-suffixes", "A person who teaches in a school is a ___.", "teacher", [["teaching", "pos-verb-mixup"], ["teachist", "suffix-choice-error"], ["teachor", "suffix-spelling-error"]], "teach + er = teacher."),
      t("person-suffixes", "A person who visits our school is a ___.", "visitor", [["visiter", "suffix-spelling-error"], ["visitist", "suffix-choice-error"], ["visiting", "pos-verb-mixup"]], "visit + or = visitor."),
    ],

    // Practice leaf B: Building Nouns & Adjectives (8)
    "eq-u10-suffixes-p1": [
      t("ful-less", "Which word is spelt correctly?", "peaceful", [["peacefull", "suffix-spelling-error"], ["peaceless", "suffix-choice-error"], ["peacely", "suffix-choice-error"]], "The suffix -ful has only one l: peaceful."),
      t("ful-less", "Complete the sentence: 'The bandage came off in a ___ way.'", "painless", [["painful", "opposite-meaning"], ["painment", "suffix-choice-error"], ["painness", "suffix-choice-error"]], "-less means without: painless = without pain."),
      t("ness-ment", "What is the noun form of 'excite'?", "excitement", [["exciteness", "suffix-choice-error"], ["exciteful", "suffix-choice-error"], ["exciting", "pos-adjective-mixup"]], "excite + ment = excitement."),
      t("ness-ment", "Complete the sentence: 'His sudden ___ surprised everyone in the classroom.'", "politeness", [["politement", "suffix-choice-error"], ["politeful", "suffix-choice-error"], ["politeless", "suffix-choice-error"]], "polite + ness = politeness."),
      t("ness-ment", "Which suffix turns 'agree' into a noun?", "-ment", [["-ness", "suffix-choice-error"], ["-ful", "suffix-choice-error"], ["-less", "suffix-choice-error"]], "agree + ment = agreement."),
      t("ness-ment", "What is the noun form of 'sad'?", "sadness", [["sadment", "suffix-choice-error"], ["sadful", "suffix-choice-error"], ["sadless", "suffix-choice-error"]], "sad + ness = sadness."),
      t("person-suffixes", "A person who creates paintings or sculptures is an ___.", "artist", [["artor", "suffix-spelling-error"], ["arter", "suffix-choice-error"], ["arting", "pos-verb-mixup"]], "art + ist = artist."),
      t("person-suffixes", "A person who sails a ship across the sea is a ___.", "sailor", [["sailer", "suffix-spelling-error"], ["sailist", "suffix-choice-error"], ["sailing", "pos-verb-mixup"]], "sail + or = sailor."),
    ],

    // Gate B: Suffixes Challenge (15 = 3 sub-topics × 5)
    "eq-u10-suffixes-gate-pool": [
      t("ful-less", "Complete the sentence: 'Rohan was so ___ that he dropped the glass bowl.'", "careless", [["careful", "opposite-meaning"], ["carement", "suffix-choice-error"], ["careness", "suffix-choice-error"]], "-less means without care: careless."),
      t("ful-less", "What does 'fearless' mean?", "brave and without fear", [["full of deep fear", "opposite-meaning"], ["causing intense fear", "suffix-meaning-error"], ["frightened of dark", "opposite-meaning"]], "fear + less = without fear (brave)."),
      t("ful-less", "Complete the sentence: 'The blooming roses made the courtyard very ___.'", "cheerful", [["cheerless", "opposite-meaning"], ["cheerfull", "suffix-spelling-error"], ["cheerment", "suffix-choice-error"]], "cheer + ful = cheerful."),
      t("ful-less", "Which word means 'without any end'?", "endless", [["endful", "suffix-choice-error"], ["ending", "pos-verb-mixup"], ["ended", "tense-form-error"]], "end + less = endless."),
      t("ful-less", "Choose the correct spelling: 'joy + ful = ___'", "joyful", [["joyfull", "suffix-spelling-error"], ["joyeless", "suffix-choice-error"], ["joyment", "suffix-choice-error"]], "-ful ends with a single l: joyful."),
      t("ness-ment", "What is the noun formed from 'bright'?", "brightness", [["brightment", "suffix-choice-error"], ["brightful", "suffix-choice-error"], ["brightless", "suffix-choice-error"]], "bright + ness = brightness."),
      t("ness-ment", "Complete the sentence: 'We made an ___ to meet outside the museum gate.'", "arrangement", [["arrangeness", "suffix-choice-error"], ["arrangeful", "suffix-choice-error"], ["arrangeless", "suffix-choice-error"]], "arrange + ment = arrangement."),
      t("ness-ment", "What noun can be formed from 'treat'?", "treatment", [["treatness", "suffix-choice-error"], ["treatful", "suffix-choice-error"], ["treatist", "suffix-choice-error"]], "treat + ment = treatment."),
      t("ness-ment", "Complete the sentence: 'The doctor checked the patient for any signs of ___.'", "illness", [["illment", "suffix-choice-error"], ["illful", "suffix-choice-error"], ["illless", "suffix-choice-error"]], "ill + ness = illness."),
      t("ness-ment", "Which suffix forms a noun from 'punish'?", "-ment", [["-ness", "suffix-choice-error"], ["-ful", "suffix-choice-error"], ["-less", "suffix-choice-error"]], "punish + ment = punishment."),
      t("person-suffixes", "A person who acts in a stage play is an ___.", "actor", [["acter", "suffix-spelling-error"], ["actist", "suffix-choice-error"], ["acting", "pos-verb-mixup"]], "act + or = actor."),
      t("person-suffixes", "A person who studies science and conducts experiments is a ___.", "scientist", [["sciencer", "suffix-choice-error"], ["scienceor", "suffix-choice-error"], ["scienter", "suffix-choice-error"]], "science + ist = scientist."),
      t("person-suffixes", "A person who sings classical songs on stage is a ___.", "singer", [["singor", "suffix-spelling-error"], ["singist", "suffix-choice-error"], ["singful", "suffix-choice-error"]], "sing + er = singer."),
      t("person-suffixes", "A person who directs a film is a ___.", "director", [["directer", "suffix-spelling-error"], ["directist", "suffix-choice-error"], ["directment", "suffix-choice-error"]], "direct + or = director."),
      t("person-suffixes", "A person who plays the violin gracefully is a ___.", "violinist", [["violiner", "suffix-choice-error"], ["violinor", "suffix-choice-error"], ["violinment", "suffix-choice-error"]], "violin + ist = violinist."),
    ],

    // Topic C: Word Families & Spelling (practice, 8)
    "eq-u10-families-quiz": [
      t("spelling-y-to-i", "Add -ness to 'happy':", "happiness", [["happyness", "suffix-spelling-error"], ["happines", "suffix-spelling-error"], ["happyment", "suffix-choice-error"]], "Change y to i before adding -ness: happiness."),
      t("spelling-y-to-i", "Add -ful to 'beauty':", "beautiful", [["beautyful", "suffix-spelling-error"], ["beautifull", "suffix-spelling-error"], ["beautful", "suffix-spelling-error"]], "Change y to i before adding -ful: beautiful."),
      t("spelling-y-to-i", "Complete the sentence: 'The children played ___ in the courtyard.'", "happily", [["happyly", "suffix-spelling-error"], ["happyley", "suffix-spelling-error"], ["happili", "suffix-spelling-error"]], "happy + ly: change y to i → happily."),
      t("drop-e-double", "Add -er to 'write':", "writer", [["writeer", "suffix-spelling-error"], ["writter", "suffix-spelling-error"], ["writor", "suffix-choice-error"]], "Drop the silent e before -er: writer."),
      t("drop-e-double", "Add -er to 'run':", "runner", [["runer", "suffix-spelling-error"], ["runor", "suffix-choice-error"], ["runnist", "suffix-choice-error"]], "Double the final consonant before -er: runner."),
      t("drop-e-double", "Add -able to 'love':", "lovable", [["loveable", "suffix-spelling-error"], ["loveble", "suffix-spelling-error"], ["lovble", "suffix-spelling-error"]], "Drop the silent e before -able: lovable."),
      t("word-roots", "What is the root word of 'unhappiness'?", "happy", [["unhappy", "root-identification-error"], ["happi", "root-identification-error"], ["ness", "root-identification-error"]], "The core base word is happy: un- + happy + -ness."),
      t("word-roots", "Which word belongs to the same word family as 'play'?", "playful", [["plan", "unrelated-word"], ["plate", "unrelated-word"], ["plane", "unrelated-word"]], "play and playful share the root play."),
    ],

    // Practice leaf C1: Spelling Traps in Word Building (8)
    "eq-u10-families-p1": [
      t("spelling-y-to-i", "Add -est to 'heavy':", "heaviest", [["heavyest", "suffix-spelling-error"], ["heavyst", "suffix-spelling-error"], ["heavist", "suffix-spelling-error"]], "Change y to i before -est: heaviest."),
      t("spelling-y-to-i", "What is the noun formed from 'busy'?", "business", [["busyness", "suffix-spelling-error"], ["busines", "suffix-spelling-error"], ["busyment", "suffix-choice-error"]], "busy + ness: change y to i → business."),
      t("spelling-y-to-i", "Add -ful to 'plenty':", "plentiful", [["plentyful", "suffix-spelling-error"], ["plentifull", "suffix-spelling-error"], ["plentyfull", "suffix-spelling-error"]], "plenty + ful: change y to i → plentiful."),
      t("drop-e-double", "Add -ing to 'swim':", "swimming", [["swiming", "suffix-spelling-error"], ["swimmeng", "suffix-spelling-error"], ["swimmng", "suffix-spelling-error"]], "Double the m in swim before -ing: swimming."),
      t("drop-e-double", "Add -er to 'drive':", "driver", [["driveer", "suffix-spelling-error"], ["drivver", "suffix-spelling-error"], ["drivor", "suffix-choice-error"]], "Drop the silent e before -er: driver."),
      t("drop-e-double", "Add -ed to 'hop':", "hopped", [["hoped", "suffix-spelling-error"], ["hoppd", "suffix-spelling-error"], ["hoping", "tense-form-error"]], "hop doubles the p: hopped (hoped comes from hope)."),
      t("word-roots", "What is the root word of 'carelessly'?", "care", [["careless", "root-identification-error"], ["carely", "root-identification-error"], ["less", "root-identification-error"]], "The base root word is care."),
      t("word-roots", "Which word does NOT belong to the word family of 'help'?", "helmet", [["helper", "related-word"], ["helpful", "related-word"], ["helpless", "related-word"]], "Helmet is a completely different word, not from help."),
    ],

    // Practice leaf C2: Champion: Advanced Word Forms (8, Class 5+)
    "eq-u10-families-p2": [
      t("drop-e-double", "What noun is formed from 'decide'?", "decision", [["decidement", "suffix-choice-error"], ["decidion", "suffix-spelling-error"], ["decidance", "suffix-choice-error"]], "decide changes to decision (with -sion)."),
      t("drop-e-double", "What noun is formed from 'conclude'?", "conclusion", [["concludement", "suffix-choice-error"], ["concludion", "suffix-spelling-error"], ["conclusance", "suffix-choice-error"]], "conclude changes to conclusion."),
      t("drop-e-double", "What noun is formed from 'admit'?", "admission", [["admitment", "suffix-choice-error"], ["admittion", "suffix-spelling-error"], ["admitance", "suffix-spelling-error"]], "admit forms admission (as in admission fee or school admission)."),
      t("word-roots", "What is the noun formed from 'invent'?", "invention", [["inventment", "suffix-choice-error"], ["inventness", "suffix-choice-error"], ["inventance", "suffix-choice-error"]], "invent + ion = invention."),
      t("word-roots", "What is the adjective formed from 'danger'?", "dangerous", [["dangerful", "suffix-choice-error"], ["dangerly", "suffix-choice-error"], ["dangerable", "suffix-choice-error"]], "danger + ous = dangerous."),
      t("word-roots", "What noun is formed from the verb 'protect'?", "protection", [["protectment", "suffix-choice-error"], ["protectness", "suffix-choice-error"], ["protectful", "suffix-choice-error"]], "protect + ion = protection."),
      t("word-roots", "What adjective is formed from 'glory'?", "glorious", [["gloryful", "suffix-choice-error"], ["gloriouss", "suffix-spelling-error"], ["gloryable", "suffix-choice-error"]], "glory changes y to i + ous: glorious."),
      t("word-roots", "What noun is formed from 'permit'?", "permission", [["permitment", "suffix-choice-error"], ["permittion", "suffix-spelling-error"], ["permitance", "suffix-choice-error"]], "permit forms permission (-ssion)."),
    ],

    // Gate C: Word Building Challenge (15 = 3 sub-topics × 5)
    "eq-u10-families-gate-pool": [
      t("spelling-y-to-i", "Complete the sentence: 'Her face showed great ___ when she saw the puppy.'", "happiness", [["happyness", "suffix-spelling-error"], ["happines", "suffix-spelling-error"], ["happyment", "suffix-choice-error"]], "happy + ness = happiness."),
      t("spelling-y-to-i", "Add -ful to 'duty':", "dutiful", [["dutyful", "suffix-spelling-error"], ["dutifull", "suffix-spelling-error"], ["duteous", "suffix-choice-error"]], "duty + ful: change y to i → dutiful."),
      t("spelling-y-to-i", "Add -ly to 'easy':", "easily", [["easyly", "suffix-spelling-error"], ["easly", "suffix-spelling-error"], ["easili", "suffix-spelling-error"]], "easy + ly: change y to i → easily."),
      t("spelling-y-to-i", "Add -ness to 'lonely':", "loneliness", [["lonelyness", "suffix-spelling-error"], ["lonelines", "suffix-spelling-error"], ["lonelyment", "suffix-choice-error"]], "lonely + ness: change y to i → loneliness."),
      t("spelling-y-to-i", "Add -ly to 'lazy':", "lazily", [["lazyly", "suffix-spelling-error"], ["lazly", "suffix-spelling-error"], ["lazili", "suffix-spelling-error"]], "lazy + ly: change y to i → lazily."),
      t("drop-e-double", "Add -er to 'bake':", "baker", [["bakeer", "suffix-spelling-error"], ["bakker", "suffix-spelling-error"], ["bakor", "suffix-choice-error"]], "Drop silent e before -er: baker."),
      t("drop-e-double", "Add -ed to 'stop':", "stopped", [["stoped", "suffix-spelling-error"], ["stoppd", "suffix-spelling-error"], ["stopping", "tense-form-error"]], "Double the p before -ed: stopped."),
      t("drop-e-double", "Add -able to 'use':", "usable", [["useable", "suffix-spelling-error"], ["useble", "suffix-spelling-error"], ["usble", "suffix-spelling-error"]], "Drop silent e before -able: usable."),
      t("drop-e-double", "Add -ing to 'win':", "winning", [["wining", "suffix-spelling-error"], ["winneng", "suffix-spelling-error"], ["winng", "suffix-spelling-error"]], "Double the n before -ing: winning."),
      t("drop-e-double", "Add -er to 'ride':", "rider", [["rideer", "suffix-spelling-error"], ["ridder", "suffix-spelling-error"], ["ridor", "suffix-choice-error"]], "Drop silent e before -er: rider."),
      t("word-roots", "What is the root word of 'dishonesty'?", "honest", [["dishonest", "root-identification-error"], ["honesty", "root-identification-error"], ["dis", "root-identification-error"]], "honest is the base root word."),
      t("word-roots", "Which word belongs to the same word family as 'courage'?", "courageous", [["court", "unrelated-word"], ["cousin", "unrelated-word"], ["course", "unrelated-word"]], "courage and courageous share the root courage."),
      t("word-roots", "What is the root word of 'unfriendliness'?", "friend", [["friendly", "root-identification-error"], ["unfriendly", "root-identification-error"], ["friendship", "root-identification-error"]], "friend is the core base root."),
      t("word-roots", "Which word belongs to the word family of 'act'?", "action", [["ache", "unrelated-word"], ["acorn", "unrelated-word"], ["acre", "unrelated-word"]], "act and action belong to the same word family."),
      t("word-roots", "What is the root word of 'repayment'?", "pay", [["repay", "root-identification-error"], ["payment", "root-identification-error"], ["ment", "root-identification-error"]], "pay is the base root word."),
    ],

    // Unit 10 Boss (12 mixed questions)
    "eq-u10-test": [
      q("Which prefix makes 'correct' mean 'not correct'?", "in-", [["un-", "prefix-choice-error"], ["dis-", "prefix-choice-error"], ["im-", "prefix-spelling-error"]], "in- + correct = incorrect."),
      q("What does 'rebuild' mean in 'They will rebuild the damaged bridge'?", "build again", [["build before", "prefix-meaning-error"], ["never build", "prefix-meaning-error"], ["build badly", "prefix-meaning-error"]], "re- means again: rebuild = build again."),
      q("Add a prefix to 'agree' to mean 'to have a different opinion':", "disagree", [["unagree", "prefix-choice-error"], ["inagree", "prefix-choice-error"], ["misagree", "prefix-choice-error"]], "dis- + agree = disagree."),
      q("Add -ful to 'help' to mean 'giving a lot of help':", "helpful", [["helpfull", "suffix-spelling-error"], ["helpless", "opposite-meaning"], ["helpment", "suffix-choice-error"]], "help + ful = helpful (spelt with a single l)."),
      q("Complete the sentence: 'The night sky stretched above them with ___ wonder.'", "boundless", [["boundment", "suffix-choice-error"], ["boundness", "suffix-choice-error"], ["boundful", "suffix-choice-error"]], "-less means without limit: boundless."),
      q("What noun is formed from 'govern'?", "government", [["governness", "suffix-choice-error"], ["governful", "suffix-choice-error"], ["governless", "suffix-choice-error"]], "govern + ment = government."),
      q("A person who inspects school classrooms carefully is an ___.", "inspector", [["inspecter", "suffix-spelling-error"], ["inspectist", "suffix-choice-error"], ["inspecting", "pos-verb-mixup"]], "inspect + or = inspector."),
      q("Add -ness to 'happy':", "happiness", [["happyness", "suffix-spelling-error"], ["happines", "suffix-spelling-error"], ["happyment", "suffix-choice-error"]], "Change y to i: happiness."),
      q("Add -er to 'make':", "maker", [["makeer", "suffix-spelling-error"], ["makker", "suffix-spelling-error"], ["makor", "suffix-choice-error"]], "Drop the silent e: maker."),
      q("Add -ing to 'clap':", "clapping", [["claping", "suffix-spelling-error"], ["clappeng", "suffix-spelling-error"], ["clapng", "suffix-spelling-error"]], "Double the p before -ing: clapping."),
      q("What is the root word of 'misunderstanding'?", "understand", [["understanded", "root-identification-error"], ["misunderstand", "root-identification-error"], ["standing", "root-identification-error"]], "understand is the root base word."),
      q("What noun is formed from 'decide'?", "decision", [["decidement", "suffix-choice-error"], ["decidance", "suffix-choice-error"], ["decidion", "suffix-spelling-error"]], "decide forms decision."),
    ],
  },

  // ---------- Reading ----------
  readings: {
    "eq-read-young-inventors": {
      name: "The Young Inventors' Fair",
      author: "Apprec8",
      mode: "fullPassage",
      glossary: {
        purifier: "a machine or tool that removes dirt and makes water clean",
        prototype: "the first working model of an invention",
        solar: "powered by energy from the sun",
        mechanism: "the moving parts of a machine",
      },
      paragraphs: [
        "Every November, Saraswati Vidyalaya held its Young Inventors' Fair in the large school auditorium. This year, Class 5 students Ananya, Rohan and Kabir formed a team to build an automatic mango harvester. Farmers in Ananya's village were often unhappy when ripe mangoes fell and got bruised. The team wanted to build a painless solution that would gently pluck the fruit.",
        "Before building their machine, the children sketched their design on chart paper. Rohan was very careful while measuring the wooden rods because even a small error could make the mechanism jam. Meanwhile, Kabir assembled a solar battery so the device would be rechargeable under sunlight. \"A solar battery makes the machine useful even during power cuts,\" Kabir explained.",
        "When they tested their first prototype, they discovered a problem. The robotic claw moved too fast and squashed the fruit. Ananya and Rohan had a brief disagreement about how to fix it. Rohan wanted to add rubber cushions, while Ananya suggested slowing the motor. In the end, they used both ideas, showing that cooperation brings the best result.",
        "On the morning of the fair, judges walked from table to table testing each invention. When the chief judge pressed the switch on the mango harvester, the soft rubber fingers reached up, gripped a wooden test sphere without a scratch, and lowered it safely into a basket. The entire audience cheered with great enjoyment and excitement.",
        "At the prize ceremony, the team received the gold medal for Young Inventors. The headmistress praised their kindness and teamwork, noting how they helped other teams carry heavy display boards. Ananya smiled proudly and said that their next invention would be a portable water purifier for village schools.",
      ],
      questions: [
        {
          ...q("Why did the team decide to build a mango harvester?", "To pluck fruit gently without bruising them.", [["To sell wooden rods to local farmers.", "not-in-passage"], ["To win money for a new school building.", "not-in-passage"], ["To replace all fruit trees in the village.", "not-in-passage"]], "The passage states that they wanted to build a painless solution to gently pluck fruit."),
          evidence: { paragraph: 0, text: "The team wanted to build a painless solution that would gently pluck the fruit." },
        },
        {
          ...q("In 'Rohan was very careful while measuring', what does 'careful' tell us?", "He took great care to avoid making mistakes.", [["He worked without caring about the results.", "opposite-meaning"], ["He was too frightened to touch the rods.", "not-in-passage"], ["He finished the measurement in two seconds.", "not-in-passage"]], "careful means full of care, avoiding mistakes."),
          evidence: { paragraph: 1, text: "Rohan was very careful while measuring the wooden rods because even a small error could make the mechanism jam." },
        },
        {
          ...q("Why did Kabir assemble a solar battery for the harvester?", "It would keep working even during power cuts.", [["It was cheaper than using wooden rods.", "not-in-passage"], ["The school forbade them from using batteries.", "not-in-passage"], ["It made the wooden claw move much faster.", "not-in-passage"]], "Kabir explained: 'A solar battery makes the machine useful even during power cuts.'"),
          evidence: { paragraph: 1, text: "\"A solar battery makes the machine useful even during power cuts,\" Kabir explained." },
        },
        {
          ...q("How did the children solve the problem of the claw moving too fast?", "They added rubber cushions and slowed the motor.", [["They replaced the wood with steel bars.", "not-in-passage"], ["They discarded the claw and plucked by hand.", "not-in-passage"], ["They asked the headmistress to build it.", "not-in-passage"]], "The passage explains that they used both rubber cushions and slowed the motor."),
          evidence: { paragraph: 2, text: "Rohan wanted to add rubber cushions, while Ananya suggested slowing the motor. In the end, they used both ideas" },
        },
        {
          ...q("Select the INCORRECT statement according to the passage.", "The team refused to help other students carry display boards.", [["The Young Inventors' Fair took place in November.", "statement-check"], ["The chief judge tested the mango harvester with a wooden sphere.", "statement-check"], ["The team won the gold medal for Young Inventors.", "statement-check"]], "The passage notes that they helped other teams carry heavy display boards."),
          evidence: { paragraph: 4, text: "noting how they helped other teams carry heavy display boards." },
        },
        {
          ...q("What quality of the team was praised by the headmistress?", "Their kindness and teamwork.", [["Their speed in leaving the auditorium.", "not-in-passage"], ["Their ability to argue loudly with judges.", "not-in-passage"], ["Their expensive imported materials.", "not-in-passage"]], "The headmistress praised their kindness and teamwork."),
          evidence: { paragraph: 4, text: "The headmistress praised their kindness and teamwork" },
        },
        {
          ...q("What do the words 'unhappy' and 'painless' have in common in paragraph 0?", "Both words use affixes to change their meaning.", [["Both words mean exactly the same thing.", "word-meaning"], ["Both words are names of people.", "pos-noun-mixup"], ["Both words end with the suffix -ness.", "suffix-spelling-error"]], "Both unhappy (prefix un-) and painless (suffix -less) use affixes."),
          evidence: { paragraph: 0, text: "Farmers in Ananya's village were often unhappy when ripe mangoes fell and got bruised. The team wanted to build a painless solution" },
        },
      ],
    },
  },
  wordTables: {},

  nodes: [
    unit("eq-u10", 10, "Word Building: Prefixes & Suffixes"),

    // Topic A: Prefixes
    prefixes,
    withSubtopic(practice("eq-u10-prefixes-p1", prefixes, 1, "Tricky Negative Prefixes", "medium", [quiz("eq-u10-prefixes-p1")]), "prefix-spelling"),
    gate("eq-u10-prefixes-gate", prefixes, "Prefixes Challenge", "eq-u10-prefixes-gate-pool", {
      "neg-prefixes": "Opposites with un-, dis-, in- & im-",
      "mis-re-pre": "Meaning of mis-, re- & pre-",
      "prefix-spelling": "Spelling rules with prefixes (im-, ir-, mis-)",
    }),
    endless(prefixes),

    // Topic B: Suffixes
    suffixes,
    withSubtopic(practice("eq-u10-suffixes-p1", suffixes, 1, "Building Nouns & Adjectives", "medium", [quiz("eq-u10-suffixes-p1")]), "ness-ment"),
    gate("eq-u10-suffixes-gate", suffixes, "Suffixes Challenge", "eq-u10-suffixes-gate-pool", {
      "ful-less": "Adjectives with -ful and -less",
      "ness-ment": "Nouns with -ness and -ment",
      "person-suffixes": "People who do actions (-er, -or, -ist)",
    }),
    endless(suffixes),

    // Topic C: Word Families & Spelling
    families,
    withSubtopic(practice("eq-u10-families-p1", families, 1, "Spelling Traps in Word Building", "medium", [quiz("eq-u10-families-p1")]), "spelling-y-to-i"),
    forGrades(practice("eq-u10-families-p2", families, 2, "Champion: Advanced Word Forms", "hard", [quiz("eq-u10-families-p2")]), [5, 6, 7, 8]),
    gate("eq-u10-families-gate", families, "Word Building Challenge", "eq-u10-families-gate-pool", {
      "spelling-y-to-i": "Change y to i (happiness, beautiful)",
      "drop-e-double": "Drop silent e & double consonant",
      "word-roots": "Root words and families",
    }),
    endless(families),

    // Reading & Boss
    u10r,
    boss(
      "eq-u10-boss",
      "eq-u10",
      "Unit 10 Boss",
      "eq-u10-test",
      "Oh no! 👾 The Word Thief Gremlin has scrambled all the word beginnings and endings! Base words are trapped and sentences make no sense. Build the right words with prefixes and suffixes to free the dictionary."
    ),
  ].map((n) => forGrades(n, n.grades || GRADES)),
};

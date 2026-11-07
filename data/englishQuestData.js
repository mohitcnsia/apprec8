// data/englishQuestData.js
// Content for the English Quest (tile-based quest). Seeded to Firestore by
// components/quiz/SeedEnglishQuestButton.js.
//
// - New questions use the V2 format and carry a `mistakeTag` on every wrong option,
//   so the dashboard can show what KIND of mistake a kid made.
// - Units can reuse old IEO content: study pages by `contentId` (studyContent doc id)
//   and quizzes by `quizId` (old quizQuestions are converted on the fly).
// - All new content is original. Past papers are only used as a guide.

import { q, study, quiz, reading, unit, main, practice, gate, withSubtopic, endless, boss } from "./englishQuest/helpers.js";
import { extraUnits, nextUnitTeaser } from "./englishQuest/units/index.js";

export const QUEST_ID = "english-quest";

// No picture (owner 2026-11-07: the old IEO tile image showed an exam name on the quest page). Same as the other
// quests; Gemini's brand subject icons can replace it later.
const QUEST_IMAGE = null;

export const quest = {
  title: "English Quest",
  description:
    "Climb the English tree, from your very first sentence all the way to champion level. Practise in the branches, pass each unit test, and collect stars!",
  image: QUEST_IMAGE,
  version: 1,
};

// The tile. carouselGroup "quest" is only read by app versions that support quests.
export const tile = {
  title: "English Quest",
  type: "QUEST",
  carouselGroup: "quest",
  order: 1,
  image: QUEST_IMAGE,
  questId: QUEST_ID,
  description: "Grammar and reading, from your first sentence to champion level",
};

// ---------- Mistake tags (keep this list short and reuse tags) ----------
// incomplete-thought, missing-subject, missing-verb, subject-predicate-mixup,
// sentence-kind-mixup, wrong-end-mark, missing-capital, pos-noun-mixup,
// pos-verb-mixup, pos-adjective-mixup, pos-adverb-mixup, pos-pronoun-mixup,
// pos-preposition-mixup, pos-conjunction-mixup
// Unit 2: a-an-mixup, sound-not-letter (hour, uniform, one), article-missing, article-extra,
// article-plural-error, a-the-mixup, the-rule-mixup, determiner-number-mixup, near-far-mixup,
// some-any-mixup, countable-uncountable-mixup, few-a-few-mixup
// Unit 5 (tenses): tense-present-past-mixup, tense-form-error (goed, swiming), tense-continuous-mixup, stative-verb-error
// (am knowing), did-base-form-error (did you went), tense-future-form-error (will goes), time-word-mixup, tense-perfect-mixup,
// participle-form-error (has went / sang vs sung), since-for-mixup
// Unit 6 (modals, tags): modal-form-error (can swims), modal-time-mixup (can/could), modal-meaning-mixup, polite-request-mixup,
// mustnt-donthave-mixup, tag-polarity-error, tag-helper-error, tag-pronoun-error
// Unit 7 (Class 5+): passive-form-error, passive-tense-error, passive-number-error, passive-agent-error, reported-tense-error,
// reported-pronoun-error, reported-question-error, reported-order-error, said-told-error
// Unit 8 (linking words): because-so-mixup (reason vs result), because-of-error (because of + sentence), conjunction-double-error
// (although … but), when-while-mixup, conjunction-pair-error (neither … or); reuses conjunction-meaning-error, time-word-mixup
// Unit 9 (punctuation): comma-list-error, comma-address-error (yes/no, names), comma-extra-error, apostrophe-contraction-error,
// apostrophe-owner-error, apostrophe-plural-error (apple's), its-its-mixup, speech-marks-error, speech-capital-error, speech-punctuation-error

// ---------- Study pages (new) ----------
export const studyPages = {
  "eq-u0-what-is-sentence": {
    name: "What is a Sentence?",
    author: "Apprec8",
    cards: [
          {
                "emoji": "🧱",
                "title": "A complete idea",
                "text": "A sentence is a group of words that tells a complete thought. When you read it, you understand the whole picture with nothing missing!",
                "examples": [
                      "The dog barks. (Complete)",
                      "The little dog... (Incomplete!)"
                ]
          },
          {
                "emoji": "🧩",
                "title": "Subject and Predicate",
                "text": "Every sentence has two parts: the subject (who or what it is about) and the predicate (what the subject does or is). The predicate always contains a verb!",
                "examples": [
                      "Riya (subject) | sings sweetly (predicate)",
                      "The puppy (subject) | is sleeping (predicate)"
                ]
          },
          {
                "emoji": "✍️",
                "title": "Sentence rules",
                "text": "Always start a sentence with a capital letter. End it with a full stop, a question mark, or an exclamation mark.",
                "examples": [
                      "The sun is hot.",
                      "Where is my book?",
                      "What a lovely day!"
                ]
          },
          {
                "kind": "check",
                "question": "Which of these is a complete sentence?",
                "answer": "The kitten drinks warm milk.",
                "wrong": [
                      "The fluffy kitten in the basket",
                      "Drinking milk quickly",
                      "Because the kitten was hungry"
                ],
                "explain": "A sentence needs a subject and a verb to express a complete thought."
          },
          {
                "kind": "check",
                "question": "What is the predicate in: 'My grandfather reads the newspaper'?",
                "answer": "reads the newspaper",
                "wrong": [
                      "My grandfather",
                      "the newspaper",
                      "My grandfather reads"
                ],
                "explain": "The predicate tells what the grandfather does, starting with the verb 'reads'."
          }
    ],
    content: `### 🧱 Sentences are like LEGO towers

A **sentence** is a group of words that tells a **complete idea**.

When you read a sentence, you understand the whole thought. Nothing is missing!

- ✅ *The dog barks.* (complete idea)
- ❌ *The dog.* (What about the dog? Something is missing!)

---

### 🧩 Two parts of every sentence

Every sentence has two parts:

1. **Subject**: *who* or *what* the sentence is about.
2. **Predicate**: what the subject *does* or *is*. The predicate always has a **verb**.

| Subject | Predicate |
|---|---|
| Riya | sings beautifully. |
| The little puppy | is sleeping. |
| My grandfather | reads the newspaper every morning. |

> 💡 **Trick:** Ask "Who or what?" to find the subject. Ask "What does it do?" to find the predicate.

---

### ✍️ Sentence rules

- A sentence **starts with a capital letter**.
- A sentence **ends with a full stop (.)**, a question mark (?) or an exclamation mark (!).

*Riya sings beautifully.* ✅
*riya sings beautifully* ❌

---

### 🎯 Now you can…

- tell a sentence from a group of words that is not a sentence
- find the subject and the predicate`,
  },
  "eq-u0-kinds-of-sentences": {
    name: "Four Kinds of Sentences",
    author: "Apprec8",
    cards: [
          {
                "emoji": "📢",
                "title": "Statements and Questions",
                "text": "A statement tells something and ends with a full stop. A question asks something and ends with a question mark.",
                "examples": [
                      "Statement: The train has arrived.",
                      "Question: When will the train arrive?"
                ]
          },
          {
                "emoji": "👉",
                "title": "Commands and Requests",
                "text": "A command or polite request tells someone to do an action. The subject 'you' is hidden! It ends with a full stop.",
                "examples": [
                      "Please pass the salt.",
                      "Close the gate.",
                      "Listen carefully."
                ]
          },
          {
                "emoji": "🎉",
                "title": "Exclamations",
                "text": "An exclamation bursts with strong emotion, surprise, or joy! It often starts with 'What a...' or 'How...' and ends with an exclamation mark.",
                "examples": [
                      "What a magnificent rainbow!",
                      "How fast she runs!"
                ]
          },
          {
                "kind": "check",
                "question": "Which end mark belongs on: 'Please turn off the light'?",
                "answer": "Full stop (.)",
                "wrong": [
                      "Question mark (?)",
                      "Exclamation mark (!)",
                      "Comma (,)"
                ],
                "explain": "This is a polite request (imperative sentence), so it ends with a full stop."
          },
          {
                "kind": "check",
                "question": "Which sentence is an exclamation showing strong emotion?",
                "answer": "What a stunning view this is!",
                "wrong": [
                      "What is your sister's name?",
                      "This is a very nice view.",
                      "Look at the mountain view."
                ],
                "explain": "Sentences starting with 'What a...' that show big emotion are exclamations and end with '!'."
          }
    ],
    content: `### 🎭 Sentences do different jobs

Sentences can **tell**, **ask**, **order** or **show strong feelings**. Each kind has its own end mark.

---

### 1. 📢 Statement (Declarative)
It **tells** us something.
Ends with a **full stop (.)**
*The sun rises in the east.*

### 2. ❓ Question (Interrogative)
It **asks** something.
Ends with a **question mark (?)**
*Where do you live?*

### 3. 👉 Command or Request (Imperative)
It **tells someone to do** something. The subject *you* is hidden!
Ends with a **full stop (.)**
*Close the door.* / *Please pass the salt.*

### 4. 🎉 Exclamation (Exclamatory)
It shows a **strong feeling** like joy, surprise or fear.
Ends with an **exclamation mark (!)**
*What a beautiful rainbow!* / *How tall you have grown!*

---

> 💡 **Trick:** Does it start with *What a…* or *How…* and show a big feeling? It's probably an exclamation, not a question!

---

### 🎯 Now you can…

- name the four kinds of sentences
- choose the right end mark for each one`,
  },
  "eq-u1-adverbs": {
    name: "Adverbs: How, When, Where",
    author: "Apprec8",
    cards: [
          {
                "emoji": "🏃",
                "title": "What is an adverb?",
                "text": "An adverb tells us more about a verb. It answers: How? When? Where? or How often? did the action happen.",
                "examples": [
                      "How: The turtle walked slowly.",
                      "When: We will leave soon.",
                      "Where: Birds fly everywhere.",
                      "How often: He always smiles."
                ]
          },
          {
                "emoji": "🔍",
                "title": "The -ly clue and the trap",
                "text": "Many adverbs end in -ly by adding it to adjectives: quick becomes quickly. But watch out: lovely, friendly, and lonely describe nouns, so they are adjectives!",
                "examples": [
                      "quick → quickly (adverb)",
                      "careful → carefully (adverb)",
                      "a friendly dog (adjective!)",
                      "a lovely song (adjective!)"
                ]
          },
          {
                "emoji": "🎯",
                "title": "Describing adjectives too",
                "text": "Adverbs can also describe adjectives or other adverbs by showing degree: very tall, extremely bright, or too fast.",
                "examples": [
                      "She is very tall.",
                      "He drove too quickly.",
                      "The soup is extremely hot."
                ]
          },
          {
                "kind": "check",
                "question": "Which word in this sentence is an adverb: 'The tortoise walked slowly across the grass'?",
                "answer": "slowly",
                "wrong": [
                      "tortoise",
                      "walked",
                      "across"
                ],
                "explain": "'Slowly' tells us HOW the tortoise walked, so it is an adverb."
          },
          {
                "kind": "check",
                "question": "Which of these words is an ADJECTIVE, not an adverb?",
                "answer": "friendly",
                "wrong": [
                      "loudly",
                      "cheerfully",
                      "quietly"
                ],
                "explain": "'Friendly' describes a noun (a friendly neighbour), making it an adjective!"
          }
    ],
    content: `### 🏃 What is an Adverb?

An **adverb** tells us more about a **verb** (an action). It answers questions like:

| Question | Adverb examples | Sentence |
|---|---|---|
| **How?** | slowly, happily, loudly | The tortoise walked **slowly**. |
| **When?** | now, yesterday, soon | We will leave **soon**. |
| **Where?** | here, outside, everywhere | The children are playing **outside**. |
| **How often?** | always, never, often | She **always** smiles. |

---

### 🔍 Many adverbs end in **-ly**

quick → quick**ly** · careful → careful**ly** · happy → happ**ily**

> ⚠️ But not every *-ly* word is an adverb! *friendly*, *lovely* and *lonely* are **adjectives**: *a friendly dog*.

---

### 🧩 Adverbs can describe adjectives and other adverbs too

- *very* tall → **very** tells us *how* tall
- *too* quickly → **too** tells us *how* quickly

---

### 🎯 Now you can…

- find the adverb in a sentence
- tell an adverb from an adjective`,
  },
  "eq-read-tips": {
    name: "Reading Detective Tips",
    author: "Apprec8",
    cards: [
          {
                "emoji": "👀",
                "title": "Preview the questions first",
                "text": "Before reading a long passage, glance at the questions! Now your detective eyes know exactly which clues, names, and dates to hunt for.",
                "examples": [
                      "Look for names and places",
                      "Spot numbers and years",
                      "Notice key words"
                ]
          },
          {
                "emoji": "🔑",
                "title": "Hunt the key word",
                "text": "Pick a distinctive word from the question and scan the passage until you spot it. The answer usually hides in that exact sentence or the next one!",
                "examples": [
                      "Scan capital letters for names",
                      "Scan digits for dates",
                      "Read the sentence before and after"
                ]
          },
          {
                "emoji": "⚖️",
                "title": "True, false & word meaning",
                "text": "For 'INCORRECT statement' questions, check every option against the story—the one missing or wrong is your answer! For hard words, read surrounding sentences for clues.",
                "examples": [
                      "Check statement 1: True or False",
                      "Check statement 2: True or False",
                      "Answer ONLY from the story"
                ]
          },
          {
                "kind": "check",
                "question": "When answering questions on a story, what is the golden rule?",
                "answer": "Base every answer on facts stated in the passage",
                "wrong": [
                      "Guess based on things you read elsewhere",
                      "Always pick the longest possible option",
                      "Only read the first paragraph of the story"
                ],
                "explain": "Always answer from the passage itself, not from outside assumptions!"
          },
          {
                "kind": "check",
                "question": "What should you do first when tackling a reading comprehension passage?",
                "answer": "Skim the questions quickly to know what clues to hunt for",
                "wrong": [
                      "Memorise every single word in the story",
                      "Answer all questions without reading the story",
                      "Read the story backwards from the end"
                ],
                "explain": "Previewing questions turns you into a focused detective who knows what to look for."
          }
    ],
    content: `### 🕵️ Be a reading detective!

Reading questions are not about remembering everything. They are about **finding the clue** in the passage.

---

### 1. 👀 Read the questions first
Take a quick look at the questions before you read. Now you know what clues to look for!

### 2. 🔑 Find the key word
Pick an important word from the question (a name, a number, a place) and find it in the passage. The answer is usually close by.

### 3. ❌ "Select the INCORRECT statement"
Three options are **true** and one is **false**. Check each option against the passage. The one the passage does *not* say (or says the opposite of) is your answer.

### 4. ⚖️ "Statement I and Statement II"
Check each statement **separately**: true or false? Then pick the option that matches both answers.

### 5. 📖 Word meaning
Read the whole sentence around the word. Try each option in its place. Which one keeps the meaning?

### 6. 🔢 Put events in order
Find each event in the passage. The order in the passage is usually the order of the story.

---

> 💡 **Golden rule:** Answer from the **passage**, not from what you already know!`,
  },
  // Unit 2: Articles & Determiners
  "eq-u2-a-an": {
    name: "A and An",
    author: "Apprec8",
    cards: [
          {
                "emoji": "🍎",
                "title": "The sound, not the letter!",
                "text": "Use a or an before one person or thing. The rule depends on the first sound you hear, not the written letter: vowel sounds take an, consonant sounds take a.",
                "examples": [
                      "a book",
                      "a cat",
                      "an apple",
                      "an umbrella"
                ]
          },
          {
                "emoji": "🤫",
                "title": "Silent H takes AN",
                "text": "In words like hour and honest, the initial letter h is silent! Because the word begins with an 'ow' or 'o' vowel sound, we say an hour and an honest person.",
                "examples": [
                      "an hour (silent h)",
                      "an honest child",
                      "an heir to the throne",
                      "a horse (h is sounded!)"
                ]
          },
          {
                "emoji": "🎺",
                "title": "The 'you' sound takes A",
                "text": "Uniform and university begin with the vowel letter u, but they sound like 'you' (a consonant sound). So we say a uniform and a university!",
                "examples": [
                      "a uniform",
                      "a university",
                      "a European trip",
                      "a one-rupee note (w sound)"
                ]
          },
          {
                "emoji": "👩‍⚕️",
                "title": "Jobs need A or AN",
                "text": "In English, naming someone's profession always needs a or an. Never say 'My mother is doctor'—say 'My mother is a doctor!'",
                "examples": [
                      "She is a doctor.",
                      "He is an architect.",
                      "Rohan is an engineer.",
                      "Asha is a pilot."
                ]
          },
          {
                "kind": "check",
                "question": "Which phrase uses 'an' correctly before a silent h?",
                "answer": "an honest leader",
                "wrong": [
                      "a honest leader",
                      "an hotel room",
                      "an house"
                ],
                "explain": "'Honest' starts with a silent h, so the first sound is an 'o' vowel sound: an honest leader."
          },
          {
                "kind": "check",
                "question": "Why do we say 'a uniform' instead of 'an uniform'?",
                "answer": "'Uniform' begins with a consonant 'you' sound",
                "wrong": [
                      "'Uniform' is a plural noun",
                      "'Uniform' has a silent letter",
                      "'Uniform' is an ancient Latin word"
                ],
                "explain": "Even though u is a vowel letter, it sounds like the consonant 'y' in 'you', so it takes 'a'."
          }
    ],
    content: `### 🍎 A or An?

We use **a** or **an** before **one** thing (a singular noun). It means "any one".

- **a** book, **a** cat, **a** tree
- **an** apple, **an** egg, **an** igloo, **an** orange, **an** umbrella

---

### 👂 Listen to the sound, not the letter!

The rule is about the **first sound** we say, not the first letter we write.

| Word | First sound | So we say |
|---|---|---|
| hour | "ow" (the h is silent) | **an** hour |
| honest | "o" (the h is silent) | **an** honest boy |
| uniform | "you" | **a** uniform |
| university | "you" | **a** university |
| one-rupee coin | "wun" | **a** one-rupee coin |
| X-ray | "eks" | **an** X-ray |

> 💡 Vowel **sound** (a, e, i, o, u sounds) → **an**. Any other sound → **a**.

---

### 👩‍⚕️ Jobs need a or an too

- My aunt is **a** doctor.
- My uncle is **an** engineer.

> ⚠️ Never say "He is engineer." One person → **a** or **an**.

---

### 🎯 Now you can…

- choose **a** or **an** by listening to the first sound
- spot tricky words like *hour* and *uniform*`,
  },
  "eq-u2-the": {
    name: "Using The",
    author: "Apprec8",
    cards: [
          {
                "emoji": "👉",
                "title": "The: the one we both know",
                "text": "Say 'a' the first time you mention something. Switch to 'the' once the listener knows which specific one you mean: 'I bought a puppy. The puppy loves balls!'",
                "examples": [
                      "A bird landed. The bird sang.",
                      "Pass me the blue pen on your desk."
                ]
          },
          {
                "emoji": "🌞",
                "title": "The only one in the world",
                "text": "Use 'the' for unique things, famous monuments, and superlatives: the sun, the moon, the Red Fort, the tallest boy in class.",
                "examples": [
                      "the sun and the moon",
                      "the Taj Mahal",
                      "the tallest mountain",
                      "the first prize"
                ]
          },
          {
                "emoji": "🌊",
                "title": "Waters and mountain ranges",
                "text": "Use 'the' with rivers, seas, oceans, and mountain chains: the Ganga, the Indian Ocean, the Himalayas. But a single mountain has no 'the': Mount Everest!",
                "examples": [
                      "the Ganga (river)",
                      "the Indian Ocean (ocean)",
                      "the Himalayas (mountain range)",
                      "Mount Everest (single peak: no the!)"
                ]
          },
          {
                "emoji": "🚫",
                "title": "When to skip the article",
                "text": "Do not put 'the' before names of people, cities, sports, school subjects, or daily meals.",
                "examples": [
                      "Priya lives in Delhi. (not the Priya)",
                      "We play cricket. (not the cricket)",
                      "Breakfast is ready. (not the breakfast)",
                      "She likes Maths. (not the Maths)"
                ]
          },
          {
                "kind": "check",
                "question": "Which sentence uses 'the' correctly with a mountain range?",
                "answer": "The Himalayas are covered in deep snow.",
                "wrong": [
                      "The Mount Everest is very high.",
                      "Mount Everest has the peak.",
                      "A Himalayas are in Asia."
                ],
                "explain": "Mountain ranges take 'the' (the Himalayas), but individual mountain peaks do not take 'the'."
          },
          {
                "kind": "check",
                "question": "Which of these phrases should NOT have 'the' in front of it?",
                "answer": "dinner",
                "wrong": [
                      "sun",
                      "Arabian Sea",
                      "Taj Mahal"
                ],
                "explain": "Names of meals (breakfast, lunch, dinner) do not take an article."
          }
    ],
    content: `### 👉 The = the one we both know

Say **a** the first time. Say **the** when we already know which one.

- I saw **a** dog. **The** dog was barking. (the same dog!)

---

### 🌞 Use **the** for…

| When | Examples |
|---|---|
| There is only one | **the** sun, **the** moon, **the** sky |
| Rivers, seas, oceans | **the** Ganga, **the** Arabian Sea, **the** Indian Ocean |
| Mountain ranges | **the** Himalayas |
| Famous buildings | **the** Taj Mahal, **the** Red Fort |
| "Best" words and order words | **the** tallest, **the** best, **the** first |

---

### 🚫 No article for…

| What | Examples |
|---|---|
| Names of people | Priya, Dr Kalam |
| Most countries, states and cities | India, Kerala, Chennai |
| Languages and subjects | Hindi, Tamil, Science |
| Meals | breakfast, lunch, dinner |
| Games | cricket, chess |
| One mountain | Mount Everest |

> ⚠️ Some country names need **the**: **the** USA, **the** UK. And a range of mountains needs **the** (**the** Himalayas), but one mountain doesn't (Mount Everest).

---

### 🎯 Now you can…

- use **the** for the one we know
- leave out the article before names, languages, meals and games`,
  },
  "eq-u2-determiners": {
    name: "Determiners: This, Some, Many",
    author: "Apprec8",
    cards: [
          {
                "emoji": "👆",
                "title": "Pointing: near and far",
                "text": "Use 'this' and 'these' for things close to you. Use 'that' and 'those' for things far away: this book (here in hand), that kite (up in the sky).",
                "examples": [
                      "this book (1 thing, near)",
                      "these books (many, near)",
                      "that bird (1 thing, far)",
                      "those birds (many, far)"
                ]
          },
          {
                "emoji": "🍬",
                "title": "Some vs Any",
                "text": "Use 'some' in positive statements and when making polite offers. Use 'any' in negative sentences and questions.",
                "examples": [
                      "I have some grapes.",
                      "Would you like some tea?",
                      "I do not have any coins.",
                      "Do you have any pencils?"
                ]
          },
          {
                "emoji": "🔢",
                "title": "Many vs Much",
                "text": "Use 'many' for things you can count individually (books, rupees, apples). Use 'much' for uncountable things (water, rice, time, sugar).",
                "examples": [
                      "many books / students",
                      "much water / patience",
                      "How many pens do you have?",
                      "How much milk is left?"
                ]
          },
          {
                "emoji": "🤏",
                "title": "Few vs Little",
                "text": "Countable nouns take 'few' or 'a few'. Uncountable nouns take 'little' or 'a little'. Adding 'a' means you have some; without 'a' it means almost none at all!",
                "examples": [
                      "a few biscuits (a small number)",
                      "few friends (hardly any 😟)",
                      "a little milk (enough for tea)",
                      "little hope (almost no hope 😟)"
                ]
          },
          {
                "kind": "check",
                "question": "Which determiner fits: 'There isn't ___ milk left in the bottle.'?",
                "answer": "any",
                "wrong": [
                      "some",
                      "many",
                      "few"
                ],
                "explain": "In negative sentences with 'not', use 'any': 'There isn't any milk.'"
          },
          {
                "kind": "check",
                "question": "Which sentence uses 'many' correctly with a countable noun?",
                "answer": "How many apples are in the basket?",
                "wrong": [
                      "How many water is in the glass?",
                      "How many sugar do you want?",
                      "How many luggage do you carry?"
                ],
                "explain": "Apples can be counted, so we ask 'How many apples?' Water and sugar take 'much'."
          }
    ],
    content: `### 🧭 What is a determiner?

A **determiner** comes **before a noun**. It tells us **which one** or **how many**.
*a, an* and *the* are determiners too!

---

### 👆 This, that, these, those

| Word | Means | Example |
|---|---|---|
| **this** | one thing, near | **this** pen (in my hand) |
| **that** | one thing, far | **that** kite (up in the sky) |
| **these** | many things, near | **these** pens |
| **those** | many things, far | **those** kites |

---

### 🍬 Some and any

- **some** in telling sentences: I have **some** sweets.
- **any** in "not" sentences and questions: I don't have **any** sweets. Do you have **any** sweets?
- 💡 When we offer something, we say **some**: Would you like **some** tea?

---

### 🔢 Many or much? Few or little?

| Things we can count (books, friends) | Things we can't count (water, sugar) |
|---|---|
| **many** books | **much** water |
| **a few** friends (some) | **a little** sugar (some) |
| **few** friends (almost none 😟) | **little** time (almost none 😟) |

---

### 🎯 Now you can…

- point with this, that, these and those
- choose some or any
- choose many or much, few or little`,
  },

  "eq-u1-noun-intro": {
  "name": "Introduction to Nouns",
  "author": "Apprec8",
  "cards": [
    {
      "emoji": "📘",
      "title": "What is a noun?",
      "text": "Nouns are naming words. They give names to people, places, animals, things, and ideas! If you can touch it, see it, or think about it, there is a noun.",
      "examples": [
        "Person: teacher, Priya",
        "Place: school, Delhi",
        "Animal: tiger, dolphin",
        "Thing: book, bicycle"
      ]
    },
    {
      "emoji": "🧩",
      "title": "Different noun families",
      "text": "Nouns belong to different families: common and proper names, collective groups, abstract thoughts, and materials things are made of. You will master them all!",
      "examples": [
        "Common: city, boy",
        "Proper: Mumbai, Rohan",
        "Collective: team, flock",
        "Abstract: kindness, courage"
      ]
    },
    {
      "emoji": "🔢",
      "title": "Countable and uncountable",
      "text": "Some nouns can be counted with numbers like one, two, or three books. Others are liquids or grains you cannot count directly, like milk or sand.",
      "examples": [
        "Countable: apple, pencil",
        "Countable: chair, dog",
        "Uncountable: water, milk",
        "Uncountable: sugar, rice"
      ]
    },
    {
      "kind": "check",
      "question": "Which of these words is a noun naming a person or thing?",
      "answer": "telescope",
      "wrong": [
        "curious",
        "quickly",
        "discover"
      ],
      "explain": "A telescope is a physical object (thing), which makes it a noun."
    },
    {
      "kind": "check",
      "question": "What do all nouns do in a sentence?",
      "answer": "Name a person, place, animal, thing, or idea",
      "wrong": [
        "Show an action or movement",
        "Describe how an action was done",
        "Join two sentences together"
      ],
      "explain": "Nouns are naming words for people, places, animals, things, and concepts."
    }
  ],
  "content": "### 📘 What is a Noun?\n\nNouns are **naming words**. They give names to **people**, **places**, **animals**, **things**, and even **ideas**!\n\n> If you can touch it, see it, hear it, or think about it — there's a noun hiding in there somewhere!\n\n---\n\n### 🧩 What You'll Discover in This Chapter\n\n- 🧍 Common & Proper Nouns\n- 🧑‍🤝‍🧑 Collective Nouns\n- ✨ Abstract & Concrete Nouns\n- 🧱 Material Nouns\n- 🔢 Countable & Uncountable Nouns\n- 🧒 Singular & Plural\n- 🚻 Gender of Nouns\n\n---\n\n### 🎯 What You’ll Learn to Do\n\n- Spot nouns in sentences 🕵️‍♀️\n- Sort different types of nouns into buckets 🪣\n- Change between one and many 🔁\n- Understand tricky nouns you can’t touch or see 🌈"
},

  "eq-u1-noun-basic": {
  "name": "Common & Proper Nouns",
  "author": "Apprec8",
  "cards": [
    {
      "emoji": "🧍",
      "title": "Common nouns: general names",
      "text": "Common nouns are everyday general names for any person, place, animal, or thing. They do not need capital letters unless they start a sentence.",
      "examples": [
        "boy, girl, student",
        "city, village, school",
        "dog, elephant, bird",
        "book, chair, pencil"
      ]
    },
    {
      "emoji": "👑",
      "title": "Proper nouns: VIP names",
      "text": "Proper nouns name a specific person, place, festival, or monument. Because they are special, they always begin with a proud capital letter!",
      "examples": [
        "Rohan, Dr Kalam",
        "India, Mumbai",
        "Taj Mahal, Red Fort",
        "Diwali, Eid, Christmas"
      ]
    },
    {
      "emoji": "🧑‍🤝‍🧑",
      "title": "Collective nouns: group words",
      "text": "A collective noun names a whole group of people, animals, or things spoken of as one single team or unit.",
      "examples": [
        "a team of players",
        "a flock of birds",
        "a pride of lions",
        "a bunch of keys"
      ]
    },
    {
      "kind": "check",
      "question": "Which word in this sentence is a PROPER noun: 'Kabir visited the Red Fort in Delhi.'?",
      "answer": "Kabir",
      "wrong": [
        "visited",
        "fort",
        "the"
      ],
      "explain": "Kabir, Red Fort, and Delhi are all proper nouns naming a specific person, monument, and city."
    },
    {
      "kind": "check",
      "question": "What is the collective noun for a group of lions?",
      "answer": "pride",
      "wrong": [
        "flock",
        "pack",
        "school"
      ],
      "explain": "A group of lions is called a 'pride of lions'."
    }
  ],
  "content": "### 🧍‍♂️ Common Nouns\n\nThese are **general names** for people, animals, places, or things.\n- Examples: *girl*, *city*, *teacher*, *book*, *dog*\n\n📌 **Tip:** If you can put **\"a\" or \"the\"** before it and it's not specific, it’s probably common.\n\n---\n\n### 🧑‍🏫 Proper Nouns\n\nThese are **specific names** of people, places, or things. They **always start with a capital letter**.\n- Examples: *Ravi*, *London*, *Taj Mahal*, *Diwali*\n\n📌 **Tip:** Proper nouns are VIPs – they get a capital letter because they’re important!\n\n---\n\n### 🧑‍🤝‍🧑 Collective Nouns\n\nThese describe a **group of people, animals, or things**.\n- A *team* of players\n- A *flock* of birds\n- A *bunch* of bananas\n- A *class* of students"
},

  "eq-u1-noun-plurals": {
  "name": "Singular & Plural Nouns",
  "author": "Apprec8",
  "cards": [
    {
      "emoji": "🎈",
      "title": "One vs More than one",
      "text": "Singular means exactly one person or thing. Plural means two or more. Most English words become plural simply by adding the letter -s!",
      "examples": [
        "bag → bags",
        "lion → lions",
        "tree → trees",
        "pencil → pencils"
      ]
    },
    {
      "emoji": "📦",
      "title": "Adding -ES for hissing sounds",
      "text": "When a word ends with a hissing or buzzing sound (s, sh, ch, x, z), add -es so it is easy to say aloud!",
      "examples": [
        "box → boxes",
        "dish → dishes",
        "watch → watches",
        "bus → buses"
      ]
    },
    {
      "emoji": "👶",
      "title": "The Y rules and F to VES",
      "text": "Consonant + y changes to -ies: baby becomes babies. But vowel + y just adds -s: toy becomes toys! Many words ending in f or fe change to -ves.",
      "examples": [
        "baby → babies (consonant + y)",
        "toy → toys (vowel + y)",
        "leaf → leaves (f → ves)",
        "knife → knives (fe → ves)"
      ]
    },
    {
      "emoji": "🦶",
      "title": "Irregular plurals & no change",
      "text": "Some words change their vowels or whole spelling! A few words stay exactly the same whether there is one or one hundred.",
      "examples": [
        "child → children",
        "foot → feet",
        "man → men, tooth → teeth",
        "one sheep → ten sheep (no change!)"
      ]
    },
    {
      "kind": "check",
      "question": "What is the plural of 'knife'?",
      "answer": "knives",
      "wrong": [
        "knifes",
        "knifees",
        "knivs"
      ],
      "explain": "Words ending in -fe like knife drop -fe and take -ves: knives."
    },
    {
      "kind": "check",
      "question": "Which noun stays exactly the same in both singular and plural?",
      "answer": "sheep",
      "wrong": [
        "puppy",
        "box",
        "child"
      ],
      "explain": "'Sheep' does not change: one sheep, five sheep!"
    }
  ],
  "content": "### 📘 Singular & Plural Rules\n\n👉 One = **Singular**\n👉 More than one = **Plural**\n\n| Rule | Description | Example |\n| --- | --- | --- |\n| Add **s** | Most words | bag → bags, lion → lions |\n| Add **es** | Ends with s, x, z, sh, ch | box → boxes, dish → dishes |\n| Drop -y, add -ies | Consonant + y | baby → babies |\n| Just add s | Vowel + y | toy → toys |\n| f or fe → ves | Most f/fe endings | wolf → wolves, knife → knives |\n| Irregular | Vowel changes | child → children, foot → feet |\n| No change | Same singular/plural | sheep → sheep, deer → deer |"
},

  "eq-u1-noun-gender": {
  "name": "Gender of Nouns",
  "author": "Apprec8",
  "cards": [
    {
      "emoji": "🚻",
      "title": "Four genders in English",
      "text": "Nouns can be masculine (males), feminine (females), common (either male or female), or neuter (non-living things with no gender).",
      "examples": [
        "Masculine: king, brother, bull",
        "Feminine: queen, sister, cow",
        "Common: teacher, cousin",
        "Neuter: table, stone"
      ]
    },
    {
      "emoji": "🧑‍🏫",
      "title": "Common gender nouns",
      "text": "Common gender words refer to living people or animals that can be either male or female without changing the word.",
      "examples": [
        "teacher (male or female)",
        "doctor (male or female)",
        "friend (male or female)",
        "student, baby, cousin"
      ]
    },
    {
      "emoji": "🪑",
      "title": "Neuter gender for objects",
      "text": "Non-living objects have no biological sex, so they are neuter gender. We refer to them with the pronoun 'it'.",
      "examples": [
        "desk, pencil, school",
        "car, telephone, clock",
        "water, cloud, mountain"
      ]
    },
    {
      "kind": "check",
      "question": "Which of these words is a COMMON gender noun?",
      "answer": "doctor",
      "wrong": [
        "king",
        "queen",
        "notebook"
      ],
      "explain": "'Doctor' can refer to a male or female doctor, so it is of common gender."
    },
    {
      "kind": "check",
      "question": "What is the feminine counterpart of 'nephew'?",
      "answer": "niece",
      "wrong": [
        "aunt",
        "sister",
        "cousin"
      ],
      "explain": "A brother or sister's daughter is a niece (feminine); their son is a nephew (masculine)."
    }
  ],
  "content": "### 🚻 Four Types of Gender\n\n1. **Masculine**: Refers to male beings (boy, king, father, bull).\n2. **Feminine**: Refers to female beings (girl, queen, mother, cow).\n3. **Common**: Can be either male or female (teacher, friend, doctor, student).\n4. **Neuter**: Refers to non-living objects with no gender (book, table, chair, pen)."
},

  "eq-u1-noun-advanced": {
  "name": "Advanced Noun Types",
  "author": "Apprec8",
  "cards": [
    {
      "emoji": "🧠",
      "title": "Abstract vs Concrete nouns",
      "text": "Concrete nouns are things you can touch, see, or smell (bell, flower). Abstract nouns are thoughts, emotions, and qualities you feel in your heart but cannot hold in your hand (honesty, courage).",
      "examples": [
        "Concrete: desk, puppy, apple",
        "Abstract: bravery, kindness, truth",
        "Abstract: happiness, friendship"
      ]
    },
    {
      "emoji": "🧱",
      "title": "Material nouns: building blocks",
      "text": "Material nouns name the raw matter or substances used to make things. They are natural materials like wood, gold, cotton, wool, and clay.",
      "examples": [
        "wood (makes tables)",
        "gold (makes rings)",
        "cotton (makes shirts)",
        "clay, iron, silk"
      ]
    },
    {
      "emoji": "💧",
      "title": "Countable vs Uncountable",
      "text": "Countable nouns can be counted as one, two, or three items. Uncountable nouns are liquids, grains, or powders you measure rather than count.",
      "examples": [
        "Countable: three pencils, two books",
        "Uncountable: water, milk, rice",
        "Uncountable: sugar, information"
      ]
    },
    {
      "kind": "check",
      "question": "Which of these words is an ABSTRACT noun?",
      "answer": "bravery",
      "wrong": [
        "shield",
        "soldier",
        "sword"
      ],
      "explain": "'Bravery' is a quality you cannot touch or see, making it an abstract noun."
    },
    {
      "kind": "check",
      "question": "Which noun is UNCOUNTABLE and cannot be pluralized with -s?",
      "answer": "milk",
      "wrong": [
        "apple",
        "bottle",
        "coin"
      ],
      "explain": "Liquids like milk are uncountable; we say 'a glass of milk', not 'milks'."
    }
  ],
  "content": "### 🧠 Advanced Nouns\n\n- **Abstract Nouns:** Feelings, qualities, and ideas you cannot touch or see (honesty, bravery, love).\n- **Concrete Nouns:** Physical objects detected with your senses (apple, bell, flower).\n- **Material Nouns:** Raw substances things are built from (wood, gold, cotton, clay).\n- **Countable Nouns:** Things you can count individually (pencil, book, cat).\n- **Uncountable Nouns:** Substances measured or poured (milk, sugar, water, rice)."
},

  "eq-u1-pronoun-intro": {
  "name": "Introduction to Pronouns",
  "author": "Apprec8",
  "cards": [
    {
      "emoji": "🎈",
      "title": "Sentence substitutes!",
      "text": "Pronouns are words that replace nouns so you don't repeat the same names again and again. Instead of 'Ria loves Ria's cat', we say 'Ria loves her cat'!",
      "examples": [
        "Ria → she / her",
        "The boys → they / them",
        "The dog → it",
        "You and I → we / us"
      ]
    },
    {
      "emoji": "🎭",
      "title": "The pronoun squad",
      "text": "Different pronouns do different tasks: personal pronouns name people, possessives show who owns what, and demonstratives point to things near and far.",
      "examples": [
        "Personal: I, you, he, she, they",
        "Possessive: mine, yours, theirs",
        "Demonstrative: this, that, these",
        "Interrogative: who, what, which"
      ]
    },
    {
      "emoji": "🌈",
      "title": "Indefinite pronouns",
      "text": "When we talk about people or things generally without naming exactly who, we use indefinite pronouns like everyone, somebody, anything, or nobody.",
      "examples": [
        "Everyone was cheering.",
        "Somebody knocked on the door.",
        "Is anything missing?",
        "Nobody knows the secret."
      ]
    },
    {
      "kind": "check",
      "question": "Which pronoun replaces the words 'the girls': 'The girls danced well because the girls had practised.'?",
      "answer": "they",
      "wrong": [
        "them",
        "she",
        "her"
      ],
      "explain": "'They' is the subject pronoun that replaces 'the girls'."
    },
    {
      "kind": "check",
      "question": "What is the main purpose of using pronouns in writing?",
      "answer": "To avoid repeating the same noun over and over",
      "wrong": [
        "To make sentences as long as possible",
        "To remove all verbs from the sentence",
        "To change statements into questions"
      ],
      "explain": "Pronouns replace nouns so our sentences sound smooth and natural."
    }
  ],
  "content": "### 🎈 What are Pronouns?\n\nPronouns are **substitute words** that take the place of **nouns** so we don't repeat names over and over.\n\n### 🎭 Main Types:\n- **Personal:** I, you, he, she, it, we, they\n- **Possessive:** mine, yours, his, hers, ours, theirs\n- **Reflexive:** myself, yourself, himself, herself, themselves\n- **Demonstrative:** this, that, these, those\n- **Interrogative:** who, whom, whose, which, what\n- **Indefinite:** everyone, someone, nobody, anything"
},

  "eq-u1-pronoun-basic": {
  "name": "Personal & Possessive Pronouns",
  "author": "Apprec8",
  "cards": [
    {
      "emoji": "👤",
      "title": "First, second and third person",
      "text": "First person is the speaker (I, we). Second person is the person you speak to (you). Third person is the person or thing you talk about (he, she, it, they).",
      "examples": [
        "First person: I, me, we, us",
        "Second person: you",
        "Third person: he, she, it, they"
      ]
    },
    {
      "emoji": "⚖️",
      "title": "Subject vs Object pronouns",
      "text": "Subject pronouns do the action (I, he, she, we, they). Object pronouns receive the action (me, him, her, us, them).",
      "examples": [
        "She called me. (She = subject, me = object)",
        "We invited them. (We = subject, them = object)",
        "He helped us."
      ]
    },
    {
      "emoji": "👜",
      "title": "Possessive pronouns stand alone",
      "text": "Possessive adjectives come before a noun: 'This is my pen.' Possessive pronouns stand proudly by themselves without a noun: 'This pen is mine!'",
      "examples": [
        "my pen → mine",
        "your book → yours",
        "her bag → hers",
        "our school → ours"
      ]
    },
    {
      "kind": "check",
      "question": "Which word correctly completes: 'That blue bicycle belongs to me; it is ___.'?",
      "answer": "mine",
      "wrong": [
        "my",
        "me",
        "mines"
      ],
      "explain": "'Mine' is the possessive pronoun that stands alone at the end."
    },
    {
      "kind": "check",
      "question": "Choose the correct pronoun: 'The teacher praised ___ for our honest work.'",
      "answer": "us",
      "wrong": [
        "we",
        "our",
        "ours"
      ],
      "explain": "The teacher praised who? 'Us' is the object pronoun receiving the praise."
    }
  ],
  "content": "### 👤 Personal Pronouns\n\n| Person | Subject | Object |\n| --- | --- | --- |\n| 1st Person | I, we | me, us |\n| 2nd Person | you | you |\n| 3rd Person | he, she, it, they | him, her, it, them |\n\n---\n\n### 👜 Possessive Pronouns vs Adjectives\n\n- **Possessive Adjectives:** my, your, his, her, its, our, their *(used before nouns: my desk)*\n- **Possessive Pronouns:** mine, yours, his, hers, ours, theirs *(stand alone: the desk is mine)*"
},

  "eq-u1-pronoun-adv1": {
  "name": "Demonstrative, Reflexive & Indefinite Pronouns",
  "author": "Apprec8",
  "cards": [
    {
      "emoji": "👉",
      "title": "Pointing with demonstratives",
      "text": "Demonstrative pronouns point out objects based on distance and number: this (one near), these (many near), that (one far), and those (many far).",
      "examples": [
        "This is my sketchbook.",
        "These are fresh cherries.",
        "That is an aeroplane.",
        "Those are distant hills."
      ]
    },
    {
      "emoji": "🪞",
      "title": "Reflexive: reflecting back",
      "text": "Use reflexive pronouns when the person doing the action is also the one receiving it! They end in -self (singular) or -selves (plural).",
      "examples": [
        "I taught myself chess.",
        "She looked at herself in the mirror.",
        "They organised the party themselves.",
        "He hurt himself."
      ]
    },
    {
      "emoji": "❓",
      "title": "Indefinite pronouns",
      "text": "Indefinite pronouns refer to people or things in a general way without telling us exactly who. Most indefinite pronouns take a singular verb!",
      "examples": [
        "Someone left their coat.",
        "Everything is ready for lunch.",
        "Nobody knew the password.",
        "Everyone has arrived."
      ]
    },
    {
      "kind": "check",
      "question": "Which reflexive pronoun completes: 'The little cat cleaned ___ with its paws.'?",
      "answer": "itself",
      "wrong": [
        "himself",
        "herself",
        "themselves"
      ],
      "explain": "Animals without specific names take 'itself'."
    },
    {
      "kind": "check",
      "question": "Which word is a DEMONSTRATIVE pronoun pointing to objects nearby?",
      "answer": "These",
      "wrong": [
        "They",
        "Those",
        "Theirs"
      ],
      "explain": "'These' points to plural items close to the speaker."
    }
  ],
  "content": "### 👉 Demonstrative Pronouns\n- **Near:** this (singular), these (plural)\n- **Far:** that (singular), those (plural)\n\n### 🪞 Reflexive Pronouns\nUsed when the subject and object are the same person (ends in -self or -selves):\n- myself, yourself, himself, herself, itself, ourselves, yourselves, themselves\n\n### ❓ Indefinite Pronouns\nRefer to general people or things without naming who: someone, everyone, nobody, anything, few, all."
},

  "eq-u1-pronoun-adv2": {
  "name": "Emphatic, Interrogative & Relative Pronouns",
  "author": "Apprec8",
  "cards": [
    {
      "emoji": "💥",
      "title": "Emphatic: adding extra punch!",
      "text": "Emphatic pronouns look like reflexive pronouns, but they are added purely for emphasis. If you remove the word, the sentence still makes complete sense!",
      "examples": [
        "I myself baked this loaf.",
        "The Principal himself gave the award.",
        "She solved the problem herself.",
        "They themselves admitted the mistake."
      ]
    },
    {
      "emoji": "🕵️",
      "title": "Interrogative: question words",
      "text": "Interrogative pronouns ask questions about unknown people or things: Who is coming? Whose coat is this? Which colour do you prefer?",
      "examples": [
        "Who = asks about people (subject)",
        "Whose = asks about ownership",
        "Which = choice from a set",
        "What = asks about things"
      ]
    },
    {
      "emoji": "🧃",
      "title": "Relative: sentence glue",
      "text": "Relative pronouns connect extra clauses to nouns. Use 'who' for people, 'whose' for ownership, and 'which' or 'that' for animals and objects.",
      "examples": [
        "The girl who won the race is my sister.",
        "The book which I read was exciting.",
        "The boy whose kite broke was sad."
      ]
    },
    {
      "kind": "check",
      "question": "In 'The Queen herself planted the tree', what kind of pronoun is 'herself'?",
      "answer": "Emphatic pronoun",
      "wrong": [
        "Reflexive pronoun",
        "Relative pronoun",
        "Interrogative pronoun"
      ],
      "explain": "Removing 'herself' leaves 'The Queen planted the tree' intact, showing it was used for emphasis."
    },
    {
      "kind": "check",
      "question": "Choose the correct relative pronoun: 'This is the young author ___ wrote the novel.'",
      "answer": "who",
      "wrong": [
        "which",
        "what",
        "whose"
      ],
      "explain": "Use 'who' when referring to people in relative clauses."
    }
  ],
  "content": "### 💥 Emphatic Pronouns\nUsed to emphasize the subject (I *myself* did it!). If removed, the sentence still makes complete sense.\n\n### 🕵️ Interrogative Pronouns\nUsed to ask questions:\n- **Who / Whom:** people\n- **Whose:** possession\n- **What / Which:** things and choices\n\n### 🧃 Relative Pronouns\nJoin clauses and add extra information:\n- **Who:** people (subject)\n- **Whose:** possession\n- **Which / That:** objects and animals"
},

  "eq-u1-verb-intro": {
  "name": "Introduction to Verbs",
  "author": "Apprec8",
  "cards": [
    {
      "emoji": "📚",
      "title": "The sentence engine!",
      "text": "A verb is the beating heart of every sentence. It tells what someone does (action), what someone is (being), or what someone possesses (having)!",
      "examples": [
        "Action: Priya runs fast.",
        "Being: The soup is warm.",
        "Having: Rohan has a new puppy.",
        "Every sentence needs a verb!"
      ]
    },
    {
      "emoji": "🏃",
      "title": "Action verbs: doing things",
      "text": "Action verbs describe physical or mental movements: jumping, building, swimming, thinking, and laughing. If a person or machine can do it, it's an action verb!",
      "examples": [
        "kick the ball",
        "read a story",
        "paint a picture",
        "listen carefully"
      ]
    },
    {
      "emoji": "🔗",
      "title": "Being and helping verbs",
      "text": "Verbs like am, is, are, was, and were describe a state of being. Helping verbs like can, will, and has assist the main verb to show tense.",
      "examples": [
        "She is cheerful. (Being)",
        "We have finished our tea. (Helping)",
        "He can swim across the river. (Modal helper)"
      ]
    },
    {
      "kind": "check",
      "question": "Which word in this sentence is the action verb: 'The swallow flies south for winter.'?",
      "answer": "flies",
      "wrong": [
        "swallow",
        "south",
        "winter"
      ],
      "explain": "'Flies' describes the physical action that the bird swallow does."
    },
    {
      "kind": "check",
      "question": "What is the function of the verb in: 'Tara has two pet rabbits.'?",
      "answer": "It shows possession (having)",
      "wrong": [
        "It shows physical running action",
        "It asks a question",
        "It connects two sentences"
      ],
      "explain": "'Has' is a verb expressing ownership or possession."
    }
  ],
  "content": "### 📚 What is a Verb?\n\nA **verb** tells what someone **does** (action), **is** (being), or **has** (possession).\n\n### 🏃 Verb Squad:\n- **Action Verbs:** run, eat, jump, build\n- **Linking Verbs:** am, is, are, feel, seem\n- **Helping Verbs:** has, have, will, can\n- **Transitive Verbs:** take an object (kicks the ball)\n- **Intransitive Verbs:** no object needed (runs fast)\n- **Finite Verbs:** change with tense and subject"
},

  "eq-u1-verb-linking": {
  "name": "Action & Linking Verbs",
  "author": "Apprec8",
  "cards": [
    {
      "emoji": "⚡",
      "title": "Action verbs = doing",
      "text": "Action verbs describe physical or mental activity. You can see, hear, or picture the action happening: run, laugh, speak, build, write.",
      "examples": [
        "She kicks the ball.",
        "He solves the maths puzzle.",
        "The birds chirp at sunrise."
      ]
    },
    {
      "emoji": "🔗",
      "title": "Linking verbs = connecting",
      "text": "Linking verbs do not express actions. Instead, they act like an equal sign (=), linking the subject to words that describe it!",
      "examples": [
        "He is happy. (He = happy)",
        "The milk smells fresh. (Milk = fresh)",
        "They seemed tired. (They = tired)"
      ]
    },
    {
      "emoji": "🎭",
      "title": "The double-agent test!",
      "text": "Some verbs can be linking OR action verbs! Test with 'is' or 'are': if you can replace the verb with 'is' and it makes sense, it is linking!",
      "examples": [
        "The soup smells delicious. → Soup IS delicious. (Linking!)",
        "She smelled the flower. (Action!)",
        "He looked angry. → He IS angry. (Linking!)",
        "He looked through binoculars. (Action!)"
      ]
    },
    {
      "kind": "check",
      "question": "In 'The little puppy seems sleepy', what type of verb is 'seems'?",
      "answer": "Linking verb",
      "wrong": [
        "Action verb",
        "Transitive verb",
        "Helping verb"
      ],
      "explain": "'Seems' links the puppy to the adjective 'sleepy'; it does not show a physical action."
    },
    {
      "kind": "check",
      "question": "In which sentence is 'tastes' used as a LINKING verb?",
      "answer": "This fresh mango tastes sweet.",
      "wrong": [
        "The chef tastes the curry carefully.",
        "The boy tasted the hot sauce with a spoon.",
        "She tastes every sample."
      ],
      "explain": "'Tastes sweet' links the mango to 'sweet'. You can say 'The mango is sweet'."
    }
  ],
  "content": "### ⚡ Action Verbs (Doing Verbs)\nShow movement or activity: *run, jump, write, shout*.\n- *She jumps high.*\n- *They play football.*\n\n---\n\n### 🔗 Linking Verbs (Being Verbs)\nConnect the subject to an adjective or noun that describes it: *am, is, are, was, were, feel, seem, look, smell*.\n- *He is happy.*\n- *The soup smells great.*\n\n> 💡 **Quick Test:** If you can swap the verb for **is/are** and it still makes sense, it's a linking verb!"
},

  "eq-u1-verb-transitive": {
  "name": "Transitive & Intransitive Verbs",
  "author": "Apprec8",
  "cards": [
    {
      "emoji": "🎯",
      "title": "Transitive verbs need an object",
      "text": "A transitive verb transfers its action to a receiver called the object. Ask 'What?' or 'Whom?' after the verb to find the object!",
      "examples": [
        "She kicked the ball. (Kicked what? → the ball)",
        "Aman baked a cake. (Baked what? → a cake)",
        "They met the teacher. (Met whom? → teacher)"
      ]
    },
    {
      "emoji": "🪁",
      "title": "Intransitive verbs fly solo",
      "text": "An intransitive verb makes complete sense all by itself. It does not pass its action onto any object.",
      "examples": [
        "The baby smiled sweetly.",
        "The dog barked loudly.",
        "He runs every morning.",
        "The birds sang."
      ]
    },
    {
      "emoji": "🧪",
      "title": "The 'What / Whom' test",
      "text": "To test any verb, ask 'What?' or 'Whom?' directly after it. If the sentence answers with an object, it is transitive. If it answers 'How?' or 'Where?', it is intransitive!",
      "examples": [
        "She bought a watch. (Bought what? → a watch = Transitive)",
        "She walked quickly. (Walked how? → quickly = Intransitive!)"
      ]
    },
    {
      "kind": "check",
      "question": "In 'Rohan scored a magnificent goal', what kind of verb is 'scored'?",
      "answer": "Transitive verb",
      "wrong": [
        "Intransitive verb",
        "Linking verb",
        "Helping verb"
      ],
      "explain": "'Scored what? → a goal'. Because it takes the object 'a goal', it is transitive."
    },
    {
      "kind": "check",
      "question": "Which sentence has an INTRANSITIVE verb that takes no object?",
      "answer": "The weary traveller slept soundly.",
      "wrong": [
        "The girl wrote a letter.",
        "Father painted the wooden fence.",
        "The boy caught the red ball."
      ],
      "explain": "'Slept soundly' has no object; 'soundly' is an adverb telling how he slept."
    }
  ],
  "content": "### 🎯 Transitive Verbs\nNeed an object to complete their meaning. Ask **\"Who?\"** or **\"What?\"** after the verb:\n- *She kicked the ball.* (Kicked what? → *the ball*)\n- *They built a treehouse.* (Built what? → *a treehouse*)\n\n### 🏃‍♂️ Intransitive Verbs\nMake complete sense on their own without an object:\n- *He runs fast.*\n- *The baby cried loudly.*"
},

  "eq-u1-verb-finite": {
  "name": "Finite & Non-Finite Verbs",
  "author": "Apprec8",
  "cards": [
    {
      "emoji": "💼",
      "title": "Finite verbs: the sentence boss",
      "text": "A finite verb changes its form according to the subject and the tense. It tells who is acting and when! Every complete sentence must have a finite verb.",
      "examples": [
        "She dances. (Present, singular)",
        "They dance. (Present, plural)",
        "She danced. (Past)",
        "I write / He writes"
      ]
    },
    {
      "emoji": "🌴",
      "title": "Non-finite verbs: never change",
      "text": "Non-finite verbs never change their form for tense or subject! They act as nouns, adjectives, or helpers, but cannot be the main engine alone.",
      "examples": [
        "Infinitive: to swim, to read",
        "Gerund (-ing noun): Swimming is fun.",
        "Participle: a broken toy, barking dogs"
      ]
    },
    {
      "emoji": "🎯",
      "title": "The test: change the time!",
      "text": "To spot which verb is finite, change the sentence into the past tense. The verb that changes is finite; the verb that stays identical is non-finite!",
      "examples": [
        "She wants to dance. → She wanted to dance.",
        "'Wants' changed to 'wanted' (Finite!)",
        "'to dance' stayed identical (Non-finite!)"
      ]
    },
    {
      "kind": "check",
      "question": "In 'Kavita loves to paint landscapes', which verb is the FINITE verb?",
      "answer": "loves",
      "wrong": [
        "to paint",
        "paint",
        "landscapes"
      ],
      "explain": "'Loves' changes with subject and tense (she loves / they love / she loved), making it finite."
    },
    {
      "kind": "check",
      "question": "What type of non-finite verb is 'singing' in: 'Singing brings her great joy.'?",
      "answer": "A gerund (verb-ing acting as a noun)",
      "wrong": [
        "A finite verb",
        "An infinitive",
        "A past participle"
      ],
      "explain": "A verb ending in -ing that acts as the subject noun of a sentence is a gerund."
    }
  ],
  "content": "### 💼 Finite Verbs\nChange form with the subject and tense. They are the main action heroes:\n- *She dances* (Present) → *She danced* (Past)\n\n### 🧘‍♂️ Non-Finite Verbs\nDo not change form with tense or subject:\n- **Infinitives:** *to eat, to play, to swim*\n- **Gerunds:** *swimming is fun, reading books*\n- **Participles:** *a broken vase, smiling faces*"
},

  "eq-u1-adj-intro": {
  "name": "Adjectives: Kinds & Uses",
  "author": "Apprec8",
  "cards": [
    {
      "emoji": "🎨",
      "title": "What is an adjective?",
      "text": "An adjective adds colour and detail to a noun or pronoun. It answers: What kind? How much? How many? Which one? or Whose?",
      "examples": [
        "a playful puppy (What kind?)",
        "three apples (How many?)",
        "some water (How much?)",
        "that kite (Which one?)"
      ]
    },
    {
      "emoji": "🍎",
      "title": "Quality vs Quantity vs Number",
      "text": "Adjectives of quality tell nature (sweet mango, brave girl). Quantity tells how much uncountable substance (much milk). Number tells exact counts or order (four chairs, first prize).",
      "examples": [
        "Quality: tall tree, honest boy",
        "Quantity: little sugar, enough time",
        "Number: two pencils, third place"
      ]
    },
    {
      "emoji": "☝️",
      "title": "Demonstrative & Possessive",
      "text": "Demonstrative adjectives point directly to nouns (this book, those trees). Possessive adjectives show who owns the noun (my desk, her pencil, our classroom).",
      "examples": [
        "this book / that cloud",
        "these grapes / those stars",
        "my bicycle / your notebook",
        "his dog / our home"
      ]
    },
    {
      "kind": "check",
      "question": "What kind of adjective is 'brave' in: 'The brave firefighter rescued the cat.'?",
      "answer": "Adjective of quality",
      "wrong": [
        "Adjective of quantity",
        "Adjective of number",
        "Demonstrative adjective"
      ],
      "explain": "'Brave' describes what kind of person the firefighter is, so it is an adjective of quality."
    },
    {
      "kind": "check",
      "question": "Which word in 'There are twelve students in the art room' is an adjective of number?",
      "answer": "twelve",
      "wrong": [
        "students",
        "art",
        "room"
      ],
      "explain": "'Twelve' tells the exact countable number of students."
    }
  ],
  "content": "### 📘 Kinds of Adjectives\n\n- **Quality:** Describing kind or nature (*beautiful, strong, brave*)\n- **Quantity:** How much uncountable thing (*some, enough, little*)\n- **Number:** How many or order (*two, first, several*)\n- **Demonstrative:** Pointing out which one (*this, that, these, those*)\n- **Possessive:** Showing ownership (*my, your, our, their*)\n- **Interrogative:** Asking questions (*which, what, whose*)"
},

  "eq-u1-adj-degrees": {
  "name": "Degrees of Adjectives",
  "author": "Apprec8",
  "cards": [
    {
      "emoji": "😊",
      "title": "Three degrees of comparison",
      "text": "Adjectives have three degrees: Positive describes one thing alone. Comparative compares two things. Superlative crowns the champion among three or more!",
      "examples": [
        "Positive: tall",
        "Comparative: taller",
        "Superlative: tallest",
        "fast → faster → fastest"
      ]
    },
    {
      "emoji": "📏",
      "title": "Short words: -ER and -EST",
      "text": "For short one-syllable adjectives, add -er for comparative and -est for superlative. If it ends in y, change y to i before adding!",
      "examples": [
        "small → smaller → smallest",
        "big → bigger → biggest",
        "happy → happier → happiest",
        "easy → easier → easiest"
      ]
    },
    {
      "emoji": "🌟",
      "title": "Long words: MORE and MOST",
      "text": "For long adjectives of two or more syllables, do not add -er! Place 'more' before the word for two things, and 'most' for three or more.",
      "examples": [
        "beautiful → more beautiful → most beautiful",
        "difficult → more difficult → most difficult",
        "careful → more careful → most careful"
      ]
    },
    {
      "emoji": "⚡",
      "title": "Irregular adjectives: special forms",
      "text": "Some everyday adjectives follow their own special rules. You must learn their three unique forms by heart!",
      "examples": [
        "good → better → best",
        "bad → worse → worst",
        "little → less → least",
        "much / many → more → most"
      ]
    },
    {
      "kind": "check",
      "question": "Which sentence uses the comparative degree correctly to compare two boys?",
      "answer": "Arjun is taller than his brother.",
      "wrong": [
        "Arjun is tallest than his brother.",
        "Arjun is more tall than his brother.",
        "Arjun is most tall than his brother."
      ],
      "explain": "When comparing two people with a short adjective, add -er: 'taller than'."
    },
    {
      "kind": "check",
      "question": "What is the superlative form of the irregular adjective 'bad'?",
      "answer": "worst",
      "wrong": [
        "baddest",
        "worse",
        "most bad"
      ],
      "explain": "The three forms are bad → worse (comparative) → worst (superlative)."
    }
  ],
  "content": "### 🏆 Degrees of Comparison\n\n- **Positive Degree:** Describes one thing with no comparison (*tall, kind*).\n- **Comparative Degree:** Compares two things; uses **-er** or **more** (*taller, more beautiful*).\n- **Superlative Degree:** Compares three or more; uses **-est** or **most** (*tallest, most beautiful*).\n\n### ⚡ Irregular Comparisons:\n- *good → better → best*\n- *bad → worse → worst*\n- *far → farther/further → farthest/furthest*\n- *little → less → least*\n- *many/much → more → most*"
},

  "eq-u1-prep-intro": {
  "name": "Prepositions: Place, Time & Direction",
  "author": "Apprec8",
  "cards": [
    {
      "emoji": "📍",
      "title": "What is a preposition?",
      "text": "A preposition links a noun to other words, showing location, time, or direction: where, when, or in what direction something happens!",
      "examples": [
        "The cat is under the table. (Place)",
        "We met after lunch. (Time)",
        "She walked towards the park. (Direction)"
      ]
    },
    {
      "emoji": "⏰",
      "title": "Time: IN, ON and AT",
      "text": "Use AT for exact clock times (at 5 PM, at noon). Use ON for specific days and dates (on Monday, on 15th August). Use IN for months, seasons, and years!",
      "examples": [
        "at 4 o'clock / at sunset",
        "on Sunday / on my birthday",
        "in July / in winter / in 2024"
      ]
    },
    {
      "emoji": "🏠",
      "title": "Place: IN, ON and AT",
      "text": "Use AT for a specific pinpoint spot (at the bus stop). Use ON for a surface (on the table). Use IN for an enclosed space or container!",
      "examples": [
        "at the front door",
        "on the classroom wall",
        "in the pencil box / in the room"
      ]
    },
    {
      "emoji": "🏊",
      "title": "Movement: INTO vs IN",
      "text": "'In' shows an object already resting inside. 'Into' shows movement from the outside going in: 'She jumped into the cool swimming pool!'",
      "examples": [
        "The frog is in the pond. (Resting inside)",
        "The frog jumped into the pond! (Moving in)",
        "Walk into the classroom."
      ]
    },
    {
      "kind": "check",
      "question": "Which preposition correctly fills the time blank: 'The school bell rings ___ 8:00 AM.'?",
      "answer": "at",
      "wrong": [
        "on",
        "in",
        "to"
      ],
      "explain": "Use 'at' with specific clock times: 'at 8:00 AM'."
    },
    {
      "kind": "check",
      "question": "Choose the correct preposition: 'The diver plunged deep ___ the ocean.'",
      "answer": "into",
      "wrong": [
        "in",
        "on",
        "at"
      ],
      "explain": "When action shows movement from outside to inside, use 'into'."
    }
  ],
  "content": "### 📍 Prepositions\n\nA **preposition** shows the relationship of place, time, or direction between a noun and other words.\n\n- **Place:** in, on, under, above, behind, between\n- **Time:** at 5 PM, on Monday, in July, since morning, until sunset\n- **Direction:** into, towards, through, over, out of\n\n> 💡 **Trick:** \"Anywhere a mouse can go, a preposition can show!\""
},

  "eq-u1-prep-fixed": {
  "name": "Fixed Prepositions",
  "author": "Apprec8",
  "cards": [
    {
      "emoji": "🤝",
      "title": "Best friend partnerships!",
      "text": "A fixed preposition always follows a particular word. They are fixed teams that native speakers use together—you cannot swap them for other words!",
      "examples": [
        "good AT drawing (NOT good in)",
        "afraid OF spiders (NOT afraid with)",
        "interested IN astronomy (NOT interested for)"
      ]
    },
    {
      "emoji": "👂",
      "title": "Common verb + preposition teams",
      "text": "Listen always pairs with TO. Depend pairs with ON. Apologise pairs with FOR. Laugh pairs with AT. Practice speaking them in complete sentences!",
      "examples": [
        "listen TO your teacher",
        "depend ON your parents",
        "apologise FOR the mistake",
        "laugh AT a funny joke"
      ]
    },
    {
      "emoji": "🎯",
      "title": "Feelings and skills",
      "text": "When describing skills, say 'good at' or 'clever at'. For feelings towards people, say 'angry with' or 'pleased with' someone.",
      "examples": [
        "good at cricket",
        "interested in painting",
        "angry with someone",
        "proud of your sister"
      ]
    },
    {
      "kind": "check",
      "question": "Which preposition correctly completes: 'Meera is exceptionally good ___ playing the violin.'?",
      "answer": "at",
      "wrong": [
        "in",
        "with",
        "on"
      ],
      "explain": "In English, we say 'good at' an activity or skill: 'good at playing'."
    },
    {
      "kind": "check",
      "question": "Which sentence uses the correct fixed preposition partnership?",
      "answer": "The kitten is afraid of barking dogs.",
      "wrong": [
        "The kitten is afraid with barking dogs.",
        "The kitten is afraid from barking dogs.",
        "The kitten is afraid to barking dogs."
      ],
      "explain": "'Afraid' always pairs with 'of': 'afraid of'."
    }
  ],
  "content": "### 🤝 Fixed Prepositions\nA fixed preposition always pairs with a specific verb, adjective, or noun. They are like best friends:\n\n- **interested in** painting\n- **good at** drawing\n- **afraid of** spiders\n- **angry with** someone\n- **listen to** the teacher\n- **depend on** parents\n- **apologise for** a mistake"
},

  "eq-u1-conj-intro": {
  "name": "Conjunctions: Joining Words",
  "author": "Apprec8",
  "cards": [
    {
      "emoji": "🔤",
      "title": "What is a conjunction?",
      "text": "A conjunction is a sentence bridge that links words, phrases, or full thoughts together smoothly, turning short choppy sentences into rich flowing language.",
      "examples": [
        "apples AND oranges (Words)",
        "in the morning OR in the evening (Phrases)",
        "I was tired, BUT I finished reading. (Clauses)"
      ]
    },
    {
      "emoji": "⛵",
      "title": "Coordinating: FANBOYS",
      "text": "Coordinating conjunctions connect parts of equal importance: For, And, Nor, But, Or, Yet, So. Use 'and' for additions, 'but' for contrasts, and 'or' for choices.",
      "examples": [
        "I like tea and biscuits.",
        "The bag was small but heavy.",
        "Do you want juice or water?",
        "It was hot, so we swam."
      ]
    },
    {
      "emoji": "🔗",
      "title": "Subordinating & Correlative",
      "text": "Subordinating words show reasons and time: because, although, when, while. Correlative conjunctions work in matched pairs: either…or, neither…nor, both…and.",
      "examples": [
        "We stayed inside because it rained.",
        "Call me when you reach.",
        "Either tea or coffee is fine.",
        "Both Sam and Joe came."
      ]
    },
    {
      "kind": "check",
      "question": "Which conjunction connects contrasting ideas in: 'She was exhausted, ___ she finished her drawing.'?",
      "answer": "but",
      "wrong": [
        "and",
        "so",
        "or"
      ],
      "explain": "'But' shows a contrast between being exhausted and still finishing the task."
    },
    {
      "kind": "check",
      "question": "Which conjunction correctly gives a reason: 'He wore a raincoat ___ it was pouring.'?",
      "answer": "because",
      "wrong": [
        "or",
        "so",
        "but"
      ],
      "explain": "'Because' explains the reason why he wore a raincoat."
    }
  ],
  "content": "### 🔤 Conjunctions\n\nConjunctions are words used to join words, phrases, or clauses.\n\n- **Coordinating (FANBOYS):** for, and, nor, but, or, yet, so\n- **Subordinating:** because, although, if, when, since, while\n- **Correlative Pairs:** either…or, neither…nor, both…and, not only…but also\n\n> 💡 **Comma Rule:** Use a comma before a conjunction if it connects two complete independent sentences!"
},

};

// ---------- Quizzes (new, V2 format) ----------
export const quizzes = {
  // Unit 0, Branch A
  "eq-u0-sentence-or-not": [
    q("Which of these is a complete sentence?", "The bird is singing.", [["The bird.", "incomplete-thought"], ["Singing in the tree.", "missing-subject"], ["The bird on the branch.", "missing-verb"]], "'The bird is singing.' tells a complete idea: who (the bird) and what it does (is singing)."),
    q("Which of these is NOT a sentence?", "under the big table", [["The cat is under the table.", "incomplete-thought"], ["I can see the cat.", "incomplete-thought"], ["Look under the table.", "incomplete-thought"]], "'under the big table' does not tell us who or what does anything. It is only a group of words."),
    q("What is missing in this group of words? 'Plays football every evening.'", "Who plays (the subject)", [["The action (the verb)", "subject-predicate-mixup"], ["A question mark", "wrong-end-mark"], ["Nothing is missing", "missing-subject"]], "We don't know WHO plays football. Add a subject: 'Aman plays football every evening.'"),
    q("What is missing here? 'My little sister ___ a picture.'", "A verb (an action word)", [["A subject", "subject-predicate-mixup"], ["A capital letter", "missing-capital"], ["Nothing is missing", "missing-verb"]], "We need an action word like 'drew' or 'is painting' to make it a sentence."),
    q("Which group of words tells a complete idea?", "We went to the zoo on Sunday.", [["On Sunday at the zoo.", "missing-verb"], ["Went to the zoo.", "missing-subject"], ["We and the zoo.", "missing-verb"]], "It tells who (we), what we did (went to the zoo) and when (on Sunday)."),
    q("Pick the correctly written sentence.", "The sun is very hot today.", [["the sun is very hot today.", "missing-capital"], ["The sun is very hot today", "wrong-end-mark"], ["the sun is very hot today", "missing-capital"]], "A sentence starts with a capital letter and ends with an end mark like a full stop."),
    q("'Because it was raining.' Is this a sentence?", "No, the idea is not complete.", [["Yes, it has a full stop.", "incomplete-thought"], ["Yes, it has a verb.", "incomplete-thought"], ["Yes, it starts with a capital letter.", "incomplete-thought"]], "It makes us ask: what happened because it was raining? A full stop alone does not make a sentence."),
    q("Which word can complete the sentence? 'The baby ___.'", "laughed", [["happy", "missing-verb"], ["cradle", "missing-verb"], ["small", "missing-verb"]], "'laughed' is a verb (an action). 'The baby laughed.' is a complete sentence."),
  ],
  // Unit 0, Branch A (harder)
  "eq-u0-subject-predicate": [
    q("Find the SUBJECT: 'The tall boy won the race.'", "The tall boy", [["won the race", "subject-predicate-mixup"], ["race", "subject-predicate-mixup"], ["won", "subject-predicate-mixup"]], "Ask 'Who won the race?' → The tall boy. That is the subject."),
    q("Find the PREDICATE: 'Birds fly south in winter.'", "fly south in winter", [["Birds", "subject-predicate-mixup"], ["Birds fly", "subject-predicate-mixup"], ["winter", "subject-predicate-mixup"]], "The predicate tells what the subject does: fly south in winter."),
    q("Find the SUBJECT: 'Every morning, my mother makes tea.'", "my mother", [["Every morning", "subject-predicate-mixup"], ["makes tea", "subject-predicate-mixup"], ["tea", "subject-predicate-mixup"]], "Who makes tea? My mother. 'Every morning' only tells us when."),
    q("Which sentence has 'The old lighthouse' as its subject?", "The old lighthouse stands near the sea.", [["We visited the old lighthouse.", "subject-predicate-mixup"], ["Near the sea is the old lighthouse keeper.", "subject-predicate-mixup"], ["They painted the old lighthouse.", "subject-predicate-mixup"]], "In 'The old lighthouse stands near the sea', the lighthouse is the one doing the action (standing)."),
    q("Find the SUBJECT: 'Under the bridge lived a troll.'", "a troll", [["the bridge", "subject-predicate-mixup"], ["Under the bridge", "subject-predicate-mixup"], ["lived", "subject-predicate-mixup"]], "Who lived under the bridge? A troll. The subject can sometimes come after the verb!"),
    q("What is the subject of a command like 'Sit down.'?", "you (hidden)", [["down", "subject-predicate-mixup"], ["Sit", "subject-predicate-mixup"], ["There is no subject", "missing-subject"]], "In commands the subject 'you' is hidden: (You) sit down."),
    q("Find the PREDICATE: 'The children in the park are flying kites.'", "are flying kites", [["The children", "subject-predicate-mixup"], ["in the park", "subject-predicate-mixup"], ["The children in the park", "subject-predicate-mixup"]], "The subject is 'The children in the park'. What are they doing? 'are flying kites' is the predicate."),
    q("Which part is the SUBJECT: 'Reading storybooks is my favourite hobby.'", "Reading storybooks", [["my favourite hobby", "subject-predicate-mixup"], ["is", "subject-predicate-mixup"], ["storybooks", "subject-predicate-mixup"]], "What is my favourite hobby? Reading storybooks. A subject can be an activity too!"),
  ],
  // Unit 0, Branch B
  "eq-u0-four-kinds": [
    q("What kind of sentence is this? 'Please shut the window.'", "Command or request", [["Question", "sentence-kind-mixup"], ["Exclamation", "sentence-kind-mixup"], ["Statement", "sentence-kind-mixup"]], "It asks someone to do something, so it is a command (a polite request)."),
    q("What kind of sentence is this? 'Mumbai is a big city.'", "Statement", [["Question", "sentence-kind-mixup"], ["Command", "sentence-kind-mixup"], ["Exclamation", "sentence-kind-mixup"]], "It simply tells us a fact, so it is a statement."),
    q("What kind of sentence is this? 'What a lovely garden this is!'", "Exclamation", [["Question", "sentence-kind-mixup"], ["Statement", "sentence-kind-mixup"], ["Command", "sentence-kind-mixup"]], "'What a…!' shows a strong feeling, so it is an exclamation, even though it starts with 'What'."),
    q("Which sentence is a QUESTION?", "Have you finished your homework?", [["Finish your homework.", "sentence-kind-mixup"], ["I have finished my homework.", "sentence-kind-mixup"], ["Hurray, I finished my homework!", "sentence-kind-mixup"]], "It asks something and ends with a question mark."),
    q("Choose the correct end mark: 'How fast the cheetah runs'", "!", [["?", "wrong-end-mark"], [".", "wrong-end-mark"], [",", "wrong-end-mark"]], "'How fast…' here shows surprise, so it ends with an exclamation mark."),
    q("Choose the correct end mark: 'Where is my pencil box'", "?", [["!", "wrong-end-mark"], [".", "wrong-end-mark"], [",", "wrong-end-mark"]], "It asks a question, so it needs a question mark."),
    q("Which sentence is a COMMAND?", "Wash your hands before lunch.", [["Did you wash your hands?", "sentence-kind-mixup"], ["I washed my hands.", "sentence-kind-mixup"], ["My hands are so clean!", "sentence-kind-mixup"]], "It tells someone to do something."),
    q("'I wonder where the cat went.' What kind of sentence is this?", "Statement", [["Question", "sentence-kind-mixup"], ["Command", "sentence-kind-mixup"], ["Exclamation", "sentence-kind-mixup"]], "Tricky! It talks about a question but does not ask one. It tells us what I wonder, so it is a statement with a full stop."),
  ],
  // Unit 0, Branch B (harder)
  "eq-u0-capitals-endmarks": [
    q("Which sentence is written correctly?", "Ravi and I went to Delhi.", [["ravi and I went to Delhi.", "missing-capital"], ["Ravi and i went to Delhi.", "missing-capital"], ["Ravi and I went to delhi.", "missing-capital"]], "Start with a capital letter. Names (Ravi, Delhi) and the word 'I' always take capitals."),
    q("Which sentence is written correctly?", "Can we play after school?", [["Can we play after school.", "wrong-end-mark"], ["can we play after school?", "missing-capital"], ["Can we play after school!", "wrong-end-mark"]], "It is a question, so it begins with a capital letter and ends with '?'."),
    q("Which words need a capital letter? 'my friend lives in pune.'", "my and pune", [["friend and lives", "missing-capital"], ["only pune", "missing-capital"], ["only my", "missing-capital"]], "The first word of a sentence and names of places need capital letters: 'My friend lives in Pune.'"),
    q("Choose the correctly written exclamation.", "Wow, we won the match!", [["wow, we won the match!", "missing-capital"], ["Wow, we won the match?", "wrong-end-mark"], ["Wow, we won the match", "wrong-end-mark"]], "Capital letter at the start and '!' for a strong feeling."),
    q("Which day name is written correctly in this sentence?", "We have music class on Monday.", [["We have music class on monday.", "missing-capital"], ["We have Music Class on monday.", "missing-capital"], ["we have music class on Monday.", "missing-capital"]], "Days of the week always start with a capital letter: Monday."),
    q("How many capital letters are missing? 'on sunday, aisha visited the taj mahal.'", "5", [["2", "missing-capital"], ["3", "missing-capital"], ["4", "missing-capital"]], "On, Sunday, Aisha, Taj, Mahal. Five words need capitals!"),
    q("Which is the best end mark? 'Please lend me your eraser'", ".", [["?", "wrong-end-mark"], ["!", "wrong-end-mark"], [",", "wrong-end-mark"]], "A polite request is a command, so it ends with a full stop."),
    q("Which sentence uses end marks correctly?", "Is it raining? Take your umbrella.", [["Is it raining. Take your umbrella?", "wrong-end-mark"], ["Is it raining! Take your umbrella?", "wrong-end-mark"], ["Is it raining, take your umbrella", "wrong-end-mark"]], "The first sentence asks (?), the second tells someone to do something (.)."),
  ],
  // Unit 0 test
  "eq-u0-test": [
    q("Which of these is a complete sentence?", "The train left on time.", [["The train on time.", "missing-verb"], ["Left on time.", "missing-subject"], ["Because the train left.", "incomplete-thought"]], "It has a subject (The train) and a predicate (left on time)."),
    q("Find the subject: 'A group of monkeys climbed the tree.'", "A group of monkeys", [["the tree", "subject-predicate-mixup"], ["climbed the tree", "subject-predicate-mixup"], ["monkeys climbed", "subject-predicate-mixup"]], "Who climbed the tree? A group of monkeys."),
    q("Find the predicate: 'The clever fox tricked the crow.'", "tricked the crow", [["The clever fox", "subject-predicate-mixup"], ["the crow", "subject-predicate-mixup"], ["clever fox", "subject-predicate-mixup"]], "What did the fox do? Tricked the crow."),
    q("What kind of sentence is this? 'Don't touch the hot pan.'", "Command", [["Statement", "sentence-kind-mixup"], ["Question", "sentence-kind-mixup"], ["Exclamation", "sentence-kind-mixup"]], "It tells someone not to do something, so it is a command."),
    q("What kind of sentence is this? 'How brave the soldiers were!'", "Exclamation", [["Question", "sentence-kind-mixup"], ["Statement", "sentence-kind-mixup"], ["Command", "sentence-kind-mixup"]], "It shows a strong feeling and ends with '!'."),
    q("Choose the correct end mark: 'Who painted this picture'", "?", [[".", "wrong-end-mark"], ["!", "wrong-end-mark"], [",", "wrong-end-mark"]], "'Who…' asks a question here."),
    q("Which sentence is written correctly?", "Meera's birthday is in June.", [["meera's birthday is in June.", "missing-capital"], ["Meera's birthday is in june.", "missing-capital"], ["Meera's Birthday Is In June", "wrong-end-mark"]], "Capitals for the first word and names (Meera, June), and a full stop at the end."),
    q("What is missing? 'The happy children ___ in the rain.'", "A verb", [["A subject", "subject-predicate-mixup"], ["A capital letter", "missing-capital"], ["Nothing", "missing-verb"]], "We need an action like 'danced' to complete the idea."),
    q("Which group of words is NOT a sentence?", "After the long holiday", [["The holiday was long.", "incomplete-thought"], ["We enjoyed the holiday.", "incomplete-thought"], ["Did you enjoy the holiday?", "incomplete-thought"]], "'After the long holiday' leaves us asking what happened. It is not a complete idea."),
    q("What is the hidden subject in 'Come here quickly.'?", "you", [["here", "subject-predicate-mixup"], ["quickly", "subject-predicate-mixup"], ["Come", "subject-predicate-mixup"]], "Commands have a hidden 'you': (You) come here quickly."),
  ],
  // Unit 1, Adverbs branch (new: old IEO adverb quiz is empty)
  "eq-u1-adverbs-quiz": [
    { subtopic: "kinds", ...q("Find the adverb: 'The old man walked slowly.'", "slowly", [["old", "pos-adjective-mixup"], ["walked", "pos-verb-mixup"], ["man", "pos-noun-mixup"]], "'slowly' tells HOW he walked.") },
    { subtopic: "kinds", ...q("Find the adverb: 'We will meet tomorrow.'", "tomorrow", [["meet", "pos-verb-mixup"], ["We", "pos-pronoun-mixup"], ["will", "pos-verb-mixup"]], "'tomorrow' tells WHEN we will meet.") },
    { subtopic: "kinds", ...q("Find the adverb: 'The kids are playing outside.'", "outside", [["kids", "pos-noun-mixup"], ["playing", "pos-verb-mixup"], ["are", "pos-verb-mixup"]], "'outside' tells WHERE they are playing.") },
    { subtopic: "adverb-adjective", ...q("Which word is an ADJECTIVE, not an adverb?", "friendly", [["quickly", "pos-adverb-mixup"], ["softly", "pos-adverb-mixup"], ["happily", "pos-adverb-mixup"]], "'friendly' ends in -ly but describes a noun: a friendly dog. So it is an adjective.") },
    { subtopic: "forming", ...q("Choose the adverb to fill the blank: 'She sang ___ at the concert.'", "beautifully", [["beautiful", "pos-adjective-mixup"], ["beauty", "pos-noun-mixup"], ["beautify", "pos-verb-mixup"]], "We need a word telling HOW she sang: beautifully.") },
    { subtopic: "adverb-adjective", ...q("In 'The water is very cold.', what does 'very' describe?", "cold (an adjective)", [["water (a noun)", "pos-noun-mixup"], ["is (a verb)", "pos-verb-mixup"], ["The (an article)", "pos-adverb-mixup"]], "'very' tells HOW cold the water is. Adverbs can describe adjectives too.") },
    { subtopic: "kinds", ...q("Which sentence has an adverb of frequency (how often)?", "Rohan always reads before bed.", [["Rohan reads a long book.", "pos-adverb-mixup"], ["Rohan reads in his room.", "pos-adverb-mixup"], ["Rohan is a good reader.", "pos-adverb-mixup"]], "'always' tells HOW OFTEN Rohan reads.") },
    { subtopic: "adverb-adjective", ...q("Pick the correct sentence.", "He answered the question correctly.", [["He answered the question correct.", "pos-adjective-mixup"], ["He answered the question correctness.", "pos-noun-mixup"], ["He answered correct the question.", "pos-adjective-mixup"]], "To describe HOW he answered (a verb), we need the adverb 'correctly'.") },
  ],
  // ---- Gate pools (Spec v2 Step 2): 15 questions each, every question tagged with a sub-topic ----
  "eq-u1-nouns-gate-pool": [
    { subtopic: "common-proper", ...q("Which is a PROPER noun? 'The children visited the Taj Mahal last summer.'", "Taj Mahal", [["children", "proper-common-mixup"], ["summer", "proper-common-mixup"], ["visited", "pos-verb-mixup"]], "'Taj Mahal' is the name of one special place, so it is a proper noun and starts with capital letters.") },
    { subtopic: "common-proper", ...q("Which sentence writes the proper noun correctly?", "My uncle lives in Kolkata.", [["My Uncle lives in kolkata.", "proper-common-mixup"], ["my uncle lives in Kolkata.", "missing-capital"], ["My uncle lives in kolkata.", "proper-common-mixup"]], "'Kolkata' is a proper noun (a city's name), so it needs a capital K. 'uncle' is a common noun here.") },
    { subtopic: "common-proper", ...q("Which word is a COMMON noun? 'Ravi gave his dog a bath on Sunday.'", "dog", [["Ravi", "proper-common-mixup"], ["Sunday", "proper-common-mixup"], ["gave", "pos-verb-mixup"]], "'dog' names any dog, not one special dog, so it is a common noun. Ravi and Sunday are proper nouns.") },
    { subtopic: "common-proper", ...q("In 'The Ganga is a holy river', which words are nouns?", "Ganga and river", [["holy and river", "pos-adjective-mixup"], ["is and river", "pos-verb-mixup"], ["Only Ganga", "proper-common-mixup"]], "'Ganga' is a proper noun and 'river' is a common noun. 'holy' is an adjective that describes the river.") },
    { subtopic: "singular-plural", ...q("What is the plural of 'child'?", "children", [["childs", "plural-rule-error"], ["childes", "plural-rule-error"], ["childrens", "plural-rule-error"]], "'child' has a special plural: children. 'childrens' is never correct.") },
    { subtopic: "singular-plural", ...q("Choose the correct plural: 'one leaf, two ___'", "leaves", [["leafs", "plural-rule-error"], ["leafes", "plural-rule-error"], ["leaf", "plural-rule-error"]], "Many words ending in -f change to -ves: leaf → leaves, wolf → wolves.") },
    { subtopic: "singular-plural", ...q("Which word stays the SAME in singular and plural?", "sheep", [["goose", "plural-rule-error"], ["mouse", "plural-rule-error"], ["tooth", "plural-rule-error"]], "One sheep, two sheep. The others change: geese, mice, teeth.") },
    { subtopic: "singular-plural", ...q("What is the plural of 'potato'?", "potatoes", [["potatos", "plural-rule-error"], ["potatoe", "plural-rule-error"], ["potatoies", "plural-rule-error"]], "Some words ending in -o add -es: potato → potatoes, tomato → tomatoes.") },
    { subtopic: "gender", ...q("What is the feminine of 'nephew'?", "niece", [["nephewess", "gender-error"], ["aunt", "gender-error"], ["cousin", "gender-error"]], "nephew (male) → niece (female). An aunt is the sister of your parent.") },
    { subtopic: "gender", ...q("What do we call a male duck?", "drake", [["duckling", "gender-error"], ["gander", "gender-error"], ["cob", "gender-error"]], "A male duck is a drake. A gander is a male goose, a cob is a male swan, and a duckling is a baby duck.") },
    { subtopic: "gender", ...q("Which noun is COMMON gender (it can be male or female)?", "teacher", [["king", "gender-error"], ["actress", "gender-error"], ["uncle", "gender-error"]], "A teacher can be a man or a woman. King and uncle are masculine; actress is feminine.") },
    { subtopic: "gender", ...q("Which pair (masculine – feminine) is correct?", "horse – mare", [["bull – mare", "gender-error"], ["cock – cow", "gender-error"], ["stag – duck", "gender-error"]], "horse – mare is correct. The others should be bull – cow, cock – hen, stag – doe.") },
    { subtopic: "advanced", ...q("Which word is an ABSTRACT noun?", "honesty", [["honest", "pos-adjective-mixup"], ["table", "abstract-concrete-mixup"], ["river", "abstract-concrete-mixup"]], "You can't see or touch honesty. It is an idea, so it is an abstract noun. 'honest' is the adjective.") },
    { subtopic: "advanced", ...q("Fill in the collective noun: 'A ___ of fish swam past the boat.'", "school", [["flock", "collective-noun-error"], ["herd", "collective-noun-error"], ["pack", "collective-noun-error"]], "A group of fish is a school (or shoal). Flock is for birds, herd for cattle, pack for wolves.") },
    { subtopic: "advanced", ...q("Which noun is UNCOUNTABLE?", "milk", [["bottle", "countable-uncountable-mixup"], ["apple", "countable-uncountable-mixup"], ["chair", "countable-uncountable-mixup"]], "We can't say 'two milks'. We say 'two glasses of milk'. Bottles, apples and chairs can be counted.") },
  ],
  "eq-u1-verbs-gate-pool": [
    { subtopic: "action-linking", ...q("Which word is a LINKING verb? 'The soup tastes delicious.'", "tastes", [["soup", "pos-noun-mixup"], ["delicious", "pos-adjective-mixup"], ["The", "action-linking-mixup"]], "'tastes' links the soup to how it is (delicious). It is not an action the soup does.") },
    { subtopic: "action-linking", ...q("In which sentence is 'smell' an ACTION verb?", "The dog smelled the bone.", [["The flowers smell sweet.", "action-linking-mixup"], ["This milk smells sour.", "action-linking-mixup"], ["The room smells fresh.", "action-linking-mixup"]], "The dog is doing the smelling, so it is an action. In the others, 'smell' links the subject to a describing word.") },
    { subtopic: "action-linking", ...q("Find the action verb: 'Meena quickly climbed the tall tree.'", "climbed", [["quickly", "pos-adverb-mixup"], ["tall", "pos-adjective-mixup"], ["tree", "pos-noun-mixup"]], "'climbed' is what Meena did. 'quickly' tells how, 'tall' describes the tree.") },
    { subtopic: "action-linking", ...q("Which sentence has a LINKING verb?", "My brother is a doctor.", [["My brother cooks dinner.", "action-linking-mixup"], ["My brother runs fast.", "action-linking-mixup"], ["My brother wrote a letter.", "action-linking-mixup"]], "'is' links 'my brother' to what he is (a doctor). The other verbs are actions.") },
    { subtopic: "action-linking", ...q("'She became a famous singer.' What kind of verb is 'became'?", "A linking verb", [["An action verb", "action-linking-mixup"], ["A helping verb", "action-linking-mixup"], ["It is not a verb", "pos-verb-mixup"]], "'became' links 'she' to 'a famous singer'. It shows a change of state, not an action.") },
    { subtopic: "transitive", ...q("Which sentence has a TRANSITIVE verb (a verb with an object)?", "Rahul kicked the ball.", [["The baby slept.", "transitive-intransitive-mixup"], ["Birds fly.", "transitive-intransitive-mixup"], ["The sun rises.", "transitive-intransitive-mixup"]], "Kicked what? The ball. The verb has an object, so it is transitive.") },
    { subtopic: "transitive", ...q("Which sentence has an INTRANSITIVE verb (no object)?", "The guests arrived late.", [["The guests ate the cake.", "transitive-intransitive-mixup"], ["The guests brought gifts.", "transitive-intransitive-mixup"], ["The guests thanked the host.", "transitive-intransitive-mixup"]], "Arrived what? Nothing. 'late' only tells when. So 'arrived' is intransitive.") },
    { subtopic: "transitive", ...q("Find the OBJECT of the verb: 'Grandma knitted a warm sweater.'", "a warm sweater", [["Grandma", "subject-predicate-mixup"], ["knitted", "pos-verb-mixup"], ["warm", "pos-adjective-mixup"]], "Knitted what? A warm sweater. That is the object. Grandma is the subject.") },
    { subtopic: "transitive", ...q("'The children laughed.' The verb 'laughed' is ___.", "intransitive", [["transitive", "transitive-intransitive-mixup"], ["a linking verb", "action-linking-mixup"], ["a helping verb", "transitive-intransitive-mixup"]], "Laughed what? There is no object, so the verb is intransitive.") },
    { subtopic: "transitive", ...q("In which sentence is 'ran' TRANSITIVE?", "She ran a small shop.", [["She ran to school.", "transitive-intransitive-mixup"], ["She ran very fast.", "transitive-intransitive-mixup"], ["She ran in the park.", "transitive-intransitive-mixup"]], "Ran what? A small shop. 'ran' has an object only in this sentence.") },
    { subtopic: "finite", ...q("Which verb is FINITE? 'He wants to swim in the lake.'", "wants", [["to swim", "finite-nonfinite-mixup"], ["lake", "pos-noun-mixup"], ["in", "pos-preposition-mixup"]], "'wants' changes with the subject (I want, he wants). 'to swim' never changes, so it is non-finite.") },
    { subtopic: "finite", ...q("Find the NON-FINITE verb: 'I enjoy reading comics.'", "reading", [["enjoy", "finite-nonfinite-mixup"], ["comics", "pos-noun-mixup"], ["I", "pos-pronoun-mixup"]], "'reading' is a gerund (verb + -ing used as a noun). It doesn't change with the subject, so it is non-finite.") },
    { subtopic: "finite", ...q("Choose the correct finite verb: 'My sister ___ the piano every evening.'", "plays", [["play", "sv-agreement"], ["playing", "finite-nonfinite-mixup"], ["to play", "finite-nonfinite-mixup"]], "A finite verb agrees with its subject: 'My sister plays'. 'playing' and 'to play' can't be the main verb alone.") },
    { subtopic: "finite", ...q("In 'We saw the kite flying high', which verb is FINITE?", "saw", [["flying", "finite-nonfinite-mixup"], ["kite", "pos-noun-mixup"], ["high", "pos-adverb-mixup"]], "'saw' is the main verb of the sentence. 'flying' is a participle (non-finite).") },
    { subtopic: "finite", ...q("Which group of words is NOT a complete sentence because it has no finite verb?", "Running in the rain.", [["She is running in the rain.", "finite-nonfinite-mixup"], ["They ran in the rain.", "finite-nonfinite-mixup"], ["He runs in the rain.", "finite-nonfinite-mixup"]], "'Running' alone is non-finite. A sentence needs a finite verb like 'is running', 'ran' or 'runs'.") },
  ],
  // ---- More gate pools (2026-11-01, drafted by Claude, waiting for the owner's / Pratha's accuracy review) ----
  "eq-u1-pronouns-gate-pool": [
    { subtopic: "personal-possessive", ...q("Fill in the blank: 'Riya and ___ went to the fair.'", "I", [["me", "pronoun-case-error"], ["myself", "reflexive-misuse"], ["mine", "possessive-misuse"]], "Take away 'Riya and': we say 'I went', not 'me went'. So: 'Riya and I went to the fair.'") },
    { subtopic: "personal-possessive", ...q("Fill in the blank: 'This book is ___. My name is written on it.'", "mine", [["my", "possessive-misuse"], ["me", "pronoun-case-error"], ["I", "pronoun-case-error"]], "'mine' stands alone and means 'belonging to me'. 'my' always needs a noun after it: my book.") },
    { subtopic: "personal-possessive", ...q("Fill in the blank: 'The teacher praised ___ for our hard work.'", "us", [["we", "pronoun-case-error"], ["our", "possessive-misuse"], ["ours", "possessive-misuse"]], "After the verb 'praised' we need an object pronoun: us.") },
    { subtopic: "personal-possessive", ...q("Which word is a possessive pronoun? 'The red kite is hers.'", "hers", [["red", "pos-adjective-mixup"], ["kite", "pos-noun-mixup"], ["is", "pos-verb-mixup"]], "'hers' tells us whom the kite belongs to, and it stands in place of 'her kite'.") },
    { subtopic: "personal-possessive", ...q("Fill in the blank: 'The dog wagged ___ tail.'", "its", [["it's", "its-its-mixup"], ["it", "pronoun-case-error"], ["their", "pronoun-number-error"]], "'its' (no apostrophe) means 'belonging to it'. 'it's' means 'it is'.") },
    { subtopic: "reflexive-demonstrative", ...q("Fill in the blank: 'He hurt ___ while playing cricket.'", "himself", [["hisself", "reflexive-misuse"], ["him", "pronoun-case-error"], ["themself", "reflexive-misuse"]], "The person who got hurt is the same person who did it, so we use the reflexive pronoun 'himself'. 'hisself' is not a word.") },
    { subtopic: "reflexive-demonstrative", ...q("Fill in the blank: 'We cleaned the room by ___.'", "ourselves", [["ourself", "reflexive-misuse"], ["us", "pronoun-case-error"], ["ourselfs", "reflexive-misuse"]], "For 'we', the reflexive pronoun is 'ourselves' (plural: -selves).") },
    { subtopic: "reflexive-demonstrative", ...q("Fill in the blank: '___ are my shoes, and those are yours.'", "These", [["This", "demonstrative-number-error"], ["That", "demonstrative-number-error"], ["Them", "pronoun-case-error"]], "'shoes' is plural and near me, so we use 'these'. 'This' is for one thing.") },
    { subtopic: "reflexive-demonstrative", ...q("Fill in the blank: '___ knocked on the door, but when I opened it, nobody was there.'", "Someone", [["Anyone", "indefinite-misuse"], ["Everyone", "indefinite-misuse"], ["Nobody", "indefinite-misuse"]], "One unknown person knocked, so we say 'someone'. 'Anyone', 'everyone' and 'nobody' don't fit this sentence.") },
    { subtopic: "reflexive-demonstrative", ...q("Which sentence uses a reflexive pronoun correctly?", "The cat licked itself.", [["She gave the book to myself.", "reflexive-misuse"], ["They enjoyed themself at the party.", "reflexive-misuse"], ["Myself went to school.", "reflexive-misuse"]], "A reflexive pronoun points back to the subject: the cat licked the cat, so 'itself'.") },
    { subtopic: "relative-interrogative", ...q("Fill in the blank: 'The boy ___ won the race is my cousin.'", "who", [["which", "relative-misuse"], ["whom", "relative-misuse"], ["whose", "relative-misuse"]], "We use 'who' for people when they do the action (the boy won).") },
    { subtopic: "relative-interrogative", ...q("Fill in the blank: 'This is the pen ___ I bought yesterday.'", "which", [["who", "relative-misuse"], ["whose", "relative-misuse"], ["whom", "relative-misuse"]], "We use 'which' (or 'that') for things. 'who' and 'whom' are for people.") },
    { subtopic: "relative-interrogative", ...q("Fill in the blank: '___ bag is this?'", "Whose", [["Who's", "whose-whos-mixup"], ["Who", "relative-misuse"], ["Whom", "relative-misuse"]], "'Whose' asks who something belongs to. 'Who's' means 'who is'.") },
    { subtopic: "relative-interrogative", ...q("Fill in the blank: '___ of these two dresses do you like?'", "Which", [["What", "interrogative-misuse"], ["Who", "interrogative-misuse"], ["Whose", "interrogative-misuse"]], "We use 'which' to choose from a small set of things: which of these two.") },
    { subtopic: "relative-interrogative", ...q("Fill in the blank: 'I met a girl ___ father is a pilot.'", "whose", [["who", "relative-misuse"], ["which", "relative-misuse"], ["whom", "relative-misuse"]], "'whose' shows that something belongs to someone: the girl's father.") },
  ],
  "eq-u1-adjectives-gate-pool": [
    { subtopic: "identify", ...q("Find the adjective: 'The playful puppy chased the ball.'", "playful", [["puppy", "pos-noun-mixup"], ["chased", "pos-verb-mixup"], ["ball", "pos-noun-mixup"]], "'playful' describes the puppy (a noun), so it is an adjective.") },
    { subtopic: "identify", ...q("Find the adjective: 'We saw a huge elephant at the zoo.'", "huge", [["saw", "pos-verb-mixup"], ["elephant", "pos-noun-mixup"], ["zoo", "pos-noun-mixup"]], "'huge' tells us what the elephant is like.") },
    { subtopic: "identify", ...q("Which word describes the noun? 'Grandma wore a beautiful saree.'", "beautiful", [["Grandma", "pos-noun-mixup"], ["wore", "pos-verb-mixup"], ["saree", "pos-noun-mixup"]], "'beautiful' describes the saree.") },
    { subtopic: "identify", ...q("In 'The sky looks cloudy today', which word is an adjective?", "cloudy", [["sky", "pos-noun-mixup"], ["looks", "pos-verb-mixup"], ["today", "pos-adverb-mixup"]], "'cloudy' describes the sky. 'looks' links the sky to how it is.") },
    { subtopic: "identify", ...q("Which sentence has TWO adjectives?", "A tall, thin man opened the door.", [["A man opened the door.", "adjective-count"], ["The man quickly opened the door.", "pos-adverb-mixup"], ["The man opened the old door.", "adjective-count"]], "'tall' and 'thin' both describe the man. 'quickly' is an adverb.") },
    { subtopic: "kinds", ...q("What kind of adjective is 'five' in 'She has five pencils'?", "Adjective of number", [["Adjective of quality", "adjective-kind-mixup"], ["Demonstrative adjective", "adjective-kind-mixup"], ["Adjective of quantity", "adjective-kind-mixup"]], "'five' tells HOW MANY pencils, so it is an adjective of number.") },
    { subtopic: "kinds", ...q("What kind of adjective is 'some' in 'Please add some sugar'?", "Adjective of quantity", [["Adjective of number", "adjective-kind-mixup"], ["Adjective of quality", "adjective-kind-mixup"], ["Demonstrative adjective", "adjective-kind-mixup"]], "Sugar can't be counted, so 'some' tells HOW MUCH: an adjective of quantity.") },
    { subtopic: "kinds", ...q("Find the demonstrative adjective: 'Those mangoes are sweet.'", "Those", [["mangoes", "pos-noun-mixup"], ["are", "pos-verb-mixup"], ["sweet", "adjective-kind-mixup"]], "'Those' points out which mangoes. 'sweet' is an adjective of quality.") },
    { subtopic: "kinds", ...q("Which word is an adjective of quality?", "brave", [["three", "adjective-kind-mixup"], ["much", "adjective-kind-mixup"], ["these", "adjective-kind-mixup"]], "'brave' tells what kind (quality). 'three' is number, 'much' is quantity, 'these' is demonstrative.") },
    { subtopic: "kinds", ...q("Fill in the blank: 'There isn't ___ milk in the jug.'", "much", [["many", "countable-uncountable-mixup"], ["a few", "countable-uncountable-mixup"], ["several", "countable-uncountable-mixup"]], "Milk can't be counted, so we use 'much'. 'many', 'a few' and 'several' are for things we can count.") },
    { subtopic: "degrees", ...q("Fill in the blank: 'Rohan is ___ than his brother.'", "taller", [["tall", "degree-form-error"], ["tallest", "degree-form-error"], ["more taller", "double-comparative"]], "Comparing two people → comparative: taller than. Never 'more taller'.") },
    { subtopic: "degrees", ...q("Fill in the blank: 'This is the ___ day of the year.'", "hottest", [["hotter", "degree-form-error"], ["hotest", "spelling-error"], ["most hot", "degree-form-error"]], "Comparing with all days → superlative. hot → hottest (double the t).") },
    { subtopic: "degrees", ...q("Choose the correct sentence.", "This puzzle is more difficult than that one.", [["This puzzle is difficulter than that one.", "degree-form-error"], ["This puzzle is most difficult than that one.", "degree-form-error"], ["This puzzle is more difficulter than that one.", "double-comparative"]], "Long adjectives use 'more' for the comparative: more difficult than.") },
    { subtopic: "degrees", ...q("What is the superlative of 'good'?", "best", [["goodest", "degree-form-error"], ["better", "degree-form-error"], ["most good", "degree-form-error"]], "good → better → best. It's a special (irregular) adjective.") },
    { subtopic: "degrees", ...q("Fill in the blank: 'Mount Everest is ___ mountain in the world.'", "the highest", [["higher", "degree-form-error"], ["the higher", "degree-form-error"], ["highest", "article-missing"]], "Comparing with all mountains → superlative, and superlatives take 'the': the highest.") },
  ],
  "eq-u1-adverbs-gate-pool": [
    { subtopic: "kinds", ...q("Which word tells WHEN? 'We will visit Grandpa tomorrow.'", "tomorrow", [["visit", "pos-verb-mixup"], ["Grandpa", "pos-noun-mixup"], ["will", "pos-verb-mixup"]], "'tomorrow' tells WHEN we will visit: an adverb of time.") },
    { subtopic: "kinds", ...q("Which word tells WHERE? 'The cat is hiding upstairs.'", "upstairs", [["cat", "pos-noun-mixup"], ["hiding", "pos-verb-mixup"], ["is", "pos-verb-mixup"]], "'upstairs' tells WHERE the cat is hiding: an adverb of place.") },
    { subtopic: "kinds", ...q("Which word tells HOW? 'She whispered softly to the baby.'", "softly", [["whispered", "pos-verb-mixup"], ["baby", "pos-noun-mixup"], ["to", "pos-preposition-mixup"]], "'softly' tells HOW she whispered: an adverb of manner.") },
    { subtopic: "kinds", ...q("Which word tells HOW OFTEN? 'He rarely eats sweets.'", "rarely", [["He", "pos-pronoun-mixup"], ["eats", "pos-verb-mixup"], ["sweets", "pos-noun-mixup"]], "'rarely' tells HOW OFTEN he eats sweets: an adverb of frequency.") },
    { subtopic: "kinds", ...q("Choose the adverb of time.", "yesterday", [["carefully", "adverb-kind-mixup"], ["here", "adverb-kind-mixup"], ["always", "adverb-kind-mixup"]], "'yesterday' tells WHEN. 'carefully' is manner, 'here' is place, 'always' is frequency.") },
    { subtopic: "adverb-adjective", ...q("Choose the correct word: 'Riya sings ___.'", "beautifully", [["beautiful", "pos-adjective-mixup"], ["beauty", "pos-noun-mixup"], ["beautify", "pos-verb-mixup"]], "We need a word that tells HOW she sings (a verb), so the adverb 'beautifully'.") },
    { subtopic: "adverb-adjective", ...q("Choose the correct word: 'The soup smells ___.'", "delicious", [["deliciously", "adverb-after-linking-verb"], ["deliciousness", "pos-noun-mixup"], ["delicacy", "pos-noun-mixup"]], "'smells' is a linking verb here: it describes the soup, so we use the adjective 'delicious'.") },
    { subtopic: "adverb-adjective", ...q("In 'He is a fast runner', 'fast' is ___.", "an adjective", [["an adverb", "pos-adverb-mixup"], ["a verb", "pos-verb-mixup"], ["a noun", "pos-noun-mixup"]], "Here 'fast' describes the runner (a noun), so it is an adjective.") },
    { subtopic: "adverb-adjective", ...q("In 'He runs fast', 'fast' is ___.", "an adverb", [["an adjective", "pos-adjective-mixup"], ["a verb", "pos-verb-mixup"], ["a noun", "pos-noun-mixup"]], "Here 'fast' tells HOW he runs (a verb), so it is an adverb. Same word, different job!") },
    { subtopic: "adverb-adjective", ...q("Choose the correct sentence.", "She did well in the test.", [["She did good in the test.", "pos-adjective-mixup"], ["She did goodly in the test.", "adverb-form-error"], ["She did bestly in the test.", "adverb-form-error"]], "To tell HOW she did, we need the adverb 'well'. 'good' is an adjective.") },
    { subtopic: "forming", ...q("Make an adverb from 'happy'.", "happily", [["happyly", "spelling-error"], ["happly", "spelling-error"], ["happiness", "pos-noun-mixup"]], "Consonant + y: change y to i and add -ly. happy → happily.") },
    { subtopic: "forming", ...q("Make an adverb from 'careful'.", "carefully", [["carefuly", "spelling-error"], ["careful", "pos-adjective-mixup"], ["carefulness", "pos-noun-mixup"]], "careful + ly = carefully (keep both l's).") },
    { subtopic: "forming", ...q("Make an adverb from 'gentle'.", "gently", [["gentlely", "spelling-error"], ["gentily", "spelling-error"], ["gentleness", "pos-noun-mixup"]], "Words ending in -le drop the e and add -y: gentle → gently.") },
    { subtopic: "forming", ...q("What is the adverb that goes with the adjective 'good'?", "well", [["goodily", "adverb-form-error"], ["better", "degree-form-error"], ["goodness", "pos-noun-mixup"]], "good (adjective) → well (adverb): a good singer sings well.") },
    { subtopic: "forming", ...q("Which word is NOT an adverb?", "friendly", [["quickly", "pos-adverb-mixup"], ["loudly", "pos-adverb-mixup"], ["sadly", "pos-adverb-mixup"]], "'friendly' ends in -ly but describes a noun (a friendly dog), so it is an adjective.") },
  ],
  "eq-u1-prepositions-gate-pool": [
    { subtopic: "place", ...q("Fill in the blank: 'My cousin lives ___ Mumbai.'", "in", [["at", "preposition-place-error"], ["on", "preposition-place-error"], ["into", "preposition-direction-error"]], "We use 'in' for cities and countries: in Mumbai, in India.") },
    { subtopic: "place", ...q("Fill in the blank: 'Meet me ___ the bus stop.'", "at", [["in", "preposition-place-error"], ["on", "preposition-place-error"], ["into", "preposition-direction-error"]], "We use 'at' for a particular point or spot: at the bus stop, at the door.") },
    { subtopic: "place", ...q("Fill in the blank: 'The fish are swimming ___ the pond.'", "in", [["on", "preposition-place-error"], ["at", "preposition-place-error"], ["between", "preposition-place-error"]], "The fish are inside the water, so we use 'in'.") },
    { subtopic: "place", ...q("Fill in the blank: 'The picture is hanging ___ the wall.'", "on", [["in", "preposition-place-error"], ["at", "preposition-place-error"], ["into", "preposition-direction-error"]], "The picture touches the surface of the wall, so we use 'on'.") },
    { subtopic: "time", ...q("Fill in the blank: 'School starts ___ 8 o'clock.'", "at", [["on", "preposition-time-error"], ["in", "preposition-time-error"], ["since", "since-for-mixup"]], "We use 'at' for clock times: at 8 o'clock, at noon.") },
    { subtopic: "time", ...q("Fill in the blank: 'My birthday is ___ Monday.'", "on", [["in", "preposition-time-error"], ["at", "preposition-time-error"], ["since", "since-for-mixup"]], "We use 'on' for days and dates: on Monday, on 5th June.") },
    { subtopic: "time", ...q("Fill in the blank: 'We go to the hills ___ May.'", "in", [["on", "preposition-time-error"], ["at", "preposition-time-error"], ["since", "since-for-mixup"]], "We use 'in' for months, years and seasons: in May, in 2025, in winter.") },
    { subtopic: "time", ...q("Fill in the blank: 'I have lived here ___ 2019.'", "since", [["for", "since-for-mixup"], ["on", "preposition-time-error"], ["at", "preposition-time-error"]], "'since' + a starting point in time (since 2019). 'for' + a length of time (for six years).") },
    { subtopic: "direction", ...q("Fill in the blank: 'Rahul walked ___ the room and sat down.'", "into", [["on", "preposition-direction-error"], ["at", "preposition-direction-error"], ["of", "preposition-direction-error"]], "'into' shows movement from outside to inside.") },
    { subtopic: "direction", ...q("Fill in the blank: 'The train goes ___ a long tunnel.'", "through", [["across", "preposition-direction-error"], ["on", "preposition-direction-error"], ["at", "preposition-direction-error"]], "'through' means in at one end and out at the other, like a tunnel.") },
    { subtopic: "direction", ...q("Fill in the blank: 'The children crossed carefully, walking ___ the road.'", "across", [["through", "preposition-direction-error"], ["in", "preposition-direction-error"], ["of", "preposition-direction-error"]], "'across' means from one side to the other side of something flat, like a road.") },
    { subtopic: "fixed", ...q("Fill in the blank: 'She is afraid ___ spiders.'", "of", [["from", "fixed-preposition-error"], ["with", "fixed-preposition-error"], ["by", "fixed-preposition-error"]], "We always say 'afraid of'. Some words go with fixed prepositions; learn them as pairs!") },
    { subtopic: "fixed", ...q("Fill in the blank: 'We are proud ___ our team.'", "of", [["on", "fixed-preposition-error"], ["for", "fixed-preposition-error"], ["with", "fixed-preposition-error"]], "The fixed pair is 'proud of'.") },
    { subtopic: "fixed", ...q("Fill in the blank: 'He is good ___ drawing.'", "at", [["in", "fixed-preposition-error"], ["on", "fixed-preposition-error"], ["with", "fixed-preposition-error"]], "The fixed pair is 'good at' (good at drawing, good at maths).") },
    { subtopic: "fixed", ...q("Fill in the blank: 'Please wait ___ me at the gate.'", "for", [["to", "fixed-preposition-error"], ["at", "fixed-preposition-error"], ["with", "fixed-preposition-error"]], "The fixed pair is 'wait for' someone.") },
  ],
  "eq-u1-conjunctions-gate-pool": [
    { subtopic: "coordinating", ...q("Fill in the blank: 'I wanted to play outside, ___ it was raining.'", "but", [["and", "conjunction-meaning-error"], ["so", "conjunction-meaning-error"], ["or", "conjunction-meaning-error"]], "The two ideas are opposite (wanted to play / it was raining), so we use 'but'.") },
    { subtopic: "coordinating", ...q("Fill in the blank: 'Would you like tea ___ coffee?'", "or", [["but", "conjunction-meaning-error"], ["so", "conjunction-meaning-error"], ["because", "conjunction-meaning-error"]], "We use 'or' to give a choice.") },
    { subtopic: "coordinating", ...q("Fill in the blank: 'Ravi was hungry, ___ he ate a sandwich.'", "so", [["but", "conjunction-meaning-error"], ["or", "conjunction-meaning-error"], ["although", "conjunction-meaning-error"]], "Being hungry is the reason, eating is the result, so we use 'so'.") },
    { subtopic: "coordinating", ...q("Fill in the blank: 'Meera ___ her brother went to the market together.'", "and", [["but", "conjunction-meaning-error"], ["so", "conjunction-meaning-error"], ["because", "conjunction-meaning-error"]], "We use 'and' to join two people who did the same thing.") },
    { subtopic: "coordinating", ...q("Which word is a conjunction? 'I like apples and bananas.'", "and", [["like", "pos-verb-mixup"], ["apples", "pos-noun-mixup"], ["I", "pos-pronoun-mixup"]], "'and' joins 'apples' and 'bananas', so it is a conjunction.") },
    { subtopic: "subordinating", ...q("Fill in the blank: 'We stayed indoors ___ it was very hot.'", "because", [["although", "conjunction-meaning-error"], ["unless", "conjunction-meaning-error"], ["or", "conjunction-meaning-error"]], "The heat is the reason we stayed indoors, so we use 'because'.") },
    { subtopic: "subordinating", ...q("Fill in the blank: '___ he was tired, he finished his homework.'", "Although", [["Because", "conjunction-meaning-error"], ["So", "conjunction-meaning-error"], ["Unless", "conjunction-meaning-error"]], "Being tired and still finishing are a surprise together, so we use 'although'.") },
    { subtopic: "subordinating", ...q("Fill in the blank: 'You will miss the bus ___ you hurry.'", "unless", [["if", "conjunction-meaning-error"], ["because", "conjunction-meaning-error"], ["and", "conjunction-meaning-error"]], "'unless' means 'if not': you will miss the bus if you do not hurry.") },
    { subtopic: "subordinating", ...q("Fill in the blank: 'Call me ___ you reach home.'", "when", [["although", "conjunction-meaning-error"], ["but", "conjunction-meaning-error"], ["or", "conjunction-meaning-error"]], "'when' tells the time something happens: call me at the time you reach home.") },
    { subtopic: "subordinating", ...q("Which sentence uses 'because' correctly?", "She smiled because she won the prize.", [["She won the prize because.", "incomplete-thought"], ["Because she smiled the prize.", "incomplete-thought"], ["She smiled because the prize.", "incomplete-thought"]], "After 'because' we need a full reason with a subject and a verb: she won the prize.") },
    { subtopic: "pairs", ...q("Fill in the blank: '___ Asha nor Tina came to the party.'", "Neither", [["Either", "correlative-pair-error"], ["Both", "correlative-pair-error"], ["Not only", "correlative-pair-error"]], "'nor' always pairs with 'neither': neither … nor.") },
    { subtopic: "pairs", ...q("Fill in the blank: 'You can have ___ the red one or the blue one.'", "either", [["neither", "correlative-pair-error"], ["both", "correlative-pair-error"], ["not only", "correlative-pair-error"]], "'or' pairs with 'either': either … or.") },
    { subtopic: "pairs", ...q("Fill in the blank: '___ my mother and my father are doctors.'", "Both", [["Either", "correlative-pair-error"], ["Neither", "correlative-pair-error"], ["Not only", "correlative-pair-error"]], "'and' pairs with 'both': both … and.") },
    { subtopic: "pairs", ...q("Fill in the blank: 'He is not only clever ___ hard-working.'", "but also", [["and also", "correlative-pair-error"], ["or", "correlative-pair-error"], ["nor", "correlative-pair-error"]], "'not only' pairs with 'but also'.") },
    { subtopic: "pairs", ...q("Fill in the blank: 'I don't know ___ he will come or not.'", "whether", [["either", "correlative-pair-error"], ["neither", "correlative-pair-error"], ["both", "correlative-pair-error"]], "We use 'whether … or not' when there are two possibilities.") },
  ],
  // Unit 1 test: mixed parts of speech
  "eq-u1-test": [
    q("Which word is a NOUN? 'The honest farmer found a golden coin.'", "farmer", [["honest", "pos-adjective-mixup"], ["found", "pos-verb-mixup"], ["golden", "pos-adjective-mixup"]], "'farmer' names a person, so it is a noun."),
    q("Which word is a PRONOUN? 'Asha lost her bag, but she found it later.'", "she", [["Asha", "pos-noun-mixup"], ["lost", "pos-verb-mixup"], ["later", "pos-adverb-mixup"]], "'she' takes the place of the noun Asha. ('her' and 'it' are pronouns too!)"),
    q("Which word is a VERB? 'The tiny bird built a nest quickly.'", "built", [["tiny", "pos-adjective-mixup"], ["nest", "pos-noun-mixup"], ["quickly", "pos-adverb-mixup"]], "'built' is the action."),
    q("Which word is an ADJECTIVE? 'We climbed a steep hill yesterday.'", "steep", [["climbed", "pos-verb-mixup"], ["hill", "pos-noun-mixup"], ["yesterday", "pos-adverb-mixup"]], "'steep' describes the hill (a noun)."),
    q("Which word is an ADVERB? 'The baby slept peacefully in the cradle.'", "peacefully", [["baby", "pos-noun-mixup"], ["slept", "pos-verb-mixup"], ["in", "pos-preposition-mixup"]], "'peacefully' tells HOW the baby slept."),
    q("Which word is a PREPOSITION? 'The keys are under the mat.'", "under", [["keys", "pos-noun-mixup"], ["are", "pos-verb-mixup"], ["mat", "pos-noun-mixup"]], "'under' shows where the keys are in relation to the mat."),
    q("Which word is a CONJUNCTION? 'I wanted to go out, but it was raining.'", "but", [["wanted", "pos-verb-mixup"], ["out", "pos-preposition-mixup"], ["raining", "pos-verb-mixup"]], "'but' joins two parts of the sentence."),
    q("What part of speech is 'happiness'?", "Noun", [["Adjective", "pos-adjective-mixup"], ["Verb", "pos-verb-mixup"], ["Adverb", "pos-adverb-mixup"]], "'happiness' is the name of a feeling, so it is an (abstract) noun. 'happy' is the adjective."),
    q("In 'She runs fast.', what part of speech is 'fast'?", "Adverb", [["Adjective", "pos-adjective-mixup"], ["Noun", "pos-noun-mixup"], ["Verb", "pos-verb-mixup"]], "Here 'fast' tells HOW she runs, so it is an adverb. In 'a fast car' it would be an adjective!"),
    q("Choose the word that is a verb in one sentence and a noun in the other: 'I ___ the ball.' / 'That was a good ___.'", "kick", [["happy", "pos-adjective-mixup"], ["slowly", "pos-adverb-mixup"], ["under", "pos-preposition-mixup"]], "'I kick the ball' (verb) and 'a good kick' (noun). The job of a word decides its part of speech."),
  ],
  // ---------- Unit 2: Articles & Determiners ----------
  // Practice quizzes (main + leaves) use ONE blank per question, so 🔊 "try each answer" reads well
  // in 20.0.24 too. Options are chosen so only one is ever correct (no "the" where it would also fit).
  // Unit 2, Branch A
  "eq-u2-a-an-quiz": [
    { subtopic: "vowel-sounds", ...q("Fill in the blank: 'I ate ___ apple for lunch.'", "an", [["a", "a-an-mixup"], ["many", "article-plural-error"], ["these", "determiner-number-mixup"]], "'apple' starts with a vowel sound (a), so we say AN apple.") },
    { subtopic: "vowel-sounds", ...q("Which word needs 'an' before it?", "egg", [["book", "a-an-mixup"], ["cat", "a-an-mixup"], ["tree", "a-an-mixup"]], "'egg' starts with a vowel sound, so it is AN egg. We say a book, a cat, a tree.") },
    { subtopic: "using-a-an", ...q("Choose the correct sentence.", "My uncle is an engineer.", [["My uncle is a engineer.", "a-an-mixup"], ["My uncle is engineer.", "article-missing"], ["My uncle is an engineers.", "article-plural-error"]], "One person's job needs a or an. 'engineer' starts with a vowel sound, so: an engineer.") },
    { subtopic: "tricky-sounds", ...q("Which word needs 'an' before it?", "hour", [["house", "sound-not-letter"], ["horse", "sound-not-letter"], ["hill", "sound-not-letter"]], "In 'hour' the h is silent, so it starts with the sound 'ow': AN hour. In house, horse and hill we say the h: a house.") },
    { subtopic: "tricky-sounds", ...q("Which word needs 'a' (not 'an') before it?", "uniform", [["umbrella", "a-an-mixup"], ["orange", "a-an-mixup"], ["eagle", "a-an-mixup"]], "'uniform' starts with the sound 'you', which is not a vowel sound: A uniform. The others take an.") },
    { subtopic: "vowel-sounds", ...q("Fill in the blank: 'There is ___ owl on the tree.'", "an", [["a", "a-an-mixup"], ["many", "article-plural-error"], ["those", "determiner-number-mixup"]], "'owl' starts with a vowel sound, so it is AN owl.") },
    { subtopic: "using-a-an", ...q("We use 'a' or 'an' before ___.", "one thing (a singular noun)", [["many things (plural nouns)", "article-plural-error"], ["names of people", "article-extra"], ["action words (verbs)", "pos-verb-mixup"]], "A and an mean 'one': a pen, an egg. Never 'a pens' or 'a Priya'.") },
    { subtopic: "vowel-sounds", ...q("Choose the correct one.", "an ice cream", [["a ice cream", "a-an-mixup"], ["an ice creams", "article-plural-error"], ["a ice creams", "article-plural-error"]], "'ice' starts with a vowel sound, so AN ice cream, and only ONE ice cream after an.") },
  ],
  // Unit 2, Branch A practice (hard): tricky sounds
  "eq-u2-a-an-tricky": [
    q("Which is correct?", "an honest boy", [["a honest boy", "sound-not-letter"], ["an horse", "sound-not-letter"], ["a hour", "sound-not-letter"]], "In 'honest' and 'hour' the h is silent, so they take AN. In 'horse' we say the h, so it is A horse."),
    q("Fill in the blank: 'My cousin studies at ___ university in Pune.'", "a", [["an", "sound-not-letter"], ["many", "article-plural-error"], ["these", "determiner-number-mixup"]], "'university' starts with the sound 'you', so we say A university, even though it starts with the letter u."),
    q("Which word needs 'an' before it?", "MLA", [["unicorn", "sound-not-letter"], ["European", "sound-not-letter"], ["one-day match", "sound-not-letter"]], "We say MLA as 'em-el-ay'. It starts with a vowel sound (e), so AN MLA. Unicorn and European start with 'you', and one starts with 'wun': a unicorn, a European, a one-day match."),
    q("Fill in the blank: 'We waited for ___ hour.'", "an", [["a", "sound-not-letter"], ["many", "article-plural-error"], ["these", "determiner-number-mixup"]], "The h in 'hour' is silent. It starts with the sound 'ow', so: AN hour."),
    q("Which is correct?", "a one-rupee coin", [["an one-rupee coin", "sound-not-letter"], ["a one-rupee coins", "article-plural-error"], ["an one-rupee coins", "article-plural-error"]], "'one' starts with the sound 'wun', not a vowel sound, so: A one-rupee coin."),
    q("Why do we say 'an hour' but 'a house'?", "The h in 'hour' is silent, so it starts with a vowel sound.", [["'Hour' is a longer word.", "sound-not-letter"], ["'House' is a plural word.", "article-plural-error"], ["Both can take a or an.", "sound-not-letter"]], "We listen to the first SOUND. 'hour' sounds like 'our' (vowel sound → an). In 'house' we hear the h (→ a)."),
    q("Which word needs 'a' (not 'an') before it?", "European", [["elephant", "a-an-mixup"], ["idea", "a-an-mixup"], ["ostrich", "a-an-mixup"]], "'European' starts with the sound 'you', so it is A European. Elephant, idea and ostrich start with vowel sounds: an."),
    q("Fill in the blank: 'He is ___ honest man.'", "an", [["a", "sound-not-letter"], ["many", "article-plural-error"], ["these", "determiner-number-mixup"]], "The h in 'honest' is silent, so it starts with the sound 'o': AN honest man."),
  ],
  // Unit 2, Branch A gate pool (assessment: never in practice)
  "eq-u2-a-an-gate-pool": [
    { subtopic: "vowel-sounds", ...q("Which word needs 'an' before it?", "orange", [["mango", "a-an-mixup"], ["banana", "a-an-mixup"], ["guava", "a-an-mixup"]], "'orange' starts with a vowel sound, so it is AN orange. The others start with other sounds: a mango.") },
    { subtopic: "vowel-sounds", ...q("Fill in the blanks: 'I saw ___ ant and ___ bee.'", "an, a", [["a, an", "a-an-mixup"], ["an, an", "a-an-mixup"], ["a, a", "a-an-mixup"]], "'ant' starts with a vowel sound (an ant). 'bee' does not (a bee).") },
    { subtopic: "vowel-sounds", ...q("Choose the correct one.", "an elephant", [["a elephant", "a-an-mixup"], ["an elephants", "article-plural-error"], ["a elephants", "article-plural-error"]], "'elephant' starts with a vowel sound: AN elephant, and only one elephant after an.") },
    { subtopic: "vowel-sounds", ...q("Which word needs 'a' before it?", "kite", [["igloo", "a-an-mixup"], ["engine", "a-an-mixup"], ["arrow", "a-an-mixup"]], "'kite' starts with a k sound, so A kite. Igloo, engine and arrow start with vowel sounds: an.") },
    { subtopic: "vowel-sounds", ...q("Fill in the blanks: 'Mum bought ___ umbrella and ___ raincoat.'", "an, a", [["a, an", "a-an-mixup"], ["an, an", "a-an-mixup"], ["a, a", "a-an-mixup"]], "AN umbrella (vowel sound u), A raincoat (r sound).") },
    { subtopic: "tricky-sounds", ...q("Which word needs 'an' before it?", "X-ray", [["yo-yo", "sound-not-letter"], ["zebra", "a-an-mixup"], ["unicorn", "sound-not-letter"]], "We say X as 'eks', which starts with a vowel sound: AN X-ray. A yo-yo, a zebra, a unicorn ('you' sound).") },
    { subtopic: "tricky-sounds", ...q("Choose the correct one.", "a uniform", [["an uniform", "sound-not-letter"], ["a uniforms", "article-plural-error"], ["an uniforms", "sound-not-letter"]], "'uniform' starts with the sound 'you', so A uniform.") },
    { subtopic: "tricky-sounds", ...q("Fill in the blanks: 'It took ___ hour to make ___ one-page poster.'", "an, a", [["a, an", "sound-not-letter"], ["an, an", "sound-not-letter"], ["a, a", "sound-not-letter"]], "AN hour (the h is silent). A one-page poster ('one' starts with the sound 'wun').") },
    { subtopic: "tricky-sounds", ...q("Which word needs 'a' (not 'an') before it?", "university", [["hour", "sound-not-letter"], ["owl", "a-an-mixup"], ["umbrella", "a-an-mixup"]], "'university' starts with the sound 'you': A university. An hour, an owl, an umbrella.") },
    { subtopic: "tricky-sounds", ...q("Choose the correct sentence.", "Grandpa is an honest man.", [["Grandpa is a honest man.", "sound-not-letter"], ["Grandpa is honest man.", "article-missing"], ["Grandpa is an honest men.", "article-plural-error"]], "The h in 'honest' is silent, so AN honest man.") },
    { subtopic: "using-a-an", ...q("Choose the correct sentence.", "My sister is a nurse.", [["My sister is nurse.", "article-missing"], ["My sister is an nurse.", "a-an-mixup"], ["My sister is a nurses.", "article-plural-error"]], "A job needs a or an before it: A nurse.") },
    { subtopic: "using-a-an", ...q("Find the mistake: 'I saw a elephant in a zoo.'", "'a elephant' should be 'an elephant'", [["'a zoo' should be 'an zoo'", "a-an-mixup"], ["'saw' should be 'see'", "tense-mixup"], ["There is no mistake.", "no-mistake-miss"]], "'elephant' starts with a vowel sound, so: I saw AN elephant in a zoo.") },
    { subtopic: "using-a-an", ...q("Which word can NOT have 'a' or 'an' before it?", "books", [["book", "article-plural-error"], ["apple", "article-plural-error"], ["pencil", "article-plural-error"]], "A and an mean 'one', so they never go before a plural like 'books'.") },
    { subtopic: "using-a-an", ...q("Choose the correct sentence.", "She has a cat and a parrot.", [["She has cat and parrot.", "article-missing"], ["She has a cat and an parrot.", "a-an-mixup"], ["She has an cat and a parrot.", "a-an-mixup"]], "Cat and parrot both start with consonant sounds: A cat and A parrot.") },
    { subtopic: "using-a-an", ...q("The words 'a' and 'an' mean ___.", "one (any one)", [["many", "article-plural-error"], ["the special one we both know", "a-the-mixup"], ["none", "article-missing"]], "A or an means any one: 'Give me a pen' means any one pen. 'The' is for the one we both know.") },
  ],
  // Unit 2, Branch B
  "eq-u2-the-quiz": [
    { subtopic: "known-one", ...q("Fill in the blank: '___ sun rises in the east.'", "The", [["A", "a-the-mixup"], ["An", "a-an-mixup"], ["Many", "article-plural-error"]], "There is only one sun, so we say THE sun.") },
    { subtopic: "known-one", ...q("Which pair of sentences talks about the SAME dog?", "I saw a dog. The dog was barking.", [["I saw a dog. A dog was barking.", "article-missing"], ["I saw the dog. A dog was barking.", "a-the-mixup"], ["I saw an dog. The dog was barking.", "a-an-mixup"]], "First time: A dog. After that we know which dog, so: THE dog.") },
    { subtopic: "special", ...q("Which name needs 'the' before it?", "Ganga", [["Delhi", "article-extra"], ["Priya", "article-extra"], ["Hindi", "article-extra"]], "Rivers take 'the': the Ganga. Cities, people and languages don't: Delhi, Priya, Hindi.") },
    { subtopic: "special", ...q("Choose the correct sentence.", "Mount Everest is the highest mountain in the world.", [["The Mount Everest is the highest mountain in the world.", "article-extra"], ["Mount Everest is highest mountain in the world.", "article-missing"], ["Mount Everest is a highest mountain in the world.", "a-the-mixup"]], "One mountain needs no article (Mount Everest), but a 'best' word like highest needs THE.") },
    { subtopic: "special", ...q("Which sentence is correct?", "We visited the Red Fort in Delhi.", [["We visited Red Fort in the Delhi.", "article-extra"], ["We visited the Red Fort in the Delhi.", "article-extra"], ["We visited a Red Fort in Delhi.", "a-the-mixup"]], "Famous buildings take 'the' (the Red Fort). City names don't (Delhi).") },
    { subtopic: "special", ...q("Fill in the blank: 'He was ___ first boy to finish the race.'", "the", [["a", "a-the-mixup"], ["an", "a-an-mixup"], ["some", "determiner-number-mixup"]], "Order words like first, second and last take THE: the first boy.") },
    { subtopic: "no-article", ...q("Where do we NOT use 'the'?", "Before names of people, like Priya", [["Before rivers, like Ganga", "the-rule-mixup"], ["Before the sun and the moon", "the-rule-mixup"], ["Before 'best' words, like best and tallest", "the-rule-mixup"]], "Names of people never take 'the'. Rivers, the sun and 'best' words do.") },
    { subtopic: "special", ...q("Fill in the blank: 'The Pacific is ___ largest ocean.'", "the", [["a", "a-the-mixup"], ["an", "a-an-mixup"], ["much", "countable-uncountable-mixup"]], "'largest' is a 'best' word (superlative), so it takes THE.") },
  ],
  // Unit 2, Branch B practice: no article
  "eq-u2-no-article": [
    q("Choose the correct sentence.", "We have lunch at noon.", [["We have the lunch at noon.", "article-extra"], ["We have an lunch at noon.", "a-an-mixup"], ["We have lunch at the noon.", "article-extra"]], "Meals (breakfast, lunch, dinner) usually need no article: We have lunch."),
    q("Fill in the blank: 'Rahul loves playing ___.'", "cricket", [["the cricket", "article-extra"], ["a cricket", "article-extra"], ["an cricket", "a-an-mixup"]], "Games need no article: play cricket, play chess."),
    q("Choose the correct sentence.", "Meera speaks Tamil and English.", [["Meera speaks the Tamil and English.", "article-extra"], ["Meera speaks a Tamil and English.", "article-extra"], ["Meera speaks the Tamil and the English.", "article-extra"]], "Languages need no article: Tamil, English, Hindi."),
    q("Which name needs 'the' before it?", "Indian Ocean", [["India", "article-extra"], ["Kerala", "article-extra"], ["Mumbai", "article-extra"]], "Oceans take 'the': the Indian Ocean. Most countries, states and cities don't."),
    q("Choose the correct sentence.", "Chennai is a big city in India.", [["The Chennai is a big city in India.", "article-extra"], ["Chennai is a big city in the India.", "article-extra"], ["Chennai is big city in India.", "article-missing"]], "City and country names need no article. But 'a big city' needs a, because it is one city."),
    q("Which one is correct?", "the USA", [["the India", "article-extra"], ["the Japan", "article-extra"], ["the China", "article-extra"]], "Most countries need no article (India, Japan, China). Names with 'States' or 'Kingdom' take the: the USA, the UK."),
    q("Choose the correct sentence.", "My favourite subject is Science.", [["My favourite subject is the Science.", "article-extra"], ["My favourite subject is a Science.", "article-extra"], ["My favourite subject is an Science.", "a-an-mixup"]], "School subjects need no article: Science, Maths, English."),
    q("Choose the correct sentence.", "The Himalayas are in the north of India.", [["Himalayas are in the north of India.", "article-missing"], ["The Himalayas are in the north of the India.", "article-extra"], ["The Himalayas are in a north of India.", "a-the-mixup"]], "A range of mountains takes THE (the Himalayas). India takes no article."),
  ],
  // Unit 2, Branch B gate pool
  "eq-u2-the-gate-pool": [
    { subtopic: "known-one", ...q("Fill in the blank: 'Look at ___ moon! It is so bright tonight.'", "the", [["a", "a-the-mixup"], ["an", "a-an-mixup"], ["many", "article-plural-error"]], "There is only one moon in our sky, so: THE moon.") },
    { subtopic: "known-one", ...q("Fill in the blanks so both sentences talk about the SAME cake: 'Mum baked ___ cake. ___ cake was delicious.'", "a, The", [["The, A", "a-the-mixup"], ["an, The", "a-an-mixup"], ["an, An", "a-an-mixup"]], "First time: A cake. Then we know which cake: THE cake.") },
    { subtopic: "known-one", ...q("Fill in the blank: 'Please close ___ door behind you.'", "the", [["an", "a-an-mixup"], ["many", "article-plural-error"], ["much", "countable-uncountable-mixup"]], "We both know which door (the one behind you), so: THE door.") },
    { subtopic: "known-one", ...q("Choose the correct sentence.", "The sky is full of stars tonight.", [["A sky is full of stars tonight.", "a-the-mixup"], ["Sky is full of stars tonight.", "article-missing"], ["An sky is full of stars tonight.", "a-an-mixup"]], "There is only one sky, so: THE sky.") },
    { subtopic: "known-one", ...q("Why do we say 'the sun'?", "There is only one sun that we all know.", [["'Sun' starts with a vowel sound.", "a-an-mixup"], ["'Sun' is a plural word.", "article-plural-error"], ["We use 'the' before every short word.", "the-rule-mixup"]], "We use THE when there is only one, or when we both know which one.") },
    { subtopic: "special", ...q("Which name needs 'the' before it?", "Arabian Sea", [["Goa", "article-extra"], ["Kavya", "article-extra"], ["Marathi", "article-extra"]], "Seas take 'the': the Arabian Sea. States, people and languages don't.") },
    { subtopic: "special", ...q("Fill in the blank: 'This is ___ best day of my life!'", "the", [["a", "a-the-mixup"], ["an", "a-an-mixup"], ["much", "countable-uncountable-mixup"]], "'best' is a superlative, so it takes THE: the best day.") },
    { subtopic: "special", ...q("Choose the correct sentence.", "The Brahmaputra is a long river.", [["Brahmaputra is a long river.", "article-missing"], ["A Brahmaputra is a long river.", "a-the-mixup"], ["The Brahmaputra is an long river.", "a-an-mixup"]], "Rivers take THE: the Brahmaputra. 'a long river' uses a, because 'long' starts with an l sound.") },
    { subtopic: "special", ...q("Which is correct?", "the Taj Mahal", [["a Taj Mahal", "a-the-mixup"], ["an Taj Mahal", "a-an-mixup"], ["the Taj Mahals", "article-plural-error"]], "Famous buildings take THE: the Taj Mahal, the Red Fort.") },
    { subtopic: "special", ...q("Fill in the blank: 'January is ___ first month of the year.'", "the", [["a", "a-the-mixup"], ["an", "a-an-mixup"], ["many", "article-plural-error"]], "Order words like first and last take THE: the first month.") },
    { subtopic: "no-article", ...q("Choose the correct sentence.", "We play chess after dinner.", [["We play the chess after dinner.", "article-extra"], ["We play a chess after dinner.", "article-extra"], ["We play chess after an dinner.", "a-an-mixup"]], "Games and meals need no article: play chess, after dinner.") },
    { subtopic: "no-article", ...q("Which name does NOT take 'the'?", "Kolkata", [["Himalayas", "article-extra"], ["Indian Ocean", "article-extra"], ["Red Fort", "article-extra"]], "Cities need no article: Kolkata. But the Himalayas, the Indian Ocean, the Red Fort.") },
    { subtopic: "no-article", ...q("Choose the correct sentence.", "Dr Kalam was a great scientist.", [["The Dr Kalam was a great scientist.", "article-extra"], ["Dr Kalam was great scientist.", "article-missing"], ["Dr Kalam was an great scientist.", "a-an-mixup"]], "Names of people take no article. But 'a great scientist' needs a: he was one scientist.") },
    { subtopic: "no-article", ...q("Choose the correct sentence.", "We eat breakfast at seven.", [["We eat the breakfast at seven.", "article-extra"], ["We eat an breakfast at seven.", "a-an-mixup"], ["We eat breakfast at the seven.", "article-extra"]], "Meals need no article: eat breakfast. Times need none either: at seven.") },
    { subtopic: "no-article", ...q("Which sentence is correct?", "My grandmother speaks Bengali.", [["My grandmother speaks the Bengali.", "article-extra"], ["My grandmother speaks a Bengali.", "article-extra"], ["My grandmother speaks an Bengali.", "a-an-mixup"]], "Languages need no article: speaks Bengali.") },
  ],
  // Unit 2, Branch C
  "eq-u2-determiners-quiz": [
    { subtopic: "this-that", ...q("Fill in the blank: '___ books in my hands are new.'", "These", [["This", "determiner-number-mixup"], ["That", "determiner-number-mixup"], ["A", "article-plural-error"]], "Many things (books) that are near (in my hands) → THESE.") },
    { subtopic: "this-that", ...q("Fill in the blank: 'Look at ___ bird on the far-away tree!'", "that", [["this", "near-far-mixup"], ["these", "determiner-number-mixup"], ["those", "determiner-number-mixup"]], "One thing (bird) that is far away → THAT.") },
    { subtopic: "this-that", ...q("Which is correct?", "these apples", [["this apples", "determiner-number-mixup"], ["that apples", "determiner-number-mixup"], ["these apple", "determiner-number-mixup"]], "'these' is for many things, so it goes with a plural: these apples.") },
    { subtopic: "some-any", ...q("Fill in the blank: 'I do not have ___ money.'", "any", [["some", "some-any-mixup"], ["many", "countable-uncountable-mixup"], ["a few", "countable-uncountable-mixup"]], "In 'not' sentences we use ANY: I do not have any money.") },
    { subtopic: "some-any", ...q("Fill in the blank: 'There are ___ mangoes in the basket.'", "some", [["any", "some-any-mixup"], ["much", "countable-uncountable-mixup"], ["a little", "countable-uncountable-mixup"]], "In a telling sentence we use SOME. Mangoes can be counted, so not much or a little.") },
    { subtopic: "quantity", ...q("Fill in the blank: 'How ___ students are in your class?'", "many", [["much", "countable-uncountable-mixup"], ["little", "countable-uncountable-mixup"], ["any", "some-any-mixup"]], "We can count students, so: how MANY.") },
    { subtopic: "quantity", ...q("Fill in the blank: 'Please add ___ salt to the dal.'", "a little", [["a few", "countable-uncountable-mixup"], ["many", "countable-uncountable-mixup"], ["these", "determiner-number-mixup"]], "We can't count salt, so: a LITTLE salt. 'A few' is for things we can count.") },
    { subtopic: "this-that", ...q("Which word is a determiner? 'Those children are playing.'", "Those", [["children", "pos-noun-mixup"], ["are", "pos-verb-mixup"], ["playing", "pos-verb-mixup"]], "'Those' comes before the noun 'children' and tells us WHICH children.") },
  ],
  // Unit 2, Branch C practice (hard): how much, how many
  "eq-u2-quantity": [
    q("Fill in the blank: 'There is not ___ water in the bottle.'", "much", [["many", "countable-uncountable-mixup"], ["a few", "countable-uncountable-mixup"], ["these", "determiner-number-mixup"]], "We can't count water, so: not MUCH water."),
    q("Fill in the blank: 'She has read ___ books this year.'", "many", [["much", "countable-uncountable-mixup"], ["a little", "countable-uncountable-mixup"], ["little", "countable-uncountable-mixup"]], "We can count books, so: MANY books."),
    q("Fill in the blank: 'I have ___ friends in my new school, so I am happy.'", "a few", [["few", "few-a-few-mixup"], ["a little", "countable-uncountable-mixup"], ["much", "countable-uncountable-mixup"]], "'a few' means 'some', which is a happy thing. 'few' means 'almost none'."),
    q("Fill in the blank: 'He has ___ friends, so he often feels lonely.'", "few", [["a few", "few-a-few-mixup"], ["a little", "countable-uncountable-mixup"], ["much", "countable-uncountable-mixup"]], "'few' (without 'a') means almost none. That is why he feels lonely."),
    q("Fill in the blank: 'There is ___ milk left, so we must buy more.'", "little", [["few", "countable-uncountable-mixup"], ["many", "countable-uncountable-mixup"], ["a few", "countable-uncountable-mixup"]], "Milk can't be counted, and there is almost none left: LITTLE milk."),
    q("Which word goes with 'sugar'?", "much", [["many", "countable-uncountable-mixup"], ["a few", "countable-uncountable-mixup"], ["these", "determiner-number-mixup"]], "We can't count sugar, so: much sugar (not many sugar)."),
    q("Choose the correct sentence.", "We need a little time and a few chairs.", [["We need a few time and a little chairs.", "countable-uncountable-mixup"], ["We need a little time and a little chairs.", "countable-uncountable-mixup"], ["We need a few time and a few chairs.", "countable-uncountable-mixup"]], "Time can't be counted (a little time). Chairs can (a few chairs)."),
    q("Fill in the blank: 'How ___ rice should I cook?'", "much", [["many", "countable-uncountable-mixup"], ["few", "countable-uncountable-mixup"], ["a few", "countable-uncountable-mixup"]], "We don't count rice grain by grain, we measure it. So: how MUCH rice."),
  ],
  // Unit 2, Branch C gate pool
  "eq-u2-determiners-gate-pool": [
    { subtopic: "this-that", ...q("Fill in the blank: 'Can you see ___ stars far up in the sky?'", "those", [["these", "near-far-mixup"], ["this", "determiner-number-mixup"], ["that", "determiner-number-mixup"]], "Many things (stars) that are far away → THOSE.") },
    { subtopic: "this-that", ...q("Fill in the blank: '___ pencil in my hand is broken.'", "This", [["These", "determiner-number-mixup"], ["Those", "determiner-number-mixup"], ["That", "near-far-mixup"]], "One thing that is near (in my hand) → THIS.") },
    { subtopic: "this-that", ...q("Which is correct?", "those shoes", [["that shoes", "determiner-number-mixup"], ["this shoes", "determiner-number-mixup"], ["those shoe", "determiner-number-mixup"]], "'those' is for many things, so it goes with a plural: those shoes.") },
    { subtopic: "this-that", ...q("Choose the correct sentence.", "These flowers in my garden smell lovely.", [["This flowers in my garden smell lovely.", "determiner-number-mixup"], ["That flowers in my garden smell lovely.", "determiner-number-mixup"], ["These flower in my garden smell lovely.", "determiner-number-mixup"]], "Many flowers → these flowers (plural noun after these).") },
    { subtopic: "this-that", ...q("We use 'that' for ___.", "one thing that is far away", [["many things that are near", "determiner-number-mixup"], ["one thing that is near", "near-far-mixup"], ["many things that are far away", "determiner-number-mixup"]], "this = one, near · that = one, far · these = many, near · those = many, far.") },
    { subtopic: "some-any", ...q("Fill in the blank: 'Is there ___ juice in the fridge?'", "any", [["many", "countable-uncountable-mixup"], ["a few", "countable-uncountable-mixup"], ["these", "determiner-number-mixup"]], "In questions we usually use ANY: Is there any juice?") },
    { subtopic: "some-any", ...q("Fill in the blank: 'We did not see ___ tigers at the park.'", "any", [["some", "some-any-mixup"], ["much", "countable-uncountable-mixup"], ["a little", "countable-uncountable-mixup"]], "In 'not' sentences we use ANY: We did not see any tigers.") },
    { subtopic: "some-any", ...q("Fill in the blank: 'Mum bought ___ bananas from the market.'", "some", [["any", "some-any-mixup"], ["much", "countable-uncountable-mixup"], ["a little", "countable-uncountable-mixup"]], "In telling sentences we use SOME: Mum bought some bananas.") },
    { subtopic: "some-any", ...q("Choose the correct sentence.", "I have some crayons, but I do not have any paper.", [["I have any crayons, but I do not have some paper.", "some-any-mixup"], ["I have some crayons, but I do not have some paper.", "some-any-mixup"], ["I have any crayons, but I do not have any paper.", "some-any-mixup"]], "Telling part → some crayons. 'Not' part → any paper.") },
    { subtopic: "some-any", ...q("Fill in the blank: 'Would you like ___ sweets?'", "some", [["much", "countable-uncountable-mixup"], ["a little", "countable-uncountable-mixup"], ["this", "determiner-number-mixup"]], "When we offer something, we say SOME: Would you like some sweets?") },
    { subtopic: "quantity", ...q("Fill in the blank: 'There are not ___ trees in the city now.'", "many", [["much", "countable-uncountable-mixup"], ["a little", "countable-uncountable-mixup"], ["little", "countable-uncountable-mixup"]], "We can count trees, so: not MANY trees.") },
    { subtopic: "quantity", ...q("Fill in the blank: 'Do not add too ___ sugar to the tea.'", "much", [["many", "countable-uncountable-mixup"], ["few", "countable-uncountable-mixup"], ["a few", "countable-uncountable-mixup"]], "We can't count sugar, so: too MUCH sugar.") },
    { subtopic: "quantity", ...q("Fill in the blank: 'I need ___ minutes to finish my drawing.'", "a few", [["a little", "countable-uncountable-mixup"], ["much", "countable-uncountable-mixup"], ["little", "countable-uncountable-mixup"]], "We can count minutes, so: A FEW minutes.") },
    { subtopic: "quantity", ...q("Which word goes with 'information'?", "much", [["many", "countable-uncountable-mixup"], ["a few", "countable-uncountable-mixup"], ["these", "determiner-number-mixup"]], "'information' can't be counted (never 'informations'), so: much information.") },
    { subtopic: "quantity", ...q("Fill in the blank: 'There is ___ hope of rain today. The sky is clear.'", "little", [["few", "countable-uncountable-mixup"], ["many", "countable-uncountable-mixup"], ["a few", "countable-uncountable-mixup"]], "Hope can't be counted, and there is almost none (the sky is clear): LITTLE hope.") },
  ],
  // Unit 2 test: articles + determiners mixed
  "eq-u2-test": [
    q("Fill in the blanks: 'I saw ___ owl and ___ crow.'", "an, a", [["a, an", "a-an-mixup"], ["an, an", "a-an-mixup"], ["a, a", "a-an-mixup"]], "AN owl (vowel sound), A crow (k sound)."),
    q("Which word needs 'an' before it?", "envelope", [["unicorn", "sound-not-letter"], ["horse", "sound-not-letter"], ["pencil", "a-an-mixup"]], "'envelope' starts with a vowel sound: AN envelope. A unicorn ('you' sound), a horse, a pencil."),
    q("Choose the correct sentence.", "She is an artist and a singer.", [["She is a artist and an singer.", "a-an-mixup"], ["She is artist and singer.", "article-missing"], ["She is an artist and an singer.", "a-an-mixup"]], "AN artist (vowel sound), A singer (s sound)."),
    q("Fill in the blank: '___ Narmada flows into the Arabian Sea.'", "The", [["A", "a-the-mixup"], ["An", "a-an-mixup"], ["Many", "article-plural-error"]], "Rivers take THE: the Narmada."),
    q("Choose the correct sentence.", "Riya speaks Hindi and plays cricket.", [["Riya speaks the Hindi and plays the cricket.", "article-extra"], ["Riya speaks Hindi and plays a cricket.", "article-extra"], ["Riya speaks a Hindi and plays cricket.", "article-extra"]], "Languages and games need no article."),
    q("Fill in the blank: 'This is ___ tallest tree in our village.'", "the", [["a", "a-the-mixup"], ["an", "a-an-mixup"], ["much", "countable-uncountable-mixup"]], "'tallest' is a superlative, so it takes THE."),
    q("Fill in the blank: '___ kites up in the sky are so colourful!'", "Those", [["This", "determiner-number-mixup"], ["That", "determiner-number-mixup"], ["An", "article-plural-error"]], "Many things (kites) that are far away (up in the sky) → THOSE."),
    q("Fill in the blank: 'There are not ___ chairs in the hall.'", "any", [["some", "some-any-mixup"], ["much", "countable-uncountable-mixup"], ["a little", "countable-uncountable-mixup"]], "In 'not' sentences we use ANY: not any chairs."),
    q("Fill in the blank: 'How ___ milk do you drink every day?'", "much", [["many", "countable-uncountable-mixup"], ["few", "countable-uncountable-mixup"], ["a few", "countable-uncountable-mixup"]], "We can't count milk, so: how MUCH milk."),
    q("Fill in the blank: 'I have ___ marbles. Do you want to play?'", "a few", [["a little", "countable-uncountable-mixup"], ["much", "countable-uncountable-mixup"], ["any", "some-any-mixup"]], "We can count marbles, and there are some to play with: A FEW marbles."),
    q("Which word is a determiner? 'We bought some oranges.'", "some", [["We", "pos-pronoun-mixup"], ["bought", "pos-verb-mixup"], ["oranges", "pos-noun-mixup"]], "'some' comes before the noun 'oranges' and tells HOW MANY."),
    q("Find the mistake: 'I have a umbrella and some books.'", "'a umbrella' should be 'an umbrella'", [["'some books' should be 'any books'", "some-any-mixup"], ["'have' should be 'has'", "subject-verb-mixup"], ["There is no mistake.", "no-mistake-miss"]], "'umbrella' starts with a vowel sound: AN umbrella. 'some books' is right in a telling sentence."),
  ],
};

// ---------- Reading passages (new, stored in studyContent with kind: "reading") ----------
// evidence.text must be an exact sentence (or part) of paragraphs[evidence.paragraph].
// Mistake tags for reading: detail-missed, not-in-passage, word-meaning, opposite-meaning,
// statement-check, sequence, inference (+ the pos-* tags for grammar tie-ins).
export const readings = {
  "eq-read-paper-boat": {
    name: "Tara's Paper Boat",
    author: "Apprec8",
    mode: "stepByStep",
    glossary: {
      puddles: "small pools of water on the ground",
      stream: "a small, narrow flow of water",
      bravely: "without being afraid",
    },
    paragraphs: [
      "It rained all night in Tara's village. In the morning, the lane outside her house was full of puddles. Tara found an old newspaper and folded it carefully into a small boat.",
      "She placed the boat in a stream of rainwater running beside the road. The boat wobbled at first, but then it floated bravely along. Tara ran beside it, laughing.",
      "Suddenly, the boat reached a big puddle and began to sink. Tara felt sad for a moment. Then she smiled, ran home, and folded a stronger boat from thicker paper.",
    ],
    questions: [
      { afterParagraph: 0, ...q("What did Tara use to make her boat?", "An old newspaper", [["A plastic bag", "not-in-passage"], ["A green leaf", "not-in-passage"], ["Thick cardboard", "detail-missed"]], "The story says: 'Tara found an old newspaper and folded it carefully into a small boat.'"), evidence: { paragraph: 0, text: "Tara found an old newspaper and folded it carefully into a small boat." } },
      { afterParagraph: 1, ...q("What does 'wobbled' mean in the story?", "Moved unsteadily from side to side", [["Sank quickly", "word-meaning"], ["Flew up into the air", "word-meaning"], ["Stopped completely", "word-meaning"]], "The boat wobbled 'at first, but then it floated'. So it was shaky before it became steady."), evidence: { paragraph: 1, text: "The boat wobbled at first, but then it floated bravely along." } },
      { afterParagraph: 2, ...q("What did Tara do after her boat sank?", "She made a stronger boat", [["She cried all day", "opposite-meaning"], ["She stopped playing", "inference"], ["She asked a friend for help", "not-in-passage"]], "She felt sad only 'for a moment'. Then she 'folded a stronger boat from thicker paper'."), evidence: { paragraph: 2, text: "Then she smiled, ran home, and folded a stronger boat from thicker paper." } },
      { afterParagraph: 2, ...q("What does the story tell us about Tara?", "She does not give up easily", [["She is afraid of the rain", "inference"], ["She does not like boats", "inference"], ["She gets angry quickly", "inference"]], "When her boat sank, she didn't quit. She made a better one. That shows she doesn't give up."), evidence: { paragraph: 2, text: "Then she smiled, ran home, and folded a stronger boat from thicker paper." } },
    ],
  },
  "eq-read-seed-library": {
    name: "The Seed Library",
    author: "Apprec8",
    mode: "fullPassage",
    glossary: {
      varieties: "different kinds of something",
      retired: "no longer working, usually because of age",
      courtyard: "an open space surrounded by walls or buildings",
      volunteers: "people who help without being paid",
    },
    paragraphs: [
      "In a small town near the hills, there is an unusual library. It does not lend books. Instead, it lends seeds! The library was started by Mrs. Kamala Iyer, a retired science teacher, who noticed that many old varieties of vegetables were slowly disappearing from local farms.",
      "The idea is simple. A visitor borrows a packet of seeds, such as tomato, brinjal or bitter gourd, and plants them at home. When the plants grow and produce fruit, the visitor saves some of the new seeds and returns them to the library. In this way, the collection grows larger every season.",
      "Children are the library's most enthusiastic members. Every Saturday, they gather in the courtyard to sort seeds, write labels and draw pictures of the plants. Mrs. Iyer believes that a child who grows even one plant will respect farmers for the rest of their life.",
      "However, running the library is not always easy. Some seeds are returned damp, and damp seeds can rot. So the volunteers now teach every borrower to dry seeds in the shade for a week before bringing them back.",
      "Today, the seed library has more than two hundred members. Neighbouring villages have also started asking how they can build one of their own.",
    ],
    questions: [
      { ...q("Why did Mrs. Iyer start the seed library?", "Old varieties of vegetables were disappearing from farms.", [["She wanted to sell seeds to farmers.", "not-in-passage"], ["The town had no book library.", "not-in-passage"], ["The children asked her to start it.", "detail-missed"]], "Paragraph 1 says she 'noticed that many old varieties of vegetables were slowly disappearing from local farms'."), evidence: { paragraph: 0, text: "who noticed that many old varieties of vegetables were slowly disappearing from local farms." } },
      { ...q("Select the INCORRECT statement according to the passage.", "The library lends both books and seeds.", [["Borrowers return some new seeds to the library.", "statement-check"], ["Children sort seeds and write labels on Saturdays.", "statement-check"], ["Damp seeds can rot.", "statement-check"]], "The passage clearly says: 'It does not lend books.' The other three statements are true."), evidence: { paragraph: 0, text: "It does not lend books." } },
      { ...q("Statement I: Seeds should be dried in direct sunlight before they are returned.\nStatement II: The seed library has more than two hundred members.", "Statement I is incorrect but Statement II is correct.", [["Statement I is correct but Statement II is incorrect.", "statement-check"], ["Both the statements are correct.", "statement-check"], ["Both the statements are incorrect.", "statement-check"]], "Seeds are dried 'in the shade', not in direct sunlight, so Statement I is wrong. Statement II matches the last paragraph."), evidence: { paragraph: 3, text: "So the volunteers now teach every borrower to dry seeds in the shade for a week before bringing them back." } },
      { ...q("The word 'enthusiastic' in the passage is closest in meaning to ___.", "eager and excited", [["tired and bored", "opposite-meaning"], ["quiet and shy", "word-meaning"], ["angry and upset", "word-meaning"]], "The children gather every Saturday to sort, label and draw. They are eager and excited to help."), evidence: { paragraph: 2, text: "Children are the library's most enthusiastic members." } },
      { ...q("Put these steps in the correct order:\n(1) The visitor saves some new seeds.\n(2) The visitor borrows a packet of seeds.\n(3) The seeds are returned to the library.\n(4) The plants grow and produce fruit.", "2, 4, 1, 3", [["1, 2, 3, 4", "sequence"], ["2, 1, 4, 3", "sequence"], ["4, 2, 1, 3", "sequence"]], "Borrow (2) → plants grow (4) → save seeds (1) → return them (3)."), evidence: { paragraph: 1, text: "When the plants grow and produce fruit, the visitor saves some of the new seeds and returns them to the library." } },
      { ...q("What does Mrs. Iyer believe growing a plant teaches a child?", "To respect farmers", [["To become a scientist", "inference"], ["To sell vegetables", "not-in-passage"], ["To read more books", "not-in-passage"]], "She believes a child who grows even one plant 'will respect farmers for the rest of their life'."), evidence: { paragraph: 2, text: "Mrs. Iyer believes that a child who grows even one plant will respect farmers for the rest of their life." } },
      { ...q("In the sentence 'Neighbouring villages have also started asking...', what part of speech is 'villages'?", "Noun", [["Verb", "pos-verb-mixup"], ["Adjective", "pos-adjective-mixup"], ["Adverb", "pos-adverb-mixup"]], "'villages' names places, so it is a noun. ('Neighbouring' describes them, so it is an adjective.)"), evidence: { paragraph: 4, text: "Neighbouring villages have also started asking how they can build one of their own." } },
    ],
  },
  "eq-read-rooftop-garden": {
    name: "The Rooftop Garden",
    author: "Apprec8",
    mode: "fullPassage",
    glossary: {
      shoots: "new young parts of a plant that just came out of the soil",
      swayed: "moved slowly from side to side",
      term: "one part of the school year",
      patience: "being able to wait calmly without getting upset",
    },
    paragraphs: [
      "The students of Class 6 at Green Valley School had a problem. Their school was in the middle of a busy city, and there was no space for a garden. One morning, their teacher, Mr. Joseph, pointed to the flat roof above the library and smiled. \"Why not grow a garden up there?\" he asked.",
      "The children collected old buckets, broken pots and empty paint tins. They filled them with soil and planted seeds of tomato, spinach and marigold. Every day, a few students climbed the stairs with watering cans before the first bell rang.",
      "For the first two weeks, nothing happened. Some children wanted to give up. Then, one Monday, Aisha noticed tiny green shoots peeping out of the soil. She ran downstairs shouting the good news, and soon the whole class was on the roof.",
      "By the end of the term, the roof was full of colour. Bright orange marigolds swayed in the wind, and the spinach was used in the school kitchen. Even the butterflies seemed to enjoy the new garden.",
      "Mr. Joseph says the best thing the garden grew was not a vegetable. It was patience.",
    ],
    questions: [
      { ...q("Why couldn't the school have a garden at first?", "There was no space in the busy city.", [["The teacher did not like plants.", "not-in-passage"], ["The children had no seeds.", "not-in-passage"], ["The library was too small.", "detail-missed"]], "Paragraph 1 says the school was 'in the middle of a busy city, and there was no space for a garden'."), evidence: { paragraph: 0, text: "Their school was in the middle of a busy city, and there was no space for a garden." } },
      { ...q("What did the children use as pots?", "Old buckets, broken pots and empty paint tins", [["New plastic pots from a shop", "not-in-passage"], ["Clay pots made by Mr. Joseph", "not-in-passage"], ["Old shoes and boxes", "not-in-passage"]], "The passage says: 'The children collected old buckets, broken pots and empty paint tins.'"), evidence: { paragraph: 1, text: "The children collected old buckets, broken pots and empty paint tins." } },
      { ...q("Select the INCORRECT statement according to the passage.", "The seeds came up on the very first day.", [["Some children wanted to give up.", "statement-check"], ["The spinach was used in the school kitchen.", "statement-check"], ["Students watered the plants before the first bell.", "statement-check"]], "The passage says: 'For the first two weeks, nothing happened.' So the seeds did not come up on the first day. The other three statements are true."), evidence: { paragraph: 2, text: "For the first two weeks, nothing happened." } },
      { ...q("The word 'patience' in the passage is closest in meaning to ___.", "waiting calmly without giving up", [["growing vegetables quickly", "word-meaning"], ["being in a hurry", "opposite-meaning"], ["working alone", "word-meaning"]], "The children waited two weeks before anything grew. Waiting calmly like that is patience."), evidence: { paragraph: 4, text: "It was patience." } },
      { ...q("In 'a few students climbed the stairs', what does 'a few' tell us?", "How many students", [["What the students did", "pos-verb-mixup"], ["Where the students went", "pos-adverb-mixup"], ["Which school it was", "detail-missed"]], "'a few' is a determiner. It comes before the noun 'students' and tells HOW MANY."), evidence: { paragraph: 1, text: "Every day, a few students climbed the stairs with watering cans before the first bell rang." } },
      { ...q("What does the last paragraph tell us?", "Waiting for the plants taught the children to be patient.", [["The garden grew only one vegetable.", "inference"], ["Mr. Joseph did not like the garden.", "inference"], ["The children sold the vegetables.", "not-in-passage"]], "The garden's 'best' result was not a vegetable: the children learned patience while they waited."), evidence: { paragraph: 4, text: "Mr. Joseph says the best thing the garden grew was not a vegetable." } },
    ],
  },
};

// ---------- Word tables for generated practice (Spec v2 Step 4) ----------
// Stored as studyContent docs with kind "wordTable". CONTENT ACCURACY FIRST:
// - plural: only words where every generated wrong option is clearly wrong. Left out on purpose:
//   unchanged plurals (sheep, deer, fish), person (peoples), belief (believes), roof (rooves).
// - nounGender: each masculine and each feminine appears ONCE (no "mare" for both horse and stallion).
export const wordTables = {
  "eq-wt-plural": {
    name: "Plural nouns",
    tableType: "plural",
    entries: [
      // add -s
      { singular: "book", plural: "books" }, { singular: "pen", plural: "pens" }, { singular: "cat", plural: "cats" },
      { singular: "tree", plural: "trees" }, { singular: "girl", plural: "girls" }, { singular: "apple", plural: "apples" },
      { singular: "chair", plural: "chairs" }, { singular: "river", plural: "rivers" }, { singular: "kite", plural: "kites" },
      { singular: "flower", plural: "flowers" },
      // add -es (s, ss, sh, ch, x)
      { singular: "box", plural: "boxes" }, { singular: "bus", plural: "buses", alsoCorrect: ["busses"] },
      { singular: "class", plural: "classes" }, { singular: "dish", plural: "dishes" }, { singular: "brush", plural: "brushes" },
      { singular: "bench", plural: "benches" }, { singular: "watch", plural: "watches" }, { singular: "fox", plural: "foxes" },
      { singular: "glass", plural: "glasses" }, { singular: "church", plural: "churches" }, { singular: "peach", plural: "peaches" },
      // -o
      { singular: "potato", plural: "potatoes" }, { singular: "tomato", plural: "tomatoes" }, { singular: "hero", plural: "heroes" },
      { singular: "echo", plural: "echoes" }, { singular: "piano", plural: "pianos" }, { singular: "photo", plural: "photos" },
      { singular: "radio", plural: "radios" }, { singular: "kangaroo", plural: "kangaroos" },
      // consonant + y → ies
      { singular: "baby", plural: "babies" }, { singular: "city", plural: "cities" }, { singular: "lady", plural: "ladies" },
      { singular: "story", plural: "stories" }, { singular: "party", plural: "parties" }, { singular: "butterfly", plural: "butterflies" },
      { singular: "family", plural: "families" }, { singular: "country", plural: "countries" },
      // vowel + y → add -s
      { singular: "boy", plural: "boys" }, { singular: "key", plural: "keys" }, { singular: "day", plural: "days" },
      { singular: "toy", plural: "toys" }, { singular: "monkey", plural: "monkeys" }, { singular: "donkey", plural: "donkeys" },
      // -f / -fe → -ves
      { singular: "leaf", plural: "leaves" }, { singular: "wolf", plural: "wolves" }, { singular: "knife", plural: "knives" },
      { singular: "wife", plural: "wives" }, { singular: "life", plural: "lives" }, { singular: "half", plural: "halves" },
      { singular: "loaf", plural: "loaves" }, { singular: "shelf", plural: "shelves" }, { singular: "thief", plural: "thieves" },
      { singular: "calf", plural: "calves" }, { singular: "scarf", plural: "scarves", alsoCorrect: ["scarfs"] },
      { singular: "hoof", plural: "hooves", alsoCorrect: ["hoofs"] },
      // -f that just adds -s
      { singular: "chief", plural: "chiefs" }, { singular: "cliff", plural: "cliffs" }, { singular: "giraffe", plural: "giraffes" },
      // special plurals
      { singular: "child", plural: "children" }, { singular: "man", plural: "men" }, { singular: "woman", plural: "women" },
      { singular: "tooth", plural: "teeth" }, { singular: "foot", plural: "feet" }, { singular: "goose", plural: "geese" },
      { singular: "mouse", plural: "mice" }, { singular: "ox", plural: "oxen" },
    ],
  },
  "eq-wt-gender": {
    name: "Gender of nouns",
    tableType: "nounGender",
    entries: [
      ["king", "queen"], ["prince", "princess"], ["emperor", "empress"], ["husband", "wife"], ["father", "mother"],
      ["son", "daughter"], ["brother", "sister"], ["uncle", "aunt"], ["nephew", "niece"], ["grandfather", "grandmother"],
      ["gentleman", "lady"], ["monk", "nun"], ["wizard", "witch"], ["actor", "actress"], ["waiter", "waitress"],
      ["host", "hostess"], ["hero", "heroine"], ["god", "goddess"], ["duke", "duchess"], ["headmaster", "headmistress"],
      ["landlord", "landlady"], ["man", "woman"], ["boy", "girl"], ["bridegroom", "bride"], ["lad", "lass"],
      ["lion", "lioness"], ["tiger", "tigress"], ["peacock", "peahen"], ["fox", "vixen"], ["stag", "doe"],
      ["ram", "ewe"], ["bull", "cow"], ["cock", "hen"], ["horse", "mare"], ["drake", "duck"],
      ["gander", "goose"], ["colt", "filly"], ["boar", "sow"],
    ].map(([masculine, feminine]) => ({ masculine, feminine })),
  },
};

// ---------- The quest path (Spec v2, see gemini.md) ----------
// unit     = a group of branches, ends with a Unit Boss
// main     = node on the path (Learn + warm-up). Steps run in order.
// practice = optional side leaf (any order), difficulty easy | medium | hard
// gate     = harder quiz; passing it opens the next branch (Step 2 adds pools + sub-topic rules)
// endless  = "Keep practising" (Spec v2 Step 4; shows "Coming soon" until then)
// boss     = Unit Boss on the path; passing it opens the next unit

// --- Unit 0: Sentences ---
const u0a = main("eq-u0-sentence", "eq-u0", 0, "What is a sentence?", [study("eq-u0-what-is-sentence"), quiz("eq-u0-sentence-or-not")]);
const u0b = main("eq-u0-kinds", "eq-u0", 1, "Kinds of sentences", [study("eq-u0-kinds-of-sentences"), quiz("eq-u0-four-kinds")]);
const u0r = main("eq-u0-reading", "eq-u0", 2, "Reading: Tara's paper boat", [reading("eq-read-paper-boat")]);

// --- Unit 1: Parts of Speech (reuses IEO content) ---
const nouns = main("eq-u1-nouns", "eq-u1", 0, "Nouns", [study("eq-u1-noun-intro"), quiz("noun-intro-quiz")]);
const pronouns = main("eq-u1-pronouns", "eq-u1", 1, "Pronouns", [study("eq-u1-pronoun-intro"), quiz("ieo-pronouns-intro-quiz")]);
const verbs = main("eq-u1-verbs", "eq-u1", 2, "Verbs", [study("eq-u1-verb-intro"), quiz("verbs-intro-quiz")]);
const adjectives = main("eq-u1-adjectives", "eq-u1", 3, "Adjectives", [study("eq-u1-adj-intro"), quiz("4ieo8-quiz")]);
const adverbs = main("eq-u1-adverbs", "eq-u1", 4, "Adverbs", [study("eq-u1-adverbs"), quiz("eq-u1-adverbs-quiz")]);
const prepositions = main("eq-u1-prepositions", "eq-u1", 5, "Prepositions", [study("eq-u1-prep-intro"), quiz("4ieo6-quiz")]);
const conjunctions = main("eq-u1-conjunctions", "eq-u1", 6, "Conjunctions", [study("eq-u1-conj-intro"), quiz("4ieo7-quiz")]);
const u1r = main("eq-u1-reading", "eq-u1", 7, "Reading: The seed library", [study("eq-read-tips"), reading("eq-read-seed-library")]);

// --- Unit 2: Articles & Determiners (new content) ---
const u2a = main("eq-u2-a-an", "eq-u2", 0, "A and an", [study("eq-u2-a-an"), quiz("eq-u2-a-an-quiz")]);
const u2b = main("eq-u2-the", "eq-u2", 1, "Using 'the'", [study("eq-u2-the"), quiz("eq-u2-the-quiz")]);
const u2c = main("eq-u2-determiners", "eq-u2", 2, "Determiners", [study("eq-u2-determiners"), quiz("eq-u2-determiners-quiz")]);
const u2r = main("eq-u2-reading", "eq-u2", 3, "Reading: The rooftop garden", [reading("eq-read-rooftop-garden")]);

export const nodes = [
  unit("eq-u0", 0, "Sentences"),
  u0a,
  practice("eq-u0-sentence-p1", u0a, 1, "Subject & predicate", "medium", [quiz("eq-u0-subject-predicate")]),
  endless(u0a),
  u0b,
  practice("eq-u0-kinds-p1", u0b, 1, "Capitals & end marks", "medium", [quiz("eq-u0-capitals-endmarks")]),
  endless(u0b),
  u0r,
  boss(
    "eq-u0-boss",
    "eq-u0",
    "Unit 0 Boss",
    "eq-u0-test",
    "Oh no! 👾 The Grammar Gremlin sneaked into the Story Library and mixed up the sentences. Some lost their capital letters, some lost their full stops, and some are not even sentences any more! Help the librarian put every sentence back together before morning. 📚"
  ),

  unit("eq-u1", 1, "Parts of Speech"),
  nouns,
  withSubtopic(practice("eq-u1-nouns-p1", nouns, 1, "Common & proper", "easy", [study("eq-u1-noun-basic"), quiz("noun-basic-quiz")]), "common-proper"),
  withSubtopic(practice("eq-u1-nouns-p2", nouns, 2, "Singular & plural", "easy", [study("eq-u1-noun-plurals"), quiz("noun-sing-plu-quiz")]), "singular-plural"),
  withSubtopic(practice("eq-u1-nouns-p3", nouns, 3, "Gender", "medium", [study("eq-u1-noun-gender"), quiz("noun-gender-quiz")]), "gender"),
  withSubtopic(practice("eq-u1-nouns-p4", nouns, 4, "Gender 2", "medium", [quiz("noun-gender-quiz-l2")]), "gender"),
  withSubtopic(practice("eq-u1-nouns-p5", nouns, 5, "Advanced nouns", "hard", [study("eq-u1-noun-advanced"), quiz("noun-adv-quiz")]), "advanced"),
  gate("eq-u1-nouns-gate", nouns, "Noun Challenge", "eq-u1-nouns-gate-pool", {
    "common-proper": "Common & proper",
    "singular-plural": "Singular & plural",
    gender: "Gender",
    advanced: "Advanced nouns",
  }),
  endless(nouns, [
    { type: "plural", table: "eq-wt-plural" },
    { type: "nounGender", table: "eq-wt-gender" },
  ]),

  pronouns,
  withSubtopic(practice("eq-u1-pronouns-p1", pronouns, 1, "Personal & possessive", "easy", [study("eq-u1-pronoun-basic"), quiz("ieo-pronouns-basic-quiz")]), "personal-possessive"),
  withSubtopic(practice("eq-u1-pronouns-p2", pronouns, 2, "Reflexive & more", "medium", [study("eq-u1-pronoun-adv1"), quiz("ieo-pronouns-adv-1-quiz")]), "reflexive-demonstrative"),
  withSubtopic(practice("eq-u1-pronouns-p3", pronouns, 3, "Relative & more", "hard", [study("eq-u1-pronoun-adv2"), quiz("ieo-pronouns-adv-2-quiz")]), "relative-interrogative"),
  gate("eq-u1-pronouns-gate", pronouns, "Pronoun Challenge", "eq-u1-pronouns-gate-pool", {
    "personal-possessive": "Personal & possessive",
    "reflexive-demonstrative": "Reflexive, demonstrative & indefinite",
    "relative-interrogative": "Relative & question words",
  }),
  endless(pronouns),

  verbs,
  withSubtopic(practice("eq-u1-verbs-p1", verbs, 1, "Action & linking", "easy", [study("eq-u1-verb-linking"), quiz("verbs-link-quiz")]), "action-linking"),
  withSubtopic(practice("eq-u1-verbs-p2", verbs, 2, "Transitive", "medium", [study("eq-u1-verb-transitive"), quiz("verbs-trans-quiz")]), "transitive"),
  withSubtopic(practice("eq-u1-verbs-p3", verbs, 3, "Finite & non-finite", "hard", [study("eq-u1-verb-finite"), quiz("verbs-finite-quiz")]), "finite"),
  practice("eq-u1-verbs-p4", verbs, 4, "Verb boss", "hard", [quiz("verbs-boss-1")]),
  gate("eq-u1-verbs-gate", verbs, "Verb Challenge", "eq-u1-verbs-gate-pool", {
    "action-linking": "Action & linking",
    transitive: "Transitive",
    finite: "Finite & non-finite",
  }),
  endless(verbs),

  adjectives,
  withSubtopic(practice("eq-u1-adjectives-p1", adjectives, 1, "More adjectives", "easy", [quiz("4ieo8-quiz-2")]), "kinds"),
  withSubtopic(practice("eq-u1-adjectives-p2", adjectives, 2, "Degrees", "medium", [study("eq-u1-adj-degrees"), quiz("4ieo8-adj-degrees-q1")]), "degrees"),
  gate("eq-u1-adjectives-gate", adjectives, "Adjective Challenge", "eq-u1-adjectives-gate-pool", {
    identify: "Finding adjectives",
    kinds: "Kinds of adjectives",
    degrees: "Degrees of comparison",
  }),
  endless(adjectives),

  adverbs,
  gate("eq-u1-adverbs-gate", adverbs, "Adverb Challenge", "eq-u1-adverbs-gate-pool", {
    kinds: "How, when, where, how often",
    "adverb-adjective": "Adverb or adjective?",
    forming: "Making adverbs",
  }),
  endless(adverbs),

  prepositions,
  withSubtopic(practice("eq-u1-prepositions-p1", prepositions, 1, "Fixed prepositions", "medium", [study("eq-u1-prep-fixed"), quiz("4ieo6-fixed-prep-quiz")]), "fixed"),
  gate("eq-u1-prepositions-gate", prepositions, "Preposition Challenge", "eq-u1-prepositions-gate-pool", {
    place: "Place",
    time: "Time",
    direction: "Direction",
    fixed: "Fixed prepositions",
  }),
  endless(prepositions),

  conjunctions,
  gate("eq-u1-conjunctions-gate", conjunctions, "Conjunction Challenge", "eq-u1-conjunctions-gate-pool", {
    coordinating: "and, but, or, so",
    subordinating: "because, although, unless, when",
    pairs: "Pairs (either…or, neither…nor)",
  }),
  endless(conjunctions),

  u1r,
  boss(
    "eq-u1-boss",
    "eq-u1",
    "Unit 1 Boss",
    "eq-u1-test",
    "Uh-oh! 👾 The Grammar Gremlin pulled the name tags off the animals in the Word Zoo. Nouns, verbs, adjectives and adverbs are running around and nobody knows who is who! Use your word-detective skills to put the right tag back on every word. 🦁"
  ),

  unit("eq-u2", 2, "Articles & Determiners"),
  u2a,
  withSubtopic(practice("eq-u2-a-an-p1", u2a, 1, "Tricky sounds", "hard", [quiz("eq-u2-a-an-tricky")]), "tricky-sounds"),
  gate("eq-u2-a-an-gate", u2a, "A/An Challenge", "eq-u2-a-an-gate-pool", {
    "vowel-sounds": "Vowel sounds",
    "tricky-sounds": "Tricky sounds (hour, uniform)",
    "using-a-an": "When to use a or an",
  }),
  endless(u2a),

  u2b,
  withSubtopic(practice("eq-u2-the-p1", u2b, 1, "No article needed", "medium", [quiz("eq-u2-no-article")]), "no-article"),
  gate("eq-u2-the-gate", u2b, "'The' Challenge", "eq-u2-the-gate-pool", {
    "known-one": "The one we know",
    special: "Rivers, seas & special names",
    "no-article": "No article needed",
  }),
  endless(u2b),

  u2c,
  withSubtopic(practice("eq-u2-determiners-p1", u2c, 1, "Much, many, few, little", "hard", [quiz("eq-u2-quantity")]), "quantity"),
  gate("eq-u2-determiners-gate", u2c, "Determiner Challenge", "eq-u2-determiners-gate-pool", {
    "this-that": "This, that, these, those",
    "some-any": "Some & any",
    quantity: "Much, many, few, little",
  }),
  endless(u2c),

  u2r,
  boss(
    "eq-u2-boss",
    "eq-u2",
    "Unit 2 Boss",
    "eq-u2-test",
    "Oh no! 👾 The Grammar Gremlin sneaked into the Village Market and stole all the little words. Now everyone is asking for 'apple', 'umbrella' and 'sweets' with no a, an, the or some! The shopkeepers are so confused. Put every little word back where it belongs and save market day! 🛒"
  ),

];

// ---------- New units from data/englishQuest/units/ (one file per unit, docs/CONTENT_GUIDE.md) ----------
// Each unit adds its pages, quizzes, readings and nodes. A duplicate id is a mistake, so it stops here.
const addAll = (target, extra = {}, what) =>
  Object.entries(extra).forEach(([id, value]) => {
    if (id in target) throw new Error(`English Quest: duplicate ${what} id "${id}"`);
    target[id] = value;
  });
extraUnits.forEach((u) => {
  addAll(studyPages, u.studyPages, "study page");
  addAll(quizzes, u.quizzes, "quiz");
  addAll(readings, u.readings, "reading");
  addAll(wordTables, u.wordTables, "word table");
  nodes.push(...u.nodes);
});
// The next unit shows as "Coming soon" at the end of the path.
if (nextUnitTeaser) nodes.push(unit(nextUnitTeaser.id, nextUnitTeaser.unitOrder, nextUnitTeaser.title, { comingSoon: true, ...(nextUnitTeaser.grades ? { grades: nextUnitTeaser.grades } : {}) }));

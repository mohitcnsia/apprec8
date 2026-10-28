// data/englishQuestData.js
// Content for the English Quest (tile-based quest). Seeded to Firestore by
// components/quiz/SeedEnglishQuestButton.js.
//
// - New questions use the V2 format and carry a `mistakeTag` on every wrong option,
//   so the dashboard can show what KIND of mistake a kid made.
// - Units can reuse old IEO content: study pages by `contentId` (studyContent doc id)
//   and quizzes by `quizId` (old quizQuestions are converted on the fly).
// - All new content is original. Past papers are only used as a guide.

export const QUEST_ID = "english-quest";

const IEO_TILE_IMAGE =
  "https://firebasestorage.googleapis.com/v0/b/apprec8-ca229.firebasestorage.app/o/category_images%2Fieo.webp?alt=media&token=074a3b20-eb1d-4fb6-9e36-312c9587a698";

export const quest = {
  title: "English Quest",
  description:
    "Climb the English tree, from your very first sentence all the way to Olympiad master level. Practise in the branches, pass each unit test, and collect stars!",
  image: IEO_TILE_IMAGE,
  version: 1,
};

// The tile. carouselGroup "quest" is only read by app versions that support quests.
export const tile = {
  title: "English Quest",
  type: "QUEST",
  carouselGroup: "quest",
  order: 1,
  image: IEO_TILE_IMAGE,
  questId: QUEST_ID,
  description: "Grammar and reading, from zero to Olympiad level",
};

// ---------- Mistake tags (keep this list short and reuse tags) ----------
// incomplete-thought, missing-subject, missing-verb, subject-predicate-mixup,
// sentence-kind-mixup, wrong-end-mark, missing-capital, pos-noun-mixup,
// pos-verb-mixup, pos-adjective-mixup, pos-adverb-mixup, pos-pronoun-mixup,
// pos-preposition-mixup, pos-conjunction-mixup

/** Small helper to write questions compactly. */
const q = (content, correct, wrongs, explanation) => ({
  question: { type: "text", content },
  options: [
    { type: "text", content: correct, isCorrect: true },
    ...wrongs.map(([text, mistakeTag]) => ({ type: "text", content: text, isCorrect: false, mistakeTag })),
  ],
  answer: correct,
  explanation: { text: explanation },
});

// ---------- Study pages (new) ----------
export const studyPages = {
  "eq-u0-what-is-sentence": {
    name: "What is a Sentence?",
    author: "Apprec8",
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
    q("Which word needs a capital letter? 'my friend lives in pune.'", "my and pune", [["friend and lives", "missing-capital"], ["only pune", "missing-capital"], ["only my", "missing-capital"]], "The first word of a sentence and names of places need capital letters: 'My friend lives in Pune.'"),
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
    q("Find the adverb: 'The old man walked slowly.'", "slowly", [["old", "pos-adjective-mixup"], ["walked", "pos-verb-mixup"], ["man", "pos-noun-mixup"]], "'slowly' tells HOW he walked."),
    q("Find the adverb: 'We will meet tomorrow.'", "tomorrow", [["meet", "pos-verb-mixup"], ["We", "pos-pronoun-mixup"], ["will", "pos-verb-mixup"]], "'tomorrow' tells WHEN we will meet."),
    q("Find the adverb: 'The kids are playing outside.'", "outside", [["kids", "pos-noun-mixup"], ["playing", "pos-verb-mixup"], ["are", "pos-verb-mixup"]], "'outside' tells WHERE they are playing."),
    q("Which word is an ADJECTIVE, not an adverb?", "friendly", [["quickly", "pos-adverb-mixup"], ["softly", "pos-adverb-mixup"], ["happily", "pos-adverb-mixup"]], "'friendly' ends in -ly but describes a noun: a friendly dog. So it is an adjective."),
    q("Choose the adverb to fill the blank: 'She sang ___ at the concert.'", "beautifully", [["beautiful", "pos-adjective-mixup"], ["beauty", "pos-noun-mixup"], ["beautify", "pos-verb-mixup"]], "We need a word telling HOW she sang: beautifully."),
    q("In 'The water is very cold.', what does 'very' describe?", "cold (an adjective)", [["water (a noun)", "pos-noun-mixup"], ["is (a verb)", "pos-verb-mixup"], ["The (an article)", "pos-adverb-mixup"]], "'very' tells HOW cold the water is. Adverbs can describe adjectives too."),
    q("Which sentence has an adverb of frequency (how often)?", "Rohan always reads before bed.", [["Rohan reads a long book.", "pos-adverb-mixup"], ["Rohan reads in his room.", "pos-adverb-mixup"], ["Rohan is a good reader.", "pos-adverb-mixup"]], "'always' tells HOW OFTEN Rohan reads."),
    q("Pick the correct sentence.", "He answered the question correctly.", [["He answered the question correct.", "pos-adjective-mixup"], ["He answered the question correctness.", "pos-noun-mixup"], ["He answered correct the question.", "pos-adjective-mixup"]], "To describe HOW he answered (a verb), we need the adverb 'correctly'."),
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
};

// ---------- The tree ----------
// Units = trunk nodes (each is a unit test). Leaves belong to a unit + branch.
// Leaves further out in a branch (higher `order`) are harder.
const leaf = (id, unitId, branchId, branchTitle, branchOrder, order, type, ref, title) => ({
  id,
  kind: "leaf",
  unitId,
  branchId,
  branchTitle,
  branchOrder,
  order,
  type,
  title,
  ...(type === "study" ? { contentId: ref } : { quizId: ref }),
});

export const units = [
  { id: "eq-u0", kind: "unit", unitOrder: 0, title: "Sentences", quizId: "eq-u0-test", passPercent: 70 },
  { id: "eq-u1", kind: "unit", unitOrder: 1, title: "Parts of Speech", quizId: "eq-u1-test", passPercent: 70 },
  { id: "eq-u2", kind: "unit", unitOrder: 2, title: "Articles & Determiners", comingSoon: true },
];

export const leaves = [
  // Unit 0: Sentences (new content)
  leaf("eq-u0-a1", "eq-u0", "u0-sentence", "What is a sentence?", 0, 1, "study", "eq-u0-what-is-sentence", "Learn"),
  leaf("eq-u0-a2", "eq-u0", "u0-sentence", "What is a sentence?", 0, 2, "quiz", "eq-u0-sentence-or-not", "Sentence or not?"),
  leaf("eq-u0-a3", "eq-u0", "u0-sentence", "What is a sentence?", 0, 3, "quiz", "eq-u0-subject-predicate", "Subject & predicate"),
  leaf("eq-u0-b1", "eq-u0", "u0-kinds", "Kinds of sentences", 1, 1, "study", "eq-u0-kinds-of-sentences", "Learn"),
  leaf("eq-u0-b2", "eq-u0", "u0-kinds", "Kinds of sentences", 1, 2, "quiz", "eq-u0-four-kinds", "Four kinds"),
  leaf("eq-u0-b3", "eq-u0", "u0-kinds", "Kinds of sentences", 1, 3, "quiz", "eq-u0-capitals-endmarks", "Capitals & end marks"),

  // Unit 1: Parts of Speech (reuses existing IEO content)
  leaf("eq-u1-n1", "eq-u1", "u1-nouns", "Nouns", 0, 1, "study", "noun-intro-study", "Learn"),
  leaf("eq-u1-n2", "eq-u1", "u1-nouns", "Nouns", 0, 2, "quiz", "noun-intro-quiz", "What is a noun?"),
  leaf("eq-u1-n3", "eq-u1", "u1-nouns", "Nouns", 0, 3, "study", "noun-basic-study", "Common & proper"),
  leaf("eq-u1-n4", "eq-u1", "u1-nouns", "Nouns", 0, 4, "quiz", "noun-basic-quiz", "Basic nouns"),
  leaf("eq-u1-n5", "eq-u1", "u1-nouns", "Nouns", 0, 5, "study", "noun-sing-plu-study", "Singular & plural"),
  leaf("eq-u1-n6", "eq-u1", "u1-nouns", "Nouns", 0, 6, "quiz", "noun-sing-plu-quiz", "Plural quiz"),
  leaf("eq-u1-n7", "eq-u1", "u1-nouns", "Nouns", 0, 7, "study", "noun-gender-study", "Gender"),
  leaf("eq-u1-n8", "eq-u1", "u1-nouns", "Nouns", 0, 8, "quiz", "noun-gender-quiz", "Gender quiz"),
  leaf("eq-u1-n9", "eq-u1", "u1-nouns", "Nouns", 0, 9, "study", "noun-adv-study", "Advanced nouns"),
  leaf("eq-u1-n10", "eq-u1", "u1-nouns", "Nouns", 0, 10, "quiz", "noun-adv-quiz", "Advanced quiz"),
  leaf("eq-u1-n11", "eq-u1", "u1-nouns", "Nouns", 0, 11, "quiz", "noun-boss-1", "Noun boss"),

  leaf("eq-u1-p1", "eq-u1", "u1-pronouns", "Pronouns", 1, 1, "study", "ieo-pronouns-intro-study", "Learn"),
  leaf("eq-u1-p2", "eq-u1", "u1-pronouns", "Pronouns", 1, 2, "quiz", "ieo-pronouns-intro-quiz", "What is a pronoun?"),
  leaf("eq-u1-p3", "eq-u1", "u1-pronouns", "Pronouns", 1, 3, "study", "ieo-pronouns-basic-study", "Personal & possessive"),
  leaf("eq-u1-p4", "eq-u1", "u1-pronouns", "Pronouns", 1, 4, "quiz", "ieo-pronouns-basic-quiz", "Basic quiz"),
  leaf("eq-u1-p5", "eq-u1", "u1-pronouns", "Pronouns", 1, 5, "study", "ieo-pronouns-adv-1-study", "Reflexive & more"),
  leaf("eq-u1-p6", "eq-u1", "u1-pronouns", "Pronouns", 1, 6, "quiz", "ieo-pronouns-adv-1-quiz", "Advanced quiz 1"),
  leaf("eq-u1-p7", "eq-u1", "u1-pronouns", "Pronouns", 1, 7, "study", "ieo-pronouns-adv-2-study", "Relative & more"),
  leaf("eq-u1-p8", "eq-u1", "u1-pronouns", "Pronouns", 1, 8, "quiz", "ieo-pronouns-adv-2-quiz", "Advanced quiz 2"),

  leaf("eq-u1-v1", "eq-u1", "u1-verbs", "Verbs", 2, 1, "study", "verbs-intro-study", "Learn"),
  leaf("eq-u1-v2", "eq-u1", "u1-verbs", "Verbs", 2, 2, "quiz", "verbs-intro-quiz", "What is a verb?"),
  leaf("eq-u1-v3", "eq-u1", "u1-verbs", "Verbs", 2, 3, "study", "verbs-link-study", "Action & linking"),
  leaf("eq-u1-v4", "eq-u1", "u1-verbs", "Verbs", 2, 4, "quiz", "verbs-link-quiz", "Linking quiz"),
  leaf("eq-u1-v5", "eq-u1", "u1-verbs", "Verbs", 2, 5, "study", "verbs-trans-study", "Transitive"),
  leaf("eq-u1-v6", "eq-u1", "u1-verbs", "Verbs", 2, 6, "quiz", "verbs-trans-quiz", "Transitive quiz"),
  leaf("eq-u1-v7", "eq-u1", "u1-verbs", "Verbs", 2, 7, "study", "verbs-finite-study", "Finite & non-finite"),
  leaf("eq-u1-v8", "eq-u1", "u1-verbs", "Verbs", 2, 8, "quiz", "verbs-finite-quiz", "Finite quiz"),
  leaf("eq-u1-v9", "eq-u1", "u1-verbs", "Verbs", 2, 9, "quiz", "verbs-boss-1", "Verb boss 1"),
  leaf("eq-u1-v10", "eq-u1", "u1-verbs", "Verbs", 2, 10, "quiz", "verbs-boss-2", "Verb boss 2"),

  leaf("eq-u1-j1", "eq-u1", "u1-adjectives", "Adjectives", 3, 1, "study", "4ieo8-study", "Learn"),
  leaf("eq-u1-j2", "eq-u1", "u1-adjectives", "Adjectives", 3, 2, "quiz", "4ieo8-quiz", "Quiz 1"),
  leaf("eq-u1-j3", "eq-u1", "u1-adjectives", "Adjectives", 3, 3, "quiz", "4ieo8-quiz-2", "Quiz 2"),
  leaf("eq-u1-j4", "eq-u1", "u1-adjectives", "Adjectives", 3, 4, "study", "4ieo8-adj-degrees", "Degrees"),
  leaf("eq-u1-j5", "eq-u1", "u1-adjectives", "Adjectives", 3, 5, "quiz", "4ieo8-adj-degrees-q1", "Degrees quiz"),

  leaf("eq-u1-d1", "eq-u1", "u1-adverbs", "Adverbs", 4, 1, "study", "eq-u1-adverbs", "Learn"),
  leaf("eq-u1-d2", "eq-u1", "u1-adverbs", "Adverbs", 4, 2, "quiz", "eq-u1-adverbs-quiz", "Adverb quiz"),

  leaf("eq-u1-r1", "eq-u1", "u1-prepositions", "Prepositions", 5, 1, "study", "4ieo6-study", "Learn"),
  leaf("eq-u1-r2", "eq-u1", "u1-prepositions", "Prepositions", 5, 2, "quiz", "4ieo6-quiz", "Quiz"),
  leaf("eq-u1-r3", "eq-u1", "u1-prepositions", "Prepositions", 5, 3, "study", "4ieo6-fixed-prep", "Fixed prepositions"),
  leaf("eq-u1-r4", "eq-u1", "u1-prepositions", "Prepositions", 5, 4, "quiz", "4ieo6-fixed-prep-quiz", "Fixed quiz"),

  leaf("eq-u1-c1", "eq-u1", "u1-conjunctions", "Conjunctions", 6, 1, "study", "4ieo7-study", "Learn"),
  leaf("eq-u1-c2", "eq-u1", "u1-conjunctions", "Conjunctions", 6, 2, "quiz", "4ieo7-quiz", "Quiz"),
];

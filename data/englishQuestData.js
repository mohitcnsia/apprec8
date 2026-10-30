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
  "eq-read-tips": {
    name: "Reading Detective Tips",
    author: "Apprec8",
    content: `### 🕵️ Be a reading detective!

Olympiad reading questions are not about remembering everything. They are about **finding the clue** in the passage.

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
};

// ---------- The quest path (Spec v2, see gemini.md) ----------
// unit     = a group of branches, ends with a Unit Boss
// main     = node on the path (Learn + warm-up). Steps run in order.
// practice = optional side leaf (any order), difficulty easy | medium | hard
// gate     = harder quiz; passing it opens the next branch (Step 2 adds pools + sub-topic rules)
// endless  = "Keep practising" (Spec v2 Step 4; shows "Coming soon" until then)
// boss     = Unit Boss on the path; passing it opens the next unit
const study = (contentId) => ({ type: "study", contentId });
const quiz = (quizId) => ({ type: "quiz", quizId });
const reading = (contentId) => ({ type: "reading", contentId });

const unit = (id, unitOrder, title, extra = {}) => ({ id, kind: "unit", unitOrder, title, ...extra });
const main = (id, unitId, branchOrder, title, steps) => ({ id, kind: "main", unitId, branchId: id, branchOrder, title, steps });
const practice = (id, branch, order, title, difficulty, steps) => ({
  id, kind: "practice", unitId: branch.unitId, branchId: branch.id, order, title, difficulty, steps,
});
const gate = (id, branch, title, quizId, passPercent = 80) => ({
  id, kind: "gate", unitId: branch.unitId, branchId: branch.id, title, quizId, passPercent,
});
const endless = (branch) => ({
  id: `${branch.id}-endless`, kind: "endless", unitId: branch.unitId, branchId: branch.id, title: `Keep practising`,
});
const boss = (id, unitId, title, quizId, passPercent = 70) => ({ id, kind: "boss", unitId, title, quizId, passPercent });

// --- Unit 0: Sentences ---
const u0a = main("eq-u0-sentence", "eq-u0", 0, "What is a sentence?", [study("eq-u0-what-is-sentence"), quiz("eq-u0-sentence-or-not")]);
const u0b = main("eq-u0-kinds", "eq-u0", 1, "Kinds of sentences", [study("eq-u0-kinds-of-sentences"), quiz("eq-u0-four-kinds")]);
const u0r = main("eq-u0-reading", "eq-u0", 2, "Reading: Tara's paper boat", [reading("eq-read-paper-boat")]);

// --- Unit 1: Parts of Speech (reuses IEO content) ---
const nouns = main("eq-u1-nouns", "eq-u1", 0, "Nouns", [study("noun-intro-study"), quiz("noun-intro-quiz")]);
const pronouns = main("eq-u1-pronouns", "eq-u1", 1, "Pronouns", [study("ieo-pronouns-intro-study"), quiz("ieo-pronouns-intro-quiz")]);
const verbs = main("eq-u1-verbs", "eq-u1", 2, "Verbs", [study("verbs-intro-study"), quiz("verbs-intro-quiz")]);
const adjectives = main("eq-u1-adjectives", "eq-u1", 3, "Adjectives", [study("4ieo8-study"), quiz("4ieo8-quiz")]);
const adverbs = main("eq-u1-adverbs", "eq-u1", 4, "Adverbs", [study("eq-u1-adverbs"), quiz("eq-u1-adverbs-quiz")]);
const prepositions = main("eq-u1-prepositions", "eq-u1", 5, "Prepositions", [study("4ieo6-study"), quiz("4ieo6-quiz")]);
const conjunctions = main("eq-u1-conjunctions", "eq-u1", 6, "Conjunctions", [study("4ieo7-study"), quiz("4ieo7-quiz")]);
const u1r = main("eq-u1-reading", "eq-u1", 7, "Reading: The seed library", [study("eq-read-tips"), reading("eq-read-seed-library")]);

export const nodes = [
  unit("eq-u0", 0, "Sentences"),
  u0a,
  practice("eq-u0-sentence-p1", u0a, 1, "Subject & predicate", "medium", [quiz("eq-u0-subject-predicate")]),
  endless(u0a),
  u0b,
  practice("eq-u0-kinds-p1", u0b, 1, "Capitals & end marks", "medium", [quiz("eq-u0-capitals-endmarks")]),
  endless(u0b),
  u0r,
  boss("eq-u0-boss", "eq-u0", "Unit 0 Boss", "eq-u0-test"),

  unit("eq-u1", 1, "Parts of Speech"),
  nouns,
  practice("eq-u1-nouns-p1", nouns, 1, "Common & proper", "easy", [study("noun-basic-study"), quiz("noun-basic-quiz")]),
  practice("eq-u1-nouns-p2", nouns, 2, "Singular & plural", "easy", [study("noun-sing-plu-study"), quiz("noun-sing-plu-quiz")]),
  practice("eq-u1-nouns-p3", nouns, 3, "Gender", "medium", [study("noun-gender-study"), quiz("noun-gender-quiz")]),
  practice("eq-u1-nouns-p4", nouns, 4, "Gender 2", "medium", [quiz("noun-gender-quiz-l2")]),
  practice("eq-u1-nouns-p5", nouns, 5, "Advanced nouns", "hard", [study("noun-adv-study"), quiz("noun-adv-quiz")]),
  gate("eq-u1-nouns-gate", nouns, "Noun Challenge", "noun-boss-1"), // temporary pool until Step 2 gate pools
  endless(nouns),

  pronouns,
  practice("eq-u1-pronouns-p1", pronouns, 1, "Personal & possessive", "easy", [study("ieo-pronouns-basic-study"), quiz("ieo-pronouns-basic-quiz")]),
  practice("eq-u1-pronouns-p2", pronouns, 2, "Reflexive & more", "medium", [study("ieo-pronouns-adv-1-study"), quiz("ieo-pronouns-adv-1-quiz")]),
  practice("eq-u1-pronouns-p3", pronouns, 3, "Relative & more", "hard", [study("ieo-pronouns-adv-2-study"), quiz("ieo-pronouns-adv-2-quiz")]),
  endless(pronouns),

  verbs,
  practice("eq-u1-verbs-p1", verbs, 1, "Action & linking", "easy", [study("verbs-link-study"), quiz("verbs-link-quiz")]),
  practice("eq-u1-verbs-p2", verbs, 2, "Transitive", "medium", [study("verbs-trans-study"), quiz("verbs-trans-quiz")]),
  practice("eq-u1-verbs-p3", verbs, 3, "Finite & non-finite", "hard", [study("verbs-finite-study"), quiz("verbs-finite-quiz")]),
  practice("eq-u1-verbs-p4", verbs, 4, "Verb boss", "hard", [quiz("verbs-boss-1")]),
  gate("eq-u1-verbs-gate", verbs, "Verb Challenge", "verbs-boss-2"), // temporary pool until Step 2 gate pools
  endless(verbs),

  adjectives,
  practice("eq-u1-adjectives-p1", adjectives, 1, "More adjectives", "easy", [quiz("4ieo8-quiz-2")]),
  practice("eq-u1-adjectives-p2", adjectives, 2, "Degrees", "medium", [study("4ieo8-adj-degrees"), quiz("4ieo8-adj-degrees-q1")]),
  endless(adjectives),

  adverbs,
  endless(adverbs),

  prepositions,
  practice("eq-u1-prepositions-p1", prepositions, 1, "Fixed prepositions", "medium", [study("4ieo6-fixed-prep"), quiz("4ieo6-fixed-prep-quiz")]),
  endless(prepositions),

  conjunctions,
  endless(conjunctions),

  u1r,
  boss("eq-u1-boss", "eq-u1", "Unit 1 Boss", "eq-u1-test"),

  unit("eq-u2", 2, "Articles & Determiners", { comingSoon: true }),
];

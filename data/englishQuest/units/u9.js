// data/englishQuest/units/u9.js: Unit 9, Punctuation Power (Claude, 2026-11-05). Classes 3–5 focus (Pratha first).
// Unit 0 already covers capitals and end marks. This unit: commas (lists; yes/no and names; commas that don't belong),
// apostrophes (short forms; one owner; no apostrophe for plurals), speech marks (which words, capitals, , ? ! inside).
// Champion leaf (Class 5+): its / it's and plural owners (girls', children's).
// Built per docs/CONTENT_GUIDE.md and docs/exam/ieo-pattern.md (punctuation / spot the error). Original questions.
// Ambiguity rule: no style splits. Never test the comma before "and" in a list (optional in British English), commas after
// short openers, "Mr" vs "Mr.", single vs double speech marks, or punctuation outside the closing speech mark.
// Read-aloud: apostrophes appear only in options and in "Which…" questions without a quoted blank.
import { q, study, quiz, reading, unit, main, practice, gate, withSubtopic, endless, boss, forGrades } from "../helpers.js";

const t = (subtopic, question, correct, wrongs, explanation) => ({ subtopic, ...q(question, correct, wrongs, explanation) });

const commas = main("eq-u9-commas", "eq-u9", 0, "Commas", [study("eq-u9-commas"), quiz("eq-u9-commas-quiz")]);
const apos = main("eq-u9-apos", "eq-u9", 1, "Apostrophes", [study("eq-u9-apos"), quiz("eq-u9-apos-quiz")]);
const speech = main("eq-u9-speech", "eq-u9", 2, "Speech Marks", [study("eq-u9-speech"), quiz("eq-u9-speech-quiz")]);
const u9r = main("eq-u9-reading", "eq-u9", 3, "Reading: The Class Newspaper", [reading("eq-read-class-newspaper")]);

export default {
  // ---------- Study Pages ----------
  studyPages: {
    "eq-u9-commas": {
      name: "Commas",
      author: "Apprec8",
      content: `### ✏️ What does a comma do?

A comma **,** is a tiny pause. It keeps words from bumping into each other.

---

### 🧺 Commas in a list

Put a comma **between the things** in a list. Join the last two with **and**.

| ✅ Right | ❌ Wrong |
|---|---|
| We need eggs, milk, bread and butter. | We need eggs milk bread and butter. |
| Dev can sing, dance and paint. | Dev can, sing dance and paint. |

---

### 🙋 Yes, no and names

- After **yes** or **no** at the start: **Yes,** I can come. **No,** thank you.
- When you **talk to someone** by name: **Meena,** please close the door. Come here, **Raju.**

---

### 🚫 Commas that don't belong

Don't put a comma between **who** does something and **what they do**.

| ✅ Right | ❌ Wrong |
|---|---|
| My brother plays cricket. | My brother, plays cricket. |

---

### 🎯 Now you can…
- use commas in a list
- put a comma after yes, no and a person's name
- spot a comma that doesn't belong`,
    },
    "eq-u9-apos": {
      name: "Apostrophes",
      author: "Apprec8",
      content: `### 🪄 The apostrophe has two jobs

An apostrophe **'** looks like a flying comma.

---

### ✂️ Job 1: short forms (a letter is missing)

| Long | Short | Missing |
|---|---|---|
| do not | **don't** | o |
| I am | **I'm** | a |
| it is | **it's** | i |
| we will | **we'll** | wi |
| will not | **won't** | (special!) |

> 💡 The apostrophe sits **where the letters were**: do n**o**t → don**'**t.

---

### 🎒 Job 2: who owns it

Add **'s** to show that something belongs to someone.

- **Ravi's** bag (the bag of Ravi)
- the **dog's** tail (the tail of the dog)

---

### 🍎 No apostrophe for "more than one"

A plural just adds **s**. No apostrophe!

| ✅ Right | ❌ Wrong |
|---|---|
| six apples | six apple's |
| Fresh mangoes for sale | Fresh mango's for sale |

---

### 🎯 Now you can…
- write short forms like don't, I'm, we'll
- show who owns something with 's
- leave apostrophes out of plurals`,
    },
    "eq-u9-speech": {
      name: "Speech Marks",
      author: "Apprec8",
      content: `### 💬 Speech marks hug the spoken words

Speech marks **" "** go around the **exact words** someone says. Nothing else goes inside.

> "I am hungry," said Veer.

The words Veer said: *I am hungry*. "said Veer" stays outside.

---

### 🔠 Three rules

| Rule | Example |
|---|---|
| 1. Spoken words start with a **capital** | Asha said, "**W**e won!" |
| 2. The **, ? !** goes **inside** the closing speech mark | "Are you ready**?**" asked Dad. |
| 3. Before the spoken words, use a **comma** | Grandpa said**,** "Drink your milk." |

> ⚠️ After the spoken words, *said* and *asked* stay small: "Time to go," **s**aid Tara.

---

### 🔍 Said that…? No speech marks

When we only **report** what someone said, there are no speech marks:
*Sunil said that he was tired.*

---

### 🎯 Now you can…
- put speech marks around the spoken words only
- start spoken words with a capital
- put the comma, question mark or exclamation mark inside`,
    },
  },

  // ---------- Quizzes ----------
  quizzes: {
    // Topic A: Commas (practice, 8)
    "eq-u9-commas-quiz": [
      t("comma-list", "Which sentence uses commas correctly?", "We need eggs, milk, bread and butter.", [["We need eggs milk, bread, and, butter.", "comma-list-error"], ["We need, eggs, milk, bread and butter.", "comma-extra-error"], ["We need eggs milk bread and butter.", "comma-list-error"]], "Commas go BETWEEN the things in a list: eggs, milk, bread and butter."),
      t("comma-list", "In a list, what do commas do?", "They separate the things in the list.", [["They end the sentence.", "comma-list-error"], ["They show a question.", "comma-list-error"], ["They show who owns something.", "apostrophe-owner-error"]], "Commas keep the things in a list apart: pens, pencils and erasers."),
      t("comma-list", "Which list is written correctly?", "red, blue, green and yellow", [["red blue green, and, yellow", "comma-list-error"], ["red, blue, green, and, yellow", "comma-extra-error"], ["red blue green yellow,", "comma-list-error"]], "A comma between the colours, and AND before the last one."),
      t("comma-address", "Which sentence is correct?", "Yes, I can come to the party.", [["Yes I, can come to the party.", "comma-address-error"], ["Yes I can, come to the party.", "comma-address-error"], ["Yes I can come, to the party.", "comma-address-error"]], "Put a comma right after YES at the start of an answer."),
      t("comma-address", "Which sentence is correct?", "Meena, please close the door.", [["Meena please, close the door.", "comma-address-error"], ["Meena please close, the door.", "comma-address-error"], ["Meena please close the, door.", "comma-address-error"]], "When you talk to someone by name, a comma comes after the name: Meena, …"),
      t("comma-address", "Why is there a comma in 'No, thank you'?", "It separates 'No' from the rest of the answer.", [["It ends the sentence.", "comma-address-error"], ["It joins two lists.", "comma-list-error"], ["It shows that someone owns something.", "apostrophe-owner-error"]], "After YES or NO at the start of an answer, we put a comma."),
      t("comma-extra", "Which sentence has a comma that should NOT be there?", "My brother, plays cricket every day.", [["Sunil, Arjun and Tara play cricket.", "comma-list-error"], ["Yes, my brother plays cricket.", "comma-address-error"], ["Dad, my brother is playing cricket.", "comma-address-error"]], "Don't put a comma between who does it (my brother) and what he does (plays)."),
      t("comma-extra", "Which sentence is correct?", "The tall girl ate a big mango.", [["The tall girl, ate a big mango.", "comma-extra-error"], ["The tall girl ate, a big mango.", "comma-extra-error"], ["The, tall girl ate a big mango.", "comma-extra-error"]], "This sentence needs no comma at all."),
    ],
    // Practice leaf: Commas in Lists (8)
    "eq-u9-comma-lists": [
      t("comma-list", "Which sentence is correct?", "Mangoes, bananas and guavas grow in India.", [["Mangoes bananas, and guavas grow in India.", "comma-list-error"], ["Mangoes, bananas, and, guavas grow in India.", "comma-extra-error"], ["Mangoes bananas and guavas, grow in India.", "comma-extra-error"]], "A comma between mangoes and bananas; AND before guavas."),
      t("comma-list", "Which sentence is correct?", "Dev can sing, dance and paint.", [["Dev can, sing dance and paint.", "comma-list-error"], ["Dev can sing dance, and, paint.", "comma-list-error"], ["Dev, can sing dance and paint.", "comma-extra-error"]], "The list is sing, dance and paint: the comma goes between sing and dance."),
      t("comma-list", "Which list is correct?", "Monday, Tuesday and Wednesday", [["Monday Tuesday, and Wednesday", "comma-list-error"], ["Monday, Tuesday and, Wednesday", "comma-extra-error"], ["Monday Tuesday Wednesday,", "comma-list-error"]], "Monday, Tuesday and Wednesday: a comma, then AND before the last day."),
      t("comma-list", "Where is the missing comma? 'I packed my books my water bottle and my lunch box.'", "after 'books'", [["after 'packed'", "comma-extra-error"], ["after 'and'", "comma-extra-error"], ["after 'lunch'", "comma-extra-error"]], "The list is my books, my water bottle and my lunch box."),
      t("comma-list", "Which sentence is correct?", "The flag has saffron, white and green stripes.", [["The flag has saffron white, and green stripes.", "comma-list-error"], ["The flag, has saffron white and green stripes.", "comma-extra-error"], ["The flag has saffron, white and, green stripes.", "comma-extra-error"]], "Our flag: saffron, white and green. The comma goes between the first two colours."),
      t("comma-list", "Which sentence needs commas?", "We saw ducks swans and geese at the lake.", [["We saw ducks at the lake.", "comma-extra-error"], ["We saw two swans.", "comma-extra-error"], ["Geese are big birds.", "comma-extra-error"]], "Ducks, swans and geese is a list, so it needs a comma: ducks, swans and geese."),
      t("comma-list", "Why does 'pens, pencils and erasers' have a comma after 'pens'?", "To separate the things in the list", [["Because 'pens' is a verb", "comma-list-error"], ["To end the sentence", "comma-list-error"], ["Because someone owns the pens", "apostrophe-owner-error"]], "The comma keeps pens and pencils apart in the list."),
      t("comma-list", "Which sentence is correct?", "Riya, Sam and Leela are friends.", [["Riya Sam, and Leela are friends.", "comma-list-error"], ["Riya, Sam and, Leela are friends.", "comma-extra-error"], ["Riya, Sam, and, Leela are friends.", "comma-extra-error"]], "Riya, Sam and Leela: a comma between the first two names, then AND."),
    ],
    // Gate A (15 = 3 sub-topics × 5)
    "eq-u9-commas-gate-pool": [
      t("comma-list", "Which sentence is punctuated correctly?", "I like reading, drawing and swimming.", [["I like, reading drawing and swimming.", "comma-extra-error"], ["I like reading drawing, and, swimming.", "comma-list-error"], ["I like reading, drawing and, swimming.", "comma-extra-error"]], "The list is reading, drawing and swimming."),
      t("comma-list", "Which sentence is punctuated correctly?", "Bring a hat, a bottle and a snack.", [["Bring a hat a bottle, and, a snack.", "comma-list-error"], ["Bring, a hat a bottle and a snack.", "comma-extra-error"], ["Bring a hat, a bottle, and, a snack.", "comma-extra-error"]], "A hat, a bottle and a snack: one comma between the first two things."),
      t("comma-list", "Where is the missing comma? 'Dadi grows tomatoes chillies and onions.'", "after 'tomatoes'", [["after 'Dadi'", "comma-extra-error"], ["after 'grows'", "comma-extra-error"], ["after 'and'", "comma-extra-error"]], "The list is tomatoes, chillies and onions."),
      t("comma-list", "Which list is correct?", "lions, tigers and leopards", [["lions tigers, and leopards", "comma-list-error"], ["lions, tigers and, leopards", "comma-extra-error"], ["lions tigers and leopards,", "comma-list-error"]], "Lions, tigers and leopards: comma, then AND."),
      t("comma-list", "Which sentence needs commas?", "Ali Ben and Chen are in my class.", [["Ali is in my class.", "comma-extra-error"], ["Ben and Chen are twins.", "comma-extra-error"], ["My class is big.", "comma-extra-error"]], "Three names make a list: Ali, Ben and Chen."),
      t("comma-address", "Which sentence is correct?", "No, I have not finished yet.", [["No I, have not finished yet.", "comma-address-error"], ["No I have, not finished yet.", "comma-address-error"], ["No I have not, finished yet.", "comma-address-error"]], "A comma comes right after NO at the start of an answer."),
      t("comma-address", "Which sentence is correct?", "Kabir, your bus is here.", [["Kabir your, bus is here.", "comma-address-error"], ["Kabir your bus, is here.", "comma-address-error"], ["Kabir your bus is, here.", "comma-address-error"]], "We are talking TO Kabir, so a comma comes after his name."),
      t("comma-address", "Which sentence is correct?", "Come here, Raju.", [["Come, here Raju.", "comma-address-error"], ["Come here Raju,", "comma-address-error"], ["Come here Raju.,", "comma-address-error"]], "When the name comes at the end, the comma goes before it: Come here, Raju."),
      t("comma-address", "Which sentence needs a comma after the first word?", "Yes we can play now.", [["We can play now.", "comma-extra-error"], ["Can we play now?", "comma-extra-error"], ["Play now with us.", "comma-extra-error"]], "YES at the start of an answer needs a comma: Yes, we can play now."),
      t("comma-address", "Which sentence is correct?", "Mummy, can I have some water?", [["Mummy can, I have some water?", "comma-address-error"], ["Mummy can I, have some water?", "comma-address-error"], ["Mummy can I have some, water?", "comma-address-error"]], "We are talking TO Mummy, so a comma comes after Mummy."),
      t("comma-extra", "Which sentence has a WRONG comma?", "The old man, walked slowly home.", [["Yes, the old man walked home.", "comma-address-error"], ["Sir, the old man walked home.", "comma-address-error"], ["Ravi, Sita and the old man walked home.", "comma-list-error"]], "No comma between who (the old man) and what he did (walked)."),
      t("comma-extra", "Which sentence is correct?", "My little sister drew a cat.", [["My little sister, drew a cat.", "comma-extra-error"], ["My little sister drew, a cat.", "comma-extra-error"], ["My, little sister drew a cat.", "comma-extra-error"]], "This sentence needs no comma."),
      t("comma-extra", "Which sentence has a WRONG comma?", "We, went to the market.", [["No, we did not go.", "comma-address-error"], ["Mum, we went to the market.", "comma-address-error"], ["We bought rice, dal and salt.", "comma-list-error"]], "No comma between WE and WENT."),
      t("comma-extra", "Which sentence is correct?", "The children played in the park.", [["The children, played in the park.", "comma-extra-error"], ["The children played, in the park.", "comma-extra-error"], ["The children played in, the park.", "comma-extra-error"]], "This sentence needs no comma."),
      t("comma-extra", "Which sentence has a WRONG comma?", "Birds, build nests in spring.", [["Yes, birds build nests.", "comma-address-error"], ["Sparrows, crows and pigeons build nests.", "comma-list-error"], ["Asha, a bird is building a nest.", "comma-address-error"]], "No comma between BIRDS and BUILD."),
    ],

    // Topic B: Apostrophes (practice, 8)
    "eq-u9-apos-quiz": [
      t("apos-short", "What is the short form of 'do not'?", "don't", [["dont", "apostrophe-contraction-error"], ["do'nt", "apostrophe-contraction-error"], ["dont'", "apostrophe-contraction-error"]], "The apostrophe goes where the O is missing: do n(o)t → don't."),
      t("apos-short", "What is the short form of 'I am'?", "I'm", [["Im", "apostrophe-contraction-error"], ["I'am", "apostrophe-contraction-error"], ["Ia'm", "apostrophe-contraction-error"]], "The A is missing: I (a)m → I'm."),
      t("apos-short", "What does \"can't\" mean?", "cannot", [["could not", "apostrophe-contraction-error"], ["can it", "apostrophe-contraction-error"], ["can", "apostrophe-contraction-error"]], "CAN'T is the short form of CANNOT."),
      t("apos-owner", "Which shows that the bag belongs to Ravi?", "Ravi's bag", [["Ravis bag", "apostrophe-owner-error"], ["Ravis' bag", "apostrophe-owner-error"], ["Ravi bag's", "apostrophe-owner-error"]], "Add 's to the owner: Ravi's bag."),
      t("apos-owner", "Which sentence is correct?", "The dog's tail is long.", [["The dogs tail is long.", "apostrophe-owner-error"], ["The dog,s tail is long.", "apostrophe-owner-error"], ["The do'gs tail is long.", "apostrophe-owner-error"]], "The tail belongs to the dog: the dog's tail."),
      t("apos-plural", "Which sentence is correct?", "I bought six apples.", [["I bought six apple's.", "apostrophe-plural-error"], ["I bought six apples'.", "apostrophe-plural-error"], ["I bought six a'pples.", "apostrophe-plural-error"]], "More than one apple: just add S. No apostrophe."),
      t("apos-plural", "Which sign is correct?", "Fresh mangoes for sale", [["Fresh mango's for sale", "apostrophe-plural-error"], ["Fresh mangoes' for sale", "apostrophe-plural-error"], ["Fresh mang'oes for sale", "apostrophe-plural-error"]], "Plurals never need an apostrophe: mangoes."),
      t("apos-short", "In \"they're\", what does the apostrophe stand for?", "The missing letter A in 'they are'", [["That they own something", "apostrophe-owner-error"], ["That there are many of them", "apostrophe-plural-error"], ["A missing letter R", "apostrophe-contraction-error"]], "they (a)re → they're. The apostrophe shows where the A was."),
    ],
    // Practice leaf: Short Forms (8)
    "eq-u9-short-forms": [
      t("apos-short", "What is the short form of 'is not'?", "isn't", [["isnt", "apostrophe-contraction-error"], ["is'nt", "apostrophe-contraction-error"], ["isn,t", "apostrophe-contraction-error"]], "is n(o)t → isn't."),
      t("apos-short", "What is the short form of 'we will'?", "we'll", [["well", "apostrophe-contraction-error"], ["we'ill", "apostrophe-contraction-error"], ["wel'l", "apostrophe-contraction-error"]], "we (wi)ll → we'll. Without the apostrophe it is a different word: well."),
      t("apos-short", "What is the short form of 'they have'?", "they've", [["theyve", "apostrophe-contraction-error"], ["they'have", "apostrophe-contraction-error"], ["the'yve", "apostrophe-contraction-error"]], "they (ha)ve → they've."),
      t("apos-short", "What is the short form of 'she is'?", "she's", [["shes", "apostrophe-contraction-error"], ["she'is", "apostrophe-contraction-error"], ["sh'es", "apostrophe-contraction-error"]], "she (i)s → she's."),
      t("apos-short", "What is the short form of 'will not'?", "won't", [["willn't", "apostrophe-contraction-error"], ["wont", "apostrophe-contraction-error"], ["wo'nt", "apostrophe-contraction-error"]], "WILL NOT is special: it becomes WON'T."),
      t("apos-short", "What is the short form of 'you are'?", "you're", [["your", "apostrophe-contraction-error"], ["youre", "apostrophe-contraction-error"], ["you'are", "apostrophe-contraction-error"]], "you (a)re → you're. YOUR (no apostrophe) means 'belonging to you'."),
      t("apos-short", "What is the long form of \"didn't\"?", "did not", [["do not", "apostrophe-contraction-error"], ["does not", "apostrophe-contraction-error"], ["did it", "apostrophe-contraction-error"]], "DIDN'T = DID NOT."),
      t("apos-short", "Which sentence is correct?", "We're going to the fair.", [["Were going to the fair.", "apostrophe-contraction-error"], ["We'are going to the fair.", "apostrophe-contraction-error"], ["Wer'e going to the fair.", "apostrophe-contraction-error"]], "we (a)re → we're."),
    ],
    // Gate B (15 = 3 sub-topics × 5)
    "eq-u9-apos-gate-pool": [
      t("apos-short", "What is the short form of 'it is'?", "it's", [["its", "its-its-mixup"], ["it'is", "apostrophe-contraction-error"], ["its'", "apostrophe-contraction-error"]], "it (i)s → it's."),
      t("apos-short", "What is the short form of 'cannot'?", "can't", [["cant", "apostrophe-contraction-error"], ["ca'nt", "apostrophe-contraction-error"], ["cann't", "apostrophe-contraction-error"]], "can(no)t → can't."),
      t("apos-short", "What is the short form of 'I would'?", "I'd", [["Id", "apostrophe-contraction-error"], ["I'wd", "apostrophe-contraction-error"], ["I'ld", "apostrophe-contraction-error"]], "I (woul)d → I'd."),
      t("apos-short", "What is the long form of \"should've\"?", "should have", [["should of", "apostrophe-contraction-error"], ["should if", "apostrophe-contraction-error"], ["should love", "apostrophe-contraction-error"]], "SHOULD'VE = SHOULD HAVE. It sounds like 'should of', but that is wrong."),
      t("apos-short", "Which sentence is correct?", "They aren't ready yet.", [["They arent ready yet.", "apostrophe-contraction-error"], ["They are'nt ready yet.", "apostrophe-contraction-error"], ["They ar'ent ready yet.", "apostrophe-contraction-error"]], "are n(o)t → aren't."),
      t("apos-owner", "Which means 'the toy that belongs to the baby'?", "the baby's toy", [["the babys toy", "apostrophe-owner-error"], ["the babies toy", "apostrophe-plural-error"], ["the baby toy's", "apostrophe-owner-error"]], "One baby owns it: the baby's toy."),
      t("apos-owner", "Which sentence is correct?", "Meera's cat is asleep.", [["Meeras cat is asleep.", "apostrophe-owner-error"], ["Meera,s cat is asleep.", "apostrophe-owner-error"], ["Meeras' cat is asleep.", "apostrophe-owner-error"]], "The cat belongs to Meera: Meera's cat."),
      t("apos-owner", "Which sentence is correct?", "My brother's bike is red.", [["My brothers bike is red.", "apostrophe-owner-error"], ["My brother bike's is red.", "apostrophe-owner-error"], ["My broth'ers bike is red.", "apostrophe-owner-error"]], "The bike belongs to my brother: my brother's bike."),
      t("apos-owner", "There is ONE teacher. Where does the apostrophe go in 'the teachers desk'?", "teacher's", [["teachers'", "apostrophe-owner-error"], ["teache'rs", "apostrophe-owner-error"], ["desk's", "apostrophe-owner-error"]], "One teacher owns the desk: the teacher's desk."),
      t("apos-owner", "Which sentence is correct?", "The cat's bowl is empty.", [["The cats bowl is empty.", "apostrophe-owner-error"], ["The cat bowl's is empty.", "apostrophe-owner-error"], ["The ca'ts bowl is empty.", "apostrophe-owner-error"]], "The bowl belongs to the cat: the cat's bowl."),
      t("apos-plural", "Which sentence is correct?", "The boys played football.", [["The boy's played football.", "apostrophe-plural-error"], ["The boys' played football.", "apostrophe-plural-error"], ["The bo'ys played football.", "apostrophe-plural-error"]], "BOYS is just a plural here (nobody owns anything), so no apostrophe."),
      t("apos-plural", "Which sign is correct?", "Cold drinks here", [["Cold drink's here", "apostrophe-plural-error"], ["Cold drinks' here", "apostrophe-plural-error"], ["Cold dri'nks here", "apostrophe-plural-error"]], "DRINKS is a plural: no apostrophe."),
      t("apos-plural", "Which sentence is correct?", "I have two pencils and a ruler.", [["I have two pencil's and a ruler.", "apostrophe-plural-error"], ["I have two pencils' and a ruler.", "apostrophe-plural-error"], ["I have two pencils and a ruler's.", "apostrophe-plural-error"]], "PENCILS is a plural: no apostrophe."),
      t("apos-plural", "There is ONE girl. Which word needs an apostrophe? 'The girls kite flew higher than the birds.'", "girls → girl's", [["birds → bird's", "apostrophe-plural-error"], ["kite → kite's", "apostrophe-owner-error"], ["flew → flew's", "apostrophe-owner-error"]], "The kite belongs to the girl: the girl's kite. BIRDS is just a plural."),
      t("apos-plural", "Which sentence is correct?", "Lots of cars were stuck in the traffic.", [["Lots of car's were stuck in the traffic.", "apostrophe-plural-error"], ["Lots of cars' were stuck in the traffic.", "apostrophe-plural-error"], ["Lot's of cars were stuck in the traffic.", "apostrophe-plural-error"]], "LOTS and CARS are plurals: no apostrophes."),
    ],
    // Champion leaf (Class 5+): its / it's and plural owners (8)
    "eq-u9-apos-champion": [
      t("apos-champion", "Which sentence is correct?", "It's raining today.", [["Its raining today.", "its-its-mixup"], ["Its' raining today.", "its-its-mixup"], ["It is' raining today.", "apostrophe-contraction-error"]], "IT'S = IT IS: It is raining today."),
      t("apos-champion", "Which sentence is correct?", "The dog wagged its tail.", [["The dog wagged it's tail.", "its-its-mixup"], ["The dog wagged its' tail.", "its-its-mixup"], ["The dog wagged it is tail.", "its-its-mixup"]], "ITS (no apostrophe) means 'belonging to it', like his and her."),
      t("apos-champion", "Which means 'the room shared by two girls'?", "the girls' room", [["the girl's room", "apostrophe-owner-error"], ["the girls room", "apostrophe-owner-error"], ["the girls's room", "apostrophe-owner-error"]], "Many owners ending in S: add only the apostrophe after the S: girls'."),
      t("apos-champion", "Which sentence is correct?", "The children's park is new.", [["The childrens' park is new.", "apostrophe-owner-error"], ["The childrens park is new.", "apostrophe-owner-error"], ["The children park's is new.", "apostrophe-owner-error"]], "CHILDREN is already plural without S, so add 's: children's."),
      t("apos-champion", "The nests belong to MANY birds. Which is correct?", "the birds' nests", [["the bird's nests", "apostrophe-owner-error"], ["the birds nests", "apostrophe-owner-error"], ["the birds's nests", "apostrophe-owner-error"]], "Many birds (ending in S) → the apostrophe goes after the S: birds'."),
      t("apos-champion", "Fill in the blank: '___ time for lunch.'", "It's", [["Its", "its-its-mixup"], ["Its'", "its-its-mixup"], ["It is'", "apostrophe-contraction-error"]], "IT'S = IT IS: It is time for lunch."),
      t("apos-champion", "Fill in the blank: 'The bird built ___ nest in the tree.'", "its", [["it's", "its-its-mixup"], ["its'", "its-its-mixup"], ["it is", "its-its-mixup"]], "The nest belongs to the bird: ITS nest (like HER nest)."),
      t("apos-champion", "Which sentence is correct?", "The women's team won the match.", [["The womens' team won the match.", "apostrophe-owner-error"], ["The womens team won the match.", "apostrophe-owner-error"], ["The woman's' team won the match.", "apostrophe-owner-error"]], "WOMEN is plural without S, so add 's: women's."),
    ],

    // Topic C: Speech Marks (practice, 8)
    "eq-u9-speech-quiz": [
      t("speech-words", "Which sentence uses speech marks correctly?", "\"I am hungry,\" said Veer.", [["I am \"hungry,\" said Veer.", "speech-marks-error"], ["\"I am hungry, said Veer.\"", "speech-marks-error"], ["I am hungry, \"said Veer.\"", "speech-marks-error"]], "Only the words Veer said go inside: \"I am hungry,\""),
      t("speech-words", "What do speech marks show?", "The exact words someone says", [["That someone owns something", "apostrophe-owner-error"], ["A list of things", "comma-list-error"], ["The end of a question", "speech-marks-error"]], "Speech marks go around the exact spoken words."),
      t("speech-words", "Mum said come inside now. Which words go inside the speech marks?", "come inside now", [["Mum said", "speech-marks-error"], ["said come", "speech-marks-error"], ["Mum said come inside now", "speech-marks-error"]], "Mum's words were: Come inside now. 'Mum said' stays outside."),
      t("speech-capital", "Which sentence is correct?", "Asha said, \"We won the match!\"", [["Asha said, \"we won the match!\"", "speech-capital-error"], ["asha said, \"We won the match!\"", "missing-capital"], ["Asha said, \"We won the Match!\"", "speech-capital-error"]], "Spoken words start with a capital (We), and names always have one (Asha)."),
      t("speech-capital", "Raj asked, \"Where is my book?\" Why does 'Where' start with a capital letter?", "Spoken words start with a capital letter.", [["Where is a name.", "speech-capital-error"], ["It is the last word.", "speech-capital-error"], ["Every word in a question has a capital.", "speech-capital-error"]], "The spoken words start at WHERE, so it gets a capital."),
      t("speech-punct", "Which sentence is correct?", "\"Time to go,\" said Tara.", [["\"Time to go\" said Tara.", "speech-punctuation-error"], ["\"Time to go.\" said Tara.", "speech-punctuation-error"], ["\"Time, to go\" said Tara.", "speech-punctuation-error"]], "When 'said Tara' comes after, the spoken words end with a comma inside the speech marks."),
      t("speech-punct", "Which sentence is correct?", "\"Are you ready?\" asked Dad.", [["\"Are you ready\" asked Dad?", "speech-punctuation-error"], ["\"Are you ready,\" asked Dad?", "speech-punctuation-error"], ["Are you ready? \"asked Dad.\"", "speech-marks-error"]], "The question mark belongs to the spoken question, so it goes inside: \"Are you ready?\""),
      t("speech-punct", "\"Can I come too\" asked Nikhil. Where does the question mark go?", "After 'too', inside the speech marks", [["After 'Nikhil'", "speech-punctuation-error"], ["After 'Can'", "speech-punctuation-error"], ["It needs no question mark", "speech-punctuation-error"]], "Nikhil asked a question, so: \"Can I come too?\" asked Nikhil."),
    ],
    // Practice leaf: Speech Mark Detective (8)
    "eq-u9-speech-detective": [
      t("speech-words", "Which sentence is correct?", "\"I love mangoes,\" said Pooja.", [["\"I love mangoes, said Pooja.\"", "speech-marks-error"], ["I love \"mangoes,\" said Pooja.", "speech-marks-error"], ["\"I love\" mangoes, said Pooja.", "speech-marks-error"]], "Only Pooja's words go inside: \"I love mangoes,\""),
      t("speech-words", "Which sentence is correct?", "Grandpa said, \"Drink your milk.\"", [["Grandpa \"said, Drink your milk.\"", "speech-marks-error"], ["\"Grandpa said,\" Drink your milk.", "speech-marks-error"], ["Grandpa said, Drink \"your milk.\"", "speech-marks-error"]], "The speech marks hug Grandpa's words: \"Drink your milk.\""),
      t("speech-words", "\"The bus is late,\" said Mr Rao. Which words were spoken?", "The bus is late", [["said Mr Rao", "speech-marks-error"], ["late, said", "speech-marks-error"], ["The bus is late, said Mr Rao", "speech-marks-error"]], "The words inside the speech marks are the spoken words."),
      t("speech-words", "Which sentence needs speech marks?", "Stop the car shouted Papa.", [["Papa stopped the car.", "speech-marks-error"], ["Papa told us to stop.", "speech-marks-error"], ["The car stopped suddenly.", "speech-marks-error"]], "Papa's exact words were 'Stop the car!' → \"Stop the car!\" shouted Papa."),
      t("speech-words", "Which sentence is correct?", "\"Look at the rainbow!\" cried Mina.", [["\"Look at the rainbow\" cried Mina!", "speech-punctuation-error"], ["\"Look at the rainbow!\" Cried Mina.", "speech-capital-error"], ["Look at the rainbow! \"cried Mina.\"", "speech-marks-error"]], "The ! goes inside with Mina's words, and 'cried' stays small."),
      t("speech-words", "Which sentence does NOT need speech marks?", "Sunil said that he was tired.", [["I am tired said Sunil.", "speech-marks-error"], ["Sunil said I am tired.", "speech-marks-error"], ["Can I rest asked Sunil.", "speech-marks-error"]], "SAID THAT reports what Sunil said, not his exact words, so no speech marks."),
      t("speech-words", "Which sentence is correct?", "\"Please sit down,\" said the teacher.", [["\"Please sit down\" said the teacher.", "speech-punctuation-error"], ["\"Please sit down,\" Said the teacher.", "speech-capital-error"], ["\"please sit down,\" said the teacher.", "speech-capital-error"]], "Capital P to start the words, a comma inside, and small 'said'."),
      t("speech-words", "Which sentence is correct?", "Neha asked, \"Is it raining?\"", [["Neha asked, \"Is it raining\"?", "speech-punctuation-error"], ["Neha asked, \"is it raining?\"", "speech-capital-error"], ["Neha asked \"Is it raining?", "speech-marks-error"]], "Comma before the speech, capital I, and the ? inside the closing speech mark."),
    ],
    // Gate C (15 = 3 sub-topics × 5)
    "eq-u9-speech-gate-pool": [
      t("speech-words", "Which sentence is correct?", "\"We are late,\" said Rahul.", [["\"We are late, said Rahul.\"", "speech-marks-error"], ["We are \"late,\" said Rahul.", "speech-marks-error"], ["We are late, \"said Rahul.\"", "speech-marks-error"]], "Only Rahul's words go inside the speech marks."),
      t("speech-words", "Miss Das said open your books. Which words go inside the speech marks?", "Open your books", [["Miss Das said", "speech-marks-error"], ["said open", "speech-marks-error"], ["your books", "speech-marks-error"]], "Her exact words: \"Open your books.\""),
      t("speech-words", "Which sentence needs speech marks?", "I found a coin said Leela.", [["Leela found a coin.", "speech-marks-error"], ["Leela said that she found a coin.", "speech-marks-error"], ["A coin was on the floor.", "speech-marks-error"]], "Leela's exact words: \"I found a coin,\" said Leela."),
      t("speech-words", "Which sentence is correct?", "Dad said, \"Turn off the light.\"", [["Dad said, \"Turn off the light.", "speech-marks-error"], ["Dad said, Turn off the light.\"", "speech-marks-error"], ["\"Dad said, Turn off the light.\"", "speech-marks-error"]], "Speech marks open before TURN and close after the full stop."),
      t("speech-words", "What do speech marks go around?", "Only the words that are spoken", [["The name of the speaker", "speech-marks-error"], ["The whole sentence, always", "speech-marks-error"], ["Only the word 'said'", "speech-marks-error"]], "Speech marks hug the spoken words and nothing else."),
      t("speech-capital", "Which sentence is correct?", "Mum called, \"Dinner is ready!\"", [["Mum called, \"dinner is ready!\"", "speech-capital-error"], ["mum called, \"Dinner is ready!\"", "missing-capital"], ["Mum called, \"Dinner Is Ready!\"", "speech-capital-error"]], "Capital M for the start of the sentence, capital D for the start of the speech."),
      t("speech-capital", "Which sentence is correct?", "\"It is my turn,\" said Kiran.", [["\"it is my turn,\" said Kiran.", "speech-capital-error"], ["\"It is my turn,\" Said Kiran.", "speech-capital-error"], ["\"It is my turn,\" said kiran.", "missing-capital"]], "Capital I to start the speech, small 'said', capital K for the name."),
      t("speech-capital", "ravi said, \"where is the ball?\" Which TWO words need capital letters?", "ravi and where", [["said and ball", "speech-capital-error"], ["ravi and ball", "speech-capital-error"], ["where and said", "speech-capital-error"]], "Ravi is a name and starts the sentence; Where starts the spoken words."),
      t("speech-capital", "Which sentence is correct?", "Sita whispered, \"The baby is asleep.\"", [["Sita whispered, \"the baby is asleep.\"", "speech-capital-error"], ["Sita Whispered, \"The baby is asleep.\"", "speech-capital-error"], ["Sita whispered, \"The Baby is asleep.\"", "speech-capital-error"]], "Only the first spoken word (The) gets a capital."),
      t("speech-capital", "Which sentence is correct?", "\"Can we go now?\" asked Arun.", [["\"can we go now?\" asked Arun.", "speech-capital-error"], ["\"Can we go now?\" Asked Arun.", "speech-capital-error"], ["\"Can we go now?\" asked arun.", "missing-capital"]], "Capital C to start the speech, small 'asked', capital A for Arun."),
      t("speech-punct", "Which sentence is correct?", "\"I will help you,\" said Anil.", [["\"I will help you\" said Anil.", "speech-punctuation-error"], ["\"I will help you.\" said Anil.", "speech-punctuation-error"], ["\"I will help, you\" said Anil.", "speech-punctuation-error"]], "A comma inside the speech marks, then 'said Anil.'"),
      t("speech-punct", "Which sentence is correct?", "\"What time is it?\" asked Meena.", [["\"What time is it\" asked Meena?", "speech-punctuation-error"], ["\"What time is it,\" asked Meena?", "speech-punctuation-error"], ["\"What time is it.\" asked Meena.", "speech-punctuation-error"]], "Meena's words are a question, so the ? goes inside."),
      t("speech-punct", "Which sentence is correct?", "\"Run!\" shouted the coach.", [["\"Run\" shouted the coach!", "speech-punctuation-error"], ["\"Run!\" Shouted the coach.", "speech-capital-error"], ["\"Run,\" shouted the coach!", "speech-punctuation-error"]], "The ! belongs to the shout, so it goes inside: \"Run!\""),
      t("speech-punct", "Which sentence is correct?", "Papa said, \"We leave at six.\"", [["Papa said \"We leave at six\".", "speech-punctuation-error"], ["Papa said, \"We leave at six\"", "speech-punctuation-error"], ["Papa said, We leave at six.\"", "speech-marks-error"]], "Comma after 'said', and the full stop inside the closing speech mark."),
      t("speech-punct", "Which sentence needs a comma before the closing speech mark?", "\"The tea is hot\" said Gran.", [["\"Is the tea hot?\" asked Gran.", "speech-punctuation-error"], ["\"The tea is hot!\" cried Gran.", "speech-punctuation-error"], ["Gran said, \"The tea is hot.\"", "speech-punctuation-error"]], "It should be: \"The tea is hot,\" said Gran."),
    ],

    // Unit 9 Boss (12, mixed; works for every class that sees the unit)
    "eq-u9-test": [
      q("Which sentence is correct?", "We need rice, dal and salt.", [["We need, rice dal and salt.", "comma-extra-error"], ["We need rice dal, and, salt.", "comma-list-error"], ["We need rice, dal and, salt.", "comma-extra-error"]], "Rice, dal and salt: a comma between the first two, then AND."),
      q("Which sentence is correct?", "Yes, you may go out.", [["Yes you, may go out.", "comma-address-error"], ["Yes you may, go out.", "comma-address-error"], ["Yes you may go, out.", "comma-address-error"]], "A comma right after YES."),
      q("Which sentence has a WRONG comma?", "The little puppy, barked at me.", [["No, the puppy did not bark.", "comma-address-error"], ["Ravi, the puppy is barking.", "comma-address-error"], ["We saw dogs, cats and cows.", "comma-list-error"]], "No comma between THE LITTLE PUPPY and BARKED."),
      q("What is the short form of 'does not'?", "doesn't", [["dosen't", "apostrophe-contraction-error"], ["doesnt", "apostrophe-contraction-error"], ["does'nt", "apostrophe-contraction-error"]], "does n(o)t → doesn't."),
      q("Which shows that the pen belongs to Nisha?", "Nisha's pen", [["Nishas pen", "apostrophe-owner-error"], ["Nishas' pen", "apostrophe-owner-error"], ["Nisha pen's", "apostrophe-owner-error"]], "Add 's to the owner: Nisha's pen."),
      q("Which sign is correct?", "Fresh eggs sold here", [["Fresh egg's sold here", "apostrophe-plural-error"], ["Fresh eggs' sold here", "apostrophe-plural-error"], ["Fresh egg,s sold here", "apostrophe-plural-error"]], "EGGS is a plural: no apostrophe."),
      q("Which sentence is correct?", "\"I can swim,\" said Tina.", [["\"I can swim, said Tina.\"", "speech-marks-error"], ["I can \"swim,\" said Tina.", "speech-marks-error"], ["\"I can swim\" Said Tina.", "speech-punctuation-error"]], "Speech marks around Tina's words, a comma inside, small 'said'."),
      q("Which sentence is correct?", "Ali asked, \"Where are you going?\"", [["Ali asked, \"where are you going?\"", "speech-capital-error"], ["Ali asked, \"Where are you going\"?", "speech-punctuation-error"], ["Ali asked, Where are you going?\"", "speech-marks-error"]], "Capital W, and the ? inside the closing speech mark."),
      q("Which sentence needs speech marks?", "Help me shouted the boy.", [["The boy asked for help.", "speech-marks-error"], ["The boy said that he needed help.", "speech-marks-error"], ["Help came quickly.", "speech-marks-error"]], "The boy's exact words: \"Help me!\" shouted the boy."),
      q("What does \"we've\" mean?", "we have", [["we will", "apostrophe-contraction-error"], ["we were", "apostrophe-contraction-error"], ["we are", "apostrophe-contraction-error"]], "we (ha)ve → we've."),
      q("Which sentence is correct?", "My sister's doll is pink.", [["My sisters doll is pink.", "apostrophe-owner-error"], ["My sister doll's is pink.", "apostrophe-owner-error"], ["My sis'ters doll is pink.", "apostrophe-owner-error"]], "The doll belongs to my sister: my sister's doll."),
      q("Which sentence is correct?", "\"Wait for me,\" called Leela.", [["\"Wait for me\" called Leela.", "speech-punctuation-error"], ["\"wait for me,\" called Leela.", "speech-capital-error"], ["\"Wait for me,\" Called Leela.", "speech-capital-error"]], "Capital W, a comma inside, small 'called'."),
    ],
  },

  // ---------- Reading ----------
  readings: {
    "eq-read-class-newspaper": {
      name: "The Class Newspaper",
      author: "Apprec8",
      mode: "fullPassage",
      glossary: {
        noticeboard: "a board on a wall where notes and papers are pinned for everyone to read",
        famous: "known by a lot of people",
      },
      paragraphs: [
        "Class 5-B wanted to make a newspaper for the whole school. \"What shall we call it?\" asked Mrs Kapoor, their teacher. Ideas flew around the room: The Daily Duck, School Stars and The Bell. In the end, everyone voted for The Bell, because the school bell rang every morning.",
        "Each child got a job. Farah was the editor, Arjun took the photos, and Leela and Dev wrote the stories. \"I'll write about the new library,\" said Leela. \"I'll write about our cricket team,\" said Dev.",
        "Arjun's camera was old, but it worked well. He took pictures of the library's tall shelves, the players' muddy shoes and the cook's famous samosas. \"Smile!\" he shouted before every photo.",
        "On Thursday, Farah read every story. She found missing commas, a few capital letters in the wrong places and one big mistake: Dev had written that the team won by 100 runs when they had really won by 10. \"Numbers matter,\" Farah said. \"A newspaper must tell the truth.\"",
        "On Friday, the first copy of The Bell was pinned on the noticeboard. A crowd of children gathered to read it. Mrs Kapoor smiled. \"This is the best start to a newspaper I have seen,\" she said.",
      ],
      questions: [
        {
          ...q("Why did the class choose the name The Bell?", "The school bell rang every morning.", [["Mrs Kapoor chose it for them.", "detail-missed"], ["It was the shortest name.", "not-in-passage"], ["A duck rang a bell.", "not-in-passage"]], "The passage says: 'because the school bell rang every morning.'"),
          evidence: { paragraph: 0, text: "because the school bell rang every morning" },
        },
        {
          ...q("What was Arjun's job?", "Taking the photos", [["Writing about cricket", "detail-missed"], ["Being the editor", "detail-missed"], ["Pinning up the paper", "not-in-passage"]], "Arjun took the photos."),
          evidence: { paragraph: 1, text: "Arjun took the photos" },
        },
        {
          ...q("In 'the players' muddy shoes', why does the apostrophe come after the S?", "The shoes belong to many players.", [["There is only one player.", "apostrophe-owner-error"], ["It is a short form of 'players is'.", "apostrophe-contraction-error"], ["SHOES is a plural word.", "apostrophe-plural-error"]], "Many players own the shoes, and PLAYERS ends in S, so the apostrophe goes after it: players'."),
          evidence: { paragraph: 2, text: "the players' muddy shoes" },
        },
        {
          ...q("The word 'editor' in the passage means ___.", "the person who checks the stories", [["the person who takes the photos", "word-meaning"], ["the person who rings the bell", "word-meaning"], ["the person who sells the paper", "word-meaning"]], "Farah, the editor, read every story and found the mistakes."),
          evidence: { paragraph: 3, text: "On Thursday, Farah read every story." },
        },
        {
          ...q("Select the INCORRECT statement according to the passage.", "Dev's team really won by 100 runs.", [["Leela wrote about the new library.", "statement-check"], ["Arjun's camera was old.", "statement-check"], ["The Bell was pinned on the noticeboard.", "statement-check"]], "They really won by 10 runs. Dev's 100 was the mistake Farah found."),
          evidence: { paragraph: 3, text: "when they had really won by 10" },
        },
        {
          ...q("What does Farah mean by 'Numbers matter'?", "A wrong number can make a story untrue.", [["Children should learn more maths.", "inference"], ["Newspapers need page numbers.", "inference"], ["Dev is bad at cricket.", "inference"]], "One wrong number (100 for 10) would have told everyone something false."),
          evidence: { paragraph: 3, text: "\"Numbers matter,\" Farah said." },
        },
        {
          ...q("What happened LAST?", "Mrs Kapoor praised the newspaper.", [["The class voted for a name.", "sequence"], ["Farah found the mistakes.", "sequence"], ["Arjun took the photos.", "sequence"]], "On Friday, after the paper was pinned up, Mrs Kapoor said it was the best start she had seen."),
          evidence: { paragraph: 4, text: "\"This is the best start to a newspaper I have seen,\" she said." },
        },
      ],
    },
  },
  wordTables: {},

  nodes: [
    unit("eq-u9", 9, "Punctuation Power"),

    // Topic A: Commas
    commas,
    withSubtopic(practice("eq-u9-commas-p1", commas, 1, "Commas in Lists", "medium", [quiz("eq-u9-comma-lists")]), "comma-list"),
    gate("eq-u9-commas-gate", commas, "Comma Challenge", "eq-u9-commas-gate-pool", {
      "comma-list": "Commas in lists",
      "comma-address": "Yes, no and names",
      "comma-extra": "Commas that don't belong",
    }),
    endless(commas),

    // Topic B: Apostrophes
    apos,
    withSubtopic(practice("eq-u9-apos-p1", apos, 1, "Short Forms", "medium", [quiz("eq-u9-short-forms")]), "apos-short"),
    forGrades(practice("eq-u9-apos-p2", apos, 2, "Champion: Its, It's & Girls'", "hard", [quiz("eq-u9-apos-champion")]), [5, 6, 7, 8, 9, 10, 11, 12]),
    gate("eq-u9-apos-gate", apos, "Apostrophe Challenge", "eq-u9-apos-gate-pool", {
      "apos-short": "Short forms",
      "apos-owner": "Who owns it",
      "apos-plural": "No apostrophe for plurals",
    }),
    endless(apos),

    // Topic C: Speech Marks
    speech,
    withSubtopic(practice("eq-u9-speech-p1", speech, 1, "Speech Mark Detective", "medium", [quiz("eq-u9-speech-detective")]), "speech-words"),
    gate("eq-u9-speech-gate", speech, "Speech Marks Challenge", "eq-u9-speech-gate-pool", {
      "speech-words": "Which words go inside",
      "speech-capital": "Capital letters",
      "speech-punct": ", ? ! inside",
    }),
    endless(speech),

    // Reading & Boss
    u9r,
    boss(
      "eq-u9-boss",
      "eq-u9",
      "Unit 9 Boss",
      "eq-u9-test",
      "Oh no! 👾 The Grammar Gremlin has shaken all the commas, apostrophes and speech marks out of the storybooks! Now nobody knows who is talking or whose bag is whose. Put every mark back in its place to save the stories."
    ),
  ],
};

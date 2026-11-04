// data/englishQuest/units/u7.js: Unit 7, Reported Speech & Passive (Claude, 2026-11-05). Class 5 and up: every node is
// tagged [5..12], so Class 3–4 kids don't see the unit at all (utils/gradeFilter.js). Built per docs/CONTENT_GUIDE.md and
// docs/exam/ieo-pattern.md (Class 5 papers: reported speech, passive voice in the Achievers section). Original questions.
// Ambiguity rule: reported speech keeps the present when it is still true ("She said she is tired" can be fine), so every
// reported-speech question has a clear PAST anchor (yesterday, last week…) that makes the backshift the only right answer.
// Passive options avoid a second tense that would also fit (no "was spoken" next to "is spoken" without a time clue).
import { q, study, quiz, reading, unit, main, practice, gate, withSubtopic, endless, boss, forGrades } from "../helpers.js";

const G = [5, 6, 7, 8, 9, 10, 11, 12];
const t = (subtopic, question, correct, wrongs, explanation) => ({ subtopic, ...q(question, correct, wrongs, explanation) });

const passive = forGrades(main("eq-u7-passive", "eq-u7", 0, "Active & Passive", [study("eq-u7-passive"), quiz("eq-u7-passive-quiz")]), G);
const reported = forGrades(main("eq-u7-reported", "eq-u7", 1, "Reported Speech", [study("eq-u7-reported"), quiz("eq-u7-reported-quiz")]), G);
const u7r = forGrades(main("eq-u7-reading", "eq-u7", 2, "Reading: The Lost Library Book", [reading("eq-read-lost-book")]), G);

export default {
  // ---------- Study Pages ----------
  studyPages: {
    "eq-u7-passive": {
      name: "Active and Passive",
      author: "Apprec8",
      content: `### 🔄 Who did it, or what happened?

| Active (the doer comes first) | Passive (the thing comes first) |
|---|---|
| **Meena wrote** a poem. | A poem **was written** by Meena. |
| **People speak** English here. | English **is spoken** here. |

---

### 🧩 How to build the passive

**is / are / was / were + past participle** (the third form)

| Time | Passive |
|---|---|
| present | The room **is cleaned** every day. The rooms **are cleaned** every day. |
| past | The cake **was baked** yesterday. The cakes **were baked** yesterday. |

> ⚠️ Keep the same TIME as the active sentence: *Meena **wrote*** (past) → *was written* (past).

> ⚠️ Use the third form: was **written**, not was wrote.

---

### 🙋 The doer comes after BY

*The window was broken **by the ball**.*

When the doer is not important, leave it out: *English is spoken here.*

---

### 🎯 Now you can…
- build **is/are/was/were + third form**
- keep the same time as the active sentence
- add the doer with **by**`,
    },
    "eq-u7-reported": {
      name: "Reported Speech",
      author: "Apprec8",
      content: `### 🗣️ Telling someone what another person said

| Direct speech | Reported speech |
|---|---|
| Riya said, "I **am** tired." | Riya said that **she was** tired. |

---

### ⏪ One step back in time

When we report something said in the past, the verb goes one step back:

| Said | Reported |
|---|---|
| am / is | was |
| are | were |
| play / plays | played |
| will | would |
| can | could |

---

### 👤 Change the people words

*Ravi said, "**I** like **my** bike."* → *Ravi said that **he** liked **his** bike.*

---

### ❓ Questions and 📢 orders

| Direct | Reported |
|---|---|
| She asked, "Are you hungry?" | She asked me **if I was** hungry. |
| He asked, "Where do you live?" | He asked me **where I lived**. |
| The teacher said, "Sit down." | The teacher **told us to sit** down. |

> ⚠️ **told** needs a person after it: told **me**, told **us**. **said** does not: *She said that…*

---

### 🎯 Now you can…
- move the verb one step back
- change I/my to he/she/his/her
- report questions (if, where…) and orders (told … to)`,
    },
  },

  // ---------- Quizzes ----------
  quizzes: {
    // Topic A: Active & Passive (practice, 8)
    "eq-u7-passive-quiz": [
      t("passive-form", "Complete the sentence: 'Yesterday the cake ___ by my mother.'", "was baked", [["is baked", "passive-tense-error"], ["baked", "passive-form-error"], ["was bake", "passive-form-error"]], "YESTERDAY → past passive: WAS + third form BAKED."),
      t("passive-form", "Complete the sentence: 'English ___ in many countries today.'", "is spoken", [["speaks", "passive-form-error"], ["is speak", "passive-form-error"], ["are spoken", "passive-number-error"]], "TODAY → present passive: English IS SPOKEN."),
      t("passive-form", "Complete the sentence: 'These toys ___ in Channapatna.'", "are made", [["is made", "passive-number-error"], ["are make", "passive-form-error"], ["makes", "passive-form-error"]], "Toys are many → ARE + third form MADE. (Channapatna in Karnataka is famous for wooden toys.)"),
      t("active-to-passive", "Which is the passive of 'Meena wrote a poem'?", "A poem was written by Meena.", [["A poem is written by Meena.", "passive-tense-error"], ["Meena was written a poem.", "passive-form-error"], ["A poem was wrote by Meena.", "passive-form-error"]], "WROTE is past → WAS + WRITTEN. The poem comes first."),
      t("active-to-passive", "Which is the passive of 'The cat drank the milk'?", "The milk was drunk by the cat.", [["The milk was drank by the cat.", "passive-form-error"], ["The cat was drunk by the milk.", "passive-form-error"], ["The milk is drunk by the cat.", "passive-tense-error"]], "DRANK is past → WAS + third form DRUNK."),
      t("passive-agent", "Pick the right word: 'The window was broken ___ the ball.'", "by", [["from", "passive-agent-error"], ["with", "passive-agent-error"], ["of", "passive-agent-error"]], "In the passive, the doer comes after BY."),
      t("passive-agent", "In 'The letter was posted by Kabir', who did the action?", "Kabir", [["The letter", "passive-agent-error"], ["The post office", "passive-agent-error"], ["Nobody did it", "passive-agent-error"]], "The doer comes after BY: Kabir posted the letter."),
      t("passive-form", "Complete the sentence: 'The rooms ___ every morning.'", "are cleaned", [["is cleaned", "passive-number-error"], ["are clean", "passive-form-error"], ["cleaning", "passive-form-error"]], "Every morning → present. Rooms are many → ARE CLEANED."),
    ],
    // Practice leaf: Change to passive (8)
    "eq-u7-passive-change": [
      t("active-to-passive", "Which is the passive of 'Riya painted the gate'?", "The gate was painted by Riya.", [["The gate is painted by Riya.", "passive-tense-error"], ["Riya was painted by the gate.", "passive-form-error"], ["The gate was paint by Riya.", "passive-form-error"]], "PAINTED is past → WAS PAINTED; the gate comes first."),
      t("active-to-passive", "Which is the passive of 'The farmers grow rice'?", "Rice is grown by the farmers.", [["Rice was grown by the farmers.", "passive-tense-error"], ["Rice is grew by the farmers.", "passive-form-error"], ["The farmers are grown by rice.", "passive-form-error"]], "GROW is present → IS + third form GROWN."),
      t("active-to-passive", "Which is the passive of 'Dadi tells stories'?", "Stories are told by Dadi.", [["Stories is told by Dadi.", "passive-number-error"], ["Stories were told by Dadi.", "passive-tense-error"], ["Dadi is told by stories.", "passive-form-error"]], "TELLS is present; stories are many → ARE TOLD."),
      t("active-to-passive", "Which is the passive of 'The dog bit the postman'?", "The postman was bitten by the dog.", [["The postman was bit by the dog.", "passive-form-error"], ["The dog was bitten by the postman.", "passive-form-error"], ["The postman is bitten by the dog.", "passive-tense-error"]], "BIT is past → WAS + third form BITTEN."),
      t("active-to-passive", "Which is the passive of 'Arjun opened the windows'?", "The windows were opened by Arjun.", [["The windows was opened by Arjun.", "passive-number-error"], ["The windows are opened by Arjun.", "passive-tense-error"], ["Arjun was opened by the windows.", "passive-form-error"]], "Windows are many and it is past → WERE OPENED."),
      t("active-to-passive", "Which is the passive of 'The bees make honey'?", "Honey is made by the bees.", [["Honey was made by the bees.", "passive-tense-error"], ["Honey is make by the bees.", "passive-form-error"], ["The bees are made by honey.", "passive-form-error"]], "MAKE is present → IS MADE."),
      t("active-to-passive", "Which is the passive of 'Sana sang a song'?", "A song was sung by Sana.", [["A song was sang by Sana.", "passive-form-error"], ["A song is sung by Sana.", "passive-tense-error"], ["Sana was sung by a song.", "passive-form-error"]], "SANG is past → WAS + third form SUNG."),
      t("active-to-passive", "Which is the passive of 'The children planted ten trees'?", "Ten trees were planted by the children.", [["Ten trees was planted by the children.", "passive-number-error"], ["Ten trees are planted by the children.", "passive-tense-error"], ["The children were planted by ten trees.", "passive-form-error"]], "Trees are many, and PLANTED is past → WERE PLANTED."),
    ],
    // Gate pool (15): passive-form × 5, active-to-passive × 5, passive-agent × 5
    "eq-u7-passive-gate-pool": [
      t("passive-form", "Complete the sentence: 'Last year a new bridge ___ over the river.'", "was built", [["is built", "passive-tense-error"], ["was build", "passive-form-error"], ["built", "passive-form-error"]], "LAST YEAR → WAS + third form BUILT."),
      t("passive-form", "Complete the sentence: 'Milk ___ every morning by the milkman.'", "is delivered", [["was delivered", "passive-tense-error"], ["is deliver", "passive-form-error"], ["are delivered", "passive-number-error"]], "EVERY MORNING → present: IS DELIVERED."),
      t("passive-form", "Complete the sentence: 'The letters ___ yesterday.'", "were posted", [["was posted", "passive-number-error"], ["are posted", "passive-tense-error"], ["were post", "passive-form-error"]], "Letters are many, YESTERDAY is past → WERE POSTED."),
      t("passive-form", "Which sentence is correct?", "The match was won by our school.", [["The match was win by our school.", "passive-form-error"], ["The match was winned by our school.", "passive-form-error"], ["The match were won by our school.", "passive-number-error"]], "WAS + third form WON (one match → WAS)."),
      t("passive-form", "Complete the sentence: 'Many languages ___ in India.'", "are spoken", [["is spoken", "passive-number-error"], ["are speak", "passive-form-error"], ["speaks", "passive-form-error"]], "Many languages → ARE SPOKEN (a fact, so present)."),
      t("active-to-passive", "Which is the passive of 'Papa washed the car'?", "The car was washed by Papa.", [["The car is washed by Papa.", "passive-tense-error"], ["Papa was washed by the car.", "passive-form-error"], ["The car was wash by Papa.", "passive-form-error"]], "WASHED is past → WAS WASHED."),
      t("active-to-passive", "Which is the passive of 'The teacher checks our books'?", "Our books are checked by the teacher.", [["Our books is checked by the teacher.", "passive-number-error"], ["Our books were checked by the teacher.", "passive-tense-error"], ["The teacher is checked by our books.", "passive-form-error"]], "CHECKS is present; books are many → ARE CHECKED."),
      t("active-to-passive", "Which is the passive of 'Mira broke the glass'?", "The glass was broken by Mira.", [["The glass was broke by Mira.", "passive-form-error"], ["The glass is broken by Mira.", "passive-tense-error"], ["Mira was broken by the glass.", "passive-form-error"]], "BROKE is past → WAS + third form BROKEN."),
      t("active-to-passive", "Which is the passive of 'The chef cuts the vegetables'?", "The vegetables are cut by the chef.", [["The vegetables were cut by the chef.", "passive-tense-error"], ["The vegetables is cut by the chef.", "passive-number-error"], ["The chef is cut by the vegetables.", "passive-form-error"]], "CUTS is present; vegetables are many → ARE CUT."),
      t("active-to-passive", "Which is the passive of 'Rohan caught the ball'?", "The ball was caught by Rohan.", [["The ball was catched by Rohan.", "passive-form-error"], ["The ball is caught by Rohan.", "passive-tense-error"], ["Rohan was caught by the ball.", "passive-form-error"]], "CAUGHT is past → WAS CAUGHT."),
      t("passive-agent", "Pick the right word: 'This picture was drawn ___ my little sister.'", "by", [["from", "passive-agent-error"], ["with", "passive-agent-error"], ["for", "passive-agent-error"]], "The doer comes after BY."),
      t("passive-agent", "In 'The thief was caught by the police', who caught someone?", "The police", [["The thief", "passive-agent-error"], ["Nobody", "passive-agent-error"], ["A neighbour", "passive-agent-error"]], "The doer comes after BY: the police caught the thief."),
      t("passive-agent", "Which sentence has the doer after BY?", "The song was sung by the choir.", [["The choir sang a song.", "passive-agent-error"], ["The song was sung in the hall.", "passive-agent-error"], ["The song is very old.", "passive-agent-error"]], "Passive + BY + doer: by THE CHOIR."),
      t("passive-agent", "In 'Rice is grown in Punjab', why is there no 'by'?", "The doer is not important here.", [["The sentence is not passive.", "passive-agent-error"], ["Rice is the doer.", "passive-agent-error"], ["Punjab is the doer.", "passive-agent-error"]], "When it doesn't matter who does it, the passive leaves out BY + doer."),
      t("passive-agent", "Who did the action in 'The cake was eaten by the guests'?", "The guests", [["The cake", "passive-agent-error"], ["The cook", "passive-agent-error"], ["Nobody did it", "passive-agent-error"]], "The doer comes after BY: the guests ate the cake."),
    ],

    // Topic B: Reported Speech (practice, 8)
    "eq-u7-reported-quiz": [
      t("reported-statements", "Yesterday Riya said, \"I am tired.\" Which is the reported speech?", "Riya said that she was tired.", [["Riya said that she is tired.", "reported-tense-error"], ["Riya said that I was tired.", "reported-pronoun-error"], ["Riya told that she was tired.", "said-told-error"]], "AM → WAS, and I → SHE. SAID (not told) when no person follows."),
      t("reported-statements", "Last week Arjun said, \"I will help you.\" Which is the reported speech?", "Arjun said that he would help me.", [["Arjun said that he will help me.", "reported-tense-error"], ["Arjun said that I would help you.", "reported-pronoun-error"], ["Arjun said that he would helped me.", "reported-tense-error"]], "WILL → WOULD + base form; I → HE; you → ME."),
      t("reported-pronouns", "Last month Ravi said, \"I like my new bike.\" Which is the reported speech?", "Ravi said that he liked his new bike.", [["Ravi said that I liked my new bike.", "reported-pronoun-error"], ["Ravi said that he likes his new bike.", "reported-tense-error"], ["Ravi said that he liked my new bike.", "reported-pronoun-error"]], "I → HE, MY → HIS, LIKE → LIKED."),
      t("reported-pronouns", "Yesterday Meena said, \"My brother can swim.\" Which is the reported speech?", "Meena said that her brother could swim.", [["Meena said that my brother could swim.", "reported-pronoun-error"], ["Meena said that her brother can swim.", "reported-tense-error"], ["Meena said that his brother could swim.", "reported-pronoun-error"]], "MY → HER (Meena), CAN → COULD."),
      t("reported-questions-orders", "Yesterday Mum asked me, \"Are you hungry?\" Which is the reported speech?", "Mum asked me if I was hungry.", [["Mum asked me if I am hungry.", "reported-tense-error"], ["Mum asked me was I hungry.", "reported-question-error"], ["Mum asked me if you were hungry.", "reported-pronoun-error"]], "A yes/no question → IF; ARE YOU → I WAS."),
      t("reported-questions-orders", "This morning the teacher said to us, \"Sit down.\" Which is the reported speech?", "The teacher told us to sit down.", [["The teacher told us sit down.", "reported-order-error"], ["The teacher said us to sit down.", "said-told-error"], ["The teacher told us to sat down.", "reported-order-error"]], "An order → TOLD + person + TO + base form."),
      t("said-told", "Pick the right word: 'Kabir ___ me that he was late.'", "told", [["said", "said-told-error"], ["spoke", "said-told-error"], ["talked", "said-told-error"]], "A person comes after the blank (ME) → TOLD me."),
      t("said-told", "Pick the right word: 'Kabir ___ that he was late.'", "said", [["told", "said-told-error"], ["spoke", "said-told-error"], ["talked", "said-told-error"]], "No person after the blank → SAID that…"),
    ],
    // Practice leaf: Questions and orders (8)
    "eq-u7-reported-qo": [
      t("reported-questions-orders", "Yesterday Dev asked me, \"Where do you live?\" Which is the reported speech?", "Dev asked me where I lived.", [["Dev asked me where do I live.", "reported-question-error"], ["Dev asked me where I live.", "reported-tense-error"], ["Dev asked me where you lived.", "reported-pronoun-error"]], "No DO in reported questions; I + past: where I LIVED."),
      t("reported-questions-orders", "Last week Nani asked us, \"Did you eat?\" Which is the reported speech?", "Nani asked us if we had eaten.", [["Nani asked us did we eat.", "reported-question-error"], ["Nani asked us if you had eaten.", "reported-pronoun-error"], ["Nani asked us if we have eaten.", "reported-tense-error"]], "DID YOU EAT → IF WE HAD EATEN (one step back from the past)."),
      t("reported-questions-orders", "This morning Papa said to me, \"Close the door.\" Which is the reported speech?", "Papa told me to close the door.", [["Papa told me close the door.", "reported-order-error"], ["Papa said me to close the door.", "said-told-error"], ["Papa told me to closed the door.", "reported-order-error"]], "Order → TOLD me TO + base form."),
      t("reported-questions-orders", "Yesterday the coach said to the boys, \"Run faster.\" Which is the reported speech?", "The coach told the boys to run faster.", [["The coach told the boys run faster.", "reported-order-error"], ["The coach said the boys to run faster.", "said-told-error"], ["The coach told the boys to ran faster.", "reported-order-error"]], "Order → TOLD + person + TO + base form."),
      t("reported-questions-orders", "Yesterday Asha asked us, \"Can I come with you?\" Which is the reported speech?", "Asha asked if she could come with us.", [["Asha asked if she can come with us.", "reported-tense-error"], ["Asha asked can she come with us.", "reported-question-error"], ["Asha asked if I could come with us.", "reported-pronoun-error"]], "IF + CAN → COULD; I → SHE."),
      t("reported-questions-orders", "Last week the doctor said to me, \"Do not eat ice cream.\" Which is the reported speech?", "The doctor told me not to eat ice cream.", [["The doctor told me to not ate ice cream.", "reported-order-error"], ["The doctor said me not to eat ice cream.", "said-told-error"], ["The doctor told me do not eat ice cream.", "reported-order-error"]], "A 'do not' order → TOLD me NOT TO + base form."),
      t("reported-questions-orders", "Yesterday Tara asked me, \"What is your name?\" Which is the reported speech?", "Tara asked me what my name was.", [["Tara asked me what is my name.", "reported-question-error"], ["Tara asked me what your name was.", "reported-pronoun-error"], ["Tara asked me what my name is.", "reported-tense-error"]], "Reported questions use sentence order: what my name WAS."),
      t("reported-questions-orders", "Yesterday Sir said to the class, \"Open your books.\" Which is the reported speech?", "Sir told the class to open their books.", [["Sir told the class open your books.", "reported-order-error"], ["Sir said the class to open their books.", "said-told-error"], ["Sir told the class to open your books.", "reported-pronoun-error"]], "TOLD + class + TO open; YOUR → THEIR."),
    ],
    // Gate pool (15): reported-statements × 5, reported-pronouns × 5, reported-questions-orders × 5
    "eq-u7-reported-gate-pool": [
      t("reported-statements", "Yesterday Sana said, \"I am happy.\" Which is the reported speech?", "Sana said that she was happy.", [["Sana said that she is happy.", "reported-tense-error"], ["Sana said that I was happy.", "reported-pronoun-error"], ["Sana told that she was happy.", "said-told-error"]], "AM → WAS; I → SHE; SAID that."),
      t("reported-statements", "Last week Kiran said, \"We play cricket every day.\" Which is the reported speech?", "Kiran said that they played cricket every day.", [["Kiran said that we played cricket every day.", "reported-pronoun-error"], ["Kiran said that they plays cricket every day.", "reported-tense-error"], ["Kiran said that they play cricket every day.", "reported-tense-error"]], "PLAY → PLAYED; WE → THEY."),
      t("reported-statements", "Yesterday Aman said, \"I will come tomorrow.\" Which is the reported speech?", "Aman said that he would come the next day.", [["Aman said that he will come tomorrow.", "reported-tense-error"], ["Aman said that I would come the next day.", "reported-pronoun-error"], ["Aman said that he would came the next day.", "reported-tense-error"]], "WILL → WOULD; TOMORROW → THE NEXT DAY (it was said yesterday)."),
      t("reported-statements", "Last month Lata said, \"I can ride a horse.\" Which is the reported speech?", "Lata said that she could ride a horse.", [["Lata said that she can ride a horse.", "reported-tense-error"], ["Lata said that I could ride a horse.", "reported-pronoun-error"], ["Lata said that she could rode a horse.", "reported-tense-error"]], "CAN → COULD + base form."),
      t("reported-statements", "Which is correct?", "Rahul said that he was busy.", [["Rahul said me that he was busy.", "said-told-error"], ["Rahul told that he was busy.", "said-told-error"], ["Rahul said that he were busy.", "reported-tense-error"]], "SAID that (no person after said); HE WAS."),
      t("reported-pronouns", "Yesterday Neha said, \"I lost my pen.\" Which is the reported speech?", "Neha said that she had lost her pen.", [["Neha said that I had lost my pen.", "reported-pronoun-error"], ["Neha said that she had lost my pen.", "reported-pronoun-error"], ["Neha said that he had lost his pen.", "reported-pronoun-error"]], "I → SHE, MY → HER (Neha is a girl); LOST → HAD LOST."),
      t("reported-pronouns", "Last week the boys said, \"We love our school.\" Which is the reported speech?", "The boys said that they loved their school.", [["The boys said that we loved our school.", "reported-pronoun-error"], ["The boys said that they loved our school.", "reported-pronoun-error"], ["The boys said that he loved his school.", "reported-pronoun-error"]], "WE → THEY, OUR → THEIR."),
      t("reported-pronouns", "Yesterday Papa said to me, \"You are a good helper.\" Which is the reported speech?", "Papa told me that I was a good helper.", [["Papa told me that you were a good helper.", "reported-pronoun-error"], ["Papa told me that he was a good helper.", "reported-pronoun-error"], ["Papa told me that I am a good helper.", "reported-tense-error"]], "Papa spoke to ME, so YOU → I; ARE → WAS."),
      t("reported-pronouns", "Last week Isha said, \"My bag is red.\" Which is the reported speech?", "Isha said that her bag was red.", [["Isha said that my bag was red.", "reported-pronoun-error"], ["Isha said that her bag is red.", "reported-tense-error"], ["Isha said that his bag was red.", "reported-pronoun-error"]], "MY → HER (Isha is a girl); IS → WAS."),
      t("reported-pronouns", "Yesterday Arun said to his sister, \"I will call you.\" Which is the reported speech?", "Arun told his sister that he would call her.", [["Arun told his sister that I would call you.", "reported-pronoun-error"], ["Arun told his sister that he would call you.", "reported-pronoun-error"], ["Arun told his sister that she would call him.", "reported-pronoun-error"]], "I → HE (Arun), YOU → HER (his sister); WILL → WOULD."),
      t("reported-questions-orders", "Yesterday Riya asked me, \"Do you like mangoes?\" Which is the reported speech?", "Riya asked me if I liked mangoes.", [["Riya asked me do I like mangoes.", "reported-question-error"], ["Riya asked me if you liked mangoes.", "reported-pronoun-error"], ["Riya asked me if I like mangoes.", "reported-tense-error"]], "IF + I + LIKED (one step back)."),
      t("reported-questions-orders", "Yesterday the guard asked us, \"Where are you going?\" Which is the reported speech?", "The guard asked us where we were going.", [["The guard asked us where are we going.", "reported-question-error"], ["The guard asked us where you were going.", "reported-pronoun-error"], ["The guard asked us where we are going.", "reported-tense-error"]], "Sentence order (we were), one step back, YOU → WE."),
      t("reported-questions-orders", "This morning Mum said to me, \"Drink your milk.\" Which is the reported speech?", "Mum told me to drink my milk.", [["Mum told me drink my milk.", "reported-order-error"], ["Mum said me to drink my milk.", "said-told-error"], ["Mum told me to drink your milk.", "reported-pronoun-error"]], "TOLD me TO drink; YOUR → MY."),
      t("reported-questions-orders", "Yesterday the teacher said to us, \"Do not run.\" Which is the reported speech?", "The teacher told us not to run.", [["The teacher told us to not ran.", "reported-order-error"], ["The teacher said us not to run.", "said-told-error"], ["The teacher told us do not run.", "reported-order-error"]], "TOLD us NOT TO + base form."),
      t("reported-questions-orders", "Last week Grandpa asked me, \"Have you finished your work?\" Which is the reported speech?", "Grandpa asked me if I had finished my work.", [["Grandpa asked me have I finished my work.", "reported-question-error"], ["Grandpa asked me if I have finished my work.", "reported-tense-error"], ["Grandpa asked me if you had finished your work.", "reported-pronoun-error"]], "IF + HAVE → HAD; YOU/YOUR → I/MY."),
    ],

    // Unit Boss (12, mixed)
    "eq-u7-test": [
      q("Complete the sentence: 'Last night the thief ___ by the police.'", "was caught", [["is caught", "passive-tense-error"], ["was catch", "passive-form-error"], ["caught", "passive-form-error"]], "LAST NIGHT → WAS + third form CAUGHT."),
      q("Complete the sentence: 'Tea ___ in Assam.'", "is grown", [["is grow", "passive-form-error"], ["grows by", "passive-form-error"], ["are grown", "passive-number-error"]], "A fact → present passive: IS GROWN. (Assam is famous for its tea.)"),
      q("Which is the passive of 'Kavya drew a map'?", "A map was drawn by Kavya.", [["A map was drew by Kavya.", "passive-form-error"], ["A map is drawn by Kavya.", "passive-tense-error"], ["Kavya was drawn by a map.", "passive-form-error"]], "DREW is past → WAS + third form DRAWN."),
      q("Which is the passive of 'The workers repair the roads'?", "The roads are repaired by the workers.", [["The roads is repaired by the workers.", "passive-number-error"], ["The roads were repaired by the workers.", "passive-tense-error"], ["The workers are repaired by the roads.", "passive-form-error"]], "REPAIR is present; roads are many → ARE REPAIRED."),
      q("In 'The poem was written by Rabindranath Tagore', who wrote the poem?", "Rabindranath Tagore", [["The poem", "passive-agent-error"], ["A teacher", "passive-agent-error"], ["Nobody wrote it", "passive-agent-error"]], "The doer comes after BY."),
      q("Pick the right word: 'The kite was made ___ my grandfather.'", "by", [["from", "passive-agent-error"], ["with", "passive-agent-error"], ["of", "passive-agent-error"]], "The doer comes after BY."),
      q("Yesterday Ali said, \"I am going home.\" Which is the reported speech?", "Ali said that he was going home.", [["Ali said that he is going home.", "reported-tense-error"], ["Ali said that I was going home.", "reported-pronoun-error"], ["Ali told that he was going home.", "said-told-error"]], "AM GOING → WAS GOING; I → HE; SAID that."),
      q("Last week Priya said, \"My cat can climb trees.\" Which is the reported speech?", "Priya said that her cat could climb trees.", [["Priya said that my cat could climb trees.", "reported-pronoun-error"], ["Priya said that her cat can climb trees.", "reported-tense-error"], ["Priya said that her cat could climbed trees.", "reported-tense-error"]], "MY → HER; CAN → COULD + base form."),
      q("Yesterday Sir asked me, \"Are you ready?\" Which is the reported speech?", "Sir asked me if I was ready.", [["Sir asked me if I am ready.", "reported-tense-error"], ["Sir asked me was I ready.", "reported-question-error"], ["Sir asked me if you were ready.", "reported-pronoun-error"]], "IF + I WAS."),
      q("This morning Mum said to us, \"Wash your hands.\" Which is the reported speech?", "Mum told us to wash our hands.", [["Mum told us wash our hands.", "reported-order-error"], ["Mum said us to wash our hands.", "said-told-error"], ["Mum told us to wash your hands.", "reported-pronoun-error"]], "TOLD us TO wash; YOUR → OUR."),
      q("Pick the right word: 'Neha ___ us a funny story.'", "told", [["said", "said-told-error"], ["spoke", "said-told-error"], ["talked", "said-told-error"]], "A person (US) comes after it → TOLD."),
      q("Yesterday Dev asked me, \"When does the film start?\" Which is the reported speech?", "Dev asked me when the film started.", [["Dev asked me when does the film start.", "reported-question-error"], ["Dev asked me when the film starts.", "reported-tense-error"], ["Dev asked me when did the film start.", "reported-question-error"]], "No DOES in reported questions; one step back: STARTED."),
    ],
  },

  // ---------- Reading ----------
  readings: {
    "eq-read-lost-book": {
      name: "The Lost Library Book",
      author: "Apprec8",
      mode: "fullPassage",
      glossary: {
        librarian: "the person who looks after the books in a library",
        overdue: "late; not returned on the day it should be",
        relieved: "happy because a worry is over",
      },
      paragraphs: [
        "Every Friday, the books in our school library are checked by Mrs Fernandes, the librarian. Last Friday she looked at her register and frowned. \"One book has not been returned,\" she said. It was a book about the planets, and it was three weeks overdue.",
        "The book had been borrowed by Kabir. When Mrs Fernandes asked him about it, Kabir said that he had put it in his bag. He looked everywhere, but the book could not be found. He felt terrible.",
        "That evening, Kabir told his mother about the book. She asked him if he had looked under his bed. He had not. Together they moved the bed, and there it was, covered in dust next to an old cricket ball.",
        "On Monday morning, the book was returned to the library by a very relieved Kabir. Mrs Fernandes smiled and told him to be more careful. She also asked him what he had learned from the book. \"Saturn has rings made of ice and rock,\" said Kabir.",
      ],
      questions: [
        {
          ...q("Who checks the library books every Friday?", "Mrs Fernandes, the librarian", [["Kabir and his classmates", "detail-missed"], ["The school principal", "not-in-passage"], ["Kabir's mother", "detail-missed"]], "Paragraph 1: 'the books in our school library are checked by Mrs Fernandes, the librarian.'"),
          evidence: { paragraph: 0, text: "the books in our school library are checked by Mrs Fernandes, the librarian." },
        },
        {
          ...q("Where was the book found?", "Under Kabir's bed, next to a cricket ball", [["Inside Kabir's school bag", "detail-missed"], ["On a shelf in the library", "not-in-passage"], ["In the school playground", "not-in-passage"]], "Paragraph 3: they moved the bed 'and there it was'."),
          evidence: { paragraph: 2, text: "Together they moved the bed, and there it was, covered in dust next to an old cricket ball." },
        },
        {
          ...q("The word 'overdue' in the passage means ___.", "late, not returned on time", [["very old and torn", "word-meaning"], ["borrowed by many children", "word-meaning"], ["about the planets", "word-meaning"]], "An overdue book is one that should already have been returned."),
          evidence: { paragraph: 0, text: "it was three weeks overdue." },
        },
        {
          ...q("Select the INCORRECT statement according to the passage.", "Kabir found the book in his school bag.", [["The book was about the planets.", "statement-check"], ["Kabir's mother helped him look.", "statement-check"], ["The book was returned on Monday.", "statement-check"]], "Kabir THOUGHT it was in his bag, but it was found under his bed."),
          evidence: { paragraph: 2, text: "Together they moved the bed, and there it was" },
        },
        {
          ...q("In 'The book had been borrowed by Kabir', who borrowed the book?", "Kabir", [["The book", "passive-agent-error"], ["Mrs Fernandes", "passive-agent-error"], ["Kabir's mother", "passive-agent-error"]], "In the passive, the doer comes after BY."),
          evidence: { paragraph: 1, text: "The book had been borrowed by Kabir." },
        },
        {
          ...q("Kabir's mother asked, \"Have you looked under your bed?\" How does the passage report it?", "She asked him if he had looked under his bed.", [["She asked him have you looked under your bed.", "reported-question-error"], ["She told him to look under the cupboard.", "detail-missed"], ["She said that she had looked under the bed.", "reported-pronoun-error"]], "Reported question: IF + HE HAD LOOKED (one step back; you → he)."),
          evidence: { paragraph: 2, text: "She asked him if he had looked under his bed." },
        },
        {
          ...q("How did Kabir feel when he returned the book?", "Relieved, because the worry was over", [["Angry with the librarian", "inference"], ["Proud that it was three weeks late", "inference"], ["Bored with the planets", "inference"]], "The passage calls him 'a very relieved Kabir'."),
          evidence: { paragraph: 3, text: "a very relieved Kabir" },
        },
      ],
    },
  },
  wordTables: {},

  nodes: [
    forGrades(unit("eq-u7", 7, "Reported Speech & Passive"), G),

    // Topic A: Active & Passive
    passive,
    forGrades(withSubtopic(practice("eq-u7-passive-p1", passive, 1, "Change It to Passive", "medium", [quiz("eq-u7-passive-change")]), "active-to-passive"), G),
    forGrades(gate("eq-u7-passive-gate", passive, "Passive Challenge", "eq-u7-passive-gate-pool", {
      "passive-form": "Is/was + third form",
      "active-to-passive": "Active to passive",
      "passive-agent": "The doer after by",
    }), G),
    forGrades(endless(passive), G),

    // Topic B: Reported Speech
    reported,
    forGrades(withSubtopic(practice("eq-u7-reported-p1", reported, 1, "Questions & Orders", "hard", [quiz("eq-u7-reported-qo")]), "reported-questions-orders"), G),
    forGrades(gate("eq-u7-reported-gate", reported, "Reported Speech Challenge", "eq-u7-reported-gate-pool", {
      "reported-statements": "One step back",
      "reported-pronouns": "Changing I, my, you",
      "reported-questions-orders": "Questions and orders",
    }), G),
    forGrades(endless(reported), G),

    // Reading & Boss
    u7r,
    forGrades(boss(
      "eq-u7-boss",
      "eq-u7",
      "Unit 7 Boss",
      "eq-u7-test",
      "Oh no! 👾 The Grammar Gremlin has scrambled the school newspaper! Every report says who did what in the wrong way, and nobody knows who said what. Fix the passive sentences and the reported speech before the paper goes to print."
    ), G),
  ],
};

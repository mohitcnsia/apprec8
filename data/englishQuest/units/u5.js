// data/englishQuest/units/u5.js: Unit 5, Sentence Errors & Expression (IEO Spot the Error, Dialogue & Idioms)
// Built per docs/CONTENT_GUIDE.md §2–7 and docs/exam/ieo-pattern.md.
import { q, study, quiz, reading, unit, main, practice, gate, withSubtopic, endless, boss } from "../helpers.js";

// ---------- Nodes definition ----------
const errors = main("eq-u5-errors", "eq-u5", 0, "Spot the Error", [study("eq-u5-errors"), quiz("eq-u5-errors-warmup")]);
const dialogue = main("eq-u5-dialogue", "eq-u5", 1, "Situational Dialogue", [study("eq-u5-dialogue"), quiz("eq-u5-dialogue-warmup")]);
const idioms = main("eq-u5-idioms", "eq-u5", 2, "Idioms and Proverbs", [study("eq-u5-idioms"), quiz("eq-u5-idioms-warmup")]);
const u5r = main("eq-u5-reading", "eq-u5", 3, "Reading: The Mystery of the Silver Compass", [reading("eq-read-lost-compass")]);

export default {
  // ---------- Study Pages ----------
  studyPages: {
    "eq-u5-errors": {
      name: "Spotting Sentence Errors",
      author: "Apprec8",
      content: `### 🔍 Spot the Sentence Error

In the IEO, error spotting questions test your ability to read a complete sentence and pinpoint grammatical mistakes.

---

### 🧱 Sentence Structure in Four Parts

A sentence is divided into four numbered or lettered parts:
- **(A)** First part
- **(B)** Second part
- **(C)** Third part
- **(D)** No error (if the sentence is entirely correct!)

---

### ⚠️ The Top 5 Error Patterns in IEO

1. **Pronoun Reference Errors:**
   - ❌ *My grandmother told us stories of **its** childhood.*
   - ✅ *My grandmother told us stories of **her** childhood.* (Grandmother is a person, not a thing!)
2. **Passive Voice Confusion:**
   - ❌ *Jatin was **accusing** of theft by his neighbour.*
   - ✅ *Jatin was **accused** of theft by his neighbour.* (Passive requires past participle!)
3. **Subject-Verb Agreement Clashes:**
   - ❌ *Neither of the two mangoes **were** sweet.*
   - ✅ *Neither of the two mangoes **was** sweet.* ('Neither' is singular!)
4. **Adjective vs Adverb Mix-ups:**
   - ❌ *Sheena was **exhaustive** after running the marathon.*
   - ✅ *Sheena was **exhausted** after running the marathon.* ('Exhaustive' means comprehensive; 'exhausted' means very tired!)
5. **Preposition and Collocation Errors:**
   - ❌ *The teacher has no tolerance **on** indiscipline.*
   - ✅ *The teacher has no tolerance **for** indiscipline.* ('Tolerance for' is the correct preposition!)

> 💡 **Inspection Strategy:** First check the subject and verb agreement. Second, check pronouns. Third, check prepositions and word forms!`,
    },
    "eq-u5-dialogue": {
      name: "Situational Dialogue & Everyday Speech",
      author: "Apprec8",
      content: `### 💬 Spoken and Written Expression

In everyday English and in IEO Section 3 (Q41–Q45), questions test natural, polite, and situational conversation.

---

### 🤝 Polite Requests and Offers

| Situation | Natural Spoken Expression | What to Avoid |
|---|---|---|
| Asking for help | *"Could you lend me a hand with this trunk?"* | *"Give me help now."* |
| Accepting help | *"That is very kind of you, thank you!"* | *"Yes, you must."* |
| Offering a seat | *"Please have a seat."* | *"Sit down here."* |
| Mind questions | *"Would you mind opening the door?"* → *"Not at all!"* | *"Yes, I mind."* |

---

### 🎭 Common Conversational Responses

1. **When nobody knows the answer:**
   - **Rohan:** *"Do you think the team will win tomorrow?"*
   - **Meera:** *"Your guess is **as good as mine**."* (Meaning: I have no idea either!)
2. **When delaying an unnecessary worry:**
   - **Father:** *"What if it rains during the picnic next week?"*
   - **Mother:** *"We will **cross that bridge when we come to it**."* (Meaning: deal with it only if it happens!)
3. **When providing reassurance:**
   - **Aman:** *"I will try to reach on time, but do not worry **in case** I am delayed by traffic."*
   - **Priya:** *"All right, just keep me informed."*
4. **When agreeing warmly:**
   - **Teacher:** *"Shall we invite the principal to our exhibition?"*
   - **Class:** *"**By all means**, that is a wonderful idea!"*`,
    },
    "eq-u5-idioms": {
      name: "Common Idioms and Proverbs",
      author: "Apprec8",
      content: `### 🎨 Colourful Everyday Idioms

An **idiom** is a figurative phrase whose overall meaning cannot be understood from the literal definitions of its individual words.

---

### 🏆 Essential Idioms for Class 5

| Idiom | True Meaning | Example Sentence |
|---|---|---|
| **A piece of cake** | Very easy to do | The maths quiz was a piece of cake for Ravi. |
| **Bite the bullet** | Face a tough situation bravely | She decided to bite the bullet and apologize. |
| **Burn the midnight oil** | Study late into the night | Students burn the midnight oil before exams. |
| **Spill the beans** | Reveal a secret accidentally | Rohan spilled the beans about the surprise party. |
| **Cost an arm and a leg** | Extremely expensive | That imported sports bicycle costs an arm and a leg. |
| **Under the weather** | Feeling slightly ill | Kavita stayed home because she felt under the weather. |
| **See eye to eye** | Agree completely | The two friends rarely see eye to eye on football. |
| **Hit the nail on the head** | Say exactly the right thing | The teacher hit the nail on the head with her explanation. |
| **Barking up the wrong tree** | Accusing the wrong person | If you suspect Arun, you are barking up the wrong tree. |
| **Once in a blue moon** | Happening very rarely | We visit our cousins in Kerala once in a blue moon. |

> 💡 **Exam Tip:** In questions, read the whole sentence carefully to see whether the idiom fits the mood and meaning of the speaker!`,
    },
  },

  // ---------- Quizzes ----------
  quizzes: {
    "eq-u5-errors-warmup": [
      {
        subtopic: "pronoun-word-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'My grandmother told us' (A) / 'many stories' (B) / 'of its childhood.' (C) / 'No error' (D)",
          "of its childhood.",
          [
          ["My grandmother told us", "error-pronoun-mixup"],
          ["many stories", "error-pronoun-mixup"],
          ["No error", "error-pronoun-mixup"]
          ],
          "Grandmother is a female person, so the pronoun should be her childhood, not its childhood."
        ),
      },
      {
        subtopic: "agreement-tense-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'Neither of the two candidates' (A) / 'were selected' (B) / 'for the post.' (C) / 'No error' (D)",
          "were selected",
          [
          ["Neither of the two candidates", "error-agreement-mixup"],
          ["for the post.", "error-agreement-mixup"],
          ["No error", "error-agreement-mixup"]
          ],
          "Neither is singular in grammar and requires the singular verb was selected instead of were selected."
        ),
      },
      {
        subtopic: "agreement-tense-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'Jatin was accusing' (A) / 'of theft' (B) / 'by his neighbour.' (C) / 'No error' (D)",
          "Jatin was accusing",
          [
          ["of theft", "error-passive-mixup"],
          ["by his neighbour.", "error-passive-mixup"],
          ["No error", "error-passive-mixup"]
          ],
          "In the passive voice, the verb must be past participle: Jatin was accused of theft."
        ),
      },
      {
        subtopic: "pronoun-word-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'Sheena was exhaustive' (A) / 'after running' (B) / 'the ten-mile race.' (C) / 'No error' (D)",
          "Sheena was exhaustive",
          [
          ["after running", "error-word-form-mixup"],
          ["the ten-mile race.", "error-word-form-mixup"],
          ["No error", "error-word-form-mixup"]
          ],
          "Exhaustive means comprehensive or thorough; the correct adjective for a tired person is exhausted."
        ),
      },
      {
        subtopic: "preposition-article-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'The teacher has' (A) / 'no tolerance on' (B) / 'disobedient behaviour.' (C) / 'No error' (D)",
          "no tolerance on",
          [
          ["The teacher has", "error-preposition-mixup"],
          ["disobedient behaviour.", "error-preposition-mixup"],
          ["No error", "error-preposition-mixup"]
          ],
          "The correct preposition with the noun tolerance is for: tolerance for disobedient behaviour."
        ),
      },
      {
        subtopic: "pronoun-word-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'Rohan is more taller' (A) / 'than his elder brother' (B) / 'in our class.' (C) / 'No error' (D)",
          "Rohan is more taller",
          [
          ["than his elder brother", "error-comparative-mixup"],
          ["in our class.", "error-comparative-mixup"],
          ["No error", "error-comparative-mixup"]
          ],
          "Double comparatives are incorrect; we say taller than, not more taller than."
        ),
      },
      {
        subtopic: "agreement-tense-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'A flock of birds' (A) / 'are flying' (B) / 'towards the south.' (C) / 'No error' (D)",
          "are flying",
          [
          ["A flock of birds", "error-collective-mixup"],
          ["towards the south.", "error-collective-mixup"],
          ["No error", "error-collective-mixup"]
          ],
          "A flock is a singular collective noun, so the verb must be is flying instead of are flying."
        ),
      },
      {
        subtopic: "preposition-article-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'The train arrived' (A) / 'at the platform' (B) / 'on the scheduled time.' (C) / 'No error' (D)",
          "on the scheduled time.",
          [
          ["The train arrived", "error-preposition-mixup"],
          ["at the platform", "error-preposition-mixup"],
          ["No error", "error-preposition-mixup"]
          ],
          "We say at the scheduled time (or on time), not on the scheduled time."
        ),
      },
    ],
    "eq-u5-errors-practice-quiz": [
      {
        subtopic: "agreement-tense-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'Each of the girls' (A) / 'have received' (B) / 'a gold medal.' (C) / 'No error' (D)",
          "have received",
          [
          ["Each of the girls", "error-agreement-mixup"],
          ["a gold medal.", "error-agreement-mixup"],
          ["No error", "error-agreement-mixup"]
          ],
          "The subject is Each (singular), so the verb must be has received instead of have received."
        ),
      },
      {
        subtopic: "agreement-tense-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'He did not went' (A) / 'to school yesterday' (B) / 'due to high fever.' (C) / 'No error' (D)",
          "He did not went",
          [
          ["to school yesterday", "error-auxiliary-verb"],
          ["due to high fever.", "error-auxiliary-verb"],
          ["No error", "error-auxiliary-verb"]
          ],
          "After the auxiliary did not, the main verb returns to the base form: did not go, not did not went."
        ),
      },
      {
        subtopic: "pronoun-word-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'Me and my sister' (A) / 'baked a chocolate cake' (B) / 'for our mother.' (C) / 'No error' (D)",
          "Me and my sister",
          [
          ["baked a chocolate cake", "error-pronoun-case"],
          ["for our mother.", "error-pronoun-case"],
          ["No error", "error-pronoun-case"]
          ],
          "As a subject pronoun, we use My sister and I baked a cake, not Me and my sister."
        ),
      },
      {
        subtopic: "pronoun-word-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'She walked into' (A) / 'the dark room' (B) / 'very slow.' (C) / 'No error' (D)",
          "very slow.",
          [
          ["She walked into", "error-adverb-adjective"],
          ["the dark room", "error-adverb-adjective"],
          ["No error", "error-adverb-adjective"]
          ],
          "The verb walked requires an adverb of manner: very slowly instead of very slow."
        ),
      },
      {
        subtopic: "preposition-article-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'The Nile is' (A) / 'longer than' (B) / 'any river in Africa.' (C) / 'No error' (D)",
          "any river in Africa.",
          [
          ["The Nile is", "error-comparative-other"],
          ["longer than", "error-comparative-other"],
          ["No error", "error-comparative-other"]
          ],
          "When comparing an entity within its own group, we must exclude it: longer than any other river in Africa."
        ),
      },
      {
        subtopic: "preposition-article-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'The boys distributed' (A) / 'the sweets between' (B) / 'all five children.' (C) / 'No error' (D)",
          "the sweets between",
          [
          ["The boys distributed", "error-between-among"],
          ["all five children.", "error-between-among"],
          ["No error", "error-between-among"]
          ],
          "Between is used for two people; among is used for more than two (all five children)."
        ),
      },
    ],
    "eq-u5-errors-gate-pool": [
      {
        subtopic: "agreement-tense-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'The quality of these mangoes' (A) / 'were not good' (B) / 'at all.' (C) / 'No error' (D)",
          "were not good",
          [
          ["The quality of these mangoes", "error-agreement-mixup"],
          ["at all.", "error-agreement-mixup"],
          ["No error", "error-agreement-mixup"]
          ],
          "The subject is The quality (singular), not mangoes; it requires was not good."
        ),
      },
      {
        subtopic: "agreement-tense-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'One of my friends' (A) / 'have travelled' (B) / 'around the globe.' (C) / 'No error' (D)",
          "have travelled",
          [
          ["One of my friends", "error-agreement-mixup"],
          ["around the globe.", "error-agreement-mixup"],
          ["No error", "error-agreement-mixup"]
          ],
          "The subject is One (singular), which takes has travelled instead of have travelled."
        ),
      },
      {
        subtopic: "agreement-tense-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'The news broadcast' (A) / 'were watched by' (B) / 'millions of viewers.' (C) / 'No error' (D)",
          "were watched by",
          [
          ["The news broadcast", "error-news-agreement"],
          ["millions of viewers.", "error-news-agreement"],
          ["No error", "error-news-agreement"]
          ],
          "News is an uncountable singular noun, so the verb is was watched by."
        ),
      },
      {
        subtopic: "agreement-tense-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'If he will study hard,' (A) / 'he will pass' (B) / 'the annual examination.' (C) / 'No error' (D)",
          "If he will study hard,",
          [
          ["he will pass", "error-conditional-tense"],
          ["the annual examination.", "error-conditional-tense"],
          ["No error", "error-conditional-tense"]
          ],
          "In a first conditional clause with if, we use simple present: If he studies hard."
        ),
      },
      {
        subtopic: "agreement-tense-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'Ten kilometres are' (A) / 'a long distance' (B) / 'to walk on foot.' (C) / 'No error' (D)",
          "Ten kilometres are",
          [
          ["a long distance", "error-measure-verb"],
          ["to walk on foot.", "error-measure-verb"],
          ["No error", "error-measure-verb"]
          ],
          "A distance considered as a single unit takes a singular verb: Ten kilometres is a long distance."
        ),
      },
      {
        subtopic: "pronoun-word-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'Every student must bring' (A) / 'their own pencil' (B) / 'to the test hall.' (C) / 'No error' (D)",
          "their own pencil",
          [
          ["Every student must bring", "error-pronoun-number"],
          ["to the test hall.", "error-pronoun-number"],
          ["No error", "error-pronoun-number"]
          ],
          "Every student is singular, so traditional grammar uses his or her own pencil."
        ),
      },
      {
        subtopic: "pronoun-word-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'Between you and I,' (A) / 'this secret plan' (B) / 'must remain private.' (C) / 'No error' (D)",
          "Between you and I,",
          [
          ["this secret plan", "error-preposition-pronoun"],
          ["must remain private.", "error-preposition-pronoun"],
          ["No error", "error-preposition-pronoun"]
          ],
          "Between is a preposition requiring objective case pronouns: Between you and me."
        ),
      },
      {
        subtopic: "pronoun-word-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'The boy who' (A) / 'we saw yesterday' (B) / 'is my cousin.' (C) / 'No error' (D)",
          "The boy who",
          [
          ["we saw yesterday", "error-who-whom"],
          ["is my cousin.", "error-who-whom"],
          ["No error", "error-who-whom"]
          ],
          "As an objective relative pronoun representing the person seen, whom is required: The boy whom we saw."
        ),
      },
      {
        subtopic: "pronoun-word-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'She sang so sweet' (A) / 'that the listeners' (B) / 'clapped with joy.' (C) / 'No error' (D)",
          "She sang so sweet",
          [
          ["that the listeners", "error-adverb-adjective"],
          ["clapped with joy.", "error-adverb-adjective"],
          ["No error", "error-adverb-adjective"]
          ],
          "The verb sang is modified by an adverb of manner: so sweetly, not so sweet."
        ),
      },
      {
        subtopic: "pronoun-word-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'He is the most cleverest' (A) / 'boy in the entire' (B) / 'middle school.' (C) / 'No error' (D)",
          "He is the most cleverest",
          [
          ["boy in the entire", "error-double-superlative"],
          ["middle school.", "error-double-superlative"],
          ["No error", "error-double-superlative"]
          ],
          "Double superlatives are ungrammatical; we use cleverest or most clever, never most cleverest."
        ),
      },
      {
        subtopic: "preposition-article-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'He has been absent' (A) / 'from the school' (B) / 'for Monday.' (C) / 'No error' (D)",
          "for Monday.",
          [
          ["He has been absent", "error-since-for"],
          ["from the school", "error-since-for"],
          ["No error", "error-since-for"]
          ],
          "With a specific starting point in time (Monday), we use since, not for: since Monday."
        ),
      },
      {
        subtopic: "preposition-article-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'The man was angry' (A) / 'upon his servant' (B) / 'for being late.' (C) / 'No error' (D)",
          "upon his servant",
          [
          ["The man was angry", "error-preposition-mixup"],
          ["for being late.", "error-preposition-mixup"],
          ["No error", "error-preposition-mixup"]
          ],
          "We say angry with a person (or angry at a situation), not angry upon someone."
        ),
      },
      {
        subtopic: "preposition-article-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'Honesty is' (A) / 'a best policy' (B) / 'in human life.' (C) / 'No error' (D)",
          "a best policy",
          [
          ["Honesty is", "error-superlative-the"],
          ["in human life.", "error-superlative-the"],
          ["No error", "error-superlative-the"]
          ],
          "Superlative adjectives like best take the definite article: the best policy."
        ),
      },
      {
        subtopic: "preposition-article-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'He prefers reading books' (A) / 'than watching' (B) / 'television shows.' (C) / 'No error' (D)",
          "than watching",
          [
          ["He prefers reading books", "error-prefer-to"],
          ["television shows.", "error-prefer-to"],
          ["No error", "error-prefer-to"]
          ],
          "The verb prefer takes the preposition to, not than: prefers reading books to watching television."
        ),
      },
      {
        subtopic: "preposition-article-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'The doctor advised him' (A) / 'to take an European' (B) / 'tour for rest.' (C) / 'No error' (D)",
          "to take an European",
          [
          ["The doctor advised him", "error-article-sound"],
          ["tour for rest.", "error-article-sound"],
          ["No error", "error-article-sound"]
          ],
          "European begins with a consonant sound 'yu', so it takes the indefinite article 'a', not 'an'."
        ),
      },
    ],
    "eq-u5-dialogue-warmup": [
      {
        subtopic: "social-responses",
        ...q(
          "Choose the correct option to complete the conversation:\nRohan: 'Do you know who will win the inter-school quiz?'\nMeera: 'Nobody can tell right now. Your guess is ___ mine.'",
          "as good as",
          [
          ["better than", "dialogue-idiom-choice"],
          ["the best of", "dialogue-idiom-choice"],
          ["much worse to", "dialogue-idiom-choice"]
          ],
          "The idiom 'your guess is as good as mine' means I have no more information than you do."
        ),
      },
      {
        subtopic: "social-responses",
        ...q(
          "Choose the correct option to complete the conversation:\nMother: 'Why are you worrying about the final exam today?'\nSon: 'You are right, Mom. We will cross that ___ when we come to it.'",
          "bridge",
          [
          ["river", "dialogue-idiom-choice"],
          ["puddle", "dialogue-idiom-choice"],
          ["road", "dialogue-idiom-choice"]
          ],
          "The standard idiom 'cross that bridge when you come to it' means to address a dilemma only when it arrives."
        ),
      },
      {
        subtopic: "polite-requests",
        ...q(
          "Choose the correct reply to the polite question:\nStranger: 'Would you mind closing the window, please?'\nPassenger: '___, I will close it right away.'",
          "Not at all",
          [
          ["Yes I mind", "dialogue-polite-reply"],
          ["Certainly never", "dialogue-polite-reply"],
          ["Of course I do", "dialogue-polite-reply"]
          ],
          "When asked 'Would you mind...?', answering 'Not at all' politely indicates that you are happy to comply."
        ),
      },
      {
        subtopic: "everyday-conversations",
        ...q(
          "Choose the correct option to complete the conversation:\nAman: 'I will try to reach on time, but do not worry ___ I am delayed by traffic.'\nFather: 'Ok, just keep me informed.'",
          "in case",
          [
          ["as long as", "dialogue-connector-choice"],
          ["during", "dialogue-connector-choice"],
          ["while", "dialogue-connector-choice"]
          ],
          "The phrase in case introduces a condition: 'in case I am delayed' means if I happen to be delayed."
        ),
      },
      {
        subtopic: "polite-requests",
        ...q(
          "Choose the best reply in this conversation:\nTeacher: 'Shall we invite our school principal to the class debate?'\nStudents: '___, that is a splendid idea!'",
          "By all means",
          [
          ["By no chance", "dialogue-agreement-phrase"],
          ["In few words", "dialogue-agreement-phrase"],
          ["At all costs", "dialogue-agreement-phrase"]
          ],
          "The polite expression 'by all means' signals enthusiastic agreement and full permission."
        ),
      },
      {
        subtopic: "everyday-conversations",
        ...q(
          "Choose the correct option to complete the conversation:\nShopkeeper: 'Can I help you find something?'\nCustomer: 'Thank you, I am just ___ around.'",
          "looking",
          [
          ["watching", "dialogue-shopping-phrase"],
          ["glaring", "dialogue-shopping-phrase"],
          ["staring", "dialogue-shopping-phrase"]
          ],
          "The standard phrase when casually browsing in a shop is 'just looking around'."
        ),
      },
      {
        subtopic: "social-responses",
        ...q(
          "Choose the most polite response:\nHost: 'Thank you so much for coming to our annual school concert.'\nGuest: '___, we had a delightful time.'",
          "The pleasure was all ours",
          [
          ["You had to invite us", "dialogue-social-etiquette"],
          ["It was your job to sing", "dialogue-social-etiquette"],
          ["We had nothing else to do", "dialogue-social-etiquette"]
          ],
          "The polite social response to a host thanking you for attending is 'The pleasure was all ours' or 'My pleasure'."
        ),
      },
      {
        subtopic: "everyday-conversations",
        ...q(
          "Choose the correct option to complete the dialogue:\nPriya: 'I am so nervous about my piano recital tomorrow.'\nKaran: 'Do not panic, take a deep breath and ___ your best.'",
          "do",
          [
          ["make", "dialogue-collocation-verb"],
          ["create", "dialogue-collocation-verb"],
          ["build", "dialogue-collocation-verb"]
          ],
          "We say 'do your best', never 'make your best' or 'create your best'."
        ),
      },
    ],
    "eq-u5-dialogue-practice-quiz": [
      {
        subtopic: "polite-requests",
        ...q(
          "Choose the polite option to complete the conversation:\nPassenger: 'Could you please tell me the platform for the Rajdhani Express?'\nRailway clerk: '___, it arrives on Platform 3.'",
          "Certainly",
          [
          ["No way", "dialogue-polite-reply"],
          ["Ask someone else", "dialogue-polite-reply"],
          ["Why do you ask", "dialogue-polite-reply"]
          ],
          "Certainly is a polite, professional affirmation in customer assistance."
        ),
      },
      {
        subtopic: "social-responses",
        ...q(
          "Choose the natural response in this exchange:\nFriend: 'I am really sorry for spilling ink on your drawing sheet.'\nClassmate: '___, I can easily redraw it.'",
          "Never mind",
          [
          ["You are terrible", "dialogue-apology-response"],
          ["Pay me right now", "dialogue-apology-response"],
          ["I will punish you", "dialogue-apology-response"]
          ],
          "The friendly, forgiving response to an apology for a minor accident is 'Never mind' or 'Don't worry about it'."
        ),
      },
      {
        subtopic: "polite-requests",
        ...q(
          "Complete the dialogue naturally:\nGrandmother: 'Could you give me a hand carrying this vegetable basket?'\nGrandson: '___, let me carry it inside for you.'",
          "With pleasure",
          [
          ["I am very busy", "dialogue-polite-reply"],
          ["Ask your friends", "dialogue-polite-reply"],
          ["Only if you pay", "dialogue-polite-reply"]
          ],
          "With pleasure indicates eager, respectful willingness to assist."
        ),
      },
      {
        subtopic: "everyday-conversations",
        ...q(
          "Choose the correct option to complete the conversation:\nTeacher: 'Who left this pencil box on the table?'\nStudent: 'I am not sure, but it ___ be Rahul who was sitting here.'",
          "might",
          [
          ["shall", "dialogue-modal-choice"],
          ["ought", "dialogue-modal-choice"],
          ["must to", "dialogue-modal-choice"]
          ],
          "Might expresses reasonable possibility when uncertain."
        ),
      },
      {
        subtopic: "social-responses",
        ...q(
          "Select the appropriate reaction in this situation:\nDoctor: 'Take these medicines twice a day and get plenty of rest.'\nPatient: '___, Doctor. I will follow your advice.'",
          "Thank you very much",
          [
          ["I will ignore you", "dialogue-social-etiquette"],
          ["Give me money instead", "dialogue-social-etiquette"],
          ["You are mistaken", "dialogue-social-etiquette"]
          ],
          "A polite expression of gratitude is the standard reply to medical guidance."
        ),
      },
      {
        subtopic: "everyday-conversations",
        ...q(
          "Complete the conversation:\nArun: 'We have been searching for the lost key for an hour without success.'\nBikram: 'Let us take a short break; we are barking up the ___ tree.'",
          "wrong",
          [
          ["tall", "dialogue-idiom-choice"],
          ["crooked", "dialogue-idiom-choice"],
          ["hollow", "dialogue-idiom-choice"]
          ],
          "The idiom 'barking up the wrong tree' means pursuing a completely mistaken idea or direction."
        ),
      },
    ],
    "eq-u5-dialogue-gate-pool": [
      {
        subtopic: "polite-requests",
        ...q(
          "Choose the most polite way to ask for a glass of water:\nGuest: '___ I have a glass of water, please?'",
          "May",
          [
          ["Will", "dialogue-modal-request"],
          ["Should", "dialogue-modal-request"],
          ["Must", "dialogue-modal-request"]
          ],
          "May is the most courteous and formal modal verb for asking permission."
        ),
      },
      {
        subtopic: "polite-requests",
        ...q(
          "Choose the correct option to complete the dialogue:\nLibrarian: 'Would you mind speaking a little more softly?'\nVisitor: 'Oh, ___. I did not realize I was loud.'",
          "I am terribly sorry",
          [
          ["Yes I mind", "dialogue-apology-response"],
          ["I will shout instead", "dialogue-apology-response"],
          ["You are noisy too", "dialogue-apology-response"]
          ],
          "When politely reminded of library rules, the appropriate response is an apology."
        ),
      },
      {
        subtopic: "polite-requests",
        ...q(
          "Choose the best reply in this conversation:\nHost: 'Would you care for another slice of apple pie?'\nGuest: '___, it was delicious but I am quite full.'",
          "No, thank you",
          [
          ["Give me ten more", "dialogue-polite-refusal"],
          ["I dislike apples", "dialogue-polite-refusal"],
          ["You must eat it", "dialogue-polite-refusal"]
          ],
          "A polite refusal of additional food combines 'No' with 'thank you'."
        ),
      },
      {
        subtopic: "polite-requests",
        ...q(
          "Complete the exchange politely:\nTourist: 'Excuse me, could you direct me to the central museum?'\nResident: 'Certainly, walk straight and take the ___ turning on your right.'",
          "second",
          [
          ["two", "dialogue-directions"],
          ["twice", "dialogue-directions"],
          ["doubled", "dialogue-directions"]
          ],
          "Ordinal numbers (second turning) are used to indicate directional sequence."
        ),
      },
      {
        subtopic: "polite-requests",
        ...q(
          "Choose the polite offer of assistance:\nSenior citizen: 'These bags are rather heavy.'\nYoung passerby: 'Allow me to ___ with them, Madam.'",
          "help you",
          [
          ["laugh at you", "dialogue-polite-offer"],
          ["ignore you", "dialogue-polite-offer"],
          ["command you", "dialogue-polite-offer"]
          ],
          "'Allow me to help you' is the established courteous offer of assistance."
        ),
      },
      {
        subtopic: "social-responses",
        ...q(
          "Complete the conversation:\nNeighbour: 'Congratulations on winning the inter-school spelling competition!'\nChild: '___, your encouragement helped me a lot.'",
          "Thank you so much",
          [
          ["I already knew that", "dialogue-social-etiquette"],
          ["You should win instead", "dialogue-social-etiquette"],
          ["It was nothing to praise", "dialogue-social-etiquette"]
          ],
          "The gracious response to congratulations is expressing sincere thanks."
        ),
      },
      {
        subtopic: "social-responses",
        ...q(
          "Complete the dialogue with the most appropriate idiom:\nKiran: 'How are you feeling this morning, Priya?'\nPriya: 'A bit under the ___, so I might visit the doctor.'",
          "weather",
          [
          ["cloud", "dialogue-idiom-choice"],
          ["umbrella", "dialogue-idiom-choice"],
          ["storm", "dialogue-idiom-choice"]
          ],
          "The idiom 'under the weather' means feeling slightly ill or indisposed."
        ),
      },
      {
        subtopic: "social-responses",
        ...q(
          "Choose the natural conversational reply:\nClassmate: 'I passed the science test with top marks!'\nFriend: 'That is ___! Well done!'",
          "fantastic news",
          [
          ["awful news", "dialogue-congratulations"],
          ["boring news", "dialogue-congratulations"],
          ["tiresome news", "dialogue-congratulations"]
          ],
          "Colloquial congratulations warmly describe a friend's success as fantastic or wonderful news."
        ),
      },
      {
        subtopic: "social-responses",
        ...q(
          "Complete the exchange with the best phrase:\nVisitor: 'Thank you for your warm hospitality.'\nHost: 'You are ___ welcome anytime.'",
          "most",
          [
          ["much", "dialogue-social-etiquette"],
          ["many", "dialogue-social-etiquette"],
          ["more", "dialogue-social-etiquette"]
          ],
          "The formal, warm response to thanks is 'You are most welcome'."
        ),
      },
      {
        subtopic: "social-responses",
        ...q(
          "Choose the proper response in this situation:\nFriend: 'I am so sorry I broke your favourite mechanical pencil.'\nOwner: 'Do not worry about it, it was an ___.'",
          "accident",
          [
          ["incident", "dialogue-apology-response"],
          ["achievement", "dialogue-apology-response"],
          ["agreement", "dialogue-apology-response"]
          ],
          "Forgiving a broken item involves recognizing that it was an unintentional accident."
        ),
      },
      {
        subtopic: "everyday-conversations",
        ...q(
          "Complete the conversation:\nTeacher: 'Why were you absent from the rehearsal yesterday?'\nStudent: 'Sir, I had a ___ headache and could not attend.'",
          "severe",
          [
          ["heavy", "dialogue-adjective-colloc"],
          ["weighty", "dialogue-adjective-colloc"],
          ["thick", "dialogue-adjective-colloc"]
          ],
          "Headaches and illnesses are described as severe or bad, never heavy or thick."
        ),
      },
      {
        subtopic: "everyday-conversations",
        ...q(
          "Complete the conversation:\nMother: 'Have you finished your maths homework yet?'\nSon: 'Almost finished, Mom. It will take only a ___ minutes.'",
          "few",
          [
          ["little", "dialogue-determiner-choice"],
          ["less", "dialogue-determiner-choice"],
          ["much", "dialogue-determiner-choice"]
          ],
          "Minutes is a countable plural noun, so we use 'a few minutes'."
        ),
      },
      {
        subtopic: "everyday-conversations",
        ...q(
          "Complete the dialogue naturally:\nArjun: 'Shall we go for a bicycle ride this evening?'\nVarun: 'I would love to, but I have to ___ after my younger brother.'",
          "look",
          [
          ["see", "dialogue-phrasal-verb"],
          ["watch", "dialogue-phrasal-verb"],
          ["glance", "dialogue-phrasal-verb"]
          ],
          "The phrasal verb to look after means to take care of someone."
        ),
      },
      {
        subtopic: "everyday-conversations",
        ...q(
          "Complete the dialogue:\nInterviewer: 'What made you choose astronomy as a career?'\nScientist: 'From my early childhood, the stars had always ___ my curiosity.'",
          "sparked",
          [
          ["ignited", "dialogue-verb-colloc"],
          ["kindled", "dialogue-verb-colloc"],
          ["burned", "dialogue-verb-colloc"]
          ],
          "We naturally say that an event sparked someone's curiosity or interest."
        ),
      },
      {
        subtopic: "everyday-conversations",
        ...q(
          "Complete the exchange with the best conversational phrase:\nFather: 'Do you want to visit the wildlife sanctuary tomorrow?'\nChildren: '___, we would love that!'",
          "Yes, absolutely",
          [
          ["Never indeed", "dialogue-agreement-phrase"],
          ["Hardly ever", "dialogue-agreement-phrase"],
          ["Seldom maybe", "dialogue-agreement-phrase"]
          ],
          "'Yes, absolutely' expresses enthusiastic, wholehearted agreement."
        ),
      },
    ],
    "eq-u5-idioms-warmup": [
      {
        subtopic: "popular-sayings",
        ...q(
          "Choose the correct meaning of the underlined idiom: 'Solving the riddle was a piece of cake for Aman.'",
          "very easy to accomplish",
          [
          ["delicious to eat like pastry", "idiom-meaning-mixup"],
          ["requiring a sharp silver knife", "idiom-meaning-mixup"],
          ["difficult and confusing", "idiom-meaning-mixup"]
          ],
          "The idiom 'a piece of cake' means a task that is simple and easy to do."
        ),
      },
      {
        subtopic: "action-phrases",
        ...q(
          "Choose the correct meaning of the idiom: 'burn the midnight oil'",
          "study or work late into the night",
          [
          ["waste petrol in an engine", "idiom-meaning-mixup"],
          ["set fire to an oil lamp", "idiom-meaning-mixup"],
          ["wake up before sunrise", "idiom-meaning-mixup"]
          ],
          "To burn the midnight oil means to work or study late into the night hours."
        ),
      },
      {
        subtopic: "action-phrases",
        ...q(
          "Choose the correct meaning of the idiom: 'bite the bullet'",
          "face a difficult situation with courage",
          [
          ["shoot a metal gun in target practice", "idiom-meaning-mixup"],
          ["refuse to speak during a trial", "idiom-meaning-mixup"],
          ["eat food that is too hard", "idiom-meaning-mixup"]
          ],
          "To bite the bullet means to force oneself to perform a difficult, painful, or unpleasant task bravely."
        ),
      },
      {
        subtopic: "popular-sayings",
        ...q(
          "Fill in the blank to complete the idiom: 'Do not spill the ___ about the surprise birthday party.'",
          "beans",
          [
          ["peas", "idiom-word-completion"],
          ["seeds", "idiom-word-completion"],
          ["fruits", "idiom-word-completion"]
          ],
          "The idiom 'spill the beans' means to reveal secret information accidentally or prematurely."
        ),
      },
      {
        subtopic: "popular-sayings",
        ...q(
          "Choose the meaning of the idiom: 'cost an arm and a leg'",
          "very expensive",
          [
          ["causing a bodily injury", "idiom-meaning-mixup"],
          ["given away as charity", "idiom-meaning-mixup"],
          ["purchased in a market", "idiom-meaning-mixup"]
          ],
          "If something costs an arm and a leg, it is extremely costly or priced exorbitantly."
        ),
      },
      {
        subtopic: "action-phrases",
        ...q(
          "Choose the meaning of the idiom: 'see eye to eye'",
          "agree completely with someone",
          [
          ["stare into another person's eyes", "idiom-meaning-mixup"],
          ["wear identical reading spectacles", "idiom-meaning-mixup"],
          ["have poor vision", "idiom-meaning-mixup"]
          ],
          "To see eye to eye means to be in complete agreement with another person."
        ),
      },
      {
        subtopic: "popular-sayings",
        ...q(
          "Choose the meaning of the idiom: 'hit the nail on the head'",
          "describe a situation with exact precision",
          [
          ["hammer an iron nail into timber", "idiom-meaning-mixup"],
          ["injure your finger while working", "idiom-meaning-mixup"],
          ["make a noisy disturbance", "idiom-meaning-mixup"]
          ],
          "To hit the nail on the head means to state the exact truth or find the precise answer."
        ),
      },
      {
        subtopic: "animal-nature-idioms",
        ...q(
          "Fill in the blank: 'Her sudden rude response came like a bolt from the ___.'",
          "blue",
          [
          ["red", "idiom-word-completion"],
          ["green", "idiom-word-completion"],
          ["cloud", "idiom-word-completion"]
          ],
          "A bolt from the blue refers to a complete and unexpected surprise, like lightning from a clear blue sky."
        ),
      },
    ],
    "eq-u5-idioms-practice-quiz": [
      {
        subtopic: "animal-nature-idioms",
        ...q(
          "Choose the correct meaning of the idiom: 'let the cat out of the bag'",
          "disclose a secret mistakenly",
          [
          ["release a pet animal into the garden", "idiom-meaning-mixup"],
          ["buy a new leather handbag", "idiom-meaning-mixup"],
          ["catch a mouse inside the house", "idiom-meaning-mixup"]
          ],
          "To let the cat out of the bag means to reveal a secret, often inadvertently."
        ),
      },
      {
        subtopic: "action-phrases",
        ...q(
          "Choose the correct meaning of the idiom: 'break the ice'",
          "make people feel relaxed in a social setting",
          [
          ["smash frozen cubes in a cold drink", "idiom-meaning-mixup"],
          ["slip on a frosty winter pathway", "idiom-meaning-mixup"],
          ["shiver in a cold mountain wind", "idiom-meaning-mixup"]
          ],
          "To break the ice means to relieve social tension and get conversation flowing among strangers."
        ),
      },
      {
        subtopic: "popular-sayings",
        ...q(
          "Fill in the blank: 'The honest witness was determined to tell the truth, the whole truth, and ___.'",
          "nothing but the truth",
          [
          ["all of the facts", "idiom-fixed-phrase"],
          ["everything without error", "idiom-fixed-phrase"],
          ["every single detail", "idiom-fixed-phrase"]
          ],
          "The standard formal legal oath and fixed phrase is 'the truth, the whole truth, and nothing but the truth'."
        ),
      },
      {
        subtopic: "animal-nature-idioms",
        ...q(
          "Choose the meaning of the idiom: 'turn over a new leaf'",
          "start behaving in a much better way",
          [
          ["flip pages of a thick storybook", "idiom-meaning-mixup"],
          ["rake dead leaves in autumn", "idiom-meaning-mixup"],
          ["plant fresh flowers in soil", "idiom-meaning-mixup"]
          ],
          "To turn over a new leaf means to reform one's conduct and begin anew with good intentions."
        ),
      },
      {
        subtopic: "animal-nature-idioms",
        ...q(
          "Choose the meaning of the idiom: 'add fuel to the fire'",
          "make an angry dispute even worse",
          [
          ["pour petrol into a burning campfire", "idiom-meaning-mixup"],
          ["cook food over an open flame", "idiom-meaning-mixup"],
          ["extinguish a blaze with water", "idiom-meaning-mixup"]
          ],
          "To add fuel to the fire means to worsen an already heated argument or tense crisis."
        ),
      },
      {
        subtopic: "popular-sayings",
        ...q(
          "Fill in the blank: 'You must take his exaggerated story with a grain of ___.'",
          "salt",
          [
          ["sugar", "idiom-word-completion"],
          ["pepper", "idiom-word-completion"],
          ["rice", "idiom-word-completion"]
          ],
          "To take something with a grain of salt means to view it with healthy skepticism."
        ),
      },
    ],
    "eq-u5-idioms-gate-pool": [
      {
        subtopic: "popular-sayings",
        ...q(
          "Choose the meaning of the proverb: 'Actions speak louder than words.'",
          "What you do is more significant than what you say",
          [
          ["Shouting loudly makes people listen carefully", "proverb-meaning-mixup"],
          ["Actors in a play speak louder than audience members", "proverb-meaning-mixup"],
          ["Reading books quietly is better than talking", "proverb-meaning-mixup"]
          ],
          "People judge your true character by your actual deeds rather than empty promises."
        ),
      },
      {
        subtopic: "popular-sayings",
        ...q(
          "Choose the meaning of the proverb: 'A stitch in time saves nine.'",
          "Dealing with a small problem promptly prevents worse trouble",
          [
          ["Sewing clothes by hand requires nine long needles", "proverb-meaning-mixup"],
          ["Tailors always finish their work before sunrise", "proverb-meaning-mixup"],
          ["Never repair old garments when you can buy new ones", "proverb-meaning-mixup"]
          ],
          "Fixing a minor tear or fault immediately saves you from far greater repairs later on."
        ),
      },
      {
        subtopic: "popular-sayings",
        ...q(
          "Choose the meaning of the proverb: 'Every cloud has a silver lining.'",
          "Every difficult situation contains some hopeful aspect",
          [
          ["Rain clouds are lined with metallic silver crystals", "proverb-meaning-mixup"],
          ["Bad weather always ruins outdoor sports matches", "proverb-meaning-mixup"],
          ["Aeroplanes fly above silver clouds in winter", "proverb-meaning-mixup"]
          ],
          "Even in the darkest adversity, there is a positive benefit or silver ray of hope."
        ),
      },
      {
        subtopic: "popular-sayings",
        ...q(
          "Choose the meaning of the saying: 'Practice makes perfect.'",
          "Repeated regular effort leads to high skill and mastery",
          [
          ["Doctor practices are always completely free of errors", "proverb-meaning-mixup"],
          ["Only artists need to practise their work regularly", "proverb-meaning-mixup"],
          ["Perfection is impossible so practice is not necessary", "proverb-meaning-mixup"]
          ],
          "Consistent training and revision refine abilities until high competence is achieved."
        ),
      },
      {
        subtopic: "popular-sayings",
        ...q(
          "Choose the meaning of the proverb: 'Look before you leap.'",
          "Think about the consequences before taking bold action",
          [
          ["Always stare at the ground when jumping across hurdles", "proverb-meaning-mixup"],
          ["Athletes must look at the sky before high jump", "proverb-meaning-mixup"],
          ["Never cross a bridge without wearing boots", "proverb-meaning-mixup"]
          ],
          "One should carefully weigh risks before committing to a major or irreversible step."
        ),
      },
      {
        subtopic: "animal-nature-idioms",
        ...q(
          "Choose the meaning of the idiom: 'hold your horses'",
          "wait patiently and do not rush",
          [
          ["tie your animals to a wooden fence", "idiom-meaning-mixup"],
          ["ride a horse across an open field", "idiom-meaning-mixup"],
          ["buy horses at an annual animal fair", "idiom-meaning-mixup"]
          ],
          "'Hold your horses' is an informal directive meaning to slow down and wait."
        ),
      },
      {
        subtopic: "animal-nature-idioms",
        ...q(
          "Choose the meaning of the idiom: 'crocodile tears'",
          "insincere or fake display of sorrow",
          [
          ["tears shed by reptiles in rivers", "idiom-meaning-mixup"],
          ["crying loudly when physically hurt", "idiom-meaning-mixup"],
          ["feeling deeply moved by a sad poem", "idiom-meaning-mixup"]
          ],
          "Crocodile tears refer to false weeping or hypocritical displays of grief."
        ),
      },
      {
        subtopic: "animal-nature-idioms",
        ...q(
          "Choose the meaning of the idiom: 'kill two birds with one stone'",
          "achieve two goals with a single action",
          [
          ["hunt wild birds with a slingshot", "idiom-meaning-mixup"],
          ["throw pebbles into a clear pond", "idiom-meaning-mixup"],
          ["break two windows with one ball", "idiom-meaning-mixup"]
          ],
          "This idiom signifies completing two distinct objectives through one clever effort."
        ),
      },
      {
        subtopic: "animal-nature-idioms",
        ...q(
          "Choose the meaning of the idiom: 'like a fish out of water'",
          "feeling completely uncomfortable in an unfamiliar setting",
          [
          ["swimming gracefully across a wide blue lake", "idiom-meaning-mixup"],
          ["gasping for fresh air after running fast", "idiom-meaning-mixup"],
          ["eating fresh seafood at a coastal restaurant", "idiom-meaning-mixup"]
          ],
          "A fish out of water feels out of place, awkward, and uncomfortable."
        ),
      },
      {
        subtopic: "animal-nature-idioms",
        ...q(
          "Choose the meaning of the idiom: 'the lion share'",
          "the largest and best portion of something",
          [
          ["the meat that a wild predator hunts", "idiom-meaning-mixup"],
          ["sharing food equally among five friends", "idiom-meaning-mixup"],
          ["the smallest left-over crumb", "idiom-meaning-mixup"]
          ],
          "The lion's share means the major or disproportionately largest part of a whole."
        ),
      },
      {
        subtopic: "action-phrases",
        ...q(
          "Choose the meaning of the idiom: 'call it a day'",
          "stop working on an activity for the present time",
          [
          ["name a new day on the monthly calendar", "idiom-meaning-mixup"],
          ["wake up early to see the morning sun", "idiom-meaning-mixup"],
          ["celebrate an annual public holiday", "idiom-meaning-mixup"]
          ],
          "To call it a day means to cease work on an ongoing project for the day."
        ),
      },
      {
        subtopic: "action-phrases",
        ...q(
          "Choose the meaning of the idiom: 'cry over spilt milk'",
          "waste time regretting past losses that cannot be undone",
          [
          ["drop a carton of cow milk on the kitchen floor", "idiom-meaning-mixup"],
          ["weep loudly when hungry in the morning", "idiom-meaning-mixup"],
          ["pour white milk into a hot teacup", "idiom-meaning-mixup"]
          ],
          "There is no use crying over spilt milk means it is futile to grieve over irreversible mistakes."
        ),
      },
      {
        subtopic: "action-phrases",
        ...q(
          "Choose the meaning of the idiom: 'burn bridges'",
          "destroy relationships so one cannot return to a past situation",
          [
          ["build wooden bridges over raging mountain rivers", "idiom-meaning-mixup"],
          ["set fire to old timber planks in winter", "idiom-meaning-mixup"],
          ["cross a suspension bridge in high wind", "idiom-meaning-mixup"]
          ],
          "To burn bridges means to cut off all ties or avenues of retreat."
        ),
      },
      {
        subtopic: "action-phrases",
        ...q(
          "Choose the meaning of the idiom: 'put all eggs in one basket'",
          "risk everything on a single venture or plan",
          [
          ["carry breakfast food home from the poultry farm", "idiom-meaning-mixup"],
          ["break eggshells into a ceramic bowl", "idiom-meaning-mixup"],
          ["cook a large omelette for breakfast", "idiom-meaning-mixup"]
          ],
          "Putting all eggs in one basket means gambling all resources on one outcome without backup."
        ),
      },
      {
        subtopic: "action-phrases",
        ...q(
          "Choose the meaning of the idiom: 'leave no stone unturned'",
          "make every possible effort to find something",
          [
          ["clean a gravel path in the front garden", "idiom-meaning-mixup"],
          ["dig for buried earthworms under rocks", "idiom-meaning-mixup"],
          ["build a stone wall around the orchard", "idiom-meaning-mixup"]
          ],
          "To leave no stone unturned means to exhaust every conceivable method to achieve a goal."
        ),
      },
    ],
    "eq-u5-test": [
      {
        subtopic: "agreement-tense-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'Neither of the runners' (A) / 'were ready' (B) / 'for the marathon.' (C) / 'No error' (D)",
          "were ready",
          [
          ["Neither of the runners", "boss-error-neither"],
          ["for the marathon.", "boss-error-neither"],
          ["No error", "boss-error-neither"]
          ],
          "Neither is singular and takes was ready, not were ready."
        ),
      },
      {
        subtopic: "pronoun-word-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'The book who' (A) / 'I borrowed from you' (B) / 'was very exciting.' (C) / 'No error' (D)",
          "The book who",
          [
          ["I borrowed from you", "boss-error-relative-pronoun"],
          ["was very exciting.", "boss-error-relative-pronoun"],
          ["No error", "boss-error-relative-pronoun"]
          ],
          "Books are inanimate objects, so the relative pronoun must be which or that, not who."
        ),
      },
      {
        subtopic: "preposition-article-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'She has been living' (A) / 'in Mumbai' (B) / 'since five years.' (C) / 'No error' (D)",
          "since five years.",
          [
          ["She has been living", "boss-error-since-for"],
          ["in Mumbai", "boss-error-since-for"],
          ["No error", "boss-error-since-for"]
          ],
          "With a period or duration of time (five years), we use for, not since: for five years."
        ),
      },
      {
        subtopic: "agreement-tense-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'He did not knew' (A) / 'the correct answer' (B) / 'to the teacher question.' (C) / 'No error' (D)",
          "He did not knew",
          [
          ["the correct answer", "boss-error-auxiliary"],
          ["to the teacher question.", "boss-error-auxiliary"],
          ["No error", "boss-error-auxiliary"]
          ],
          "After the auxiliary did not, the verb must be in base form: did not know."
        ),
      },
      {
        subtopic: "preposition-article-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'Ravi is superior' (A) / 'than me' (B) / 'in mathematics.' (C) / 'No error' (D)",
          "than me",
          [
          ["Ravi is superior", "boss-error-superior-to"],
          ["in mathematics.", "boss-error-superior-to"],
          ["No error", "boss-error-superior-to"]
          ],
          "Adjectives ending in -ior (superior, inferior, senior, junior) take to, not than: superior to me."
        ),
      },
      {
        subtopic: "polite-requests",
        ...q(
          "Choose the correct option to complete the conversation:\nTeacher: 'Would you mind sharing your textbook with Priya?'\nKavita: '___, she can share with me.'",
          "Not at all",
          [
          ["Yes I mind", "boss-dial-not-at-all"],
          ["Certainly never", "boss-dial-not-at-all"],
          ["Of course I do", "boss-dial-not-at-all"]
          ],
          "The polite answer to 'Would you mind...?' is 'Not at all'."
        ),
      },
      {
        subtopic: "social-responses",
        ...q(
          "Choose the correct option to complete the dialogue:\nRamesh: 'Do you know when the results will be announced?'\nSuresh: 'Your guess is ___ mine.'",
          "as good as",
          [
          ["better than", "boss-dial-guess"],
          ["the best of", "boss-dial-guess"],
          ["much worse to", "boss-dial-guess"]
          ],
          "The idiom 'your guess is as good as mine' signifies having no special knowledge."
        ),
      },
      {
        subtopic: "everyday-conversations",
        ...q(
          "Choose the natural conversational phrase:\nFather: 'I will pick you up, but do not panic ___ the train is delayed.'\nSon: 'Ok Dad, I will wait on the platform.'",
          "in case",
          [
          ["as long as", "boss-dial-in-case"],
          ["while", "boss-dial-in-case"],
          ["during", "boss-dial-in-case"]
          ],
          "The phrase in case introduces a contingency."
        ),
      },
      {
        subtopic: "social-responses",
        ...q(
          "Choose the best reply in this conversation:\nHost: 'Thank you for attending our science exhibition.'\nVisitor: '___, we enjoyed learning about the exhibits.'",
          "The pleasure was all ours",
          [
          ["You had to thank us", "boss-dial-pleasure"],
          ["We were forced to come", "boss-dial-pleasure"],
          ["It was nothing exciting", "boss-dial-pleasure"]
          ],
          "The formal, polite reply to a host thanking a guest is 'The pleasure was all ours'."
        ),
      },
      {
        subtopic: "polite-requests",
        ...q(
          "Complete the conversation:\nAman: 'Shall we invite our neighbours to the Diwali celebration?'\nMother: '___, that is a kind and thoughtful thought!'",
          "By all means",
          [
          ["By no chance", "boss-dial-by-all-means"],
          ["In short words", "boss-dial-by-all-means"],
          ["Under no condition", "boss-dial-by-all-means"]
          ],
          "'By all means' signals enthusiastic agreement."
        ),
      },
      {
        subtopic: "action-phrases",
        ...q(
          "Choose the correct meaning of the idiom: 'bite the bullet'",
          "face a painful or difficult situation with fortitude",
          [
          ["fire a lead bullet from a hunting rifle", "boss-idiom-bite-bullet"],
          ["refuse to answer questions in court", "boss-idiom-bite-bullet"],
          ["eat hard food during outdoor camping", "boss-idiom-bite-bullet"]
          ],
          "To bite the bullet means to endure unavoidable hardship with resolve."
        ),
      },
      {
        subtopic: "popular-sayings",
        ...q(
          "Choose the correct meaning of the idiom: 'spill the beans'",
          "reveal a secret prematurely or indiscreetly",
          [
          ["drop cooking vegetables on the floor", "boss-idiom-spill-beans"],
          ["plant legumes in fertile soil", "boss-idiom-spill-beans"],
          ["cook bean stew for lunch", "boss-idiom-spill-beans"]
          ],
          "To spill the beans means to let out confidential information."
        ),
      },
      {
        subtopic: "animal-nature-idioms",
        ...q(
          "Fill in the blank to complete the idiom: 'The old grandfather was a bit under the ___, so he rested indoors.'",
          "weather",
          [
          ["blanket", "boss-idiom-under-weather"],
          ["umbrella", "boss-idiom-under-weather"],
          ["canopy", "boss-idiom-under-weather"]
          ],
          "Under the weather means experiencing slight illness."
        ),
      },
      {
        subtopic: "action-phrases",
        ...q(
          "Choose the meaning of the idiom: 'burn the midnight oil'",
          "work or study late into the night hours",
          [
          ["waste kerosene in a damaged lantern", "boss-idiom-midnight-oil"],
          ["set fire to crude petroleum drums", "boss-idiom-midnight-oil"],
          ["wake up before dawn to exercise", "boss-idiom-midnight-oil"]
          ],
          "To burn the midnight oil means working late into the night."
        ),
      },
      {
        subtopic: "popular-sayings",
        ...q(
          "Choose the meaning of the idiom: 'see eye to eye'",
          "be in complete agreement with another person",
          [
          ["examine someone through spectacles", "boss-idiom-see-eye-to-eye"],
          ["look directly into a person's eyes", "boss-idiom-see-eye-to-eye"],
          ["have identical eye colour", "boss-idiom-see-eye-to-eye"]
          ],
          "To see eye to eye means to hold the same view or agree completely."
        ),
      },
    ],
  },

  // ---------- Readings ----------
  readings: {
    "eq-read-lost-compass": {
      title: "The Mystery of the Silver Compass",
      mode: "fullPassage",
      type: "fullPassage",
      author: "Apprec8",
      glossary: {
        attic: "a room or space just below the roof of a house",
        parchment: "a heavy, durable sheet of paper used for historic documents",
        antique: "an object valuable because of its high age and fine craftsmanship",
        azimuth: "the horizontal direction or compass bearing of an object",
        needle: "a thin magnetic pointer on a navigational instrument",
        dial: "the marked circular face of a measuring instrument",
      },
      paragraphs: [
        "On a rainy Saturday afternoon during the school holidays, Rohan and his sister Meera climbed the narrow wooden stairs into grandmother's dusty attic. The room was crammed with forgotten treasures: wicker baskets, stacks of old sea charts, leather-bound journals, and copper lanterns. Tucked away under the eaves stood a heavy iron sea chest with tarnished brass fittings. When Rohan lifted the heavy lid, a faint scent of cedar and sea salt drifted out. Resting inside on a velvet cushion was an antique silver compass, its brass casing polished to a warm glow despite decades in the dark.",
        "Meera lifted the compass gently by its ring. As she held it flat on her open palm, the delicate magnetic needle began to quiver. Instead of settling toward magnetic north, the needle glowed faintly blue and pointed steadfastly toward the great hollow oak tree in the back garden. 'Look at the glass dial,' Meera exclaimed softly. Engraved along the edge of the circular dial were delicate degree markings and numbers indicating the compass azimuth. Beside the compass lay a rolled yellow parchment tied with faded blue twine.",
        "Rohan untied the twine and unrolled the stiff parchment. It was a hand-drawn map of the coastal homestead, sketched by their grandfather who had been a seasoned sea captain on merchant voyages across the Indian Ocean. At the bottom of the map, grandfather had penned a note in flowing black ink: 'To my brave navigators: Leave no stone unturned, and true sailors shall find their haven. Follow the azimuth of the silver compass when the evening bell tolls.'",
        "Grandmother arrived at the attic doorway carrying two mugs of hot ginger tea. Smiling warmly, she told them how grandfather had safeguarded the compass through violent monsoon storms and never parted with it. She had carefully preserved the heirloom in the sea chest so that one day the children could discover grandfather's secret garden quest. Inspired by her words, the children raced down to the garden with umbrellas and boots, following the direction indicated by the compass needle straight to the hollow oak, where they found a small brass key wrapped in oiled silk.",
        "Holding the brass key, Rohan and Meera marvelled at grandfather's clever design. The treasure hunt was never about finding gold or jewels; grandfather had left the compass and handwritten map to encourage curiosity, adventure, and respect for family history among his grandchildren. As the rain cleared and the evening sun broke through the clouds, both children agreed that learning grandfather's navigational skills was the greatest adventure of all.",
      ],
      questions: [
        {
          ...q(
            "Where did Rohan and Meera discover the antique silver compass?",
            "Inside an iron sea chest in grandmother's dusty attic",
            [
            ["Under the floorboards of the school science laboratory", "reading-detail-missed"],
            ["Buried near the stone well in the front garden", "reading-detail-missed"],
            ["Inside a wooden desk drawer in the village library", "reading-detail-missed"]
            ],
            "Paragraph 1 mentions that while exploring grandmother's dusty attic on a rainy afternoon, they found an iron sea chest containing the compass."
          ),
          evidence: { paragraph: 0, text: "iron sea chest" },
        },
        {
          ...q(
            "What was special about the compass needle when Meera held it flat?",
            "It glowed with blue light and pointed toward the garden oak",
            [
            ["It spun around wildly without stopping", "reading-detail-missed"],
            ["It pointed straight toward the southern hills", "reading-detail-missed"],
            ["It was completely rusted and refused to move", "reading-detail-missed"]
            ],
            "Paragraph 2 explains that the luminous needle glowed faintly blue and pointed toward the great hollow oak in the garden."
          ),
          evidence: { paragraph: 1, text: "needle glowed faintly blue" },
        },
        {
          ...q(
            "What does the word 'parchment' mean as used in the story?",
            "A heavy sheet of paper used for historic documents",
            [
            ["A metal key used to unlock sea chests", "reading-vocab-context"],
            ["A wooden steering wheel from a sailing vessel", "reading-vocab-context"],
            ["A glass magnifying lens used by navigators", "reading-vocab-context"]
            ],
            "Parchment is a thick, durable writing paper historically made from animal skin."
          ),
          evidence: { paragraph: 1, text: "rolled yellow parchment" },
        },
        {
          ...q(
            "What idiom did grandfather use in his handwritten journal note?",
            "Leave no stone unturned to find the truth",
            [
            ["Bite the bullet and face the storm", "reading-idiom-context"],
            ["Burn the midnight oil in the study", "reading-idiom-context"],
            ["Let the cat out of the bag early", "reading-idiom-context"]
            ],
            "Paragraph 3 cites the handwritten note in the journal: 'Leave no stone unturned, and true sailors shall find their haven.'"
          ),
          evidence: { paragraph: 2, text: "Leave no stone unturned" },
        },
        {
          ...q(
            "Select the statement that is INCORRECT according to the passage:",
            "Grandmother threw the compass into the sea during the storm.",
            [
            ["The children found a brass key wrapped in silk beneath the oak.", "reading-statement-check"],
            ["Grandfather was a seasoned sea captain on merchant voyages.", "reading-statement-check"],
            ["The attic was filled with sea charts and leather journals.", "reading-statement-check"]
            ],
            "Grandmother kept the compass safe in the chest; she did not throw it into the sea."
          ),
          evidence: { paragraph: 3, text: "preserved the heirloom in the sea chest" },
        },
        {
          ...q(
            "What was the main purpose of grandfather leaving the compass and map for his grandchildren?",
            "To encourage curiosity, adventure, and respect for family history",
            [
            ["To sell the antique compass for a large amount of gold", "reading-inference-theme"],
            ["To test if the children could climb high mountain ridges", "reading-inference-theme"],
            ["To prove that modern digital maps are completely useless", "reading-inference-theme"]
            ],
            "The story concludes that grandfather wanted them to learn navigation and cherish heritage through a treasure hunt."
          ),
          evidence: { paragraph: 4, text: "encourage curiosity, adventure, and respect for family history" },
        },
      ],
    },
  },

  wordTables: {},

  // ---------- The tree ----------
  nodes: [
    unit("eq-u5", 5, "Sentence Errors & Expression"),

    // Topic 0: Spot the Error
    errors,
    withSubtopic(practice("eq-u5-errors-p1", errors, 1, "Sentence Traps Practice", "medium", [quiz("eq-u5-errors-practice-quiz")]), "pronoun-word-errors"),
    gate("eq-u5-errors-gate", errors, "Error Spotting Master Challenge", "eq-u5-errors-gate-pool", {
      "agreement-tense-errors": "Subject-verb and tense errors",
      "pronoun-word-errors": "Pronoun and incorrect word errors",
      "preposition-article-errors": "Preposition and article errors",
    }),
    endless(errors),

    // Topic 1: Situational Dialogue
    dialogue,
    withSubtopic(practice("eq-u5-dialogue-p1", dialogue, 1, "Social Exchange Practice", "medium", [quiz("eq-u5-dialogue-practice-quiz")]), "social-responses"),
    gate("eq-u5-dialogue-gate", dialogue, "Dialogue & Response Challenge", "eq-u5-dialogue-gate-pool", {
      "polite-requests": "Polite requests and offers",
      "social-responses": "Social situations and apologies",
      "everyday-conversations": "Everyday school and public dialogue",
    }),
    endless(dialogue),

    // Topic 2: Common Idioms & Proverbs
    idioms,
    withSubtopic(practice("eq-u5-idioms-p1", idioms, 1, "Proverbs in Context", "medium", [quiz("eq-u5-idioms-practice-quiz")]), "popular-sayings"),
    gate("eq-u5-idioms-gate", idioms, "Idioms & Proverbs Challenge", "eq-u5-idioms-gate-pool", {
      "popular-sayings": "Popular proverbs and sayings",
      "animal-nature-idioms": "Animal and nature idioms",
      "action-phrases": "Common action and life phrases",
    }),
    endless(idioms),

    // Reading & Boss
    u5r,
    boss(
      "eq-u5-boss",
      "eq-u5",
      "Unit 5 Boss",
      "eq-u5-test",
      "The Trial of the Silver Scribe: The ancient Quill-Phantom has rewritten the kingdom records with subtle grammar slips, rude dialogue, and scrambled idioms! Cleanse the royal scrolls, speak with true courtesy, and decipher the cryptic sayings to claim the Silver Quill."
    ),
  ],
};

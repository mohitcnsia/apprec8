// data/englishQuest/units/u4.js: Unit 4, Spot the Error (IEO Grammar)
// Built per docs/CONTENT_GUIDE.md §2–7 and docs/exam/ieo-pattern.md.
import { q, study, quiz, unit, main, practice, gate, withSubtopic, endless, boss } from "../helpers.js";

// ---------- Nodes definition ----------
const errors = main("eq-u4-errors", "eq-u4", 0, "Spot the Error", [
  study("eq-u4-errors"),
  quiz("eq-u4-errors-warmup"),
]);

export default {
  // ---------- Study Pages ----------
  studyPages: {
    "eq-u4-errors": {
      name: "Spotting Sentence Errors",
      author: "Apprec8",
      content: "### 🔍 Spot the Sentence Error\n\nIn the IEO, error spotting questions test your ability to read a complete sentence and pinpoint grammatical mistakes.\n\n---\n\n### 🧱 Sentence Structure in Four Parts\n\nA sentence is divided into four numbered or lettered parts:\n- **(A)** First part\n- **(B)** Second part\n- **(C)** Third part\n- **(D)** No error (if the sentence is entirely correct!)\n\n---\n\n### ⚠️ The Top 5 Error Patterns in IEO\n\n1. **Pronoun Reference Errors:**\n   - ❌ *My grandmother told us stories of **its** childhood.*\n   - ✅ *My grandmother told us stories of **her** childhood.* (Grandmother is a person, not a thing!)\n2. **Passive Voice Confusion:**\n   - ❌ *Jatin was **accusing** of theft by his neighbour.*\n   - ✅ *Jatin was **accused** of theft by his neighbour.* (Passive requires past participle!)\n3. **Subject-Verb Agreement Clashes:**\n   - ❌ *Neither of the two mangoes **were** sweet.*\n   - ✅ *Neither of the two mangoes **was** sweet.* ('Neither' is singular!)\n4. **Adjective vs Adverb Mix-ups:**\n   - ❌ *Sheena was **exhaustive** after running the marathon.*\n   - ✅ *Sheena was **exhausted** after running the marathon.* ('Exhaustive' means comprehensive; 'exhausted' means very tired!)\n5. **Preposition and Collocation Errors:**\n   - ❌ *The teacher has no tolerance **on** indiscipline.*\n   - ✅ *The teacher has no tolerance **for** indiscipline.* ('Tolerance for' is the correct preposition!)\n\n> 💡 **Inspection Strategy:** First check the subject and verb agreement. Second, check pronouns. Third, check prepositions and word forms!",
    },
  },

  // ---------- Quizzes ----------
  quizzes: {
    "eq-u4-errors-warmup": [
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
    "eq-u4-errors-practice-quiz": [
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
          "Choose the part of the sentence that has an error: 'The Nile is' (A) / 'longer than' (B) / 'any other river in Africa.' (C) / 'No error' (D)",
          "No error",
          [
          ["The Nile is", "error-comparative-other"],
          ["longer than", "error-comparative-other"],
          ["any other river in Africa.", "error-comparative-other"]
          ],
          "The sentence correctly uses 'any other river' to compare the Nile with other African rivers. There is no error."
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
    "eq-u4-errors-gate-pool": [
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
          "Choose the part of the sentence that has an error: 'The news broadcast' (A) / 'was watched by' (B) / 'millions of viewers.' (C) / 'No error' (D)",
          "No error",
          [
          ["The news broadcast", "error-news-agreement"],
          ["was watched by", "error-news-agreement"],
          ["millions of viewers.", "error-news-agreement"]
          ],
          "The singular subject 'The news broadcast' correctly takes the singular verb 'was watched by'. There is no error."
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
          "Choose the part of the sentence that has an error: 'The teacher asked' (A) / 'Ravi and I' (B) / 'to carry the books.' (C) / 'No error' (D)",
          "Ravi and I",
          [
          ["The teacher asked", "error-pronoun-case"],
          ["to carry the books.", "error-pronoun-case"],
          ["No error", "error-pronoun-case"]
          ],
          "The verb asked takes an objective pronoun: The teacher asked Ravi and me to carry the books."
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
          "Choose the part of the sentence that has an error: 'He prefers reading books' (A) / 'to watching' (B) / 'television shows.' (C) / 'No error' (D)",
          "No error",
          [
          ["He prefers reading books", "error-prefer-to"],
          ["to watching", "error-prefer-to"],
          ["television shows.", "error-prefer-to"]
          ],
          "The verb prefer correctly takes the preposition 'to' (prefers reading to watching). There is no error."
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

    "eq-u4-test": [
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
          "Choose the part of the sentence that has an error: 'He did not knew' (A) / 'the correct answer' (B) / 'to the question.' (C) / 'No error' (D)",
          "He did not knew",
          [
          ["the correct answer", "boss-error-auxiliary"],
          ["to the question.", "boss-error-auxiliary"],
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
        subtopic: "agreement-tense-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'Each of the students' (A) / 'have completed' (B) / 'the science project.' (C) / 'No error' (D)",
          "have completed",
          [
          ["Each of the students", "boss-error-each"],
          ["the science project.", "boss-error-each"],
          ["No error", "boss-error-each"]
          ],
          "Each is an indefinite singular pronoun and requires the singular verb has completed."
        ),
      },
      {
        subtopic: "pronoun-word-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'My sister and me' (A) / 'went to the market' (B) / 'to buy vegetables.' (C) / 'No error' (D)",
          "My sister and me",
          [
          ["went to the market", "boss-error-subject-pronoun"],
          ["to buy vegetables.", "boss-error-subject-pronoun"],
          ["No error", "boss-error-subject-pronoun"]
          ],
          "In the subject position, use the subjective pronoun I: My sister and I went to the market."
        ),
      },
      {
        subtopic: "preposition-article-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'The passenger train arrived' (A) / 'at the platform' (B) / 'on five o\\'clock.' (C) / 'No error' (D)",
          "on five o'clock.",
          [
          ["The passenger train arrived", "boss-error-at-time"],
          ["at the platform", "boss-error-at-time"],
          ["No error", "boss-error-at-time"]
          ],
          "We use the preposition at for exact clock times: at five o'clock."
        ),
      },
      {
        subtopic: "pronoun-word-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'She walked slow' (A) / 'because the mountain path' (B) / 'was very slippery.' (C) / 'No error' (D)",
          "She walked slow",
          [
          ["because the mountain path", "boss-error-adverb"],
          ["was very slippery.", "boss-error-adverb"],
          ["No error", "boss-error-adverb"]
          ],
          "An adverb of manner is required to modify the action verb walked: She walked slowly."
        ),
      },
      {
        subtopic: "agreement-tense-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'The teacher asked him' (A) / 'why was he late' (B) / 'for the morning assembly.' (C) / 'No error' (D)",
          "why was he late",
          [
          ["The teacher asked him", "boss-error-indirect-order"],
          ["for the morning assembly.", "boss-error-indirect-order"],
          ["No error", "boss-error-indirect-order"]
          ],
          "In reported or indirect speech, the subject comes before the verb: why he was late."
        ),
      },
      {
        subtopic: "preposition-article-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'He is senior' (A) / 'to my brother' (B) / 'in the bank office.' (C) / 'No error' (D)",
          "No error",
          [
          ["He is senior", "boss-error-senior-to"],
          ["to my brother", "boss-error-senior-to"],
          ["in the bank office.", "boss-error-senior-to"]
          ],
          "Latin comparative adjectives like senior, junior, and superior correctly take the preposition 'to' (senior to my brother). There is no error."
        ),
      },
      {
        subtopic: "agreement-tense-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'One of my cousins' (A) / 'live in Chennai' (B) / 'near the coastal road.' (C) / 'No error' (D)",
          "live in Chennai",
          [
          ["One of my cousins", "boss-error-one-of"],
          ["near the coastal road.", "boss-error-one-of"],
          ["No error", "boss-error-one-of"]
          ],
          "The subject is One (singular), which governs the verb lives in Chennai."
        ),
      },
      {
        subtopic: "agreement-tense-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'Neither the headmaster' (A) / 'nor the teachers was' (B) / 'present in the auditorium.' (C) / 'No error' (D)",
          "nor the teachers was",
          [
          ["Neither the headmaster", "boss-error-nor-plural"],
          ["present in the auditorium.", "boss-error-nor-plural"],
          ["No error", "boss-error-nor-plural"]
          ],
          "When subjects are joined by nor, the verb agrees with the closer subject: teachers were present."
        ),
      },
      {
        subtopic: "preposition-article-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'He bought a notebook' (A) / 'and a inkpot' (B) / 'from the stationery shop.' (C) / 'No error' (D)",
          "and a inkpot",
          [
          ["He bought a notebook", "boss-error-a-an"],
          ["from the stationery shop.", "boss-error-a-an"],
          ["No error", "boss-error-a-an"]
          ],
          "The word inkpot begins with a vowel sound, so it takes the indefinite article an."
        ),
      },
      {
        subtopic: "pronoun-word-errors",
        ...q(
          "Choose the part of the sentence that has an error: 'This tower is the' (A) / 'most tallest structure' (B) / 'in our historic city.' (C) / 'No error' (D)",
          "most tallest structure",
          [
          ["This tower is the", "boss-error-double-superlative"],
          ["in our historic city.", "boss-error-double-superlative"],
          ["No error", "boss-error-double-superlative"]
          ],
          "Avoid double superlatives: use either tallest or most tall, but tallest is the standard form."
        ),
      },
    ],
  },

  readings: {},
  wordTables: {},

  // ---------- The tree ----------
  nodes: [
    unit("eq-u4", 4, "Spot the Error"),

    // Topic 0: Spot the Error
    errors,
    withSubtopic(
      practice("eq-u4-errors-p1", errors, 1, "Sentence Traps Practice", "medium", [
        quiz("eq-u4-errors-practice-quiz"),
      ]),
      "pronoun-word-errors"
    ),
    gate("eq-u4-errors-gate", errors, "Error Spotting Master Challenge", "eq-u4-errors-gate-pool", {
      "agreement-tense-errors": "Subject-verb and tense errors",
      "pronoun-word-errors": "Pronoun and incorrect word errors",
      "preposition-article-errors": "Preposition and article errors",
    }),
    endless(errors),

    // Unit 4 Boss
    boss(
      "eq-u4-boss",
      "eq-u4",
      "Unit 4 Boss",
      "eq-u4-test",
      "The Error Phantom has altered the kingdom records with subtle grammar errors! Spot the mistakes in subject agreement, tenses, and prepositions to restore the true scrolls."
    ),
  ],
};

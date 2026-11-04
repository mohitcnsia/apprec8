// data/fixes/ieoFixes.js
// Corrections to old IEO questions (Firestore `quizQuestions`) that English Quest Unit 1 reuses.
// Found by Claude reading all 319 reused questions (2026-11-04): two right answers, wrong concepts,
// missing explanations, words that are not kid-friendly. Applied by components/quiz/FixIeoQuestionsButton.js
// (Admin tools, owner OK needed). Each fix keeps the question's document and position, so kids' progress stays.
// `was` = the question text before the fix: the button skips a question that changed since.

export const IEO_FIXES = [
 {
  "docId": "xZHYgP2w0cmN4q3BR6fM",
  "quizId": "noun-intro-quiz",
  "order": 15,
  "was": "Which word is a gender noun?",
  "why": "'doctor' is also a gender noun (common gender)",
  "set": {
   "question": "Which word names a female?",
   "explanation": [
    "'Queen' names a female, so it is feminine gender.",
    "'Doctor' can be a man or a woman (common gender)."
   ]
  }
 },
 {
  "docId": "xhV1ryHyvjY3LAGIl6B5",
  "quizId": "noun-basic-quiz",
  "order": 9,
  "was": "Which is a proper noun?",
  "why": "'Apple' is a fruit unless we mean the company",
  "set": {
   "options": [
    "Kerala",
    "fruit",
    "grapes",
    "banana"
   ],
   "answer": "Kerala",
   "explanation": [
    "'Kerala' is the name of one particular state, so it is a proper noun.",
    "Proper nouns start with a capital letter."
   ]
  }
 },
 {
  "docId": "MTEsqMT9O6rpP4D9UBnx",
  "quizId": "noun-gender-quiz",
  "order": 4,
  "was": "What is the common noun in the list?",
  "why": "all options are common nouns",
  "set": {
   "question": "Which noun can be used for a man or a woman?",
   "explanation": [
    "A teacher can be a man or a woman, so 'teacher' is common gender.",
    "Mother, son and father each name one gender."
   ]
  }
 },
 {
  "docId": "47RWo8w1sQ59vzfm8AMa",
  "quizId": "noun-gender-quiz",
  "order": 6,
  "was": "What is the neuter form of 'baby'?",
  "why": "'neuter form of baby' made no sense",
  "set": {
   "question": "Which word can mean a boy or a girl?",
   "options": [
    "baby",
    "prince",
    "aunt",
    "nephew"
   ],
   "answer": "baby",
   "explanation": [
    "A baby can be a boy or a girl, so 'baby' is common gender.",
    "'Prince' and 'nephew' are masculine; 'aunt' is feminine."
   ]
  }
 },
 {
  "docId": "XBqZbmH1wadRFbHEdXse",
  "quizId": "noun-gender-quiz",
  "order": 9,
  "was": "Which of these is common gender?",
  "why": "'sheep' is common gender too",
  "set": {
   "options": [
    "doctor",
    "lion",
    "king",
    "mother"
   ],
   "explanation": [
    "A doctor can be a man or a woman, so 'doctor' is common gender.",
    "'Lion' and 'king' are masculine; 'mother' is feminine."
   ]
  }
 },
 {
  "docId": "NSbSa6uQzbAA5pR3c501",
  "quizId": "noun-gender-quiz",
  "order": 12,
  "was": "What is the feminine form of 'bull'?",
  "why": "'heifer' (young cow) is feminine too",
  "set": {
   "options": [
    "cow",
    "mare",
    "doe",
    "calf"
   ],
   "explanation": [
    "A bull is a male; the female is a cow.",
    "A mare is a female horse, a doe a female deer, and a calf is a young one."
   ]
  }
 },
 {
  "docId": "x3sLWPxkHhKJT72ZcZOD",
  "quizId": "noun-gender-quiz",
  "order": 15,
  "was": "Which of the following nouns is neuter?",
  "why": "'flower' is neuter too",
  "set": {
   "options": [
    "pen",
    "woman",
    "man",
    "child"
   ],
   "explanation": [
    "A pen is a thing, so it is neuter gender.",
    "'Man' and 'woman' have a gender, and 'child' is common gender."
   ]
  }
 },
 {
  "docId": "fMXepVYdE6v7DocvOlhD",
  "quizId": "noun-gender-quiz-l2",
  "order": 2,
  "was": "Identify the Opposite Gender → Hunter",
  "why": "no explanation",
  "set": {
   "explanation": [
    "The female of 'hunter' is 'huntress'.",
    "Careful with the spelling: huntress, not 'hunteress'."
   ]
  }
 },
 {
  "docId": "Z35XsmKqvdPSO1z52EeV",
  "quizId": "noun-gender-quiz-l2",
  "order": 3,
  "was": "Identify the Opposite Gender → Mare",
  "why": "no explanation",
  "set": {
   "explanation": [
    "A mare is a female horse. The male is a stallion."
   ]
  }
 },
 {
  "docId": "Lodjt0Ew2NEWm2AzriFO",
  "quizId": "noun-gender-quiz-l2",
  "order": 4,
  "was": "Identify the Opposite Gender → Wizard",
  "why": "no explanation",
  "set": {
   "explanation": [
    "A wizard is a man with magic powers. The female is a witch."
   ]
  }
 },
 {
  "docId": "IMgiDe5dkrO4eyGvBqZm",
  "quizId": "noun-gender-quiz-l2",
  "order": 5,
  "was": "Identify the Opposite Gender → Nun",
  "why": "no explanation",
  "set": {
   "explanation": [
    "A nun is a woman who lives a religious life. The male is a monk."
   ]
  }
 },
 {
  "docId": "H1ErA01CAkPUH249nwBS",
  "quizId": "noun-gender-quiz-l2",
  "order": 6,
  "was": "Identify the Opposite Gender → Priest",
  "why": "no explanation",
  "set": {
   "explanation": [
    "The female of 'priest' is 'priestess'."
   ]
  }
 },
 {
  "docId": "jNndBHe03ihrB94muD5T",
  "quizId": "noun-gender-quiz-l2",
  "order": 8,
  "was": "Identify the Opposite Gender → Pen",
  "why": "remove a word that isn't kid-friendly",
  "set": {
   "options": [
    "Cob",
    "Hen",
    "Goose",
    "Drake"
   ]
  }
 },
 {
  "docId": "Rq1PAFSV72BIqwDYS5uI",
  "quizId": "noun-gender-quiz-l2",
  "order": 9,
  "was": "Identify the Opposite Gender → Drone",
  "why": "'Worker Bee' is female too",
  "set": {
   "options": [
    "Queen Bee",
    "Gander",
    "Cob",
    "Drake"
   ],
   "explanation": [
    "A drone is a male bee. The queen bee is the female that lays the eggs."
   ]
  }
 },
 {
  "docId": "XQoNnAsZsvdQjz4d5CZx",
  "quizId": "noun-gender-quiz-l2",
  "order": 11,
  "was": "Identify the Opposite Gender → Fox",
  "why": "remove a word that isn't kid-friendly",
  "set": {
   "options": [
    "Vixen",
    "Doe",
    "Hen",
    "Ewe"
   ]
  }
 },
 {
  "docId": "zmRgt3mBttBsBtdzGkby",
  "quizId": "noun-gender-quiz-l2",
  "order": 13,
  "was": "Identify the Opposite Gender → Dog",
  "why": "answer word isn't kid-friendly",
  "set": {
   "question": "Identify the Opposite Gender → Tiger",
   "options": [
    "Tigress",
    "Lioness",
    "Doe",
    "Ewe"
   ],
   "answer": "Tigress",
   "explanation": [
    "The female of 'tiger' is 'tigress'."
   ]
  }
 },
 {
  "docId": "kesMMEuvmT3GQsqpKGlS",
  "quizId": "noun-adv-quiz",
  "order": 2,
  "was": "Which of these is a concrete noun?",
  "why": "'air' and 'music' are also concrete (we feel and hear them)",
  "set": {
   "options": [
    "apple",
    "truth",
    "kindness",
    "honesty"
   ],
   "explanation": [
    "You can see, touch and eat an apple, so it is a concrete noun.",
    "Truth, kindness and honesty are ideas you can't touch: abstract nouns."
   ]
  }
 },
 {
  "docId": "HCqvJtFFXUXlLR2W7bCk",
  "quizId": "noun-adv-quiz",
  "order": 3,
  "was": "Pick the material noun.",
  "why": "'milk' is a material noun too",
  "set": {
   "options": [
    "gold",
    "courage",
    "team",
    "pen"
   ],
   "explanation": [
    "Gold is a material: a substance things are made of.",
    "Courage is an idea, a team is a group, and a pen is a thing."
   ]
  }
 },
 {
  "docId": "bYj4ikTd7AKK6zrulynK",
  "quizId": "noun-adv-quiz",
  "order": 5,
  "was": "Choose the uncountable noun.",
  "why": "'happiness' is uncountable too",
  "set": {
   "options": [
    "salt",
    "orange",
    "chair",
    "bottle"
   ],
   "explanation": [
    "We can't count salt (one salt, two salts), so it is uncountable.",
    "Oranges, chairs and bottles can be counted."
   ]
  }
 },
 {
  "docId": "x6oLl3l0GcnhYQEdbyZp",
  "quizId": "ieo-pronouns-intro-quiz",
  "order": 1,
  "was": "Which of these is a personal pronoun?",
  "why": "'her' is a personal pronoun too (object form)",
  "set": {
   "options": [
    "I",
    "mine",
    "his",
    "this"
   ],
   "explanation": [
    "'I' is a personal pronoun for the person speaking.",
    "'Mine' and 'his' show ownership; 'this' points at something."
   ]
  }
 },
 {
  "docId": "GkvoWsw8WsxZscAgWDNY",
  "quizId": "ieo-pronouns-intro-quiz",
  "order": 10,
  "was": "Which pronoun is used to replace a noun that refers to a thing or animal?",
  "why": "'they' can also replace things and animals",
  "set": {
   "question": "Which pronoun do we use for ONE thing or animal?",
   "explanation": [
    "'It' stands for one thing or animal.",
    "'He' and 'she' are for people, and 'they' is for more than one."
   ]
  }
 },
 {
  "docId": "J76vdw2AqwYVbFFSftfz",
  "quizId": "ieo-pronouns-basic-quiz",
  "order": 14,
  "was": "Select the pair that includes ONLY personal pronouns.",
  "why": "'I, her' is also two personal pronouns",
  "set": {
   "options": [
    "He, it",
    "My, his",
    "We, ours",
    "You, yours"
   ],
   "explanation": [
    "'He' and 'it' are personal pronouns.",
    "'My', 'his', 'ours' and 'yours' show ownership."
   ]
  }
 },
 {
  "docId": "qWziC265Mzl3lsD6W9jm",
  "quizId": "ieo-pronouns-adv-1-quiz",
  "order": 13,
  "was": "Choose the indefinite pronoun: ___ wants to visit the zoo.",
  "why": "'All of the above' (several right answers)",
  "set": {
   "options": [
    "Everybody",
    "Those",
    "Myself",
    "Whose"
   ],
   "answer": "Everybody",
   "explanation": [
    "'Everybody' means all people without naming anyone, so it is an indefinite pronoun."
   ]
  }
 },
 {
  "docId": "nX7mL8j02cgrzNNt5fdQ",
  "quizId": "ieo-pronouns-adv-2-quiz",
  "order": 4,
  "was": "______ is knocking at the door?",
  "why": "'What is knocking at the door?' is also correct",
  "set": {
   "options": [
    "Who",
    "Whom",
    "Whose",
    "That"
   ],
   "explanation": [
    "'Who' is for the person doing the action: 'Who is knocking?'",
    "'Whom' is only for the person receiving the action."
   ]
  }
 },
 {
  "docId": "ByZOGfOUrZzgriUg7WK9",
  "quizId": "ieo-pronouns-adv-2-quiz",
  "order": 13,
  "was": "______ are you talking about?",
  "why": "'Who / What are you talking about?' are also correct",
  "set": {
   "question": "To ______ did you give the book?",
   "options": [
    "whom",
    "who",
    "which",
    "what"
   ],
   "answer": "whom",
   "explanation": [
    "After 'to', we use 'whom' for a person: 'To whom did you give the book?'"
   ]
  }
 },
 {
  "docId": "J16hzUzVBpixOze5CyCZ",
  "quizId": "verbs-link-quiz",
  "order": 15,
  "was": "Which sentence contains an Action Verb?",
  "why": "'She looks at the stars' is an action verb too",
  "set": {
   "options": [
    "The sun shines brightly.",
    "The teacher is nice.",
    "The soup smells good.",
    "They seem happy."
   ],
   "explanation": [
    "'Shines' shows action!",
    "In 'smells good', 'smells' links the soup to 'good', like 'is'."
   ]
  }
 },
 {
  "docId": "1YGquqtNBSaqrwFbjBte",
  "quizId": "verbs-trans-quiz",
  "order": 4,
  "was": "Which sentence is INCOMPLETE without an object?",
  "why": "'She reads.' is a complete sentence",
  "set": {
   "options": [
    "She bought.",
    "The sun shines.",
    "He runs fast.",
    "They danced."
   ],
   "answer": "She bought.",
   "explanation": [
    "'Bought' needs an object: bought what? 'She bought a pen.'",
    "The other sentences are complete."
   ]
  }
 },
 {
  "docId": "HKa4nt9DxH8p38GIfGFH",
  "quizId": "verbs-trans-quiz",
  "order": 5,
  "was": "Which verb can be BOTH transitive and intransitive?",
  "why": "'eat' is both too",
  "set": {
   "options": [
    "sing",
    "sleep",
    "arrive",
    "cry"
   ],
   "explanation": [
    "Transitive: 'She sang a song.' Intransitive: 'She sang.'",
    "Sleep, arrive and cry don't take an object."
   ]
  }
 },
 {
  "docId": "PQ9euxvEJmAZ4Yr8dOry",
  "quizId": "verbs-trans-quiz",
  "order": 9,
  "was": "Fix this sentence: 'The artist painted.'",
  "why": "'The artist painted.' is a correct sentence",
  "set": {
   "question": "Fix this sentence: 'The girl found.'",
   "options": [
    "The girl found her lost doll.",
    "The girl found slowly.",
    "The girl found yesterday.",
    "The girl found."
   ],
   "answer": "The girl found her lost doll.",
   "explanation": [
    "'Found' needs an object: found what? Her lost doll!"
   ]
  }
 },
 {
  "docId": "yfJc75mKD86g3bjX12Ov",
  "quizId": "verbs-trans-quiz",
  "order": 13,
  "was": "Which verb is ALWAYS intransitive?",
  "why": "'run' can take an object ('run a shop')",
  "set": {
   "options": [
    "arrive",
    "eat",
    "read",
    "write"
   ],
   "answer": "arrive",
   "explanation": [
    "'Arrive' never takes an object: 'They arrived early.'",
    "Eat, read and write can take one: 'eat a mango'."
   ]
  }
 },
 {
  "docId": "zQ8Rp9hebLib5A1WC4Ws",
  "quizId": "verbs-finite-quiz",
  "order": 11,
  "was": "Which of the following is not a non-finite verb?",
  "why": "'played' can be finite (past tense)",
  "set": {
   "question": "Which of these is a finite verb?",
   "options": [
    "plays",
    "to play",
    "playing",
    "to go"
   ],
   "explanation": [
    "'Plays' changes with the subject (he plays, they play), so it is finite.",
    "'To play', 'playing' and 'to go' are non-finite."
   ]
  }
 },
 {
  "docId": "Yf668ZepSMPGDS5c0XAp",
  "quizId": "4ieo8-quiz",
  "order": 15,
  "was": "Choose the adjective in: 'Her dress is new.'",
  "why": "'new' is an adjective too",
  "set": {
   "question": "Which word is a possessive adjective in: 'Her dress is new.'?",
   "explanation": [
    "'Her' shows whose dress it is, so it is a possessive adjective.",
    "('New' is an adjective too, but of quality.)"
   ]
  }
 },
 {
  "docId": "ayY9cj4zTvVGqyUfInSP",
  "quizId": "4ieo8-quiz-2",
  "order": 2,
  "was": "Identify the adjective in 'This apple is tasty.'",
  "why": "'tasty' is an adjective too",
  "set": {
   "question": "Which word is a demonstrative adjective in 'This apple is tasty.'?",
   "explanation": [
    "'This' points to the apple, so it is a demonstrative adjective.",
    "('Tasty' is an adjective of quality.)"
   ]
  }
 },
 {
  "docId": "VyEPwxLvVih2cvzRbibC",
  "quizId": "4ieo8-quiz-2",
  "order": 3,
  "was": "Which adjective shows quantity?",
  "why": "'many' is an adjective of number",
  "set": {
   "options": [
    "Much",
    "Blue",
    "Third",
    "My"
   ],
   "answer": "Much",
   "explanation": [
    "'Much' tells how much (much water), so it is an adjective of quantity.",
    "'Many' would tell how many: an adjective of number."
   ]
  }
 },
 {
  "docId": "tOHRxSBbf7FAmtVQXP8Z",
  "quizId": "4ieo8-quiz-2",
  "order": 13,
  "was": "What type is 'Few' in 'Few people knew the answer.'?",
  "why": "'few' is an adjective of number, not quantity",
  "set": {
   "answer": "Number",
   "explanation": [
    "'Few' tells how many people, so it is an adjective of number.",
    "'Little' tells how much: little water is quantity."
   ]
  }
 },
 {
  "docId": "ry0sA2ZOzFaJNuGG0eAr",
  "quizId": "4ieo8-quiz-2",
  "order": 14,
  "was": "Which word in 'That cat is fast' is an adjective?",
  "why": "'fast' is an adjective too",
  "set": {
   "question": "Which word is a demonstrative adjective in 'That cat is fast'?",
   "explanation": [
    "'That' points out the cat, so it is demonstrative.",
    "('Fast' is an adjective of quality.)"
   ]
  }
 },
 {
  "docId": "kvuMTylx6sECv1w8mLzE",
  "quizId": "4ieo8-quiz-2",
  "order": 16,
  "was": "What is the adjective in 'His car is expensive'?",
  "why": "'expensive' is an adjective too",
  "set": {
   "question": "Which word is a possessive adjective in 'His car is expensive'?",
   "explanation": [
    "'His' shows ownership, so it is a possessive adjective.",
    "('Expensive' is an adjective of quality.)"
   ]
  }
 },
 {
  "docId": "seeRnYb54WeerBca2cHy",
  "quizId": "4ieo8-quiz-2",
  "order": 18,
  "was": "Find the adjective in: 'This cake tastes sweet.'",
  "why": "'sweet' is an adjective too",
  "set": {
   "question": "Which word is a demonstrative adjective in 'This cake tastes sweet'?",
   "explanation": [
    "'This' points to a specific cake, so it is demonstrative.",
    "('Sweet' is an adjective of quality.)"
   ]
  }
 },
 {
  "docId": "xGwS5E4fRoQU7rn6Fto5",
  "quizId": "4ieo6-quiz",
  "order": 6,
  "was": "The bus stop is just ____ the corner.",
  "why": "'on the corner' is also correct",
  "set": {
   "options": [
    "at",
    "in",
    "under",
    "into"
   ]
  }
 },
 {
  "docId": "5lWH3blV8iXUZZcltxs7",
  "quizId": "4ieo6-quiz",
  "order": 7,
  "was": "He walked slowly ____ the hill.",
  "why": "'walked on the hill' is also correct",
  "set": {
   "options": [
    "up",
    "into",
    "under",
    "at"
   ]
  }
 },
 {
  "docId": "rtUxiTcnPReBxKzKSYn7",
  "quizId": "4ieo6-quiz",
  "order": 11,
  "was": "The baby slept ____ the afternoon.",
  "why": "'slept in the afternoon' is also correct",
  "set": {
   "options": [
    "during",
    "at",
    "on",
    "under"
   ]
  }
 },
 {
  "docId": "70roL6WGIPXY4LjN8zqd",
  "quizId": "4ieo6-quiz",
  "order": 14,
  "was": "We stayed home ____ it was raining.",
  "why": "'since it was raining' is also correct",
  "set": {
   "options": [
    "because",
    "because of",
    "during",
    "although"
   ],
   "explanation": [
    "'Because' explains the reason for staying in.",
    "'Because of' needs a noun after it: because of the rain."
   ]
  }
 },
 {
  "docId": "Rk7J9aBXXGDoIGO1dT0e",
  "quizId": "4ieo6-fixed-prep-quiz",
  "order": 4,
  "was": "They laughed ___ the funny joke.",
  "why": "'laughed about the joke' is also correct",
  "set": {
   "options": [
    "at",
    "on",
    "of",
    "to"
   ]
  }
 },
 {
  "docId": "yWYB8YgresRe1clVJ3i6",
  "quizId": "4ieo6-fixed-prep-quiz",
  "order": 10,
  "was": "She is angry ___ her brother.",
  "why": "'angry at' is also correct",
  "set": {
   "options": [
    "with",
    "to",
    "on",
    "for"
   ]
  }
 },
 {
  "docId": "B7KklPlolhmxTsy8FHYN",
  "quizId": "4ieo6-fixed-prep-quiz",
  "order": 11,
  "was": "We were amazed ___ the magician's tricks.",
  "why": "'amazed by' is also correct",
  "set": {
   "options": [
    "at",
    "on",
    "to",
    "of"
   ]
  }
 },
 {
  "docId": "7IVDVr0E2rwk9L5j7ua6",
  "quizId": "4ieo7-quiz",
  "order": 13,
  "was": "Which conjunction is used incorrectly? 'I like apples and or bananas.'",
  "why": "asked which of two words was wrong; either could be removed",
  "set": {
   "question": "Choose the correct sentence.",
   "options": [
    "I like apples and bananas.",
    "I like apples and or bananas.",
    "I like apples but bananas.",
    "I like apples because bananas."
   ],
   "answer": "I like apples and bananas.",
   "explanation": [
    "'And' joins the two fruits we like.",
    "'And or' together is wrong, and 'but' or 'because' don't fit here."
   ]
  }
 }
];

// data/englishQuest/units/u6.js: Unit 6, Modals & Question Tags (Claude, 2026-11-05). Classes 3–5 focus (Pratha first).
// Built per docs/CONTENT_GUIDE.md and docs/exam/ieo-pattern.md (modals, question tags: Class 4–5 papers). Original questions.
// Ambiguity rule: modals overlap a lot (can/could/may, must/should), so questions test the FORM (modal + base form) or a
// clearly different MEANING (rule / advice / permission / ability), and leave out any option that would also fit
// (e.g. "must" for advice, "shall we" next to "will we", "has → doesn't/hasn't" tags where both are used).
import { q, study, quiz, reading, unit, main, practice, gate, withSubtopic, endless, boss } from "../helpers.js";

const t = (subtopic, question, correct, wrongs, explanation) => ({ subtopic, ...q(question, correct, wrongs, explanation) });

const can = main("eq-u6-can", "eq-u6", 0, "Can, Could & May", [study("eq-u6-can"), quiz("eq-u6-can-quiz")]);
const must = main("eq-u6-must", "eq-u6", 1, "Must & Should", [study("eq-u6-must"), quiz("eq-u6-must-quiz")]);
const tags = main("eq-u6-tags", "eq-u6", 2, "Question Tags", [study("eq-u6-tags"), quiz("eq-u6-tags-quiz")]);
const u6r = main("eq-u6-reading", "eq-u6", 3, "Reading: The Rainy Picnic", [reading("eq-read-rainy-picnic")]);

export default {
  // ---------- Study Pages ----------
  studyPages: {
    "eq-u6-can": {
      name: "Can, Could and May",
      author: "Apprec8",
    cards: [
          {
                "emoji": "🦸",
                "title": "Modals take the base form",
                "text": "Modal helpers like can, could, may, must, and should always take the bare base verb. Never add -s, -ed, -ing, or 'to' after them!",
                "examples": [
                      "She can swim. (NOT can swims)",
                      "He may come. (NOT may to come)",
                      "We should help. (NOT should helping)"
                ]
          },
          {
                "emoji": "💪",
                "title": "CAN (now) and COULD (past)",
                "text": "Use 'can' for abilities you have right now. Use 'could' for abilities you had in the past.",
                "examples": [
                      "I can speak English now.",
                      "When I was five, I could swim.",
                      "Last year I could not reach the top shelf."
                ]
          },
          {
                "emoji": "🙋",
                "title": "Asking politely with MAY",
                "text": "When asking a teacher or elder for permission, 'May I' is the most polite choice! You can also use 'Could I' or 'Can I' with friends.",
                "examples": [
                      "May I come in, teacher?",
                      "Could I borrow your eraser, please?",
                      "Can I play with your ball?"
                ]
          },
          {
                "kind": "check",
                "question": "Which sentence is grammatically correct?",
                "answer": "He can run faster than anyone in class.",
                "wrong": [
                      "He can runs faster than anyone in class.",
                      "He can to run faster than anyone in class.",
                      "He can running faster than anyone in class."
                ],
                "explain": "Modals are followed directly by the base verb without -s: 'can run'."
          },
          {
                "kind": "check",
                "question": "Choose the best polite request to ask a teacher: '___ I drink some water, please?'",
                "answer": "May",
                "wrong": [
                      "Should",
                      "Must",
                      "Might to"
                ],
                "explain": "'May I' is the most polite, respectful way to request permission from a teacher."
          }
    ],
      content: `### 🦸 Helper words with super powers

**Can, could, may, must, should** are *modals*. They help the main verb.

> ⚠️ After a modal, use the **base form**: no -s, no -ing, no "to".

| ✅ Right | ❌ Wrong |
|---|---|
| She **can swim**. | She can swims. / She cans swim. |
| We **may be** late. | We may to be late. |

---

### 💪 CAN and COULD: ability

| Now | In the past |
|---|---|
| I **can** ride a bike. | When I was four, I **could** ride a tricycle. |
| I **cannot** whistle. | Last year I **could not** reach the shelf. |

Clue words for COULD: *when I was…, last year, yesterday, ago*.

---

### 🙋 MAY, CAN and COULD: asking politely

- **May I** come in, please? (very polite: use it with teachers)
- **Could I** have some water, please?
- **Can I** play with your ball?

> 💡 Add **please**, and say **sorry** when you have to say no: *"Sorry, I need it today."*

---

### 🎯 Now you can…
- use a modal + base form
- choose **can** (now) or **could** (past)
- ask for permission politely`,
    },
    "eq-u6-must": {
      name: "Must and Should",
      author: "Apprec8",
    cards: [
          {
                "emoji": "📏",
                "title": "MUST: an essential rule",
                "text": "Use 'must' when an action is a strict rule or duty that everyone has to obey. There is no choice!",
                "examples": [
                      "You must wear a helmet on a scooter.",
                      "Drivers must stop at red lights.",
                      "Students must carry their ID cards."
                ]
          },
          {
                "emoji": "💬",
                "title": "SHOULD: friendly advice",
                "text": "Use 'should' to give good advice or suggest what is sensible. It is a recommendation, not a strict punishment rule!",
                "examples": [
                      "You should eat fresh vegetables.",
                      "You should sleep eight hours.",
                      "You shouldn't watch screens so late."
                ]
          },
          {
                "emoji": "🚫",
                "title": "MUST NOT vs DO NOT HAVE TO",
                "text": "'Must not' means strictly forbidden—do not do it! 'Do not have to' means it is not necessary, but you may if you want.",
                "examples": [
                      "You must not touch wet plugs! (Forbidden)",
                      "It is Sunday; you don't have to wake up early. (Optional)",
                      "No 'to' after must: 'must go', not 'must to go'!"
                ]
          },
          {
                "kind": "check",
                "question": "Which sentence expresses a strict, mandatory rule?",
                "answer": "All passengers must fasten their seat belts.",
                "wrong": [
                      "You should try reading this adventure book.",
                      "You might like strawberry ice cream.",
                      "We could visit the museum tomorrow."
                ],
                "explain": "'Must' indicates an obligatory rule that must be obeyed."
          },
          {
                "kind": "check",
                "question": "What does 'You do not have to wash the dishes' mean?",
                "answer": "It is not necessary, but you can if you wish",
                "wrong": [
                      "You are forbidden from washing the dishes",
                      "You must wash the dishes immediately",
                      "You broke the kitchen dishes"
                ],
                "explain": "'Do not have to' means an action is optional, unlike 'must not' which means forbidden."
          }
    ],
      content: `### 📏 MUST: a rule

- You **must** wear a seat belt.
- Students **must** wear their ID cards.

### 💬 SHOULD: good advice

- You **should** drink more water.
- You **should not** watch TV so late.

> 💡 A rule says *you have to*. Advice says *it is a good idea*.

---

### 🚫 MUST NOT or ✅ DO NOT HAVE TO?

They look alike but mean very different things!

| must not | do not have to |
|---|---|
| It is **not allowed**. | It is **not needed** (you can if you want). |
| You **must not** touch the wires. | It is Sunday. You **do not have to** go to school. |

---

### ⚠️ No "to" after must

| ✅ Right | ❌ Wrong |
|---|---|
| We **must finish** our work. | We must to finish our work. |

---

### 🎯 Now you can…
- tell a **rule** (must) from **advice** (should)
- tell **not allowed** (must not) from **not needed** (do not have to)`,
    },
    "eq-u6-tags": {
      name: "Question Tags",
      author: "Apprec8",
    cards: [
          {
                "emoji": "🏷️",
                "title": "What is a question tag?",
                "text": "A question tag is a mini question placed at the end of a sentence to confirm something: 'It is a sunny day, isn't it?'",
                "examples": [
                      "You are coming, aren't you?",
                      "She can swim, can't she?",
                      "They were happy, weren't they?"
                ]
          },
          {
                "emoji": "➕➖",
                "title": "The flip rule",
                "text": "If the sentence is positive, the tag is negative. If the sentence is negative, the tag is positive! Words like never and nobody count as negative.",
                "examples": [
                      "She is ready, isn't she? (Positive → Negative)",
                      "She isn't ready, is she? (Negative → Positive)",
                      "He never lies, does he? ('never' is negative!)"
                ]
          },
          {
                "emoji": "🎩",
                "title": "Tricky tags: I am & Let us",
                "text": "Watch out for special exceptions! 'I am late, aren't I?' (never 'amn't I'). 'Let us go for a walk, shall we?' Words like everyone take the pronoun 'they'.",
                "examples": [
                      "I am right, aren't I?",
                      "Let's play cricket, shall we?",
                      "Everyone was pleased, weren't they?"
                ]
          },
          {
                "kind": "check",
                "question": "What is the correct question tag: 'You haven't seen my keys, ___?'",
                "answer": "have you",
                "wrong": [
                      "haven't you",
                      "did you",
                      "do you"
                ],
                "explain": "A negative sentence ('haven't seen') takes a positive tag using the same helper: 'have you?'"
          },
          {
                "kind": "check",
                "question": "Which tag correctly completes: 'I am your best friend, ___?'",
                "answer": "aren't I",
                "wrong": [
                      "amn't I",
                      "am I not",
                      "isn't I"
                ],
                "explain": "In standard English, the question tag for 'I am' is always 'aren't I?'"
          }
    ],
      content: `### 🏷️ A tiny question at the end

A **question tag** turns a sentence into a question: *It is hot, **isn't it**?*

---

### ➕➖ Flip it!

| Sentence | Tag |
|---|---|
| **positive**: She is happy, | **negative**: isn't she? |
| **negative**: She is not happy, | **positive**: is she? |

> ⚠️ *never, nobody, nothing* make the sentence negative, so the tag is positive: *Sana **never** eats sweets, **does** she?*

---

### 🔧 Use the same helper

| Sentence has… | Tag uses… | Example |
|---|---|---|
| is / are / was | the same | You **are** ready, **aren't** you? |
| can / will / has | the same | Meera **can** swim, **can't** she? |
| no helper (plays, went) | do / does / did | Kabir **plays** chess, **doesn't** he? They **went** home, **didn't** they? |

---

### 🎩 Tricky tags

| Sentence | Tag |
|---|---|
| I am late, | **aren't I**? |
| Let us go, | **shall we**? |
| Everyone / somebody… | **they** |
| There is… | **isn't there**? |

---

### 🎯 Now you can…
- flip positive ↔ negative
- pick the same helper (or do/does/did)
- handle *I am*, *Let us*, *everyone* and *there is*`,
    },
  },

  // ---------- Quizzes ----------
  quizzes: {
    // Topic A: Can, Could & May (practice, 8)
    "eq-u6-can-quiz": [
      t("modal-form", "Complete the sentence: 'My little brother can ___ his name.'", "write", [["writes", "modal-form-error"], ["writing", "modal-form-error"], ["to write", "modal-form-error"]], "After CAN, use the base form: can WRITE."),
      t("modal-form", "Which sentence is correct?", "Meera can speak three languages.", [["Meera cans speak three languages.", "modal-form-error"], ["Meera can speaks three languages.", "modal-form-error"], ["Meera can to speak three languages.", "modal-form-error"]], "CAN never takes -s, and the verb after it is the base form: can SPEAK."),
      t("can-could", "Pick the right word: 'When Dadaji was young, he ___ climb coconut trees.'", "could", [["can", "modal-time-mixup"], ["will", "modal-time-mixup"], ["could to", "modal-form-error"]], "WHEN DADAJI WAS YOUNG is the past, so we use COULD for ability in the past."),
      t("can-could", "Which word fits? 'Last year I ___ not reach the top shelf, but now I can.'", "could", [["can", "modal-time-mixup"], ["will", "modal-time-mixup"], ["must", "modal-meaning-mixup"]], "LAST YEAR → past ability → COULD NOT. Now → CAN."),
      t("asking-permission", "Which is the most polite way to ask your teacher?", "May I go to the library, please?", [["I am going to the library now.", "polite-request-mixup"], ["Library, I want to go there.", "polite-request-mixup"], ["Let me go to the library.", "polite-request-mixup"]], "MAY I … PLEASE? is the most polite way to ask for permission."),
      t("asking-permission", "Complete the question: '___ I borrow your pencil, please?'", "May", [["Must", "modal-meaning-mixup"], ["Did", "modal-meaning-mixup"], ["Am", "modal-form-error"]], "To ask for permission politely: MAY I …?"),
      t("modal-form", "Complete the sentence: 'You cannot ___ in the library.'", "shout", [["shouting", "modal-form-error"], ["shouts", "modal-form-error"], ["to shout", "modal-form-error"]], "CANNOT + base form: cannot SHOUT."),
      t("can-could", "Which sentence talks about ability in the PAST?", "I could read when I was four.", [["I can read very fast now.", "modal-time-mixup"], ["I will read this book tomorrow.", "modal-time-mixup"], ["I should read every day.", "modal-meaning-mixup"]], "COULD + 'when I was four' = something I was able to do in the past."),
    ],
    // Practice leaf: Can or could? (8)
    "eq-u6-can-could": [
      t("can-could", "Which word fits? 'Two years ago, Sana ___ not swim at all.'", "could", [["can", "modal-time-mixup"], ["cans", "modal-form-error"], ["will", "modal-time-mixup"]], "TWO YEARS AGO → past → COULD NOT."),
      t("can-could", "Which word fits? 'Look! The baby ___ walk now!'", "can", [["could", "modal-time-mixup"], ["cans", "modal-form-error"], ["can to", "modal-form-error"]], "NOW → CAN. No -s and no 'to'."),
      t("can-could", "Which word fits? 'Grandma ___ dance very well when she was a girl.'", "could", [["can", "modal-time-mixup"], ["cans", "modal-form-error"], ["will", "modal-time-mixup"]], "WHEN SHE WAS A GIRL → past → COULD."),
      t("can-could", "Which words fit? 'I ___ hear you now. The music is too loud.'", "cannot", [["could not", "modal-time-mixup"], ["can", "modal-meaning-mixup"], ["will", "modal-time-mixup"]], "NOW and IS → present. The music stops you hearing → CANNOT."),
      t("can-could", "Which word fits? 'Yesterday the road was closed, so we ___ not go to the market.'", "could", [["can", "modal-time-mixup"], ["will", "modal-time-mixup"], ["must", "modal-meaning-mixup"]], "YESTERDAY → past → COULD NOT."),
      t("can-could", "Which word fits? 'Penguins ___ swim, but they cannot fly.'", "can", [["could", "modal-time-mixup"], ["cans", "modal-form-error"], ["can to", "modal-form-error"]], "A fact that is true now → CAN."),
      t("can-could", "Which word fits? 'When I was in Class 1, I ___ only write small words.'", "could", [["can", "modal-time-mixup"], ["will", "modal-time-mixup"], ["cans", "modal-form-error"]], "WHEN I WAS IN CLASS 1 → past → COULD."),
      t("can-could", "Which sentence is correct?", "Last night I could not sleep.", [["Last night I cannot sleep.", "modal-time-mixup"], ["Last night I could not slept.", "modal-form-error"], ["Last night I can not sleeping.", "modal-form-error"]], "LAST NIGHT → COULD NOT + base form: could not SLEEP."),
    ],
    // Gate pool (15): modal-form × 5, can-could × 5, asking-permission × 5
    "eq-u6-can-gate-pool": [
      t("modal-form", "Complete the sentence: 'Ravi can ___ the guitar.'", "play", [["plays", "modal-form-error"], ["playing", "modal-form-error"], ["to play", "modal-form-error"]], "CAN + base form: can PLAY."),
      t("modal-form", "Which sentence is correct?", "She could not find her shoes.", [["She could not found her shoes.", "modal-form-error"], ["She could not finds her shoes.", "modal-form-error"], ["She could not to find her shoes.", "modal-form-error"]], "COULD NOT + base form: could not FIND."),
      t("modal-form", "Complete the sentence: 'We may ___ late today because of the rain.'", "be", [["are", "modal-form-error"], ["being", "modal-form-error"], ["to be", "modal-form-error"]], "MAY + base form: may BE."),
      t("modal-form", "Which question is correct?", "Can you help me, please?", [["Do you can help me, please?", "modal-form-error"], ["Can you helping me, please?", "modal-form-error"], ["Can you helps me, please?", "modal-form-error"]], "Questions start with the modal: CAN you + base form HELP?"),
      t("modal-form", "Complete the sentence: 'Birds can ___ high in the sky.'", "fly", [["flies", "modal-form-error"], ["flying", "modal-form-error"], ["flew", "modal-form-error"]], "CAN + base form: can FLY."),
      t("can-could", "Which word fits? 'At the age of four, my cousin ___ read storybooks.'", "could", [["can", "modal-time-mixup"], ["will", "modal-time-mixup"], ["cans", "modal-form-error"]], "AT THE AGE OF FOUR is in the past → COULD."),
      t("can-could", "Which word fits? 'Last week Asha had a fever, so she ___ not come to school.'", "could", [["can", "modal-time-mixup"], ["will", "modal-time-mixup"], ["may", "modal-time-mixup"]], "LAST WEEK → past → COULD NOT."),
      t("can-could", "Which word fits? 'My grandfather ___ run very fast when he was young, but now he walks slowly.'", "could", [["can", "modal-time-mixup"], ["will", "modal-time-mixup"], ["must", "modal-meaning-mixup"]], "WHEN HE WAS YOUNG → past ability → COULD."),
      t("can-could", "Which word fits? 'I ___ not open the jar yesterday. The lid was too tight.'", "could", [["can", "modal-time-mixup"], ["will", "modal-time-mixup"], ["shall", "modal-time-mixup"]], "YESTERDAY → COULD NOT."),
      t("can-could", "Which sentence shows ability NOW?", "Tara can tie her own shoelaces.", [["Tara could tie her shoelaces at four.", "modal-time-mixup"], ["Tara will tie her shoelaces later.", "modal-time-mixup"], ["Tara may tie her shoelaces.", "modal-meaning-mixup"]], "CAN = able to do it now."),
      t("asking-permission", "Which is the most polite way to ask?", "Could I have some water, please?", [["Give me some water.", "polite-request-mixup"], ["Water. I want it now.", "polite-request-mixup"], ["I want water, so give it.", "polite-request-mixup"]], "COULD I … PLEASE? is a polite way to ask."),
      t("asking-permission", "Complete the question: '___ I come in, Sir?'", "May", [["Must", "modal-meaning-mixup"], ["Am", "modal-form-error"], ["Do", "modal-meaning-mixup"]], "To ask a teacher for permission: MAY I come in?"),
      t("asking-permission", "Which sentence asks for PERMISSION?", "May I use your eraser?", [["I can use an eraser well.", "modal-meaning-mixup"], ["You must use an eraser.", "modal-meaning-mixup"], ["You should use an eraser.", "modal-meaning-mixup"]], "MAY I …? asks if you are allowed to do something."),
      t("asking-permission", "Your friend asks, \"Can I play with your ball?\" What is she doing?", "Asking for permission", [["Showing what she is able to do", "modal-meaning-mixup"], ["Giving you some advice", "modal-meaning-mixup"], ["Making a new rule", "modal-meaning-mixup"]], "CAN I …? here means 'Am I allowed to …?'"),
      t("asking-permission", "Which reply politely says NO to \"May I borrow your book?\"", "Sorry, I need it today.", [["No. Go away.", "polite-request-mixup"], ["Never ask me again.", "polite-request-mixup"], ["Books are not for you.", "polite-request-mixup"]], "Say SORRY and give a reason: that is a polite no."),
    ],

    // Topic B: Must & Should (practice, 8)
    "eq-u6-must-quiz": [
      t("must-rules", "Which sentence is a RULE?", "You must wear your seat belt.", [["You should try the mango ice cream.", "modal-meaning-mixup"], ["You can sing very well.", "modal-meaning-mixup"], ["You could visit us on Sunday.", "modal-meaning-mixup"]], "MUST = a rule: you have to do it."),
      t("should-advice", "Which sentence gives ADVICE?", "You should drink more water.", [["You must not cross on red.", "modal-meaning-mixup"], ["You can borrow my pen.", "modal-meaning-mixup"], ["You could swim at five.", "modal-meaning-mixup"]], "SHOULD = advice: it is a good idea."),
      t("should-advice", "Riya has a cough. Pick the advice: 'You ___ drink warm water.'", "should", [["should not", "modal-meaning-mixup"], ["could not", "modal-meaning-mixup"], ["cannot", "modal-meaning-mixup"]], "Warm water helps a cough, so the advice is: you SHOULD drink it."),
      t("mustnt-donthave", "Which words fit? 'You ___ touch the wires. They are dangerous!'", "must not", [["must", "mustnt-donthave-mixup"], ["do not have to", "mustnt-donthave-mixup"], ["should", "modal-meaning-mixup"]], "Dangerous → NOT ALLOWED → MUST NOT."),
      t("mustnt-donthave", "Which words fit? 'Tomorrow is Sunday, so we ___ go to school.'", "do not have to", [["must", "mustnt-donthave-mixup"], ["must not", "mustnt-donthave-mixup"], ["has to", "modal-form-error"]], "On Sunday school is NOT NEEDED, but not forbidden → DO NOT HAVE TO."),
      t("must-rules", "Which word fits? 'In the library, you ___ keep quiet.'", "must", [["must not", "mustnt-donthave-mixup"], ["do not have to", "mustnt-donthave-mixup"], ["could", "modal-meaning-mixup"]], "Keeping quiet is a library RULE → MUST."),
      t("must-rules", "Which sentence is correct?", "We must finish our homework.", [["We must to finish our homework.", "modal-form-error"], ["We must finishes our homework.", "modal-form-error"], ["We musts finish our homework.", "modal-form-error"]], "MUST + base form, no 'to': must FINISH."),
      t("should-advice", "Pick the advice: 'You look tired. You ___ go to bed early tonight.'", "should", [["must not", "mustnt-donthave-mixup"], ["do not have to", "mustnt-donthave-mixup"], ["cannot", "modal-meaning-mixup"]], "Good advice for a tired person: you SHOULD sleep early."),
    ],
    // Practice leaf: must not or do not have to? (8)
    "eq-u6-must-not": [
      t("mustnt-donthave", "Which words fit? 'It is a holiday. You ___ wear your uniform today.'", "do not have to", [["must not", "mustnt-donthave-mixup"], ["must", "mustnt-donthave-mixup"], ["has to", "modal-form-error"]], "On a holiday the uniform is NOT NEEDED → DO NOT HAVE TO."),
      t("mustnt-donthave", "Which words fit? 'Pool rule: You ___ run near the pool.'", "must not", [["do not have to", "mustnt-donthave-mixup"], ["must", "mustnt-donthave-mixup"], ["have to", "mustnt-donthave-mixup"]], "Running near a pool is NOT ALLOWED → MUST NOT."),
      t("mustnt-donthave", "Which words fit? 'The museum is free. You ___ buy a ticket.'", "do not have to", [["must not", "mustnt-donthave-mixup"], ["must", "mustnt-donthave-mixup"], ["has to", "modal-form-error"]], "Free → a ticket is NOT NEEDED → DO NOT HAVE TO."),
      t("mustnt-donthave", "Which words fit? 'You ___ feed the animals at the zoo. It can make them sick.'", "must not", [["do not have to", "mustnt-donthave-mixup"], ["must", "mustnt-donthave-mixup"], ["have to", "mustnt-donthave-mixup"]], "It can make them sick → NOT ALLOWED → MUST NOT."),
      t("mustnt-donthave", "Which words fit? 'I already cleaned the room, so you ___ clean it.'", "do not have to", [["must not", "mustnt-donthave-mixup"], ["must", "mustnt-donthave-mixup"], ["have to", "mustnt-donthave-mixup"]], "It is already clean → NOT NEEDED → DO NOT HAVE TO."),
      t("mustnt-donthave", "Which words fit? 'In football, players ___ touch the ball with their hands. Only the goalkeeper can.'", "must not", [["do not have to", "mustnt-donthave-mixup"], ["must", "mustnt-donthave-mixup"], ["have to", "mustnt-donthave-mixup"]], "It is against the rules → MUST NOT."),
      t("mustnt-donthave", "Which sentence means it is NOT ALLOWED?", "You must not use your phone in the exam.", [["You do not have to bring a pen.", "mustnt-donthave-mixup"], ["You should bring two pencils.", "modal-meaning-mixup"], ["You can sit anywhere.", "modal-meaning-mixup"]], "MUST NOT = not allowed."),
      t("mustnt-donthave", "Which sentence means it is NOT NEEDED?", "You do not have to bring lunch today.", [["You must not bring sweets to class.", "mustnt-donthave-mixup"], ["You must bring your diary.", "mustnt-donthave-mixup"], ["You should not shout.", "modal-meaning-mixup"]], "DO NOT HAVE TO = not needed (you can if you want)."),
    ],
    // Gate pool (15): must-rules × 5, should-advice × 5, mustnt-donthave × 5
    "eq-u6-must-gate-pool": [
      t("must-rules", "Which sentence is a RULE at school?", "Students must wear their ID cards.", [["Students should try the new library.", "modal-meaning-mixup"], ["Students can run very fast.", "modal-meaning-mixup"], ["Students could play after lunch.", "modal-meaning-mixup"]], "MUST = a rule everyone has to follow."),
      t("must-rules", "Which word fits? 'Drivers ___ stop at a red light.'", "must", [["must not", "mustnt-donthave-mixup"], ["do not have to", "mustnt-donthave-mixup"], ["could", "modal-meaning-mixup"]], "Stopping at a red light is the law → MUST."),
      t("must-rules", "Which sentence is correct?", "You must wash your hands before eating.", [["You must washing your hands before eating.", "modal-form-error"], ["You must to wash your hands before eating.", "modal-form-error"], ["You musts wash your hands before eating.", "modal-form-error"]], "MUST + base form: must WASH."),
      t("must-rules", "Which word fits? 'Everyone ___ follow the rules of the game.'", "must", [["must not", "mustnt-donthave-mixup"], ["do not have to", "mustnt-donthave-mixup"], ["cannot", "modal-meaning-mixup"]], "Rules of a game → MUST follow them."),
      t("must-rules", "Which word fits? 'At the zoo, visitors ___ stay behind the fence.'", "must", [["must not", "mustnt-donthave-mixup"], ["do not have to", "mustnt-donthave-mixup"], ["need not", "mustnt-donthave-mixup"]], "Staying behind the fence keeps people safe: it is a rule → MUST."),
      t("should-advice", "Which sentence gives ADVICE?", "You should wear a sweater. It is cold.", [["You must not park here.", "modal-meaning-mixup"], ["You can ride a bike.", "modal-meaning-mixup"], ["You do not have to come.", "mustnt-donthave-mixup"]], "SHOULD = a good idea → advice."),
      t("should-advice", "Pick the advice: 'Your tooth hurts. You ___ see a dentist.'", "should", [["should not", "modal-meaning-mixup"], ["do not have to", "mustnt-donthave-mixup"], ["cannot", "modal-meaning-mixup"]], "A dentist helps a sore tooth → you SHOULD go."),
      t("should-advice", "Pick the advice: 'Kabir always forgets his books. He ___ pack his bag the night before.'", "should", [["should not", "modal-meaning-mixup"], ["cannot", "modal-meaning-mixup"], ["must not", "mustnt-donthave-mixup"]], "Packing early would help him → he SHOULD."),
      t("should-advice", "Pick the advice: 'It is very sunny. You ___ forget your cap.'", "should not", [["should", "modal-meaning-mixup"], ["must", "modal-meaning-mixup"], ["can", "modal-meaning-mixup"]], "Forgetting your cap on a sunny day is a bad idea → SHOULD NOT."),
      t("should-advice", "Fill in both blanks: 'You ___ eat more fruit, and you ___ eat so many chips.'", "should, should not", [["should not, should", "modal-meaning-mixup"], ["should, should", "modal-meaning-mixup"], ["should not, should not", "modal-meaning-mixup"]], "Fruit is good → SHOULD. Too many chips are not → SHOULD NOT."),
      t("mustnt-donthave", "Which words fit? 'It is not raining. You ___ take an umbrella.'", "do not have to", [["must not", "mustnt-donthave-mixup"], ["must", "mustnt-donthave-mixup"], ["have to", "mustnt-donthave-mixup"]], "No rain → an umbrella is NOT NEEDED → DO NOT HAVE TO."),
      t("mustnt-donthave", "Which words fit? 'You ___ shout in the hospital.'", "must not", [["do not have to", "mustnt-donthave-mixup"], ["must", "mustnt-donthave-mixup"], ["have to", "mustnt-donthave-mixup"]], "Shouting in a hospital is NOT ALLOWED → MUST NOT."),
      t("mustnt-donthave", "Which words fit? 'The bus is free for students. Students ___ pay.'", "do not have to", [["must not", "mustnt-donthave-mixup"], ["must", "mustnt-donthave-mixup"], ["have to", "mustnt-donthave-mixup"]], "Free → paying is NOT NEEDED → DO NOT HAVE TO."),
      t("mustnt-donthave", "Which sentence means it is NOT ALLOWED?", "Visitors must not take photos inside.", [["Visitors do not have to take photos.", "mustnt-donthave-mixup"], ["Visitors can take photos outside.", "modal-meaning-mixup"], ["Visitors should take a map.", "modal-meaning-mixup"]], "MUST NOT = not allowed."),
      t("mustnt-donthave", "Which sentence means it is NOT NEEDED?", "We do not have to wake up early on Sunday.", [["We must not wake the baby.", "mustnt-donthave-mixup"], ["We must wake up early on Monday.", "mustnt-donthave-mixup"], ["We should sleep on time.", "modal-meaning-mixup"]], "DO NOT HAVE TO = not needed."),
    ],

    // Topic C: Question Tags (practice, 8)
    "eq-u6-tags-quiz": [
      t("tag-polarity", "Add the tag: 'Riya is your sister, ___?'", "isn't she", [["is she", "tag-polarity-error"], ["doesn't she", "tag-helper-error"], ["isn't it", "tag-pronoun-error"]], "Positive sentence → negative tag. Same helper (IS), and Riya → SHE: isn't she?"),
      t("tag-polarity", "Add the tag: 'You are not tired, ___?'", "are you", [["aren't you", "tag-polarity-error"], ["do you", "tag-helper-error"], ["isn't it", "tag-pronoun-error"]], "Negative sentence → positive tag: are you?"),
      t("tag-helper", "Add the tag: 'Kabir plays chess, ___?'", "doesn't he", [["isn't he", "tag-helper-error"], ["don't he", "tag-helper-error"], ["didn't he", "tag-helper-error"]], "No helper in PLAYS → use DOES (he, present): doesn't he?"),
      t("tag-helper", "Add the tag: 'They went to the fair, ___?'", "didn't they", [["don't they", "tag-helper-error"], ["weren't they", "tag-helper-error"], ["did they", "tag-polarity-error"]], "WENT is past with no helper → DID: didn't they?"),
      t("tag-helper", "Add the tag: 'Meera can swim, ___?'", "can't she", [["doesn't she", "tag-helper-error"], ["can she", "tag-polarity-error"], ["isn't she", "tag-helper-error"]], "Same helper CAN → can't she?"),
      t("tag-polarity", "Add the tag: 'The shop is not open today, ___?'", "is it", [["isn't it", "tag-polarity-error"], ["does it", "tag-helper-error"], ["is not it", "tag-helper-error"]], "Negative sentence → positive tag: is it?"),
      t("tag-tricky", "Add the tag: 'I am late, ___?'", "aren't I", [["am not I", "tag-helper-error"], ["isn't I", "tag-helper-error"], ["don't I", "tag-helper-error"]], "A special one: I am … , AREN'T I?"),
      t("tag-tricky", "Add the tag: 'Let us go to the park, ___?'", "shall we", [["will we", "tag-helper-error"], ["do we", "tag-helper-error"], ["are we", "tag-helper-error"]], "LET US … always takes SHALL WE?"),
    ],
    // Practice leaf: tricky tags (8)
    "eq-u6-tags-tricky": [
      t("tag-tricky", "Add the tag: 'Everyone enjoyed the show, ___?'", "didn't they", [["didn't he", "tag-pronoun-error"], ["did they", "tag-polarity-error"], ["doesn't it", "tag-helper-error"]], "EVERYONE → THEY in the tag. Enjoyed (past) → didn't they?"),
      t("tag-tricky", "Add the tag: 'Nobody called me, ___?'", "did they", [["didn't they", "tag-polarity-error"], ["do they", "tag-helper-error"], ["did it", "tag-pronoun-error"]], "NOBODY makes the sentence negative → positive tag: did they?"),
      t("tag-tricky", "Add the tag: 'There is a cat on the roof, ___?'", "isn't there", [["isn't it", "tag-pronoun-error"], ["is there", "tag-polarity-error"], ["doesn't it", "tag-helper-error"]], "THERE IS … , ISN'T THERE?"),
      t("tag-tricky", "Add the tag: 'Open the window, ___?'", "will you", [["do you", "tag-helper-error"], ["are you", "tag-helper-error"], ["did you", "tag-helper-error"]], "An order or request takes WILL YOU?"),
      t("tag-tricky", "Add the tag: 'I am your best friend, ___?'", "aren't I", [["am not I", "tag-helper-error"], ["isn't I", "tag-helper-error"], ["don't I", "tag-helper-error"]], "I AM … , AREN'T I?"),
      t("tag-tricky", "Add the tag: 'Nothing is broken, ___?'", "is it", [["isn't it", "tag-polarity-error"], ["does it", "tag-helper-error"], ["are they", "tag-pronoun-error"]], "NOTHING is negative → positive tag; nothing → IT: is it?"),
      t("tag-tricky", "Add the tag: 'Let us sing a song, ___?'", "shall we", [["will we", "tag-helper-error"], ["do we", "tag-helper-error"], ["are we", "tag-helper-error"]], "LET US … , SHALL WE?"),
      t("tag-tricky", "Add the tag: 'Somebody left the tap on, ___?'", "didn't they", [["did they", "tag-polarity-error"], ["didn't it", "tag-pronoun-error"], ["doesn't it", "tag-helper-error"]], "SOMEBODY → THEY. Left (past) → didn't they?"),
    ],
    // Gate pool (15): tag-polarity × 5, tag-helper × 5, tag-tricky × 5
    "eq-u6-tags-gate-pool": [
      t("tag-polarity", "Add the tag: 'It is a lovely day, ___?'", "isn't it", [["is it", "tag-polarity-error"], ["doesn't it", "tag-helper-error"], ["isn't she", "tag-pronoun-error"]], "Positive → negative tag: isn't it?"),
      t("tag-polarity", "Add the tag: 'You did not see my keys, ___?'", "did you", [["didn't you", "tag-polarity-error"], ["do you", "tag-helper-error"], ["were you", "tag-helper-error"]], "Negative → positive tag, same helper DID: did you?"),
      t("tag-polarity", "Add the tag: 'Dev is not coming, ___?'", "is he", [["isn't he", "tag-polarity-error"], ["does he", "tag-helper-error"], ["is not he", "tag-helper-error"]], "Negative → positive tag: is he?"),
      t("tag-polarity", "Which sentence has the right tag?", "We are friends, aren't we?", [["We are friends, are we?", "tag-polarity-error"], ["We are friends, don't we?", "tag-helper-error"], ["We are friends, aren't they?", "tag-pronoun-error"]], "Positive → negative, same helper ARE, same person WE."),
      t("tag-polarity", "Add the tag: 'Sana never eats sweets, ___?'", "does she", [["doesn't she", "tag-polarity-error"], ["is she", "tag-helper-error"], ["did she", "tag-helper-error"]], "NEVER makes the sentence negative → positive tag: does she?"),
      t("tag-helper", "Add the tag: 'Your father works in a bank, ___?'", "doesn't he", [["isn't he", "tag-helper-error"], ["don't he", "tag-helper-error"], ["wasn't he", "tag-helper-error"]], "WORKS has no helper → DOES: doesn't he?"),
      t("tag-helper", "Add the tag: 'The children have finished, ___?'", "haven't they", [["don't they", "tag-helper-error"], ["didn't they", "tag-helper-error"], ["hasn't they", "tag-helper-error"]], "Same helper HAVE → haven't they?"),
      t("tag-helper", "Add the tag: 'She will come tomorrow, ___?'", "won't she", [["will she", "tag-polarity-error"], ["doesn't she", "tag-helper-error"], ["isn't she", "tag-helper-error"]], "WILL → WON'T in the tag: won't she?"),
      t("tag-helper", "Add the tag: 'Arjun broke the vase, ___?'", "didn't he", [["doesn't he", "tag-helper-error"], ["wasn't he", "tag-helper-error"], ["did he", "tag-polarity-error"]], "BROKE is past with no helper → DID: didn't he?"),
      t("tag-helper", "Which sentence has the right tag?", "Neha was at home, wasn't she?", [["Neha was at home, didn't she?", "tag-helper-error"], ["Neha was at home, wasn't he?", "tag-pronoun-error"], ["Neha was at home, isn't she?", "tag-helper-error"]], "Same helper WAS → wasn't she?"),
      t("tag-tricky", "Add the tag: 'Everybody is ready, ___?'", "aren't they", [["isn't he", "tag-pronoun-error"], ["are they", "tag-polarity-error"], ["isn't it", "tag-pronoun-error"]], "EVERYBODY → THEY, and with THEY we say AREN'T: aren't they?"),
      t("tag-tricky", "Add the tag: 'Let us start the game, ___?'", "shall we", [["will we", "tag-helper-error"], ["do we", "tag-helper-error"], ["let we", "tag-helper-error"]], "LET US … , SHALL WE?"),
      t("tag-tricky", "Add the tag: 'There are ten boys in the team, ___?'", "aren't there", [["aren't they", "tag-pronoun-error"], ["are there", "tag-polarity-error"], ["isn't it", "tag-pronoun-error"]], "THERE ARE … , AREN'T THERE?"),
      t("tag-tricky", "Add the tag: 'No one was hurt, ___?'", "were they", [["weren't they", "tag-polarity-error"], ["did they", "tag-helper-error"], ["is it", "tag-pronoun-error"]], "NO ONE is negative → positive tag; no one → THEY: were they?"),
      t("tag-tricky", "Add the tag: 'I am in the team, ___?'", "aren't I", [["am not I", "tag-helper-error"], ["isn't I", "tag-helper-error"], ["don't I", "tag-helper-error"]], "I AM … , AREN'T I?"),
    ],

    // Unit Boss (12, mixed)
    "eq-u6-test": [
      q("Which sentence is correct?", "My dog can catch a ball.", [["My dog can catches a ball.", "modal-form-error"], ["My dog cans catch a ball.", "modal-form-error"], ["My dog can to catch a ball.", "modal-form-error"]], "CAN + base form: can CATCH."),
      q("Which word fits? 'When Papa was a boy, he ___ ride a horse.'", "could", [["can", "modal-time-mixup"], ["will", "modal-time-mixup"], ["must", "modal-meaning-mixup"]], "WHEN PAPA WAS A BOY → past ability → COULD."),
      q("Which is the most polite way to ask?", "May I sit here, please?", [["Move, I want to sit.", "polite-request-mixup"], ["Sit here I will.", "polite-request-mixup"], ["This seat is mine now.", "polite-request-mixup"]], "MAY I … PLEASE? is polite."),
      q("Which words fit? 'Visitors ___ feed the fish in the pond. It makes them sick.'", "must not", [["do not have to", "mustnt-donthave-mixup"], ["must", "mustnt-donthave-mixup"], ["should", "modal-meaning-mixup"]], "It makes them sick → NOT ALLOWED → MUST NOT."),
      q("Which words fit? 'It is a holiday, so you ___ set an alarm.'", "do not have to", [["must not", "mustnt-donthave-mixup"], ["must", "mustnt-donthave-mixup"], ["have to", "mustnt-donthave-mixup"]], "On a holiday an alarm is NOT NEEDED → DO NOT HAVE TO."),
      q("Which sentence gives ADVICE?", "You should rest when you are ill.", [["You must not run in the corridor.", "modal-meaning-mixup"], ["You can borrow two books.", "modal-meaning-mixup"], ["You could read at four.", "modal-meaning-mixup"]], "SHOULD = advice."),
      q("Add the tag: 'Aman is your cousin, ___?'", "isn't he", [["is he", "tag-polarity-error"], ["doesn't he", "tag-helper-error"], ["isn't it", "tag-pronoun-error"]], "Positive → negative, same helper IS, Aman → HE."),
      q("Add the tag: 'You have not met my uncle, ___?'", "have you", [["haven't you", "tag-polarity-error"], ["do you", "tag-helper-error"], ["did you", "tag-helper-error"]], "Negative → positive, same helper HAVE: have you?"),
      q("Add the tag: 'Your sister sings well, ___?'", "doesn't she", [["isn't she", "tag-helper-error"], ["does she", "tag-polarity-error"], ["don't she", "tag-helper-error"]], "SINGS has no helper → DOES: doesn't she?"),
      q("Add the tag: 'Let us clean the room, ___?'", "shall we", [["will we", "tag-helper-error"], ["do we", "tag-helper-error"], ["let we", "tag-helper-error"]], "LET US … , SHALL WE?"),
      q("Add the tag: 'Nobody saw the thief, ___?'", "did they", [["didn't they", "tag-polarity-error"], ["do they", "tag-helper-error"], ["was it", "tag-helper-error"]], "NOBODY is negative → positive tag: did they?"),
      q("Which sentence has the right tag?", "There is milk in the fridge, isn't there?", [["There is milk in the fridge, isn't it?", "tag-pronoun-error"], ["There is milk in the fridge, is there?", "tag-polarity-error"], ["There is milk in the fridge, doesn't it?", "tag-helper-error"]], "THERE IS … , ISN'T THERE?"),
    ],
  },

  // ---------- Reading ----------
  readings: {
    "eq-read-rainy-picnic": {
      name: "The Rainy Picnic",
      author: "Apprec8",
      mode: "fullPassage",
      glossary: {
        flask: "a bottle that keeps drinks hot or cold",
        shelter: "a small place with a roof that keeps you dry",
        soaking: "very, very wet",
      },
      paragraphs: [
        "On Saturday, Asha's family planned a picnic at the lake. Mummy packed parathas, pickles and a big flask of lemonade. \"We must leave by eight,\" Papa said, \"or the best spots will be gone.\"",
        "At the lake, Asha's little brother Veer wanted to feed the ducks. \"Can I give them my paratha?\" he asked. \"You should not give them bread or parathas,\" said Mummy. \"It can make them ill. We can buy duck food at the gate.\"",
        "After lunch, dark clouds rolled across the sky. \"It might rain,\" said Papa. Asha looked up. \"We do not have to go home yet, do we?\" she asked. Papa smiled. \"Not yet. But we must pack our things, just in case.\"",
        "Ten minutes later, big drops began to fall. The family ran to a small shelter near the boats. They sat close together and shared the last of the lemonade while the rain drummed on the roof.",
        "\"This was a good picnic, wasn't it?\" said Veer. Everyone laughed, because his clothes were soaking wet.",
      ],
      questions: [
        {
          ...q("Why did Papa want to leave by eight?", "So they could get one of the best spots", [["Because the lake closes at noon", "not-in-passage"], ["Because he knew it would rain", "detail-missed"], ["So they could catch the early bus", "not-in-passage"]], "Papa said: 'or the best spots will be gone.'"),
          evidence: { paragraph: 0, text: "or the best spots will be gone." },
        },
        {
          ...q("What did Mummy say they could buy at the gate?", "Duck food for the ducks", [["More parathas for lunch", "detail-missed"], ["Tickets for a boat ride", "not-in-passage"], ["A new flask of lemonade", "not-in-passage"]], "Mummy said: 'We can buy duck food at the gate.'"),
          evidence: { paragraph: 1, text: "We can buy duck food at the gate." },
        },
        {
          ...q("In 'You should not give them bread', what is Mummy doing?", "Giving advice", [["Asking for permission", "modal-meaning-mixup"], ["Talking about the past", "modal-meaning-mixup"], ["Showing what she can do", "modal-meaning-mixup"]], "SHOULD NOT = advice: it is not a good idea."),
          evidence: { paragraph: 1, text: "You should not give them bread or parathas," },
        },
        {
          ...q("Asha asks, 'We do not have to go home yet, do we?' Why is the tag 'do we' and not 'don't we'?", "The sentence is negative, so the tag is positive.", [["The sentence is about the past.", "tag-helper-error"], ["Asha is asking for permission.", "modal-meaning-mixup"], ["A tag must always be positive.", "tag-polarity-error"]], "DO NOT HAVE TO is negative → the tag flips to positive: do we?"),
          evidence: { paragraph: 2, text: "We do not have to go home yet, do we?" },
        },
        {
          ...q("The word 'drummed' in the passage means ___.", "made a beating sound again and again", [["stopped all of a sudden", "word-meaning"], ["fell very softly and quietly", "word-meaning"], ["turned into small pieces of ice", "word-meaning"]], "The rain hit the roof again and again, like someone playing a drum."),
          evidence: { paragraph: 3, text: "while the rain drummed on the roof." },
        },
        {
          ...q("Select the INCORRECT statement according to the passage.", "Veer fed his paratha to the ducks.", [["Mummy packed a flask of lemonade.", "statement-check"], ["The family waited in a shelter by the boats.", "statement-check"], ["Veer's clothes got very wet.", "statement-check"]], "Mummy told Veer NOT to give the ducks parathas; they could buy duck food instead."),
          evidence: { paragraph: 1, text: "You should not give them bread or parathas," },
        },
        {
          ...q("Why did everyone laugh at the end?", "Veer called it a good picnic though he was soaking wet.", [["Papa fell into the lake by mistake.", "not-in-passage"], ["The ducks ate all the parathas.", "not-in-passage"], ["Asha told a funny story about rain.", "not-in-passage"]], "Veer was soaking wet but still said it was a good picnic: that made everyone laugh."),
          evidence: { paragraph: 4, text: "because his clothes were soaking wet." },
        },
      ],
    },
  },
  wordTables: {},

  nodes: [
    unit("eq-u6", 6, "Modals & Question Tags"),

    // Topic A: Can, Could & May
    can,
    withSubtopic(practice("eq-u6-can-p1", can, 1, "Can or Could?", "medium", [quiz("eq-u6-can-could")]), "can-could"),
    gate("eq-u6-can-gate", can, "Can & May Challenge", "eq-u6-can-gate-pool", {
      "modal-form": "Modal + verb",
      "can-could": "Can or could",
      "asking-permission": "Asking politely",
    }),
    endless(can),

    // Topic B: Must & Should
    must,
    withSubtopic(practice("eq-u6-must-p1", must, 1, "Must Not or Do Not Have To?", "hard", [quiz("eq-u6-must-not")]), "mustnt-donthave"),
    gate("eq-u6-must-gate", must, "Rules & Advice Challenge", "eq-u6-must-gate-pool", {
      "must-rules": "Rules with must",
      "should-advice": "Advice with should",
      "mustnt-donthave": "Not allowed or not needed",
    }),
    endless(must),

    // Topic C: Question Tags
    tags,
    withSubtopic(practice("eq-u6-tags-p1", tags, 1, "Tricky Tags", "hard", [quiz("eq-u6-tags-tricky")]), "tag-tricky"),
    gate("eq-u6-tags-gate", tags, "Question Tag Challenge", "eq-u6-tags-gate-pool", {
      "tag-polarity": "Flip the tag",
      "tag-helper": "Same helper",
      "tag-tricky": "Tricky tags",
    }),
    endless(tags),

    // Reading & Boss
    u6r,
    boss(
      "eq-u6-boss",
      "eq-u6",
      "Unit 6 Boss",
      "eq-u6-test",
      "Oh no! 👾 The Grammar Gremlin has jammed the Question Machine! Now every question ends with the wrong tag, and polite words have turned rude. Fix the machine with the right modals and tags to save the day."
    ),
  ],
};

// data/englishQuest/units/u8.js: Unit 8, Linking Words (Claude, 2026-11-05). Classes 3–5 focus (Pratha first).
// Builds on Unit 1 "Conjunctions" (and, but, or, so, because, although, unless, when): reason vs result, because vs
// because of, although (never with but), time words (before, after, when, while, until), and pairs (both…and,
// either…or, neither…nor). Champion leaf (Class 5+): not only…but also, and the verb after either/neither pairs.
// Built per docs/CONTENT_GUIDE.md and docs/exam/ieo-pattern.md ("conjunctions & linkers"). Original questions.
// Ambiguity rule: linking words overlap (when/while, because/so/and), so every wrong option must be wrong in meaning
// or grammar; "when" is never offered next to a correct "while" (both fit with was/were + -ing), "and" is never
// offered where it would also make sense, and "unless" only where it clearly makes no sense.
import { q, study, quiz, reading, unit, main, practice, gate, withSubtopic, endless, boss, forGrades } from "../helpers.js";

const t = (subtopic, question, correct, wrongs, explanation) => ({ subtopic, ...q(question, correct, wrongs, explanation) });

const reason = main("eq-u8-reason", "eq-u8", 0, "Because, So & Although", [study("eq-u8-reason"), quiz("eq-u8-reason-quiz")]);
const time = main("eq-u8-time", "eq-u8", 1, "Before, After & While", [study("eq-u8-time"), quiz("eq-u8-time-quiz")]);
const pairs = main("eq-u8-pairs", "eq-u8", 2, "Either, Neither & Both", [study("eq-u8-pairs"), quiz("eq-u8-pairs-quiz")]);
const u8r = main("eq-u8-reading", "eq-u8", 3, "Reading: The Monsoon Garden", [reading("eq-read-monsoon-garden")]);

export default {
  // ---------- Study Pages ----------
  studyPages: {
    "eq-u8-reason": {
      name: "Because, So and Although",
      author: "Apprec8",
    cards: [
          {
                "emoji": "🔗",
                "title": "Reason vs Result",
                "text": "Use 'because' to explain the reason (answering Why?). Use 'so' to explain the result (what happened as a consequence).",
                "examples": [
                      "We stayed home because it was raining. (Reason)",
                      "It was raining, so we stayed home. (Result)",
                      "He worked hard, so he succeeded."
                ]
          },
          {
                "emoji": "🧩",
                "title": "Because vs Because of",
                "text": "'Because' is followed by a full subject and verb sentence. 'Because of' is followed by a simple noun or noun phrase.",
                "examples": [
                      "The match stopped because it rained. (Full sentence)",
                      "The match stopped because of the rain. (Noun)",
                      "Never say 'because of it rained'! ❌"
                ]
          },
          {
                "emoji": "😮",
                "title": "Although: a surprise contrast",
                "text": "'Although' joins two contrasting ideas that seem surprising together. Remember: use 'although' OR 'but'—never use both in one sentence!",
                "examples": [
                      "Although it was chilly, Meera went swimming.",
                      "The box was small, but it was heavy.",
                      "❌ Although it was chilly, but she swam."
                ]
          },
          {
                "kind": "check",
                "question": "Choose the correct linking word: 'She woke up late, ___ she missed the morning bus.'",
                "answer": "so",
                "wrong": [
                      "because",
                      "although",
                      "because of"
                ],
                "explain": "Missing the bus was the result of waking up late, so we use 'so'."
          },
          {
                "kind": "check",
                "question": "Which sentence avoids the 'although … but' double conjunction error?",
                "answer": "Although he was tired, he finished his chores.",
                "wrong": [
                      "Although he was tired, but he finished his chores.",
                      "Because he was tired, so he slept.",
                      "Although the book was long, but it was exciting."
                ],
                "explain": "Never use 'although' and 'but' together in the same sentence; 'although' alone is complete."
          }
    ],
      content: `### 🔗 Reason or result?

Linking words join two ideas into one sentence.

| Word | It tells you… | Example |
|---|---|---|
| **because** | the REASON (why?) | We stayed in **because** it was raining. |
| **so** | the RESULT (what happened next?) | It was raining, **so** we stayed in. |

> 💡 Ask **"Why?"** The answer starts with **because**.

---

### 🧩 Because or because of?

| because + a full sentence | because of + a thing |
|---|---|
| The match stopped **because it rained**. | The match stopped **because of the rain**. |
| I was late **because the bus was slow**. | I was late **because of the traffic**. |

> ⚠️ Not: *because of it was raining*. After **because of**, use a thing (a noun), not a full sentence.

---

### 😮 Although: a surprise

**Although** joins two ideas that don't usually go together.

- **Although** it was cold, Meera wore sandals.
- The box was small, **but** it was very heavy.

> ⚠️ Use **although** OR **but**, never both.
> ❌ *Although it was cold, but she wore sandals.*

---

### 🎯 Now you can…
- choose **because** (reason) or **so** (result)
- use **because of** + a thing
- show a surprise with **although** or **but**`,
    },
    "eq-u8-time": {
      name: "Before, After, When, While and Until",
      author: "Apprec8",
    cards: [
          {
                "emoji": "⏰",
                "title": "Putting time in order",
                "text": "Time conjunctions connect events. 'Before' means earlier than; 'after' means later than; 'until' means up to a specific point in time.",
                "examples": [
                      "Wash your hands before eating.",
                      "We ate ice cream after the game.",
                      "Wait here until the green light appears."
                ]
          },
          {
                "emoji": "🏃",
                "title": "When vs While",
                "text": "Use 'while' with a long, continuous background action (was/were -ing). Use 'when' for the short event that suddenly interrupts it!",
                "examples": [
                      "I was sleeping when the phone rang.",
                      "While I was studying, the lights went out.",
                      "The bell rang: short event → when",
                      "I was reading: long event → while"
                ]
          },
          {
                "emoji": "🔮",
                "title": "Future after time words",
                "text": "In time clauses starting with when, before, after, and until, use the simple present to talk about the future—never use 'will'!",
                "examples": [
                      "Wait until he arrives. (NOT will arrive)",
                      "Call me when you reach home. (NOT will reach)",
                      "Before you leave, check your bag."
                ]
          },
          {
                "kind": "check",
                "question": "Which sentence correctly pairs 'when' and 'while'?",
                "answer": "While we were playing outside, it began to rain.",
                "wrong": [
                      "When we were playing outside, while it rained.",
                      "While the bell rang, I was reading.",
                      "We were playing outside until it was raining."
                ],
                "explain": "'While' pairs with the ongoing continuous action ('were playing')."
          },
          {
                "kind": "check",
                "question": "Choose the correct verb: 'Please wait in the lobby until the doctor ___.'",
                "answer": "arrives",
                "wrong": [
                      "will arrive",
                      "arrived",
                      "is arriving"
                ],
                "explain": "After 'until', English uses the simple present ('arrives') to express future time."
          }
    ],
      content: `### ⏰ Time words

| Word | Meaning | Example |
|---|---|---|
| **before** | earlier than | Put on your socks **before** your shoes. |
| **after** | later than | We had ice cream **after** the match. |
| **until** | up to the time that | Wait here **until** the light turns green. |

---

### 🏃 When or while?

- **while** + a longer action that was going on: *was/were …-ing*
- **when** + a short action that cuts in

| ✅ Right | Why |
|---|---|
| I was reading **when** the bell rang. | The bell rang: short, it cut in. |
| **While** I was reading, the bell rang. | I was reading: long, going on. |

> ⚠️ Not: *I was reading while the bell rang.* The bell's ring is short, so use **when**.

---

### 🔮 Talking about later

After **when, before, after, until**, use the present for the future:

- Wait **until** he **comes**. (not *will come*)
- Call me **when** you **reach** home.

---

### 🎯 Now you can…
- put events in order with **before** and **after**
- pick **when** or **while**
- use **until** for "up to the time that"`,
    },
    "eq-u8-pairs": {
      name: "Both, Either and Neither",
      author: "Apprec8",
    cards: [
          {
                "emoji": "👯",
                "title": "Conjunctions that travel in pairs",
                "text": "Correlative conjunctions work in matched pairs: 'both … and' links two true facts; 'either … or' offers a choice; 'neither … nor' denies both.",
                "examples": [
                      "Both Ria and Sam love books. (Both true)",
                      "You may have either juice or milk. (Choice of one)",
                      "Neither Rohan nor Dev was late. (Neither one)"
                ]
          },
          {
                "emoji": "🧷",
                "title": "Keep the partners matched!",
                "text": "Never mix up the partners! Remember: the letter 'n' in neither matches the letter 'n' in nor. Either pairs strictly with or!",
                "examples": [
                      "both … and ✅",
                      "either … or ✅",
                      "neither … nor ✅",
                      "❌ neither … or (Never mix them!)"
                ]
          },
          {
                "emoji": "🔄",
                "title": "Rewriting with pairs",
                "text": "Use pairs to combine two sentences smoothly into one elegant thought without repeating words.",
                "examples": [
                      "Asha sings. Asha dances.",
                      "→ Asha can both sing and dance.",
                      "He cannot swim. He cannot skate.",
                      "→ He can neither swim nor skate."
                ]
          },
          {
                "kind": "check",
                "question": "Fill in the blank: 'You can choose ___ the chocolate cake or the fruit tart.'",
                "answer": "either",
                "wrong": [
                      "neither",
                      "both",
                      "whether"
                ],
                "explain": "'Or' pairs with 'either' to offer a choice between two options."
          },
          {
                "kind": "check",
                "question": "Which sentence is correctly matched?",
                "answer": "Neither the driver nor the passengers were hurt.",
                "wrong": [
                      "Neither the driver or the passengers were hurt.",
                      "Either the driver nor the passengers were hurt.",
                      "Both the driver or the passengers were hurt."
                ],
                "explain": "'Neither' must always be paired with 'nor'."
          }
    ],
      content: `### 👯 Linking words that come in pairs

| Pair | Meaning | Example |
|---|---|---|
| **both … and** | two things, both true | **Both** Ria **and** Sam like mangoes. |
| **either … or** | a choice: one of the two | You can have **either** tea **or** milk. |
| **neither … nor** | not this one, and not that one | **Neither** Ravi **nor** Gita was late. |

---

### 🧷 Keep the pairs together

| ✅ Right | ❌ Wrong |
|---|---|
| either … **or** | either … nor |
| neither … **nor** | neither … or |
| both … **and** | both … or |

> 💡 **Neither** = "not either". The **n** in **n**either goes with the **n** in **n**or.

---

### 🔄 Same meaning, new sentence

- Raju cannot read **and** he cannot write. → Raju can **neither** read **nor** write.
- Mina can sing. Mina can dance. → Mina can **both** sing **and** dance.

---

### 🎯 Now you can…
- use **both … and**, **either … or**, **neither … nor**
- keep each pair together
- join two sentences with a pair`,
    },
  },

  // ---------- Quizzes ----------
  quizzes: {
    // Topic A: Because, So & Although (practice, 8)
    "eq-u8-reason-quiz": [
      t("because-so", "Complete the sentence: 'The road was wet ___ it had rained all night.'", "because", [["so", "because-so-mixup"], ["although", "conjunction-meaning-error"], ["unless", "conjunction-meaning-error"]], "Why was the road wet? BECAUSE it had rained. Because gives the reason."),
      t("because-so", "Pick the linking word: 'The puppy was hungry, ___ we gave it some milk.'", "so", [["because", "because-so-mixup"], ["although", "conjunction-meaning-error"], ["unless", "conjunction-meaning-error"]], "Hungry puppy → what happened next? We gave it milk. SO shows the result."),
      t("because-so", "Which sentence makes sense?", "Riya wore a sweater because it was cold.", [["Riya wore a sweater so it was cold.", "because-so-mixup"], ["Riya wore a sweater although it was cold.", "conjunction-meaning-error"], ["Riya wore a sweater unless it was cold.", "conjunction-meaning-error"]], "The cold is the REASON she wore a sweater, so we use BECAUSE."),
      t("because-of", "Complete the sentence: 'The match was stopped because ___ the rain.'", "of", [["for", "because-of-error"], ["to", "because-of-error"], ["from", "because-of-error"]], "Before a thing (the rain), we say BECAUSE OF: because of the rain."),
      t("because-of", "Which sentence is correct?", "We stayed home because of the storm.", [["We stayed home because the storm.", "because-of-error"], ["We stayed home because of the storm was bad.", "because-of-error"], ["We stayed home so the storm.", "because-so-mixup"]], "BECAUSE OF + a thing: because of the storm. (Or: because the storm WAS bad.)"),
      t("although-but", "Complete the sentence: '___ Kabir was tired, he finished his homework.'", "Although", [["Because", "conjunction-meaning-error"], ["So", "conjunction-meaning-error"], ["But", "conjunction-double-error"]], "Being tired and still finishing is a surprise, so we use ALTHOUGH."),
      t("although-but", "Which sentence is correct?", "Although it was late, we kept playing.", [["Although it was late, but we kept playing.", "conjunction-double-error"], ["Although it was late, so we kept playing.", "conjunction-double-error"], ["But it was late, although we kept playing.", "conjunction-double-error"]], "Use ALTHOUGH or BUT, never both in one sentence."),
      t("although-but", "Complete the sentence: 'The box was small, ___ it was very heavy.'", "but", [["so", "conjunction-meaning-error"], ["because", "because-so-mixup"], ["or", "conjunction-meaning-error"]], "Small but heavy is a surprise, so we use BUT."),
    ],
    // Practice leaf: Because or Because of? (8)
    "eq-u8-because-of": [
      t("because-of", "Complete the sentence: 'The school was closed ___ the flood.'", "because of", [["because", "because-of-error"], ["so", "because-so-mixup"], ["although", "conjunction-meaning-error"]], "THE FLOOD is a thing (a noun), so we use BECAUSE OF."),
      t("because-of", "Complete the sentence: 'The school was closed ___ the river had flooded.'", "because", [["because of", "because-of-error"], ["so", "because-so-mixup"], ["unless", "conjunction-meaning-error"]], "THE RIVER HAD FLOODED is a full sentence, so we use BECAUSE."),
      t("because-of", "Pick the right words: 'Ananya won the prize ___ her hard work.'", "because of", [["because", "because-of-error"], ["so that", "because-so-mixup"], ["although", "conjunction-meaning-error"]], "HER HARD WORK is a thing, so: because of her hard work."),
      t("because-of", "Complete the sentence: 'We could not see the stars ___ the clouds.'", "because of", [["because", "because-of-error"], ["although", "conjunction-meaning-error"], ["so", "because-so-mixup"]], "THE CLOUDS is a thing, so: because of the clouds."),
      t("because-of", "Which sentence is correct?", "The bus was late because of the traffic.", [["The bus was late because the traffic.", "because-of-error"], ["The bus was late because of the traffic was heavy.", "because-of-error"], ["The bus was late so the traffic.", "because-so-mixup"]], "BECAUSE OF + a thing: because of the traffic."),
      t("because-of", "Complete the sentence: 'Grandpa walks slowly ___ his knee hurts.'", "because", [["because of", "because-of-error"], ["so", "because-so-mixup"], ["although", "conjunction-meaning-error"]], "HIS KNEE HURTS is a full sentence (it has a verb), so we use BECAUSE."),
      t("because-of", "Which words fit? 'Tara stayed inside ___ she had a cold.'", "because", [["because of", "because-of-error"], ["although", "conjunction-meaning-error"], ["unless", "conjunction-meaning-error"]], "SHE HAD A COLD is a full sentence, so: because she had a cold."),
      t("because-of", "Which sentence is correct?", "I could not sleep because of the noise.", [["I could not sleep because the noise.", "because-of-error"], ["I could not sleep because of the noise was loud.", "because-of-error"], ["I could not sleep so the noise.", "because-so-mixup"]], "BECAUSE OF + a thing: because of the noise."),
    ],
    // Gate A (15 = 3 sub-topics × 5)
    "eq-u8-reason-gate-pool": [
      t("because-so", "Choose the linking word: 'It was my birthday, ___ Mummy baked a cake.'", "so", [["because", "because-so-mixup"], ["although", "conjunction-meaning-error"], ["unless", "conjunction-meaning-error"]], "My birthday → the result: Mummy baked a cake. SO shows the result."),
      t("because-so", "Choose the linking word: 'Mummy baked a cake ___ it was my birthday.'", "because", [["so", "because-so-mixup"], ["although", "conjunction-meaning-error"], ["or", "conjunction-meaning-error"]], "Why did Mummy bake a cake? BECAUSE it was my birthday."),
      t("because-so", "Which sentence shows the RESULT correctly?", "The well was dry, so the farmer dug deeper.", [["The farmer dug deeper, so the well was dry.", "because-so-mixup"], ["So the well was dry, the farmer dug deeper.", "because-so-mixup"], ["The well was dry, although the farmer dug deeper.", "conjunction-meaning-error"]], "Dry well first, then the result: the farmer dug deeper. SO comes before the result."),
      t("because-so", "Join the sentences: 'The bag was heavy. Sonu could not lift it.'", "The bag was heavy, so Sonu could not lift it.", [["The bag was heavy because Sonu could not lift it.", "because-so-mixup"], ["The bag was heavy, although Sonu could not lift it.", "conjunction-meaning-error"], ["The bag was heavy unless Sonu could not lift it.", "conjunction-meaning-error"]], "Heavy bag → result: Sonu could not lift it. Use SO."),
      t("because-so", "Choose the linking word: 'The plants died ___ nobody watered them.'", "because", [["so", "because-so-mixup"], ["although", "conjunction-meaning-error"], ["unless", "conjunction-meaning-error"]], "Why did the plants die? BECAUSE nobody watered them."),
      t("because-of", "Choose the right words: 'The flight was cancelled ___ the fog.'", "because of", [["because", "because-of-error"], ["so", "because-so-mixup"], ["although", "conjunction-meaning-error"]], "THE FOG is a thing, so: because of the fog."),
      t("because-of", "Choose the right words: 'The flight was cancelled ___ there was thick fog.'", "because", [["because of", "because-of-error"], ["so", "because-so-mixup"], ["unless", "conjunction-meaning-error"]], "THERE WAS THICK FOG is a full sentence, so we use BECAUSE."),
      t("because-of", "Which sentence is correct?", "Because of the heat, we swam in the pool.", [["Because the heat, we swam in the pool.", "because-of-error"], ["Because of it was hot, we swam in the pool.", "because-of-error"], ["Because of hot, we swam in the pool.", "because-of-error"]], "BECAUSE OF + a thing: because of the heat. (Or: because it was hot.)"),
      t("because-of", "Find the mistake: 'She was absent because of she was ill.' How do we fix it?", "Change 'because of' to 'because'", [["Change 'was' to 'were'", "sva-number-error"], ["Change 'absent' to 'absence'", "pos-noun-mixup"], ["Change 'ill' to 'illness'", "pos-noun-mixup"]], "SHE WAS ILL is a full sentence, so it needs BECAUSE, not because of."),
      t("because-of", "Choose the right words: 'Everyone clapped ___ her beautiful song.'", "because of", [["because", "because-of-error"], ["so", "because-so-mixup"], ["although", "conjunction-meaning-error"]], "HER BEAUTIFUL SONG is a thing, so: because of her beautiful song."),
      t("although-but", "Choose the linking word: '___ the test was hard, Neha got full marks.'", "Although", [["Because", "conjunction-meaning-error"], ["So", "conjunction-meaning-error"], ["Unless", "conjunction-meaning-error"]], "A hard test and full marks is a surprise, so we use ALTHOUGH."),
      t("although-but", "Which sentence is correct?", "The sun was out, but it was cold.", [["Although the sun was out, but it was cold.", "conjunction-double-error"], ["But the sun was out, it was cold.", "conjunction-double-error"], ["The sun was out, because it was cold.", "because-so-mixup"]], "Sunny but cold is a surprise: use BUT (or although), never both."),
      t("although-but", "Choose the linking word: 'Mohan is rich, ___ he lives in a small house.'", "but", [["so", "conjunction-meaning-error"], ["because", "because-so-mixup"], ["or", "conjunction-meaning-error"]], "Rich but a small house is a surprise, so we use BUT."),
      t("although-but", "Join with 'although': 'It was raining. We went for a walk.'", "Although it was raining, we went for a walk.", [["Although it was raining, but we went for a walk.", "conjunction-double-error"], ["Although it was raining, so we went for a walk.", "conjunction-double-error"], ["It was raining although, we went for a walk.", "conjunction-double-error"]], "ALTHOUGH starts the surprise sentence, and it never goes with but or so."),
      t("although-but", "Choose the linking word: 'The phone is old, ___ it still works well.'", "but", [["so", "conjunction-meaning-error"], ["because", "because-so-mixup"], ["unless", "conjunction-meaning-error"]], "Old but still works well is a surprise, so we use BUT."),
    ],

    // Topic B: Before, After & While (practice, 8)
    "eq-u8-time-quiz": [
      t("before-after", "Complete the sentence: 'Put on your socks ___ you put on your shoes.'", "before", [["after", "time-word-mixup"], ["until", "time-word-mixup"], ["unless", "conjunction-meaning-error"]], "Socks go on first, so: socks BEFORE shoes."),
      t("before-after", "Pick the right word: 'Dinosaurs lived on Earth long ___ people did.'", "before", [["after", "time-word-mixup"], ["while", "when-while-mixup"], ["until", "time-word-mixup"]], "Dinosaurs died out millions of years before the first people, so: long BEFORE."),
      t("before-after", "Complete the sentence: 'Ravi felt better ___ he took the medicine.'", "after", [["before", "time-word-mixup"], ["unless", "conjunction-meaning-error"], ["so", "conjunction-meaning-error"]], "First the medicine, then he felt better: AFTER he took it."),
      t("when-while", "Complete the sentence: 'The phone rang ___ I was having a bath.'", "while", [["until", "time-word-mixup"], ["unless", "conjunction-meaning-error"], ["so", "conjunction-meaning-error"]], "I WAS HAVING a bath is a longer action going on: WHILE I was having a bath."),
      t("when-while", "Which word fits? 'Dadi was cooking ___ the lights went out.'", "when", [["because", "conjunction-meaning-error"], ["unless", "conjunction-meaning-error"], ["so", "conjunction-meaning-error"]], "The lights went out suddenly: a short action that cut in, so we use WHEN."),
      t("until", "Complete the sentence: 'Wait here ___ I come back.'", "until", [["unless", "conjunction-meaning-error"], ["so", "conjunction-meaning-error"], ["although", "conjunction-meaning-error"]], "UNTIL = up to the time that: wait up to the time I come back."),
      t("until", "Pick the right word: 'The baby slept ___ the dog barked.'", "until", [["unless", "conjunction-meaning-error"], ["so", "conjunction-meaning-error"], ["because", "conjunction-meaning-error"]], "The baby slept up to the time the dog barked: UNTIL."),
      t("when-while", "Which word means 'during the time that'?", "while", [["until", "time-word-mixup"], ["unless", "conjunction-meaning-error"], ["because", "conjunction-meaning-error"]], "WHILE = during the time that: I sang while I was cooking."),
    ],
    // Practice leaf: When or While? (8)
    "eq-u8-when-while": [
      t("when-while", "Complete the sentence: 'We were playing cricket ___ it started to rain.'", "when", [["while", "when-while-mixup"], ["unless", "conjunction-meaning-error"], ["so", "conjunction-meaning-error"]], "The rain STARTED: a short action that cut in, so we use WHEN."),
      t("when-while", "Complete the sentence: 'Tina was sleeping ___ the alarm rang.'", "when", [["while", "when-while-mixup"], ["unless", "conjunction-meaning-error"], ["so", "conjunction-meaning-error"]], "The alarm RANG: short, it cut in. Use WHEN."),
      t("when-while", "Complete the sentence: 'Raju hurt his leg ___ he was climbing the tree.'", "while", [["unless", "conjunction-meaning-error"], ["although", "conjunction-meaning-error"], ["so", "conjunction-meaning-error"]], "HE WAS CLIMBING is a longer action going on: WHILE he was climbing."),
      t("when-while", "Which word fits? 'Please be quiet ___ the baby is sleeping.'", "while", [["so", "conjunction-meaning-error"], ["unless", "conjunction-meaning-error"], ["but", "conjunction-meaning-error"]], "The baby IS SLEEPING: going on right now, so: be quiet WHILE the baby is sleeping."),
      t("when-while", "Which sentence is correct?", "I was eating lunch when my friend called.", [["I was eating lunch while my friend called.", "when-while-mixup"], ["I eating lunch when my friend called.", "tense-form-error"], ["I was eat lunch when my friend called.", "tense-form-error"]], "The call was short and cut in, so: WHEN my friend called."),
      t("when-while", "Complete the sentence: 'Call me ___ you reach the station.'", "when", [["while", "when-while-mixup"], ["although", "conjunction-meaning-error"], ["so", "conjunction-meaning-error"]], "Reaching the station happens at one moment, so: call me WHEN you reach."),
      t("when-while", "Complete the sentence: 'Mummy read a book ___ she was waiting for the bus.'", "while", [["although", "conjunction-meaning-error"], ["unless", "conjunction-meaning-error"], ["so", "conjunction-meaning-error"]], "SHE WAS WAITING is a longer action going on: WHILE she was waiting."),
      t("when-while", "Which word fits? 'The lights went out ___ we were watching a film.'", "while", [["so", "conjunction-meaning-error"], ["unless", "conjunction-meaning-error"], ["although", "conjunction-meaning-error"]], "WE WERE WATCHING is a longer action going on: WHILE we were watching."),
    ],
    // Gate B (15 = 3 sub-topics × 5)
    "eq-u8-time-gate-pool": [
      t("before-after", "Choose the right word: 'Look both ways ___ you cross the road.'", "before", [["after", "time-word-mixup"], ["until", "time-word-mixup"], ["unless", "conjunction-meaning-error"]], "Look first, then cross: look BEFORE you cross."),
      t("before-after", "Choose the right word: 'We ate the cake ___ Didi cut it.'", "after", [["before", "time-word-mixup"], ["unless", "conjunction-meaning-error"], ["although", "conjunction-meaning-error"]], "First Didi cut the cake, then we ate it: AFTER."),
      t("before-after", "Which sentence shows the RIGHT order of events?", "After the egg hatched, a chick came out.", [["Before the egg hatched, a chick came out.", "time-word-mixup"], ["A chick came out until the egg hatched.", "time-word-mixup"], ["A chick came out although the egg hatched.", "conjunction-meaning-error"]], "The egg hatches first, then the chick comes out: AFTER the egg hatched."),
      t("before-after", "Join with 'before': 'Riya packed her bag. Then she left for school.'", "Riya packed her bag before she left for school.", [["Riya left for school before she packed her bag.", "time-word-mixup"], ["Before Riya packed her bag, she left for school.", "time-word-mixup"], ["Riya packed her bag before she leave for school.", "tense-form-error"]], "Packing came first: she packed BEFORE she LEFT."),
      t("before-after", "Choose the right word: 'Switch off the fan ___ you leave the room.'", "before", [["after", "time-word-mixup"], ["until", "time-word-mixup"], ["unless", "conjunction-meaning-error"]], "Switch it off first, then leave: BEFORE you leave."),
      t("when-while", "Choose the right word: 'Asha was drawing ___ the doorbell rang.'", "when", [["while", "when-while-mixup"], ["because", "conjunction-meaning-error"], ["unless", "conjunction-meaning-error"]], "The doorbell RANG: short, it cut in. Use WHEN."),
      t("when-while", "Choose the right word: '___ we were walking home, we saw a rainbow.'", "While", [["Until", "time-word-mixup"], ["Unless", "conjunction-meaning-error"], ["Although", "conjunction-meaning-error"]], "WE WERE WALKING is a longer action going on: WHILE we were walking."),
      t("when-while", "Which sentence is correct?", "Papa was driving when the tyre burst.", [["Papa was driving while the tyre burst.", "when-while-mixup"], ["Papa driving when the tyre burst.", "tense-form-error"], ["Papa was drive when the tyre burst.", "tense-form-error"]], "The tyre BURST: short and sudden, so: WHEN the tyre burst."),
      t("when-while", "Choose the right word: 'Do not talk ___ you are eating.'", "while", [["until", "time-word-mixup"], ["unless", "conjunction-meaning-error"], ["so", "conjunction-meaning-error"]], "YOU ARE EATING is going on, so: do not talk WHILE you are eating."),
      t("when-while", "Choose the right word: 'Vikram was reading ___ his sister switched off the light.'", "when", [["while", "when-while-mixup"], ["unless", "conjunction-meaning-error"], ["because", "conjunction-meaning-error"]], "Switching off the light is short: it cut in, so we use WHEN."),
      t("until", "Choose the right word: 'Keep stirring the milk ___ it boils.'", "until", [["unless", "conjunction-meaning-error"], ["although", "conjunction-meaning-error"], ["so", "conjunction-meaning-error"]], "Stir up to the time it boils: UNTIL it boils."),
      t("until", "Which word means 'up to the time that'?", "until", [["unless", "conjunction-meaning-error"], ["while", "when-while-mixup"], ["because", "conjunction-meaning-error"]], "UNTIL = up to the time that."),
      t("until", "Choose the right word: 'We waited at the gate ___ the bell rang.'", "until", [["unless", "conjunction-meaning-error"], ["or", "conjunction-meaning-error"], ["so", "conjunction-meaning-error"]], "We waited up to the time the bell rang: UNTIL."),
      t("until", "Which sentence is correct?", "Stay in bed until you feel better.", [["Stay in bed until you will feel better.", "tense-future-form-error"], ["Stay in bed until you felt better.", "tense-form-error"], ["Stay in bed until feel better.", "missing-subject"]], "After UNTIL, use the present for later: until you FEEL better."),
      t("until", "Choose the right word: 'The shop stays open ___ nine o'clock at night.'", "until", [["unless", "conjunction-meaning-error"], ["while", "when-while-mixup"], ["although", "conjunction-meaning-error"]], "It is open up to that time: UNTIL nine o'clock."),
    ],

    // Topic C: Either, Neither & Both (practice, 8)
    "eq-u8-pairs-quiz": [
      t("both-and", "Complete the sentence: 'Both Ria ___ Sam like mangoes.'", "and", [["or", "conjunction-pair-error"], ["nor", "conjunction-pair-error"], ["but", "conjunction-pair-error"]], "BOTH goes with AND: both Ria and Sam."),
      t("both-and", "Pick the right word: '___ my mother and my father are doctors.'", "Both", [["Either", "conjunction-pair-error"], ["Neither", "conjunction-pair-error"], ["Not", "conjunction-pair-error"]], "AND goes with BOTH: both my mother and my father."),
      t("either-or", "Complete the sentence: 'You can have either tea ___ milk.'", "or", [["and", "conjunction-pair-error"], ["nor", "conjunction-pair-error"], ["but", "conjunction-pair-error"]], "EITHER goes with OR: either tea or milk (a choice)."),
      t("either-or", "Pick the right word: 'We will go ___ today or tomorrow.'", "either", [["both", "conjunction-pair-error"], ["neither", "conjunction-pair-error"], ["not", "conjunction-pair-error"]], "OR goes with EITHER: either today or tomorrow."),
      t("neither-nor", "Complete the sentence: 'Neither Ravi ___ Gita was late.'", "nor", [["or", "conjunction-pair-error"], ["and", "conjunction-pair-error"], ["but", "conjunction-pair-error"]], "NEITHER goes with NOR: neither Ravi nor Gita."),
      t("neither-nor", "Which word fits? '___ the cat nor the dog was hungry.'", "Neither", [["Either", "conjunction-pair-error"], ["Both", "conjunction-pair-error"], ["Not", "conjunction-pair-error"]], "NOR goes with NEITHER: neither the cat nor the dog."),
      t("both-and", "Which sentence is correct?", "Both Meena and Anu play the flute.", [["Both Meena or Anu play the flute.", "conjunction-pair-error"], ["Both Meena nor Anu play the flute.", "conjunction-pair-error"], ["Both Meena and Anu plays the flute.", "sva-number-error"]], "BOTH … AND, and two people take PLAY (no -s)."),
      t("either-or", "What does 'either … or' do in a sentence?", "It gives a choice between two things.", [["It says that two things are both true.", "conjunction-pair-error"], ["It says that two things are both not true.", "conjunction-pair-error"], ["It gives the reason for something.", "conjunction-meaning-error"]], "EITHER … OR = one of the two: a choice."),
    ],
    // Practice leaf: Neither or Either? (8)
    "eq-u8-neither-either": [
      t("neither-nor", "Complete the sentence: 'Neither Ajay ___ his brother can swim.'", "nor", [["or", "conjunction-pair-error"], ["and", "conjunction-pair-error"], ["but", "conjunction-pair-error"]], "NEITHER goes with NOR."),
      t("neither-nor", "Pick the right word: 'I like ___ milk nor curd.'", "neither", [["either", "conjunction-pair-error"], ["both", "conjunction-pair-error"], ["not", "conjunction-pair-error"]], "NOR goes with NEITHER: I like neither milk nor curd."),
      t("neither-nor", "Which sentence means 'Tom did not come, and Raj did not come'?", "Neither Tom nor Raj came.", [["Either Tom or Raj came.", "conjunction-pair-error"], ["Both Tom and Raj came.", "conjunction-pair-error"], ["Tom came, but Raj did not.", "conjunction-meaning-error"]], "Not Tom and not Raj → NEITHER Tom NOR Raj."),
      t("either-or", "Which sentence means 'One of them will help: Raj or Tom'?", "Either Raj or Tom will help.", [["Neither Raj nor Tom will help.", "conjunction-pair-error"], ["Both Raj and Tom will help.", "conjunction-pair-error"], ["Raj and Tom will not help.", "conjunction-meaning-error"]], "One of the two → EITHER Raj OR Tom."),
      t("neither-nor", "Complete the sentence: 'The shop sells neither pens ___ pencils.'", "nor", [["or", "conjunction-pair-error"], ["and", "conjunction-pair-error"], ["but", "conjunction-pair-error"]], "NEITHER goes with NOR."),
      t("neither-nor", "Pick the right word: 'The bag is ___ big nor heavy.'", "neither", [["either", "conjunction-pair-error"], ["both", "conjunction-pair-error"], ["so", "conjunction-pair-error"]], "NOR goes with NEITHER: neither big nor heavy."),
      t("either-or", "Complete the sentence: 'You may take either the red ball ___ the blue one.'", "or", [["nor", "conjunction-pair-error"], ["and", "conjunction-pair-error"], ["but", "conjunction-pair-error"]], "EITHER goes with OR."),
      t("neither-nor", "Which pair goes together?", "neither … nor", [["neither … or", "conjunction-pair-error"], ["either … nor", "conjunction-pair-error"], ["both … or", "conjunction-pair-error"]], "NEITHER goes with NOR (both start with N)."),
    ],
    // Gate C (15 = 3 sub-topics × 5)
    "eq-u8-pairs-gate-pool": [
      t("both-and", "Choose the right word: 'Both the boys ___ the girls joined the dance.'", "and", [["or", "conjunction-pair-error"], ["nor", "conjunction-pair-error"], ["but", "conjunction-pair-error"]], "BOTH goes with AND."),
      t("both-and", "Choose the right word: 'Sachin was ___ a great batsman and a kind person.'", "both", [["either", "conjunction-pair-error"], ["neither", "conjunction-pair-error"], ["not", "conjunction-pair-error"]], "AND goes with BOTH: both a great batsman and a kind person."),
      t("both-and", "Join with 'both … and': 'Ria can sing. Ria can dance.'", "Ria can both sing and dance.", [["Ria can both sing or dance.", "conjunction-pair-error"], ["Ria can either sing and dance.", "conjunction-pair-error"], ["Ria can neither sing and dance.", "conjunction-pair-error"]], "Two true things → BOTH sing AND dance."),
      t("both-and", "Which sentence is correct?", "Both my pencils and my eraser are in the box.", [["Both my pencils or my eraser are in the box.", "conjunction-pair-error"], ["Both my pencils nor my eraser are in the box.", "conjunction-pair-error"], ["Both my pencils and my eraser is in the box.", "sva-number-error"]], "BOTH … AND, and two things together take ARE."),
      t("both-and", "Choose the right word: '___ Delhi and Mumbai are big cities.'", "Both", [["Either", "conjunction-pair-error"], ["Neither", "conjunction-pair-error"], ["Not only", "conjunction-pair-error"]], "AND goes with BOTH: both Delhi and Mumbai."),
      t("either-or", "Choose the right word: 'You can pay either by cash ___ by card.'", "or", [["nor", "conjunction-pair-error"], ["and", "conjunction-pair-error"], ["but", "conjunction-pair-error"]], "EITHER goes with OR."),
      t("either-or", "Choose the right word: 'We can ___ walk or take a rickshaw.'", "either", [["neither", "conjunction-pair-error"], ["both", "conjunction-pair-error"], ["not", "conjunction-pair-error"]], "OR goes with EITHER: either walk or take a rickshaw."),
      t("either-or", "Which sentence gives a CHOICE?", "Either Mina or Rahul will bring the ball.", [["Both Mina and Rahul will bring the ball.", "conjunction-pair-error"], ["Neither Mina nor Rahul will bring the ball.", "conjunction-pair-error"], ["Mina and Rahul will not bring the ball.", "conjunction-meaning-error"]], "EITHER … OR = one of the two: a choice."),
      t("either-or", "Which sentence is correct?", "Either Ravi or Sita has the key.", [["Either Ravi nor Sita has the key.", "conjunction-pair-error"], ["Either Ravi and Sita has the key.", "conjunction-pair-error"], ["Either or Ravi Sita has the key.", "conjunction-pair-error"]], "EITHER goes with OR: either Ravi or Sita."),
      t("either-or", "Choose the right word: 'Come ___ on Monday or on Tuesday.'", "either", [["neither", "conjunction-pair-error"], ["both", "conjunction-pair-error"], ["not", "conjunction-pair-error"]], "OR goes with EITHER: either on Monday or on Tuesday."),
      t("neither-nor", "Choose the right word: 'Neither the teacher ___ the students heard the noise.'", "nor", [["or", "conjunction-pair-error"], ["and", "conjunction-pair-error"], ["but", "conjunction-pair-error"]], "NEITHER goes with NOR."),
      t("neither-nor", "Choose the right word: 'The soup was ___ hot nor tasty.'", "neither", [["either", "conjunction-pair-error"], ["both", "conjunction-pair-error"], ["not", "conjunction-pair-error"]], "NOR goes with NEITHER: neither hot nor tasty."),
      t("neither-nor", "Which sentence means the same as 'Raju cannot read, and he cannot write'?", "Raju can neither read nor write.", [["Raju can either read or write.", "conjunction-pair-error"], ["Raju can both read and write.", "conjunction-pair-error"], ["Raju can read but not write.", "conjunction-meaning-error"]], "Not read and not write → NEITHER read NOR write."),
      t("neither-nor", "Which sentence is correct?", "Neither Pooja nor Kiran was at home.", [["Neither Pooja or Kiran was at home.", "conjunction-pair-error"], ["Neither Pooja and Kiran was at home.", "conjunction-pair-error"], ["Nor Pooja neither Kiran was at home.", "conjunction-pair-error"]], "NEITHER comes first, then NOR."),
      t("neither-nor", "Choose the right word: 'He ___ called nor sent a message.'", "neither", [["either", "conjunction-pair-error"], ["both", "conjunction-pair-error"], ["not", "conjunction-pair-error"]], "NOR goes with NEITHER: he neither called nor sent a message."),
    ],
    // Champion leaf (Class 5+): not only … but also; the verb after either/neither pairs (8)
    "eq-u8-pairs-champion": [
      t("not-only", "Complete the sentence: 'Priya is not only clever ___ also kind.'", "but", [["and", "conjunction-pair-error"], ["or", "conjunction-pair-error"], ["nor", "conjunction-pair-error"]], "NOT ONLY goes with BUT ALSO."),
      t("not-only", "Pick the right words: 'The park has ___ swings but also a big slide.'", "not only", [["both", "conjunction-pair-error"], ["either", "conjunction-pair-error"], ["neither", "conjunction-pair-error"]], "BUT ALSO goes with NOT ONLY: not only swings but also a slide."),
      t("not-only", "Which sentence is correct?", "Not only Ravi but also his friends were late.", [["Not only Ravi and also his friends were late.", "conjunction-pair-error"], ["Not only Ravi but also his friends was late.", "sva-number-error"], ["Only not Ravi but also his friends were late.", "conjunction-pair-error"]], "NOT ONLY … BUT ALSO, and the verb matches the nearer word: friends → WERE."),
      t("pair-agreement", "Complete the sentence: 'Neither the teacher nor the students ___ ready.'", "were", [["was", "sva-number-error"], ["is", "sva-number-error"], ["has", "sva-number-error"]], "With NEITHER … NOR, the verb matches the nearer word: the students → WERE."),
      t("pair-agreement", "Complete the sentence: 'Either the boys or their sister ___ the dishes every day.'", "washes", [["wash", "sva-number-error"], ["washing", "tense-form-error"], ["are wash", "tense-form-error"]], "With EITHER … OR, the verb matches the nearer word: their sister → WASHES."),
      t("pair-agreement", "Complete the sentence: 'Neither my sisters nor my brother ___ to school by bus.'", "goes", [["go", "sva-number-error"], ["going", "tense-form-error"], ["are go", "tense-form-error"]], "The nearer word is MY BROTHER (one person), so: GOES."),
      t("not-only", "Join with 'not only … but also': 'Rohan plays the guitar. He also plays the drums.'", "Rohan plays not only the guitar but also the drums.", [["Rohan plays not only the guitar and also the drums.", "conjunction-pair-error"], ["Rohan plays only not the guitar but also the drums.", "conjunction-pair-error"], ["Rohan plays not only the guitar but the drums also too.", "conjunction-pair-error"]], "NOT ONLY the guitar BUT ALSO the drums."),
      t("not-only", "Which pair goes together?", "not only … but also", [["not only … and also", "conjunction-pair-error"], ["not only … or also", "conjunction-pair-error"], ["not only … nor also", "conjunction-pair-error"]], "NOT ONLY always goes with BUT ALSO."),
    ],

    // Unit 8 Boss (12, mixed; works for every class that sees the unit)
    "eq-u8-test": [
      q("Choose the linking word: 'The milk was sour, ___ we threw it away.'", "so", [["because", "because-so-mixup"], ["although", "conjunction-meaning-error"], ["unless", "conjunction-meaning-error"]], "Sour milk → the result: we threw it away. SO."),
      q("Choose the linking word: 'We threw the milk away ___ it was sour.'", "because", [["so", "because-so-mixup"], ["although", "conjunction-meaning-error"], ["or", "conjunction-meaning-error"]], "Why did we throw it away? BECAUSE it was sour."),
      q("Choose the right words: 'The game was stopped ___ the bad light.'", "because of", [["because", "because-of-error"], ["so", "because-so-mixup"], ["although", "conjunction-meaning-error"]], "THE BAD LIGHT is a thing, so: because of the bad light."),
      q("Which sentence is correct?", "Although Sam was hungry, he shared his lunch.", [["Although Sam was hungry, but he shared his lunch.", "conjunction-double-error"], ["Although Sam was hungry, so he shared his lunch.", "conjunction-double-error"], ["But Sam was hungry, although he shared his lunch.", "conjunction-double-error"]], "ALTHOUGH alone shows the surprise: never add but or so."),
      q("Choose the right word: 'Put the lid on ___ you shake the bottle.'", "before", [["after", "time-word-mixup"], ["until", "time-word-mixup"], ["unless", "conjunction-meaning-error"]], "Lid first, then shake: BEFORE you shake."),
      q("Choose the right word: 'Kiran was watering the plants ___ it began to rain.'", "when", [["while", "when-while-mixup"], ["unless", "conjunction-meaning-error"], ["so", "conjunction-meaning-error"]], "The rain BEGAN: short, it cut in. Use WHEN."),
      q("Choose the right word: 'Keep your eyes closed ___ I say \"open\".'", "until", [["although", "conjunction-meaning-error"], ["so", "conjunction-meaning-error"], ["but", "conjunction-meaning-error"]], "Keep them closed up to the time I say open: UNTIL."),
      q("Choose the right word: 'Both Leela ___ her cousin won medals.'", "and", [["or", "conjunction-pair-error"], ["nor", "conjunction-pair-error"], ["but", "conjunction-pair-error"]], "BOTH goes with AND."),
      q("Choose the right word: 'You can choose ___ the red pen or the blue pen.'", "either", [["neither", "conjunction-pair-error"], ["both", "conjunction-pair-error"], ["not", "conjunction-pair-error"]], "OR goes with EITHER: a choice."),
      q("Which sentence means 'Amit did not sing, and Rina did not sing'?", "Neither Amit nor Rina sang.", [["Either Amit or Rina sang.", "conjunction-pair-error"], ["Both Amit and Rina sang.", "conjunction-pair-error"], ["Amit sang, but Rina did not.", "conjunction-meaning-error"]], "Not Amit and not Rina → NEITHER Amit NOR Rina."),
      q("Join the sentences: 'The road was blocked. We took another way.'", "The road was blocked, so we took another way.", [["The road was blocked because we took another way.", "because-so-mixup"], ["Although the road was blocked, so we took another way.", "conjunction-double-error"], ["The road was blocked unless we took another way.", "conjunction-meaning-error"]], "Blocked road → the result: we took another way. SO."),
      q("Which word is a linking word? 'Rahul stayed home because he had a cold.'", "because", [["stayed", "pos-verb-mixup"], ["home", "pos-adverb-mixup"], ["cold", "pos-noun-mixup"]], "BECAUSE joins the two parts of the sentence (and gives the reason)."),
    ],
  },

  // ---------- Reading ----------
  readings: {
    "eq-read-monsoon-garden": {
      name: "The Monsoon Garden",
      author: "Apprec8",
      mode: "fullPassage",
      glossary: {
        compost: "rotted leaves and food scraps that feed the soil",
        shoots: "new young parts of a plant coming out of the ground",
        monsoon: "the rainy season in India",
        patch: "a small piece of ground",
      },
      paragraphs: [
        "Every June, Class 5 at Riverside School planted a garden behind the library. This year, Kavya and her friend Imran wanted to grow both tomatoes and sunflowers. Mr. Das, their teacher, gave them a small patch near the wall because it got the most sunlight.",
        "Before they planted the seeds, the children dug the soil and mixed in compost. Kavya watered the patch while Imran made little holes with a stick. \"Neither the seeds nor the soil should get too dry,\" said Mr. Das, \"so water them every morning.\"",
        "For two weeks, nothing happened. Imran was worried, but Kavya was patient. \"Seeds need time,\" she said. \"We should wait until the first leaves come up.\" Then, one morning, tiny green shoots poked out of the ground.",
        "In July, the monsoon arrived. Although the rain helped the plants, it also brought snails. The snails ate holes in the tomato leaves. Imran wanted to use a spray, but Mr. Das said it could harm the earthworms. Instead, the children picked the snails off by hand and moved them to the bushes near the gate.",
        "By August, the sunflowers were taller than Mr. Das. The tomatoes were small, but they were sweet. When the class held its Garden Day, Kavya and Imran gave away seeds so that other children could grow their own sunflowers.",
      ],
      questions: [
        {
          ...q("Why did Mr. Das give Kavya and Imran the patch near the wall?", "It got the most sunlight.", [["It was close to the library door.", "not-in-passage"], ["It had the softest soil.", "not-in-passage"], ["Nobody else wanted it.", "not-in-passage"]], "The passage says: 'because it got the most sunlight.'"),
          evidence: { paragraph: 0, text: "because it got the most sunlight" },
        },
        {
          ...q("What did the children do FIRST?", "They dug the soil and mixed in compost.", [["They made little holes with a stick.", "sequence"], ["They watered the seeds every morning.", "sequence"], ["They picked snails off the leaves.", "sequence"]], "BEFORE they planted the seeds, they dug the soil and mixed in compost."),
          evidence: { paragraph: 1, text: "Before they planted the seeds, the children dug the soil and mixed in compost." },
        },
        {
          ...q("In 'Kavya watered the patch while Imran made little holes', what does 'while' tell us?", "Both things happened at the same time.", [["Imran made the holes first.", "when-while-mixup"], ["Kavya watered because Imran made holes.", "because-so-mixup"], ["Kavya stopped when Imran started.", "when-while-mixup"]], "WHILE = during the time that: they did both jobs at the same time."),
          evidence: { paragraph: 1, text: "Kavya watered the patch while Imran made little holes with a stick." },
        },
        {
          ...q("The word 'patient' in the passage means ___.", "able to wait calmly", [["feeling very ill", "word-meaning"], ["in a great hurry", "opposite-meaning"], ["very worried and upset", "opposite-meaning"]], "Kavya was calm and happy to wait: 'Seeds need time.' Imran was the worried one."),
          evidence: { paragraph: 2, text: "but Kavya was patient." },
        },
        {
          ...q("Select the INCORRECT statement according to the passage.", "The children sprayed the plants to kill the snails.", [["The snails ate holes in the tomato leaves.", "statement-check"], ["The monsoon arrived in July.", "statement-check"], ["The sunflowers grew taller than Mr. Das.", "statement-check"]], "They did NOT use a spray: they picked the snails off by hand."),
          evidence: { paragraph: 3, text: "Instead, the children picked the snails off by hand" },
        },
        {
          ...q("What can you tell about Kavya from the passage?", "She stays calm and does not give up easily.", [["She does not like sunflowers.", "inference"], ["She was scared of the snails.", "not-in-passage"], ["She wanted to use a spray.", "detail-missed"]], "When nothing grew for two weeks, Kavya stayed calm and said: 'Seeds need time.'"),
          evidence: { paragraph: 2, text: "\"Seeds need time,\" she said." },
        },
        {
          ...q("In 'The tomatoes were small, but they were sweet', why does the writer use 'but'?", "Small and sweet is a surprise, so 'but' joins them.", [["Being small is the reason they were sweet.", "because-so-mixup"], ["It gives a choice between two things.", "conjunction-pair-error"], ["It tells us when something happened.", "time-word-mixup"]], "BUT joins two ideas that are a surprise together: small, but sweet."),
          evidence: { paragraph: 4, text: "The tomatoes were small, but they were sweet." },
        },
      ],
    },
  },
  wordTables: {},

  nodes: [
    unit("eq-u8", 8, "Linking Words"),

    // Topic A: Because, So & Although
    reason,
    withSubtopic(practice("eq-u8-reason-p1", reason, 1, "Because or Because Of?", "medium", [quiz("eq-u8-because-of")]), "because-of"),
    gate("eq-u8-reason-gate", reason, "Reason & Surprise Challenge", "eq-u8-reason-gate-pool", {
      "because-so": "Because or so",
      "because-of": "Because of + a thing",
      "although-but": "Although or but",
    }),
    endless(reason),

    // Topic B: Before, After & While
    time,
    withSubtopic(practice("eq-u8-time-p1", time, 1, "When or While?", "medium", [quiz("eq-u8-when-while")]), "when-while"),
    gate("eq-u8-time-gate", time, "Time Words Challenge", "eq-u8-time-gate-pool", {
      "before-after": "Before or after",
      "when-while": "When or while",
      until: "Until",
    }),
    endless(time),

    // Topic C: Either, Neither & Both
    pairs,
    withSubtopic(practice("eq-u8-pairs-p1", pairs, 1, "Neither or Either?", "medium", [quiz("eq-u8-neither-either")]), "neither-nor"),
    forGrades(practice("eq-u8-pairs-p2", pairs, 2, "Champion: Not Only… But Also", "hard", [quiz("eq-u8-pairs-champion")]), [5, 6, 7, 8, 9, 10, 11, 12]),
    gate("eq-u8-pairs-gate", pairs, "Pairs Challenge", "eq-u8-pairs-gate-pool", {
      "both-and": "Both … and",
      "either-or": "Either … or",
      "neither-nor": "Neither … nor",
    }),
    endless(pairs),

    // Reading & Boss
    u8r,
    boss(
      "eq-u8-boss",
      "eq-u8",
      "Unit 8 Boss",
      "eq-u8-test",
      "Oh no! 👾 The Grammar Gremlin has stolen all the linking words! Sentences are falling apart and stories make no sense. Glue them back together with the right linking words to save the day."
    ),
  ],
};

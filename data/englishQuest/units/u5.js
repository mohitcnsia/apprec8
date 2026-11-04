// data/englishQuest/units/u5.js: Unit 5, Tenses (Claude, 2026-11-05). Classes 3–5; the Champion leaf is one level up (5+).
// Built per docs/CONTENT_GUIDE.md §2–9 and docs/exam/ieo-pattern.md (tenses & aspects, Class 4–5 papers). Original questions.
// Ambiguity rule used throughout: an option that is ALSO grammatical in that sentence is left out (e.g. "took" for a habit,
// "goes" for a timetable future, "will" vs "going to", "already" with the simple past, which is fine in US English).
import { q, study, quiz, reading, unit, main, practice, gate, withSubtopic, endless, boss, forGrades } from "../helpers.js";

// t(): one question with its gate sub-topic
const t = (subtopic, question, correct, wrongs, explanation) => ({ subtopic, ...q(question, correct, wrongs, explanation) });

const simple = main("eq-u5-simple", "eq-u5", 0, "Present or Past?", [study("eq-u5-simple"), quiz("eq-u5-simple-quiz")]);
const cont = main("eq-u5-cont", "eq-u5", 1, "Happening Now", [study("eq-u5-cont"), quiz("eq-u5-cont-quiz")]);
const future = main("eq-u5-future", "eq-u5", 2, "Will & Going to", [study("eq-u5-future"), quiz("eq-u5-future-quiz")]);
const perfect = main("eq-u5-perfect", "eq-u5", 3, "Have Done", [study("eq-u5-perfect"), quiz("eq-u5-perfect-quiz")]);
const u5r = main("eq-u5-reading", "eq-u5", 4, "Reading: Meera's Kite", [reading("eq-read-meera-kite")]);

export default {
  // ---------- Study Pages ----------
  studyPages: {
    "eq-u5-simple": {
      name: "Every Day or Yesterday?",
      author: "Apprec8",
      content: `### ⏰ A verb tells us WHEN

The **tense** of a verb tells us *when* something happens.

---

### 🔁 Simple present: habits and facts

| Use it for | Example |
|---|---|
| Things you do again and again | I **brush** my teeth every night. |
| Facts that are always true | The sun **rises** in the east. |

> ⚠️ With **he, she, it** or one person or thing, add **-s** or **-es**: she **plays**, he **watches**, it **goes**.

---

### ⏪ Simple past: finished actions

Clue words: **yesterday, last week, ago, in 2020**.

| Regular: add -ed | Irregular: a new word |
|---|---|
| walk → **walked** | go → **went** |
| play → **played** | eat → **ate** |
| cry → **cried** | see → **saw** |
| stop → **stopped** | write → **wrote** |

More irregular verbs: fly → **flew**, catch → **caught**, buy → **bought**, sing → **sang**, swim → **swam**, tell → **told**.

> ⚠️ There is no "goed", "eated" or "catched"!

---

### ❓ Questions and "not" with DID

After **did**, the verb goes back to its **base form**.

| ✅ Right | ❌ Wrong |
|---|---|
| **Did** you **go** to school? | Did you went to school? |
| She **did not eat** lunch. | She did not ate lunch. |

> 💡 DID already shows the past, so the verb does not need to.

---

### 🎯 Now you can…
- use the simple present for habits and facts
- use the simple past for finished actions
- ask questions with **did** + base form`,
    },
    "eq-u5-cont": {
      name: "Happening Now",
      author: "Apprec8",
      content: `### 🎬 In the middle of an action

The **continuous** tense shows an action that is *still going on*.

---

### ▶️ Present continuous: right now

**am / is / are + verb-ing**

| Subject | Example |
|---|---|
| I | I **am reading**. |
| he, she, it, one name | Riya **is dancing**. |
| we, you, they, many | The boys **are playing**. |

Clue words: **now, right now, Look!, Listen!, at the moment**.

---

### ⏸️ Past continuous: in the middle, in the past

**was / were + verb-ing**

- I **was sleeping** when the phone rang.
- They **were playing** when it started to rain.

> 💡 The long action uses **was/were + -ing**. The short action that interrupts it uses the simple past: *when the phone **rang***.

---

### ✋ Words that do not like -ing

Some verbs talk about what we **know, like, want or have**. We do not use them with -ing:

| ✅ Right | ❌ Wrong |
|---|---|
| I **know** the answer. | I am knowing the answer. |
| She **likes** mangoes. | She is liking mangoes. |
| This bag **belongs** to me. | This bag is belonging to me. |

---

### ✏️ Spelling with -ing
- make → **making** (drop the e)
- run → **running**, swim → **swimming** (double the last letter)

---

### 🎯 Now you can…
- use **am/is/are + -ing** for now
- use **was/were + -ing** for the past
- keep *know, like, want, need, belong* without -ing`,
    },
    "eq-u5-future": {
      name: "Will and Going To",
      author: "Apprec8",
      content: `### 🔮 Talking about tomorrow

---

### 1️⃣ WILL + base form

The same for everyone: I **will go**, she **will go**, they **will go**.

| ✅ Right | ❌ Wrong |
|---|---|
| She **will help** you. | She will helps you. |
| We **will win**! | We will winning! |

---

### 2️⃣ AM / IS / ARE + GOING TO + base form

For plans, and when we can *see* something coming.

| Subject | Example |
|---|---|
| I | I **am going to** paint. |
| he, she, it | It **is going to** rain. |
| we, you, they | We **are going to** visit Nani. |

> ⚠️ Never leave out am/is/are: ~~She going to dance~~ → She **is going to** dance.

---

### 🕵️ Clue words tell you the tense

| Clue | Tense |
|---|---|
| every day, always, usually | simple present |
| now, Look!, Listen! | present continuous |
| yesterday, ago, last week | simple past |
| tomorrow, next week, soon | future |

---

### 🎯 Now you can…
- use **will + base form**
- use **am/is/are going to + base form**
- pick the tense from the clue words`,
    },
    "eq-u5-perfect": {
      name: "Have Done",
      author: "Apprec8",
      content: `### ✅ Done, and it matters now

**has / have + past participle**

- I **have finished** my homework. (So now I can play!)
- She **has lost** her pencil. (She still does not have it.)

---

### 🤝 HAS or HAVE?

| has | have |
|---|---|
| he, she, it, one name | I, you, we, they, many |
| Ravi **has** eaten. | The girls **have** eaten. |

---

### 📚 Past participles (the third form)

| Verb | Past | Past participle |
|---|---|---|
| go | went | **gone** |
| eat | ate | **eaten** |
| see | saw | **seen** |
| write | wrote | **written** |
| do | did | **done** |
| sing | sang | **sung** |
| drink | drank | **drunk** |
| win | won | **won** |

---

### ⏳ SINCE or FOR?
- **since** + the starting point: since Monday, since 2019, since I was six
- **for** + how long: for two days, for an hour, for ten years

---

### ⚠️ Not with a finished time!

With **yesterday, last week, ago**, use the simple past:

| ✅ Right | ❌ Wrong |
|---|---|
| I **saw** a peacock yesterday. | I have seen a peacock yesterday. |

---

### 🏆 Champion level: two more

- **had + past participle**: the *earlier* of two past actions. *The train **had left** when we reached.*
- **has/have been + -ing**: started in the past and still going on. *It **has been raining** for three days.*

---

### 🎯 Now you can…
- use **has/have + past participle**
- choose **since** or **for**
- use the simple past with *yesterday* and *ago*`,
    },
  },

  // ---------- Quizzes ----------
  quizzes: {
    // Topic A: Present or Past? (practice, 8)
    "eq-u5-simple-quiz": [
      t("simple-present", "Complete the sentence: 'Every Sunday, Arjun ___ his bicycle.'", "cleans", [["clean", "sva-number-error"], ["cleaning", "tense-form-error"], ["is clean", "tense-form-error"]], "Every Sunday is a habit, so we use the simple present. Arjun is one person, so add -s: CLEANS."),
      t("simple-present", "Pick the right verb: 'The sun ___ in the east.'", "rises", [["rise", "sva-number-error"], ["rising", "tense-form-error"], ["are rise", "tense-form-error"]], "This is a fact that is always true, so we use the simple present. The sun is one thing: RISES."),
      t("simple-past", "Complete the sentence: 'Yesterday, Meera ___ a kite in the park.'", "flew", [["flies", "tense-present-past-mixup"], ["fly", "tense-present-past-mixup"], ["flied", "tense-form-error"]], "Yesterday means the past. FLY is irregular: its past is FLEW (never 'flied')."),
      t("simple-past", "Pick the right verb: 'Last week, we ___ a film about tigers.'", "watched", [["watch", "tense-present-past-mixup"], ["watches", "tense-present-past-mixup"], ["watching", "tense-form-error"]], "Last week is finished, so we use the simple past: watch + ed = WATCHED."),
      t("simple-past", "Complete the sentence: 'Two days ago, Kabir ___ his tiffin at home.'", "forgot", [["forgets", "tense-present-past-mixup"], ["forget", "tense-present-past-mixup"], ["forgetted", "tense-form-error"]], "AGO tells us it is the past. FORGET is irregular: its past is FORGOT."),
      t("did-questions", "Which word fits? 'Did you ___ the new library?'", "visit", [["visited", "did-base-form-error"], ["visits", "did-base-form-error"], ["visiting", "tense-form-error"]], "After DID, the verb goes back to its base form: Did you VISIT…? DID already shows the past."),
      t("did-questions", "Complete the sentence: 'Sana did not ___ the bus this morning.'", "miss", [["missed", "did-base-form-error"], ["misses", "did-base-form-error"], ["missing", "tense-form-error"]], "DID NOT + base form: Sana did not MISS the bus."),
      t("simple-present", "Pick the right verb: 'Right now, my brother ___ in Class 6.'", "is", [["was", "tense-present-past-mixup"], ["were", "tense-present-past-mixup"], ["be", "tense-form-error"]], "Right now means the present. My brother is one person: he IS in Class 6."),
    ],
    // Practice leaf: Irregular past words (8)
    "eq-u5-simple-irregular": [
      t("simple-past", "Complete the sentence: 'Last night, Dadi ___ us a funny story.'", "told", [["telled", "tense-form-error"], ["tells", "tense-present-past-mixup"], ["tell", "tense-present-past-mixup"]], "TELL is irregular: the past is TOLD."),
      t("simple-past", "Pick the right verb: 'Yesterday, Rohan ___ a big fish in the river.'", "caught", [["catched", "tense-form-error"], ["catches", "tense-present-past-mixup"], ["catch", "tense-present-past-mixup"]], "CATCH is irregular: the past is CAUGHT (never 'catched')."),
      t("simple-past", "Complete the sentence: 'Last summer, my family ___ to Shimla.'", "went", [["goed", "tense-form-error"], ["goes", "tense-present-past-mixup"], ["gone", "participle-form-error"]], "GO is irregular: the past is WENT. GONE needs has or have in front: has gone."),
      t("simple-past", "Pick the right verb: 'This morning, the baby ___ a whole glass of milk.'", "drank", [["drinked", "tense-form-error"], ["drinks", "tense-present-past-mixup"], ["drunk", "participle-form-error"]], "DRINK → DRANK (past). DRUNK is the third form and needs has or have: has drunk."),
      t("simple-past", "Complete the sentence: 'On Monday, Ishaan ___ his grandmother a card.'", "sent", [["sended", "tense-form-error"], ["sends", "tense-present-past-mixup"], ["send", "tense-present-past-mixup"]], "SEND is irregular: the past is SENT."),
      t("simple-past", "Pick the right verb: 'Last year, our school ___ a new library.'", "built", [["builded", "tense-form-error"], ["builds", "tense-present-past-mixup"], ["build", "tense-present-past-mixup"]], "BUILD is irregular: the past is BUILT."),
      t("simple-past", "Complete the sentence: 'At the party last night, the children ___ songs.'", "sang", [["sung", "participle-form-error"], ["singed", "tense-form-error"], ["sings", "tense-present-past-mixup"]], "SING → SANG (past) → SUNG (needs has or have)."),
      t("simple-past", "Pick the right verb: 'This morning, I ___ my keys under the sofa.'", "found", [["finded", "tense-form-error"], ["find", "tense-present-past-mixup"], ["founded", "tense-form-error"]], "FIND → FOUND. (FOUNDED is a different verb: to start a school or a company.)"),
    ],
    // Gate pool (15): simple-present × 5, simple-past × 5, did-questions × 5
    "eq-u5-simple-gate-pool": [
      t("simple-present", "Complete the sentence: 'My sister ___ the guitar very well.'", "plays", [["play", "sva-number-error"], ["playing", "tense-form-error"], ["are play", "tense-form-error"]], "My sister is one person, so the verb takes -s: PLAYS."),
      t("simple-present", "Complete the sentence: 'Cows ___ grass.'", "eat", [["eats", "sva-number-error"], ["eating", "tense-form-error"], ["is eat", "tense-form-error"]], "Cows are many, so NO -s: cows EAT."),
      t("simple-present", "Complete the sentence: 'The shop ___ at nine every morning.'", "opens", [["open", "sva-number-error"], ["opening", "tense-form-error"], ["have open", "tense-form-error"]], "Every morning is a habit. The shop is one thing: OPENS."),
      t("simple-present", "Complete the sentence: 'Mum and Dad ___ tea every evening.'", "drink", [["drinks", "sva-number-error"], ["drinking", "tense-form-error"], ["is drink", "tense-form-error"]], "Mum AND Dad are two people, so no -s: they DRINK."),
      t("simple-present", "Which sentence is correct?", "She goes to dance class on Fridays.", [["She go to dance class on Fridays.", "sva-number-error"], ["She going to dance class on Fridays.", "tense-form-error"], ["She gos to dance class on Fridays.", "tense-form-error"]], "SHE + simple present takes -es here: go → GOES."),
      t("simple-past", "Complete the sentence: 'Last Diwali, Nani ___ sweets for everyone.'", "made", [["maked", "tense-form-error"], ["makes", "tense-present-past-mixup"], ["make", "tense-present-past-mixup"]], "Last Diwali is the past. MAKE → MADE."),
      t("simple-past", "Complete the sentence: 'The thief ___ away when he saw the police.'", "ran", [["runned", "tense-form-error"], ["runs", "tense-present-past-mixup"], ["run", "tense-present-past-mixup"]], "SAW shows the story is in the past. RUN → RAN."),
      t("simple-past", "Complete the sentence: 'Yesterday, I ___ my homework before dinner.'", "did", [["done", "participle-form-error"], ["do", "tense-present-past-mixup"], ["does", "tense-present-past-mixup"]], "Yesterday → past: DO → DID. DONE needs has or have."),
      t("simple-past", "Fill in both blanks: 'Last week, Priya ___ a book and ___ it to her friend.'", "bought, gave", [["buys, gives", "tense-present-past-mixup"], ["buyed, gived", "tense-form-error"], ["bought, gives", "tense-present-past-mixup"]], "Both actions happened last week: BUY → BOUGHT, GIVE → GAVE."),
      t("simple-past", "Which word is the past form of teach?", "taught", [["teached", "tense-form-error"], ["teaches", "tense-present-past-mixup"], ["tought", "tense-form-error"]], "TEACH is irregular: the past is TAUGHT (t-a-u-g-h-t)."),
      t("did-questions", "Complete the question: 'Did Rahul ___ the match on Sunday?'", "win", [["won", "did-base-form-error"], ["wins", "did-base-form-error"], ["winning", "tense-form-error"]], "After DID, use the base form: Did Rahul WIN?"),
      t("did-questions", "Complete the sentence: 'We did not ___ any noise in the library.'", "make", [["made", "did-base-form-error"], ["makes", "did-base-form-error"], ["making", "tense-form-error"]], "DID NOT + base form: we did not MAKE any noise."),
      t("did-questions", "Which question is correct?", "Where did you go yesterday?", [["Where did you went yesterday?", "did-base-form-error"], ["Where you went yesterday?", "did-base-form-error"], ["Where did you goes yesterday?", "did-base-form-error"]], "A past question needs DID + base form: Where did you GO?"),
      t("did-questions", "Which sentence is correct?", "Aman did not finish his lunch.", [["Aman did not finished his lunch.", "did-base-form-error"], ["Aman not finished his lunch.", "did-base-form-error"], ["Aman does not finished his lunch.", "did-base-form-error"]], "DID NOT + base form: did not FINISH."),
      t("did-questions", "Which word fits? '___ your mother cook this kheer yesterday?'", "Did", [["Does", "tense-present-past-mixup"], ["Do", "tense-present-past-mixup"], ["Done", "participle-form-error"]], "Yesterday → past question → DID."),
    ],

    // Topic B: Happening Now (practice, 8)
    "eq-u5-cont-quiz": [
      t("present-continuous", "Complete the sentence: 'Look! The monkey ___ a banana.'", "is eating", [["eats", "tense-continuous-mixup"], ["are eating", "sva-number-error"], ["eating", "tense-form-error"]], "LOOK! means it is happening now: IS + EATING. One monkey → IS."),
      t("present-continuous", "Pick the right verb: 'Please be quiet. The baby ___.'", "is sleeping", [["sleeps", "tense-continuous-mixup"], ["are sleeping", "sva-number-error"], ["sleep", "tense-continuous-mixup"]], "The baby is asleep right now, so we use IS SLEEPING."),
      t("present-continuous", "Complete the sentence: 'Right now, the girls ___ in the pool.'", "are swimming", [["is swimming", "sva-number-error"], ["swims", "tense-continuous-mixup"], ["are swiming", "tense-form-error"]], "Girls are many → ARE. SWIM doubles the m: SWIMMING."),
      t("past-continuous", "Complete the sentence: 'At eight last night, I ___ my homework.'", "was doing", [["were doing", "sva-number-error"], ["am doing", "tense-present-past-mixup"], ["did doing", "tense-form-error"]], "At eight LAST NIGHT, the action was going on in the past: I WAS DOING."),
      t("past-continuous", "Pick the right verb: 'We ___ cricket when it started to rain.'", "were playing", [["was playing", "sva-number-error"], ["are playing", "tense-present-past-mixup"], ["plays", "tense-continuous-mixup"]], "The long action (playing) was going on when the rain started. WE → WERE PLAYING."),
      t("past-continuous", "Complete the sentence: 'When the bell rang, Mira ___ a picture.'", "was drawing", [["is drawing", "tense-present-past-mixup"], ["were drawing", "sva-number-error"], ["draws", "tense-present-past-mixup"]], "Mira was in the middle of drawing when the bell rang: WAS DRAWING."),
      t("simple-or-continuous", "Pick the right verb: 'I ___ the answer to this riddle.'", "know", [["am knowing", "stative-verb-error"], ["knows", "sva-number-error"], ["knowing", "tense-form-error"]], "KNOW does not take -ing. We say I KNOW, not 'I am knowing'."),
      t("simple-or-continuous", "Complete the sentence: 'This bag ___ to my brother.'", "belongs", [["is belonging", "stative-verb-error"], ["belong", "sva-number-error"], ["belonging", "tense-form-error"]], "BELONG does not take -ing. The bag is one thing: it BELONGS."),
    ],
    // Practice leaf: Was or were? (8)
    "eq-u5-cont-was-were": [
      t("past-continuous", "Which word fits? 'Yesterday at noon, the boys ___ running in the corridor.'", "were", [["was", "sva-number-error"], ["is", "tense-present-past-mixup"], ["are", "tense-present-past-mixup"]], "Yesterday → past. The boys are many → WERE."),
      t("past-continuous", "Which word fits? 'At five yesterday, my mother ___ cooking dinner.'", "was", [["were", "sva-number-error"], ["is", "tense-present-past-mixup"], ["are", "tense-present-past-mixup"]], "My mother is one person, and it was yesterday → WAS."),
      t("past-continuous", "Which word fits? 'When the lights went off, we ___ watching a cartoon.'", "were", [["was", "sva-number-error"], ["are", "tense-present-past-mixup"], ["is", "tense-present-past-mixup"]], "WE always takes WERE in the past."),
      t("past-continuous", "Which word fits? 'Last night at ten, I ___ reading a story.'", "was", [["were", "sva-number-error"], ["am", "tense-present-past-mixup"], ["is", "tense-present-past-mixup"]], "I takes WAS in the past: I was reading."),
      t("past-continuous", "Which word fits? 'When Papa came home, the twins ___ sleeping.'", "were", [["was", "sva-number-error"], ["are", "tense-present-past-mixup"], ["is", "tense-present-past-mixup"]], "The twins are two → WERE."),
      t("past-continuous", "Which word fits? 'At noon yesterday, the sun ___ shining brightly.'", "was", [["were", "sva-number-error"], ["is", "tense-present-past-mixup"], ["are", "tense-present-past-mixup"]], "The sun is one thing, and it was yesterday → WAS."),
      t("past-continuous", "Which word fits? 'When I saw Tara, she ___ waiting for the bus.'", "was", [["were", "sva-number-error"], ["is", "tense-present-past-mixup"], ["are", "tense-present-past-mixup"]], "SAW is past, and SHE takes WAS."),
      t("past-continuous", "Which word fits? 'What ___ you doing at seven yesterday morning?'", "were", [["was", "sva-number-error"], ["are", "tense-present-past-mixup"], ["is", "tense-present-past-mixup"]], "YOU always takes WERE in the past, even for one person."),
    ],
    // Gate pool (15): present-continuous × 5, past-continuous × 5, simple-or-continuous × 5
    "eq-u5-cont-gate-pool": [
      t("present-continuous", "Complete the sentence: 'Listen! Somebody ___ at the door.'", "is knocking", [["knocks", "tense-continuous-mixup"], ["are knocking", "sva-number-error"], ["knocking", "tense-form-error"]], "LISTEN! → happening now. Somebody is one person → IS KNOCKING."),
      t("present-continuous", "Complete the sentence: 'Shh! Grandpa ___ the news on the radio.'", "is listening to", [["listens to", "tense-continuous-mixup"], ["are listening to", "sva-number-error"], ["listening to", "tense-form-error"]], "SHH! means it is happening now: Grandpa IS LISTENING."),
      t("present-continuous", "Which sentence is correct?", "The children are making a sandcastle now.", [["The children is making a sandcastle now.", "sva-number-error"], ["The children making a sandcastle now.", "tense-form-error"], ["The children are make a sandcastle now.", "tense-form-error"]], "Children are many → ARE + MAKING."),
      t("present-continuous", "Complete the sentence: 'Hurry up! Everyone ___ for us in the car.'", "is waiting", [["waits", "tense-continuous-mixup"], ["are waiting", "sva-number-error"], ["waiting", "tense-form-error"]], "EVERYONE takes a singular verb: everyone IS waiting."),
      t("present-continuous", "Fill in both blanks: 'Look! Riya ___ and her brothers ___.'", "is dancing, are singing", [["are dancing, is singing", "sva-number-error"], ["dances, sings", "tense-continuous-mixup"], ["is dance, are sing", "tense-form-error"]], "Riya (one) IS dancing; her brothers (many) ARE singing."),
      t("past-continuous", "Complete the sentence: 'I ___ to music when the phone rang.'", "was listening", [["were listening", "sva-number-error"], ["am listening", "tense-present-past-mixup"], ["listen", "tense-present-past-mixup"]], "The long action was going on when the phone rang: I WAS LISTENING."),
      t("past-continuous", "Which sentence is correct?", "They were flying kites when the wind stopped.", [["They was flying kites when the wind stopped.", "sva-number-error"], ["They were fly kites when the wind stopped.", "tense-form-error"], ["They are flying kites when the wind stopped.", "tense-present-past-mixup"]], "THEY → WERE + FLYING (past continuous)."),
      t("past-continuous", "Complete the sentence: 'While Nisha ___ her teeth, the lights went out.'", "was brushing", [["is brushing", "tense-present-past-mixup"], ["were brushing", "sva-number-error"], ["brushes", "tense-present-past-mixup"]], "WHILE + the long action in the past: Nisha WAS BRUSHING."),
      t("past-continuous", "Complete the sentence: 'At this time yesterday, we ___ in the school bus.'", "were travelling", [["was travelling", "sva-number-error"], ["are travelling", "tense-present-past-mixup"], ["travel", "tense-present-past-mixup"]], "At this time YESTERDAY → past continuous. WE → WERE."),
      t("past-continuous", "Complete the sentence: 'The dog ___ loudly all night, so nobody slept.'", "was barking", [["were barking", "sva-number-error"], ["is barking", "tense-present-past-mixup"], ["barks", "tense-present-past-mixup"]], "SLEPT shows the past. The dog is one → WAS BARKING."),
      t("simple-or-continuous", "Complete the sentence: 'I ___ chocolate ice cream very much.'", "like", [["am liking", "stative-verb-error"], ["likes", "sva-number-error"], ["liking", "tense-form-error"]], "LIKE does not take -ing: I LIKE it very much."),
      t("simple-or-continuous", "Complete the sentence: 'Every evening, Nani ___ the plants.'", "waters", [["is watering", "tense-continuous-mixup"], ["water", "sva-number-error"], ["watering", "tense-form-error"]], "EVERY EVENING is a habit → simple present: Nani WATERS."),
      t("simple-or-continuous", "Complete the sentence: 'Look! Your bus ___ round the corner.'", "is coming", [["comes", "tense-continuous-mixup"], ["come", "tense-continuous-mixup"], ["are coming", "sva-number-error"]], "LOOK! → happening now: IS COMING."),
      t("simple-or-continuous", "Complete the sentence: 'We ___ a new puppy. His name is Bholu.'", "have", [["are having", "stative-verb-error"], ["has", "sva-number-error"], ["having", "tense-form-error"]], "HAVE (to own) does not take -ing: we HAVE a puppy."),
      t("simple-or-continuous", "Which sentence is correct?", "She needs a pencil for the test.", [["She is needing a pencil for the test.", "stative-verb-error"], ["She need a pencil for the test.", "sva-number-error"], ["She needing a pencil for the test.", "tense-form-error"]], "NEED does not take -ing. SHE → NEEDS."),
    ],

    // Topic C: Will & Going to (practice, 8)
    "eq-u5-future-quiz": [
      t("will-future", "Complete the sentence: 'Tomorrow, my aunt ___ us at the station.'", "will meet", [["will meets", "tense-future-form-error"], ["will meeting", "tense-future-form-error"], ["met", "time-word-mixup"]], "WILL + base form: will MEET. Never 'will meets'."),
      t("will-future", "Pick the right verb: 'Do not worry. I ___ you with your project.'", "will help", [["will helps", "tense-future-form-error"], ["will helping", "tense-future-form-error"], ["helped", "time-word-mixup"]], "A promise for later: I WILL HELP."),
      t("going-to-form", "Complete the sentence: 'Look at those dark clouds! It ___ rain.'", "is going to", [["are going to", "sva-number-error"], ["going to", "tense-future-form-error"], ["is going", "tense-future-form-error"]], "We can SEE the rain coming: IT IS GOING TO rain."),
      t("going-to-form", "Pick the right words: 'We ___ visit the zoo next Sunday.'", "are going to", [["is going to", "sva-number-error"], ["going to", "tense-future-form-error"], ["are go to", "tense-future-form-error"]], "WE → ARE going to."),
      t("going-to-form", "Which word fits? 'Sameer is going to ___ in the school band next month.'", "play", [["plays", "tense-future-form-error"], ["played", "tense-future-form-error"], ["playing", "tense-future-form-error"]], "GOING TO + base form: going to PLAY."),
      t("time-words", "Complete the sentence: 'Next year, my sister ___ to college.'", "will go", [["went", "time-word-mixup"], ["has gone", "time-word-mixup"], ["was going", "time-word-mixup"]], "NEXT YEAR → future: WILL GO."),
      t("time-words", "Which word shows that something will happen in the future?", "tomorrow", [["yesterday", "time-word-mixup"], ["ago", "time-word-mixup"], ["last", "time-word-mixup"]], "TOMORROW is a future clue. Yesterday, ago and last are past clues."),
      t("time-words", "Pick the right verb: 'Ravi ___ his cousin last Saturday.'", "met", [["will meet", "time-word-mixup"], ["is meeting", "time-word-mixup"], ["meets", "time-word-mixup"]], "LAST Saturday → simple past: MEET → MET."),
    ],
    // Practice leaf: Clue words (8)
    "eq-u5-future-clues": [
      t("time-words", "Complete the sentence: 'Three years ago, we ___ in Lucknow.'", "lived", [["will live", "time-word-mixup"], ["are living", "time-word-mixup"], ["live", "time-word-mixup"]], "AGO → simple past: LIVED."),
      t("time-words", "Pick the right verb: 'Tomorrow, the shops ___ closed for the festival.'", "will be", [["were", "time-word-mixup"], ["was", "time-word-mixup"], ["have been", "time-word-mixup"]], "TOMORROW → future: WILL BE."),
      t("time-words", "Complete the sentence: 'Look! The kitten ___ with the wool.'", "is playing", [["played", "time-word-mixup"], ["will play", "time-word-mixup"], ["plays", "tense-continuous-mixup"]], "LOOK! → happening now: IS PLAYING."),
      t("time-words", "Pick the right verb: 'My cousin usually ___ to school by bus.'", "goes", [["is going", "tense-continuous-mixup"], ["will going", "tense-future-form-error"], ["going", "tense-form-error"]], "USUALLY → a habit → simple present: GOES."),
      t("time-words", "Complete the sentence: 'Last Monday, our class ___ a trip to the museum.'", "took", [["will take", "time-word-mixup"], ["takes", "time-word-mixup"], ["is taking", "time-word-mixup"]], "LAST Monday → simple past: TAKE → TOOK."),
      t("time-words", "Pick the right verb: 'Next month, Dadi ___ seventy years old.'", "will be", [["was", "time-word-mixup"], ["is being", "tense-form-error"], ["has been", "time-word-mixup"]], "NEXT MONTH → future: WILL BE."),
      t("time-words", "Complete the sentence: 'In 2010, my parents ___ to Pune.'", "moved", [["will move", "time-word-mixup"], ["move", "time-word-mixup"], ["are moving", "time-word-mixup"]], "2010 is a finished time in the past → MOVED."),
      t("time-words", "Which words tell us that an action is happening at this moment?", "right now", [["last week", "time-word-mixup"], ["every day", "time-word-mixup"], ["next year", "time-word-mixup"]], "RIGHT NOW means at this moment → present continuous."),
    ],
    // Gate pool (15): will-future × 5, going-to-form × 5, time-words × 5
    "eq-u5-future-gate-pool": [
      t("will-future", "Complete the sentence: 'I think our team ___ the match tomorrow.'", "will win", [["will wins", "tense-future-form-error"], ["win", "tense-future-form-error"], ["won", "time-word-mixup"]], "TOMORROW → WILL + base form: WILL WIN."),
      t("will-future", "Which sentence is correct?", "She will call you after lunch.", [["She will calls you after lunch.", "tense-future-form-error"], ["She will calling you after lunch.", "tense-future-form-error"], ["She wills call you after lunch.", "tense-future-form-error"]], "WILL never changes, and the verb after it is the base form: will CALL."),
      t("will-future", "Complete the sentence: 'The plants ___ if you do not water them.'", "will die", [["will dies", "tense-future-form-error"], ["died", "time-word-mixup"], ["dying", "tense-form-error"]], "What happens later: the plants WILL DIE."),
      t("will-future", "Complete the sentence: 'Wait here. I ___ back in five minutes.'", "will be", [["will is", "tense-future-form-error"], ["am be", "tense-form-error"], ["was", "time-word-mixup"]], "In five minutes → future: I WILL BE back."),
      t("will-future", "Fill in both blanks: 'Tomorrow, Papa ___ the car and Mummy ___ the food.'", "will drive, will pack", [["will drives, will packs", "tense-future-form-error"], ["drove, packed", "time-word-mixup"], ["will driving, will packing", "tense-future-form-error"]], "TOMORROW → WILL + base form for both: will drive, will pack."),
      t("going-to-form", "Complete the sentence: 'Be careful! That glass ___ fall.'", "is going to", [["are going to", "sva-number-error"], ["going to", "tense-future-form-error"], ["is go to", "tense-future-form-error"]], "We can see it about to fall: the glass (one) IS GOING TO fall."),
      t("going-to-form", "Complete the sentence: 'They ___ build a new bridge over the river.'", "are going to", [["is going to", "sva-number-error"], ["going to", "tense-future-form-error"], ["am going to", "sva-number-error"]], "THEY → ARE going to."),
      t("going-to-form", "Which sentence is correct?", "I am going to learn the flute this summer.", [["I is going to learn the flute this summer.", "sva-number-error"], ["I am going to learning the flute this summer.", "tense-future-form-error"], ["I going to learn the flute this summer.", "tense-future-form-error"]], "I → AM going to + base form: learn."),
      t("going-to-form", "Complete the sentence: 'Rina has bought paint. She ___ paint her room.'", "is going to", [["are going to", "sva-number-error"], ["going to", "tense-future-form-error"], ["will going to", "tense-future-form-error"]], "A plan: SHE IS GOING TO paint her room."),
      t("going-to-form", "Complete the question: 'Are you going to ___ the cake now?'", "cut", [["cuts", "tense-future-form-error"], ["cutting", "tense-future-form-error"], ["cutted", "tense-form-error"]], "GOING TO + base form: going to CUT."),
      t("time-words", "Complete the sentence: 'Two hours ago, the train ___ the station.'", "left", [["will leave", "time-word-mixup"], ["leaves", "time-word-mixup"], ["is leaving", "time-word-mixup"]], "AGO → past: LEAVE → LEFT."),
      t("time-words", "Complete the sentence: 'Next week, our school ___ Sports Day.'", "will celebrate", [["celebrated", "time-word-mixup"], ["has celebrated", "time-word-mixup"], ["was celebrating", "time-word-mixup"]], "NEXT WEEK → future: WILL CELEBRATE."),
      t("time-words", "Complete the sentence: 'Listen! The birds ___.'", "are singing", [["sang", "time-word-mixup"], ["will sing", "time-word-mixup"], ["is singing", "sva-number-error"]], "LISTEN! → now. Birds are many → ARE SINGING."),
      t("time-words", "Which sentence uses the right tense?", "Yesterday I visited my aunt.", [["Yesterday I will visit my aunt.", "time-word-mixup"], ["Yesterday I am visiting my aunt.", "time-word-mixup"], ["Yesterday I visit my aunt.", "time-word-mixup"]], "YESTERDAY → simple past: VISITED."),
      t("time-words", "Which word fits? 'We will go to the fair ___.'", "tomorrow", [["yesterday", "time-word-mixup"], ["last night", "time-word-mixup"], ["ago", "time-word-mixup"]], "WILL GO is future, so the clue must be future: TOMORROW."),
    ],

    // Topic D: Have Done (practice, 8)
    "eq-u5-perfect-quiz": [
      t("has-have", "Which word fits? 'Priya ___ finished her drawing.'", "has", [["have", "sva-number-error"], ["is", "tense-perfect-mixup"], ["are", "tense-perfect-mixup"]], "Priya is one person → HAS + past participle."),
      t("has-have", "Which word fits? 'The children ___ gone to the playground.'", "have", [["has", "sva-number-error"], ["is", "tense-perfect-mixup"], ["was", "tense-perfect-mixup"]], "Children are many → HAVE gone."),
      t("past-participle", "Complete the sentence: 'I have ___ this film three times.'", "seen", [["saw", "participle-form-error"], ["see", "participle-form-error"], ["seed", "tense-form-error"]], "HAVE + third form: see → saw → SEEN."),
      t("past-participle", "Complete the sentence: 'Mohan has ___ a letter to the principal.'", "written", [["wrote", "participle-form-error"], ["writed", "tense-form-error"], ["writes", "participle-form-error"]], "HAS + third form: write → wrote → WRITTEN."),
      t("past-participle", "Complete the question: 'Have you ever ___ a camel?'", "ridden", [["rode", "participle-form-error"], ["ride", "participle-form-error"], ["rided", "tense-form-error"]], "HAVE + third form: ride → rode → RIDDEN."),
      t("perfect-or-past", "Complete the sentence: 'We ___ in this house since 2019.'", "have lived", [["lived", "tense-perfect-mixup"], ["live", "tense-perfect-mixup"], ["are living", "tense-perfect-mixup"]], "SINCE 2019 and still living here → HAVE LIVED."),
      t("perfect-or-past", "Complete the sentence: 'Rani ___ her bag yesterday.'", "lost", [["has lost", "tense-perfect-mixup"], ["have lost", "tense-perfect-mixup"], ["loses", "time-word-mixup"]], "YESTERDAY is a finished time → simple past: LOST (not 'has lost')."),
      t("perfect-or-past", "Which word fits? 'My uncle has worked in Chennai ___ ten years.'", "for", [["since", "since-for-mixup"], ["from", "since-for-mixup"], ["ago", "since-for-mixup"]], "Ten years is HOW LONG → FOR. (SINCE is for a starting point, like since 2015.)"),
    ],
    // Practice leaf: Since or for? (8)
    "eq-u5-perfect-since-for": [
      t("perfect-or-past", "Which word fits? 'Neha has played the sitar ___ she was six.'", "since", [["for", "since-for-mixup"], ["from", "since-for-mixup"], ["ago", "since-for-mixup"]], "'She was six' is the STARTING POINT → SINCE."),
      t("perfect-or-past", "Which word fits? 'We have waited here ___ two hours.'", "for", [["since", "since-for-mixup"], ["from", "since-for-mixup"], ["ago", "since-for-mixup"]], "Two hours is HOW LONG → FOR."),
      t("perfect-or-past", "Which word fits? 'The shop has been closed ___ Monday.'", "since", [["for", "since-for-mixup"], ["ago", "since-for-mixup"], ["during", "since-for-mixup"]], "Monday is the STARTING POINT → SINCE."),
      t("perfect-or-past", "Which word fits? 'Arun has lived in Goa ___ a long time.'", "for", [["since", "since-for-mixup"], ["ago", "since-for-mixup"], ["from", "since-for-mixup"]], "A long time is HOW LONG → FOR."),
      t("perfect-or-past", "Which word fits? 'I have not seen Meena ___ last Diwali.'", "since", [["for", "since-for-mixup"], ["ago", "since-for-mixup"], ["during", "since-for-mixup"]], "Last Diwali is the STARTING POINT → SINCE."),
      t("perfect-or-past", "Complete the sentence: 'Rohit ___ his arm last week.'", "broke", [["has broken", "tense-perfect-mixup"], ["have broken", "tense-perfect-mixup"], ["breaks", "time-word-mixup"]], "LAST WEEK is finished → simple past: BROKE."),
      t("perfect-or-past", "Complete the sentence: 'My father ___ to Japan two years ago.'", "went", [["has gone", "tense-perfect-mixup"], ["has been", "tense-perfect-mixup"], ["goes", "time-word-mixup"]], "AGO → simple past: WENT."),
      t("perfect-or-past", "Which sentence is correct?", "I have finished my homework.", [["I have finished my homework yesterday.", "tense-perfect-mixup"], ["I has finished my homework.", "sva-number-error"], ["I have finish my homework.", "participle-form-error"]], "HAVE + FINISHED is right, but not with YESTERDAY (then: I finished it yesterday)."),
    ],
    // Champion leaf (Class 5+): had + participle, has/have been + -ing (8)
    "eq-u5-perfect-champion": [
      q("Which word fits? 'When we reached the station, the train ___ already left.'", "had", [["has", "tense-perfect-mixup"], ["have", "tense-perfect-mixup"], ["was", "tense-perfect-mixup"]], "The train left BEFORE we reached. The earlier past action takes HAD + past participle."),
      q("Pick the right verb: 'By the time Mum came home, I ___ the dishes.'", "had washed", [["have washed", "tense-perfect-mixup"], ["has washed", "tense-perfect-mixup"], ["washes", "time-word-mixup"]], "Washing happened before Mum came home → HAD WASHED."),
      q("Which word fits? 'She ___ been reading since morning.'", "has", [["have", "sva-number-error"], ["is", "tense-perfect-mixup"], ["was", "tense-perfect-mixup"]], "Started in the morning and still going on → SHE HAS BEEN reading."),
      q("Which word fits? 'They have been ___ football for an hour.'", "playing", [["played", "tense-form-error"], ["play", "tense-form-error"], ["plays", "tense-form-error"]], "HAVE BEEN + -ing: have been PLAYING."),
      q("Pick the right words: 'I ___ waiting for the bus for twenty minutes.'", "have been", [["has been", "sva-number-error"], ["am been", "tense-form-error"], ["was been", "tense-form-error"]], "I → HAVE BEEN + -ing."),
      q("Which sentence is correct?", "Ravi had eaten lunch before the guests arrived.", [["Ravi had ate lunch before the guests arrived.", "participle-form-error"], ["Ravi has eaten lunch before the guests arrived.", "tense-perfect-mixup"], ["Ravi had eat lunch before the guests arrived.", "participle-form-error"]], "HAD + third form: eat → ate → EATEN."),
      q("Which word fits? 'It has been raining ___ three days.'", "for", [["since", "since-for-mixup"], ["from", "since-for-mixup"], ["ago", "since-for-mixup"]], "Three days is HOW LONG → FOR."),
      q("Pick the right verb: 'The ground was wet because it ___ in the night.'", "had rained", [["has rained", "tense-perfect-mixup"], ["rains", "time-word-mixup"], ["is raining", "time-word-mixup"]], "The rain came BEFORE the ground was wet (both past) → HAD RAINED."),
    ],
    // Gate pool (15): has-have × 5, past-participle × 5, perfect-or-past × 5
    "eq-u5-perfect-gate-pool": [
      t("has-have", "Which word fits? 'My grandparents ___ come to stay with us.'", "have", [["has", "sva-number-error"], ["is", "tense-perfect-mixup"], ["was", "tense-perfect-mixup"]], "Grandparents are two → HAVE come."),
      t("has-have", "Which word fits? 'The puppy ___ eaten all its food.'", "has", [["have", "sva-number-error"], ["are", "tense-perfect-mixup"], ["were", "tense-perfect-mixup"]], "The puppy is one → HAS eaten."),
      t("has-have", "Which sentence is correct?", "Everyone has brought a lunch box.", [["Everyone have brought a lunch box.", "sva-number-error"], ["Everyone has bring a lunch box.", "participle-form-error"], ["Everyone have bringing a lunch box.", "participle-form-error"]], "EVERYONE takes HAS. HAS + third form: BROUGHT."),
      t("has-have", "Which word fits? 'You ___ grown so tall, Aarav!'", "have", [["has", "sva-number-error"], ["is", "tense-perfect-mixup"], ["was", "tense-perfect-mixup"]], "YOU always takes HAVE."),
      t("has-have", "Fill in both blanks: 'Sita ___ cleaned her room, but her brothers ___ not.'", "has, have", [["have, has", "sva-number-error"], ["has, has", "sva-number-error"], ["have, have", "sva-number-error"]], "Sita (one) HAS; her brothers (many) HAVE."),
      t("past-participle", "Complete the sentence: 'The wind has ___ the papers off the table.'", "blown", [["blew", "participle-form-error"], ["blowed", "tense-form-error"], ["blow", "participle-form-error"]], "blow → blew → BLOWN."),
      t("past-participle", "Complete the question: 'Have you ___ your milk?'", "drunk", [["drank", "participle-form-error"], ["drinked", "tense-form-error"], ["drink", "participle-form-error"]], "drink → drank → DRUNK."),
      t("past-participle", "Complete the sentence: 'The school bell has already ___.'", "rung", [["rang", "participle-form-error"], ["ringed", "tense-form-error"], ["ring", "participle-form-error"]], "ring → rang → RUNG."),
      t("past-participle", "Complete the sentence: 'She has ___ a beautiful song for us.'", "sung", [["sang", "participle-form-error"], ["singed", "tense-form-error"], ["sing", "participle-form-error"]], "sing → sang → SUNG."),
      t("past-participle", "Complete the sentence: 'Our team has ___ the trophy!'", "won", [["win", "participle-form-error"], ["winned", "tense-form-error"], ["wins", "participle-form-error"]], "win → won → WON (the past and third form are the same)."),
      t("perfect-or-past", "Which sentence is correct?", "We saw a peacock yesterday.", [["We have seen a peacock yesterday.", "tense-perfect-mixup"], ["We has seen a peacock yesterday.", "sva-number-error"], ["We see a peacock yesterday.", "time-word-mixup"]], "YESTERDAY → simple past: SAW."),
      t("perfect-or-past", "Complete the sentence: 'Raj ___ in this school since Class 1.'", "has studied", [["studied", "tense-perfect-mixup"], ["studies", "tense-perfect-mixup"], ["is studying", "tense-perfect-mixup"]], "SINCE Class 1 and still there → HAS STUDIED."),
      t("perfect-or-past", "Complete the sentence: 'Two weeks ago, Lata ___ her first race.'", "ran", [["has run", "tense-perfect-mixup"], ["have run", "tense-perfect-mixup"], ["runs", "time-word-mixup"]], "AGO → simple past: RAN."),
      t("perfect-or-past", "Which word fits? 'I have known Riya ___ we were babies.'", "since", [["for", "since-for-mixup"], ["ago", "since-for-mixup"], ["during", "since-for-mixup"]], "'We were babies' is the STARTING POINT → SINCE."),
      t("perfect-or-past", "Fill in both blanks: 'Last year we ___ to Agra, but we ___ never been to Jaipur.'", "went, have", [["have gone, have", "tense-perfect-mixup"], ["went, has", "sva-number-error"], ["go, have", "time-word-mixup"]], "LAST YEAR → WENT. 'Never been… (in our whole life)' → WE HAVE never been."),
    ],

    // Unit Boss (12, mixed, all four topics)
    "eq-u5-test": [
      q("Complete the sentence: 'Every morning, Dadi ___ yoga on the terrace.'", "does", [["do", "sva-number-error"], ["doing", "tense-form-error"], ["is do", "tense-form-error"]], "EVERY MORNING → habit. Dadi is one → DOES."),
      q("Complete the sentence: 'Last night, a storm ___ down the old tree.'", "knocked", [["knocks", "tense-present-past-mixup"], ["will knock", "time-word-mixup"], ["knocking", "tense-form-error"]], "LAST NIGHT → simple past: KNOCKED."),
      q("Complete the question: 'Did your team ___ the quiz?'", "win", [["won", "did-base-form-error"], ["wins", "did-base-form-error"], ["winning", "tense-form-error"]], "DID + base form: did your team WIN?"),
      q("Complete the sentence: 'Look! The bus ___ without us.'", "is leaving", [["leaves", "tense-continuous-mixup"], ["are leaving", "sva-number-error"], ["leaving", "tense-form-error"]], "LOOK! → happening now: IS LEAVING."),
      q("Complete the sentence: 'When the doorbell rang, Asha ___ a bath.'", "was taking", [["is taking", "tense-present-past-mixup"], ["were taking", "sva-number-error"], ["takes", "tense-present-past-mixup"]], "The long action was going on when the bell rang: WAS TAKING."),
      q("Complete the sentence: 'This phone ___ to my sister.'", "belongs", [["is belonging", "stative-verb-error"], ["belong", "sva-number-error"], ["are belonging", "stative-verb-error"]], "BELONG does not take -ing: it BELONGS."),
      q("Complete the sentence: 'Tomorrow, the children ___ a play for their parents.'", "will perform", [["performed", "time-word-mixup"], ["have performed", "time-word-mixup"], ["were performing", "time-word-mixup"]], "TOMORROW → future: WILL PERFORM."),
      q("Complete the sentence: 'Be careful! You ___ drop those eggs.'", "are going to", [["is going to", "sva-number-error"], ["going to", "tense-future-form-error"], ["am going to", "sva-number-error"]], "YOU → ARE going to."),
      q("Complete the sentence: 'I have ___ my lunch box at home.'", "left", [["leave", "participle-form-error"], ["leaved", "tense-form-error"], ["leaving", "participle-form-error"]], "leave → left → LEFT."),
      q("Which sentence is correct?", "Sunil has lived in Mumbai for five years.", [["Sunil has lived in Mumbai since five years.", "since-for-mixup"], ["Sunil is living in Mumbai since five years.", "tense-perfect-mixup"], ["Sunil have lived in Mumbai for five years.", "sva-number-error"]], "HAS LIVED + FOR (how long): for five years."),
      q("Complete the sentence: 'The guests ___ an hour ago.'", "arrived", [["have arrived", "tense-perfect-mixup"], ["arrive", "time-word-mixup"], ["will arrive", "time-word-mixup"]], "AGO → simple past: ARRIVED."),
      q("Fill in both blanks: 'While I ___ my homework, my brother ___ the TV on.'", "was doing, switched", [["am doing, switched", "tense-present-past-mixup"], ["was doing, switches", "tense-present-past-mixup"], ["did, was switch", "tense-form-error"]], "The long action: I WAS DOING. The short action that interrupted it: he SWITCHED the TV on."),
    ],
  },

  // ---------- Reading ----------
  readings: {
    "eq-read-meera-kite": {
      name: "Meera's Kite",
      author: "Apprec8",
      mode: "fullPassage",
      glossary: {
        terrace: "the flat roof of a house where people can sit",
        frame: "the sticks that hold the kite paper in shape",
        snapped: "broke suddenly with a sharp sound",
      },
      paragraphs: [
        "Every January, the sky over Ahmedabad fills with colourful kites. People in Gujarat call this kite festival Uttarayan. This year, Meera wanted to fly a kite that she had made with her own hands.",
        "On Saturday, Meera and her grandfather sat on the terrace with thin sticks, coloured paper and glue. Dadaji showed her how to tie the two sticks in the shape of a plus sign. Meera cut the paper carefully and pasted it on the frame. By evening, a bright orange kite was drying near the window.",
        "The next morning, the wind was strong. Meera ran across the terrace while Dadaji held the string. Suddenly, the kite rose high above the water tanks and the trees. Meera shouted with joy. Her cousins were flying kites on the next roof, and they waved at her.",
        "Later, a black kite came close and its string crossed hers. Meera pulled too hard, and her string snapped. The orange kite floated away over the rooftops. Meera felt like crying.",
        "Dadaji put his hand on her shoulder. \"You have learned to make a kite, and you have flown it yourself,\" he said. \"That is the real prize. Tomorrow we will make two more.\" Meera wiped her eyes and smiled. She was already planning a blue one.",
      ],
      questions: [
        {
          ...q("What did Meera and Dadaji use to make the kite?", "Thin sticks, coloured paper and glue", [["Bamboo, old cloth and cotton thread", "not-in-passage"], ["Newspaper, sticky tape and thin wire", "not-in-passage"], ["Plastic sheets, string and paint", "not-in-passage"]], "Paragraph 2 says they sat 'with thin sticks, coloured paper and glue'."),
          evidence: { paragraph: 1, text: "thin sticks, coloured paper and glue" },
        },
        {
          ...q("Who was holding the string when the kite rose high?", "Dadaji, her grandfather", [["Meera, all by herself", "detail-missed"], ["Her cousins on the next roof", "detail-missed"], ["The owner of the black kite", "not-in-passage"]], "Paragraph 3: 'Meera ran across the terrace while Dadaji held the string.'"),
          evidence: { paragraph: 2, text: "Meera ran across the terrace while Dadaji held the string." },
        },
        {
          ...q("Which happened FIRST?", "Meera cut the paper and pasted it on the frame.", [["The kite rose above the water tanks.", "sequence"], ["A black kite crossed her string.", "sequence"], ["Meera started planning a blue kite.", "sequence"]], "Making the kite (Saturday) came before flying it (the next morning)."),
          evidence: { paragraph: 1, text: "Meera cut the paper carefully and pasted it on the frame." },
        },
        {
          ...q("The word 'floated' in the passage means ___.", "moved gently through the air", [["fell down very fast", "word-meaning"], ["got stuck in a tree", "word-meaning"], ["tore into small pieces", "word-meaning"]], "The kite drifted away slowly in the wind over the rooftops."),
          evidence: { paragraph: 3, text: "The orange kite floated away over the rooftops." },
        },
        {
          ...q("Select the INCORRECT statement according to the passage.", "Meera won a prize for the best kite.", [["The kite Meera made was orange.", "statement-check"], ["A black kite crossed her string.", "statement-check"], ["Dadaji said they will make two more.", "statement-check"]], "There was no contest. Dadaji said that making and flying the kite was 'the real prize'."),
          evidence: { paragraph: 4, text: "That is the real prize." },
        },
        {
          ...q("How did Dadaji help Meera feel better?", "He said making and flying the kite was the real prize.", [["He bought her a new kite from the market.", "not-in-passage"], ["He brought the orange kite back from a roof.", "not-in-passage"], ["He told the cousins to give her their kite.", "not-in-passage"]], "Dadaji reminded her of what she had learned: 'That is the real prize.'"),
          evidence: { paragraph: 4, text: "You have learned to make a kite, and you have flown it yourself," },
        },
        {
          ...q("In 'You have learned to make a kite', which tense is used?", "present perfect: have + past participle", [["simple past: the past form only", "verb-tense-error"], ["present continuous: are + verb-ing", "verb-tense-error"], ["future: will + base form", "verb-tense-error"]], "HAVE + LEARNED (third form) is the present perfect: done, and it matters now."),
          evidence: { paragraph: 4, text: "You have learned to make a kite" },
        },
      ],
    },
  },
  wordTables: {},

  nodes: [
    unit("eq-u5", 5, "Tenses"),

    // Topic A: Present or Past?
    simple,
    withSubtopic(practice("eq-u5-simple-p1", simple, 1, "Irregular Past Words", "medium", [quiz("eq-u5-simple-irregular")]), "simple-past"),
    gate("eq-u5-simple-gate", simple, "Present or Past Challenge", "eq-u5-simple-gate-pool", {
      "simple-present": "Simple present",
      "simple-past": "Simple past",
      "did-questions": "Questions with did",
    }),
    endless(simple),

    // Topic B: Happening Now
    cont,
    withSubtopic(practice("eq-u5-cont-p1", cont, 1, "Was or Were?", "medium", [quiz("eq-u5-cont-was-were")]), "past-continuous"),
    gate("eq-u5-cont-gate", cont, "Happening Now Challenge", "eq-u5-cont-gate-pool", {
      "present-continuous": "Happening now",
      "past-continuous": "Happening in the past",
      "simple-or-continuous": "With or without -ing",
    }),
    endless(cont),

    // Topic C: Will & Going to
    future,
    withSubtopic(practice("eq-u5-future-p1", future, 1, "Clue Words", "medium", [quiz("eq-u5-future-clues")]), "time-words"),
    gate("eq-u5-future-gate", future, "Future Challenge", "eq-u5-future-gate-pool", {
      "will-future": "Will + verb",
      "going-to-form": "Going to",
      "time-words": "Clue words",
    }),
    endless(future),

    // Topic D: Have Done (+ Champion leaf, one level up)
    perfect,
    withSubtopic(practice("eq-u5-perfect-p1", perfect, 1, "Since or For?", "medium", [quiz("eq-u5-perfect-since-for")]), "perfect-or-past"),
    forGrades(practice("eq-u5-perfect-p2", perfect, 2, "Champion: Had & Has Been", "hard", [quiz("eq-u5-perfect-champion")]), [5, 6, 7, 8, 9, 10, 11, 12]),
    gate("eq-u5-perfect-gate", perfect, "Have Done Challenge", "eq-u5-perfect-gate-pool", {
      "has-have": "Has or have",
      "past-participle": "Third forms",
      "perfect-or-past": "Have done or did",
    }),
    endless(perfect),

    // Reading & Boss
    u5r,
    boss(
      "eq-u5-boss",
      "eq-u5",
      "Unit 5 Boss",
      "eq-u5-test",
      "Oh no! 👾 The Grammar Gremlin has stolen the Clock of Time! Now yesterday, today and tomorrow are all mixed up, and nobody knows when anything happened. Put every verb back in its right time to fix the clock."
    ),
  ],
};

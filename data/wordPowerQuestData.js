// data/wordPowerQuestData.js
// Word Power Quest: Vocabulary, Spelling, Idioms & Everyday English
// Built per docs/CONTENT_GUIDE.md and owner decision (2026-11-04).
import {
  q,
  study,
  quiz,
  reading,
  unit,
  main,
  practice,
  gate,
  withSubtopic,
  endless,
  boss,
  forGrades,
} from "./englishQuest/helpers.js";

export const QUEST_ID = "word-power";

export const quest = {
  title: "Word Power",
  description: "Words, spelling, idioms and everyday English",
  image: null,
  version: 1,
  draft: false,
};

export const tile = {
  title: "Word Power",
  type: "QUEST",
  carouselGroup: "quest",
  order: 2,
  image: null,
  questId: QUEST_ID,
  description: "Words, spelling, idioms and everyday English",
};

// ---------- Study pages ----------
export const studyPages = {
  // Spec S word ladder (owner 2026-11-05): an easy first rung for Classes 2–4, before "Synonyms and Antonyms".
  "wp-sameopp-study": {
    name: "Same & Opposite",
    author: "Apprec8",
    cards: [
      { emoji: "👯", title: "Word twins", text: "Some words mean the same thing. We call them word twins (synonyms).", examples: ["big = large", "happy = glad", "begin = start"] },
      { kind: "check", question: "Which word is a twin of BIG?", answer: "large", wrong: ["small", "tiny", "short"], explain: "A big box is a large box." },
      { emoji: "🔄", title: "Word opposites", text: "Some words mean the reverse. We call them opposites (antonyms).", examples: ["hot ↔ cold", "up ↔ down", "day ↔ night"] },
      { kind: "check", question: "What is the opposite of FULL?", answer: "empty", wrong: ["heavy", "big", "round"], explain: "A full glass has water; an empty glass has none." },
      { emoji: "✨", title: "Magic starts: un- and dis-", text: "Put un- or dis- at the start of some words and the meaning flips.", examples: ["kind → unkind", "happy → unhappy", "like → dislike"] },
      { kind: "check", question: "What is the opposite of AGREE?", answer: "disagree", wrong: ["agreed", "agreeing", "agreement"], explain: "dis- + agree = disagree." },
      { emoji: "🔍", title: "Try it in the sentence", text: "Not sure? Put the word into a sentence. A twin keeps the meaning; an opposite flips it.", examples: ["The cake is big. = The cake is large.", "The tea is hot. ↔ The tea is cold."] },
    ],
    content:
      "### 👯 Same & Opposite\n\n**Word twins (synonyms)** mean the same: big = large, happy = glad, begin = start, fast = quick.\n\n" +
      "**Opposites (antonyms)** mean the reverse: hot ↔ cold, up ↔ down, day ↔ night, early ↔ late.\n\n" +
      "**un- and dis-** flip a word: kind → unkind, happy → unhappy, like → dislike, agree → disagree.\n\n" +
      "> 💡 **Tip:** Put the word into a sentence. A twin keeps the meaning; an opposite flips it.",
  },
  "wp-synant-study": {
    name: "Synonyms and Antonyms",
    author: "Apprec8",
    // Learn cards (spec R, owner OK 2026-11-05): easy → hard (spec S). The long page below stays as "See everything on one page".
    cards: [
      { emoji: "👯", title: "Word twins", text: "Some words mean almost the same thing. They are called synonyms.", examples: ["big = large", "begin = start", "glad = happy"] },
      { emoji: "🔄", title: "Word opposites", text: "Some words mean the reverse of each other. They are called antonyms.", examples: ["hot ↔ cold", "early ↔ late", "full ↔ empty"] },
      { kind: "check", question: "Which word is a twin of SHUT?", answer: "close", wrong: ["open", "shout", "shirt"], explain: "Shut the door = close the door." },
      { emoji: "✨", title: "un- and dis- make opposites", text: "Put un- or dis- in front of some words and the meaning flips.", examples: ["happy → unhappy", "like → dislike", "kind → unkind"] },
      { kind: "check", question: "What is the opposite of HONEST?", answer: "dishonest", wrong: ["unhonest", "nonhonest", "mishonest"], explain: "dis- + honest = dishonest." },
      { emoji: "🧗", title: "Bigger twins", text: "Harder questions use bigger words. Learn each one with its easy twin.", examples: ["brave = courageous", "rare = scarce", "rich = wealthy"] },
      { emoji: "🌗", title: "Bigger opposites", text: "Big words have opposites too. Say each pair out loud.", examples: ["ancient ↔ modern", "careful ↔ reckless", "eager ↔ unwilling"] },
      { kind: "check", question: "Which word means the same as PLENTIFUL?", answer: "abundant", wrong: ["rare", "empty", "tiny"], explain: "Plentiful and abundant both mean more than enough." },
      { emoji: "🔍", title: "Try it in the sentence", text: "Before you choose, put each option into the sentence. Only the right one sounds right and makes sense.", examples: ["The fog will vanish (= disappear) when the sun rises."] },
      { kind: "check", question: "Which word is a twin of DISAPPEAR?", answer: "vanish", wrong: ["appear", "arrive", "return"], explain: "The magician made the coin vanish: it disappeared." },
    ],
    content: "### 📚 The Magic of Synonyms and Antonyms\n\nExpanding your vocabulary makes your writing and speech colourful, precise, and expressive!\n\n---\n\n### 👯 Synonyms: Words with Similar Meanings\n\nA **synonym** is a word that has the same or nearly the same meaning as another word in the same language.\n\n| Word | Synonyms | Example Sentence |\n|---|---|---|\n| **Brave** | *courageous, valiant, fearless* | The brave firefighter entered the burning house. |\n| **Scarce** | *rare, sparse, meagre* | Fresh drinking water became scarce during the dry summer. |\n| **Ancient** | *antique, prehistoric, timeworn* | The museum displays ancient coins made of silver. |\n| **Cautious** | *careful, watchful, prudent* | A cautious driver slows down near a school gate. |\n| **Vanish** | *disappear, fade, evaporate* | The morning fog will vanish as the sun rises. |\n| **Wealthy** | *affluent, prosperous, opulent* | The wealthy merchant donated books to the village school. |\n| **Eager** | *keen, enthusiastic, impatient* | The eager students arrived early for the annual science fair. |\n| **Trivial** | *minor, petty, unimportant* | Do not worry about trivial matters during an exam. |\n| **Abundant** | *plentiful, lavish, copious* | The orchard produced an abundant harvest of sweet apples. |\n| **Gentle** | *tender, mild, peaceful* | A gentle breeze blew across the quiet valley. |\n\n---\n\n### ⚡ Antonyms: Words with Opposite Meanings\n\nAn **antonym** is a word that means the exact opposite of another word.\n\n| Word | Antonyms | Example Sentence |\n|---|---|---|\n| **Brave** | *cowardly, timid, fearful* | The cowardly dog ran away from the barking puppy. |\n| **Scarce** | *plentiful, abundant, copious* | Ripe mangoes are plentiful in the warm month of June. |\n| **Ancient** | *modern, recent, contemporary* | The city has modern high-rise flats beside old temples. |\n| **Cautious** | *reckless, rash, careless* | Rash driving on slippery roads causes dangerous accidents. |\n| **Vanish** | *appear, emerge, materialise* | A colourful rainbow will appear after the rain stops. |\n| **Wealthy** | *impoverished, needy, destitute* | The generous king gave food to impoverished families. |\n| **Eager** | *reluctant, unwilling, indifferent* | The tired boy was reluctant to leave his cosy bed. |\n| **Trivial** | *crucial, vital, essential* | Clear communication is crucial for every team project. |\n| **Cruel** | *compassionate, merciful, humane* | The merciful judge pardoned the repentant traveller. |\n| **Gloomy** | *cheerful, radiant, bright* | A cheerful smile brightened the grey hospital room. |\n\n> 💡 **Tip:** Always look at the surrounding sentence context. A word can have slightly different shades of meaning depending on how it is used!",
  },
  "wp-spelling-study": {
    name: "Spelling Traps & Rules",
    author: "Apprec8",
    content: "### ✍️ Conquering Tricky Spelling Traps\n\nSpelling questions often test words that have silent letters, double consonants, or confusing vowel combinations.\n\n---\n\n### 🎯 The Big 10 Spelling Traps\n\n1. **Separate:**\n   - Notice the **a** in the middle: *s-e-p-**a**-r-a-t-e*.\n   - 💡 Memory trick: There is **a rat** in sep-**a-rat**-e!\n2. **Necessary:**\n   - One **c**, double **s**: *n-e-**c**-e-**ss**-a-r-y*.\n   - 💡 Memory trick: A shirt has **one collar** (c) and **two sleeves** (ss)!\n3. **Beautiful:**\n   - Starts with *b-e-a-u*: *b-**e-a-u**-t-i-f-u-l*.\n4. **Receive, Deceive, Conceive:**\n   - Remember the golden rule: **i before e except after c**!\n   - *r-e-**c-e-i**-v-e*, *d-e-**c-e-i**-v-e*, *c-e-i-l-i-n-g*.\n   - But when not after c: *b-e-l-**i-e**-v-e*, *p-**i-e**-c-e*, *f-**i-e**-l-d*.\n5. **Accommodate:**\n   - Double **c** AND double **m**: *a-**cc**-o-**mm**-o-d-a-t-e*.\n6. **Embarrass:**\n   - Double **r** AND double **s**: *e-m-b-a-**rr**-a-**ss**-e-d*.\n7. **Definite:**\n   - Contains the word **finite**: *d-e-**f-i-n-i-t**-e*. Never write \"definate\"!\n8. **Occasion:**\n   - Double **c**, single **s**: *o-**cc**-a-**s**-i-o-n*.\n9. **Environment:**\n   - Do not forget the silent **n** before m: *e-n-v-i-r-o-**n**-m-e-n-t*.\n10. **Grammar:**\n    - Ends in **-ar**, never -er: *g-r-a-m-m-**a-r**!\n\n---\n\n### 🔍 Quick Checklist\n\n- Does it drop the 'e' when adding -ing? (*make* → *making*, *write* → *writing*)\n- Does it double the last consonant after a short vowel? (*begin* → *beginning*, *stop* → *stopped*)\n- Does it keep the 'e' before -able for soft c or g? (*notice* → *noticeable*, *change* → *changeable*)",
  },
  "wp-colloc-study": {
    name: "Natural Word Choice & Collocations",
    author: "Apprec8",
    content: "### 🤝 Natural Word Choice & Collocations\n\nWords in English love to travel in natural partnerships called **collocations**. Even if two words have similar dictionary meanings, native speakers only use specific combinations!\n\n---\n\n### 🌟 Natural Movement and Sound Collocations\n\n| Subject | Natural Verb | Never Say |\n|---|---|---|\n| **Candle flame** | *flickers* | flames do not shiver or tremble |\n| **Cold person** | *shivers* | people do not flicker in the cold |\n| **Nervous voice** | *trembles / wavers* | voices do not flicker or rustle |\n| **Dry autumn leaves** | *rustle* | leaves do not roar or creak |\n| **Gentle stream** | *babbles / murmurs* | streams do not shout or snap |\n| **Floorboards** | *creak* | old wood creaks under footsteps |\n\n---\n\n### 🌦️ Nature and Weather Collocations\n\n- **Torrential rain:** We say *torrential rain* or *heavy downpour*, never \"thick rain\".\n- **Howling wind:** A strong storm has *howling* or *gale-force* winds, not \"loud wind\".\n- **Dense fog:** Visibility drops in *dense*, *thick* or *heavy* fog, never \"tall fog\".\n- **Scorching heat:** Summer brings *scorching* or *sweltering* heat, not \"burning air\".\n\n---\n\n### 💼 Action and Verb Collocations\n\n- **Make** vs **Do:**\n  - *make a decision*, *make an effort*, *make a mistake*, *make a phone call*.\n  - *do homework*, *do chores*, *do research*, *do your best*.\n- **Take:**\n  - *take a risk*, *take a break*, *take a seat*, *take responsibility*.\n- **Burst:**\n  - *burst into tears*, *burst into laughter*, *burst into song*.\n\n---\n\n### 👑 Special Group Collocations\n\n- A royal **cavalcade** of horse-drawn carriages.\n- A **pride** of wild lions resting in the shade.\n- A **fleet** of cargo ships sailing into the harbour.\n- A **flock** of migratory birds flying south.",
  },
  "wp-dialogue-study": {
    name: "Situational Dialogue & Everyday Speech",
    author: "Apprec8",
    content: "### 💬 Spoken and Written Expression\n\nIn everyday English, conversations test natural, polite, and situational conversation.\n\n---\n\n### 🤝 Polite Requests and Offers\n\n| Situation | Natural Spoken Expression | What to Avoid |\n|---|---|---|\n| Asking for help | *\"Could you lend me a hand with this trunk?\"* | *\"Give me help now.\"* |\n| Accepting help | *\"That is very kind of you, thank you!\"* | *\"Yes, you must.\"* |\n| Offering a seat | *\"Please have a seat.\"* | *\"Sit down here.\"* |\n| Mind questions | *\"Would you mind opening the door?\"* → *\"Not at all!\"* | *\"Yes, I mind.\"* |\n\n---\n\n### 🎭 Common Conversational Responses\n\n1. **When nobody knows the answer:**\n   - **Rohan:** *\"Do you think the team will win tomorrow?\"*\n   - **Meera:** *\"Your guess is **as good as mine**.\"* (Meaning: I have no idea either!)\n2. **When delaying an unnecessary worry:**\n   - **Father:** *\"What if it rains during the picnic next week?\"*\n   - **Mother:** *\"We will **cross that bridge when we come to it**.\"* (Meaning: deal with it only if it happens!)\n3. **When providing reassurance:**\n   - **Aman:** *\"I will try to reach on time, but do not worry **in case** I am delayed by traffic.\"*\n   - **Priya:** *\"All right, just keep me informed.\"*\n4. **When agreeing warmly:**\n   - **Teacher:** *\"Shall we invite the principal to our exhibition?\"*\n   - **Class:** *\"**By all means**, that is a wonderful idea!\"*",
  },
  "wp-idioms-study": {
    name: "Common Idioms and Proverbs",
    author: "Apprec8",
    content: "### 🎨 Colourful Everyday Idioms\n\nAn **idiom** is a figurative phrase whose overall meaning cannot be understood from the literal definitions of its individual words.\n\n---\n\n### 🏆 Essential Idioms for Class 5\n\n| Idiom | True Meaning | Example Sentence |\n|---|---|---|\n| **A piece of cake** | Very easy to do | The maths quiz was a piece of cake for Ravi. |\n| **Bite the bullet** | Face a tough situation bravely | She decided to bite the bullet and apologize. |\n| **Burn the midnight oil** | Study late into the night | Students burn the midnight oil before exams. |\n| **Spill the beans** | Reveal a secret accidentally | Rohan spilled the beans about the surprise party. |\n| **Cost an arm and a leg** | Extremely expensive | That imported sports bicycle costs an arm and a leg. |\n| **Under the weather** | Feeling slightly ill | Kavita stayed home because she felt under the weather. |\n| **See eye to eye** | Agree completely | The two friends rarely see eye to eye on football. |\n| **Hit the nail on the head** | Say exactly the right thing | The teacher hit the nail on the head with her explanation. |\n| **Barking up the wrong tree** | Accusing the wrong person | If you suspect Arun, you are barking up the wrong tree. |\n| **Once in a blue moon** | Happening very rarely | We visit our cousins in Kerala once in a blue moon. |\n\n> 💡 **Exam Tip:** In questions, read the whole sentence carefully to see whether the idiom fits the mood and meaning of the speaker!",
  },
};

// ---------- Quizzes ----------
export const quizzes = {
  // Spec S word ladder: easy first rung (Classes 2–4).
  "wp-sameopp-warmup": [
    { subtopic: "synonyms", ...q("Which word means the same as BIG?", "large", [["small", "synonym-error"], ["tiny", "synonym-error"], ["short", "synonym-error"]], "Big and large mean the same.") },
    { subtopic: "synonyms", ...q("Which word means the same as HAPPY?", "glad", [["sad", "synonym-error"], ["angry", "synonym-error"], ["sleepy", "synonym-error"]], "Happy and glad mean the same.") },
    { subtopic: "antonyms", ...q("Which word is the opposite of HOT?", "cold", [["warm", "antonym-error"], ["sunny", "antonym-error"], ["wet", "antonym-error"]], "Hot ↔ cold.") },
    { subtopic: "antonyms", ...q("Which word is the opposite of UP?", "down", [["top", "antonym-error"], ["over", "antonym-error"], ["high", "antonym-error"]], "Up ↔ down.") },
    { subtopic: "synonyms", ...q("Which word means the same as BEGIN?", "start", [["end", "synonym-error"], ["stop", "synonym-error"], ["finish", "synonym-error"]], "Begin and start mean the same. End, stop and finish are opposites.") },
    { subtopic: "antonyms", ...q("What is the opposite of KIND?", "unkind", [["kindly", "antonym-error"], ["kinder", "antonym-error"], ["kindness", "antonym-error"]], "un- + kind = unkind.") },
    { subtopic: "antonyms", ...q("What is the opposite of LIKE?", "dislike", [["likely", "antonym-error"], ["liking", "antonym-error"], ["alike", "antonym-error"]], "dis- + like = dislike.") },
    { subtopic: "synonyms", ...q("Which two words are twins (same meaning)?", "shut and close", [["open and shut", "synonym-error"], ["hot and cold", "synonym-error"], ["up and down", "synonym-error"]], "Shut the door = close the door. The others are opposites.") },
  ],
  "wp-sameopp-twins": [
    { subtopic: "synonyms", ...q("Which word means the same as FAST?", "quick", [["slow", "synonym-error"], ["late", "synonym-error"], ["still", "synonym-error"]], "Fast and quick mean the same.") },
    { subtopic: "synonyms", ...q("Which word means the same as LITTLE?", "small", [["huge", "synonym-error"], ["tall", "synonym-error"], ["long", "synonym-error"]], "Little and small mean the same.") },
    { subtopic: "synonyms", ...q("Which word means the same as SHOUT?", "yell", [["whisper", "synonym-error"], ["sing", "synonym-error"], ["laugh", "synonym-error"]], "Shout and yell both mean to call out loudly.") },
    { subtopic: "synonyms", ...q("Which word means the same as JUMP?", "leap", [["sit", "synonym-error"], ["crawl", "synonym-error"], ["walk", "synonym-error"]], "Jump and leap mean the same.") },
    { subtopic: "synonyms", ...q("Which word means the same as END?", "finish", [["start", "synonym-error"], ["open", "synonym-error"], ["begin", "synonym-error"]], "End and finish mean the same.") },
    { subtopic: "synonyms", ...q("Which word means the same as GIFT?", "present", [["party", "synonym-error"], ["cake", "synonym-error"], ["letter", "synonym-error"]], "A gift is a present.") },
    { subtopic: "synonyms", ...q("Which word means the same as SCARED?", "afraid", [["brave", "synonym-error"], ["bold", "synonym-error"], ["proud", "synonym-error"]], "Scared and afraid mean the same.") },
    { subtopic: "synonyms", ...q("Which word means the same as RICH?", "wealthy", [["poor", "synonym-error"], ["kind", "synonym-error"], ["busy", "synonym-error"]], "Rich and wealthy both mean having lots of money.") },
    { subtopic: "synonyms", ...q("Which word means the same as CORRECT?", "right", [["wrong", "synonym-error"], ["false", "synonym-error"], ["late", "synonym-error"]], "Correct and right mean the same.") },
    { subtopic: "synonyms", ...q("Which word means the same as ANGRY?", "cross", [["calm", "synonym-error"], ["cheerful", "synonym-error"], ["sleepy", "synonym-error"]], "Cross can also mean angry: \"Mum was cross with me.\"") },
  ],
  "wp-sameopp-opposites": [
    { subtopic: "antonyms", ...q("Which word is the opposite of EARLY?", "late", [["soon", "antonym-error"], ["first", "antonym-error"], ["quick", "antonym-error"]], "early ↔ late.") },
    { subtopic: "antonyms", ...q("Which word is the opposite of FULL?", "empty", [["heavy", "antonym-error"], ["big", "antonym-error"], ["round", "antonym-error"]], "full ↔ empty.") },
    { subtopic: "antonyms", ...q("Which word is the opposite of DAY?", "night", [["morning", "antonym-error"], ["sun", "antonym-error"], ["week", "antonym-error"]], "day ↔ night.") },
    { subtopic: "antonyms", ...q("Which word is the opposite of WIN?", "lose", [["play", "antonym-error"], ["game", "antonym-error"], ["try", "antonym-error"]], "win ↔ lose.") },
    { subtopic: "antonyms", ...q("Which word is the opposite of PUSH?", "pull", [["press", "antonym-error"], ["lift", "antonym-error"], ["kick", "antonym-error"]], "push ↔ pull.") },
    { subtopic: "antonyms", ...q("Which word is the opposite of REMEMBER?", "forget", [["think", "antonym-error"], ["know", "antonym-error"], ["learn", "antonym-error"]], "remember ↔ forget.") },
    { subtopic: "antonyms", ...q("Which word is the opposite of TALL?", "short", [["big", "antonym-error"], ["long", "antonym-error"], ["thin", "antonym-error"]], "tall ↔ short.") },
    { subtopic: "antonyms", ...q("What is the opposite of HAPPY?", "unhappy", [["happily", "antonym-error"], ["happier", "antonym-error"], ["happiness", "antonym-error"]], "un- + happy = unhappy.") },
    { subtopic: "antonyms", ...q("What is the opposite of AGREE?", "disagree", [["agreed", "antonym-error"], ["agreeing", "antonym-error"], ["agreement", "antonym-error"]], "dis- + agree = disagree.") },
    { subtopic: "antonyms", ...q("What is the opposite of SAFE?", "unsafe", [["safely", "antonym-error"], ["safer", "antonym-error"], ["safety", "antonym-error"]], "un- + safe = unsafe.") },
  ],
  "wp-synant-warmup": [
      {
        subtopic: "synonyms",
        ...q(
          "Choose the correct synonym of the word 'courageous':",
          "brave",
          [
          ["timid", "synonym-error"],
          ["reckless", "synonym-error"],
          ["frightened", "synonym-error"]
          ],
          "Courageous means showing bravery in the face of fear or danger; brave is its closest synonym."
        ),
      },
      {
        subtopic: "antonyms",
        ...q(
          "Choose the correct antonym of the word 'scarce':",
          "plentiful",
          [
          ["rare", "antonym-error"],
          ["meagre", "antonym-error"],
          ["insufficient", "antonym-error"]
          ],
          "Scarce means existing in very small amounts; its opposite (antonym) is plentiful or abundant."
        ),
      },
      {
        subtopic: "synonyms",
        ...q(
          "Choose the correct synonym of the word 'ancient':",
          "antique",
          [
          ["modern", "synonym-error"],
          ["recent", "synonym-error"],
          ["fashionable", "synonym-error"]
          ],
          "Ancient refers to times long past or very old objects; antique shares this meaning."
        ),
      },
      {
        subtopic: "antonyms",
        ...q(
          "Choose the correct antonym of the word 'cautious':",
          "reckless",
          [
          ["watchful", "antonym-error"],
          ["careful", "antonym-error"],
          ["prudent", "antonym-error"]
          ],
          "Cautious means taking great care to avoid danger; reckless means acting without caring about consequences."
        ),
      },
      {
        subtopic: "synonyms",
        ...q(
          "Choose the correct synonym of the word 'vanish':",
          "disappear",
          [
          ["arrive", "synonym-error"],
          ["surface", "synonym-error"],
          ["expand", "synonym-error"]
          ],
          "To vanish means to pass completely out of sight, which is the definition of disappear."
        ),
      },
      {
        subtopic: "antonyms",
        ...q(
          "Choose the correct antonym of the word 'wealthy':",
          "impoverished",
          [
          ["affluent", "antonym-error"],
          ["prosperous", "antonym-error"],
          ["comfortable", "antonym-error"]
          ],
          "Wealthy means having abundant money; impoverished means made poor or lacking basic resources."
        ),
      },
      {
        subtopic: "context-pairs",
        ...q(
          "Fill in the blank with the best word: 'The child was ___ to open the birthday parcel.'",
          "eager",
          [
          ["reluctant", "context-word-choice"],
          ["unwilling", "context-word-choice"],
          ["hesitant", "context-word-choice"]
          ],
          "Eager means keenly excited and looking forward to an event with enthusiasm."
        ),
      },
      {
        subtopic: "antonyms",
        ...q(
          "Choose the correct antonym of the word 'trivial':",
          "crucial",
          [
          ["minor", "antonym-error"],
          ["petty", "antonym-error"],
          ["worthless", "antonym-error"]
          ],
          "Trivial means of very little importance; crucial means of supreme, decisive importance."
        ),
      },
  ],
  "wp-synant-context-quiz": [
      {
        subtopic: "context-pairs",
        ...q(
          "Fill in the blank with the most appropriate word: 'The judge was known for giving ___ judgments.'",
          "impartial",
          [
          ["biased", "context-word-choice"],
          ["prejudiced", "context-word-choice"],
          ["hasty", "context-word-choice"]
          ],
          "An impartial judge treats all parties equally without favouring one side over another."
        ),
      },
      {
        subtopic: "synonyms",
        ...q(
          "Choose the correct synonym of the underlined word: 'The valley was completely silent.'",
          "hushed",
          [
          ["deafening", "synonym-error"],
          ["boisterous", "synonym-error"],
          ["rowdy", "synonym-error"]
          ],
          "Hushed and silent both describe quiet, calm environments with very little sound."
        ),
      },
      {
        subtopic: "antonyms",
        ...q(
          "Choose the correct antonym of the underlined word: 'The king was renowned for his cruelty.'",
          "compassion",
          [
          ["brutality", "antonym-error"],
          ["harshness", "antonym-error"],
          ["ferocity", "antonym-error"]
          ],
          "The opposite of cruelty (harsh suffering inflicted on others) is compassion or mercy."
        ),
      },
      {
        subtopic: "context-pairs",
        ...q(
          "Fill in the blank: 'Fresh fruits and green vegetables are ___ in the summer market.'",
          "abundant",
          [
          ["meagre", "context-word-choice"],
          ["deficient", "context-word-choice"],
          ["scarce", "context-word-choice"]
          ],
          "Abundant means existing in large quantities, fitting a well-stocked seasonal market."
        ),
      },
      {
        subtopic: "synonyms",
        ...q(
          "Choose the word that means the SAME as 'diligent':",
          "hardworking",
          [
          ["careless", "synonym-error"],
          ["lazy", "synonym-error"],
          ["inactive", "synonym-error"]
          ],
          "Diligent describes a person who shows steady, earnest, and energetic effort in their work."
        ),
      },
      {
        subtopic: "antonyms",
        ...q(
          "Choose the word that is OPPOSITE in meaning to 'gloomy':",
          "radiant",
          [
          ["sombre", "antonym-error"],
          ["murky", "antonym-error"],
          ["dismal", "antonym-error"]
          ],
          "Gloomy means dark, depressing, or overcast; radiant means glowing brightly and joyfully."
        ),
      },
  ],
  "wp-synant-gate-pool": [
      {
        subtopic: "synonyms",
        ...q(
          "Choose the correct synonym of the word 'perilous':",
          "dangerous",
          [
          ["harmless", "synonym-error"],
          ["secure", "synonym-error"],
          ["pleasant", "synonym-error"]
          ],
          "Perilous comes from peril, meaning full of grave danger or risk."
        ),
      },
      {
        subtopic: "synonyms",
        ...q(
          "Choose the correct synonym of the word 'furious':",
          "enraged",
          [
          ["delighted", "synonym-error"],
          ["cheerful", "synonym-error"],
          ["peaceful", "synonym-error"]
          ],
          "Furious means full of intense, violent anger; enraged is an exact synonym."
        ),
      },
      {
        subtopic: "synonyms",
        ...q(
          "Choose the correct synonym of the word 'slender':",
          "slim",
          [
          ["corpulent", "synonym-error"],
          ["stocky", "synonym-error"],
          ["hefty", "synonym-error"]
          ],
          "Slender describes someone or something that is gracefully thin or slim."
        ),
      },
      {
        subtopic: "synonyms",
        ...q(
          "Choose the correct synonym of the word 'commence':",
          "begin",
          [
          ["conclude", "synonym-error"],
          ["terminate", "synonym-error"],
          ["finish", "synonym-error"]
          ],
          "To commence means to start or begin an activity or formal ceremony."
        ),
      },
      {
        subtopic: "synonyms",
        ...q(
          "Choose the correct synonym of the word 'obstacle':",
          "barrier",
          [
          ["assistance", "synonym-error"],
          ["pathway", "synonym-error"],
          ["solution", "synonym-error"]
          ],
          "An obstacle is an obstruction or barrier that hinders progress."
        ),
      },
      {
        subtopic: "antonyms",
        ...q(
          "Choose the correct antonym of the word 'humble':",
          "arrogant",
          [
          ["modest", "antonym-error"],
          ["meek", "antonym-error"],
          ["polite", "antonym-error"]
          ],
          "Humble means having or showing a modest estimate of oneself; arrogant means overly proud."
        ),
      },
      {
        subtopic: "antonyms",
        ...q(
          "Choose the correct antonym of the word 'rigid':",
          "flexible",
          [
          ["stiff", "antonym-error"],
          ["firm", "antonym-error"],
          ["unyielding", "antonym-error"]
          ],
          "Rigid means stiff and unable to bend; flexible means easily bent without breaking."
        ),
      },
      {
        subtopic: "antonyms",
        ...q(
          "Choose the correct antonym of the word 'innocent':",
          "guilty",
          [
          ["pure", "antonym-error"],
          ["harmless", "antonym-error"],
          ["blameless", "antonym-error"]
          ],
          "Innocent means free from moral wrong or guilt; guilty means responsible for a wrong deed."
        ),
      },
      {
        subtopic: "antonyms",
        ...q(
          "Choose the correct antonym of the word 'expand':",
          "contract",
          [
          ["broaden", "antonym-error"],
          ["enlarge", "antonym-error"],
          ["extend", "antonym-error"]
          ],
          "To expand means to increase in size or volume; to contract means to shrink or decrease."
        ),
      },
      {
        subtopic: "antonyms",
        ...q(
          "Choose the correct antonym of the word 'hostile':",
          "friendly",
          [
          ["antagonistic", "antonym-error"],
          ["aggressive", "antonym-error"],
          ["unfriendly", "antonym-error"]
          ],
          "Hostile means showing open enmity or opposition; friendly means kind and welcoming."
        ),
      },
      {
        subtopic: "context-pairs",
        ...q(
          "Fill in the blank: 'The doctor gave clear advice to avoid ___ sugar intake.'",
          "excessive",
          [
          ["moderate", "context-word-choice"],
          ["scanty", "context-word-choice"],
          ["limited", "context-word-choice"]
          ],
          "Excessive means more than is necessary, normal, or desirable."
        ),
      },
      {
        subtopic: "context-pairs",
        ...q(
          "Fill in the blank: 'The lost travellers found a ___ cave during the snowstorm and stayed warm and safe.'",
          "sheltered",
          [
          ["exposed", "context-word-choice"],
          ["dangerous", "context-word-choice"],
          ["bleak", "context-word-choice"]
          ],
          "A sheltered cave provides protection from wind, snow, and rain."
        ),
      },
      {
        subtopic: "context-pairs",
        ...q(
          "Select the word that correctly replaces the bracketed words: 'The magician made the rabbit [stop being seen].'",
          "vanish",
          [
          ["appear", "context-word-choice"],
          ["multiply", "context-word-choice"],
          ["escape", "context-word-choice"]
          ],
          "Vanish specifically means to pass out of sight quickly or mysteriously."
        ),
      },
      {
        subtopic: "context-pairs",
        ...q(
          "Fill in the blank: 'The speaker gave a ___ summary that lasted only two minutes.'",
          "concise",
          [
          ["lengthy", "context-word-choice"],
          ["wordy", "context-word-choice"],
          ["rambling", "context-word-choice"]
          ],
          "Concise means expressing much in few words, brief and to the point."
        ),
      },
      {
        subtopic: "context-pairs",
        ...q(
          "Select the opposite of the bracketed word: 'The soldiers made a [valiant] attempt to hold the bridge.'",
          "cowardly",
          [
          ["heroic", "context-word-choice"],
          ["fearless", "context-word-choice"],
          ["spirited", "context-word-choice"]
          ],
          "Valiant means brave or courageous; its opposite is cowardly."
        ),
      },
  ],
  "wp-spelling-warmup": [
      {
        subtopic: "tricky-vowels",
        ...q(
          "Choose the correct spelling of the word that means 'distinct or apart':",
          "separate",
          [
          ["seperate", "spelling-vowel-trap"],
          ["separete", "spelling-vowel-trap"],
          ["seperete", "spelling-vowel-trap"]
          ],
          "Separate has an 'a' in the middle: s-e-p-a-r-a-t-e (remember: a rat in separate)."
        ),
      },
      {
        subtopic: "double-letters",
        ...q(
          "Choose the correct spelling of the word that means 'required or needed':",
          "necessary",
          [
          ["neccessary", "spelling-double-consonant"],
          ["necesary", "spelling-double-consonant"],
          ["necessery", "spelling-double-consonant"]
          ],
          "Necessary has one 'c' and double 's': n-e-c-e-s-s-a-r-y."
        ),
      },
      {
        subtopic: "ie-ei-rules",
        ...q(
          "Choose the correct spelling of the word meaning 'to get or obtain':",
          "receive",
          [
          ["recieve", "spelling-ie-ei-rule"],
          ["receeve", "spelling-ie-ei-rule"],
          ["receivee", "spelling-ie-ei-rule"]
          ],
          "Under the rule 'i before e except after c', receive is spelled r-e-c-e-i-v-e."
        ),
      },
      {
        subtopic: "tricky-vowels",
        ...q(
          "Choose the correct spelling of the word meaning 'rules of language':",
          "grammar",
          [
          ["grammer", "spelling-vowel-trap"],
          ["gramar", "spelling-vowel-trap"],
          ["gramer", "spelling-vowel-trap"]
          ],
          "Grammar ends with -ar, not -er: g-r-a-m-m-a-r."
        ),
      },
      {
        subtopic: "tricky-vowels",
        ...q(
          "Choose the correct spelling of the word meaning 'the natural world':",
          "environment",
          [
          ["enviroment", "spelling-vowel-trap"],
          ["enviornment", "spelling-vowel-trap"],
          ["environmant", "spelling-vowel-trap"]
          ],
          "Environment retains the silent 'n' before m: e-n-v-i-r-o-n-m-e-n-t."
        ),
      },
      {
        subtopic: "tricky-vowels",
        ...q(
          "Choose the correct spelling of the word meaning 'certain or fixed':",
          "definite",
          [
          ["definate", "spelling-vowel-trap"],
          ["defanite", "spelling-vowel-trap"],
          ["definit", "spelling-vowel-trap"]
          ],
          "Definite contains the root 'finite' and ends in -ite: d-e-f-i-n-i-t-e."
        ),
      },
      {
        subtopic: "double-letters",
        ...q(
          "Choose the correct spelling of the word meaning 'to provide lodging':",
          "accommodate",
          [
          ["accomodate", "spelling-double-consonant"],
          ["acommodate", "spelling-double-consonant"],
          ["acomodate", "spelling-double-consonant"]
          ],
          "Accommodate has double 'c' and double 'm': a-c-c-o-m-m-o-d-a-t-e."
        ),
      },
      {
        subtopic: "tricky-vowels",
        ...q(
          "Choose the correct spelling of the word meaning 'a special right or advantage':",
          "privilege",
          [
          ["privelege", "spelling-vowel-trap"],
          ["priviledge", "spelling-vowel-trap"],
          ["privilige", "spelling-vowel-trap"]
          ],
          "Privilege has no 'd' and is spelled p-r-i-v-i-l-e-g-e."
        ),
      },
  ],
  "wp-spelling-rules-quiz": [
      {
        subtopic: "ie-ei-rules",
        ...q(
          "Choose the correctly spelt word that follows the 'i before e except after c' rule:",
          "ceiling",
          [
          ["cieling", "spelling-ie-ei-rule"],
          ["ceeling", "spelling-ie-ei-rule"],
          ["ceilinge", "spelling-ie-ei-rule"]
          ],
          "Because the diphthong follows 'c', it takes 'ei': c-e-i-l-i-n-g."
        ),
      },
      {
        subtopic: "ie-ei-rules",
        ...q(
          "Choose the correctly spelt word meaning 'trust or faith':",
          "belief",
          [
          ["beleif", "spelling-ie-ei-rule"],
          ["beleefe", "spelling-ie-ei-rule"],
          ["bilief", "spelling-ie-ei-rule"]
          ],
          "When not preceded by 'c', the standard rule is 'i before e': b-e-l-i-e-f."
        ),
      },
      {
        subtopic: "ie-ei-rules",
        ...q(
          "Choose the correctly spelt word meaning 'a person who steals':",
          "thief",
          [
          ["theif", "spelling-ie-ei-rule"],
          ["theefe", "spelling-ie-ei-rule"],
          ["thife", "spelling-ie-ei-rule"]
          ],
          "Thief follows the regular pattern with 'ie': t-h-i-e-f."
        ),
      },
      {
        subtopic: "ie-ei-rules",
        ...q(
          "Choose the correctly spelt word meaning 'to mislead or trick someone':",
          "deceive",
          [
          ["decieve", "spelling-ie-ei-rule"],
          ["deceeve", "spelling-ie-ei-rule"],
          ["decievee", "spelling-ie-ei-rule"]
          ],
          "Deceive follows the letter 'c', so 'e' precedes 'i': d-e-c-e-i-v-e."
        ),
      },
      {
        subtopic: "ie-ei-rules",
        ...q(
          "Choose the correctly spelt word meaning 'a piece of land or sports ground':",
          "field",
          [
          ["feild", "spelling-ie-ei-rule"],
          ["feeld", "spelling-ie-ei-rule"],
          ["feilde", "spelling-ie-ei-rule"]
          ],
          "Field is spelled with 'ie': f-i-e-l-d."
        ),
      },
      {
        subtopic: "ie-ei-rules",
        ...q(
          "Choose the correctly spelt word meaning 'to accomplish or succeed':",
          "achieve",
          [
          ["acheive", "spelling-ie-ei-rule"],
          ["acheeve", "spelling-ie-ei-rule"],
          ["achiive", "spelling-ie-ei-rule"]
          ],
          "Achieve is spelled with 'ie' after 'ch': a-c-h-i-e-v-e."
        ),
      },
  ],
  "wp-spelling-gate-pool": [
      {
        subtopic: "double-letters",
        ...q(
          "Choose the correct spelling of the word meaning 'to feel self-conscious or ashamed':",
          "embarrass",
          [
          ["embarass", "spelling-double-consonant"],
          ["emberrass", "spelling-double-consonant"],
          ["embaras", "spelling-double-consonant"]
          ],
          "Embarrass has double 'r' and double 's': e-m-b-a-r-r-a-s-s."
        ),
      },
      {
        subtopic: "double-letters",
        ...q(
          "Choose the correct spelling of the word meaning 'a particular event or time':",
          "occasion",
          [
          ["ocassion", "spelling-double-consonant"],
          ["occassion", "spelling-double-consonant"],
          ["ocasion", "spelling-double-consonant"]
          ],
          "Occasion has double 'c' but single 's': o-c-c-a-s-i-o-n."
        ),
      },
      {
        subtopic: "double-letters",
        ...q(
          "Choose the correct spelling of the word meaning 'happened, past tense of occur':",
          "occurred",
          [
          ["occured", "spelling-double-consonant"],
          ["ocurred", "spelling-double-consonant"],
          ["ocured", "spelling-double-consonant"]
          ],
          "Occurred doubles the 'r' before -ed: o-c-c-u-r-r-e-d."
        ),
      },
      {
        subtopic: "double-letters",
        ...q(
          "Choose the correct spelling of the word meaning 'a group formed for a specific task':",
          "committee",
          [
          ["comittee", "spelling-double-consonant"],
          ["commitee", "spelling-double-consonant"],
          ["comite", "spelling-double-consonant"]
          ],
          "Committee features double 'm', double 't', and double 'e': c-o-m-m-i-t-t-e-e."
        ),
      },
      {
        subtopic: "double-letters",
        ...q(
          "Choose the correct spelling of the word meaning 'starting point':",
          "beginning",
          [
          ["begining", "spelling-double-consonant"],
          ["beggining", "spelling-double-consonant"],
          ["begginning", "spelling-double-consonant"]
          ],
          "Beginning doubles the 'n' after the short vowel: b-e-g-i-n-n-i-n-g."
        ),
      },
      {
        subtopic: "ie-ei-rules",
        ...q(
          "Choose the correctly spelt word meaning 'how heavy something is':",
          "weight",
          [
          ["wieght", "spelling-ie-ei-rule"],
          ["waight", "spelling-ie-ei-rule"],
          ["wight", "spelling-ie-ei-rule"]
          ],
          "Weight produces an 'ay' sound, which is spelled 'ei': w-e-i-g-h-t."
        ),
      },
      {
        subtopic: "ie-ei-rules",
        ...q(
          "Choose the correctly spelt word meaning 'the daughter of a brother or sister':",
          "niece",
          [
          ["neice", "spelling-ie-ei-rule"],
          ["neece", "spelling-ie-ei-rule"],
          ["neise", "spelling-ie-ei-rule"]
          ],
          "Niece is spelled with 'ie': n-i-e-c-e."
        ),
      },
      {
        subtopic: "ie-ei-rules",
        ...q(
          "Choose the correctly spelt word meaning 'unusual or odd':",
          "weird",
          [
          ["wierd", "spelling-ie-ei-rule"],
          ["weerd", "spelling-ie-ei-rule"],
          ["wird", "spelling-ie-ei-rule"]
          ],
          "Weird is an exception to the regular rule, spelled w-e-i-r-d."
        ),
      },
      {
        subtopic: "ie-ei-rules",
        ...q(
          "Choose the correctly spelt word meaning 'a written proof of payment':",
          "receipt",
          [
          ["reciept", "spelling-ie-ei-rule"],
          ["receete", "spelling-ie-ei-rule"],
          ["receite", "spelling-ie-ei-rule"]
          ],
          "Receipt follows 'c', so 'ei' is used, along with silent 'p': r-e-c-e-i-p-t."
        ),
      },
      {
        subtopic: "ie-ei-rules",
        ...q(
          "Choose the correctly spelt word meaning 'a person living next door':",
          "neighbour",
          [
          ["nieghbour", "spelling-ie-ei-rule"],
          ["naybour", "spelling-ie-ei-rule"],
          ["naighbour", "spelling-ie-ei-rule"]
          ],
          "In British English, neighbour is spelled with 'ei' and 'our': n-e-i-g-h-b-o-u-r."
        ),
      },
      {
        subtopic: "tricky-vowels",
        ...q(
          "Choose the correct spelling of the word meaning 'easy to see or observe':",
          "noticeable",
          [
          ["noticable", "spelling-vowel-trap"],
          ["notisable", "spelling-vowel-trap"],
          ["notiseable", "spelling-vowel-trap"]
          ],
          "Noticeable retains the 'e' to preserve the soft 'c' sound: n-o-t-i-c-e-a-b-l-e."
        ),
      },
      {
        subtopic: "tricky-vowels",
        ...q(
          "Choose the correct spelling of the word meaning 'a chart of the days and months of a year':",
          "calendar",
          [
          ["calender", "spelling-vowel-trap"],
          ["calandar", "spelling-vowel-trap"],
          ["calander", "spelling-vowel-trap"]
          ],
          "Calendar ends in -ar, not -er: c-a-l-e-n-d-a-r."
        ),
      },
      {
        subtopic: "tricky-vowels",
        ...q(
          "Choose the correct spelling of the word meaning 'coming after the eleventh':",
          "twelfth",
          [
          ["twelveth", "spelling-vowel-trap"],
          ["twelth", "spelling-vowel-trap"],
          ["twelfeth", "spelling-vowel-trap"]
          ],
          "Twelfth uses an 'f' before the -th ending: t-w-e-l-f-t-h."
        ),
      },
      {
        subtopic: "tricky-vowels",
        ...q(
          "Choose the correct spelling of the word meaning 'gratefulness':",
          "gratitude",
          [
          ["greatitude", "spelling-vowel-trap"],
          ["graditude", "spelling-vowel-trap"],
          ["grattitude", "spelling-vowel-trap"]
          ],
          "Gratitude is spelled g-r-a-t-i-t-u-d-e, from the Latin root gratus."
        ),
      },
      {
        subtopic: "tricky-vowels",
        ...q(
          "Choose the correct spelling of the word meaning 'a person you work with':",
          "colleague",
          [
          ["collegue", "spelling-vowel-trap"],
          ["colleage", "spelling-vowel-trap"],
          ["coleague", "spelling-vowel-trap"]
          ],
          "Colleague is spelled c-o-l-l-e-a-g-u-e."
        ),
      },
  ],
  "wp-colloc-warmup": [
      {
        subtopic: "movement-sounds",
        ...q(
          "Fill in the blank with the natural word choice: 'A cool evening breeze made the candle flame ___.'",
          "flicker",
          [
          ["shiver", "collocation-verb-choice"],
          ["tremble", "collocation-verb-choice"],
          ["wobble", "collocation-verb-choice"]
          ],
          "Flames flicker in a breeze; people shiver from cold and voices tremble from nervousness."
        ),
      },
      {
        subtopic: "movement-sounds",
        ...q(
          "Fill in the blank: 'Standing in the cold rain made the poor child ___ with chill.'",
          "shiver",
          [
          ["flicker", "collocation-verb-choice"],
          ["sparkle", "collocation-verb-choice"],
          ["flutter", "collocation-verb-choice"]
          ],
          "People shiver when they feel very cold, shaking involuntarily."
        ),
      },
      {
        subtopic: "natural-partners",
        ...q(
          "Fill in the blank: 'The dark sky brought ___ rain that flooded the school yard.'",
          "torrential",
          [
          ["heavyweight", "collocation-adjective-choice"],
          ["solid", "collocation-adjective-choice"],
          ["broad", "collocation-adjective-choice"]
          ],
          "We say torrential rain or heavy downpour to describe violent, heavy rainstorms."
        ),
      },
      {
        subtopic: "idiomatic-collocations",
        ...q(
          "Fill in the blank: 'The captain told the crew to ___ an effort to reach the harbour.'",
          "make",
          [
          ["do", "collocation-make-do"],
          ["build", "collocation-make-do"],
          ["create", "collocation-make-do"]
          ],
          "The standard collocation in English is to make an effort (we do work or research, but make an effort)."
        ),
      },
      {
        subtopic: "idiomatic-collocations",
        ...q(
          "Fill in the blank: 'Hearing the joyful joke made the whole classroom ___ into laughter.'",
          "burst",
          [
          ["break", "collocation-burst-phrase"],
          ["shatter", "collocation-burst-phrase"],
          ["crack", "collocation-burst-phrase"]
          ],
          "The natural English expression is to burst into laughter (or burst into tears)."
        ),
      },
      {
        subtopic: "movement-sounds",
        ...q(
          "Fill in the blank: 'Dry yellow autumn leaves ___ under our boots as we walked through the woods.'",
          "rustled",
          [
          ["screeched", "collocation-sound-verb"],
          ["clanged", "collocation-sound-verb"],
          ["banged", "collocation-sound-verb"]
          ],
          "Dry leaves rustle when moved or walked upon, making a soft crackling sound."
        ),
      },
      {
        subtopic: "natural-partners",
        ...q(
          "Fill in the blank: 'The morning valley was covered in ___ fog, reducing visibility to ten metres.'",
          "dense",
          [
          ["deep", "collocation-adjective-choice"],
          ["weighty", "collocation-adjective-choice"],
          ["hard", "collocation-adjective-choice"]
          ],
          "Fog is described as dense or thick, never heavy or weighty."
        ),
      },
      {
        subtopic: "natural-partners",
        ...q(
          "Fill in the blank: 'A royal ___ of horse carriages paraded down the wide avenue.'",
          "cavalcade",
          [
          ["herd", "collocation-group-noun"],
          ["pack", "collocation-group-noun"],
          ["school", "collocation-group-noun"]
          ],
          "A formal procession of riders or vehicles is called a cavalcade."
        ),
      },
  ],
  "wp-colloc-nature-quiz": [
      {
        subtopic: "natural-partners",
        ...q(
          "Fill in the blank: 'The explorer warned us of the ___ heat in the middle of the desert.'",
          "scorching",
          [
          ["fried", "collocation-adjective-choice"],
          ["toasted", "collocation-adjective-choice"],
          ["boiled", "collocation-adjective-choice"]
          ],
          "Scorching heat or sweltering heat is the standard, natural collocation for intense atmospheric heat."
        ),
      },
      {
        subtopic: "movement-sounds",
        ...q(
          "Fill in the blank: 'The little brook ___ gently over the smooth round pebbles.'",
          "murmured",
          [
          ["shouted", "collocation-sound-verb"],
          ["roared", "collocation-sound-verb"],
          ["screamed", "collocation-sound-verb"]
          ],
          "A quiet, flowing stream is said to murmur or babble peacefully."
        ),
      },
      {
        subtopic: "natural-partners",
        ...q(
          "Fill in the blank: 'During the winter storm, a ___ wind blew across the open rooftop.'",
          "howling",
          [
          ["crying", "collocation-adjective-choice"],
          ["barking", "collocation-adjective-choice"],
          ["growling", "collocation-adjective-choice"]
          ],
          "Strong, violent gale winds are naturally described as howling winds."
        ),
      },
      {
        subtopic: "idiomatic-collocations",
        ...q(
          "Fill in the blank: 'The brave firefighter decided to ___ the risk and enter the burning room.'",
          "take",
          [
          ["have", "collocation-take-risk"],
          ["make", "collocation-take-risk"],
          ["hold", "collocation-take-risk"]
          ],
          "The established idiom is to take a risk (or run a risk)."
        ),
      },
      {
        subtopic: "movement-sounds",
        ...q(
          "Fill in the blank: 'Old wooden floorboards ___ under the weight of the night visitor.'",
          "creaked",
          [
          ["tinkled", "collocation-sound-verb"],
          ["chimed", "collocation-sound-verb"],
          ["hummed", "collocation-sound-verb"]
          ],
          "Wooden planks and floorboards creak under pressure or age."
        ),
      },
      {
        subtopic: "idiomatic-collocations",
        ...q(
          "Fill in the blank: 'The speaker stopped to ___ his throat before starting the lecture.'",
          "clear",
          [
          ["clean", "collocation-clear-throat"],
          ["wash", "collocation-clear-throat"],
          ["sweep", "collocation-clear-throat"]
          ],
          "The standard expression for making a small cough to speak clearly is to clear one's throat."
        ),
      },
  ],
  "wp-colloc-gate-pool": [
      {
        subtopic: "movement-sounds",
        ...q(
          "Fill in the blank: 'The nervous student spoke with a voice that began to ___.'",
          "tremble",
          [
          ["stumble", "collocation-verb-choice"],
          ["flicker", "collocation-verb-choice"],
          ["shiver", "collocation-verb-choice"]
          ],
          "Voices and hands tremble when someone experiences anxiety, fear, or deep emotion."
        ),
      },
      {
        subtopic: "movement-sounds",
        ...q(
          "Fill in the blank: 'The lion opened its giant jaws and released a ___ roar.'",
          "deafening",
          [
          ["blinding", "collocation-adjective-choice"],
          ["crushing", "collocation-adjective-choice"],
          ["weighty", "collocation-adjective-choice"]
          ],
          "A roar or thunderous sound so loud it hurts the ears is described as deafening."
        ),
      },
      {
        subtopic: "movement-sounds",
        ...q(
          "Fill in the blank: 'Dry twigs ___ under the paws of the approaching tiger.'",
          "snapped",
          [
          ["chimed", "collocation-sound-verb"],
          ["hummed", "collocation-sound-verb"],
          ["groaned", "collocation-sound-verb"]
          ],
          "Dry wooden sticks and twigs snap sharply when stepped on."
        ),
      },
      {
        subtopic: "movement-sounds",
        ...q(
          "Fill in the blank: 'Tiny raindrops began to ___ against the glass windowpane.'",
          "patter",
          [
          ["stomp", "collocation-sound-verb"],
          ["pound", "collocation-sound-verb"],
          ["slam", "collocation-sound-verb"]
          ],
          "Light rain makes a gentle tapping sound known as pattering."
        ),
      },
      {
        subtopic: "movement-sounds",
        ...q(
          "Fill in the blank: 'The rusted metal gate ___ loudly as the wind pushed it open.'",
          "groaned",
          [
          ["murmured", "collocation-sound-verb"],
          ["babbled", "collocation-sound-verb"],
          ["whispered", "collocation-sound-verb"]
          ],
          "Heavy metal gates or hinges under strain groan or screech."
        ),
      },
      {
        subtopic: "natural-partners",
        ...q(
          "Fill in the blank: 'We sailed past a ___ of magnificent warships docked in the bay.'",
          "fleet",
          [
          ["flock", "collocation-group-noun"],
          ["swarm", "collocation-group-noun"],
          ["pack", "collocation-group-noun"]
          ],
          "A collection of ships or vessels sailing together is called a fleet."
        ),
      },
      {
        subtopic: "natural-partners",
        ...q(
          "Fill in the blank: 'The tourists were thrilled to spot a ___ of lions resting near the river.'",
          "pride",
          [
          ["herd", "collocation-group-noun"],
          ["flock", "collocation-group-noun"],
          ["colony", "collocation-group-noun"]
          ],
          "The collective noun for a family or group of lions is a pride."
        ),
      },
      {
        subtopic: "natural-partners",
        ...q(
          "Fill in the blank: 'A buzzing ___ of honeybees flew out of the old hollow trunk.'",
          "swarm",
          [
          ["school", "collocation-group-noun"],
          ["pack", "collocation-group-noun"],
          ["troop", "collocation-group-noun"]
          ],
          "A large gathering of flying insects like bees or wasps is a swarm."
        ),
      },
      {
        subtopic: "natural-partners",
        ...q(
          "Fill in the blank: 'The sudden storm caused a ___ sea with massive breaking waves.'",
          "rough",
          [
          ["harsh", "collocation-adjective-choice"],
          ["rigid", "collocation-adjective-choice"],
          ["sharp", "collocation-adjective-choice"]
          ],
          "We describe stormy, turbulent waters as a rough sea or choppy waters."
        ),
      },
      {
        subtopic: "natural-partners",
        ...q(
          "Fill in the blank: 'The chef added a ___ of salt to bring out the flavour of the soup.'",
          "pinch",
          [
          ["drop", "collocation-measure-noun"],
          ["slice", "collocation-measure-noun"],
          ["crumb", "collocation-measure-noun"]
          ],
          "The standard culinary collocation for a tiny amount of salt held between two fingers is a pinch."
        ),
      },
      {
        subtopic: "idiomatic-collocations",
        ...q(
          "Fill in the blank: 'Please ___ in mind that the museum closes early on Sundays.'",
          "keep",
          [
          ["hold", "collocation-idiom-phrase"],
          ["take", "collocation-idiom-phrase"],
          ["carry", "collocation-idiom-phrase"]
          ],
          "The standard idiom meaning to remember or take into consideration is to keep in mind."
        ),
      },
      {
        subtopic: "idiomatic-collocations",
        ...q(
          "Fill in the blank: 'We are all looking ___ to the exciting school annual picnic.'",
          "forward",
          [
          ["ahead", "collocation-phrasal-verb"],
          ["around", "collocation-phrasal-verb"],
          ["behind", "collocation-phrasal-verb"]
          ],
          "The phrasal collocation meaning to anticipate with pleasure is to look forward to."
        ),
      },
      {
        subtopic: "idiomatic-collocations",
        ...q(
          "Fill in the blank: 'The coach told the players to ___ their best in the final match.'",
          "do",
          [
          ["make", "collocation-make-do"],
          ["create", "collocation-make-do"],
          ["build", "collocation-make-do"]
          ],
          "The correct collocation is to do one's best (never 'make your best')."
        ),
      },
      {
        subtopic: "idiomatic-collocations",
        ...q(
          "Fill in the blank: 'Such golden opportunities happen only once in a ___ moon.'",
          "blue",
          [
          ["red", "collocation-idiom-phrase"],
          ["silver", "collocation-idiom-phrase"],
          ["gold", "collocation-idiom-phrase"]
          ],
          "The well-known English idiom 'once in a blue moon' means very rarely."
        ),
      },
      {
        subtopic: "idiomatic-collocations",
        ...q(
          "Fill in the blank: 'After walking for hours, the tired hikers decided to ___ a rest.'",
          "take",
          [
          ["do", "collocation-take-phrase"],
          ["perform", "collocation-take-phrase"],
          ["set", "collocation-take-phrase"]
          ],
          "The natural English expression is to take a rest (or have a rest)."
        ),
      },
  ],
  "wp-u1-test": [
      {
        subtopic: "synonyms",
        ...q(
          "Choose the correct synonym of the word 'valiant':",
          "courageous",
          [
          ["cowardly", "boss-synonym-valiant"],
          ["fearful", "boss-synonym-valiant"],
          ["hesitant", "boss-synonym-valiant"]
          ],
          "Valiant means possessing or showing courage or determination; courageous is an exact synonym."
        ),
      },
      {
        subtopic: "antonyms",
        ...q(
          "Choose the correct antonym of the word 'abundant':",
          "scarce",
          [
          ["copious", "boss-antonym-abundant"],
          ["plentiful", "boss-antonym-abundant"],
          ["lavish", "boss-antonym-abundant"]
          ],
          "Abundant means existing in large quantities; scarce means in short supply."
        ),
      },
      {
        subtopic: "antonyms",
        ...q(
          "Choose the word that means the OPPOSITE of 'cautious':",
          "reckless",
          [
          ["prudent", "boss-antonym-cautious"],
          ["careful", "boss-antonym-cautious"],
          ["vigilant", "boss-antonym-cautious"]
          ],
          "Cautious means careful to avoid danger; reckless means utterly careless of consequences."
        ),
      },
      {
        subtopic: "context-pairs",
        ...q(
          "Fill in the blank with the most fitting word: 'The diligent student showed great ___ before the final competition.'",
          "enthusiasm",
          [
          ["reluctance", "boss-context-enthusiasm"],
          ["indifference", "boss-context-enthusiasm"],
          ["laziness", "boss-context-enthusiasm"]
          ],
          "A diligent (hardworking) student exhibits keen interest and positive enthusiasm."
        ),
      },
      {
        subtopic: "synonyms",
        ...q(
          "Choose the synonym of 'commence':",
          "begin",
          [
          ["conclude", "boss-synonym-commence"],
          ["cease", "boss-synonym-commence"],
          ["halt", "boss-synonym-commence"]
          ],
          "Commence means to begin or start an action or ceremony."
        ),
      },
      {
        subtopic: "double-letters",
        ...q(
          "Choose the option with the CORRECT spelling:",
          "necessary",
          [
          ["neccessary", "boss-spell-necessary"],
          ["necesary", "boss-spell-necessary"],
          ["necessery", "boss-spell-necessary"]
          ],
          "Necessary has one 'c' and double 's': n-e-c-e-s-s-a-r-y."
        ),
      },
      {
        subtopic: "tricky-vowels",
        ...q(
          "Choose the option with the CORRECT spelling:",
          "separate",
          [
          ["seperate", "boss-spell-separate"],
          ["separete", "boss-spell-separate"],
          ["seperete", "boss-spell-separate"]
          ],
          "Separate is spelled with an 'a' in the middle: s-e-p-a-r-a-t-e."
        ),
      },
      {
        subtopic: "ie-ei-rules",
        ...q(
          "Choose the option with the CORRECT spelling following the 'after c' rule:",
          "receive",
          [
          ["recieve", "boss-spell-receive"],
          ["receeve", "boss-spell-receive"],
          ["receivee", "boss-spell-receive"]
          ],
          "In receive, 'e' precedes 'i' because it follows the letter 'c'."
        ),
      },
      {
        subtopic: "double-letters",
        ...q(
          "Choose the option with the CORRECT spelling:",
          "accommodate",
          [
          ["accomodate", "boss-spell-accommodate"],
          ["acommodate", "boss-spell-accommodate"],
          ["acomodate", "boss-spell-accommodate"]
          ],
          "Accommodate contains double 'c' and double 'm': a-c-c-o-m-m-o-d-a-t-e."
        ),
      },
      {
        subtopic: "double-letters",
        ...q(
          "Choose the option with the CORRECT spelling:",
          "embarrass",
          [
          ["embarass", "boss-spell-embarrass"],
          ["emberrass", "boss-spell-embarrass"],
          ["embaras", "boss-spell-embarrass"]
          ],
          "Embarrass has two 'r's and two 's's: e-m-b-a-r-r-a-s-s."
        ),
      },
      {
        subtopic: "movement-sounds",
        ...q(
          "Fill in the blank with the natural word choice: 'A sudden gust of wind made the candle flame ___.'",
          "flicker",
          [
          ["shiver", "boss-colloc-flicker"],
          ["tremble", "boss-colloc-flicker"],
          ["wobble", "boss-colloc-flicker"]
          ],
          "A flame flickers in the wind, whereas people shiver from cold and voices tremble with fear."
        ),
      },
      {
        subtopic: "natural-partners",
        ...q(
          "Fill in the blank: 'The dark clouds unleashed a ___ downpour that drenched the garden.'",
          "torrential",
          [
          ["solid", "boss-colloc-torrential"],
          ["thick", "boss-colloc-torrential"],
          ["heavyweight", "boss-colloc-torrential"]
          ],
          "A sudden, heavy rainstorm is naturally called a torrential downpour."
        ),
      },
      {
        subtopic: "idiomatic-collocations",
        ...q(
          "Fill in the blank: 'The school principal told the students to ___ an effort to keep the campus clean.'",
          "make",
          [
          ["do", "boss-colloc-make-effort"],
          ["create", "boss-colloc-make-effort"],
          ["build", "boss-colloc-make-effort"]
          ],
          "The standard English collocation is to make an effort."
        ),
      },
      {
        subtopic: "natural-partners",
        ...q(
          "Fill in the blank: 'The tourist was excited to see a royal ___ of horse carriages pass by.'",
          "cavalcade",
          [
          ["fleet", "boss-colloc-cavalcade"],
          ["flock", "boss-colloc-cavalcade"],
          ["pride", "boss-colloc-cavalcade"]
          ],
          "A formal procession of carriages or riders is a cavalcade."
        ),
      },
      {
        subtopic: "idiomatic-collocations",
        ...q(
          "Fill in the blank: 'Such magnificent solar eclipses occur only once in a ___ moon.'",
          "blue",
          [
          ["red", "boss-colloc-blue-moon"],
          ["green", "boss-colloc-blue-moon"],
          ["golden", "boss-colloc-blue-moon"]
          ],
          "The idiom 'once in a blue moon' denotes an extremely rare event."
        ),
      },
  ],
  "wp-dialogue-warmup": [
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
          ["You are most welcome", "dialogue-social-etiquette"],
          ["Never mind at all", "dialogue-social-etiquette"],
          ["Please don't mention", "dialogue-social-etiquette"]
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
  "wp-dialogue-practice-quiz": [
      {
        subtopic: "polite-requests",
        ...q(
          "Choose the polite option to complete the conversation:\nPassenger: 'Could you please tell me the platform for the Rajdhani Express?'\nRailway clerk: '___, it arrives on Platform 3.'",
          "Certainly",
          [
          ["Hardly ever", "dialogue-polite-reply"],
          ["Never indeed", "dialogue-polite-reply"],
          ["Seldom so", "dialogue-polite-reply"]
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
          ["You are welcome", "dialogue-apology-response"],
          ["Please don't mention", "dialogue-apology-response"],
          ["Same to you", "dialogue-apology-response"]
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
          ["Hardly possible", "dialogue-polite-reply"],
          ["Not at all", "dialogue-polite-reply"],
          ["By no chance", "dialogue-polite-reply"]
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
          ["Never mind", "dialogue-social-etiquette"],
          ["You are welcome", "dialogue-social-etiquette"],
          ["Don't mention it", "dialogue-social-etiquette"]
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
  "wp-dialogue-gate-pool": [
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
          ["Certainly not", "dialogue-apology-response"],
          ["Yes of course", "dialogue-apology-response"],
          ["Don't worry about it", "dialogue-apology-response"]
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
          ["Yes please", "dialogue-polite-refusal"],
          ["Never mind", "dialogue-polite-refusal"],
          ["It does not matter", "dialogue-polite-refusal"]
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
          ["direct you", "dialogue-polite-offer"],
          ["remind you", "dialogue-polite-offer"],
          ["inform you", "dialogue-polite-offer"]
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
          ["Never mind that", "dialogue-social-etiquette"],
          ["You are welcome", "dialogue-social-etiquette"],
          ["Same to you", "dialogue-social-etiquette"]
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
          ["ordinary news", "dialogue-congratulations"],
          ["expected news", "dialogue-congratulations"],
          ["common news", "dialogue-congratulations"]
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
          "Complete the dialogue:\nInterviewer: 'What made you choose astronomy as a career?'\nScientist: 'A visit to the planetarium ___ my eye and inspired me.'",
          "caught",
          [
          ["held", "dialogue-verb-colloc"],
          ["snared", "dialogue-verb-colloc"],
          ["grabbed", "dialogue-verb-colloc"]
          ],
          "The idiom 'to catch someone's eye' means to attract someone's attention or interest."
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
  "wp-idioms-warmup": [
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
  "wp-idioms-practice-quiz": [
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
  "wp-idioms-gate-pool": [
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
          "Choose the meaning of the idiom: ‘the lion’s share’",
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
  "wp-u2-test": [
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
          ["Don't mention it to anyone", "boss-dial-pleasure"],
          ["You are most welcome", "boss-dial-pleasure"],
          ["Never mind at all", "boss-dial-pleasure"]
          ],
          "The formal, polite reply to a host thanking a guest is 'The pleasure was all ours'."
        ),
      },
      {
        subtopic: "polite-requests",
        ...q(
          "Complete the conversation:\nAman: 'Shall we invite our neighbours to the Diwali celebration?'\nMother: '___, that is a kind idea!'",
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
      {
        subtopic: "polite-requests",
        ...q(
          "Complete the conversation:\nDoctor: 'Take these medicines twice a day after meals.'\nPatient: '___, doctor, I will follow your advice.'",
          "Thank you very much",
          [
          ["Why should I", "boss-dial-polite"],
          ["Never mind that", "boss-dial-polite"],
          ["Do not tell me", "boss-dial-polite"]
          ],
          "Expressing gratitude politely with 'Thank you very much' is appropriate after receiving medical advice."
        ),
      },
      {
        subtopic: "everyday-conversations",
        ...q(
          "Complete the telephone exchange:\nCaller: 'May I speak with Mrs. Sharma, please?'\nReceptionist: '___, I will connect your call to her office.'",
          "Hold the line for a moment",
          [
          ["Speak louder please", "boss-dial-phone"],
          ["Call back tomorrow morning", "boss-dial-phone"],
          ["She does not want to talk", "boss-dial-phone"]
          ],
          "The standard professional telephone phrase when transferring a call is 'Hold the line for a moment'."
        ),
      },
      {
        subtopic: "popular-sayings",
        ...q(
          "Choose the meaning of the idiom: 'piece of cake'",
          "a task that is very easy to accomplish",
          [
          ["a sweet dessert served at birthday parties", "boss-idiom-cake"],
          ["a heavy wooden box used for storage", "boss-idiom-cake"],
          ["a difficult puzzle that takes hours", "boss-idiom-cake"]
          ],
          "Describing a task as a piece of cake means it is simple, effortless, and straightforward."
        ),
      },
      {
        subtopic: "animal-nature-idioms",
        ...q(
          "Fill in the blank to complete the idiom: 'The cricket captain told the team to keep their fingers ___ for good weather.'",
          "crossed",
          [
          ["folded", "boss-idiom-fingers"],
          ["closed", "boss-idiom-fingers"],
          ["pointed", "boss-idiom-fingers"]
          ],
          "To keep one's fingers crossed means to hope for good luck or a favourable outcome."
        ),
      },
      {
        subtopic: "action-phrases",
        ...q(
          "Choose the meaning of the idiom: 'break the ice'",
          "make people feel comfortable in a social setting",
          [
          ["smash frozen ice cubes with a hammer", "boss-idiom-ice"],
          ["swim in cold mountain water during winter", "boss-idiom-ice"],
          ["carve ice sculptures for a festival", "boss-idiom-ice"]
          ],
          "To break the ice means to initiate conversation and ease social tension or stiffness among strangers."
        ),
      },
  ],

  "wp-synonyms-mix-1": [
    {
      subtopic: "synonyms",
      ...q(
        "Choose the synonym of the word 'liberty':",
        "freedom",
        [
        ["bondage", "synonym-error"],
        ["authority", "related-concept"],
        ["justice", "synonym-error"],
        ],
        "Liberty means the state of being free within society; freedom is its exact synonym."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Which word means the same as 'inspire'?",
        "encourage",
        [
        ["discourage", "antonym-error"],
        ["criticise", "negative-association"],
        ["overlook", "unrelated-action"],
        ],
        "To inspire someone means to encourage them and fill them with the urge or ability to do something creative."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Choose the synonym of the word 'destiny':",
        "fate",
        [
        ["choice", "antonym-error"],
        ["accident", "confused-concept"],
        ["past", "unrelated-concept"],
        ],
        "Destiny refers to events that will necessarily happen to a person in the future; fate has the same meaning."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Which word is a synonym of 'diminish'?",
        "lessen",
        [
        ["expand", "antonym-error"],
        ["belittle", "confused-meaning"],
        ["remain", "lack-of-change"],
        ],
        "To diminish means to make or become less; lessen is its direct synonym. Belittle means to dismiss as unimportant."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Choose the word that means the same as 'chide':",
        "scold",
        [
        ["praise", "antonym-error"],
        ["comfort", "opposite-tone"],
        ["forgive", "contrasting-response"],
        ],
        "To chide someone means to scold, rebuke, or express mild disapproval."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Which word means the same as 'petrify'?",
        "terrify",
        [
        ["soothe", "antonym-error"],
        ["surprise", "weaker-emotion"],
        ["confuse", "misinterpreted-feeling"],
        ],
        "To petrify means to frighten someone so severely that they are unable to move; terrify is its synonym."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Choose the synonym of the word 'strive':",
        "try hard",
        [
        ["slow down", "antonym-error"],
        ["give up", "antonym-error"],
        ["hesitate", "indecision"],
        ],
        "To strive means to try very hard to do something, like 'She strives to win the race.'"
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Which word means the same as 'slumber'?",
        "sleep",
        [
        ["wander", "unrelated-action"],
        ["awaken", "antonym-error"],
        ["daydream", "related-concept"],
        ],
        "Slumber is a literary or gentle word for sleep."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Choose the synonym of 'remote' in: 'The researchers stayed in a remote village.'",
        "distant",
        [
        ["crowded", "opposite-description"],
        ["nearby", "antonym-error"],
        ["modern", "unrelated-descriptor"],
        ],
        "In this context, remote means situated far from the main centres of population; distant is its synonym."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Which word is a synonym of 'vow'?",
        "promise",
        [
        ["request", "weaker-form"],
        ["threat", "negative-statement"],
        ["excuse", "evasive-statement"],
        ],
        "A vow is a solemn promise or pledge."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Choose the synonym of the word 'certainty':",
        "sureness",
        [
        ["doubt", "antonym-error"],
        ["hesitation", "lack-of-confidence"],
        ["suspicion", "uncertain-belief"],
        ],
        "Certainty means being completely sure about something, so sureness means the same."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Which word means the same as 'obedient'?",
        "dutiful",
        [
        ["defiant", "antonym-error"],
        ["devoted", "confused-concept"],
        ["careless", "unrelated-trait"],
        ],
        "Obedient means complying with orders or rules; dutiful is its proper synonym. Devoted means loving and loyal."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Choose the synonym of the word 'coax':",
        "persuade",
        [
        ["command", "forceful-demand"],
        ["threaten", "negative-pressure"],
        ["tempt", "enticement-trap"],
        ],
        "To coax means to persuade someone gently and gradually to do something."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Which word means the same as 'agony'?",
        "anguish",
        [
        ["comfort", "antonym-error"],
        ["relief", "opposite-state"],
        ["fatigue", "tiredness-confusion"],
        ],
        "Agony refers to extreme physical or mental suffering; anguish is its direct synonym."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Choose the synonym of the word 'recommend':",
        "suggest",
        [
        ["oppose", "antonym-error"],
        ["criticise", "negative-reaction"],
        ["disallow", "forbidding-action"],
        ],
        "To recommend means to put forward someone or something with approval as being suitable; suggest is its synonym."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Which word means the same as 'ambition'?",
        "aspiration",
        [
        ["reluctance", "opposite-attitude"],
        ["hesitation", "lack-of-resolve"],
        ["obstacle", "barrier-concept"],
        ],
        "Ambition is a strong desire to do or achieve something; aspiration is its synonym."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Choose the synonym of the word 'voyage':",
        "journey",
        [
        ["shelter", "resting-place"],
        ["arrival", "end-of-travel"],
        ["residence", "permanent-stay"],
        ],
        "A voyage is a long journey involving travel by sea or in space."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Which word means the same as 'scared'?",
        "frightened",
        [
        ["courageous", "antonym-error"],
        ["confident", "opposite-attitude"],
        ["reckless", "unrelated-trait"],
        ],
        "Scared means fearful or frightened."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Choose the synonym of the word 'repulsive':",
        "revolting",
        [
        ["attractive", "antonym-error"],
        ["delightful", "opposite-sensation"],
        ["curious", "unrelated-meaning"],
        ],
        "Repulsive means so nasty that you want to turn away; revolting means the same."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Choose the synonym of 'blink' in: 'Streetlamps began to blink across the misty pier.'",
        "flicker",
        [
        ["darken", "opposite-state"],
        ["blaze", "intense-shining"],
        ["scorch", "heat-damage"],
        ],
        "When lights blink, they flash on and off rapidly or flicker."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Which word means the same as 'beguile'?",
        "charm",
        [
        ["disgust", "opposite-feeling"],
        ["frighten", "opposite-reaction"],
        ["warn", "helpful-caution"],
        ],
        "To beguile means to charm or enchant someone, sometimes in a deceptive way."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Choose the synonym of the word 'realise':",
        "understand",
        [
        ["overlook", "antonym-error"],
        ["disregard", "intentional-neglect"],
        ["misjudge", "incorrect-assessment"],
        ],
        "To realise means to become fully aware of something as a fact, or to understand clearly."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Which word means the same as 'outstanding'?",
        "remarkable",
        [
        ["ordinary", "antonym-error"],
        ["mediocre", "average-quality"],
        ["familiar", "unexceptional"],
        ],
        "Outstanding means exceptionally good or clearly superior; remarkable is its synonym."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Choose the synonym of the word 'pioneer':",
        "trailblazer",
        [
        ["follower", "antonym-error"],
        ["spectator", "passive-observer"],
        ["novice", "inexperienced-beginner"],
        ],
        "A pioneer is a person who is among the first to explore or settle a new country or area; a trailblazer."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Which word means the same as 'sparse'?",
        "scanty",
        [
        ["abundant", "antonym-error"],
        ["plentiful", "antonym-error"],
        ["crowded", "opposite-density"],
        ],
        "Sparse means thinly dispersed or scattered; scanty is its synonym."
      ),
    },
  ],

  "wp-synonyms-mix-2": [
    {
      subtopic: "synonyms",
      ...q(
        "Choose the synonym of the word 'idle':",
        "inactive",
        [
        ["diligent", "antonym-error"],
        ["energetic", "antonym-error"],
        ["punctual", "unrelated-trait"],
        ],
        "Idle means not active or doing work; inactive is its synonym."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Which word is a synonym of 'evident'?",
        "obvious",
        [
        ["obscure", "antonym-error"],
        ["doubtful", "uncertain-belief"],
        ["concealed", "hidden-state"],
        ],
        "Evident means clearly seen or understood; obvious."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Choose the word that means the same as 'cruel':",
        "merciless",
        [
        ["compassionate", "antonym-error"],
        ["gentle", "antonym-error"],
        ["forgiving", "merciful-trait"],
        ],
        "Cruel means wilfully causing pain or suffering to others; merciless."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Which word means the same as 'wise'?",
        "judicious",
        [
        ["reckless", "antonym-error"],
        ["foolish", "antonym-error"],
        ["stubborn", "unrelated-flaw"],
        ],
        "Wise means having or showing experience, knowledge, and good judgment; judicious."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Choose the synonym of the word 'swift':",
        "rapid",
        [
        ["sluggish", "antonym-error"],
        ["awkward", "unrelated-trait"],
        ["cautious", "careful-approach"],
        ],
        "Swift means happening quickly or moving at high speed; rapid."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Which word means the same as 'ponder'?",
        "contemplate",
        [
        ["disregard", "antonym-error"],
        ["overlook", "failure-to-notice"],
        ["dismiss", "rejecting-thought"],
        ],
        "To ponder means to think about something carefully and deeply; contemplate."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Choose the synonym of the word 'eager':",
        "enthusiastic",
        [
        ["reluctant", "antonym-error"],
        ["indifferent", "lack-of-interest"],
        ["hesitant", "uncertainty"],
        ],
        "Eager means strongly wanting to do or have something; enthusiastic."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Which word is a synonym of 'fragile'?",
        "delicate",
        [
        ["sturdy", "antonym-error"],
        ["durable", "opposite-quality"],
        ["resilient", "tough-nature"],
        ],
        "Fragile means easily broken or damaged; delicate."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Choose the word that means the same as 'gaze':",
        "stare",
        [
        ["glance", "brief-look"],
        ["blink", "rapid-eye-action"],
        ["glimpse", "momentary-sight"],
        ],
        "To gaze means to look steadily and intently; stare."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Which word means the same as 'faithful'?",
        "loyal",
        [
        ["treacherous", "antonym-error"],
        ["unreliable", "opposite-trait"],
        ["deceitful", "dishonest-character"],
        ],
        "Faithful means remaining loyal and steadfast."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Choose the synonym of the word 'damp':",
        "moist",
        [
        ["arid", "antonym-error"],
        ["parched", "extreme-dryness"],
        ["scorched", "heat-dried"],
        ],
        "Damp means slightly wet or moist."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Which word means the same as 'enormous'?",
        "colossal",
        [
        ["diminutive", "antonym-error"],
        ["compact", "small-size"],
        ["modest", "moderate-size"],
        ],
        "Enormous means very large in size, quantity, or extent; colossal."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Choose the synonym of the word 'reality':",
        "actuality",
        [
        ["illusion", "opposite-concept"],
        ["fantasy", "imagined-world"],
        ["mirage", "deceptive-appearance"],
        ],
        "Reality refers to the state of things as they actually exist; actuality."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Which word means the same as 'gleeful'?",
        "jubilant",
        [
        ["mournful", "antonym-error"],
        ["sorrowful", "opposite-feeling"],
        ["discontented", "unhappy-state"],
        ],
        "Gleeful means exuberantly or triumphantly joyful; jubilant."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Which word is a synonym of 'feeble'?",
        "frail",
        [
        ["robust", "antonym-error"],
        ["vigorous", "opposite-trait"],
        ["mighty", "strong-character"],
        ],
        "Feeble means lacking physical strength, especially as a result of age or illness; frail."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Choose the word that means the same as 'delight':",
        "pleasure",
        [
        ["dismay", "antonym-error"],
        ["distress", "state-of-pain"],
        ["sorrow", "deep-unhappiness"],
        ],
        "Delight means great pleasure or satisfaction."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Which word means the same as 'courteous'?",
        "polite",
        [
        ["insolent", "antonym-error"],
        ["brusque", "abrupt-and-rude"],
        ["arrogant", "proud-behavior"],
        ],
        "Courteous means polite, respectful, or considerate in manner."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Choose the synonym of the word 'inquire':",
        "ask",
        [
        ["overlook", "ignore-detail"],
        ["reply", "answering-action"],
        ["finish", "ending-action"],
        ],
        "To inquire means to ask for information, like 'She inquired about the train times.'"
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Which word means the same as 'energy'?",
        "vigour",
        [
        ["lethargy", "antonym-error"],
        ["weariness", "tiredness-trait"],
        ["apathy", "lack-of-enthusiasm"],
        ],
        "Energy refers to physical or mental strength and vitality; vigour is spelled with 'our' in British English."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Choose the synonym of the word 'gentle':",
        "tender",
        [
        ["ferocious", "antonym-error"],
        ["turbulent", "rough-and-stormy"],
        ["abrasive", "harsh-texture"],
        ],
        "Gentle means having or showing a mild, kind, or tender temperament."
      ),
    },
    {
      subtopic: "synonyms",
      ...q(
        "Which word means the same as 'dignity'?",
        "nobility",
        [
        ["humiliation", "antonym-error"],
        ["disgrace", "shameful-state"],
        ["cowardice", "lack-of-bravery"],
        ],
        "Dignity means the state or quality of being worthy of honour or respect; nobility."
      ),
    },
  ],

  "wp-antonyms-mix-1": [
    {
      subtopic: "antonyms",
      ...q(
        "Choose the antonym of the word 'liability':",
        "asset",
        [
        ["burden", "synonym-error"],
        ["debt", "related-concept"],
        ["expense", "financial-category"],
        ],
        "A liability is something a person or company owes or a hindrance; an asset is a useful or valuable quality or possession."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Which word is an antonym of 'endure'?",
        "surrender",
        [
        ["tolerate", "synonym-error"],
        ["withstand", "synonym-error"],
        ["persist", "continuing-effort"],
        ],
        "To endure means to remain firm under suffering or hardship without yielding; to surrender or give up is its antonym."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Choose the opposite of the word 'private':",
        "public",
        [
        ["confidential", "synonym-error"],
        ["personal", "related-meaning"],
        ["exclusive", "restricted-access"],
        ],
        "Private means belonging to some particular person or group; public means open to all people."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Which word is the antonym of 'futile'?",
        "fruitful",
        [
        ["pointless", "synonym-error"],
        ["vain", "synonym-error"],
        ["hopeless", "negative-state"],
        ],
        "Futile means incapable of producing any useful result; fruitful or effective is its antonym."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Choose the antonym of the word 'compulsory':",
        "optional",
        [
        ["mandatory", "synonym-error"],
        ["urgent", "time-constraint"],
        ["essential", "necessary-quality"],
        ],
        "Compulsory means required by law or a rule; optional or voluntary is its opposite."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Which word is an antonym of 'nimble'?",
        "clumsy",
        [
        ["agile", "synonym-error"],
        ["quick", "speed-association"],
        ["graceful", "related-positive-trait"],
        ],
        "Nimble means quick and light in movement; clumsy or awkward is its antonym."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Choose the opposite of the word 'mingle':",
        "isolate",
        [
        ["blend", "synonym-error"],
        ["combine", "synonym-error"],
        ["gather", "group-action"],
        ],
        "To mingle means to mix or associate with others; to isolate or separate is its opposite."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Which word is the antonym of 'clumsy'?",
        "graceful",
        [
        ["awkward", "synonym-error"],
        ["ungainly", "synonym-error"],
        ["careless", "unrelated-trait"],
        ],
        "Clumsy means awkward in movement or handling things; graceful is its opposite."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Choose the antonym of the word 'generous':",
        "selfish",
        [
        ["giving", "synonym-error"],
        ["kind", "synonym-error"],
        ["helpful", "related-quality"],
        ],
        "A generous person likes to share and give. A selfish person keeps things for themselves, so selfish is the opposite."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Which word is an antonym of 'tragic'?",
        "joyful",
        [
        ["disastrous", "synonym-error"],
        ["dreadful", "negative-tone"],
        ["gloomy", "sombre-feeling"],
        ],
        "Tragic means causing great sadness or distress; joyful is its antonym."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Choose the opposite of the word 'increase':",
        "decrease",
        [
        ["expand", "synonym-error"],
        ["amplify", "intensifying-word"],
        ["elevate", "upward-movement"],
        ],
        "Increase means to become greater in size, amount, or degree; decrease means to become smaller."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Which word is the antonym of 'resent'?",
        "welcome",
        [
        ["begrudge", "synonym-error"],
        ["dislike", "negative-feeling"],
        ["protest", "objecting-action"],
        ],
        "To resent means to feel bitterness or indignation at something; to welcome or appreciate is its opposite."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Choose the antonym of the word 'accomplice':",
        "opponent",
        [
        ["partner", "synonym-error"],
        ["helper", "collaborator"],
        ["associate", "allied-person"],
        ],
        "An accomplice is a person who helps another commit a crime or wrong act; an opponent opposes them."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Which word is an antonym of 'brazen'?",
        "modest",
        [
        ["bold", "synonym-error"],
        ["insolent", "synonym-error"],
        ["audacious", "daring-attitude"],
        ],
        "Brazen means bold and without shame; modest or timid is its antonym."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Choose the opposite of the word 'soothe':",
        "agitate",
        [
        ["comfort", "synonym-error"],
        ["pacify", "synonym-error"],
        ["relieve", "calming-effect"],
        ],
        "To soothe means to gently calm a person or their feelings; to agitate or inflame is its antonym."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Which word is an antonym of 'ascend'?",
        "descend",
        [
        ["climb", "synonym-error"],
        ["mount", "synonym-error"],
        ["soar", "upward-movement"],
        ],
        "To ascend means to go up or climb; to descend means to move downward."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Choose the opposite of the word 'upstairs':",
        "downstairs",
        [
        ["balcony", "related-location"],
        ["rooftop", "elevated-area"],
        ["attic", "upper-room"],
        ],
        "Upstairs refers to an upper floor; downstairs refers to a lower floor."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Which word is the antonym of 'sickness'?",
        "health",
        [
        ["illness", "synonym-error"],
        ["ailment", "synonym-error"],
        ["fatigue", "tiredness-state"],
        ],
        "Sickness means being ill; health is its opposite."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Choose the opposite of the word 'separate':",
        "unite",
        [
        ["divide", "synonym-error"],
        ["isolate", "synonym-error"],
        ["scatter", "dispersing-action"],
        ],
        "To separate means to divide or cause to move apart; to unite means to bring together."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Which word is an antonym of 'despair'?",
        "hope",
        [
        ["anguish", "synonym-error"],
        ["sorrow", "sadness-trait"],
        ["grief", "mourning-emotion"],
        ],
        "Despair is the complete loss or absence of hope; hope is its direct antonym."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Choose the antonym of the word 'conspicuous':",
        "hidden",
        [
        ["noticeable", "synonym-error"],
        ["prominent", "synonym-error"],
        ["obvious", "clear-appearance"],
        ],
        "Conspicuous means clearly visible or attracting attention; hidden or inconspicuous is its opposite."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Which word is the antonym of 'shallow'?",
        "deep",
        [
        ["low", "related-meaning"],
        ["flat", "related-meaning"],
        ["thin", "related-meaning"],
        ],
        "Shallow water does not go down far. Deep water goes down a long way, so deep is the opposite."
      ),
    },
  ],

  "wp-antonyms-mix-2": [
    {
      subtopic: "antonyms",
      ...q(
        "Choose the antonym of the word 'wide':",
        "narrow",
        [
        ["broad", "synonym-error"],
        ["spacious", "synonym-error"],
        ["vast", "synonym-error"],
        ],
        "Wide means having great extent from side to side; narrow means having a small width."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Which word is an antonym of 'arrive'?",
        "depart",
        [
        ["reach", "synonym-error"],
        ["enter", "related-action"],
        ["approach", "related-action"],
        ],
        "To arrive means to reach a destination; to depart means to leave."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Choose the opposite of the word 'calm':",
        "stormy",
        [
        ["tranquil", "synonym-error"],
        ["serene", "synonym-error"],
        ["peaceful", "synonym-error"],
        ],
        "Calm means not showing or feeling agitation or excitement; stormy means marked by turbulence or disturbance."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Which word is the antonym of 'rich'?",
        "poor",
        [
        ["wealthy", "synonym-error"],
        ["affluent", "synonym-error"],
        ["prosperous", "synonym-error"],
        ],
        "Rich means having a great deal of money or assets; poor means lacking sufficient money to live comfortably."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Choose the antonym of the word 'friend':",
        "enemy",
        [
        ["ally", "synonym-error"],
        ["companion", "synonym-error"],
        ["partner", "synonym-error"],
        ],
        "A friend is a person with whom one has a bond of mutual affection; an enemy is a person actively opposing someone."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Which word is an antonym of 'kind'?",
        "cruel",
        [
        ["gentle", "synonym-error"],
        ["caring", "synonym-error"],
        ["generous", "synonym-error"],
        ],
        "Kind means having or showing a friendly, generous, and considerate nature; cruel means wilfully causing pain."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Choose the opposite of the word 'hard':",
        "soft",
        [
        ["solid", "synonym-error"],
        ["firm", "synonym-error"],
        ["rigid", "synonym-error"],
        ],
        "Hard means solid, firm, and resistant to pressure; soft means yielding readily to touch."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Which word is the antonym of 'front'?",
        "back",
        [
        ["face", "related-noun"],
        ["forward", "direction-confusion"],
        ["vanguard", "leading-position"],
        ],
        "Front refers to the part or side that faces forward; back refers to the rear side."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Choose the antonym of the word 'bright':",
        "dim",
        [
        ["radiant", "synonym-error"],
        ["brilliant", "synonym-error"],
        ["luminous", "synonym-error"],
        ],
        "Bright means giving out or reflecting much light; dim means not shining brightly or clearly."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Which word is an antonym of 'empty'?",
        "full",
        [
        ["vacant", "synonym-error"],
        ["hollow", "synonym-error"],
        ["bare", "synonym-error"],
        ],
        "Empty means containing nothing; full means containing as much or as many as is possible."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Choose the opposite of the word 'new':",
        "old",
        [
        ["fresh", "synonym-error"],
        ["modern", "synonym-error"],
        ["novel", "synonym-error"],
        ],
        "New means not existing before; old means having lived or existed for a long time."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Which word is the antonym of 'cheap'?",
        "expensive",
        [
        ["affordable", "synonym-error"],
        ["low-cost", "synonym-error"],
        ["economical", "synonym-error"],
        ],
        "Cheap means low in price; expensive means costing a great deal of money."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Choose the antonym of the word 'give':",
        "receive",
        [
        ["donate", "synonym-error"],
        ["present", "synonym-error"],
        ["bestow", "synonym-error"],
        ],
        "To give means to freely transfer the possession of something; to receive means to be given or presented with something."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Which word is an antonym of 'near'?",
        "distant",
        [
        ["close", "synonym-error"],
        ["nearby", "synonym-error"],
        ["adjacent", "synonym-error"],
        ],
        "Near means at or to a short distance; distant means far away in space or time."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Choose the opposite of the word 'early':",
        "late",
        [
        ["prompt", "synonym-error"],
        ["punctual", "synonym-error"],
        ["timely", "synonym-error"],
        ],
        "Early means happening before the expected time; late means doing something after the expected time."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Which word is the antonym of 'loud'?",
        "quiet",
        [
        ["noisy", "synonym-error"],
        ["deafening", "synonym-error"],
        ["boisterous", "synonym-error"],
        ],
        "Loud means producing or capable of producing much noise; quiet means making little or no noise."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Choose the antonym of the word 'rough':",
        "smooth",
        [
        ["coarse", "synonym-error"],
        ["jagged", "synonym-error"],
        ["bumpy", "synonym-error"],
        ],
        "Rough means having an uneven or irregular surface; smooth means having an even and regular surface."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Which word is an antonym of 'fast'?",
        "slow",
        [
        ["swift", "synonym-error"],
        ["rapid", "synonym-error"],
        ["speedy", "synonym-error"],
        ],
        "Fast means moving or capable of moving at high speed; slow means operating or moving at a low speed."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Choose the opposite of the word 'bold':",
        "timid",
        [
        ["fearless", "synonym-error"],
        ["daring", "synonym-error"],
        ["brave", "synonym-error"],
        ],
        "Bold means confident and courageous; timid means showing a lack of courage or confidence."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Which word is the antonym of 'strong'?",
        "feeble",
        [
        ["sturdy", "synonym-error"],
        ["muscular", "synonym-error"],
        ["mighty", "synonym-error"],
        ],
        "Strong means having the power to move heavy weights or perform other physically demanding tasks; feeble means lacking physical strength."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Choose the antonym of the word 'find':",
        "lose",
        [
        ["discover", "synonym-error"],
        ["locate", "synonym-error"],
        ["detect", "synonym-error"],
        ],
        "To find means to discover by searching; to lose means to be deprived of or cease to have."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Which word is an antonym of 'dark'?",
        "light",
        [
        ["murky", "synonym-error"],
        ["shadowy", "synonym-error"],
        ["dim", "synonym-error"],
        ],
        "Dark means with little or no light; light means having a considerable amount of illumination."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Choose the opposite of the word 'hot':",
        "cold",
        [
        ["scorching", "synonym-error"],
        ["boiling", "synonym-error"],
        ["warm", "related-temperature"],
        ],
        "Hot means having a high degree of heat; cold means of or at a low or relatively low temperature."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Which word is the antonym of 'tall'?",
        "short",
        [
        ["towering", "synonym-error"],
        ["lofty", "synonym-error"],
        ["giant", "synonym-error"],
        ],
        "Tall means of great or more than average height; short means measuring a small distance from head to foot."
      ),
    },
    {
      subtopic: "antonyms",
      ...q(
        "Choose the antonym of the word 'clean':",
        "dirty",
        [
        ["spotless", "synonym-error"],
        ["pristine", "synonym-error"],
        ["tidy", "synonym-error"],
        ],
        "Clean means free from dirt, marks, or stains; dirty means covered or marked with an unclean substance."
      ),
    },
  ],

  "wp-idioms-mix": [
    {
      subtopic: "animal-nature-idioms",
      ...q(
        "What is the meaning of the idiom 'fly the coop'?",
        "escape or leave suddenly",
        [
        ["build a wooden coop", "literal-interpretation"],
        ["keep pet birds safe", "confused-context"],
        ["refuse to travel far", "opposite-action"],
        ],
        "'Fly the coop' means to make an escape or leave home or a place suddenly and unexpectedly."
      ),
    },
    {
      subtopic: "popular-sayings",
      ...q(
        "What is the meaning of 'a blessing in disguise'?",
        "an apparent misfortune that results in good",
        [
        ["a costume worn to a festival", "literal-interpretation"],
        ["a harmful trick played by friends", "misunderstood-connotation"],
        ["a secret wish kept completely quiet", "unrelated-concept"],
        ],
        "'A blessing in disguise' is something that seems unfortunate or unlucky at first, but turns out to have positive results."
      ),
    },
    {
      subtopic: "action-phrases",
      ...q(
        "What does it mean to be 'tickled pink'?",
        "extremely delighted and pleased",
        [
        ["feeling physical irritation", "literal-interpretation"],
        ["blushing from heavy embarrassment", "colour-association"],
        ["growing hot and uncomfortable", "physical-sensation"],
        ],
        "Being 'tickled pink' means feeling very pleased, thrilled, or delightfully entertained."
      ),
    },
    {
      subtopic: "animal-nature-idioms",
      ...q(
        "What does the expression 'raining cats and dogs' mean?",
        "raining very heavily",
        [
        ["pets making loud noise outside", "literal-interpretation"],
        ["animals running from a storm", "confused-animal-idiom"],
        ["gentle drizzle on an autumn day", "opposite-intensity"],
        ],
        "'Raining cats and dogs' is a well-known idiom meaning raining torrentially or very heavily."
      ),
    },
    {
      subtopic: "action-phrases",
      ...q(
        "What is the meaning of the idiom 'acid test'?",
        "a decisive test of true value or quality",
        [
        ["a sour taste test in science class", "literal-interpretation"],
        ["an unfair question on an examination", "misleading-context"],
        ["a dangerous chemical reaction in lab", "science-confusion"],
        ],
        "An 'acid test' is a definitive, conclusive test of the success, quality, or authenticity of someone or something."
      ),
    },
    {
      subtopic: "animal-nature-idioms",
      ...q(
        "What does the phrase 'when pigs fly' mean?",
        "something that will never happen",
        [
        ["early in the quiet morning", "time-confusion"],
        ["during a rare lunar eclipse", "rare-event-confusion"],
        ["whenever animals are excited", "literal-interpretation"],
        ],
        "'When pigs fly' is an informal idiom used to say that one thinks something will never happen."
      ),
    },
    {
      subtopic: "animal-nature-idioms",
      ...q(
        "What is the meaning of the phrase 'root and branch'?",
        "thoroughly and completely",
        [
        ["gardening carefully in spring", "literal-interpretation"],
        ["growing tall like an oak tree", "nature-association"],
        ["slowly and step by step", "wrong-pace"],
        ],
        "'Root and branch' means completely and entirely, leaving nothing untouched."
      ),
    },
    {
      subtopic: "action-phrases",
      ...q(
        "What does the expression 'rank and file' refer to?",
        "ordinary members of an organization",
        [
        ["commanding officers in an army", "opposite-hierarchy"],
        ["neatly organized paper folders", "literal-interpretation"],
        ["people with the highest scores", "elite-misconception"],
        ],
        "'Rank and file' refers to the ordinary members of a party, union, or group, as opposed to the leaders."
      ),
    },
    {
      subtopic: "action-phrases",
      ...q(
        "What is the meaning of the saying 'time flies'?",
        "time seems to pass remarkably quickly",
        [
        ["clocks are running too fast today", "literal-interpretation"],
        ["travelling by aeroplane saves time", "wordplay-distractor"],
        ["important appointments arrive late", "opposite-experience"],
        ],
        "'Time flies' means time seems to pass at great speed, especially when one is busy or enjoying oneself."
      ),
    },
    {
      subtopic: "action-phrases",
      ...q(
        "What does it mean to be 'in hot water'?",
        "in serious trouble or difficulty",
        [
        ["relaxing in a warm bath", "literal-interpretation"],
        ["cooking dinner over a stove", "kitchen-association"],
        ["feeling sweaty in hot weather", "temperature-confusion"],
        ],
        "To be 'in hot water' means to be in a difficult situation or facing punishment for doing something wrong."
      ),
    },
    {
      subtopic: "action-phrases",
      ...q(
        "What is the meaning of 'bury the hatchet'?",
        "end a quarrel and make peace",
        [
        ["hide gardening tools away", "literal-interpretation"],
        ["prepare weapons before battle", "opposite-action"],
        ["forget where an item was placed", "carelessness-distractor"],
        ],
        "To 'bury the hatchet' means to settle a dispute, forgive past grudges, and make peace."
      ),
    },
    {
      subtopic: "action-phrases",
      ...q(
        "What does the idiom 'hit the books' mean?",
        "study intensely with focus",
        [
        ["slam heavy dictionaries down", "literal-interpretation"],
        ["borrow books from the library", "general-study-action"],
        ["organize shelves in a neat row", "cleaning-association"],
        ],
        "To 'hit the books' is an informal expression meaning to study hard, especially before an exam."
      ),
    },
    {
      subtopic: "action-phrases",
      ...q(
        "What does 'the ball is in your court' mean?",
        "it is now your turn to take action",
        [
        ["you must serve in tennis now", "literal-sports-interpretation"],
        ["you have won the competition", "premature-victory"],
        ["the match has ended for today", "conclusion-confusion"],
        ],
        "'The ball is in your court' means it is up to you to make the next move or decision."
      ),
    },
    {
      subtopic: "action-phrases",
      ...q(
        "What does it mean to 'get cold feet'?",
        "become nervous and lose courage",
        [
        ["walk barefoot on frosty grass", "literal-interpretation"],
        ["catch a winter chest cold", "health-association"],
        ["feel relaxed and unbothered", "opposite-feeling"],
        ],
        "To 'get cold feet' means to experience sudden nervousness or hesitate before doing something risky or important."
      ),
    },
    {
      subtopic: "action-phrases",
      ...q(
        "What does feeling 'under the weather' mean?",
        "feeling slightly unwell or sickly",
        [
        ["standing outside in heavy rain", "literal-weather-interpretation"],
        ["checking the morning forecast", "meteorological-distractor"],
        ["feeling unusually energetic", "opposite-state"],
        ],
        "To be 'under the weather' means to feel mildly ill, tired, or indisposed."
      ),
    },
    {
      subtopic: "animal-nature-idioms",
      ...q(
        "What is the meaning of 'once in a blue moon'?",
        "very rarely or almost never",
        [
        ["every single lunar month", "astronomical-literalism"],
        ["whenever evening arrives", "routine-event"],
        ["during a summer cloudburst", "seasonal-confusion"],
        ],
        "'Once in a blue moon' refers to something that happens very rarely."
      ),
    },
    {
      subtopic: "action-phrases",
      ...q(
        "What does it mean to 'pull someone's leg'?",
        "tease someone in a playful, joking manner",
        [
        ["trip a person while walking", "literal-physical-action"],
        ["help someone climb an obstacle", "helpful-misinterpretation"],
        ["pull a muscle while running", "literal-physical-action"],
        ],
        "To 'pull someone's leg' means to tease or play a harmless practical joke on them."
      ),
    },
    {
      subtopic: "action-phrases",
      ...q(
        "What does the expression 'bold as brass' mean?",
        "confident and completely shameless",
        [
        ["polished until bright yellow", "literal-metal-interpretation"],
        ["noisy like a marching band", "instrument-confusion"],
        ["easily broken under pressure", "opposite-quality"],
        ],
        "'Bold as brass' describes someone who is extremely audacious, confident, and unabashed."
      ),
    },
  ],

  "wp-vocab-mix": [
    {
      subtopic: "idiomatic-collocations",
      ...q(
        "Choose the correct spelling of the word meaning 'to light up':",
        "illuminate",
        [
        ["illuminaete", "spelling-vowel-trap"],
        ["illuminiaet", "spelling-letter-jumble"],
        ["illuminete", "spelling-vowel-trap"],
        ],
        "Illuminate is spelled i-l-l-u-m-i-n-a-t-e, with double 'l' and ending in '-ate'."
      ),
    },
    {
      subtopic: "idiomatic-collocations",
      ...q(
        "Which word means 'an item kept as a reminder of a person, place, or event'?",
        "souvenir",
        [
        ["trinket", "imprecise-synonym"],
        ["specimen", "scientific-sample"],
        ["document", "written-record"],
        ],
        "A souvenir is a thing kept as a reminder of a person, place, or event."
      ),
    },
    {
      subtopic: "idiomatic-collocations",
      ...q(
        "Choose the correct spelling of the word meaning 'very great or immense':",
        "tremendous",
        [
        ["tremendious", "spelling-extra-vowel"],
        ["tremandous", "spelling-vowel-trap"],
        ["trimendous", "spelling-vowel-trap"],
        ],
        "Tremendous is spelled t-r-e-m-e-n-d-o-u-s (ending in '-ous', not '-ious')."
      ),
    },
    {
      subtopic: "idiomatic-collocations",
      ...q(
        "They decided to ___ at the grocery market to buy fresh ___.",
        "meet / meat",
        [
        ["meat / meet", "reversed-homophones"],
        ["meat / meat", "incorrect-verb-choice"],
        ["meet / meet", "incorrect-noun-choice"],
        ],
        "'Meet' means to come into the presence of someone; 'meat' is animal flesh used as food."
      ),
    },
    {
      subtopic: "idiomatic-collocations",
      ...q(
        "Choose the correct spelling of the word meaning 'stubborn':",
        "obstinate",
        [
        ["obsitnate", "spelling-letter-transposition"],
        ["obtsinate", "spelling-letter-swap"],
        ["obstinite", "spelling-vowel-trap"],
        ],
        "Obstinate is spelled o-b-s-t-i-n-a-t-e."
      ),
    },
    {
      subtopic: "idiomatic-collocations",
      ...q(
        "Choose the correct spelling of the word meaning 'a desire to do something':",
        "temptation",
        [
        ["tamtation", "spelling-vowel-trap"],
        ["temptashion", "spelling-phonetic-misspelling"],
        ["tempetation", "spelling-extra-syllable"],
        ],
        "Temptation is spelled t-e-m-p-t-a-t-i-o-n."
      ),
    },
    {
      subtopic: "idiomatic-collocations",
      ...q(
        "Choose the correct spelling of the word meaning 'promising or favourable':",
        "auspicious",
        [
        ["auspisious", "spelling-s-for-c-error"],
        ["auspicius", "spelling-missing-vowel"],
        ["awspicious", "spelling-phonetic-misspelling"],
        ],
        "Auspicious is spelled a-u-s-p-i-c-i-o-u-s, using 'c' before 'i'."
      ),
    },
    {
      subtopic: "idiomatic-collocations",
      ...q(
        "Which word describes 'a person who has had long experience in a particular field'?",
        "veteran",
        [
        ["novice", "opposite-experience"],
        ["amateur", "non-professional"],
        ["apprentice", "beginner-in-training"],
        ],
        "A veteran is a person who has had long experience in a particular field."
      ),
    },
    {
      subtopic: "idiomatic-collocations",
      ...q(
        "Choose the correct spelling of the word for the line around a circle:",
        "circumference",
        [
        ["circumferance", "spelling-vowel-trap"],
        ["circamference", "spelling-vowel-trap"],
        ["circumfrence", "spelling-missing-vowel"],
        ],
        "Circumference ends in '-ence', spelled c-i-r-c-u-m-f-e-r-e-n-c-e."
      ),
    },
    {
      subtopic: "idiomatic-collocations",
      ...q(
        "Choose the correct spelling of the word meaning 'watchful attention':",
        "vigilance",
        [
        ["vigilence", "spelling-vowel-trap"],
        ["vegilance", "spelling-vowel-trap"],
        ["vigalance", "spelling-vowel-trap"],
        ],
        "Vigilance ends in '-ance', spelled v-i-g-i-l-a-n-c-e."
      ),
    },
    {
      subtopic: "idiomatic-collocations",
      ...q(
        "Which word describes 'a large natural or artificial lake used as a source of water supply'?",
        "reservoir",
        [
        ["aquarium", "tank-for-fish"],
        ["aviary", "enclosure-for-birds"],
        ["sanctuary", "refuge-for-wildlife"],
        ],
        "A reservoir is a large natural or artificial lake used as a source of water supply."
      ),
    },
    {
      subtopic: "idiomatic-collocations",
      ...q(
        "Which word describes someone or something that is 'present everywhere simultaneously'?",
        "omnipresent",
        [
        ["omniscient", "all-knowing"],
        ["omnipotent", "all-powerful"],
        ["omnivorous", "eating-all-foods"],
        ],
        "'Omnipresent' means present everywhere (from Latin 'omni-' meaning all, and 'present')."
      ),
    },
    {
      subtopic: "idiomatic-collocations",
      ...q(
        "Choose the correct spelling of the word meaning 'a person who receives something':",
        "recipient",
        [
        ["receipent", "spelling-ie-ei-rule"],
        ["recipiant", "spelling-vowel-trap"],
        ["recepient", "spelling-missing-vowel"],
        ],
        "Recipient is spelled r-e-c-i-p-i-e-n-t."
      ),
    },
    {
      subtopic: "idiomatic-collocations",
      ...q(
        "Choose the correct spelling of the word meaning 'awake and aware of one's surroundings':",
        "conscious",
        [
        ["conssious", "spelling-double-consonant"],
        ["consious", "spelling-missing-consonant"],
        ["concsious", "spelling-misplaced-consonant"],
        ],
        "Conscious is spelled c-o-n-s-c-i-o-u-s."
      ),
    },
    {
      subtopic: "idiomatic-collocations",
      ...q(
        "Choose the correct spelling of the word meaning 'remarkable or extraordinary':",
        "phenomenal",
        [
        ["phenominal", "spelling-vowel-trap"],
        ["fenomenal", "spelling-phonetic-misspelling"],
        ["phynomenal", "spelling-vowel-trap"],
        ],
        "Phenomenal is spelled p-h-e-n-o-m-e-n-a-l."
      ),
    },
    {
      subtopic: "idiomatic-collocations",
      ...q(
        "Which word describes 'a person who undergoes suffering or death for a noble cause'?",
        "martyr",
        [
        ["patriot", "lover-of-country"],
        ["diplomat", "peace-negotiator"],
        ["refugee", "displaced-person"],
        ],
        "A martyr is a person who is killed or suffers greatly because of their religious, political, or noble beliefs."
      ),
    },
    {
      subtopic: "idiomatic-collocations",
      ...q(
        "Choose the correct spelling of the word meaning 'to make someone feel very happy and animated':",
        "exhilarate",
        [
        ["exhilerate", "spelling-vowel-trap"],
        ["exhilarete", "spelling-vowel-trap"],
        ["exelerate", "spelling-phonetic-confusion"],
        ],
        "Exhilarate has an 'a' after the 'l': e-x-h-i-l-a-r-a-t-e."
      ),
    },
    {
      subtopic: "idiomatic-collocations",
      ...q(
        "The recipe called for grinding the whole spices into a ___ paste.",
        "coarse",
        [
        ["course", "path-or-class"],
        ["corse", "archaic-spelling"],
        ["cause", "reason-for-action"],
        ],
        "'Coarse' means rough or loose in texture; 'course' refers to a direction, class, or route."
      ),
    },
    {
      subtopic: "idiomatic-collocations",
      ...q(
        "A travelling ___ of classical dancers performed at the annual festival.",
        "troupe",
        [
        ["troop", "soldiers-or-monkeys"],
        ["troup", "spelling-missing-letter"],
        ["trust", "unrelated-word"],
        ],
        "A 'troupe' is a group of dancers, actors, or performers; a 'troop' refers to soldiers."
      ),
    },
    {
      subtopic: "idiomatic-collocations",
      ...q(
        "Choose the correct spelling of the word meaning 'allowing light to pass through partially':",
        "translucent",
        [
        ["translucant", "spelling-vowel-trap"],
        ["transleucent", "spelling-extra-vowel"],
        ["tranzlucent", "spelling-phonetic-misspelling"],
        ],
        "Translucent is spelled t-r-a-n-s-l-u-c-e-n-t, ending in '-ent'."
      ),
    },
    {
      subtopic: "idiomatic-collocations",
      ...q(
        "Which word describes 'a person skilled in foreign languages or the study of language'?",
        "linguist",
        [
        ["novelist", "writer-of-fiction"],
        ["historian", "student-of-history"],
        ["archaeologist", "student-of-antiquities"],
        ],
        "A linguist is a person skilled in foreign languages or a person who studies linguistics."
      ),
    },
    {
      subtopic: "idiomatic-collocations",
      ...q(
        "She went to the bank counter to deposit the salary ___ into her account.",
        "cheque",
        [
        ["check", "us-spelling-or-verify"],
        ["chick", "baby-bird"],
        ["cheek", "facial-feature"],
        ],
        "In British English, a bank order to pay money is spelled 'cheque', whereas 'check' means to examine."
      ),
    },
    {
      subtopic: "idiomatic-collocations",
      ...q(
        "Wheat grains are finely ground into ___ to bake fresh bread.",
        "flour",
        [
        ["flower", "blossom-of-plant"],
        ["floor", "surface-of-room"],
        ["flare", "sudden-bright-light"],
        ],
        "'Flour' is powder obtained by grinding grain; 'flower' is the blossom of a plant."
      ),
    },
    {
      subtopic: "idiomatic-collocations",
      ...q(
        "What is the psychological term for the extreme or irrational fear of dogs?",
        "cynophobia",
        [
        ["claustrophobia", "fear-of-confined-spaces"],
        ["acrophobia", "fear-of-heights"],
        ["hydrophobia", "fear-of-water"],
        ],
        "Cynophobia is the extreme or irrational fear of dogs (from Greek 'kyon' meaning dog, and 'phobos' meaning fear)."
      ),
    },
    {
      subtopic: "idiomatic-collocations",
      ...q(
        "Choose the British spelling of the small dish eaten before the main course:",
        "appetiser",
        [
        ["appetizer", "us-spelling-with-z"],
        ["apetiser", "spelling-missing-letter"],
        ["appitiser", "spelling-vowel-trap"],
        ],
        "In British English, the word is spelled 'appetiser' with an 's' rather than a 'z', and with double 'p'."
      ),
    },
  ],
};

// ---------- Readings ----------
export const readings = {
  "wp-read-banyan-grove": {
    title: "The Whispering Banyan Grove",
    mode: "fullPassage",
    type: "fullPassage",
    author: "Apprec8",
    glossary: {
      "canopy": "the high roof formed by spreading tree branches",
      "hollow": "an empty space inside a tree trunk",
      "scurried": "ran quickly with short hurried steps",
      "ancient": "belonging to a time long past",
      "murmurs": "soft, continuous sounds like quiet speaking",
      "haven": "a safe, peaceful shelter for living creatures"
},
    paragraphs: [
      "Deep inside the Shivalik foothills stood an ancient banyan tree known to every traveller as the Whispering Banyan. For over two hundred years, its sprawling branches had stretched out like giant wooden arms, sending leafy aerial roots straight down into the fertile mountain soil. Whenever a gentle breeze swept through the valley, the dangling roots rustled softly, sounding remarkably like friendly murmurs.",
      "One sunny Saturday morning, young Kabir and his sister Ananya walked down the winding stone pathway to the grove. Resting beneath the wide leafy canopy, Kabir pointed toward a shadowy hollow inside the main trunk. Three tiny striped squirrels scurried out into the sunlight, their bushy tails twitching with curiosity.",
      "\"Look at the magnificent canopy!\" whispered Ananya in wonder. \"It feels as cool as an air-conditioned room, even though the afternoon sun is scorching hot outside.\" An old herdsman named Uncle Gopal smiled as he tied his grazing goats to a sturdy root. \"This ancient tree protects our village,\" he said softly. \"During the great flood three years ago, its powerful roots held the entire hillside together and prevented a disastrous landslide.\"",
      "Last winter, commercial timber contractors arrived with roaring electric saws, intending to fell the grand grove to build a resort. But the village council held an emergency meeting beneath the leafy boughs. Every family pledged to protect the grove. The contractors were turned away, and the ancient banyan was declared a community heritage reserve.",
      "As the evening sun sank behind the purple ridges, flocks of wild green parrots flew back into the green leaves, filling the twilight air with joyful chatter. Kabir smiled, realizing that a single ancient tree could offer a peaceful haven for hundreds of living creatures."
],
    questions: [
        {
          ...q(
            "Why was the ancient banyan tree known as the Whispering Banyan in the village?",
            "Its aerial roots rustled in the breeze like soft murmurs",
            [
            ["A hidden radio transmitter played songs inside the hollow", "reading-detail-missed"],
            ["Villagers met under its canopy every evening to tell secrets", "reading-detail-missed"],
            ["The tree trunk produced loud ringing sounds during storms", "reading-detail-missed"]
            ],
            "Paragraph 1 mentions that its long aerial roots swayed and rustled in the mountain wind, sounding just like gentle murmurs."
          ),
          evidence: { paragraph: 0, text: "sounding remarkably like friendly murmurs" },
        },
        {
          ...q(
            "What does the word 'canopy' mean as used in the passage?",
            "The high roof-like covering formed by spreading branches",
            [
            ["A wooden bench placed at the bottom of a tree", "reading-vocab-context"],
            ["The deep underground taproot of an ancient plant", "reading-vocab-context"],
            ["A stone wall built around a village boundary", "reading-vocab-context"]
            ],
            "A tree canopy is the high, leafy ceiling formed by intertwining tree branches."
          ),
          evidence: { paragraph: 1, text: "leafy canopy" },
        },
        {
          ...q(
            "Which animal family had built their home inside the deep hollow of the tree trunk?",
            "A family of striped squirrels",
            [
            ["A flock of mountain pigeons", "reading-detail-missed"],
            ["A pack of wild desert foxes", "reading-detail-missed"],
            ["A swarm of stinging wasps", "reading-detail-missed"]
            ],
            "Paragraph 2 states that Kabir watched three striped squirrels scurry into the sheltered hollow of the trunk."
          ),
          evidence: { paragraph: 1, text: "Three tiny striped squirrels scurried out" },
        },
        {
          ...q(
            "Select the correct antonym of the word 'ancient' as used in the story:",
            "modern",
            [
            ["historic", "reading-antonym-context"],
            ["timeworn", "reading-antonym-context"],
            ["venerable", "reading-antonym-context"]
            ],
            "Ancient means belonging to times long past; its opposite is modern or contemporary."
          ),
          evidence: { paragraph: 0, text: "ancient banyan tree" },
        },
        {
          ...q(
            "Select the statement that is TRUE according to the passage:",
            "The villagers protected the banyan grove from timber cutters.",
            [
            ["The banyan tree fell down during a sudden summer thunderstorm.", "reading-statement-check"],
            ["Kabir took home the young squirrel chicks as pets.", "reading-statement-check"],
            ["The mountain stream dried up completely in the winter month.", "reading-statement-check"]
            ],
            "Paragraph 4 explains how the village council united to protect the grove from commercial timber cutters."
          ),
          evidence: { paragraph: 3, text: "Every family pledged to protect the grove" },
        },
        {
          ...q(
            "What lesson did Kabir take away from his visit to the grove?",
            "Ancient nature provides shelter and life to many creatures",
            [
            ["Old trees should be cut down to build wider village roads", "reading-inference-theme"],
            ["Wild animals are too dangerous to live near human homes", "reading-inference-theme"],
            ["Trees only produce wood and have no other ecological value", "reading-inference-theme"]
            ],
            "The concluding paragraph highlights how one great banyan tree supports an entire community of birds, squirrels, and weary travellers."
          ),
          evidence: { paragraph: 4, text: "a single ancient tree could offer a peaceful haven" },
        },
    ],
  },
  "wp-read-lost-compass": {
    title: "The Mystery of the Silver Compass",
    mode: "fullPassage",
    type: "fullPassage",
    author: "Apprec8",
    glossary: {
      "attic": "a room or space just below the roof of a house",
      "parchment": "a heavy, durable sheet of paper used for historic documents",
      "antique": "an object valuable because of its high age and fine craftsmanship",
      "azimuth": "the horizontal direction or compass bearing of an object",
      "needle": "a thin magnetic pointer on a navigational instrument",
      "dial": "the marked circular face of a measuring instrument"
},
    paragraphs: [
      "On a rainy Saturday afternoon during the school holidays, Rohan and his sister Meera climbed the narrow wooden stairs into grandmother's dusty attic. The room was crammed with forgotten treasures: wicker baskets, stacks of old sea charts, leather-bound journals, and copper lanterns. Tucked away under the eaves stood a heavy iron sea chest with tarnished brass fittings. When Rohan lifted the heavy lid, a faint scent of cedar and sea salt drifted out. Resting inside on a velvet cushion was an antique silver compass, its brass casing polished to a warm glow despite decades in the dark.",
      "Meera lifted the compass gently by its ring. As she held it flat on her open palm, the delicate magnetic needle began to quiver. Instead of settling toward magnetic north, the needle glowed faintly blue and pointed steadfastly toward the great hollow oak tree in the back garden. 'Look at the glass dial,' Meera exclaimed softly. Engraved along the edge of the circular dial were delicate degree markings and numbers indicating the compass azimuth. Beside the compass lay a rolled yellow parchment tied with faded blue twine.",
      "Rohan untied the twine and unrolled the stiff parchment. It was a hand-drawn map of the coastal homestead, sketched by their grandfather who had been a seasoned sea captain on merchant voyages across the Indian Ocean. At the bottom of the map, grandfather had penned a note in flowing black ink: 'To my brave navigators: Leave no stone unturned, and true sailors shall find their haven. Follow the azimuth of the silver compass when the evening bell tolls.'",
      "Grandmother arrived at the attic doorway carrying two mugs of hot ginger tea. Smiling warmly, she told them how grandfather had safeguarded the compass through violent monsoon storms and never parted with it. She had carefully preserved the heirloom in the sea chest so that one day the children could discover grandfather's secret garden quest. Inspired by her words, the children raced down to the garden with umbrellas and boots, following the direction indicated by the compass needle straight to the hollow oak, where they found a small brass key wrapped in oiled silk.",
      "Holding the brass key, Rohan and Meera marvelled at grandfather's clever design. The treasure hunt was never about finding gold or jewels; grandfather had left the compass and handwritten map to encourage curiosity, adventure, and respect for family history among his grandchildren. As the rain cleared and the evening sun broke through the clouds, both children agreed that learning grandfather's navigational skills was the greatest adventure of all."
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
};

export const wordTables = {};

// ---------- Nodes definition ----------
// Unit 1
const u1 = forGrades(unit("wp-u1", 1, "Word Power"), [2, 3, 4, 5, 6]);
// Spec S word ladder (owner 2026-11-05): an easy first rung, branchOrder -1 = before the rest. Classes 2–5 (owner: a Class 5
// child whose finished topics re-lock behind it just does it first: "she is quick"). Class 6 skips it.
const SAMEOPP_GRADES = [2, 3, 4, 5];
const sameOpp = forGrades(main("wp-sameopp", u1.id, -1, "Same & Opposite", [study("wp-sameopp-study"), quiz("wp-sameopp-warmup")]), SAMEOPP_GRADES);
const sameOppP1 = forGrades(withSubtopic(practice("wp-sameopp-p1", sameOpp, 1, "Twin Words", "easy", [quiz("wp-sameopp-twins")]), "synonyms"), SAMEOPP_GRADES);
const sameOppP2 = forGrades(withSubtopic(practice("wp-sameopp-p2", sameOpp, 2, "Opposite Words", "easy", [quiz("wp-sameopp-opposites")]), "antonyms"), SAMEOPP_GRADES);
const sameOppEndless = forGrades(endless(sameOpp), SAMEOPP_GRADES);
const synAnt = forGrades(
  main("wp-synant", u1.id, 0, "Synonyms and Antonyms", [study("wp-synant-study"), quiz("wp-synant-warmup")]),
  [3, 4, 5, 6]
);
const synAntP1 = forGrades(
  withSubtopic(practice("wp-synant-p1", synAnt, 1, "Words in Context", "medium", [quiz("wp-synant-context-quiz")]), "context-pairs"),
  [4, 5, 6]
);
const synAntP2 = forGrades(
  withSubtopic(
    practice("wp-synant-p2", synAnt, 2, "Same Meaning Mix", "easy", [
      quiz("wp-synonyms-mix-1"),
      quiz("wp-synonyms-mix-2"),
    ]),
    "synonyms"
  ),
  [3, 4, 5, 6]
);
const synAntP3 = forGrades(
  withSubtopic(
    practice("wp-synant-p3", synAnt, 3, "Opposites Mix", "easy", [
      quiz("wp-antonyms-mix-1"),
      quiz("wp-antonyms-mix-2"),
    ]),
    "antonyms"
  ),
  [3, 4, 5, 6]
);
const synAntGate = forGrades(
  gate("wp-synant-gate", synAnt, "Synonyms & Antonyms Challenge", "wp-synant-gate-pool", {
    "synonyms": "Synonyms and similar meanings",
    "antonyms": "Antonyms and opposite meanings",
    "context-pairs": "Contextual word selection",
  }),
  [3, 4, 5, 6]
);
const synAntEndless = forGrades(endless(synAnt), [3, 4, 5, 6]);

const spelling = forGrades(
  main("wp-spelling", u1.id, 1, "Spelling Traps", [study("wp-spelling-study"), quiz("wp-spelling-warmup")]),
  [3, 4, 5, 6]
);
const spellingP1 = forGrades(
  withSubtopic(practice("wp-spelling-p1", spelling, 1, "I Before E Rules", "medium", [quiz("wp-spelling-rules-quiz")]), "ie-ei-rules"),
  [4, 5, 6]
);
const spellingGate = forGrades(
  gate("wp-spelling-gate", spelling, "Spelling Master Challenge", "wp-spelling-gate-pool", {
    "double-letters": "Double consonant traps",
    "ie-ei-rules": "I before E and vowel rules",
    "tricky-vowels": "Silent letters and vowel endings",
  }),
  [3, 4, 5, 6]
);
const spellingEndless = forGrades(endless(spelling), [3, 4, 5, 6]);

const collocations = forGrades(
  main("wp-colloc", u1.id, 2, "Word Choice & Collocations", [study("wp-colloc-study"), quiz("wp-colloc-warmup")]),
  [4, 5, 6]
);
const collocationsP1 = forGrades(
  withSubtopic(practice("wp-colloc-p1", collocations, 1, "Nature Collocations", "medium", [quiz("wp-colloc-nature-quiz")]), "natural-partners"),
  [5, 6]
);
const collocationsP2 = forGrades(
  withSubtopic(
    practice("wp-colloc-p2", collocations, 2, "Word Mix", "medium", [
      quiz("wp-vocab-mix"),
    ]),
    "idiomatic-collocations"
  ),
  [4, 5, 6]
);
const collocationsGate = forGrades(
  gate("wp-colloc-gate", collocations, "Word Choice & Collocation Challenge", "wp-colloc-gate-pool", {
    "movement-sounds": "Movement and sound collocations",
    "natural-partners": "Nature and group partnerships",
    "idiomatic-collocations": "Action and idiomatic collocations",
  }),
  [4, 5, 6]
);
const collocationsEndless = forGrades(endless(collocations), [4, 5, 6]);

const u1r = forGrades(
  main("wp-u1-reading", u1.id, 3, "Reading: The Whispering Banyan Grove", [reading("wp-read-banyan-grove")]),
  [3, 4, 5, 6]
);

const u1Boss = forGrades(
  boss(
    "wp-u1-boss",
    u1.id,
    "Unit 1 Boss",
    "wp-u1-test",
    "The Lexicon Labyrinth: Dr. Word-Mixer has scrambled the library dictionary! Jumbled spellings, lost word partners, and confused antonyms are running wild. Harness your word power to defeat the maze and restore the great lexicon."
  ),
  [3, 4, 5, 6]
);

// Unit 2
const u2 = forGrades(unit("wp-u2", 2, "Everyday English"), [3, 4, 5, 6]);

const dialogue = forGrades(
  main("wp-dialogue", u2.id, 0, "Situational Dialogue", [study("wp-dialogue-study"), quiz("wp-dialogue-warmup")]),
  [3, 4, 5, 6]
);
const dialogueP1 = forGrades(
  withSubtopic(practice("wp-dialogue-p1", dialogue, 1, "Social Exchange Practice", "medium", [quiz("wp-dialogue-practice-quiz")]), "social-responses"),
  [4, 5, 6]
);
const dialogueGate = forGrades(
  gate("wp-dialogue-gate", dialogue, "Dialogue & Response Challenge", "wp-dialogue-gate-pool", {
    "polite-requests": "Polite requests and offers",
    "social-responses": "Social situations and apologies",
    "everyday-conversations": "Everyday school and public dialogue",
  }),
  [3, 4, 5, 6]
);
const dialogueEndless = forGrades(endless(dialogue), [3, 4, 5, 6]);

const idioms = forGrades(
  main("wp-idioms", u2.id, 1, "Idioms and Proverbs", [study("wp-idioms-study"), quiz("wp-idioms-warmup")]),
  [4, 5, 6]
);
const idiomsP1 = forGrades(
  withSubtopic(practice("wp-idioms-p1", idioms, 1, "Proverbs in Context", "medium", [quiz("wp-idioms-practice-quiz")]), "popular-sayings"),
  [5, 6]
);
const idiomsP2 = forGrades(
  withSubtopic(
    practice("wp-idioms-p2", idioms, 2, "Idiom Mix", "medium", [
      quiz("wp-idioms-mix"),
    ]),
    "action-phrases"
  ),
  [4, 5, 6]
);
const idiomsGate = forGrades(
  gate("wp-idioms-gate", idioms, "Idioms & Proverbs Challenge", "wp-idioms-gate-pool", {
    "popular-sayings": "Popular proverbs and sayings",
    "animal-nature-idioms": "Animal and nature idioms",
    "action-phrases": "Common action and life phrases",
  }),
  [4, 5, 6]
);
const idiomsEndless = forGrades(endless(idioms), [4, 5, 6]);

const u2r = forGrades(
  main("wp-u2-reading", u2.id, 2, "Reading: The Mystery of the Silver Compass", [reading("wp-read-lost-compass")]),
  [3, 4, 5, 6]
);

const u2Boss = forGrades(
  boss(
    "wp-u2-boss",
    u2.id,
    "Unit 2 Boss",
    "wp-u2-test",
    "The Trial of the Silver Scribe: The ancient Quill-Phantom has rewritten the kingdom records with subtle grammar slips, rude dialogue, and scrambled idioms! Cleanse the royal scrolls, speak with true courtesy, and decipher the cryptic sayings to claim the Silver Quill."
  ),
  [3, 4, 5, 6]
);

const u3 = unit("wp-u3", 3, "Phrasal Verbs & Advanced Speech", { comingSoon: true });

export const nodes = [
  u1,
  sameOpp,
  sameOppP1,
  sameOppP2,
  sameOppEndless,
  synAnt,
  synAntP1,
  synAntP2,
  synAntP3,
  synAntGate,
  synAntEndless,
  spelling,
  spellingP1,
  spellingGate,
  spellingEndless,
  collocations,
  collocationsP1,
  collocationsP2,
  collocationsGate,
  collocationsEndless,
  u1r,
  u1Boss,
  u2,
  dialogue,
  dialogueP1,
  dialogueGate,
  dialogueEndless,
  idioms,
  idiomsP1,
  idiomsP2,
  idiomsGate,
  idiomsEndless,
  u2r,
  u2Boss,
  u3,
];

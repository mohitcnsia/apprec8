// data/papers/englishPaper1.js: Practice paper, English, Paper 1 (Claude, 2026-11-05). DRAFT for mockup Q (not approved yet).
// Shape of a Class 5 English olympiad paper (docs/exam/ieo-pattern.md): 50 questions, 60 minutes, 60 marks:
// 30 Words & Grammar (1 mark) · 10 Reading (1) · 5 Everyday English (1) · 5 Champion (3 marks each).
// All questions are new (not copies of past papers, not in any quest pool). `topic` = the quest node to practise afterwards.
// Ambiguity rule as in the quests: no style splits (no "already" + simple past, no "slow" as an adverb, no optional
// backshift, no "the" where it could also fit), every wrong option wrong in meaning or grammar.
import { q } from "../englishQuest/helpers.js";

const P = (topic, question, correct, wrongs, explanation, extra = {}) => ({ topic, ...q(question, correct, wrongs, explanation), ...extra });
const EQ = (node) => ({ quest: "english-quest", node });
const WP = (node) => ({ quest: "word-power", node });

export default {
  id: "paper-en-1",
  subject: "english",
  title: "Paper 1",
  minutes: 60,
  grades: [5],
  draft: false, // owner approved 2026-11-05: Class 5 sees it
  passages: {
    turtles: {
      title: "The Turtle Night",
      paragraphs: [
        "Every year, thousands of Olive Ridley turtles swim to the beaches of Odisha to lay their eggs. Sometimes they arrive together in huge numbers, all on the same few nights. People call this an arribada, a Spanish word for 'arrival'.",
        "Nisha's uncle is a volunteer at Rushikulya beach. One evening in April, he took Nisha with him. \"Remember,\" he said, \"no torches and no loud talking. The baby turtles must find the sea by themselves.\"",
        "They sat quietly near a fenced area of sand. Soon, the sand began to move. Tiny turtles, no bigger than Nisha's palm, popped out and started racing towards the water. Nisha wanted to help a slow one, but her uncle shook his head. \"The walk to the sea makes them stronger,\" he whispered.",
        "Her uncle explained that hatchlings move towards the brightest part of the sky, which is usually over the sea. Bright lights from houses and shops can confuse them, and they may crawl the wrong way. That is why the village switches off its lights on hatching nights.",
        "As the last turtle reached the waves, Nisha felt proud of the quiet, dark beach. \"Will they come back?\" she asked. \"Many of the girls will,\" her uncle said. \"One day, they will return to lay eggs on this same beach.\"",
      ],
    },
    notice: {
      title: "Notice: Riverside School Library",
      paragraphs: [
        "BOOK WEEK: 10 to 14 November",
        "Bring one old storybook and swap it for a 'new' one.",
        "Story-telling contest on Thursday at 2 p.m. in the hall. Give your name to Mrs Kapoor by Tuesday.",
        "The library will be closed on Friday afternoon for stock-taking.",
      ],
    },
  },
  parts: [
    {
      id: "words",
      title: "Words & Grammar",
      marks: 1,
      questions: [
        P(EQ("eq-u1-nouns"), "Choose the correct plural: one leaf, two ___", "leaves", [["leafs", "plural-form-error"], ["leaves'", "apostrophe-plural-error"], ["leafes", "plural-form-error"]], "Many words ending in -f change to -ves: leaf → leaves."),
        P(EQ("eq-u1-nouns"), "A ___ of bees flew out of the hive.", "swarm", [["herd", "collective-noun-mixup"], ["flock", "collective-noun-mixup"], ["pack", "collective-noun-mixup"]], "A swarm of bees; a herd of cows, a flock of birds, a pack of wolves."),
        P(EQ("eq-u1-pronouns"), "Riya and ___ went to the fair.", "I", [["me", "pronoun-case-error"], ["myself", "pronoun-case-error"], ["mine", "pronoun-case-error"]], "Riya and I did the action (subject), so we use I. Check: 'I went to the fair.'"),
        P(EQ("eq-u1-pronouns"), "The little boy dressed ___ for school.", "himself", [["hisself", "pronoun-case-error"], ["him", "pronoun-case-error"], ["itself", "pronoun-case-error"]], "He did it to himself: himself. 'Hisself' is not a word."),
        P(EQ("eq-u5-simple"), "Yesterday, Arjun ___ a kite.", "flew", [["flies", "tense-present-past-mixup"], ["flied", "tense-form-error"], ["will fly", "tense-present-past-mixup"]], "YESTERDAY → simple past. The past of fly is flew."),
        P(EQ("eq-u5-cont"), "Look! The puppy ___ its tail.", "is chasing", [["chased", "tense-present-past-mixup"], ["chasing", "tense-continuous-mixup"], ["has chase", "tense-form-error"]], "LOOK! means it is happening now: is chasing."),
        P(EQ("eq-u5-perfect"), "I ___ my homework, so now I can play.", "have finished", [["has finished", "sva-number-error"], ["finishing", "tense-form-error"], ["have finish", "participle-form-error"]], "Done just now with a result now → present perfect: I have finished."),
        P(EQ("eq-u3-tricky"), "Each of the girls ___ a red ribbon.", "has", [["have", "sva-number-error"], ["are having", "sva-number-error"], ["were having", "sva-number-error"]], "EACH means every single one, so the verb is singular: each … has."),
        P(EQ("eq-u3-tricky"), "The news ___ very good today.", "is", [["are", "sva-number-error"], ["were", "sva-number-error"], ["have", "sva-number-error"]], "NEWS looks plural but is singular: the news is."),
        P(EQ("eq-u2-a-an"), "She is ___ honest girl.", "an", [["a", "a-an-mixup"], ["any", "determiner-number-mixup"], ["much", "determiner-number-mixup"]], "HONEST starts with a vowel sound (the h is silent): an honest girl."),
        P(EQ("eq-u2-the"), "___ Ganga is a holy river.", "The", [["A", "the-rule-mixup"], ["An", "the-rule-mixup"], ["Some", "the-rule-mixup"]], "Names of rivers take THE: the Ganga."),
        P(EQ("eq-u1-prepositions"), "My birthday is ___ 12 March.", "on", [["in", "preposition-time-mixup"], ["at", "preposition-time-mixup"], ["since", "since-for-mixup"]], "ON for dates and days: on 12 March."),
        P(EQ("eq-u5-perfect"), "Rahul has been ill ___ Monday.", "since", [["for", "since-for-mixup"], ["on", "preposition-time-mixup"], ["till", "preposition-time-mixup"]], "SINCE + a starting point (Monday); FOR + a length of time (three days)."),
        P(EQ("eq-u8-reason"), "___ it was raining, the match went on.", "Although", [["Because", "conjunction-meaning-error"], ["Unless", "conjunction-meaning-error"], ["So", "conjunction-meaning-error"]], "Rain, and still the match went on: a surprise → ALTHOUGH."),
        P(EQ("eq-u1-adjectives"), "Mount Everest is the ___ mountain in the world.", "highest", [["higher", "degree-mixup"], ["high", "degree-mixup"], ["most high", "degree-mixup"]], "THE … IN THE WORLD → the superlative: highest."),
        P(EQ("eq-u1-adjectives"), "This box is ___ than that one.", "heavier", [["heaviest", "degree-mixup"], ["more heavy", "degree-mixup"], ["heavy", "degree-mixup"]], "THAN → comparative: heavy → heavier."),
        P(EQ("eq-u1-adverbs"), "The tortoise moved ___ across the garden.", "slowly", [["slowness", "pos-noun-mixup"], ["slowed", "pos-verb-mixup"], ["slowing", "pos-verb-mixup"]], "HOW did it move? An adverb: slowly."),
        P(EQ("eq-u6-must"), "You ___ not shout in a hospital.", "must", [["does", "modal-form-error"], ["did", "modal-form-error"], ["are", "modal-form-error"]], "MUST NOT = it is not allowed."),
        P(EQ("eq-u6-tags"), "She can swim, ___?", "can't she", [["doesn't she", "tag-helper-error"], ["isn't she", "tag-helper-error"], ["can she", "tag-polarity-error"]], "Same helper (can), flipped to negative: can't she?"),
        P(EQ("eq-u7-reported"), "Ravi said, \"I am tired.\" → Ravi said that he ___ tired.", "was", [["am", "reported-pronoun-error"], ["were", "sva-number-error"], ["be", "reported-tense-error"]], "SAID (past) → am becomes was: he was tired."),
        P(EQ("eq-u7-passive"), "The letter ___ by Meera yesterday.", "was written", [["wrote", "passive-form-error"], ["is written", "passive-tense-error"], ["was write", "passive-form-error"]], "Passive in the past: was + past participle → was written."),
        P(EQ("eq-u9-commas"), "Which sentence is punctuated correctly?", "Yes, I have a pen, a pencil and a ruler.", [["Yes I have a pen, a pencil, and, a ruler.", "comma-extra-error"], ["Yes, I have, a pen a pencil and a ruler.", "comma-extra-error"], ["Yes I have a pen a pencil and a ruler,", "comma-list-error"]], "A comma after YES, and commas between the things in the list."),
        P(WP("wp-spelling"), "Choose the correctly spelt word.", "necessary", [["neccessary", "spelling-double-letter"], ["necesary", "spelling-double-letter"], ["neccesary", "spelling-double-letter"]], "One C, two S: necessary."),
        P(WP("wp-synant"), "Choose the word that means the same as 'rapid'.", "fast", [["slow", "antonym-error"], ["late", "synonym-error"], ["quiet", "synonym-error"]], "Rapid means fast, like a rapid river."),
        P(WP("wp-synant"), "Choose the word that means the opposite of 'expand'.", "shrink", [["grow", "synonym-error"], ["widen", "synonym-error"], ["stretch", "synonym-error"]], "Expand means get bigger; shrink means get smaller."),
        P(WP("wp-colloc"), "A person who writes books is called an ___.", "author", [["editor", "word-meaning"], ["actor", "word-meaning"], ["artist", "word-meaning"]], "An author writes books. An editor checks them; an actor acts; an artist paints or draws."),
        P(WP("wp-spelling"), "The wind ___ the papers off the table.", "blew", [["blue", "homophone-mixup"], ["blow", "tense-present-past-mixup"], ["blewed", "tense-form-error"]], "Past of blow is blew. BLUE (same sound) is a colour."),
        P(EQ("eq-u4-errors"), "Which part has a mistake? 'My sister / don't like / bitter gourd / at all.'", "don't like", [["My sister", "error-location-mixup"], ["bitter gourd", "error-location-mixup"], ["at all", "error-location-mixup"]], "MY SISTER is one person → doesn't like."),
        P(EQ("eq-u2-determiners"), "There isn't ___ milk left in the jug.", "much", [["many", "countable-uncountable-mixup"], ["a few", "countable-uncountable-mixup"], ["few", "countable-uncountable-mixup"]], "MILK can't be counted, so we use MUCH (many/few are for things we can count)."),
        P(WP("wp-spelling"), "Which word means 'not happy'?", "unhappy", [["dishappy", "prefix-error"], ["inhappy", "prefix-error"], ["nonhappy", "prefix-error"]], "The prefix UN- makes the opposite: happy → unhappy."),
      ],
    },
    {
      id: "reading",
      title: "Reading",
      marks: 1,
      questions: [
        P(EQ("eq-u8-reading"), "What is an arribada?", "Many turtles arriving together to lay eggs", [["A kind of turtle egg", "detail-missed"], ["A beach in Spain", "not-in-passage"], ["A baby turtle's first swim", "detail-missed"]], "Thousands of turtles arrive together on the same few nights: an arribada.", { passage: "turtles", evidence: { paragraph: 0, text: "People call this an arribada" } }),
        P(EQ("eq-u8-reading"), "Why did Nisha's uncle say 'no torches'?", "Lights can confuse the baby turtles.", [["Torches cost too much.", "not-in-passage"], ["The turtles were scared of Nisha.", "not-in-passage"], ["Children may not carry torches.", "not-in-passage"]], "Bright lights can make hatchlings crawl the wrong way.", { passage: "turtles", evidence: { paragraph: 3, text: "Bright lights from houses and shops can confuse them" } }),
        P(EQ("eq-u8-reading"), "In the passage, 'hatchlings' are ___.", "baby animals that have just come out of eggs", [["turtles that are very old", "word-meaning"], ["people who watch turtles", "word-meaning"], ["eggs that have not opened", "word-meaning"]], "The tiny turtles had just come out of their eggs in the sand.", { passage: "turtles", evidence: { paragraph: 3, text: "hatchlings move towards the brightest part of the sky" } }),
        P(EQ("eq-u8-reading"), "Why did Nisha's uncle not let her help a slow turtle?", "The walk to the sea makes them stronger.", [["The turtle might bite her.", "not-in-passage"], ["It was too heavy to lift.", "not-in-passage"], ["Nobody may touch the sand.", "not-in-passage"]], "He whispered: 'The walk to the sea makes them stronger.'", { passage: "turtles", evidence: { paragraph: 2, text: "\"The walk to the sea makes them stronger,\" he whispered." } }),
        P(EQ("eq-u8-reading"), "Select the INCORRECT statement according to the passage.", "The turtles come to lay eggs in the daytime.", [["The baby turtles were about as big as a palm.", "statement-check"], ["The village switches off its lights on hatching nights.", "statement-check"], ["Nisha's uncle is a volunteer.", "statement-check"]], "They arrive at NIGHT: 'all on the same few nights'.", { passage: "turtles", evidence: { paragraph: 0, text: "all on the same few nights" } }),
        P(EQ("eq-u8-reading"), "How did Nisha feel at the end?", "Proud", [["Bored", "inference"], ["Scared", "inference"], ["Angry", "inference"]], "The passage says Nisha felt proud of the quiet, dark beach.", { passage: "turtles", evidence: { paragraph: 4, text: "Nisha felt proud of the quiet, dark beach" } }),
        P(EQ("eq-u8-reading"), "Which word in paragraph 3 is the opposite of 'loudly'?", "quietly", [["tiny", "word-meaning"], ["slow", "word-meaning"], ["stronger", "word-meaning"]], "They sat QUIETLY: the opposite of loudly.", { passage: "turtles", evidence: { paragraph: 2, text: "They sat quietly near a fenced area of sand." } }),
        P(EQ("eq-u9-reading"), "What can you do with an old storybook during Book Week?", "Swap it for another book", [["Sell it to the library", "not-in-passage"], ["Give it to Mrs Kapoor", "detail-missed"], ["Leave it in the hall", "not-in-passage"]], "The notice says: swap it for a 'new' one.", { passage: "notice", evidence: { paragraph: 1, text: "Bring one old storybook and swap it for a 'new' one." } }),
        P(EQ("eq-u9-reading"), "By when must you give your name for the contest?", "By Tuesday", [["By Thursday", "detail-missed"], ["By Friday", "detail-missed"], ["By 10 November", "detail-missed"]], "Give your name to Mrs Kapoor by Tuesday.", { passage: "notice", evidence: { paragraph: 2, text: "Give your name to Mrs Kapoor by Tuesday." } }),
        P(EQ("eq-u9-reading"), "Why will the library be closed on Friday afternoon?", "For stock-taking", [["For the story-telling contest", "detail-missed"], ["Because it is a holiday", "not-in-passage"], ["To paint the walls", "not-in-passage"]], "The notice says it closes for stock-taking.", { passage: "notice", evidence: { paragraph: 3, text: "closed on Friday afternoon for stock-taking" } }),
      ],
    },
    {
      id: "everyday",
      title: "Everyday English",
      marks: 1,
      questions: [
        P(WP("wp-dialogue"), "Your friend says, \"I came first in the race!\" What is the best reply?", "Congratulations! Well done!", [["I am sorry to hear that.", "situation-mixup"], ["Never mind, try again.", "situation-mixup"], ["Thank you very much.", "situation-mixup"]], "Good news → congratulate your friend."),
        P(WP("wp-dialogue"), "You bump into someone by mistake. What do you say?", "Sorry! Are you all right?", [["Thank you.", "situation-mixup"], ["Congratulations!", "situation-mixup"], ["You're welcome.", "situation-mixup"]], "Say sorry and check that they are fine."),
        P(WP("wp-dialogue"), "Someone says, \"Thank you for helping me.\" What do you reply?", "You're welcome.", [["Excuse me.", "situation-mixup"], ["Get well soon.", "situation-mixup"], ["Same to you.", "situation-mixup"]], "The polite reply to thank you is: You're welcome."),
        P(WP("wp-idioms"), "To 'keep an eye on' something means to ___.", "watch it carefully", [["close one eye", "idiom-literal-mixup"], ["touch it with your eye", "idiom-literal-mixup"], ["forget about it", "idiom-meaning-mixup"]], "Keep an eye on your bag = watch it carefully."),
        P(EQ("eq-u6-can"), "You want to borrow your teacher's pen. What is the most polite way to ask?", "May I borrow your pen, please?", [["Give me your pen.", "polite-request-mixup"], ["I want your pen now.", "polite-request-mixup"], ["Your pen, I am taking it.", "polite-request-mixup"]], "MAY I … PLEASE? is the most polite way to ask."),
      ],
    },
    {
      id: "champion",
      title: "Champion questions",
      marks: 3,
      questions: [
        P(EQ("eq-u5-future"), "If it ___ tomorrow, we ___ the picnic.", "rains, will cancel", [["will rain, cancel", "tense-future-form-error"], ["rained, will cancel", "tense-present-past-mixup"], ["rains, cancelled", "tense-present-past-mixup"]], "IF + present, then will + verb: If it rains, we will cancel."),
        P(WP("wp-colloc"), "The scientist made an important ___ about the stars.", "discovery", [["discover", "pos-verb-mixup"], ["discovered", "pos-verb-mixup"], ["discovering", "pos-verb-mixup"]], "After AN IMPORTANT we need a noun: discovery."),
        P(EQ("eq-u8-pairs"), "Which sentence has NO mistake?", "Neither the boys nor their father was at home.", [["Neither the boys nor their father were at home.", "sva-number-error"], ["Neither the boys or their father was at home.", "conjunction-pair-error"], ["Either the boys nor their father was at home.", "conjunction-pair-error"]], "NEITHER … NOR, and the verb matches the nearer word: their father → was."),
        P(EQ("eq-u7-passive"), "Change to passive: 'The children are painting the wall.'", "The wall is being painted by the children.", [["The wall is painted by the children.", "passive-tense-error"], ["The wall was being painted by the children.", "passive-tense-error"], ["The wall has been painted by the children.", "passive-tense-error"]], "ARE PAINTING (present continuous) → is being painted."),
        P(EQ("eq-u7-reported"), "Mum said to me, \"Have you finished your lunch?\" Which is the correct reported speech?", "Mum asked me if I had finished my lunch.", [["Mum asked me have I finished my lunch.", "reported-question-error"], ["Mum said to me that had I finished my lunch.", "reported-question-error"], ["Mum asked me that if I had finished my lunch.", "reported-question-error"]], "A yes/no question → ASKED + IF, normal word order, and have finished → had finished."),
      ],
    },
  ],
};

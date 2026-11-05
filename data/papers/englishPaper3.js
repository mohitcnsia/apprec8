// data/papers/englishPaper3.js: Practice paper, English, Paper 3 (Claude, 2026-11-05). Harder than Papers 1–2
// (Pratha: the real paper was harder): trickier agreement, tags and reported speech, olympiad-level words, and an
// information passage with inference questions. Same shape: 30 Words & Grammar · 10 Reading · 5 Everyday English ·
// 5 Champion (3 marks) = 60 marks. Original questions (past papers only as a guide). DRAFT until Seema / the owner OK.
// Ambiguity rules: no style splits (no singular "their", no optional backshift, no "took a decision"), every wrong
// option wrong in meaning or grammar.
import { q } from "../englishQuest/helpers.js";

const P = (topic, question, correct, wrongs, explanation, extra = {}) => ({ topic, ...q(question, correct, wrongs, explanation), ...extra });
const EQ = (node) => ({ quest: "english-quest", node });
const WP = (node) => ({ quest: "word-power", node });
const R = (paragraph, text) => ({ passage: "bees", evidence: { paragraph, text } });

export default {
  id: "paper-en-3",
  subject: "english",
  title: "Paper 3",
  minutes: 60,
  grades: [5],
  draft: false, // owner approved 2026-11-05
  passages: {
    bees: {
      title: "How Bees Share a Secret",
      paragraphs: [
        "When a honeybee finds a field full of flowers, she does not keep the news to herself. She flies back to the hive and tells her sisters exactly where to go. But bees cannot speak, so how does she do it? She dances.",
        "Inside the dark hive, the bee walks in a straight line while shaking her body from side to side. Then she circles back and does it again, tracing a shape like the number eight. Scientists call this the waggle dance.",
        "The dance is a map. The direction of the straight walk shows which way to fly, compared with the position of the sun. The longer the bee waggles, the farther away the flowers are. A short waggle might mean a few hundred metres; a long one can mean more than a kilometre.",
        "The other bees press close and follow every move. They also smell the scent of the flowers on the dancer's body, which helps them recognise the right field when they arrive. Within minutes, dozens of bees may set off in the same direction.",
        "An Austrian scientist named Karl von Frisch spent years studying this dance. In 1973 he won the Nobel Prize for his work. Thanks to him, we know that even a tiny insect can share a detailed message without saying a single word.",
      ],
    },
  },
  parts: [
    {
      id: "words",
      title: "Words & Grammar",
      marks: 1,
      questions: [
        P(EQ("eq-u1-nouns"), "Choose the correct plural: one crisis, two ___", "crises", [["crisises", "plural-form-error"], ["crisis", "plural-form-error"], ["crisies", "plural-form-error"]], "Words ending in -is change to -es: crisis → crises, axis → axes."),
        P(EQ("eq-u1-nouns"), "A ___ of lions was resting under the tree.", "pride", [["pack", "collective-noun-mixup"], ["herd", "collective-noun-mixup"], ["flock", "collective-noun-mixup"]], "A pride of lions; a pack of wolves; a herd of cows; a flock of birds."),
        P(EQ("eq-u1-pronouns"), "Between you and ___, the plan is a secret.", "me", [["I", "pronoun-case-error"], ["myself", "pronoun-case-error"], ["mine", "pronoun-case-error"]], "After BETWEEN (a preposition) we use the object form: between you and me."),
        P(EQ("eq-u1-pronouns"), "This is the boy ___ won the race.", "who", [["whom", "pronoun-case-error"], ["which", "relative-pronoun-error"], ["whose", "relative-pronoun-error"]], "The boy did the winning (subject), and he is a person: who."),
        P(EQ("eq-u5-simple"), "She ___ her keys yesterday and found them today.", "lost", [["loses", "tense-present-past-mixup"], ["has lost", "tense-perfect-mixup"], ["losed", "tense-form-error"]], "YESTERDAY → simple past. Lose → lost."),
        P(EQ("eq-u5-cont"), "I ___ a story when the lights went out.", "was reading", [["am reading", "tense-present-past-mixup"], ["have read", "tense-perfect-mixup"], ["were reading", "sva-number-error"]], "A longer action in the past, interrupted by a short one: was reading."),
        P(EQ("eq-u5-perfect"), "She ___ in Pune for ten years before she moved to Delhi.", "had lived", [["has lived", "tense-perfect-mixup"], ["lives", "tense-present-past-mixup"], ["is living", "tense-continuous-mixup"]], "The earlier of two past actions takes HAD: had lived, then moved."),
        P(EQ("eq-u5-future"), "By next June, I ___ at this school for five years.", "will have studied", [["will study", "tense-future-form-error"], ["have studied", "tense-perfect-mixup"], ["am studying", "tense-continuous-mixup"]], "BY + a future time → will have + past participle: will have studied."),
        P(EQ("eq-u3-tricky"), "The news about the floods ___ worrying.", "is", [["are", "sva-number-error"], ["were", "sva-number-error"], ["have been", "sva-number-error"]], "NEWS is singular (the subject is 'news', not 'floods'): the news is."),
        P(EQ("eq-u3-tricky"), "A pair of scissors ___ on the desk.", "is", [["are", "sva-number-error"], ["were", "sva-number-error"], ["have", "sva-number-error"]], "The subject is A PAIR (one pair): a pair of scissors is."),
        P(EQ("eq-u2-the"), "___ Himalayas are the highest mountains in the world.", "The", [["A", "the-rule-mixup"], ["An", "the-rule-mixup"], ["Some", "the-rule-mixup"]], "Mountain ranges take THE: the Himalayas, the Alps."),
        P(EQ("eq-u2-determiners"), "Very ___ students came, so the hall was almost empty.", "few", [["a few", "few-a-few-mixup"], ["many", "determiner-meaning-error"], ["much", "countable-uncountable-mixup"]], "FEW (not many) fits 'almost empty'; we can't say 'very a few'."),
        P(EQ("eq-u1-prepositions"), "Arjun is very good ___ drawing.", "at", [["in", "preposition-mixup"], ["on", "preposition-mixup"], ["with", "preposition-mixup"]], "We say good AT something: good at drawing."),
        P(EQ("eq-u1-adjectives"), "This is the ___ of the two pencils.", "sharper", [["sharpest", "degree-mixup"], ["most sharp", "degree-mixup"], ["more sharper", "degree-mixup"]], "Comparing TWO → the comparative: the sharper of the two."),
        P(EQ("eq-u1-adjectives"), "She bought a ___ dress.", "beautiful long red", [["red long beautiful", "adjective-order-error"], ["long beautiful red", "adjective-order-error"], ["red beautiful long", "adjective-order-error"]], "Adjective order: opinion (beautiful) → size (long) → colour (red)."),
        P(EQ("eq-u8-reason"), "___ he was very tired, he finished his homework.", "Though", [["Because", "conjunction-meaning-error"], ["So", "conjunction-meaning-error"], ["Unless", "conjunction-meaning-error"]], "Tired, yet he still finished: a surprise → though."),
        P(EQ("eq-u8-time"), "Do not cross the road ___ the light turns green.", "until", [["after", "conjunction-meaning-error"], ["while", "conjunction-meaning-error"], ["since", "conjunction-meaning-error"]], "Wait up to that moment: not … until the light turns green."),
        P(EQ("eq-u8-pairs"), "She is ___ clever ___ hardworking.", "both … and", [["either … nor", "pair-mixup"], ["neither … or", "pair-mixup"], ["not … but", "pair-mixup"]], "Two good things together: both clever and hardworking."),
        P(EQ("eq-u6-must"), "You ___ have told me earlier! Now it's too late.", "should", [["can", "modal-meaning-error"], ["will", "modal-meaning-error"], ["must", "modal-meaning-error"]], "SHOULD HAVE + past participle = it was the right thing, but it didn't happen."),
        P(EQ("eq-u6-tags"), "Let's go to the park, ___?", "shall we", [["will we", "tag-helper-error"], ["don't we", "tag-helper-error"], ["aren't we", "tag-helper-error"]], "LET'S … takes the tag 'shall we?'"),
        P(EQ("eq-u6-tags"), "Nobody called me, ___?", "did they", [["didn't they", "tag-polarity-error"], ["didn't he", "tag-polarity-error"], ["was it", "tag-helper-error"]], "NOBODY makes the sentence negative, so the tag is positive: did they?"),
        P(EQ("eq-u7-passive"), "The thief ___ by the police last night.", "was caught", [["caught", "passive-form-error"], ["is caught", "passive-tense-error"], ["was catch", "passive-form-error"]], "Passive in the past: was + past participle → was caught."),
        P(EQ("eq-u7-reported"), "The teacher said, \"Don't talk.\" Which is correct?", "The teacher told us not to talk.", [["The teacher told us don't talk.", "reported-command-error"], ["The teacher said us not to talk.", "reported-command-error"], ["The teacher told to us not talking.", "reported-command-error"]], "Orders: told + person + NOT TO + verb."),
        P(EQ("eq-u9-commas"), "Which sentence uses the comma correctly?", "After the match, we went home.", [["After, the match we went home.", "comma-extra-error"], ["After the match we, went home.", "comma-extra-error"], ["After the match we went, home.", "comma-extra-error"]], "The comma comes after the opening phrase: After the match, …"),
        P(EQ("eq-u9-apos"), "The ___ toys were all over the floor. (The toys belong to many children.)", "children's", [["childrens'", "apostrophe-plural-error"], ["childrens", "apostrophe-missing-error"], ["children'", "apostrophe-plural-error"]], "CHILDREN is already plural, so add 's: children's."),
        P(EQ("eq-u4-errors"), "Which part has a mistake? 'Each of the players / were given / a medal / after the match.'", "were given", [["Each of the players", "error-location-mixup"], ["a medal", "error-location-mixup"], ["after the match", "error-location-mixup"]], "EACH is singular: each of the players WAS given."),
        P(WP("wp-synant"), "Choose the word closest in meaning to 'diligent'.", "hardworking", [["lazy", "antonym-error"], ["careless", "antonym-error"], ["clever", "synonym-error"]], "A diligent student works hard and carefully."),
        P(WP("wp-synant"), "Choose the word that means the opposite of 'generous'.", "selfish", [["kind", "synonym-error"], ["giving", "synonym-error"], ["wealthy", "synonym-error"]], "Generous people share; selfish people keep things for themselves."),
        P(WP("wp-spelling"), "Choose the correctly spelt word.", "occasion", [["occassion", "spelling-double-letter"], ["ocasion", "spelling-double-letter"], ["occation", "spelling-double-letter"]], "Double C, single S: occasion."),
        P(WP("wp-colloc"), "It was raining ___, so we stayed indoors.", "heavily", [["strongly", "collocation-error"], ["hardly", "collocation-error"], ["thickly", "collocation-error"]], "We say rain falls HEAVILY. (HARDLY means almost not.)"),
      ],
    },
    {
      id: "reading",
      title: "Reading",
      marks: 1,
      questions: [
        P(EQ("eq-u8-reading"), "What is the passage mainly about?", "How bees use a dance to share where food is", [["Why bees cannot find flowers on their own", "main-idea-error"], ["How scientists learned to dance like bees", "main-idea-error"], ["Why bees fly only when the sun is out", "main-idea-error"]], "Every paragraph explains the waggle dance and the message it carries.", R(0, "She dances.")),
        P(EQ("eq-u8-reading"), "Why does the bee dance instead of telling the others?", "Bees cannot speak.", [["The hive is too noisy.", "not-in-passage"], ["Dancing is faster than flying.", "not-in-passage"], ["Her sisters are asleep.", "not-in-passage"]], "The passage says bees cannot speak, so she dances.", R(0, "But bees cannot speak")),
        P(EQ("eq-u8-reading"), "The waggle dance traces a shape like ___.", "the number eight", [["a full circle only", "detail-missed"], ["a straight line only", "detail-missed"], ["a triangle", "not-in-passage"]], "She walks straight, circles back and repeats: a figure of eight.", R(1, "tracing a shape like the number eight")),
        P(EQ("eq-u8-reading"), "A bee waggles for a long time. The flowers are probably ___.", "far away", [["very close by", "inference-error"], ["inside the hive", "inference-error"], ["already dried up", "not-in-passage"]], "The longer the waggle, the farther away the flowers.", R(2, "The longer the bee waggles, the farther away the flowers are")),
        P(EQ("eq-u8-reading"), "The direction of the straight walk tells the bees ___.", "which way to fly", [["how many flowers there are", "detail-missed"], ["what colour the flowers are", "not-in-passage"], ["when to go back to sleep", "not-in-passage"]], "The direction shows which way to fly, compared with the sun.", R(2, "The direction of the straight walk shows which way to fly")),
        P(EQ("eq-u8-reading"), "How do the bees recognise the right field when they arrive?", "By the scent on the dancer's body", [["By the colour of the dancer's wings", "not-in-passage"], ["By a buzzing song she teaches them", "not-in-passage"], ["By following the dancer all the way", "detail-missed"]], "They smell the flowers' scent on the dancer.", R(3, "They also smell the scent of the flowers on the dancer's body")),
        P(EQ("eq-u8-reading"), "In paragraph 4, 'dozens of bees' means ___.", "a large number of bees", [["exactly two bees", "word-meaning"], ["only a very few bees", "word-meaning"], ["just the dancing bee", "word-meaning"]], "A dozen is twelve; dozens means many.", R(3, "dozens of bees may set off")),
        P(EQ("eq-u8-reading"), "Why does the writer say 'The dance is a map'?", "It shows the way and how far to go.", [["Bees draw maps on the hive walls.", "inference-error"], ["The hive is shaped like a map.", "inference-error"], ["Scientists use maps to find hives.", "inference-error"]], "Like a map, the dance gives direction and distance.", R(2, "The dance is a map.")),
        P(EQ("eq-u8-reading"), "What did Karl von Frisch win in 1973?", "The Nobel Prize", [["A dance competition", "not-in-passage"], ["A gold medal for flying", "not-in-passage"], ["A prize for the best honey", "not-in-passage"]], "He won the Nobel Prize for studying the dance.", R(4, "In 1973 he won the Nobel Prize for his work")),
        P(EQ("eq-u8-reading"), "Which word best describes the bee's message, according to the passage?", "detailed", [["confusing", "inference-error"], ["careless", "inference-error"], ["noisy", "inference-error"]], "The last line calls it a detailed message.", R(4, "share a detailed message")),
      ],
    },
    {
      id: "everyday",
      title: "Everyday English",
      marks: 1,
      questions: [
        P(WP("wp-dialogue"), "Your grandmother says she is not feeling well. What is the kindest reply?", "I'm sorry to hear that. Please rest.", [["That's great news!", "situation-mixup"], ["Congratulations, Grandma!", "situation-mixup"], ["It doesn't matter.", "situation-mixup"]], "When someone is unwell, we show we care."),
        P(WP("wp-dialogue"), "You want to ask your teacher a question while she is speaking. What do you say?", "Excuse me, may I ask something?", [["Stop talking, I have a question.", "situation-mixup"], ["Hey, listen to me!", "situation-mixup"], ["Sorry for your loss.", "situation-mixup"]], "'Excuse me, may I …?' interrupts politely."),
        P(WP("wp-idioms"), "To 'let the cat out of the bag' means to ___.", "tell a secret by mistake", [["set a pet free", "idiom-literal-mixup"], ["buy a new bag", "idiom-literal-mixup"], ["catch a runaway cat", "idiom-literal-mixup"]], "It means a secret slips out."),
        P(WP("wp-idioms"), "'Once in a blue moon' means ___.", "very rarely", [["every single night", "idiom-meaning-mixup"], ["when the moon turns blue", "idiom-literal-mixup"], ["at the start of each week", "idiom-meaning-mixup"]], "It means almost never."),
        P(WP("wp-idioms"), "If someone is 'all ears', they are ___.", "listening carefully", [["making a lot of noise", "idiom-meaning-mixup"], ["unable to hear well", "idiom-meaning-mixup"], ["getting very angry", "idiom-meaning-mixup"]], "'I'm all ears' means 'I'm listening closely.'"),
      ],
    },
    {
      id: "champion",
      title: "Champion questions",
      marks: 3,
      questions: [
        P(EQ("eq-u3-tricky"), "Which sentence is correct?", "The teacher, along with her students, is going on a trip.", [["The teacher, along with her students, are going on a trip.", "sva-number-error"], ["The teacher, along with her students, were going on a trips.", "sva-number-error"], ["The teacher, along with her students, is go on a trip.", "tense-form-error"]], "ALONG WITH doesn't change the subject: the teacher (one) is going."),
        P(EQ("eq-u7-passive"), "Change to passive: 'Who wrote this letter?'", "By whom was this letter written?", [["Who was this letter written?", "passive-form-error"], ["By whom this letter was written?", "passive-form-error"], ["Whom wrote this letter?", "passive-form-error"]], "Passive question: By whom + was + subject + past participle?"),
        P(EQ("eq-u5-future"), "If I ___ a bird, I ___ fly over the mountains.", "were, would", [["am, will", "conditional-form-error"], ["was, will", "conditional-form-error"], ["were, will", "conditional-form-error"]], "An imaginary situation: If I were …, I would …"),
        P(EQ("eq-u8-reason"), "Which sentence means the same as: 'Although it was late, the shop was open.'?", "It was late, but the shop was open.", [["It was late, so the shop was open.", "conjunction-meaning-error"], ["Because it was late, the shop was open.", "conjunction-meaning-error"], ["The shop was open, so it was late.", "conjunction-meaning-error"]], "ALTHOUGH and BUT both show a surprise; SO and BECAUSE show a reason."),
        P(EQ("eq-u9-speech"), "Which sentence is punctuated correctly?", "\"Can you help me?\" asked Rohan.", [["\"Can you help me,\" asked Rohan?", "speech-marks-error"], ["\"Can you help me?\", asked Rohan.", "speech-marks-error"], ["\"Can you help me\" asked Rohan?", "speech-marks-error"]], "The question mark goes inside the speech marks, and nothing else after it."),
      ],
    },
  ],
};

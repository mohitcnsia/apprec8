// data/papers/englishPaper2.js: Practice paper, English, Paper 2 (Claude, 2026-11-05). DRAFT: testers only until Seema /
// the owner approve the questions. Same shape as Paper 1: 30 Words & Grammar · 10 Reading · 5 Everyday English ·
// 5 Champion (3 marks) = 60 marks. All questions are original (past papers used only as a guide to topics and style),
// none copied from Paper 1 or the quest pools. Same ambiguity rules: no style splits (no optional backshift, no
// British "team are"), every wrong option wrong in meaning or grammar.
import { q } from "../englishQuest/helpers.js";

const P = (topic, question, correct, wrongs, explanation, extra = {}) => ({ topic, ...q(question, correct, wrongs, explanation), ...extra });
const EQ = (node) => ({ quest: "english-quest", node });
const WP = (node) => ({ quest: "word-power", node });
const R = (paragraph, text) => ({ passage: "birds", evidence: { paragraph, text } });

export default {
  id: "paper-en-2",
  subject: "english",
  title: "Paper 2",
  minutes: 60,
  grades: [5],
  draft: true, // testers only until Seema / the owner approve the questions
  passages: {
    birds: {
      title: "The Lake Bird Count",
      paragraphs: [
        "On a cool Saturday morning in December, Kavya's school held its first bird count at Pulicat Lake. The children carried notebooks, pencils and two pairs of binoculars that they had to share. Their science teacher, Mr Joseph, explained the rule: count only the birds you can see clearly, and never chase them.",
        "At first, Kavya saw nothing but water and reeds. Then a flash of pink caught her eye. Hundreds of flamingos were standing on one leg in the shallow water. \"Why do they stand like that?\" she whispered. Mr Joseph smiled. \"Scientists think it helps them stay warm, because less of the body touches the cold water.\"",
        "Kavya's partner, Imran, was in charge of the tally sheet. Every time they agreed on a bird, he drew a short line. He grouped the lines in fives so that counting would be easier later.",
        "By noon, the class had seen twenty-three kinds of birds. Some of them, like the flamingos and the pelicans, had flown thousands of kilometres to spend the winter at the lake. Mr Joseph said these visitors are called migratory birds.",
        "Before leaving, the children picked up plastic bottles from the shore. \"A clean lake is a safe home for the birds,\" said Imran. Kavya decided she would come back in March to see if the visitors had started their long journey home.",
      ],
    },
  },
  parts: [
    {
      id: "words",
      title: "Words & Grammar",
      marks: 1,
      questions: [
        P(EQ("eq-u1-nouns"), "Choose the correct plural: one mouse, two ___", "mice", [["mouses", "plural-form-error"], ["mices", "plural-form-error"], ["mouse's", "apostrophe-plural-error"]], "Some plurals change the vowel: mouse → mice, tooth → teeth."),
        P(EQ("eq-u1-nouns"), "A ___ of sheep was grazing on the hill.", "flock", [["swarm", "collective-noun-mixup"], ["school", "collective-noun-mixup"], ["bunch", "collective-noun-mixup"]], "A flock of sheep (or birds); a swarm of bees; a school of fish; a bunch of grapes."),
        P(EQ("eq-u1-pronouns"), "This bag is not mine. It is ___.", "hers", [["her's", "apostrophe-plural-error"], ["she", "pronoun-case-error"], ["herself", "pronoun-case-error"]], "Possessive pronouns have no apostrophe: hers, ours, yours."),
        P(EQ("eq-u1-pronouns"), "The teacher gave Aman and ___ a prize.", "me", [["I", "pronoun-case-error"], ["myself", "pronoun-case-error"], ["mine", "pronoun-case-error"]], "Take Aman away: 'The teacher gave me a prize.' So: Aman and me."),
        P(EQ("eq-u5-simple"), "Yesterday the school bell ___ at nine o'clock.", "rang", [["rung", "participle-form-error"], ["ring", "tense-present-past-mixup"], ["ringed", "tense-form-error"]], "YESTERDAY → simple past. Ring → rang → (has) rung."),
        P(EQ("eq-u5-cont"), "Listen! Someone ___ at the door.", "is knocking", [["knocked", "tense-present-past-mixup"], ["has knock", "tense-form-error"], ["knocking", "tense-continuous-mixup"]], "LISTEN! means it is happening now: is knocking."),
        P(EQ("eq-u5-perfect"), "We ___ in this town since 2020.", "have lived", [["live", "tense-present-past-mixup"], ["are living", "tense-continuous-mixup"], ["lived", "tense-present-past-mixup"]], "SINCE 2020 and still now → present perfect: have lived."),
        P(EQ("eq-u5-future"), "Look at those dark clouds! It ___ rain.", "is going to", [["will to", "tense-future-form-error"], ["going", "tense-future-form-error"], ["is go to", "tense-future-form-error"]], "We can see the clouds now, so: is going to rain."),
        P(EQ("eq-u3-tricky"), "Neither Riya nor her brothers ___ at home.", "are", [["is", "sva-number-error"], ["was", "sva-number-error"], ["has", "sva-number-error"]], "With NEITHER … NOR, the verb agrees with the nearer subject: brothers are."),
        P(EQ("eq-u3-there"), "There ___ two cats on the wall.", "are", [["is", "sva-number-error"], ["was", "sva-number-error"], ["be", "sva-form-error"]], "Two cats = plural: there are."),
        P(EQ("eq-u2-a-an"), "He waited for ___ hour at the bus stop.", "an", [["a", "a-an-mixup"], ["any", "determiner-number-mixup"], ["many", "determiner-number-mixup"]], "HOUR starts with a vowel sound (silent h): an hour."),
        P(EQ("eq-u2-the"), "___ sun rises in the east.", "The", [["A", "the-rule-mixup"], ["An", "the-rule-mixup"], ["Some", "the-rule-mixup"]], "There is only one sun, so we say THE sun."),
        P(EQ("eq-u1-prepositions"), "We have a music class ___ Monday.", "on", [["in", "preposition-time-mixup"], ["at", "preposition-time-mixup"], ["since", "since-for-mixup"]], "ON with days and dates: on Monday."),
        P(EQ("eq-u1-adjectives"), "Of all the girls in the class, Neha is the ___.", "tallest", [["taller", "degree-mixup"], ["tall", "degree-mixup"], ["most tall", "degree-mixup"]], "OF ALL → the superlative: tallest."),
        P(EQ("eq-u1-adjectives"), "This puzzle is ___ than the last one.", "more difficult", [["difficulter", "degree-mixup"], ["most difficult", "degree-mixup"], ["difficult", "degree-mixup"]], "Long adjectives use MORE: more difficult than."),
        P(EQ("eq-u1-adverbs"), "The baby slept ___ through the night.", "peacefully", [["peaceful", "pos-adjective-mixup"], ["peace", "pos-noun-mixup"], ["peacefulness", "pos-noun-mixup"]], "HOW did the baby sleep? An adverb: peacefully."),
        P(EQ("eq-u8-reason"), "I stayed at home ___ I had a cold.", "because", [["although", "conjunction-meaning-error"], ["but", "conjunction-meaning-error"], ["so", "conjunction-meaning-error"]], "The cold is the reason: because."),
        P(EQ("eq-u8-time"), "We waited inside ___ the rain stopped.", "until", [["before", "conjunction-meaning-error"], ["while", "conjunction-meaning-error"], ["since", "conjunction-meaning-error"]], "We waited up to the moment the rain stopped: until."),
        P(EQ("eq-u8-pairs"), "___ Ram ___ Shyam came to the party; they were both ill.", "Neither … nor", [["Either … or", "pair-mixup"], ["Both … and", "pair-mixup"], ["Not only … but also", "pair-mixup"]], "Both were ill, so neither came: Neither Ram nor Shyam."),
        P(EQ("eq-u6-can"), "___ you help me carry this box, please?", "Could", [["Must", "modal-meaning-error"], ["Shall", "modal-meaning-error"], ["Did", "modal-form-error"]], "Asking someone politely for help: Could you …, please?"),
        P(EQ("eq-u6-tags"), "They are coming today, ___?", "aren't they", [["don't they", "tag-helper-error"], ["isn't it", "tag-helper-error"], ["are they", "tag-polarity-error"]], "Same helper (are), flipped to negative: aren't they?"),
        P(EQ("eq-u7-passive"), "The classroom windows ___ every Friday.", "are cleaned", [["clean", "passive-form-error"], ["are clean", "passive-form-error"], ["cleaning", "passive-form-error"]], "Someone cleans them: passive = are + past participle → are cleaned."),
        P(EQ("eq-u7-reported"), "Raj said, \"My bag is heavy.\" → Raj said that ___ bag was heavy.", "his", [["my", "reported-pronoun-error"], ["your", "reported-pronoun-error"], ["our", "reported-pronoun-error"]], "In reported speech, MY (Raj's) becomes HIS."),
        P(EQ("eq-u9-apos"), "This is ___ book. (It belongs to Tom.)", "Tom's", [["Toms", "apostrophe-missing-error"], ["Toms'", "apostrophe-plural-error"], ["Tom", "apostrophe-missing-error"]], "One owner: add 's → Tom's book."),
        P(EQ("eq-u9-speech"), "Which sentence uses speech marks correctly?", "\"Come here,\" said Mother.", [["Come here,\" said Mother.", "speech-marks-error"], ["\"Come here, said Mother.\"", "speech-marks-error"], ["\"Come here\" said, Mother.", "speech-marks-error"]], "Speech marks go only around the words spoken: \"Come here,\" said Mother."),
        P(EQ("eq-u4-errors"), "Which part has a mistake? 'Every morning / my father go / for a walk / in the park.'", "my father go", [["Every morning", "error-location-mixup"], ["for a walk", "error-location-mixup"], ["in the park", "error-location-mixup"]], "My father (one person) goes: 'my father goes'."),
        P(WP("wp-synant"), "Choose the word that means the same as 'enormous'.", "huge", [["tiny", "antonym-error"], ["narrow", "synonym-error"], ["quiet", "synonym-error"]], "Enormous means very big: huge."),
        P(WP("wp-synant"), "Choose the word that means the opposite of 'ancient'.", "modern", [["old", "synonym-error"], ["historic", "synonym-error"], ["dusty", "synonym-error"]], "Ancient means very old; modern means new, of today."),
        P(WP("wp-spelling"), "I can ___ the birds singing.", "hear", [["here", "homophone-mixup"], ["hare", "homophone-mixup"], ["heard", "tense-form-error"]], "HEAR is what ears do. HERE is a place; a HARE is an animal."),
        P(WP("wp-colloc"), "A person who repairs taps and water pipes is a ___.", "plumber", [["carpenter", "word-meaning"], ["tailor", "word-meaning"], ["potter", "word-meaning"]], "A plumber fixes pipes. A carpenter works with wood; a tailor sews; a potter makes pots."),
      ],
    },
    {
      id: "reading",
      title: "Reading",
      marks: 1,
      questions: [
        P(EQ("eq-u8-reading"), "Where did the bird count take place?", "At Pulicat Lake", [["In the school garden", "not-in-passage"], ["At a bird zoo", "not-in-passage"], ["On a beach in March", "detail-missed"]], "The first sentence says the count was at Pulicat Lake.", R(0, "held its first bird count at Pulicat Lake")),
        P(EQ("eq-u8-reading"), "What was Mr Joseph's rule?", "Count only birds you can see clearly", [["Count every bird you can hear", "detail-missed"], ["Catch the birds before counting them", "not-in-passage"], ["Count only the pink birds", "detail-missed"]], "He said: count only the birds you can see clearly, and never chase them.", R(0, "count only the birds you can see clearly")),
        P(EQ("eq-u8-reading"), "According to the passage, why might flamingos stand on one leg?", "It may help them stay warm.", [["Their other leg is always hurt.", "not-in-passage"], ["They are too tired to walk.", "not-in-passage"], ["It helps them catch more fish.", "not-in-passage"]], "Mr Joseph says scientists think it helps them stay warm.", R(1, "it helps them stay warm")),
        P(EQ("eq-u8-reading"), "In paragraph 2, 'reeds' are most likely ___.", "tall grasses that grow in water", [["small fish in the lake", "word-meaning"], ["big waves on the water", "word-meaning"], ["wooden boats near the shore", "word-meaning"]], "Kavya saw 'water and reeds': plants growing at the lake's edge.", R(1, "nothing but water and reeds")),
        P(EQ("eq-u8-reading"), "What was Imran's job?", "He kept the tally sheet.", [["He held both binoculars.", "detail-missed"], ["He took photos of the birds.", "not-in-passage"], ["He drove the school bus.", "not-in-passage"]], "Imran was in charge of the tally sheet.", R(2, "was in charge of the tally sheet")),
        P(EQ("eq-u8-reading"), "Why did Imran group the lines in fives?", "To make counting easier later", [["Because there were five birds in all", "detail-missed"], ["Because the teacher told him to stop", "not-in-passage"], ["To save space and paper in the notebook", "not-in-passage"]], "He grouped them so that counting would be easier later.", R(2, "so that counting would be easier later")),
        P(EQ("eq-u8-reading"), "How many kinds of birds had the class seen by noon?", "Twenty-three", [["Hundreds", "detail-missed"], ["Five", "detail-missed"], ["Two", "detail-missed"]], "Hundreds were flamingos; the class saw twenty-three KINDS of birds.", R(3, "the class had seen twenty-three kinds of birds")),
        P(EQ("eq-u8-reading"), "Migratory birds are birds that ___.", "fly far to spend part of the year somewhere else", [["live at the same lake all through the year", "word-meaning"], ["cannot fly because their wings are weak", "word-meaning"], ["come to the shore to eat plastic bottles", "not-in-passage"]], "These birds flew thousands of kilometres to spend the winter at the lake.", R(3, "had flown thousands of kilometres to spend the winter at the lake")),
        P(EQ("eq-u8-reading"), "What did the children do before leaving?", "They picked up plastic bottles.", [["They fed bread to the birds.", "not-in-passage"], ["They swam across the lake.", "not-in-passage"], ["They chased away the pelicans.", "not-in-passage"]], "Before leaving, they picked up plastic bottles from the shore.", R(4, "the children picked up plastic bottles from the shore")),
        P(EQ("eq-u8-reading"), "Why does Kavya want to come back in March?", "To see if the birds have started going home", [["To count the plastic bottles again", "not-in-passage"], ["To take her science exam at the lake", "not-in-passage"], ["To bring her own pair of binoculars", "not-in-passage"]], "She wants to see if the visitors had started their long journey home.", R(4, "to see if the visitors had started their long journey home")),
      ],
    },
    {
      id: "everyday",
      title: "Everyday English",
      marks: 1,
      questions: [
        P(WP("wp-dialogue"), "Your friend sneezes. What do you say?", "Bless you!", [["Congratulations!", "situation-mixup"], ["Happy birthday!", "situation-mixup"], ["Well played!", "situation-mixup"]], "When someone sneezes, we say 'Bless you!'"),
        P(WP("wp-dialogue"), "Your friend is going on a trip tomorrow. What do you say?", "Have a safe journey!", [["Get well soon!", "situation-mixup"], ["Happy New Year!", "situation-mixup"], ["Sorry for your loss.", "situation-mixup"]], "Before a trip we wish someone a safe journey."),
        P(WP("wp-dialogue"), "A shopkeeper hands you your change. What do you say?", "Thank you.", [["Excuse me.", "situation-mixup"], ["Sorry about that.", "situation-mixup"], ["Good night.", "situation-mixup"]], "Someone gave you something: say thank you."),
        P(WP("wp-idioms"), "'It's raining cats and dogs' means ___.", "it is raining very heavily", [["animals are falling from the sky", "idiom-literal-mixup"], ["there is a light, gentle shower", "idiom-meaning-mixup"], ["pets like to play in the rain", "idiom-literal-mixup"]], "It is an idiom: very heavy rain. No animals fall!"),
        P(WP("wp-idioms"), "If a test was 'a piece of cake', it was ___.", "very easy", [["very sweet", "idiom-literal-mixup"], ["very short", "idiom-meaning-mixup"], ["very hard", "idiom-meaning-mixup"]], "'A piece of cake' means something very easy."),
      ],
    },
    {
      id: "champion",
      title: "Champion questions",
      marks: 3,
      questions: [
        P(EQ("eq-u3-tricky"), "One of my friends ___ a parrot that ___ talk.", "has, can", [["have, can", "sva-number-error"], ["has, cans", "modal-form-error"], ["have, cans", "sva-number-error"]], "ONE (of my friends) has. CAN never takes -s: a parrot that can talk."),
        P(EQ("eq-u7-passive"), "Change to passive: 'The dog chased the cat.'", "The cat was chased by the dog.", [["The cat chased the dog.", "passive-meaning-error"], ["The cat is chased by the dog.", "passive-tense-error"], ["The dog was chased by the cat.", "passive-meaning-error"]], "The cat gets the action; the time stays past: The cat was chased by the dog."),
        P(EQ("eq-u7-reported"), "Mother said to me, \"Close the door.\" Which is correct?", "Mother told me to close the door.", [["Mother told me close the door.", "reported-command-error"], ["Mother said me to close the door.", "reported-command-error"], ["Mother told to me to close the door.", "reported-command-error"]], "Orders: told + person + TO + verb → told me to close the door."),
        P(EQ("eq-u5-perfect"), "By the time we reached the station, the train ___.", "had left", [["has left", "tense-perfect-mixup"], ["leaves", "tense-present-past-mixup"], ["will leave", "tense-future-form-error"]], "Two past actions: the earlier one (the train leaving) takes HAD: had left."),
        P(EQ("eq-u8-pairs"), "Which sentence is correct?", "Not only did she sing, but she also danced.", [["Not only she sang, but also she danced.", "pair-mixup"], ["Not only did she sang, but she also danced.", "tense-form-error"], ["Not only she did sing, but she also dance.", "tense-form-error"]], "NOT ONLY at the start → did + base verb (did she sing), then 'but she also danced'."),
      ],
    },
  ],
};

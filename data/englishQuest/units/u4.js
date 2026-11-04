// data/englishQuest/units/u4.js: Unit 4, Word Power (IEO Vocabulary)
// Built per docs/CONTENT_GUIDE.md §2–7 and docs/exam/ieo-pattern.md.
import { q, study, quiz, reading, unit, main, practice, gate, withSubtopic, endless, boss } from "../helpers.js";

// ---------- Nodes definition ----------
const synAnt = main("eq-u4-synant", "eq-u4", 0, "Synonyms and Antonyms", [study("eq-u4-synant"), quiz("eq-u4-synant-warmup")]);
const spelling = main("eq-u4-spelling", "eq-u4", 1, "Spelling Traps", [study("eq-u4-spelling"), quiz("eq-u4-spelling-warmup")]);
const collocations = main("eq-u4-colloc", "eq-u4", 2, "Word Choice & Collocations", [study("eq-u4-colloc"), quiz("eq-u4-colloc-warmup")]);
const u4r = main("eq-u4-reading", "eq-u4", 3, "Reading: The Whispering Banyan Grove", [reading("eq-read-banyan-grove")]);

export default {
  // ---------- Study Pages ----------
  studyPages: {
    "eq-u4-synant": {
      name: "Synonyms and Antonyms",
      author: "Apprec8",
      content: `### 📚 The Magic of Synonyms and Antonyms

Expanding your vocabulary makes your writing and speech colourful, precise, and expressive!

---

### 👯 Synonyms: Words with Similar Meanings

A **synonym** is a word that has the same or nearly the same meaning as another word in the same language.

| Word | Synonyms | Example Sentence |
|---|---|---|
| **Brave** | *courageous, valiant, fearless* | The brave firefighter entered the burning house. |
| **Scarce** | *rare, sparse, meagre* | Fresh drinking water became scarce during the dry summer. |
| **Ancient** | *antique, prehistoric, timeworn* | The museum displays ancient coins made of silver. |
| **Cautious** | *careful, watchful, prudent* | A cautious driver slows down near a school gate. |
| **Vanish** | *disappear, fade, evaporate* | The morning fog will vanish as the sun rises. |
| **Wealthy** | *affluent, prosperous, opulent* | The wealthy merchant donated books to the village school. |
| **Eager** | *keen, enthusiastic, impatient* | The eager students arrived early for the annual science fair. |
| **Trivial** | *minor, petty, unimportant* | Do not worry about trivial matters during an exam. |
| **Abundant** | *plentiful, lavish, copious* | The orchard produced an abundant harvest of sweet apples. |
| **Gentle** | *tender, mild, peaceful* | A gentle breeze blew across the quiet valley. |

---

### ⚡ Antonyms: Words with Opposite Meanings

An **antonym** is a word that means the exact opposite of another word.

| Word | Antonyms | Example Sentence |
|---|---|---|
| **Brave** | *cowardly, timid, fearful* | The cowardly dog ran away from the barking puppy. |
| **Scarce** | *plentiful, abundant, copious* | Ripe mangoes are plentiful in the warm month of June. |
| **Ancient** | *modern, recent, contemporary* | The city has modern high-rise flats beside old temples. |
| **Cautious** | *reckless, rash, careless* | Rash driving on slippery roads causes dangerous accidents. |
| **Vanish** | *appear, emerge, materialise* | A colourful rainbow will appear after the rain stops. |
| **Wealthy** | *impoverished, needy, destitute* | The generous king gave food to impoverished families. |
| **Eager** | *reluctant, unwilling, indifferent* | The tired boy was reluctant to leave his cosy bed. |
| **Trivial** | *crucial, vital, essential* | Clear communication is crucial for every team project. |
| **Cruel** | *compassionate, merciful, humane* | The merciful judge pardoned the repentant traveller. |
| **Gloomy** | *cheerful, radiant, bright* | A cheerful smile brightened the grey hospital room. |

> 💡 **IEO Tip:** Always look at the surrounding sentence context. A word can have slightly different shades of meaning depending on how it is used!`,
    },
    "eq-u4-spelling": {
      name: "Spelling Traps & Rules",
      author: "Apprec8",
      content: `### ✍️ Conquering Tricky Spelling Traps

In the IEO, spelling questions test words that have silent letters, double consonants, or confusing vowel combinations.

---

### 🎯 The Big 10 IEO Spelling Traps

1. **Separate:**
   - Notice the **a** in the middle: *s-e-p-**a**-r-a-t-e*.
   - 💡 Memory trick: There is **a rat** in sep-**a-rat**-e!
2. **Necessary:**
   - One **c**, double **s**: *n-e-**c**-e-**ss**-a-r-y*.
   - 💡 Memory trick: A shirt has **one collar** (c) and **two sleeves** (ss)!
3. **Beautiful:**
   - Starts with *b-e-a-u*: *b-**e-a-u**-t-i-f-u-l*.
4. **Receive, Deceive, Conceive:**
   - Remember the golden rule: **i before e except after c**!
   - *r-e-**c-e-i**-v-e*, *d-e-**c-e-i**-v-e*, *c-e-i-l-i-n-g*.
   - But when not after c: *b-e-l-**i-e**-v-e*, *p-**i-e**-c-e*, *f-**i-e**-l-d*.
5. **Accommodate:**
   - Double **c** AND double **m**: *a-**cc**-o-**mm**-o-d-a-t-e*.
6. **Embarrass:**
   - Double **r** AND double **s**: *e-m-b-a-**rr**-a-**ss**-e-d*.
7. **Definite:**
   - Contains the word **finite**: *d-e-**f-i-n-i-t**-e*. Never write "definate"!
8. **Occasion:**
   - Double **c**, single **s**: *o-**cc**-a-**s**-i-o-n*.
9. **Environment:**
   - Do not forget the silent **n** before m: *e-n-v-i-r-o-**n**-m-e-n-t*.
10. **Grammar:**
    - Ends in **-ar**, never -er: *g-r-a-m-m-**a-r**!

---

### 🔍 Quick Checklist

- Does it drop the 'e' when adding -ing? (*make* → *making*, *write* → *writing*)
- Does it double the last consonant after a short vowel? (*begin* → *beginning*, *stop* → *stopped*)
- Does it keep the 'e' before -able for soft c or g? (*notice* → *noticeable*, *change* → *changeable*)`,
    },
    "eq-u4-colloc": {
      name: "Natural Word Choice & Collocations",
      author: "Apprec8",
      content: `### 🤝 Natural Word Choice & Collocations

Words in English love to travel in natural partnerships called **collocations**. Even if two words have similar dictionary meanings, native speakers only use specific combinations!

---

### 🌟 Natural Movement and Sound Collocations

| Subject | Natural Verb | Never Say |
|---|---|---|
| **Candle flame** | *flickers* | flames do not shiver or tremble |
| **Cold person** | *shivers* | people do not flicker in the cold |
| **Nervous voice** | *trembles* | voices do not waver or flutter |
| **Dry autumn leaves** | *rustle* | leaves do not roar or creak |
| **Gentle stream** | *babbles / murmurs* | streams do not shout or snap |
| **Floorboards** | *creak* | old wood creaks under footsteps |

---

### 🌦️ Nature and Weather Collocations

- **Torrential rain:** We say *torrential rain* or *heavy downpour*, never "thick rain".
- **Howling wind:** A strong storm has *howling* or *gale-force* winds, not "loud wind".
- **Dense fog:** Visibility drops in *dense* or *thick fog*, never "heavy fog".
- **Scorching heat:** Summer brings *scorching* or *sweltering* heat, not "burning air".

---

### 💼 Action and Verb Collocations

- **Make** vs **Do:**
  - *make a decision*, *make an effort*, *make a mistake*, *make a phone call*.
  - *do homework*, *do chores*, *do research*, *do your best*.
- **Take:**
  - *take a risk*, *take a break*, *take a seat*, *take responsibility*.
- **Burst:**
  - *burst into tears*, *burst into laughter*, *burst into song*.

---

### 👑 Special Group Collocations

- A royal **cavalcade** of horse-drawn carriages.
- A **pride** of wild lions resting in the shade.
- A **fleet** of cargo ships sailing into the harbour.
- A **flock** of migratory birds flying south.`,
    },
  },

  // ---------- Quizzes ----------
  quizzes: {
    "eq-u4-synant-warmup": [
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
    "eq-u4-synant-context-quiz": [
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
          "tranquil",
          [
          ["deafening", "synonym-error"],
          ["boisterous", "synonym-error"],
          ["rowdy", "synonym-error"]
          ],
          "Silent and peaceful settings are best described as tranquil."
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
    "eq-u4-synant-gate-pool": [
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
          "Fill in the blank: 'The lost travellers found a ___ cave during the snowstorm.'",
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
    "eq-u4-spelling-warmup": [
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
    "eq-u4-spelling-rules-quiz": [
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
    "eq-u4-spelling-gate-pool": [
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
          "Choose the correct spelling of the word meaning 'to take place or happen':",
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
          "Choose the correct spelling of the word meaning 'calendar record of days':",
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
          "Choose the correct spelling of the word meaning 'twelve in count':",
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
          "Choose the correct spelling of the word meaning 'a schedule or plan':",
          "programme",
          [
          ["program", "spelling-vowel-trap"],
          ["programer", "spelling-vowel-trap"],
          ["programin", "spelling-vowel-trap"]
          ],
          "In British English, an event schedule or broadcast is spelled p-r-o-g-r-a-m-m-e."
        ),
      },
    ],
    "eq-u4-colloc-warmup": [
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
    "eq-u4-colloc-nature-quiz": [
      {
        subtopic: "natural-partners",
        ...q(
          "Fill in the blank: 'The explorer warned us of the ___ heat in the middle of the desert.'",
          "scorching",
          [
          ["baking", "collocation-adjective-choice"],
          ["burning", "collocation-adjective-choice"],
          ["toasting", "collocation-adjective-choice"]
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
    "eq-u4-colloc-gate-pool": [
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
    "eq-u4-test": [
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
  },

  // ---------- Readings ----------
  readings: {
    "eq-read-banyan-grove": {
      title: "The Whispering Banyan Grove",
      mode: "fullPassage",
      type: "fullPassage",
      author: "Apprec8",
      glossary: {
        canopy: "the high roof formed by spreading tree branches",
        hollow: "an empty space inside a tree trunk",
        scurried: "ran quickly with short hurried steps",
        ancient: "belonging to a time long past",
        murmurs: "soft, continuous sounds like quiet speaking",
        haven: "a safe, peaceful shelter for living creatures",
      },
      paragraphs: [
        "Deep inside the Shivalik foothills stood an ancient banyan tree known to every traveller as the Whispering Banyan. For over two hundred years, its sprawling branches had stretched out like giant wooden arms, sending leafy aerial roots straight down into the fertile mountain soil. Whenever a gentle breeze swept through the valley, the dangling roots rustled softly, sounding remarkably like friendly murmurs.",
        "One sunny Saturday morning, young Kabir and his sister Ananya walked down the winding stone pathway to the grove. Resting beneath the wide leafy canopy, Kabir pointed toward a shadowy hollow inside the main trunk. Three tiny striped squirrels scurried out into the sunlight, their bushy tails twitching with curiosity.",
        "\"Look at the magnificent canopy!\" whispered Ananya in wonder. \"It feels as cool as an air-conditioned room, even though the afternoon sun is scorching hot outside.\" An old herdsman named Uncle Gopal smiled as he tied his grazing goats to a sturdy root. \"This ancient tree protects our village,\" he said softly. \"During the great flood three years ago, its powerful roots held the entire hillside together and prevented a disastrous landslide.\"",
        "Last winter, commercial timber contractors arrived with roaring electric saws, intending to fell the grand grove to build a resort. But the village council held an emergency meeting beneath the leafy boughs. Every family pledged to protect the grove. The contractors were turned away, and the ancient banyan was declared a community heritage reserve.",
        "As the evening sun sank behind the purple ridges, flocks of wild green parrots flew back into the green leaves, filling the twilight air with joyful chatter. Kabir smiled, realizing that a single ancient tree could offer a peaceful haven for hundreds of living creatures.",
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
  },

  wordTables: {},

  // ---------- The tree ----------
  nodes: [
    unit("eq-u4", 4, "Word Power"),

    // Topic 0: Synonyms and Antonyms
    synAnt,
    withSubtopic(practice("eq-u4-synant-p1", synAnt, 1, "Words in Context", "medium", [quiz("eq-u4-synant-context-quiz")]), "context-pairs"),
    gate("eq-u4-synant-gate", synAnt, "Synonyms & Antonyms Challenge", "eq-u4-synant-gate-pool", {
      "synonyms": "Synonyms and similar meanings",
      "antonyms": "Antonyms and opposite meanings",
      "context-pairs": "Contextual word selection",
    }),
    endless(synAnt),

    // Topic 1: Spelling Traps
    spelling,
    withSubtopic(practice("eq-u4-spelling-p1", spelling, 1, "I Before E Rules", "medium", [quiz("eq-u4-spelling-rules-quiz")]), "ie-ei-rules"),
    gate("eq-u4-spelling-gate", spelling, "Spelling Master Challenge", "eq-u4-spelling-gate-pool", {
      "double-letters": "Double consonant traps",
      "ie-ei-rules": "I before E and vowel rules",
      "tricky-vowels": "Silent letters and vowel endings",
    }),
    endless(spelling),

    // Topic 2: Word Choice & Collocations
    collocations,
    withSubtopic(practice("eq-u4-colloc-p1", collocations, 1, "Nature Collocations", "medium", [quiz("eq-u4-colloc-nature-quiz")]), "natural-partners"),
    gate("eq-u4-colloc-gate", collocations, "Word Choice & Idiom Challenge", "eq-u4-colloc-gate-pool", {
      "movement-sounds": "Movement and sound collocations",
      "natural-partners": "Nature and group partnerships",
      "idiomatic-collocations": "Action and idiomatic collocations",
    }),
    endless(collocations),

    // Reading & Boss
    u4r,
    boss(
      "eq-u4-boss",
      "eq-u4",
      "Unit 4 Boss",
      "eq-u4-test",
      "The Lexicon Labyrinth: Dr. Word-Mixer has scrambled the library dictionary! Jumbled spellings, lost word partners, and confused antonyms are running wild. Harness your word power to defeat the maze and restore the great lexicon."
    ),
  ],
};

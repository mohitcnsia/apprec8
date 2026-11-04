// data/englishQuest/units/u3.js: Unit 3, Subject-Verb Agreement
// Built per docs/CONTENT_GUIDE.md §2–7.
import { q, study, quiz, reading, unit, main, practice, gate, withSubtopic, endless, boss } from "../helpers.js";

// ---------- Nodes definition ----------
const svaBasics = main("eq-u3-basics", "eq-u3", 0, "One or Many?", [study("eq-u3-basics"), quiz("eq-u3-basics-quiz")]);
const svaTricky = main("eq-u3-tricky", "eq-u3", 1, "Tricky Subjects", [study("eq-u3-tricky"), quiz("eq-u3-tricky-quiz")]);
const svaThere = main("eq-u3-there", "eq-u3", 2, "There is & There are", [study("eq-u3-there"), quiz("eq-u3-there-quiz")]);
const u3r = main("eq-u3-reading", "eq-u3", 3, "Reading: The Clock Tower Mystery", [reading("eq-read-clock-tower")]);

export default {
  // ---------- Study Pages ----------
  studyPages: {
    "eq-u3-basics": {
      name: "Subject and Verb: Best Friends",
      author: "Apprec8",
      content: `### 🤝 When the subject changes, the verb changes!

A **subject** and its **verb** are like best friends: they must always agree!

If the subject is **ONE** (singular), the present-tense verb ends with **-s** or **-es**.
If the subject is **MANY** (plural), the present-tense verb does **NOT** end with -s.

| Subject | Verb Rule | Example |
|---|---|---|
| One child (singular) | Verb + -s / -es | *The child sings sweetly.* |
| Many children (plural) | Base verb (no -s) | *The children sing sweetly.* |
| He / She / It | Verb + -s / -es | *She writes a letter.* |
| We / They | Base verb (no -s) | *They write letters.* |

---

### 🌟 Special Pronouns: I and You

The pronouns **I** and **You** have their own special rules:

- **I** takes the base verb without -s (*I play*, *I run*, *I like*).
- With **be**, I takes **am** in the present and **was** in the past (*I am happy*, *I was late*).
- **You** ALWAYS takes plural-style verbs (*You are kind*, *You were right*, *You run fast*). Never say "you is"!

---

### ⚠️ Common Helping Verbs

Watch out for these helpers:

- **Singular:** *is*, *was*, *has*, *does*
- **Plural:** *are*, *were*, *have*, *do*

- ✅ *The tiger is roaring.*
- ❌ *The tiger are roaring.*

---

### 🎯 Now you can…

- match singular subjects with verbs that end in -s
- match plural subjects with base verbs
- use the right verbs with I and you`,
    },

    "eq-u3-tricky": {
      name: "Tricky Subjects: Each, Every and Pairs",
      author: "Apprec8",
      content: `### 🎁 Each, Every and Everyone mean ONE at a time!

Even though **everyone** feels like a big crowd, in grammar it looks at **every single person** one by one.

So it always takes a **SINGULAR** verb!

- ✅ *Everyone loves ice cream.* (NOT *Everyone love*)
- ✅ *Each student has a blue notebook.* (NOT *Each student have*)
- ✅ *Somebody is knocking at the front door.* (NOT *Somebody are*)

---

### 🔗 Subjects joined by AND vs OR

When two naming words are joined together:

1. Joined by **and** = two or more things, so use a **PLURAL** verb:
   - *Rohan and Kabir are best friends.* ✅
2. Joined by **or** or **nor** = look at the subject closest to the verb:
   - *Neither tea nor milk is cold.* ✅ (milk is singular)

---

### 👟 A pair of shoes is...

Words like *scissors*, *glasses*, *trousers* and *shoes* are plural on their own (*The scissors are sharp*).

BUT when you put **"a pair of"** in front, the true subject is the singular word **pair**!

- *The shoes are on the floor.* (plural: many shoes)
- *A pair of shoes is on the floor.* (singular: one pair)

---

### 🎯 Now you can…

- pick singular verbs for each, every and someone
- choose the right verb when two subjects are joined by 'and' or 'or'
- solve 'a pair of' traps easily`,
    },

    "eq-u3-there": {
      name: "There is, There are and Questions",
      author: "Apprec8",
      content: `### 🔍 Look BEHIND the verb for 'There is' and 'There are'!

In most sentences, the subject comes first. But in sentences starting with **There**, the real subject hides **AFTER** the verb!

- *There **is** a big banyan tree in the garden.* (one tree → is)
- *There **are** five parrots on the fence.* (five parrots → are)
- *There **is** some fresh milk in the jug.* (uncountable milk → is)

> 💡 **Trick:** Look at the noun that comes right after is or are to decide!

---

### 📍 Here is and Here are

The same rule works for **Here**:

- *Here **is** your water bottle.* (one bottle → is)
- *Here **are** your library books.* (many books → are)

---

### ❓ Asking Questions with Do and Does

In questions:

- Use **Does** with singular subjects (*he*, *she*, *it*, *one person*).
- Use **Do** with plural subjects and *I* / *you*.

> ⚠️ **Golden rule:** After *Does*, the main verb goes back to its simple base form!
- ✅ *Does she play tennis?* (NOT *Does she plays*)
- ✅ *Do they want some fruit?*

---

### 🎯 Now you can…

- pick between "there is" and "there are" by checking the noun behind
- use "here is" and "here are" correctly
- ask questions with "Do" and "Does" without falling into verb traps`,
    },
  },

  // ---------- Quizzes ----------
  quizzes: {
    // Branch 0: Basics (One or many?)
    "eq-u3-basics-quiz": [
      { subtopic: "singular-subject", ...q("Fill in the blank: 'The little bird ___ sweetly in the tree.'", "sings", [["sing", "sva-number-error"], ["are singing", "sva-number-error"], ["have sung", "sva-number-error"]], "One bird is a singular subject, so the present tense verb takes -s: The bird sings.") },
      { subtopic: "plural-subject", ...q("Fill in the blank: 'The two dogs ___ after the ball.'", "run", [["runs", "sva-number-error"], ["is running", "sva-number-error"], ["has run", "sva-number-error"]], "The two dogs are plural, so the verb does not take -s: The two dogs run.") },
      { subtopic: "singular-subject", ...q("Fill in the blank: 'My sister ___ breakfast every morning.'", "eats", [["eat", "sva-number-error"], ["are eating", "sva-number-error"], ["have eaten", "sva-number-error"]], "My sister is one person, so the verb ends with -s: My sister eats.") },
      { subtopic: "plural-subject", ...q("Fill in the blank: 'The boys ___ football in the park.'", "play", [["plays", "sva-number-error"], ["is playing", "sva-number-error"], ["was playing", "sva-number-error"]], "The boys are plural, so use the base verb without -s: The boys play.") },
      { subtopic: "pronouns-i-you", ...q("Fill in the blank: 'I ___ a green bicycle with a bell.'", "have", [["has", "sva-i-you-error"], ["is having", "sva-i-you-error"], ["are having", "sva-i-you-error"]], "The pronoun I always takes have in the present tense: I have.") },
      { subtopic: "pronouns-i-you", ...q("Fill in the blank: 'You ___ very fast on the running track.'", "run", [["runs", "sva-i-you-error"], ["is running", "sva-i-you-error"], ["has run", "sva-i-you-error"]], "The pronoun You always takes the base form of the verb without -s: You run.") },
      { subtopic: "singular-subject", ...q("Fill in the blank: 'The sun ___ brightly in the blue sky.'", "shines", [["shine", "sva-number-error"], ["are shining", "sva-number-error"], ["have shone", "sva-number-error"]], "The sun is one singular thing, so the verb ends in -s: The sun shines.") },
      { subtopic: "plural-subject", ...q("Fill in the blank: 'Many children ___ paper boats in the puddle.'", "float", [["floats", "sva-number-error"], ["is floating", "sva-number-error"], ["was floating", "sva-number-error"]], "Many children is plural, so the verb does not end in -s: Many children float.") },
    ],

    "eq-u3-basics-iyou-quiz": [
      { subtopic: "pronouns-i-you", ...q("Fill in the blank: 'I ___ ready for the school picnic.'", "am", [["is", "sva-i-you-error"], ["are", "sva-i-you-error"], ["be", "sva-i-you-error"]], "With the pronoun I in the present tense, we say: I am.") },
      { subtopic: "pronouns-i-you", ...q("Fill in the blank: 'You ___ my best friend in the whole class.'", "are", [["is", "sva-i-you-error"], ["am", "sva-i-you-error"], ["be", "sva-i-you-error"]], "The pronoun You always takes are (never is or am): You are.") },
      { subtopic: "pronouns-i-you", ...q("Fill in the blank: 'I ___ to read mystery books before sleeping.'", "like", [["likes", "sva-i-you-error"], ["is liking", "sva-i-you-error"], ["has liked", "sva-i-you-error"]], "The pronoun I takes the base form of the verb without -s: I like.") },
      { subtopic: "pronouns-i-you", ...q("Fill in the blank: 'You ___ the answer to this riddle.'", "know", [["knows", "sva-i-you-error"], ["is knowing", "sva-i-you-error"], ["has known", "sva-i-you-error"]], "The pronoun You takes the base form without -s: You know.") },
      { subtopic: "pronouns-i-you", ...q("Fill in the blank: 'Yesterday, I ___ absent from school.'", "was", [["were", "sva-i-you-error"], ["are", "sva-i-you-error"], ["is", "sva-i-you-error"]], "In the past tense, the pronoun I takes was: I was absent.") },
      { subtopic: "pronouns-i-you", ...q("Fill in the blank: 'You ___ late to the art class yesterday.'", "were", [["was", "sva-i-you-error"], ["is", "sva-i-you-error"], ["am", "sva-i-you-error"]], "The pronoun You always takes were in the past tense: You were late.") },
    ],

    "eq-u3-basics-gate-pool": [
      { subtopic: "singular-subject", ...q("Fill in the blank: 'An elephant ___ large ears to keep cool.'", "has", [["have", "sva-number-error"], ["are having", "sva-number-error"], ["is have", "sva-number-error"]], "An elephant is singular, so we use has: An elephant has.") },
      { subtopic: "singular-subject", ...q("Fill in the blank: 'The river ___ quietly down the green hill.'", "flows", [["flow", "sva-number-error"], ["are flowing", "sva-number-error"], ["were flowing", "sva-number-error"]], "The river is one singular noun, so the verb ends in -s: The river flows.") },
      { subtopic: "singular-subject", ...q("Fill in the blank: 'The gardener ___ water to the rose plants.'", "gives", [["give", "sva-number-error"], ["are giving", "sva-number-error"], ["have given", "sva-number-error"]], "The gardener is singular, so the verb takes -s: The gardener gives.") },
      { subtopic: "singular-subject", ...q("Fill in the blank: 'My grandfather ___ the newspaper on the balcony.'", "reads", [["read", "sva-number-error"], ["are reading", "sva-number-error"], ["have read", "sva-number-error"]], "My grandfather is singular, so the present tense verb ends in -s: My grandfather reads.") },
      { subtopic: "singular-subject", ...q("Fill in the blank: 'The milk in the pot ___ hot.'", "is", [["are", "sva-number-error"], ["were", "sva-number-error"], ["be", "sva-number-error"]], "Milk is an uncountable noun, which always takes a singular verb: The milk is hot.") },

      { subtopic: "plural-subject", ...q("Fill in the blank: 'The stars ___ brightly on a dark night.'", "twinkle", [["twinkles", "sva-number-error"], ["is twinkling", "sva-number-error"], ["was twinkling", "sva-number-error"]], "The stars is plural, so use the base verb without -s: The stars twinkle.") },
      { subtopic: "plural-subject", ...q("Fill in the blank: 'These three books ___ to my elder brother.'", "belong", [["belongs", "sva-number-error"], ["is belonging", "sva-number-error"], ["was belonging", "sva-number-error"]], "These three books is plural, so the verb takes no -s: These books belong.") },
      { subtopic: "plural-subject", ...q("Fill in the blank: 'The teachers ___ standing near the school gate.'", "are", [["is", "sva-number-error"], ["was", "sva-number-error"], ["be", "sva-number-error"]], "The teachers is a plural noun, so we use are: The teachers are standing.") },
      { subtopic: "plural-subject", ...q("Fill in the blank: 'The monkeys ___ from branch to branch.'", "jump", [["jumps", "sva-number-error"], ["is jumping", "sva-number-error"], ["has jumped", "sva-number-error"]], "The monkeys is plural, so the verb does not end in -s: The monkeys jump.") },
      { subtopic: "plural-subject", ...q("Fill in the blank: 'The workers ___ finished their work for today.'", "have", [["has", "sva-number-error"], ["is", "sva-number-error"], ["was", "sva-number-error"]], "The workers is plural, so we use have: The workers have finished.") },

      { subtopic: "pronouns-i-you", ...q("Fill in the blank: 'I ___ my homework before dinner every day.'", "do", [["does", "sva-i-you-error"], ["is doing", "sva-i-you-error"], ["has done", "sva-i-you-error"]], "With the pronoun I, we use the base form do: I do my homework.") },
      { subtopic: "pronouns-i-you", ...q("Fill in the blank: 'You ___ always polite to the school bus driver.'", "are", [["is", "sva-i-you-error"], ["am", "sva-i-you-error"], ["was", "sva-i-you-error"]], "You always takes are in the present tense: You are always polite.") },
      { subtopic: "pronouns-i-you", ...q("Fill in the blank: 'I ___ an apple and two oranges in my bag.'", "have", [["has", "sva-i-you-error"], ["is having", "sva-i-you-error"], ["are having", "sva-i-you-error"]], "The pronoun I takes have: I have an apple.") },
      { subtopic: "pronouns-i-you", ...q("Fill in the blank: 'You ___ beautiful pictures with wax crayons.'", "draw", [["draws", "sva-i-you-error"], ["is drawing", "sva-i-you-error"], ["has drawn", "sva-i-you-error"]], "The pronoun You takes the base form draw without -s: You draw.") },
      { subtopic: "pronouns-i-you", ...q("Fill in the blank: 'Yesterday, I ___ at home watching the rain.'", "was", [["were", "sva-i-you-error"], ["are", "sva-i-you-error"], ["is", "sva-i-you-error"]], "In the past tense, the pronoun I takes was: I was at home.") },
    ],

    // Branch 1: Tricky Subjects
    "eq-u3-tricky-quiz": [
      { subtopic: "each-everyone", ...q("Fill in the blank: 'Each student ___ a blue notebook on the desk.'", "has", [["have", "sva-each-every-error"], ["are having", "sva-each-every-error"], ["were having", "sva-each-every-error"]], "The word Each means one at a time, so it takes a singular verb: Each student has.") },
      { subtopic: "compound-subjects", ...q("Fill in the blank: 'Rohan and Kabir ___ best friends since kindergarten.'", "are", [["is", "sva-and-compound-error"], ["was", "sva-and-compound-error"], ["be", "sva-and-compound-error"]], "Two subjects joined by and make a plural subject, so we use are: Rohan and Kabir are.") },
      { subtopic: "pair-collective", ...q("Fill in the blank: 'A pair of scissors ___ kept in the top drawer.'", "is", [["are", "sva-pair-noun-error"], ["were", "sva-pair-noun-error"], ["be", "sva-pair-noun-error"]], "The real subject is A pair (one pair), so it takes the singular verb is.") },
      { subtopic: "each-everyone", ...q("Fill in the blank: 'Everyone in the class ___ the funny story.'", "likes", [["like", "sva-each-every-error"], ["are liking", "sva-each-every-error"], ["were liking", "sva-each-every-error"]], "Everyone is an indefinite pronoun that takes a singular verb: Everyone likes.") },
      { subtopic: "compound-subjects", ...q("Fill in the blank: 'Either tea or hot milk ___ served with biscuits.'", "is", [["are", "sva-or-compound-error"], ["were", "sva-or-compound-error"], ["have been", "sva-or-compound-error"]], "When two singular nouns are joined by either...or, the verb is singular: Either tea or hot milk is served.") },
      { subtopic: "pair-collective", ...q("Fill in the blank: 'The flock of sheep ___ moving slowly across the field.'", "is", [["are", "sva-collective-noun-error"], ["were", "sva-collective-noun-error"], ["have been", "sva-collective-noun-error"]], "The subject is The flock (one group), so it takes the singular verb is.") },
      { subtopic: "each-everyone", ...q("Fill in the blank: 'Somebody ___ knocking softly on the front door.'", "is", [["are", "sva-each-every-error"], ["were", "sva-each-every-error"], ["have been", "sva-each-every-error"]], "Words like somebody and someone take a singular verb: Somebody is knocking.") },
      { subtopic: "compound-subjects", ...q("Fill in the blank: 'My father and my uncle ___ morning walk together.'", "go for a", [["goes for a", "sva-and-compound-error"], ["is going for a", "sva-and-compound-error"], ["was going for a", "sva-and-compound-error"]], "Two people joined by and form a plural subject: My father and my uncle go.") },
    ],

    "eq-u3-tricky-each-quiz": [
      { subtopic: "each-everyone", ...q("Fill in the blank: 'Every child in the park ___ a colourful balloon.'", "holds", [["hold", "sva-each-every-error"], ["are holding", "sva-each-every-error"], ["have held", "sva-each-every-error"]], "Every child means one child at a time, so the verb ends in -s: Every child holds.") },
      { subtopic: "each-everyone", ...q("Fill in the blank: 'Nobody ___ the answer to this difficult riddle.'", "knows", [["know", "sva-each-every-error"], ["are knowing", "sva-each-every-error"], ["were knowing", "sva-each-every-error"]], "Nobody is treated as singular in grammar, so the verb ends in -s: Nobody knows.") },
      { subtopic: "each-everyone", ...q("Fill in the blank: 'Each of the mangoes ___ sweet and ripe.'", "is", [["are", "sva-each-every-error"], ["were", "sva-each-every-error"], ["have been", "sva-each-every-error"]], "The subject is Each (not mangoes), so the verb is singular: Each is sweet.") },
      { subtopic: "each-everyone", ...q("Fill in the blank: 'Someone ___ left a water bottle on the bench.'", "has", [["have", "sva-each-every-error"], ["are", "sva-each-every-error"], ["were", "sva-each-every-error"]], "Someone is singular, so it takes has: Someone has left.") },
      { subtopic: "each-everyone", ...q("Fill in the blank: 'Everybody ___ to win the drawing prize.'", "wants", [["want", "sva-each-every-error"], ["are wanting", "sva-each-every-error"], ["were wanting", "sva-each-every-error"]], "Everybody is a singular pronoun, so the verb ends with -s: Everybody wants.") },
      { subtopic: "each-everyone", ...q("Fill in the blank: 'Each player on our team ___ hard before a match.'", "trains", [["train", "sva-each-every-error"], ["are training", "sva-each-every-error"], ["were training", "sva-each-every-error"]], "The subject is Each player (singular), so the verb takes -s: Each player trains.") },
    ],

    "eq-u3-tricky-pairs-quiz": [
      { subtopic: "pair-collective", ...q("Fill in the blank: 'My new shoes ___ very comfortable for running.'", "are", [["is", "sva-pair-noun-error"], ["was", "sva-pair-noun-error"], ["be", "sva-pair-noun-error"]], "Without 'a pair of', the noun shoes is plural and takes are: My new shoes are.") },
      { subtopic: "pair-collective", ...q("Fill in the blank: 'This pair of spectacles ___ very expensive.'", "is", [["are", "sva-pair-noun-error"], ["were", "sva-pair-noun-error"], ["be", "sva-pair-noun-error"]], "The subject is This pair (singular), so we use is: This pair of spectacles is.") },
      { subtopic: "pair-collective", ...q("Fill in the blank: 'These scissors ___ sharp enough to cut paper.'", "are", [["is", "sva-pair-noun-error"], ["was", "sva-pair-noun-error"], ["be", "sva-pair-noun-error"]], "Scissors without 'a pair of' is plural, so we use are: These scissors are sharp.") },
      { subtopic: "pair-collective", ...q("Fill in the blank: 'A new pair of jeans ___ hanging in the closet.'", "is", [["are", "sva-pair-noun-error"], ["were", "sva-pair-noun-error"], ["have been", "sva-pair-noun-error"]], "A new pair is one singular pair, so it takes is: A new pair of jeans is.") },
      { subtopic: "pair-collective", ...q("Fill in the blank: 'The cricket team ___ practising on the playground.'", "is", [["are", "sva-collective-noun-error"], ["were", "sva-collective-noun-error"], ["have been", "sva-collective-noun-error"]], "The team acts as a single group here, so it takes the singular verb is.") },
      { subtopic: "pair-collective", ...q("Fill in the blank: 'A bouquet of yellow roses ___ on the teacher table.'", "sits", [["sit", "sva-collective-noun-error"], ["are sitting", "sva-collective-noun-error"], ["were sitting", "sva-collective-noun-error"]], "The subject is A bouquet (singular group), so the verb takes -s: A bouquet sits.") },
    ],

    "eq-u3-tricky-gate-pool": [
      { subtopic: "each-everyone", ...q("Fill in the blank: 'Each boy in the choir ___ a song sheet.'", "receives", [["receive", "sva-each-every-error"], ["are receiving", "sva-each-every-error"], ["have received", "sva-each-every-error"]], "Each boy is singular, so the verb ends in -s: Each boy receives.") },
      { subtopic: "each-everyone", ...q("Fill in the blank: 'Every window in the old hall ___ closed.'", "was", [["were", "sva-each-every-error"], ["are", "sva-each-every-error"], ["have been", "sva-each-every-error"]], "Every window is singular, so the past tense verb is was: Every window was closed.") },
      { subtopic: "each-everyone", ...q("Fill in the blank: 'Everyone ___ excited about the school trip to Agra.'", "is", [["are", "sva-each-every-error"], ["were", "sva-each-every-error"], ["be", "sva-each-every-error"]], "Everyone is a singular pronoun: Everyone is excited.") },
      { subtopic: "each-everyone", ...q("Fill in the blank: 'Each of these paintings ___ made by Priya.'", "was", [["were", "sva-each-every-error"], ["are", "sva-each-every-error"], ["have been", "sva-each-every-error"]], "The subject is Each (singular), so the verb is was: Each was made.") },
      { subtopic: "each-everyone", ...q("Fill in the blank: 'Nobody in our family ___ bitter gourd.'", "eats", [["eat", "sva-each-every-error"], ["are eating", "sva-each-every-error"], ["were eating", "sva-each-every-error"]], "Nobody takes a singular verb ending in -s: Nobody eats.") },

      { subtopic: "compound-subjects", ...q("Fill in the blank: 'Bread and butter ___ my favourite breakfast.'", "is", [["are", "sva-and-compound-error"], ["were", "sva-and-compound-error"], ["have been", "sva-and-compound-error"]], "Bread and butter is considered a single food combination, so it takes the singular verb is.") },
      { subtopic: "compound-subjects", ...q("Fill in the blank: 'An apple and a banana ___ on the fruit plate.'", "are", [["is", "sva-and-compound-error"], ["was", "sva-and-compound-error"], ["be", "sva-and-compound-error"]], "Two distinct items joined by and form a plural subject: An apple and a banana are.") },
      { subtopic: "compound-subjects", ...q("Fill in the blank: 'Neither Rohit nor Aman ___ present in class today.'", "is", [["are", "sva-or-compound-error"], ["were", "sva-or-compound-error"], ["have been", "sva-or-compound-error"]], "When two singular subjects are joined by neither...nor, the verb is singular: Neither Rohit nor Aman is.") },
      { subtopic: "compound-subjects", ...q("Fill in the blank: 'Pencil or pen ___ accepted for writing the exam.'", "is", [["are", "sva-or-compound-error"], ["were", "sva-or-compound-error"], ["have been", "sva-or-compound-error"]], "Two singular nouns joined by or take a singular verb: Pencil or pen is accepted.") },
      { subtopic: "compound-subjects", ...q("Fill in the blank: 'The cat and the dog ___ peacefully in the yard.'", "sleep", [["sleeps", "sva-and-compound-error"], ["is sleeping", "sva-and-compound-error"], ["was sleeping", "sva-and-compound-error"]], "The cat and the dog make two animals (plural), so the verb takes no -s: The cat and dog sleep.") },

      { subtopic: "pair-collective", ...q("Fill in the blank: 'The bunch of sweet grapes ___ hanging from the vine.'", "is", [["are", "sva-collective-noun-error"], ["were", "sva-collective-noun-error"], ["have been", "sva-collective-noun-error"]], "The subject is The bunch (one singular collection), so we use is.") },
      { subtopic: "pair-collective", ...q("Fill in the blank: 'A pair of leather gloves ___ found on the school bench.'", "was", [["were", "sva-pair-noun-error"], ["are", "sva-pair-noun-error"], ["have been", "sva-pair-noun-error"]], "The subject is A pair (singular), so the past tense verb is was.") },
      { subtopic: "pair-collective", ...q("Fill in the blank: 'These blue trousers ___ too long for my younger brother.'", "are", [["is", "sva-pair-noun-error"], ["was", "sva-pair-noun-error"], ["be", "sva-pair-noun-error"]], "Trousers is plural when not preceded by 'a pair of', so we use are.") },
      { subtopic: "pair-collective", ...q("Fill in the blank: 'Our school choir ___ melodiously during the morning assembly.'", "sings", [["sing", "sva-collective-noun-error"], ["are singing", "sva-collective-noun-error"], ["were singing", "sva-collective-noun-error"]], "The choir acts as one unit, so it takes a singular verb with -s: Our school choir sings.") },
      { subtopic: "pair-collective", ...q("Fill in the blank: 'A pair of binoculars ___ hanging from the captain belt.'", "was", [["were", "sva-pair-noun-error"], ["are", "sva-pair-noun-error"], ["have been", "sva-pair-noun-error"]], "The subject is A pair (one pair), so the verb is singular was.") },
    ],

    // Branch 2: There is, There are and Questions
    "eq-u3-there-quiz": [
      { subtopic: "there-is-are", ...q("Fill in the blank: 'There ___ a big banyan tree in front of our house.'", "is", [["are", "sva-there-number-error"], ["were", "sva-there-number-error"], ["have been", "sva-there-number-error"]], "The subject comes after the verb: a big banyan tree (one tree) takes is.") },
      { subtopic: "there-is-are", ...q("Fill in the blank: 'There ___ five colourful parrots on the wooden fence.'", "are", [["is", "sva-there-number-error"], ["was", "sva-there-number-error"], ["be", "sva-there-number-error"]], "The subject is five colourful parrots (plural), so we use are.") },
      { subtopic: "here-is-are", ...q("Fill in the blank: 'Here ___ the missing keys you were looking for.'", "are", [["is", "sva-there-number-error"], ["was", "sva-there-number-error"], ["be", "sva-there-number-error"]], "The subject is the missing keys (plural), so we use are.") },
      { subtopic: "here-is-are", ...q("Fill in the blank: 'Here ___ your warm cup of ginger tea.'", "is", [["are", "sva-there-number-error"], ["were", "sva-there-number-error"], ["be", "sva-there-number-error"]], "The subject is your warm cup (singular), so we use is.") },
      { subtopic: "questions-do-does", ...q("Fill in the blank: '___ your brother play cricket on weekends?'", "Does", [["Do", "sva-do-does-error"], ["Are", "sva-do-does-error"], ["Is", "sva-do-does-error"]], "Your brother is one person, so we ask: Does your brother play...?") },
      { subtopic: "questions-do-does", ...q("Fill in the blank: '___ you know the way to the railway station?'", "Do", [["Does", "sva-do-does-error"], ["Is", "sva-do-does-error"], ["Are", "sva-do-does-error"]], "With the pronoun you, we ask questions using Do: Do you know...?") },
      { subtopic: "there-is-are", ...q("Fill in the blank: 'There ___ some fresh milk in the refrigerator.'", "is", [["are", "sva-there-number-error"], ["were", "sva-there-number-error"], ["be", "sva-there-number-error"]], "Milk is uncountable, so it takes the singular verb is: There is some milk.") },
      { subtopic: "questions-do-does", ...q("Fill in the blank: '___ those boys study in your school?'", "Do", [["Does", "sva-do-does-error"], ["Is", "sva-do-does-error"], ["Was", "sva-do-does-error"]], "Those boys is plural, so we use Do: Do those boys study...?") },
    ],

    "eq-u3-there-dodoes-quiz": [
      { subtopic: "questions-do-does", ...q("Fill in the blank: 'Does she ___ to school by bus every day?'", "go", [["goes", "sva-do-does-error"], ["went", "sva-do-does-error"], ["going", "sva-do-does-error"]], "After the helping verb Does, the main verb always returns to its base form: Does she go?") },
      { subtopic: "questions-do-does", ...q("Fill in the blank: 'Do they ___ English songs in music class?'", "sing", [["sings", "sva-do-does-error"], ["is singing", "sva-do-does-error"], ["sang", "sva-do-does-error"]], "They is plural and takes the base verb with Do: Do they sing?") },
      { subtopic: "questions-do-does", ...q("Fill in the blank: 'Does the postman ___ letters in the afternoon?'", "bring", [["brings", "sva-do-does-error"], ["brought", "sva-do-does-error"], ["is bringing", "sva-do-does-error"]], "After Does, we use the base form bring without -s: Does the postman bring?") },
      { subtopic: "questions-do-does", ...q("Fill in the blank: '___ the sun set in the west?'", "Does", [["Do", "sva-do-does-error"], ["Are", "sva-do-does-error"], ["Is", "sva-do-does-error"]], "The sun is one singular thing, so we use Does: Does the sun set...?") },
      { subtopic: "questions-do-does", ...q("Fill in the blank: '___ the birds build nests in spring?'", "Do", [["Does", "sva-do-does-error"], ["Is", "sva-do-does-error"], ["Was", "sva-do-does-error"]], "The birds is plural, so we ask using Do: Do the birds build...?") },
      { subtopic: "questions-do-does", ...q("Fill in the blank: 'Does this bus ___ near the railway station?'", "stop", [["stops", "sva-do-does-error"], ["stopped", "sva-do-does-error"], ["is stopping", "sva-do-does-error"]], "With Does, the verb remains in base form: Does this bus stop?") },
    ],

    "eq-u3-there-gate-pool": [
      { subtopic: "there-is-are", ...q("Fill in the blank: 'There ___ twelve months in one year.'", "are", [["is", "sva-there-number-error"], ["was", "sva-there-number-error"], ["be", "sva-there-number-error"]], "Twelve months is plural, so we say: There are twelve months.") },
      { subtopic: "there-is-are", ...q("Fill in the blank: 'There ___ an empty seat in the last row.'", "is", [["are", "sva-there-number-error"], ["were", "sva-there-number-error"], ["be", "sva-there-number-error"]], "An empty seat is singular, so we say: There is an empty seat.") },
      { subtopic: "there-is-are", ...q("Fill in the blank: 'There ___ only a little water left in the jug.'", "is", [["are", "sva-there-number-error"], ["were", "sva-there-number-error"], ["be", "sva-there-number-error"]], "Water is uncountable, so it takes the singular verb is: There is water.") },
      { subtopic: "there-is-are", ...q("Fill in the blank: 'There ___ many tall pine trees on the mountain.'", "are", [["is", "sva-there-number-error"], ["was", "sva-there-number-error"], ["be", "sva-there-number-error"]], "Many tall pine trees is plural, so we use are: There are many trees.") },
      { subtopic: "there-is-are", ...q("Fill in the blank: 'There ___ no excuse for being rude to others.'", "is", [["are", "sva-there-number-error"], ["were", "sva-there-number-error"], ["be", "sva-there-number-error"]], "No excuse is singular, so we use is: There is no excuse.") },

      { subtopic: "here-is-are", ...q("Fill in the blank: 'Here ___ the storybooks you wanted to borrow.'", "are", [["is", "sva-there-number-error"], ["was", "sva-there-number-error"], ["be", "sva-there-number-error"]], "The storybooks is plural, so we say: Here are the storybooks.") },
      { subtopic: "here-is-are", ...q("Fill in the blank: 'Here ___ a fresh slice of chocolate cake for you.'", "is", [["are", "sva-there-number-error"], ["were", "sva-there-number-error"], ["be", "sva-there-number-error"]], "A fresh slice is singular, so we say: Here is a fresh slice.") },
      { subtopic: "here-is-are", ...q("Fill in the blank: 'Here ___ the four winners of the quiz contest.'", "are", [["is", "sva-there-number-error"], ["was", "sva-there-number-error"], ["be", "sva-there-number-error"]], "The four winners is plural, so we use are: Here are the four winners.") },
      { subtopic: "here-is-are", ...q("Fill in the blank: 'Here ___ your new lunch box and water bottle.'", "are", [["is", "sva-there-number-error"], ["was", "sva-there-number-error"], ["be", "sva-there-number-error"]], "Lunch box and water bottle make two items (plural), so we say: Here are.") },
      { subtopic: "here-is-are", ...q("Fill in the blank: 'Here ___ the pencil sharpener you dropped.'", "is", [["are", "sva-there-number-error"], ["were", "sva-there-number-error"], ["be", "sva-there-number-error"]], "The pencil sharpener is singular, so we say: Here is the sharpener.") },

      { subtopic: "questions-do-does", ...q("Fill in the blank: '___ your father drive a car to work?'", "Does", [["Do", "sva-do-does-error"], ["Is", "sva-do-does-error"], ["Are", "sva-do-does-error"]], "Your father is singular, so we ask: Does your father drive...?") },
      { subtopic: "questions-do-does", ...q("Fill in the blank: '___ these mangoes taste sweet or sour?'", "Do", [["Does", "sva-do-does-error"], ["Is", "sva-do-does-error"], ["Was", "sva-do-does-error"]], "These mangoes is plural, so we ask with Do: Do these mangoes taste...?") },
      { subtopic: "questions-do-does", ...q("Fill in the blank: 'Does Kabir ___ stamps in his scrapbook?'", "collect", [["collects", "sva-do-does-error"], ["collected", "sva-do-does-error"], ["is collecting", "sva-do-does-error"]], "After Does, the main verb stays in base form: Does Kabir collect?") },
      { subtopic: "questions-do-does", ...q("Fill in the blank: '___ you have an extra eraser in your pencil pouch?'", "Do", [["Does", "sva-do-does-error"], ["Is", "sva-do-does-error"], ["Are", "sva-do-does-error"]], "With the pronoun you, we ask questions with Do: Do you have...?") },
      { subtopic: "questions-do-does", ...q("Fill in the blank: '___ the train stop at this small village station?'", "Does", [["Do", "sva-do-does-error"], ["Is", "sva-do-does-error"], ["Are", "sva-do-does-error"]], "The train is singular, so we ask: Does the train stop...?") },
    ],

    // Unit 3 Boss: 12 mixed questions
    "eq-u3-test": [
      q("Fill in the blank: 'Neither Rohit nor his cousins ___ ready for the match.'", "are", [["is", "sva-or-compound-error"], ["was", "sva-or-compound-error"], ["be", "sva-or-compound-error"]], "When subjects are joined by nor, the verb agrees with the closer subject: cousins (plural) takes are."),
      q("Fill in the blank: 'Every member of the science club ___ a badge.'", "wears", [["wear", "sva-each-every-error"], ["are wearing", "sva-each-every-error"], ["have worn", "sva-each-every-error"]], "Every member is singular, so the verb ends in -s: Every member wears."),
      q("Fill in the blank: 'A pair of clean socks ___ kept on the shelf.'", "is", [["are", "sva-pair-noun-error"], ["were", "sva-pair-noun-error"], ["have been", "sva-pair-noun-error"]], "The subject is A pair (singular), so the verb is is: A pair of clean socks is."),
      q("Fill in the blank: 'There ___ three baby squirrels inside the hollow trunk.'", "are", [["is", "sva-there-number-error"], ["was", "sva-there-number-error"], ["be", "sva-there-number-error"]], "The subject is three baby squirrels (plural), so we say: There are."),
      q("Fill in the blank: 'Does your sister ___ the piano every evening?'", "practice", [["practices", "sva-do-does-error"], ["practiced", "sva-do-does-error"], ["is practicing", "sva-do-does-error"]], "After Does, the verb returns to its base form: Does your sister practice?"),
      q("Fill in the blank: 'The quality of these red apples ___ very good.'", "is", [["are", "sva-number-error"], ["were", "sva-number-error"], ["have been", "sva-number-error"]], "The subject is The quality (singular), not the apples. So we use is: The quality is."),
      q("Fill in the blank: 'You and I ___ going to represent our class in the debate.'", "are", [["am", "sva-and-compound-error"], ["is", "sva-and-compound-error"], ["was", "sva-and-compound-error"]], "You and I make two people (we), so the verb is are: You and I are."),
      q("Fill in the blank: 'Each of the players ___ given a medal after the game.'", "was", [["were", "sva-each-every-error"], ["are", "sva-each-every-error"], ["have been", "sva-each-every-error"]], "The subject is Each (singular), so we use was: Each was given."),
      q("Fill in the blank: 'Here ___ the four library books that you requested.'", "are", [["is", "sva-there-number-error"], ["was", "sva-there-number-error"], ["be", "sva-there-number-error"]], "The four library books is plural, so we say: Here are."),
      q("Fill in the blank: 'The bouquet of yellow sunflowers ___ fresh and bright.'", "looks", [["look", "sva-collective-noun-error"], ["are looking", "sva-collective-noun-error"], ["have looked", "sva-collective-noun-error"]], "The subject is The bouquet (one collection), so the verb ends in -s: The bouquet looks."),
      q("Fill in the blank: '___ the children enjoy playing in the gentle rain?'", "Do", [["Does", "sva-do-does-error"], ["Is", "sva-do-does-error"], ["Was", "sva-do-does-error"]], "The children is plural, so we ask with Do: Do the children enjoy...?"),
      q("Fill in the blank: 'Slow and steady ___ the race in the famous fable.'", "wins", [["win", "sva-and-compound-error"], ["are winning", "sva-and-compound-error"], ["were winning", "sva-and-compound-error"]], "Slow and steady represents a single proverb idea, so it takes the singular verb wins."),
    ],
  },

  // ---------- Readings ----------
  readings: {
    "eq-read-clock-tower": {
      name: "The Clock Tower Mystery",
      author: "Apprec8",
      mode: "fullPassage",
      glossary: {
        spiral: "curving around a center point like a coil or spring",
        cogs: "wheels with teeth on the edge that turn together",
        pendulum: "a hanging weight that swings from side to side",
        gong: "a round metal plate or bell that makes a ringing sound when hit",
        council: "a group of people chosen to manage the town",
      },
      paragraphs: [
        "High on the ridge of the hill town of Shimla stood an old wooden clock tower. For fifty years, its deep bell rang every afternoon at four o'clock. Then, on a cloudy Tuesday, the great bell stopped ringing. The town was strangely quiet, and the school children wondered what had happened.",
        "Aarav and Meera decided to visit Old Mr. Sharma, the clockkeeper. They climbed the spiral stairs of the tower, counting ninety dusty wooden steps. At the top, giant brass cogs and wheels rested inside a glass cabinet. Mr. Sharma was sitting on a stool, shining a brass pendulum with a soft yellow cloth.",
        "\"Is the clock broken, Uncle?\" asked Meera. Mr. Sharma smiled and pointed to the largest wheel. \"The main spring is fine,\" he whispered, \"but a family of mountain sparrows has built a cozy nest between the bell hammer and the iron wheel. Each little bird sleeps right next to the gong.\"",
        "Aarav watched four tiny brown chicks open their beaks. \"If the bell rings, it will scare them away,\" Aarav said. Mr. Sharma nodded kindly. \"Indeed. The town council agreed that we must wait until the chicks learn to fly. A little quiet is a small price to pay for four new lives.\"",
        "For three weeks, there was no ringing bell across the valley. Then, on a bright sunny morning, six sparrows flew out of the tower window together. That afternoon, the clock bell struck four loud chimes once again.",
      ],
      questions: [
        {
          ...q(
            "Why did the school children wonder what had happened in the town?",
            "The great bell stopped ringing on a cloudy Tuesday.",
            [
              ["The old clockkeeper had left Shimla forever.", "not-in-passage"],
              ["The wooden clock tower fell down during a storm.", "not-in-passage"],
              ["The school was closed because of heavy winter snow.", "not-in-passage"],
            ],
            "Paragraph 1 says: 'Then, on a cloudy Tuesday, the great bell stopped ringing. The town was strangely quiet, and the school children wondered what had happened.'"
          ),
          evidence: { paragraph: 0, text: "the great bell stopped ringing." },
        },
        {
          ...q(
            "What was Mr. Sharma doing when Aarav and Meera reached the top?",
            "Shining a brass pendulum with a soft yellow cloth",
            [
              ["Repairing the broken main spring with an iron hammer", "detail-missed"],
              ["Feeding bread crumbs to the four young sparrows", "not-in-passage"],
              ["Painting the dusty wooden steps of the spiral stairs", "not-in-passage"],
            ],
            "Paragraph 2 states that Mr. Sharma was 'shining a brass pendulum with a soft yellow cloth.'"
          ),
          evidence: { paragraph: 1, text: "shining a brass pendulum with a soft yellow cloth." },
        },
        {
          ...q(
            "Select the INCORRECT statement according to the passage.",
            "Mr. Sharma removed the sparrow nest immediately to fix the bell.",
            [
              ["The children climbed ninety dusty wooden steps.", "statement-check"],
              ["The sparrows built a nest between the hammer and wheel.", "statement-check"],
              ["The town council agreed to wait until chicks could fly.", "statement-check"],
            ],
            "The council and Mr. Sharma decided to wait three weeks until the chicks could fly; they did not remove the nest immediately."
          ),
          evidence: { paragraph: 3, text: "The town council agreed that we must wait until the chicks learn to fly." },
        },
        {
          ...q(
            "The word 'pendulum' in the passage means ___.",
            "a hanging weight that swings steadily from side to side",
            [
              ["a nest built out of dry grass and feathers", "word-meaning"],
              ["a brass key used to lock the tower door", "word-meaning"],
              ["a small bird that lives in high mountains", "word-meaning"],
            ],
            "In a mechanical clock, a pendulum is the swinging weight that regulates the movement."
          ),
          evidence: { paragraph: 1, text: "shining a brass pendulum with a soft yellow cloth." },
        },
        {
          ...q(
            "In 'Each little bird sleeps right next to the gong', why does the verb end in -s?",
            "The subject 'Each little bird' speaks of one bird at a time.",
            [
              ["The noun 'gong' at the end of the sentence is singular.", "sva-number-error"],
              ["The word 'sleeps' is describing a past action yesterday.", "verb-tense-error"],
              ["The sentence is asking a question about the mountain birds.", "sentence-kind-mixup"],
            ],
            "'Each' is singular and means one at a time, so the present tense verb takes -s: Each bird sleeps."
          ),
          evidence: { paragraph: 2, text: "Each little bird sleeps right next to the gong." },
        },
        {
          ...q(
            "What happened at the end of the three weeks?",
            "The sparrows flew away and the clock bell rang once again.",
            [
              ["The town council decided to build a brand new clock tower.", "not-in-passage"],
              ["Mr. Sharma forgot to wind the heavy brass wheels of the clock.", "not-in-passage"],
              ["The school children moved the nest to the school garden.", "not-in-passage"],
            ],
            "Paragraph 5 explains that six sparrows flew out of the window together and the bell struck four chimes once again."
          ),
          evidence: { paragraph: 4, text: "six sparrows flew out of the tower window together. That afternoon, the clock bell struck four loud chimes once again." },
        },
      ],
    },
  },

  wordTables: {},

  // ---------- Quest Nodes ----------
  nodes: [
    unit("eq-u3", 3, "Subject-Verb Agreement"),

    // Topic 0: Basics
    svaBasics,
    withSubtopic(practice("eq-u3-basics-p1", svaBasics, 1, "The 'I' and 'You' Rules", "easy", [quiz("eq-u3-basics-iyou-quiz")]), "pronouns-i-you"),
    gate("eq-u3-basics-gate", svaBasics, "Agreement Challenge", "eq-u3-basics-gate-pool", {
      "singular-subject": "Singular subjects",
      "plural-subject": "Plural subjects",
      "pronouns-i-you": "Pronouns I and you",
    }),
    endless(svaBasics),

    // Topic 1: Tricky Subjects
    svaTricky,
    withSubtopic(practice("eq-u3-tricky-p1", svaTricky, 1, "Each, Every & Everyone", "medium", [quiz("eq-u3-tricky-each-quiz")]), "each-everyone"),
    withSubtopic(practice("eq-u3-tricky-p2", svaTricky, 2, "A Pair of...", "hard", [quiz("eq-u3-tricky-pairs-quiz")]), "pair-collective"),
    gate("eq-u3-tricky-gate", svaTricky, "Tricky Subjects Challenge", "eq-u3-tricky-gate-pool", {
      "each-everyone": "Each, every and everyone",
      "compound-subjects": "Compound subjects (and / or)",
      "pair-collective": "A pair of and collective groups",
    }),
    endless(svaTricky),

    // Topic 2: There is, There are and Questions
    svaThere,
    withSubtopic(practice("eq-u3-there-p1", svaThere, 1, "Do or Does?", "medium", [quiz("eq-u3-there-dodoes-quiz")]), "questions-do-does"),
    gate("eq-u3-there-gate", svaThere, "There & Question Challenge", "eq-u3-there-gate-pool", {
      "there-is-are": "There is and there are",
      "here-is-are": "Here is and here are",
      "questions-do-does": "Do and does questions",
    }),
    endless(svaThere),

    // Reading & Boss
    u3r,
    boss(
      "eq-u3-boss",
      "eq-u3",
      "Unit 3 Boss",
      "eq-u3-test",
      "Oh no! 👾 The Grammar Gremlin snuck into the town hall and broke the gears of the agreement machine. Now singular subjects are paired with plural verbs, and nobody can understand the announcements! Help the mayor match every subject with its right verb and restore order."
    ),
  ],
};

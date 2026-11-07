// data/scienceQuest/units/u6.js: Science Unit 6, Patterns & Puzzles (Claude, 2026-11-05). Classes 3–5.
// Thinking skills: number and letter series, analogies and odd one out; letter and number codes, directions; ranking in a
// row, days and clocks, family words. Text-only types (no pictures needed). Every answer is arithmetic or logic and is
// checked by tests/reasoningCheck.test.mjs where it can be computed. Original questions.
// Ambiguity rule: no odd-one-out with two possible answers (e.g. "circle" in a shapes list), analogies whose wrong options
// don't fit any relation ("shoe" is left out of hand:glove :: foot:?), family questions say whether a person is a man or a woman.
import { q, study, quiz, unit, main, practice, gate, withSubtopic, endless, boss, forGrades } from "../../englishQuest/helpers.js";

const C345 = [3, 4, 5];
const t = (subtopic, question, correct, wrongs, explanation) => ({ subtopic, ...q(question, correct, wrongs, explanation) });

const u6 = forGrades(unit("sq-u6", 6, "Patterns & Puzzles"), C345);
const patterns = forGrades(main("sq-patterns", u6.id, 1, "Patterns & Series", [study("sq-patterns-study"), quiz("sq-patterns-warmup")]), C345);
const codes = forGrades(main("sq-codes", u6.id, 2, "Codes & Directions", [study("sq-codes-study"), quiz("sq-codes-warmup")]), C345);
const order = forGrades(main("sq-order", u6.id, 3, "Order, Time & Family", [study("sq-order-study"), quiz("sq-order-warmup")]), C345);

export default {
  studyPages: {
    "sq-patterns-study": {
      name: "Patterns and Series",
      author: "Apprec8",
    cards: [
          {
                "emoji": "🔢",
                "title": "Find the number rule",
                "text": "Every series follows a secret pattern. Look at the difference between numbers: are they adding, subtracting, doubling, or growing by +1, +2, +3?",
                "examples": [
                      "2, 4, 6, 8 → add 2 (+2)",
                      "3, 6, 12, 24 → double (×2)",
                      "100, 90, 80 → take away 10 (-10)",
                      "1, 2, 4, 7, 11 → add 1, 2, 3, 4 (+5 next)"
                ]
          },
          {
                "emoji": "🔤",
                "title": "Letter patterns & skipping",
                "text": "Number the letters: A=1, B=2, C=3 up to Z=26. Look for skipping patterns like A, C, E (skip one letter) or backwards patterns like Z, Y, X.",
                "examples": [
                      "A, C, E, G → skip one (I is next)",
                      "Z, Y, X, W → reverse alphabet (V is next)",
                      "B, D, F, H → even positions"
                ]
          },
          {
                "emoji": "🧩",
                "title": "Analogies & odd one out",
                "text": "An analogy pairs words with the same link: bird is to nest as bee is to hive! For odd-one-out, spot which three share a rule and which one does not belong.",
                "examples": [
                      "Bird : Nest :: Bee : Hive (homes)",
                      "Car : Road :: Ship : Sea (travel)",
                      "Mars, Venus, Moon, Earth → Moon is odd (satellite)"
                ]
          },
          {
                "kind": "check",
                "question": "What is the next number in the pattern: 3, 6, 12, 24, ___?",
                "answer": "48",
                "wrong": [
                      "30",
                      "36",
                      "42"
                ],
                "explain": "Each number is doubled (multiplied by 2) to get the next number: 24 × 2 = 48."
          },
          {
                "kind": "check",
                "question": "Which one is the ODD one out: Apple, Mango, Potato, Banana?",
                "answer": "Potato",
                "wrong": [
                      "Apple",
                      "Mango",
                      "Banana"
                ],
                "explain": "Apple, mango, and banana are sweet fruits that grow on trees. Potato is an underground vegetable (tuber)!"
          }
    ],
      content: `### 🔢 Find the rule

A **series** follows a rule. Find the rule, then use it for the next one.

| Series | Rule | Next |
|---|---|---|
| 2, 4, 6, 8 | add 2 | **10** |
| 3, 6, 12, 24 | double it | **48** |
| 100, 90, 80 | take away 10 | **70** |
| 1, 2, 4, 7, 11 | add 1, then 2, then 3, then 4… | **16** |

> 💡 Look at the **gaps** between numbers. Write them down.

---

### 🔤 Letter series

Give each letter its number: A = 1, B = 2, C = 3 … Z = 26.

| Series | Rule | Next |
|---|---|---|
| A, C, E, G | skip one letter | **I** |
| Z, Y, X, W | go backwards | **V** |

---

### 🧩 Analogies and odd one out

- **Analogy:** find how the first pair is linked, then link the second pair the same way.
  *Bird is to nest as bee is to **hive*** (where it lives).
- **Odd one out:** find what three have in common. The fourth is the odd one.
  *Mars, Venus, **Moon**, Jupiter* (the Moon is not a planet).

---

### 🎯 Now you can…
- find the rule in a number or letter series
- solve an analogy
- spot the odd one out`,
    },
    "sq-codes-study": {
      name: "Codes and Directions",
      author: "Apprec8",
    cards: [
          {
                "emoji": "🕵️",
                "title": "Secret letter codes",
                "text": "A code shifts letters by a rule. One step forward turns C-A-T into D-B-U. One step back turns H-O-T into G-N-S. Reversing writes letters backwards, turning B-O-O-K into K-O-O-B.",
                "examples": [
                      "Forward (+1): CAT → DBU",
                      "Backward (-1): HOT → GNS",
                      "Reverse: BOOK → KOOB",
                      "Numbers: CAB → 3 + 1 + 2 = 6"
                ]
          },
          {
                "emoji": "🧭",
                "title": "Finding directions",
                "text": "Face North: East is to your right, West is on your left, and South is behind you. If you face North and turn right 90 degrees, you are now facing East!",
                "examples": [
                      "Facing North: Right turn → East",
                      "Facing East: Right turn → South",
                      "Facing South: Right turn → West",
                      "Facing West: Right turn → North"
                ]
          },
          {
                "emoji": "☀️",
                "title": "Sun and shadows",
                "text": "The Sun rises in the East and sets in the West. Because shadows fall away from light, morning shadows point West and evening shadows point East.",
                "examples": [
                      "Morning Sun in East → Shadow points West",
                      "Evening Sun in West → Shadow points East",
                      "Noon Sun overhead → Tiny shadow"
                ]
          },
          {
                "kind": "check",
                "question": "If B-A-T is coded as C-B-U (each letter shifted +1 forward), how is P-E-N coded?",
                "answer": "Q-F-O",
                "wrong": [
                      "Q-D-M",
                      "O-D-M",
                      "Q-E-O"
                ],
                "explain": "P + 1 = Q, E + 1 = F, N + 1 = O. So PEN becomes QFO."
          },
          {
                "kind": "check",
                "question": "You are standing facing North. If you turn to your right, which direction are you facing?",
                "answer": "East",
                "wrong": [
                      "West",
                      "South",
                      "North-West"
                ],
                "explain": "When facing North, turning right points you directly East."
          }
    ],
      content: `### 🕵️ Secret codes

| Code | Example |
|---|---|
| **One step forward** | C A T → **D B U** |
| **One step back** | H O T → **G N S** |
| **Backwards (reversed)** | B O O K → **K O O B** |
| **Numbers** (A = 1, B = 2 …) | C A B → 3 + 1 + 2 = **6** |

> 💡 Write the alphabet at the top of your page: A B C D E … It makes codes easy.

---

### 🧭 Directions

Stand facing **North**. **East** is on your right, **West** on your left, **South** behind you.

| Facing | Turn right → | Turn left → |
|---|---|---|
| North | East | West |
| East | South | North |
| South | West | East |
| West | North | South |

> ☀️ The Sun rises in the **east** and sets in the **west**. Your shadow points away from the Sun.

---

### 🎯 Now you can…
- crack forward, backward and number codes
- find which way you face after a turn`,
    },
    "sq-order-study": {
      name: "Order, Time and Family",
      author: "Apprec8",
    cards: [
          {
                "emoji": "🏃",
                "title": "Ranking in a line",
                "text": "To find total people in a line, add place from front + place from back − 1. If Tina is 4th from front and 4th from back: 4 + 4 − 1 = 7 children!",
                "examples": [
                      "Total = Front + Back − 1",
                      "Place from other end = Total − Place + 1",
                      "4th from both ends = 4 + 4 − 1 = 7"
                ]
          },
          {
                "emoji": "📅",
                "title": "Days and clocks",
                "text": "Days repeat in cycles of 7. If today is Friday, 8 days later is 8 − 7 = 1 day after Friday, which is Saturday. February has 29 days in a leap year.",
                "examples": [
                      "7 days make a full week",
                      "1 hour = 60 minutes",
                      "Leap year: February has 29 days",
                      "4:30 + 45 minutes = 5:15"
                ]
          },
          {
                "emoji": "👨‍👩‍👧",
                "title": "Family relations",
                "text": "Your father's or mother's brother is your uncle, and their sister is your aunt. Their children are your cousins. A brother's or sister's son is a nephew; their daughter is a niece.",
                "examples": [
                      "Uncle / Aunt = Parent's brother / sister",
                      "Cousin = Uncle or aunt's child",
                      "Nephew = Sibling's son",
                      "Niece = Sibling's daughter"
                ]
          },
          {
                "kind": "check",
                "question": "Rohan is 5th from the front and 5th from the back in a single file. How many students are in the row?",
                "answer": "9 students",
                "wrong": [
                      "10 students",
                      "8 students",
                      "11 students"
                ],
                "explain": "5 + 5 − 1 = 9 students (Rohan is counted only once, so subtract 1)."
          },
          {
                "kind": "check",
                "question": "What is your father's sister called?",
                "answer": "Aunt",
                "wrong": [
                      "Niece",
                      "Cousin",
                      "Grandmother"
                ],
                "explain": "Your father's or mother's sister is your aunt (bua or masi)."
          }
    ],
      content: `### 🏃 Places in a row

- **Place from the other end** = total − place + 1.
  In a row of 9, 5th from the left = 9 − 5 + 1 = **5th from the right**.
- **How many in the queue?** = place from front + place from back − 1.
  4th from the front and 4th from the back → 4 + 4 − 1 = **7 people**.
- **Taller / shorter puzzles:** draw a ladder. Put the tallest at the top.

---

### 📅 Days and clocks

- Days repeat every **7**. Today Friday, after 10 days → 10 − 7 = 3 → Friday + 3 = **Monday**.
- 1 hour = **60 minutes**. Add hours first, then minutes: 4:30 + 1 h 45 min = **6:15**.
- February has **29 days** in a leap year, 28 in other years.

---

### 👨‍👩‍👧 Family words

| Who | Word |
|---|---|
| Father's or mother's brother | **uncle** |
| Father's or mother's sister | **aunt** |
| Uncle's or aunt's child | **cousin** |
| Brother's or sister's daughter / son | **niece** / **nephew** |
| Father's or mother's mother | **grandmother** |

---

### 🎯 Now you can…
- find places from either end of a row
- count days and time forward and back
- name family relations`,
    },
  },

  quizzes: {
    // ---------- Patterns & Series ----------
    "sq-patterns-warmup": [
      t("number-series", "What comes next? 2, 4, 6, 8, ___", "10", [["9", "series-rule-mixup"], ["12", "series-rule-mixup"], ["16", "series-rule-mixup"]], "The rule is add 2: 8 + 2 = 10."),
      t("number-series", "What comes next? 3, 6, 12, 24, ___", "48", [["30", "series-rule-mixup"], ["36", "series-rule-mixup"], ["27", "series-rule-mixup"]], "Each number is doubled: 24 × 2 = 48."),
      t("letter-series", "What comes next? A, C, E, G, ___", "I", [["H", "series-rule-mixup"], ["J", "series-rule-mixup"], ["K", "series-rule-mixup"]], "Skip one letter each time: G, (H), I."),
      t("letter-series", "What comes next? Z, Y, X, W, ___", "V", [["U", "series-rule-mixup"], ["A", "series-rule-mixup"], ["T", "series-rule-mixup"]], "The alphabet backwards: W, then V."),
      t("analogy-odd", "Bird is to nest as bee is to ___.", "hive", [["flower", "analogy-mixup"], ["wing", "analogy-mixup"], ["garden", "analogy-mixup"]], "A bird's home is a nest; a bee's home is a hive."),
      t("analogy-odd", "Find the odd one out: rose, marigold, mango, lily", "mango", [["rose", "odd-one-mixup"], ["marigold", "odd-one-mixup"], ["lily", "odd-one-mixup"]], "Rose, marigold and lily are flowers. Mango is a fruit."),
      t("analogy-odd", "Find the odd one out: 4, 8, 12, 15, 20", "15", [["8", "odd-one-mixup"], ["12", "odd-one-mixup"], ["20", "odd-one-mixup"]], "4, 8, 12 and 20 are in the 4 times table. 15 is not."),
      t("number-series", "What comes next? 1, 4, 9, 16, ___", "25", [["20", "series-rule-mixup"], ["32", "series-rule-mixup"], ["24", "series-rule-mixup"]], "1×1, 2×2, 3×3, 4×4, so next is 5×5 = 25."),
    ],
    "sq-patterns-series": [
      t("number-series", "What comes next? 5, 10, 15, 20, ___", "25", [["30", "series-rule-mixup"], ["24", "series-rule-mixup"], ["21", "series-rule-mixup"]], "Add 5 each time: 20 + 5 = 25."),
      t("number-series", "What comes next? 100, 90, 80, 70, ___", "60", [["65", "series-rule-mixup"], ["50", "series-rule-mixup"], ["75", "series-rule-mixup"]], "Take away 10 each time: 70 − 10 = 60."),
      t("number-series", "What comes next? 1, 2, 4, 7, 11, ___", "16", [["15", "series-rule-mixup"], ["14", "series-rule-mixup"], ["18", "series-rule-mixup"]], "The gaps grow: +1, +2, +3, +4, so next is +5: 11 + 5 = 16."),
      t("number-series", "What comes next? 2, 6, 18, 54, ___", "162", [["108", "series-rule-mixup"], ["72", "series-rule-mixup"], ["160", "series-rule-mixup"]], "Multiply by 3 each time: 54 × 3 = 162."),
      t("number-series", "What comes next? 1, 1, 2, 3, 5, 8, ___", "13", [["11", "series-rule-mixup"], ["12", "series-rule-mixup"], ["16", "series-rule-mixup"]], "Add the two numbers before: 5 + 8 = 13."),
      t("number-series", "What comes next? 81, 27, 9, 3, ___", "1", [["0", "series-rule-mixup"], ["2", "series-rule-mixup"], ["6", "series-rule-mixup"]], "Divide by 3 each time: 3 ÷ 3 = 1."),
      t("number-series", "Find the missing number: 4, 8, ___, 16, 20", "12", [["10", "series-rule-mixup"], ["14", "series-rule-mixup"], ["13", "series-rule-mixup"]], "Add 4 each time: 8 + 4 = 12."),
      t("number-series", "Which number does NOT fit the rule? 2, 4, 6, 9, 10, 12", "9", [["4", "series-rule-mixup"], ["10", "series-rule-mixup"], ["12", "series-rule-mixup"]], "The rule is add 2: 2, 4, 6, 8, 10, 12. The 9 should be 8."),
    ],
    "sq-patterns-gate-pool": [
      t("number-series", "What comes next? 7, 14, 21, 28, ___", "35", [["32", "series-rule-mixup"], ["36", "series-rule-mixup"], ["42", "series-rule-mixup"]], "Add 7 each time (the 7 times table): 28 + 7 = 35."),
      t("number-series", "What comes next? 64, 32, 16, 8, ___", "4", [["2", "series-rule-mixup"], ["6", "series-rule-mixup"], ["0", "series-rule-mixup"]], "Halve each time: 8 ÷ 2 = 4."),
      t("number-series", "What comes next? 2, 5, 10, 17, 26, ___", "37", [["35", "series-rule-mixup"], ["36", "series-rule-mixup"], ["39", "series-rule-mixup"]], "The gaps are 3, 5, 7, 9, so next is +11: 26 + 11 = 37."),
      t("number-series", "Find the missing number: 3, ___, 12, 24, 48", "6", [["9", "series-rule-mixup"], ["8", "series-rule-mixup"], ["4", "series-rule-mixup"]], "Each number is doubled: 3 × 2 = 6, 6 × 2 = 12."),
      t("number-series", "What comes next? 10, 13, 16, 19, ___", "22", [["21", "series-rule-mixup"], ["23", "series-rule-mixup"], ["25", "series-rule-mixup"]], "Add 3 each time: 19 + 3 = 22."),
      t("letter-series", "What comes next? B, D, F, H, ___", "J", [["I", "series-rule-mixup"], ["K", "series-rule-mixup"], ["G", "series-rule-mixup"]], "Skip one letter each time: H, (I), J."),
      t("letter-series", "What comes next? A, B, D, G, K, ___", "P", [["O", "series-rule-mixup"], ["Q", "series-rule-mixup"], ["N", "series-rule-mixup"]], "The jumps grow: +1, +2, +3, +4, so next is +5: K (11) + 5 = P (16)."),
      t("letter-series", "What comes next? AZ, BY, CX, DW, ___", "EV", [["EU", "series-rule-mixup"], ["FV", "series-rule-mixup"], ["EW", "series-rule-mixup"]], "The first letter goes forward (A, B, C, D, E); the second goes back (Z, Y, X, W, V)."),
      t("letter-series", "What comes next? M, N, O, P, ___", "Q", [["R", "series-rule-mixup"], ["S", "series-rule-mixup"], ["L", "series-rule-mixup"]], "The alphabet in order: P, then Q."),
      t("letter-series", "What comes next? A1, B2, C3, D4, ___", "E5", [["E4", "series-rule-mixup"], ["F5", "series-rule-mixup"], ["D5", "series-rule-mixup"]], "The letter goes one forward and the number goes up by 1: E5."),
      t("analogy-odd", "Doctor is to hospital as teacher is to ___.", "school", [["book", "analogy-mixup"], ["student", "analogy-mixup"], ["chalk", "analogy-mixup"]], "A doctor works in a hospital; a teacher works in a school."),
      t("analogy-odd", "Hand is to glove as foot is to ___.", "sock", [["toe", "analogy-mixup"], ["leg", "analogy-mixup"], ["walk", "analogy-mixup"]], "A glove covers the hand; a sock covers the foot."),
      t("analogy-odd", "Find the odd one out: Delhi, Mumbai, India, Chennai", "India", [["Delhi", "odd-one-mixup"], ["Mumbai", "odd-one-mixup"], ["Chennai", "odd-one-mixup"]], "Delhi, Mumbai and Chennai are cities. India is a country."),
      t("analogy-odd", "Find the odd one out: Mars, Venus, Moon, Jupiter", "Moon", [["Mars", "odd-one-mixup"], ["Venus", "odd-one-mixup"], ["Jupiter", "odd-one-mixup"]], "Mars, Venus and Jupiter are planets. The Moon goes around the Earth."),
      t("analogy-odd", "Puppy is to dog as kitten is to ___.", "cat", [["mouse", "analogy-mixup"], ["cub", "analogy-mixup"], ["milk", "analogy-mixup"]], "A puppy is a young dog; a kitten is a young cat."),
    ],

    // ---------- Codes & Directions ----------
    "sq-codes-warmup": [
      t("letter-code", "In a code, CAT is written as DBU (each letter moves one step forward). How is DOG written?", "EPH", [["CNF", "code-direction-mixup"], ["EPG", "code-step-mixup"], ["DPH", "code-step-mixup"]], "D → E, O → P, G → H: EPH."),
      t("letter-code", "In a code, BOOK is written as KOOB. How is DESK written?", "KSED", [["DKSE", "code-step-mixup"], ["KSDE", "code-step-mixup"], ["SKED", "code-step-mixup"]], "The code writes the word backwards: D E S K → K S E D."),
      t("number-code", "If A = 1, B = 2, C = 3 and so on, what do the letters of CAB add up to?", "6", [["5", "code-step-mixup"], ["7", "code-step-mixup"], ["9", "code-step-mixup"]], "C = 3, A = 1, B = 2: 3 + 1 + 2 = 6."),
      t("number-code", "If A = 1, B = 2 and so on, which word is 8, 5, 14?", "HEN", [["HEM", "code-step-mixup"], ["GEN", "code-step-mixup"], ["HAN", "code-step-mixup"]], "8 = H, 5 = E, 14 = N: HEN."),
      t("directions", "You face North and turn right. Which way do you face now?", "East", [["West", "direction-turn-mixup"], ["South", "direction-turn-mixup"], ["North", "direction-turn-mixup"]], "Facing North, your right hand points East."),
      t("directions", "The Sun rises in the ___.", "east", [["west", "direction-turn-mixup"], ["north", "direction-turn-mixup"], ["south", "direction-turn-mixup"]], "The Sun rises in the east and sets in the west."),
      t("directions", "You face East and turn left. Which way do you face now?", "North", [["South", "direction-turn-mixup"], ["West", "direction-turn-mixup"], ["East", "direction-turn-mixup"]], "Facing East, your left hand points North."),
      t("directions", "Riya walks 3 km north, then 3 km south. How far is she from where she started?", "0 km", [["6 km", "direction-distance-mixup"], ["3 km", "direction-distance-mixup"], ["9 km", "direction-distance-mixup"]], "She walked back the same way, so she is at the start again."),
    ],
    "sq-codes-secret": [
      t("letter-code", "Each letter moves one step back: B → A. How is HOT written?", "GNS", [["IPU", "code-direction-mixup"], ["GNT", "code-step-mixup"], ["HNS", "code-step-mixup"]], "H → G, O → N, T → S: GNS."),
      t("letter-code", "In a code, SUN is written as TVO. How is MOON written?", "NPPO", [["NOPO", "code-step-mixup"], ["LNNM", "code-direction-mixup"], ["NPOO", "code-step-mixup"]], "Each letter moves one step forward: M → N, O → P, O → P, N → O."),
      t("letter-code", "In a code, PEN is written as NEP. How is CUP written?", "PUC", [["CPU", "code-step-mixup"], ["UPC", "code-step-mixup"], ["PCU", "code-step-mixup"]], "The code writes the word backwards: C U P → P U C."),
      t("number-code", "In a code, 1 = A, 2 = B, 3 = C and so on. Which word is 2-1-4?", "BAD", [["BAC", "code-step-mixup"], ["CAD", "code-step-mixup"], ["ABD", "code-step-mixup"]], "2 = B, 1 = A, 4 = D: BAD."),
      t("number-code", "If A = 1, B = 2 and so on, CAT adds up to 24 (3 + 1 + 20). What does DOG add up to?", "26", [["25", "code-step-mixup"], ["27", "code-step-mixup"], ["30", "code-step-mixup"]], "D = 4, O = 15, G = 7: 4 + 15 + 7 = 26."),
      t("letter-code", "Each letter moves two steps forward: A → C. How is BAG written?", "DCI", [["CBH", "code-step-mixup"], ["DCH", "code-step-mixup"], ["ECI", "code-step-mixup"]], "B → D, A → C, G → I: DCI."),
      t("letter-code", "In a code, FISH is written as HSIF. How is FROG written?", "GORF", [["FORG", "code-step-mixup"], ["GROF", "code-step-mixup"], ["ROGF", "code-step-mixup"]], "The code writes the word backwards: F R O G → G O R F."),
      t("letter-code", "In a code, RED is written as SFE. Which word is written as CMVF?", "BLUE", [["DNWG", "code-direction-mixup"], ["BLUF", "code-step-mixup"], ["ALTE", "code-step-mixup"]], "The code moves each letter one step forward, so go one step back: C → B, M → L, V → U, F → E."),
    ],
    "sq-codes-gate-pool": [
      t("letter-code", "Each letter moves one step forward. How is CAR written?", "DBS", [["BZQ", "code-direction-mixup"], ["DBR", "code-step-mixup"], ["DAS", "code-step-mixup"]], "C → D, A → B, R → S: DBS."),
      t("letter-code", "In a code, STAR is written as RATS. How is LIVE written?", "EVIL", [["ELIV", "code-step-mixup"], ["VILE", "code-step-mixup"], ["LEVI", "code-step-mixup"]], "The code writes the word backwards: L I V E → E V I L."),
      t("letter-code", "In a code, TREE is written as USFF. How is LEAF written?", "MFBG", [["KDZE", "code-direction-mixup"], ["MFBF", "code-step-mixup"], ["MEBG", "code-step-mixup"]], "Each letter moves one step forward: L → M, E → F, A → B, F → G."),
      t("letter-code", "In a code, MILK is written as LHKJ. How is RICE written?", "QHBD", [["SJDF", "code-direction-mixup"], ["QHBE", "code-step-mixup"], ["QIBD", "code-step-mixup"]], "Each letter moves one step back: R → Q, I → H, C → B, E → D."),
      t("letter-code", "Each letter moves two steps back: E → C. How is DOG written?", "BME", [["FQI", "code-direction-mixup"], ["BMF", "code-step-mixup"], ["CNF", "code-step-mixup"]], "D → B, O → M, G → E: BME."),
      t("number-code", "If A = 1, B = 2 and so on, what do the letters of BED add up to?", "11", [["10", "code-step-mixup"], ["12", "code-step-mixup"], ["9", "code-step-mixup"]], "B = 2, E = 5, D = 4: 2 + 5 + 4 = 11."),
      t("number-code", "If A = 1, B = 2 and so on, which word is 3-1-20?", "CAT", [["BAT", "code-step-mixup"], ["CAR", "code-step-mixup"], ["COT", "code-step-mixup"]], "3 = C, 1 = A, 20 = T: CAT."),
      t("number-code", "If A = 1, B = 2 and so on, which letter is number 13?", "M", [["L", "code-step-mixup"], ["N", "code-step-mixup"], ["K", "code-step-mixup"]], "M is the 13th letter (the middle of the alphabet)."),
      t("number-code", "If A = 1, B = 2 and so on, which word has the BIGGEST total?", "ZOO", [["BAD", "code-step-mixup"], ["CAB", "code-step-mixup"], ["ACE", "code-step-mixup"]], "ZOO = 26 + 15 + 15 = 56. The others are much smaller (BAD 7, CAB 6, ACE 9)."),
      t("number-code", "If ACE is written as 135 (A = 1, C = 3, E = 5), how is BAD written?", "214", [["241", "code-step-mixup"], ["124", "code-step-mixup"], ["412", "code-step-mixup"]], "B = 2, A = 1, D = 4: 214."),
      t("directions", "You face South and turn right. Which way do you face now?", "West", [["East", "direction-turn-mixup"], ["North", "direction-turn-mixup"], ["South", "direction-turn-mixup"]], "Facing South, your right hand points West."),
      t("directions", "You face West and turn left. Which way do you face now?", "South", [["North", "direction-turn-mixup"], ["East", "direction-turn-mixup"], ["West", "direction-turn-mixup"]], "Facing West, your left hand points South."),
      t("directions", "You face North and turn all the way round to face the other way. Which way do you face now?", "South", [["East", "direction-turn-mixup"], ["West", "direction-turn-mixup"], ["North", "direction-turn-mixup"]], "Half a turn from North is South."),
      t("directions", "In the evening, your shadow points east. Where is the Sun?", "In the west", [["In the east", "direction-turn-mixup"], ["In the north", "direction-turn-mixup"], ["Right overhead", "direction-turn-mixup"]], "A shadow points away from the Sun. The evening Sun is in the west."),
      t("directions", "Aman walks 4 m east, then turns left and walks 3 m. Which way is he walking now?", "North", [["South", "direction-turn-mixup"], ["West", "direction-turn-mixup"], ["East", "direction-turn-mixup"]], "Facing East, a left turn points North."),
    ],

    // ---------- Order, Time & Family ----------
    "sq-order-warmup": [
      t("ranking", "In a row of children, Meena is 3rd from the left. How many children stand to her left?", "2", [["3", "rank-count-mixup"], ["1", "rank-count-mixup"], ["4", "rank-count-mixup"]], "1st and 2nd are to her left: 2 children."),
      t("ranking", "Ravi is taller than Sam. Sam is taller than Tom. Who is the shortest?", "Tom", [["Ravi", "rank-order-mixup"], ["Sam", "rank-order-mixup"], ["They are all the same", "rank-order-mixup"]], "Ravi > Sam > Tom, so Tom is the shortest."),
      t("calendar-clock", "If today is Monday, what day will it be in 3 days?", "Thursday", [["Wednesday", "calendar-count-mixup"], ["Friday", "calendar-count-mixup"], ["Tuesday", "calendar-count-mixup"]], "Tuesday (1), Wednesday (2), Thursday (3)."),
      t("calendar-clock", "How many days does February have in a leap year?", "29", [["28", "calendar-count-mixup"], ["30", "calendar-count-mixup"], ["31", "calendar-count-mixup"]], "February has 29 days in a leap year and 28 in other years."),
      t("calendar-clock", "What time is it 2 hours after 10:00 a.m.?", "12:00 noon", [["11:00 a.m.", "clock-count-mixup"], ["12:00 midnight", "clock-count-mixup"], ["1:00 p.m.", "clock-count-mixup"]], "10 a.m. + 2 hours = 12 noon."),
      t("relations", "Your father's mother is your ___.", "grandmother", [["aunt", "relation-mixup"], ["mother", "relation-mixup"], ["sister", "relation-mixup"]], "Your father's mother is your grandmother (dadi)."),
      t("relations", "Your mother's brother is your ___.", "uncle", [["cousin", "relation-mixup"], ["father", "relation-mixup"], ["grandfather", "relation-mixup"]], "Your mother's brother is your uncle (mama)."),
      t("ranking", "In a race, Asha came 2nd. Who finished just ahead of her?", "The child who came 1st", [["The child who came 3rd", "rank-order-mixup"], ["Nobody", "rank-order-mixup"], ["The child who came last", "rank-order-mixup"]], "Only 1st place finishes ahead of 2nd."),
    ],
    "sq-order-ranking": [
      t("ranking", "Riya is 5th from the left in a row of 9 children. What is her place from the right?", "5th", [["4th", "rank-count-mixup"], ["6th", "rank-count-mixup"], ["3rd", "rank-count-mixup"]], "9 − 5 + 1 = 5. She is right in the middle."),
      t("ranking", "In a class of 30, Dev is 10th from the top. What is his place from the bottom?", "21st", [["20th", "rank-count-mixup"], ["19th", "rank-count-mixup"], ["22nd", "rank-count-mixup"]], "30 − 10 + 1 = 21."),
      t("ranking", "A is taller than B. C is taller than A. Who is the tallest?", "C", [["A", "rank-order-mixup"], ["B", "rank-order-mixup"], ["We can't tell", "rank-order-mixup"]], "C > A > B, so C is the tallest."),
      t("ranking", "Leela has more marbles than Sona, but fewer than Tina. Who has the most?", "Tina", [["Leela", "rank-order-mixup"], ["Sona", "rank-order-mixup"], ["We can't tell", "rank-order-mixup"]], "Tina > Leela > Sona."),
      t("ranking", "Five children stand in a line. Kabir is exactly in the middle. What is his place from the front?", "3rd", [["2nd", "rank-count-mixup"], ["4th", "rank-count-mixup"], ["5th", "rank-count-mixup"]], "With 5 in a line, the middle is 3rd: two in front, two behind."),
      t("ranking", "Neha is 4th from the front and 4th from the back of a queue. How many people are in the queue?", "7", [["8", "rank-count-mixup"], ["6", "rank-count-mixup"], ["9", "rank-count-mixup"]], "4 + 4 − 1 = 7 (Neha is counted twice, so take 1 away)."),
      t("ranking", "Ali is older than Ben. Ben is older than Chen. Chen is older than Dev. Who is the youngest?", "Dev", [["Chen", "rank-order-mixup"], ["Ali", "rank-order-mixup"], ["Ben", "rank-order-mixup"]], "Ali > Ben > Chen > Dev, so Dev is the youngest."),
      t("ranking", "Seven books stand on a shelf. The red book is 2nd from the right. What is its place from the left?", "6th", [["5th", "rank-count-mixup"], ["2nd", "rank-count-mixup"], ["7th", "rank-count-mixup"]], "7 − 2 + 1 = 6."),
    ],
    "sq-order-gate-pool": [
      t("ranking", "In a row of 15 children, Pooja is 6th from the left. What is her place from the right?", "10th", [["9th", "rank-count-mixup"], ["11th", "rank-count-mixup"], ["8th", "rank-count-mixup"]], "15 − 6 + 1 = 10."),
      t("ranking", "Tara is 8th from the front and 5th from the back of a queue. How many people are in the queue?", "12", [["13", "rank-count-mixup"], ["11", "rank-count-mixup"], ["14", "rank-count-mixup"]], "8 + 5 − 1 = 12."),
      t("ranking", "P is heavier than Q. R is lighter than Q. Who is the lightest?", "R", [["P", "rank-order-mixup"], ["Q", "rank-order-mixup"], ["We can't tell", "rank-order-mixup"]], "P > Q > R, so R is the lightest."),
      t("ranking", "Manu scored more than Isha but less than Kunal. Rahul scored the least. Who scored the most?", "Kunal", [["Manu", "rank-order-mixup"], ["Isha", "rank-order-mixup"], ["Rahul", "rank-order-mixup"]], "Kunal > Manu > Isha, and Rahul is last."),
      t("ranking", "Twenty children stand in a line. Sita is 1st from the back. What is her place from the front?", "20th", [["1st", "rank-count-mixup"], ["19th", "rank-count-mixup"], ["21st", "rank-count-mixup"]], "The last child from the back is the 20th from the front: 20 − 1 + 1 = 20."),
      t("calendar-clock", "If today is Wednesday, what day was it 2 days ago?", "Monday", [["Tuesday", "calendar-count-mixup"], ["Friday", "calendar-count-mixup"], ["Sunday", "calendar-count-mixup"]], "Back one day: Tuesday. Back two days: Monday."),
      t("calendar-clock", "If 1 January is a Sunday, what day is 8 January?", "Sunday", [["Monday", "calendar-count-mixup"], ["Saturday", "calendar-count-mixup"], ["Tuesday", "calendar-count-mixup"]], "Days repeat every 7: 1 + 7 = 8, so 8 January is a Sunday too."),
      t("calendar-clock", "How many minutes are there in 2 hours?", "120", [["100", "clock-count-mixup"], ["60", "clock-count-mixup"], ["200", "clock-count-mixup"]], "1 hour = 60 minutes, so 2 hours = 120 minutes."),
      t("calendar-clock", "A film starts at 4:30 p.m. and lasts 1 hour 45 minutes. When does it end?", "6:15 p.m.", [["5:15 p.m.", "clock-count-mixup"], ["6:45 p.m.", "clock-count-mixup"], ["5:75 p.m.", "clock-count-mixup"]], "4:30 + 1 hour = 5:30; + 45 minutes = 6:15 p.m."),
      t("calendar-clock", "If today is Friday, what day will it be after 10 days?", "Monday", [["Sunday", "calendar-count-mixup"], ["Tuesday", "calendar-count-mixup"], ["Thursday", "calendar-count-mixup"]], "After 7 days it is Friday again; 3 more days: Saturday, Sunday, Monday."),
      t("relations", "Your father's sister is your ___.", "aunt", [["uncle", "relation-mixup"], ["cousin", "relation-mixup"], ["niece", "relation-mixup"]], "Your father's sister is your aunt (bua)."),
      t("relations", "Your uncle's son is your ___.", "cousin", [["brother", "relation-mixup"], ["nephew", "relation-mixup"], ["uncle", "relation-mixup"]], "Your uncle's or aunt's child is your cousin."),
      t("relations", "Your mother's father is your ___.", "grandfather", [["uncle", "relation-mixup"], ["father", "relation-mixup"], ["great-grandfather", "relation-mixup"]], "Your mother's father is your grandfather (nana)."),
      t("relations", "Raj is Priya's brother. Priya is the daughter of Anu, a woman. How is Anu related to Raj?", "She is his mother.", [["She is his sister.", "relation-mixup"], ["She is his aunt.", "relation-mixup"], ["She is his grandmother.", "relation-mixup"]], "Priya and Raj are brother and sister, so Priya's mother Anu is Raj's mother too."),
      t("relations", "Your brother's daughter is your ___.", "niece", [["nephew", "relation-mixup"], ["cousin", "relation-mixup"], ["aunt", "relation-mixup"]], "A brother's or sister's daughter is your niece."),
    ],

    // ---------- Unit 6 Boss (12, Classes 3–5) ----------
    "sq-u6-test": [
      q("What comes next? 4, 8, 12, 16, ___", "20", [["18", "series-rule-mixup"], ["24", "series-rule-mixup"], ["32", "series-rule-mixup"]], "Add 4 each time: 16 + 4 = 20."),
      q("What comes next? C, F, I, L, ___", "O", [["N", "series-rule-mixup"], ["P", "series-rule-mixup"], ["M", "series-rule-mixup"]], "Jump 3 letters each time: L (12) + 3 = O (15)."),
      q("Pen is to write as knife is to ___.", "cut", [["eat", "analogy-mixup"], ["sharp", "analogy-mixup"], ["fork", "analogy-mixup"]], "We write with a pen; we cut with a knife."),
      q("Find the odd one out: apple, banana, carrot, mango", "carrot", [["apple", "odd-one-mixup"], ["banana", "odd-one-mixup"], ["mango", "odd-one-mixup"]], "Apple, banana and mango are fruits. A carrot is a vegetable."),
      q("Each letter moves one step forward. How is BUS written?", "CVT", [["ATR", "code-direction-mixup"], ["CVS", "code-step-mixup"], ["CUT", "code-step-mixup"]], "B → C, U → V, S → T: CVT."),
      q("If A = 1, B = 2 and so on, what do the letters of DAD add up to?", "9", [["8", "code-step-mixup"], ["10", "code-step-mixup"], ["7", "code-step-mixup"]], "D = 4, A = 1, D = 4: 4 + 1 + 4 = 9."),
      q("You face East and turn right. Which way do you face now?", "South", [["North", "direction-turn-mixup"], ["West", "direction-turn-mixup"], ["East", "direction-turn-mixup"]], "Facing East, your right hand points South."),
      q("In a row of 11 children, Om is 4th from the left. What is his place from the right?", "8th", [["7th", "rank-count-mixup"], ["9th", "rank-count-mixup"], ["6th", "rank-count-mixup"]], "11 − 4 + 1 = 8."),
      q("If today is Saturday, what day will it be in 4 days?", "Wednesday", [["Tuesday", "calendar-count-mixup"], ["Thursday", "calendar-count-mixup"], ["Monday", "calendar-count-mixup"]], "Sunday (1), Monday (2), Tuesday (3), Wednesday (4)."),
      q("Your father's brother is your ___.", "uncle", [["cousin", "relation-mixup"], ["nephew", "relation-mixup"], ["grandfather", "relation-mixup"]], "Your father's brother is your uncle (chacha or tau)."),
      q("Find the missing number: 5, 10, ___, 20, 25", "15", [["12", "series-rule-mixup"], ["18", "series-rule-mixup"], ["16", "series-rule-mixup"]], "Add 5 each time: 10 + 5 = 15."),
      q("Gita is taller than Hema. Hema is taller than Ira. Which is TRUE?", "Gita is taller than Ira.", [["Ira is taller than Gita.", "rank-order-mixup"], ["Hema is the tallest.", "rank-order-mixup"], ["Ira is taller than Hema.", "rank-order-mixup"]], "Gita > Hema > Ira, so Gita is taller than Ira."),
    ],
  },

  nodes: [
    u6,
    patterns,
    forGrades(withSubtopic(practice("sq-patterns-p1", patterns, 1, "Series Spotter", "medium", [quiz("sq-patterns-series")]), "number-series"), C345),
    forGrades(gate("sq-patterns-gate", patterns, "Patterns Challenge", "sq-patterns-gate-pool", {
      "number-series": "Number series",
      "letter-series": "Letter series",
      "analogy-odd": "Analogies and odd one out",
    }), C345),
    forGrades(endless(patterns), C345),

    codes,
    forGrades(withSubtopic(practice("sq-codes-p1", codes, 1, "Secret Codes", "medium", [quiz("sq-codes-secret")]), "letter-code"), C345),
    forGrades(gate("sq-codes-gate", codes, "Codes Challenge", "sq-codes-gate-pool", {
      "letter-code": "Letter codes",
      "number-code": "Number codes",
      directions: "Directions",
    }), C345),
    forGrades(endless(codes), C345),

    order,
    forGrades(withSubtopic(practice("sq-order-p1", order, 1, "Who's First?", "medium", [quiz("sq-order-ranking")]), "ranking"), C345),
    forGrades(gate("sq-order-gate", order, "Order & Time Challenge", "sq-order-gate-pool", {
      ranking: "Places in a row",
      "calendar-clock": "Days and clocks",
      relations: "Family words",
    }), C345),
    forGrades(endless(order), C345),

    forGrades(boss("sq-u6-boss", u6.id, "Patterns & Puzzles Boss", "sq-u6-test", "Dr. Bio-Mixer has scrambled every code, mixed up the calendar and spun the compass! Crack the patterns and puzzles to put things back in order."), C345),
  ],
};

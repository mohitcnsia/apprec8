// data/wordBankQuestData.js
// "Treasure Words" quest (owner 2026-11-04; id stays "word-bank"): the owner's 370 vocabulary words (data/wordPower/wordBank.js, the same words as
// the Word Builder game) as its own quest, one topic per word group (a ladder: each topic opens the next):
//   Learn page (word + meaning) → quiz "Which word means …?" (built from the owner's meanings, wrong options = other words
//   of the same group) → ♾️ endless practice (wordMeaning generator, utils/generators.js).
// Unit 1 Everyday Words: Class 1–4 (hidden for Class 5+). Unit 2 Big Words: Class 4–10.

import { study, quiz, unit, main, endless, forGrades } from "./englishQuest/helpers.js";
import { WORD_BANK } from "./wordPower/wordBank.js";
import { meaningQuestions } from "../utils/generators.js";
import { seededRandom } from "../utils/readingFlow.js";
import { wordCards } from "../utils/learnCards.js";

export const QUEST_ID = "word-bank";

export const quest = {
  title: "Treasure Words",
  description: "Every word is a treasure! Learn hundreds of new words and what they mean. Collect them all! 💎",
  image: null,
  version: 1,
  draft: false,
};

export const tile = {
  title: "Treasure Words",
  type: "QUEST",
  carouselGroup: "quest",
  order: 3,
  image: null,
  questId: QUEST_ID,
  description: "Collect new words and their meanings 💎",
};


// Word ladder (spec S, owner 2026-11-05: "start easy, build up"; re-locking finished topics is fine: "she is quick").
// Big Words groups from easiest to hardest, and inside each group the easiest words first (Claude's judgement of how
// often a Class 4–6 child meets the word). Class 4 sees only the first two Big Words groups.
const BIG_ORDER = {
  "wp-bank-more-actions-qualities": "hesitate occupy purify dominate moderate wrench accomplishment recipient evacuate elaborate reliant revert reenact dispel bearing inducted assuredly underwhelming convergent temerity",
  "wp-bank-importance-method": "annually grumble crucial beneficial favourable seldom moderately utmost unknowingly potent superficial emphatic avidly unaccountably candidness innate latent intrinsic penultimate germane",
  "wp-bank-speaking-size": "immense colossal scarce sufficient abundant ample minuscule taper shrilly eloquence affluence wrangle terse dearth raucous clamorous strident verbose vociferous inarticulateness",
  "wp-bank-describing-effort": "magnificent marvellous hideous bizarre thrive pursue lavish gruesome dawdle initiate flourishing diligently pathetic ominous sophisticated meticulous frivolous ritzy prosaic sedulous",
  "wp-bank-feelings-quality": "dreadful flaw flimsy crude woe agitated hysterical blemish bogus loathe refurbish impeccable prestigious creditable disreputable apathy morose rapturous euphoric poignant",
  "wp-bank-actions-change": "flicker bouquet rehearse neglect remedy employ pioneer totter ambush smother waver brandish empathy bias fiasco vicinity conspicuous appall abide audacity",
  "wp-bank-actions-states-of-being": "dare nimble transparent reputation sieve contented illiterate retractable protrude placid prone exhilarate exhilaration gallantry enmity prudent appraisal impetuous pseudonym cerebral",
  "wp-bank-thinking-situations": "baffled hectic frenzy catastrophe unconscious ignorance apparent inevitable obscure perplex turbulent stagnant tentative juncture concurrent arbitrary ascertain acumen erudite benighted",
  "wp-bank-conflict-qualities": "soothe trigger eliminate tolerance lash compulsory rebuke fend surpassed exhaustive exhilarating steadfast erratic rebuff entreat apprehension relinquish afflict coerce corpulent",
  "wp-bank-final-words": "uprooted relished frolicking fretting splurging eludes adversely embellishments mitigation anhydrous",
  "wp-bank-character-action": "cunning coax hinder naive entice virtuous righteous pompous fanatic aggravate benevolent callous impede thwart incite alleviate allay dauntless wheedle philanthropist",
  "wp-bank-groups-behaviors": "acquaintance quirky whimsical assertive self-sufficient proficient congregation tenacious segregate collate reconciliation correlation diffident bombastic bevy connote amalgamate consortium urbane pernicious",
  "wp-bank-details-consequences": "excursion brisk insulate versatile vulnerable obnoxious atrocious acclaim embellished loathsome enigmatic detrimental remuneration capricious convoluted caliber minutiae protean pertinacious appertain",
};
const BIG_IDS = Object.keys(BIG_ORDER);
const CLASS4_BIG = BIG_IDS.slice(0, 2);

/** The owner's groups in ladder order, words easiest first (any word or group not listed keeps its place at the end). */
export function ladderGroups(bank = WORD_BANK) {
  const rank = (id) => (BIG_IDS.includes(id) ? BIG_IDS.indexOf(id) : 999);
  const everyday = bank.filter((g) => g.everyday);
  const big = bank.filter((g) => !g.everyday).sort((a, b) => rank(a.id) - rank(b.id));
  return [
    ...everyday,
    ...big.map((g) => {
      const list = (BIG_ORDER[g.id] || "").split(" ");
      const pos = (w) => (list.includes(w.word) ? list.indexOf(w.word) : 999);
      return { ...g, words: [...g.words].sort((a, b) => pos(a) - pos(b)) };
    }),
  ];
}

const EVERYDAY = [1, 2, 3, 4];
const BIG = [4, 5, 6, 7, 8, 9, 10];

export const studyPages = {};
export const quizzes = {};
export const readings = {};
export const wordTables = {};

const u1 = forGrades(unit("wb-u1", 1, "Everyday Words"), EVERYDAY);
const u2 = forGrades(unit("wb-u2", 2, "Big Words"), BIG);
const topicNodes = [];
let order1 = 0;
let order2 = 0;

for (const g of ladderGroups()) {
  const id = g.id.replace(/^wp-bank-/, "wb-");
  const learnId = `${id}-study`;
  const quizId = `${id}-quiz`;
  const tableId = `${id}-table`;
  studyPages[learnId] = {
    name: g.name,
    author: "Apprec8",
    content:
      `### 📖 ${g.name}: ${g.words.length} words\n\nRead each word and its meaning. Say the word out loud, then try to use it in a sentence of your own!\n\n` +
      `| Word | Meaning |\n|---|---|\n` +
      g.words.map((w) => `| **${w.word}** | ${w.meaning.replace(/\|/g, "/")} |`).join("\n") +
      `\n\n> 💡 **Tip:** Cover the meanings with your hand and test yourself. Then take the quiz!`,
    // Learn cards (spec R): one flip card per word, a quick check after every 4. The table stays as "See everything".
    cards: wordCards(g.words, { key: learnId }),
  };
  wordTables[tableId] = { name: `${g.name} words`, tableType: "wordMeaning", entries: g.words };
  // Fixed quiz from the same generator, with a seeded order so it never changes between seeds (question ids are positions).
  quizzes[quizId] = meaningQuestions(g.words, seededRandom(quizId)).map(({ id: _id, generated, generator, ...q }) => q);
  const grades = g.everyday ? EVERYDAY : CLASS4_BIG.includes(g.id) ? BIG : BIG.filter((x) => x >= 5);
  const u = g.everyday ? u1 : u2;
  const branchOrder = g.everyday ? ++order1 : ++order2;
  const topic = forGrades(main(id, u.id, branchOrder, g.name, [study(learnId), quiz(quizId)]), grades);
  topicNodes.push(topic, forGrades(endless(topic, [{ type: "wordMeaning", table: tableId }]), grades));
}

export const nodes = [u1, u2, ...topicNodes];

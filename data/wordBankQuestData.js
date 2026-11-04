// data/wordBankQuestData.js
// "Word Bank" quest (owner 2026-11-04): the owner's 370 vocabulary words (data/wordPower/wordBank.js, the same words as
// the Word Builder game) as a quest that is open from day one. One topic per word group:
//   Learn page (word + meaning) → quiz "Which word means …?" (built from the owner's meanings, wrong options = other words
//   of the same group) → ♾️ endless practice (wordMeaning generator, utils/generators.js).
// Unit 1 Everyday Words: Class 1–4 (hidden for Class 5+). Unit 2 Big Words: Class 4–10.

import { study, quiz, unit, main, endless, forGrades } from "./englishQuest/helpers.js";
import { WORD_BANK } from "./wordPower/wordBank.js";
import { meaningQuestions } from "../utils/generators.js";
import { seededRandom } from "../utils/readingFlow.js";

export const QUEST_ID = "word-bank";

export const quest = {
  title: "Word Bank",
  description: "Learn hundreds of new words: what they mean and how to use them. Collect them all!",
  image: null,
  version: 1,
  draft: false,
};

export const tile = {
  title: "Word Bank",
  type: "QUEST",
  carouselGroup: "quest",
  order: 3,
  image: null,
  questId: QUEST_ID,
  description: "New words and their meanings",
};

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

for (const g of WORD_BANK) {
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
  };
  wordTables[tableId] = { name: `${g.name} words`, tableType: "wordMeaning", entries: g.words };
  // Fixed quiz from the same generator, with a seeded order so it never changes between seeds (question ids are positions).
  quizzes[quizId] = meaningQuestions(g.words, seededRandom(quizId)).map(({ id: _id, generated, generator, ...q }) => q);
  const grades = g.everyday ? EVERYDAY : BIG;
  const u = g.everyday ? u1 : u2;
  const branchOrder = g.everyday ? ++order1 : ++order2;
  const topic = forGrades(main(id, u.id, branchOrder, g.name, [study(learnId), quiz(quizId)]), grades);
  topicNodes.push(topic, forGrades(endless(topic, [{ type: "wordMeaning", table: tableId }]), grades));
}

export const nodes = [u1, u2, ...topicNodes];

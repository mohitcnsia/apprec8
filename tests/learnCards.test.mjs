// tests/learnCards.test.mjs — Learn cards (utils/learnCards.js) and the card content in the quests
import assert from "node:assert/strict";
import { learnCards, checkOptions, cardSpeech, allSeen, nextStepId, tryLabel, wordCards } from "../utils/learnCards.js";
import { QUESTS } from "../data/quests/index.js";

// cleaning: bad cards dropped, no cards → null (old page)
assert.equal(learnCards({ content: "x" }), null);
assert.equal(learnCards({ cards: [{ kind: "idea", title: "" }] }), null);
const cards = learnCards({
  cards: [
    { emoji: "👯", title: "Word twins", text: "Same meaning.", examples: ["big = large", ""] },
    { question: "Twin of shut?", answer: "close", wrong: ["open", "shout"] },
    { word: "dawdle", meaning: "to be slow" },
    { kind: "check", question: "no options", answer: "a", wrong: [] },
  ],
});
assert.deepEqual(cards.map((c) => c.kind), ["idea", "check", "word"]);
assert.deepEqual(cards[0].examples, ["big = large"]);

// check options: all there, stable
assert.deepEqual(checkOptions(cards[1], "k").slice().sort(), ["close", "open", "shout"]);
assert.deepEqual(checkOptions(cards[1], "k"), checkOptions(cards[1], "k"));

// speech
assert.match(cardSpeech(cards[0]), /big means the same as large/);
assert.match(cardSpeech(cards[2]), /dawdle\. It means: to be slow/);

// done only when every card was seen (skipping to the quiz doesn't finish the Learn step)
assert.equal(allSeen([0, 1], 3), false);
assert.equal(allSeen(new Set([0, 1, 2]), 3), true);
assert.equal(allSeen([], 0), false);

assert.equal(nextStepId("wp-synant__0"), "wp-synant__1");
assert.equal(nextStepId("bad"), null);
assert.equal(tryLabel(8), "TRY 8 QUESTIONS ▶");
assert.equal(tryLabel(undefined), "TRY THE QUIZ ▶");

// Treasure Words: a word card per word, a check after every 4, its answer among those 4 words, 3 different wrong words
const words = ["ant", "bee", "cat", "dog", "eel", "fox", "gnu", "hen", "ibis"].map((w) => ({ word: w, meaning: `🐾 the ${w} animal` }));
const wc = wordCards(words, { key: "t" });
assert.equal(wc.filter((c) => c.kind === "word").length, 9);
assert.equal(wc.filter((c) => c.kind === "check").length, 2);
assert.equal(wc[0].emoji, "🐾");
assert.equal(wc[0].meaning, "the ant animal");
wc.forEach((c, i) => {
  if (c.kind !== "check") return;
  const recent = wc.slice(Math.max(0, i - 4), i).map((x) => x.word);
  assert.ok(recent.includes(c.answer), "the check asks about a word just learned");
  assert.equal(new Set([c.answer, ...c.wrong]).size, 4);
  assert.ok(c.question.includes(`the ${c.answer} animal`));
});

// Every quest page with cards: cards are valid, check answers not among the wrong options, short idea text
for (const quest of QUESTS) {
  for (const [id, page] of Object.entries(quest.studyPages || {})) {
    if (!page.cards) continue;
    const clean = learnCards(page);
    assert.ok(clean && clean.length === page.cards.length, `${id}: every card valid`);
    for (const c of clean) {
      if (c.kind === "check") assert.ok(!c.wrong.includes(c.answer), `${id}: "${c.question}" answer also a wrong option`);
      if (c.kind === "idea") assert.ok(c.text.split(/\s+/).length <= 40, `${id}: "${c.title}" is over 40 words`);
    }
    assert.ok(clean.length >= 3, `${id}: at least 3 cards`);
  }
}

console.log("learnCards tests passed");

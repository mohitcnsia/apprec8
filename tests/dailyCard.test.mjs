// Tests for utils/dailyCard.js (word and fact of the day on the kid's Home). Run: npm test
import assert from "node:assert/strict";
import {
  dayNumber,
  pickForDay,
  learnCardsFor,
  toWords,
  toScienceFacts,
  toSpaceFacts,
  factSourceFor,
  dailyCardFor,
  pruneSaved,
  recordTap,
} from "../utils/dailyCard.js";
import { nodesForGrade } from "../utils/gradeFilter.js";
import * as WordBank from "../data/wordBankQuestData.js";
import * as Science from "../data/scienceQuestData.js";
import spaceData from "../data/space_olympiad_data.json" with { type: "json" };

// Day number changes at local midnight, not before.
const d1 = new Date(2026, 10, 11, 0, 1).getTime();
const d2 = new Date(2026, 10, 11, 23, 59).getTime();
const d3 = new Date(2026, 10, 12, 0, 1).getTime();
assert.equal(dayNumber(d1), dayNumber(d2));
assert.equal(dayNumber(d3), dayNumber(d1) + 1);

// The whole list is used before anything repeats, and the same day always gives the same item.
const list = ["a", "b", "c", "d", "e"];
const seen = new Set();
for (let day = 100; day < 105; day++) seen.add(pickForDay(list, day, "k"));
assert.equal(seen.size, 5);
assert.equal(pickForDay(list, 100, "k"), pickForDay(list, 105, "k"));
assert.equal(pickForDay([], 1, "k"), null);

// Real content: every class has words; facts by class band.
const words = (g) => toWords(learnCardsFor(WordBank, g, nodesForGrade));
const sci = (g) => toScienceFacts(learnCardsFor(Science, g, nodesForGrade));
const space = toSpaceFacts(spaceData);
for (let g = 1; g <= 10; g++) assert.ok(words(g).length >= 100, `Class ${g} has words`);
for (const g of [3, 4, 5]) assert.ok(sci(g).length >= 20, `Class ${g} has science facts`);
assert.ok(space.length >= 100, "Space quest gives 100+ facts");
assert.ok(words(3).every((w) => w.word && w.meaning), "every word has a meaning");
assert.ok(sci(5).every((f) => f.text), "every science fact has text");
assert.equal(new Set(space.map((f) => f.text)).size, space.length, "no duplicate space facts");
assert.ok(space.every((f) => f.image === null || f.image.startsWith("https://cdn.jsdelivr.net/gh/mohitcnsia/images@main/")), "images only from our repo");

assert.equal(factSourceFor(1), null);
assert.equal(factSourceFor(2), null);
assert.equal(factSourceFor(3), "science");
assert.equal(factSourceFor(5), "science");
assert.equal(factSourceFor(6), "space");
assert.equal(factSourceFor(10), "space");
assert.equal(factSourceFor(null), null);

// Classmates get the same card on the same day; Class 2 gets a word and no fact.
const args = (g) => ({ grade: g, now: d1, words: words(g), scienceFacts: sci(g), spaceFacts: space });
assert.deepEqual(dailyCardFor(args(10)), dailyCardFor(args(10)));
const c2 = dailyCardFor(args(2));
assert.ok(c2.word && c2.fact === null);
const c10 = dailyCardFor(args(10));
assert.ok(c10.word && c10.fact && space.includes(c10.fact));
assert.notDeepEqual(dailyCardFor({ ...args(10), now: d3 }).word, c10.word);

// Saved state: taps kept 14 days, "new for me" words listed once, "knew it" removes it.
const w = { word: "diligently", meaning: "Doing something in a careful way that shows effort." };
let s = recordTap(null, 500, "word", "new", w);
assert.equal(s.newWords.length, 1);
s = recordTap(s, 500, "word", "new", w);
assert.equal(s.newWords.length, 1);
s = recordTap(s, 500, "fact", "knew");
assert.deepEqual(s.taps[500], { word: "new", fact: "knew" });
s = recordTap(s, 500, "word", "knew", w);
assert.equal(s.newWords.length, 0);
assert.deepEqual(Object.keys(pruneSaved({ taps: { 480: {}, 499: {} } }, 500).taps), ["499"]);
assert.equal(pruneSaved({ closedDay: 500 }, 500).closedDay, 500);
assert.equal(pruneSaved("junk", 500).closedDay, null);

console.log("dailyCard tests passed");

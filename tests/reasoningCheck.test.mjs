// tests/reasoningCheck.test.mjs — recomputes the answers of Science Unit 6 (Patterns & Puzzles) so a typo can't ship.
import assert from "node:assert/strict";
import U from "../data/scienceQuest/units/u6.js";

const all = Object.values(U.quizzes).flat();
const answerOf = (start) => {
  const hit = all.filter((x) => x.question.content.startsWith(start));
  assert.equal(hit.length, 1, `exactly one question starts with: ${start}`);
  return hit[0].answer;
};
const shift = (w, n) => [...w].map((c) => String.fromCharCode(((c.charCodeAt(0) - 65 + n + 26) % 26) + 65)).join("");
const rev = (w) => [...w].reverse().join("");
const sum = (w) => [...w].reduce((a, c) => a + c.charCodeAt(0) - 64, 0);
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayAfter = (d, n) => DAYS[(DAYS.indexOf(d) + n + 70) % 7];
const fromOtherEnd = (total, pos) => total - pos + 1;
const ord = (n) => n + (n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th");

// Letter codes
assert.equal(answerOf("In a code, CAT is written as DBU"), shift("DOG", 1));
assert.equal(answerOf("In a code, BOOK is written as KOOB"), rev("DESK"));
assert.equal(answerOf("Each letter moves one step back: B → A. How is HOT"), shift("HOT", -1));
assert.equal(answerOf("In a code, SUN is written as TVO"), shift("MOON", 1));
assert.equal(answerOf("In a code, PEN is written as NEP"), rev("CUP"));
assert.equal(answerOf("Each letter moves two steps forward"), shift("BAG", 2));
assert.equal(answerOf("In a code, FISH is written as HSIF"), rev("FROG"));
assert.equal(answerOf("In a code, RED is written as SFE"), shift("CMVF", -1));
assert.equal(answerOf("Each letter moves one step forward. How is CAR"), shift("CAR", 1));
assert.equal(answerOf("In a code, STAR is written as RATS"), rev("LIVE"));
assert.equal(answerOf("In a code, TREE is written as USFF"), shift("LEAF", 1));
assert.equal(answerOf("In a code, MILK is written as LHKJ"), shift("RICE", -1));
assert.equal(answerOf("Each letter moves two steps back"), shift("DOG", -2));
assert.equal(answerOf("Each letter moves one step forward. How is BUS"), shift("BUS", 1));
assert.equal(shift("SUN", 1), "TVO"); assert.equal(shift("RED", 1), "SFE"); assert.equal(shift("TREE", 1), "USFF"); assert.equal(shift("MILK", -1), "LHKJ");

// Number codes
assert.equal(answerOf("If A = 1, B = 2, C = 3 and so on, what do the letters of CAB"), String(sum("CAB")));
assert.equal(answerOf("If A = 1, B = 2 and so on, CAT adds up to 24"), String(sum("DOG")));
assert.equal(sum("CAT"), 24);
assert.equal(answerOf("If A = 1, B = 2 and so on, what do the letters of BED"), String(sum("BED")));
assert.equal(answerOf("If A = 1, B = 2 and so on, what do the letters of DAD"), String(sum("DAD")));
assert.equal(String.fromCharCode(64 + 13), answerOf("If A = 1, B = 2 and so on, which letter is number 13"));
assert.ok(sum("ZOO") > Math.max(sum("BAD"), sum("CAB"), sum("ACE")));
assert.equal(answerOf("If A = 1, B = 2 and so on, which word is 8, 5, 14"), [8, 5, 14].map((n) => String.fromCharCode(64 + n)).join(""));
assert.equal(answerOf("If A = 1, B = 2 and so on, which word is 3-1-20"), [3, 1, 20].map((n) => String.fromCharCode(64 + n)).join(""));
assert.equal(answerOf("In a code, 1 = A, 2 = B"), [2, 1, 4].map((n) => String.fromCharCode(64 + n)).join(""));

// Ranking
assert.equal(answerOf("Riya is 5th from the left in a row of 9"), ord(fromOtherEnd(9, 5)));
assert.equal(answerOf("In a class of 30, Dev is 10th"), ord(fromOtherEnd(30, 10)));
assert.equal(answerOf("Seven books stand on a shelf"), ord(fromOtherEnd(7, 2)));
assert.equal(answerOf("In a row of 15 children, Pooja"), ord(fromOtherEnd(15, 6)));
assert.equal(answerOf("Twenty children stand in a line"), ord(fromOtherEnd(20, 1)));
assert.equal(answerOf("In a row of 11 children, Om"), ord(fromOtherEnd(11, 4)));
assert.equal(answerOf("Neha is 4th from the front and 4th"), String(4 + 4 - 1));
assert.equal(answerOf("Tara is 8th from the front and 5th"), String(8 + 5 - 1));

// Days and clocks
assert.equal(answerOf("If today is Monday, what day will it be in 3 days"), dayAfter("Monday", 3));
assert.equal(answerOf("If today is Wednesday, what day was it 2 days ago"), dayAfter("Wednesday", -2));
assert.equal(answerOf("If 1 January is a Sunday"), dayAfter("Sunday", 7));
assert.equal(answerOf("If today is Friday, what day will it be after 10 days"), dayAfter("Friday", 10));
assert.equal(answerOf("If today is Saturday, what day will it be in 4 days"), dayAfter("Saturday", 4));
{ const end = 16 * 60 + 30 + 105; assert.equal(answerOf("A film starts at 4:30 p.m."), `${Math.floor(end / 60) - 12}:${String(end % 60).padStart(2, "0")} p.m.`); }

// Series (next term)
assert.equal(answerOf("What comes next? 2, 6, 18, 54"), String(54 * 3));
assert.equal(answerOf("What comes next? 2, 5, 10, 17, 26"), String(26 + 11));
assert.equal(answerOf("What comes next? 1, 2, 4, 7, 11"), String(11 + 5));
assert.equal(answerOf("What comes next? A, B, D, G, K"), String.fromCharCode(64 + 11 + 5));
assert.equal(answerOf("What comes next? C, F, I, L"), String.fromCharCode(64 + 12 + 3));

// Every option list: 4 options, all different, exactly one correct
for (const x of all) {
  assert.equal(x.options.length, 4, x.question.content);
  assert.equal(new Set(x.options.map((o) => o.content)).size, 4, x.question.content);
  assert.equal(x.options.filter((o) => o.isCorrect).length, 1, x.question.content);
}
console.log("reasoningCheck: all answers recomputed and match");

// tests/wordDetails.test.mjs
// Verification suite for Task G111 Step 1: Word Power dictionary metadata and group stories.

import assert from "node:assert/strict";
import { WORD_BANK } from "../data/wordPower/wordBank.js";
import { WORD_DETAILS, GROUP_STORIES } from "../data/wordPower/wordDetails.js";

console.log("Running Word Power details & stories tests...");

// 1. Group count and total word inventory check
assert.equal(WORD_BANK.length, 17, "Expected exactly 17 groups in WORD_BANK");
const allBankWords = [];
for (const group of WORD_BANK) {
  for (const wObj of group.words) {
    allBankWords.push({ word: wObj.word, groupId: group.id, groupName: group.name });
  }
}
assert.equal(allBankWords.length, 370, "Expected exactly 370 words in WORD_BANK");

// 2. Details coverage and constraint checks
let synonymCount = 0;
let antonymCount = 0;
let bothCount = 0;

for (const { word, groupId } of allBankWords) {
  const details = WORD_DETAILS[word];
  assert.ok(details, `Missing details entry for word "${word}" in ${groupId}`);

  // Example sentence check
  assert.equal(typeof details.example, "string", `Word "${word}" example must be a string`);
  assert.ok(details.example.trim().length > 10, `Word "${word}" example too short`);
  const wordInExample = details.example.toLowerCase().includes(word.toLowerCase());
  assert.ok(wordInExample, `Word "${word}" must appear inside its example sentence: "${details.example}"`);

  // Synonym check
  if (details.synonym !== null) {
    assert.equal(typeof details.synonym, "string", `Word "${word}" synonym must be string or null`);
    assert.notEqual(
      details.synonym.toLowerCase(),
      word.toLowerCase(),
      `Word "${word}" synonym cannot be the word itself`
    );
    synonymCount++;
  }

  // Antonym check
  if (details.antonym !== null) {
    assert.equal(typeof details.antonym, "string", `Word "${word}" antonym must be string or null`);
    assert.notEqual(
      details.antonym.toLowerCase(),
      word.toLowerCase(),
      `Word "${word}" antonym cannot be the word itself`
    );
    antonymCount++;
  }

  // Mutual exclusion check
  if (details.synonym !== null && details.antonym !== null) {
    assert.notEqual(
      details.synonym.toLowerCase(),
      details.antonym.toLowerCase(),
      `Word "${word}" synonym and antonym cannot be the same: "${details.synonym}"`
    );
    bothCount++;
  }

  // Confusables check
  assert.ok(Array.isArray(details.confusable), `Word "${word}" confusables must be an array`);
  assert.equal(details.confusable.length, 2, `Word "${word}" must have exactly 2 confusables`);
  assert.equal(typeof details.confusable[0], "string");
  assert.equal(typeof details.confusable[1], "string");
  assert.notEqual(
    details.confusable[0].toLowerCase(),
    details.confusable[1].toLowerCase(),
    `Word "${word}" confusables must be distinct`
  );
}

console.log(
  `✓ All 370 words verified (Synonyms: ${synonymCount}, Antonyms: ${antonymCount}, Both: ${bothCount})`
);

// 3. Group stories check
for (const group of WORD_BANK) {
  const story = GROUP_STORIES[group.id];
  assert.ok(story, `Missing story for group "${group.id}"`);
  assert.ok(story.title && story.title.trim().length > 0, `Group "${group.id}" story missing title`);
  assert.ok(story.text && story.text.trim().length > 0, `Group "${group.id}" story missing text`);

  // Word count between 120 and 180 words
  const words = story.text.trim().split(/\s+/);
  assert.ok(
    words.length >= 120 && words.length <= 180,
    `Group "${group.id}" story word count (${words.length}) must be between 120 and 180`
  );

  // Target words check (at least 8 words from this group)
  assert.ok(Array.isArray(story.targetWords), `Group "${group.id}" targetWords must be array`);
  assert.ok(
    story.targetWords.length >= 8,
    `Group "${group.id}" must use >= 8 words (found ${story.targetWords.length})`
  );

  const groupWordSet = new Set(group.words.map((w) => w.word.toLowerCase()));
  const storyLower = story.text.toLowerCase();

  for (const tw of story.targetWords) {
    assert.ok(
      groupWordSet.has(tw.toLowerCase()),
      `Target word "${tw}" in story does not belong to group "${group.id}"`
    );
    assert.ok(
      storyLower.includes(tw.toLowerCase()),
      `Target word "${tw}" must appear in story text for group "${group.id}"`
    );
  }
}

console.log(`✓ All 17 group stories verified (120-180 words, >= 8 group words each)`);
console.log("wordDetails tests passed 100%!");

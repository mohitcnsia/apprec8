// tests/ieoExamWords.test.mjs
import assert from "node:assert/strict";
import { IEO_EXAM_WORDS } from "../data/wordPower/ieoExamWords.js";

console.log("Running IEO Exam Words verification test...");

const entries = Object.entries(IEO_EXAM_WORDS);
assert.equal(entries.length, 66, "Expected exactly 66 extracted IEO exam words");

for (const [key, details] of entries) {
  assert.equal(key, key.toLowerCase(), `Word key '${key}' must be lowercase`);
  assert.ok(details.meaning && details.meaning.trim().length > 10, `'${key}' must have a descriptive meaning`);
  assert.ok(details.example && details.example.trim().length > 15, `'${key}' must have a descriptive example`);
  
  // Verify example contains the word (handling case and suffixes like -ed, -ing, -ly, -s)
  const baseStem = key.slice(0, Math.min(key.length, 4));
  const exampleLower = details.example.toLowerCase();
  assert.ok(
    exampleLower.includes(key) || exampleLower.includes(baseStem),
    `Example for '${key}' must contain the word: "${details.example}"`
  );

  // Synonym checks
  if (details.synonym) {
    assert.notEqual(
      details.synonym.toLowerCase(),
      key.toLowerCase(),
      `Synonym for '${key}' cannot be identical to the word`
    );
  }

  // Antonym checks
  if (details.antonym) {
    assert.notEqual(
      details.antonym.toLowerCase(),
      key.toLowerCase(),
      `Antonym for '${key}' cannot be identical to the word`
    );
    if (details.synonym) {
      assert.notEqual(
        details.antonym.toLowerCase(),
        details.synonym.toLowerCase(),
        `Antonym and synonym for '${key}' cannot be identical`
      );
    }
  }

  // Confusables checks
  assert.ok(
    Array.isArray(details.confusable) && details.confusable.length === 2,
    `Word '${key}' must have exactly 2 confusables`
  );
  assert.notEqual(
    details.confusable[0],
    details.confusable[1],
    `Confusables for '${key}' must be distinct: ${details.confusable}`
  );
  assert.notEqual(
    details.confusable[0].toLowerCase(),
    key.toLowerCase(),
    `Confusable for '${key}' cannot be the word itself`
  );
  assert.notEqual(
    details.confusable[1].toLowerCase(),
    key.toLowerCase(),
    `Confusable for '${key}' cannot be the word itself`
  );

  // Paper attribution
  assert.ok(details.paper && details.paper.length > 5, `'${key}' must have paper attribution`);
}

console.log(`✓ All 66 IEO exam words verified!`);

// tests/whyNot.test.mjs
// Tests for utils/whyNot.js ("Why not this option?" helper, G82).

import assert from "node:assert/strict";
import {
  formatWhyNotHeading,
  formatWhyNotOtherLine,
  hasAnyWhys,
  getWhyNotFeedback,
  buildOthersSpeechText,
} from "../utils/whyNot.js";

// Sample question with whys on some wrong options
const qWithWhys = {
  question: { content: "Complete: 'She ___ in Pune since 2019.'" },
  answer: "has lived",
  explanation: { text: "SINCE + point in time reaching now requires present perfect (has lived)." },
  options: [
    { content: "has lived", isCorrect: true },
    {
      content: "lives",
      isCorrect: false,
      mistakeTag: "tense-mixup",
      why: "Simple present means a general fact or regular habit, not continuing since 2019.",
    },
    {
      content: "lived",
      isCorrect: false,
      mistakeTag: "tense-mixup",
      why: "Simple past is for finished actions in the past; she still lives there now.",
    },
    {
      content: "is living",
      isCorrect: false,
      mistakeTag: "tense-mixup",
      // intentionally no why to test omission
    },
  ],
};

// Question without any whys (legacy/unannotated)
const qWithoutWhys = {
  question: { content: "Pick the noun." },
  answer: "tree",
  explanation: { text: "Tree is a naming word." },
  options: [
    { content: "tree", isCorrect: true },
    { content: "run", isCorrect: false },
    { content: "fast", isCorrect: false },
  ],
};

// 1. Formatting helpers
assert.equal(formatWhyNotHeading("lives"), "Why not 'lives'?");
assert.equal(formatWhyNotHeading(null), null);
assert.equal(formatWhyNotHeading(""), null);

assert.equal(
  formatWhyNotOtherLine("lives", "Simple present means a habit."),
  "'lives': Simple present means a habit."
);
assert.equal(formatWhyNotOtherLine("lives", null), null);
assert.equal(formatWhyNotOtherLine(null, "some why"), null);

// 2. hasAnyWhys
assert.equal(hasAnyWhys(qWithWhys), true);
assert.equal(hasAnyWhys(qWithoutWhys), false);
assert.equal(hasAnyWhys(null), false);
assert.equal(hasAnyWhys({ options: [] }), false);

// 3. Wrong answer with `why`
{
  const fb = getWhyNotFeedback({
    question: qWithWhys,
    chosen: "lives",
  });

  assert.equal(fb.isCorrect, false);
  assert.notEqual(fb.wrongWhy, null);
  assert.equal(fb.wrongWhy.heading, "Why not 'lives'?");
  assert.equal(
    fb.wrongWhy.why,
    "Simple present means a general fact or regular habit, not continuing since 2019."
  );
  assert.equal(fb.wrongWhy.option, "lives");
  assert.deepEqual(fb.otherWhys, []);
  assert.equal(
    fb.speechText,
    "Why not lives? Simple present means a general fact or regular habit, not continuing since 2019.. SINCE + point in time reaching now requires present perfect (has lived)."
  );
}

// 4. Wrong answer on an option WITHOUT `why`
{
  const fb = getWhyNotFeedback({
    question: qWithWhys,
    chosen: "is living",
  });

  assert.equal(fb.isCorrect, false);
  assert.equal(fb.wrongWhy, null);
  assert.deepEqual(fb.otherWhys, []);
  assert.equal(
    fb.speechText,
    "SINCE + point in time reaching now requires present perfect (has lived)."
  );
}

// 5. Wrong answer on legacy question with no whys
{
  const fb = getWhyNotFeedback({
    question: qWithoutWhys,
    chosen: "run",
  });

  assert.equal(fb.isCorrect, false);
  assert.equal(fb.wrongWhy, null);
  assert.deepEqual(fb.otherWhys, []);
  assert.equal(fb.speechText, "Tree is a naming word.");
}

// 6. Right answer with wrong options that have whys
{
  const fb = getWhyNotFeedback({
    question: qWithWhys,
    chosen: "has lived",
  });

  assert.equal(fb.isCorrect, true);
  assert.equal(fb.wrongWhy, null);
  // Options without why ("is living") must be excluded
  assert.equal(fb.otherWhys.length, 2);
  assert.equal(fb.otherWhys[0].option, "lives");
  assert.equal(
    fb.otherWhys[0].line,
    "'lives': Simple present means a general fact or regular habit, not continuing since 2019."
  );
  assert.equal(fb.otherWhys[1].option, "lived");
  assert.equal(
    fb.otherWhys[1].line,
    "'lived': Simple past is for finished actions in the past; she still lives there now."
  );
  assert.equal(
    fb.speechText,
    "SINCE + point in time reaching now requires present perfect (has lived)."
  );
}

// 7. Right answer on question with no whys
{
  const fb = getWhyNotFeedback({
    question: qWithoutWhys,
    chosen: "tree",
  });

  assert.equal(fb.isCorrect, true);
  assert.equal(fb.wrongWhy, null);
  assert.deepEqual(fb.otherWhys, []);
  assert.equal(fb.speechText, "Tree is a naming word.");
}

// 8. Object passed as chosen
{
  const fb = getWhyNotFeedback({
    question: qWithWhys,
    chosen: qWithWhys.options[1], // "lives"
  });

  assert.equal(fb.isCorrect, false);
  assert.equal(fb.wrongWhy.option, "lives");
}

// 9. buildOthersSpeechText
{
  const others = [
    { option: "lives", why: "habit, not ongoing." },
    { option: "lived", why: "finished, not current." },
  ];
  const speech = buildOthersSpeechText(others);
  assert.equal(
    speech,
    "Why not the others? lives: habit, not ongoing.. lived: finished, not current."
  );
  assert.equal(buildOthersSpeechText([]), "");
}

console.log("whyNot tests passed!");

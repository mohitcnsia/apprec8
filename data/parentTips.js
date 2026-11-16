// data/parentTips.js: "For you today", one short tip a day for parents (owner, 16 Nov 2026: "made up is much better than
// nothing" during testing). DRAFT written by Claude: everyday habits only, no medical, psychological or exam claims.
// TODO before the public release: Seema reviews every tip; the owner writes/checks the Hindi (docs/LAUNCH_CHECKLIST.md).
export const PARENT_TIPS_DRAFT = true;

export const PARENT_TIPS = [
  "Ask \"What did you learn today?\" instead of \"How many marks?\"",
  "Five calm minutes together beat thirty rushed ones.",
  "Praise the effort you saw: \"You kept trying on that one.\"",
  "Let your child teach you one new word today.",
  "A mistake is a step in learning. Smile at it together.",
  "Ask your child to read one sentence aloud to you.",
  "Keep phones away at dinner tonight, including yours.",
  "Ask: \"What was the hardest question today? How did you try?\"",
  "A regular time for practice helps more than a long one now and then.",
  "Tell your child one thing you are proud of, today.",
  "Use a new English word at home today and ask what it means.",
  "When your child is stuck, ask \"What could you try next?\" before helping.",
  "A short walk or play break helps a tired mind learn again.",
  "Read something together for ten minutes: a story, a newspaper, a label.",
  "Ask your child to explain a science fact in their own words.",
  "Notice small progress: \"Last week this was hard, today you did it.\"",
  "Sleep on time helps learning more than one more hour of study.",
  "Let your child choose what to practise first tonight.",
  "Talk about a word you see on a sign or shop board today.",
  "If your child is upset, listen first. Lessons can wait.",
  "Share a time you found something hard as a child, and how you learned it.",
  "Ask your child to make up one question for you to answer.",
  "Water and a small snack before practice help children stay fresh.",
  "Compare your child only with how they were last month, not with others.",
  "Say \"Let's find out together\" when you don't know an answer.",
  "Ask your child what they want to get better at this week.",
  "Celebrate finishing, not only winning.",
  "A quiet corner with good light makes practice easier.",
  "Thank your child's teacher for one good thing this week.",
  "End the day with one kind word to your child.",
];

/** Today's tip (same for every parent on a day, changes at midnight). */
export const tipForDay = (day) => PARENT_TIPS[((day % PARENT_TIPS.length) + PARENT_TIPS.length) % PARENT_TIPS.length];

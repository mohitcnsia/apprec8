// data/scienceQuestData.js
// Science Quest (NSO), the second tile quest. Same format and helpers as English Quest
// (docs/CONTENT_GUIDE.md); seeded by components/quiz/SeedTileQuestButton.js (Admin tools).
//
// ONE tree for all classes (owner design, 2026-11-04): every topic carries `grades` (the classes it is for).
// The app hides topics that aren't for the kid's class (utils/gradeFilter.js); a topic for several
// classes is shared. Untagged = for everyone (avoid in Science).
//
// STATUS: DRAFT. Only a sample topic (Claude, for testing the pipeline). Gemini writes the units
// (gemini.md inbox G12). While `quest.draft` is true the tile goes to carouselGroup "quest_draft",
// which only tester accounts see (old app versions never read it). Owner approval → set draft: false.

import { q, study, quiz, unit, main, forGrades } from "./englishQuest/helpers.js";

export const QUEST_ID = "science-quest";

export const quest = {
  title: "Science Quest",
  description: "Explore living things, matter, forces, Earth and space, one branch at a time, up to champion level.",
  image: null,
  version: 1,
  draft: true,
};

export const tile = {
  title: "Science Quest",
  type: "QUEST",
  carouselGroup: quest.draft ? "quest_draft" : "quest",
  order: 2,
  image: null,
  questId: QUEST_ID,
  description: "Science, matched to your class",
};

// ---------- Mistake tags (keep short, reuse) ----------
// moves-means-alive, needs-energy-means-alive, sign-of-life-mixup, never-alive-mixup,
// still-alive-mixup, colour-means-alive

// ---------- Study pages ----------
export const studyPages = {
  "sq-living-study": {
    name: "Living and Non-living Things",
    author: "Apprec8",
    content: `### 🌱 Is it alive?

Everything around us is either **living** or **non-living**.

**Living things** show *signs of life*:

- 🍎 They need **food** and **water**.
- 🌬️ They **breathe**.
- 📏 They **grow**.
- 🐣 They **reproduce** (make young ones or seeds).
- 👀 They **respond** to things around them (a plant bends towards light, you pull your hand away from something hot).

---

### 🪨 Non-living things

Non-living things do **not** grow, breathe or reproduce by themselves.

| Living | Non-living |
|---|---|
| Mango tree | Rock |
| Cat | Bicycle |
| You! | Water bottle |

> 💡 **Careful!** A car **moves** and needs **fuel**, but it can't grow or make baby cars. So it is **non-living**.

---

### 🪵 Once living

Some things **were** living once: wood comes from a tree, and cotton comes from a plant. A wooden chair is non-living **now**.

> 🌰 A dry seed looks still, but it is **living**: give it water and soil and it grows into a plant!`,
  },
};

// ---------- Quizzes (V2 format; every wrong option has a mistakeTag) ----------
export const quizzes = {
  "sq-living-warmup": [
    q(
      "Which of these is a living thing?",
      "A mango tree",
      [["A rock", "never-alive-mixup"], ["A bicycle", "moves-means-alive"], ["A cloud", "moves-means-alive"]],
      "A mango tree grows, needs water and makes seeds. Rocks, bicycles and clouds can't grow or reproduce."
    ),
    q(
      "A car moves and needs fuel. Is it a living thing?",
      "No, it cannot grow or reproduce",
      [["Yes, because it moves", "moves-means-alive"], ["Yes, because it needs fuel", "needs-energy-means-alive"]],
      "Moving and using energy are not enough. Living things also grow and reproduce, and a car can do neither."
    ),
    q(
      "Which of these is NOT a sign of life?",
      "Being shiny",
      [["Growing", "sign-of-life-mixup"], ["Breathing", "sign-of-life-mixup"], ["Making young ones", "sign-of-life-mixup"]],
      "Growing, breathing and reproducing are signs of life. Being shiny is not: a spoon is shiny but not alive."
    ),
    q(
      "A dry seed does not move. What is it?",
      "Living, because it can grow into a plant",
      [["Non-living, because it does not move", "moves-means-alive"], ["Non-living, because it does not eat", "sign-of-life-mixup"]],
      "A seed is resting. With water, air and warmth it starts to grow, so it is living."
    ),
    q(
      "Which of these was once living but is non-living now?",
      "A wooden chair",
      [["A plastic bottle", "never-alive-mixup"], ["A glass marble", "never-alive-mixup"], ["A growing puppy", "still-alive-mixup"]],
      "Wood comes from a tree that was once alive. Plastic and glass were never alive, and a puppy is still alive."
    ),
    q(
      "Plants cannot walk. Why are they still living things?",
      "They grow, breathe, need water and make seeds",
      [["Because they are green", "colour-means-alive"], ["Because they stay in one place", "sign-of-life-mixup"]],
      "Living is about signs of life, not colour or walking. Plants show all the signs of life."
    ),
  ],
};

export const readings = {};
export const wordTables = {};

// ---------- The tree ----------
const u1 = unit("sq-u1", 1, "The Living World");
const living = forGrades(
  main("sq-living", u1.id, 1, "Living and non-living", [study("sq-living-study"), quiz("sq-living-warmup")]),
  [3, 4, 5]
);

export const nodes = [
  u1,
  living,
  unit("sq-u2", 2, "Plants", { comingSoon: true }),
];

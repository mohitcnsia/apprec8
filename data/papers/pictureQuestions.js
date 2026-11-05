// data/papers/pictureQuestions.js: picture questions (spec U, owner OK 2026-11-05: "looking great. perfect").
// Figure series, mirror images, water images and "same shape, only turned" are made by code from exact transforms
// (utils/figures.js), so the right answer is right by construction; tests/figures.test.mjs re-checks every one by
// transforming points. Plus a labelled plant diagram. Options keep their A–D order (`fixedOrder`).

import { figure, figureRow, pose } from "../../utils/figures.js";
import { seededRandom } from "../../utils/readingFlow.js";

const SER = { quest: "science-quest", node: "sq-patterns" };
const PLANT = { quest: "science-quest", node: "sq-plants" };
const LETTERS = ["A", "B", "C", "D"];

/** Puts the right drawing at a seeded position among the wrong ones; options are "Figure A" … "Figure D". */
function figureOptions(id, right, wrongs, tag) {
  const rng = seededRandom(id);
  const at = Math.floor(rng() * 4);
  const list = [...wrongs];
  list.splice(at, 0, right);
  return {
    options: list.map((f, i) => ({
      type: "text",
      content: `Figure ${LETTERS[i]}`,
      isCorrect: i === at,
      figure: figure(f.shape, f),
      pose: { turn: f.turn || 0, flip: f.flip || null, shape: f.shape },
      ...(i === at ? {} : { mistakeTag: tag }),
    })),
    answer: `Figure ${LETTERS[at]}`,
  };
}

function series(id, shape, start, step) {
  const shown = [0, 1, 2].map((k) => ({ shape, turn: start + k * step }));
  const right = { shape, turn: start + 3 * step };
  const wrongs = [
    { shape, turn: start + 2 * step }, // repeats the last one
    { shape, turn: start + 3 * step, flip: "mirror" }, // right turn, but mirrored
    { shape, turn: start + 3 * step + 180 }, // turned the wrong way round
  ];
  const way = step > 0 ? "clockwise" : "anticlockwise";
  return {
    id,
    kind: "series",
    topic: SER,
    question: { type: "text", content: "Which figure comes next?" },
    hint: "Look at how the picture turns each time.",
    figure: figureRow(shown),
    seriesStep: step,
    shown,
    ...figureOptions(id, right, wrongs, "figure-series-error"),
    explanation: { text: `It turns ${Math.abs(step)}° ${way} each time, so the next one turns ${Math.abs(step)}° more.` },
  };
}

function mirrorQ(id, shape) {
  const right = { shape, flip: "mirror" };
  const wrongs = [{ shape }, { shape, flip: "water" }, { shape, turn: 180 }];
  return {
    id,
    kind: "mirror",
    topic: SER,
    question: { type: "text", content: "The dashed line is a mirror. Which figure shows the mirror image?" },
    figure: figureRow([{ shape }], { ask: true, mirrorLine: "after-first" }),
    shown: [{ shape }],
    ...figureOptions(id, right, wrongs, "mirror-image-error"),
    explanation: { text: "In a mirror, left and right swap, but top and bottom stay the same." },
  };
}

function waterQ(id, shape) {
  const right = { shape, flip: "water" };
  const wrongs = [{ shape }, { shape, flip: "mirror" }, { shape, turn: 90 }];
  return {
    id,
    kind: "water",
    topic: SER,
    question: { type: "text", content: "Which figure shows how this picture looks in still water below it (its water image)?" },
    figure: figureRow([{ shape }], { ask: true }),
    shown: [{ shape }],
    ...figureOptions(id, right, wrongs, "water-image-error"),
    explanation: { text: "In a water image, top and bottom swap, but left and right stay the same." },
  };
}

function turnedQ(id, shape, turn) {
  const right = { shape, turn };
  // Flipped versions only (never a pure turn), all looking different from each other.
  const seen = new Set([pose(right)]);
  const wrongs = [{ flip: "mirror" }, { turn, flip: "mirror" }, { flip: "water" }, { turn: turn + 90, flip: "mirror" }, { turn: turn + 270, flip: "mirror" }]
    .map((f) => ({ shape, ...f }))
    .filter((f) => !seen.has(pose(f)) && seen.add(pose(f)))
    .slice(0, 3);
  return {
    id,
    kind: "turned",
    topic: SER,
    question: { type: "text", content: "Which figure is the SAME shape, only turned (not flipped)?" },
    figure: figureRow([{ shape }], { ask: true }),
    shown: [{ shape }],
    ...figureOptions(id, right, wrongs, "rotation-mirror-mixup"),
    explanation: { text: "Turning keeps the shape; a mirror or water image flips it, like a left hand becoming a right hand." },
  };
}

// The plant diagram (labels A–D: flower, leaf, stem, root).
const INK = "{ink}";
const SOFT = "{soft}";
const PLANT_SVG = `<svg width="220" height="190" viewBox="0 0 220 190"><path d="M0 140h220" stroke="{line}" stroke-width="3"/><path d="M110 140V60" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M110 100c-22-14-44-10-56 4 16 10 38 10 56-4z" fill="none" stroke="${INK}" stroke-width="3.5"/><path d="M110 86c22-14 44-10 56 4-16 10-38 10-56-4z" fill="none" stroke="${INK}" stroke-width="3.5"/><circle cx="110" cy="48" r="12" fill="none" stroke="${INK}" stroke-width="3.5"/><path d="M110 36c-6-12 6-12 0 0M122 48c12-6 12 6 0 0M98 48c-12-6-12 6 0 0" stroke="${INK}" stroke-width="3" fill="none"/><path d="M110 140l-18 30M110 140l16 34M110 140l2 40M102 154l-14 6" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><g font-size="16" font-weight="bold" fill="${SOFT}"><path d="M128 46h40" stroke="${SOFT}" stroke-width="2"/><text x="172" y="52">A</text><path d="M58 104H24" stroke="${SOFT}" stroke-width="2"/><text x="8" y="110">B</text><path d="M114 122h54" stroke="${SOFT}" stroke-width="2"/><text x="172" y="128">C</text><path d="M86 166H40" stroke="${SOFT}" stroke-width="2"/><text x="24" y="172">D</text></g></svg>`;
export const PLANT_LABELS = { A: "flower", B: "leaf", C: "stem", D: "root" };

function plantQ(id, ask, part, why) {
  const at = LETTERS.find((l) => PLANT_LABELS[l] === part);
  return {
    id,
    kind: "diagram",
    topic: PLANT,
    question: { type: "text", content: ask },
    figure: PLANT_SVG,
    options: LETTERS.map((l) => ({ type: "text", content: l, isCorrect: l === at, ...(l === at ? {} : { mistakeTag: "plant-part-mixup" }) })),
    answer: at,
    explanation: { text: why },
  };
}

export const PICTURE_QUESTIONS = [
  series("pic-series-1", "arrowDot", 0, 90),
  series("pic-series-2", "flag", 0, -90),
  series("pic-series-3", "boot", 0, 45),
  series("pic-series-4", "key", 90, 90),
  series("pic-series-5", "arrowDot", 45, -45),
  series("pic-series-6", "flag", 180, 45),
  mirrorQ("pic-mirror-1", "flag"),
  mirrorQ("pic-mirror-2", "boot"),
  mirrorQ("pic-mirror-3", "key"),
  waterQ("pic-water-1", "flag"),
  waterQ("pic-water-2", "arrowDot"),
  turnedQ("pic-turned-1", "boot", 90),
  turnedQ("pic-turned-2", "flag", 180),
  turnedQ("pic-turned-3", "key", 270),
  plantQ("pic-plant-1", "Look at the picture. Which part makes food for the plant?", "leaf", "Leaves make food using sunlight, air and water."),
  plantQ("pic-plant-2", "Look at the picture. Which part takes in water from the soil?", "root", "Roots take in water and hold the plant in the soil."),
  plantQ("pic-plant-3", "Look at the picture. Which part carries water up to the leaves?", "stem", "The stem carries water from the roots up to the leaves."),
  plantQ("pic-plant-4", "Look at the picture. Which part turns into fruits and seeds?", "flower", "After a flower is pollinated, it turns into fruit with seeds."),
];

/** Picture questions as paper questions (fixed A–D order; no repeats). */
export const pictureQuestionsFor = () =>
  PICTURE_QUESTIONS.map(({ question, figure: fig, hint, options, answer, explanation, topic }) => ({
    question,
    figure: fig,
    ...(hint ? { hint } : {}),
    options: options.map(({ pose, ...o }) => o),
    answer,
    explanation,
    topic,
    fixedOrder: true,
  }));

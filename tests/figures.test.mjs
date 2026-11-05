// tests/figures.test.mjs — picture questions (utils/figures.js, data/papers/pictureQuestions.js).
// Every generated answer is re-checked with plain geometry: points of the shape are moved by the drawing's transform
// and compared, so "Figure B is the mirror image" is proven, not trusted.
import assert from "node:assert/strict";
import { figure, pose, themeFigure } from "../utils/figures.js";
import { PICTURE_QUESTIONS, pictureQuestionsFor, PLANT_LABELS } from "../data/papers/pictureQuestions.js";

// A drawing (turn, flip) as a function on points around the centre (30, 30). Flip first, then turn (as in figure()).
const move = ({ turn = 0, flip = null }) => ([x, y]) => {
  let px = x - 30, py = y - 30;
  if (flip === "mirror") px = -px;
  if (flip === "water") py = -py;
  const a = (turn * Math.PI) / 180;
  return [px * Math.cos(a) - py * Math.sin(a), px * Math.sin(a) + py * Math.cos(a)].map((v) => Math.round(v * 1000) / 1000);
};
// Points that make any of our shapes asymmetric enough.
const PTS = [[10, 12], [44, 18], [20, 50], [35, 31]];
const shapeOf = (f) => PTS.map(move(f)).join(";");
const mirrorOf = (f) => PTS.map(move(f)).map(([x, y]) => [-x, y]).join(";"); // vertical mirror line
const waterOf = (f) => PTS.map(move(f)).map(([x, y]) => [x, -y]).join(";"); // water line below

assert.equal(pose({ flip: "water" }), "M180");
assert.ok(figure("flag", { turn: 90 }).includes('rotate(90 30 30)'));
assert.ok(!themeFigure(figure("flag"), { text: "#fff", label: "#aaa", border: "#333" }).includes("{"), "all colour tokens filled");

for (const q of PICTURE_QUESTIONS) {
  const where = q.id;
  assert.equal(q.options.length, 4, where);
  assert.equal(q.options.filter((o) => o.isCorrect).length, 1, where);
  assert.equal(new Set(q.options.map((o) => o.content)).size, 4, `${where}: labels differ`);
  q.options.filter((o) => !o.isCorrect).forEach((o) => assert.ok(o.mistakeTag, `${where}: mistake tag`));
  assert.equal(q.options.find((o) => o.isCorrect).content, q.answer, `${where}: answer`);
  if (q.kind === "diagram") {
    const expected = { "pic-plant-1": "leaf", "pic-plant-2": "root", "pic-plant-3": "stem", "pic-plant-4": "flower" }[q.id];
    assert.equal(PLANT_LABELS[q.answer], expected, `${where}: label points at the ${expected}`);
    continue;
  }
  const looks = q.options.map((o) => shapeOf(o.pose));
  assert.equal(new Set(looks).size, 4, `${where}: all four drawings look different`);
  const right = q.options.find((o) => o.isCorrect).pose;
  if (q.kind === "series") {
    const step = q.seriesStep;
    // each shown drawing is the previous one turned by `step`; the answer continues it
    const last = q.shown[2];
    assert.equal(shapeOf(right), shapeOf({ turn: last.turn + step }), `${where}: next in series`);
    assert.equal(shapeOf(q.shown[1]), shapeOf({ turn: q.shown[0].turn + step }), `${where}: shown series is regular`);
  } else if (q.kind === "mirror") {
    assert.equal(shapeOf(right), mirrorOf(q.shown[0]), `${where}: mirror image`);
  } else if (q.kind === "water") {
    assert.equal(shapeOf(right), waterOf(q.shown[0]), `${where}: water image`);
  } else if (q.kind === "turned") {
    // same shape turned: equals a pure turn of the original; no wrong option is a pure turn
    const turns = [0, 45, 90, 135, 180, 225, 270, 315].map((t) => shapeOf({ turn: t }));
    assert.ok(turns.includes(shapeOf(right)), `${where}: answer is a turn`);
    q.options.filter((o) => !o.isCorrect).forEach((o) => assert.ok(!turns.includes(shapeOf(o.pose)), `${where}: a wrong option is also a turn`));
  }
}
// right answers are not always in the same place
const spots = PICTURE_QUESTIONS.filter((q) => q.kind !== "diagram").map((q) => q.answer);
assert.ok(new Set(spots).size >= 3, "right answer spread over A–D");
// paper form: fixed order, figures kept, no internal fields
const pq = pictureQuestionsFor();
assert.ok(pq.every((q) => q.fixedOrder && q.figure && q.topic && !q.options.some((o) => "pose" in o)));
console.log(`figures tests passed (${PICTURE_QUESTIONS.length} picture questions)`);

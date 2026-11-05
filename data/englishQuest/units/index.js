// data/englishQuest/units/index.js
// New English Quest units, one file per unit (Unit 3 onwards). Units 0–2 live in data/englishQuestData.js.
// To add a unit: copy the pattern in docs/CONTENT_GUIDE.md into uN.js, import it here, add it to
// extraUnits IN ORDER, and move nextUnitTeaser to the unit after it. Then run `npm test`.

import u3 from "./u3.js";
import u4 from "./u4.js";
import u5 from "./u5.js";
import u6 from "./u6.js";
import u7 from "./u7.js";
import u8 from "./u8.js";
import u9 from "./u9.js";
import b1 from "./b1.js"; // Grammar Pro (Classes 9–10)
import b2 from "./b2.js";
import b3 from "./b3.js";
import b4 from "./b4.js";

export const extraUnits = [
  u3,
  u4,
  u5,
  u6,
  u7,
  u8,
  u9,
  b1,
  b2,
  b3,
  b4,
];

/** Shown as "Coming soon" after the last unit (null = nothing). */
// Classes 1–8 only: a "Coming soon" unit locks every unit after it, and Classes 9–10 go on to Grammar Pro (b1, also
// unitOrder 10, Classes 9–10 only, so the two never show together).
export const nextUnitTeaser = { id: "eq-u10", unitOrder: 10, title: "Word Building: Prefixes & Suffixes", grades: [1, 2, 3, 4, 5, 6, 7, 8] };

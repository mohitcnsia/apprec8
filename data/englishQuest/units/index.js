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

export const extraUnits = [
  u3,
  u4,
  u5,
  u6,
  u7,
  u8,
  u9,
];

/** Shown as "Coming soon" after the last unit (null = nothing). */
export const nextUnitTeaser = { id: "eq-u10", unitOrder: 10, title: "Word Building: Prefixes & Suffixes" };

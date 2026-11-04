// data/englishQuest/units/index.js
// New English Quest units, one file per unit (Unit 3 onwards). Units 0–2 live in data/englishQuestData.js.
// To add a unit: copy the pattern in docs/CONTENT_GUIDE.md into uN.js, import it here, add it to
// extraUnits IN ORDER, and move nextUnitTeaser to the unit after it. Then run `npm test`.

import u3 from "./u3.js";

export const extraUnits = [
  u3,
];

/** Shown as "Coming soon" after the last unit (null = nothing). */
export const nextUnitTeaser = { id: "eq-u4", unitOrder: 4, title: "Tenses" };

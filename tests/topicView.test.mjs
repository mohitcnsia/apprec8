// Tests for utils/topicView.js (teacher's topic view). Run: npm test
import assert from "node:assert/strict";
import { topicRows, rowLine, headline } from "../utils/topicView.js";

const summary = {
  kids: {
    a: { name: "Aman", eq: { lv: { tenses: "l", modals: "s" } } },
    b: { name: "Riya", eq: { lv: { tenses: "r", modals: "p" } } },
    c: { name: "Dev", eq: { lv: { tenses: "p" } } },
    gone: { name: "Left", eq: { lv: { tenses: "s" } } }, // no longer in the class
  },
};
const members = [
  { uid: "a", firstName: "Aman" },
  { uid: "b", firstName: "Riya" },
  { uid: "c", firstName: "Dev" },
  { uid: "d", firstName: "Isha" }, // never practised
];
const rows = topicRows(summary, members, ["eq"], () => (t) => ({ tenses: "Tenses", modals: "Modals" })[t]);

// Worst first: Modals (0 learned) before Tenses (2 learned).
assert.deepEqual(rows.map((r) => r.title), ["Modals", "Tenses"]);
const m = rows[0];
assert.equal(m.total, 4);
assert.deepEqual([m.learned, m.practising, m.newCount, m.slipping], [0, 1, 2, 1]);
assert.deepEqual(m.names.new, ["Dev", "Isha"]);
assert.deepEqual(m.names.slipping, ["Aman"]);
const t = rows[1];
assert.deepEqual([t.learned, t.practising, t.newCount, t.slipping], [2, 1, 1, 0], "still remembers counts as learned; removed kids left out");
assert.equal(rowLine(m), "0 learned · 1 practising · 2 new · 1 slipping");
assert.equal(headline(rows), "Modals needs you most: 0 of 4 have learned it");
assert.deepEqual(topicRows(null, members, ["eq"]), []);
assert.equal(headline([]), null);

console.log("topicView tests passed");

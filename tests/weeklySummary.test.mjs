// tests/weeklySummary.test.mjs — teacher's weekly card (utils/weeklySummary.js) must catch the Demo School patterns
import assert from "node:assert/strict";
import { QUESTS } from "../data/quests/index.js";
import { buildDemoSchool } from "../utils/demoSchool.js";
import { teacherWeek, assignmentStatus } from "../utils/weeklySummary.js";

const now = new Date(2026, 10, 9, 19, 0).getTime();
const { ops } = buildDemoSchool({ quests: QUESTS, now });
const doc = (p) => ops.find((o) => o.path === p)?.data;
function classKids(classId, questIds) {
  return ops
    .filter((o) => o.path.startsWith(`classes/${classId}/members/`))
    .map((o) => {
      const uid = o.path.split("/")[3];
      return { uid, firstName: o.data.firstName, quests: questIds.map((q) => ({ questId: q, ...(doc(`users/${uid}/questProgress/${q}`) || {}) })) };
    });
}

const kids = classKids("demo_class_10b", ["english-quest"]);
const assignments = [{ id: "demo_assign_passive", ...doc("classes/demo_class_10b/assignments/demo_assign_passive") }];
const w = teacherWeek({ kids, assignments, now });

assert.ok(w.reteach && /question|reported/i.test(w.reteach.subtopic), `reteach finds the class topic (${w.reteach?.subtopic}, ${w.reteach?.kids}/32)`);
assert.ok(w.reteach.kids >= 10);
const whys = w.needs.map((n) => n.why).join(" | ");
assert.ok(/twice/.test(whys), `catches the twice-failed challenge (${whys})`);
assert.ok(/no practice for \d+ days/.test(whys), "catches the kid who is away");
assert.ok(w.needs.length <= 3, "at most 3");
assert.ok(w.assignment && w.assignment.total === 32 && w.assignment.done + w.assignment.half + w.assignment.notStarted === 32, "assignment counts add up");
assert.equal(w.total, 32);
assert.ok(w.active >= 25 && w.active < 32, `active this week (${w.active})`);

// The dropping kid is caught when there's room (on its own)
const dropper = kids.filter((k) => doc(`users/${k.uid}`).demoPersona === "dropping");
const wd = teacherWeek({ kids: dropper, now });
assert.ok(wd.needs.some((n) => /accuracy \d+% → \d+%/.test(n.why)), `catches falling accuracy (${wd.needs.map((n) => n.why)})`);

// Empty class: nothing breaks
const e = teacherWeek({ kids: [], assignments: [], now });
assert.equal(e.reteach, null);
assert.equal(e.assignment, null);
assert.equal(assignmentStatus([{ id: "a", questId: "q", nodeIds: ["n"], dueDate: "2026-11-13" }], [{ uid: "k", quests: [{ questId: "q", nodes: { n: { status: "completed" } } }] }], now).done, 1);
console.log(`weeklySummary tests passed (reteach ${w.reteach.title} ${w.reteach.kids}/32; ${whys})`);

// Assignment names per group (2026-11-12): who is done, started, not started.
{
  const { assignmentStatus } = await import("../utils/weeklySummary.js");
  const kids = [
    { uid: "a", firstName: "Zoya", quests: [{ questId: "english-quest", nodes: { n1: { status: "completed" } } }] },
    { uid: "b", firstName: "Aman", quests: [{ questId: "english-quest", nodes: {} }] },
  ];
  const r = assignmentStatus([{ id: "x", questId: "english-quest", nodeIds: ["n1"], nodeTitles: ["T"], dueDate: "2030-01-01" }], kids, Date.UTC(2026, 10, 12));
  if (r.who.notStarted.map((k) => k.firstName).join() !== "Aman") throw new Error("not started names");
  if (r.who.done.length + r.who.half.length + r.who.notStarted.length !== 2) throw new Error("everyone in one group");
  console.log("assignment names passed");
}

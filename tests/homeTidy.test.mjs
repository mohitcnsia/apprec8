// tests/homeTidy.test.mjs: Tests for G112 Home tidy-up pure helpers. Run: npm test
import assert from "node:assert/strict";
import { selectParentFocusChild, ownerRowSummary } from "../utils/homeTidy.js";
import { dayKey } from "../utils/kidStats.js";

const now = new Date(2026, 10, 14, 18).getTime();
const DAY = 864e5;

// Mock quests helper
const q = (days, mistakes = {}) => ({
  stats: { daily: Object.fromEntries(days.map((d) => [dayKey(now - d * DAY), { answered: 5, correct: 4 }])) },
  mistakes,
});

// 1. Parent focus child selection
{
  const c1 = { uid: "c1", firstName: "Ananya" };
  const c2 = { uid: "c2", firstName: "Arjun" };
  const c3 = { uid: "c3", firstName: "Hazel" };

  // Hazel practised today (d=0) -> drops off
  // Ananya: 1 day this week (d=2)
  // Arjun: 3 days this week (d=1, 2, 3)
  const questsByChild = {
    c1: [q([2], { m1: true, m2: true })], // 1 day, 2 mistakes
    c2: [q([1, 2, 3])],                   // 3 days
    c3: [q([0, 1, 2])],                   // practised today!
  };

  const res = selectParentFocusChild([c1, c2, c3], questsByChild, now);
  assert.equal(res.allDone, false);
  assert.equal(res.focusChild.firstName, "Ananya", "child with fewest days and mistakes needs most help");
  assert.equal(res.remainingChildren.length, 1);
  assert.equal(res.remainingChildren[0].firstName, "Arjun");

  // All practised today -> allDone = true, focusChild = null
  const allDoneQuests = {
    c1: [q([0])],
    c2: [q([0])],
    c3: [q([0])],
  };
  const resDone = selectParentFocusChild([c1, c2, c3], allDoneQuests, now);
  assert.equal(resDone.allDone, true);
  assert.equal(resDone.focusChild, null);
  assert.equal(resDone.remainingChildren.length, 0);

  // Empty list
  assert.equal(selectParentFocusChild([], {}, now).focusChild, null);
  console.log("parent focus child tests passed");
}

// 2. Owner row summary
{
  const s1 = ownerRowSummary({ newToday: 2, stuck: 1 }, [{ id: "r1" }, { id: "r2" }]);
  assert.equal(s1.total, 5);
  assert.equal(s1.summary, "2 to review · 2 new · 1 stuck");

  const s2 = ownerRowSummary({ newToday: 0, stuck: 0 }, []);
  assert.equal(s2.total, 0);
  assert.equal(s2.summary, "All caught up");
  console.log("owner row summary tests passed");
}

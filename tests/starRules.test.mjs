// tests/starRules.test.mjs: every rule in the owner's star spec (16 Nov 2026), incl. the anti-hoarding ones.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { RULES, payAttempt, payProgress, catchUp, istDay, trimDaily } = require("../functions/utils/starRules.js");

const T0 = Date.parse("2026-11-16T10:00:00+05:30");
const DAY = 864e5;
const ans = (id, right, extra = {}) => ({ questionId: id, isCorrect: right, ...extra });
const quiz = (answers, outcome = "finished") => ({ answers, outcome, questId: "english-quest", quizId: "q1" });

// 1. New right answers pay 1 each; wrong ones pay nothing; first quiz of the day keeps the streak (+2).
let r = payAttempt({ attempt: quiz([ans("a", true), ans("b", true), ans("c", false)]), ledger: null, day: null, nowMs: T0 });
assert.equal(r.stars, 2 + RULES.streakKept);
assert.deepEqual(r.reasons.map((x) => x.why), ["new questions right", "streak kept"]);

// 2. Replaying the same quiz the same day pays NOTHING (no hoarding), and the streak is paid once a day.
const again = payAttempt({ attempt: quiz([ans("a", true), ans("b", true), ans("c", true)]), ledger: r.ledger, day: r.day, nowMs: T0 + 60e3 });
assert.equal(again.stars, 0, "replay must pay 0 (c was wrong first: it pays only when fixed)");

// 3. Wrong on purpose then fixed in My mistakes pays 1 — the same as right first time, so there's no reason to game it.
const before = { mistakes: { c: { kind: "question", questionId: "c", rightInARow: 1, lastWrongAt: T0 } }, nodes: {} };
const after = { mistakes: {}, nodes: {} };
let p = payProgress({ before, after, ledger: again.ledger, questNodes: [], nowMs: T0 + 120e3 });
assert.equal(p.stars, RULES.fix);
assert.equal(payProgress({ before, after, ledger: p.ledger, questNodes: [], nowMs: T0 + 130e3 }).stars, 0, "a retried trigger must not pay the fix twice");
// a mistake dropped by the 60-item cap (never practised) pays nothing
assert.equal(payProgress({ before: { mistakes: { z: { kind: "question", rightInARow: 0, lastWrongAt: 1 } } }, after: { mistakes: {} }, ledger: null, questNodes: [], nowMs: T0 }).stars, 0);

// 4. Review: right again 7+ days later pays 1 (capped 50 a day); sooner pays 0.
const soon = payAttempt({ attempt: quiz([ans("a", true)]), ledger: p.ledger, day: again.day, nowMs: T0 + 3 * DAY });
assert.equal(soon.reasons.find((x) => x.why === "old questions remembered"), undefined);
const later = payAttempt({ attempt: quiz([ans("a", true), ans("b", true)]), ledger: p.ledger, day: null, nowMs: T0 + 8 * DAY });
assert.equal(later.reasons.find((x) => x.why === "old questions remembered").n, 2);
const many = Array.from({ length: 60 }, (_, i) => ans(`r${i}`, true));
const seeded = payAttempt({ attempt: quiz(many), ledger: null, day: null, nowMs: T0 }).ledger;
const capped = payAttempt({ attempt: quiz(many), ledger: seeded, day: null, nowMs: T0 + 8 * DAY });
assert.equal(capped.reasons.find((x) => x.why === "old questions remembered").n, RULES.reviewCapDay);

// 5. Made-up questions pay only the first 20 right a day and never enter the ledger.
const gens = Array.from({ length: 30 }, (_, i) => ans(`gen-${i}`, true, { generator: "plural" }));
const g = payAttempt({ attempt: quiz(gens, "outOfHearts"), ledger: null, day: null, nowMs: T0 });
assert.equal(g.stars, RULES.generatedCapDay + RULES.dailyGoal, "20 made-up + daily goal (30 right ≥ 20); no streak when not finished");
assert.equal(Object.keys(g.ledger.q).length, 0);

// 6. Daily goal: 20 right answers in a day pays 10 once.
const twenty = Array.from({ length: 20 }, (_, i) => ans(`d${i}`, true));
const goal = payAttempt({ attempt: quiz(twenty), ledger: null, day: null, nowMs: T0 });
assert.ok(goal.reasons.some((x) => x.why === "today's goal: 20 right"));
assert.equal(payAttempt({ attempt: quiz([ans("x", true)]), ledger: goal.ledger, day: goal.day, nowMs: T0 + 1000 }).reasons.some((x) => x.why.startsWith("today's goal")), false);

// 7. Streak: consecutive days grow it; the 7th day pays +10.
let day = null, led = null;
for (let i = 0; i < 7; i++) {
  const s = payAttempt({ attempt: quiz([ans(`s${i}`, true)]), ledger: led, day, nowMs: T0 + i * DAY });
  day = s.day; led = s.ledger;
  if (i === 6) assert.ok(s.reasons.some((x) => x.why === "7-day streak"), "7-day bonus on day 7");
}
assert.equal(day.streak, 7);
const gap = payAttempt({ attempt: quiz([ans("s9", true)]), ledger: led, day, nowMs: T0 + 9 * DAY });
assert.equal(gap.day.streak, 1, "a missed day restarts the streak");

// 8. Topic green +5, gate/Boss +10, each once.
const nodes = [{ id: "t1", kind: "main", stepCount: 2 }, { id: "g1", kind: "gate", stepCount: 0 }, { id: "p1", kind: "practice", stepCount: 1 }];
const nb = { nodes: { t1__0: { status: "completed" } }, mistakes: {} };
const na = { nodes: { t1__0: { status: "completed" }, t1__1: { status: "completed" }, g1: { status: "completed" }, p1__0: { status: "completed" } }, mistakes: {} };
const tg = payProgress({ before: nb, after: na, ledger: null, questNodes: nodes, nowMs: T0 });
assert.equal(tg.stars, RULES.topicGreen + RULES.gateOrBoss);
assert.equal(payProgress({ before: nb, after: na, ledger: tg.ledger, questNodes: nodes, nowMs: T0 }).stars, 0, "paid once");

// 9. Practice paper: 1 per new right answer + 10 for finishing (80%+ answered), the bonus once per 7 days.
const paper = { activity: "paper", quizId: "paper-5", outcome: "finished", totalQuestions: 10, answeredCount: 9, answers: Array.from({ length: 10 }, (_, i) => ({ id: `pp${i}`, correct: i < 7, chosen: i < 9 ? "x" : null })) };
const pp = payAttempt({ attempt: paper, ledger: null, day: null, nowMs: T0 });
assert.equal(pp.stars, 7 + RULES.paperFinish + RULES.streakKept);
const resit = payAttempt({ attempt: paper, ledger: pp.ledger, day: pp.day, nowMs: T0 + DAY });
assert.deepEqual(resit.reasons.map((x) => x.why), ["streak kept"], "a resit within 7 days pays only the new day's streak");

// 10. Catch-up: 1 per different question ever right (first-wrong-then-right counts once), ledger seeded.
const cu = catchUp([
  { questId: "english-quest", atMs: 1, answers: [ans("a", true), ans("b", false)] },
  { questId: "english-quest", atMs: 2, answers: [ans("a", true), ans("b", true), ans("g", true, { generator: "plural" })] },
]);
assert.equal(cu.stars, 2);
assert.equal(payAttempt({ attempt: quiz([ans("a", true), ans("b", true)]), ledger: cu.ledgers["english-quest"], day: { d: istDay(T0), kept: true }, nowMs: T0 }).stars, 0, "caught-up questions never pay again as new");

// 11. Daily map on the user doc keeps 14 days.
const daily = Object.fromEntries(Array.from({ length: 20 }, (_, i) => [istDay(T0 - i * DAY), i]));
assert.equal(Object.keys(trimDaily(daily, istDay(T0))).length, 14);

console.log("starRules tests passed (new, replay, fix, review cap, made-up cap, daily goal, streak, topic/gate, paper, catch-up)");

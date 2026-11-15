// functions/utils/starRules.js: the star rules (owner-approved spec "Stars: earning them fairly", 16 Nov 2026,
// claude.ai/artifact/TL5TiSBdox1ymDR5kFKZRc). Pure, so tests can check every rule (tests/starRules.test.mjs).
//
// Why: quest quizzes used to pay only at 100% (Tripti: 161 right answers, 19 stars). Now every NEW question answered
// right pays, and a per-child ledger makes replays pay nothing.
//
// ledger (one per child per quest, server-only):
//   q:     { [questionId]: { f: 1|0 (first answer right?), p: ms the question last paid, or null } }
//   nodes: { [nodeId]: ms the topic / gate / Boss paid }
//   fixes: { [mistakeKey@lastWrongAt]: ms }   (a mistake pays once each time it is made and fixed)
//   papers:{ [paperId]: ms the finishing bonus last paid }
// day (one per child, server-only): { d, right, reviews, gens, goal, kept, streak, lastDay }

const DAY_MS = 24 * 60 * 60 * 1000;
const RULES = {
  firstRight: 1, // a question answered right on the first try, once per question ever
  fix: 1, // a mistake fixed in My mistakes (2 right in a row)
  review: 1, // an old question right again 7+ days after it last paid
  reviewGapMs: 7 * DAY_MS,
  reviewCapDay: 50,
  generatedCapDay: 20, // made-up questions (plurals, noun genders): only the first 20 right a day pay
  topicGreen: 5,
  gateOrBoss: 10,
  dailyGoalRight: 20,
  dailyGoal: 10,
  streakKept: 2,
  streak7: 10,
  paperFinish: 10,
  paperGapMs: 7 * DAY_MS,
  paperMinAnswered: 0.8,
};

/** "YYYY-MM-DD" in India time. */
const istDay = (ms) => new Date(ms + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);
const prevDay = (d) => istDay(Date.parse(`${d}T12:00:00+05:30`) - DAY_MS);

const emptyLedger = () => ({ q: {}, nodes: {}, fixes: {}, papers: {} });
const normLedger = (l) => ({ q: { ...(l?.q || {}) }, nodes: { ...(l?.nodes || {}) }, fixes: { ...(l?.fixes || {}) }, papers: { ...(l?.papers || {}) } });

/** Today's counters; a new IST day starts fresh but keeps the streak. */
function freshDay(day, nowMs) {
  const d = istDay(nowMs);
  const old = day || {};
  if (old.d === d) return { ...old };
  return { d, right: 0, reviews: 0, gens: 0, goal: false, kept: false, streak: old.streak || 0, lastDay: old.lastDay || null };
}

function add(out, n, why) {
  if (!n) return;
  out.stars += n;
  const same = out.reasons.find((r) => r.why === why);
  if (same) same.n += n;
  else out.reasons.push({ n, why });
}

/**
 * Stars for one saved attempt (questAttempts doc).
 * @returns {{ stars, reasons: [{n, why}], ledger, day }}
 */
function payAttempt({ attempt, ledger, day, nowMs }) {
  const L = normLedger(ledger || emptyLedger());
  const D = freshDay(day, nowMs);
  const out = { stars: 0, reasons: [] };
  const seen = new Set();
  const answers = Array.isArray(attempt?.answers) ? attempt.answers : [];

  for (const a of answers) {
    const qid = String(a?.questionId || a?.id || "");
    if (!qid || seen.has(qid)) continue; // a question counts once per attempt
    seen.add(qid);
    const right = a.isCorrect === true || a.correct === true;
    if (right) D.right += 1;

    if (a.generator) {
      if (right && D.gens < RULES.generatedCapDay) {
        D.gens += 1;
        add(out, RULES.firstRight, "new questions right");
      }
      continue;
    }
    const e = L.q[qid];
    if (!e) {
      L.q[qid] = { f: right ? 1 : 0, p: right ? nowMs : null };
      if (right) add(out, RULES.firstRight, "new questions right");
    } else if (right && e.p != null && nowMs - e.p >= RULES.reviewGapMs && D.reviews < RULES.reviewCapDay) {
      D.reviews += 1;
      L.q[qid] = { ...e, p: nowMs };
      add(out, RULES.review, "old questions remembered");
    }
    // first answer wrong (p null): it pays when the mistake is fixed (payProgress), never by replaying.
  }

  const isPaper = attempt?.activity === "paper" || attempt?.mode === "paper";
  if (isPaper) {
    const pid = String(attempt.quizId || attempt.nodeId || "paper");
    const total = Number(attempt.totalQuestions) || answers.length || 0;
    const answered = Number(attempt.answeredCount) || answers.filter((a) => a?.chosen != null).length;
    const last = L.papers[pid] || 0;
    if (total > 0 && answered >= Math.ceil(total * RULES.paperMinAnswered) && nowMs - last >= RULES.paperGapMs) {
      L.papers[pid] = nowMs;
      add(out, RULES.paperFinish, "practice paper finished");
    }
  }

  const finished = attempt?.outcome === "finished" || attempt?.outcome === "timeUp";
  if (finished && !D.kept) {
    D.kept = true;
    D.streak = D.lastDay === prevDay(D.d) ? (D.streak || 0) + 1 : 1;
    D.lastDay = D.d;
    add(out, RULES.streakKept, "streak kept");
    if (D.streak > 0 && D.streak % 7 === 0) add(out, RULES.streak7, `${D.streak}-day streak`);
  }

  if (!D.goal && D.right >= RULES.dailyGoalRight) {
    D.goal = true;
    add(out, RULES.dailyGoal, "today's goal: 20 right");
  }
  return { stars: out.stars, reasons: out.reasons, ledger: L, day: D };
}

/** Same rule as the app's topicDone (utils/questTree.js), from the server's node snapshot (id, kind, stepCount). */
function topicDone(node, progressNodes = {}) {
  if (!node) return false;
  const n = node.stepCount || 0;
  if (n > 0) {
    for (let i = 0; i < n; i++) if (progressNodes?.[`${node.id}__${i}`]?.status !== "completed") return false;
    return true;
  }
  return progressNodes?.[node.id]?.status === "completed";
}

/**
 * Stars from a questProgress change: mistakes fixed in My mistakes, topics turning green, gates / Bosses passed.
 * @param before / after  questProgress docs ({ nodes, mistakes })
 * @param questNodes      the quest's node snapshot [{ id, kind, stepCount }]
 */
function payProgress({ before, after, ledger, questNodes, nowMs }) {
  const L = normLedger(ledger || emptyLedger());
  const out = { stars: 0, reasons: [] };
  const bm = before?.mistakes || {};
  const am = after?.mistakes || {};
  for (const [key, e] of Object.entries(bm)) {
    if (am[key] || !e || !((e.rightInARow || 0) >= 1)) continue; // still open, or dropped by the list cap
    const fk = `${key}@${e.lastWrongAt || 0}`;
    if (L.fixes[fk]) continue;
    L.fixes[fk] = nowMs;
    if (e.kind === "question") {
      const qid = String(e.questionId || key);
      L.q[qid] = { ...(L.q[qid] || { f: 0 }), p: nowMs }; // from now on it can pay as a review
    }
    add(out, RULES.fix, "mistakes fixed");
  }
  for (const node of questNodes || []) {
    if (!node || !["main", "gate", "boss"].includes(node.kind) || L.nodes[node.id]) continue;
    if (!topicDone(node, after?.nodes) || topicDone(node, before?.nodes)) continue;
    L.nodes[node.id] = nowMs;
    if (node.kind === "main") add(out, RULES.topicGreen, "topics finished");
    else add(out, RULES.gateOrBoss, node.kind === "boss" ? "Boss beaten" : "gate passed");
  }
  return { stars: out.stars, reasons: out.reasons, ledger: L };
}

/**
 * One-time catch-up (owner 16 Nov): 1 star per different question a child ever answered right, and a ledger seeded
 * from their history so none of those questions pays again. Attempts oldest first.
 * @returns {{ stars, ledgers: { [questId]: ledger } }}
 */
function catchUp(attempts) {
  const ledgers = {};
  let stars = 0;
  const sorted = [...(attempts || [])].sort((a, b) => (a.atMs || 0) - (b.atMs || 0));
  for (const at of sorted) {
    const qk = String(at.questId || "unknown");
    const L = (ledgers[qk] = ledgers[qk] || emptyLedger());
    for (const a of at.answers || []) {
      const qid = String(a?.questionId || a?.id || "");
      if (!qid || a.generator) continue;
      const right = a.isCorrect === true || a.correct === true;
      const e = L.q[qid];
      if (!e) {
        L.q[qid] = { f: right ? 1 : 0, p: right ? at.atMs || 0 : null };
        if (right) stars += 1;
      } else if (right && e.p == null) {
        L.q[qid] = { ...e, p: at.atMs || 0 }; // first wrong, later right: catch-up counts it once
        stars += 1;
      }
    }
  }
  return { stars, ledgers };
}

/** Keep the last 14 days of the per-day star counts on the user doc (Home shows today + this week). */
function trimDaily(daily = {}, todayKey) {
  const keep = new Set();
  for (let i = 0; i < 14; i++) keep.add(istDay(Date.parse(`${todayKey}T12:00:00+05:30`) - i * DAY_MS));
  return Object.fromEntries(Object.entries(daily || {}).filter(([k]) => keep.has(k)));
}

module.exports = { RULES, istDay, prevDay, payAttempt, payProgress, topicDone, catchUp, trimDaily, emptyLedger };

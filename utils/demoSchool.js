// utils/demoSchool.js
// Demo School (spec: CODE_REVIEW.md "Spec for review: Demo School", owner 2026-11-05). Pure: builds every document of a
// made-up school, two classes and 44 kids with 6 weeks of practice made from real quest questions, so teacher and parent
// screens can be shown without touching real children. Nothing here writes to Firestore: the admin-only server function
// writes the result. Every document carries isDemo: true and every id starts with "demo_".
//
// Output ops: { path, data, ts } — `ts` lists fields holding ms that the server turns into Firestore Timestamps
// ("a.b" = nested field, "nodes.*.x" = field x inside every entry of nodes).

import { nodesForGrade } from "./gradeFilter.js";
import { updateStats, dayKey } from "./kidStats.js";

export const DEMO_PREFIX = "demo_";
export const DEMO_WEEKS = 6;
export const ATTEMPT_DAYS_KEPT = 14; // full attempt docs only for the last 2 weeks (cost); stats cover the rest
const DAY = 24 * 60 * 60 * 1000;

export const DEMO_LOGINS = [
  { uid: "demo_teacher", email: "demo.teacher@example.com", displayName: "Demo Teacher" },
  { uid: "demo_parent", email: "demo.parent@example.com", displayName: "Demo Parent" },
  { uid: "demo_kid_login", email: "demo.kid@example.com", displayName: "Riya" },
];

// Made-up first names + initial (owner: yes). None is a real pilot child.
const NAMES = [
  "Aarav S.", "Diya K.", "Kabir M.", "Ananya R.", "Vihaan P.", "Isha T.", "Arjun N.", "Meera J.", "Reyansh D.", "Saanvi G.",
  "Advik B.", "Kiara L.", "Ishaan V.", "Myra C.", "Dhruv A.", "Aadhya H.", "Rohan E.", "Navya F.", "Krish W.", "Tara Y.",
  "Atharv O.", "Avni U.", "Shaurya I.", "Pari Q.", "Ayaan Z.", "Riddhi X.", "Vivaan K.", "Anika S.", "Yash M.", "Zara P.",
  "Rudra T.", "Siya N.", "Riya P.", "Om D.", "Kavya G.", "Nikhil B.", "Ira L.", "Aditya V.", "Mahi C.", "Laksh A.",
  "Prisha H.", "Dev E.", "Jiya F.", "Neel W.",
];

export const DEMO_CLASSES = [
  {
    id: "demo_class_10b", name: "10-B", grade: 10, size: 32, subjects: ["english"],
    quests: [{ questId: "english-quest", units: /^eq-b[1-6]$/, weak: /questions|reported/i, startShare: 0.5 }],
    // first kids get the patterns the teacher card should catch (mockup V4)
    personas: ["twiceFailed", "away", "dropping", "strong", "strong", "strong", "strong", "strong", "strong"],
    assignment: { id: "demo_assign_passive", questId: "english-quest", unit: "eq-b5", note: "Finish before Friday's test" },
  },
  {
    id: "demo_class_5a", name: "5-A", grade: 5, size: 12, subjects: ["english", "science"],
    quests: [
      { questId: "english-quest", units: null, weak: /conjunction|linking|joining/i, startShare: 0.55 },
      { questId: "science-quest", units: null, weak: /magnet/i, startShare: 0.35 },
    ],
    personas: ["parentsChild", "strong", "away"],
    assignment: null,
  },
];

const PERSONAS = {
  steady: { days: 0.55, acc: 0.72, perDay: [1, 3] },
  strong: { days: 0.75, acc: 0.9, perDay: [2, 4] },
  twiceFailed: { days: 0.6, acc: 0.6, perDay: [1, 3] },
  away: { days: 0.6, acc: 0.7, perDay: [1, 2], awayDays: 9 },
  dropping: { days: 0.6, acc: 0.82, perDay: [1, 3], dropTo: 0.55 },
  parentsChild: { days: 0.72, acc: 0.8, perDay: [2, 4] }, // shaped like Pratha (owner: yes)
};

/** Small seeded random generator, so the same seed always gives the same school (tests). */
export function rng(seed = 7) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const between = (r, [lo, hi]) => lo + Math.floor(r() * (hi - lo + 1));

/** Leaves a kid can play in order, each with its questions: main (quiz step), practice, gate, boss. */
export function playableLeaves(questModule, grade, unitRe = null) {
  const nodes = nodesForGrade(questModule.nodes, grade).filter((n) => !unitRe || unitRe.test(n.unitId || ""));
  const out = [];
  nodes.forEach((n) => {
    if (!["main", "practice", "gate", "boss"].includes(n.kind)) return;
    const quizId = n.quizId || (n.steps || []).find((s) => s.type === "quiz")?.quizId;
    const questions = questModule.quizzes[quizId] || [];
    if (!questions.length) return;
    out.push({ node: n, quizId, questions, passPercent: n.passPercent || 70, draw: n.drawCount || Math.min(10, questions.length) });
  });
  return out;
}

function answerQuestion(r, q, index, quizId, pRight) {
  const right = q.options.find((o) => o.isCorrect);
  const wrongs = q.options.filter((o) => !o.isCorrect);
  const isCorrect = r() < pRight || !wrongs.length;
  const chosen = isCorrect ? right : wrongs[Math.floor(r() * wrongs.length)];
  const a = {
    questionId: `${quizId}#${index}`,
    questionText: String(q.question?.content || "").slice(0, 300),
    chosen: String(chosen.content),
    correctAnswer: String(right.content),
    isCorrect,
    timeMs: 15000 + Math.floor(r() * 35000),
  };
  if (!isCorrect && chosen.mistakeTag) a.mistakeTag = chosen.mistakeTag;
  if (q.subtopic) a.subtopic = q.subtopic;
  return a;
}

/** The kid's chance of a right answer on a given day for a given leaf/sub-topic. */
function chance(p, persona, dayIndex, totalDays, weakRe, leaf, q) {
  let acc = p.acc;
  if (p.dropTo != null && dayIndex >= totalDays - 14) {
    const t = (dayIndex - (totalDays - 14)) / 14;
    acc = p.acc + (p.dropTo - p.acc) * t;
  }
  if (weakRe && (weakRe.test(q.subtopic || "") || weakRe.test(leaf.node.id) || weakRe.test(leaf.node.title || ""))) {
    acc -= persona === "strong" ? 0.1 : 0.32;
  }
  if (persona === "twiceFailed" && leaf.node.kind === "gate") acc = Math.min(acc, 0.55);
  return Math.max(0.15, Math.min(0.98, acc));
}

/** One kid's 6 weeks in one quest → { progress, attempts, stars }. */
export function simulateKid({ r, uid, name, grade, persona, quest, leaves, weakRe, now, startShare = 0 }) {
  const p = PERSONAS[persona] || PERSONAS.steady;
  const totalDays = DEMO_WEEKS * 7;
  let pos = Math.floor(leaves.length * startShare * (0.8 + r() * 0.4));
  let stats = {};
  const nodes = {};
  const attempts = [];
  let stars = 0;
  let gateFails = 0;
  // Topics before the start were finished before these 6 weeks (like a real class mid-year).
  const startedAt = now - DEMO_WEEKS * 7 * DAY - 7 * DAY;
  leaves.slice(0, pos).forEach((l) => {
    nodes[l.node.id] = { status: "completed", attempts: 1 + Math.floor(r() * 2), bestPercent: 70 + Math.floor(r() * 30), lastPlayedAt: startedAt, completedAt: startedAt };
  });

  for (let d = 0; d < totalDays; d++) {
    const dayStart = now - (totalDays - d) * DAY;
    const daysAgo = totalDays - d;
    if (p.awayDays && daysAgo <= p.awayDays) continue;
    if (r() > p.days) continue;
    let t = dayStart + (16 + Math.floor(r() * 5)) * 60 * 60 * 1000 + Math.floor(r() * 50) * 60000; // 4–9 pm
    if (t > now - 60 * 60 * 1000) t = now - 60 * 60 * 1000 - Math.floor(r() * 3) * 60 * 60 * 1000;
    const n = between(r, p.perDay);
    for (let k = 0; k < n && leaves.length; k++) {
      const leaf = leaves[Math.min(pos, leaves.length - 1)];
      const count = Math.min(leaf.draw, leaf.questions.length);
      const startAt = Math.floor(r() * Math.max(1, leaf.questions.length - count + 1));
      const answers = leaf.questions
        .slice(startAt, startAt + count)
        .map((q, i) => answerQuestion(r, q, startAt + i, leaf.quizId, chance(p, persona, d, totalDays, weakRe, leaf, q)));
      const correct = answers.filter((a) => a.isCorrect).length;
      const percent = Math.round((correct / answers.length) * 100);
      // twiceFailed: fails the first gate it meets exactly twice, then waits (the teacher card should catch this)
      const isGate = leaf.node.kind === "gate";
      let passed = percent >= leaf.passPercent;
      if (persona === "twiceFailed" && isGate) passed = false;
      const durationMs = answers.reduce((s, a) => s + a.timeMs, 0);
      const endedAt = t + durationMs;

      stats = updateStats(stats, answers, { now: endedAt, durationMs, questId: quest, userName: name, topicFallback: null });
      const prev = nodes[leaf.node.id] || { attempts: 0, bestPercent: 0 };
      const node = { attempts: prev.attempts + 1, bestPercent: Math.max(prev.bestPercent, percent), lastPlayedAt: endedAt };
      if (passed || prev.status === "completed") node.status = "completed";
      if (passed && prev.status !== "completed") node.completedAt = endedAt;
      if (isGate && !node.status) {
        node.failsSinceLastPractice = (prev.failsSinceLastPractice || 0) + 1;
        const bySub = {};
        answers.forEach((a) => {
          const s = (bySub[a.subtopic] = bySub[a.subtopic] || { c: 0, t: 0 });
          s.t++;
          if (a.isCorrect) s.c++;
        });
        node.weakSubtopics = Object.entries(bySub).filter(([k, v]) => k !== "undefined" && v.c / v.t < 0.67).map(([k]) => k);
      }
      nodes[leaf.node.id] = { ...prev, ...node };

      if (now - endedAt <= ATTEMPT_DAYS_KEPT * DAY) {
        attempts.push({
          userId: uid, userName: name, questId: quest, nodeId: leaf.node.id, quizId: leaf.quizId,
          mode: "training", outcome: "finished", totalQuestions: answers.length, answeredCount: answers.length,
          correctCount: correct, percent, passPercent: leaf.passPercent, passed, startedAtMs: t, durationMs,
          answers, details: null, activity: isGate ? "gate" : leaf.node.kind === "boss" ? "boss" : "practice",
          appVersion: "demo", isDemo: true, createdAt: endedAt,
        });
      }
      if (passed) stars += 10;
      t = endedAt + 60000;
      if (persona === "twiceFailed" && isGate) {
        gateFails++;
        if (gateFails >= 2) break; // stuck at the gate: keeps practising earlier leaves only
        continue;
      }
      if (passed && pos < leaves.length - 1) pos++;
    }
    if (persona === "twiceFailed" && gateFails >= 2) {
      // after two fails the kid replays the leaf before the gate on later days
      const gi = leaves.findIndex((l) => l.node.kind === "gate" && nodes[l.node.id]?.failsSinceLastPractice >= 2);
      if (gi > 0) pos = gi - 1;
      leaves = leaves.slice(0, Math.max(1, gi));
    }
  }
  return { progress: { questId: quest, nodes, stats }, attempts, stars };
}

/**
 * Every document of the Demo School.
 * @param {{ quests: Array<object>, now?: number, seed?: number }} p - quests = bundled quest modules (data/quests)
 * @returns {{ ops: Array<{path:string,data:object,ts:string[]}>, logins: typeof DEMO_LOGINS, summary: object }}
 */
export function buildDemoSchool({ quests, now = Date.now(), seed = 7 }) {
  const r = rng(seed);
  const byId = Object.fromEntries(quests.map((m) => [m.QUEST_ID, m]));
  const ops = [];
  const put = (path, data, ts = []) => ops.push({ path, data: { ...data, isDemo: true }, ts });

  put("schools/demo_school", { name: "Demo School (not real)", city: "Demo", admins: [], createdAt: now }, ["createdAt"]);
  put("users/demo_teacher", { firstName: "Demo", lastName: "Teacher", teachesClassIds: DEMO_CLASSES.map((c) => c.id) });
  put("users/demo_parent", { firstName: "Demo", lastName: "Parent", isParent: true, childUids: ["demo_kid_login"] });

  let nameIndex = 0;
  const summary = { kids: 0, attempts: 0, classes: {} };
  DEMO_CLASSES.forEach((cls) => {
    put(`classes/${cls.id}`, {
      schoolId: "demo_school", schoolName: "Demo School (not real)", name: cls.name, grade: cls.grade, kind: "school",
      subjects: cls.subjects, joinCode: null, // no classCodes doc: nobody can join a demo class by code
      teacherIds: ["demo_teacher"], teacherSubjects: { demo_teacher: cls.subjects }, createdBy: "demo_teacher", createdAt: now,
    }, ["createdAt"]);
    const leavesByQuest = cls.quests.map((q) => ({ ...q, leaves: playableLeaves(byId[q.questId], cls.grade, q.units) }));

    for (let i = 0; i < cls.size; i++) {
      const persona = cls.personas[i] || "steady";
      const uid = persona === "parentsChild" ? "demo_kid_login" : `demo_kid_${String(++summary.kids).padStart(2, "0")}`;
      const name = persona === "parentsChild" ? "Riya P." : NAMES[nameIndex++ % NAMES.length];
      const firstName = name.split(" ")[0];
      let stars = 0;
      leavesByQuest.forEach((q) => {
        const sim = simulateKid({
          r, uid, name, grade: cls.grade, persona, quest: q.questId, leaves: q.leaves, weakRe: q.weak, now,
          startShare: persona === "strong" ? (q.startShare || 0) + 0.1 : q.startShare || 0,
        });
        stars += sim.stars;
        const nodeTs = ["nodes.*.lastPlayedAt", "nodes.*.completedAt"]; // the app stores these as Timestamps
        put(`users/${uid}/questProgress/${q.questId}`, sim.progress, nodeTs);
        sim.attempts.forEach((a, k) => put(`questAttempts/${uid}_${q.questId}_${k}`, a, ["createdAt"]));
        summary.attempts += sim.attempts.length;
      });
      put(`users/${uid}`, {
        firstName, lastName: "", grade: cls.grade, isChild: true, classIds: [cls.id], demoPersona: persona,
        parentUids: persona === "parentsChild" ? ["demo_parent"] : [],
        // Global stars only for the login kid (Riya): the other demo kids never rank above real children.
        stats: { totalStars: persona === "parentsChild" ? stars : 0, currentStreak: persona === "away" ? 0 : 1 + Math.floor(r() * 6) },
        demoStars: stars,
      });
      put(`classes/${cls.id}/members/${uid}`, {
        firstName, grade: cls.grade, code: null, consentId: null, status: "approved",
        parentName: "Demo parent", relation: "parent", joinedAt: now - DEMO_WEEKS * 7 * DAY,
      }, ["joinedAt"]);
    }
    if (cls.assignment) {
      const a = cls.assignment;
      const mains = nodesForGrade(byId[a.questId].nodes, cls.grade).filter((n) => n.unitId === a.unit && n.kind === "main");
      const friday = new Date(now);
      friday.setDate(friday.getDate() + ((5 - friday.getDay() + 7) % 7 || 7));
      put(`classes/${cls.id}/assignments/${a.id}`, {
        questId: a.questId, nodeIds: mains.map((n) => n.id), nodeTitles: mains.map((n) => n.title), kidIds: [],
        dueDate: dayKey(friday.getTime()), note: a.note, createdBy: "demo_teacher", createdAt: now - 5 * DAY,
      }, ["createdAt"]);
    }
    summary.classes[cls.id] = cls.size;
  });
  put("demo/meta", { anchorMs: now, seed, version: 1 });
  return { ops, logins: DEMO_LOGINS, summary: { ...summary, writes: ops.length } };
}

/** Days to move every demo date forward so the class looks current again (weekly job). */
export function shiftDays(anchorMs, now = Date.now()) {
  return Math.max(0, Math.floor((now - anchorMs) / DAY));
}

/** Moves a daily-stats key ("2026-11-05") forward by n days. */
export function shiftDayKey(key, n) {
  const [y, m, d] = key.split("-").map(Number);
  return dayKey(new Date(y, m - 1, d + n, 12).getTime());
}

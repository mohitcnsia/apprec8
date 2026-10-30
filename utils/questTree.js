// utils/questTree.js
// Pure functions (no React / Firebase) that turn quest nodes + a kid's progress
// into the Space-style path with locked / unlocked / completed states.
// Spec: gemini.md "Spec v2" (2026-10-30).
//
// Node kinds (documents in quests/{questId}/nodes):
//   unit      { id, kind: "unit", unitOrder, title, comingSoon? }
//   main      { id, kind: "main", unitId, branchId, branchOrder, title, steps: [Step] }   <- on the path
//   practice  { id, kind: "practice", unitId, branchId, order, title, difficulty, steps: [Step] }   <- side row
//   gate      { id, kind: "gate", unitId, branchId, title, quizId, passPercent }          <- side row (last fixed item)
//   endless   { id, kind: "endless", unitId, branchId, title }                            <- side row (end)
//   boss      { id, kind: "boss", unitId, title, quizId, passPercent }                    <- on the path (end of unit)
// Step = { type: "study" | "quiz" | "reading", contentId? , quizId? }
//
// Progress (users/{uid}/questProgress/{questId}.nodes) is keyed by:
//   step id  `${nodeId}__${index}` for steps of main/practice nodes
//   node id  for gate / boss nodes
//
// Rules:
//   - The first branch of the first unit is open.
//   - A main node is done when all its steps are done. Then its practice leaves,
//     gate and endless practice open. Practice leaves can be done in any order.
//   - The next branch's main node opens when this branch's gate is passed
//     (a branch without a gate is cleared when its main node is done).
//   - The Unit Boss opens when the unit's last branch is cleared. Passing it opens the next unit.
//   - Unknown step types / node kinds show as "comingSoon" (never crash in older app versions).

export const KNOWN_STEP_TYPES = ["study", "quiz", "reading"];
export const KNOWN_SIDE_KINDS = ["practice", "gate"]; // "endless" arrives in Spec v2 step 4

export const DEFAULT_PRACTICE_PASS_PERCENT = 60;
export const DEFAULT_GATE_PASS_PERCENT = 80;
export const DEFAULT_BOSS_PASS_PERCENT = 70;
// Kept for older callers (reading/quiz screens).
export const DEFAULT_LEAF_PASS_PERCENT = DEFAULT_PRACTICE_PASS_PERCENT;
export const DEFAULT_UNIT_PASS_PERCENT = DEFAULT_BOSS_PASS_PERCENT;

export const stepId = (nodeId, index) => `${nodeId}__${index}`;

/** Stars shown on the map for a best score: 0 (not passed) to 3 (perfect). */
export const starsForPercent = (percent, passPercent = DEFAULT_PRACTICE_PASS_PERCENT) => {
  if (typeof percent !== "number" || percent < passPercent) return 0;
  if (percent >= 100) return 3;
  if (percent >= 80) return 2;
  return 1;
};

const isDone = (progress, key) => progress?.[key]?.status === "completed";
const bestOf = (progress, key) =>
  typeof progress?.[key]?.bestPercent === "number" ? progress[key].bestPercent : null;
const byNumber = (field) => (a, b) => (a[field] ?? 0) - (b[field] ?? 0);

/** Builds step info for a main/practice node: which steps are done, which to open next. */
function buildSteps(node, progress) {
  const steps = (Array.isArray(node.steps) ? node.steps : []).map((s, i) => {
    const id = stepId(node.id, i);
    return {
      ...s,
      id,
      known: KNOWN_STEP_TYPES.includes(s.type),
      done: isDone(progress, id),
      bestPercent: bestOf(progress, id),
    };
  });
  const playable = steps.length > 0 && steps.every((s) => s.known);
  const doneCount = steps.filter((s) => s.done).length;
  const allDone = steps.length > 0 && doneCount === steps.length;
  // Next step to open: first unfinished; when all done, the last quiz/reading (replay practice).
  const nextStep =
    steps.find((s) => !s.done) ||
    [...steps].reverse().find((s) => s.type !== "study") ||
    steps[0] ||
    null;
  const quizBest = steps.filter((s) => s.type !== "study").map((s) => s.bestPercent ?? 0);
  return {
    steps,
    playable,
    doneCount,
    allDone,
    nextStep,
    bestPercent: quizBest.length ? Math.max(...quizBest) : null,
  };
}

/**
 * @param {Array<object>} nodes - all nodes of one quest
 * @param {object} progress - map key -> { status, bestPercent, ... }
 * @returns {{ path: Array<object>, currentPathId: string|null, stats: object }}
 *   path is ordered from the START (bottom of the map) to the END.
 *   Path items: { kind: "main", ...main, status, side: [...] } | { kind: "boss", ... } | { kind: "comingSoon", ... }
 */
export function buildQuestPath(nodes = [], progress = {}) {
  const units = nodes.filter((n) => n.kind === "unit").sort(byNumber("unitOrder"));
  const path = [];
  let previousUnitDone = true;
  let currentPathId = null;
  const stats = { unitsTotal: 0, unitsDone: 0, branchesTotal: 0, branchesMastered: 0, stepsDone: 0 };

  for (const unit of units) {
    if (unit.comingSoon) {
      path.push({ id: unit.id, kind: "comingSoon", unitId: unit.id, title: unit.title, status: "comingSoon" });
      previousUnitDone = false;
      continue;
    }
    stats.unitsTotal += 1;
    const unitOpen = previousUnitDone;
    const inUnit = nodes.filter((n) => n.unitId === unit.id);
    const mains = inUnit.filter((n) => n.kind === "main").sort(byNumber("branchOrder"));
    const boss = inUnit.find((n) => n.kind === "boss");

    let previousBranchCleared = unitOpen;
    for (const main of mains) {
      stats.branchesTotal += 1;
      const s = buildSteps(main, progress);
      stats.stepsDone += s.doneCount;

      let status;
      if (!s.playable) status = previousBranchCleared ? "comingSoon" : "locked";
      else if (!previousBranchCleared) status = "locked";
      else if (s.allDone) status = "completed";
      else status = "unlocked";

      const sideOpen = status === "completed";
      const sideNodes = inUnit.filter((n) => n.branchId === main.branchId && n.kind !== "main");

      const practices = sideNodes
        .filter((n) => n.kind === "practice")
        .sort(byNumber("order"))
        .map((p) => {
          const ps = buildSteps(p, progress);
          stats.stepsDone += ps.doneCount;
          let pStatus;
          if (!sideOpen) pStatus = "locked";
          else if (!ps.playable) pStatus = "comingSoon";
          else if (ps.allDone) pStatus = "completed";
          else pStatus = "unlocked";
          const passPercent = p.passPercent ?? DEFAULT_PRACTICE_PASS_PERCENT;
          return {
            ...p,
            ...ps,
            status: pStatus,
            stars: ps.allDone ? starsForPercent(ps.bestPercent ?? 100, passPercent) : 0,
          };
        });

      const gateNode = sideNodes.find((n) => n.kind === "gate");
      let gate = null;
      if (gateNode) {
        const passed = isDone(progress, gateNode.id);
        const playable = !!gateNode.quizId;
        gate = {
          ...gateNode,
          status: !sideOpen ? "locked" : !playable ? "comingSoon" : passed ? "completed" : "unlocked",
          bestPercent: bestOf(progress, gateNode.id),
        };
      }

      const endlessNode = sideNodes.find((n) => n.kind === "endless");
      const endless = endlessNode
        ? { ...endlessNode, status: !sideOpen ? "locked" : KNOWN_SIDE_KINDS.includes("endless") ? "unlocked" : "comingSoon" }
        : null;

      // Branch is cleared when its gate is passed (or, without a gate, when the main node is done).
      const cleared = status === "completed" && (gate ? gate.status === "completed" : true);
      const mastered =
        cleared && practices.every((p) => p.status === "completed");
      if (mastered) stats.branchesMastered += 1;

      // The kid's current node: first main node that is open but not finished,
      // or a finished main node whose gate is still waiting.
      if (!currentPathId && (status === "unlocked" || (status === "completed" && !cleared))) {
        currentPathId = main.id;
      }

      path.push({
        ...main,
        ...s,
        kind: "main",
        status,
        practices,
        gate,
        endless,
        cleared,
        mastered,
        practiceDone: practices.filter((p) => p.status === "completed").length,
      });
      previousBranchCleared = cleared;
    }

    let unitDone = false;
    if (boss) {
      const passed = isDone(progress, boss.id);
      const bossStatus = !previousBranchCleared ? "locked" : !boss.quizId ? "comingSoon" : passed ? "completed" : "unlocked";
      unitDone = bossStatus === "completed";
      if (!currentPathId && bossStatus === "unlocked") currentPathId = boss.id;
      path.push({ ...boss, kind: "boss", status: bossStatus, bestPercent: bestOf(progress, boss.id) });
    } else {
      unitDone = previousBranchCleared; // a unit without a boss is done when its last branch is cleared
    }
    if (unitDone) stats.unitsDone += 1;
    previousUnitDone = unitDone;
  }

  // Everything finished: point at the last playable node.
  if (!currentPathId) {
    const last = [...path].reverse().find((p) => p.status === "completed");
    currentPathId = last ? last.id : path[0]?.id ?? null;
  }

  return { path, currentPathId, stats };
}

/** Score from an answer log: { correctCount, total, percent }. */
export function scoreAnswers(answerLog = [], totalQuestions) {
  const total = totalQuestions || answerLog.length;
  const correctCount = answerLog.filter((a) => a.isCorrect).length;
  const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  return { correctCount, total, percent };
}

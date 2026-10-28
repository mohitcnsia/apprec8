// utils/questTree.js
// Pure functions that turn quest nodes + a kid's progress into a tree with
// locked / unlocked / completed states. No React or Firebase here, so it can be
// tested with plain Node.
//
// Node shapes (from quests/{questId}/nodes):
//   unit (trunk): { id, kind: "unit", unitOrder, title, quizId, passPercent, comingSoon? }
//   leaf:         { id, kind: "leaf", unitId, branchId, branchTitle, branchOrder, order,
//                   type: "study" | "quiz" | ..., contentId?, quizId?, passPercent? }
//
// Rules:
//   - Unit 0 is unlocked. Unit N unlocks when unit N-1's test is passed.
//   - When a unit is unlocked, the first leaf of every branch is unlocked.
//   - Inside a branch, each leaf unlocks when the previous leaf is completed.
//   - Kids don't have to finish branches to take the unit test.
//   - Leaf types this app version doesn't know show as "comingSoon" (never crash).

export const KNOWN_LEAF_TYPES = ["study", "quiz"];
// Unit (trunk) nodes are unit tests. A future unit kind that this app version
// doesn't know (or a unit with no test) shows as "Coming soon".
export const KNOWN_UNIT_TYPES = ["test"];

const isPlayableUnit = (unit) =>
  KNOWN_UNIT_TYPES.includes(unit.type || "test") && !!unit.quizId;

export const DEFAULT_LEAF_PASS_PERCENT = 60;
export const DEFAULT_UNIT_PASS_PERCENT = 70;

/** Stars for a best score: 0 (not passed) to 3 (perfect). */
export const starsForPercent = (percent, passPercent = DEFAULT_LEAF_PASS_PERCENT) => {
  if (typeof percent !== "number" || percent < passPercent) return 0;
  if (percent >= 100) return 3;
  if (percent >= 80) return 2;
  return 1;
};

const isCompleted = (progressNodes, nodeId) =>
  progressNodes?.[nodeId]?.status === "completed";

/**
 * @param {Array<object>} nodes - all nodes of one quest
 * @param {object} progressNodes - map nodeId -> { status, bestPercent, attempts }
 * @returns {{ units: Array<object>, currentUnitId: string|null, stats: object }}
 */
export function buildQuestTree(nodes = [], progressNodes = {}) {
  const units = nodes
    .filter((n) => n.kind === "unit")
    .sort((a, b) => (a.unitOrder ?? 0) - (b.unitOrder ?? 0));
  const leaves = nodes.filter((n) => n.kind === "leaf");

  let previousUnitPassed = true; // Unit 0 is always open
  let currentUnitId = null;
  let leavesDone = 0;

  const builtUnits = units.map((unit) => {
    const unitDone = isCompleted(progressNodes, unit.id);
    let status;
    if (unit.comingSoon || !isPlayableUnit(unit)) status = "comingSoon"; // always shown as a teaser
    else if (!previousUnitPassed) status = "locked";
    else if (unitDone) status = "completed";
    else status = "unlocked";

    // The current unit is the furthest unit the kid can work on.
    if (status === "unlocked" || status === "completed") currentUnitId = unit.id;

    const unitOpen = status === "unlocked" || status === "completed";

    // Group leaves into branches.
    const branchMap = new Map();
    leaves
      .filter((l) => l.unitId === unit.id)
      .forEach((leaf) => {
        if (!branchMap.has(leaf.branchId)) {
          branchMap.set(leaf.branchId, {
            branchId: leaf.branchId,
            title: leaf.branchTitle || leaf.branchId,
            branchOrder: leaf.branchOrder ?? 0,
            leaves: [],
          });
        }
        branchMap.get(leaf.branchId).leaves.push(leaf);
      });

    const branches = [...branchMap.values()]
      .sort((a, b) => a.branchOrder - b.branchOrder)
      .map((branch) => {
        let previousDone = true;
        const builtLeaves = branch.leaves
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((leaf) => {
            const done = isCompleted(progressNodes, leaf.id);
            let leafStatus;
            if (!unitOpen || !previousDone) leafStatus = "locked";
            else if (!KNOWN_LEAF_TYPES.includes(leaf.type)) leafStatus = "comingSoon";
            else if (done) leafStatus = "completed";
            else leafStatus = "unlocked";

            if (done) leavesDone += 1;
            // A coming-soon leaf blocks the ones after it in this app version.
            previousDone = done;

            const best = progressNodes?.[leaf.id]?.bestPercent;
            return {
              ...leaf,
              status: leafStatus,
              bestPercent: typeof best === "number" ? best : null,
              stars:
                leaf.type === "quiz"
                  ? starsForPercent(best, leaf.passPercent ?? DEFAULT_LEAF_PASS_PERCENT)
                  : done
                  ? 3
                  : 0,
            };
          });
        const completedCount = builtLeaves.filter((l) => l.status === "completed").length;
        return { ...branch, leaves: builtLeaves, completedCount };
      });

    previousUnitPassed = status === "completed";

    const best = progressNodes?.[unit.id]?.bestPercent;
    return {
      ...unit,
      status,
      branches,
      bestPercent: typeof best === "number" ? best : null,
    };
  });

  return {
    units: builtUnits,
    currentUnitId,
    stats: {
      unitsTotal: units.filter((u) => !u.comingSoon && isPlayableUnit(u)).length,
      unitsDone: builtUnits.filter((u) => u.status === "completed").length,
      leavesTotal: leaves.length,
      leavesDone,
    },
  };
}

/** Score from an answer log: { correctCount, total, percent }. */
export function scoreAnswers(answerLog = [], totalQuestions) {
  const total = totalQuestions || answerLog.length;
  const correctCount = answerLog.filter((a) => a.isCorrect).length;
  const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  return { correctCount, total, percent };
}

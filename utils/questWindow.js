// utils/questWindow.js
// Map windowing (Duolingo-style): decide WHAT the map shows. Pure, testable.
//  - current unit: every node
//  - finished units: one collapsed card each (tap to expand for review)
//  - the next unit: one teaser card
//  - units after that: one "N more units ahead" line
//  - tester unlockAll: everything expanded
//
// Input: `path` from buildQuestPath (start → end, items carry unitId), `units` (unit nodes, any order).
// Output rows are ordered start → end (bottom of the map → top), like `path`.
//   { type: "node", item, pathIndex }
//   { type: "doneCard", unitId, title, topicsDone, topicsTotal, expanded }
//   { type: "teaser", unitId, title, topicsTotal, comingSoon, needs }
//   { type: "more", count }

const byOrder = (a, b) => (a.unitOrder ?? 0) - (b.unitOrder ?? 0);

export function buildWindow({ path = [], units = [], currentPathId = null, expanded = [], unlockAll = false }) {
  const orderedUnits = [...units].filter((u) => u.kind === "unit").sort(byOrder);
  const expandedSet = new Set(expanded);
  const itemsByUnit = new Map();
  path.forEach((item, pathIndex) => {
    const key = item.unitId;
    if (!itemsByUnit.has(key)) itemsByUnit.set(key, []);
    itemsByUnit.get(key).push({ item, pathIndex });
  });

  const currentUnitId = path.find((p) => p.id === currentPathId)?.unitId ?? orderedUnits[0]?.id ?? null;
  const currentIndex = Math.max(0, orderedUnits.findIndex((u) => u.id === currentUnitId));

  const rows = [];
  let teaserShown = false;
  let moreCount = 0;

  orderedUnits.forEach((unit, unitIndex) => {
    const entries = itemsByUnit.get(unit.id) || [];
    const mains = entries.filter((e) => e.item.kind === "main");
    const topicsTotal = mains.length;
    const topicsDone = mains.filter((e) => e.item.cleared).length;
    const nodeRows = entries
      .filter((e) => e.item.kind !== "comingSoon")
      .map((e) => ({ type: "node", item: e.item, pathIndex: e.pathIndex }));

    if (unlockAll && !unit.comingSoon) {
      rows.push(...nodeRows);
      return;
    }
    if (unitIndex === currentIndex && !unit.comingSoon) {
      rows.push(...nodeRows);
      return;
    }
    if (unitIndex < currentIndex) {
      const isExpanded = expandedSet.has(unit.id);
      rows.push({ type: "doneCard", unitId: unit.id, title: unit.title, topicsDone, topicsTotal, expanded: isExpanded });
      if (isExpanded) rows.push(...nodeRows);
      return;
    }
    // After the current unit
    if (!teaserShown) {
      teaserShown = true;
      const current = orderedUnits[currentIndex];
      // Use the boss's own title (what the kid sees on the map), else "<unit> Boss".
      const currentBoss = (itemsByUnit.get(current?.id) || []).find((e) => e.item.kind === "boss")?.item;
      rows.push({
        type: "teaser",
        unitId: unit.id,
        title: unit.title,
        topicsTotal,
        comingSoon: !!unit.comingSoon,
        needs: currentBoss?.title || (current ? `${current.title} Boss` : null),
      });
    } else {
      moreCount += 1;
    }
  });

  if (moreCount > 0) rows.push({ type: "more", count: moreCount });
  return { rows, currentUnitId };
}

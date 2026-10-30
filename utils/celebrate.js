// utils/celebrate.js
// Decides when the map plays confetti (Spec v2 Step 5): only for NEW achievements,
// never on first load or because tester "unlock all" changed the view. Pure, testable.

/** Snapshot of what's worth celebrating per path item: "cleared" | "mastered" | "bossPassed" | null. */
export function achievementSnapshot(path = []) {
  const snap = {};
  path.forEach((p) => {
    if (p.kind === "boss") snap[p.id] = p.status === "completed" ? "bossPassed" : null;
    else if (p.kind === "main") snap[p.id] = p.mastered ? "mastered" : p.cleared ? "cleared" : null;
  });
  return snap;
}

const RANK = { null: 0, cleared: 1, mastered: 2, bossPassed: 2 };

/** True when something got better between two snapshots (new clear, new mastery, boss passed). */
export function shouldCelebrate(before, after) {
  if (!before || !after) return false;
  return Object.keys(after).some((id) => (RANK[after[id]] || 0) > (RANK[before[id] ?? null] || 0));
}

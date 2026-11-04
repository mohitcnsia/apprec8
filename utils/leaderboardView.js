// utils/leaderboardView.js
// Shapes leaderboard data for the screen (mockup M1, owner-approved 2026-11-05). Pure, testable.
// rows: [{ id, name, points, rank, sub? }] sorted best first. me: the viewer's id.
// → podium (2nd, 1st, 3rd: the classic order), list (everyone below the podium, without me), mine (my row + a hint).

export function leaderboardView(rows = [], me, { unit = "points" } = {}) {
  const sorted = [...rows].sort((a, b) => (a.rank || 0) - (b.rank || 0));
  const top = sorted.slice(0, 3);
  const podium = [top[1], top[0], top[2]].filter(Boolean).map((r) => ({ ...r, place: r.rank }));
  const list = sorted.slice(3).filter((r) => r.id !== me);
  const mineIdx = sorted.findIndex((r) => r.id === me);
  const mine = mineIdx >= 0 ? sorted[mineIdx] : null;
  let hint = null;
  if (mine) {
    if (mine.rank === 1) hint = "You're on top. Amazing!";
    else {
      const ahead = sorted[mineIdx - 1];
      const gap = ahead ? Math.max(1, (ahead.points || 0) - (mine.points || 0) + 1) : null;
      hint = ahead && gap ? `${gap} more ${unit === "stars" ? (gap === 1 ? "star" : "stars") : gap === 1 ? "point" : "points"} to pass ${ahead.name}` : null;
    }
  }
  return { podium, list, mine: mine ? { ...mine, hint } : null };
}

/** Points to show: "1,240" (Indian grouping for big star counts). */
export const formatPoints = (n) => Number(n || 0).toLocaleString("en-IN");

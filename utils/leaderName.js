// utils/leaderName.js
// What other kids see on the leaderboard (owner, 2026-11-04): first name + class, never the last name
// or email. School is NOT shown to everyone (it tells strangers where a child is every day); it can be
// shown to kids of the same school once RB-2 (Schools → Classes) exists.

export function leaderName(leader) {
  if (!leader) return "Kid";
  const first = String(leader.firstName || "").trim().split(/\s+/)[0];
  const fallback = String(leader.username || leader.name || "").trim().split(/[\s@]+/)[0];
  const name = first || fallback || `Kid #${String(leader.id || leader.userId || "anon").slice(0, 4)}`;
  const grade = Number(leader.grade);
  return Number.isInteger(grade) && grade >= 1 && grade <= 12 ? `${name} · Class ${grade}` : name;
}

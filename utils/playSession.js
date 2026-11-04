// utils/playSession.js
// A child's play session on the parent's phone (mockup N1, owner-approved 2026-11-05): who plays, since when, for how
// long, and whether the phone is locked to Apprec8. Pure, tested (tests/playSession.test.mjs).

export const DURATIONS = [15, 30, 45, null]; // minutes; null = no limit

export function newSession({ childUid, childName, minutes = null, locked = false, now = Date.now() }) {
  if (!childUid) throw new Error("childUid needed");
  const m = DURATIONS.includes(minutes) ? minutes : null;
  return { childUid, childName: String(childName || "").trim() || "your child", minutes: m, locked: !!locked, startedAt: now };
}

/** → { active, timeUp, minutesLeft } for the signed-in user. */
export function sessionStatus(session, { uid, now = Date.now() } = {}) {
  if (!session || !session.childUid || session.childUid !== uid) return { active: false, timeUp: false, minutesLeft: null };
  if (!session.minutes) return { active: true, timeUp: false, minutesLeft: null };
  const left = session.startedAt + session.minutes * 60000 - now;
  return { active: true, timeUp: left <= 0, minutesLeft: Math.max(0, Math.ceil(left / 60000)) };
}

export const durationLabel = (m) => (m ? `${m} min` : "No limit");

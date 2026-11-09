// functions/utils/pendingPush.js
// Helpers for pushing notifications when new teacher/student requests are waiting (G84).
// Max 1 push per person per 10 minutes ("3 new").

const TEN_MINUTES_MS = 10 * 60 * 1000;

function canSendPush(lastPushedAt, now = Date.now(), windowMs = TEN_MINUTES_MS) {
  if (!lastPushedAt || now - lastPushedAt >= windowMs) {
    return { allowed: true, remainingMs: 0 };
  }
  return { allowed: false, remainingMs: windowMs - (now - lastPushedAt) };
}

function teacherWaitingMessage({ teacherName, className, count = 1 }) {
  const tName = String(teacherName || "").trim() || "A teacher";
  const cName = String(className || "").trim() || "your class";
  const title = "Apprec8: Teacher waiting";
  const body =
    count > 1
      ? `${tName} + ${count - 1} new waiting to join ${cName} · Approve`
      : `${tName} waiting to join ${cName} · Approve`;
  return { title, body };
}

function studentWaitingMessage({ studentName, className, count = 1 }) {
  const sName = String(studentName || "").trim() || "A student";
  const cName = String(className || "").trim() || "your class";
  const title = "Apprec8: Student waiting";
  const body =
    count > 1
      ? `${sName} + ${count - 1} new waiting to join ${cName} · Approve`
      : `${sName} wants to join ${cName} · Approve`;
  return { title, body };
}

module.exports = {
  TEN_MINUTES_MS,
  canSendPush,
  teacherWaitingMessage,
  studentWaitingMessage,
};

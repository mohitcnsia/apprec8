// utils/needsYou.js
// Logic for the "Needs you" card on Home (G84).
// Pure, tested in tests/needsYou.test.mjs.
//
// Generates action rows for anyone with items waiting:
// - owner/admin: Decisions waiting, teachers waiting per class
// - teacher: students waiting per class ("10-A: 3 students waiting · Approve")
// - parent: hook for v1 (empty for now)
//
// If nothing is pending, returns [] (never an empty box on Home).

export function formatDecisionLine(count) {
  if (!count || count <= 0) return null;
  return count === 1 ? "1 decision waiting · Tap to answer" : `${count} decisions waiting · Tap to answer`;
}

export function formatTeacherLine(className, count) {
  if (!count || count <= 0) return null;
  const name = className || "Class";
  const noun = count === 1 ? "teacher" : "teachers";
  return `${name}: ${count} ${noun} waiting · Approve`;
}

export function formatStudentLine(className, count) {
  if (!count || count <= 0) return null;
  const name = className || "Class";
  const noun = count === 1 ? "student" : "students";
  return `${name}: ${count} ${noun} waiting · Approve`;
}

/**
 * Computes the pending items list for the "Needs you" card.
 *
 * @param {Object} params
 * @param {Array|number} [params.decisions] - Open decisions array or count
 * @param {Array} [params.teacherRequests] - [{ classId, className, count }]
 * @param {Array} [params.studentRequests] - [{ classId, className, count }]
 * @param {Array} [params.parentRequests] - Hook for future parent notifications (v1 empty)
 * @returns {Array<Object>} List of row objects: { id, label, screen, params, type, count }
 */
export function computeNeedsYou({
  decisions = [],
  teacherRequests = [],
  studentRequests = [],
  parentRequests = [],
  wellbeing = 0,
  reports = 0,
} = {}) {
  const rows = [];

  // 0. Kids to see (school counsellor / her backup): first, because a kid asked for help (well-being, 2026-11-11).
  const wb = Number(wellbeing) || 0;
  if (wb > 0) {
    rows.push({
      id: "needs-you-wellbeing",
      type: "wellbeing",
      count: wb,
      label: wb === 1 ? "1 kid to see today (well-being)" : `${wb} kids to see today (well-being)`,
      screen: "MoodList",
    });
  }

  // 0b. New reports from kids (owner): wrong questions get fixed the same day.
  const rep = Number(reports) || 0;
  if (rep > 0) {
    rows.push({
      id: "needs-you-reports",
      type: "reports",
      count: rep,
      label: rep === 1 ? "1 new report from a kid" : `${rep} new reports from kids`,
      screen: "IdeasReports",
    });
  }

  // 1. Decisions (Admin / Owner)
  const decCount = Array.isArray(decisions) ? decisions.length : Number(decisions) || 0;
  if (decCount > 0) {
    rows.push({
      id: "needs-you-decisions",
      type: "decision",
      count: decCount,
      label: formatDecisionLine(decCount),
      screen: "Decisions",
    });
  }

  // 2. Teachers waiting (Admin / School Admin)
  if (Array.isArray(teacherRequests)) {
    for (const req of teacherRequests) {
      const count = Number(req?.count) || 0;
      if (count > 0 && req?.classId) {
        rows.push({
          id: `needs-you-teacher-${req.classId}`,
          type: "teacher",
          count,
          label: formatTeacherLine(req.className, count),
          screen: "ClassDetail",
          params: { classId: req.classId },
        });
      }
    }
  }

  // 3. Students waiting (Teacher)
  if (Array.isArray(studentRequests)) {
    for (const req of studentRequests) {
      const count = Number(req?.count) || 0;
      if (count > 0 && req?.classId) {
        rows.push({
          id: `needs-you-student-${req.classId}`,
          type: "student",
          count,
          label: formatStudentLine(req.className, count),
          screen: "Progress",
          params: { view: "classes", classId: req.classId },
        });
      }
    }
  }

  // 4. Parents waiting (hook for v1)
  if (Array.isArray(parentRequests)) {
    for (const p of parentRequests) {
      if (p?.label && p?.screen) {
        rows.push({
          id: p.id || `needs-you-parent-${rows.length}`,
          type: "parent",
          count: p.count || 1,
          label: p.label,
          screen: p.screen,
          params: p.params,
        });
      }
    }
  }

  return rows;
}

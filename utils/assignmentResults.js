// utils/assignmentResults.js
// G87: Teacher assignment results by student name (Progress → class → assignment).
// Spec & Owner Decisions (2026-11-09 / 14 Nov):
// - Done = all steps completed AND 0 open mistakes for assigned topics
// - Fixing mistakes (N left) = all steps completed, but N mistakes left to fix
// - Halfway = some steps started / completed
// - Not started = no steps started
// - Sorted: Not started → Halfway → Fixing mistakes (N) → Done ✓
// - Accuracy on the first try: uses "Accuracy NN%" (never "% right")
// - Top line: "8 of 30 done · 12 fixing mistakes · 6 halfway · 4 not started"
// - Remind: throttled to at most once per day per child
// - Star of the week: best accuracy + effort this week, shareable to WhatsApp ("This week's star: Tripti 🌟")
import { stepId, topicDone } from "./questTree.js";
import { countTopicMistakes } from "./assignedTopics.js";

const DAY_MS = 24 * 60 * 60 * 1000;

function getQuestData(kid, questId) {
  if (Array.isArray(kid.quests)) {
    return kid.quests.find((q) => q.questId === questId) || {};
  }
  if (Array.isArray(kid.perQuest)) {
    return kid.perQuest.find((p) => p.q === questId) || {};
  }
  if (kid.progress && typeof kid.progress === "object") {
    return kid.progress[questId] || {};
  }
  return {};
}

function collectSubtopics(questNodes = [], nodeIds = []) {
  const subtopics = new Set();
  for (const nodeId of nodeIds) {
    const main = questNodes.find((n) => n.id === nodeId);
    if (main?.subtopic) subtopics.add(main.subtopic);
    if (Array.isArray(main?.subtopics)) main.subtopics.forEach((s) => subtopics.add(s));

    const inBranch = questNodes.filter((n) => n.branchId === nodeId);
    for (const b of inBranch) {
      if (b.subtopic) subtopics.add(b.subtopic);
      if (Array.isArray(b.subtopics)) b.subtopics.forEach((s) => subtopics.add(s));
    }
  }
  return subtopics;
}

/**
 * Checks if a student can be reminded today (throttled to at most once per day).
 * @param {object} student - { lastRemindedAt, status }
 * @param {number} [now] - current timestamp ms
 * @returns {boolean}
 */
export function canRemindStudent(student, now = Date.now()) {
  if (!student || student.status === "done") return false;
  if (!student.lastRemindedAt) return true;
  const todayKey = new Date(now).toISOString().slice(0, 10);
  const lastKey = new Date(student.lastRemindedAt).toISOString().slice(0, 10);
  return todayKey !== lastKey;
}

/**
 * Generates the reminder message for child + parent.
 */
export function formatRemindMessage(teacherName = "Teacher", assignmentTitle = "Assignment", mistakesLeft = 0) {
  const name = teacherName ? `${teacherName}: ` : "";
  if (mistakesLeft > 0) {
    const plural = mistakesLeft === 1 ? "mistake" : "mistakes";
    return `${name}finish ${assignmentTitle} — ${mistakesLeft} ${plural} to fix`;
  }
  return `${name}please complete ${assignmentTitle}`;
}

/**
 * Computes the Star of the Week among students who practiced this week (best accuracy + effort).
 * @param {Array} kids - list of student objects with weekly progress
 * @param {number} [now] - current timestamp ms
 * @returns {{ student: object, shareText: string } | null}
 */
export function computeStarOfTheWeek(kids = [], now = Date.now()) {
  let best = null;
  let bestScore = -1;

  for (const k of kids) {
    const firstName = k.firstName || k.name || "Student";
    let answered = 0;
    let correct = 0;

    const quests = Array.isArray(k.quests) ? k.quests : Array.isArray(k.perQuest) ? k.perQuest : [];
    for (const q of quests) {
      const w = q.week || {};
      answered += Number(w.answered) || 0;
      correct += Number(w.correct) || 0;
    }

    // Minimum effort threshold: at least 10 questions answered this week
    if (answered >= 10) {
      const acc = correct / answered;
      // Score balances accuracy heavily (70%) with effort/answers (30%)
      const score = acc * 70 + Math.min(answered, 50) * 0.6;
      if (score > bestScore) {
        bestScore = score;
        best = {
          uid: k.uid,
          firstName,
          accuracy: Math.round(acc * 100),
          answered,
        };
      }
    }
  }

  if (!best) return null;

  return {
    student: best,
    shareText: `This week's star: ${best.firstName} 🌟 (${best.accuracy}% accuracy, ${best.answered} questions)`,
    shortShareText: `This week's star: ${best.firstName} 🌟`,
  };
}

/**
 * Computes per-student status, accuracy, and summary for an assignment.
 * Pure function, zero extra reads.
 *
 * @param {object} assignment - { id, questId, nodeIds, nodeTitles, kidIds, dueDate }
 * @param {Array} kids - list of student objects ({ uid, firstName, quests | perQuest, lastRemindedAt })
 * @param {Function} [nodesOf] - (questId) => array of quest nodes
 * @param {number} [now] - timestamp
 * @returns {{ assignmentId: string, summary: object, students: Array<object>, who: object }}
 */
export function computeAssignmentResults(assignment, kids = [], nodesOf = () => [], now = Date.now()) {
  if (!assignment) {
    return {
      assignmentId: null,
      summary: { done: 0, fixingMistakes: 0, halfway: 0, notStarted: 0, total: 0, topLine: "0 of 0 done" },
      students: [],
      who: { done: [], fixingMistakes: [], half: [], notStarted: [] },
    };
  }

  const questId = assignment.questId;
  const nodeIds = Array.isArray(assignment.nodeIds) ? assignment.nodeIds : [];
  const questNodes = typeof nodesOf === "function" ? nodesOf(questId) || [] : [];
  const subtopics = collectSubtopics(questNodes, nodeIds);

  const targets = Array.isArray(assignment.kidIds) && assignment.kidIds.length > 0
    ? kids.filter((k) => assignment.kidIds.includes(k.uid))
    : kids;

  const who = { done: [], fixingMistakes: [], half: [], notStarted: [] };

  const students = targets.map((k) => {
    const qp = getQuestData(k, questId);
    const progressNodes = qp.nodes || {};
    const mistakes = (qp.mistakes && typeof qp.mistakes === "object") ? qp.mistakes : (qp.mistakesMap && typeof qp.mistakesMap === "object") ? qp.mistakesMap : {};
    const stats = qp.stats || {};

    let completedTopicCount = 0;
    let startedTopicCount = 0;

    for (const nodeId of nodeIds) {
      const node = questNodes.find((n) => n.id === nodeId);
      const isDone = node ? topicDone(node, progressNodes) : progressNodes[nodeId]?.status === "completed";
      const isStarted = !!progressNodes[nodeId] || (node?.steps || []).some((_, i) => progressNodes[stepId(nodeId, i)]);

      if (isDone) completedTopicCount++;
      if (isStarted) startedTopicCount++;
    }

    // Open mistakes for assigned topics (question + topic mistakes both)
    let mistakesLeft = 0;
    for (const nodeId of nodeIds) {
      mistakesLeft += countTopicMistakes(mistakes, nodeId);
    }

    // Accuracy on the first try
    let correctSum = 0;
    let totalSum = 0;
    for (const sub of subtopics) {
      if (stats.bySubtopic?.[sub]) {
        correctSum += Number(stats.bySubtopic[sub].correct) || 0;
        totalSum += Number(stats.bySubtopic[sub].total) || 0;
      }
    }

    let accuracy = null;
    if (totalSum > 0) {
      accuracy = Math.round((correctSum / totalSum) * 100);
    } else {
      let pSum = 0;
      let pCount = 0;
      for (const nodeId of nodeIds) {
        const p = progressNodes[nodeId];
        const val = p?.firstPercent != null ? p.firstPercent : p?.bestPercent;
        if (typeof val === "number") {
          pSum += val;
          pCount++;
        }
      }
      if (pCount > 0) {
        accuracy = Math.round(pSum / pCount);
      }
    }

    let status;
    let statusLabel;
    let sortOrder;

    const allStepsCompleted = completedTopicCount === nodeIds.length && nodeIds.length > 0;

    if (startedTopicCount === 0) {
      status = "notStarted";
      statusLabel = "Not started";
      sortOrder = 0;
      who.notStarted.push({ uid: k.uid, firstName: k.firstName || k.name || "Student" });
    } else if (allStepsCompleted) {
      if (mistakesLeft > 0) {
        status = "fixingMistakes";
        statusLabel = `Fixing mistakes (${mistakesLeft})`;
        sortOrder = 2;
        who.fixingMistakes.push({ uid: k.uid, firstName: k.firstName || k.name || "Student", mistakesLeft });
      } else {
        status = "done";
        statusLabel = "Done ✓";
        sortOrder = 3;
        who.done.push({ uid: k.uid, firstName: k.firstName || k.name || "Student" });
      }
    } else {
      status = "halfway";
      statusLabel = "Halfway";
      sortOrder = 1;
      who.half.push({ uid: k.uid, firstName: k.firstName || k.name || "Student" });
    }

    const accuracyLabel = accuracy !== null ? `Accuracy ${accuracy}%` : (status === "notStarted" ? "—" : "Accuracy —");

    const studentObj = {
      uid: k.uid,
      name: k.firstName || k.name || "Student",
      status,
      statusLabel,
      sortOrder,
      mistakesLeft,
      accuracy,
      accuracyLabel,
      lastRemindedAt: k.lastRemindedAt || null,
    };
    studentObj.canRemind = canRemindStudent(studentObj, now);

    return studentObj;
  });

  // Sorted: Not started → Halfway → Fixing mistakes (N) → Done ✓
  students.sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return (a.name || "").localeCompare(b.name || "");
  });

  Object.values(who).forEach((list) => list.sort((x, y) => x.firstName.localeCompare(y.firstName)));

  const done = students.filter((s) => s.status === "done").length;
  const fixingMistakes = students.filter((s) => s.status === "fixingMistakes").length;
  const halfway = students.filter((s) => s.status === "halfway").length;
  const notStarted = students.filter((s) => s.status === "notStarted").length;
  const total = students.length;

  const topLine = `${done} of ${total} done · ${fixingMistakes} fixing mistakes · ${halfway} halfway · ${notStarted} not started`;

  return {
    assignmentId: assignment.id,
    summary: {
      done,
      fixingMistakes,
      halfway,
      notStarted,
      total,
      topLine,
    },
    students,
    who,
  };
}

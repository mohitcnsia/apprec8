// functions/triggers/classSummary.js: one small summary per class, so a teacher's screen reads one document instead
// of one per kid per quest ("Simpler Home, Progress and Me" doc, build step 1; owner 2026-11-11).
// Runs when a kid's quest progress changes after a quiz (stats.attempts went up). For each of the kid's classes it
// stores, under classSummaries/{classId}.kids.{uid}: first name and, per quest, last practice time, this week's
// days / answers / right answers, and one letter per topic level (n p l r s). Written at most every 5 minutes per kid,
// unless a level changed. Cost: 1 read + at most 1 write per class per quiz; teachers then read 1 doc per class.
const functions = require("firebase-functions");
const { db } = require("../common/admin");
const { region, runtimeOptions } = require("../common/config");
const { levelsFromStats, LEVEL_CODE } = require("../utils/topicLevels");
const { getBundledNodes } = require("../utils/bundledQuestNodes");

const DAY = 864e5;
const MIN_GAP_MS = 5 * 60 * 1000;
const istKey = (ms) => new Date(ms).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

function weekOf(daily = {}, now) {
  let days = 0;
  let answered = 0;
  let correct = 0;
  for (let i = 0; i < 7; i++) {
    const d = daily[istKey(now - i * DAY)];
    if (d && d.answered > 0) {
      days += 1;
      answered += d.answered;
      correct += d.correct || 0;
    }
  }
  return { days, answered, correct };
}

function topicDone(node, progressNodes = {}) {
  if (!node) return false;
  const stepCount = Array.isArray(node.steps) ? node.steps.length : (node.stepCount ?? 0);
  if (stepCount > 0) {
    for (let i = 0; i < stepCount; i++) {
      if (progressNodes[`${node.id}__${i}`]?.status !== "completed") return false;
    }
    return true;
  }
  return progressNodes[node.id]?.status === "completed";
}

function entryOf(after = {}, now, questNodesOrId = null) {
  const stats = after.stats || after;
  const lv = {};
  Object.entries(levelsFromStats(stats)).forEach(([topic, level]) => {
    if (level !== "new") lv[topic] = LEVEL_CODE[level];
  });
  const mistakes = {};
  if (after.mistakes && typeof after.mistakes === "object") {
    for (const m of Object.values(after.mistakes)) {
      if (m && m.branchId) {
        mistakes[m.branchId] = (mistakes[m.branchId] || 0) + 1;
      }
    }
  }

  let questNodes = null;
  if (Array.isArray(questNodesOrId)) {
    questNodes = questNodesOrId;
  } else if (typeof questNodesOrId === "string") {
    questNodes = getBundledNodes(questNodesOrId);
  } else if (after.questId) {
    questNodes = getBundledNodes(after.questId);
  }

  const completed = [];
  const nodes = after.nodes || {};

  if (Array.isArray(questNodes) && questNodes.length > 0) {
    for (const node of questNodes) {
      if (!node || node.kind === "unit") continue;
      if (node.id && topicDone(node, nodes)) {
        completed.push(node.id);
      }
    }
  } else {
    for (const [k, v] of Object.entries(nodes)) {
      if (v?.status === "completed" && !k.includes("__")) {
        completed.push(k);
      }
    }
  }

  completed.sort();

  return { at: now, last: stats.lastActiveAt || null, week: weekOf(stats.daily, now), lv, mistakes, completed };
}

const sameMap = (a = {}, b = {}) => {
  const ka = Object.keys(a || {});
  const kb = Object.keys(b || {});
  return ka.length === kb.length && ka.every((k) => a[k] === b[k]);
};

const sameLevels = sameMap;

const sameArray = (a = [], b = []) => {
  const arrA = Array.isArray(a) ? a : [];
  const arrB = Array.isArray(b) ? b : [];
  if (arrA.length !== arrB.length) return false;
  const setB = new Set(arrB);
  return arrA.every((x) => setB.has(x));
};

exports.onQuestProgressForClass = functions
  .region(region)
  .runWith(runtimeOptions)
  .firestore.document("users/{uid}/questProgress/{questId}")
  .onWrite(async (change, context) => {
    const after = change.after.exists ? change.after.data() : null;
    if (!after || !after.stats) return null;
    const before = change.before.exists ? change.before.data() : null;
    if (before && before.stats && before.stats.attempts === after.stats.attempts) return null; // map clicks, not a quiz
    const { uid, questId } = context.params;
    const user = await db.collection("users").doc(uid).get();
    const u = user.exists ? user.data() : {};
    const classIds = Array.isArray(u.classIds) ? u.classIds.slice(0, 5) : [];
    if (!classIds.length) return null;
    const now = Date.now();
    const entry = entryOf(after, now, questId);
    await Promise.all(
      classIds.map(async (classId) => {
        const ref = db.collection("classSummaries").doc(classId);
        const snap = await ref.get();
        const prev = snap.exists ? ((snap.data().kids || {})[uid] || {})[questId] : null;
        if (
          prev &&
          now - (prev.at || 0) < MIN_GAP_MS &&
          sameLevels(prev.lv, entry.lv) &&
          sameMap(prev.mistakes, entry.mistakes) &&
          sameArray(prev.completed, entry.completed)
        ) {
          return;
        }
        await ref.set({ kids: { [uid]: { name: u.firstName || "", [questId]: entry } }, updatedAt: now }, { merge: true });
      })
    );
    return null;
  });

exports._classSummaryForTests = { entryOf, weekOf, sameLevels, sameMap, sameArray, topicDone };

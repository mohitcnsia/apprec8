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

function entryOf(stats, now) {
  const lv = {};
  Object.entries(levelsFromStats(stats)).forEach(([topic, level]) => {
    if (level !== "new") lv[topic] = LEVEL_CODE[level];
  });
  return { at: now, last: stats.lastActiveAt || null, week: weekOf(stats.daily, now), lv };
}

const sameLevels = (a = {}, b = {}) => {
  const ka = Object.keys(a);
  return ka.length === Object.keys(b).length && ka.every((k) => a[k] === b[k]);
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
    const entry = entryOf(after.stats, now);
    await Promise.all(
      classIds.map(async (classId) => {
        const ref = db.collection("classSummaries").doc(classId);
        const snap = await ref.get();
        const prev = snap.exists ? ((snap.data().kids || {})[uid] || {})[questId] : null;
        if (prev && now - (prev.at || 0) < MIN_GAP_MS && sameLevels(prev.lv, entry.lv)) return;
        await ref.set({ kids: { [uid]: { name: u.firstName || "", [questId]: entry } }, updatedAt: now }, { merge: true });
      })
    );
    return null;
  });

exports._classSummaryForTests = { entryOf, weekOf, sameLevels };

// functions/callable/ownerActions.js: the owner's weekly "Is it working?" screen (redesign doc, owner: "this is critical").
// ownerWeekly (owner / app admins only): this week (Monday to now, India time) against last week. Totals only, no child's
// mood shown by name. Worked out at most once an hour (kept in ownerConfig/weeklyCache); { force: true } recomputes.
// Reads: every kid's quest progress once (≈ kids × 4 docs), this week's quiz attempts and mood taps, appreciations.
// At pilot size that is a few hundred reads an hour at most, and only when the owner opens the screen.
const functions = require("firebase-functions");
const { admin } = require("../common/admin");
const { region, runtimeOptions } = require("../common/config");

const db = admin.firestore();
const OWNER_UID = "ThOziLzf1INR9K9hxZQxOMgjcJD3";
const DAY = 864e5;
const HOUR = 3600e3;
const istKey = (ms) => new Date(ms).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
const IST = 5.5 * HOUR;

/** Monday 00:00 India time of the week containing `now` (ms). */
function weekStartMs(now) {
  const local = now + IST;
  const day = (new Date(local).getUTCDay() + 6) % 7; // Monday = 0
  const midnight = Math.floor(local / DAY) * DAY;
  return midnight - day * DAY - IST;
}

const keysBetween = (from, to) => {
  const out = [];
  for (let t = from; t < to; t += DAY) out.push(istKey(t + 1));
  return out;
};

/** The week's numbers from plain data (exported for tests). */
function summarizeWeek({ progressDocs = [], attempts = [], moods = [], appreciations = [], now }) {
  const ws = weekStartMs(now);
  const lastWs = ws - 7 * DAY;
  const thisKeys = keysBetween(ws, now);
  const lastKeys = keysBetween(lastWs, ws);
  const kids = {}; // uid → { this: {answered, correct, days:Set}, last: {...}, total: {answered, correct} }
  let learnedThisWeek = 0;
  let remembersNow = 0;
  let slippingNow = 0;
  progressDocs.forEach(({ uid, stats = {} }) => {
    const k = (kids[uid] ||= { this: { answered: 0, correct: 0, days: new Set() }, last: { answered: 0, correct: 0, days: new Set() }, total: { answered: 0, correct: 0 } });
    k.total.answered += stats.answered || 0;
    k.total.correct += stats.correct || 0;
    const daily = stats.daily || {};
    thisKeys.forEach((d) => {
      if (daily[d]?.answered) {
        k.this.answered += daily[d].answered;
        k.this.correct += daily[d].correct || 0;
        k.this.days.add(d);
      }
    });
    lastKeys.forEach((d) => {
      if (daily[d]?.answered) {
        k.last.answered += daily[d].answered;
        k.last.correct += daily[d].correct || 0;
        k.last.days.add(d);
      }
    });
    Object.values(stats.levels || {}).forEach((e) => {
      if (e.learnedAt && e.learnedAt >= ws) learnedThisWeek += 1;
      const r = e.recheck || [];
      if (e.learnedAt && r.length >= 3) {
        const share = r.reduce((x, y) => x + y, 0) / r.length;
        if (share >= 0.8) remembersNow += 1;
        else if (share < 0.6) slippingNow += 1;
      }
    });
  });
  const list = Object.values(kids);
  const practised = list.filter((k) => k.this.answered > 0).length;
  const practisedLast = list.filter((k) => k.last.answered > 0).length;
  const twoPlusDays = list.filter((k) => k.this.days.size >= 2).length;
  const answered = list.reduce((s, k) => s + k.this.answered, 0);
  const correct = list.reduce((s, k) => s + k.this.correct, 0);

  // Problem questions: strong kids (80%+ over 50+ answers) get them wrong, which usually means a wrong key or two right answers.
  const strong = new Set(Object.entries(kids).filter(([, k]) => k.total.answered >= 50 && k.total.correct / k.total.answered >= 0.8).map(([uid]) => uid));
  const q = {};
  attempts.forEach((a) => {
    (a.answers || []).forEach((x) => {
      if (!x.questionId) return;
      const key = `${a.quizId}|${x.questionId}`;
      const e = (q[key] ||= { quizId: a.quizId, questionId: x.questionId, text: x.questionText || "", answer: x.correctAnswer || "", strongTotal: 0, strongWrong: 0, total: 0, wrong: 0, picked: {} });
      e.total += 1;
      if (!x.isCorrect) {
        e.wrong += 1;
        if (x.chosen) e.picked[x.chosen] = (e.picked[x.chosen] || 0) + 1;
      }
      if (strong.has(a.userId)) {
        e.strongTotal += 1;
        if (!x.isCorrect) e.strongWrong += 1;
      }
    });
  });
  const problems = Object.values(q)
    .filter((e) => e.strongTotal >= 3 && e.strongWrong / e.strongTotal >= 0.5)
    .sort((a, b) => b.strongWrong / b.strongTotal - a.strongWrong / a.strongTotal || b.strongTotal - a.strongTotal)
    .slice(0, 8)
    .map((e) => {
      const top = Object.entries(e.picked).sort((a, b) => b[1] - a[1])[0];
      return { quizId: e.quizId, questionId: e.questionId, text: e.text.slice(0, 200), answer: e.answer, strongWrong: e.strongWrong, strongTotal: e.strongTotal, topWrong: top ? top[0] : null };
    });

  const moodCounts = {};
  let flagged = 0;
  moods.forEach((m) => {
    moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
    if (m.flag) flagged += 1;
  });
  const appreciated = appreciations.reduce((s, a) => s + (a.names || []).length, 0);

  return {
    weekStart: istKey(ws + HOUR),
    kids: { practised, practisedLast, twoPlusDays, total: list.length },
    answers: { answered, correct, accuracy: answered ? Math.round((correct / answered) * 100) : null },
    topics: { learnedThisWeek, remembersNow, slippingNow },
    problems,
    mood: { answered: moods.length, counts: moodCounts, flagged },
    appreciated,
  };
}

exports.ownerWeekly = functions
  .region(region)
  .runWith({ ...runtimeOptions, timeoutSeconds: 120, memory: "512MB" })
  .https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Sign in first.");
    const uid = context.auth.uid;
    const role = uid === OWNER_UID ? { admin: true } : (await db.collection("roles").doc(uid).get()).data() || {};
    if (role.admin !== true) throw new functions.https.HttpsError("permission-denied", "Owner only.");
    const now = Date.now();
    const cacheRef = db.collection("ownerConfig").doc("weeklyCache");
    if (!data?.force) {
      const c = (await cacheRef.get()).data();
      if (c && now - c.at < HOUR) return { ...c.data, at: c.at, cached: true };
    }
    const ws = weekStartMs(now);
    const [progress, attempts, moods, apps] = await Promise.all([
      db.collectionGroup("questProgress").get(),
      db.collection("questAttempts").where("createdAt", ">=", admin.firestore.Timestamp.fromMillis(ws)).limit(3000).get(),
      db.collection("moodTaps").where("at", ">=", ws).limit(2000).get(),
      db.collectionGroup("appreciations").get(),
    ]);
    const weekId = istKey(ws + HOUR);
    const out = summarizeWeek({
      progressDocs: progress.docs.map((d) => ({ uid: d.ref.parent.parent.id, stats: d.data().stats || {} })),
      attempts: attempts.docs.map((d) => d.data()),
      moods: moods.docs.map((d) => d.data()),
      appreciations: apps.docs.filter((d) => d.id === weekId).map((d) => d.data()),
      now,
    });
    await cacheRef.set({ at: now, data: out });
    return { ...out, at: now, cached: false };
  });

exports._ownerForTests = { summarizeWeek, weekStartMs };

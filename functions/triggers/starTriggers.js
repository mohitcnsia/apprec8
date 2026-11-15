// functions/triggers/starTriggers.js: pays stars from what the child actually did (owner spec 16 Nov 2026,
// "Stars: earning them fairly"; rules in functions/utils/starRules.js, tested in tests/starRules.test.mjs).
//
// - onQuestAttemptForStars: every saved quiz / paper (questAttempts) → new right answers, reviews, made-up questions,
//   paper bonus, streak, daily goal.
// - onQuestProgressForStars: questProgress changes → mistakes fixed in My mistakes, topics green, gates / Bosses.
//
// Server-only records (no client rule matches them, so phones can't read or change them):
//   starLedgers/{uid}__{questId}  what already paid (so replays pay nothing)
//   starDays/{uid}                today's counters + streak
// Every payment runs in one transaction and is marked (attempt.starsPaidAt, ledger.fixes/nodes), so a retried
// trigger never pays twice. The child sees users/{uid}.lastAward (the flying-stars animation) and stats.starsDaily.
const functions = require("firebase-functions");
const { db, FieldValue } = require("../common/admin");
const { region, runtimeOptions } = require("../common/config");
const { getBundledNodes } = require("../utils/bundledQuestNodes");
const { payAttempt, payProgress, istDay, trimDaily } = require("../utils/starRules");

const ledgerRef = (uid, questId) => db.collection("starLedgers").doc(`${uid}__${String(questId || "unknown").replace(/\//g, "_")}`);
const dayRef = (uid) => db.collection("starDays").doc(uid);

/** Adds the award to the user doc inside the transaction (user doc already read as `user`). */
function award(t, userRef, user, { id, stars, reasons, nowMs }) {
  const today = istDay(nowMs);
  const daily = { ...((user.stats && user.stats.starsDaily) || {}) };
  daily[today] = (daily[today] || 0) + stars;
  t.update(userRef, {
    "stats.totalStars": FieldValue.increment(stars),
    "stats.starsDaily": trimDaily(daily, today),
    lastAward: { id, at: nowMs, stars, reasons },
  });
}

exports.onQuestAttemptForStars = functions
  .region(region)
  .runWith(runtimeOptions)
  .firestore.document("questAttempts/{attemptId}")
  .onCreate(async (snap, context) => {
    const a = snap.data() || {};
    const uid = String(a.userId || "");
    if (!uid || uid.startsWith("demo_")) return null;
    const userRef = db.collection("users").doc(uid);
    const lRef = ledgerRef(uid, a.questId);
    const dRef = dayRef(uid);
    await db.runTransaction(async (t) => {
      const [att, led, day, userSnap] = await Promise.all([t.get(snap.ref), t.get(lRef), t.get(dRef), t.get(userRef)]);
      if (!att.exists || att.data().starsPaidAt || !userSnap.exists) return; // already paid (retry) or no account
      const nowMs = Date.now();
      const r = payAttempt({ attempt: att.data(), ledger: led.data(), day: day.data(), nowMs });
      t.set(lRef, r.ledger);
      t.set(dRef, r.day);
      t.update(snap.ref, { starsPaidAt: nowMs, starsPaid: r.stars });
      if (r.stars > 0) award(t, userRef, userSnap.data(), { id: context.params.attemptId, stars: r.stars, reasons: r.reasons, nowMs });
    });
    return null;
  });

exports.onQuestProgressForStars = functions
  .region(region)
  .runWith(runtimeOptions)
  .firestore.document("users/{uid}/questProgress/{questId}")
  .onWrite(async (change, context) => {
    const { uid, questId } = context.params;
    if (uid.startsWith("demo_") || !change.after.exists) return null;
    const before = change.before.exists ? change.before.data() : {};
    const after = change.after.data() || {};
    // Only mistakes or node progress can pay here; anything else (stats, map clicks) is skipped without a read.
    if (JSON.stringify(before.mistakes || {}) === JSON.stringify(after.mistakes || {}) && JSON.stringify(before.nodes || {}) === JSON.stringify(after.nodes || {})) return null;
    const questNodes = getBundledNodes(questId) || [];
    const userRef = db.collection("users").doc(uid);
    const lRef = ledgerRef(uid, questId);
    await db.runTransaction(async (t) => {
      const [led, userSnap] = await Promise.all([t.get(lRef), t.get(userRef)]);
      if (!userSnap.exists) return;
      const nowMs = Date.now();
      const r = payProgress({ before, after, ledger: led.data(), questNodes, nowMs });
      if (r.stars <= 0) return; // nothing new: leave the ledger untouched
      t.set(lRef, r.ledger);
      award(t, userRef, userSnap.data(), { id: `${questId}@${context.eventId}`, stars: r.stars, reasons: r.reasons, nowMs });
    });
    return null;
  });

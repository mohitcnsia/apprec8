// functions/callable/pushActions.js
// Weekly summary notifications (mockup V1, approved 2026-11-05). Deploy: DR-18 (owner OK, then Gemini).
// - savePushSettings: an ADULT turns the weekly summary on/off (parents, teachers). Children never get notifications.
// - weeklyParentPush: Sundays 18:30 IST. One notification per linked child.
// - weeklyTeacherPush: Mondays 07:30 IST. One notification per class (max 5 per teacher).
// Cost: FCM is free. Reads per week: parents ~1 + 4 per child; teachers ~1 + members + their progress docs per class.
const functions = require("firebase-functions");
const { admin } = require("../common/admin");
const { region, runtimeOptions } = require("../common/config");
const { weekFromStats, parentMessage, teacherMessage, mergeTokens, DAY } = require("../utils/weeklyPush");

const db = admin.firestore();
const QUESTS = ["english-quest", "science-quest", "word-power", "word-bank"];
const pushRuntime = { memory: "256MB", timeoutSeconds: 300, maxInstances: 1 };
const ROLES = ["parent", "teacher"];

exports.savePushSettings = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Sign in first.");
    const uid = context.auth.uid;
    const role = String(data?.role || "");
    if (!ROLES.includes(role)) throw new functions.https.HttpsError("invalid-argument", "Unknown summary.");
    const ref = db.collection("users").doc(uid);
    const me = await ref.get();
    const d = me.exists ? me.data() : {};
    if (d.isChild || Number.isInteger(d.grade)) throw new functions.https.HttpsError("permission-denied", "Weekly summaries are for parents and teachers.");
    if (!data.on) {
      await ref.set({ pushOptIn: { [role]: false } }, { merge: true });
      return { ok: true };
    }
    const token = String(data.token || "");
    if (token.length < 20 || token.length > 4096) throw new functions.https.HttpsError("invalid-argument", "Bad device token.");
    await ref.set({ pushOptIn: { [role]: true }, pushTokens: mergeTokens(d.pushTokens, token), pushLang: data.lang === "hi" ? "hi" : "en" }, { merge: true });
    return { ok: true };
  });

async function progressStats(uid, quests = QUESTS) {
  const snaps = await Promise.all(quests.map((q) => db.collection("users").doc(uid).collection("questProgress").doc(q).get()));
  return snaps.filter((s) => s.exists).map((s) => s.data().stats || {});
}

/** Sends to every token; drops tokens Google says are dead. */
async function send(userRef, tokens, msg, view) {
  if (!tokens?.length) return 0;
  const res = await admin.messaging().sendEachForMulticast({
    tokens,
    notification: { title: msg.title, body: msg.body },
    data: { view },
    android: { priority: "normal" },
  });
  const dead = [];
  res.responses.forEach((r, i) => {
    const code = r.error?.code || "";
    if (!r.success && /registration-token-not-registered|invalid-registration-token|invalid-argument/.test(code)) dead.push(tokens[i]);
  });
  if (dead.length) await userRef.set({ pushTokens: tokens.filter((t) => !dead.includes(t)) }, { merge: true });
  return res.successCount;
}

async function parentsRun(now = Date.now()) {
  const parents = await db.collection("users").where("pushOptIn.parent", "==", true).limit(1000).get();
  let sent = 0;
  for (const p of parents.docs) {
    if (p.id.startsWith("demo_")) continue;
    const d = p.data();
    for (const kidUid of (d.childUids || []).slice(0, 6)) {
      const kid = await db.collection("users").doc(kidUid).get();
      if (!kid.exists || !(kid.data().parentUids || []).includes(p.id)) continue;
      const w = weekFromStats(await progressStats(kidUid), now);
      sent += await send(p.ref, d.pushTokens, parentMessage({ name: kid.data().firstName, days: w.days, minutes: w.minutes, lang: d.pushLang }), "family");
    }
  }
  return sent;
}

async function teachersRun(now = Date.now()) {
  const teachers = await db.collection("users").where("pushOptIn.teacher", "==", true).limit(500).get();
  let sent = 0;
  for (const t of teachers.docs) {
    if (t.id.startsWith("demo_")) continue;
    const d = t.data();
    for (const classId of (d.teachesClassIds || []).slice(0, 5)) {
      const cls = await db.collection("classes").doc(classId).get();
      if (!cls.exists || !(cls.data().teacherIds || []).includes(t.id)) continue;
      const members = (await cls.ref.collection("members").where("status", "==", "approved").limit(60).get()).docs;
      let active = 0;
      for (const m of members) if (weekFromStats(await progressStats(m.id), now).days > 0) active++;
      sent += await send(t.ref, d.pushTokens, teacherMessage({ className: cls.data().name, active, total: members.length }), "classes");
    }
  }
  return sent;
}

exports.weeklyParentPush = functions
  .region(region)
  .runWith(pushRuntime)
  .pubsub.schedule("every sunday 18:30")
  .timeZone("Asia/Kolkata")
  .onRun(async () => {
    console.log(`weeklyParentPush: sent ${await parentsRun()}`);
    return null;
  });

exports.weeklyTeacherPush = functions
  .region(region)
  .runWith(pushRuntime)
  .pubsub.schedule("every monday 07:30")
  .timeZone("Asia/Kolkata")
  .onRun(async () => {
    console.log(`weeklyTeacherPush: sent ${await teachersRun()}`);
    return null;
  });

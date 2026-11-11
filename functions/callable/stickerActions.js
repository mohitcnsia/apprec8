// functions/callable/stickerActions.js: teachers appreciate and nudge (owner + Seema, 2026-11-11).
// - Appreciate (public, kind): a sticker in the kid's collection (users/{uid}.stickers, newest 60) and the kid's first name
//   on the class's "appreciated this week" list (classes/{id}/appreciations/{week}, shown on the class board).
// - Nudge / Cheer on (private): one kind note on that kid's Home (users/{uid}.nudge); nobody else sees it.
// Only a teacher of the class (or the app admin) can send, and only to approved kids in that class. No phone alerts
// (children never get notifications). One appreciation per kid per topic per week; at most 200 kids per teacher per day.
const functions = require("firebase-functions");
const { admin } = require("../common/admin");
const { region, runtimeOptions } = require("../common/config");

const db = admin.firestore();
const OWNER_UID = "ThOziLzf1INR9K9hxZQxOMgjcJD3";
const KINDS = ["appreciate", "nudge", "cheer"];
const STICKERS = ["🌟", "🏅", "🚀", "🦉", "🌈", "🎖️", "🦋", "🏆"];
const DAY = 864e5;
const istKey = (ms) => new Date(ms).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

/** ISO-like week key (Monday start, India time), same idea as the class board's week. */
function weekKey(now) {
  const d = new Date(new Date(now).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
}

function pick(seed) {
  let h = 0;
  for (const c of String(seed)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return STICKERS[h % STICKERS.length];
}

exports.sendSticker = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Sign in first.");
    const caller = context.auth.uid;
    const kind = String(data?.kind || "");
    if (!KINDS.includes(kind)) throw new functions.https.HttpsError("invalid-argument", "Unknown kind.");
    const classId = String(data?.classId || "");
    const topic = String(data?.topic || "").slice(0, 60) || null;
    const toUids = Array.isArray(data?.toUids) ? [...new Set(data.toUids.map(String))].slice(0, 60) : [];
    if (!classId || !toUids.length) throw new functions.https.HttpsError("invalid-argument", "Nobody to send to.");

    const cls = await db.collection("classes").doc(classId).get();
    if (!cls.exists) throw new functions.https.HttpsError("not-found", "No such class.");
    const isTeacher = (cls.data().teacherIds || []).includes(caller);
    if (!isTeacher && caller !== OWNER_UID) throw new functions.https.HttpsError("permission-denied", "Only this class's teacher.");

    const now = Date.now();
    const limitRef = db.collection("stickerLimits").doc(`${caller}_${istKey(now)}`);
    const limit = (await limitRef.get()).data()?.count || 0;
    if (limit + toUids.length > 200) throw new functions.https.HttpsError("resource-exhausted", "That's a lot for one day. Try again tomorrow.");

    const members = await db.getAll(...toUids.map((u) => cls.ref.collection("members").doc(u)));
    const ok = members.filter((m) => m.exists && m.data().status === "approved");
    const teacherDoc = await db.collection("users").doc(caller).get();
    const from = (teacherDoc.data() || {}).firstName || "Your teacher";
    const week = weekKey(now);
    const appRef = cls.ref.collection("appreciations").doc(week);
    const appDoc = kind === "appreciate" ? (await appRef.get()).data() || {} : {};
    const given = new Set(appDoc.given || []); // `${uid}|${topic}` this week

    let sent = 0;
    const names = [];
    const batch = db.batch();
    const users = kind === "appreciate" && ok.length ? await db.getAll(...ok.map((m) => db.collection("users").doc(m.id))) : [];
    const userData = Object.fromEntries(users.map((u) => [u.id, u.exists ? u.data() : {}]));
    for (const m of ok) {
      const uid = m.id;
      const userRef = db.collection("users").doc(uid);
      if (kind === "appreciate") {
        const tag = `${uid}|${topic || ""}`;
        if (given.has(tag)) continue;
        given.add(tag);
        const sticker = { emoji: pick(`${uid}${topic}${now}`), from, topic, classId, at: now };
        const list = [...((userData[uid] || {}).stickers || []), sticker].slice(-60); // newest 60 on the kid's doc
        batch.set(userRef, { stickers: list, stickerCount: admin.firestore.FieldValue.increment(1) }, { merge: true });
        names.push(m.data().firstName || "");
      } else {
        batch.set(userRef, { nudge: { kind, from, topic, classId, at: now, until: now + 3 * DAY } }, { merge: true });
      }
      sent += 1;
    }
    if (kind === "appreciate" && sent) {
      batch.set(
        appRef,
        { names: admin.firestore.FieldValue.arrayUnion(...names.filter(Boolean)), given: [...given].slice(-500), from, updatedAt: now },
        { merge: true }
      );
    }
    if (sent) batch.set(limitRef, { count: limit + sent, at: now }, { merge: true });
    await batch.commit();
    return { ok: true, sent, skipped: toUids.length - sent };
  });

exports._stickerForTests = { weekKey, pick };

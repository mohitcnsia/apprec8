// functions/callable/demoActions.js
// Demo School (spec + owner answers: CODE_REVIEW.md, 2026-11-05). Deploy: Gemini/owner (Claude does not deploy).
// - seedDemoSchool (admin only): deletes the old demo data, writes the new one built in the app (utils/demoSchool.js)
//   and creates/updates the 3 demo logins (@example.com). The password comes from the admin and is never stored.
// - shiftDemoSchool (Sundays 19:00 IST): moves every demo date forward so the class always looks current.
// Cost: about 1,100 writes per reset, ~1,100 per weekly shift (free tier: 20,000 writes a day). maxInstances 1.
const functions = require("firebase-functions");
const { admin } = require("../common/admin");
const { region } = require("../common/config");
const { checkDemoOps, withTimestamps, shiftDays, shiftStats, shiftDayKey, DAY } = require("../utils/demoShift");

const db = admin.firestore();
const { Timestamp } = require("firebase-admin/firestore");
const OWNER_UID = "ThOziLzf1INR9K9hxZQxOMgjcJD3";
const demoRuntime = { memory: "512MB", timeoutSeconds: 300, maxInstances: 1 };

const LOGINS = [
  { uid: "demo_teacher", email: "demo.teacher@example.com", displayName: "Demo Teacher" },
  { uid: "demo_parent", email: "demo.parent@example.com", displayName: "Demo Parent" },
  { uid: "demo_kid_login", email: "demo.kid@example.com", displayName: "Riya" },
];

async function isAppAdmin(uid) {
  if (uid === OWNER_UID) return true;
  const r = await db.collection("roles").doc(uid).get();
  return r.exists && r.data().admin === true;
}

/** Every demo document (and its sub-collections) goes. Only ids starting with demo_ are touched. */
async function deleteDemoData() {
  const writer = db.bulkWriter();
  let deleted = 0;
  for (const col of ["users", "classes", "schools"]) {
    const snap = await db.collection(col).where("isDemo", "==", true).limit(500).get();
    for (const d of snap.docs) {
      if (!d.id.startsWith("demo_")) continue; // belt and braces: never a real document
      await db.recursiveDelete(d.ref, writer);
      deleted++;
    }
  }
  const attempts = await db.collection("questAttempts").where("isDemo", "==", true).limit(3000).get();
  attempts.docs.forEach((d) => {
    if (d.id.startsWith("demo_")) {
      writer.delete(d.ref);
      deleted++;
    }
  });
  await writer.close();
  return deleted;
}

async function upsertLogin({ uid, email, displayName }, password) {
  try {
    await admin.auth().updateUser(uid, { email, displayName, password, emailVerified: true });
  } catch (e) {
    if (e.code !== "auth/user-not-found") throw e;
    await admin.auth().createUser({ uid, email, displayName, password, emailVerified: true });
  }
}

/** { ops, password } → { deleted, written } (admin only). */
exports.seedDemoSchool = functions
  .region(region)
  .runWith(demoRuntime)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Sign in first.");
    if (!(await isAppAdmin(context.auth.uid))) throw new functions.https.HttpsError("permission-denied", "Admins only.");
    const password = String(data?.password || "");
    if (password.length < 8) throw new functions.https.HttpsError("invalid-argument", "The demo password needs 8+ characters.");
    try {
      checkDemoOps(data?.ops);
    } catch (e) {
      throw new functions.https.HttpsError("invalid-argument", e.message);
    }
    const deleted = await deleteDemoData();
    const writer = db.bulkWriter();
    data.ops.forEach((op) => writer.set(db.doc(op.path), withTimestamps(op, (ms) => Timestamp.fromMillis(ms))));
    await writer.close();
    for (const l of LOGINS) await upsertLogin(l, password);
    console.log(`seedDemoSchool by ${context.auth.uid}: deleted ${deleted}, wrote ${data.ops.length}`);
    return { deleted, written: data.ops.length, logins: LOGINS.map((l) => l.email) };
  });

const plusDays = (ts, days) => (ts && typeof ts.toMillis === "function" ? Timestamp.fromMillis(ts.toMillis() + days * DAY) : ts);

/** Moves the demo class forward to "now" (no-op if no demo data or less than a day has passed). */
async function shiftDemo(now = Date.now()) {
  const metaRef = db.doc("demo/meta");
  const meta = await metaRef.get();
  if (!meta.exists) return { days: 0 };
  const days = shiftDays(meta.data().anchorMs || now, now);
  if (days < 1) return { days: 0 };
  const writer = db.bulkWriter();
  const users = await db.collection("users").where("isDemo", "==", true).limit(200).get();
  for (const u of users.docs) {
    if (!u.id.startsWith("demo_")) continue;
    const progress = await u.ref.collection("questProgress").get();
    progress.docs.forEach((p) => {
      const d = p.data();
      const nodes = Object.fromEntries(
        Object.entries(d.nodes || {}).map(([id, n]) => [id, { ...n, lastPlayedAt: plusDays(n.lastPlayedAt, days), ...(n.completedAt ? { completedAt: plusDays(n.completedAt, days) } : {}) }])
      );
      writer.set(p.ref, { ...d, nodes, stats: shiftStats(d.stats, days) });
    });
  }
  const attempts = await db.collection("questAttempts").where("isDemo", "==", true).limit(3000).get();
  attempts.docs.forEach((a) => {
    if (!a.id.startsWith("demo_")) return;
    const d = a.data();
    writer.update(a.ref, { createdAt: plusDays(d.createdAt, days), startedAtMs: (d.startedAtMs || 0) + days * DAY });
  });
  const classes = await db.collection("classes").where("isDemo", "==", true).limit(20).get();
  for (const c of classes.docs) {
    if (!c.id.startsWith("demo_")) continue;
    const asg = await c.ref.collection("assignments").get();
    asg.docs.forEach((a) => {
      const d = a.data();
      writer.update(a.ref, { createdAt: plusDays(d.createdAt, days), ...(d.dueDate ? { dueDate: shiftDayKey(d.dueDate, days) } : {}) });
    });
  }
  writer.update(metaRef, { anchorMs: (meta.data().anchorMs || now) + days * DAY, shiftedAt: now });
  await writer.close();
  return { days };
}

exports.shiftDemoSchool = functions
  .region(region)
  .runWith(demoRuntime)
  .pubsub.schedule("every sunday 19:00")
  .timeZone("Asia/Kolkata")
  .onRun(async () => {
    const r = await shiftDemo();
    console.log(`shiftDemoSchool: moved ${r.days} days`);
    return null;
  });


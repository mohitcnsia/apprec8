// functions/callable/schoolActions.js
// RB-2 phase A (2026-11-04). Admin helpers that need the server (the client can't search users by email).
// Only the owner, app admins (roles/{uid}.admin) and school admins may call these. Deploy: DR-9 in CODE_REVIEW.md.
const functions = require("firebase-functions");
const { admin } = require("../common/admin");
const { region, runtimeOptions } = require("../common/config");

const db = admin.firestore();
const OWNER_UID = "ThOziLzf1INR9K9hxZQxOMgjcJD3";

async function isAppAdmin(uid) {
  if (uid === OWNER_UID) return true;
  const r = await db.collection("roles").doc(uid).get();
  return r.exists && r.data().admin === true;
}

async function isSchoolAdmin(uid, schoolId) {
  if (!schoolId) return false;
  const s = await db.collection("schools").doc(schoolId).get();
  return s.exists && Array.isArray(s.data().admins) && s.data().admins.includes(uid);
}

/** { email, schoolId? } → { uid, firstName } for an existing account (the teacher signs in once first). */
exports.findUserByEmail = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Sign in first.");
    const caller = context.auth.uid;
    if (!(await isAppAdmin(caller)) && !(await isSchoolAdmin(caller, data?.schoolId))) {
      throw new functions.https.HttpsError("permission-denied", "Only admins and school admins can do this.");
    }
    const email = String(data?.email || "").trim().toLowerCase();
    if (!email.includes("@")) throw new functions.https.HttpsError("invalid-argument", "That isn't an email address.");
    try {
      const user = await admin.auth().getUserByEmail(email);
      const doc = await db.collection("users").doc(user.uid).get();
      return { uid: user.uid, firstName: (doc.exists && doc.data().firstName) || user.displayName || email.split("@")[0] };
    } catch (e) {
      throw new functions.https.HttpsError("not-found", "No account with that email yet. Ask them to sign in to Apprec8 once.");
    }
  });

/** { classId, teacherUid, subjects[] } → adds a teacher to a class (app admins, or that school's admins). */
exports.assignTeacher = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Sign in first.");
    const SUBJECTS = ["english", "science", "maths", "wordpower"];
    const { classId, teacherUid } = data || {};
    const subjects = (data?.subjects || []).filter((s) => SUBJECTS.includes(s));
    if (!classId || !teacherUid || !subjects.length) {
      throw new functions.https.HttpsError("invalid-argument", "Class, teacher and at least one subject are needed.");
    }
    const classRef = db.collection("classes").doc(classId);
    const cls = await classRef.get();
    if (!cls.exists) throw new functions.https.HttpsError("not-found", "Class not found.");
    const caller = context.auth.uid;
    if (!(await isAppAdmin(caller)) && !(await isSchoolAdmin(caller, cls.data().schoolId))) {
      throw new functions.https.HttpsError("permission-denied", "Only admins and this school's admins can do this.");
    }
    const { FieldValue } = require("firebase-admin/firestore");
    const batch = db.batch();
    batch.update(classRef, { teacherIds: FieldValue.arrayUnion(teacherUid), [`teacherSubjects.${teacherUid}`]: subjects });
    batch.set(db.collection("users").doc(teacherUid), { teachesClassIds: FieldValue.arrayUnion(classId) }, { merge: true });
    await batch.commit();
    return { ok: true };
  });

// ---------- Weekly class leaderboard + claps (owner idea, 2026-11-04) ----------
// Points = right answers in the last 7 days across tile quests (from questProgress stats.daily). First names only.
const QUESTS = ["english-quest", "science-quest", "word-power"];
const dayKeyUtc = (ms) => new Date(ms + 5.5 * 3600 * 1000).toISOString().slice(0, 10); // India day
const weekKey = (ms) => {
  const d = new Date(ms + 5.5 * 3600 * 1000);
  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return monday.toISOString().slice(0, 10);
};

async function memberOrTeacher(uid, classId) {
  const cls = await db.collection("classes").doc(classId).get();
  if (!cls.exists) return null;
  const isTeacher = (cls.data().teacherIds || []).includes(uid);
  const m = await db.collection("classes").doc(classId).collection("members").doc(uid).get();
  const isMember = m.exists && m.data().status === "approved";
  return isTeacher || isMember || (await isAppAdmin(uid)) ? cls : null;
}

exports.getClassLeaderboard = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Sign in first.");
    const classId = data?.classId;
    const cls = await memberOrTeacher(context.auth.uid, classId);
    if (!cls) throw new functions.https.HttpsError("permission-denied", "Only this class can see its board.");
    const now = Date.now();
    const days = Array.from({ length: 7 }, (_, i) => dayKeyUtc(now - i * 86400000));
    const members = await db.collection("classes").doc(classId).collection("members").get();
    const week = weekKey(now);
    const clapsDoc = await db.collection("classes").doc(classId).collection("claps").doc(week).get();
    const claps = clapsDoc.exists ? clapsDoc.data().counts || {} : {};
    const rows = [];
    for (const m of members.docs.filter((d) => d.data().status === "approved")) {
      let points = 0;
      for (const q of QUESTS) {
        const p = await db.collection("users").doc(m.id).collection("questProgress").doc(q).get();
        const daily = (p.exists && p.data().stats && p.data().stats.daily) || {};
        days.forEach((k) => (points += (daily[k] && daily[k].correct) || 0));
      }
      rows.push({ uid: m.id, firstName: m.data().firstName || "Kid", points, claps: claps[m.id] || 0 });
    }
    rows.sort((a, b) => b.points - a.points || a.firstName.localeCompare(b.firstName));
    return { className: cls.data().name, week, rows: rows.map((r, i) => ({ ...r, rank: i + 1 })) };
  });

/** One clap per kid, per classmate, per day. */
exports.clapForClassmate = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Sign in first.");
    const from = context.auth.uid;
    const { classId, toUid } = data || {};
    if (!classId || !toUid || toUid === from) throw new functions.https.HttpsError("invalid-argument", "Pick a classmate.");
    const classRef = db.collection("classes").doc(classId);
    const [a, b] = await Promise.all([classRef.collection("members").doc(from).get(), classRef.collection("members").doc(toUid).get()]);
    if (!a.exists || !b.exists || a.data().status !== "approved" || b.data().status !== "approved") {
      throw new functions.https.HttpsError("permission-denied", "You can clap for your own classmates.");
    }
    const now = Date.now();
    const logRef = classRef.collection("clapLog").doc(`${dayKeyUtc(now)}_${from}_${toUid}`);
    const weekRef = classRef.collection("claps").doc(weekKey(now));
    const { FieldValue } = require("firebase-admin/firestore");
    const ok = await db.runTransaction(async (t) => {
      if ((await t.get(logRef)).exists) return false;
      t.set(logRef, { at: FieldValue.serverTimestamp() });
      t.set(weekRef, { counts: { [toUid]: FieldValue.increment(1) } }, { merge: true });
      return true;
    });
    return { ok, message: ok ? "👏 Clap sent!" : "You already clapped for them today." };
  });

/** { classId, kidUid, approve } → the class's teacher (or an admin) approves or rejects a join request. */
exports.approveMember = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Sign in first.");
    const { classId, kidUid, approve } = data || {};
    const classRef = db.collection("classes").doc(String(classId || ""));
    const cls = await classRef.get();
    if (!cls.exists) throw new functions.https.HttpsError("not-found", "Class not found.");
    const caller = context.auth.uid;
    const allowed = (cls.data().teacherIds || []).includes(caller) || (await isAppAdmin(caller)) || (await isSchoolAdmin(caller, cls.data().schoolId));
    if (!allowed) throw new functions.https.HttpsError("permission-denied", "Only this class's teacher can approve.");
    const memberRef = classRef.collection("members").doc(String(kidUid || ""));
    if (!(await memberRef.get()).exists) throw new functions.https.HttpsError("not-found", "No request from this child.");
    const { FieldValue } = require("firebase-admin/firestore");
    const userRef = db.collection("users").doc(kidUid);
    const batch = db.batch();
    if (approve) {
      batch.update(memberRef, { status: "approved", approvedBy: caller, approvedAt: FieldValue.serverTimestamp() });
      batch.set(userRef, { classIds: FieldValue.arrayUnion(classId), pendingClassIds: FieldValue.arrayRemove(classId) }, { merge: true });
    } else {
      batch.delete(memberRef);
      batch.set(userRef, { pendingClassIds: FieldValue.arrayRemove(classId) }, { merge: true });
    }
    await batch.commit();
    return { ok: true };
  });

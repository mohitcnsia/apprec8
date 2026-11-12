// functions/callable/schoolActions.js
// RB-2 phase A (2026-11-04). Admin helpers that need the server (the client can't search users by email).
// Only the owner, app admins (roles/{uid}.admin) and school admins may call these. Deploy: DR-9 in CODE_REVIEW.md.
const functions = require("firebase-functions");
const { admin } = require("../common/admin");
const { region, runtimeOptions } = require("../common/config");
const { cachedResult } = require("../utils/serverCache");
const { teacherWaitingMessage, studentWaitingMessage } = require("../utils/pendingPush");
const { sendThrottledPushToUser } = require("../utils/throttledPush");

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
const QUESTS = ["english-quest", "science-quest", "word-power", "word-bank"]; // word-bank = Treasure Words
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
    const week = weekKey(now);
    const classRef = db.collection("classes").doc(classId);
    // Cost guard (2026-11-05): the points (1 read per kid per quest) are computed at most once per hour per class and
    // kept in classes/{id}/cache/board (server-only). Claps are read fresh each time so a clap shows at once.
    // Owner, 2026-11-10 (card "progress-refresh-rules"): the class board is recomputed once per clock hour; the app shows
    // "Keep practising! Next update at 9:30 pm" from nextAt.
    const hour = Math.floor(now / 3600000);
    const nextAt = (hour + 1) * 3600000;
    const base = await cachedResult(classRef.collection("cache").doc("board"), { key: `${week}|${hour}`, now, maxAgeMs: 3600000 }, async () => {
      const members = await classRef.collection("members").get();
      const approved = members.docs.filter((d) => d.data().status === "approved");
      return Promise.all(
        approved.map(async (m) => {
          const progress = await Promise.all(
            QUESTS.map((q) => db.collection("users").doc(m.id).collection("questProgress").doc(q).get())
          );
          let points = 0;
          for (const p of progress) {
            const daily = (p.exists && p.data().stats && p.data().stats.daily) || {};
            days.forEach((k) => (points += (daily[k] && daily[k].correct) || 0));
          }
          return { uid: m.id, firstName: m.data().firstName || "Kid", points };
        })
      );
    });
    // Teachers' appreciation this week (stickerActions.js): first names shown on the class board. Its own week key.
    const appWeek = require("./stickerActions")._stickerForTests.weekKey(now);
    const appDoc = await classRef.collection("appreciations").doc(appWeek).get();
    const appreciated = appDoc.exists ? (appDoc.data().names || []).slice(0, 30) : [];
    const clapsDoc = await classRef.collection("claps").doc(week).get();
    const claps = clapsDoc.exists ? clapsDoc.data().counts || {} : {};
    const rows = base.map((r) => ({ ...r, claps: claps[r.uid] || 0 }));
    rows.sort((a, b) => b.points - a.points || a.firstName.localeCompare(b.firstName));
    return { className: cls.data().name, week, nextAt, appreciated, rows: rows.map((r, i) => ({ ...r, rank: i + 1 })) };
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
    const memberSnap = await memberRef.get();
    if (!memberSnap.exists) throw new functions.https.HttpsError("not-found", "No request from this child.");
    // A student who asked from their own phone (studentJoinByLink): the teacher confirms the parent said yes
    // (WhatsApp YES, a slip, a call or in person). Stored as the consent record (owner, 2026-11-11).
    const PARENT_YES = ["whatsapp", "slip", "call", "in-person"];
    const needsParentYes = approve && memberSnap.data().consentBy === "teacher-confirms";
    if (needsParentYes && !PARENT_YES.includes(data?.parentSaidYes)) {
      throw new functions.https.HttpsError("failed-precondition", "First ask the parent: did they say yes (WhatsApp, slip, call)?");
    }
    // Demo School stays apart: a demo child never joins a real class, a real child never joins a demo class (G38).
    if (approve && String(kidUid).startsWith("demo_") !== String(classId).startsWith("demo_")) {
      throw new functions.https.HttpsError("failed-precondition", "Demo accounts and real classes can't mix.");
    }
    const { FieldValue } = require("firebase-admin/firestore");
    const userRef = db.collection("users").doc(kidUid);
    const batch = db.batch();
    if (approve) {
      const consentRef = needsParentYes ? db.collection("consents").doc() : null;
      if (needsParentYes) {
        batch.set(consentRef, {
          kind: "class-join",
          via: "teacher-confirmed",
          method: data.parentSaidYes,
          kidUid,
          classId,
          parentMobile: memberSnap.data().parentMobile || null,
          confirmedBy: caller,
          acceptedAt: FieldValue.serverTimestamp(),
        });
      }
      batch.update(memberRef, {
        status: "approved",
        approvedBy: caller,
        approvedAt: FieldValue.serverTimestamp(),
        ...(needsParentYes ? { consentBy: "teacher-confirmed", consentId: consentRef.id } : {}),
      });
      batch.set(userRef, { classIds: FieldValue.arrayUnion(classId), pendingClassIds: FieldValue.arrayRemove(classId) }, { merge: true });
    } else {
      batch.delete(memberRef);
      // Decline a request, or remove an approved kid (G97, Gemini; merged 2026-11-12): the class goes from both lists.
      batch.set(userRef, { classIds: FieldValue.arrayRemove(classId), pendingClassIds: FieldValue.arrayRemove(classId) }, { merge: true });
    }
    batch.delete(classRef.collection("cache").doc("board")); // a new classmate shows on the board straight away
    batch.delete(db.collection("followUps").doc(`${classRef.id}__${kidUid}`)); // settled: off the follow-up list
    await batch.commit();
    return { ok: true };
  });

// ---------- Teacher invites: no email needed (owner 2026-11-05, mockup L4) ----------
// An admin makes a one-time code for a class + subjects and shares it (WhatsApp, SMS…). The teacher signs in with the
// Google account on their phone, enters the code (Me → Join as a teacher), and the admin approves the request.
// invites/{code}                      { classId, schoolId, subjects, createdBy, createdAt, expiresAtMs, usedBy }
// classes/{id}/teacherRequests/{uid}  { firstName, subjects, code, requestedAt }   (server only: no client rules)
const INVITE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // same look-alike-free set as class codes
const INVITE_DAYS = 7;
const TEACHER_SUBJECTS = ["english", "science", "maths", "wordpower"];

async function canManageClass(uid, cls) {
  return (await isAppAdmin(uid)) || (await isSchoolAdmin(uid, cls.data().schoolId));
}

/** { classId, subjects[] } → { code, expiresAtMs } (app admins and that school's admins). */
exports.createTeacherInvite = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Sign in first.");
    const subjects = (data?.subjects || []).filter((s) => TEACHER_SUBJECTS.includes(s));
    const cls = await db.collection("classes").doc(String(data?.classId || "")).get();
    if (!cls.exists) throw new functions.https.HttpsError("not-found", "Class not found.");
    if (!subjects.length) throw new functions.https.HttpsError("invalid-argument", "Pick at least one subject.");
    if (!(await canManageClass(context.auth.uid, cls))) {
      throw new functions.https.HttpsError("permission-denied", "Only admins and this school's admins can invite teachers.");
    }
    const { FieldValue } = require("firebase-admin/firestore");
    for (let attempt = 0; attempt < 6; attempt++) {
      let code = "T";
      for (let i = 0; i < 5; i++) code += INVITE_CHARS[Math.floor(Math.random() * INVITE_CHARS.length)];
      const ref = db.collection("invites").doc(code);
      const expiresAtMs = Date.now() + INVITE_DAYS * 24 * 3600 * 1000;
      const created = await db.runTransaction(async (t) => {
        if ((await t.get(ref)).exists) return false;
        t.set(ref, { classId: cls.id, schoolId: cls.data().schoolId || null, subjects, createdBy: context.auth.uid, createdAt: FieldValue.serverTimestamp(), expiresAtMs, usedBy: null });
        return true;
      });
      if (created) return { code, expiresAtMs };
    }
    throw new functions.https.HttpsError("internal", "Couldn't make a code. Try again.");
  });

/** { code } → { className, schoolName, subjects } after filing a request the admin approves. */
exports.redeemTeacherInvite = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Sign in first.");
    const uid = context.auth.uid;
    const code = String(data?.code || "").toUpperCase().replace(/[\s-]/g, "");
    const ref = db.collection("invites").doc(code);
    const { FieldValue } = require("firebase-admin/firestore");
    const result = await db.runTransaction(async (t) => {
      const inv = await t.get(ref);
      if (!code || !inv.exists) throw new functions.https.HttpsError("not-found", "That code doesn't match an invite. Check it with the school.");
      const v = inv.data();
      if (v.usedBy && v.usedBy !== uid) throw new functions.https.HttpsError("failed-precondition", "This code was already used. Ask for a new one.");
      if (Date.now() > v.expiresAtMs) throw new functions.https.HttpsError("deadline-exceeded", "This code has expired. Ask for a new one.");
      const clsRef = db.collection("classes").doc(v.classId);
      const cls = await t.get(clsRef);
      if (!cls.exists) throw new functions.https.HttpsError("not-found", "That class no longer exists.");
      const user = await t.get(db.collection("users").doc(uid));
      if (user.exists && user.data().isChild) throw new functions.https.HttpsError("permission-denied", "Teachers join from their own account, not a child's.");
      const firstName = (user.exists && String(user.data().firstName || "").trim()) || (context.auth.token.name || "Teacher").split(" ")[0];
      t.update(ref, { usedBy: uid, usedAt: FieldValue.serverTimestamp() });
      t.set(clsRef.collection("teacherRequests").doc(uid), { firstName, subjects: v.subjects, code, requestedAt: FieldValue.serverTimestamp() });
      // So "Delete my account" finds a request that was never approved (G42 finding 3).
      t.set(db.collection("users").doc(uid), { pendingTeachClassIds: FieldValue.arrayUnion(clsRef.id) }, { merge: true });
      return { className: cls.data().name, schoolName: cls.data().schoolName || "", subjects: v.subjects, classId: cls.id, schoolId: v.schoolId || cls.data().schoolId, teacherName: firstName };
    });

    // Notify school creator, school admins and the owner (G84 DR-25)
    try {
      const schoolDoc = result.schoolId ? await db.collection("schools").doc(result.schoolId).get() : null;
      const schoolCreator = schoolDoc && schoolDoc.exists ? schoolDoc.data().createdBy : null;
      const schoolAdmins = (schoolDoc && schoolDoc.exists && schoolDoc.data().admins) || [];
      const recipients = Array.from(new Set([schoolCreator, ...schoolAdmins, OWNER_UID].filter(Boolean)));
      const msg = teacherWaitingMessage({ teacherName: result.teacherName, className: result.className });
      for (const rUid of recipients) {
        await sendThrottledPushToUser(rUid, msg, "schools");
      }
    } catch (err) {
      console.warn("redeemTeacherInvite push warning:", err);
    }

    return { className: result.className, schoolName: result.schoolName, subjects: result.subjects };
  });

/** When a student asks to join a class, notify that class's teachers (G84 DR-25). */
exports.onStudentJoinRequest = functions
  .region(region)
  .runWith(runtimeOptions)
  .firestore.document("classes/{classId}/members/{kidUid}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    if (data?.status !== "pending") return null;
    const classId = context.params.classId;
    const clsDoc = await db.collection("classes").doc(classId).get();
    if (!clsDoc.exists) return null;
    const teacherIds = clsDoc.data().teacherIds || [];
    const msg = studentWaitingMessage({ studentName: data.firstName, className: clsDoc.data().name });
    for (const tUid of teacherIds) {
      await sendThrottledPushToUser(tUid, msg, "classes");
    }
    return null;
  });

/** → { requests: [{ classId, className, count }] }: teachers waiting in the classes the caller manages (Home "Needs you",
 * Schools list). One collection-group read; the client can't read teacherRequests itself (owner bug, 2026-11-10). */
exports.myTeacherRequests = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Sign in first.");
    const uid = context.auth.uid;
    const appAdmin = await isAppAdmin(uid);
    let schoolIds = null;
    if (!appAdmin) {
      const s = await db.collection("schools").where("admins", "array-contains", uid).limit(20).get();
      schoolIds = new Set(s.docs.map((d) => d.id));
      if (!schoolIds.size) return { requests: [] };
    }
    const snap = await db.collectionGroup("teacherRequests").limit(200).get();
    const byClass = {};
    snap.docs.forEach((d) => {
      const classId = d.ref.parent.parent.id;
      byClass[classId] = (byClass[classId] || 0) + 1;
    });
    const ids = Object.keys(byClass);
    if (!ids.length) return { requests: [] };
    const classes = await db.getAll(...ids.map((id) => db.collection("classes").doc(id)));
    const requests = classes
      .filter((c) => c.exists && (appAdmin || schoolIds.has(c.data().schoolId)))
      .map((c) => ({ classId: c.id, className: c.data().name || "a class", schoolId: c.data().schoolId || null, count: byClass[c.id] }));
    return { requests };
  });

/** { classId } → { teachers: [{ uid, firstName, subjects }], requests: [{ uid, firstName, subjects }] } */
exports.classTeam = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Sign in first.");
    const cls = await db.collection("classes").doc(String(data?.classId || "")).get();
    if (!cls.exists) throw new functions.https.HttpsError("not-found", "Class not found.");
    const caller = context.auth.uid;
    const isTeacher = (cls.data().teacherIds || []).includes(caller);
    if (!isTeacher && !(await canManageClass(caller, cls))) throw new functions.https.HttpsError("permission-denied", "Not your class.");
    const ids = cls.data().teacherIds || [];
    const docs = ids.length ? await db.getAll(...ids.map((id) => db.collection("users").doc(id))) : [];
    const teachers = docs.map((d) => ({
      uid: d.id,
      firstName: (d.exists && String(d.data().firstName || "").trim().split(/\s+/)[0]) || "Teacher",
      subjects: (cls.data().teacherSubjects || {})[d.id] || [],
    }));
    const reqSnap = await cls.ref.collection("teacherRequests").get();
    const requests = reqSnap.docs.map((d) => ({ uid: d.id, firstName: d.data().firstName || "Teacher", subjects: d.data().subjects || [] }));
    return { teachers, requests };
  });

/** { classId, uid, approve } → approve adds the teacher (like assignTeacher); either way the request is removed. */
exports.decideTeacherRequest = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Sign in first.");
    const classRef = db.collection("classes").doc(String(data?.classId || ""));
    const cls = await classRef.get();
    if (!cls.exists) throw new functions.https.HttpsError("not-found", "Class not found.");
    if (!(await canManageClass(context.auth.uid, cls))) throw new functions.https.HttpsError("permission-denied", "Only admins and this school's admins can approve teachers.");
    const uid = String(data?.uid || "");
    const reqRef = classRef.collection("teacherRequests").doc(uid);
    const req = await reqRef.get();
    if (!req.exists) throw new functions.https.HttpsError("not-found", "No request from this teacher.");
    const { FieldValue } = require("firebase-admin/firestore");
    const batch = db.batch();
    if (data?.approve) {
      const subjects = (req.data().subjects || []).filter((s) => TEACHER_SUBJECTS.includes(s));
      batch.update(classRef, { teacherIds: FieldValue.arrayUnion(uid), [`teacherSubjects.${uid}`]: subjects });
      batch.set(db.collection("users").doc(uid), { teachesClassIds: FieldValue.arrayUnion(cls.id) }, { merge: true });
    }
    batch.delete(reqRef);
    batch.set(db.collection("users").doc(uid), { pendingTeachClassIds: FieldValue.arrayRemove(cls.id) }, { merge: true });
    await batch.commit();
    return { ok: true };
  });

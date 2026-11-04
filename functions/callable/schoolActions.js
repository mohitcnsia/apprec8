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

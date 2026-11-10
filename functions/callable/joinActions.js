// functions/callable/joinActions.js: sign-up without codes, stage 1 (owner + parents + teachers, 2026-11-11;
// doc "Simpler sign-up: one WhatsApp link"). A teacher shares ONE class link on WhatsApp; a parent taps it and fills
// one screen (child, roll number, their mobile, consent); the teacher approves, or taps "Not sure" (follow-up list).
//
// classLinks/{token}               { classId, createdBy, createdAt }                 (server only)
// classes/{id}.linkToken           the class's current link token (a new link replaces the old one)
// classes/{id}/members/{kidUid}    + via: "link", rollNo, parentUid, parentName, relation, parentMobile
//                                    status: "pending" | "unsure" | "approved"
// parentMobiles/{+91…}             { uids: [parentUid] }   how a child finds their parent (stage 2)  (server only)
// followUps/{classId__kidUid}      { classId, kidUid, … }  families a teacher wasn't sure about    (server only)
const functions = require("firebase-functions");
const { admin } = require("../common/admin");
const { region, runtimeOptions } = require("../common/config");
const { makeToken, isJoinToken, normalizeMobile, normalizeRoll } = require("../utils/joinLink");

const db = admin.firestore();
const { FieldValue } = require("firebase-admin/firestore");
const OWNER_UID = "ThOziLzf1INR9K9hxZQxOMgjcJD3";
const MAX_CHILDREN_FREE = 4; // owner 2026-11-11: a 5th child = "Need more? Tell us"
const MAX_CLASSES = 3;
const RELATIONS = ["mother", "father", "guardian"];
const fail = (code, msg) => new functions.https.HttpsError(code, msg);

async function isAppAdmin(uid) {
  if (uid === OWNER_UID) return true;
  const r = await db.collection("roles").doc(uid).get();
  return r.exists && r.data().admin === true;
}
async function isSchoolAdmin(uid, schoolId) {
  if (!schoolId) return false;
  const s = await db.collection("schools").doc(schoolId).get();
  return s.exists && (s.data().admins || []).includes(uid);
}
/** The class's teachers, app admins and that school's admins. */
async function canRunClass(uid, cls) {
  return (cls.data().teacherIds || []).includes(uid) || (await isAppAdmin(uid)) || (await isSchoolAdmin(uid, cls.data().schoolId));
}
const firstWord = (s) => String(s || "").trim().split(/\s+/)[0] || "";

/** { classId, renew? } → { token }. Makes the class link once; renew = a new link, the old one stops working. */
exports.classLink = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw fail("unauthenticated", "Sign in first.");
    const classRef = db.collection("classes").doc(String(data?.classId || ""));
    const cls = await classRef.get();
    if (!cls.exists) throw fail("not-found", "Class not found.");
    if (String(cls.id).startsWith("demo_")) throw fail("failed-precondition", "The Demo School has no join link.");
    if (!(await canRunClass(context.auth.uid, cls))) throw fail("permission-denied", "Only this class's teacher or an admin can share its link.");
    const old = cls.data().linkToken || null;
    if (old && !data?.renew) return { token: old };
    for (let i = 0; i < 5; i++) {
      const token = makeToken();
      const ref = db.collection("classLinks").doc(token);
      const made = await db.runTransaction(async (t) => {
        if ((await t.get(ref)).exists) return false;
        t.set(ref, { classId: cls.id, createdBy: context.auth.uid, createdAt: FieldValue.serverTimestamp() });
        t.update(classRef, { linkToken: token });
        if (old) t.delete(db.collection("classLinks").doc(old));
        return true;
      });
      if (made) return { token };
    }
    throw fail("internal", "Couldn't make a link. Try again.");
  });

async function classFromToken(token) {
  if (!isJoinToken(token)) throw fail("not-found", "This class link doesn't work. Ask the teacher to share it again.");
  const link = await db.collection("classLinks").doc(token).get();
  if (!link.exists) throw fail("not-found", "This class link is old or wrong. Ask the teacher to share it again.");
  const cls = await db.collection("classes").doc(link.data().classId).get();
  if (!cls.exists || cls.data().linkToken !== token) throw fail("not-found", "This class link is old. Ask the teacher to share it again.");
  return cls;
}

/** { token } → what the join screen shows: class, school, the teachers' first names. Signed-in users only. */
exports.classLinkInfo = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw fail("unauthenticated", "Sign in first.");
    const cls = await classFromToken(String(data?.token || ""));
    const ids = (cls.data().teacherIds || []).slice(0, 4);
    const teachers = ids.length ? await db.getAll(...ids.map((id) => db.collection("users").doc(id))) : [];
    return {
      classId: cls.id,
      className: cls.data().name || "",
      schoolName: cls.data().schoolName || "",
      grade: cls.data().grade || null,
      teacherNames: teachers.filter((d) => d.exists).map((d) => firstWord(d.data().firstName)).filter(Boolean),
    };
  });

/**
 * The parent's one screen. { token, kidUid? | firstName, rollNo, mobile, relation, language, version } →
 * { kidUid, firstName, className }. A new child gets a profile (as "Add a child" does) in the class's grade.
 * The join is a request: the teacher approves it (approveMember) or marks it "Not sure" (markNotSure).
 */
exports.joinClassByLink = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw fail("unauthenticated", "Sign in first.");
    const parentUid = context.auth.uid;
    if (parentUid.startsWith("demo_")) throw fail("failed-precondition", "Demo accounts can't join real classes.");
    const cls = await classFromToken(String(data?.token || ""));
    const classId = cls.id;
    const parentRef = db.collection("users").doc(parentUid);
    const parentDoc = await parentRef.get();
    const p = parentDoc.exists ? parentDoc.data() : {};
    if (p.isChild || (p.parentUids || []).length) throw fail("permission-denied", "Please ask your parent to open this link on their own phone.");
    const mobile = normalizeMobile(data?.mobile);
    if (!mobile) throw fail("invalid-argument", "Write your 10-digit mobile number.");
    const rollNo = normalizeRoll(data?.rollNo);
    if (rollNo === null) throw fail("invalid-argument", "A roll number has up to 6 letters or numbers.");
    if (!RELATIONS.includes(data?.relation)) throw fail("invalid-argument", "Choose mother, father or guardian.");
    if (!["en", "hi"].includes(data?.language) || !data?.version) throw fail("invalid-argument", "Please read the form again.");
    const parentName = firstWord(p.firstName) || firstWord(context.auth.token.name) || "Parent";

    // The child: one this parent already has, or a new profile.
    let kidUid = data?.kidUid ? String(data.kidUid) : null;
    let firstName;
    let isNew = false;
    if (kidUid) {
      const kid = await db.collection("users").doc(kidUid).get();
      if (!kid.exists || !(kid.data().parentUids || []).includes(parentUid)) throw fail("permission-denied", "That isn't one of your children.");
      const k = kid.data();
      firstName = firstWord(k.firstName) || "Child";
      if ((k.classIds || []).includes(classId)) throw fail("already-exists", `${firstName} is already in this class.`);
      if ((k.pendingClassIds || []).includes(classId)) throw fail("already-exists", `${firstName} is already waiting for the teacher.`);
      if ([...(k.classIds || []), ...(k.pendingClassIds || [])].length >= MAX_CLASSES) throw fail("resource-exhausted", `${firstName} is in ${MAX_CLASSES} classes already.`);
    } else {
      firstName = firstWord(data?.firstName);
      if (firstName.length < 2 || firstName.length > 30) throw fail("invalid-argument", "Write your child's first name.");
      if ((p.childUids || []).length >= MAX_CHILDREN_FREE) {
        throw fail("resource-exhausted", "You have 4 children on Apprec8. Need more? Tell us: Me → Tell us what you think.");
      }
      const user = await admin.auth().createUser({ displayName: firstName });
      kidUid = user.uid;
      isNew = true;
    }

    const now = FieldValue.serverTimestamp();
    const consentRef = db.collection("consents").doc();
    const batch = db.batch();
    if (isNew) {
      batch.set(db.collection("users").doc(kidUid), {
        firstName,
        lastName: "",
        grade: Number.isInteger(cls.data().grade) ? cls.data().grade : null,
        isChild: true,
        parentUids: [parentUid],
        createdAt: now,
        stats: { totalStars: 0, currentStreak: 0 },
      });
    }
    batch.set(consentRef, {
      kind: isNew ? "child-account+class" : "class-join",
      via: "class-link",
      kidUid,
      parentUid,
      classId,
      parentName,
      relation: data.relation,
      language: data.language,
      version: String(data.version),
      acceptedAt: now,
    });
    batch.set(cls.ref.collection("members").doc(kidUid), {
      firstName,
      grade: Number.isInteger(cls.data().grade) ? cls.data().grade : null,
      code: null,
      via: "link",
      rollNo,
      parentUid,
      parentName,
      relation: data.relation,
      parentMobile: mobile,
      consentId: consentRef.id,
      consentBy: "parent-account",
      status: "pending",
      joinedAt: now,
    });
    batch.set(db.collection("users").doc(kidUid), { pendingClassIds: FieldValue.arrayUnion(classId) }, { merge: true });
    batch.set(parentRef, { childUids: FieldValue.arrayUnion(kidUid), isParent: true, parentMobile: mobile }, { merge: true });
    batch.set(db.collection("parentMobiles").doc(mobile), { uids: FieldValue.arrayUnion(parentUid), updatedAt: now }, { merge: true });
    // A parent who changed their number: the old one no longer finds them.
    if (p.parentMobile && p.parentMobile !== mobile) {
      batch.set(db.collection("parentMobiles").doc(p.parentMobile), { uids: FieldValue.arrayRemove(parentUid) }, { merge: true });
    }
    await batch.commit(); // the class's teachers get "waiting" from onStudentJoinRequest
    return { kidUid, firstName, className: cls.data().name || "", isNew };
  });

/**
 * A student asks to join from their OWN phone (owner, 2026-11-11: Seema's Class 10 has exams in 5 days; parents
 * needn't install anything). { token, rollNo, parentMobile } → { className }. The parent's yes is collected the way
 * schools do (YES in the class WhatsApp group, or a slip) and the teacher confirms it when approving (approveMember
 * with parentSaidYes). A child who already has a linked parent is covered by that parent's consent.
 */
exports.studentJoinByLink = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw fail("unauthenticated", "Sign in first.");
    const kidUid = context.auth.uid;
    if (kidUid.startsWith("demo_")) throw fail("failed-precondition", "Demo accounts can't join real classes.");
    const cls = await classFromToken(String(data?.token || ""));
    const classId = cls.id;
    const kidRef = db.collection("users").doc(kidUid);
    const kidDoc = await kidRef.get();
    const k = kidDoc.exists ? kidDoc.data() : {};
    if ((k.childUids || []).length) throw fail("failed-precondition", "This is a parent's account. Add your child with the parent's screen.");
    const firstName = firstWord(k.firstName);
    if (firstName.length < 2) throw fail("failed-precondition", "Add your first name first: Me → Edit profile.");
    if ((k.classIds || []).includes(classId)) throw fail("already-exists", "You're already in this class.");
    if ((k.pendingClassIds || []).includes(classId)) throw fail("already-exists", "You're already waiting for the teacher.");
    if ([...(k.classIds || []), ...(k.pendingClassIds || [])].length >= MAX_CLASSES) throw fail("resource-exhausted", `You're in ${MAX_CLASSES} classes already.`);
    const rollNo = normalizeRoll(data?.rollNo);
    if (rollNo === null) throw fail("invalid-argument", "A roll number has up to 6 letters or numbers.");
    const parentMobile = normalizeMobile(data?.parentMobile);
    if (!parentMobile) throw fail("invalid-argument", "Write your parent's 10-digit mobile number.");
    const linkedParent = (k.parentUids || [])[0] || null;
    const now = FieldValue.serverTimestamp();
    const batch = db.batch();
    batch.set(cls.ref.collection("members").doc(kidUid), {
      firstName,
      grade: Number.isInteger(k.grade) ? k.grade : Number.isInteger(cls.data().grade) ? cls.data().grade : null,
      code: null,
      via: "link-student",
      rollNo,
      parentUid: linkedParent,
      parentName: null,
      relation: null,
      parentMobile, // typed by the child: for the teacher's call, not a verified parent account
      consentId: null,
      consentBy: linkedParent ? "parent-account" : "teacher-confirms",
      status: "pending",
      joinedAt: now,
    });
    batch.set(kidRef, { pendingClassIds: FieldValue.arrayUnion(classId) }, { merge: true });
    await batch.commit(); // the class's teachers get "waiting" from onStudentJoinRequest
    return { className: cls.data().name || "", teacherConfirms: !linkedParent };
  });

/** { classId, kidUid } → the teacher isn't sure who this family is: on the follow-up list (teacher + owner). */
exports.markNotSure = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw fail("unauthenticated", "Sign in first.");
    const classRef = db.collection("classes").doc(String(data?.classId || ""));
    const cls = await classRef.get();
    if (!cls.exists) throw fail("not-found", "Class not found.");
    if (!(await canRunClass(context.auth.uid, cls))) throw fail("permission-denied", "Only this class's teacher can do this.");
    const kidUid = String(data?.kidUid || "");
    const memberRef = classRef.collection("members").doc(kidUid);
    const m = await memberRef.get();
    if (!m.exists || m.data().status === "approved") throw fail("not-found", "No request from this child.");
    const batch = db.batch();
    batch.update(memberRef, { status: "unsure", unsureBy: context.auth.uid, unsureAt: FieldValue.serverTimestamp() });
    batch.set(db.collection("followUps").doc(`${cls.id}__${kidUid}`), {
      classId: cls.id,
      className: cls.data().name || "",
      schoolName: cls.data().schoolName || "",
      kidUid,
      firstName: m.data().firstName || null,
      rollNo: m.data().rollNo || "",
      parentName: m.data().parentName || null,
      relation: m.data().relation || null,
      parentMobile: m.data().parentMobile || null,
      markedBy: context.auth.uid,
      markedAt: FieldValue.serverTimestamp(),
    });
    await batch.commit();
    return { ok: true };
  });

/** → { items: [...] } every family on the follow-up list (app admins only; teachers see theirs in the class). */
exports.followUpList = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw fail("unauthenticated", "Sign in first.");
    if (!(await isAppAdmin(context.auth.uid))) throw fail("permission-denied", "Admins only.");
    const snap = await db.collection("followUps").orderBy("markedAt", "desc").limit(100).get();
    return {
      items: snap.docs.map((d) => {
        const v = d.data();
        return { classId: v.classId, className: v.className, schoolName: v.schoolName, kidUid: v.kidUid, firstName: v.firstName, rollNo: v.rollNo, parentName: v.parentName, relation: v.relation, parentMobile: v.parentMobile, markedAtMs: v.markedAt?.toMillis?.() || null };
      }),
    };
  });

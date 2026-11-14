// functions/callable/peopleActions.js: the People screen (owner, 12-13 Nov: "our app should show all the user details,
// who all have joined and when"). peopleList: the owner / app admins see everyone (with email); a school admin sees the
// people in their school's classes (no emails). Read-only. Reads: users (at most 1000) + classes; sign-in times come from
// Firebase Auth (no Firestore reads).
const functions = require("firebase-functions");
const { admin } = require("../common/admin");
const { region, runtimeOptions } = require("../common/config");
const { personRow, summarize, helpCheck } = require("../utils/people");
const { eraseUser } = require("../utils/eraseUser");
const { FieldValue } = require("firebase-admin/firestore");

const db = admin.firestore();
const OWNER_UID = "ThOziLzf1INR9K9hxZQxOMgjcJD3";
const fail = (code, msg) => new functions.https.HttpsError(code, msg);

async function authInfo(uids) {
  const out = {};
  for (let i = 0; i < uids.length; i += 100) {
    const r = await admin.auth().getUsers(uids.slice(i, i + 100).map((uid) => ({ uid })));
    r.users.forEach((u) => (out[u.uid] = { email: u.email || null, creationTime: u.metadata.creationTime, lastSignInTime: u.metadata.lastSignInTime, lastRefreshTime: u.metadata.lastRefreshTime || null, providers: u.providerData.map((p) => p.providerId) }));
  }
  return out;
}

exports.peopleList = functions
  .region(region)
  .runWith({ ...runtimeOptions, timeoutSeconds: 120, memory: "512MB" })
  .https.onCall(async (data, context) => {
    if (!context.auth) throw fail("unauthenticated", "Sign in first.");
    const uid = context.auth.uid;
    const role = uid === OWNER_UID ? { admin: true } : (await db.collection("roles").doc(uid).get()).data() || {};
    const appAdmin = role.admin === true;
    const classSnap = await db.collection("classes").get();
    const className = Object.fromEntries(classSnap.docs.map((c) => [c.id, c.data().name || "a class"]));

    let docs;
    let adminSchoolIds = new Set();
    if (appAdmin) {
      docs = (await db.collection("users").orderBy("createdAt", "desc").limit(1000).get()).docs;
    } else {
      const schools = await db.collection("schools").where("admins", "array-contains", uid).limit(20).get();
      const schoolIds = new Set(schools.docs.map((s) => s.id));
      adminSchoolIds = schoolIds;
      if (!schoolIds.size) throw fail("permission-denied", "Only the owner and school admins can see people.");
      // Her schools' classes, plus any class she teaches (13 Nov: two "Glorious Academy" schools, classes under the
      // one without her as admin).
      const mine = classSnap.docs.filter((c) => schoolIds.has(c.data().schoolId) || (c.data().teacherIds || []).includes(uid));
      const ids = new Set();
      for (const c of mine) {
        (c.data().teacherIds || []).forEach((t) => ids.add(t));
        (await c.ref.collection("members").limit(200).get()).docs.forEach((m) => ids.add(m.id));
      }
      const list = [...ids].slice(0, 1000);
      docs = list.length ? await db.getAll(...list.map((id) => db.collection("users").doc(id))) : [];
    }
    docs = docs.filter((d) => d.exists && !d.id.startsWith("demo_"));
    const auth = await authInfo(docs.map((d) => d.id));
    const now = Date.now();
    const rows = docs
      .map((d) => personRow({ uid: d.id, doc: d.data(), auth: auth[d.id] || null, className, now }))
      .map((r) => (appAdmin ? r : { ...r, email: null })) // school admins never see emails
      .sort((a, b) => (b.joinedAt || 0) - (a.joinedAt || 0));
    return { at: now, people: rows, counts: summarize(rows, now), withEmail: appAdmin, schoolIds: appAdmin ? null : [...adminSchoolIds] };
  });

// Help buttons on People (owner 13-14 Nov: "go ahead"): { uid, action: "class"|"teacher"|"delete", classId?, subjects?,
// firstName?, typed? }. Every help is logged in helpLog (who, when, what), also after a delete.
exports.helpPerson = functions
  .region(region)
  .runWith({ ...runtimeOptions, timeoutSeconds: 120 })
  .https.onCall(async (data, context) => {
    if (!context.auth) throw fail("unauthenticated", "Sign in first.");
    const caller = context.auth.uid;
    const uid = String(data?.uid || "");
    const action = String(data?.action || "");
    if (!uid || uid.startsWith("demo_")) throw fail("invalid-argument", "Pick a person.");
    const role = caller === OWNER_UID ? { admin: true } : (await db.collection("roles").doc(caller).get()).data() || {};
    const appAdmin = role.admin === true;
    const adminOfSchools = appAdmin ? [] : (await db.collection("schools").where("admins", "array-contains", caller).limit(20).get()).docs.map((s) => s.id);
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();
    let cls = null;
    if (action !== "delete") {
      const c = await db.collection("classes").doc(String(data?.classId || "x")).get();
      cls = c.exists ? { id: c.id, ...c.data() } : null;
    }
    const check = helpCheck({
      action,
      target: { exists: userDoc.exists, uid, data: userDoc.data() || {}, isOwner: uid === OWNER_UID },
      cls,
      caller: { uid: caller, appAdmin, adminOfSchools },
      typed: data?.typed,
      subjects: data?.subjects,
      firstName: data?.firstName,
    });
    if (check.error) throw fail(check.error, check.message);
    const now = FieldValue.serverTimestamp();
    const log = (detail) => db.collection("helpLog").add({ uid, action, by: caller, at: now, ...detail });

    if (action === "class") {
      const batch = db.batch();
      batch.set(db.collection("classes").doc(cls.id).collection("members").doc(uid), {
        firstName: check.firstName,
        grade: check.grade,
        code: null,
        via: "helped",
        helpedBy: caller,
        rollNo: null,
        parentUid: (userDoc.data().parentUids || [])[0] || null,
        parentName: null,
        relation: null,
        parentMobile: null,
        consentId: null,
        consentBy: "teacher-confirms",
        status: "pending",
        joinedAt: now,
      });
      const patch = { pendingClassIds: FieldValue.arrayUnion(cls.id) };
      if (!Number.isInteger(userDoc.data().grade) && Number.isInteger(check.grade)) patch.grade = check.grade;
      if (!userDoc.data().firstName) patch.firstName = check.firstName;
      batch.set(userRef, patch, { merge: true });
      await batch.commit(); // the teacher gets "waiting" from onStudentJoinRequest
      await log({ classId: cls.id, className: cls.name || "" });
      return { ok: true, message: `On ${cls.name || "the class"}'s waiting list. The teacher confirms.` };
    }
    if (action === "teacher") {
      const batch = db.batch();
      batch.update(db.collection("classes").doc(cls.id), { teacherIds: FieldValue.arrayUnion(uid), [`teacherSubjects.${uid}`]: check.subjects });
      batch.set(userRef, { teachesClassIds: FieldValue.arrayUnion(cls.id) }, { merge: true });
      await batch.commit();
      await log({ classId: cls.id, className: cls.name || "", subjects: check.subjects });
      return { ok: true, message: `Teacher of ${cls.name || "the class"} now.` };
    }
    // delete: the owner's own typed confirmation (Fable's idea); nothing else erases accounts automatically
    await log({ firstName: String((userDoc.data() || {}).firstName || "").split(" ")[0] || null });
    await eraseUser(admin, uid);
    return { ok: true, message: "Deleted." };
  });

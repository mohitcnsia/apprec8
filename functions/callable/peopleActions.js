// functions/callable/peopleActions.js: the People screen (owner, 12-13 Nov: "our app should show all the user details,
// who all have joined and when"). peopleList: the owner / app admins see everyone (with email); a school admin sees the
// people in their school's classes (no emails). Read-only. Reads: users (at most 1000) + classes; sign-in times come from
// Firebase Auth (no Firestore reads).
const functions = require("firebase-functions");
const { admin } = require("../common/admin");
const { region, runtimeOptions } = require("../common/config");
const { personRow, summarize } = require("../utils/people");

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
    if (appAdmin) {
      docs = (await db.collection("users").orderBy("createdAt", "desc").limit(1000).get()).docs;
    } else {
      const schools = await db.collection("schools").where("admins", "array-contains", uid).limit(20).get();
      const schoolIds = new Set(schools.docs.map((s) => s.id));
      if (!schoolIds.size) throw fail("permission-denied", "Only the owner and school admins can see people.");
      const mine = classSnap.docs.filter((c) => schoolIds.has(c.data().schoolId));
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
    return { at: now, people: rows, counts: summarize(rows, now), withEmail: appAdmin };
  });

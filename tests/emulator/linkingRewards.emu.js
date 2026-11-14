// tests/emulator/linkingRewards.emu.js
// Emulator test for G113: linking rewards and server safety.
// Tests:
// 1. Server safety: createChildProfile + createParentLinkCode refuse student accounts (grade set, no childUids).
// 2. Parents (with childUids, or no grade) can call createChildProfile + createParentLinkCode.
// 3. createChildProfile creates child with stats.totalStars = 100 and linkBonusAt set.
// 4. redeemParentLinkCode links child, grants +100 stars, and sets linkBonusAt.
// 5. redeemParentLinkCode skips bonus if linkBonusAt already set (stars granted ONCE per child).
// 6. joinClassByLink grants +100 stars and sets linkBonusAt for new child.
// Run: firebase emulators:exec --only functions,firestore,auth --project demo-apprec8 "node tests/emulator/linkingRewards.emu.js $PWD"

const path = require("path");
const admin = require(path.join(process.argv[2], "functions/node_modules/firebase-admin"));
const PROJECT = "demo-apprec8";
admin.initializeApp({ projectId: PROJECT });
const db = admin.firestore();
const FN = `http://127.0.0.1:5001/${PROJECT}/us-central1`;
const AUTH = "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1";
let failures = 0;
const ok = (c, m) => {
  if (c) console.log("ok -", m);
  else {
    failures++;
    console.error("FAIL:", m);
  }
};

async function signUp(email) {
  const r = await fetch(`${AUTH}/accounts:signUp?key=fake`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "secret123", returnSecureToken: true }),
  });
  const j = await r.json();
  return { uid: j.localId, token: j.idToken };
}

async function call(name, data, who) {
  const r = await fetch(`${FN}/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(who ? { Authorization: `Bearer ${who.token}` } : {}),
    },
    body: JSON.stringify({ data }),
  });
  const j = await r.json();
  if (j.error) return { error: j.error.status, message: j.error.message };
  return j.result;
}

(async () => {
  console.log("--- Starting Linking Rewards & Server Safety Emulator Tests ---");

  // 1. Setup accounts
  const student = await signUp("student_safety@test.dev");
  await db.doc(`users/${student.uid}`).set({
    firstName: "Rohan",
    grade: 7,
    childUids: [],
  });

  const parent = await signUp("parent_linking@test.dev");
  await db.doc(`users/${parent.uid}`).set({
    firstName: "Anita Sharma",
    childUids: [],
  });

  const kidWithLogin = await signUp("kid_own_login@test.dev");
  await db.doc(`users/${kidWithLogin.uid}`).set({
    firstName: "Priya",
    grade: 6,
    stats: { totalStars: 25, currentStreak: 2 },
    childUids: [],
  });

  // 2. Server Safety: Student accounts cannot createChildProfile or createParentLinkCode
  const childConsent = { parentName: "Student Impersonating", relation: "mother", language: "en", version: "2026-11-04" };

  const studentCreateChild = await call("createChildProfile", { firstName: "LittleKid", grade: 2, consent: childConsent }, student);
  ok(studentCreateChild.error === "PERMISSION_DENIED", "createChildProfile refuses a student account (grade set, no childUids)");

  const studentCreateLink = await call("createParentLinkCode", { consent: childConsent }, student);
  ok(studentCreateLink.error === "PERMISSION_DENIED", "createParentLinkCode refuses a student account (grade set, no childUids)");

  // 3. Parent can create child profile -> gets +100 stars and linkBonusAt
  const parentConsent = { parentName: "Anita Sharma", relation: "mother", language: "en", version: "2026-11-04" };
  const createdChild = await call("createChildProfile", { firstName: "Dev", grade: 3, consent: parentConsent }, parent);
  ok(createdChild.kidUid && createdChild.code, "parent can create child profile");

  const childDoc = (await db.doc(`users/${createdChild.kidUid}`).get()).data();
  ok(childDoc.stats?.totalStars === 100, "createChildProfile grants +100 stars initially");
  ok(!!childDoc.linkBonusAt, "createChildProfile sets linkBonusAt timestamp");
  ok(childDoc.parentUids && childDoc.parentUids[0] === parent.uid, "child has parent in parentUids");

  // 4. Parent generates a link code for an existing child with their own login
  const linkRes = await call("createParentLinkCode", { consent: parentConsent }, parent);
  ok(linkRes.code && linkRes.code.length === 6, "parent successfully creates parentLinkCode");

  // Kid redeems parentLinkCode
  const redeemRes = await call("redeemParentLinkCode", { code: linkRes.code }, kidWithLogin);
  ok(redeemRes.parentName === "Anita Sharma", "kid successfully redeems parentLinkCode");

  const linkedKidDoc = (await db.doc(`users/${kidWithLogin.uid}`).get()).data();
  ok(linkedKidDoc.stats?.totalStars === 125, "redeemParentLinkCode grants +100 stars (25 + 100 = 125)");
  ok(!!linkedKidDoc.linkBonusAt, "redeemParentLinkCode sets linkBonusAt timestamp");
  ok((linkedKidDoc.parentUids || []).includes(parent.uid), "kid now has parent in parentUids");

  // 5. Subsequent link to another parent does NOT grant stars again
  const parent2 = await signUp("parent2_linking@test.dev");
  await db.doc(`users/${parent2.uid}`).set({
    firstName: "Rajesh Sharma",
    childUids: [],
  });
  const parent2Consent = { parentName: "Rajesh Sharma", relation: "father", language: "en", version: "2026-11-04" };
  const linkRes2 = await call("createParentLinkCode", { consent: parent2Consent }, parent2);
  ok(linkRes2.code && linkRes2.code.length === 6, "second parent creates parentLinkCode");

  const redeemRes2 = await call("redeemParentLinkCode", { code: linkRes2.code }, kidWithLogin);
  ok(redeemRes2.parentName === "Rajesh Sharma", "kid redeems code from second parent");

  const recheckedKidDoc = (await db.doc(`users/${kidWithLogin.uid}`).get()).data();
  ok(recheckedKidDoc.stats?.totalStars === 125, "second link does NOT grant +100 stars again (still 125)");
  ok((recheckedKidDoc.parentUids || []).includes(parent2.uid), "kid now linked to second parent as well");

  // 6. Class join consent path (joinClassByLink): creates new child with +100 stars and linkBonusAt
  await db.doc("classes/c_rewards").set({
    name: "5-B",
    schoolName: "Demo School",
    schoolId: "s1",
    grade: 5,
    teacherIds: ["t_dummy"],
  });
  const classLinkRes = await call("classLink", { classId: "c_rewards" }, { token: parent.token }); // fallback or direct
  // Parent joins a new child through joinClassByLink
  const joinForm = {
    classId: "c_rewards",
    firstName: "Sneha",
    rollNo: "12",
    mobile: "98765 11111",
    relation: "mother",
    language: "en",
    version: "2026-11-04",
  };
  const joinRes = await call("joinClassByLink", joinForm, parent);
  ok(joinRes.kidUid && joinRes.isNew, "joinClassByLink created new child profile");

  const newChildDoc = (await db.doc(`users/${joinRes.kidUid}`).get()).data();
  ok(newChildDoc.stats?.totalStars === 100, "joinClassByLink gives new child +100 stars");
  ok(!!newChildDoc.linkBonusAt, "joinClassByLink sets linkBonusAt");

  console.log("---------------------------------------------------------------");
  console.log(failures ? `FAILED: ${failures} tests failed` : "ALL linking rewards emulator tests PASSED");
  process.exit(failures ? 1 : 0);
})().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});

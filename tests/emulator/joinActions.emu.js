// Emulator-only test for sign-up without codes, stage 1 (functions/callable/joinActions.js + approveMember).
// Uses the demo project; never touches production. Run: npm run test:emulator:join  (needs Java)
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
  const r = await fetch(`${AUTH}/accounts:signUp?key=fake`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password: "secret123", returnSecureToken: true }) });
  const j = await r.json();
  return { uid: j.localId, token: j.idToken };
}
async function call(name, data, who) {
  const r = await fetch(`${FN}/${name}`, { method: "POST", headers: { "Content-Type": "application/json", ...(who ? { Authorization: `Bearer ${who.token}` } : {}) }, body: JSON.stringify({ data }) });
  const j = await r.json();
  if (j.error) return { error: j.error.status, message: j.error.message };
  return j.result;
}

(async () => {
  const teacher = await signUp("teacher@test.dev");
  const parent = await signUp("parent@test.dev");
  const stranger = await signUp("stranger@test.dev");
  const kidAcc = await signUp("kid@test.dev");
  const boss = await signUp("admin@test.dev");
  await db.doc(`roles/${boss.uid}`).set({ admin: true });
  await db.doc(`users/${teacher.uid}`).set({ firstName: "Seema" });
  await db.doc(`users/${parent.uid}`).set({ firstName: "Sunita Sharma" });
  await db.doc(`users/${kidAcc.uid}`).set({ firstName: "Kid", isChild: true, parentUids: ["p0"] });
  await db.doc("classes/c1").set({ name: "10-A", schoolName: "Demo School", schoolId: "s1", grade: 10, teacherIds: [teacher.uid], teacherSubjects: { [teacher.uid]: ["english"] } });

  // 1) The class link: teacher only, made once, the same token on the next ask
  const l1 = await call("classLink", { classId: "c1" }, teacher);
  ok(/^[a-z2-9]{10}$/.test(l1.token || ""), "teacher gets a class link token");
  ok((await call("classLink", { classId: "c1" }, teacher)).token === l1.token, "asking again gives the same link");
  ok((await call("classLink", { classId: "c1" }, stranger)).error === "PERMISSION_DENIED", "a stranger can't make the link");
  ok((await call("classLink", { classId: "c1" })).error === "UNAUTHENTICATED", "signed-out callers are refused");

  // 2) What the link shows
  const info = await call("classLinkInfo", { token: l1.token }, parent);
  ok(info.className === "10-A" && info.schoolName === "Demo School" && info.teacherNames[0] === "Seema", "link shows class, school and teacher");
  ok((await call("classLinkInfo", { token: "aaaaaaaaaa" }, parent)).error === "NOT_FOUND", "a made-up link is refused");

  // 3) The parent's one screen: a new child
  const form = { token: l1.token, firstName: "Riya", rollNo: "23", mobile: "98765 43210", relation: "mother", language: "en", version: "2026-11-04" };
  ok((await call("joinClassByLink", { ...form, mobile: "123" }, parent)).error === "INVALID_ARGUMENT", "a wrong mobile is refused");
  ok((await call("joinClassByLink", form, kidAcc)).error === "PERMISSION_DENIED", "a child account can't join for itself");
  const j = await call("joinClassByLink", form, parent);
  ok(j.kidUid && j.isNew && j.firstName === "Riya" && j.className === "10-A", "parent adds Riya to 10-A");
  const kid = (await db.doc(`users/${j.kidUid}`).get()).data();
  ok(kid.isChild && kid.parentUids[0] === parent.uid && kid.grade === 10 && kid.pendingClassIds[0] === "c1", "Riya's profile: child, her parent, class 10, waiting for c1");
  const m = (await db.doc(`classes/c1/members/${j.kidUid}`).get()).data();
  ok(m.status === "pending" && m.rollNo === "23" && m.parentName === "Sunita" && m.relation === "mother" && m.parentMobile === "+919876543210", "the request has roll, parent name, relation and mobile");
  const consent = (await db.doc(`consents/${m.consentId}`).get()).data();
  ok(consent.kidUid === j.kidUid && consent.parentUid === parent.uid && consent.classId === "c1" && consent.version === "2026-11-04" && consent.kind === "child-account+class", "the consent is stored on the server");
  const p = (await db.doc(`users/${parent.uid}`).get()).data();
  ok(p.childUids.includes(j.kidUid) && p.isParent && p.parentMobile === "+919876543210", "the parent has Riya and their mobile");
  ok(((await db.doc("parentMobiles/+919876543210").get()).data().uids || []).includes(parent.uid), "the mobile finds the parent (stage 2)");
  const again = await call("joinClassByLink", { ...form, firstName: undefined, kidUid: j.kidUid }, parent);
  ok(again.error === "ALREADY_EXISTS", "Riya can't ask twice");
  ok((await call("joinClassByLink", { ...form, kidUid: j.kidUid }, stranger)).error === "PERMISSION_DENIED", "a stranger can't join someone else's child");

  // 4) Not sure → the follow-up list; approve clears it
  ok((await call("markNotSure", { classId: "c1", kidUid: j.kidUid }, stranger)).error === "PERMISSION_DENIED", "only the class's teacher can mark Not sure");
  ok((await call("markNotSure", { classId: "c1", kidUid: j.kidUid }, teacher)).ok, "teacher marks Not sure");
  ok((await db.doc(`classes/c1/members/${j.kidUid}`).get()).data().status === "unsure", "the request shows as not sure");
  ok((await call("followUpList", {}, teacher)).error === "PERMISSION_DENIED", "the full follow-up list is for admins");
  const list = await call("followUpList", {}, boss);
  ok(list.items.length === 1 && list.items[0].parentMobile === "+919876543210" && list.items[0].rollNo === "23", "admin sees the family with roll and mobile");
  ok((await call("approveMember", { classId: "c1", kidUid: j.kidUid, approve: true }, teacher)).ok, "teacher approves after calling");
  ok(!(await db.doc(`followUps/c1__${j.kidUid}`).get()).exists, "approved: off the follow-up list");
  const kid2 = (await db.doc(`users/${j.kidUid}`).get()).data();
  ok(kid2.classIds.includes("c1") && !(kid2.pendingClassIds || []).includes("c1"), "Riya is in 10-A");

  // 5) A new link: the old one stops working
  const l2 = await call("classLink", { classId: "c1", renew: true }, teacher);
  ok(l2.token && l2.token !== l1.token, "New link gives a different link");
  ok((await call("classLinkInfo", { token: l1.token }, parent)).error === "NOT_FOUND", "the old link stops working");
  ok((await call("classLinkInfo", { token: l2.token }, parent)).className === "10-A", "the new link works");

  // 6) A student asks from their own phone (Class 10, exams soon); the teacher confirms the parent's yes
  const student = await signUp("student@test.dev");
  await db.doc(`users/${student.uid}`).set({ firstName: "Aarav", grade: 10 });
  ok((await call("studentJoinByLink", { token: l2.token, rollNo: "31", parentMobile: "12" }, student)).error === "INVALID_ARGUMENT", "student: a wrong parent number is refused");
  ok((await call("studentJoinByLink", { token: l2.token, rollNo: "31", parentMobile: "91234 56780" }, parent)).error === "FAILED_PRECONDITION", "a parent's account can't ask as a student");
  const sj = await call("studentJoinByLink", { token: l2.token, rollNo: "31", parentMobile: "91234 56780" }, student);
  ok(sj.className === "10-A" && sj.teacherConfirms === true, "Aarav asks to join 10-A from his phone");
  const sm = (await db.doc(`classes/c1/members/${student.uid}`).get()).data();
  ok(sm.status === "pending" && sm.consentBy === "teacher-confirms" && sm.rollNo === "31" && sm.parentMobile === "+919123456780", "his request: roll, parent's number, consent to confirm");
  ok((await call("approveMember", { classId: "c1", kidUid: student.uid, approve: true }, teacher)).error === "FAILED_PRECONDITION", "approve without the parent's yes is refused");
  ok((await call("approveMember", { classId: "c1", kidUid: student.uid, approve: true, parentSaidYes: "whatsapp" }, teacher)).ok, "teacher: parent said YES on WhatsApp → approved");
  const sm2 = (await db.doc(`classes/c1/members/${student.uid}`).get()).data();
  const sc = (await db.doc(`consents/${sm2.consentId}`).get()).data();
  ok(sm2.status === "approved" && sm2.consentBy === "teacher-confirmed" && sc.method === "whatsapp" && sc.confirmedBy === teacher.uid && sc.kidUid === student.uid, "the consent record says who confirmed it and how");
  ok((await db.doc(`users/${student.uid}`).get()).data().classIds.includes("c1"), "Aarav is in 10-A");
  // G97: the teacher removes an approved kid; the class goes from the kid's lists and the member doc.
  ok((await call("approveMember", { classId: "c1", kidUid: student.uid, approve: false }, teacher)).ok, "teacher removes Aarav from 10-A");
  ok(!((await db.doc(`users/${student.uid}`).get()).data().classIds || []).includes("c1"), "Aarav is no longer in 10-A");
  ok(!(await db.doc(`classes/c1/members/${student.uid}`).get()).exists, "his member record is gone");

  // 7) Up to 4 children
  await db.doc(`users/${stranger.uid}`).set({ firstName: "Many", childUids: ["a", "b", "c", "d"] });
  ok((await call("joinClassByLink", { ...form, token: l2.token, firstName: "Fifth" }, stranger)).error === "RESOURCE_EXHAUSTED", "a 5th child: Need more? Tell us");

  console.log(failures ? `${failures} FAILED` : "joinActions emulator tests passed");
  process.exit(failures ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

// tests/emulator/leaveClass.emu.js
// Owner, 16 Nov 2026: leave a class yourself. Student: out of the class, progress stays. Teacher: off the teacher list;
// the last teacher of a class with children is refused. Run: npm run test:emulator:leaveclass

const path = require("path");
const admin = require(path.join(process.argv[2], "functions/node_modules/firebase-admin"));
const PROJECT = "demo-apprec8";
admin.initializeApp({ projectId: PROJECT });
const db = admin.firestore();
const FN = `http://127.0.0.1:5001/${PROJECT}/us-central1`;
const AUTH = "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1";
let failures = 0;
const ok = (c, m) => (c ? console.log("ok -", m) : (failures++, console.error("FAIL:", m)));

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
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${who.token}` },
    body: JSON.stringify({ data }),
  });
  const j = await r.json();
  return j.error ? { error: j.error.status } : j.result;
}

(async () => {
  const kid = await signUp("kid_leave@test.dev");
  const t1 = await signUp("t1_leave@test.dev");
  const t2 = await signUp("t2_leave@test.dev");
  await db.doc("classes/c1").set({ name: "5-A", teacherIds: [t1.uid, t2.uid] });
  await db.doc("classes/c2").set({ name: "6-B", teacherIds: [t1.uid] });
  await db.doc(`classes/c1/members/${kid.uid}`).set({ status: "approved", firstName: "Riya" });
  await db.doc(`classes/c2/members/${kid.uid}`).set({ status: "approved", firstName: "Riya" });
  await db.doc(`users/${kid.uid}`).set({ firstName: "Riya", grade: 5, classIds: ["c1", "c2"], stats: { totalStars: 70 } });
  await db.doc(`users/${t1.uid}`).set({ firstName: "T1", teachesClassIds: ["c1", "c2"] });
  await db.doc(`users/${t2.uid}`).set({ firstName: "T2", teachesClassIds: ["c1"] });

  const r = await call("leaveClass", { classId: "c1", role: "student" }, kid);
  ok(r && r.ok, "student leaves 5-A");
  const k = (await db.doc(`users/${kid.uid}`).get()).data();
  ok(!k.classIds.includes("c1") && k.classIds.includes("c2"), "only that class goes");
  ok(k.stats.totalStars === 70, "progress stays");
  ok(!(await db.doc(`classes/c1/members/${kid.uid}`).get()).exists, "off the class list");

  const last = await call("leaveClass", { classId: "c2", role: "teacher" }, t1);
  ok(last.error === "FAILED_PRECONDITION", "the only teacher of a class with children can't leave");
  const t = await call("leaveClass", { classId: "c1", role: "teacher" }, t1);
  ok(t && t.ok, "a teacher with a co-teacher can stop teaching");
  const c1 = (await db.doc("classes/c1").get()).data();
  ok(!c1.teacherIds.includes(t1.uid) && c1.teacherIds.includes(t2.uid), "only that teacher leaves the class");
  const u1 = (await db.doc(`users/${t1.uid}`).get()).data();
  ok(!u1.teachesClassIds.includes("c1") && u1.teachesClassIds.includes("c2"), "the teacher's own list updates");
  const notMine = await call("leaveClass", { classId: "c2", role: "teacher" }, t2);
  ok(notMine.error === "FAILED_PRECONDITION", "can't leave a class you don't teach");

  console.log(failures ? `${failures} FAILED` : "leaveClass emulator tests passed");
  process.exit(failures ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

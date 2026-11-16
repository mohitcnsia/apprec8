// tests/emulator/deleteChild.emu.js
// Owner, 16 Nov 2026: "Delete <child>'s profile" hides the child from the parent at once (both sides of the link go),
// nothing is erased, and deletionRequests keeps who to restore for 30 days. Another parent can't delete.
// Run: npm run test:emulator:deletechild

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
  const parent = await signUp("parent_del@test.dev");
  const other = await signUp("other_del@test.dev");
  await db.doc(`users/${parent.uid}`).set({ firstName: "Papa", isParent: true, childUids: ["kid_a", "kid_b"] });
  await db.doc(`users/${other.uid}`).set({ firstName: "Other", isParent: true, childUids: [] });
  await db.doc("users/kid_a").set({ firstName: "Ananya", isChild: true, grade: 10, parentUids: [parent.uid], stats: { totalStars: 40 } });
  await db.doc("users/kid_b").set({ firstName: "Arjun", isChild: true, grade: 10, parentUids: [parent.uid] });

  const denied = await call("deleteChildProfile", { kidUid: "kid_a" }, other);
  ok(denied.error === "PERMISSION_DENIED", "another parent can't delete the child");

  const res = await call("deleteChildProfile", { kidUid: "kid_a" }, parent);
  ok(res && res.hidden === true, "delete answers hidden: true");
  const p = (await db.doc(`users/${parent.uid}`).get()).data();
  ok(!p.childUids.includes("kid_a") && p.childUids.includes("kid_b"), "only that child leaves the parent's list");
  const k = (await db.doc("users/kid_a").get()).data();
  ok(k && !(k.parentUids || []).includes(parent.uid), "the child no longer points to the parent (no pushes about it)");
  ok(k && k.stats && k.stats.totalStars === 40, "nothing is erased: progress stays");
  const req = (await db.doc("deletionRequests/kid_a").get()).data();
  ok(req && req.status === "pending" && req.unlinkedParentUid === parent.uid, "request keeps who to restore");
  ok(req && req.restoreUntil > Date.now() + 29 * 864e5, "restore window is 30 days");

  const again = await call("deleteChildProfile", { kidUid: "kid_a" }, parent);
  ok(again.error === "PERMISSION_DENIED", "a second tap is refused cleanly (already hidden)");

  console.log(failures ? `${failures} FAILED` : "deleteChild emulator tests passed");
  process.exit(failures ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

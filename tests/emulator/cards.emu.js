// tests/emulator/cards.emu.js
// Owner, 16 Nov 2026: cards and team tasks: only the app admin sends; each person gets one copy; children get no push;
// status changes count once. Run: npm run test:emulator:cards

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
  const owner = await signUp("owner_cards@test.dev");
  const parent = await signUp("parent_cards@test.dev");
  const kid = await signUp("kid_cards@test.dev");
  await db.doc(`roles/${owner.uid}`).set({ admin: true });
  await db.doc(`users/${owner.uid}`).set({ firstName: "Mohit" });
  await db.doc(`users/${parent.uid}`).set({ firstName: "Sunita", isParent: true, childUids: ["k1"] });
  await db.doc(`users/${kid.uid}`).set({ firstName: "Aarav", grade: 5 });

  const denied = await call("sendCard", { card: { title: "Hi" }, audience: { type: "everyone" } }, parent);
  ok(denied.error === "PERMISSION_DENIED", "only the app admin sends");
  const bad = await call("sendCard", { card: { title: " " }, audience: { type: "parents" } }, owner);
  ok(bad.error === "INVALID_ARGUMENT", "a card needs a title");

  const card = { kind: "safety", title: "OTP", text: "Never share", cards: [{ kind: "idea", title: "a", text: "b" }, { kind: "check", question: "q", answer: "x", wrong: ["y"] }], moreQuestId: "bharat-quest", push: false };
  const r = await call("sendCard", { card, audience: { type: "parents" } }, owner);
  ok(r && r.sent === 1, "All parents = the one parent");
  const copy = (await db.doc(`users/${parent.uid}/cards/${r.cardId}`).get()).data();
  ok(copy && copy.status === "new" && copy.cards.length === 2 && copy.from === "Apprec8", "the parent has the card with its pages");
  ok(!(await db.doc(`users/${kid.uid}/cards/${r.cardId}`).get()).exists, "children didn't get the parents' card");

  const t = await call("sendCard", { card: { kind: "task", title: "Review tips", hat: "counsellor", dueAt: Date.now() + 864e5 }, audience: { type: "people", uids: [kid.uid, kid.uid] } }, owner);
  ok(t && t.sent === 1, "chosen people: each person once");
  const task = (await db.doc(`users/${kid.uid}/cards/${t.cardId}`).get()).data();
  ok(task && task.from === "Mohit" && task.hat === "counsellor" && task.dueAt, "a task says who it's from, the hat and the due date");

  await db.doc(`users/${parent.uid}/cards/${r.cardId}`).update({ status: "opened" });
  await new Promise((res) => setTimeout(res, 2500));
  await db.doc(`users/${parent.uid}/cards/${r.cardId}`).update({ status: "done" });
  await new Promise((res) => setTimeout(res, 2500));
  const sent = (await db.doc(`cards/${r.cardId}`).get()).data();
  ok(sent.opened === 1 && sent.done === 1, `counts: opened 1, done 1 (got ${sent.opened}, ${sent.done})`);

  const list = await call("myCards", {}, owner);
  ok(list && list.cards.length === 2, "the owner sees both cards he sent");

  console.log(failures ? `${failures} FAILED` : "cards emulator tests passed");
  process.exit(failures ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

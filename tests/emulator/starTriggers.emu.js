// Emulator-only test for the star triggers (owner spec 16 Nov 2026). Uses the demo project; never touches production.
// Run: npm run test:emulator:stars   (needs Java for the Firestore emulator)
const path = require("path");
const root = process.argv[2];
const admin = require(path.join(root, "functions/node_modules/firebase-admin"));
admin.initializeApp({ projectId: "demo-apprec8" });
const db = admin.firestore();
const { NODES_BY_QUEST } = require(path.join(root, "functions/utils/bundledQuestNodes.js"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const assert = (c, m) => { if (!c) { console.error("FAIL:", m); process.exit(1); } console.log("ok -", m); };
async function waitFor(fn, label, ms = 20000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) { const v = await fn(); if (v) return v; await sleep(400); }
  throw new Error("timeout: " + label);
}
const stars = async (uid) => (await db.doc(`users/${uid}`).get()).data()?.stats?.totalStars || 0;
const attempt = (uid, answers, outcome = "finished") =>
  db.collection("questAttempts").add({ userId: uid, questId: "english-quest", nodeId: "n1", quizId: "q1", mode: "training", outcome, answers, createdAt: admin.firestore.FieldValue.serverTimestamp() });

(async () => {
  const uid = "kid1";
  await db.doc(`users/${uid}`).set({ firstName: "Tripti", grade: 7, stats: { totalStars: 19 } });

  // 1) A quiz with 2 new right answers + streak kept = 19 + 2 + 2.
  const a1 = await attempt(uid, [{ questionId: "x1", isCorrect: true }, { questionId: "x2", isCorrect: true }, { questionId: "x3", isCorrect: false }]);
  await waitFor(async () => (await stars(uid)) === 23, "first quiz paid");
  assert(true, "2 new right answers + streak kept: 19 → 23");
  const u = (await db.doc(`users/${uid}`).get()).data();
  assert(u.lastAward?.id === a1.id && u.lastAward.stars === 4, "lastAward names the attempt and its 4 stars (for the animation)");
  assert(Object.values(u.stats.starsDaily || {})[0] === 4, "today's stars recorded for Home");
  assert((await a1.get()).data().starsPaidAt > 0, "attempt marked paid (a retried trigger can't pay twice)");

  // 2) Replaying the same quiz pays nothing.
  await attempt(uid, [{ questionId: "x1", isCorrect: true }, { questionId: "x2", isCorrect: true }, { questionId: "x3", isCorrect: true }]);
  await sleep(4000);
  assert((await stars(uid)) === 23, "replay pays 0 (x3 was wrong first: it pays when fixed)");

  // 3) Fixing the x3 mistake in My mistakes pays 1.
  const qp = db.doc(`users/${uid}/questProgress/english-quest`);
  await qp.set({ nodes: {}, mistakes: { x3: { kind: "question", questionId: "x3", rightInARow: 1, lastWrongAt: 5 } } });
  await sleep(2500);
  await qp.set({ nodes: {}, mistakes: {} });
  await waitFor(async () => (await stars(uid)) === 24, "fix paid");
  assert(true, "mistake fixed: +1 → 24");

  // 4) A real English topic turning green pays 5.
  const main = (NODES_BY_QUEST["english-quest"] || []).find((n) => n.kind === "main" && n.stepCount > 0);
  const nodes = {};
  for (let i = 0; i < main.stepCount; i++) nodes[`${main.id}__${i}`] = { status: "completed" };
  await qp.set({ nodes, mistakes: {} });
  await waitFor(async () => (await stars(uid)) === 29, "topic paid");
  assert(true, `topic ${main.id} green: +5 → 29`);
  await qp.set({ nodes, mistakes: {}, touched: 1 });
  await sleep(3000);
  assert((await stars(uid)) === 29, "the same green topic never pays twice");

  // 5) The ledger is server-only data and exists; demo accounts are ignored.
  assert((await db.doc(`starLedgers/${uid}__english-quest`).get()).exists, "ledger written");
  await db.doc("users/demo_kid").set({ stats: { totalStars: 0 } });
  await attempt("demo_kid", [{ questionId: "d1", isCorrect: true }]);
  await sleep(3000);
  assert((await stars("demo_kid")) === 0, "demo accounts earn nothing");
  console.log("starTriggers emulator tests passed");
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });

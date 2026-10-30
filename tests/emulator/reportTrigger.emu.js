// Emulator-only test for onQuestionReported (Spec B). Uses the demo project; never touches production.
// Run: npm run test:emulator   (needs Java for the Firestore emulator)
const path = require("path");
const admin = require(path.join(process.argv[2], "functions/node_modules/firebase-admin"));
admin.initializeApp({ projectId: "demo-apprec8" });
const db = admin.firestore();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const assert = (c, m) => { if (!c) { console.error("FAIL:", m); process.exit(1); } console.log("ok -", m); };

async function waitFor(fn, label, ms = 15000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) { const v = await fn(); if (v) return v; await sleep(400); }
  throw new Error("timeout: " + label);
}
const report = (uid, questionId, reason, chosen) =>
  db.collection("userFeedback").add({
    userId: uid, entryPoint: "report_flag", issueCategory: reason, questId: "eq",
    contentContext: { type: "quest_question", id: questionId, parentId: "pool", titlePreview: "Q" },
    chosen, createdAt: admin.firestore.FieldValue.serverTimestamp(), status: "new",
  });

(async () => {
  // Gate pool: 15 questions, sub-topics A(4) B(4) C(4) D(3); draw 10.
  await db.doc("quests/eq").set({ title: "EQ" });
  await db.doc("quests/eq/nodes/gate").set({ kind: "gate", quizId: "pool", drawCount: 10 });
  const subs = { A: 4, B: 4, C: 4, D: 3 };
  for (const [s, n] of Object.entries(subs)) for (let i = 1; i <= n; i++) {
    await db.doc(`questions/${s}${i}`).set({ quizId: "pool", subtopic: s });
  }
  const issue = async (id) => (await db.doc("quests/eq").get()).data()?.knownIssues?.[id];

  // 1) Same kid 3x = 1 distinct; 3 kids → known
  await report("k1", "A1", "spelling", null); await report("k1", "A1", "spelling", null);
  await report("k2", "A1", "confusing", null);
  await sleep(3000);
  assert(!(await issue("A1")), "2 distinct kids: not yet known");
  await report("k3", "A1", "spelling", null);
  const a1 = await waitFor(() => issue("A1"), "A1 known");
  assert(a1.status === "known", "3 distinct kids → known");

  // 2) 5 kids who answered "wrong_answer" → hidden
  for (const k of ["w1", "w2", "w3", "w4", "w5"]) await report(k, "B1", "wrong_answer", "x");
  const b1 = await waitFor(async () => ((await issue("B1"))?.status === "hidden" ? issue("B1") : null), "B1 hidden");
  assert(b1.status === "hidden" && !b1.needsAdmin, "5 kids wrong_answer + answered → hidden");

  // 3) Kids who didn't answer don't count towards hiding
  for (const k of ["n1", "n2", "n3", "n4", "n5"]) await report(k, "C1", "wrong_answer", null);
  const c1 = await waitFor(() => issue("C1"), "C1 marked");
  await sleep(2000);
  assert((await issue("C1")).status === "known", "wrong_answer without answering → known, not hidden");

  // 4) Pool starvation: D has 3; hiding D1 leaves 2 (ok), hiding D2 would leave 1 → blocked
  for (const k of ["d1", "d2", "d3", "d4", "d5"]) await report(k, "D1", "wrong_answer", "x");
  await waitFor(async () => ((await issue("D1"))?.status === "hidden" ? true : null), "D1 hidden");
  assert(true, "D1 hidden (D keeps 2)");
  for (const k of ["e1", "e2", "e3", "e4", "e5"]) await report(k, "D2", "wrong_answer", "x");
  const d2 = await waitFor(async () => { const v = await issue("D2"); return v && v.needsAdmin ? v : null; }, "D2 blocked");
  assert(d2.status === "known" && d2.needsAdmin === true, "D2 NOT hidden (sub-topic would drop to 1) → known + needsAdmin");

  // 5) Old feedback (not report_flag) is ignored
  await db.collection("userFeedback").add({ userId: "z", entryPoint: "like_fab", contentContext: { id: "A2" } });
  await sleep(2500);
  assert(!(await issue("A2")) && !(await db.doc("questionIssues/A2").get()).exists, "old feedback ignored");

  const tally = (await db.doc("questionIssues/A1").get()).data();
  assert(tally.counts.distinct === 3, "questionIssues tally counts distinct kids (3)");
  console.log("EMULATOR TEST PASSED");
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });

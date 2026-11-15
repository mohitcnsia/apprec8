// scripts/admin/starCatchUp.cjs: ONE-TIME star catch-up (owner 16 Nov 2026: "yes of course. And we must make up to
// her" — Tripti had 161 right answers and 19 stars). Every child gets 1 star per different question they ever answered
// right (rules: functions/utils/starRules.js catchUp), and a ledger seeded from their history so none of those
// questions pays again under the new rules.
//
// FAIRNESS (owner 16 Nov: "go with the most fair one"): a TOP-UP, never on top. A child gets
// max(0, stars the new rules would have paid − stars they already have), so nobody is paid twice for the same
// questions (Hazel had 8,945 from the old 100% rule) and nobody loses a star.
//
// Run BEFORE deploying the star triggers:   node scripts/admin/starCatchUp.cjs            (dry run: prints, writes nothing)
//                                           node scripts/admin/starCatchUp.cjs --apply    (writes; skips anyone already caught up)
// Uses application-default credentials (same as scripts/chess/seedChessGame.mjs).
const path = require("path");
const root = path.join(__dirname, "..", "..");
const admin = require(path.join(root, "functions/node_modules/firebase-admin"));
const { catchUp } = require(path.join(root, "functions/utils/starRules.js"));
admin.initializeApp({ projectId: "apprec8-ca229" });
const db = admin.firestore();
const { FieldValue } = require(path.join(root, "functions/node_modules/firebase-admin/lib/firestore"));
const APPLY = process.argv.includes("--apply");

(async () => {
  const byUser = {};
  let last = null, total = 0;
  for (;;) {
    let q = db.collection("questAttempts").orderBy("__name__").limit(500);
    if (last) q = q.startAfter(last);
    const snap = await q.get();
    if (snap.empty) break;
    for (const d of snap.docs) {
      const a = d.data();
      const uid = String(a.userId || "");
      if (!uid || uid.startsWith("demo_")) continue;
      (byUser[uid] = byUser[uid] || []).push({ questId: a.questId, answers: a.answers || [], atMs: a.createdAt?.toMillis?.() || a.startedAtMs || 0 });
    }
    total += snap.size;
    last = snap.docs[snap.docs.length - 1];
  }
  console.log(`read ${total} attempts from ${Object.keys(byUser).length} children`);

  let grantTotal = 0, people = 0;
  for (const [uid, attempts] of Object.entries(byUser)) {
    const userRef = db.collection("users").doc(uid);
    const user = await userRef.get();
    if (!user.exists) continue;
    const u = user.data();
    if (u.starCatchUpAt) { console.log(`skip ${u.firstName || "?"}: already caught up`); continue; }
    const { stars: deserved, ledgers } = catchUp(attempts);
    const stars = Math.max(0, deserved - (u.stats?.totalStars || 0));
    const name = String(u.firstName || "?").split(" ")[0];
    console.log(`${name.padEnd(14)} now ${String(u.stats?.totalStars || 0).padStart(5)}  new-rule ${String(deserved).padStart(5)}  +${String(stars).padStart(4)}  → ${(u.stats?.totalStars || 0) + stars}`);
    grantTotal += stars; people += 1;
    if (!APPLY) continue;
    const batch = db.batch();
    for (const [questId, L] of Object.entries(ledgers)) {
      const ref = db.collection("starLedgers").doc(`${uid}__${String(questId).replace(/\//g, "_")}`);
      const old = (await ref.get()).data() || {};
      // anything the live triggers already recorded wins over the history
      batch.set(ref, { q: { ...L.q, ...(old.q || {}) }, nodes: { ...(old.nodes || {}) }, fixes: { ...(old.fixes || {}) }, papers: { ...(old.papers || {}) } });
    }
    const upd = { starCatchUpAt: Date.now(), starCatchUp: stars, starCatchUpDeserved: deserved };
    if (stars > 0) {
      upd["stats.totalStars"] = FieldValue.increment(stars);
      upd.lastAward = { id: "catch-up", at: Date.now(), stars, reasons: [{ n: stars, why: "all your practice so far" }] };
    }
    batch.update(userRef, upd);
    await batch.commit();
  }
  console.log(`${APPLY ? "GRANTED" : "dry run: would grant"} ${grantTotal} stars to ${people} children`);
  process.exit(0);
})().catch((e) => { console.error("ERR", e.message); process.exit(1); });

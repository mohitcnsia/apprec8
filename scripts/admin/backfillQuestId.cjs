// scripts/admin/backfillQuestId.cjs: DR-14 one-time fix (cost guard, 2026-11-05).
// Progress docs users/{uid}/questProgress/{questId} saved before today have no `questId` field, so the admin dashboard's
// new "only this quest" query would miss them. This adds `questId` (= the doc id) to every doc that lacks it.
// Safe to re-run: it only touches docs without the field, and only writes that one field (merge).
//
// Dry run (default, writes nothing):  node scripts/admin/backfillQuestId.cjs
// Apply (owner OK needed):            node scripts/admin/backfillQuestId.cjs --apply
// Credentials: GOOGLE_APPLICATION_CREDENTIALS, or the Firebase CLI's application-default login.

const admin = require("../../functions/node_modules/firebase-admin");

admin.initializeApp({ projectId: "apprec8-ca229" });
const db = admin.firestore();
const apply = process.argv.includes("--apply");

(async () => {
  const snap = await db.collectionGroup("questProgress").get();
  const missing = snap.docs.filter((d) => d.get("questId") !== d.id);
  console.log(`${snap.size} progress docs, ${missing.length} without questId`);
  if (!apply) {
    missing.slice(0, 20).forEach((d) => console.log("  would set", d.ref.path));
    console.log("Dry run only. Add --apply to write.");
    return;
  }
  for (let i = 0; i < missing.length; i += 400) {
    const batch = db.batch();
    missing.slice(i, i + 400).forEach((d) => batch.set(d.ref, { questId: d.id }, { merge: true }));
    await batch.commit();
  }
  console.log(`Done: set questId on ${missing.length} docs.`);
})().catch((e) => {
  console.error("backfillQuestId failed:", e.message);
  process.exit(1);
});

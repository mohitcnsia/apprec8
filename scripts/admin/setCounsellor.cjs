// scripts/admin/setCounsellor.cjs: marks a teacher as the school counsellor for the weekly mood check (well-being
// safety steps). A counsellor sees "kids to see" for the classes she teaches (functions/callable/moodActions.js).
//
// Look up (writes nothing):      node scripts/admin/setCounsellor.cjs someone@example.com
// Make counsellor (owner OK):    node scripts/admin/setCounsellor.cjs someone@example.com --apply
// Remove:                        node scripts/admin/setCounsellor.cjs someone@example.com --remove --apply
// Only touches roles/{uid}.counsellor. Credentials: GOOGLE_APPLICATION_CREDENTIALS or the Firebase CLI's login.
const admin = require("../../functions/node_modules/firebase-admin");

admin.initializeApp({ projectId: "apprec8-ca229" });
const db = admin.firestore();
const mask = (e) => String(e).replace(/^(.).*(@.*)$/, "$1***$2");

(async () => {
  const email = process.argv[2];
  if (!email || !email.includes("@")) throw new Error("Usage: node scripts/admin/setCounsellor.cjs <email> [--remove] [--apply]");
  const u = await admin.auth().getUserByEmail(email);
  const d = (await db.collection("users").doc(u.uid).get()).data() || {};
  const classes = (await db.collection("classes").where("teacherIds", "array-contains", u.uid).limit(30).get()).docs.map((c) => c.data().name || c.id);
  const role = (await db.collection("roles").doc(u.uid).get()).data() || {};
  console.log(`${mask(email)}: ${d.firstName || u.displayName || "(no name)"}, teaches ${classes.length ? classes.join(", ") : "no class"}, counsellor now: ${role.counsellor === true}`);
  const on = !process.argv.includes("--remove");
  if (!process.argv.includes("--apply")) return console.log(`Dry run. Add --apply to set counsellor = ${on}.`);
  await db.collection("roles").doc(u.uid).set({ counsellor: on }, { merge: true });
  console.log(`Done: counsellor = ${on}.`);
})().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});

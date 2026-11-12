// scripts/admin/unconsented.cjs: students who signed up alone and still have no parent's yes (spec X, DPDP).
// Their sign-in data shouldn't be kept for long without consent. Weekly, by hand for now (no new scheduled job:
// 3 = the free limit); automate once the pilot shows it works.
//
// List (writes nothing):               node scripts/admin/unconsented.cjs
// Delete those older than 14 days:     node scripts/admin/unconsented.cjs --apply      (owner OK needed)
// Credentials: GOOGLE_APPLICATION_CREDENTIALS, or the Firebase CLI's application-default login.

const admin = require("../../functions/node_modules/firebase-admin");
const { eraseUser } = require("../../functions/utils/eraseUser");

admin.initializeApp({ projectId: "apprec8-ca229" });
const OWNER_UID = "ThOziLzf1INR9K9hxZQxOMgjcJD3";
const TESTER_EMAILS = ["mohitchilkoti@gmail.com"]; // = config/appConfig.js TESTER_EMAILS
const DAYS = 14;

(async () => {
  const { needsParentConsent } = await import("../../utils/consent.js");
  const snap = await admin.firestore().collection("users").where("grade", ">=", 1).limit(2000).get();
  const cutoff = Date.now() - DAYS * 24 * 3600 * 1000;
  const rows = snap.docs
    .map((d) => ({ uid: d.id, ...d.data() }))
    .filter((u) => u.uid !== OWNER_UID && !TESTER_EMAILS.includes(String(u.email || "").toLowerCase()))
    .filter((u) => needsParentConsent(u));
  const ms = (t) => (t?.toMillis ? t.toMillis() : Number(t) || 0);
  const old = rows.filter((u) => ms(u.createdAt) && ms(u.createdAt) < cutoff);
  rows.forEach((u) => console.log(`${ms(u.createdAt) < cutoff ? "OLD " : "new "} ${u.uid}  ${u.firstName || "-"}  class ${u.grade}  since ${new Date(ms(u.createdAt)).toISOString().slice(0, 10)}`));
  console.log(`${rows.length} students without a parent's yes; ${old.length} older than ${DAYS} days.`);
  // LOCKED (owner, 12 Nov 2026): no automatic deletion, no 14-day cleanup. List only.
  return console.log("List only. Deleting is switched off (owner, 12 Nov): every deletion waits for the owner's own click.");
  for (const u of old) console.log(JSON.stringify(await eraseUser(admin, u.uid)));
  console.log(`Deleted ${old.length}.`);
})().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});

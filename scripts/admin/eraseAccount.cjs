// scripts/admin/eraseAccount.cjs: an emailed deletion request (docs/policies/data-deletion-policy.html, "within 7 days").
// Same deletion as in-app "Delete my account" (functions/utils/eraseUser.js).
//
// Look up (writes nothing):       node scripts/admin/eraseAccount.cjs someone@example.com
// Delete (owner OK needed):       node scripts/admin/eraseAccount.cjs someone@example.com --apply
// A child profile (no email):     node scripts/admin/eraseAccount.cjs --uid <kidUid> [--apply]
// Credentials: GOOGLE_APPLICATION_CREDENTIALS, or the Firebase CLI's application-default login.

const admin = require("../../functions/node_modules/firebase-admin");
const { eraseUser } = require("../../functions/utils/eraseUser");

admin.initializeApp({ projectId: "apprec8-ca229" });
const OWNER_UID = "ThOziLzf1INR9K9hxZQxOMgjcJD3";

(async () => {
  const i = process.argv.indexOf("--uid");
  const email = process.argv[2];
  let u;
  if (i > 0 && process.argv[i + 1]) u = { uid: process.argv[i + 1], displayName: null };
  else if (email && email.includes("@")) u = await admin.auth().getUserByEmail(email);
  else throw new Error("Usage: node scripts/admin/eraseAccount.cjs <email> | --uid <uid>  [--apply]");
  if (u.uid === OWNER_UID) throw new Error("That is the owner's account. Not deleting.");
  const doc = await admin.firestore().collection("users").doc(u.uid).get();
  const d = doc.exists ? doc.data() : {};
  console.log(`Found ${u.uid}: ${d.firstName || u.displayName || "(no name)"}, class ${d.grade ?? "-"}, children ${(d.childUids || []).length}, classes ${(d.classIds || []).length}`);
  // LOCKED (owner, 12 Nov 2026): no deletion without the owner's own click; every deletion gets a 90-day window and a
  // pending decision on his Home. Until that flow exists, this script only looks up.
  if (process.argv.includes("--apply")) return console.log("Deleting is switched off (owner, 12 Nov): no deletion without the owner's own click.");
  return console.log("Look-up only.");
  console.log(JSON.stringify(await eraseUser(admin, u.uid)));
  console.log("Deleted. Reply to the email to confirm.");
})().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});

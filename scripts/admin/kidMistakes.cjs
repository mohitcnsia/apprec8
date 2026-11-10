// Read-only: one kid's quiz history → mistakes by quest/topic/tag, written to docs/agents/private/ (git-ignored).
// Usage: node scripts/admin/kidMistakes.cjs <firstName> [parentUid]
const path = require("path");
const fs = require("fs");
const admin = require(path.join(__dirname, "../../functions/node_modules/firebase-admin"));
if (!admin.apps.length) admin.initializeApp({ projectId: "apprec8-ca229" });
const db = admin.firestore();
(async () => {
  const [name, parentUid] = process.argv.slice(2);
  let q = db.collection("users");
  q = parentUid ? q.where("parentUids", "array-contains", parentUid) : q.where("firstName", "==", name);
  const users = (await q.limit(20).get()).docs.filter((d) => !name || (d.data().firstName || "").toLowerCase() === name.toLowerCase());
  if (!users.length) return console.log("no match");
  const out = [];
  for (const u of users) {
    const ud = u.data();
    const atts = (await db.collection("questAttempts").where("userId", "==", u.id).limit(1000).get()).docs.map((d) => d.data());
    const prog = (await db.collection("users").doc(u.id).collection("questProgress").get()).docs.map((d) => ({ id: d.id, ...d.data() }));
    out.push({ uid: u.id.slice(0, 6) + "…", firstName: ud.firstName, grade: ud.grade, attempts: atts, progress: prog });
    console.log(`${ud.firstName} (class ${ud.grade}): ${atts.length} attempts, ${prog.length} progress docs`);
  }
  const dir = path.join(__dirname, "../../docs/agents/private");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `kid-${name.toLowerCase()}.json`), JSON.stringify(out, (k, v) => (v && v._seconds ? new Date(v._seconds * 1000).toISOString() : v)));
})();

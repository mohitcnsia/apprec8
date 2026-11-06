// scripts/admin/decisions.mjs: the owner's Decisions inbox (utils/decisions.js).
//   node scripts/admin/decisions.mjs              → new questions from docs/agents/decisions.json go to Firestore
//                                                    (one push to the owner), answers come back into the file
//   node scripts/admin/decisions.mjs --dry        → shows what it would do, writes nothing
//   node scripts/admin/decisions.mjs --test-push  → one test notification to the owner's phone
//   node scripts/admin/decisions.mjs --watch      → the same sync every 10 minutes (~1,600 reads a day: free tier)
// Run it from Claude's folder (apprec8), so answers land in the file Claude reads.
// Only touches ownerDecisions/* and reads ownerConfig/device. Credentials: GOOGLE_APPLICATION_CREDENTIALS or the
// Firebase CLI's application-default login.
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { newQuestions, questionDoc, mergeAnswers, pushText, answerLabel } from "../../utils/decisions.js";

const require = createRequire(import.meta.url);
const admin = require("../../functions/node_modules/firebase-admin");
admin.initializeApp({ projectId: "apprec8-ca229" });
const db = admin.firestore();

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const FILE = join(root, "docs/agents/decisions.json");
const dry = process.argv.includes("--dry");

async function ownerTokens() {
  const d = await db.collection("ownerConfig").doc("device").get();
  return (d.exists && d.data().tokens) || [];
}

async function push(msg) {
  const tokens = await ownerTokens();
  if (!tokens.length) return "no phone yet (owner: Me → Decisions → Notify me on this phone)";
  const res = await admin.messaging().sendEachForMulticast({
    tokens,
    notification: msg,
    data: { view: "decisions" },
    android: { priority: "high" },
  });
  return `push sent to ${res.successCount}/${tokens.length} phone(s)`;
}

if (process.argv.includes("--test-push")) {
  console.log(await push({ title: "Apprec8: test", body: "Notifications work. Tap to open your Decisions." }));
  process.exit(0);
}

async function syncOnce() {
  const list = JSON.parse(readFileSync(FILE, "utf8"));
  const snap = await db.collection("ownerDecisions").limit(500).get();
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const fresh = newQuestions(list, docs.map((d) => d.id));
  const log = [];
  if (fresh.length) log.push(`${fresh.length} new: ${fresh.map((q) => q.id).join(", ")}`);
  const now = Date.now();
  if (!dry && fresh.length) {
    const batch = db.batch();
    for (const q of fresh) batch.create(db.collection("ownerDecisions").doc(q.id), questionDoc(q, now));
    await batch.commit();
  }
  // One notification for everything open that was never announced (also waits for the owner's phone).
  const unpushed = [...docs.filter((d) => d.status === "open" && !d.pushedAt), ...fresh];
  if (!dry && unpushed.length && (await ownerTokens()).length) {
    log.push(await push(pushText(unpushed)));
    const batch = db.batch();
    for (const d of unpushed) batch.update(db.collection("ownerDecisions").doc(d.id), { pushedAt: now });
    await batch.commit();
  }
  // Answered in the chat (the file has answer + via: "chat"): close the card in the inbox too.
  const chatClosed = list.filter((q) => q.via === "chat" && q.answer && docs.some((d) => d.id === q.id && d.status !== "answered"));
  if (!dry && chatClosed.length) {
    const batch = db.batch();
    for (const q of chatClosed) batch.update(db.collection("ownerDecisions").doc(q.id), { answer: q.answer, note: q.note || "answered in the chat", status: "answered", answeredAt: now, laterUntil: null });
    await batch.commit();
    log.push(`closed in the inbox (answered in chat): ${chatClosed.map((q) => q.id).join(", ")}`);
  }
  const chatIds = new Set(list.filter((q) => q.via === "chat").map((q) => q.id));
  const merged = mergeAnswers(list, docs.filter((d) => !chatIds.has(d.id))); // same order as the file
  const answered = merged.filter((q, i) => q.answer && q.answer !== list[i].answer);
  for (const q of answered) log.push(`answer ${q.id}: ${answerLabel(q.answer)}${q.note ? ` · "${q.note}"` : ""}`);
  if (!dry && answered.length) writeFileSync(FILE, JSON.stringify(merged, null, 2) + "\n");
  return { log, summary: `${list.length} in file · ${docs.length} in Firestore${dry ? " (dry run: nothing written)" : ""}` };
}

const watch = process.argv.includes("--watch");
do {
  const { log, summary } = await syncOnce();
  const t = new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" });
  if (!watch || log.length) console.log(`[${t}] ${summary}${log.length ? "\n  " + log.join("\n  ") : ""}`);
  if (watch) await new Promise((r) => setTimeout(r, 10 * 60 * 1000));
} while (watch);
process.exit(0);

// scripts/admin/feedback.mjs: exports feedback to docs/agents/private/feedback.json (G66).
//   node scripts/admin/feedback.mjs          → incremental sync of new feedback / ideas / reports
//   node scripts/admin/feedback.mjs --dry    → preview what would be exported without writing
//   node scripts/admin/feedback.mjs --watch  → syncs every 10 minutes in the background
//
// PRIVACY: All exported docs are redacted (first name & class only; no emails, UIDs, or phone numbers).
// The target directory docs/agents/private/ is strictly GIT-IGNORED.
// COST GUARD: Tracks lastSyncMs to only read newly created feedback docs on subsequent runs.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { redactFeedbackForExport } from "../../utils/feedbackPipeline.js";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const PRIVATE_DIR = join(root, "docs/agents/private");
const OUT_FILE = join(PRIVATE_DIR, "feedback.json");
const STATE_FILE = join(PRIVATE_DIR, ".feedback_sync.json");
const dry = process.argv.includes("--dry");

let admin;
const candidateAdminPaths = [
  join(root, "functions/node_modules/firebase-admin"),
  join(root, "../apprec8/functions/node_modules/firebase-admin"),
  "firebase-admin",
];

for (const p of candidateAdminPaths) {
  try {
    admin = require(p);
    break;
  } catch {
    // continue
  }
}

if (!admin) {
  throw new Error("Could not find firebase-admin in functions/node_modules or main worktree");
}

if (!admin.apps.length) {
  admin.initializeApp({ projectId: "apprec8-ca229" });
}
const db = admin.firestore();

export async function syncFeedbackOnce({ dbInstance = db, privateDir = PRIVATE_DIR, outFile = OUT_FILE, stateFile = STATE_FILE, isDry = dry } = {}) {
  if (!existsSync(privateDir)) {
    mkdirSync(privateDir, { recursive: true });
  }

  let lastSyncMs = 0;
  if (existsSync(stateFile)) {
    try {
      const state = JSON.parse(readFileSync(stateFile, "utf8"));
      lastSyncMs = Number(state.lastSyncMs) || 0;
    } catch {
      lastSyncMs = 0;
    }
  }

  let existingList = [];
  if (existsSync(outFile)) {
    try {
      existingList = JSON.parse(readFileSync(outFile, "utf8"));
      if (!Array.isArray(existingList)) existingList = [];
    } catch {
      existingList = [];
    }
  }

  let q = dbInstance.collection("userFeedback");
  if (lastSyncMs > 0) {
    q = q.where("createdAt", ">", new Date(lastSyncMs)).orderBy("createdAt", "desc").limit(200);
  } else {
    q = q.orderBy("createdAt", "desc").limit(100);
  }

  const snap = await q.get();
  const freshDocs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const redactedNew = freshDocs.map(redactFeedbackForExport);

  // Merge with existing, deduplicating by id
  const existingMap = new Map(existingList.map((x) => [x.id, x]));
  for (const item of redactedNew) {
    existingMap.set(item.id, item);
  }
  const merged = Array.from(existingMap.values()).sort((a, b) => {
    const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return db - da; // newest first
  });

  const nowMs = Date.now();
  if (!isDry) {
    writeFileSync(outFile, JSON.stringify(merged, null, 2) + "\n");
    writeFileSync(stateFile, JSON.stringify({ lastSyncMs: nowMs, lastSyncIso: new Date(nowMs).toISOString(), count: merged.length }, null, 2) + "\n");
  }

  return {
    freshCount: freshDocs.length,
    totalCount: merged.length,
    summary: `${freshDocs.length} new items synced (${merged.length} total)${isDry ? " [dry run]" : ""}`,
  };
}

// CLI entry point
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
  const watch = process.argv.includes("--watch");
  do {
    try {
      const res = await syncFeedbackOnce();
      const t = new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" });
      console.log(`[${t}] ${res.summary}`);
    } catch (e) {
      console.error("Feedback sync failed:", e.message);
    }
    if (watch) {
      await new Promise((r) => setTimeout(r, 10 * 60 * 1000));
    }
  } while (watch);
}

// scripts/admin/copyContentToTest.mjs: copies content from real to test (G85).
// Usage:
//   node scripts/admin/copyContentToTest.mjs           (dry run, writes nothing)
//   node scripts/admin/copyContentToTest.mjs --apply   (copies content to apprec8-test)
//
// SAFETY: Copies CONTENT ONLY:
//   - quests, quests/{questId}/nodes
//   - categories (tiles)
//   - studyContent (study pages, readings, word tables)
//   - questions (quiz questions)
//   - quest_nodes (Space Olympiad)
//   - quizzes (if any)
// NEVER touches or copies:
//   - users (or subcollections like questProgress, answers)
//   - schools, classes, families
//   - userFeedback, reports, notifications, invites

import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

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
  throw new Error("Could not find firebase-admin");
}

const apply = process.argv.includes("--apply");

const realApp = admin.initializeApp({ projectId: "apprec8-ca229" }, "real");
const testApp = admin.initializeApp({ projectId: "apprec8-test" }, "test");

const realDb = realApp.firestore();
const testDb = testApp.firestore();

const BATCH_LIMIT = 400;

async function commitOps(db, ops) {
  for (let i = 0; i < ops.length; i += BATCH_LIMIT) {
    const batch = db.batch();
    const chunk = ops.slice(i, i + BATCH_LIMIT);
    chunk.forEach(({ ref, data }) => batch.set(ref, data));
    await batch.commit();
  }
}

async function run() {
  console.log(`=== Content Migration: apprec8-ca229 (real) → apprec8-test (test) ===`);
  console.log(`Mode: ${apply ? "APPLY (live writes to apprec8-test)" : "DRY RUN (no writes)"}\n`);

  const summary = {};
  const writeOps = [];

  // 1. Quests & quest nodes
  console.log("Reading quests and quest nodes...");
  const questsSnap = await realDb.collection("quests").get();
  summary.quests = questsSnap.size;
  summary.questNodes = 0;

  for (const qDoc of questsSnap.docs) {
    writeOps.push({
      ref: testDb.collection("quests").doc(qDoc.id),
      data: qDoc.data(),
    });

    const nodesSnap = await qDoc.ref.collection("nodes").get();
    summary.questNodes += nodesSnap.size;
    for (const nDoc of nodesSnap.docs) {
      writeOps.push({
        ref: testDb.collection("quests").doc(qDoc.id).collection("nodes").doc(nDoc.id),
        data: nDoc.data(),
      });
    }
  }

  // 2. Categories
  console.log("Reading categories...");
  const catSnap = await realDb.collection("categories").get();
  summary.categories = catSnap.size;
  for (const doc of catSnap.docs) {
    writeOps.push({
      ref: testDb.collection("categories").doc(doc.id),
      data: doc.data(),
    });
  }

  // 3. Study content (pages, readings, word tables)
  console.log("Reading studyContent...");
  const studySnap = await realDb.collection("studyContent").get();
  summary.studyContent = studySnap.size;
  for (const doc of studySnap.docs) {
    writeOps.push({
      ref: testDb.collection("studyContent").doc(doc.id),
      data: doc.data(),
    });
  }

  // 4. Questions
  console.log("Reading questions...");
  const questionsSnap = await realDb.collection("questions").get();
  summary.questions = questionsSnap.size;
  for (const doc of questionsSnap.docs) {
    writeOps.push({
      ref: testDb.collection("questions").doc(doc.id),
      data: doc.data(),
    });
  }

  // 5. Space quest legacy nodes (quest_nodes)
  console.log("Reading quest_nodes...");
  const legacySnap = await realDb.collection("quest_nodes").get();
  summary.quest_nodes = legacySnap.size;
  for (const doc of legacySnap.docs) {
    writeOps.push({
      ref: testDb.collection("quest_nodes").doc(doc.id),
      data: doc.data(),
    });
  }

  // 6. Quizzes (if any)
  try {
    const quizzesSnap = await realDb.collection("quizzes").get();
    if (quizzesSnap.size > 0) {
      summary.quizzes = quizzesSnap.size;
      for (const doc of quizzesSnap.docs) {
        writeOps.push({
          ref: testDb.collection("quizzes").doc(doc.id),
          data: doc.data(),
        });
      }
    }
  } catch {
    // collection may not exist
  }

  console.log("\n--- Content Summary to Copy ---");
  console.log(`  Quests:       ${summary.quests} docs`);
  console.log(`  Quest Nodes:  ${summary.questNodes} docs`);
  console.log(`  Categories:   ${summary.categories} docs`);
  console.log(`  StudyContent: ${summary.studyContent} docs`);
  console.log(`  Questions:    ${summary.questions} docs`);
  console.log(`  Quest_nodes:  ${summary.quest_nodes} docs`);
  if (summary.quizzes) console.log(`  Quizzes:      ${summary.quizzes} docs`);
  console.log(`  TOTAL:        ${writeOps.length} documents\n`);

  if (!apply) {
    console.log("Dry run complete. No writes performed. Run with --apply to copy to apprec8-test.");
    process.exit(0);
  }

  console.log(`Writing ${writeOps.length} documents to apprec8-test in batches of ${BATCH_LIMIT}...`);
  await commitOps(testDb, writeOps);
  console.log("Successfully copied all content to apprec8-test!");
  process.exit(0);
}

run().catch((e) => {
  console.error("copyContentToTest failed:", e);
  process.exit(1);
});

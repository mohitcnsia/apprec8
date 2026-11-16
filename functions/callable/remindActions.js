// functions/callable/remindActions.js
// G87 & G84b: Teacher assignment reminders.
// Sends a reminder to uncompleted kids: puts a nudge card on the child's Home,
// and sends a throttled push to linked parents.
// Throttled to at most 1 reminder per child per assignment per day.
const functions = require("firebase-functions");
const { admin } = require("../common/admin");
const { region, runtimeOptions } = require("../common/config");
const { sendThrottledPushToUser } = require("../utils/throttledPush");
const { parentRemindMessage } = require("../utils/pendingPush");

const db = admin.firestore();
const OWNER_UID = "ThOziLzf1INR9K9hxZQxOMgjcJD3";
const DAY_MS = 24 * 60 * 60 * 1000;
const istKey = (ms) => new Date(ms).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

function formatRemindMessage(teacherName = "Teacher", assignmentTitle = "Assignment", mistakesLeft = 0) {
  const name = teacherName ? `${teacherName}: ` : "";
  if (mistakesLeft > 0) {
    const plural = mistakesLeft === 1 ? "mistake" : "mistakes";
    return `${name}finish ${assignmentTitle} — ${mistakesLeft} ${plural} to fix`;
  }
  return `${name}please complete ${assignmentTitle}`;
}

exports.remindAssignment = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Sign in first.");
    const caller = context.auth.uid;
    const classId = String(data?.classId || "");
    const assignmentId = String(data?.assignmentId || "");
    const assignmentTitle = String(data?.assignmentTitle || "Assignment").slice(0, 100);
    const toUids = Array.isArray(data?.toUids) ? [...new Set(data.toUids.map(String))].slice(0, 100) : [];
    const mistakesMap = data?.mistakesMap && typeof data.mistakesMap === "object" ? data.mistakesMap : {};

    if (!classId || !assignmentId || !toUids.length) {
      throw new functions.https.HttpsError("invalid-argument", "Class, assignment and students are required.");
    }

    const cls = await db.collection("classes").doc(classId).get();
    if (!cls.exists) throw new functions.https.HttpsError("not-found", "No such class.");
    const isTeacher = (cls.data().teacherIds || []).includes(caller);
    if (!isTeacher && caller !== OWNER_UID) {
      throw new functions.https.HttpsError("permission-denied", "Only this class's teacher can send reminders.");
    }

    const teacherDoc = await db.collection("users").doc(caller).get();
    const teacherName = (teacherDoc.data() || {}).firstName || "Your teacher";
    const now = Date.now();
    const today = istKey(now);

    const members = await db.getAll(...toUids.map((u) => cls.ref.collection("members").doc(u)));
    const okUids = members.filter((m) => m.exists && m.data().status === "approved").map((m) => m.id);

    let reminded = 0;
    const users = okUids.length ? await db.getAll(...okUids.map((uid) => db.collection("users").doc(uid))) : [];
    const userData = Object.fromEntries(users.map((u) => [u.id, u.exists ? u.data() : {}]));

    const batch = db.batch();
    const pushTasks = [];

    for (const uid of okUids) {
      const lockRef = db.collection("assignmentReminders").doc(`${classId}_${assignmentId}_${uid}_${today}`);
      const lockDoc = await lockRef.get();
      if (lockDoc.exists) continue; // already reminded today

      const mistakesLeft = Number(mistakesMap[uid]) || 0;
      const messageBody = formatRemindMessage(teacherName, assignmentTitle, mistakesLeft);

      // Card on child's Home
      batch.set(
        db.collection("users").doc(uid),
        {
          nudge: {
            kind: "remind",
            from: teacherName,
            topic: assignmentTitle,
            mistakesLeft,
            assignmentId,
            classId,
            at: now,
            until: now + DAY_MS,
          },
          lastRemindedAssignment: {
            [assignmentId]: now,
          },
        },
        { merge: true }
      );

      // Lock reminder for today
      batch.set(lockRef, { at: now, by: caller, classId, assignmentId, uid }, { merge: true });
      reminded += 1;

      // Push to linked parents
      const kid = userData[uid] || {};
      const parents = Array.isArray(kid.parentUids) ? kid.parentUids.slice(0, 4) : [];
      for (const parentUid of parents) {
        pushTasks.push(
          sendThrottledPushToUser(
            parentUid,
            // Owner, 16 Nov 2026: no teacher first names to parents; the child's own name is fine.
            parentRemindMessage({ kidName: kid.firstName, assignmentTitle, mistakesLeft }),
            "family"
          ).catch(() => {})
        );
      }
    }

    if (reminded > 0) {
      await batch.commit();
      await Promise.all(pushTasks);
    }

    return { ok: true, reminded, skipped: toUids.length - reminded };
  });

exports._remindForTests = { formatRemindMessage, istKey };

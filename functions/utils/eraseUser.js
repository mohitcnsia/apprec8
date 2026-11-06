// functions/utils/eraseUser.js
// "Delete my account" really deletes (2026-11-06, needed for Play + India's DPDP Act). Before this, deletion only
// blanked the name and email and left quiz answers, progress, class lists and consent details behind.
//
// What happens to one account:
// - users/{uid} with every subcollection (questProgress, quizAttempts, …): deleted
// - questAttempts with userId == uid (every answer): deleted
// - classes/{id}/members/{uid} and teacherRequests/{uid}: deleted; teacherIds / teacherSubjects: removed
// - parentPins/{uid}, roles/{uid}, unused childLoginCodes / parentLinkCodes made by this parent: deleted
// - child profiles this parent made (no own login): erased the same way; children with their own login: unlinked
// - this child's parents: unlinked (childUids)
// - consents: kept as proof that consent was given, with the parent's name removed (kind, version and dates stay)
// - userFeedback (🚩 reports): the text stays for fixing questions; userId and name removed
// - the sign-in account (Firebase Auth): deleted
// Not touched: questionIssues reporter counts (random ids only, no names), class clap tallies (ids only).

/** Pure: what to clean for this user doc. */
function erasePlan(uid, user = {}) {
  const uniq = (a) => [...new Set((a || []).filter((x) => typeof x === "string" && x))];
  return {
    memberOf: uniq([...(user.classIds || []), ...(user.pendingClassIds || [])]),
    teaches: uniq(user.teachesClassIds),
    parents: uniq(user.parentUids).filter((p) => p !== uid),
    children: uniq(user.childUids).filter((c) => c !== uid),
  };
}

const MAX_DOCS = 20000; // a hard stop for one account's attempts / feedback (bounded cost)

async function deleteWhere(db, query, { update } = {}) {
  let n = 0;
  for (;;) {
    const snap = await query.limit(400).get();
    if (snap.empty) return n;
    const batch = db.batch();
    snap.docs.forEach((d) => (update ? batch.update(d.ref, update) : batch.delete(d.ref)));
    await batch.commit();
    n += snap.size;
    if (snap.size < 400 || n >= MAX_DOCS) return n;
  }
}

/**
 * Erases one account. `admin` = firebase-admin. Returns counts for the log.
 * @param {{ depth?: number }} opts - child profiles are erased with depth 1 (no deeper)
 */
async function eraseUser(admin, uid, opts = {}) {
  const db = admin.firestore();
  const { FieldValue } = admin.firestore;
  const depth = opts.depth || 0;
  const userRef = db.collection("users").doc(uid);
  const snap = await userRef.get();
  const user = snap.exists ? snap.data() : {};
  const plan = erasePlan(uid, user);
  const out = { uid, attempts: 0, feedback: 0, classes: 0, children: 0 };

  // Children first: profiles this parent made go with the parent; own-login children are only unlinked.
  for (const kid of plan.children) {
    const k = await db.collection("users").doc(kid).get();
    if (!k.exists) continue;
    const onlyThisParent = (k.data().parentUids || []).every((p) => p === uid);
    if (!k.data().ownLogin && onlyThisParent && depth === 0) {
      await eraseUser(admin, kid, { depth: 1 });
      out.children += 1;
    } else {
      await k.ref.set({ parentUids: FieldValue.arrayRemove(uid) }, { merge: true });
    }
  }
  for (const p of plan.parents) {
    await db.collection("users").doc(p).set({ childUids: FieldValue.arrayRemove(uid) }, { merge: true }).catch(() => {});
  }

  for (const classId of plan.memberOf) {
    const cls = db.collection("classes").doc(classId);
    await cls.collection("members").doc(uid).delete().catch(() => {});
    out.classes += 1;
  }
  for (const classId of plan.teaches) {
    const cls = db.collection("classes").doc(classId);
    await cls.update({ teacherIds: FieldValue.arrayRemove(uid), [`teacherSubjects.${uid}`]: FieldValue.delete() }).catch(() => {});
    await cls.collection("teacherRequests").doc(uid).delete().catch(() => {});
    out.classes += 1;
  }

  out.attempts = await deleteWhere(db, db.collection("questAttempts").where("userId", "==", uid));
  out.feedback = await deleteWhere(db, db.collection("userFeedback").where("userId", "==", uid), {
    update: { userId: "deleted", userName: null, userEmail: FieldValue.delete(), erasedAt: FieldValue.serverTimestamp() },
  });
  for (const field of ["kidUid", "parentUid"]) {
    const cs = await db.collection("consents").where(field, "==", uid).limit(200).get();
    if (!cs.empty) {
      const b = db.batch();
      cs.docs.forEach((d) => b.update(d.ref, { parentName: FieldValue.delete(), erasedAt: FieldValue.serverTimestamp() }));
      await b.commit();
    }
  }
  for (const col of ["childLoginCodes", "parentLinkCodes"]) {
    await deleteWhere(db, db.collection(col).where("parentUid", "==", uid)).catch(() => 0);
  }
  await db.collection("parentPins").doc(uid).delete().catch(() => {});
  await db.collection("roles").doc(uid).delete().catch(() => {});

  await db.recursiveDelete(userRef);
  await admin.auth().deleteUser(uid).catch((e) => {
    if (e?.code !== "auth/user-not-found") throw e;
  });
  return out;
}

module.exports = { erasePlan, eraseUser };

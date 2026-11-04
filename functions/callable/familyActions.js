// functions/callable/familyActions.js
// RB-6 parent-first accounts (owner 2026-11-04). A signed-in parent creates a child account (no email needed),
// with consent stored; the child signs in on any phone with a one-time code (48 h). Deploy: DR-10 in CODE_REVIEW.md.
// Needs the functions' service account to have "Service Account Token Creator" (for createCustomToken).
const functions = require("firebase-functions");
const { admin } = require("../common/admin");
const { region, runtimeOptions } = require("../common/config");

const db = admin.firestore();
const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_HOURS = 48;
const MAX_CHILDREN = 6;
const RELATIONS = ["mother", "father", "guardian"];

function makeCode() {
  const crypto = require("crypto");
  const bytes = crypto.randomBytes(6);
  return [...bytes].map((b) => CODE_CHARS[b % CODE_CHARS.length]).join("");
}

async function issueCode(kidUid, parentUid) {
  for (let i = 0; i < 5; i++) {
    const code = makeCode();
    const ref = db.collection("childLoginCodes").doc(code);
    if ((await ref.get()).exists) continue;
    await ref.set({ kidUid, parentUid, used: false, expiresAt: Date.now() + CODE_HOURS * 3600 * 1000, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    return code;
  }
  throw new functions.https.HttpsError("internal", "Couldn't make a code. Try again.");
}

/** { firstName, grade, consent: { parentName, relation, language, version } } → { kidUid, code } */
exports.createChildProfile = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Sign in first.");
    const parentUid = context.auth.uid;
    const parentDoc = await db.collection("users").doc(parentUid).get();
    if (parentDoc.exists && parentDoc.data().isChild) {
      throw new functions.https.HttpsError("permission-denied", "A child account can't add children. Ask a parent.");
    }
    const children = (parentDoc.exists && parentDoc.data().childUids) || [];
    if (children.length >= MAX_CHILDREN) throw new functions.https.HttpsError("resource-exhausted", "You can add up to 6 children.");
    const firstName = String(data?.firstName || "").trim().split(/\s+/)[0];
    const grade = Number(data?.grade);
    const c = data?.consent || {};
    if (firstName.length < 2 || firstName.length > 30) throw new functions.https.HttpsError("invalid-argument", "Child's first name is needed.");
    if (!Number.isInteger(grade) || grade < 1 || grade > 12) throw new functions.https.HttpsError("invalid-argument", "Class 1–12 is needed.");
    if (String(c.parentName || "").trim().length < 2 || !RELATIONS.includes(c.relation) || !["en", "hi"].includes(c.language) || !c.version) {
      throw new functions.https.HttpsError("invalid-argument", "The parent's consent is needed.");
    }
    const kid = await admin.auth().createUser({ displayName: firstName });
    const now = admin.firestore.FieldValue.serverTimestamp();
    const batch = db.batch();
    batch.set(db.collection("users").doc(kid.uid), {
      firstName,
      lastName: "",
      grade,
      isChild: true,
      parentUids: [parentUid],
      createdAt: now,
      stats: { totalStars: 0, currentStreak: 0 },
    });
    const consentRef = db.collection("consents").doc();
    batch.set(consentRef, {
      kind: "child-account",
      kidUid: kid.uid,
      parentUid,
      parentName: String(c.parentName).trim(),
      relation: c.relation,
      language: c.language,
      version: c.version,
      acceptedAt: now,
    });
    batch.set(db.collection("users").doc(parentUid), { childUids: admin.firestore.FieldValue.arrayUnion(kid.uid), isParent: true }, { merge: true });
    await batch.commit();
    const code = await issueCode(kid.uid, parentUid);
    return { kidUid: kid.uid, code, hours: CODE_HOURS };
  });

/** { kidUid } → a fresh one-time code (parent only). */
exports.newChildLoginCode = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Sign in first.");
    const kidDoc = await db.collection("users").doc(String(data?.kidUid || "")).get();
    if (!kidDoc.exists || !(kidDoc.data().parentUids || []).includes(context.auth.uid)) {
      throw new functions.https.HttpsError("permission-denied", "Only this child's parent can do this.");
    }
    return { code: await issueCode(kidDoc.id, context.auth.uid), hours: CODE_HOURS };
  });

/** { code } → { token } to sign the child in (no sign-in needed to call this). One use, 48 h. */
exports.redeemChildLoginCode = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data) => {
    const code = String(data?.code || "").toUpperCase().replace(/[\s-]/g, "");
    if (code.length !== 6) throw new functions.https.HttpsError("invalid-argument", "The code has 6 letters and numbers.");
    const ref = db.collection("childLoginCodes").doc(code);
    const kidUid = await db.runTransaction(async (t) => {
      const snap = await t.get(ref);
      if (!snap.exists) return null;
      const d = snap.data();
      if (d.used || !(d.expiresAt > Date.now())) return null;
      t.update(ref, { used: true, usedAt: admin.firestore.FieldValue.serverTimestamp() });
      return d.kidUid;
    });
    if (!kidUid) throw new functions.https.HttpsError("not-found", "That code doesn't work (wrong, used or older than 2 days). Ask your parent for a new one.");
    return { token: await admin.auth().createCustomToken(kidUid, { child: true }) };
  });

/** { kidUid } → deletes the child's account and data (parent only). */
exports.deleteChildProfile = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Sign in first.");
    const kidUid = String(data?.kidUid || "");
    const kidDoc = await db.collection("users").doc(kidUid).get();
    if (!kidDoc.exists || !(kidDoc.data().parentUids || []).includes(context.auth.uid)) {
      throw new functions.https.HttpsError("permission-denied", "Only this child's parent can do this.");
    }
    await db.recursiveDelete(db.collection("users").doc(kidUid));
    await db.collection("users").doc(context.auth.uid).set({ childUids: admin.firestore.FieldValue.arrayRemove(kidUid) }, { merge: true });
    await admin.auth().deleteUser(kidUid).catch(() => {});
    return { ok: true };
  });

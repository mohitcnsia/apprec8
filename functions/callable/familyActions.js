// functions/callable/familyActions.js
// RB-6 parent-first accounts (owner 2026-11-04). A signed-in parent creates a child account (no email needed),
// with consent stored; the child signs in on any phone with a one-time code (48 h). Deploy: DR-10 in CODE_REVIEW.md.
// Needs the functions' service account to have "Service Account Token Creator" (for createCustomToken).
const functions = require("firebase-functions");
const { admin } = require("../common/admin");
const { region, runtimeOptions, longRuntimeOptions } = require("../common/config");

const db = admin.firestore();
const { eraseUser } = require("../utils/eraseUser");
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
    if (parentDoc.exists && (parentDoc.data().isChild || (parentDoc.data().parentUids || []).length)) {
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
  .runWith(longRuntimeOptions) // G42: erasing can take longer than 60 s
  .https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Sign in first.");
    const kidUid = String(data?.kidUid || "");
    const kidDoc = await db.collection("users").doc(kidUid).get();
    if (!kidDoc.exists || !(kidDoc.data().parentUids || []).includes(context.auth.uid)) {
      throw new functions.https.HttpsError("permission-denied", "Only this child's parent can do this.");
    }
    // A linked account has its own login and history: a parent can't delete it from here (decision 9).
    if (kidDoc.data().ownLogin) throw new functions.https.HttpsError("failed-precondition", "This child has their own account. They can delete it from their own Me tab.");
    // Owner, 12 Nov 2026: no deletion without the owner's own click. Recorded as a request (kept 90 days, nothing erased).
    await require("./userActions")._recordDeletionRequest(kidUid, "child-profile", context.auth.uid);
    return { ok: true, pending: true };
  });

// ---------- One phone, several profiles (owner: kids use their parent's phone) ----------
// The parent sets a 4-digit PIN once. "Play as <child>" signs the phone in as the child (no code). The child gets back
// to the parent only with the PIN, so a child can't reach parent / admin mode.
const crypto = require("crypto");
const hashPin = (pin, salt) => crypto.scryptSync(String(pin), salt, 32).toString("hex");

/** { pin } (4 digits) → stores a salted hash on the parent's doc. */
exports.setParentPin = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Sign in first.");
    const me = await db.collection("users").doc(context.auth.uid).get();
    if (me.exists && me.data().isChild) throw new functions.https.HttpsError("permission-denied", "Only a parent can set the PIN.");
    const pin = String(data?.pin || "");
    if (!/^\d{4}$/.test(pin)) throw new functions.https.HttpsError("invalid-argument", "The PIN is 4 numbers.");
    const salt = crypto.randomBytes(16).toString("hex");
    await db.collection("parentPins").doc(context.auth.uid).set({ salt, hash: hashPin(pin, salt), updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    await db.collection("users").doc(context.auth.uid).set({ hasParentPin: true }, { merge: true });
    return { ok: true };
  });

/** { kidUid } → token to sign this phone in as the child (caller must be the child's parent). */
exports.switchToChild = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Sign in first.");
    const kid = await db.collection("users").doc(String(data?.kidUid || "")).get();
    if (!kid.exists || !(kid.data().parentUids || []).includes(context.auth.uid)) {
      throw new functions.https.HttpsError("permission-denied", "Only this child's parent can do this.");
    }
    if (kid.data().ownLogin) throw new functions.https.HttpsError("failed-precondition", "This child signs in with their own account.");
    const pin = await db.collection("parentPins").doc(context.auth.uid).get();
    if (!pin.exists) throw new functions.https.HttpsError("failed-precondition", "Set your parent PIN first.");
    return { token: await admin.auth().createCustomToken(kid.id, { child: true }) };
  });

/** { pin } from a child's session → token to sign back in as the parent. 5 wrong tries → 15 min wait. */
exports.switchToParent = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Sign in first.");
    const kid = await db.collection("users").doc(context.auth.uid).get();
    const parentUid = kid.exists ? (kid.data().parentUids || [])[0] : null;
    if (!parentUid) throw new functions.https.HttpsError("failed-precondition", "This isn't a child profile.");
    const pinRef = db.collection("parentPins").doc(parentUid);
    const p = await pinRef.get();
    if (!p.exists) throw new functions.https.HttpsError("failed-precondition", "No parent PIN set.");
    const d = p.data();
    if (d.lockedUntil && d.lockedUntil > Date.now()) throw new functions.https.HttpsError("resource-exhausted", "Too many tries. Wait 15 minutes.");
    if (hashPin(String(data?.pin || ""), d.salt) !== d.hash) {
      const fails = (d.fails || 0) + 1;
      await pinRef.set({ fails: fails >= 5 ? 0 : fails, lockedUntil: fails >= 5 ? Date.now() + 15 * 60 * 1000 : null }, { merge: true });
      throw new functions.https.HttpsError("permission-denied", "Wrong PIN.");
    }
    await pinRef.set({ fails: 0, lockedUntil: null }, { merge: true });
    return { token: await admin.auth().createCustomToken(parentUid) };
  });

// ---------- Link a child's EXISTING account to a parent (product decision 9, owner 2026-11-05) ----------
// For a child who already has their own login and progress (e.g. Pratha). Both sides confirm: the parent makes a
// one-time code (24 h) with their name + relation (consent record), the child types it while signed in. The child keeps
// their own login: ownLogin: true blocks "Play as" and "Delete" for linked accounts (those are for parent-made profiles).
// parentLinkCodes/{code} { parentUid, parentName, relation, language, version, expiresAt, used }  (server only)
const LINK_HOURS = 24;

exports.createParentLinkCode = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Sign in first.");
    const parentUid = context.auth.uid;
    const me = await db.collection("users").doc(parentUid).get();
    // DR-27 (owner, 2026-11-10: "a parent can be a student somewhere"): a class on the account doesn't make it a child.
    // Blocked: child profiles, and accounts that are themselves linked to a parent (a linked kid can't become a "parent").
    if (me.exists && (me.data().isChild || (me.data().parentUids || []).length)) {
      throw new functions.https.HttpsError("permission-denied", "Only a parent's own account can link a child.");
    }
    if (((me.exists && me.data().childUids) || []).length >= MAX_CHILDREN) throw new functions.https.HttpsError("resource-exhausted", "You can link up to 6 children.");
    const c = data?.consent || {};
    if (String(c.parentName || "").trim().length < 2 || !RELATIONS.includes(c.relation) || !["en", "hi"].includes(c.language) || !c.version) {
      throw new functions.https.HttpsError("invalid-argument", "The parent's consent is needed.");
    }
    for (let i = 0; i < 5; i++) {
      const code = makeCode();
      const ref = db.collection("parentLinkCodes").doc(code);
      if ((await ref.get()).exists) continue;
      await ref.set({
        parentUid,
        parentName: String(c.parentName).trim(),
        relation: c.relation,
        language: c.language,
        version: c.version,
        used: false,
        expiresAt: Date.now() + LINK_HOURS * 3600 * 1000,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return { code, hours: LINK_HOURS };
    }
    throw new functions.https.HttpsError("internal", "Couldn't make a code. Try again.");
  });

exports.redeemParentLinkCode = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Sign in first.");
    const kidUid = context.auth.uid;
    if (kidUid.startsWith("demo_")) throw new functions.https.HttpsError("failed-precondition", "Demo accounts can't be linked.");
    const code = String(data?.code || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (code.length !== 6) throw new functions.https.HttpsError("invalid-argument", "The code has 6 letters and numbers.");
    const ref = db.collection("parentLinkCodes").doc(code);
    return db.runTransaction(async (t) => {
      const snap = await t.get(ref);
      const v = snap.exists ? snap.data() : null;
      if (!v || v.used || !(v.expiresAt > Date.now())) throw new functions.https.HttpsError("not-found", "This code doesn't work. Ask your parent for a new one.");
      if (v.parentUid === kidUid) throw new functions.https.HttpsError("failed-precondition", "Type this code on your child's phone, signed in as your child.");
      const parentRef = db.collection("users").doc(v.parentUid);
      const kidRef = db.collection("users").doc(kidUid);
      const [parent, kid] = [await t.get(parentRef), await t.get(kidRef)];
      if (!kid.exists) throw new functions.https.HttpsError("not-found", "Your account isn't ready yet. Open the app once and try again.");
      if ((kid.data().childUids || []).length) throw new functions.https.HttpsError("failed-precondition", "A parent's account can't be linked as a child.");
      const children = (parent.exists && parent.data().childUids) || [];
      if (!children.includes(kidUid) && children.length >= MAX_CHILDREN) throw new functions.https.HttpsError("resource-exhausted", "That parent already has 6 children linked.");
      const { FieldValue } = admin.firestore;
      t.set(kidRef, { parentUids: FieldValue.arrayUnion(v.parentUid), ownLogin: true }, { merge: true });
      t.set(parentRef, { childUids: FieldValue.arrayUnion(kidUid), isParent: true }, { merge: true });
      t.set(db.collection("consents").doc(), {
        kind: "link-existing",
        kidUid,
        parentUid: v.parentUid,
        parentName: v.parentName,
        relation: v.relation,
        language: v.language,
        version: v.version,
        confirmedByChildAt: FieldValue.serverTimestamp(),
      });
      t.update(ref, { used: true, usedBy: kidUid, usedAt: FieldValue.serverTimestamp() });
      return { parentName: v.parentName, relation: v.relation };
    });
  });

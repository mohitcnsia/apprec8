// functions/callable/cardActions.js: cards and team tasks (owner-approved mockup, 16 Nov 2026).
// sendCard (app admins): one card to a group or chosen people → users/{uid}/cards/{cardId} (a copy, so Home reads one
// small list) + an optional notification (adults only, at most one card notification a day per person).
// myCards: what you sent, with seen / opened / done counts. onCardStatus: keeps those counts.
const functions = require("firebase-functions");
const { admin, FieldValue } = require("../common/admin");
const { region, runtimeOptions } = require("../common/config");
const { cleanCard, inAudience, canPushToday, AUDIENCES } = require("../utils/cards");
const { istDay } = require("../utils/people");
const { sendThrottledPushToUser } = require("../utils/throttledPush");

const db = admin.firestore();
const OWNER_UID = "ThOziLzf1INR9K9hxZQxOMgjcJD3";
const fail = (code, msg) => new functions.https.HttpsError(code, msg);
const isAppAdmin = async (uid) => uid === OWNER_UID || (await db.collection("roles").doc(uid).get()).data()?.admin === true;
const MAX_RECIPIENTS = 2000;

async function recipients(audience) {
  const type = audience?.type;
  if (!AUDIENCES.includes(type)) throw fail("invalid-argument", "Choose who gets it.");
  if (type === "people") {
    const ids = [...new Set((audience.uids || []).map(String).filter((u) => u && !u.startsWith("demo_")))].slice(0, 200);
    if (!ids.length) throw fail("invalid-argument", "Choose at least one person.");
    return ids;
  }
  if (type === "class") {
    const cls = await db.collection("classes").doc(String(audience.classId || "")).get();
    if (!cls.exists) throw fail("not-found", "That class no longer exists.");
    const m = await cls.ref.collection("members").where("status", "==", "approved").limit(200).get();
    return m.docs.map((d) => d.id).filter((u) => !u.startsWith("demo_"));
  }
  const snap = await db.collection("users").limit(MAX_RECIPIENTS).get();
  return snap.docs.filter((d) => !d.id.startsWith("demo_") && inAudience(d.data(), type)).map((d) => d.id);
}

exports.sendCard = functions
  .region(region)
  .runWith({ ...runtimeOptions, timeoutSeconds: 300, memory: "512MB" })
  .https.onCall(async (data, context) => {
    if (!context.auth) throw fail("unauthenticated", "Sign in first.");
    const from = context.auth.uid;
    if (!(await isAppAdmin(from))) throw fail("permission-denied", "Only the app admin can send cards for now.");
    let card;
    try {
      card = cleanCard(data?.card || {});
    } catch (e) {
      throw fail("invalid-argument", e.message);
    }
    const uids = await recipients(data?.audience);
    if (!uids.length) throw fail("failed-precondition", "Nobody is in that group yet.");
    const fromName = (await db.collection("users").doc(from).get()).data()?.firstName || "Apprec8";
    const now = Date.now();
    const ref = db.collection("cards").doc();
    await ref.set({
      ...card,
      audience: { type: data.audience.type, classId: data.audience.classId || null, count: uids.length },
      createdBy: from,
      fromName,
      createdAt: now,
      sent: uids.length,
      opened: 0,
      closed: 0,
      done: 0,
    });
    const copy = { cardId: ref.id, kind: card.kind, title: card.title, text: card.text, cards: card.cards, moreQuestId: card.moreQuestId, hat: card.hat, dueAt: card.dueAt, from: card.kind === "task" ? fromName : "Apprec8", status: "new", createdAt: now };
    for (let i = 0; i < uids.length; i += 400) {
      const batch = db.batch();
      uids.slice(i, i + 400).forEach((u) => batch.set(db.collection("users").doc(u).collection("cards").doc(ref.id), copy));
      await batch.commit();
    }
    let pushed = 0;
    if (card.push) {
      const day = istDay(now);
      for (const u of uids) {
        const uref = db.collection("users").doc(u);
        const ud = (await uref.get()).data() || {};
        if (ud.isChild || !canPushToday(ud.lastCardPushDay, day)) continue; // children: no pushes; one a day per person
        await uref.set({ lastCardPushDay: day }, { merge: true });
        await sendThrottledPushToUser(u, { title: card.title, body: card.text || "Open Apprec8 to read it." }, "home").catch(() => {});
        pushed++;
      }
    }
    return { ok: true, cardId: ref.id, sent: uids.length, pushed };
  });

exports.myCards = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw fail("unauthenticated", "Sign in first.");
    if (!(await isAppAdmin(context.auth.uid))) throw fail("permission-denied", "Only the app admin can see this.");
    // No composite index needed: filter by sender, newest first in code (an admin sends a handful a week).
    const snap = await db.collection("cards").where("createdBy", "==", context.auth.uid).limit(200).get();
    const cards = snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 30);
    return { cards };
  });

/** A recipient opened / closed / finished a card → the sender's counts (each person counted once per step). */
exports.onCardStatus = functions
  .region(region)
  .runWith(runtimeOptions)
  .firestore.document("users/{uid}/cards/{cardId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data()?.status;
    const after = change.after.data()?.status;
    if (!after || before === after) return null;
    const inc = {};
    if (after === "opened" && before === "new") inc.opened = FieldValue.increment(1);
    if (after === "closed") inc.closed = FieldValue.increment(1);
    if (after === "done") {
      inc.done = FieldValue.increment(1);
      if (before === "new") inc.opened = FieldValue.increment(1);
    }
    if (!Object.keys(inc).length) return null;
    await db.collection("cards").doc(context.params.cardId).set(inc, { merge: true }).catch(() => {});
    return null;
  });

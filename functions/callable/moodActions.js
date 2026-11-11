// functions/callable/moodActions.js: the weekly mood check (well-being safety steps, owner + Seema 2026-11-11).
// Mood taps are private: phones can't read or write them (no Firestore rule opens moodTaps/ or wellbeingState/);
// only these functions do. Who sees the list: a school counsellor (roles/{uid}.counsellor == true, set by the owner)
// for kids in the classes she teaches; the owner (app admin) as her backup only while she has marked herself away,
// and for classes that have no counsellor. Never parents, subject teachers or other kids.
// - recordMood: a kid taps a mood (once a day; the same day's tap replaces it). Flags "asked to talk", "sad for a
//   while" and "sad two weeks in a row" for the next-morning list; one sad tap alone reaches nobody.
// - myMoodList: the counsellor's (or backup's) list of flagged kids, newest first, without an outcome yet.
// - setMoodOutcome: Talked, okay · Follow up (back on the list in 3 days) · Referred.
// - setCounsellorAway: the counsellor hands her list to the backup and takes it back.
// Taps are deleted after 60 days (expireAt; Firestore TTL policy on moodTaps.expireAt) and are never shown after that.
// Cost: one read + two writes per tap; the list reads the caller's classes and their flagged taps (small).
const functions = require("firebase-functions");
const { admin } = require("../common/admin");
const { region, runtimeOptions } = require("../common/config");

const db = admin.firestore();
const OWNER_UID = "ThOziLzf1INR9K9hxZQxOMgjcJD3"; // same as schoolActions.js
const DAY_MS = 864e5;
const KEEP_DAYS = 60;
const FOLLOW_UP_DAYS = 3;
const MOODS = ["happy", "excited", "okay", "tired", "sad"]; // same as utils/mood.js MOODS
const OUTCOMES = ["talked", "follow", "referred"];

const istDay = (ms) => Math.floor((ms + 5.5 * 3600e3) / DAY_MS); // calendar day in India
const istKey = (ms) => new Date(ms).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

/** Same rule as utils/mood.js moodFlag. */
function moodFlag({ mood, span, tellCounsellor, prev, day }) {
  if (tellCounsellor) return "asked";
  if (mood !== "sad") return null;
  if (span === "while") return "for-a-while";
  if (prev && prev.mood === "sad" && day - prev.day >= 6 && day - prev.day <= 20) return "sad-2-weeks";
  return null;
}

async function isAppAdmin(uid) {
  if (uid === OWNER_UID) return true;
  const r = await db.collection("roles").doc(uid).get();
  return r.exists && r.data().admin === true;
}
async function isCounsellor(uid) {
  const r = await db.collection("roles").doc(uid).get();
  return r.exists && r.data().counsellor === true;
}

exports.recordMood = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Sign in first.");
    const uid = context.auth.uid;
    const mood = String(data?.mood || "");
    if (!MOODS.includes(mood)) throw new functions.https.HttpsError("invalid-argument", "Unknown mood.");
    const span = data?.span === "while" ? "while" : data?.span === "today" ? "today" : null;
    const tellCounsellor = data?.tellCounsellor === true;
    const me = await db.collection("users").doc(uid).get();
    const u = me.exists ? me.data() : {};
    if (!Number.isInteger(u.grade)) throw new functions.https.HttpsError("permission-denied", "The mood check is for kids.");

    const now = Date.now();
    const day = istDay(now);
    const stateRef = db.collection("wellbeingState").doc(uid);
    const state = (await stateRef.get()).data() || {};
    // The previous week's answer (not today's, which this tap replaces).
    const prev = state.last && state.last.day !== day ? state.last : state.prev || null;
    const flag = moodFlag({ mood, span, tellCounsellor, prev, day });
    const tapRef = db.collection("moodTaps").doc(`${uid}_${istKey(now)}`);
    const old = (await tapRef.get()).data() || {};
    await tapRef.set({
      uid,
      firstName: u.firstName || "",
      grade: u.grade,
      classIds: Array.isArray(u.classIds) ? u.classIds.slice(0, 5) : [],
      mood,
      span,
      flag: flag || old.flag || null, // a later "I'm okay" on the same day never hides an earlier ask
      day,
      at: now,
      expireAt: admin.firestore.Timestamp.fromMillis(now + KEEP_DAYS * DAY_MS),
      outcome: old.outcome || null,
      showFrom: old.showFrom || now,
    });
    await stateRef.set({ last: { mood, day }, prev: prev || null, updatedAt: now }, { merge: true });
    return { ok: true, flagged: !!(flag || old.flag) };
  });

/** Classes the caller sees on the list: the classes she teaches, or (backup) every class when she is away. */
async function listScope(uid) {
  const admin_ = await isAppAdmin(uid);
  const counsellor = await isCounsellor(uid);
  if (!admin_ && !counsellor) throw new functions.https.HttpsError("permission-denied", "Only the school counsellor sees this.");
  const away = (await db.collection("ownerConfig").doc("wellbeing").get()).data()?.away === true;
  const mine = counsellor ? (await db.collection("classes").where("teacherIds", "array-contains", uid).limit(30).get()).docs : [];
  return { admin: admin_, counsellor, away, mine };
}

exports.myMoodList = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Sign in first.");
    const uid = context.auth.uid;
    const scope = await listScope(uid);
    const now = Date.now();
    const since = now - 14 * DAY_MS;
    const snap = await db.collection("moodTaps").where("at", ">=", since).orderBy("at", "desc").limit(300).get();
    const flagged = snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((t) => t.flag && (!t.outcome || t.outcome === "follow") && (t.showFrom || 0) <= now);
    const classIdsOf = (docs) => new Set(docs.map((c) => c.id));
    const mineIds = classIdsOf(scope.mine);
    let visible;
    if (scope.counsellor && !scope.away) {
      visible = flagged.filter((t) => t.classIds.some((c) => mineIds.has(c)));
    } else if (scope.admin) {
      // Backup: everything while the counsellor is away; otherwise only kids in classes with no counsellor.
      const counsellors = (await db.collection("roles").where("counsellor", "==", true).limit(20).get()).docs.map((d) => d.id);
      const covered = new Set();
      for (const c of counsellors) {
        (await db.collection("classes").where("teacherIds", "array-contains", c).limit(30).get()).docs.forEach((d) => covered.add(d.id));
      }
      visible = scope.away ? flagged : flagged.filter((t) => !t.classIds.some((c) => covered.has(c)));
    } else {
      visible = [];
    }
    const classIds = [...new Set(visible.flatMap((t) => t.classIds))].slice(0, 30);
    const classes = classIds.length ? await db.getAll(...classIds.map((id) => db.collection("classes").doc(id))) : [];
    const name = Object.fromEntries(classes.filter((c) => c.exists).map((c) => [c.id, c.data().name || ""]));
    return {
      away: scope.away,
      counsellor: scope.counsellor,
      items: visible.slice(0, 50).map((t) => ({
        id: t.id,
        firstName: t.firstName,
        className: t.classIds.map((c) => name[c]).filter(Boolean)[0] || `Class ${t.grade}`,
        flag: t.flag,
        at: t.at,
        followUp: t.outcome === "follow",
      })),
    };
  });

exports.setMoodOutcome = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Sign in first.");
    const uid = context.auth.uid;
    const outcome = String(data?.outcome || "");
    if (!OUTCOMES.includes(outcome)) throw new functions.https.HttpsError("invalid-argument", "Unknown outcome.");
    const scope = await listScope(uid);
    const ref = db.collection("moodTaps").doc(String(data?.id || "x"));
    const tap = await ref.get();
    if (!tap.exists) throw new functions.https.HttpsError("not-found", "Already removed.");
    const t = tap.data();
    const mine = new Set(scope.mine.map((c) => c.id));
    const allowed = scope.admin || t.classIds.some((c) => mine.has(c));
    if (!allowed) throw new functions.https.HttpsError("permission-denied", "Not your class.");
    const now = Date.now();
    await ref.set({ outcome, outcomeAt: now, outcomeBy: uid, showFrom: outcome === "follow" ? now + FOLLOW_UP_DAYS * DAY_MS : t.showFrom }, { merge: true });
    return { ok: true };
  });

exports.setCounsellorAway = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Sign in first.");
    const uid = context.auth.uid;
    if (!(await isCounsellor(uid)) && !(await isAppAdmin(uid))) throw new functions.https.HttpsError("permission-denied", "Only the counsellor.");
    await db.collection("ownerConfig").doc("wellbeing").set({ away: data?.away === true, by: uid, at: Date.now() }, { merge: true });
    return { ok: true };
  });

/** For the app: is this person a counsellor (shows the list on Home)? */
exports.amICounsellor = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Sign in first.");
    return { counsellor: await isCounsellor(context.auth.uid), admin: await isAppAdmin(context.auth.uid) };
  });

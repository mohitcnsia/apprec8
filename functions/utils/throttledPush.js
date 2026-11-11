// functions/utils/throttledPush.js: one alert to an adult's phones (users/{uid}.pushTokens; the owner also ownerConfig/device),
// at most one per person per 10 minutes; held-back alerts are counted into the next one. Used by schoolActions.js (people
// waiting to join) and stickerActions.js (a parent hears their child was appreciated). Moved here 2026-11-12.
const { admin } = require("../common/admin");
const { canSendPush, TEN_MINUTES_MS } = require("./pendingPush");

const db = admin.firestore();
const OWNER_UID = "ThOziLzf1INR9K9hxZQxOMgjcJD3";

/** Sends throttled push notification (max 1 push per person per 10 minutes) */
async function sendThrottledPushToUser(uid, message, view) {
  if (!uid) return;
  const now = Date.now();
  const rateLimitRef = db.collection("pushRateLimits").doc(uid);
  const rateDoc = await rateLimitRef.get();
  const rateData = rateDoc.exists ? rateDoc.data() : {};
  const throttle = canSendPush(rateData.lastPushedAt, now, TEN_MINUTES_MS);

  if (!throttle.allowed) {
    await rateLimitRef.set({ pendingCount: (Number(rateData.pendingCount) || 0) + 1 }, { merge: true });
    return;
  }

  let tokens = [];
  const userDoc = await db.collection("users").doc(uid).get();
  if (userDoc.exists && Array.isArray(userDoc.data().pushTokens)) {
    tokens.push(...userDoc.data().pushTokens);
  }
  if (uid === OWNER_UID) {
    const ownerDev = await db.collection("ownerConfig").doc("device").get();
    if (ownerDev.exists && Array.isArray(ownerDev.data().tokens)) {
      tokens.push(...ownerDev.data().tokens);
    }
  }
  tokens = Array.from(new Set(tokens.filter(Boolean)));
  if (!tokens.length) {
    console.log(`push ${view}: no phone saved for ${uid.slice(0, 6)}…`);
    return;
  }

  // Alerts held back by the 10-minute limit are not lost: the next one says how many more are waiting (owner,
  // 2026-11-11: "we can't miss alerts ever"). Everything waiting also shows on Home → Needs you.
  const held = Number(rateData.pendingCount) || 0;
  const body = held > 0 ? `${message.body} (+${held} more waiting)` : message.body;
  try {
    const res = await admin.messaging().sendEachForMulticast({
      tokens,
      notification: { title: message.title, body },
      data: { view: view || "home" },
      android: { priority: "high" }, // "normal" can sit for hours on an idle phone (owner, 2026-11-10)
    });
    console.log(`push ${view}: sent ${res.successCount}/${tokens.length} to ${uid.slice(0, 6)}…`);
    // Drop phones Google says are gone (reinstalled app, old phone), so they don't hide a working one.
    const dead = [];
    res.responses.forEach((r, i) => {
      if (!r.success && /registration-token-not-registered|invalid-registration-token/.test(r.error?.code || "")) dead.push(tokens[i]);
    });
    if (dead.length && userDoc.exists && Array.isArray(userDoc.data().pushTokens)) {
      await db.collection("users").doc(uid).set({ pushTokens: userDoc.data().pushTokens.filter((t) => !dead.includes(t)) }, { merge: true });
    }
    await rateLimitRef.set({ lastPushedAt: now, pendingCount: 0 }, { merge: true });
  } catch (err) {
    console.warn("FCM multicast failed:", err);
  }
}

module.exports = { sendThrottledPushToUser };

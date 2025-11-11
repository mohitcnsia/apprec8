// functions/callable/quizActions.js

const functions = require("firebase-functions");
const { admin, db, FieldValue } = require("../common/admin");
const { region, runtimeOptions } = require("../common/config");
const { isSameUTCDate, isYesterdayUTC } = require("../utils/helpers");

/** V1 Callable Function: Records quiz result, calculates stats/stars/streak. */
// functions/callable/quizActions.js
exports.recordQuizResult = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated."
      );
    }

    const userId = context.auth.uid;
    const { quizId, scoreAchieved, passingScore, maxScore, isSpecialQuiz } =
      data;
    const now = admin.firestore.Timestamp.now();
    const serverTimestamp = FieldValue.serverTimestamp();

    if (
      quizId == null ||
      typeof scoreAchieved !== "number" ||
      typeof passingScore !== "number" ||
      typeof maxScore !== "number" ||
      maxScore <= 0
    ) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Missing or invalid quiz result data."
      );
    }

    const userRef = db.collection("users").doc(userId);
    const quizAttemptRef = userRef.collection("quizAttempts").doc(quizId);

    try {
      let starsEarnedThisQuiz = 0;
      let quizPerfStars = 0;
      let dailyBonusAwarded = 0;
      let specialExtraStars = 0;
      let finalTotalStars = 0;
      let calculatedNewStreak = 0;

      await db.runTransaction(async (transaction) => {
        const userSnap = await transaction.get(userRef);
        const attemptSnap = await transaction.get(quizAttemptRef);

        if (!userSnap.exists) throw new Error(`User not found: ${userId}`);

        const userData = userSnap.data();
        const currentStats = userData.stats || {
          totalStars: 0,
          currentStreak: 0,
        };
        const lastActivityTS = currentStats.lastActivityCompletionDate;
        const lastDailyBonusTS = currentStats.lastDailyBonusDate;
        const lastSpecialBonusMap = userData.perfectQuizCompletions || {};

        const isFirstTimePassingThisQuiz =
          !attemptSnap.exists || !attemptSnap.data()?.passed;
        const existingAttemptData = attemptSnap.data() || {};
        const attemptCount = (existingAttemptData.attempts || 0) + 1;
        const currentHighestScore = existingAttemptData.highestScore || 0;
        const percentage = (scoreAchieved / maxScore) * 100;

        // Existing star calculation
        if (isFirstTimePassingThisQuiz) {
          if (percentage === 100) quizPerfStars = 10;
          else if (percentage >= 90) quizPerfStars = 5;
          else quizPerfStars = 3;
        } else {
          if (percentage === 100) quizPerfStars = 2;
          else quizPerfStars = 1;
        }

        // Daily bonus
        if (
          percentage === 100 &&
          (lastDailyBonusTS === null || !isSameUTCDate(lastDailyBonusTS, now))
        ) {
          dailyBonusAwarded = 5;
        }

        // Special quiz extra stars (50) once per day per quiz
        if (isSpecialQuiz) {
          const lastSpecialBonusTS = lastSpecialBonusMap[quizId];
          if (!lastSpecialBonusTS || !isSameUTCDate(lastSpecialBonusTS, now)) {
            specialExtraStars = 40;
            lastSpecialBonusMap[quizId] = now;
          }
        }

        starsEarnedThisQuiz =
          quizPerfStars + dailyBonusAwarded + specialExtraStars;
        finalTotalStars = currentStats.totalStars + starsEarnedThisQuiz;

        // Update streak
        if (lastActivityTS && isYesterdayUTC(lastActivityTS, now)) {
          calculatedNewStreak = currentStats.currentStreak + 1;
        } else if (lastActivityTS && isSameUTCDate(lastActivityTS, now)) {
          calculatedNewStreak = currentStats.currentStreak;
        } else {
          calculatedNewStreak = 1;
        }

        // Prepare user update
        const updatesForUserDoc = {
          "stats.totalStars": finalTotalStars,
          "stats.lastQuizCompletionDate": now,
          "stats.lastActivityCompletionDate": now,
          "stats.currentStreak": calculatedNewStreak,
          perfectQuizCompletions: lastSpecialBonusMap,
          lastUpdatedAt: serverTimestamp,
        };
        if (isFirstTimePassingThisQuiz) {
          updatesForUserDoc["stats.totalQuizzesCompleted"] =
            FieldValue.increment(1);
        }
        if (dailyBonusAwarded > 0)
          updatesForUserDoc["stats.lastDailyBonusDate"] = now;

        // Prepare attempt update
        const attemptDataUpdates = {
          quizId,
          attempts: attemptCount,
          lastAttemptDate: now,
          highestScore: Math.max(currentHighestScore, scoreAchieved),
          passed: true,
        };
        if (!attemptSnap.exists) attemptDataUpdates.firstAttemptDate = now;

        if (percentage === 100) attemptDataUpdates.dateOfLastPerfectScore = now;
        else if (existingAttemptData.dateOfLastPerfectScore) {
          attemptDataUpdates.dateOfLastPerfectScore =
            existingAttemptData.dateOfLastPerfectScore;
        }

        transaction.update(userRef, updatesForUserDoc);
        if (!attemptSnap.exists)
          transaction.set(quizAttemptRef, attemptDataUpdates);
        else transaction.update(quizAttemptRef, attemptDataUpdates);
      });

      return {
        status: "success",
        starsAwarded: starsEarnedThisQuiz,
        quizPerfStars,
        dailyBonusAwarded,
        specialExtraStars,
        currentStreak: calculatedNewStreak,
        totalStars: finalTotalStars,
      };
    } catch (error) {
      console.error(
        `recordQuizResult error for user ${userId}, quiz ${quizId}:`,
        error
      );
      throw new functions.https.HttpsError(
        "internal",
        error.message || "Failed to record quiz result."
      );
    }
  });

// penalizeQuizLeave function remains unchanged from your provided version
exports.penalizeQuizLeave = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated."
      );
    }
    const userId = context.auth.uid;
    const serverTimestamp = FieldValue.serverTimestamp();
    const userRef = db.collection("users").doc(userId);

    try {
      let finalStarTotal = null;
      await db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists || !userDoc.data().stats) {
          finalStarTotal = null;
          return;
        }
        const currentStars = userDoc.data().stats.totalStars || 0;
        const newStarTotal = Math.max(0, currentStars - 1);
        transaction.update(userRef, {
          "stats.totalStars": newStarTotal,
          lastUpdatedAt: serverTimestamp,
        });
        finalStarTotal = newStarTotal;
      });

      if (finalStarTotal === null) {
        console.warn(
          `penalizeQuizLeave: User or stats not found for ${userId}. No penalty applied.`
        );
        return { status: "no_user_data_found", newStarTotal: null };
      }
      return { status: "success", newStarTotal: finalStarTotal };
    } catch (error) {
      console.error(`penalizeQuizLeave: Error for user ${userId}:`, error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to apply penalty."
      );
    }
  });

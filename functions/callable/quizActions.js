// functions/callable/quizActions.js

const functions = require("firebase-functions");
const { admin, db, FieldValue } = require("../common/admin");
const { region, runtimeOptions } = require("../common/config");
const { isSameUTCDate, isYesterdayUTC } = require("../utils/helpers");

/** V1 Callable Function: Records quiz result, calculates stats/stars/streak. */
// functions/callable/quizActions.js
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
      !quizId ||
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

    if (scoreAchieved < passingScore) {
      return {
        status: "not_passed",
        message: "Score below passing threshold.",
      };
    }

    const userRef = db.collection("users").doc(userId);
    const quizAttemptRef = userRef.collection("quizAttempts").doc(quizId);

    try {
      let starsEarnedThisQuiz = 0,
        dailyBonusAwarded = 0,
        quizPerfStars = 0,
        specialBonusStars = 0,
        calculatedNewStreak = 0,
        finalTotalStars = 0;

      await db.runTransaction(async (transaction) => {
        const userSnap = await transaction.get(userRef);
        const attemptSnap = await transaction.get(quizAttemptRef);

        if (!userSnap.exists) {
          throw new Error(`User document not found for ${userId}.`);
        }

        const userData = userSnap.data();
        userData.stats = userData.stats || { totalStars: 0, currentStreak: 0 };
        userData.perfectQuizCompletions = userData.perfectQuizCompletions || {};
        userData.stats.specialBonusDates =
          userData.stats.specialBonusDates || {};

        const currentStats = userData.stats;
        const currentTotalStars = currentStats.totalStars || 0;
        const currentStreak = currentStats.currentStreak || 0;
        const lastActivityTS = currentStats.lastActivityCompletionDate;
        const lastDailyBonusTS = currentStats.lastDailyBonusDate;

        const existingAttemptData = attemptSnap.data() || {};
        const attemptCount = (existingAttemptData.attempts || 0) + 1;
        const currentHighestScore = existingAttemptData.highestScore || 0;
        const percentage = (scoreAchieved / maxScore) * 100;

        const isFirstTimePassingThisQuiz =
          !attemptSnap.exists || !existingAttemptData.passed;

        // --- Base stars ---
        if (isFirstTimePassingThisQuiz) {
          if (percentage === 100) quizPerfStars = 10;
          else if (percentage >= 90) quizPerfStars = 5;
          else quizPerfStars = 3;
        } else {
          if (percentage === 100) quizPerfStars = 2;
          else quizPerfStars = 1;
        }

        // --- Daily bonus (5 stars for 100%) ---
        if (
          percentage === 100 &&
          (!lastDailyBonusTS || !isSameUTCDate(lastDailyBonusTS, now))
        ) {
          dailyBonusAwarded = 5;
        }

        // --- Special quiz bonus (50 stars once per day) ---
        if (percentage === 100 && isSpecialQuiz) {
          const lastSpecialBonusTS = currentStats.specialBonusDates[quizId];
          if (!lastSpecialBonusTS || !isSameUTCDate(lastSpecialBonusTS, now)) {
            specialBonusStars = 50;
            currentStats.specialBonusDates[quizId] = now; // mark as awarded today
          }
        }

        starsEarnedThisQuiz =
          quizPerfStars + dailyBonusAwarded + specialBonusStars;
        finalTotalStars = currentTotalStars + starsEarnedThisQuiz;

        // --- Streak calculation ---
        if (lastActivityTS && isYesterdayUTC(lastActivityTS, now)) {
          calculatedNewStreak = currentStreak + 1;
        } else if (lastActivityTS && isSameUTCDate(lastActivityTS, now)) {
          calculatedNewStreak = currentStreak;
        } else {
          calculatedNewStreak = 1;
        }

        // --- Updates for user document ---
        const updatesForUserDoc = {
          "stats.totalStars": finalTotalStars,
          "stats.lastQuizCompletionDate": now,
          "stats.lastActivityCompletionDate": now,
          "stats.currentStreak": calculatedNewStreak,
          lastUpdatedAt: serverTimestamp,
        };

        if (isFirstTimePassingThisQuiz) {
          updatesForUserDoc["stats.totalQuizzesCompleted"] =
            FieldValue.increment(1);
        }

        if (dailyBonusAwarded > 0) {
          updatesForUserDoc["stats.lastDailyBonusDate"] = now;
        }

        if (specialBonusStars > 0) {
          updatesForUserDoc["stats.specialBonusDates"] =
            currentStats.specialBonusDates;
        }

        // --- Updates for quizAttempt ---
        const attemptDataUpdates = {
          quizId,
          attempts: attemptCount,
          lastAttemptDate: now,
          highestScore: Math.max(currentHighestScore, scoreAchieved),
          passed: true,
        };

        if (!attemptSnap.exists) {
          attemptDataUpdates.firstAttemptDate = now;
        }

        if (scoreAchieved === maxScore) {
          attemptDataUpdates.dateOfLastPerfectScore = now;
          updatesForUserDoc[`perfectQuizCompletions.${quizId}`] = now;
        } else if (existingAttemptData.dateOfLastPerfectScore) {
          attemptDataUpdates.dateOfLastPerfectScore =
            existingAttemptData.dateOfLastPerfectScore;
        }

        // --- Commit transaction ---
        transaction.update(userRef, updatesForUserDoc);
        if (!attemptSnap.exists)
          transaction.set(quizAttemptRef, attemptDataUpdates);
        else transaction.update(quizAttemptRef, attemptDataUpdates);
      }); // end transaction

      return {
        status: "success",
        starsAwarded: starsEarnedThisQuiz,
        dailyBonusAwarded,
        specialBonusAwarded: specialBonusStars,
        quizPerfStars,
        currentStreak: calculatedNewStreak,
        totalStars: finalTotalStars,
      };
    } catch (error) {
      console.error(
        `recordQuizResult: Transaction error for user ${userId}, quiz ${quizId}:`,
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

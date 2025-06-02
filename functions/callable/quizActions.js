// functions/callable/quizActions.js

const functions = require("firebase-functions");
const { admin, db, FieldValue } = require("../common/admin");
const { region, runtimeOptions } = require("../common/config");
const { isSameUTCDate, isYesterdayUTC } = require("../utils/helpers");

/** V1 Callable Function: Records quiz result, calculates stats/stars/streak. */
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
    const { quizId, scoreAchieved, passingScore, maxScore } = data;
    const now = admin.firestore.Timestamp.now(); // Firestore Timestamp for 'now'
    const serverTimestamp = FieldValue.serverTimestamp(); // For fields like lastUpdatedAt

    if (
      quizId == null ||
      typeof scoreAchieved !== "number" ||
      typeof passingScore !== "number" ||
      typeof maxScore !== "number" ||
      maxScore <= 0
    ) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Missing or invalid quiz result data, including maxScore."
      );
    }

    if (scoreAchieved < passingScore) {
      return {
        status: "not_passed",
        message: "Score below passing threshold.",
      };
    }

    const userRef = db.collection("users").doc(userId);
    const quizAttemptRef = db
      .collection("users")
      .doc(userId)
      .collection("quizAttempts")
      .doc(quizId);

    try {
      let starsEarnedThisQuiz = 0,
        dailyBonusAwarded = 0,
        quizPerfStars = 0;
      let calculatedNewStreak = 0,
        finalTotalStars = 0;

      await db.runTransaction(async (transaction) => {
        const userSnap = await transaction.get(userRef);
        const attemptSnap = await transaction.get(quizAttemptRef);

        if (!userSnap.exists) {
          throw new Error(`User document not found for ${userId}.`);
        }
        const userData = userSnap.data();
        if (!userData.stats) {
          // Initialize stats if they don't exist, including perfectQuizCompletions map
          // This is a good place to ensure the map structure exists.
          // However, more robust initialization should happen on user creation.
          // For this function, we'll assume stats and perfectQuizCompletions might be missing and handle it.
          userData.stats = { totalStars: 0, currentStreak: 0 }; // Basic init
          userData.perfectQuizCompletions = {}; // Initialize if not present
          console.warn(
            `User ${userId} stats were missing. Initialized basic stats. Consider robust init on user creation.`
          );
        }
        // Ensure perfectQuizCompletions map exists on userData for the logic below
        if (!userData.perfectQuizCompletions) {
          userData.perfectQuizCompletions = {};
        }

        const currentStats = userData.stats;
        const currentTotalStars = currentStats.totalStars || 0;
        const currentStreak = currentStats.currentStreak || 0;
        const lastActivityTS = currentStats.lastActivityCompletionDate;
        const lastDailyBonusTS = currentStats.lastDailyBonusDate;

        const isFirstTimePassingThisQuiz =
          !attemptSnap.exists || !attemptSnap.data()?.passed;
        const existingAttemptData = attemptSnap.data() || {};
        const attemptCount = (existingAttemptData.attempts || 0) + 1;
        const currentHighestScore = existingAttemptData.highestScore || 0;
        const percentage = (scoreAchieved / maxScore) * 100;

        // Star calculation (existing logic)
        if (isFirstTimePassingThisQuiz) {
          if (percentage === 100) quizPerfStars = 10;
          else if (percentage >= 90) quizPerfStars = 5;
          else quizPerfStars = 3;
        } else {
          if (percentage === 100) quizPerfStars = 2;
          else quizPerfStars = 1;
        }

        if (
          percentage === 100 &&
          (lastDailyBonusTS === null || !isSameUTCDate(lastDailyBonusTS, now))
        ) {
          dailyBonusAwarded = 5;
        }

        if (lastActivityTS && isYesterdayUTC(lastActivityTS, now)) {
          calculatedNewStreak = currentStreak + 1;
        } else if (lastActivityTS && isSameUTCDate(lastActivityTS, now)) {
          calculatedNewStreak = currentStreak;
        } else {
          calculatedNewStreak = 1;
        }

        starsEarnedThisQuiz = quizPerfStars + dailyBonusAwarded;
        finalTotalStars = currentTotalStars + starsEarnedThisQuiz;

        // Prepare updates for the user's main document stats
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

        // Prepare data for the individual quizAttempt document
        let attemptDataUpdates = {
          quizId: quizId,
          attempts: attemptCount,
          lastAttemptDate: now,
          highestScore: Math.max(currentHighestScore, scoreAchieved),
          passed: true,
        };

        if (!attemptSnap.exists) {
          attemptDataUpdates.firstAttemptDate = now;
        }

        // --- MODIFIED SECTION for perfect scores ---
        if (scoreAchieved === maxScore && maxScore > 0) {
          // 1. Update the detailed quizAttempt document
          attemptDataUpdates.dateOfLastPerfectScore = now;

          // 2. ADDITIONALLY: Update the summary map in the main user document
          // Using dot notation to update a specific field in the map
          const perfectQuizCompletionPath = `perfectQuizCompletions.${quizId}`;
          updatesForUserDoc[perfectQuizCompletionPath] = now;
        } else if (existingAttemptData.dateOfLastPerfectScore) {
          // If current score isn't 100%, retain existing dateOfLastPerfectScore in detailed attempt
          attemptDataUpdates.dateOfLastPerfectScore =
            existingAttemptData.dateOfLastPerfectScore;
          // The perfectQuizCompletions map in userDoc is NOT touched in this case,
          // preserving its last 100% timestamp until a new 100% is achieved.
        }
        // --- END OF MODIFIED SECTION ---

        transaction.update(userRef, updatesForUserDoc); // Update user's global stats & perfectQuizCompletions map

        if (!attemptSnap.exists) {
          transaction.set(quizAttemptRef, attemptDataUpdates);
        } else {
          transaction.update(quizAttemptRef, attemptDataUpdates);
        }
      }); // End of Transaction

      return {
        status: "success",
        starsAwarded: starsEarnedThisQuiz,
        dailyBonusAwarded,
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

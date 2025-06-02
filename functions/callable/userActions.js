// functions/callable/userActions.js
const functions = require("firebase-functions");
const { admin, db, FieldValue } = require("../common/admin");
const { region, runtimeOptions } = require("../common/config");
const { countFeedbackWords } = require("../utils/helpers"); // Import specific helper

const MIN_FEEDBACK_CHARS = 10; // Constants specific to feedback
const MIN_FEEDBACK_WORDS = 3;

/** V1 Callable Function: Retrieves leaderboard data. */
exports.getLeaderboardData = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated."
      );
    }
    const currentUserId = context.auth.uid;
    const topN =
      data && typeof data.topN === "number" && data.topN > 0 && data.topN <= 100
        ? data.topN
        : 10;

    try {
      const usersCollection = db.collection("users");
      const fetchedTopNLeaders = [];
      let isCurrentUserInTopN = false;

      const topNQuerySnapshot = await usersCollection
        .orderBy("stats.totalStars", "desc")
        .limit(topN)
        .get();
      let rankCounter = 0;
      for (const doc of topNQuerySnapshot.docs) {
        rankCounter++;
        const userData = doc.data();
        const userId = doc.id;
        const pointsValue = userData.stats?.totalStars || 0; // Simplified, assuming number or 0

        fetchedTopNLeaders.push({
          id: userId,
          rank: rankCounter,
          firstName: userData.firstName || null,
          lastName: userData.lastName || null,
          username: userData.username || null,
          photoURL: userData.photoURL || null,
          points: pointsValue,
        });
        if (userId === currentUserId) isCurrentUserInTopN = true;
      }

      let currentUserDisplayData = null;
      if (!isCurrentUserInTopN && currentUserId) {
        const currentUserDocSnap = await usersCollection
          .doc(currentUserId)
          .get();
        if (currentUserDocSnap.exists) {
          const currentUserDocData = currentUserDocSnap.data();
          const currentUserScoreValue =
            currentUserDocData.stats?.totalStars || 0;
          const rankQuerySnapshot = await usersCollection
            .where("stats.totalStars", ">", currentUserScoreValue)
            .count()
            .get();
          const usersAhead = rankQuerySnapshot.data().count;
          currentUserDisplayData = {
            id: currentUserId,
            rank: usersAhead + 1,
            firstName: currentUserDocData.firstName || null,
            lastName: currentUserDocData.lastName || null,
            username: currentUserDocData.username || null,
            photoURL: currentUserDocData.photoURL || null,
            points: currentUserScoreValue,
            isCurrentUser: true,
          };
        }
      }
      // Basic validation (can be expanded)
      fetchedTopNLeaders.forEach((item) => {
        if (!item || typeof item.id !== "string")
          throw new Error("Data integrity issue.");
      });
      if (
        currentUserDisplayData &&
        typeof currentUserDisplayData.id !== "string"
      )
        throw new Error("Data integrity issue.");

      return {
        leaderboard: fetchedTopNLeaders,
        currentUserData: currentUserDisplayData,
      };
    } catch (error) {
      console.error("getLeaderboardData: Critical error:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Internal server error processing leaderboard."
      );
    }
  });

/** V1 Callable Function: Stores user feedback. */
exports.submitFeedback = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth || !context.auth.uid) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated."
      );
    }
    const userId = context.auth.uid;
    const {
      contentContext,
      entryPoint,
      reaction,
      feedbackText,
      feedbackType,
      clientTimestamp,
    } = data;

    if (
      !contentContext ||
      typeof contentContext.id !== "string" ||
      !contentContext.id.trim() ||
      typeof contentContext.type !== "string" ||
      !contentContext.type.trim()
    ) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Content context (id and type) is required."
      );
    }
    if (
      !entryPoint ||
      typeof entryPoint !== "string" ||
      !entryPoint.endsWith("_fab")
    ) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid feedback entry point."
      );
    }
    // ... (other validations for reaction, feedbackText, feedbackType, isTextStrictlyRequired as in your original file)

    const trimmedFeedbackText = (feedbackText || "").trim(); // Ensure feedbackText is a string
    const isTextStrictlyRequired =
      feedbackType === "issue_report" || entryPoint === "feedback_fab";
    if (
      isTextStrictlyRequired &&
      (trimmedFeedbackText.length < MIN_FEEDBACK_CHARS ||
        countFeedbackWords(trimmedFeedbackText) < MIN_FEEDBACK_WORDS)
    ) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        `Feedback text too short.`
      );
    }

    const feedbackEntry = {
      userId,
      contentContext: {
        ...contentContext,
        parentId: contentContext.parentId || null,
        titlePreview: contentContext.titlePreview || null,
      },
      entryPoint,
      reaction,
      feedbackText: trimmedFeedbackText,
      feedbackType,
      clientTimestamp: clientTimestamp || null,
      createdAt: FieldValue.serverTimestamp(),
      status: "new",
    };
    try {
      const feedbackDocRef = await db
        .collection("userFeedback")
        .add(feedbackEntry);
      if (feedbackType === "issue_report") {
        functions.logger.info(
          `Issue report received (ID: ${feedbackDocRef.id}). Task creation placeholder.`
        );
      }
      return {
        status: "success",
        message: "Feedback submitted.",
        feedbackId: feedbackDocRef.id,
      };
    } catch (error) {
      functions.logger.error(
        "submitFeedback: Error writing to Firestore:",
        error
      );
      throw new functions.https.HttpsError(
        "internal",
        "Error saving feedback.",
        error.message
      );
    }
  });

/** V1 Callable Function: Handles user account deletion request. */
exports.requestAccountDeletion = functions
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
    const userDocRef = db.collection("users").doc(userId);
    try {
      const anonymizedData = {
        email: `deleted_${userId.substring(0, 8)}@apprec8.example.com`,
        firstName: "User",
        lastName: "Deleted",
        username: `deleted_user_${userId.substring(0, 8)}`,
        displayName: "Deleted User",
        photoURL: null,
        phone: null,
        accountStatus: "anonymized_by_user_request",
        anonymizedAt: FieldValue.serverTimestamp(),
        profileLastSavedAt: FieldValue.serverTimestamp(),
        lastUpdatedAt: FieldValue.serverTimestamp(),
        // stats: FieldValue.delete(), // Example: To delete stats
      };
      await userDocRef.update(anonymizedData);
      await admin.auth().deleteUser(userId); // Use admin from common/admin.js
      return { success: true, message: "Account deleted successfully." };
    } catch (error) {
      console.error(`Error during account deletion for user ${userId}:`, error);
      throw new functions.https.HttpsError(
        "internal",
        "Error deleting account.",
        error.message
      );
    }
  });

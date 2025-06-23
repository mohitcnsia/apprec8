// functions/callable/userActions.js
const functions = require("firebase-functions");
// We need to explicitly import modular functions from `firebase-admin/firestore`
// and access `FieldValue` through the imported firestore object.
const { admin } = require("../common/admin"); // Keep admin for auth and other services
const { region, runtimeOptions } = require("../common/config");
const { countFeedbackWords } = require("../utils/helpers"); // Import specific helper

// Initialize Firestore from the admin SDK (once)
const firestore = admin.firestore();
const {
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  updateDoc,
  addDoc,
  increment, // If you plan to use increment for stats later
  serverTimestamp, // For server timestamps
  Timestamp, // For client-side timestamps
} = require("firebase-admin/firestore");

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
      // Use modular `collection`
      const usersCollectionRef = collection(firestore, "users");
      const fetchedTopNLeaders = [];
      let isCurrentUserInTopN = false;

      // Use modular `query`, `orderBy`, `limit`, `getDocs`
      const topNQuery = query(
        usersCollectionRef,
        orderBy("stats.totalStars", "desc"),
        limit(topN)
      );
      const topNQuerySnapshot = await getDocs(topNQuery);

      let rankCounter = 0;
      for (const d of topNQuerySnapshot.docs) {
        // Changed `doc` to `d` to avoid conflict with imported `doc`
        rankCounter++;
        const userData = d.data();
        const userId = d.id;
        const pointsValue = userData.stats?.totalStars || 0;

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
        // Use modular `doc` and `getDocs` (for a single doc, you can still use .get() on the doc ref)
        const currentUserDocRef = doc(usersCollectionRef, currentUserId);
        const currentUserDocSnap = await currentUserDocRef.get(); // Still .get() on a doc ref

        if (currentUserDocSnap.exists) {
          const currentUserDocData = currentUserDocSnap.data();
          const currentUserScoreValue =
            currentUserDocData.stats?.totalStars || 0;

          // For count queries, use modular `query` and `.count().get()`
          const rankCountQuery = query(
            usersCollectionRef,
            where("stats.totalStars", ">", currentUserScoreValue)
          );
          const rankQuerySnapshot = await rankCountQuery.count().get();
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
          throw new functions.https.HttpsError(
            "internal",
            "Data integrity issue."
          ); // Throw HttpsError consistently
      });
      if (
        currentUserDisplayData &&
        typeof currentUserDisplayData.id !== "string"
      )
        throw new functions.https.HttpsError(
          "internal",
          "Data integrity issue."
        ); // Throw HttpsError consistently

      return {
        leaderboard: fetchedTopNLeaders,
        currentUserData: currentUserDisplayData,
      };
    } catch (error) {
      console.error("getLeaderboardData: Critical error:", error);
      // Re-throw HttpsError if it's already one, otherwise wrap in internal
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
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

    const trimmedFeedbackText = (feedbackText || "").trim();
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
      createdAt: serverTimestamp(), // Use modular `serverTimestamp()`
      status: "new",
    };
    try {
      // Use modular `collection` and `addDoc`
      const feedbackCollectionRef = collection(firestore, "userFeedback");
      const feedbackDocRef = await addDoc(feedbackCollectionRef, feedbackEntry);

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
    // Use modular `doc` to get a document reference
    const userDocRef = doc(collection(firestore, "users"), userId);
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
        anonymizedAt: serverTimestamp(), // Use modular `serverTimestamp()`
        profileLastSavedAt: serverTimestamp(), // Use modular `serverTimestamp()`
        lastUpdatedAt: serverTimestamp(), // Use modular `serverTimestamp()`
        // stats: deleteField(), // Example: To delete stats (requires importing `deleteField`)
      };
      // Use modular `updateDoc`
      await updateDoc(userDocRef, anonymizedData);
      await admin.auth().deleteUser(userId); // `admin.auth()` is already modular/top-level

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

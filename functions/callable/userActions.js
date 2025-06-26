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
  updateDoc,
  addDoc,
  serverTimestamp, // For client-side timestamps
} = require("firebase-admin/firestore");

const MIN_FEEDBACK_CHARS = 10; // Constants specific to feedback
const MIN_FEEDBACK_WORDS = 3;

/**
 * Fetches the top N leaders for the main leaderboard display.
 */
exports.getLeaderboard = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated."
      );
    }

    const topN = data && data.topN > 0 ? data.topN : 10;

    try {
      const usersCollectionRef = firestore.collection("users");
      const topNQuery = usersCollectionRef
        .orderBy("stats.totalStars", "desc")
        .limit(topN);
      const snapshot = await topNQuery.get();

      const leaders = [];
      let rankCounter = 0;
      snapshot.forEach((doc) => {
        rankCounter++;
        const userData = doc.data();
        leaders.push({
          id: doc.id,
          rank: rankCounter,
          firstName: userData.firstName || null,
          lastName: userData.lastName || null,
          username: userData.username || null,
          photoURL: userData.photoURL || null,
          points: userData.stats?.totalStars || 0,
        });
      });

      return { leaderboard: leaders };
    } catch (error) {
      console.error("getLeaderboard: Critical error:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Error fetching leaderboard."
      );
    }
  });

/**
 * Fetches the specific rank and data for the currently authenticated user.
 * (Corrected version)
 */
exports.getCurrentUserRank = functions
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

    try {
      const usersCollectionRef = firestore.collection("users");
      const currentUserDocRef = usersCollectionRef.doc(currentUserId);
      const currentUserDocSnap = await currentUserDocRef.get();

      // --- THE FIX: Changed .exists() to .exists ---
      if (!currentUserDocSnap.exists) {
        console.error(
          `[getCurrentUserRank] User document not found for user: ${currentUserId}`
        );
        throw new functions.https.HttpsError(
          "not-found",
          "Current user document not found."
        );
      }

      const currentUserData = currentUserDocSnap.data();
      const currentUserScore = currentUserData.stats?.totalStars || 0;

      const rankCountQuery = usersCollectionRef.where(
        "stats.totalStars",
        ">",
        currentUserScore
      );
      const countSnapshot = await rankCountQuery.count().get();

      const usersAhead = countSnapshot.data().count;

      return {
        id: currentUserId,
        rank: usersAhead + 1,
        firstName: currentUserData.firstName || null,
        lastName: currentUserData.lastName || null,
        username: currentUserData.username || null,
        photoURL: currentUserData.photoURL || null,
        points: currentUserScore,
        isCurrentUser: true,
      };
    } catch (error) {
      console.error("getCurrentUserRank: CRITICAL ERROR caught:", error);
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      throw new functions.https.HttpsError(
        "internal",
        "Error fetching user rank."
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

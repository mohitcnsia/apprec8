const functions = require("firebase-functions");
const { admin, db, FieldValue } = require("../common/admin");
const { region, runtimeOptions } = require("../common/config");

/**
 * V1 Auth Trigger: Runs when a new Firebase Auth user is created.
 * Initializes a corresponding document in the 'users' collection with embedded stats.
 */
exports.initializeNewUser = functions
  .region(region)
  .runWith(runtimeOptions)
  .auth.user()
  .onCreate(async (user) => {
    const userId = user.uid;
    console.log(`Initializing user: ${userId}`);

    const now = FieldValue.serverTimestamp(); // Use FieldValue for serverTimestamp
    const userRef = db.collection("users").doc(userId);

    const defaultUsername =
      user.displayName ||
      (user.email
        ? user.email.split("@")[0]
        : `User_${userId.substring(0, 6)}`);

    const newUserDocument = {
      userId: userId,
      email: user.email || "",
      username: defaultUsername,
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      phone: user.phoneNumber || "",
      createdAt: now,
      lastUpdatedAt: now,
      lastActivityAt: null,
      stats: {
        totalStars: 0,
        currentStreak: 0,
        totalQuizzesCompleted: 0,
        lastQuizCompletionDate: null,
        lastActivityCompletionDate: null,
        lastDailyBonusDate: null,
      },
    };

    try {
      await userRef.set(newUserDocument);
      console.log(`Successfully initialized document for user ${userId}`);
    } catch (error) {
      console.error(`Error initializing document for user ${userId}:`, error);
    }
  });

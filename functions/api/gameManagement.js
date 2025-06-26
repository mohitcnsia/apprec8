const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Ensure admin is initialized (it's often done in the main index.js)
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Checks if the user is authenticated. Throws an error if not.
 * TODO: Enhance this to check for admin roles via custom claims.
 * @param {object} context - The context of the callable function.
 */
const ensureAuthenticated = (context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }
  // Example for future admin check:
  // if (context.auth.token.role !== 'admin') {
  //   throw new functions.https.HttpsError('permission-denied', 'User must be an admin.');
  // }
};

// --- VocabBuilder CRUD ---

exports.addVocabCategory = functions.https.onCall(async (data, context) => {
  ensureAuthenticated(context);
  const { name } = data;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Category name is required."
    );
  }

  const docRef = await db.collection("gameVocabCategories").add({
    name: name.trim(),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { id: docRef.id, name: name.trim() };
});

exports.addWordToCategory = functions.https.onCall(async (data, context) => {
  ensureAuthenticated(context);
  const { categoryId, word, hint } = data;

  if (!categoryId || !word || !hint) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing required fields: categoryId, word, hint."
    );
  }

  const docRef = await db
    .collection("gameVocabCategories")
    .doc(categoryId)
    .collection("words")
    .add({
      word: word.toUpperCase().trim(),
      hint: hint.trim(),
    });

  return { id: docRef.id };
});

// Recursive delete needed for categories with subcollections
exports.deleteVocabCategory = functions.https.onCall(async (data, context) => {
  ensureAuthenticated(context);
  const { categoryId } = data;

  if (!categoryId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing categoryId."
    );
  }

  const path = `gameVocabCategories/${categoryId}`;
  await admin.firestore().recursiveDelete(db.doc(path));

  return {
    success: true,
    message: `Category ${categoryId} and all its words have been deleted.`,
  };
});

// --- SpellingBee CRUD ---

exports.addSpellingBeePuzzle = functions.https.onCall(async (data, context) => {
  ensureAuthenticated(context);
  const { center, letters } = data;

  // Validation
  if (!center || typeof center !== "string" || center.length !== 1) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The 'center' field must be a single character string."
    );
  }
  if (!letters || !Array.isArray(letters) || letters.length !== 7) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The 'letters' field must be an array of 7 strings."
    );
  }
  if (!letters.includes(center)) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The center letter must be included in the letters array."
    );
  }

  const docRef = await db.collection("gameSpellingBee").add({
    center: center.toUpperCase(),
    letters: letters.map((l) => l.toUpperCase()),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { id: docRef.id, center, letters };
});

exports.deleteSpellingBeePuzzle = functions.https.onCall(
  async (data, context) => {
    ensureAuthenticated(context);
    const { puzzleId } = data;

    if (!puzzleId) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Missing puzzleId."
      );
    }

    await db.collection("gameSpellingBee").doc(puzzleId).delete();

    return { success: true, message: `Puzzle ${puzzleId} deleted.` };
  }
);

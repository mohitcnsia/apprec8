const admin = require("firebase-admin");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

// Initialize Firebase Admin SDK *ONCE*
if (admin.apps.length === 0) {
  try {
    admin.initializeApp();
    console.log("Firebase Admin SDK initialized via common/admin.js.");
  } catch (e) {
    console.error("Firebase admin initialization error in common/admin.js", e);
  }
}

const db = getFirestore();

module.exports = {
  admin, // Export admin itself if needed by helpers like inferSchema
  db,
  FieldValue,
};

// config/firebaseConfig.js
import { getAuth } from "@react-native-firebase/auth";
import {
  getFirestore,
  CACHE_SIZE_UNLIMITED,
} from "@react-native-firebase/firestore";
import { getApp, initializeApp } from "@react-native-firebase/app";

let app;
try {
  app = getApp();
  console.log("firebaseConfig: Existing Firebase app instance retrieved.");
} catch (e) {
  app = initializeApp({});
  console.log("firebaseConfig: Firebase app initialized.");
}

const db = getFirestore(app); // Pass the app instance

try {
  db.settings({
    persistence: true,
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  });
  console.log("firebaseConfig: Firestore settings applied.");
} catch (error) {
  console.warn("firebaseConfig: Could not apply Firestore settings:", error);
}

const authInstance = getAuth(app);

export { db, authInstance, app };

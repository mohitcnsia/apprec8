import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";

// Firebase Config - Ensure these are correctly set in your .env and exposed via app.config.js extra
const {
  firebaseApiKey,
  firebaseAuthDomain,
  firebaseProjectId,
  firebaseStorageBucket,
  firebaseMessagingSenderId,
  firebaseAppId,
  // androidClientId, // This is the NATIVE Android Client ID, NOT the Web one used for expo-auth-session
} = Constants.expoConfig?.extra ?? {};

const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId,
  // Do NOT include androidClientId here if using initializeAuth below
};

let app, auth, db;

if (!getApps().length) {
  try {
    console.log("🔥 Initializing Firebase App...");
    app = initializeApp(firebaseConfig);
    console.log("🔥 Initializing Firebase Auth with persistence...");
    // Initialize Auth with persistence
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
    console.log("🔥 Initializing Firestore...");
    db = getFirestore(app);
    console.log("✅ Firebase Initialized Successfully");
  } catch (e) {
    console.error("❌ Firebase initialization error", e);
    // Handle initialization error appropriately
  }
} else {
  console.log("🌲 Firebase App already exists, getting instance...");
  app = getApp();
  auth = getAuth(app); // Get existing auth instance
  db = getFirestore(app); // Get existing firestore instance
}

export { app, db, auth }; // Export auth correctly

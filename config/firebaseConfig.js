import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import * as SecureStore from "expo-secure-store";
import { getFirestore } from "firebase/firestore";

// Secure Storage Wrapper
export const secureStorage = {
  getItem: async (key) => SecureStore.getItemAsync(key),
  setItem: async (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: async (key) => SecureStore.deleteItemAsync(key),
};

// Firebase Config
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Listen for auth changes and persist user session
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("🔐 Saving user session to SecureStore...");
    await secureStorage.setItem("user", JSON.stringify(user));
  } else {
    console.log("❌ Removing user session from SecureStore...");
    await secureStorage.removeItem("user");
  }
});

export { app, db, auth };

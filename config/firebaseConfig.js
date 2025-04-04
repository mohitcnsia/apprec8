import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import * as SecureStore from "expo-secure-store";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";

// Secure Storage Wrapper
export const secureStorage = {
  getItem: async (key) => SecureStore.getItemAsync(key),
  setItem: async (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: async (key) => SecureStore.deleteItemAsync(key),
};

// Firebase Config
const {
  firebaseApiKey,
  firebaseAuthDomain,
  firebaseProjectId,
  firebaseStorageBucket,
  firebaseMessagingSenderId,
  firebaseAppId,
  androidClientId,
} = Constants.expoConfig?.extra ?? {};

const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId,
  androidClientId: androidClientId,
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

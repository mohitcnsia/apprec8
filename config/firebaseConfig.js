import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import * as SecureStore from "expo-secure-store";

// 🔹 Firebase Config (Ensure it's defined properly)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// 🔹 Initialize Firebase App
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔹 Secure Storage Wrapper (Expo SecureStore)
const secureStorage = {
  getItem: async (key) => SecureStore.getItemAsync(key),
  setItem: async (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: async (key) => SecureStore.deleteItemAsync(key),
};

// 🔹 Initialize Firebase Auth with Secure Persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(secureStorage),
});

export { app, db, auth };

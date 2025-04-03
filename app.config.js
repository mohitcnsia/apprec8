import "dotenv/config";

export default {
  expo: {
    name: "apprec8",
    slug: "apprec8",
    scheme: "apprec8",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    newArchEnabled: true,
    backgroundColor: "#24180f",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.mohitchilkoti.apprec8",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
      package: "com.mohitchilkoti.apprec8", // ✅ ADD THIS LINE
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: ["expo-font", "expo-secure-store"],
    extra: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      eas: {
        projectId: "ce048455-06a3-4e7e-aebb-ae82b867c72a",
      },
    },
    owner: "mohitchilkoti",
  },
};

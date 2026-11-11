// app.config.js
import "dotenv/config";
import fs from "fs";
import path from "path";

// Helper function to safely merge CFBundleURLTypes
const mergeCFBundleURLTypes = (existingTypes = [], newScheme) => {
  if (!newScheme) return existingTypes;

  const schemeExists = existingTypes.some((type) =>
    type.CFBundleURLSchemes?.includes(newScheme)
  );

  if (schemeExists) {
    return existingTypes;
  }

  return [
    ...existingTypes,
    {
      CFBundleURLSchemes: [newScheme],
    },
  ];
};

export default ({ config }) => {
  const isTest = process.env.APP_VARIANT === "test";

  let testWebClientId = "309935610388-vu2pcircoj953jcfjd8aelbmtj5pfua5.apps.googleusercontent.com";
  try {
    const testFile = path.resolve(__dirname, "docs/agents/private/google-services.test.json");
    if (fs.existsSync(testFile)) {
      const parsed = JSON.parse(fs.readFileSync(testFile, "utf8"));
      const client = parsed?.client?.[0];
      const oauth = client?.oauth_client?.find((c) => c.client_type === 3);
      if (oauth?.client_id) testWebClientId = oauth.client_id;
    }
  } catch {
    // fallback to known client id
  }

  const existingCFBundleURLTypes = config.ios?.infoPlist?.CFBundleURLTypes;
  const reversedClientIdScheme = process.env.IOS_REVERSED_CLIENT_ID;

  const majorVersion = 20;
  const minorVersion = 0;
  const patchVersion = 31; // 20.0.31: word-of-the-day reminder at 5 pm (expo-notifications), crash reporting (Crashlytics)
  const buildIteration = 0; // Or 1 if you prefer to start iterations from 1

  const androidVersionCode =
    majorVersion * 1000000 +
    minorVersion * 10000 +
    patchVersion * 100 +
    buildIteration;

  if (!reversedClientIdScheme) {
    console.warn(
      "⚠️ WARNING: IOS_REVERSED_CLIENT_ID is not defined in your .env file. iOS Google Sign-In might fail configuration."
    );
  }

  return {
    expo: {
      name: isTest ? "Apprec8 TEST" : "apprec8",
      slug: "apprec8",
      scheme: "apprec8",
      version: `${majorVersion}.${minorVersion}.${patchVersion}`,
      orientation: "portrait",
      // Main app icon (e.g., 1024x1024px). Used for Play Store, iOS, and as fallback.
      icon: "./assets/icon.png",
      backgroundColor: "#24180f", // Your app's main background color
      splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff", // Splash screen background color
      },
      // Over-the-air updates (2026-11-04): JS + assets only; native code still needs a build. The runtime version is
      // the app version, so an update only reaches builds of that exact version. Keep it in sync with
      // android/app/src/main/res/values/strings.xml (expo_runtime_version).
      runtimeVersion: `${majorVersion}.${minorVersion}.${patchVersion}`,
      updates: {
        url: "https://u.expo.dev/ce048455-06a3-4e7e-aebb-ae82b867c72a",
        fallbackToCacheTimeout: 0,
        checkAutomatically: "ON_LOAD",
        ...(isTest ? { channel: "preview" } : {}),
      },
      assetBundlePatterns: ["**/*"],
      ios: {
        supportsTablet: true,
        bundleIdentifier: "com.mohitchilkoti.apprec8",
        googleServicesFile: "./GoogleService-Info.plist",
        infoPlist: {
          ...config.ios?.infoPlist,
          CFBundleURLTypes: mergeCFBundleURLTypes(
            existingCFBundleURLTypes,
            reversedClientIdScheme
          ),
        },
        // If your iOS icon is different from the main one, you can specify it here:
        // icon: "./assets/ios-icon.png", // Ensure this file exists if you uncomment
      },
      android: {
        versionCode: androidVersionCode,
        adaptiveIcon: {
          // Path to your adaptive icon foreground image (e.g., 1024x1024px from IconKitchen)
          foregroundImage: "./assets/adaptive-icon.png",
          // TODO: Replace #YourAppBackgroundColor with the actual hex color for your adaptive icon's background.
          // This could be a color from IconKitchen or your app's branding.
          backgroundColor: isTest ? "#D97706" : "#3d1141", // Amber for test, purple for real
          // Optional: If you have a monochrome icon for Android 13+ themed icons (e.g., 1024x1024px)
          monochromeImage: "./assets/monochrome-icon.png",
        },
        package: isTest ? "com.mohitchilkoti.apprec8.test" : "com.mohitchilkoti.apprec8",
        googleServicesFile: isTest ? "./docs/agents/private/google-services.test.json" : "./google-services.json",
        intentFilters: [
          {
            action: "VIEW",
            data: {
              scheme: "apprec8",
              host: "redirect",
            },
            category: ["BROWSABLE", "DEFAULT"],
          },
        ],
        usesFeatures: [
          {
            name: "android.hardware.telephony",
            required: true,
          },
          {
            name: "android.hardware.touchscreen",
            required: true,
          },
        ],
        permissions: ["android.permission.INTERNET"],
        // The top-level "icon" will be used for legacy Android versions if not overridden here.
        // If you need a specific legacy icon (not generally recommended if adaptive is well-designed):
        // icon: "./assets/android-legacy-icon.png", // Ensure this file exists if you uncomment
      },
      web: {
        favicon: "./assets/favicon.png",
      },
      plugins: [
        "expo-font",
        "expo-secure-store",
        "@react-native-google-signin/google-signin",
        "@react-native-firebase/app",
      ],
      extra: {
        firebaseApiKey: process.env.FIREBASE_API_KEY,
        firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
        firebaseProjectId: isTest ? "apprec8-test" : process.env.FIREBASE_PROJECT_ID,
        firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        firebaseAppId: process.env.FIREBASE_APP_ID,
        googleWebClientId: isTest ? testWebClientId : process.env.GOOGLE_WEB_CLIENT_ID,
        ...(isTest ? { appVariant: "test" } : {}),
        eas: {
          projectId: "ce048455-06a3-4e7e-aebb-ae82b867c72a",
        },
      },
      owner: "mohitchilkoti",
    },
  };
};

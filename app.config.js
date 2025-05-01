// app.config.js
import "dotenv/config";

// Helper function to safely merge CFBundleURLTypes
const mergeCFBundleURLTypes = (existingTypes = [], newScheme) => {
  if (!newScheme) return existingTypes;

  // Check if the scheme already exists to avoid duplicates
  const schemeExists = existingTypes.some((type) =>
    type.CFBundleURLSchemes?.includes(newScheme)
  );

  if (schemeExists) {
    return existingTypes;
  }

  // Add the new scheme configuration
  return [
    ...existingTypes,
    {
      CFBundleURLSchemes: [newScheme],
    },
  ];
};

export default ({ config }) => {
  // Get the existing CFBundleURLTypes from the evaluated config, if any
  const existingCFBundleURLTypes = config.ios?.infoPlist?.CFBundleURLTypes;
  const reversedClientIdScheme = process.env.IOS_REVERSED_CLIENT_ID;

  if (!reversedClientIdScheme) {
    console.warn(
      "⚠️ WARNING: IOS_REVERSED_CLIENT_ID is not defined in your .env file. iOS Google Sign-In might fail configuration."
    );
  }

  return {
    expo: {
      name: "apprec8",
      slug: "apprec8",
      scheme: "apprec8",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/icon.png",
      // newArchEnabled: true, // Keep if you had it, enables New Architecture
      backgroundColor: "#24180f", // Match your original background
      splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff", // Match your original splash background
      },
      updates: {
        fallbackToCacheTimeout: 0,
      },
      assetBundlePatterns: ["**/*"],
      ios: {
        supportsTablet: true,
        bundleIdentifier: "com.mohitchilkoti.apprec8", // Your iOS bundle ID
        // Point to the .plist file (assuming it's in the root)
        googleServicesFile: "./GoogleService-Info.plist",
        // Manually configure the necessary URL Type using the reversed client ID
        infoPlist: {
          ...config.ios?.infoPlist, // Preserve other infoPlist entries
          CFBundleURLTypes: mergeCFBundleURLTypes(
            existingCFBundleURLTypes,
            reversedClientIdScheme // Add the scheme from .env
          ),
        },
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-icon.png",
          backgroundColor: "#FFFFFF",
        },
        package: "com.mohitchilkoti.apprec8", // Your Android package name
        // Point to the .json file (standard location)
        googleServicesFile: "./google-services.json",
        // Keep original intent filters if needed for other deeplinking
        intentFilters: [
          {
            action: "VIEW",
            data: {
              scheme: "apprec8",
              host: "redirect", // Keep if used elsewhere
            },
            category: ["BROWSABLE", "DEFAULT"],
          },
        ],
        usesFeatures: [
          {
            name: "android.hardware.telephony",
            required: true, // Require phone capabilities
          },
          {
            name: "android.hardware.touchscreen",
            required: true, // Require a touchscreen
          },
        ],
        // Add permissions if needed (INTERNET is usually default)
        permissions: ["android.permission.INTERNET"],
      },
      web: {
        favicon: "./assets/favicon.png",
      },
      plugins: [
        "expo-font",
        "expo-secure-store", // If using secure store
        // Re-add the Google Sign-In plugin.
        // Try WITHOUT options first, as manual config above might be enough.
        // If build fails again, try adding the options back:
        // ["@react-native-google-signin/google-signin", { reservedClientId: process.env.IOS_REVERSED_CLIENT_ID }]
        "@react-native-google-signin/google-signin",
        "@react-native-firebase/app",
      ],
      extra: {
        // Expose necessary Firebase config and the Web Client ID for the hook
        firebaseApiKey: process.env.FIREBASE_API_KEY,
        firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
        firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
        firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        firebaseAppId: process.env.FIREBASE_APP_ID,
        // Needed by GoogleSignin.configure in the hook
        googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID,
        eas: {
          projectId: "ce048455-06a3-4e7e-aebb-ae82b867c72a",
        },
      },
      owner: "mohitchilkoti", // Your Expo username
    },
  };
};

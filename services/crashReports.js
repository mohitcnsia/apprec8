// services/crashReports.js: crash reporting (owner YES in the gap review, 10 Nov; build 20.0.31+).
// Firebase Crashlytics records app crashes and uncaught JS errors so we see what broke on someone's phone.
// No names, emails or child data are attached: only the error, the screen state Crashlytics keeps, the app version and
// the phone model. Old builds without the native part: does nothing.
import { NativeModules } from "react-native";

export function startCrashReports() {
  if (!NativeModules.RNFBCrashlyticsModule) return;
  try {
    const crashlytics = require("@react-native-firebase/crashlytics").default;
    crashlytics().setCrashlyticsCollectionEnabled(!__DEV__).catch(() => {});
  } catch (e) {
    console.warn("startCrashReports:", e?.message || e);
  }
}

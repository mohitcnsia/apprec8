// hooks/useFirebaseAuth.js (using @react-native-firebase/auth)

import { useEffect, useState, useCallback } from "react";
import { Platform } from "react-native";
// Import the auth instance exported from your *new* config file
import { authInstance as auth } from "../config/firebaseConfig"; // Make sure this path and export name are correct
// Import methods from the @react-native-firebase/auth library
import { GoogleAuthProvider } from "@react-native-firebase/auth"; // Note: Import specific providers like this

// Keep using @react-native-google-signin/google-signin for the UI flow
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";

// Get Google Web Client ID (no change needed here)
const GOOGLE_WEB_CLIENT_ID = Constants.expoConfig?.extra?.googleWebClientId;

export default function useFirebaseAuth() {
  // --- State Variables (mostly unchanged) ---
  const [user, setUser] = useState(null); // Holds the @r-n-firebase user object
  const [loading, setLoading] = useState(true);
  const [authInitializing, setAuthInitializing] = useState(true);
  const [error, setError] = useState("");
  const [isGuest, setIsGuest] = useState(false);
  const [isGoogleConfigured, setIsGoogleConfigured] = useState(false);

  // --- Effects ---

  // 1. Configure Google Sign-In (no change needed here)
  useEffect(() => {
    if (!GOOGLE_WEB_CLIENT_ID) {
      console.error("❌ FATAL: Google Web Client ID not found!");
      setError("App configuration error (Web Client ID missing).");
      setAuthInitializing(false);
      setLoading(false);
      setIsGoogleConfigured(false);
      return;
    }
    console.log("🔧 Configuring Google Sign-In...");
    try {
      GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID });
      console.log("✅ Google Sign-In Configured");
      setIsGoogleConfigured(true);
    } catch (configureError) {
      console.error("❌ Error configuring Google Sign-In:", configureError);
      setError("Failed to initialize Google Sign-In.");
      setIsGoogleConfigured(false);
      setAuthInitializing(false);
      setLoading(false);
    }
  }, []);

  // 2. Firebase Authentication State Listener (using @r-n-firebase)
  useEffect(() => {
    console.log("Setting up @react-native-firebase/auth listener...");
    // Use the onAuthStateChanged from the imported auth instance
    const unsubscribe = auth.onAuthStateChanged(
      // Changed here
      (authUser) => {
        console.log(
          "Auth state changed:",
          authUser ? `User UID: ${authUser.uid}` : "No user"
        );
        if (authUser) {
          setUser(authUser); // This is now the @r-n-firebase user object
          setIsGuest(false);
        } else {
          setUser(null);
        }
        setAuthInitializing(false);
        if (!isGuest) {
          setLoading(false);
        }
      },
      (authStateError) => {
        console.error(
          "❌ @react-native-firebase Auth State Error:",
          authStateError
        );
        setError("Failed to check authentication status.");
        setAuthInitializing(false);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      console.log("Cleaning up @react-native-firebase/auth listener.");
      unsubscribe();
    };
  }, [isGuest]); // Added isGuest dependency to potentially reset loading state correctly

  // --- Action Handlers (Callbacks for UI) ---

  // Initiate Google Sign-In (using native SDK + @r-n-firebase)
  const googleLoginHandler = useCallback(async () => {
    setError("");
    setLoading(true);

    if (!isGoogleConfigured) {
      setError("Google Sign-In is not ready. Please check configuration.");
      setLoading(false);
      return;
    }

    let userInfo = null;
    try {
      console.log("Checking Play Services (Android)...");
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      console.log("🚀 Prompting Google Sign-In (Native)...");
      userInfo = await GoogleSignin.signIn(); // Get Google user info

      // --- Use idToken from Google Sign-In ---
      // The structure userInfo.idToken should be correct based on @r-n-google-signin docs usually
      const idToken = userInfo.idToken;
      if (!idToken) {
        console.error(
          "Google Sign-In userInfo object missing idToken:",
          JSON.stringify(userInfo, null, 2)
        );
        throw new Error("Google Sign-In did not return an ID token.");
      }
      // --- End idToken Check ---

      console.log(
        "🔥 Creating Firebase credential (@r-n-firebase) with Google ID Token..."
      );
      // Use GoogleAuthProvider from @react-native-firebase/auth
      const googleCredential = GoogleAuthProvider.credential(idToken); // Changed here

      console.log(
        "🔥 Signing into Firebase (@r-n-firebase) with Google credential..."
      );
      // Use signInWithCredential from the imported auth instance
      await auth.signInWithCredential(googleCredential); // Changed here

      console.log(
        "✅✅ Firebase sign-in successful! Auth state change will update UI."
      );
      // User state set by onAuthStateChanged listener
    } catch (error) {
      // Keep enhanced error logging
      console.error(
        "❌❌❌ Error caught during Google/Firebase Sign-In Process ❌❌❌"
      );
      console.error(
        "userInfo value when error occurred:",
        JSON.stringify(userInfo, null, 2)
      );
      try {
        console.error(
          "Error Object Details:",
          JSON.stringify(error, Object.getOwnPropertyNames(error))
        );
      } catch (e) {
        console.error("Error Object (could not stringify):", error);
      }
      console.error("Error Code:", error?.code);
      console.error("Error Message:", error?.message || error);

      // Handle specific Google Sign-In status codes (no change needed here)
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        setError("Sign in cancelled.");
        console.log("🤷 User cancelled Google Sign-In flow.");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        setError("Sign in is already in progress.");
        console.log("⏳ Sign-in already in progress.");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setError("Play Services not available or outdated.");
        console.error("❌ Play Services not available/outdated.");
      } else if (
        error.message === "Google Sign-In did not return an ID token."
      ) {
        setError("Failed to get necessary data from Google Sign-In.");
      } else {
        setError(
          `Google Sign-In failed: ${
            error.message || error.code || "Unknown error"
          }`
        );
      }
    } finally {
      setLoading(false);
    }
  }, [isGoogleConfigured]);

  // Sign out handler (using @r-n-firebase)
  const signoutHandler = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Sign out from Google Sign-In SDK first (if signed in)
      console.log("Checking Google Sign-In status via getCurrentUser...");
      const currentUser = await GoogleSignin.getCurrentUser();
      if (currentUser) {
        console.log(
          "User is signed in with Google SDK. Attempting Google Sign Out..."
        );
        await GoogleSignin.signOut();
        console.log("✅ Google Signed Out");
      } else {
        console.log(
          "ℹ️ Not signed in with Google SDK, skipping Google Sign Out."
        );
      }

      // Then Sign out from Firebase Auth
      console.log("Attempting Firebase Sign Out (@r-n-firebase)...");
      await auth.signOut(); // Changed here
      // State updates (setUser(null), setIsGuest(false)) handled by onAuthStateChanged listener

      console.log("✅ Firebase Signed Out");
    } catch (error) {
      // Keep enhanced error logging
      console.error("❌ Error during sign out:", error);
      try {
        console.error(
          "Sign out Error Object Details:",
          JSON.stringify(error, Object.getOwnPropertyNames(error))
        );
      } catch (e) {
        console.error("Sign out Error Object (could not stringify):", error);
      }
      console.error("Sign out Error Code:", error?.code);
      console.error("Sign out Error Message:", error?.message || error);
      setError(`Failed to sign out: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Guest Login Handler (no change needed)
  const onGuestLogin = useCallback(() => {
    setError("");
    setIsGuest(true);
    setUser(null);
    setLoading(false);
    console.log("👤 Continuing as Guest");
  }, []);

  // Final Return Value (no change needed)
  const combinedLoading = loading || authInitializing; // Simplified loading check

  return {
    user,
    isGuest,
    error,
    loading: combinedLoading,
    onGuestLogin,
    signoutHandler,
    googleLoginHandler,
  };
}

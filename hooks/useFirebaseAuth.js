import { useEffect, useState, useCallback } from "react";
import { Platform } from "react-native"; // Import Platform
import { auth } from "../config/firebaseConfig"; // Your Firebase auth export
import {
  onAuthStateChanged,
  signOut as firebaseSignOut, // Rename to avoid conflict
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";

// Get the Web Client ID from app.config.js extra section
// Ensure GOOGLE_WEB_CLIENT_ID is defined in .env and exposed in app.config.js extra as googleWebClientId
const GOOGLE_WEB_CLIENT_ID = Constants.expoConfig?.extra?.googleWebClientId;

export default function useFirebaseAuth() {
  // --- State Variables ---
  const [user, setUser] = useState(null); // Holds the authenticated Firebase user object
  const [loading, setLoading] = useState(true); // General loading state
  const [authInitializing, setAuthInitializing] = useState(true); // Tracks initial Firebase auth check
  const [error, setError] = useState(""); // Holds error messages for the UI
  const [isGuest, setIsGuest] = useState(false); // Tracks if the user chose guest mode
  const [isGoogleConfigured, setIsGoogleConfigured] = useState(false); // Tracks if Google Signin was configured

  // --- Effects ---

  // 1. Configure Google Sign-In on mount
  useEffect(() => {
    if (!GOOGLE_WEB_CLIENT_ID) {
      console.error(
        "❌ FATAL: Google Web Client ID not found in app.config extra!"
      );
      setError("App configuration error (Web Client ID missing).");
      setAuthInitializing(false); // Stop loading states
      setLoading(false);
      setIsGoogleConfigured(false);
      return; // Stop configuration if ID is missing
    }

    console.log("🔧 Configuring Google Sign-In...");
    try {
      GoogleSignin.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID, // Required for idToken for backend validation (like Firebase)
        // iosClientId is usually configured via the plugin/Info.plist setup using reservedClientId
        offlineAccess: false, // Set to true if you need server auth code for offline access
      });
      console.log("✅ Google Sign-In Configured");
      setIsGoogleConfigured(true);
    } catch (configureError) {
      console.error("❌ Error configuring Google Sign-In:", configureError);
      setError("Failed to initialize Google Sign-In.");
      setIsGoogleConfigured(false);
      setAuthInitializing(false); // Also stop loading here
      setLoading(false);
    }
  }, []); // Run once on mount

  // 2. Firebase Authentication State Listener
  useEffect(() => {
    console.log("Setting up Firebase Auth listener...");
    const unsubscribe = onAuthStateChanged(
      auth,
      (authUser) => {
        if (authUser) {
          setUser(authUser);
          setIsGuest(false); // Ensure guest mode is off if logged in
        } else {
          setUser(null);
        }
        setAuthInitializing(false); // Initial check complete
        // Avoid setting loading false if just switched to guest mode
        // as the guest state change might trigger UI updates handled elsewhere
        if (!isGuest) {
          setLoading(false);
        }
      },
      (authStateError) => {
        // Handle errors during initial auth state observation
        console.error("❌ Firebase Auth State Error:", authStateError);
        setError("Failed to check authentication status.");
        setAuthInitializing(false);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      console.log("Cleaning up Firebase Auth listener.");
      unsubscribe();
    };
  }, []); // Run once

  // --- Action Handlers (Callbacks for UI) ---

  // Initiate Google Sign-In (using native SDK)
  const googleLoginHandler = useCallback(async () => {
    setError("");
    setLoading(true);

    if (!isGoogleConfigured) {
      setError("Google Sign-In is not ready. Please check configuration.");
      setLoading(false);
      return;
    }

    // Define userInfo variable outside try block to potentially log it in catch
    let userInfo = null;
    try {
      console.log("Checking Play Services (Android)...");
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      console.log("🚀 Prompting Google Sign-In (Native)...");
      userInfo = await GoogleSignin.signIn(); // Assign result to outer scope variable

      // Check for idToken *inside* the data object
      if (!userInfo || !userInfo.data || !userInfo.data.idToken) {
        console.error(
          "userInfo object structure was missing data or idToken:",
          JSON.stringify(userInfo, null, 2)
        );
        // Throw specific error
        throw new Error(
          "Google Sign-In did not return valid data including idToken."
        );
      }

      console.log("🔥 Creating Firebase credential with Google ID Token...");
      // Use the idToken from the data object
      const googleCredential = GoogleAuthProvider.credential(
        userInfo.data.idToken
      );
      // --- END CORRECTED DATA ACCESS ---

      console.log("🔥 Signing into Firebase with Google credential...");
      await signInWithCredential(auth, googleCredential);
      console.log(
        "✅✅ Firebase sign-in successful! Auth state change will update UI."
      );
      // User state is set by the onAuthStateChanged listener
    } catch (error) {
      // Enhanced logging in catch block
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

      // Handle specific Google Sign-In status codes
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        setError("Sign in cancelled.");
        console.log("🤷 User cancelled Google Sign-In flow.");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        setError("Sign in is already in progress.");
        console.log("⏳ Sign-in already in progress.");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setError("Play Services not available or outdated.");
        console.error("❌ Play Services not available/outdated.");
      }
      // Check if it's the specific error we threw
      else if (
        error.message ===
        "Google Sign-In did not return valid data including idToken."
      ) {
        setError("Failed to get necessary data from Google Sign-In.");
      }
      // Catch the original TypeError just in case (though less likely now)
      else if (
        error instanceof TypeError &&
        error.message.includes("Cannot read property")
      ) {
        setError(
          "Failed to process Google Sign-In data. Check configuration (SHA-1/Client ID)."
        );
      } else {
        // Handle other generic errors
        setError(
          `Google Sign-In failed: ${
            error.message || error.code || "Unknown error"
          }`
        );
      }
    } finally {
      setLoading(false); // Ensure loading stops
    }
  }, [isGoogleConfigured]); // Dependency: only run if configured

  const signoutHandler = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // --- Replace isSignedIn() check ---
      console.log("Checking Google Sign-In status via getCurrentUser...");
      const currentUser = await GoogleSignin.getCurrentUser();

      if (currentUser) {
        // If getCurrentUser returns a user object, they are signed in
        console.log(
          "User is signed in with Google (checked via getCurrentUser). Attempting Google Sign Out..."
        );
        await GoogleSignin.signOut(); // Sign out from Google SDK
        console.log("✅ Google Signed Out");
      } else {
        console.log(
          "ℹ️ Not signed in with Google SDK (checked via getCurrentUser), skipping Google Sign Out."
        );
      }
      // --- End replacement ---

      console.log("Attempting Firebase Sign Out...");
      await firebaseSignOut(auth); // Sign out from Firebase Auth
      setUser(null);
      setIsGuest(false);
      console.log("✅ Firebase Signed Out");
    } catch (error) {
      // Keep your enhanced error logging here
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
      setError(`Failed to sign out: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Guest Login Handler
  const onGuestLogin = useCallback(() => {
    setError("");
    setIsGuest(true);
    setUser(null); // Ensure no user object when guest
    setLoading(false); // Ensure loading is off if switching to guest
    console.log("👤 Continuing as Guest");
  }, []);

  // --- Final Return Value ---
  // Combine loading states for a simpler UI check
  const combinedLoading =
    loading || authInitializing || (!isGoogleConfigured && !isGuest);

  return {
    user,
    isGuest,
    error,
    loading: combinedLoading,
    onGuestLogin,
    signoutHandler,
    googleLoginHandler, // Now uses the native Google Sign-In
  };
}

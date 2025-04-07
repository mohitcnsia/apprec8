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
const GOOGLE_WEB_CLIENT_ID = Constants.expoConfig?.extra?.googleWebClientId;
// The iOS Client ID is configured via the plugin in app.config.js

export default function useFirebaseAuth() {
  // --- State Variables ---
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // General loading state
  const [authInitializing, setAuthInitializing] = useState(true); // Tracks initial Firebase auth check
  const [error, setError] = useState("");
  const [isGuest, setIsGuest] = useState(false);
  const [isGoogleConfigured, setIsGoogleConfigured] = useState(false);

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
      return;
    }

    console.log("🔧 Configuring Google Sign-In...");
    try {
      GoogleSignin.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID, // Required for idToken
        // iosClientId is configured via the plugin/Info.plist setup
        offlineAccess: false, // Set to true if you need server auth code
        // accountName: '', // Optional specific account hint
        // forceCodeForRefreshToken: true, // if using offlineAccess
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
        console.log(
          " Firebase Auth State Changed:",
          authUser ? `User UID: ${authUser.uid}` : "No user"
        );
        if (authUser) {
          setUser(authUser);
          setIsGuest(false);
        } else {
          setUser(null);
        }
        setAuthInitializing(false);
        if (!isGuest) {
          // Don't stop loading if we just chose guest
          setLoading(false);
        }
      },
      (authStateError) => {
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
  }, [isGuest]); // Rerun if guest status changes maybe? Or just run once. Let's keep it simple for now.

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

    try {
      console.log("Checking Play Services (Android)...");
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      console.log("🚀 Prompting Google Sign-In (Native)...");
      const userInfo = await GoogleSignin.signIn();
      console.log("✅ Google Sign-In Success (Native):", {
        id: userInfo.user.id,
        email: userInfo.user.email,
      });

      if (!userInfo.idToken) {
        throw new Error("Google Sign-In succeeded but idToken was missing.");
      }

      console.log("🔥 Creating Firebase credential with Google ID Token...");
      const googleCredential = GoogleAuthProvider.credential(userInfo.idToken);

      console.log("🔥 Signing into Firebase with Google credential...");
      await signInWithCredential(auth, googleCredential);
      console.log(
        "✅✅ Firebase sign-in successful! Auth state change will update UI."
      );
      // User state is set by the onAuthStateChanged listener
    } catch (error) {
      console.error("❌ Google Sign-In or Firebase Sign-In Error:", error);
      // Handle specific Google Sign-In errors
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        setError("Sign in cancelled.");
        console.log("🤷 User cancelled Google Sign-In flow.");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        setError("Sign in is already in progress.");
        console.log("⏳ Sign-in already in progress.");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setError("Play Services not available or outdated.");
        console.error("❌ Play Services not available/outdated.");
      } else {
        // Handle other errors (network, configuration, Firebase credential issues)
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

  // Sign Out Handler (handles both Google Sign-In and Firebase)
  const signoutHandler = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Attempting Google Sign Out...");
      await GoogleSignin.signOut(); // Sign out from Google SDK
      console.log("✅ Google Signed Out");

      console.log("Attempting Firebase Sign Out...");
      await firebaseSignOut(auth); // Sign out from Firebase Auth
      setUser(null); // Explicitly clear user state
      setIsGuest(false);
      console.log("✅ Firebase Signed Out");
    } catch (error) {
      console.error("❌ Error during sign out:", error);
      setError(`Failed to sign out: ${error.message}`);
      // Note: If Google Signout fails but Firebase succeeds, user might be partially logged out.
    } finally {
      setLoading(false);
    }
  }, []);

  // Guest Login Handler
  const onGuestLogin = useCallback(() => {
    setError("");
    setIsGuest(true);
    setUser(null);
    setLoading(false);
    console.log("👤 Continuing as Guest");
  }, []);

  // --- Final Return Value ---
  const combinedLoading =
    loading || authInitializing || (!isGoogleConfigured && !isGuest); // Add config check to loading

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

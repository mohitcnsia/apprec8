// hooks/useFirebaseAuth.js (Add exitGuestModeHandler)

import { useEffect, useState, useCallback } from "react";
import { authInstance as auth } from "../config/firebaseConfig"; // Adjust path if needed
import { GoogleAuthProvider } from "@react-native-firebase/auth";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";
import { cleanEmail, authMessage } from "../utils/authErrors";

const GOOGLE_WEB_CLIENT_ID = Constants.expoConfig?.extra?.googleWebClientId;

export default function useFirebaseAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authInitializing, setAuthInitializing] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(""); // good news (e.g. "reset link sent"), shown calmly, not as an error
  const [isGuest, setIsGuest] = useState(false);
  const [isGoogleConfigured, setIsGoogleConfigured] = useState(false);

  // Configure Google Sign-In
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

  // Firebase Auth Listener
  useEffect(() => {
    console.log("Setting up @react-native-firebase/auth listener...");
    const unsubscribe = auth.onAuthStateChanged(
      (authUser) => {
        console.log(
          "Auth state changed:",
          authUser ? `User UID: ${authUser.uid}` : "No user"
        );
        if (authUser) {
          setUser(authUser);
          setIsGuest(false); // If user logs in, they are not a guest
        } else {
          setUser(null);
          // Don't automatically set isGuest here, let onGuestLogin/exitGuestMode handle it
        }
        setAuthInitializing(false);
        // Only stop global loading if we know the final state (not guest or authUser determined)
        // Guest login sets its own loading state
        if (!isGuest || authUser) {
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
    return () => {
      console.log("Cleaning up @react-native-firebase/auth listener.");
      unsubscribe();
    };
  }, [isGuest]); // Rerun if guest status changes

  // Google Login
  const googleLoginHandler = useCallback(async () => {
    setError("");
    setLoading(true);
    if (!isGoogleConfigured) {
      /* ... handle not configured ... */ setLoading(false);
      return;
    }
    let userInfo = null;
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      userInfo = await GoogleSignin.signIn();
      const idToken = userInfo?.data?.idToken; // Corrected access
      if (!idToken)
        throw new Error("Google Sign-In did not return an ID token.");
      const googleCredential = GoogleAuthProvider.credential(idToken);
      await auth.signInWithCredential(googleCredential);
      // User state set by listener, loading set by listener or finally block
    } catch (error) {
      console.error("❌ Google Sign-In Error:", JSON.stringify(error));
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        setError("Sign in cancelled.");
      }
      // ... other specific error handling ...
      else {
        setError(`Google Sign-In failed: ${error.message || "Unknown error"}`);
      }
    } finally {
      // Ensure loading stops if listener hasn't already set it
      setLoading(false);
    }
  }, [isGoogleConfigured]);

  // Email Sign In
  const emailSignInHandler = useCallback(async (email, password) => {
    setError("");
    setNotice("");
    setLoading(true);
    try {
      // Trim: keyboards add a space after an email suggestion, and Firebase rejects it (owner 2026-11-05).
      await auth.signInWithEmailAndPassword(cleanEmail(email), password);
    } catch (error) {
      console.warn("Email sign-in failed:", error?.code);
      setError(authMessage(error, "signIn"));
    } finally {
      setLoading(false);
    }
  }, []);

  // Email Sign Up
  const emailSignUpHandler = useCallback(async (email, password) => {
    setError("");
    setNotice("");
    setLoading(true);
    try {
      await auth.createUserWithEmailAndPassword(cleanEmail(email), password);
      // Optional: Send verification email immediately after sign up
      // Consider showing a message regardless, as auth state might not update instantly
      // await userCred.user.sendEmailVerification();
      // setError("Verification email sent. Please verify before logging in.");
      // You might want to sign them out until verified depending on your flow
      // await auth.signOut();
    } catch (error) {
      // Was mapAuthError(error), never imported: every sign-up error crashed silently and showed nothing.
      console.warn("Email sign-up failed:", error?.code);
      setError(authMessage(error, "signUp"));
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign Out (for logged-in users)
  const signoutHandler = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const googleUser = await GoogleSignin.getCurrentUser();
      if (googleUser) {
        await GoogleSignin.signOut();
        console.log("✅ Google Signed Out");
      }
      await auth.signOut();
      console.log("✅ Firebase Signed Out");
      // Listener will set user to null
    } catch (error) {
      /* ... handle error ... */ setError(
        `Failed to sign out: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Password Reset Handler ---
  const passwordResetHandler = useCallback(async (email) => {
    const clean = cleanEmail(email);
    setError("");
    setNotice("");
    if (!clean.includes("@")) {
      setError("Type your email address above first.");
      return;
    }
    setLoading(true);
    try {
      await auth.sendPasswordResetEmail(clean);
      setNotice(`If an account exists for ${clean}, a reset link is on its way. Check your inbox and spam folder.`);
    } catch (error) {
      console.warn("Password reset failed:", error?.code);
      const msg = authMessage(error, "reset");
      if (/If an account exists/.test(msg)) setNotice(msg);
      else setError(msg);
    } finally {
      setLoading(false);
    }
  }, []); // Add setError, setLoading dependencies: [setError, setLoading]

  const onGuestLogin = useCallback(() => {
    setError(""); // Clear errors
    setNotice("");
    // We don't set loading state directly here.
    // Setting isGuest=true triggers the useEffect listener which might adjust loading.

    // Ensure no actual user is signed in when entering guest mode
    if (auth.currentUser) {
      console.log("Signing out existing user before entering guest mode...");
      auth.signOut(); // Sign out any lingering user first
    }

    setUser(null); // Ensure user state is null
    setIsGuest(true); // Set guest mode to true
    console.log("👤 Continuing as Guest");

    // Dependencies for useCallback - add any state setters used inside
  }, [setError, setIsGuest, setUser, auth]); // Added dependencies

  // ... (rest of the hook, including the return statement) ...

  // --- NEW: Handler to Exit Guest Mode ---
  const exitGuestModeHandler = useCallback(() => {
    console.log("Exiting guest mode...");
    setIsGuest(false); // Set guest mode to false, App.js logic will show AuthScreen
    // User is already null
    // setError(""); // Optionally clear errors
  }, []);

  return {
    user,
    isGuest,
    error,
    notice,
    // Full-screen loader only while the app first finds out who is signed in. A sign-in in progress (busy) keeps the
    // login screen on screen, so a failed try doesn't wipe what the user typed (owner 2026-11-05).
    initializing: authInitializing,
    busy: loading,
    onGuestLogin,
    signoutHandler, // For logged-in profile
    googleLoginHandler,
    emailSignInHandler,
    emailSignUpHandler,
    exitGuestModeHandler, // <-- Add this new handler
    passwordResetHandler,
  };
}

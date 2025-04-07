import { useEffect, useState, useCallback } from "react";
import { auth } from "../config/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function useFirebaseAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        if (!authUser.emailVerified) {
          setError("Please verify your email or explore as a Guest");
          signOut(auth);
        } else {
          console.log("✅ Verified user signed in");
          setError("");
          setUser(authUser);
          setIsGuest(false);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signoutHandler = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsGuest(false);
      console.log("✅ Successfully signed out");
    } catch (error) {
      console.error("❌ Error signing out:", error);
    }
  }, []);

  const onGuestLogin = () => setIsGuest(true);

  return {
    user,
    isGuest,
    error,
    loading,
    onGuestLogin,
    signoutHandler,
  };
}

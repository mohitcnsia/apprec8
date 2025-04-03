import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { useState, useEffect } from "react";
import { Colors } from "./config/colors";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import AuthScreen from "./screens/auth/AuthScreen"; // Import Auth Screen
import { auth } from "./config/firebaseConfig"; // Import Firebase auth
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useFonts } from "expo-font";
import { secureStorage } from "./config/firebaseConfig";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isGuest, setIsGuest] = useState(false); // Guest Mode

  useFonts({
    rouge: require("./assets/fonts/RougeScript-Regular.ttf"),
    delius: require("./assets/fonts/Delius-Regular.ttf"),
    deliusBold: require("./assets/fonts/DeliusUnicase-Bold.ttf"),
    pacifico: require("./assets/fonts/Pacifico-Regular.ttf"),
  });

  // Restore user session when the app starts
  useEffect(() => {
    const restoreUser = async () => {
      try {
        const storedUser = await secureStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("Restored user from SecureStore");
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error restoring user from SecureStore:", error);
      } finally {
        setLoading(false);
      }
    };

    restoreUser();

    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        if (!authUser.emailVerified) {
          setError("Please verify your email or explore as a Guest");
          signOut(auth); // 🚀 Force logout if not verified
        } else {
          console.log("👤 Auth State Changed");
          setError(""); // Clear error if email is verified
          setUser(authUser);
          setIsGuest(false); // Ensure we’re not in guest mode
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const signoutHandler = async () => {
    try {
      await signOut(auth);
      await secureStorage.removeItem("user");
      setUser(null);
      setIsGuest(false);
      console.log("✅ Successfully signed out");
    } catch (error) {
      console.error("❌ Error signing out:", error);
    }
  };

  return (
    <>
      <StatusBar
        style="inverted"
        translucent={false}
        backgroundColor={Colors.primaryDarkMaroon}
      />
      <View style={styles.container}>
        {user || isGuest ? (
          <BottomTabNavigator
            isGuest={isGuest}
            signoutHandler={signoutHandler}
          />
        ) : (
          <AuthScreen
            externalError={error}
            onGuestLogin={() => setIsGuest(true)}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDarkMaroon,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

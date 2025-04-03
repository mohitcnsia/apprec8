import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { useState, useEffect } from "react";
import { Colors } from "./config/colors";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import AuthScreen from "./screens/auth/AuthScreen"; // Import Auth Screen
import { auth } from "./config/firebaseConfig"; // Import Firebase auth
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useFonts } from "expo-font";
import { secureStorage } from "./config/firebaseConfig";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      console.log("👤 Auth State Changed");
      setUser(authUser);
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

  return (
    <>
      <StatusBar
        style="inverted"
        translucent={false}
        backgroundColor={Colors.primaryDarkMaroon}
      />
      <View style={styles.container}>
        {user ? <BottomTabNavigator /> : <AuthScreen />}
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

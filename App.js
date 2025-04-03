import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { Colors } from "./config/colors";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import AuthScreen from "./screens/auth/AuthScreen"; // Import Auth Screen
import { auth } from "./config/firebaseConfig"; // Import Firebase auth
import { onAuthStateChanged } from "firebase/auth";
import { useFonts } from "expo-font";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useFonts({
    rouge: require("./assets/fonts/RougeScript-Regular.ttf"),
    delius: require("./assets/fonts/Delius-Regular.ttf"),
    deliusBold: require("./assets/fonts/DeliusUnicase-Bold.ttf"),
    pacifico: require("./assets/fonts/Pacifico-Regular.ttf"),
  });

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primaryDarkMaroon} />
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
        {/* {user ? <BottomTabNavigator /> : <AuthScreen />} */}
        <Text style={{ color: "white", fontSize: 20 }}>App is running!</Text>
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

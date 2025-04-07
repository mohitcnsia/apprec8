import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { Colors } from "./config/colors";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import AuthScreen from "./screens/auth/AuthScreen";
import { auth } from "./config/firebaseConfig"; // uses initializeAuth + AsyncStorage
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useFonts } from "expo-font";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isGuest, setIsGuest] = useState(false);

  const [fontsLoaded] = useFonts({
    rouge: require("./assets/fonts/RougeScript-Regular.ttf"),
    delius: require("./assets/fonts/Delius-Regular.ttf"),
    deliusBold: require("./assets/fonts/DeliusUnicase-Bold.ttf"),
    pacifico: require("./assets/fonts/Pacifico-Regular.ttf"),
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        if (!authUser.emailVerified) {
          setError("Please verify your email or explore as a Guest");
          signOut(auth); // force logout
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

  const signoutHandler = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsGuest(false);
      console.log("✅ Successfully signed out");
    } catch (error) {
      console.error("❌ Error signing out:", error);
    }
  };

  const onGuestLogin = () => {
    setIsGuest(true);
  };

  if (!fontsLoaded || loading) {
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
        {user || isGuest ? (
          <BottomTabNavigator
            isGuest={isGuest}
            signoutHandler={signoutHandler}
            user={user}
          />
        ) : (
          <AuthScreen externalError={error} onGuestLogin={onGuestLogin} />
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

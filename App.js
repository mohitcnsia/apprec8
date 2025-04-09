// App.js (Pass down the new handler)

import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text } from "react-native";
import { useFonts } from "expo-font";
import { Colors } from "./config/colors";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import AuthScreen from "./screens/auth/AuthScreen";
import useFirebaseAuth from "./hooks/useFirebaseAuth";
import CalmLoader from "./components/common/CalmLoader";
import React, { useEffect } from "react"; // Import React and useEffect
import firestore from "@react-native-firebase/firestore"; // Import for persistence settings

export default function App() {
  // --- Setup Firestore Persistence ---
  useEffect(() => {
    firestore()
      .settings({
        persistence: true,
      })
      .then(() => console.log("🔥 Firestore persistence enabled."))
      .catch((err) =>
        console.error("❌ Firestore persistence setup error:", err)
      );
  }, []);
  // ---

  const [fontsLoaded] = useFonts({
    rouge: require("./assets/fonts/RougeScript-Regular.ttf"),
    delius: require("./assets/fonts/Delius-Regular.ttf"),
    deliusBold: require("./assets/fonts/DeliusUnicase-Bold.ttf"),
    pacifico: require("./assets/fonts/Pacifico-Regular.ttf"),
    nunito: require("./assets/fonts/Nunito-Regular.ttf"),
    nunitoBold: require("./assets/fonts/Nunito-Bold.ttf"),
  });

  const {
    user,
    isGuest,
    error,
    loading,
    onGuestLogin,
    signoutHandler, // Specific signout for logged-in users
    googleLoginHandler,
    emailSignInHandler,
    emailSignUpHandler,
    exitGuestModeHandler, // <-- Get the new handler
  } = useFirebaseAuth();

  if (!fontsLoaded || loading) {
    return <CalmLoader />;
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
            signoutHandler={signoutHandler} // Pass standard signout
            exitGuestModeHandler={exitGuestModeHandler} // Pass exit guest handler
            user={user}
          />
        ) : (
          <AuthScreen
            externalError={error}
            isAuthLoading={loading} // Pass loading state for disabling buttons
            onGuestLogin={onGuestLogin}
            onGoogleLogin={googleLoginHandler}
            onEmailSignIn={emailSignInHandler}
            onEmailSignUp={emailSignUpHandler}
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
});

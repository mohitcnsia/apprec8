// src/AppContent.js
import React, { useEffect, useState } from "react"; // Added useState
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import firestore from "@react-native-firebase/firestore";
import { Provider as PaperProvider } from "react-native-paper";

import BottomTabNavigator from "./navigation/BottomTabNavigator";
import AuthScreen from "./screens/auth/AuthScreen";
import useFirebaseAuth from "./hooks/useFirebaseAuth";
import CalmLoader from "./components/common/CalmLoader";
import { useTheme } from "./context/ThemeContext";

const MIN_LOADER_DISPLAY_TIME = 3000; // 3 seconds

// Helper component for themed status bar
const ThemedStatusBar = () => {
  const { theme, isDark } = useTheme();
  const statusBarColor =
    theme.statusBarBackground ||
    theme.background ||
    (isDark ? "#000000" : "#FFFFFF");
  return (
    <StatusBar
      style={isDark ? "light" : "dark"}
      backgroundColor={statusBarColor}
      translucent={false}
    />
  );
};

const AppContent = () => {
  const { theme, isDark, isThemeLoaded } = useTheme();
  const [minimumLoaderTimeElapsed, setMinimumLoaderTimeElapsed] =
    useState(false); // New state

  useEffect(() => {
    // Start a timer to ensure the loader is shown for at least MIN_LOADER_DISPLAY_TIME
    const timer = setTimeout(() => {
      setMinimumLoaderTimeElapsed(true);
    }, MIN_LOADER_DISPLAY_TIME);

    // Firestore persistence setup
    firestore()
      .settings({ persistence: true })
      .then(() => console.log("🔥 Firestore persistence enabled."))
      .catch((err) =>
        console.error("❌ Firestore persistence setup error:", err)
      );

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []); // Empty dependency array ensures this runs only once on mount

  const [fontsLoaded, fontError] = useFonts({
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
    error: authError,
    loading: authLoading,
    onGuestLogin,
    signoutHandler,
    googleLoginHandler,
    emailSignInHandler,
    emailSignUpHandler,
    passwordResetHandler,
    exitGuestModeHandler,
  } = useFirebaseAuth();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.background || (isDark ? "#000000" : "#FFFFFF"),
        },
        loaderContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background || (isDark ? "#000000" : "#FFFFFF"),
        },
      }),
    [theme, isDark]
  );

  useEffect(() => {
    if (fontError) console.error("Font Loading Error:", fontError);
    if (typeof authError !== "undefined" && authError)
      console.error("Auth Hook Error:", authError);
    console.log(
      `>>> AppContent State Check: fontsLoaded=${fontsLoaded}, authLoading=${authLoading}, isThemeLoaded=${isThemeLoaded}, minimumLoaderTimeElapsed=${minimumLoaderTimeElapsed}`
    );
  }, [
    fontsLoaded,
    authLoading,
    isThemeLoaded,
    fontError,
    authError,
    minimumLoaderTimeElapsed,
  ]);

  // Update the loading condition
  if (
    !fontsLoaded ||
    authLoading ||
    !isThemeLoaded ||
    !minimumLoaderTimeElapsed
  ) {
    return (
      <View style={styles.loaderContainer}>
        <CalmLoader />
      </View>
    );
  }

  const currentPaperTheme = theme;

  return (
    <PaperProvider theme={currentPaperTheme}>
      <ThemedStatusBar />
      <View style={styles.container}>
        {user || isGuest ? (
          <BottomTabNavigator
            isGuest={isGuest}
            signoutHandler={signoutHandler}
            exitGuestModeHandler={exitGuestModeHandler}
            user={user}
          />
        ) : (
          <AuthScreen
            externalError={authError}
            isAuthLoading={authLoading}
            onGuestLogin={onGuestLogin}
            onGoogleLogin={googleLoginHandler}
            onEmailSignIn={emailSignInHandler}
            onEmailSignUp={emailSignUpHandler}
            onPasswordReset={passwordResetHandler}
          />
        )}
      </View>
    </PaperProvider>
  );
};

export default AppContent;

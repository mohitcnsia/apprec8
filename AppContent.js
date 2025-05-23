// src/AppContent.js
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import firestore from "@react-native-firebase/firestore";
import { Provider as PaperProvider } from "react-native-paper"; // Ensure this import is present

import BottomTabNavigator from "./navigation/BottomTabNavigator";
import AuthScreen from "./screens/auth/AuthScreen";
import useFirebaseAuth from "./hooks/useFirebaseAuth";
import CalmLoader from "./components/common/CalmLoader";
import { useTheme } from "./context/ThemeContext"; // Your ThemeContext

// Helper component for themed status bar
const ThemedStatusBar = () => {
  const { theme, isDark } = useTheme();
  // Use theme.statusBarBackground if you have it, or theme.background
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
  // 'theme' from your useTheme() is your custom theme object
  // 'paperTheme' was a suggestion if you adapted it. If your 'theme' object
  // is what you intend to use for Paper components (even if not fully MD3), pass that.
  const { theme, isDark, isThemeLoaded } = useTheme();

  useEffect(() => {
    firestore()
      .settings({ persistence: true })
      .then(() => console.log("🔥 Firestore persistence enabled."))
      .catch((err) =>
        console.error("❌ Firestore persistence setup error:", err)
      );
  }, []);

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
          // Use a color from your theme that PaperProvider won't override for this root View
          backgroundColor: theme.background || (isDark ? "#000000" : "#FFFFFF"),
        },
        loaderContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background || (isDark ? "#000000" : "#FFFFFF"),
        },
      }),
    [theme, isDark] // Added isDark
  );

  useEffect(() => {
    if (fontError) console.error("Font Loading Error:", fontError);
    if (typeof authError !== "undefined" && authError)
      console.error("Auth Hook Error:", authError);
    console.log(
      `>>> AppContent State Check: fontsLoaded=${fontsLoaded}, authLoading=${authLoading}, isThemeLoaded=${isThemeLoaded}`
    );
  }, [fontsLoaded, authLoading, isThemeLoaded, fontError, authError]);

  if (!fontsLoaded || authLoading || !isThemeLoaded) {
    return (
      <View style={styles.loaderContainer}>
        <CalmLoader />
      </View>
    );
  }

  // This is the theme object that will be passed to PaperProvider.
  // It should be the theme object from your ThemeContext.
  const currentPaperTheme = theme;

  return (
    // 👇 PaperProvider should wrap your navigable content
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

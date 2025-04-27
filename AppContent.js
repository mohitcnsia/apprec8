// src/AppContent.js (New file or define below App in App.js)
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import firestore from "@react-native-firebase/firestore";

import BottomTabNavigator from "./navigation/BottomTabNavigator";
import AuthScreen from "./screens/auth/AuthScreen";
import useFirebaseAuth from "./hooks/useFirebaseAuth";
import CalmLoader from "./components/common/CalmLoader";
import { useTheme } from "./context/ThemeContext"; // Import useTheme hook

// Helper component for themed status bar
const ThemedStatusBar = () => {
  const { theme, isDark } = useTheme();
  // Define a statusBar background color in your theme objects if needed
  const statusBarColor = theme.statusBarBackground || theme.background;
  return (
    <StatusBar
      style={isDark ? "light" : "dark"}
      backgroundColor={statusBarColor}
      translucent={false}
    />
  );
};

const AppContent = () => {
  const { theme, isThemeLoaded } = useTheme(); // Get theme and loading status

  // --- Firestore Persistence ---
  useEffect(() => {
    // You might want to delay this slightly until theme is loaded if needed,
    // but usually it's fine to run immediately.
    firestore()
      .settings({ persistence: true })
      .then(() => console.log("🔥 Firestore persistence enabled."))
      .catch((err) =>
        console.error("❌ Firestore persistence setup error:", err)
      );
  }, []);

  // --- Fonts ---
  const [fontsLoaded, fontError] = useFonts({
    rouge: require("./assets/fonts/RougeScript-Regular.ttf"),
    delius: require("./assets/fonts/Delius-Regular.ttf"),
    deliusBold: require("./assets/fonts/DeliusUnicase-Bold.ttf"),
    pacifico: require("./assets/fonts/Pacifico-Regular.ttf"),
    nunito: require("./assets/fonts/Nunito-Regular.ttf"),
    nunitoBold: require("./assets/fonts/Nunito-Bold.ttf"),
  });

  // --- Auth ---
  const {
    user,
    isGuest,
    error: authError,
    loading: authLoading, // Renamed to avoid clash if we used theme loading state
    onGuestLogin,
    signoutHandler,
    googleLoginHandler,
    emailSignInHandler,
    emailSignUpHandler,
    passwordResetHandler,
    exitGuestModeHandler,
  } = useFirebaseAuth();

  // --- Dynamic Styles ---
  // Use React.useMemo to recalculate styles only when the theme changes
  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.background, // Use theme background
        },
        loaderContainer: {
          // Optional: Center loader if needed
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background, // Use theme background for loader screen too
        },
      }),
    [theme]
  ); // Dependency array ensures regeneration on theme change

  // --- Debugging Log ---
  useEffect(() => {
    // Log font loading errors if any
    if (fontError) {
      console.error("Font Loading Error:", fontError);
    }

    // Check if authError exists before trying to log it
    if (typeof authError !== "undefined" && authError) {
      console.error("Auth Hook Error:", authError);
    }

    // Log the state values
    console.log(
      `>>> AppContent State Check: fontsLoaded=${fontsLoaded}, authLoading=${authLoading}, isThemeLoaded=${isThemeLoaded}`
    );

    // Make sure authError is included here ONLY if it's correctly destructured above
  }, [fontsLoaded, authLoading, isThemeLoaded, fontError, authError]);

  // --- Loading State Check ---
  // Wait for fonts, auth state, AND the theme to be loaded from storage
  if (!fontsLoaded || authLoading || !isThemeLoaded) {
    // Render loader against the current theme's background (or a default if preferred)
    return (
      <View style={styles.loaderContainer}>
        <CalmLoader /* Pass theme props to CalmLoader if it needs them */ />
      </View>
    );
  }

  // --- Main Content ---
  return (
    <>
      <ThemedStatusBar />
      <View style={styles.container}>
        {user || isGuest ? (
          <BottomTabNavigator
            // Pass necessary props
            isGuest={isGuest}
            signoutHandler={signoutHandler}
            exitGuestModeHandler={exitGuestModeHandler}
            user={user}
            // IMPORTANT: BottomTabNavigator and its screens now need to use useTheme()
            // internally to get themed colors for styling.
          />
        ) : (
          <AuthScreen
            // Pass necessary props
            externalError={authError}
            isAuthLoading={authLoading} // Pass renamed loading state
            onGuestLogin={onGuestLogin}
            onGoogleLogin={googleLoginHandler}
            onEmailSignIn={emailSignInHandler}
            onEmailSignUp={emailSignUpHandler}
            onPasswordReset={passwordResetHandler}
            // IMPORTANT: AuthScreen now needs to use useTheme()
            // internally to get themed colors for styling.
          />
        )}
      </View>
    </>
  );
};

export default AppContent; // Export if in a separate file

import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Provider as PaperProvider } from "react-native-paper";

import BottomTabNavigator from "./navigation/BottomTabNavigator";
import AuthScreen from "./screens/auth/AuthScreen";
import useFirebaseAuth from "./hooks/useFirebaseAuth";
import CalmLoader from "./components/common/CalmLoader";
import { useTheme } from "./context/ThemeContext";

// --- NEW: Imports for In-App Messaging ---
import { useInAppMessaging } from "./hooks/useInAppMessaging";
import InAppMessageModal from "./components/common/InAppMessageModal";

const MIN_LOADER_DISPLAY_TIME = 3000;

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
    useState(false);

  const {
    isLoading: isMessageLoading,
    messageToShow,
    handleClose,
    updateUrl,
  } = useInAppMessaging();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinimumLoaderTimeElapsed(true);
    }, MIN_LOADER_DISPLAY_TIME);
    return () => clearTimeout(timer);
  }, []);

  const [fontsLoaded, fontError] = useFonts({
    rouge: require("./assets/fonts/RougeScript-Regular.ttf"),
    delius: require("./assets/fonts/Delius-Regular.ttf"),
    deliusBold: require("./assets/fonts/DeliusUnicase-Bold.ttf"),
    pacifico: require("./assets/fonts/Pacifico-Regular.ttf"),
    nunito: require("./assets/fonts/Nunito-Regular.ttf"),
    nunitoBold: require("./assets/fonts/Nunito-Bold.ttf"),
  });

  // --- RESTORED: Full destructuring of all auth functions ---
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
      `>>> AppContent State Check: fontsLoaded=${fontsLoaded}, authLoading=${authLoading}, isThemeLoaded=${isThemeLoaded}, minimumLoaderTimeElapsed=${minimumLoaderTimeElapsed}, isMessageLoading=${isMessageLoading}`
    );
  }, [
    fontsLoaded,
    authLoading,
    isThemeLoaded,
    fontError,
    authError,
    minimumLoaderTimeElapsed,
    isMessageLoading,
  ]);

  // --- UPDATED: Main loading condition now includes the message check ---
  if (
    !fontsLoaded ||
    authLoading ||
    !isThemeLoaded ||
    !minimumLoaderTimeElapsed ||
    isMessageLoading
  ) {
    return (
      <View style={styles.loaderContainer}>
        <CalmLoader />
      </View>
    );
  }

  // This is the check for the in-app message, which takes priority.
  if (messageToShow) {
    return (
      <InAppMessageModal
        isVisible={true}
        message={messageToShow}
        onClose={handleClose}
        updateUrl={updateUrl}
      />
    );
  }

  const currentPaperTheme = theme;

  return (
    <PaperProvider theme={currentPaperTheme}>
      <ThemedStatusBar />
      <View style={styles.container}>
        {user || isGuest ? (
          // --- RESTORED: All props are now correctly passed ---
          <BottomTabNavigator
            isGuest={isGuest}
            signoutHandler={signoutHandler}
            exitGuestModeHandler={exitGuestModeHandler}
            user={user}
          />
        ) : (
          // --- RESTORED: All props are now correctly passed ---
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

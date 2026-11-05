import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Provider as PaperProvider } from "react-native-paper";

import BottomTabNavigator from "./navigation/BottomTabNavigator";
import AuthScreen from "./screens/auth/AuthScreen";
import FirstRunScreen, { grownUpKey } from "./screens/auth/FirstRunScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { listenToUserDocument } from "./services/firestoreContentApi";
import { needsFirstRun } from "./utils/firstRun";
import { canWriteFreeText } from "./utils/freeText";
import { FreeTextContext } from "./context/FreeTextContext";
import { isTesterUser, FREE_TEXT_EMAILS } from "./config/appConfig";
import { remoteList } from "./services/remoteLists";
import useFirebaseAuth from "./hooks/useFirebaseAuth";
import CalmLoader from "./components/common/CalmLoader";
import { useTheme } from "./context/ThemeContext";

// --- NEW: Imports for In-App Messaging ---
import { useInAppMessaging } from "./hooks/useInAppMessaging";
import InAppMessageModal from "./components/common/InAppMessageModal";
import useStartupUpdate from "./hooks/useStartupUpdate";
import TimeUpOverlay from "./components/common/TimeUpOverlay";
import { AppDialogHost } from "./components/common/AppDialog";

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

  // Over-the-air update: load it behind the loading screen, so one restart is enough.
  const { checkingForUpdate } = useStartupUpdate();

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
    notice: authNotice,
    initializing: authLoading, // full-screen loader only while auth starts up
    busy: authBusy, // a sign-in / sign-up in progress: the login screen stays, with a spinner on its button
    onGuestLogin,
    signoutHandler,
    googleLoginHandler,
    emailSignInHandler,
    emailSignUpHandler,
    passwordResetHandler,
    exitGuestModeHandler,
  } = useFirebaseAuth();

  // First run (mockup T4): a signed-in account without a first name (or class, unless a parent / teacher) is asked once.
  const [userDoc, setUserDoc] = useState(undefined); // undefined = loading, null = not created yet
  const [grownUp, setGrownUp] = useState(null); // null = not read yet
  const uid = user?.uid || null;
  useEffect(() => {
    setUserDoc(undefined);
    setGrownUp(null);
    if (!uid) return undefined;
    AsyncStorage.getItem(grownUpKey(uid))
      .then((v) => setGrownUp(v === "1"))
      .catch(() => setGrownUp(false));
    return listenToUserDocument(
      (d) => setUserDoc(d || null),
      () => setUserDoc(null)
    );
  }, [uid]);
  const createdMs = Date.parse(user?.metadata?.creationTime || "") || 0;
  const brandNew = !!uid && Date.now() - createdMs < 5 * 60 * 1000; // its doc may still be on the way
  // Named exceptions come from Remote Config ("free_text_emails"), read again once the start-up fetch has finished.
  const freeTextEmails = React.useMemo(() => [...FREE_TEXT_EMAILS, ...remoteList("free_text_emails")], [isMessageLoading]); // eslint-disable-line react-hooks/exhaustive-deps
  const freeText = canWriteFreeText({ email: user?.email, doc: userDoc, isTester: isTesterUser(user), allowEmails: freeTextEmails });
  const showFirstRun =
    !!uid && grownUp !== null && (needsFirstRun(userDoc, { grownUp }) || (userDoc === null && brandNew));

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
    isMessageLoading ||
    checkingForUpdate
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
     <FreeTextContext.Provider value={freeText}>
      <ThemedStatusBar />
      <View style={styles.container}>
        {showFirstRun ? (
          <FirstRunScreen uid={uid} userDoc={userDoc} onDone={({ grownUp: g }) => g && setGrownUp(true)} />
        ) : user || isGuest ? (
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
            externalNotice={authNotice}
            isAuthLoading={authBusy}
            onGuestLogin={onGuestLogin}
            onGoogleLogin={googleLoginHandler}
            onEmailSignIn={emailSignInHandler}
            onEmailSignUp={emailSignUpHandler}
            onPasswordReset={passwordResetHandler}
          />
        )}
      </View>
      {/* A child's play time is over (Play as → How long?, mockup N1): pause until the parent's PIN */}
      {user ? <TimeUpOverlay uid={user.uid} /> : null}
      {/* The app's own popups (showAlert in services/dialog.js), mockup T5 */}
      <AppDialogHost />
     </FreeTextContext.Provider>
    </PaperProvider>
  );
};

export default AppContent;

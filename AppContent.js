import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
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
import useJoinLink from "./hooks/useJoinLink";
import UpdateReadyBanner from "./components/common/UpdateReadyBanner";
import ErrorBoundary from "./components/common/ErrorBoundary";
import TimeUpOverlay from "./components/common/TimeUpOverlay";
import { AppDialogHost } from "./components/common/AppDialog";
import GuideStrip from "./components/guides/GuideStrip";
import { listenForSummaryTaps } from "./services/push";
import AlertBanner from "./components/common/AlertBanner";
import { navigateTo } from "./navigation/navRef";

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

// Where an alert opens (phone notification tap or the in-app banner). "decisions" = the owner's Decisions inbox;
// "home" / missing = Home (Needs you); anything else = that Progress view ("family", "classes", "schools").
function openAlertView(view) {
  if (view === "decisions") return navigateTo("Profile", { screen: "Decisions" });
  if (!view || view === "home") return navigateTo("Apprec8");
  return navigateTo("Stats", { screen: "ProgressScreen", params: { view } });
}

const AppContent = () => {
  const { theme, isDark, isThemeLoaded } = useTheme();
  const [minimumLoaderTimeElapsed, setMinimumLoaderTimeElapsed] =
    useState(false);

  // Over-the-air update: load it behind the loading screen, so one restart is enough.
  const { checkingForUpdate, downloadingUpdate, updateReady, reloadNow } = useStartupUpdate();

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
  // A tapped class link (WhatsApp) opens the join screen once the main screens show (sign-up without codes, 2026-11-11).
  const mainShowing =
    !!user && !showFirstRun && grownUp !== null && userDoc !== undefined && fontsLoaded && !authLoading && isThemeLoaded &&
    minimumLoaderTimeElapsed && !isMessageLoading && !checkingForUpdate && !messageToShow;
  useJoinLink(mainShowing);

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

  // Weekly summary notifications (20.0.30+): a tap opens Progress on the right view. No-op on older builds.
  // "decisions" = the owner's Decisions inbox (scripts/admin/decisions.mjs).
  useEffect(() => listenForSummaryTaps((view) => setTimeout(() => openAlertView(view), 300)), []);

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
        {downloadingUpdate ? (
          <Text style={{ marginTop: 18, fontSize: 15, fontFamily: fontsLoaded ? "nunitoBold" : undefined, color: isDark ? "#E9DDEB" : "#3b0940", textAlign: "center" }}>
            Getting the latest Apprec8…
          </Text>
        ) : null}
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
      <ErrorBoundary where="app">
      <ThemedStatusBar />
      <View style={styles.container}>
        {showFirstRun ? (
          <FirstRunScreen uid={uid} userDoc={userDoc} onDone={({ grownUp: g }) => g && setGrownUp(true)} onSignOut={signoutHandler} />
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
      <GuideStrip />
      {updateReady ? <UpdateReadyBanner onPress={reloadNow} /> : null}
      <AppDialogHost />
      <AlertBanner onOpen={openAlertView} />
      </ErrorBoundary>
     </FreeTextContext.Provider>
    </PaperProvider>
  );
};

export default AppContent;

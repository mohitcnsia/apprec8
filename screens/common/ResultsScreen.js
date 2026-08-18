/**
 * @file ResultsScreen.js
 * @description A generic, app-wide screen to display the results of any activity.
 * It uses a hybrid approach: it can automatically determine which result asset
 * to show based on score, but also allows for a manual asset override.
 * (This version is simplified and removes all FeedbackFAB functionality).
 */
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Button as PaperButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";

import { useTheme } from "../../context/ThemeContext";
import { authInstance } from "../../config/firebaseConfig";
import functions from "@react-native-firebase/functions";

// --- Constants ---
const screenWidth = Dimensions.get("window").width;
const assetDiameter = screenWidth * 0.7; // <-- Controls asset size

// --- Helper function to determine which asset to show ---
const getResultAsset = (params) => {
  // 1. Manual Override: If an asset is explicitly passed, use it.
  if (params.asset) {
    return params.asset;
  }

  // 2. Automatic Logic: If score data is available, determine the asset.
  if (
    typeof params.finalScore === "number" &&
    typeof params.maxPossibleScore === "number"
  ) {
    const { finalScore, maxPossibleScore } = params;
    if (maxPossibleScore > 0 && finalScore === maxPossibleScore) {
      return {
        type: "image",
        source: require("../../assets/images/success.png"),
      };
      // return {
      //   type: "lottie",
      //   source: require("../../assets/animations/celebration.json"),
      //   loop: false,
      // };
    }
    if (finalScore === 0) {
      return {
        type: "image",
        source: require("../../assets/images/success.png"),
      };
      // return {
      //   type: "lottie",
      //   source: require("../../assets/animations/encouragement.json"),
      //   loop: true,
      // };
    }
  }

  // 3. Fallback: If no override or score data, use the default success image.
  return { type: "image", source: require("../../assets/images/success.png") };
};

const ResultsScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const C = theme.appColors || theme;

  // --- Destructure all props from the generic "Data Contract" ---
  const {
    title = "Activity Complete!",
    message = "Well done, {username}!",
    metrics = [],
    actions = [
      {
        label: "Done",
        onPress: () => navigation.popToTop(),
        mode: "contained",
      },
    ],
    effects = {},
    submissionContext = null,
    missedQuestions = [],
  } = route.params || {};

  const asset = getResultAsset(route.params);

  // --- State Management ---
  const [username, setUsername] = useState("User");
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [submitError, setSubmitError] = useState(null);
  const [isConfettiVisible, setConfettiVisible] = useState(false);
  // All state related to FeedbackFAB has been removed

  // --- Side Effects ---
  useEffect(() => {
    const currentUser = authInstance.currentUser;
    if (currentUser?.displayName) setUsername(currentUser.displayName);
    else if (currentUser?.email) setUsername(currentUser.email.split("@")[0]);
    if (effects.confetti) setConfettiVisible(true);
  }, [effects]);

  // --- Backend Submission Logic ---
  const submitResult = useCallback(async () => {
    if (!submissionContext?.cloudFunctionName || !submissionContext?.payload) {
      setSubmitStatus("skipped");
      return;
    }
    setSubmitStatus("submitting");
    setSubmitError(null);
    try {
      const cloudFunction = functions().httpsCallable(
        submissionContext.cloudFunctionName
      );
      const result = await cloudFunction(submissionContext.payload);
      if (result?.data?.status === "success") {
        setSubmitStatus("success");
      } else {
        setSubmitError(
          result?.data?.message || "An unexpected server response."
        );
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitError(error.message || "Failed to save results.");
      setSubmitStatus("error");
    }
  }, [submissionContext]);

  useEffect(() => {
    if (submitStatus === "idle") {
      submitResult();
    }
  }, [submitResult, submitStatus]);

  // --- STYLES ---
  const styles = useMemo(
    () =>
      StyleSheet.create({
        rootContainer: { flex: 1 },
        gradientContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        scrollContent: {
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        },
        header: {
          fontSize: 32,
          fontFamily: "pacifico",
          color: C.textPrimaryOnGradient || "#FFFFFF",
          marginBottom: 20,
          textAlign: "center",
        },
        assetContainer: {
          height: assetDiameter,
          width: assetDiameter,
          borderRadius: assetDiameter / 2,
          borderWidth: 3,
          borderColor: C.textPrimaryOnGradient || "#FFFFFF",
          marginBottom: 20,
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          backgroundColor: "rgba(255,255,255,0.1)",
        },
        image: { height: "100%", width: "100%" },
        lottie: { height: "100%", width: "100%" },
        messageText: {
          fontSize: 18,
          textAlign: "center",
          color: C.textPrimaryOnGradient || "#FFFFFF",
          fontFamily: "delius",
          marginBottom: 5,
        },
        highlight: {
          fontFamily: "deliusBold",
          color: C.accent || "#f12b15",
          fontSize: 20,
        },
        metricsContainer: { marginVertical: 15, alignItems: "center" },
        metricText: {
          fontSize: 16,
          color: C.textSecondaryOnGradient || "#E0E0E0",
          fontFamily: "delius",
          textAlign: "center",
        },
        metricValue: {
          fontFamily: "deliusBold",
          color: C.textPrimaryOnGradient || "#FFFFFF",
        },
        statusContainer: {
          minHeight: 30,
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 10,
        },
        errorText: {
          color: C.warning || "#FF6B6B",
          textAlign: "center",
          fontFamily: "delius",
          fontSize: 14,
        },
        successText: {
          color: C.success || "#4CAF50",
          textAlign: "center",
          fontFamily: "deliusBold",
          fontSize: 14,
        },
        infoText: {
          color: C.textSecondaryOnGradient || "#E0E0E0",
          textAlign: "center",
          fontFamily: "delius",
          fontSize: 14,
        },
        buttonContainer: { width: "80%", alignItems: "center", marginTop: 15 },
        button: { marginTop: 15, width: "100%", paddingVertical: 4 },
        buttonLabel: { fontFamily: "deliusBold", fontSize: 16 },
        confettiOverlay: {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 10,
          pointerEvents: "none",
        },
        practiceContainer: {
          width: "90%",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          borderRadius: 15,
          padding: 15,
          marginVertical: 15,
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.3)",
        },
        practiceHeader: {
          fontFamily: "deliusBold",
          fontSize: 18,
          color: C.textPrimaryOnGradient || "#FFFFFF",
          marginBottom: 10,
          textAlign: "center",
        },
        practiceItem: {
          fontFamily: "delius",
          fontSize: 15,
          color: C.textSecondaryOnGradient || "#E0E0E0",
          marginBottom: 8,
          paddingLeft: 10,
        },
      }),
    [C]
  );

  return (
    <View style={styles.rootContainer}>
      <LinearGradient
        colors={[C.gradientStart || "#3b0940", C.gradientEnd || "#d7d1d3"]}
        style={styles.gradientContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.header}>{title}</Text>
          <View style={styles.assetContainer}>
            {asset.type === "image" && (
              <Image
                source={asset.source}
                style={styles.image}
                resizeMode="cover"
              />
            )}
            {asset.type === "lottie" && (
              <LottieView
                source={asset.source}
                autoPlay
                loop={asset.loop ?? false}
                style={styles.lottie}
              />
            )}
          </View>
          <Text style={styles.messageText}>
            {message.replace("{username}", username)}
          </Text>
          <View style={styles.metricsContainer}>
            {metrics.map((metric, index) => (
              <Text key={index} style={styles.metricText}>
                {metric.label}:{" "}
                <Text style={styles.metricValue}>{metric.value}</Text>
              </Text>
            ))}
          </View>
          
          {missedQuestions && missedQuestions.length > 0 && (
            <View style={styles.practiceContainer}>
              <Text style={styles.practiceHeader}>Needs Practice 📚</Text>
              {missedQuestions.map((qText, idx) => (
                <Text key={idx} style={styles.practiceItem}>• {qText}</Text>
              ))}
            </View>
          )}

          <View style={styles.statusContainer}>
            {submitStatus === "submitting" && (
              <ActivityIndicator
                size="small"
                color={C.textPrimaryOnGradient || "#FFFFFF"}
              />
            )}
            {submitStatus === "error" && (
              <Text style={styles.errorText}>{submitError}</Text>
            )}
            {submitStatus === "success" && (
              <Text style={styles.successText}>Progress saved!</Text>
            )}
            {submitStatus === "skipped" && (
              <Text style={styles.infoText}>Result not submitted.</Text>
            )}
          </View>
          <View style={styles.buttonContainer}>
            {actions.map((action, index) => (
              <PaperButton
                key={index}
                mode={action.mode}
                style={styles.button}
                labelStyle={styles.buttonLabel}
                onPress={action.onPress}
                disabled={submitStatus === "submitting"}
                buttonColor={
                  action.mode === "contained"
                    ? C.success || "#4CAF50"
                    : undefined
                }
                textColor={
                  action.mode === "contained"
                    ? C.buttonText || "#FFFFFF"
                    : C.textPrimaryOnGradient || "#FFFFFF"
                }
              >
                {action.label}
              </PaperButton>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>

      {/* The Feedback FAB and its trigger zone have been completely removed from the JSX */}
      {isConfettiVisible && (
        <LottieView
          source={require("../../assets/animations/confetti.json")}
          autoPlay
          loop={false}
          style={styles.confettiOverlay}
          onAnimationFinish={() => setConfettiVisible(false)}
        />
      )}
    </View>
  );
};

export default ResultsScreen;

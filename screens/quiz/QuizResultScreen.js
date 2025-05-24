// screens/quiz/QuizResultScreen.js
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
  TouchableWithoutFeedback, // For triple-tap
} from "react-native";
import { Button as PaperButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

// ** IMPORTANT: Adjust these import paths if they are incorrect for your project structure **
import { useTheme } from "../../context/ThemeContext";
import { authInstance } from "../../config/firebaseConfig";
import functions from "@react-native-firebase/functions";
import FeedbackFAB from "../../components/common/FeedbackFAB"; // Assumes FeedbackFAB is in components/common/

const screenWidth = Dimensions.get("window").width;
const imageDiameter = screenWidth * 0.7;
const DEFAULT_PASSING_SCORE = 1;

const recordQuizResult = functions().httpsCallable("recordQuizResult");
const TRIPLE_TAP_DELAY = 300; // Milliseconds for triple-tap detection

const QuizResultScreen = ({ route, navigation }) => {
  const { theme } = useTheme();

  // --- Original State ---
  const [username, setUsername] = useState("User");
  const {
    score = 0,
    totalQuestions = 0,
    quizId = null,
    parentTopicId = null,
    passingScore = DEFAULT_PASSING_SCORE,
  } = route.params || {};
  const maxScore = route.params?.maxScore ?? totalQuestions;
  const [submitError, setSubmitError] = useState(null);
  const [submitStatus, setSubmitStatus] = useState("idle");

  // --- State and Refs for FAB Visibility (Triple Tap) ---
  const [isFabVisibleByGesture, setIsFabVisibleByGesture] = useState(false); // FAB starts hidden
  const tapCountRef = useRef(0);
  const lastTapTimestampRef = useRef(0);
  const tapTimerRef = useRef(null); // Timer to reset tap count for triple-tap sequence

  // --- Original useEffects ---
  useEffect(() => {
    const currentUser = authInstance.currentUser;
    if (currentUser?.displayName) setUsername(currentUser.displayName);
    else if (currentUser?.email) setUsername(currentUser.email.split("@")[0]);
    else setUsername("User");

    // When screen mounts or params change, ensure FAB is hidden by default
    // and tap sequence is reset.
    console.log(
      "[QuizResultScreen] Effect for route.params. Resetting FAB visibility."
    );
    setIsFabVisibleByGesture(false);
    tapCountRef.current = 0;
    clearTimeout(tapTimerRef.current);

    // Cleanup tap timer on unmount or if params change causing re-evaluation
    return () => {
      clearTimeout(tapTimerRef.current);
    };
  }, [route.params]); // Reset FAB visibility logic when the screen is effectively "new"

  const submitQuizResult = useCallback(async () => {
    const currentUser = authInstance.currentUser;
    if (!currentUser) {
      setSubmitStatus("skipped");
      return;
    }
    if (!quizId) {
      setSubmitError("Cannot save result: Quiz ID missing.");
      setSubmitStatus("error");
      return;
    }
    if (score < passingScore) {
      setSubmitStatus("skipped");
      return;
    }
    if (submitStatus !== "idle") return;

    setSubmitStatus("submitting");
    setSubmitError(null);

    try {
      const resultData = {
        quizId,
        scoreAchieved: score,
        passingScore,
        maxScore,
      };
      const result = await recordQuizResult(resultData);
      if (result?.data?.status === "success") setSubmitStatus("success");
      else if (result?.data?.status === "not_passed")
        setSubmitStatus("skipped");
      else {
        setSubmitError("An unexpected server response.");
        setSubmitStatus("error");
      }
    } catch (error) {
      const message =
        error.details?.message ||
        error.message ||
        "Failed to save quiz results.";
      setSubmitError(message);
      setSubmitStatus("error");
    }
  }, [quizId, score, passingScore, maxScore, submitStatus]);

  useEffect(() => {
    // console.log(
    //   "QuizResultScreen mounted. Params:",
    //   JSON.stringify(route.params, null, 2)
    // );
    if (submitStatus === "idle") {
      submitQuizResult();
    }
  }, [route.params, submitQuizResult, submitStatus]);

  const handlePlayAgain = () => {
    if (quizId) {
      navigation.replace("Quiz", {
        quizContentId: quizId,
        parentTopicId,
        passingScore,
      });
    } else {
      navigation.popToTop();
    }
  };

  // Triple-tap handler to toggle FAB visibility
  const handleScreenPressForFabToggle = () => {
    const now = Date.now();
    clearTimeout(tapTimerRef.current);

    // If current tap is too slow after a sequence started, reset count
    if (
      tapCountRef.current > 0 &&
      now - lastTapTimestampRef.current > TRIPLE_TAP_DELAY
    ) {
      // console.log('[QuizResultScreen] Tap sequence broken (too slow since last tap), resetting count.');
      tapCountRef.current = 0;
    }

    tapCountRef.current += 1;
    lastTapTimestampRef.current = now;
    // console.log(`[QuizResultScreen] Tap recorded. Count: ${tapCountRef.current}`);

    if (tapCountRef.current === 3) {
      console.log(
        "[QuizResultScreen] Triple-tap detected! Toggling FAB visibility."
      );
      setIsFabVisibleByGesture((prev) => !prev);
      tapCountRef.current = 0; // Reset count after successful triple-tap action
    } else if (tapCountRef.current > 0) {
      // Set a timer: if no more taps come soon enough to complete a triple, reset the count.
      tapTimerRef.current = setTimeout(() => {
        // console.log('[QuizResultScreen] Tap sequence incomplete within time, resetting tap count.');
        tapCountRef.current = 0;
      }, TRIPLE_TAP_DELAY * 2);
    }
  };

  const scoreText =
    totalQuestions > 0 ? `${score} / ${totalQuestions}` : `${score}`;

  // Styles (Copied from your previously provided QuizResultScreen.js)
  const styles = useMemo(
    () =>
      StyleSheet.create({
        // The LinearGradient is the root, TouchableWithoutFeedback wraps it.
        // So styles.container is applied to LinearGradient
        container: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        },
        header: {
          fontSize: 30,
          fontFamily: "pacifico",
          color: theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF",
          marginBottom: 20,
          textAlign: "center",
        },
        text: {
          fontSize: 18,
          marginBottom: 5,
          textAlign: "center",
          color: theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF",
          fontFamily: "delius",
        },
        highlight: {
          fontFamily: "deliusBold",
          color: theme.accent || theme.appAccent || "#f12b15",
          fontSize: 20,
        },
        imageContainer: {
          height: imageDiameter,
          width: imageDiameter,
          borderRadius: imageDiameter / 2,
          resizeMode: "cover",
          marginBottom: 20,
          borderWidth: 2,
          borderColor:
            theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF",
        },
        statusContainer: {
          minHeight: 30,
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 10,
        },
        errorText: {
          color: theme.warning || theme.appWarning || "#FF6B6B",
          textAlign: "center",
          fontFamily: "delius",
          fontSize: 14,
        },
        successText: {
          color: theme.success || theme.appSuccess || "#4CAF50",
          textAlign: "center",
          fontFamily: "deliusBold",
          fontSize: 14,
        },
        infoText: {
          color:
            theme.textSecondaryOnGradient || theme.textSecondary || "#E0E0E0",
          textAlign: "center",
          fontFamily: "delius",
          fontSize: 14,
        },
        buttonContainer: {
          width: "80%",
          alignItems: "center",
          marginTop: 15,
        },
        button: {
          marginTop: 15,
          paddingVertical: 5,
          width: "100%",
        },
        outlineButton: {}, // Kept if you have specific styles for it elsewhere
      }),
    [theme]
  );

  // Prepare contentContext for FeedbackFAB
  const feedbackContext = quizId
    ? {
        type: "quiz_overall",
        id: quizId,
        parentId: parentTopicId || null,
        titlePreview: `Quiz ${quizId} Results`,
      }
    : null;

  // Determine final FAB visibility
  const fabShouldActuallyBeVisible = isFabVisibleByGesture && !!feedbackContext;

  return (
    <TouchableWithoutFeedback
      onPress={handleScreenPressForFabToggle}
      accessible={false}
    >
      <LinearGradient
        colors={[
          theme.gradientStart || "#3b0940",
          theme.gradientEnd || "#d7d1d3",
        ]}
        style={styles.container} // This style gives flex: 1 to LinearGradient
      >
        <Text style={styles.header}>Quiz Over!</Text>
        <Image
          style={styles.imageContainer}
          source={require("../../assets/images/success.png")} // Ensure path is correct
        />
        <Text style={styles.text}>Well done, {username}!</Text>
        <Text style={styles.text}>
          You scored <Text style={styles.highlight}>{scoreText}</Text>.
        </Text>

        <View style={styles.statusContainer}>
          {submitStatus === "submitting" && (
            <ActivityIndicator
              size="small"
              color={
                theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF"
              }
            />
          )}
          {submitStatus === "error" && (
            <Text style={styles.errorText}>
              {submitError || "Error saving results."}
            </Text>
          )}
          {submitStatus === "success" && (
            <Text style={styles.successText}>Progress saved!</Text>
          )}
          {submitStatus === "skipped" && (
            <Text style={styles.infoText}>
              Result not saved (e.g., score too low).
            </Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <PaperButton
            mode="contained"
            style={styles.button}
            labelStyle={{ fontFamily: "deliusBold", fontSize: 16 }}
            onPress={handlePlayAgain}
            disabled={submitStatus === "submitting"}
            buttonColor={theme.success || theme.appSuccess}
            textColor={theme.buttonText || theme.primaryWhite}
          >
            Play Again
          </PaperButton>
          <PaperButton
            mode="outlined"
            style={[styles.button, styles.outlineButton]}
            labelStyle={{ fontFamily: "deliusBold", fontSize: 16 }}
            onPress={() => navigation.popToTop()}
            disabled={submitStatus === "submitting"}
            textColor={theme.textPrimaryOnGradient || theme.primaryWhite}
          >
            Exit
          </PaperButton>
        </View>

        {/* FeedbackFAB: Mount if context is valid, visibility controlled by gesture */}
        {feedbackContext && ( // Only mount if context is valid to provide to FAB
          <FeedbackFAB
            contentContext={feedbackContext}
            visible={fabShouldActuallyBeVisible} // Actual visibility toggle
          />
        )}
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default QuizResultScreen;

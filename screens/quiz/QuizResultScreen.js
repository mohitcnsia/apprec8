// screens/quiz/QuizResultScreen.js

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  // Alert removed
} from "react-native";
import { Button as PaperButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../config/colors";
import { authInstance } from "../../config/firebaseConfig";
import functions from "@react-native-firebase/functions";

// --- Get screen width ---
const screenWidth = Dimensions.get("window").width;
const imageDiameter = screenWidth * 0.7;

// Default passing score if not provided by navigation
const DEFAULT_PASSING_SCORE = 1;

// --- Define callable function reference outside component ---
// Ensure 'recordQuizResult' matches the deployed function name
// Specify region if your function isn't in us-central1 and you haven't set a global default
// const functionsInstance = functions().app.functions('your-region');
// const recordQuizResult = functionsInstance.httpsCallable('recordQuizResult');
const recordQuizResult = functions().httpsCallable("recordQuizResult");

const QuizResultScreen = ({ route, navigation }) => {
  const [username, setUsername] = useState("User");

  // --- Get Params (with defaults) ---
  const {
    score = 0,
    totalQuestions = 0,
    topicId = null,
    passingScore = DEFAULT_PASSING_SCORE,
  } = route.params || {};
  const maxScore = route.params?.maxScore ?? totalQuestions;

  // --- State for Cloud Function Call ---
  // Removed isSubmittingResult, using submitStatus only
  const [submitError, setSubmitError] = useState(null);
  const [submitStatus, setSubmitStatus] = useState("idle"); // 'idle', 'submitting', 'success', 'error', 'skipped'

  // --- Get Username ---
  useEffect(() => {
    const currentUser = authInstance.currentUser;
    if (currentUser?.displayName) {
      setUsername(currentUser.displayName);
    } else if (currentUser?.email) {
      setUsername(currentUser.email.split("@")[0]);
    } else {
      console.warn("QuizResultScreen: Could not determine username.");
      setUsername("User");
    }
  }, []);

  // --- Submit Result to Cloud Function ---
  const submitQuizResult = useCallback(async () => {
    const currentUser = authInstance.currentUser;

    // Conditions to skip submission (unchanged)
    if (!currentUser) {
      console.log("QuizResultScreen: Skip submission (unauthenticated).");
      setSubmitStatus("skipped");
      return;
    }
    if (!topicId) {
      console.log("QuizResultScreen: Skip submission (no topicId).");
      setSubmitStatus("skipped");
      return;
    }
    if (score < passingScore) {
      console.log(
        `QuizResultScreen: Skip submission (score ${score} < passingScore ${passingScore}).`
      );
      setSubmitStatus("skipped");
      return;
    }
    if (submitStatus !== "idle") {
      console.log(
        `QuizResultScreen: Skip submission (already processed: ${submitStatus}).`
      );
      return;
    }

    // Set status to submitting
    setSubmitStatus("submitting");
    setSubmitError(null);
    console.log(
      `QuizResultScreen: Submitting result for topicId: ${topicId}, score: ${score}`
    );

    try {
      const resultData = {
        quizId: topicId,
        scoreAchieved: score,
        passingScore: passingScore,
        maxScore: maxScore,
      };
      console.log("Calling 'recordQuizResult' with data:", resultData);
      const result = await recordQuizResult(resultData); // Use reference defined outside
      console.log("Cloud Function 'recordQuizResult' returned:", result.data);

      if (result?.data?.status === "success") {
        console.log("Quiz result successfully recorded.");
        setSubmitStatus("success");
      } else if (result?.data?.status === "not_passed") {
        console.warn(
          "QuizResultScreen: Cloud function reported 'not_passed' unexpectedly."
        );
        setSubmitStatus("skipped"); // Treat as skipped if backend says not passed
      } else {
        console.error(
          "Cloud Function 'recordQuizResult' returned unexpected status:",
          result.data
        );
        setSubmitError("An unexpected server response was received.");
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error(
        "Cloud Function 'recordQuizResult' call failed:",
        JSON.stringify(error)
      );
      const message =
        error.details?.message ||
        error.message ||
        "Failed to save quiz results. Please check connection."; // Try to get more specific error
      setSubmitError(message);
      setSubmitStatus("error");
      // Alert removed - rely on text feedback instead
      // Alert.alert("Error Saving Progress", message);
    }
    // No finally needed as we don't have the separate boolean state anymore
  }, [topicId, score, passingScore, maxScore, submitStatus]); // Dependencies remain the same

  // Effect to trigger submission on mount (unchanged)
  useEffect(() => {
    console.log("QuizResultScreen mounted. Params:", route.params);
    if (submitStatus === "idle") {
      submitQuizResult();
    }
  }, [submitQuizResult, submitStatus]);

  // Navigation Handler (unchanged)
  const handlePlayAgain = () => {
    if (topicId) {
      console.log(`Playing again for topicId: ${topicId}`);
      navigation.replace("Quiz", {
        topicId: topicId,
        passingScore: passingScore,
      });
    } else {
      console.error("Cannot play again: topicId is missing.");
      navigation.popToTop();
    }
  };

  // Score Text (unchanged)
  const scoreText =
    totalQuestions > 0 ? `${score} / ${totalQuestions}` : `${score}`;

  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      {/* Header, Image, Score Text (Unchanged) */}
      <Text style={styles.header}>Quiz Over!</Text>
      <Image
        style={styles.imageContainer}
        source={require("../../assets/images/success.png")}
      />
      <Text style={styles.text}>Well done, {username}!</Text>
      <Text style={styles.text}>
        You scored <Text style={styles.highlight}>{scoreText}</Text>.
      </Text>

      {/* UI Feedback based on submitStatus */}
      {submitStatus === "submitting" && (
        <ActivityIndicator
          size="small"
          color={Colors.primaryWhite}
          style={styles.activityIndicator}
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
      {/* Could add text for 'skipped' or 'not_passed' if needed */}

      {/* Buttons - disable based on submitStatus */}
      <PaperButton
        mode="contained"
        style={styles.button}
        labelStyle={styles.buttonText}
        onPress={handlePlayAgain}
        disabled={submitStatus === "submitting"} // Check status directly
      >
        Play Again
      </PaperButton>
      <PaperButton
        mode="outlined"
        style={styles.button}
        labelStyle={[styles.buttonText, { color: Colors.primaryWhite }]}
        onPress={() => navigation.popToTop()}
        disabled={submitStatus === "submitting"} // Check status directly
      >
        Back to Home / Topics
      </PaperButton>
    </LinearGradient>
  );
};

// Styles (Unchanged)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 30,
    fontFamily: "pacifico",
    color: Colors.primaryWhite,
    marginBottom: 20,
    textAlign: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
    textAlign: "center",
    color: Colors.primaryWhite,
    fontFamily: "delius",
  },
  subText: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
    color: Colors.primaryLightGray,
    fontFamily: "delius",
  },
  highlight: {
    fontFamily: "deliusBold",
    color: Colors.primaryOrange,
    fontSize: 20,
  },
  imageContainer: {
    height: imageDiameter,
    width: imageDiameter,
    borderRadius: imageDiameter / 2,
    resizeMode: "cover",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.primaryWhite,
  },
  activityIndicator: { marginVertical: 10 },
  errorText: {
    color: Colors.warningRed || "#FF6B6B",
    marginVertical: 10,
    textAlign: "center",
    fontFamily: "delius",
    fontSize: 14,
  },
  successText: {
    color: Colors.successGreen || "#4CAF50",
    marginVertical: 10,
    textAlign: "center",
    fontFamily: "deliusBold",
    fontSize: 14,
  },
  button: { marginTop: 15, paddingVertical: 5, width: "70%" },
  buttonText: { fontSize: 16, fontFamily: "deliusBold" },
});

export default QuizResultScreen;

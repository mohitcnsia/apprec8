// screens/quiz/QuizResultScreen.js

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Button as PaperButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../config/colors";
import { authInstance } from "../../config/firebaseConfig"; // Use your config
import functions from "@react-native-firebase/functions"; // Import functions

// --- Get screen width ---
const screenWidth = Dimensions.get("window").width;
const imageDiameter = screenWidth * 0.7;

// Default passing score if not provided by navigation
const DEFAULT_PASSING_SCORE = 1; // Set a sensible default, e.g., 1 for >= 1 correct answer

const QuizResultScreen = ({ route, navigation }) => {
  const [username, setUsername] = useState("User");

  // --- Get Params ---
  // Ensure all expected params are destructured, provide defaults
  const {
    score = 0, // Default score to 0
    totalQuestions = 0, // Default total to 0
    topicId = null, // Default topicId to null
    passingScore = DEFAULT_PASSING_SCORE, // Use default if not passed
  } = route.params || {}; // Add fallback for route.params itself

  // Use totalQuestions as maxScore unless a specific maxScore is passed
  const maxScore = route.params?.maxScore ?? totalQuestions;

  // --- State for Cloud Function Call ---
  const [isSubmittingResult, setIsSubmittingResult] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitStatus, setSubmitStatus] = useState("idle"); // 'idle', 'submitting', 'success', 'error', 'skipped'

  // --- Get Username (from Auth state, fallback to email) ---
  useEffect(() => {
    const currentUser = authInstance.currentUser;
    if (currentUser?.displayName) {
      setUsername(currentUser.displayName);
    } else if (currentUser?.email) {
      const nameFromEmail = currentUser.email.split("@")[0];
      setUsername(nameFromEmail);
    } else {
      console.warn(
        "QuizResultScreen: Could not determine username (no displayName or email)."
      );
      setUsername("User");
    }
  }, []); // Runs once on mount

  // --- Submit Result to Cloud Function ---
  const submitQuizResult = useCallback(async () => {
    const currentUser = authInstance.currentUser; // Ensure user is still logged in

    // Conditions to skip submission
    if (!currentUser) {
      console.log(
        "QuizResultScreen: Skipping result submission (user not authenticated)."
      );
      setSubmitStatus("skipped");
      return;
    }
    if (!topicId) {
      console.log(
        "QuizResultScreen: Skipping result submission (topicId missing)."
      );
      setSubmitStatus("skipped");
      return;
    }
    if (score < passingScore) {
      console.log(
        `QuizResultScreen: Skipping result submission (score ${score} < passingScore ${passingScore}).`
      );
      setSubmitStatus("skipped");
      return;
    }
    if (submitStatus !== "idle") {
      console.log(
        `QuizResultScreen: Skipping result submission (already processed: ${submitStatus}).`
      );
      return; // Avoid multiple submissions
    }

    setIsSubmittingResult(true); // Legacy state for button disable
    setSubmitStatus("submitting");
    setSubmitError(null);
    console.log(
      `QuizResultScreen: Submitting result for topicId: ${topicId}, score: ${score}`
    );

    try {
      // Ensure region matches your function deployment if not us-central1
      // const functionsInstance = functions().app.functions('asia-south1');
      // const recordQuizResult = functionsInstance.httpsCallable('recordQuizResult');
      const recordQuizResult = functions().httpsCallable("recordQuizResult"); // Use default region or adjust

      const resultData = {
        quizId: topicId,
        scoreAchieved: score,
        passingScore: passingScore,
        maxScore: maxScore,
      };

      console.log("Calling 'recordQuizResult' with data:", resultData);
      const result = await recordQuizResult(resultData);
      console.log("Cloud Function 'recordQuizResult' returned:", result.data);

      // Check the status returned by the function
      if (result?.data?.status === "success") {
        console.log("Quiz result successfully recorded.");
        setSubmitStatus("success");
        // Optional: Show feedback based on stars/streak from result.data
        // Alert.alert("Progress Saved!", `You earned ${result.data.starsAwarded} stars! Current streak: ${result.data.currentStreak}`);
      } else if (result?.data?.status === "not_passed") {
        // This case should have been caught earlier, but handle defensively
        console.warn(
          "QuizResultScreen: Cloud function reported 'not_passed' unexpectedly."
        );
        setSubmitStatus("skipped");
      } else {
        // Handle unexpected response structure or status
        console.error(
          "Cloud Function 'recordQuizResult' returned unexpected status:",
          result.data
        );
        setSubmitError("An unexpected response was received from the server.");
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error(
        "Cloud Function 'recordQuizResult' call failed:",
        JSON.stringify(error)
      );
      // Provide more context if available
      const message =
        error.message ||
        "Failed to save quiz results. Please check your connection.";
      setSubmitError(message);
      setSubmitStatus("error");
      Alert.alert("Error Saving Progress", message);
    } finally {
      setIsSubmittingResult(false); // Legacy state
    }
  }, [topicId, score, passingScore, maxScore, submitStatus]); // Dependencies

  // Effect to trigger submission on mount
  useEffect(() => {
    console.log("QuizResultScreen mounted. Params:", route.params);
    // Only attempt submission if status is idle (initial state)
    if (submitStatus === "idle") {
      submitQuizResult();
    }
  }, [submitQuizResult, submitStatus]); // Re-run if submitQuizResult changes (rare) or status changes

  const handlePlayAgain = () => {
    if (topicId) {
      console.log(`Playing again for topicId: ${topicId}`);
      // Make sure to pass necessary params if Quiz screen needs them
      navigation.replace("Quiz", {
        topicId: topicId,
        passingScore: passingScore /* pass other needed params */,
      });
    } else {
      console.error("Cannot play again: topicId is missing.");
      navigation.popToTop(); // Go back home if essential data is missing
    }
  };

  // Display score even if totalQuestions is 0 to avoid NaN
  const scoreText =
    totalQuestions > 0 ? `${score} / ${totalQuestions}` : `${score}`;

  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      <Text style={styles.header}>Quiz Over!</Text>
      <Image
        style={styles.imageContainer}
        source={require("../../assets/images/success.png")} // Verify path
      />
      <Text style={styles.text}>Well done, {username}!</Text>
      <Text style={styles.text}>
        You scored <Text style={styles.highlight}>{scoreText}</Text>.
        {/* Optionally show passing score */}
        {/* <Text style={styles.subText}>(Passing Score: {passingScore})</Text> */}
      </Text>

      {/* Show loading/error status */}
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

      <PaperButton
        mode="contained"
        style={styles.button}
        labelStyle={styles.buttonText}
        onPress={handlePlayAgain}
        disabled={submitStatus === "submitting"} // Disable while submitting
      >
        Play Again
      </PaperButton>
      <PaperButton
        mode="outlined"
        style={styles.button}
        labelStyle={[styles.buttonText, { color: Colors.primaryWhite }]}
        onPress={() => navigation.popToTop()}
        disabled={submitStatus === "submitting"}
      >
        Back to Home / Topics
      </PaperButton>
    </LinearGradient>
  );
};

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
    marginBottom: 5, // Reduced margin
    textAlign: "center",
    color: Colors.primaryWhite,
    fontFamily: "delius",
  },
  subText: {
    // Style for optional text like passing score
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
  activityIndicator: {
    marginVertical: 10, // Added vertical margin
  },
  errorText: {
    color: Colors.warningRed || "#FF6B6B", // Use your warning color
    marginVertical: 10, // Added vertical margin
    textAlign: "center",
    fontFamily: "delius",
    fontSize: 14,
  },
  successText: {
    color: Colors.successGreen || "#4CAF50", // Use a success color
    marginVertical: 10, // Added vertical margin
    textAlign: "center",
    fontFamily: "deliusBold",
    fontSize: 14,
  },
  button: {
    marginTop: 15,
    paddingVertical: 5,
    width: "70%",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "deliusBold",
  },
});

export default QuizResultScreen;

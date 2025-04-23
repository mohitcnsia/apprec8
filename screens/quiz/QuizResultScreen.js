// screens/quiz/QuizResultScreen.js (Corrected for quizId Parameter)

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  Button, // Import Button if using it in error/no-data states
} from "react-native";
import { Button as PaperButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../config/colors"; // Adjust path
import { authInstance } from "../../config/firebaseConfig"; // Adjust path
import functions from "@react-native-firebase/functions";

// --- Get screen width ---
const screenWidth = Dimensions.get("window").width;
const imageDiameter = screenWidth * 0.7;

// Default passing score if not provided by navigation
const DEFAULT_PASSING_SCORE = 1;

// --- Define callable function reference outside component ---
const recordQuizResult = functions().httpsCallable("recordQuizResult");

const QuizResultScreen = ({ route, navigation }) => {
  const [username, setUsername] = useState("User");

  // --- VVV Corrected Param Destructuring VVV ---
  const {
    score = 0,
    totalQuestions = 0,
    quizId = null, // <<< CORRECT: Expect quizId now
    parentTopicId = null, // <<< Capture parentTopicId for context if needed
    passingScore = DEFAULT_PASSING_SCORE,
  } = route.params || {};
  // Calculate maxScore if not explicitly passed
  const maxScore = route.params?.maxScore ?? totalQuestions;
  // --- ^^^ Corrected Param Destructuring ^^^ ---

  // --- State for Cloud Function Call ---
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

    // --- VVV Corrected Check for quizId VVV ---
    if (!currentUser) {
      console.log("QuizResultScreen: Skip submission (unauthenticated).");
      setSubmitStatus("skipped");
      return;
    }
    if (!quizId) {
      // <<< CORRECT: Check for quizId
      console.error(
        "QuizResultScreen: Skip submission (CRITICAL: quizId is missing!)."
      );
      setSubmitError("Cannot save result: Quiz ID missing.");
      setSubmitStatus("error");
      return;
    }
    // --- ^^^ Corrected Check for quizId ^^^ ---
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

    setSubmitStatus("submitting");
    setSubmitError(null);
    console.log(
      `QuizResultScreen: Submitting result for quizId: ${quizId}, score: ${score}`
    ); // Log with quizId

    try {
      // --- VVV Corrected Data Payload VVV ---
      const resultData = {
        quizId: quizId, // <<< CORRECT: Send quizId
        scoreAchieved: score,
        passingScore: passingScore,
        maxScore: maxScore,
      };
      // --- ^^^ Corrected Data Payload ^^^ ---
      console.log("Calling 'recordQuizResult' with data:", resultData);
      const result = await recordQuizResult(resultData);
      console.log("Cloud Function 'recordQuizResult' returned:", result.data);

      if (result?.data?.status === "success") {
        console.log("Quiz result successfully recorded.");
        setSubmitStatus("success");
      } else if (result?.data?.status === "not_passed") {
        console.warn("QuizResultScreen: Cloud function reported 'not_passed'.");
        setSubmitStatus("skipped");
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
        "Failed to save quiz results.";
      setSubmitError(message);
      setSubmitStatus("error");
    }
  }, [quizId, score, passingScore, maxScore, submitStatus]); // Dependency updated to quizId

  // Effect to trigger submission on mount
  useEffect(() => {
    // VVV Add Log for Received Params VVV
    console.log(
      "QuizResultScreen mounted. Received Params:",
      JSON.stringify(route.params, null, 2)
    );
    // --- End Log ---
    if (submitStatus === "idle") {
      submitQuizResult();
    }
    // Include submitQuizResult in dependency array as per ESLint rules for useCallback
  }, [route.params, submitQuizResult, submitStatus]);

  // --- VVV Corrected Navigation Handler VVV ---
  const handlePlayAgain = () => {
    if (quizId) {
      // <<< CORRECT: Check for quizId
      console.log(`Playing again for quizId: ${quizId}`);
      // Navigate back to QuizScreen, passing the correct expected parameter name
      navigation.replace("Quiz", {
        quizContentId: quizId, // <<< CORRECT: Pass ID back as quizContentId
        parentTopicId: parentTopicId, // Pass context back if needed
        passingScore: passingScore, // Pass passing score back if needed
      });
    } else {
      console.error("Cannot play again: quizId is missing.");
      navigation.popToTop(); // Go back to main stack screen if ID missing
    }
  };
  // --- ^^^ Corrected Navigation Handler ^^^ ---

  // Score Text Calculation (unchanged)
  const scoreText =
    totalQuestions > 0 ? `${score} / ${totalQuestions}` : `${score}`;

  // --- RENDER ---
  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      {/* Header, Image, Score Text (Unchanged) */}
      <Text style={styles.header}>Quiz Over!</Text>
      <Image
        style={styles.imageContainer}
        source={require("../../assets/images/success.png")} // Ensure path is correct
      />
      <Text style={styles.text}>Well done, {username}!</Text>
      <Text style={styles.text}>
        You scored <Text style={styles.highlight}>{scoreText}</Text>.
      </Text>

      {/* UI Feedback based on submitStatus */}
      <View style={styles.statusContainer}>
        {submitStatus === "submitting" && (
          <ActivityIndicator size="small" color={Colors.primaryWhite} />
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

      {/* Buttons - disable based on submitStatus */}
      <View style={styles.buttonContainer}>
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
          style={[styles.button, styles.outlineButton]} // Added specific style for outline
          labelStyle={[styles.buttonText, styles.outlineButtonText]}
          onPress={() => navigation.popToTop()} // Use popToTop or specific navigation
          disabled={submitStatus === "submitting"} // Disable while submitting
        >
          Topics / Home
        </PaperButton>
      </View>
    </LinearGradient>
  );
};

// --- Styles ---
// Using styles from your previously shared version
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
  statusContainer: {
    minHeight: 30,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  activityIndicator: {},
  errorText: {
    color: Colors.warningRed || "#FF6B6B",
    textAlign: "center",
    fontFamily: "delius",
    fontSize: 14,
  },
  successText: {
    color: Colors.successGreen || "#4CAF50",
    textAlign: "center",
    fontFamily: "deliusBold",
    fontSize: 14,
  },
  infoText: {
    color: Colors.primaryLightGray,
    textAlign: "center",
    fontFamily: "delius",
    fontSize: 14,
  },
  buttonContainer: { width: "80%", alignItems: "center", marginTop: 15 },
  button: { marginTop: 15, paddingVertical: 5, width: "100%" },
  buttonText: { fontSize: 16, fontFamily: "deliusBold" },
  outlineButton: { borderColor: Colors.primaryWhite },
  outlineButtonText: { color: Colors.primaryWhite },
  // Add starContainer style if you implement stars
  // starContainer: { flexDirection: 'row', marginVertical: 15 },
});

export default QuizResultScreen;

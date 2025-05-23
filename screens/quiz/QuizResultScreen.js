import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Button as PaperButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";
import { authInstance } from "../../config/firebaseConfig";
import functions from "@react-native-firebase/functions";
import FeedbackFAB from "../../components/common/FeedbackFAB"; // <<< ADDED IMPORT (Adjust path if needed)

const screenWidth = Dimensions.get("window").width;
const imageDiameter = screenWidth * 0.7;
const DEFAULT_PASSING_SCORE = 1;
const recordQuizResult = functions().httpsCallable("recordQuizResult");

const QuizResultScreen = ({ route, navigation }) => {
  const { theme } = useTheme();

  const [username, setUsername] = useState("User");
  const {
    score = 0,
    totalQuestions = 0,
    quizId = null, // ID of the quiz taken
    parentTopicId = null, // Context: e.g., ID of the topic this quiz belongs to
    passingScore = DEFAULT_PASSING_SCORE,
  } = route.params || {};
  const maxScore = route.params?.maxScore ?? totalQuestions;
  const [submitError, setSubmitError] = useState(null);
  const [submitStatus, setSubmitStatus] = useState("idle");

  useEffect(() => {
    const currentUser = authInstance.currentUser;
    if (currentUser?.displayName) setUsername(currentUser.displayName);
    else if (currentUser?.email) setUsername(currentUser.email.split("@")[0]);
    else setUsername("User");
  }, []);

  const submitQuizResult = useCallback(async () => {
    // ... (logic remains same)
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
    console.log(
      "QuizResultScreen mounted. Params:",
      JSON.stringify(route.params, null, 2)
    );
    if (submitStatus === "idle") submitQuizResult();
  }, [route.params, submitQuizResult, submitStatus]);

  const handlePlayAgain = () => {
    if (quizId) {
      navigation.replace("Quiz", {
        quizContentId: quizId,
        parentTopicId,
        passingScore,
      });
    } else {
      navigation.popToTop(); // Should ideally not happen if quizId is missing
    }
  };

  const scoreText =
    totalQuestions > 0 ? `${score} / ${totalQuestions}` : `${score}`;

  const styles = useMemo(
    () =>
      StyleSheet.create({
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
        }, // Added theme.appAccent
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
        }, // Added theme.appWarning
        successText: {
          color: theme.success || theme.appSuccess || "#4CAF50",
          textAlign: "center",
          fontFamily: "deliusBold",
          fontSize: 14,
        }, // Added theme.appSuccess
        infoText: {
          color:
            theme.textSecondaryOnGradient || theme.textSecondary || "#E0E0E0",
          textAlign: "center",
          fontFamily: "delius",
          fontSize: 14,
        },
        buttonContainer: { width: "80%", alignItems: "center", marginTop: 15 },
        button: { marginTop: 15, paddingVertical: 5, width: "100%" },
        outlineButton: {},
      }),
    [theme]
  );

  // Prepare contentContext for FeedbackFAB
  // Using quizId as the ID for the quiz itself.
  // parentTopicId can be the parent context if it represents a course/topic.
  const feedbackContext = quizId
    ? {
        type: "quiz_overall",
        id: quizId,
        parentId: parentTopicId || null, // The broader topic/category this quiz belongs to
        titlePreview: `Quiz ${quizId} Results`, // Or a fetched quiz title if available
      }
    : null;

  return (
    <LinearGradient
      colors={[
        theme.gradientStart || "#3b0940",
        theme.gradientEnd || "#d7d1d3",
      ]}
      style={styles.container}
    >
      <Text style={styles.header}>Quiz Over!</Text>
      <Image
        style={styles.imageContainer}
        source={require("../../assets/images/success.png")}
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
          buttonColor={theme.success || theme.appSuccess} // Added theme.appSuccess
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
          // For outlined button, border color often comes from textColor or theme's primary/outline
        >
          Exit
        </PaperButton>
      </View>
      {/* ADDED FeedbackFAB - Render only if context can be formed */}
      {feedbackContext && <FeedbackFAB contentContext={feedbackContext} />}
    </LinearGradient>
  );
};

export default QuizResultScreen;

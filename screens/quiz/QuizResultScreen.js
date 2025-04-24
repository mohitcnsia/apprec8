// screens/quiz/QuizResultScreen.js

import React, { useState, useEffect, useCallback, useMemo } from "react"; // Import useMemo
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  // Button, // No longer needed if using PaperButton consistently
} from "react-native";
import { Button as PaperButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
// import { Colors } from "../../config/colors"; // Remove legacy Colors import
import { useTheme } from "../../context/ThemeContext"; // Import useTheme hook
import { authInstance } from "../../config/firebaseConfig";
import functions from "@react-native-firebase/functions";

// --- Dimensions, Defaults, Function Ref (remain the same) ---
const screenWidth = Dimensions.get("window").width;
const imageDiameter = screenWidth * 0.7;
const DEFAULT_PASSING_SCORE = 1;
const recordQuizResult = functions().httpsCallable("recordQuizResult");

const QuizResultScreen = ({ route, navigation }) => {
  const { theme } = useTheme(); // Use the theme hook

  // --- State and Props Destructuring (remain the same) ---
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

  // --- useEffects and Callbacks (remain the same) ---
  useEffect(() => {
    const currentUser = authInstance.currentUser;
    if (currentUser?.displayName) setUsername(currentUser.displayName);
    else if (currentUser?.email) setUsername(currentUser.email.split("@")[0]);
    else setUsername("User");
  }, []);

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
      navigation.popToTop();
    }
  };

  const scoreText =
    totalQuestions > 0 ? `${score} / ${totalQuestions}` : `${score}`;

  // --- Define Styles Inside Component with useMemo ---
  const styles = useMemo(
    () =>
      StyleSheet.create({
        // gradientContainer necessary if LinearGradient isn't the root with flex: 1
        container: {
          // Applied to LinearGradient
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        },
        header: {
          fontSize: 30,
          fontFamily: "pacifico", // Keep font
          color: theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF", // Themed text color
          marginBottom: 20,
          textAlign: "center",
        },
        text: {
          fontSize: 18,
          marginBottom: 5,
          textAlign: "center",
          color: theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF", // Themed text color
          fontFamily: "delius", // Keep font
        },
        highlight: {
          fontFamily: "deliusBold", // Keep font
          color: theme.accent || "#f12b15", // Use theme accent color
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
            theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF", // Themed border color
        },
        statusContainer: {
          minHeight: 30,
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 10,
        },
        // activityIndicator: {}, // Not needed if color passed directly
        errorText: {
          color: theme.warning || "#FF6B6B", // Use theme warning color
          textAlign: "center",
          fontFamily: "delius",
          fontSize: 14,
        },
        successText: {
          color: theme.success || "#4CAF50", // Use theme success color
          textAlign: "center",
          fontFamily: "deliusBold",
          fontSize: 14,
        },
        infoText: {
          // Use themed secondary text color, suitable for gradient
          color:
            theme.textSecondaryOnGradient || theme.textSecondary || "#E0E0E0",
          textAlign: "center",
          fontFamily: "delius",
          fontSize: 14,
        },
        buttonContainer: {
          width: "80%", // Keep width constraint
          alignItems: "center",
          marginTop: 15,
        },
        button: {
          // Common button style (margin, width)
          marginTop: 15,
          paddingVertical: 5,
          width: "100%",
        },
        // buttonText: { fontSize: 16, fontFamily: "deliusBold" }, // Use PaperButton textColor prop instead
        outlineButton: {
          // Specific style for outline button border
          // Border color set via PaperButton prop (borderColor doesn't work directly)
          // We can use this style potentially for other overrides if needed
        },
        // outlineButtonText: { color: Colors.primaryWhite }, // Use PaperButton textColor prop instead
      }),
    [theme]
  ); // Depend on theme

  // --- RENDER ---
  return (
    <LinearGradient
      // Apply themed gradient colors
      colors={[
        theme.gradientStart || "#3b0940",
        theme.gradientEnd || "#d7d1d3",
      ]}
      style={styles.container} // Ensure gradient fills screen
    >
      <Text style={styles.header}>Quiz Over!</Text>
      <Image
        style={styles.imageContainer}
        source={require("../../assets/images/success.png")} // Ensure path correct
      />
      <Text style={styles.text}>Well done, {username}!</Text>
      <Text style={styles.text}>
        You scored <Text style={styles.highlight}>{scoreText}</Text>.
      </Text>

      {/* Status Feedback */}
      <View style={styles.statusContainer}>
        {submitStatus === "submitting" && (
          <ActivityIndicator
            size="small"
            color={
              theme.textPrimaryOnGradient || theme.primaryWhite || "#FFFFFF"
            }
          /> // Themed indicator
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

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {/* Play Again Button */}
        <PaperButton
          mode="contained"
          style={styles.button} // Common margin/width style
          labelStyle={{ fontFamily: "deliusBold", fontSize: 16 }} // Keep font style
          onPress={handlePlayAgain}
          disabled={submitStatus === "submitting"}
          // Use PaperButton props for theming
          buttonColor={theme.accent}
          textColor={theme.buttonText || theme.primaryWhite}
        >
          Play Again
        </PaperButton>

        {/* Topics / Home Button */}
        <PaperButton
          mode="outlined"
          style={[styles.button, styles.outlineButton]} // Common + specific styles
          labelStyle={{ fontFamily: "deliusBold", fontSize: 16 }} // Keep font style
          onPress={() => navigation.popToTop()}
          disabled={submitStatus === "submitting"}
          // Use PaperButton props for theming outline button
          textColor={theme.textPrimaryOnGradient || theme.primaryWhite} // Text/Border color
          // Note: Paper's outlined button border color uses the theme's 'primary' or 'outline' color by default.
          // To force a specific border color matching the text, you might need theme override or a wrapper View.
          // For simplicity, we set the textColor, which often controls the border too.
        >
          Topics / Home
        </PaperButton>
      </View>
    </LinearGradient>
  );
};

export default QuizResultScreen;

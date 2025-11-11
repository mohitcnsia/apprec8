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
  PanResponder,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getSpecialQuizIds } from "../../utils/specialQuizCache";
import { Button as PaperButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";
import { authInstance } from "../../config/firebaseConfig";
import functions from "@react-native-firebase/functions";
import FeedbackFAB from "../../components/common/FeedbackFAB";

const screenWidth = Dimensions.get("window").width;
const imageDiameter = screenWidth * 0.7;
const DEFAULT_PASSING_SCORE = 1;
const recordQuizResult = functions().httpsCallable("recordQuizResult");

const TRIPLE_TAP_INTERVAL = 300;
const TRIPLE_TAP_RESET_TIMEOUT = 400;
const TAP_SLOP_THRESHOLD = 10;
const TAP_ZONE_SIZE = 80;

const QuizResultScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const C = theme.appColors || theme;

  const {
    score = 0,
    totalQuestions = 0,
    quizId = null,
    parentTopicId = null,
    passingScore = DEFAULT_PASSING_SCORE,
  } = route.params || {};
  const maxScore = route.params?.maxScore ?? totalQuestions;

  const [username, setUsername] = useState("User");
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [submitError, setSubmitError] = useState(null);
  const [starsEarned, setStarsEarned] = useState(0);

  const [isFabVisibleByGesture, setIsFabVisibleByGesture] = useState(false);
  const tapCountRef = useRef(0);
  const lastTapTimestampRef = useRef(0);
  const gestureTimerRef = useRef(null);
  const isFabContextActive = !!quizId;

  // Initialize username
  useEffect(() => {
    const currentUser = authInstance.currentUser;
    if (currentUser?.displayName) setUsername(currentUser.displayName);
    else if (currentUser?.email) setUsername(currentUser.email.split("@")[0]);
    else setUsername("User");

    tapCountRef.current = 0;
    clearTimeout(gestureTimerRef.current);
    return () => clearTimeout(gestureTimerRef.current);
  }, [route.params]);

  // Submit quiz result
  const submitQuizResult = useCallback(async () => {
    if (!quizId) return;
    const currentUser = authInstance.currentUser;
    if (!currentUser) {
      setSubmitStatus("skipped");
      return;
    }

    // Fetch special quiz IDs from AsyncStorage cache
    const specialQuizIds = await getSpecialQuizIds();
    const isSpecialQuiz = specialQuizIds.includes(quizId);

    const resultData = {
      quizId,
      scoreAchieved: score,
      passingScore,
      maxScore,
      isSpecialQuiz,
    };

    try {
      setSubmitStatus("submitting");
      const result = await recordQuizResult(resultData);
      if (result?.data?.status === "success") {
        setStarsEarned(result.data.starsAwarded);
        setSubmitStatus("success");
      } else if (result?.data?.status === "not_passed") {
        setSubmitStatus("skipped");
      } else {
        setSubmitError(result?.data?.message || "Unexpected server response");
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitError(error.message || "Failed to save quiz result");
      setSubmitStatus("error");
    }
  }, [quizId, score, passingScore, maxScore]);

  // Trigger submit on mount
  useEffect(() => {
    if (submitStatus === "idle") submitQuizResult();
  }, [submitStatus, submitQuizResult]);

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

  // Triple tap pan responder for FAB
  const cornerTapPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isFabContextActive,
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        isFabContextActive &&
        Math.abs(gestureState.dx) < TAP_SLOP_THRESHOLD &&
        Math.abs(gestureState.dy) < TAP_SLOP_THRESHOLD,
      onPanResponderRelease: () => {
        const now = Date.now();
        clearTimeout(gestureTimerRef.current);
        if (
          tapCountRef.current === 0 ||
          now - lastTapTimestampRef.current > TRIPLE_TAP_INTERVAL * 1.5
        ) {
          tapCountRef.current = 1;
        } else {
          tapCountRef.current++;
        }
        lastTapTimestampRef.current = now;

        if (tapCountRef.current === 3) {
          setIsFabVisibleByGesture((prev) => !prev);
          tapCountRef.current = 0;
        } else if (tapCountRef.current > 0) {
          gestureTimerRef.current = setTimeout(() => {
            tapCountRef.current = 0;
          }, TRIPLE_TAP_RESET_TIMEOUT);
        }
      },
      onPanResponderTerminate: () => {
        tapCountRef.current = 0;
        clearTimeout(gestureTimerRef.current);
      },
      onPanResponderTerminationRequest: () => true,
    })
  ).current;

  const scoreText =
    totalQuestions > 0 ? `${score} / ${totalQuestions}` : `${score}`;
  const styles = useMemo(
    () =>
      StyleSheet.create({
        rootContainer: { flex: 1 },
        gradientContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        },
        header: {
          fontSize: 30,
          fontFamily: "pacifico",
          color: C.textPrimaryOnGradient || "#FFFFFF",
          marginBottom: 20,
          textAlign: "center",
        },
        text: {
          fontSize: 18,
          marginBottom: 5,
          textAlign: "center",
          color: C.textPrimaryOnGradient || "#FFFFFF",
          fontFamily: "delius",
        },
        highlight: {
          fontFamily: "deliusBold",
          color: C.accent || "#f12b15",
          fontSize: 20,
        },
        imageContainer: {
          height: imageDiameter,
          width: imageDiameter,
          borderRadius: imageDiameter / 2,
          resizeMode: "cover",
          marginBottom: 20,
          borderWidth: 2,
          borderColor: C.textPrimaryOnGradient || "#FFFFFF",
        },
        statusContainer: {
          minHeight: 50,
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
          fontSize: 16,
        },
        infoText: {
          color: C.textSecondaryOnGradient || "#E0E0E0",
          textAlign: "center",
          fontFamily: "delius",
          fontSize: 14,
        },
        starsText: {
          color: C.accent || "#FFD700",
          textAlign: "center",
          fontFamily: "deliusBold",
          fontSize: 18,
          marginVertical: 5,
        },
        starText: {
          fontFamily: "deliusBold",
          fontSize: 25,
          color: "#4CAF50", // green
          flexDirection: "row",
          alignItems: "center",
        },
        buttonContainer: { width: "80%", alignItems: "center", marginTop: 15 },
        button: { marginTop: 15, paddingVertical: 5, width: "100%" },
        outlineButton: {},
        tripleTapZone: {
          position: "absolute",
          bottom: 10,
          right: 10,
          width: TAP_ZONE_SIZE,
          height: TAP_ZONE_SIZE,
        },
      }),
    [C]
  );

  const feedbackContext = quizId
    ? {
        type: "quiz_overall",
        id: quizId,
        parentId: parentTopicId || null,
        titlePreview: `Quiz ${quizId} Results`,
      }
    : null;

  return (
    <View style={styles.rootContainer}>
      <LinearGradient
        colors={[C.gradientStart || "#3b0940", C.gradientEnd || "#d7d1d3"]}
        style={styles.gradientContainer}
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
              color={C.textPrimaryOnGradient || "#FFFFFF"}
            />
          )}
          {submitStatus === "error" && (
            <Text style={styles.errorText}>
              {submitError || "Error saving results."}
            </Text>
          )}
          {submitStatus === "success" && (
            <>
              <Text style={styles.successText}>Progress saved!</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 5,
                }}
              >
                <Text style={styles.text}>You Earned </Text>
                <Text
                  style={[
                    styles.text,
                    styles.starText,
                    { color: "green", fontWeight: "bold", marginRight: 5 },
                  ]}
                >
                  {starsEarned}
                </Text>
                <Text
                  style={[styles.starsText, { fontSize: 18, color: "green" }]}
                >
                  🌟
                </Text>
              </View>
            </>
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
            buttonColor={C.success || "#4CAF50"}
            textColor={C.buttonText || "#FFFFFF"}
          >
            Play Again
          </PaperButton>
          <PaperButton
            mode="outlined"
            style={[styles.button, styles.outlineButton]}
            labelStyle={{ fontFamily: "deliusBold", fontSize: 16 }}
            onPress={() => navigation.popToTop()}
            disabled={submitStatus === "submitting"}
            textColor={C.textPrimaryOnGradient || "#FFFFFF"}
          >
            Exit
          </PaperButton>
        </View>
      </LinearGradient>

      {isFabContextActive && (
        <View
          style={styles.tripleTapZone}
          {...cornerTapPanResponder.panHandlers}
        />
      )}
      {isFabContextActive && feedbackContext && (
        <FeedbackFAB
          contentContext={feedbackContext}
          visible={isFabVisibleByGesture}
        />
      )}
    </View>
  );
};

export default QuizResultScreen;

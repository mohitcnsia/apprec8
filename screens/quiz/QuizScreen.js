// screens/quiz/QuizScreen.js (Rewritten with corrected score calculation)

import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Platform, // Keeping Platform just in case styles need it later
} from "react-native";
import {
  Button as PaperButton,
  Card,
  Text as PaperText,
  ActivityIndicator as PaperActivityIndicator,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import functions from "@react-native-firebase/functions";
import { Colors } from "../../config/colors";
import { listenToQuizQuestions } from "../../services/firestoreContentApi";
import Explanation from "../../components/quiz/Explanation";
import ConfirmationModal from "../../components/common/ConfirmationModel";

// --- Firebase Callable Function Reference ---
const penalizeQuizLeave = functions().httpsCallable("penalizeQuizLeave");

// --- Helper Functions ---
const shuffleArray = (array) => {
  if (!Array.isArray(array)) return [];
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const MAX_QUESTIONS = 10;
const PASSING_SCORE_THRESHOLD = 1;

// --- Component ---
const QuizScreen = ({ route, navigation }) => {
  const quizContentId = route?.params?.subtopicId || route?.params?.topicId;

  // --- State ---
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [wasCorrect, setWasCorrect] = useState(null); // true, false, or null
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [showLeaveConfirmModal, setShowLeaveConfirmModal] = useState(false);
  const [pendingNavigationAction, setPendingNavigationAction] = useState(null);

  // --- Refs ---
  const isNavigatingToResults = useRef(false);
  const isMounted = useRef(true); // Use ref for mounted status

  // --- Effect to track mount status ---
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // --- Effect to Fetch Questions ---
  useEffect(() => {
    // Reset state on new quizContentId load
    setIsLoading(true);
    setError(null);
    setQuestions([]);
    setQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setWasCorrect(null);
    setShowFeedback(false);
    setIsLeaving(false);
    setPendingNavigationAction(null);
    setShowLeaveConfirmModal(false);
    isNavigatingToResults.current = false;

    if (!quizContentId) {
      console.warn("QuizScreen: No quizContentId provided.");
      if (isMounted.current) {
        navigation.replace("DummyScreen", {
          errorMessage: "No topic specified for the quiz.",
        });
      }
      return;
    }

    console.log(
      `QuizScreen: Attaching listener for quizContentId: ${quizContentId}`
    );
    const unsubscribe = listenToQuizQuestions(
      quizContentId,
      (fetchedQuestions) => {
        // onDataReceived
        console.log(
          `QuizScreen: Received ${
            fetchedQuestions?.length ?? "undefined"
          } questions.`
        );
        if (isMounted.current) {
          if (fetchedQuestions && fetchedQuestions.length > 0) {
            let sQ = shuffleArray(fetchedQuestions);
            const c = Math.min(sQ.length, MAX_QUESTIONS);
            const selQ = sQ.slice(0, c);
            const fQ = selQ.map((q) => ({
              ...q,
              options: shuffleArray(q.options || []),
            }));
            setQuestions(fQ);
            setError(null);
            setIsLoading(false); // Stop loading ONLY when data is ready
          } else {
            console.log(
              "QuizScreen: No questions found, navigating to DummyScreen."
            );
            navigation.replace("DummyScreen", {
              errorMessage:
                "Quiz questions are not available yet for this topic.",
            });
          }
        }
      },
      (fetchError) => {
        // onError
        console.error("QuizScreen: Firestore listener error:", fetchError);
        if (isMounted.current) {
          navigation.replace("DummyScreen", {
            errorMessage:
              fetchError?.message || "Failed to load quiz questions.",
          });
        }
      }
    );
    // Cleanup listener
    return () => {
      console.log(
        `QuizScreen: Cleaning up listener for quizContentId: ${quizContentId}`
      );
      unsubscribe();
    };
  }, [quizContentId, navigation]);

  // --- Effect for Handling Navigation Away (Leave Prompt) ---
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      // Allow navigation if intentionally going to results OR if loading failed/is still in progress OR already leaving
      if (isNavigatingToResults.current || isLoading || error || isLeaving) {
        console.log(
          "Allowing navigation: Intentionally going to results OR load failed/still loading OR already leaving."
        );
        if (isNavigatingToResults.current) {
          isNavigatingToResults.current = false;
        }
        return; // Do NOT prevent default
      }
      // Otherwise, prevent default and show modal for user-initiated leave
      console.log(
        "User initiated leave during active quiz, preventing default and showing modal."
      );
      e.preventDefault();
      setPendingNavigationAction(e.data.action);
      setShowLeaveConfirmModal(true);
    });
    // Cleanup listener
    return unsubscribe;
  }, [
    navigation,
    quizContentId,
    isLeaving,
    pendingNavigationAction,
    isLoading,
    error,
  ]); // Added isLoading, error

  // --- Handlers ---
  const handleAnswer = (answer) => {
    if (!showFeedback) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || isLoading || showFeedback) return;
    const q = questions[questionIndex];
    if (!q) {
      console.error("handleSubmit: current question is undefined!");
      return;
    }
    const correct = selectedAnswer === q.answer;
    setWasCorrect(correct); // Set correctness based on current answer
    setShowFeedback(true); // Show feedback
  };

  // --- CORRECTED handleNextQuestion ---
  const handleNextQuestion = () => {
    if (!showFeedback || isLoading) return; // Should only proceed when feedback is shown

    // Determine score increment based on the question just reviewed
    const scoreIncrement = wasCorrect ? 1 : 0;
    // Note: We don't call setScore here anymore before checking the index

    const nextIndex = questionIndex + 1;

    if (nextIndex < questions.length) {
      // --- Move to next question ---
      // Update score state based on the previous question's correctness *before* moving index
      if (scoreIncrement > 0) {
        setScore((prevScore) => prevScore + scoreIncrement);
      }
      // Move to the next question index
      setQuestionIndex(nextIndex);
      // Reset state for the new question
      setSelectedAnswer(null);
      setWasCorrect(null);
      setShowFeedback(false);
    } else {
      // --- Quiz finished normally ---
      // Calculate final score explicitly, including the increment from the *last* question
      const finalScore = score + scoreIncrement;

      console.log(
        `Quiz finished normally. Final score calculated: ${finalScore}. Navigating to results.`
      );
      isNavigatingToResults.current = true; // Signal intentional navigation

      navigation.replace("QuizResult", {
        score: finalScore, // <<< Pass the CORRECT final score
        totalQuestions: questions.length,
        topicId: quizContentId,
        passingScore: PASSING_SCORE_THRESHOLD,
        maxScore: questions.length,
      });
    }
  };
  // --- End CORRECTED handleNextQuestion ---

  // --- Logic for Confirmation Modal Actions ---
  const handleConfirmLeave = async () => {
    // Determine the correct ID for the quiz being left
    const quizContentId = route?.params?.subtopicId || route?.params?.topicId; // <<< ADD THIS LINE

    if (isLeaving || !pendingNavigationAction) return; // Prevent double execution

    // --- ADD Safety Check ---
    if (!quizContentId) {
      console.error(
        "handleConfirmLeave: Cannot penalize, quizContentId is missing."
      );
      // Decide how to handle - maybe just navigate without penalty?
      setShowLeaveConfirmModal(false);
      if (pendingNavigationAction) navigation.dispatch(pendingNavigationAction);
      else navigation.goBack();
      return;
    }
    // --- End Safety Check ---

    setShowLeaveConfirmModal(false);
    setIsLeaving(true);
    try {
      console.log(
        `User confirmed leave. Calling penalizeQuizLeave for quizId: ${quizContentId}...`
      ); // Log correct ID
      // Pass the correct ID to the Cloud Function
      await penalizeQuizLeave({ quizId: quizContentId }); // <<< USE quizContentId HERE
      console.log("penalizeQuizLeave call finished.");
    } catch (error) {
      console.error("Error calling penalizeQuizLeave:", error);
    } finally {
      console.log(
        "Dispatching stored navigation action after penalty attempt."
      );
      if (pendingNavigationAction) {
        navigation.dispatch(pendingNavigationAction);
      } else {
        console.warn("No pending action found, navigating back.");
        navigation.goBack();
      }
      setPendingNavigationAction(null);
      setIsLeaving(false);
    }
  };

  const handleCancelLeave = () => {
    console.log("User cancelled leaving quiz.");
    setShowLeaveConfirmModal(false);
    setPendingNavigationAction(null);
    setIsLeaving(false);
  };

  // --- Dynamic Styling ---
  const getButtonStyle = (option) => {
    /* ... (same as before) ... */
    const q = questions[questionIndex];
    if (!q) return styles.optionButton;
    if (showFeedback) {
      if (option === q.answer) return styles.correctAnswerButton;
      if (option === selectedAnswer) return styles.incorrectAnswerButton;
      return styles.disabledAnswerButton;
    } else {
      return selectedAnswer === option
        ? styles.selectedAnswerButton
        : styles.optionButton;
    }
  };
  const getNextButtonStyle = () => {
    /* ... (same as before) ... */
    if (!showFeedback)
      return selectedAnswer === null
        ? styles.submitButtonDisabled
        : styles.submitButton;
    else
      return wasCorrect ? styles.nextButtonCorrect : styles.nextButtonIncorrect;
  };

  // --- RENDER LOGIC ---
  console.log(
    `Render Check: isLoading=${isLoading}, error=${JSON.stringify(
      error
    )}, questions.length=${questions.length}, index=${questionIndex}`
  );

  // Loading State
  if (isLoading) {
    return (
      <LinearGradient
        colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
        style={styles.centered}
      >
        <PaperActivityIndicator
          animating={true}
          size="large"
          color={Colors.primaryWhite}
        />
      </LinearGradient>
    );
  }

  // Error / No Questions states (should be handled by navigation, but keep as fallback)
  if (error) {
    /* ... (Error UI with Back Button) ... */
  }
  if (questions.length === 0) {
    /* ... (No Questions UI with Back Button) ... */
  }

  // Brief Loading state if index is out of bounds (during navigation)
  if (questionIndex >= questions.length) {
    return (
      <LinearGradient
        colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
        style={styles.centered}
      >
        <ActivityIndicator size="large" color={Colors.primaryWhite} />
      </LinearGradient>
    );
  }

  // Data Integrity Check
  const currentQuestion = questions[questionIndex];
  if (!currentQuestion) {
    /* ... (Critical Error UI with Back Button) ... */
  }

  // --- Main Quiz UI ---
  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress Text */}
        <PaperText style={styles.progressText}>
          Question {questionIndex + 1} of {questions.length}
        </PaperText>
        {/* Question Card */}
        <Card style={styles.card}>
          <Card.Content>
            <PaperText
              style={[
                styles.questionText,
                showFeedback && styles.questionTextAnswered,
              ]}
            >
              {currentQuestion.question}
            </PaperText>
            {showFeedback && currentQuestion.explanation ? (
              <View style={styles.explanationContainer}>
                <Explanation explanationText={currentQuestion.explanation} />
              </View>
            ) : null}
          </Card.Content>
        </Card>
        {/* Options */}
        <View style={styles.optionsContainer}>
          {(currentQuestion.options || []).map((option, index) => (
            <PaperButton
              key={index}
              mode="contained"
              onPress={() => handleAnswer(option)}
              style={[styles.baseButton, getButtonStyle(option)]}
              labelStyle={
                selectedAnswer === option
                  ? styles.selectedOptionButtonText
                  : styles.optionButtonText
              }
              disabled={showFeedback}
              uppercase={false}
            >
              {option}
            </PaperButton>
          ))}
        </View>
        {/* Submit/Next Button */}
        <PaperButton
          mode="contained"
          style={[
            styles.baseButton,
            styles.nextButtonBase,
            getNextButtonStyle(),
          ]}
          labelStyle={styles.nextButtonText}
          onPress={showFeedback ? handleNextQuestion : handleSubmit}
          disabled={!showFeedback && selectedAnswer === null} // Removed isLoading check here as button should be usable if UI rendered
          uppercase={false}
        >
          {showFeedback ? "Next" : "Check"}
        </PaperButton>
      </ScrollView>
      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={showLeaveConfirmModal}
        title="Leave Quiz?"
        message="If you leave now, your progress might be penalized."
        onCancel={handleCancelLeave}
        onConfirm={handleConfirmLeave}
        confirmText="Leave"
        cancelText="Stay"
      />
    </LinearGradient>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  // ...(Keep all your existing styles here)...
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: "center", padding: 20 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#FFBABA",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
  infoText: {
    color: Colors.primaryLightGray,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
  progressText: {
    fontSize: 16,
    color: Colors.primaryWhite,
    textAlign: "center",
    marginBottom: 15,
    fontFamily: "nunitoBold",
  },
  card: {
    marginBottom: 20,
    backgroundColor: Colors.primaryWhite100,
    borderRadius: 12,
  },
  questionText: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: "center",
    color: Colors.blackText,
    fontFamily: "nunitoBold",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  questionTextAnswered: { fontSize: 16, lineHeight: 24 },
  explanationContainer: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.primaryLightGray,
  },
  optionsContainer: { marginVertical: 5 },
  baseButton: {
    borderRadius: 25,
    marginVertical: 7,
    paddingVertical: Platform.OS === "ios" ? 10 : 6,
    borderWidth: 1,
  },
  optionButtonText: {
    fontSize: 16,
    fontFamily: "nunitoBold",
    color: Colors.blackText,
  },
  selectedOptionButtonText: {
    fontSize: 16,
    fontFamily: "nunitoBold",
    color: Colors.primaryWhite,
  },
  optionButton: {
    backgroundColor: Colors.primaryWhite100,
    borderColor: Colors.primaryDarkMaroon,
  },
  selectedAnswerButton: {
    backgroundColor: Colors.primaryDarkMaroon,
    borderColor: Colors.primaryDarkMaroon,
  },
  correctAnswerButton: {
    backgroundColor: Colors.successGreen,
    borderColor: Colors.successGreen,
    color: Colors.primaryWhite,
  },
  incorrectAnswerButton: {
    backgroundColor: Colors.errorRed,
    borderColor: Colors.errorRed,
    color: Colors.primaryWhite,
  },
  disabledAnswerButton: {
    backgroundColor: Colors.mediumGray,
    borderColor: Colors.mediumGray,
    opacity: 0.6,
  },
  nextButtonBase: { marginTop: 20 },
  submitButton: {
    backgroundColor: Colors.primaryDarkMaroon,
    borderColor: Colors.primaryDarkMaroon,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.mediumGray,
    borderColor: Colors.mediumGray,
    opacity: 0.6,
  },
  nextButtonCorrect: {
    backgroundColor: Colors.successGreen,
    borderColor: Colors.successGreen,
  },
  nextButtonIncorrect: {
    backgroundColor: Colors.errorRed,
    borderColor: Colors.errorRed,
  },
  nextButtonText: {
    color: Colors.primaryWhite,
    fontSize: 18,
    fontFamily: "nunitoBold",
  },
});

export default QuizScreen;

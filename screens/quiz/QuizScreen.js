// screens/quiz/QuizScreen.js

import React, { useEffect, useState, useCallback, useRef } from "react"; // <-- Import useRef
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import {
  Button,
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

const shuffleArray = (array) => {
  /* ... */ let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};
const MAX_QUESTIONS = 10;
const PASSING_SCORE_THRESHOLD = 1;

const QuizScreen = ({ route, navigation }) => {
  const { topicId } = route.params || {};
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [wasCorrect, setWasCorrect] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [showLeaveConfirmModal, setShowLeaveConfirmModal] = useState(false);
  const [pendingNavigationAction, setPendingNavigationAction] = useState(null);

  // --- Ref to track intentional navigation to results ---
  const isNavigatingToResults = useRef(false); // <-- Create the ref

  // --- useEffect for Firestore listener ---
  useEffect(() => {
    if (!topicId) {
      setError("No topic specified...");
      setIsLoading(false);
      return;
    }
    // Reset state
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
    isNavigatingToResults.current = false; // Also reset ref on new topic
    let isMounted = true;
    const unsubscribe = listenToQuizQuestions(
      topicId,
      (fetchedQuestions) => {
        if (isMounted) {
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
          } else {
            setError("No quiz questions available...");
            setQuestions([]);
          }
          setIsLoading(false);
        }
      },
      (fetchError) => {
        if (isMounted) {
          console.error("Firestore listener error:", fetchError);
          // *** Ensure error state is always a string ***
          const errorMessage =
            typeof fetchError === "string"
              ? fetchError
              : fetchError?.message || // Try getting message property
                "Could not load quiz questions."; // Fallback string
          setError(errorMessage);
          setQuestions([]);
          setIsLoading(false);
        }
      }
    );
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [topicId]);

  // --- Updated: useEffect for Navigation Listener (using useRef) ---
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      console.log(
        "beforeRemove triggered. isNavigatingToResults:",
        isNavigatingToResults.current,
        "isLeaving:",
        isLeaving
      );

      // *** Check the ref FIRST ***
      // If we intentionally navigated to results, allow it and reset the flag.
      if (isNavigatingToResults.current) {
        console.log("Navigating to results detected via ref, allowing.");
        isNavigatingToResults.current = false; // Reset flag for safety
        // Do NOT preventDefault. Allow the navigation triggered by navigation.replace to proceed.
        return;
      }

      // If already processing a confirmed leave, dispatch the stored action
      // (This check might be redundant if isLeaving state update works correctly, but keep for safety)
      if (isLeaving) {
        console.log(
          "Already leaving (modal confirmed), allowing navigation dispatch."
        );
        navigation.dispatch(e.data.action); // Ensure navigation proceeds if modal path already taken
        return;
      }

      // --- If NOT navigating to results and NOT already leaving, then show modal ---
      console.log(
        "User initiated leave, preventing default and showing modal."
      );
      // Prevent default action (user trying to go back, etc.)
      e.preventDefault();

      // Store the action and show the custom modal
      setPendingNavigationAction(e.data.action);
      setShowLeaveConfirmModal(true);
    });

    // Cleanup
    return unsubscribe;
  }, [navigation, topicId, isLeaving, pendingNavigationAction]); // Removed questions/questionIndex from deps as ref handles the finish state

  // --- Handlers ---
  const handleAnswer = (answer) => {
    if (!showFeedback) {
      setSelectedAnswer(answer);
    }
  };
  const handleSubmit = () => {
    if (selectedAnswer === null || isLoading) return;
    const q = questions[questionIndex];
    if (!q) {
      console.error("handleSubmit: current question is undefined!");
      return;
    }
    const correct = selectedAnswer === q.answer;
    setWasCorrect(correct);
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (!showFeedback || isLoading) return;
    if (wasCorrect) {
      setScore((prevScore) => prevScore + 1);
    }
    const nextIndex = questionIndex + 1;
    if (nextIndex < questions.length) {
      setQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      setWasCorrect(null);
      setShowFeedback(false);
    } else {
      // Quiz finished normally
      const finalScore = score + (wasCorrect ? 1 : 0);
      console.log(
        "Quiz finished normally. Setting ref and navigating to results."
      );
      // *** SET THE REF before navigating ***
      isNavigatingToResults.current = true;
      navigation.replace("QuizResult", {
        score: finalScore,
        totalQuestions: questions.length,
        topicId: topicId,
        passingScore: PASSING_SCORE_THRESHOLD,
        maxScore: questions.length,
      });
    }
  };

  // --- Logic for Confirmation Modal Actions (Unchanged) ---
  const handleConfirmLeave = async () => {
    if (isLeaving || !pendingNavigationAction) return;
    setShowLeaveConfirmModal(false);
    setIsLeaving(true);
    try {
      console.log("User confirmed leave. Calling penalizeQuizLeave...");
      await penalizeQuizLeave({ quizId: topicId });
      console.log("penalizeQuizLeave call finished.");
    } catch (error) {
      console.error("Error calling penalizeQuizLeave:", error);
    } finally {
      console.log(
        "Dispatching stored navigation action after penalty attempt."
      );
      navigation.dispatch(pendingNavigationAction); // Perform the navigation user originally requested
      setPendingNavigationAction(null);
      // setIsLeaving(false); // Reset if needed, might reset on unmount anyway
    }
  };
  const handleCancelLeave = () => {
    console.log("User cancelled leaving quiz.");
    setShowLeaveConfirmModal(false);
    setPendingNavigationAction(null);
    setIsLeaving(false);
  };

  // --- Dynamic Styling (Unchanged) ---
  const getButtonStyle = (option) => {
    /* ... */ const q = questions[questionIndex];
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
    /* ... */ if (!showFeedback)
      return selectedAnswer === null
        ? styles.submitButtonDisabled
        : styles.submitButton;
    else
      return wasCorrect ? styles.nextButtonCorrect : styles.nextButtonIncorrect;
  };

  // --- RENDER LOGIC with Debugging ---
  console.log(
    `Render Check: isLoading=<span class="math-inline">\{isLoading\}, error\=</span>{JSON.stringify(error)}, questions.length=<span class="math-inline">\{questions\.length\}, index\=</span>{questionIndex}`
  );

  if (isLoading) {
    console.log("RENDER: Returning Loading UI"); // <-- Log
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

  if (error) {
    // Log the error state just before rendering it
    console.log(
      `RENDER: Returning Error UI. Error type: ${typeof error}, Error value: ${JSON.stringify(
        error
      )}`
    ); // <-- Log
    return (
      <LinearGradient
        colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
        style={styles.centered}
      >
        {/* Ensure error is definitely rendered inside Text */}
        <PaperText style={styles.errorText}>{String(error)}</PaperText>
      </LinearGradient>
    );
  }

  if (questions.length === 0) {
    console.log("RENDER: Returning No Questions UI (or initial loading state)"); // <-- Log
    return (
      <LinearGradient
        colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
        style={styles.centered}
      >
        <PaperText style={styles.infoText}>
          {isLoading
            ? "Loading..."
            : "No questions available for this topic yet."}
        </PaperText>
      </LinearGradient>
    );
  }

  if (questionIndex >= questions.length) {
    console.log(
      "RENDER: Returning Out of Bounds/Finished UI (should be brief)"
    ); // <-- Log
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

  const currentQuestion = questions[questionIndex];
  if (!currentQuestion) {
    console.error("RENDER: Critical Error - currentQuestion undefined!"); // <-- Log
    return (
      <LinearGradient
        colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
        style={styles.centered}
      >
        <PaperText style={styles.errorText}>
          An error occurred loading the question data.
        </PaperText>
      </LinearGradient>
    );
  }

  // --- Main quiz UI ---
  console.log(
    `RENDER: Proceeding to render main quiz UI for index ${questionIndex}`
  ); // <-- Log

  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ... Progress Text ... */}
        <PaperText style={styles.progressText}>
          Question {questionIndex + 1} of {questions.length}
        </PaperText>
        {/* ... Question Card ... */}
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
        {/* ... Options ... */}
        <View style={styles.optionsContainer}>
          {(currentQuestion.options || []).map((option, index) => (
            <Button
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
            </Button>
          ))}
        </View>
        {/* ... Submit/Next Button ... */}
        <Button
          mode="contained"
          style={[
            styles.baseButton,
            styles.nextButtonBase,
            getNextButtonStyle(),
          ]}
          labelStyle={styles.nextButtonText}
          onPress={showFeedback ? handleNextQuestion : handleSubmit}
          disabled={(!showFeedback && selectedAnswer === null) || isLoading}
          uppercase={false}
        >
          {showFeedback ? "Next" : "Check"}
        </Button>
      </ScrollView>
      {/* ... Confirmation Modal ... */}
      <ConfirmationModal
        visible={showLeaveConfirmModal}
        title="Leave Quiz?"
        onCancel={handleCancelLeave}
        onConfirm={handleConfirmLeave}
      />
    </LinearGradient>
  );
};

// --- Styles (Keep Unchanged) ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: "center", padding: 20 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: { color: "#FFBABA", fontSize: 16, textAlign: "center" },
  infoText: {
    color: Colors.primaryLightGray,
    fontSize: 16,
    textAlign: "center",
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
    paddingVertical: 10,
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
    fontFamily: "nunitoBold",
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

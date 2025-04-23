// screens/quiz/QuizScreen.js (Corrected Params + Restored Styles)

import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator, // Using react-native one for basic loading/finished state
  ScrollView,
  Platform,
  Text, // Standard Text for options
  TouchableOpacity, // Touchable for options
} from "react-native";
import {
  Button as PaperButton, // For Submit/Next button
  Card,
  Text as PaperText, // For Question/Progress/Error text
  ActivityIndicator as PaperActivityIndicator,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import functions from "@react-native-firebase/functions";
import { useFocusEffect } from "@react-navigation/native"; // For tab bar hiding
import { Colors } from "../../config/colors"; // Assuming you have this config
import { listenToQuizQuestions } from "../../services/firestoreContentApi"; // Assuming this service exists
import Explanation from "../../components/quiz/Explanation"; // Assuming this component exists
import ConfirmationModal from "../../components/common/ConfirmationModel"; // Assuming this component exists

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

// --- Constants ---
const MAX_QUESTIONS = 10;
const PASSING_SCORE_THRESHOLD = 1;
const SHORT_QUESTION_THRESHOLD = 80; // Example threshold for question length heuristic

// --- Component ---
const QuizScreen = ({ route, navigation }) => {
  // --- VVV Corrected Param Reading VVV ---
  const quizContentId = route?.params?.quizContentId; // Primarily expect quizContentId
  const parentTopicIdForContext = route?.params?.parentTopicId;
  const passingScore = route?.params?.passingScore ?? PASSING_SCORE_THRESHOLD;

  // --- State ---
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

  // --- Refs ---
  const isNavigatingToResults = useRef(false);
  const isMounted = useRef(true);

  // --- Effect for Mount/Unmount Tracking ---
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // --- Effect to Fetch Questions ---
  useEffect(() => {
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
    isNavigatingToResults.current = false;

    if (!quizContentId) {
      console.warn("QuizScreen: No quizContentId provided.");
      if (isMounted.current) {
        setError("No quiz specified."); // Set error state instead of immediate navigation
        setIsLoading(false);
      }
      return;
    }

    console.log(
      `QuizScreen: Attaching listener for quizContentId: ${quizContentId}`
    );
    const unsubscribe = listenToQuizQuestions(
      quizContentId,
      (fetchedQuestions) => {
        console.log(
          `QuizScreen listener success for ${quizContentId}. Questions found: ${
            fetchedQuestions?.length ?? 0
          }`
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
          } else {
            console.log(`QuizScreen: No questions found for ${quizContentId}.`);
            setError("Quiz questions are not available yet for this topic."); // Set error state
          }
          setIsLoading(false);
          console.log(
            "QuizScreen: Questions loaded or not found, setting isLoading=false."
          );
        }
      },
      (fetchError) => {
        console.error(
          `QuizScreen listener ERROR for ${quizContentId}:`,
          fetchError
        );
        if (isMounted.current) {
          setError(fetchError?.message || "Failed to load quiz questions.");
          setIsLoading(false);
        }
      }
    );
    return () => {
      console.log(`QuizScreen: Cleaning up listener for ${quizContentId}`);
      unsubscribe();
    };
  }, [quizContentId]); // Removed navigation from dependencies here

  // --- Effect for Handling Navigation Away (Leave Prompt) ---
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      console.log(
        `QuizScreen: beforeRemove triggered. isLoading: ${isLoading}, error: ${!!error}, isNavigatingToResults: ${
          isNavigatingToResults.current
        }, isLeaving: ${isLeaving}`
      );
      // Allow automatic navigation if intentional nav to results, loading, error, or leave already processing
      if (isNavigatingToResults.current || isLoading || error || isLeaving) {
        console.log("QuizScreen: Allowing navigation automatically.");
        return;
      }
      // Intercept manual leave attempt during active quiz
      console.log(
        "QuizScreen: User initiated leave during active quiz, preventing default and showing modal."
      );
      e.preventDefault();
      setPendingNavigationAction(e.data.action);
      setShowLeaveConfirmModal(true);
    });
    return unsubscribe;
  }, [navigation, isLoading, error, isLeaving, pendingNavigationAction]); // Dependencies

  // --- Effect to Hide/Show Tab Bar ---
  useFocusEffect(
    React.useCallback(() => {
      console.log("QuizScreen focused, hiding tab bar.");
      const parentNav = navigation.getParent(); // Try to get parent navigator (e.g., Tab Navigator)
      if (parentNav) {
        // Method for typical React Navigation v5/v6 Tab Navigator
        parentNav.setOptions({
          tabBarStyle: { display: "none" },
          tabBarVisible: false,
        });
      } else {
        // Fallback if no parent or different navigator structure
        try {
          navigation.setOptions({ tabBarStyle: { display: "none" } }); // May not work if not direct child
        } catch (err) {
          console.warn("Could not hide tab bar directly on navigation object.");
        }
      }

      // Return cleanup function to restore tab bar when screen loses focus
      return () => {
        console.log("QuizScreen blurred, showing tab bar.");
        if (parentNav) {
          // Restore to default visible state
          parentNav.setOptions({
            tabBarStyle: { display: "flex" },
            tabBarVisible: true,
          }); // Adjust 'flex' if your default is different
        } else {
          try {
            navigation.setOptions({ tabBarStyle: { display: "flex" } });
          } catch (err) {
            console.warn(
              "Could not restore tab bar directly on navigation object."
            );
          }
        }
      };
    }, [navigation]) // Dependency on navigation object
  );

  // --- Handlers ---
  const handleAnswer = (answer) => {
    if (!showFeedback) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || isLoading || showFeedback) return;
    const q = questions[questionIndex];
    if (!q) return;
    const correct = selectedAnswer === q.answer;
    setWasCorrect(correct);
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (!showFeedback || isLoading) return;

    const scoreIncrement = wasCorrect ? 1 : 0;
    const currentScore = score; // Capture score before potential async update
    const nextIndex = questionIndex + 1;

    if (nextIndex < questions.length) {
      // Move to Next Question
      if (scoreIncrement > 0) {
        setScore((prevScore) => prevScore + scoreIncrement);
      }
      setQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      setWasCorrect(null);
      setShowFeedback(false);
    } else {
      // Quiz Finished Normally
      const finalScore = currentScore + scoreIncrement;
      console.log(
        `Quiz finished normally. Final score calculated: ${finalScore}. Navigating to results.`
      );
      isNavigatingToResults.current = true;

      // --- VVV Corrected Param Sending VVV ---
      navigation.replace("QuizResult", {
        score: finalScore,
        totalQuestions: questions.length,
        quizId: quizContentId, // Pass the ID using the correct name 'quizId'
        parentTopicId: parentTopicIdForContext,
        passingScore: passingScore,
        maxScore: questions.length,
      });
    }
  };

  const handleConfirmLeave = async () => {
    if (isLeaving || !pendingNavigationAction) return;
    const contentId = route?.params?.quizContentId; // Re-read for safety
    if (!contentId) {
      console.error(
        "handleConfirmLeave: Cannot penalize, quizContentId is missing."
      );
      setShowLeaveConfirmModal(false);
      if (pendingNavigationAction) navigation.dispatch(pendingNavigationAction);
      else navigation.goBack();
      return;
    }
    setShowLeaveConfirmModal(false);
    setIsLeaving(true);
    try {
      console.log(
        `User confirmed leave. Calling penalizeQuizLeave for quizId: ${contentId}...`
      );
      await penalizeQuizLeave({ quizId: contentId });
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
        navigation.goBack();
      }
    }
  };

  const handleCancelLeave = () => {
    console.log("User cancelled leaving quiz.");
    setShowLeaveConfirmModal(false);
    setPendingNavigationAction(null);
    setIsLeaving(false);
  };

  // --- Helper Function for Option Appearance ---
  const getOptionAppearance = (option, currentQuestion) => {
    const isSelected = option === selectedAnswer;
    const isCorrect = option === currentQuestion?.answer;
    let viewStyles = [styles.optionViewBase];
    let textStyles = [styles.optionTextBase];
    if (showFeedback) {
      if (isCorrect) {
        viewStyles.push(styles.optionViewCorrect);
        textStyles.push(styles.optionTextFeedback);
      } else if (isSelected) {
        viewStyles.push(styles.optionViewIncorrect);
        textStyles.push(styles.optionTextFeedback);
      } else {
        viewStyles.push(styles.optionViewDisabled);
        textStyles.push(styles.optionTextDisabled);
      }
    } else {
      if (isSelected) {
        viewStyles.push(styles.optionViewSelected);
        textStyles.push(styles.optionTextSelected);
      } else {
        viewStyles.push(styles.optionViewDefault);
        textStyles.push(styles.optionTextDefault);
      }
    }
    return { viewStyles, textStyles };
  };

  // --- Dynamic Styling for Submit/Next Button ---
  const getNextButtonStyle = () => {
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

  // 1. Loading State
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

  // 2. Error State (Includes No Questions Found)
  if (error) {
    return (
      <LinearGradient
        colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
        style={styles.centered}
      >
        <PaperText style={styles.errorText}>{error}</PaperText>
        <PaperButton mode="contained" onPress={() => navigation.goBack()}>
          Go Back
        </PaperButton>
      </LinearGradient>
    );
  }

  // 3. Fallback checks (Should ideally not be reached if error state handles no questions)
  if (questions.length === 0 || questionIndex >= questions.length) {
    if (isNavigatingToResults.current) {
      return (
        <LinearGradient
          colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
          style={styles.centered}
        >
          <ActivityIndicator size="large" color={Colors.primaryWhite} />
        </LinearGradient>
      );
    }
    console.warn(
      `QuizScreen rendered with invalid state: questions.length=${questions.length}, index=${questionIndex}.`
    );
    return (
      <LinearGradient
        colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
        style={styles.centered}
      >
        <PaperText style={styles.infoText}>
          Loading quiz state or quiz finished.
        </PaperText>
        <PaperButton
          mode="contained"
          onPress={() => navigation.goBack()}
          style={{ marginTop: 15 }}
        >
          Go Back
        </PaperButton>
      </LinearGradient>
    );
  }

  // Data Integrity Check
  const currentQuestion = questions[questionIndex];
  if (!currentQuestion) {
    console.error(
      "QuizScreen Critical Error: currentQuestion is undefined despite checks."
    );
    return (
      <LinearGradient
        colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
        style={styles.centered}
      >
        <PaperText style={styles.errorText}>
          Critical Error: Could not load question data.
        </PaperText>
        <PaperButton mode="contained" onPress={() => navigation.goBack()}>
          Go Back
        </PaperButton>
      </LinearGradient>
    );
  }

  // Heuristic Check for centering
  const isLikelyShortContent =
    (currentQuestion?.question?.length || 0) < SHORT_QUESTION_THRESHOLD;

  // --- 6. Main Quiz UI ---
  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      <ScrollView
        style={styles.mainScroll}
        // VVV Changed from scrollContent
        contentContainerStyle={styles.mainScrollContentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <PaperText style={styles.progressText}>
          Question {questionIndex + 1} of {questions.length}
        </PaperText>

        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <PaperText style={styles.questionText}>
              {currentQuestion.question}
            </PaperText>
            {showFeedback && currentQuestion.explanation ? (
              <View style={styles.explanationContainer}>
                <Explanation explanationText={currentQuestion.explanation} />
              </View>
            ) : null}
          </Card.Content>
        </Card>

        <View
          style={[styles.spacer, isLikelyShortContent && styles.spacerLarge]}
        />

        <View style={styles.optionsContainer}>
          {(currentQuestion.options || []).map((option, index) => {
            const { viewStyles, textStyles } = getOptionAppearance(
              option,
              currentQuestion
            );
            return (
              <TouchableOpacity
                key={index}
                style={styles.optionTouchable}
                onPress={() => handleAnswer(option)}
                disabled={showFeedback}
                activeOpacity={0.7}
              >
                <View style={viewStyles}>
                  <Text style={textStyles}>{option}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PaperButton
          mode="contained"
          style={[styles.submitNextButtonBase, getNextButtonStyle()]}
          labelStyle={styles.nextButtonText}
          onPress={showFeedback ? handleNextQuestion : handleSubmit}
          disabled={!showFeedback && selectedAnswer === null}
          uppercase={false}
        >
          {showFeedback ? "Next" : "Check"}
        </PaperButton>
      </View>

      <ConfirmationModal
        visible={showLeaveConfirmModal}
        title="Leave Quiz? You'll lose One Star"
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
// VVV Restored Styles VVV
const styles = StyleSheet.create({
  // Layout
  container: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  mainScroll: { flex: 1, paddingHorizontal: 20 },
  mainScrollContentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingTop: 20,
    paddingBottom: 20,
  }, // Centering Styles
  footer: {
    padding: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.primaryLightGray,
  },

  // Components
  progressText: {
    fontSize: 16,
    color: Colors.primaryWhite,
    textAlign: "center",
    marginBottom: 15,
    fontFamily: "nunitoBold",
  },
  card: {
    backgroundColor: Colors.primaryWhite100,
    borderRadius: 12,
    minHeight: 120,
    justifyContent: "center",
  },
  cardContent: { paddingVertical: 15, paddingHorizontal: 10 },
  questionText: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: "center",
    color: Colors.blackText,
    fontFamily: "nunitoBold",
  },
  explanationContainer: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.primaryLightGray,
  },

  // Spacer Style
  spacer: { height: 15 },
  spacerLarge: { height: 40 }, // Applied conditionally

  // Options Styling
  optionsContainer: {}, // No extra style needed now
  optionTouchable: { marginVertical: 7 },
  optionViewBase: {
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    height: 75,
    paddingVertical: 5,
  },
  optionTextBase: {
    fontSize: 16,
    fontFamily: "nunitoBold",
    textAlign: "center",
  },
  optionViewDefault: {
    backgroundColor: Colors.primaryWhite100,
    borderColor: Colors.primaryDarkMaroon,
  },
  optionTextDefault: { color: Colors.blackText },
  optionViewSelected: {
    backgroundColor: Colors.primaryDarkMaroon,
    borderColor: Colors.primaryDarkMaroon,
  },
  optionTextSelected: { color: Colors.primaryWhite },
  optionViewCorrect: {
    backgroundColor: Colors.successGreen,
    borderColor: Colors.successGreen,
  },
  optionViewIncorrect: {
    backgroundColor: Colors.errorRed,
    borderColor: Colors.errorRed,
  },
  optionTextFeedback: { color: Colors.primaryWhite },
  optionViewDisabled: {
    backgroundColor: Colors.mediumGray,
    borderColor: Colors.darkGray,
    opacity: 0.7,
  },
  optionTextDisabled: { color: Colors.darkGray },

  // Submit/Next Button Styles
  submitNextButtonBase: { borderRadius: 25, paddingVertical: 8 },
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

  // Error/Info Text
  errorText: {
    color: "#FFBABA",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
  infoText: {
    color: Colors.primaryWhite,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
});
// --- End Restored Styles ---

export default QuizScreen;

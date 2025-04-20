// screens/quiz/QuizScreen.js (Final Version with Conditional Vertical Centering)

import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView, // Main content wrapper
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
const PASSING_SCORE_THRESHOLD = 1; // Example value
const SHORT_QUESTION_THRESHOLD = 80; //

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
        // Navigate to a screen indicating an error or back
        navigation.replace("DummyScreen", {
          // Replace with your error/fallback screen
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
              options: shuffleArray(q.options || []), // Shuffle options per question
            }));
            setQuestions(fQ);
            setError(null);
          } else {
            // Handle case where questions exist but are empty array
            setError("Quiz questions are not available yet for this topic.");
          }
          setIsLoading(false); // Stop loading once data is processed or error set
        }
      },
      (fetchError) => {
        // onError
        console.error("QuizScreen: Firestore listener error:", fetchError);
        if (isMounted.current) {
          setError(fetchError?.message || "Failed to load quiz questions.");
          setIsLoading(false);
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
  }, [quizContentId, navigation]); // Dependency includes navigation for replace action

  // --- Effect for Handling Navigation Away (Leave Prompt) ---
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      // Allow navigation if intentionally going to results OR if loading/error states active OR already leaving
      if (isNavigatingToResults.current || isLoading || error || isLeaving) {
        console.log(
          "Allowing navigation: To results, loading, error, or already leaving."
        );
        if (isNavigatingToResults.current) {
          // Reset flag if it was set for results navigation
          // No, keep it true until navigation actually happens in handleNextQuestion
        }
        return; // Do NOT prevent default
      }

      // Prevent default and show modal only if quiz is active and user initiates leave
      if (questions.length > 0 && questionIndex < questions.length) {
        console.log("User initiated leave during active quiz, showing modal.");
        e.preventDefault();
        setPendingNavigationAction(e.data.action); // Store the intended action
        setShowLeaveConfirmModal(true);
      } else {
        console.log("Allowing navigation: Quiz not active or finished.");
        // Quiz isn't active (no questions, or finished index), allow navigation
      }
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
    questions,
    questionIndex,
  ]); // Add dependencies

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
    // Allow selecting only if feedback is not being shown
    if (!showFeedback) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    // Prevent submission if no answer selected, loading, or feedback already shown
    if (selectedAnswer === null || isLoading || showFeedback) return;

    const q = questions[questionIndex];
    if (!q) {
      console.error("handleSubmit: current question is undefined!");
      return; // Should ideally not happen if questionIndex is valid
    }
    const correct = selectedAnswer === q.answer;
    setWasCorrect(correct); // Record if the selected answer was correct
    setShowFeedback(true); // Trigger feedback display
  };

  const handleNextQuestion = () => {
    // Prevent proceeding if feedback isn't shown or still loading
    if (!showFeedback || isLoading) return;

    // Increment score based on the correctness of the *just answered* question
    const scoreIncrement = wasCorrect ? 1 : 0;
    const nextIndex = questionIndex + 1;

    if (nextIndex < questions.length) {
      // Update score state *before* moving to the next question
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
      // Quiz finished normally
      // Calculate final score including the last question's result
      const finalScore = score + scoreIncrement;
      console.log(
        `Quiz finished normally. Final score calculated: ${finalScore}. Navigating to results.`
      );
      isNavigatingToResults.current = true; // Signal intentional navigation to results

      navigation.replace("QuizResult", {
        // Use replace to prevent going back to the quiz
        score: finalScore,
        totalQuestions: questions.length,
        topicId: quizContentId, // Pass topicId for context if needed on results screen
        passingScore: PASSING_SCORE_THRESHOLD, // Pass threshold if needed
        maxScore: questions.length, // Pass max possible score
      });
    }
  };

  const handleConfirmLeave = async () => {
    const currentQuizId = route?.params?.subtopicId || route?.params?.topicId;

    if (isLeaving || !pendingNavigationAction) return; // Prevent double execution

    if (!currentQuizId) {
      console.error(
        "handleConfirmLeave: Cannot penalize, quizContentId is missing."
      );
      setShowLeaveConfirmModal(false);
      // Just navigate without penalty if ID is missing
      if (pendingNavigationAction) navigation.dispatch(pendingNavigationAction);
      else navigation.goBack(); // Fallback if no action stored
      setPendingNavigationAction(null);
      return;
    }

    setShowLeaveConfirmModal(false);
    setIsLeaving(true); // Indicate leaving process has started
    try {
      console.log(
        `User confirmed leave. Calling penalizeQuizLeave for quizId: ${currentQuizId}...`
      );
      await penalizeQuizLeave({ quizId: currentQuizId }); // Pass the correct ID
      console.log("penalizeQuizLeave call finished.");
    } catch (error) {
      // Log error but proceed with navigation regardless
      console.error("Error calling penalizeQuizLeave:", error);
    } finally {
      console.log(
        "Dispatching stored navigation action after penalty attempt."
      );
      // Ensure navigation happens even if penalty fails
      if (pendingNavigationAction) {
        navigation.dispatch(pendingNavigationAction);
      } else {
        console.warn("No pending action found, navigating back.");
        navigation.goBack(); // Fallback navigation
      }
      setPendingNavigationAction(null); // Clean up stored action
      // No need to set isLeaving back to false, component will unmount
    }
  };

  const handleCancelLeave = () => {
    console.log("User cancelled leaving quiz.");
    setShowLeaveConfirmModal(false);
    setPendingNavigationAction(null); // Clear stored action
    setIsLeaving(false); // Reset leaving flag
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

  // Error State (Includes No Questions Found)
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

  // Handle cases where component might render briefly before navigation or data check completes fully
  if (questions.length === 0 || questionIndex >= questions.length) {
    // If navigation to results is in progress, show loader briefly
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
    // Otherwise, this might indicate an unexpected state or end of quiz before navigation action
    console.warn(
      `QuizScreen rendered with questions.length=${questions.length}, index=${questionIndex} unexpectedly.`
    );
    return (
      <LinearGradient
        colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
        style={styles.centered}
      >
        <PaperText style={styles.infoText}>Loading quiz state...</PaperText>
        {/* Provide a way out if stuck */}
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

  // Data Integrity Check (Should be redundant now but safe)
  const currentQuestion = questions[questionIndex];
  if (!currentQuestion) {
    return (
      <LinearGradient
        colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
        style={styles.centered}
      >
        <PaperText style={styles.errorText}>
          Critical Error: Could not load current question data.
        </PaperText>
        <PaperButton mode="contained" onPress={() => navigation.goBack()}>
          Go Back
        </PaperButton>
      </LinearGradient>
    );
  }

  // <<< Heuristic Check >>>
  const isLikelyShortContent =
    (currentQuestion?.question?.length || 0) < SHORT_QUESTION_THRESHOLD;

  // --- Main Quiz UI ---
  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      {/* Main Scrollable Content Area */}
      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={styles.mainScrollContentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Text */}
        <PaperText style={styles.progressText}>
          Question {questionIndex + 1} of {questions.length}
        </PaperText>

        {/* Question Card */}
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <PaperText style={styles.questionText}>
              {currentQuestion.question}
            </PaperText>
            {showFeedback && currentQuestion.explanation ? (
              <View style={styles.explanationContainer}>
                {/* Assuming Explanation component handles array/string */}
                <Explanation explanationText={currentQuestion.explanation} />
              </View>
            ) : null}
          </Card.Content>
        </Card>

        {/* <<< Conditionally Expanding Spacer >>> */}
        <View
          style={[
            styles.spacer, // Apply base height/margin
            isLikelyShortContent && styles.spacerLarge, // Apply larger height if heuristic matches
          ]}
        />

        {/* Options Area */}
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

      {/* Fixed Footer Area */}
      <View style={styles.footer}>
        <PaperButton
          mode="contained"
          style={[styles.submitNextButtonBase, getNextButtonStyle()]}
          labelStyle={styles.nextButtonText}
          onPress={showFeedback ? handleNextQuestion : handleSubmit}
          disabled={!showFeedback && selectedAnswer === null} // Disable Check if no answer; Next always enabled when shown
          uppercase={false}
        >
          {showFeedback ? "Next" : "Check"}
        </PaperButton>
      </View>

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
  // Layout
  container: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  mainScroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mainScrollContentContainer: {
    flexGrow: 1, // <<< Crucial for vertical centering
    justifyContent: "center", // <<< Crucial for vertical centering
    paddingTop: 20,
    paddingBottom: 20,
  },
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
    minHeight: 120, // Ensures card has some presence
    justifyContent: "center", // Centers Card.Content vertically
  },
  cardContent: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
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
  // <<< Spacer Style >>>
  spacer: {
    height: 15, // Ensure at least some minimum space always
  },
  spacerLarge: {
    // Increased height applied conditionally when content is likely short
    height: 40, // <<< Extra space (Adjust value as needed)
  },

  // Options Styling
  optionsContainer: {
    // No extra style needed now, just logical grouping
  },
  optionTouchable: {
    marginVertical: 7,
  },
  optionViewBase: {
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    height: 75, // Fixed height for uniformity
    paddingVertical: 5, // Minimal vertical padding with fixed height
  },
  optionTextBase: {
    fontSize: 16,
    fontFamily: "nunitoBold",
    textAlign: "center",
  },
  // Dynamic Option Styles (View Backgrounds/Borders & Text Colors)
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
  optionTextFeedback: { color: Colors.primaryWhite }, // For Correct/Incorrect Text
  optionViewDisabled: {
    backgroundColor: Colors.mediumGray,
    borderColor: Colors.darkGray,
    opacity: 0.7,
  },
  optionTextDisabled: { color: Colors.darkGray },

  // Submit/Next Button Styles
  submitNextButtonBase: {
    borderRadius: 25, // Match option radius
    paddingVertical: 8, // Adjust padding for Paper button visual height
    // No margin needed, footer provides spacing
  },
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

export default QuizScreen;

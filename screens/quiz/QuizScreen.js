// screens/quiz/QuizScreen.js

import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator, // Using react-native one for fallback loading state
  ScrollView,
  Platform,
  Text, // Standard Text for options
  TouchableOpacity, // Touchable for options
} from "react-native";
import {
  Button as PaperButton,
  Card,
  Text as PaperText,
  ActivityIndicator as PaperActivityIndicator, // Prefer Paper indicator
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import functions from "@react-native-firebase/functions";
import { useFocusEffect } from "@react-navigation/native";
// import { Colors } from "../../config/colors"; // <<< REMOVE
import { useTheme } from "../../context/ThemeContext"; // <<< ADD
import { listenToQuizQuestions } from "../../services/firestoreContentApi";
import Explanation from "../../components/quiz/Explanation"; // Assumed themed internally
import ConfirmationModal from "../../components/common/ConfirmationModel"; // Assumed themed internally

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
const SHORT_QUESTION_THRESHOLD = 80;

// --- Component ---
const QuizScreen = ({ route, navigation }) => {
  const { theme, isDark } = useTheme(); // <<< USE THEME HOOK

  // --- State & Refs (Logic remains the same) ---
  const quizContentId = route?.params?.quizContentId;
  const parentTopicIdForContext = route?.params?.parentTopicId;
  const passingScore = route?.params?.passingScore ?? PASSING_SCORE_THRESHOLD;
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
  const isNavigatingToResults = useRef(false);
  const isMounted = useRef(true);

  // --- Effects (Logic remains the same) ---
  useEffect(() => {
    // Mount/Unmount tracking
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Fetching Questions
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
      if (isMounted.current) {
        setError("No quiz specified.");
        setIsLoading(false);
      }
      return;
    }
    const unsubscribe = listenToQuizQuestions(
      quizContentId,
      (fetchedQuestions) => {
        if (isMounted.current) {
          if (fetchedQuestions?.length > 0) {
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
            setError("Quiz questions are not available yet for this topic.");
          }
          setIsLoading(false);
        }
      },
      (fetchError) => {
        if (isMounted.current) {
          setError(fetchError?.message || "Failed to load quiz questions.");
          setIsLoading(false);
        }
      }
    );
    return () => unsubscribe();
  }, [quizContentId]);

  useEffect(() => {
    // Navigation Leave Listener
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (isNavigatingToResults.current || isLoading || error || isLeaving)
        return;
      e.preventDefault();
      setPendingNavigationAction(e.data.action);
      setShowLeaveConfirmModal(true);
    });
    return unsubscribe;
  }, [navigation, isLoading, error, isLeaving, pendingNavigationAction]);

  useFocusEffect(
    // Hide/Show Tab Bar - Now includes theme for restoring style
    useCallback(() => {
      const parentNav = navigation.getParent();
      if (parentNav) {
        parentNav.setOptions({
          tabBarStyle: { display: "none" },
          tabBarVisible: false,
        }); // Hide
      } else {
        try {
          navigation.setOptions({ tabBarStyle: { display: "none" } });
        } catch (err) {
          /*ignore*/
        }
      }
      return () => {
        // Cleanup function
        if (parentNav) {
          parentNav.setOptions({
            tabBarStyle: {
              // Restore themed style
              display: "flex",
              backgroundColor: theme.tabBarBackground, // <<< Themed restore
              borderTopColor: theme.border, // <<< Themed restore
              // Add other original styles if needed (e.g., height)
            },
            // tabBarVisible: true, // Only for older nav versions
          });
        } else {
          try {
            navigation.setOptions({ tabBarStyle: { display: "flex" } });
          } catch (err) {
            /*ignore*/
          }
        }
      };
    }, [navigation, theme]) // <<< Added theme dependency
  );

  // --- Handlers (Logic remains the same) ---
  const handleAnswer = (answer) => {
    if (!showFeedback) setSelectedAnswer(answer);
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
    const scoreInc = wasCorrect ? 1 : 0;
    const currentScore = score;
    const nextIndex = questionIndex + 1;
    if (nextIndex < questions.length) {
      if (scoreInc > 0) setScore((s) => s + scoreInc);
      setQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      setWasCorrect(null);
      setShowFeedback(false);
    } else {
      const finalScore = currentScore + scoreInc;
      isNavigatingToResults.current = true;
      navigation.replace("QuizResult", {
        score: finalScore,
        totalQuestions: questions.length,
        quizId: quizContentId,
        parentTopicId: parentTopicIdForContext,
        passingScore: passingScore,
        maxScore: questions.length,
      });
    }
  };
  const handleConfirmLeave = async () => {
    if (isLeaving || !pendingNavigationAction) return;
    const contentId = route?.params?.quizContentId;
    if (!contentId) {
      setShowLeaveConfirmModal(false);
      if (pendingNavigationAction) navigation.dispatch(pendingNavigationAction);
      else navigation.goBack();
      return;
    }
    setShowLeaveConfirmModal(false);
    setIsLeaving(true);
    try {
      await penalizeQuizLeave({ quizId: contentId });
    } catch (error) {
      console.error("Error penalizing:", error);
    } finally {
      if (pendingNavigationAction) navigation.dispatch(pendingNavigationAction);
      else navigation.goBack();
    }
  };
  const handleCancelLeave = () => {
    setShowLeaveConfirmModal(false);
    setPendingNavigationAction(null);
    setIsLeaving(false);
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
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
          justifyContent: "flex-start", // Align items to the start to allow growth from top
          paddingTop: 20,
          paddingBottom: 20,
        },
        footer: {
          padding: 20,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: theme.border || "#cccccc",
        }, // Themed border

        // Components
        progressText: {
          fontSize: 16,
          color: isDark
            ? theme.primaryWhite || "#FFFFFF"
            : theme.primary || "#3b0940",
          textAlign: "center",
          marginBottom: 15,
          fontFamily: "nunitoBold",
        },
        card: {
          backgroundColor: theme.cardBackground || "#f0f0f0", // Themed card bg
          borderRadius: 12,
          minHeight: 120,
          justifyContent: "flex-start", // Allow content to grow from the start
          marginBottom: 10, // Add margin below card
          elevation: 2, // Add subtle elevation
          shadowColor: theme.shadowColor,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        },
        cardContent: { paddingVertical: 15, paddingHorizontal: 10 },
        questionText: {
          fontSize: 18,
          lineHeight: 28,
          textAlign: "center",
          color: theme.textPrimary, // Themed text on card
          fontFamily: "nunitoBold",
        },
        questionTextShrunk: {
          // New style for shrunk question text
          fontSize: 12, // Adjust the size as needed
          lineHeight: 18, // Adjust the line height accordingly
          textAlign: "center",
          color: theme.textSecondary, // Maybe use a slightly less prominent color
          fontFamily: "nunitoBold",
        },
        explanationContainer: {
          marginTop: 15,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: theme.border || "#cccccc", // Themed border
        },

        // Spacer Style
        spacer: { height: 15 },
        spacerLarge: { height: 40 },

        // Options Styling
        optionsContainer: { marginTop: 10 }, // Add margin above options
        optionTouchable: { marginVertical: 7 },
        optionViewBase: {
          borderWidth: 1,
          borderRadius: 25,
          paddingHorizontal: 15,
          // alignItems: "center", // REMOVED
          // justifyContent: "center", // REMOVED
          minHeight: 50, // REMOVED fixed height
          paddingVertical: 12, // Increased vertical padding
        },
        optionTextBase: {
          fontSize: 16,
          fontFamily: "nunitoBold",
          textAlign: "center", // Keep if you want centered text within the option
        },
        // Default State
        optionViewDefault: {
          backgroundColor: theme.cardBackground,
          borderColor: theme.primary,
        },
        optionTextDefault: { color: theme.textPrimary },
        // Selected State
        optionViewSelected: {
          backgroundColor: theme.primary,
          borderColor: theme.primary,
        },
        optionTextSelected: {
          color: theme.textOnPrimary || theme.primaryWhite,
        },
        // Correct State
        optionViewCorrect: {
          backgroundColor: theme.success,
          borderColor: theme.success,
        },
        // Incorrect State
        optionViewIncorrect: {
          backgroundColor: theme.warning,
          borderColor: theme.warning,
        },
        // Feedback Text (Correct/Incorrect)
        optionTextFeedback: {
          color: theme.textOnPrimary || theme.primaryWhite,
        },
        // Disabled State
        optionViewDisabled: {
          backgroundColor: theme.disabledBackground || theme.placeholder,
          borderColor: theme.disabledBorder || theme.border,
          opacity: 0.7,
        },
        optionTextDisabled: {
          color: theme.textDisabled || theme.textSecondary,
        },

        // Submit/Next Button Styles
        submitNextButtonBase: {
          borderRadius: 25,
          paddingVertical: 8,
          width: "100%", // Make button fill footer width
          borderWidth: 1, // Add border width
          // Set border color conditionally based on theme mode
          borderColor: isDark
            ? (theme.textOnPrimary || theme.primaryWhite || "#FFFFFF") + "80"
            : "transparent", // Light semi-transparent border in dark mode, transparent in light
        },
        nextButtonText: {
          // color: theme.textOnPrimary || theme.primaryWhite,
          fontSize: 18,
          fontFamily: "nunitoBold",
        },
        // Background color keys (used by getNextButtonColor)
        submitButtonBg: theme.primary,
        submitButtonDisabledBg: theme.disabledBackground || theme.placeholder,
        nextButtonCorrectBg: theme.success,
        nextButtonIncorrectBg: theme.warning,

        // Error/Info Text
        errorText: {
          color: theme.warning || "#FFBABA",
          fontSize: 16,
          textAlign: "center",
          marginBottom: 15,
        },
        infoText: {
          color: theme.textPrimaryOnGradient || theme.primaryWhite,
          fontSize: 16,
          textAlign: "center",
          marginBottom: 15,
        },
      }),
    [theme, isDark]
  );

  // --- Helper Function for Option Appearance (using themed styles) ---
  const getOptionAppearance = useCallback(
    (option, currentQuestion) => {
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
      // Depend on styles object now as it contains theme values
    },
    [selectedAnswer, showFeedback, styles]
  );

  // --- Dynamic Styling for Submit/Next Button (using theme colors from styles) ---
  const getNextButtonColor = useCallback(() => {
    if (!showFeedback) {
      return selectedAnswer === null
        ? styles.submitButtonDisabledBg
        : styles.submitButtonBg;
    } else {
      return wasCorrect
        ? styles.nextButtonCorrectBg
        : styles.nextButtonIncorrectBg;
    }
    // Depend on styles object now as it contains theme values
  }, [showFeedback, selectedAnswer, wasCorrect, styles]);

  // --- RENDER LOGIC ---
  // 1. Loading State
  if (isLoading) {
    return (
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientEnd]}
        style={styles.centered}
      >
        <PaperActivityIndicator
          animating={true}
          size="large"
          color={theme.primaryWhite || "#FFFFFF"}
        />
      </LinearGradient>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientEnd]}
        style={styles.centered}
      >
        <PaperText style={styles.errorText}>{error}</PaperText>
        <PaperButton
          mode="contained"
          buttonColor={theme.accent}
          textColor={theme.buttonText}
          onPress={() => navigation.goBack()}
        >
          Go Back
        </PaperButton>
      </LinearGradient>
    );
  }

  // 3. Fallback/No Questions checks
  if (questions.length === 0 || questionIndex >= questions.length) {
    if (isNavigatingToResults.current) {
      return (
        <LinearGradient
          colors={[theme.gradientStart, theme.gradientEnd]}
          style={styles.centered}
        >
          <ActivityIndicator
            size="large"
            color={theme.primaryWhite || "#FFFFFF"}
          />
        </LinearGradient>
      );
    }
    return (
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientEnd]}
        style={styles.centered}
      >
        <PaperText style={styles.infoText}>
          Loading quiz state or quiz finished.
        </PaperText>
        <PaperButton
          mode="contained"
          buttonColor={theme.accent}
          textColor={theme.buttonText}
          onPress={() => navigation.goBack()}
          style={{ marginTop: 15 }}
        >
          Go Back
        </PaperButton>
      </LinearGradient>
    );
  }
  const currentQuestion = questions[questionIndex];
  if (!currentQuestion) {
    return (
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientEnd]}
        style={styles.centered}
      >
        <PaperText style={styles.errorText}>
          Critical Error: Could not load question data.
        </PaperText>
        <PaperButton
          mode="contained"
          buttonColor={theme.accent}
          textColor={theme.buttonText}
          onPress={() => navigation.goBack()}
        >
          Go Back
        </PaperButton>
      </LinearGradient>
    );
  }

  const isLikelyShortContent =
    (currentQuestion?.question?.length || 0) < SHORT_QUESTION_THRESHOLD;

  // --- 6. Main Quiz UI ---
  return (
    <LinearGradient
      colors={[theme.gradientStart, theme.gradientEnd]}
      style={styles.container}
    >
      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={styles.mainScrollContentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Progress text uses themed style */}
        <PaperText style={styles.progressText}>
          Question {questionIndex + 1} of {questions.length}
        </PaperText>
        {/* Card uses themed style */}
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            {/* Question text uses themed style */}
            <PaperText
              style={
                showFeedback ? styles.questionTextShrunk : styles.questionText
              }
            >
              {currentQuestion.question}
            </PaperText>
            {/* Explanation uses themed container style; assumes Explanation component is themed */}
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
          {/* Options mapping uses themed styles via getOptionAppearance */}
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
      {/* Footer uses themed style */}
      <View style={styles.footer}>
        {/* Button uses themed styles via props and getNextButtonColor */}
        <PaperButton
          mode="contained"
          style={styles.submitNextButtonBase} // Base style includes width: 100%
          labelStyle={{
            // Combine font/size AND color here
            fontSize: 18,
            fontFamily: "nunitoBold",
            color: theme.textOnPrimary || theme.primaryWhite || "#FFFFFF", // Apply themed color HERE
          }}
          buttonColor={getNextButtonColor()} // Themed background color
          textColor={theme.textOnPrimary || theme.primaryWhite || "#FFFFFF"}
          onPress={showFeedback ? handleNextQuestion : handleSubmit}
          disabled={!showFeedback && selectedAnswer === null}
          uppercase={false}
        >
          {showFeedback ? "Next" : "Check"}
        </PaperButton>
      </View>
      <ConfirmationModal // Assumed themed internally
        visible={showLeaveConfirmModal}
        title="Leave Quiz? You'll lose One Star"
        onCancel={handleCancelLeave}
        onConfirm={handleConfirmLeave}
        confirmText="Leave"
        cancelText="Stay"
      />
    </LinearGradient>
  );
};

export default QuizScreen;

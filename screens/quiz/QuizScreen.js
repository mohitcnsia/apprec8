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
  ActivityIndicator as RNActivityIndicator,
  ScrollView,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback, // For triple-tap
} from "react-native";
import {
  Button as PaperButton,
  Card,
  Text as PaperText,
  ActivityIndicator as PaperActivityIndicator,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import functions from "@react-native-firebase/functions";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import { listenToQuizQuestions } from "../../services/firestoreContentApi";
import Explanation from "../../components/quiz/Explanation";
import ConfirmationModal from "../../components/common/ConfirmationModel";
import FeedbackFAB from "../../components/common/FeedbackFAB"; // Adjust path if needed

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
const TRIPLE_TAP_DELAY = 300; // Max delay between taps for a triple tap sequence (milliseconds)

// --- Component ---
const QuizScreen = ({ route, navigation }) => {
  const { theme, isDark } = useTheme();

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
  const [showExplanation, setShowExplanation] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [showLeaveConfirmModal, setShowLeaveConfirmModal] = useState(false);
  const [pendingNavigationAction, setPendingNavigationAction] = useState(null);
  const isNavigatingToResults = useRef(false);
  const isMounted = useRef(true);

  // --- State and Refs for FAB Manual Toggle (Triple Tap) ---
  const [isFabRevealedByGesture, setIsFabRevealedByGesture] = useState(false); // FAB starts hidden
  const tapCountRef = useRef(0);
  const lastTapTimestampRef = useRef(0);
  const tapTimerRef = useRef(null); // Timer to reset tap count for triple-tap sequence

  // When explanation appears/disappears or question changes, reset FAB gesture state
  useEffect(() => {
    console.log(
      `[QuizScreen] Effect for showExplanation/questionIndex. showExplanation: ${showExplanation}, questionIndex: ${questionIndex}. Resetting isFabRevealedByGesture to false.`
    );
    setIsFabRevealedByGesture(false); // FAB is hidden by default for any new explanation context
    tapCountRef.current = 0; // Reset tap count
    clearTimeout(tapTimerRef.current); // Clear any pending tap reset timer
  }, [showExplanation, questionIndex]); // Resets when explanation state changes or new question

  // Handler for screen presses to detect triple-tap for FAB toggle
  const handleScreenPressForFabToggle = () => {
    // <<< RENAMED FUNCTION DEFINITION
    // Only allow toggling if an explanation is currently visible (FAB context is active)
    if (!showExplanation) {
      tapCountRef.current = 0; // Reset tap count if tapped when explanation not shown
      return;
    }

    const now = Date.now();
    clearTimeout(tapTimerRef.current); // Clear previous reset timer

    // If taps are too far apart (more than 2*delay), reset the tap sequence entirely
    if (
      tapCountRef.current > 0 &&
      now - lastTapTimestampRef.current > TRIPLE_TAP_DELAY * 2
    ) {
      console.log("[QuizScreen] Tap sequence timed out, resetting count.");
      tapCountRef.current = 0;
    }

    tapCountRef.current += 1;
    lastTapTimestampRef.current = now;
    console.log(`[QuizScreen] Tap recorded. Count: ${tapCountRef.current}`);

    if (tapCountRef.current === 3) {
      console.log(
        "[QuizScreen] Triple-tap detected! Toggling FAB revealed state."
      );
      setIsFabRevealedByGesture((prev) => !prev);
      tapCountRef.current = 0; // Reset count after successful triple-tap action
    } else {
      // Set a timer to reset tapCount if triple tap is not completed quickly enough
      tapTimerRef.current = setTimeout(() => {
        console.log(
          "[QuizScreen] Tap sequence incomplete, resetting tap count."
        );
        tapCountRef.current = 0;
      }, TRIPLE_TAP_DELAY * 2); // Allow time for up to 2 more taps in sequence
    }
  };

  // Cleanup tap timer on component unmount
  useEffect(() => {
    return () => clearTimeout(tapTimerRef.current);
  }, []);

  // --- Original Effects ---
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setQuestions([]);
    setQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setWasCorrect(null);
    setShowExplanation(false);
    setIsLeaving(false);
    setPendingNavigationAction(null);
    setShowLeaveConfirmModal(false);
    isNavigatingToResults.current = false;
    setIsFabRevealedByGesture(false); // Ensure FAB is hidden when a new quiz loads

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
          if (fetchedQuestions && fetchedQuestions.length > 0) {
            let sQ = shuffleArray(fetchedQuestions);
            const c = Math.min(sQ.length, MAX_QUESTIONS);
            const selQ = sQ.slice(0, c);
            const fQ = selQ.map((q, index) => ({
              ...q,
              id: q.id || `${quizContentId}_q${index}`,
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
    useCallback(() => {
      const parentNav = navigation.getParent();
      if (parentNav) {
        parentNav.setOptions({
          tabBarStyle: { display: "none" },
          tabBarVisible: false,
        });
      } else {
        try {
          navigation.setOptions({ tabBarStyle: { display: "none" } });
        } catch (err) {
          /*ignore*/
        }
      }
      return () => {
        if (parentNav) {
          parentNav.setOptions({
            tabBarStyle: {
              display: "flex",
              backgroundColor: theme.tabBarBackground,
              borderTopColor: theme.border,
            },
          });
        } else {
          try {
            navigation.setOptions({ tabBarStyle: { display: "flex" } });
          } catch (err) {
            /*ignore*/
          }
        }
      };
    }, [navigation, theme])
  );

  // --- Original Handlers ---
  const handleAnswer = (answer) => {
    if (!showExplanation) setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || isLoading || showExplanation) return;
    const q = questions[questionIndex];
    if (!q) return;
    const correct = selectedAnswer === q.answer;
    setWasCorrect(correct);
    setShowExplanation(true); // This allows FAB to be revealed by triple-tap
  };

  const handleNextQuestion = () => {
    if (!showExplanation || isLoading) return;
    const scoreInc = wasCorrect ? 1 : 0;
    const currentScoreVal = score;
    const nextIndex = questionIndex + 1;
    if (nextIndex < questions.length) {
      if (scoreInc > 0) setScore((s) => s + scoreInc);
      setQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      setWasCorrect(null);
      setShowExplanation(false); // Hides explanation, FAB will also be hidden
    } else {
      const finalScore = currentScoreVal + scoreInc;
      isNavigatingToResults.current = true;
      setShowExplanation(false); // Hides explanation, FAB will also be hidden
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
      setShowExplanation(false); // Hides explanation, FAB will also be hidden
      if (pendingNavigationAction) navigation.dispatch(pendingNavigationAction);
      else navigation.goBack();
    }
  };

  const handleCancelLeave = () => {
    setShowLeaveConfirmModal(false);
    setPendingNavigationAction(null);
    setIsLeaving(false);
  };

  // --- Styles ---
  const styles = useMemo(
    () =>
      StyleSheet.create({
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
          justifyContent: "flex-start",
          paddingTop: 20,
          paddingBottom: 80,
        },
        footer: {
          padding: 20,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: theme.border || "#cccccc",
        },
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
          backgroundColor: theme.cardBackground || "#f0f0f0",
          borderRadius: 12,
          minHeight: 120,
          justifyContent: "center",
          marginBottom: 10,
          elevation: 2,
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
          color: theme.textPrimary,
          fontFamily: "nunitoBold",
        },
        questionTextShrunk: {
          fontSize: 12,
          lineHeight: 18,
          textAlign: "center",
          color: theme.textSecondary,
          fontFamily: "nunitoBold",
        },
        explanationContainer: {
          marginTop: 15,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: theme.border || "#cccccc",
        },
        spacer: { height: 15 },
        spacerLarge: { height: 40 },
        optionsContainer: { marginTop: 10 },
        optionTouchable: { marginVertical: 7 },
        optionViewBase: {
          borderWidth: 1,
          borderRadius: 25,
          paddingHorizontal: 15,
          justifyContent: "center",
          minHeight: 75,
          paddingVertical: 12,
        }, // Your updated minHeight
        optionTextBase: {
          fontSize: 16,
          fontFamily: "nunitoBold",
          textAlign: "center",
        },
        optionViewDefault: {
          backgroundColor: theme.cardBackground,
          borderColor: theme.primary,
        },
        optionTextDefault: { color: theme.textPrimary },
        optionViewSelected: {
          backgroundColor: theme.primary,
          borderColor: theme.primary,
        },
        optionTextSelected: {
          color: theme.textOnPrimary || theme.primaryWhite,
        },
        optionViewCorrect: {
          backgroundColor: theme.success,
          borderColor: theme.success,
        },
        optionViewIncorrect: {
          backgroundColor: theme.warning,
          borderColor: theme.warning,
        },
        optionTextFeedback: {
          color: theme.textOnPrimary || theme.primaryWhite,
        },
        optionViewDisabled: {
          backgroundColor: theme.disabledBackground || theme.placeholder,
          borderColor: theme.disabledBorder || theme.border,
          opacity: 0.7,
        },
        optionTextDisabled: {
          color: theme.textDisabled || theme.textSecondary,
        },
        submitNextButtonBase: {
          borderRadius: 25,
          paddingVertical: 8,
          width: "100%",
          borderWidth: 1,
          borderColor: isDark
            ? (theme.textOnPrimary || theme.primaryWhite || "#FFFFFF") + "80"
            : "transparent",
        },
        nextButtonText: { fontSize: 18, fontFamily: "nunitoBold" },
        submitButtonBg: theme.primary,
        submitButtonDisabledBg: theme.disabledBackground || theme.placeholder,
        nextButtonCorrectBg: theme.success,
        nextButtonIncorrectBg: theme.warning,
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

  // --- Helper Functions for Option Appearance ---
  const getOptionAppearance = useCallback(
    (option, currentQ) => {
      const isSelected = option === selectedAnswer;
      const isCorrect = option === currentQ?.answer;
      let viewStyles = [styles.optionViewBase];
      let textStyles = [styles.optionTextBase];
      if (showExplanation) {
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
    },
    [selectedAnswer, showExplanation, styles]
  );

  const getNextButtonColor = useCallback(() => {
    if (!showExplanation) {
      return selectedAnswer === null
        ? styles.submitButtonDisabledBg
        : styles.submitButtonBg;
    } else {
      return wasCorrect
        ? styles.nextButtonCorrectBg
        : styles.nextButtonIncorrectBg;
    }
  }, [showExplanation, selectedAnswer, wasCorrect, styles]);

  // --- RENDER LOGIC ---
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

  const currentQuizQuestion = questions[questionIndex];

  if (!isLoading && !currentQuizQuestion) {
    // Simplified check if no current question when not loading
    if (isNavigatingToResults.current) {
      return (
        <LinearGradient
          colors={[theme.gradientStart, theme.gradientEnd]}
          style={styles.centered}
        >
          <RNActivityIndicator
            size="large"
            color={theme.primaryWhite || "#FFFFFF"}
          />
        </LinearGradient>
      );
    }
    const message =
      !questions || questions.length === 0
        ? "Quiz questions are not available yet for this topic."
        : "Loading quiz state or quiz finished.";
    return (
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientEnd]}
        style={styles.centered}
      >
        <PaperText style={styles.infoText}>{message}</PaperText>
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

  const feedbackContext =
    currentQuizQuestion && showExplanation
      ? {
          type: "question",
          id: currentQuizQuestion.id,
          parentId: quizContentId,
          titlePreview: currentQuizQuestion.question
            ? currentQuizQuestion.question.substring(0, 70)
            : "N/A",
        }
      : null;

  const isLikelyShortContent =
    (currentQuizQuestion?.question?.length || 0) < SHORT_QUESTION_THRESHOLD;

  // Determine final FAB visibility:
  const fabShouldActuallyBeVisible =
    showExplanation && isFabRevealedByGesture && !!feedbackContext;

  return (
    <TouchableWithoutFeedback
      onPress={handleScreenPressForFabToggle}
      accessible={false}
    >
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientEnd]}
        style={styles.container}
      >
        {currentQuizQuestion && (
          <>
            <ScrollView
              style={styles.mainScroll}
              contentContainerStyle={styles.mainScrollContentContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <PaperText style={styles.progressText}>
                Question {questionIndex + 1} of {questions.length}
              </PaperText>
              <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                  <PaperText
                    style={
                      showExplanation && currentQuizQuestion.explanation
                        ? styles.questionTextShrunk
                        : styles.questionText
                    }
                  >
                    {currentQuizQuestion.question}
                  </PaperText>
                  {showExplanation && currentQuizQuestion.explanation ? (
                    <View style={styles.explanationContainer}>
                      <Explanation
                        explanationText={currentQuizQuestion.explanation}
                      />
                    </View>
                  ) : null}
                </Card.Content>
              </Card>
              <View
                style={[
                  styles.spacer,
                  isLikelyShortContent && styles.spacerLarge,
                ]}
              />
              <View style={styles.optionsContainer}>
                {(currentQuizQuestion.options || []).map((option, index) => {
                  const { viewStyles, textStyles } = getOptionAppearance(
                    option,
                    currentQuizQuestion
                  );
                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.optionTouchable}
                      onPress={() => handleAnswer(option)}
                      disabled={showExplanation}
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
                style={styles.submitNextButtonBase}
                labelStyle={{
                  fontSize: 18,
                  fontFamily: "nunitoBold",
                  color: theme.textOnPrimary || theme.primaryWhite || "#FFFFFF",
                }}
                buttonColor={getNextButtonColor()}
                textColor={
                  theme.textOnPrimary || theme.primaryWhite || "#FFFFFF"
                }
                onPress={showExplanation ? handleNextQuestion : handleSubmit}
                disabled={!showExplanation && selectedAnswer === null}
                uppercase={false}
              >
                {showExplanation ? "Next" : "Check"}
              </PaperButton>
            </View>
          </>
        )}

        <ConfirmationModal
          visible={showLeaveConfirmModal}
          title="Leave Quiz? You'll lose One Star"
          onCancel={handleCancelLeave}
          onConfirm={handleConfirmLeave}
          confirmText="Leave"
          cancelText="Stay"
        />

        {/* FeedbackFAB: Render if context is valid, visibility controlled by gesture during explanation */}
        {showExplanation &&
          currentQuizQuestion && ( // Only mount if explanation is shown for a valid question
            <FeedbackFAB
              contentContext={feedbackContext} // feedbackContext will be valid here because of the outer condition
              visible={isFabRevealedByGesture} // Actual visibility toggle by gesture
            />
          )}
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default QuizScreen;

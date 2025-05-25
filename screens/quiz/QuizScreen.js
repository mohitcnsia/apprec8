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
  PanResponder,
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
import FeedbackFAB from "../../components/common/FeedbackFAB";

const penalizeQuizLeave = functions().httpsCallable("penalizeQuizLeave");

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
const SHORT_QUESTION_THRESHOLD = 80;

const TRIPLE_TAP_INTERVAL = 300;
const TRIPLE_TAP_RESET_TIMEOUT = 400;
const TAP_SLOP_THRESHOLD = 10;
const TAP_ZONE_SIZE = 80;

const QuizScreen = ({ route, navigation }) => {
  const { theme, isDark } = useTheme();
  const C = theme.appColors || theme;

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

  const [isFabRevealedByGesture, setIsFabRevealedByGesture] = useState(false);
  const tapCountRef = useRef(0);
  const lastTapTimestampRef = useRef(0);
  const gestureTimerRef = useRef(null);
  const showExplanationRef = useRef(showExplanation);

  useEffect(() => {
    showExplanationRef.current = showExplanation;
  }, [showExplanation]);

  useEffect(() => {
    setIsFabRevealedByGesture(false);
    tapCountRef.current = 0;
    clearTimeout(gestureTimerRef.current);
  }, [showExplanation, questionIndex]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      clearTimeout(gestureTimerRef.current);
    };
  }, []);

  const cornerTapPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        return showExplanationRef.current;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (!showExplanationRef.current) return false;
        return (
          Math.abs(gestureState.dx) < TAP_SLOP_THRESHOLD &&
          Math.abs(gestureState.dy) < TAP_SLOP_THRESHOLD
        );
      },
      onPanResponderGrant: (evt, gestureState) => {
        // console.log("[QuizScreen CornerTap] Granted to Zone");
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (!showExplanationRef.current) {
          tapCountRef.current = 0;
          clearTimeout(gestureTimerRef.current);
          return;
        }
        if (
          Math.abs(gestureState.dx) < TAP_SLOP_THRESHOLD &&
          Math.abs(gestureState.dy) < TAP_SLOP_THRESHOLD
        ) {
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
            setIsFabRevealedByGesture((prev) => !prev);
            tapCountRef.current = 0;
          } else if (tapCountRef.current > 0) {
            gestureTimerRef.current = setTimeout(() => {
              tapCountRef.current = 0;
            }, TRIPLE_TAP_RESET_TIMEOUT);
          }
        } else {
          tapCountRef.current = 0;
          clearTimeout(gestureTimerRef.current);
        }
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // console.log('[QuizScreen CornerTap] Terminated, resetting tap count.');
        tapCountRef.current = 0;
        clearTimeout(gestureTimerRef.current);
      },
      onPanResponderTerminationRequest: (evt, gestureState) => {
        // console.log('[QuizScreen CornerTap] Termination requested. Yielding.');
        return true;
      },
    })
  ).current;

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
    setIsFabRevealedByGesture(false);

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
        parentNav.setOptions({ tabBarStyle: { display: "none" } });
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
              backgroundColor: C.tabBarBackground,
              borderTopColor: C.border,
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
    }, [navigation, C.tabBarBackground, C.border])
  );

  const handleAnswer = (answer) => {
    if (!showExplanation) setSelectedAnswer(answer);
  };
  const handleSubmit = () => {
    if (selectedAnswer === null || isLoading || showExplanation) return;
    const q = questions[questionIndex];
    if (!q) return;
    const correct = selectedAnswer === q.answer;
    setWasCorrect(correct);
    setShowExplanation(true);
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
      setShowExplanation(false);
    } else {
      const finalScore = currentScoreVal + scoreInc;
      isNavigatingToResults.current = true;
      setShowExplanation(false);
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
      setShowExplanation(false);
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
        rootContainer: { flex: 1 },
        gradientContainer: { flex: 1 },
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
          borderTopColor: C.border || "#cccccc",
          backgroundColor: "transparent",
        },
        progressText: {
          fontSize: 16,
          color: isDark ? C.primaryWhite || "#FFFFFF" : C.primary || "#3b0940",
          textAlign: "center",
          marginBottom: 15,
          fontFamily: "nunitoBold",
        },
        card: {
          backgroundColor: C.cardBackground || "#f0f0f0",
          borderRadius: 12,
          minHeight: 120,
          justifyContent: "center",
          marginBottom: 10,
          elevation: 2,
          shadowColor: C.shadowColor,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        },
        cardContent: { paddingVertical: 15, paddingHorizontal: 10 },
        questionText: {
          fontSize: 18,
          lineHeight: 28,
          textAlign: "center",
          color: C.textPrimary,
          fontFamily: "nunitoBold",
        },
        questionTextShrunk: {
          fontSize: 12,
          lineHeight: 18,
          textAlign: "center",
          color: C.textSecondary,
          fontFamily: "nunitoBold",
        },
        explanationContainer: {
          marginTop: 15,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: C.border || "#cccccc",
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
        },
        optionTextBase: {
          fontSize: 16,
          fontFamily: "nunitoBold",
          textAlign: "center",
        },
        optionViewDefault: {
          backgroundColor: C.cardBackground,
          borderColor: C.primary,
        },
        optionTextDefault: { color: C.textPrimary },
        optionViewSelected: {
          backgroundColor: C.primary,
          borderColor: C.primary,
        },
        optionTextSelected: { color: C.textOnPrimary || C.primaryWhite },
        optionViewCorrect: {
          backgroundColor: C.success,
          borderColor: C.success,
        },
        optionViewIncorrect: {
          backgroundColor: C.warning,
          borderColor: C.warning,
        },
        optionTextFeedback: { color: C.textOnPrimary || C.primaryWhite },
        optionViewDisabled: {
          backgroundColor: C.disabledBackground || C.placeholder,
          borderColor: C.disabledBorder || C.border,
          opacity: 0.7,
        },
        optionTextDisabled: { color: C.textDisabled || C.textSecondary },
        submitNextButtonBase: {
          borderRadius: 25,
          paddingVertical: 8,
          width: "100%",
          borderWidth: 1,
          borderColor: isDark
            ? (C.textOnPrimary || C.primaryWhite || "#FFFFFF") + "80"
            : "transparent",
        },
        submitButtonBg: C.primary,
        submitButtonDisabledBg: C.disabledBackground || C.placeholder,
        nextButtonCorrectBg: C.success,
        nextButtonIncorrectBg: C.warning,
        errorText: {
          color: C.warning || "#FFBABA",
          fontSize: 16,
          textAlign: "center",
          marginBottom: 15,
        },
        infoText: {
          color: C.textPrimaryOnGradient || C.primaryWhite,
          fontSize: 16,
          textAlign: "center",
          marginBottom: 15,
        },
        tripleTapZone: {
          position: "absolute",
          bottom: 10,
          right: 10,
          width: TAP_ZONE_SIZE,
          height: TAP_ZONE_SIZE,
          // zIndex: 10, // Removed zIndex
          // borderColor: "red",
          // borderWidth: 2,
          // borderStyle: "dashed",
        },
      }),
    [C, isDark]
  );

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

  if (isLoading) {
    return (
      <LinearGradient
        colors={[C.gradientStart, C.gradientEnd]}
        style={styles.centered}
      >
        <PaperActivityIndicator
          animating={true}
          size="large"
          color={C.primaryWhite || "#FFFFFF"}
        />
      </LinearGradient>
    );
  }
  if (error) {
    return (
      <LinearGradient
        colors={[C.gradientStart, C.gradientEnd]}
        style={styles.centered}
      >
        <PaperText style={styles.errorText}>{error}</PaperText>
        <PaperButton
          mode="contained"
          buttonColor={C.accent}
          textColor={C.buttonText}
          onPress={() => navigation.goBack()}
        >
          Go Back
        </PaperButton>
      </LinearGradient>
    );
  }
  const currentQuizQuestion = questions[questionIndex];
  if (!isLoading && !currentQuizQuestion) {
    if (isNavigatingToResults.current) {
      return (
        <LinearGradient
          colors={[C.gradientStart, C.gradientEnd]}
          style={styles.centered}
        >
          <RNActivityIndicator
            size="large"
            color={C.primaryWhite || "#FFFFFF"}
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
        colors={[C.gradientStart, C.gradientEnd]}
        style={styles.centered}
      >
        <PaperText style={styles.infoText}>{message}</PaperText>
        <PaperButton
          mode="contained"
          buttonColor={C.accent}
          textColor={C.buttonText}
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
  const isFabContextActive = showExplanation && currentQuizQuestion;

  return (
    <View style={styles.rootContainer}>
      <LinearGradient
        colors={[C.gradientStart, C.gradientEnd]}
        style={styles.gradientContainer}
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
                  color: C.textOnPrimary || C.primaryWhite || "#FFFFFF",
                }}
                buttonColor={getNextButtonColor()}
                textColor={C.textOnPrimary || C.primaryWhite || "#FFFFFF"}
                onPress={showExplanation ? handleNextQuestion : handleSubmit}
                disabled={!showExplanation && selectedAnswer === null}
                uppercase={false}
              >
                {showExplanation ? "Next" : "Check"}
              </PaperButton>
            </View>
          </>
        )}
      </LinearGradient>

      {isFabContextActive && (
        <View
          style={styles.tripleTapZone}
          {...cornerTapPanResponder.panHandlers}
        />
      )}

      <ConfirmationModal
        visible={showLeaveConfirmModal}
        title="Leave Quiz? You'll lose One Star"
        onCancel={handleCancelLeave}
        onConfirm={handleConfirmLeave}
        confirmText="Leave"
        cancelText="Stay"
      />

      {isFabContextActive && (
        <FeedbackFAB
          contentContext={feedbackContext}
          visible={isFabRevealedByGesture}
        />
      )}
    </View>
  );
};

export default QuizScreen;

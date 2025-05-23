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
import { useTheme } from "../../context/ThemeContext";
import { listenToQuizQuestions } from "../../services/firestoreContentApi";
import Explanation from "../../components/quiz/Explanation";
import ConfirmationModal from "../../components/common/ConfirmationModel";
import FeedbackFAB from "../../components/common/FeedbackFAB"; // <<< ADDED IMPORT (Adjust path if needed)

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
  const { theme, isDark } = useTheme();

  const quizContentId = route?.params?.quizContentId; // This is the ID for the whole quiz
  const parentTopicIdFromParams = route?.params?.parentTopicId; // Context for the quiz itself
  const passingScore = route?.params?.passingScore ?? PASSING_SCORE_THRESHOLD;
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [wasCorrect, setWasCorrect] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false); // This state indicates if explanation is shown
  const [isLeaving, setIsLeaving] = useState(false);
  const [showLeaveConfirmModal, setShowLeaveConfirmModal] = useState(false);
  const [pendingNavigationAction, setPendingNavigationAction] = useState(null);
  const isNavigatingToResults = useRef(false);
  const isMounted = useRef(true);

  // --- Effects ---
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
              // Ensure 'id' exists on question, or use another unique identifier.
              // If 'id' comes from Firestore, it's usually the document ID.
              id: q.id || q.question, // Fallback to question text if no ID, adjust as per your data
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

  // --- Handlers ---
  const handleAnswer = (answer) => {
    if (!showFeedback) setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || isLoading || showFeedback) return;
    const q = questions[questionIndex];
    if (!q) return;
    const correct = selectedAnswer === q.answer;
    setWasCorrect(correct);
    setShowFeedback(true); // This will show the explanation and make FeedbackFAB relevant
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
      setShowFeedback(false); // Hide explanation for next question
    } else {
      const finalScore = currentScore + scoreInc;
      isNavigatingToResults.current = true;
      navigation.replace("QuizResult", {
        score: finalScore,
        totalQuestions: questions.length,
        quizId: quizContentId,
        parentTopicId: parentTopicIdFromParams,
        passingScore: passingScore,
        maxScore: questions.length,
      });
    }
  };
  const handleConfirmLeave = async () => {
    // ... (logic remains same)
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
    // ... (logic remains same)
    setShowLeaveConfirmModal(false);
    setPendingNavigationAction(null);
    setIsLeaving(false);
  };

  const stylesFromTheme = useMemo(
    // Renamed to avoid conflict if styles is used elsewhere
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
          paddingBottom: 20,
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
          minHeight: 50,
          paddingVertical: 12,
        }, // minHeight adjusted
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
        // nextButtonText: { fontSize: 18, fontFamily: "nunitoBold" }, // Covered by labelStyle
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

  const getOptionAppearance = useCallback(
    (option, currentQ) => {
      // currentQ instead of currentQuestion to avoid naming conflict
      const isSelected = option === selectedAnswer;
      const isCorrect = option === currentQ?.answer;
      let viewStyles = [stylesFromTheme.optionViewBase];
      let textStyles = [stylesFromTheme.optionTextBase];
      if (showFeedback) {
        if (isCorrect) {
          viewStyles.push(stylesFromTheme.optionViewCorrect);
          textStyles.push(stylesFromTheme.optionTextFeedback);
        } else if (isSelected) {
          viewStyles.push(stylesFromTheme.optionViewIncorrect);
          textStyles.push(stylesFromTheme.optionTextFeedback);
        } else {
          viewStyles.push(stylesFromTheme.optionViewDisabled);
          textStyles.push(stylesFromTheme.optionTextDisabled);
        }
      } else {
        if (isSelected) {
          viewStyles.push(stylesFromTheme.optionViewSelected);
          textStyles.push(stylesFromTheme.optionTextSelected);
        } else {
          viewStyles.push(stylesFromTheme.optionViewDefault);
          textStyles.push(stylesFromTheme.optionTextDefault);
        }
      }
      return { viewStyles, textStyles };
    },
    [selectedAnswer, showFeedback, stylesFromTheme] // Use stylesFromTheme
  );

  const getNextButtonColor = useCallback(() => {
    if (!showFeedback) {
      return selectedAnswer === null
        ? stylesFromTheme.submitButtonDisabledBg
        : stylesFromTheme.submitButtonBg;
    } else {
      return wasCorrect
        ? stylesFromTheme.nextButtonCorrectBg
        : stylesFromTheme.nextButtonIncorrectBg;
    }
  }, [showFeedback, selectedAnswer, wasCorrect, stylesFromTheme]); // Use stylesFromTheme

  // --- RENDER LOGIC ---
  if (isLoading) {
    return (
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientEnd]}
        style={stylesFromTheme.centered}
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
        style={stylesFromTheme.centered}
      >
        <PaperText style={stylesFromTheme.errorText}>{error}</PaperText>
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

  const currentQuestion = questions[questionIndex]; // Defined here for use in FAB and main render

  if (questions.length === 0 || !currentQuestion) {
    // Combined checks
    if (isNavigatingToResults.current) {
      return (
        <LinearGradient
          colors={[theme.gradientStart, theme.gradientEnd]}
          style={stylesFromTheme.centered}
        >
          <ActivityIndicator
            size="large"
            color={theme.primaryWhite || "#FFFFFF"}
          />
        </LinearGradient>
      );
    }
    const message =
      questions.length === 0 && !isLoading
        ? "Quiz questions are not available yet for this topic."
        : "Loading quiz state or quiz finished.";
    return (
      <LinearGradient
        colors={[theme.gradientStart, theme.gradientEnd]}
        style={stylesFromTheme.centered}
      >
        <PaperText style={stylesFromTheme.infoText}>
          {currentQuestion
            ? "Critical Error: Could not load question data."
            : message}
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

  const isLikelyShortContent =
    (currentQuestion?.question?.length || 0) < SHORT_QUESTION_THRESHOLD;

  // Prepare contentContext for FeedbackFAB, only if currentQuestion is available
  const feedbackContext = currentQuestion
    ? {
        type: "question",
        // Ensure currentQuestion.id is the correct unique identifier for the question
        id: currentQuestion.id || `question_${questionIndex}`, // Fallback if .id is not present
        parentId: quizContentId, // ID of the overall quiz
        titlePreview: currentQuestion.question
          ? currentQuestion.question.substring(0, 70)
          : "N/A",
      }
    : null;

  return (
    <LinearGradient
      colors={[theme.gradientStart, theme.gradientEnd]}
      style={stylesFromTheme.container}
    >
      <ScrollView
        style={stylesFromTheme.mainScroll}
        contentContainerStyle={stylesFromTheme.mainScrollContentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <PaperText style={stylesFromTheme.progressText}>
          Question {questionIndex + 1} of {questions.length}
        </PaperText>
        <Card style={stylesFromTheme.card}>
          <Card.Content style={stylesFromTheme.cardContent}>
            <PaperText
              style={
                showFeedback && currentQuestion.explanation
                  ? stylesFromTheme.questionTextShrunk
                  : stylesFromTheme.questionText
              }
            >
              {currentQuestion.question}
            </PaperText>
            {showFeedback && currentQuestion.explanation ? (
              <View style={stylesFromTheme.explanationContainer}>
                <Explanation explanationText={currentQuestion.explanation} />
              </View>
            ) : null}
          </Card.Content>
        </Card>
        <View
          style={[
            stylesFromTheme.spacer,
            isLikelyShortContent && stylesFromTheme.spacerLarge,
          ]}
        />
        <View style={stylesFromTheme.optionsContainer}>
          {(currentQuestion.options || []).map((option, index) => {
            const { viewStyles, textStyles } = getOptionAppearance(
              option,
              currentQuestion
            );
            return (
              <TouchableOpacity
                key={index}
                style={stylesFromTheme.optionTouchable}
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
      <View style={stylesFromTheme.footer}>
        <PaperButton
          mode="contained"
          style={stylesFromTheme.submitNextButtonBase}
          labelStyle={{
            fontSize: 18,
            fontFamily: "nunitoBold",
            color: theme.textOnPrimary || theme.primaryWhite || "#FFFFFF",
          }}
          buttonColor={getNextButtonColor()}
          textColor={theme.textOnPrimary || theme.primaryWhite || "#FFFFFF"} // Redundant with labelStyle but good for Paper
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
        onCancel={handleCancelLeave}
        onConfirm={handleConfirmLeave}
        confirmText="Leave"
        cancelText="Stay"
      />
      {/* ADDED FeedbackFAB - Render only if context can be formed */}
      {feedbackContext && (
        <FeedbackFAB contentContext={feedbackContext} bottomOffset={75} />
      )}
    </LinearGradient>
  );
};

export default QuizScreen;

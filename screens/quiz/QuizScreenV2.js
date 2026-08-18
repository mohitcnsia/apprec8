/**
 * @file QuizScreenV2.js
 * @description The main UI for the V2 Quiz. It now passes final score data
 * to the generic ResultsScreen and lets it handle the UI logic.
 */
import React, { useEffect, useMemo } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Button as PaperButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from "../../context/ThemeContext";
import { useQuizEngine } from "../../hooks/useQuizEngine";
import { useSoundEffects } from "../../hooks/useSoundEffects";
import QuestionCard from "../../components/quiz/QuestionCard";
import Option from "../../components/quiz/Option";

const QuizScreenV2 = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const C = theme.appColors || theme;
  const { quiz, mode, isFirstAttempt } = route.params;

  const { state, dispatch } = useQuizEngine(quiz, mode, isFirstAttempt);
  const { status, questions, error, currentIndex, score, lives } = state;
  const { playSuccess, playFailure } = useSoundEffects();

  /**
   * DOCUMENTATION:
   * This hook runs when the quiz engine's status changes.
   * When the status becomes "finished", we prepare the data for the ResultsScreen.
   *
   * THE CHANGE:
   * The "Exit" button's onPress action is modified. Instead of just going back,
   * it now navigates specifically to "QuestMap" and passes a parameter
   * called `completedQuizId`. This is the signal the Quest Map will listen for.
   */
  useEffect(() => {
    if (status === "finished") {
      let maxPossibleScore;
      if (mode === "exam") {
        maxPossibleScore = 10;
      } else {
        maxPossibleScore = questions.reduce(
          (sum, q) => sum + (q.stars || 10),
          0,
        );
      }
      
      const isPerfectScore = score >= maxPossibleScore; // In exam, it can be 15 which is >= 10

      const resultParams = {
        title: "Quiz Complete!",
        message: "Great effort, {username}!",
        finalScore: score,
        maxPossibleScore: mode === "exam" && isFirstAttempt ? 15 : maxPossibleScore,
        missedQuestions: state.missedQuestions || [],
        metrics: [
          {
            label: "Final Score",
            value: `${score} / ${mode === "exam" && isFirstAttempt ? 15 : maxPossibleScore} Stars`,
          },
        ],
        actions: [
          {
            label: "Play Again",
            onPress: () => navigation.replace("QuizScreenV2", { quiz, mode }),
            mode: "contained",
          },
          {
            label: "Exit",
            onPress: () =>
              navigation.navigate("QuestMap", {
                completedQuizId: (mode === "exam" && score >= maxPossibleScore) ? quiz.id : null,
              }),
            mode: "outlined",
          },
        ],
        effects: { confetti: isPerfectScore },
        submissionContext: mode === "training" ? null : {
          // UnComment this
          cloudFunctionName: "recordQuizResult",
          /// And delete this///
          // cloudFunctionName: "DelteMeLater",
          ///////
          payload: {
            quizId: quiz.id,
            scoreAchieved: score,
            maxScore: maxPossibleScore,
            mode,
            passingScore: 0,
          },
        },
        feedbackContext: { type: "quiz_v2_overall", id: quiz.id },
      };

      navigation.replace("ResultsScreen", resultParams);
    }
  }, [status, navigation, questions, score, quiz, mode]);

  const handleContinueToExplanation = () => {
    const currentQuestion = questions[currentIndex];
    const isLastQuestion = currentIndex === questions.length - 1;
    navigation.navigate("Explanation", {
      explanation: currentQuestion.explanation,
      isCorrect: state.wasCorrect,
      isLastQuestion: isLastQuestion,
      quizId: quiz.id,
      questionId: currentQuestion.id,
      onNext: () => dispatch({ type: "NEXT_QUESTION" }),
    });
    // dispatch({ type: "NEXT_QUESTION" });
  };

  const handleCheckAnswer = async () => {
    if (!state.selectedAnswer) return;
    const isCorrect = state.selectedAnswer.isCorrect;
    const currentQuestion = questions[currentIndex];
    
    if (isCorrect) {
      playSuccess();
    } else {
      playFailure();
    }
    dispatch({ type: "CHECK_ANSWER" });

    // Update Local Question Analytics
    try {
      const statsKey = `quizStats_${quiz.id}`;
      const statsJson = await AsyncStorage.getItem(statsKey);
      let stats = statsJson ? JSON.parse(statsJson) : {};
      
      const qStats = stats[currentQuestion.id] || { seen: 0, correct: 0, wrong: 0 };
      qStats.seen += 1;
      if (isCorrect) {
        qStats.correct += 1;
      } else {
        qStats.wrong += 1;
      }
      stats[currentQuestion.id] = qStats;
      await AsyncStorage.setItem(statsKey, JSON.stringify(stats));
    } catch (e) {
      console.warn("Failed to save local question stats:", e);
    }
  };

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
        errorText: {
          color: C.warning,
          fontSize: 16,
          textAlign: "center",
          marginBottom: 15,
        },
        scrollableContainer: { flex: 1 },
        scrollContent: { flexGrow: 1, padding: 15, paddingTop: 60, paddingBottom: Math.max(40, insets.bottom + 20) },
        footer: { padding: 15, paddingTop: 5, paddingBottom: Math.max(40, insets.bottom + 20), backgroundColor: "transparent" },
        progressText: {
          color: C.textOnPrimary || "white",
          fontSize: 16,
          textAlign: "center",
          marginBottom: 15,
          fontFamily: "nunitoBold",
        },
        reviewItem: {
          padding: 15,
          marginVertical: 8,
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "transparent",
        },
        reviewItemMarked: { borderColor: C.accent || "#1CB0F6" },
        reviewQuestionText: {
          fontFamily: "nunitoBold",
          fontSize: 16,
          color: C.textOnPrimary || "white",
          marginBottom: 12,
        },
        reviewOptionContainer: {
          marginVertical: 4,
          padding: 10,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.2)",
        },
        reviewOptionContainerSelected: {
          backgroundColor: C.primary || "#58CC02",
        },
        reviewOptionText: {
          fontFamily: "nunito",
          color: "rgba(255,255,255,0.8)",
        },
        reviewOptionTextSelected: { fontFamily: "nunitoBold", color: "white" },
        markButton: {
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1,
          padding: 5,
        },
        headerRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 15,
        },
        progressBarContainer: {
          flex: 1,
          height: 12,
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: 6,
          marginRight: 15,
          overflow: 'hidden',
        },
        progressBarFill: {
          height: '100%',
          backgroundColor: '#58CC02', // Duolingo Green
        },
        heartsContainer: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        heartsText: {
          color: '#FF4B4B',
          fontFamily: 'nunitoBold',
          fontSize: 18,
          marginLeft: 5,
        },
        footerCorrect: {
          backgroundColor: 'rgba(88, 204, 2, 0.9)', // Green tint
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
        footerIncorrect: {
          backgroundColor: 'rgba(255, 75, 75, 0.9)', // Red tint
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
        feedbackText: {
          color: 'white',
          fontFamily: 'nunitoBold',
          fontSize: 20,
          marginBottom: 10,
        },
      }),
    [C, insets.bottom],
  );

  const renderContent = () => {
    const currentQuestion = questions[currentIndex];
    switch (status) {
      case "loading":
      case "error":
      case "ready": {
        const titleColor = {
          color: C.textOnPrimary || "white",
          fontSize: 22,
          textAlign: "center",
          marginBottom: 20,
          fontFamily: "nunitoBold",
        };
        return (
          <View style={styles.centered}>
            {status === "loading" && (
              <ActivityIndicator
                animating={true}
                size="large"
                color="#FFFFFF"
              />
            )}
            {status === "error" && (
              <Text style={styles.errorText}>{error}</Text>
            )}
            {status === "ready" && <Text style={titleColor}>{quiz.title}</Text>}
            <PaperButton
              mode="contained"
              onPress={() =>
                status === "ready"
                  ? dispatch({ type: "START_QUIZ" })
                  : navigation.goBack()
              }
            >
              {status === "ready" ? `Start ${mode}` : "Go Back"}
            </PaperButton>
          </View>
        );
      }
      case "failed": {
        const titleColor = {
          color: "#FF4B4B",
          fontSize: 24,
          textAlign: "center",
          marginBottom: 10,
          fontFamily: "nunitoBold",
        };
        return (
          <View style={styles.centered}>
            <Ionicons name="heart-dislike" size={64} color="#FF4B4B" style={{marginBottom: 20}} />
            <Text style={titleColor}>Out of Hearts!</Text>
            <Text style={[styles.progressText, {marginBottom: 30}]}>Don't worry, mistakes help you learn.</Text>
            <PaperButton
              mode="contained"
              buttonColor="#FF4B4B"
              onPress={() => dispatch({ type: "RESTART_QUIZ" })}
            >
              Try Again
            </PaperButton>
            <PaperButton
              mode="outlined"
              style={{marginTop: 15}}
              textColor="white"
              onPress={() => navigation.goBack()}
            >
              Quit
            </PaperButton>
          </View>
        );
      }
      case "answering": {
        if (!currentQuestion) return null;
        const isMarkedForReview = state.markedForReview.includes(
          currentQuestion.id,
        );
        return (
          <View style={styles.scrollableContainer}>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.headerRow}>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBarFill, { width: `${(currentIndex / questions.length) * 100}%` }]} />
                </View>
                {mode === "training" && (
                  <View style={styles.heartsContainer}>
                    <Ionicons name="heart" size={24} color="#FF4B4B" />
                    <Text style={styles.heartsText}>{lives}</Text>
                  </View>
                )}
              </View>
              {mode === "exam" && (
                <TouchableOpacity
                  style={styles.markButton}
                  onPress={() =>
                    dispatch({
                      type: "TOGGLE_MARK_FOR_REVIEW",
                      payload: { questionId: currentQuestion.id },
                    })
                  }
                >
                  <Ionicons
                    name={isMarkedForReview ? "flag" : "flag-outline"}
                    size={28}
                    color={isMarkedForReview ? C.accent : "white"}
                  />
                </TouchableOpacity>
              )}
              <QuestionCard question={currentQuestion} />
              
              {/* Spacer to push options to the bottom (Thumb Zone) */}
              <View style={{ flex: 1 }} />

              <View style={{ marginTop: 10, paddingBottom: 10 }}>
                {currentQuestion.options.map((option, index) => (
                  <Option
                    key={index}
                    option={option}
                    onPress={() => {
                      if (mode === "training") {
                        dispatch({
                          type: "SELECT_ANSWER",
                          payload: { selectedOption: option },
                        });
                      } else {
                        dispatch({
                          type: "ANSWER_AND_ADVANCE",
                          payload: {
                            questionId: currentQuestion.id,
                            selectedOption: option,
                          },
                        });
                      }
                    }}
                    isSelected={state.selectedAnswer?.content === option.content}
                    showFeedback={state.showFeedback}
                    isCorrect={option.isCorrect}
                  />
                ))}
              </View>
            </ScrollView>
            {mode === "training" && (
              <View style={[styles.footer, state.showFeedback && (state.wasCorrect ? styles.footerCorrect : styles.footerIncorrect)]}>
                {state.showFeedback && (
                  <Text style={styles.feedbackText}>
                    {state.wasCorrect ? "Excellent!" : "Not quite!"}
                  </Text>
                )}
                <PaperButton
                  mode="contained"
                  disabled={!state.selectedAnswer}
                  buttonColor={state.showFeedback ? (state.wasCorrect ? 'white' : 'white') : C.primary}
                  textColor={state.showFeedback ? (state.wasCorrect ? '#58CC02' : '#FF4B4B') : 'white'}
                  onPress={
                    state.showFeedback
                      ? handleContinueToExplanation
                      : handleCheckAnswer
                  }
                >
                  {state.showFeedback ? "Continue" : "Check"}
                </PaperButton>
              </View>
            )}
          </View>
        );
      }
      case "reviewing": {
        return (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.progressText}>Review Your Answers</Text>
            {questions.map((q, index) => {
              const isMarked = state.markedForReview.includes(q.id);
              const userAnswer = state.userAnswers[q.id];
              return (
                <TouchableOpacity
                  key={q.id}
                  style={[
                    styles.reviewItem,
                    isMarked && styles.reviewItemMarked,
                  ]}
                  onPress={() =>
                    dispatch({ type: "GO_TO_QUESTION", payload: { index } })
                  }
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    {isMarked && (
                      <Ionicons
                        name="flag"
                        size={18}
                        color={C.accent}
                        style={{ marginRight: 8 }}
                      />
                    )}
                    <Text style={styles.reviewQuestionText}>{`Question ${
                      index + 1
                    }: ${q.question.content}`}</Text>
                  </View>
                  {q.options.map((opt, optIndex) => (
                    <View
                      key={optIndex}
                      style={[
                        styles.reviewOptionContainer,
                        opt.content === userAnswer &&
                          styles.reviewOptionContainerSelected,
                      ]}
                    >
                      <Text
                        style={
                          opt.content === userAnswer
                            ? styles.reviewOptionTextSelected
                            : styles.reviewOptionText
                        }
                      >
                        {opt.content}
                      </Text>
                    </View>
                  ))}
                </TouchableOpacity>
              );
            })}
            <PaperButton
              mode="contained"
              style={{ marginTop: 20 }}
              onPress={() => dispatch({ type: "SUBMIT_EXAM", payload: { isFirstAttempt } })}
            >
              Submit Exam
            </PaperButton>
          </ScrollView>
        );
      }
      default:
        return (
          <View style={styles.centered}>
            <ActivityIndicator animating={true} size="large" color="#FFFFFF" />
          </View>
        );
    }
  };

  return (
    <LinearGradient
      colors={[C.gradientStart, C.gradientEnd]}
      style={{ flex: 1 }}
    >
      {renderContent()}
    </LinearGradient>
  );
};

export default QuizScreenV2;

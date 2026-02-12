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

import { useTheme } from "../../context/ThemeContext";
import { useQuizEngine } from "../../hooks/useQuizEngine";
import QuestionCard from "../../components/quiz/QuestionCard";
import Option from "../../components/quiz/Option";

const QuizScreenV2 = ({ route, navigation }) => {
  const { theme } = useTheme();
  const C = theme.appColors || theme;
  const { quiz, mode } = route.params;

  const { state, dispatch } = useQuizEngine(quiz, mode);
  const { status, questions, error, currentIndex, score } = state;

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
      const maxPossibleScore = questions.reduce(
        (sum, q) => sum + (q.stars || 10),
        0,
      );
      const isPerfectScore = maxPossibleScore > 0 && score === maxPossibleScore;

      const resultParams = {
        title: "Quiz Complete!",
        message: "Great effort, {username}!",
        finalScore: score,
        maxPossibleScore: maxPossibleScore,
        metrics: [
          {
            label: "Final Score",
            value: `${score} / ${maxPossibleScore} Stars`,
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
                completedQuizId: quiz.id,
              }),
            mode: "outlined",
          },
        ],
        effects: { confetti: isPerfectScore },
        submissionContext: {
          // UnComment this
          // cloudFunctionName: "recordQuizResult",
          /// And delete this///
          cloudFunctionName: "DelteMeLater",
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
      // onContinue: () => dispatch({ type: "NEXT_QUESTION" }),
      onNext: () => dispatch({ type: "NEXT_QUESTION" }),
    });
    // dispatch({ type: "NEXT_QUESTION" });
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
        scrollContent: { flexGrow: 1, padding: 15, paddingTop: 60 },
        footer: { padding: 15, paddingTop: 5, backgroundColor: "transparent" },
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
      }),
    [C],
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
              <Text style={styles.progressText}>
                Question {currentIndex + 1} of {questions.length}
              </Text>
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
            </ScrollView>
            {mode === "training" && (
              <View style={styles.footer}>
                <PaperButton
                  mode="contained"
                  disabled={!state.selectedAnswer}
                  onPress={
                    state.showFeedback
                      ? handleContinueToExplanation
                      : () => dispatch({ type: "CHECK_ANSWER" })
                  }
                >
                  {state.showFeedback ? "Continue to Explanation" : "Check"}
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
              onPress={() => dispatch({ type: "SUBMIT_EXAM" })}
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

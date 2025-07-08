import React, { useEffect, useMemo, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import {
  ActivityIndicator as PaperActivityIndicator,
  Button as PaperButton,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

// --- Import the new hook and custom components ---
import { useQuizEngine } from "../../hooks/useQuizEngine";
import QuestionCard from "../../components/quiz/QuestionCard";
import Option from "../../components/quiz/Option";

/**
 * The main UI component for the V2 Quiz experience.
 * It uses the useQuizEngine hook to manage state and focuses only on rendering.
 * @param {object} props
 * @param {object} props.route - React Navigation route object.
 * @param {object} props.navigation - React Navigation navigation object.
 */
const QuizScreenV2 = ({ route, navigation }) => {
  const { theme } = useTheme();
  const C = theme.appColors || theme;
  const { quiz, mode } = route.params;

  // All complex logic is now handled by this single hook
  const { state, dispatch } = useQuizEngine(quiz, mode);
  const { status, questions, error, currentIndex } = state;

  const confettiRef = useRef(null);

  useEffect(() => {
    if (status === "finished") {
      confettiRef.current?.play();
    }
  }, [status]);

  const handleContinueToExplanation = () => {
    const currentQuestion = questions[currentIndex];
    const isLastQuestion = currentIndex === questions.length - 1;
    // Navigate to the explanation screen
    navigation.navigate("Explanation", {
      explanation: currentQuestion.explanation,
      isCorrect: state.wasCorrect,
      isLastQuestion: isLastQuestion,
    });
    // Dispatch the action to advance the quiz state *after* navigating
    dispatch({ type: "NEXT_QUESTION" });
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
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
        quizContainer: {
          flexGrow: 1,
          padding: 15,
          paddingTop: 60,
          paddingBottom: 120,
        },
        footer: { padding: 15, paddingTop: 5, backgroundColor: "transparent" },
        progressText: {
          color: C.textOnPrimary || "white",
          fontSize: 16,
          textAlign: "center",
          marginBottom: 15,
          fontFamily: "nunitoBold",
        },
        resultsContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        },
        resultsTitle: {
          fontSize: 24,
          fontFamily: "nunitoBold",
          color: C.textOnPrimary || "white",
          marginBottom: 20,
        },
        resultsText: {
          fontSize: 18,
          fontFamily: "nunito",
          color: C.textOnPrimary || "white",
          marginBottom: 10,
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
        lottieOverlay: {
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: 10,
          pointerEvents: "none",
        },
      }),
    [C]
  );

  const renderContent = () => {
    // This function is now much cleaner, only responsible for UI
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
              <PaperActivityIndicator
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
          currentQuestion.id
        );
        return (
          <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.quizContainer}>
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
          <ScrollView contentContainerStyle={styles.quizContainer}>
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
      case "finished": {
        return (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Quiz Complete!</Text>
            <Text style={styles.resultsText}>Your Score: {state.score}</Text>
            <PaperButton
              mode="contained"
              style={{ marginTop: 20 }}
              onPress={() => dispatch({ type: "RESTART_QUIZ" })}
            >
              Play Again
            </PaperButton>
            <PaperButton
              mode="text"
              style={{ marginTop: 10 }}
              labelStyle={{ color: "white" }}
              onPress={() => navigation.popToTop()}
            >
              Finish
            </PaperButton>
          </View>
        );
      }
      default:
        return null;
    }
  };

  return (
    <LinearGradient
      colors={[C.gradientStart, C.gradientEnd]}
      style={{ flex: 1 }}
    >
      {renderContent()}
      {status === "finished" && (
        <LottieView
          ref={confettiRef}
          source={require("../../assets/animations/confetti.json")}
          loop={false}
          autoPlay={false}
          style={styles.lottieOverlay}
        />
      )}
    </LinearGradient>
  );
};

export default QuizScreenV2;

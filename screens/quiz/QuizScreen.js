// screens/quiz/QuizScreen.js (Using showFeedback state)

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import {
  Button,
  Card,
  Text as PaperText,
  ActivityIndicator as PaperActivityIndicator,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../config/colors";
import { listenToQuizQuestions } from "../../services/firestoreContentApi";
import Explanation from "../../components/quiz/Explanation";

const shuffleArray = (array) => {
  /* ... (shuffle function) ... */
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};
const MAX_QUESTIONS = 5;

const QuizScreen = ({ route, navigation }) => {
  const { topicId } = route.params;
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  // const [isAnswered, setIsAnswered] = useState(false); // We'll derive this implicitly or use showFeedback
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [wasCorrect, setWasCorrect] = useState(null); // null | true | false
  const [showFeedback, setShowFeedback] = useState(false); // *** NEW STATE ***

  // --- useEffect to listen for Firestore quiz questions ---
  useEffect(() => {
    if (!topicId) {
      setError("No topic specified...");
      setIsLoading(false);
      return;
    }
    // Reset all state when topicId changes
    setIsLoading(true);
    setError(null);
    setQuestions([]);
    setQuestionIndex(0);
    setScore(0); //isAnswered=false implicitly via showFeedback=false
    setSelectedAnswer(null);
    setWasCorrect(null);
    setShowFeedback(false);

    let isMounted = true;
    const unsubscribe = listenToQuizQuestions(
      topicId,
      (fetchedQuestions) => {
        if (isMounted) {
          if (fetchedQuestions && fetchedQuestions.length > 0) {
            // ... (process questions: shuffle, slice, map options) ...
            let shuffledQuestions = shuffleArray(fetchedQuestions);
            const count = Math.min(shuffledQuestions.length, MAX_QUESTIONS);
            const selectedQuestions = shuffledQuestions.slice(0, count);
            const finalQuestions = selectedQuestions.map((q) => ({
              ...q,
              options: shuffleArray(q.options || []),
            }));
            setQuestions(finalQuestions);
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
          setError("Could not load quiz questions.");
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

  // --- Handlers ---
  const handleAnswer = (answer) => {
    // Only allow selection if feedback isn't being shown
    if (!showFeedback) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return; // No answer selected
    console.log(">>> handleSubmit START");
    const currentQuestion = questions[questionIndex];
    const correct = selectedAnswer === currentQuestion?.answer;
    setWasCorrect(correct); // Set correctness
    setShowFeedback(true); // *** Trigger feedback display ***
    console.log(
      `<<< handleSubmit END - Called setShowFeedback(true), wasCorrect=${correct}`
    );
  };

  const handleNextQuestion = () => {
    if (!showFeedback) return; // Should only be callable when feedback is shown
    console.log(">>> handleNextQuestion START");
    // Update score based on the feedback shown
    if (wasCorrect) {
      setScore((prevScore) => prevScore + 1);
    }
    // Move to next question or results
    const nextIndex = questionIndex + 1;
    if (nextIndex < questions.length) {
      setQuestionIndex(nextIndex);
      // Reset state for the next question
      setSelectedAnswer(null);
      setWasCorrect(null);
      setShowFeedback(false); // Hide feedback for the next question
    } else {
      // Quiz finished
      const finalScore = score + (wasCorrect ? 1 : 0); // Include last question score
      navigation.replace("QuizResult", {
        score: finalScore,
        totalQuestions: questions.length,
        topicId: topicId,
      });
    }
    console.log("<<< handleNextQuestion END");
  };

  // --- Dynamic Styling ---
  // getButtonStyle depends on showFeedback now
  const getButtonStyle = (option) => {
    const currentQuestion = questions[questionIndex];
    console.log(
      `getButtonStyle: option=<span class="math-inline">\{option\}, showFeedback\=</span>{showFeedback}, selected=<span class="math-inline">\{selectedAnswer\}, correct\=</span>{currentQuestion?.answer}`
    );
    if (!currentQuestion) return styles.optionButton;
    if (showFeedback) {
      // Check showFeedback instead of isAnswered
      if (option === currentQuestion.answer) return styles.correctAnswerButton;
      if (option === selectedAnswer) return styles.incorrectAnswerButton;
      return styles.disabledAnswerButton;
    } else {
      return selectedAnswer === option
        ? styles.selectedAnswerButton
        : styles.optionButton;
    }
  };
  // getNextButtonStyle depends on showFeedback now
  const getNextButtonStyle = () => {
    if (!showFeedback)
      // Check showFeedback instead of isAnswered
      return selectedAnswer === null
        ? styles.submitButtonDisabled
        : styles.submitButton;
    else
      return wasCorrect ? styles.nextButtonCorrect : styles.nextButtonIncorrect;
  };

  // --- Render Logic ---
  if (isLoading) {
    /* ... loading indicator ... */ return (
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
    /* ... error message ... */ return (
      <LinearGradient
        colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
        style={styles.centered}
      >
        <PaperText style={styles.errorText}>{error}</PaperText>
      </LinearGradient>
    );
  }
  if (questions.length === 0 || questionIndex >= questions.length) {
    /* ... no questions message ... */ return (
      <LinearGradient
        colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
        style={styles.centered}
      >
        <PaperText style={styles.infoText}>
          {error ? error : "No questions available."}
        </PaperText>
      </LinearGradient>
    );
  }

  const currentQuestion = questions[questionIndex];
  console.log(
    `--- RENDER --- showFeedback=${showFeedback}, wasCorrect=${wasCorrect}, explanation=${JSON.stringify(
      currentQuestion?.explanation
    )}`
  );

  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <PaperText style={styles.progressText}>
          Question {questionIndex + 1} of {questions.length}
        </PaperText>
        <Card style={styles.card}>
          <Card.Content>
            {/* Always show the question, apply conditional style using showFeedback */}
            <PaperText
              style={[
                styles.questionText,
                showFeedback && styles.questionTextAnswered,
              ]}
            >
              {currentQuestion.question}
            </PaperText>
            {/* Show Explanation using showFeedback */}
            {showFeedback && currentQuestion.explanation ? (
              <View style={styles.explanationContainer}>
                <Explanation explanationText={currentQuestion.explanation} />
              </View>
            ) : null}
          </Card.Content>
        </Card>

        <View style={styles.optionsContainer}>
          {(currentQuestion.options || []).map((option, index) => (
            <Button
              key={index}
              mode="contained"
              onPress={() => handleAnswer(option)}
              style={[styles.baseButton, getButtonStyle(option)]} // Uses showFeedback internally now
              labelStyle={
                selectedAnswer === option
                  ? styles.selectedOptionButtonText
                  : styles.optionButtonText
              }
              disabled={showFeedback} // Disable options when feedback is shown
              uppercase={false}
            >
              {option}
            </Button>
          ))}
        </View>
        <Button
          mode="contained"
          style={[
            styles.baseButton,
            styles.nextButtonBase,
            getNextButtonStyle(),
          ]} // Uses showFeedback internally now
          labelStyle={styles.nextButtonText}
          // Switch handlers based on showFeedback
          onPress={showFeedback ? handleNextQuestion : handleSubmit}
          // Disable Submit if no answer selected OR if feedback is shown (Next handles its own logic)
          disabled={!showFeedback && selectedAnswer === null}
          uppercase={false}
        >
          {/* Change text based on showFeedback */}
          {showFeedback ? "Next" : "Submit"}
        </Button>
      </ScrollView>
    </LinearGradient>
  );
};

// --- Styles (Keep styles from last update) ---
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
    fontSize: 16,
    lineHeight: 30,
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
    borderRadius: 20,
    marginVertical: 6,
    paddingVertical: 8,
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
  },
  incorrectAnswerButton: {
    backgroundColor: Colors.errorRed,
    borderColor: Colors.errorRed,
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

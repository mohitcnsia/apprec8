// screens/quiz/QuizScreen.js (Refactored with @r-n-firebase listener)

import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native"; // Added ActivityIndicator
import Question from "../../components/quiz/Question"; // Adjust path if needed
import Explanation from "../../components/quiz/Explanation"; // Adjust path if needed
import QuizButton from "../../components/quiz/QuizButton"; // Adjust path if needed
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../config/colors"; // Adjust path if needed
import { listenToQuizQuestions } from "../../services/firestoreContentApi"; // Adjust path, import new listener

// Fisher-Yates Shuffle function (keep this utility)
const shuffleArray = (array) => {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const QuizScreen = ({ route, navigation }) => {
  // Expect 'topicId' from navigation now, instead of 'itemId' or 'data'
  const { topicId } = route.params;

  // State for quiz logic (mostly unchanged)
  const [questions, setQuestions] = useState([]); // Will be populated from Firestore
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // State for data fetching
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- NEW: useEffect to listen for Firestore quiz questions ---
  useEffect(() => {
    if (!topicId) {
      setError("No topic specified for quiz.");
      setIsLoading(false);
      setQuestions([]); // Ensure questions are empty if no topicId
      return;
    }

    setIsLoading(true);
    setError(null);
    setQuestions([]); // Clear previous questions
    setQuestionIndex(0); // Reset index
    setScore(0); // Reset score
    setIsAnswered(false); // Reset answer state
    setSelectedAnswer(null); // Reset selection

    let isMounted = true; // Prevent state updates on unmounted component

    console.log(
      `QuizScreen: Listening to quiz questions for topicId: ${topicId}`
    );
    const unsubscribe = listenToQuizQuestions(
      topicId,
      (fetchedQuestions) => {
        if (isMounted) {
          if (fetchedQuestions && fetchedQuestions.length > 0) {
            console.log(
              `QuizScreen: Received ${fetchedQuestions.length} questions from Firestore.`
            );
            // Apply your shuffling and slicing logic to the fetched data
            const shuffledQuestions = shuffleArray(fetchedQuestions).slice(
              0,
              5
            ); // Keep slice(0, 5) if desired
            const shuffledQuestionsWithOptions = shuffledQuestions.map((q) => ({
              ...q, // Spread the Firestore question object ({ id, topicId, question, answer, options, explanation, order })
              options: shuffleArray(q.options || []), // Shuffle options from Firestore data
            }));
            setQuestions(shuffledQuestionsWithOptions); // Set the processed questions
            setError(null); // Clear any previous error
          } else {
            // Handle case where listener returns empty array (no questions found)
            console.log(
              `QuizScreen: No quiz questions found for topicId: ${topicId}`
            );
            setError("No quiz questions available for this topic.");
            setQuestions([]); // Ensure questions state is empty
          }
          setIsLoading(false); // Loading finished after first data received (or error)
        }
      },
      (fetchError) => {
        if (isMounted) {
          console.error(
            `Error fetching quiz questions for ${topicId}:`,
            fetchError
          );
          setError("Could not load quiz questions.");
          setQuestions([]); // Ensure questions state is empty on error
          setIsLoading(false);
        }
      }
    );

    // Cleanup listener on unmount or if topicId changes
    return () => {
      console.log(
        `QuizScreen: Unsubscribing from quiz questions listener for ${topicId}`
      );
      isMounted = false;
      unsubscribe();
    };
  }, [topicId]); // Re-run effect if topicId changes

  // --- Quiz Logic Handlers (Keep your existing logic) ---

  const handleAnswer = (answer) => {
    if (!isAnswered) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      // Only allow submit if an answer is selected
      setIsAnswered(true);
    }
  };

  const handleNextQuestion = () => {
    // Ensure an answer was processed before moving on
    if (!isAnswered) return;

    // Check correctness based on the 'answer' field from Firestore data
    if (selectedAnswer === questions[questionIndex]?.answer) {
      setScore((prevScore) => prevScore + 1);
    }

    const nextIndex = questionIndex + 1;
    if (nextIndex < questions.length) {
      setQuestionIndex(nextIndex);
      setSelectedAnswer(null); // Reset selected answer
      setIsAnswered(false); // Reset answered state
    } else {
      // Quiz finished: Navigate to results
      const finalScore =
        score + (selectedAnswer === questions[questionIndex]?.answer ? 1 : 0);
      navigation.replace("QuizResult", {
        // Use replace to prevent back navigation to quiz
        score: finalScore,
        totalQuestions: questions.length,
        quizId: topicId, // Pass topicId instead of original itemId
        // Pass questions if result screen needs them? Or just score/total?
        // data: questions // Optionally pass the questions shown
      });
    }
  };

  const getButtonStyle = (option) => {
    // Ensure questions[questionIndex] exists
    const currentQuestion = questions[questionIndex];
    if (!currentQuestion) return styles.optionButton; // Default style if question not loaded

    if (isAnswered) {
      if (option === currentQuestion.answer) {
        // Check correct answer
        return styles.correctAnswer;
      } else if (option === selectedAnswer) {
        // Check if it was the incorrect selected answer
        return styles.incorrectAnswer;
      } else {
        // Other incorrect options
        return styles.disabledAnswer;
      }
    }
    // Before submitting, highlight selected
    return selectedAnswer === option
      ? styles.selectedAnswer
      : styles.optionButton;
  };

  // --- Render Logic ---

  if (isLoading) {
    return (
      <LinearGradient
        colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
        style={styles.centered}
      >
        <ActivityIndicator size="large" color={Colors.primaryWhite} />
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient
        colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
        style={styles.centered}
      >
        <Text style={styles.errorText}>{error}</Text>
      </LinearGradient>
    );
  }

  // Check if questions array is populated and index is valid
  if (questions.length === 0 || questionIndex >= questions.length) {
    // This might briefly show if listener hasn't returned data yet but loading is false
    // Or if there truly were no questions
    return (
      <LinearGradient
        colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
        style={styles.centered}
      >
        <Text style={styles.loadingText}>
          {error ? error : "No questions available."}
        </Text>
      </LinearGradient>
    );
  }

  // Get the current question object from state
  const currentQuestion = questions[questionIndex];

  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      {/* Display Question or Explanation based on isAnswered state */}
      {isAnswered && currentQuestion.explanation ? (
        // Use 'explanation' field from Firestore data
        <Explanation title={currentQuestion.explanation} />
      ) : (
        // Use 'question' field from Firestore data
        <Question title={currentQuestion.question} />
      )}

      {/* Render options using data from 'questions' state */}
      {(currentQuestion.options || []).map((option, index) => (
        <QuizButton
          key={index}
          label={option}
          style={getButtonStyle(option)}
          handlePress={() => handleAnswer(option)}
          isDisabled={isAnswered} // Disable options after answering
        />
      ))}

      {/* Submit/Next Button */}
      <QuizButton
        style={styles.nextButton}
        label={isAnswered ? "Next" : "Submit"}
        handlePress={isAnswered ? handleNextQuestion : handleSubmit}
        // Disable Submit until an answer is selected
        isDisabled={!isAnswered && selectedAnswer === null}
      />
    </LinearGradient>
  );
};

// --- Styles (Keep your existing styles) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    // backgroundColor: "#f0e3b0", // Consider removing if using gradient
  },
  centered: {
    // Added for loading/error
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    // Renamed, used for info/error too
    color: Colors.primaryWhite, // Changed color for gradient
    fontSize: 18,
    textAlign: "center",
  },
  errorText: {
    // Added specific error style
    color: "#FF7F7F", // Lighter red for visibility on gradient
    fontSize: 18,
    textAlign: "center",
  },
  // Keep button styles - ensure colors work on gradient
  optionButton: {
    // Base style for options
    backgroundColor: Colors.primaryLightGray, // Example default color
    borderColor: Colors.primaryDarkMaroon, // Example border
    // Add margin, padding etc.
    marginVertical: 5,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  selectedAnswer: {
    backgroundColor: "#3498db",
    borderColor: "#2980b9",
    marginVertical: 5,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  correctAnswer: {
    backgroundColor: "#2ecc71",
    borderColor: "#27ae60",
    marginVertical: 5,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  incorrectAnswer: {
    backgroundColor: "#e74c3c",
    borderColor: "#c0392b",
    marginVertical: 5,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  disabledAnswer: {
    backgroundColor: "#95a5a6",
    borderColor: "#7f8c8d",
    marginVertical: 5,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    opacity: 0.7, // Make disabled look different
  },
  optionText: {
    // Ensure this style is used within QuizButton or applied here
    color: "#fff", // Text color likely needs to contrast with button backgrounds
    fontSize: 18,
    textAlign: "center",
  },
  nextButton: {
    backgroundColor: "#3498db",
    borderColor: "#2980b9",
    marginTop: 30,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  nextButtonText: {
    // Ensure this style is used within QuizButton
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  // Add styles for Question and Explanation components if needed here or within those components
  questionCount: {
    // Added style from previous snippet
    fontSize: 16,
    color: Colors.primaryWhite, // Adjusted color
    marginBottom: 20,
    textAlign: "center",
  },
  questionText: {
    // Added style from previous snippet
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: Colors.primaryWhite, // Adjusted color
  },
});

export default QuizScreen;

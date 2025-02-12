import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { IEO_QUIZ } from "../../data/ieo-quiz";
import Question from "../../components/quiz/Question";
import Explanation from "../../components/quiz/Explanation";
import QuizButton from "../../components/quiz/QuizButton";

// Fisher-Yates Shuffle function to randomize array
const shuffleArray = (array) => {
  let shuffledArray = [...array]; // Create a copy to avoid mutating the original
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index between 0 and i
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
  }
  return shuffledArray;
};

const QuizScreen = ({ navigation }) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false); // Track if an answer was selected
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Track the selected answer
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Shuffle IEO_QUIZ and select the first 5 questions
    const randomQuestions = shuffleArray(IEO_QUIZ).slice(0, 2);

    // Shuffle options for each question
    const shuffledQuestions = randomQuestions.map((question) => ({
      ...question,
      options: shuffleArray(question.options), // Shuffle the options
    }));

    setQuestions(shuffledQuestions); // Set the questions state with shuffled options
  }, []);

  const handleAnswer = (answer) => {
    if (!isAnswered) {
      setSelectedAnswer(answer); // Update selected answer
    }
  };

  const handleSubmit = () => {
    setIsAnswered(true); // Show result after submission
  };

  const handleNextQuestion = () => {
    // Check if selected answer is correct
    if (selectedAnswer === questions[questionIndex].answer) {
      // Increment score using the functional form to ensure we're using the latest score
      setScore((prevScore) => prevScore + 1);
    }

    // Proceed to the next question or navigate to stats if all questions are done
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      setSelectedAnswer(null); // Reset selected answer for next question
      setIsAnswered(false); // Reset answer state
    } else {
      // Navigate to the "Stats" screen with the current score
      navigation.navigate("Stats", {
        score:
          score + (selectedAnswer === questions[questionIndex].answer ? 1 : 0),
        totalQuestions: questions.length,
      });
    }
  };

  const getButtonStyle = (option) => {
    if (isAnswered) {
      if (option === selectedAnswer) {
        return option === questions[questionIndex].answer
          ? styles.correctAnswer
          : styles.incorrectAnswer;
      } else {
        return styles.disabledAnswer;
      }
    }
    return selectedAnswer === option
      ? styles.selectedAnswer
      : styles.optionButton;
  };

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isAnswered ? (
        questions[questionIndex].explanation ? (
          <Explanation title={questions[questionIndex].explanation} />
        ) : (
          <Question title={questions[questionIndex].question} />
        ) // If explanation is not available, render Question
      ) : (
        <Question title={questions[questionIndex].question} />
      )}
      {questions[questionIndex].options.map((option, index) => (
        <QuizButton
          key={index}
          label={option}
          style={getButtonStyle(option)}
          handlePress={() => handleAnswer(option)}
          isDisabled={isAnswered}
        />
      ))}
      <QuizButton
        style={styles.nextButton}
        label={isAnswered ? "Next" : "Submit"}
        handlePress={isAnswered ? handleNextQuestion : handleSubmit}
        isDisabled={!selectedAnswer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f0e3b0",
  },
  selectedAnswer: {
    backgroundColor: "#3498db", // Blue for selected option
    borderColor: "#2980b9", // Slightly darker blue border for selected option
  },
  correctAnswer: {
    backgroundColor: "#2ecc71", // Green for correct answer
    borderColor: "#27ae60", // Darker green border for correct answer
  },
  incorrectAnswer: {
    backgroundColor: "#e74c3c", // Red for incorrect answer
    borderColor: "#c0392b", // Darker red border for incorrect answer
  },
  disabledAnswer: {
    backgroundColor: "#95a5a6", // Gray for disabled options
    borderColor: "#7f8c8d", // Darker gray border for disabled options
  },
  optionText: {
    color: "#fff",
    fontSize: 18,
  },
  nextButton: {
    backgroundColor: "#3498db", // Blue color for Next/Submit button
    borderColor: "#2980b9",
    marginTop: 30,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default QuizScreen;

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { IEO_QUIZ } from "../../data/ieo-quiz";
import Question from "../../components/quiz/Question";
import Explanation from "../../components/quiz/Explanation";
import PrimaryButton from "../../components/PrimaryButton";
import QuizButton from "../../components/quiz/QuizButton";

const QuizScreen = ({ navigation }) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false); // Track if an answer was selected
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Track the selected answer
  const [questions] = useState(IEO_QUIZ);

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

  return (
    <View style={styles.container}>
      <Question title={questions[questionIndex].question} />
      {questions[questionIndex].options.map((option, index) => (
        <QuizButton
          index={index}
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

      {/* Enable this on Submit button and make it scrollable
      <Explanation
        explanation={
          "Dummy Text. The International English Olympiad (IEO) is an English language and Grammar competition for students of class 1 to class 12. It is conducted by Science Olympiad Foundation (SOF) in collaboration with British Council. The content of the tests is designed to focus on communication and use of English language, rather than rote learning and correct grammar only. Participants of IEO are ranked on the basis of marks obtained in 1st Level. After taking the first level of the test, students can judge themselves academically at four different levels - within the school, at city level, at state level and above all at International level."
        }
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  optionButton: {
    backgroundColor: "#bdc3c7", // Gray background for unselected options
    borderColor: "#b2bbc1", // Gray border
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
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default QuizScreen;

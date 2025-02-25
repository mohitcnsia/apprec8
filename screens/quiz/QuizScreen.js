import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { IEO_QUIZ } from "../../data/ieo-quiz";
import { NSO_QUIZ } from "../../data/nso-quiz";
import { IMO_QUIZ } from "../../data/imo-quiz";
import Question from "../../components/quiz/Question";
import Explanation from "../../components/quiz/Explanation";
import QuizButton from "../../components/quiz/QuizButton";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../config/colors";
import { IHO_QUIZ } from "../../data/iho-quiz";
import { IRO_QUIZ } from "../../data/iro-quiz";

// Quiz Lists Mapping
const QUIZ_LISTS = {
  nso: NSO_QUIZ,
  ieo: IEO_QUIZ,
  imo: IMO_QUIZ,
  iho: IHO_QUIZ,
  reasoning: IRO_QUIZ,
  // Add more quiz lists as needed
};

// Fisher-Yates Shuffle function to randomize array
const shuffleArray = (array) => {
  let shuffledArray = [...array]; // Create a copy to avoid mutating the original
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index between 0 and i
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
  }
  return shuffledArray;
};

const QuizScreen = ({ route, navigation }) => {
  const { itemId } = route.params; // Get the itemId passed from TopicOverviewScreen
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false); // Track if an answer was selected
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Track the selected answer

  // Dynamically load quiz based on the passed itemId
  useEffect(() => {
    const selectedQuizList = QUIZ_LISTS[itemId];
    // Check if the quiz exists for the provided itemId
    if (selectedQuizList) {
      const shuffledQuestions = shuffleArray(selectedQuizList).slice(0, 5); // Get the first 5 shuffled questions
      const shuffledQuestionsWithOptions = shuffledQuestions.map(
        (question) => ({
          ...question,
          options: shuffleArray(question.options),
        })
      );

      setQuestions(shuffledQuestionsWithOptions);
    } else {
      // If no quiz matches, show an error
      setQuestions([]);
    }
  }, [itemId]);

  const handleAnswer = (answer) => {
    if (!isAnswered) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    // Check if the selected answer is correct
    if (selectedAnswer === questions[questionIndex].answer) {
      setScore((prevScore) => prevScore + 1);
    }

    // Proceed to the next question or navigate to stats if it's the last question
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
        quizId: itemId,
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

  // If no quiz questions are available, display loading or error message
  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>
          Unable to load quiz. Please try again later.
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      {isAnswered ? (
        questions[questionIndex].explanation ? (
          <Explanation title={questions[questionIndex].explanation} />
        ) : (
          <Question title={questions[questionIndex].question} />
        )
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f0e3b0",
  },
  loadingText: {
    color: Colors.blackText,
    fontSize: 18,
    textAlign: "center",
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

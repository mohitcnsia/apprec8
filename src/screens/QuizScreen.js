// src/screens/QuizScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const QuizScreen = ({ navigation }) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5"],
      answer: "4",
    },
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris"],
      answer: "Paris",
    },
  ]);

  const handleAnswer = (answer) => {
    if (answer === questions[questionIndex].answer) {
      setScore(score + 1);
    }
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      navigation.navigate("Stats", { score, totalQuestions: questions.length });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{questions[questionIndex].question}</Text>
      {questions[questionIndex].options.map((option, index) => (
        <Button
          key={index}
          title={option}
          onPress={() => handleAnswer(option)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  question: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default QuizScreen;

// screens/quiz/QuizDetailsScreen.js
import React, { useState, useEffect, useMemo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import {
  Card,
  Title,
  Paragraph,
  Button as PaperButton,
  ActivityIndicator,
} from "react-native-paper";
import { listenToUserQuizAttempt } from "../../services/firestoreContentApi";

/**
 * A screen that displays details about a specific quiz and the user's progress on it.
 * It serves as a lobby where the user can choose to play in 'Training' or 'Exam' mode.
 *
 * @param {object} props
 * @param {object} props.route - React Navigation route object, contains params.
 * @param {object} props.navigation - React Navigation navigation object.
 * @returns {React.ReactElement}
 */
const QuizDetailsScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const C = theme.appColors || theme;
  const { quiz } = route.params; // Get the quiz object passed from the previous screen

  const [attempt, setAttempt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen to the user's progress for this specific quiz
  useEffect(() => {
    const unsubscribe = listenToUserQuizAttempt(
      quiz.id,
      (attemptData) => {
        setAttempt(attemptData);
        setIsLoading(false);
      },
      (error) => {
        console.error(error);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, [quiz.id]);

  const onStartQuiz = (mode) => {
    navigation.navigate("QuizScreenV2", {
      quiz: quiz,
      mode: mode,
    });
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, padding: 20, backgroundColor: C.background },
        card: { marginBottom: 20, backgroundColor: C.cardBackground },
        statsContainer: { marginTop: 20 },
        statRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 10,
        },
        statLabel: {
          fontSize: 16,
          fontFamily: "nunito",
          color: C.textSecondary,
        },
        statValue: {
          fontSize: 16,
          fontFamily: "nunitoBold",
          color: C.textPrimary,
        },
        buttonContainer: { marginTop: "auto", paddingTop: 20 },
        button: { marginVertical: 8, borderRadius: 25, paddingVertical: 8 },
      }),
    [C]
  );

  const masteryLevel = attempt?.masteryLevel || 0;
  const highScore = attempt?.highestScore || 0;

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={{ fontFamily: "nunitoBold", color: C.textPrimary }}>
            {quiz.title}
          </Title>
          <Paragraph style={{ fontFamily: "nunito", color: C.textSecondary }}>
            {quiz.description || "No description available."}
          </Paragraph>
        </Card.Content>
      </Card>

      {isLoading ? (
        <ActivityIndicator animating={true} color={C.primary} />
      ) : (
        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Your High Score</Text>
            <Text style={styles.statValue}>{highScore} Stars ✨</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Mastery Level</Text>
            <Text style={styles.statValue}>
              {"⭐".repeat(masteryLevel)}
              {"☆".repeat(3 - masteryLevel)}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <PaperButton
          mode="outlined"
          style={styles.button}
          onPress={() => onStartQuiz("training")}
        >
          Start Training
        </PaperButton>
        <PaperButton
          mode="contained"
          style={styles.button}
          onPress={() => onStartQuiz("exam")}
        >
          Start Exam
        </PaperButton>
      </View>
    </View>
  );
};

export default QuizDetailsScreen;

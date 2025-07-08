// components/quiz/QuestionCard.js
import React, { useMemo } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Card } from "react-native-paper";
import { useTheme } from "../../context/ThemeContext";

/**
 * Renders the main content of a question (e.g., text, image) within a styled Card.
 * This component dynamically chooses the correct element to display based on the
 * 'type' field of the question content.
 *
 * @param {object} props - The component props.
 * @param {object} props.question - The full question object from our Firestore schema.
 * It expects a `question.question` property containing the `{type, content}` object.
 * @returns {React.ReactElement} A styled card displaying the question.
 */
const QuestionCard = ({ question }) => {
  const { theme } = useTheme();
  const C = theme.appColors || theme;
  const questionContent = question.question;

  // Memoize styles to prevent re-calculation on every render
  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: C.cardBackground,
          borderRadius: 12,
          width: "100%",
          marginBottom: 20,
          minHeight: 150,
          justifyContent: "center",
          elevation: 2,
        },
        cardContent: { padding: 15 },
        questionText: {
          fontSize: 20,
          lineHeight: 28,
          textAlign: "center",
          fontFamily: "nunitoBold",
          color: C.textPrimary,
        },
        imageContent: {
          width: "100%",
          height: 180,
          borderRadius: 8,
        },
      }),
    [C]
  );

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        {questionContent.type === "image" ? (
          <Image
            source={{ uri: questionContent.content }}
            style={styles.imageContent}
            resizeMode="contain"
          />
        ) : (
          // Default to Text for 'text' or any other type
          <Text style={styles.questionText}>{questionContent.content}</Text>
        )}
      </Card.Content>
    </Card>
  );
};

export default QuestionCard;

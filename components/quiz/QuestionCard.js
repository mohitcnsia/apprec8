// components/quiz/QuestionCard.js
import React, { useMemo } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Card } from "react-native-paper";
// Assuming this path is correct for your project structure
import { useTheme } from "../../context/ThemeContext";

/**
 * Renders the main content of a question (e.g., text, image) within a styled Card.
 * This component now displays an image above the question text if the question's
 * `type` is 'image' and a `mediaUrl` is provided.
 *
 * @param {object} props - The component props.
 * @param {object} props.question - The full question object from our Firestore schema.
 * @returns {React.ReactElement} A styled card displaying the question.
 */
const QuestionCard = ({ question }) => {
  const { theme } = useTheme();
  const C = theme.appColors || theme;
  // It's safer to provide a fallback to prevent crashes if question.question is undefined
  const questionContent = question.question || { type: "text", content: "" };

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
        cardContent: { padding: 15, alignItems: "center" }, // Center content
        questionText: {
          fontSize: 20,
          lineHeight: 28,
          textAlign: "center",
          fontFamily: "nunitoBold",
          color: C.textPrimary,
        },
        // --- CHANGE 1: Renamed style for clarity and added margin ---
        image: {
          width: "100%",
          height: 180,
          borderRadius: 8,
          marginBottom: 15, // Add space between image and text
        },
      }),
    [C]
  );

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        {/* --- CHANGE 2: Updated rendering logic --- */}
        {/* First, check if the question is an image type and has a mediaUrl */}
        {questionContent.type === "image" && questionContent.mediaUrl && (
          <Image
            // Use the new 'mediaUrl' property for the image source
            source={{ uri: questionContent.mediaUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        )}

        {/* The question text is now always displayed. */}
        {/* If there's an image, it will appear below it. */}
        <Text style={styles.questionText}>{questionContent.content}</Text>
      </Card.Content>
    </Card>
  );
};

export default QuestionCard;

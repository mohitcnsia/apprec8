// components/quiz/Explanation.js

import React, { useMemo } from "react"; // Import useMemo
import { StyleSheet, View } from "react-native";
import { Text as PaperText } from "react-native-paper";
// import { Colors } from "../../config/colors"; // <<< Remove legacy Colors import
import { useTheme } from "../../context/ThemeContext"; // <<< Import useTheme hook

function Explanation({ explanationText }) {
  const { theme } = useTheme(); // <<< Use the theme hook

  // Input validation remains the same
  if (!Array.isArray(explanationText) || explanationText.length === 0) {
    return null;
  }

  // --- Define Styles Inside Component with useMemo ---
  const styles = useMemo(
    () =>
      StyleSheet.create({
        explanationContainer: {
          backgroundColor: "transparent", // Keep transparent to show parent Card background
          paddingVertical: 10,
          paddingHorizontal: 5,
          width: "100%",
        },
        description: {
          color: theme.textPrimary, // <<< Use themed primary text color
          fontSize: 16, // Adjusted size slightly
          lineHeight: 24, // Adjusted line height
          fontFamily: "nunitoBold", // Keep font
          textAlign: "left",
          marginBottom: 10,
        },
      }),
    [theme]
  ); // Depend on theme

  return (
    <View style={styles.explanationContainer}>
      {/* Map over the array using themed styles */}
      {explanationText.map((paragraph, index) =>
        paragraph && paragraph.trim() !== "" ? (
          <PaperText key={index} style={styles.description}>
            {paragraph}
          </PaperText>
        ) : null
      )}
    </View>
  );
}

export default Explanation;

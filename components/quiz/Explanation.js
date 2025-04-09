// components/quiz/Explanation.js (Handles Array of Strings)

import React from "react";
import { StyleSheet, View } from "react-native";
import { Text as PaperText } from "react-native-paper"; // Use PaperText for consistency
import { Colors } from "../../config/colors"; // Adjust path if needed

// Prop name kept as explanationText, but now expects an array of strings
function Explanation({ explanationText }) {
  // --- Check if input is a valid, non-empty array ---
  if (!Array.isArray(explanationText) || explanationText.length === 0) {
    // Don't render anything if prop is not an array or is empty
    return null;
  }
  // --- End Check ---

  return (
    // Container with transparent background, providing padding
    <View style={styles.explanationContainer}>
      {/* Map over the array and render each string as a separate Text component */}
      {explanationText.map((paragraph, index) =>
        // Filter out empty strings just in case
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

const styles = StyleSheet.create({
  explanationContainer: {
    backgroundColor: "transparent", // Inherits Card background
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: "100%",
  },
  description: {
    color: Colors.blackText, // Readable on white Card background
    fontSize: 18,
    lineHeight: 22,
    fontFamily: "nunitoBold", // Kid-friendly font
    textAlign: "left", // Align paragraphs naturally
    marginBottom: 10, // Add space between paragraphs
  },
});

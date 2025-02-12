import React from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";

// Get screen dimensions to calculate responsive font size
const { width } = Dimensions.get("window");

// Function to calculate font size dynamically
const calculateFontSize = () => {
  const fontSize = width * 0.05; // 5% of the screen width
  return Math.max(fontSize, 16); // Ensure font size is at least 16
};

function Question({ title }) {
  return (
    <View style={styles.questionContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text
          style={[styles.questionText, { fontSize: calculateFontSize() }]} // Dynamically calculated font size
        >
          {title}
        </Text>
      </ScrollView>
    </View>
  );
}

export default Question;

const styles = StyleSheet.create({
  questionText: {
    color: "white",
    fontFamily: "Cookie",
  },
  questionContainer: {
    backgroundColor: "#3b0940",
    alignItems: "center", // Center text horizontally
    justifyContent: "center", // Center text vertically
    borderRadius: 28,
    padding: 10, // Adjust padding as needed
    width: "100%", // Full width
    height: "50%", // Fixed height (adjust as needed)
    marginBottom: 20,
    flex: 0.5, // Ensures container grows and centers content
  },
  scrollContent: {
    paddingVertical: 10, // Add some padding for scrollable content
    width: "100%",
    flexGrow: 1, // Ensure scroll view content expands
    justifyContent: "center", // Vertically center content inside ScrollView
    alignItems: "center", // Horizontally center content inside ScrollView
  },
});

import React from "react";
import { StyleSheet, Text, View, FlatList, Dimensions } from "react-native";
import { Colors } from "../../config/colors";

// Get screen dimensions to calculate responsive font size
const { width } = Dimensions.get("window");

// Function to calculate font size dynamically
const calculateFontSize = () => {
  const fontSize = width * 0.05; // 5% of the screen width
  return Math.max(fontSize, 10); // Ensure font size is at least 16
};

function Explanation({ title }) {
  return (
    <View style={styles.explanationContainer}>
      <FlatList
        data={title} // `title` is expected to be an array of strings (each paragraph)
        keyExtractor={(item, index) => index.toString()} // Unique key for each item
        contentContainerStyle={styles.scrollContent}
        renderItem={({ item }) => (
          <Text
            style={[
              styles.description,
              { fontSize: calculateFontSize() }, // Dynamically calculated font size
            ]}
          >
            {item}
          </Text>
        )}
      />
    </View>
  );
}

export default Explanation;

const styles = StyleSheet.create({
  explanationContainer: {
    backgroundColor: "#3b0940",
    justifyContent: "center",
    alignItems: "center", // Center text horizontally
    borderRadius: 28,
    padding: 10,
    width: "100%", // Adjust width to make it responsive and not too wide
    marginVertical: 20, // Add margin to create space between other elements
    marginBottom: 30, // Space at the bottom to separate from other content
  },
  scrollContent: {
    paddingVertical: 10, // Add some padding for scrollable content
    width: "100%",
  },
  description: {
    color: Colors.primaryBrightYellow,
    marginBottom: 20, // Space between paragraphs
    paddingHorizontal: 10, // Padding on sides
  },
});

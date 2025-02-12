import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  FlatList,
} from "react-native";

// Get screen dimensions to calculate responsive font size
const { width } = Dimensions.get("window");

// Function to calculate font size dynamically
const calculateFontSize = () => {
  const fontSize = width * 0.05; // 5% of the screen width
  return Math.max(fontSize, 16); // Ensure font size is at least 16
};

function Explanation({ title }) {
  return (
    <View style={styles.explanationContainer}>
      <FlatList
        data={title} // `title` is expected to be an array of strings
        keyExtractor={(item, index) => index.toString()} // Unique key for each item
        contentContainerStyle={styles.scrollContent}
        renderItem={({ item }) => (
          <Text
            style={[
              styles.explanationText,
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
  explanationText: {
    color: "white",
    fontFamily: "Cookie",
  },
  explanationContainer: {
    backgroundColor: "#3b0940",
    justifyContent: "center",
    alignItems: "center", // Center text horizontally
    borderRadius: 28,
    padding: 10,
    width: "100%", // Fixed width (adjust as needed)
    height: "50%", // Fixed height (adjust as needed)
    marginBottom: 20,
  },
  scrollContent: {
    paddingVertical: 10, // Add some padding for scrollable content
    width: "100%",
    height: "50%",
  },
});

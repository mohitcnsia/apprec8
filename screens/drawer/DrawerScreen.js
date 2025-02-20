import { StyleSheet, Text, View } from "react-native";

function DrawerScreen() {
  return (
    <View style={styles.questionContainer}>
      <Text
        style={[styles.questionText, { fontSize: 16 }]} // Dynamically calculated font size
      >
        Coming Soon !!!
      </Text>
    </View>
  );
}

export default DrawerScreen;

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
    width: "90%", // Full width
    height: "50%", // Fixed height (adjust as needed)
    margin: 20,
    flex: 1, // Ensures container grows and centers content
  },
});

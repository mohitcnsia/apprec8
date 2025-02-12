import { StyleSheet, Text, TouchableOpacity } from "react-native";

function QuizButton({ index, label, style, handlePress, isDisabled }) {
  return (
    <TouchableOpacity
      key={index}
      label={label}
      style={[styles.button, style]}
      onPress={handlePress}
      disabled={isDisabled} // Disable buttons after submitting
    >
      <Text style={styles.optionText}>{label}</Text>
    </TouchableOpacity>
  );
}

export default QuizButton;

const styles = StyleSheet.create({
  button: {
    borderWidth: 2, // Border width
    padding: 15,
    marginBottom: 15, // Adds spacing between the options
    borderRadius: 5,
    alignItems: "center",
  },
  optionButton: {
    backgroundColor: "#bdc3c7", // Gray background for unselected options
    borderColor: "#b2bbc1", // Gray border
  },
  selectedAnswer: {
    backgroundColor: "#3498db", // Blue for selected option
    borderColor: "#2980b9", // Slightly darker blue border for selected option
  },
  correctAnswer: {
    backgroundColor: "#2ecc71", // Green for correct answer
    borderColor: "#27ae60", // Darker green border for correct answer
  },
  incorrectAnswer: {
    backgroundColor: "#e74c3c", // Red for incorrect answer
    borderColor: "#c0392b", // Darker red border for incorrect answer
  },
  disabledAnswer: {
    backgroundColor: "#95a5a6", // Gray for disabled options
    borderColor: "#7f8c8d", // Darker gray border for disabled options
  },
  optionText: {
    color: "#fff",
    fontSize: 18,
  },
  nextButton: {
    backgroundColor: "#3498db", // Blue color for Next/Submit button
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

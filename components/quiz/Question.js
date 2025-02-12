import { StyleSheet, Text, View } from "react-native";

function Question({ title }) {
  return (
    <View style={styles.questionContainer}>
      <Text style={styles.questionText}>{title}</Text>
    </View>
  );
}

export default Question;

const styles = StyleSheet.create({
  questionText: {
    fontSize: 24,
    fontFamily: "Cookie",
  },
  questionContainer: {
    flex: 0.7,
    backgroundColor: "#9c6efa",
    marginBottom: 20,
  },
});

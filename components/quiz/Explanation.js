import { StyleSheet, Text, View } from "react-native";

function Explanation({ explanation }) {
  return (
    <View style={styles.explanationContainer}>
      <Text style={styles.explanationText}>{explanation}</Text>
    </View>
  );
}

export default Explanation;

const styles = StyleSheet.create({
  explanationText: {
    fontSize: 24,
    fontFamily: "Cookie",
  },
  explanationContainer: {
    flex: 0.5,
    backgroundColor: "#25739d",
    marginTop: 20,
    marginBottom: 20,
  },
});

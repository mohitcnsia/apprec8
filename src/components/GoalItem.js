import { View, Text, StyleSheet } from "react-native";

export default function GoalItem(props) {
  return (
    <View style={styles.goalItem}>
      <Text style={styles.goalText}>{props.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  goalItem: {
    backgroundColor: "#660066",
    fontWeight: "500",
    borderWidth: 1,
    borderRadius: 10,
    padding: 4,
    marginBottom: 3,
  },
  goalText: {
    color: "white",
  },
});

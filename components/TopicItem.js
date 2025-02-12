import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../config/colors";

function TopicItem({ title, description }) {
  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{description}</Text>
    </View>
  );
}

export default TopicItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primaryLightYellow,
    textAlign: "center",
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.primaryBrightYellow,
    textAlign: "center",
  },
});

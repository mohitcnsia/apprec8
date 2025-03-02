import { StyleSheet, Text, View } from "react-native";
import { Colors } from "./config/colors";

export default function App() {
  return (
      <View style={styles.container}>
        <Text style={styles.text}>Hello Dear Pratha !</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the View fills the entire screen
    backgroundColor: Colors.primaryDarkMaroon, // Your desired background color
    justifyContent: 'center'
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.primaryBrightYellow,
    textAlign: "center",
  },
});

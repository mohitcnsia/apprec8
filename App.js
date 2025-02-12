import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import QuizNavigator from "./navigation/QuizNavigator"; // Removed MealNavigator for now

export default function App() {
  return (
    <>
      {/* Custom StatusBar with background color */}
      <StatusBar style="dark" translucent={false} backgroundColor="#f0e3b0" />

      {/* The root container with full height */}
      <View style={styles.container}>
        <QuizNavigator />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the View fills the entire screen
    backgroundColor: "#f0e3b0", // Your desired background color
  },
});

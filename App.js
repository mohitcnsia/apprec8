import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { Colors } from "./config/colors";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import { useFonts } from "expo-font";

export default function App() {
  useFonts({
    rouge: require("./assets/fonts/RougeScript-Regular.ttf"),
    delius: require("./assets/fonts/Delius-Regular.ttf"),
    pacifico: require("./assets/fonts/Pacifico-Regular.ttf"),
  });

  return (
    <>
      {/* Custom StatusBar with background color */}
      <StatusBar
        style="inverted"
        translucent={false}
        backgroundColor={Colors.primaryDarkMaroon}
      />

      {/* The root container with full height */}
      <View style={styles.container}>
        {/* <QuizNavigator /> */}
        {/* <MealNavigator /> */}
        <BottomTabNavigator />
        {/* <AppFlatListTester /> */}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the View fills the entire screen
    backgroundColor: Colors.primaryDarkMaroon, // Your desired background color
  },
});

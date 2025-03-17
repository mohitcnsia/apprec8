import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import QuizNavigator from "./navigation/QuizNavigator";
import MealNavigator from "./navigation/MealNavigator";
import { Colors } from "./config/colors";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import { useFonts } from "expo-font";
import AppFlatListTester from "./components/common/list/AppFlatListTester";

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
        style="dark"
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

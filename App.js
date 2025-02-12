import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import QuizNavigator from "./navigation/QuizNavigator";
import MealNavigator from "./navigation/MealNavigator";

export default function App() {
  return (
    <>
      <StatusBar style="dark"></StatusBar>
      <QuizNavigator />
      {/* <MealNavigator /> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
});

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import QuizScreen from "../screens/quiz/QuizScreen";
import QuizResultScreen from "../screens/quiz/QuizResultScreen";
import { Colors } from "../config/colors";
import TopicsScreen from "../screens/quiz/TopicsScreen";
import TopicOverviewScreen from "../screens/quiz/TopicOverviewScreen";
import { StyleSheet } from "react-native";
import Study from "../screens/quiz/Study";

const Stack = createStackNavigator();

const QuizNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Study"
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primaryDarkMaroon, // Set your preferred background color for the header
        },
        headerTintColor: "#ffffff", // Change text color in the header (like the back button)
        headerTitleStyle: {
          fontWeight: "bold", // Optional: you can make the title bold
        },
      }}
    >
      {/* <Stack.Screen name="Topics" component={TopicsScreen} /> */}
      <Stack.Screen name="Study" component={Study} />
      <Stack.Screen name="Overview" component={TopicOverviewScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="QuizResult" component={QuizResultScreen} />
    </Stack.Navigator>
  );
};

export default QuizNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

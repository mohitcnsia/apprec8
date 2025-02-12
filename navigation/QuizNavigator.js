import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/quiz/LoginScreen";
import QuizScreen from "../screens/quiz/QuizScreen";
import StatsScreen from "../screens/quiz/StatsScreen";
import { Colors } from "../config/colors";

const Stack = createStackNavigator();

const QuizNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Quiz"
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
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Stats" component={StatsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default QuizNavigator;

// src/navigation/Navigation.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/quiz/LoginScreen";
import QuizScreen from "../screens/quiz/QuizScreen";
import StatsScreen from "../screens/quiz/StatsScreen";

const Stack = createStackNavigator();

const QuizNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Quiz">
        {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Stats" component={StatsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default QuizNavigator;

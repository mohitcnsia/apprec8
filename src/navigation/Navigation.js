// src/navigation/Navigation.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import QuizScreen from "../screens/QuizScreen";
import StatsScreen from "../screens/StatsScreen";

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Stats" component={StatsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

// navigation/QuestNavigator.js

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import QuestScreen from "../screens/quest/QuestScreen"; // Adjust path if needed
import { useTheme } from "../context/ThemeContext"; // Adjust path if needed
import TestScreen from "../screens/quest/TestScreen";

// Import your existing game/quiz screens here
// Example:
// import QuizScreen from '../screens/quiz/QuizScreen';
// import SudokuScreen from '../screens/games/SudokuScreen';

const Stack = createStackNavigator();

const QuestNavigator = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.headerBackground,
        },
        headerTintColor: theme.headerTint,
        headerTitleStyle: {
          fontFamily: "nunitoBold",
        },
      }}
    >
      <Stack.Screen
        name="QuestMap"
        component={QuestScreen}
        options={{ title: "My Quest" }}
      />
      {/* <Stack.Screen
        name="QuestMap"
        component={TestScreen} // Use TestScreen here
        options={{ title: "Layout Test" }}
      /> */}
      {/* You will add your existing activity screens here later.
        This setup allows you to navigate to them from the QuestMap.
        
        Example:
        <Stack.Screen name="QuizActivity" component={QuizScreen} />
        <Stack.Screen name="SudokuActivity" component={SudokuScreen} />
      */}
    </Stack.Navigator>
  );
};

export default QuestNavigator;

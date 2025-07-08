import React, { useCallback } from "react";
import { StatusBar } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
// Note: useNavigation is no longer needed here
// import { useTheme } from "../context/ThemeContext"; // useTheme is also not needed here

// Import all screens for the navigator
import QuestScreen from "../screens/quest/QuestScreen";
import QuizDetailsScreen from "../screens/quiz/QuizDetailsScreen";
import QuizScreenV2 from "../screens/quiz/QuizScreenV2";
import ExplanationScreen from "../screens/quiz/ExplanationScreen";

const Stack = createStackNavigator();

const QuestNavigator = () => {
  // The logic to hide the status bar is now placed directly in the navigator component.
  // The logic for hiding the bottom tab bar is handled by BottomTabNavigator.js.
  useFocusEffect(
    useCallback(() => {
      // Hide the system status bar when this navigator is focused
      StatusBar.setHidden(true, "fade");

      // This function runs when the user navigates away from this stack
      return () => {
        StatusBar.setHidden(false, "fade");
      };
    }, []) // Empty dependency array means this effect runs once on focus/blur
  );

  return (
    <Stack.Navigator
      screenOptions={{
        // The header remains hidden for the full immersive experience
        headerShown: false,
      }}
    >
      <Stack.Screen name="QuestMap" component={QuestScreen} />
      <Stack.Screen name="QuizDetails" component={QuizDetailsScreen} />
      <Stack.Screen name="QuizV2" component={QuizScreenV2} />
      <Stack.Screen name="Explanation" component={ExplanationScreen} />
    </Stack.Navigator>
  );
};

export default QuestNavigator;

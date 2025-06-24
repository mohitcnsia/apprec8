// navigators/HomeNavigator.js (or similar path)

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet } from "react-native";
// Import the theme hook
import { useTheme } from "../context/ThemeContext";
// Remove the legacy Colors import
// import { Colors } from "../config/colors";

// Screen Imports (remain the same)
import Home from "../screens/quiz/Home"; // Assuming path is correct
import Apprec8Reader from "../components/common/reader/Apprec8Reader";
import TopicOverviewScreen from "../screens/quiz/TopicOverviewScreen";
import LinksScreen from "../screens/LinksScreen";
import ClockPracticeGenerator from "../components/ClockPracticeGenerator";
import SudokuPracticeGenerator from "../components/SudokuPracticeGenerator";
import Minesweeper from "../components/Minesweeper";
import VocabBuilder from "../components/VocabBuilder";
import SpellingBeeGame from "../components/SpellingBeeGame";

const Stack = createStackNavigator();

// --- Helper component to apply theme ---
const ThemedHomeStack = () => {
  const { theme } = useTheme(); // Use the theme hook here

  // Define screen options using theme variables
  const screenOptionsConfig = {
    headerStyle: {
      // Use theme color for header background
      backgroundColor: theme.headerBackground || theme.primary || "#800000", // Provide fallbacks
    },
    // Use theme color for header text and icons
    headerTintColor: theme.headerTint || "#ffffff",
    headerTitleStyle: {
      fontWeight: "bold", // Keep specific style if needed
      // fontFamily: "pacifico", // Example if you want a specific font
    },
    // headerTitleAlign: 'center', // Optional: Centralize title alignment by default
  };

  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={screenOptionsConfig} // Apply themed options
    >
      <Stack.Screen
        name="HomeScreen"
        component={Home}
        options={{
          headerShown: false, // Keep screen-specific option
        }}
      />
      <Stack.Screen
        name="LinkScreen"
        component={LinksScreen}
        options={{
          headerShown: false, // Keep screen-specific option
        }}
      />
      <Stack.Screen
        name="Apprec8Reader"
        component={Apprec8Reader}
        options={{
          headerShown: false, // Keep screen-specific option
        }}
      />
      <Stack.Screen
        name="ClockPracticeGenerator"
        component={ClockPracticeGenerator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SudokuPracticeGenerator"
        component={SudokuPracticeGenerator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Minesweeper"
        component={Minesweeper}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="VocabBuilder"
        component={VocabBuilder}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SpellingBeeGame"
        component={SpellingBeeGame}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Overview"
        component={TopicOverviewScreen}
        options={{
          headerShown: false, // Keep screen-specific option
        }}
      />
    </Stack.Navigator>
  );
};

// --- Main Exported Navigator Component ---
// Renders the helper component which applies the theme
const HomeNavigator = () => {
  return <ThemedHomeStack />;
};

export default HomeNavigator;

// Note: The StyleSheet below wasn't used in the original code for the navigator itself.
// Keep it if any parent component needs it, otherwise it can be removed from this file.
/*
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
*/

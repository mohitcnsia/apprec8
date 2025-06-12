// navigators/StudyNavigator.js (or similar path)

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet } from "react-native";
// Import the theme hook
import { useTheme } from "../context/ThemeContext";
// Remove the legacy Colors import
// import { Colors } from "../config/colors";

// Screen Imports (remain the same)
import QuizScreen from "../screens/quiz/QuizScreen";
import QuizResultScreen from "../screens/quiz/QuizResultScreen";
import TopicOverviewScreen from "../screens/quiz/TopicOverviewScreen";
import StudyScreen from "../screens/quiz/StudyScreen";
import Apprec8Reader from "../components/common/reader/Apprec8Reader";
import LinksScreen from "../screens/LinksScreen";
import DummyScreen from "../screens/DummyScreen";
import WordInspectorScreen from "../screens/WordInspectorScreen";

const Stack = createStackNavigator();

// --- Helper component to apply theme ---
const ThemedStudyStack = () => {
  const { theme } = useTheme(); // Use the theme hook here

  // Define screen options using theme variables
  const screenOptionsConfig = {
    headerStyle: {
      // Use theme color for header background
      backgroundColor: theme.headerBackground || theme.primary || "#800000", // Provide fallbacks
    },
    // Use theme color for header text and icons
    headerTintColor: theme.headerTint || "#ffffff",
    headerShown: false,
    // headerTitleStyle: {
    //   fontSize: 18,
    //   letterSpacing: 0.5,
    //   fontFamily: "pacifico", // Keep your font
    //   // Optionally explicitly set color if needed, defaults to headerTintColor
    //   // color: theme.headerTint || '#ffffff',
    // },
    // headerTitleAlign: "center", // Centralize title alignment by default
  };

  return (
    <Stack.Navigator
      initialRouteName="StudyScreen"
      screenOptions={screenOptionsConfig} // Apply themed options
    >
      <Stack.Screen
        name="StudyScreen"
        component={StudyScreen}
        options={{
          title: "Study",
          // headerTitleAlign: "center", // Now handled by default screenOptions
        }}
      />
      <Stack.Screen
        name="LinkScreen"
        component={LinksScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Overview"
        component={TopicOverviewScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Apprec8Reader"
        component={Apprec8Reader}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Quiz"
        component={QuizScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="WordInspector"
        component={WordInspectorScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="QuizResult"
        component={QuizResultScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DummyScreen"
        component={DummyScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

// --- Main Exported Navigator Component ---
// Renders the helper component which applies the theme
const StudyNavigator = () => {
  return <ThemedStudyStack />;
};

export default StudyNavigator;

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

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import QuizScreen from "../screens/quiz/QuizScreen";
import QuizResultScreen from "../screens/quiz/QuizResultScreen";
import { Colors } from "../config/colors";
import TopicsScreen from "../screens/quiz/TopicsScreen";
import TopicOverviewScreen from "../screens/quiz/TopicOverviewScreen";
import { StyleSheet } from "react-native";
import StudyScreen from "../screens/quiz/StudyScreen";
import Apprec8Reader from "../components/common/reader/Apprec8Reader";
import LinksScreen from "../screens/LinksScreen";
import DummyScreen from "../screens/DummyScreen";

const Stack = createStackNavigator();

const StudyNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="StudyScreen"
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primaryDarkMaroon, // Set your preferred background color for the header
        },
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          fontSize: 18,
          letterSpacing: 0.5,
          fontFamily: "pacifico",
        },
      }}
    >
      <Stack.Screen
        name="StudyScreen"
        component={StudyScreen}
        options={{
          title: "Study", // The title will use the global headerTitleStyle
          headerTitleAlign: "center",
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

export default StudyNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

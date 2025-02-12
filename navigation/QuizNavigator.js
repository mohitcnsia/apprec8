import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/quiz/LoginScreen";
import QuizScreen from "../screens/quiz/QuizScreen";
import StatsScreen from "../screens/quiz/StatsScreen";
import { Colors } from "../config/colors";
import TopicsScreen from "../screens/quiz/TopicsScreen";
import TopicOverviewScreen from "../screens/quiz/TopicOverviewScreen";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

const Stack = createStackNavigator();

const QuizNavigator = () => {
  return (
    <LinearGradient
      colors={[Colors.primaryDarkMaroon, Colors.primaryLightGray]}
      style={styles.container}
    >
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Topics"
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
          <Stack.Screen name="Topics" component={TopicsScreen} />
          <Stack.Screen name="Topic Overview" component={TopicOverviewScreen} />
          <Stack.Screen name="Quiz" component={QuizScreen} />
          <Stack.Screen name="Stats" component={StatsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </LinearGradient>
  );
};

export default QuizNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

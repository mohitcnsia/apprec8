import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Colors } from "../config/colors";
import { StyleSheet } from "react-native";
import Home from "../screens/quiz/Home";
import Apprec8Reader from "../components/common/reader/Apprec8Reader";
import LinksScreen from "../components/common/dummy/DummyLinksScreen";
import TopicOverviewScreen from "../screens/quiz/TopicOverviewScreen";

const Stack = createStackNavigator();

const HomeNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
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
      {/* <Stack.Screen name="HomeScreen" component={Home} /> */}
      <Stack.Screen
        name="HomeScreen"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="LinksScreen"
        component={LinksScreen}
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
        name="Overview"
        component={TopicOverviewScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

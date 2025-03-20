import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Colors } from "../config/colors";
import { StyleSheet } from "react-native";
import ProfileScreen from "../screens/quiz/ProfileScreen";
import DummyScreen from "../screens/DummyScreen";
import LinksScreen from "../screens/LinksScreen";

const Stack = createStackNavigator();

const ProfileNavigator = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="ProfileScreen"
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
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown: false,
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
        name="DummyScreen"
        component={DummyScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

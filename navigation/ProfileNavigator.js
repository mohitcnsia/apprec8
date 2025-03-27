import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Colors } from "../config/colors";
import { StyleSheet } from "react-native";
import ProfileScreen from "../screens/quiz/ProfileScreen";
import DummyScreen from "../screens/DummyScreen";
import LinksScreen from "../screens/LinksScreen";
import ContactUsForm from "../components/input/ContactUsForm";

const Stack = createStackNavigator();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProfileScreen"
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
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title: "Profile",
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
        name="DummyScreen"
        component={DummyScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="cntct"
        component={ContactUsForm}
        options={{
          title: "Contact Us",
          headerTitleAlign: "center",
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

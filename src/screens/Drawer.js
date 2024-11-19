// App.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Screen components
const HomeScreen = () => {
  return (
    <View style={styles.screenContainer}>
      <Text>Home Screen</Text>
    </View>
  );
};

const SettingsScreen = () => {
  return (
    <View style={styles.screenContainer}>
      <Text>Settings Screen</Text>
    </View>
  );
};

const ProfileScreen = () => {
  return (
    <View style={styles.screenContainer}>
      <Text>Profile Screen</Text>
    </View>
  );
};

// Create a Drawer Navigator
const Drawer = createDrawerNavigator();

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Drawer;

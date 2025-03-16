import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Colors } from "../config/colors";
import { StyleSheet } from "react-native";
import Apprec8Reader from "../components/common/reader/Apprec8Reader";
import CustomReader from "../components/common/reader/CustomReader";
import LinksScreen from "../components/common/dummy/DummyLinksScreen";
import MainScreen from "../components/common/dummy/MainScreen";

const Stack = createStackNavigator();

const DummyNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainScreen"
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
      <Stack.Screen name="MainScreen" component={MainScreen} />
      <Stack.Screen name="CustomReader" component={CustomReader} />
      <Stack.Screen name="LinksScreen" component={LinksScreen} />
      <Stack.Screen name="Apprec8Reader" component={Apprec8Reader} />
    </Stack.Navigator>
  );
};

export default DummyNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

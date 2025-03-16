import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Apprec8ReaderTester from "./components/common/reader/Apprec8ReaderTester";
import Apprec8Reader from "./components/common/reader/Apprec8Reader";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Apprec8ReaderTester} />
        <Stack.Screen name="Apprec8Reader" component={Apprec8Reader} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

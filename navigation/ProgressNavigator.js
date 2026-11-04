// navigation/ProgressNavigator.js
// Progress tab stack (Home + tabs redesign, 2026-11-04): kid progress, leaderboard (old Stats tab)
// and, for the admin, the Dashboard's kid detail screen.

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ProgressScreen from "../screens/progress/ProgressScreen";
import LeaderboardScreen from "../screens/progress/LeaderboardScreen";
import AdminKidDetailScreen from "../screens/admin/AdminKidDetailScreen";

const Stack = createStackNavigator();

const ProgressNavigator = () => (
  <Stack.Navigator initialRouteName="ProgressScreen" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProgressScreen" component={ProgressScreen} />
    <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
    <Stack.Screen name="AdminKidDetail" component={AdminKidDetailScreen} />
  </Stack.Navigator>
);

export default ProgressNavigator;

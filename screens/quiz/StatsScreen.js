// screens/quiz/StatsScreen.js (Refactored Tabs)

import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "../../context/ThemeContext"; // Adjust path
import LeaderboardTab from "./../../components/common/LeaderboardTab"; // Adjust path

const Tab = createMaterialTopTabNavigator();

const StatsScreen = () => {
  const { theme } = useTheme();

  return (
    <View
      style={[styles.container /*, { backgroundColor: theme.background }*/]}
    >
      <Tab.Navigator
      // screenOptions={{
      //   tabBarStyle: { backgroundColor: theme.tabBarBackground || "#3a0000" },
      //   tabBarIndicatorStyle: {
      //     backgroundColor: theme.tabBarActiveTint || "#FFFFFF",
      //     height: 3,
      //   },
      //   // tabBarLabelStyle: { fontWeight: "bold", color: theme.textPrimary },
      //   tabBarActiveTintColor: theme.tabBarActiveTint,
      //   tabBarInactiveTintColor: theme.tabBarInactiveTint,
      // }}
      >
        <Tab.Screen
          name="Daily"
          component={LeaderboardTab} // Pass component directly
          initialParams={{ timePeriod: "daily" }} // Pass data via initialParams
        />
        <Tab.Screen
          name="Weekly"
          component={LeaderboardTab}
          initialParams={{ timePeriod: "weekly" }}
        />
        <Tab.Screen
          name="Monthly"
          component={LeaderboardTab}
          initialParams={{ timePeriod: "monthly" }}
        />
        <Tab.Screen
          name="All Time"
          component={LeaderboardTab}
          initialParams={{ timePeriod: "allTime" }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" /* Fallback background */ },
});

export default StatsScreen;

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native"; // <-- IMPORT THIS HELPER
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialIcons } from "@expo/vector-icons";

import HomeNavigator from "./HomeNavigator";
import StudyNavigator from "./StudyNavigator";
import ProfileNavigator from "./ProfileNavigator";
import QuestNavigator from "./QuestNavigator";
import StatsScreen from "../screens/quiz/StatsScreen";
import { useTheme } from "../context/ThemeContext";

const Tab = createBottomTabNavigator();

function BottomTabNavigator({
  isGuest,
  signoutHandler,
  exitGuestModeHandler,
  user,
}) {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.tabBarActiveTint,
        tabBarInactiveTintColor: theme.tabBarInactiveTint,
        sceneContainerStyle: { backgroundColor: theme.background },

        // This is the core logic that will be applied to ALL tabs
        tabBarStyle: ((route) => {
          // This function checks the active screen inside a navigator
          const routeName = getFocusedRouteNameFromRoute(route) ?? "";

          // List of screens where the tab bar should be HIDDEN
          const immersiveScreens = ["QuizDetails", "QuizScreenV2"];

          // If the current screen is in our immersive list, hide the tab bar
          if (immersiveScreens.includes(routeName)) {
            return { display: "none" };
          }

          // Otherwise, show it with the normal theme styles
          return {
            backgroundColor: theme.tabBarBackground,
            borderTopColor: theme.border || "transparent",
          };
        })(route), // Immediately invoke the function with the route

        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Apprec8") {
            iconName = focused ? "home" : "home-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === "Study") {
            iconName = focused ? "book" : "book-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === "Profile") {
            iconName = focused ? "person-circle" : "person-circle-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === "Quest") {
            iconName = focused ? "map" : "map-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === "Stats") {
            return (
              <MaterialIcons name="leaderboard" color={color} size={size} />
            );
          }
        },
      })}
    >
      <Tab.Screen
        name="Apprec8"
        component={HomeNavigator}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="Study"
        component={StudyNavigator}
        options={{ title: "Study" }}
      />

      {/* The Quest tab no longer needs a custom options prop, as it's handled in screenOptions */}
      <Tab.Screen
        name="Quest"
        component={QuestNavigator}
        options={{ title: "Quest" }}
      />

      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{ title: "Stats" }}
      />
      <Tab.Screen name="Profile" options={{ title: "Profile" }}>
        {() => (
          <ProfileNavigator
            isGuest={isGuest}
            actionHandler={isGuest ? exitGuestModeHandler : signoutHandler}
            user={user}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;

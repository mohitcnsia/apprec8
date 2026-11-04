// navigation/BottomTabNavigator.js
// Tabs since the Home + tabs redesign (owner-approved mockups, 2026-11-04): Home · Fun · Progress · Me.
// - The old Study tab's screens now live in the Home stack (navigation/HomeNavigator.js).
// - The Space quest is a hidden tab ("Quest"), opened from Home's quest tiles. Its screens still
//   navigate back to "QuestMap" (CLAUDE.md rule 6). The "Quest Mode (V2)" switch no longer hides it.
// - Route names stay the same as before ("Apprec8", "Stats", "Profile"), so old links keep working.
// - The selected tab is highlighted from the navigator's own focus state.

import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

import HomeNavigator from "./HomeNavigator";
import FunNavigator from "./FunNavigator";
import ProfileNavigator from "./ProfileNavigator";
import QuestNavigator from "./QuestNavigator";
import StatsScreen from "../screens/quiz/StatsScreen";
import TasksContextProvider from "../store/tasks-context";
import { useTheme } from "../context/ThemeContext";
import { quizPalette } from "../components/quiz/quizPalette";

const Tab = createBottomTabNavigator();

// Screens that use the whole screen (no tab bar).
const IMMERSIVE_SCREENS = [
  "QuizDetails",
  "QuizScreenV2",
  "Explanation",
  "ResultsScreen",
  "EnglishQuestIntro",
  "EnglishQuestMap",
  "ReadingScreen",
  "EndlessPractice",
  "AdminDashboard",
  "AdminKidDetail",
];

const ICONS = {
  Apprec8: ["home", "home-outline"],
  Fun: ["game-controller", "game-controller-outline"],
  Stats: ["stats-chart", "stats-chart-outline"],
  Profile: ["person-circle", "person-circle-outline"],
};

function BottomTabNavigator({ isGuest, signoutHandler, exitGuestModeHandler, user }) {
  const { theme, isDark } = useTheme();
  const P = quizPalette(isDark);

  return (
    // key: reload reminders when a guest signs in (the provider loads once on mount).
    <TasksContextProvider key={user?.uid || "guest"}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: P.selectedText,
          tabBarInactiveTintColor: P.textSoft,
          tabBarLabelStyle: { fontFamily: "nunitoBold", fontSize: 12 },
          sceneContainerStyle: { backgroundColor: theme.background },
          tabBarStyle: (() => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "";
            if (route.name === "Quest" || IMMERSIVE_SCREENS.includes(routeName)) {
              return { display: "none" };
            }
            return { backgroundColor: P.card, borderTopColor: P.border, borderTopWidth: 2, height: 64, paddingBottom: 8, paddingTop: 6 };
          })(),
          tabBarIcon: ({ focused, color }) => {
            const names = ICONS[route.name];
            if (!names) return null;
            return (
              <View
                style={{
                  width: 54,
                  height: 30,
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: focused ? P.selectedBg : "transparent",
                }}
              >
                <Ionicons name={focused ? names[0] : names[1]} size={22} color={color} />
              </View>
            );
          },
        })}
      >
        <Tab.Screen name="Apprec8" component={HomeNavigator} options={{ title: "Home" }} />
        <Tab.Screen name="Fun" component={FunNavigator} options={{ title: "Fun" }} />
        <Tab.Screen name="Stats" component={StatsScreen} options={{ title: "Progress" }} />
        <Tab.Screen name="Profile" options={{ title: "Me" }}>
          {() => (
            <ProfileNavigator
              isGuest={isGuest}
              actionHandler={isGuest ? exitGuestModeHandler : signoutHandler}
              user={user}
            />
          )}
        </Tab.Screen>
        {/* Hidden: the Space quest, opened from Home. */}
        <Tab.Screen
          name="Quest"
          component={QuestNavigator}
          options={{ title: "Quest", tabBarButton: () => null, tabBarItemStyle: { display: "none" } }}
        />
      </Tab.Navigator>
    </TasksContextProvider>
  );
}

export default BottomTabNavigator;

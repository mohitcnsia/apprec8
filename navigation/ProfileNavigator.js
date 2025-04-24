// navigators/ProfileNavigator.js

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
// Remove direct Colors import
// import { Colors } from "../config/colors";
import { useTheme } from "../context/ThemeContext"; // Import useTheme

// Screen Imports (remain the same)
import ProfileScreen from "../screens/quiz/ProfileScreen";
import GuestProfileScreen from "../screens/profile/GuestProfileScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import DummyScreen from "../screens/DummyScreen";
import LinksScreen from "../screens/LinksScreen";
import ContactUsForm from "../components/input/ContactUsForm";
import Tasks from "../screens/task/Tasks";
import TaskDetails from "../screens/task/TaskDetails";
import TaskEditor from "../screens/task/TaskEditor";
import TasksContextProvider from "../store/tasks-context";

const Stack = createStackNavigator();

// Helper component to access theme context for navigator options
const ThemedStack = ({ isGuest, actionHandler, user }) => {
  // Use the theme hook HERE
  const { theme } = useTheme();

  // Define screenOptions using theme colors
  const screenOptionsConfig = {
    headerStyle: {
      // Use theme color for header background
      backgroundColor: theme.headerBackground || theme.primary || "#800000", // Provide fallbacks
    },
    // Use theme color for header text and icons
    headerTintColor: theme.headerTint || "#ffffff",
    headerShown: false,
  };

  return (
    <Stack.Navigator
      initialRouteName={isGuest ? "GuestProfile" : "ProfileScreen"}
      screenOptions={screenOptionsConfig} // Apply themed options
    >
      {isGuest ? (
        <Stack.Screen
          name="GuestProfile"
          // Title alignment is now handled by default screenOptions
          options={{ title: "Guest Profile" }}
        >
          {(props) => (
            <GuestProfileScreen {...props} onExitGuestMode={actionHandler} />
          )}
        </Stack.Screen>
      ) : (
        // Authenticated User Screens
        <>
          <Stack.Screen name="ProfileScreen" options={{ title: "Profile" }}>
            {(props) => (
              <ProfileScreen
                {...props}
                signoutHandler={actionHandler}
                user={user}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ title: "Edit Profile" }}
          />
        </>
      )}

      {/* Other screens reachable from Profile/Guest screens */}
      <Stack.Screen
        name="LinkScreen"
        component={LinksScreen}
        // Keep headerShown: false if intended
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Tasks" component={Tasks} options={{}} />
      <Stack.Screen name="TaskDetails" component={TaskDetails} options={{}} />
      <Stack.Screen name="TaskEditor" component={TaskEditor} options={{}} />
      <Stack.Screen
        name="DummyScreen"
        component={DummyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="cntct" // Consider a more descriptive name like "ContactUs"
        component={ContactUsForm}
        options={{ title: "Contact Us" }}
      />
    </Stack.Navigator>
  );
};

// --- Main Exported Navigator Component ---
// This component now just sets up the context provider
// and renders the ThemedStack helper component.
const ProfileNavigator = ({ isGuest, actionHandler, user }) => {
  return (
    <TasksContextProvider>
      <ThemedStack
        isGuest={isGuest}
        actionHandler={actionHandler}
        user={user}
      />
    </TasksContextProvider>
  );
};

export default ProfileNavigator;

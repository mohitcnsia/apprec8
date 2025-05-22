// navigators/ProfileNavigator.js

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "../context/ThemeContext"; // Import useTheme

// Screen Imports
import ProfileScreen from "../screens/quiz/ProfileScreen";
import GuestProfileScreen from "../screens/profile/GuestProfileScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import DummyScreen from "../screens/DummyScreen";
import LinksScreen from "../screens/LinksScreen";
import ContactUsForm from "../components/input/ContactUsForm"; // Assuming this is the correct path
import Tasks from "../screens/task/Tasks";
import TaskDetails from "../screens/task/TaskDetails";
import TaskEditor from "../screens/task/TaskEditor";
import TasksContextProvider from "../store/tasks-context";

const Stack = createStackNavigator();

// Helper component to access theme context for navigator options
const ThemedStack = ({ isGuest, actionHandler, user }) => {
  const { theme } = useTheme(); // Use the theme hook

  // Define default screenOptions using theme colors
  // These will apply to screens that have a header shown, unless overridden
  const defaultScreenOptionsConfig = {
    headerStyle: {
      backgroundColor: theme.headerBackground || theme.primary || "#800000",
    },
    headerTintColor: theme.headerTint || "#ffffff", // Color of back button and title
    headerTitleStyle: {
      fontFamily: "deliusBold", // Example: if you want a custom font for titles
    },
    // By default, let screens decide if they show a header or set a global default here.
    // For this example, let's assume most screens might want a header unless specified otherwise.
    // headerShown: true, // Or set per screen
  };

  return (
    <Stack.Navigator
      initialRouteName={isGuest ? "GuestProfile" : "ProfileScreen"}
      screenOptions={defaultScreenOptionsConfig} // Apply themed options globally for this stack
    >
      {/* Guest User Screens */}
      {isGuest ? (
        <Stack.Screen
          name="GuestProfile"
          options={{
            title: "Guest Profile",
            headerShown: true, // Explicitly show header for this screen
          }}
        >
          {(props) => (
            <GuestProfileScreen {...props} onExitGuestMode={actionHandler} />
          )}
        </Stack.Screen>
      ) : (
        // Authenticated User Screens
        <>
          <Stack.Screen
            name="ProfileScreen"
            options={{
              title: "Profile",
              headerShown: false, // Explicitly show header
            }}
          >
            {(props) => (
              <ProfileScreen
                {...props}
                signoutHandler={actionHandler}
                user={user} // Assuming user prop is passed down correctly
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{
              title: "Edit Profile",
              headerShown: true, // Explicitly show header
            }}
          />
        </>
      )}

      {/* Common Screens (some with headers, some without) */}
      <Stack.Screen
        name="LinkScreen"
        component={LinksScreen}
        options={{ headerShown: false }} // No header for LinkScreen
      />
      <Stack.Screen
        name="Tasks"
        component={Tasks}
        options={{ headerShown: false }} // NO default header for Tasks list
      />
      <Stack.Screen
        name="TaskDetails"
        component={TaskDetails}
        options={{ headerShown: false }} // NO default header for Task Details
      />
      <Stack.Screen
        name="TaskEditor"
        component={TaskEditor}
        options={{ headerShown: false }} // NO default header for Task Editor
      />
      <Stack.Screen
        name="DummyScreen"
        component={DummyScreen}
        options={{ headerShown: false }} // No header for DummyScreen
      />
      <Stack.Screen
        name="cntct" // Consider renaming to "ContactUs" for clarity if possible
        component={ContactUsForm}
        options={{
          title: "Contact Us",
          headerShown: true, // Show header for Contact Us form
        }}
      />
    </Stack.Navigator>
  );
};

// Main Exported Navigator Component
const ProfileNavigator = ({ isGuest, actionHandler, user }) => {
  return (
    // TasksContextProvider should ideally wrap navigators that contain task-related screens,
    // or even higher up if tasks are accessed from multiple tabs/navigators.
    // Placing it here means any screen within ThemedStack can access TasksContext.
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

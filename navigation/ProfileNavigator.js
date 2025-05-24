// navigators/ProfileNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "../context/ThemeContext"; // Adjust path as per your project

// Screen Imports
import ProfileScreen from "../screens/quiz/ProfileScreen"; // Adjust path
import GuestProfileScreen from "../screens/profile/GuestProfileScreen"; // Adjust path
import EditProfileScreen from "../screens/profile/EditProfileScreen"; // Adjust path
import DeleteAccountConfirmationScreen from "../screens/profile/DeleteAccountConfirmationScreen"; // Adjust path
import LinksScreen from "../screens/LinksScreen"; // Adjust path
import ContactUsForm from "../components/input/ContactUsForm"; // Adjust path
import Tasks from "../screens/task/Tasks"; // Adjust path
import TaskDetails from "../screens/task/TaskDetails"; // Adjust path
import TaskEditor from "../screens/task/TaskEditor"; // Adjust path
import TasksContextProvider from "../store/tasks-context"; // Adjust path
// Removed DummyScreen import unless you specifically use it

const Stack = createStackNavigator();

// Helper component to access theme context for navigator options
const ThemedStack = ({ isGuest, actionHandler, user }) => {
  const { theme } = useTheme();

  const defaultScreenOptionsConfig = {
    headerStyle: {
      backgroundColor: theme.headerBackground || theme.primary || "#800000",
    },
    headerTintColor: theme.headerTint || "#ffffff",
    headerTitleStyle: {
      fontFamily: "deliusBold", // Ensure this font is loaded
    },
  };

  return (
    <Stack.Navigator
      // Add a key that changes when isGuest changes.
      // This forces a re-mount of the navigator with the correct set of screens.
      key={isGuest ? "guestStack" : "userStack"}
      initialRouteName={isGuest ? "GuestProfile" : "ProfileScreen"}
      screenOptions={defaultScreenOptionsConfig}
    >
      {/* Guest User Screens */}
      {isGuest ? (
        <Stack.Screen
          name="GuestProfile"
          options={{
            title: "Guest Profile",
            headerShown: true,
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
              headerShown: false,
            }}
          >
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
            options={{
              title: "Edit Profile",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DeleteAccountConfirmation" // This screen is now correctly part of the authenticated stack
            component={DeleteAccountConfirmationScreen}
            options={{
              title: "Confirm Deletion",
              headerShown: false,
              headerBackTitle: "Profile", // iOS back button text
            }}
          />
        </>
      )}

      {/* Common Screens (available to both guest and authenticated users) */}
      <Stack.Screen
        name="LinkScreen"
        component={LinksScreen}
        options={{ headerShown: false }} // Assuming LinkScreen manages its own title or doesn't need one from navigator
      />
      <Stack.Screen
        name="Tasks"
        component={Tasks}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TaskDetails"
        component={TaskDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TaskEditor"
        component={TaskEditor}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="cntct" // Consider renaming to "ContactUs"
        component={ContactUsForm}
        options={{
          title: "Contact Us",
          headerShown: true,
        }}
      />
      {/* Add other common screens like Apprec8Reader, Quiz, DummyScreen if they are truly common */}
      {/* If Apprec8Reader and Quiz are only for authenticated users, move them inside the !isGuest block */}
    </Stack.Navigator>
  );
};

// Main Exported Navigator Component
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

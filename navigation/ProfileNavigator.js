// navigators/ProfileNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "../context/ThemeContext";

// Screen Imports
import ProfileScreen from "../screens/profile/ProfileScreen"; // Corrected path if it was quiz/ProfileScreen
import GuestProfileScreen from "../screens/profile/GuestProfileScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import DeleteAccountConfirmationScreen from "../screens/profile/DeleteAccountConfirmationScreen"; // << NEW IMPORT
import LinksScreen from "../screens/LinksScreen";
import ContactUsForm from "../components/input/ContactUsForm";
import Tasks from "../screens/task/Tasks";
import TaskDetails from "../screens/task/TaskDetails";
import TaskEditor from "../screens/task/TaskEditor";
import TasksContextProvider from "../store/tasks-context";
// Removed DummyScreen unless you use it

const Stack = createStackNavigator();

const ThemedStack = ({ isGuest, actionHandler, user }) => {
  const { theme } = useTheme();

  const defaultScreenOptionsConfig = {
    headerStyle: {
      backgroundColor: theme.headerBackground || theme.primary || "#800000",
    },
    headerTintColor: theme.headerTint || "#ffffff",
    headerTitleStyle: { fontFamily: "deliusBold" },
  };

  return (
    <Stack.Navigator
      initialRouteName={isGuest ? "GuestProfile" : "ProfileScreen"}
      screenOptions={defaultScreenOptionsConfig}
    >
      {isGuest ? (
        <Stack.Screen
          name="GuestProfile"
          options={{ title: "Guest Profile", headerShown: true }}
        >
          {(props) => (
            <GuestProfileScreen {...props} onExitGuestMode={actionHandler} />
          )}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen
            name="ProfileScreen"
            options={{ title: "Profile", headerShown: false }}
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
            options={{ title: "Edit Profile", headerShown: false }}
          />
          <Stack.Screen // << NEW SCREEN DEFINITION
            name="DeleteAccountConfirmation"
            component={DeleteAccountConfirmationScreen}
            options={{
              title: "Confirm Deletion",
              headerShown: true, // Good to have a header here
              headerBackTitle: "Profile", // iOS back button text
            }}
          />
        </>
      )}
      <Stack.Screen
        name="LinkScreen"
        component={LinksScreen}
        options={{ headerShown: false }}
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
        name="cntct"
        component={ContactUsForm}
        options={{ title: "Contact Us", headerShown: true }}
      />
    </Stack.Navigator>
  );
};

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

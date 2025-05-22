// navigators/ProfileNavigator.js

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "../context/ThemeContext";

// Screen Imports
import ProfileScreen from "../screens/quiz/ProfileScreen";
import GuestProfileScreen from "../screens/profile/GuestProfileScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import DummyScreen from "../screens/DummyScreen";
import LinksScreen from "../screens/LinksScreen";
import ContactUsForm from "../components/input/ContactUsForm"; // Corrected path from your previous code
import Tasks from "../screens/task/Tasks";
import TaskDetails from "../screens/task/TaskDetails";
import TaskEditor from "../screens/task/TaskEditor";
import TasksContextProvider from "../store/tasks-context";

const Stack = createStackNavigator();

const ThemedStack = ({ isGuest, actionHandler, user }) => {
  const { theme } = useTheme();

  const screenOptionsConfig = {
    headerStyle: {
      backgroundColor: theme.headerBackground || theme.primary || "#800000",
    },
    headerTintColor: theme.headerTint || "#ffffff",
    // headerShown: false, // This was global, we override per screen where needed
  };

  return (
    <Stack.Navigator
      initialRouteName={isGuest ? "GuestProfile" : "ProfileScreen"}
      screenOptions={screenOptionsConfig}
    >
      {isGuest ? (
        <Stack.Screen
          name="GuestProfile"
          options={{ title: "Guest Profile", headerShown: false }} // Example: GuestProfile might want a title and header
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
            options={{ title: "Edit Profile", headerShown: true }}
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
        options={{
          headerShown: true,
          title: "",
        }}
      />
      <Stack.Screen
        name="TaskDetails"
        component={TaskDetails}
        options={{
          headerShown: true,
          title: "", // <<< REMOVE TITLE TEXT
        }}
      />
      <Stack.Screen
        name="TaskEditor"
        component={TaskEditor}
        options={{
          headerShown: true,
          title: "", // <<< REMOVE TITLE TEXT (editor used to set this dynamically)
        }}
      />
      <Stack.Screen
        name="DummyScreen"
        component={DummyScreen}
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

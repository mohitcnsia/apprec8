// navigation/ProfileNavigator.js (Receive generic handler and pass specific one)

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Colors } from "../config/colors";
import ProfileScreen from "../screens/quiz/ProfileScreen"; // Adjust path
import DummyScreen from "../screens/DummyScreen"; // Adjust path
import LinksScreen from "../screens/LinksScreen"; // Adjust path
import ContactUsForm from "../components/input/ContactUsForm"; // Adjust path
import Tasks from "../screens/task/Tasks"; // Adjust path
import TaskDetails from "../screens/task/TaskDetails"; // Adjust path
import TaskEditor from "../screens/task/TaskEditor"; // Adjust path
import TasksContextProvider from "../store/tasks-context"; // Adjust path
import GuestProfileScreen from "../screens/profile/GuestProfileScreen"; // Adjust path
// Removed AuthScreen import - likely not needed here

const Stack = createStackNavigator();

// Receive isGuest, actionHandler, user props
const ProfileNavigator = ({ isGuest, actionHandler, user }) => {
  return (
    // TasksContextProvider might only be needed if logged in? Decide based on your logic.
    <TasksContextProvider>
      <Stack.Navigator
        initialRouteName={isGuest ? "GuestProfile" : "ProfileScreen"}
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primaryDarkMaroon },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontSize: 18,
            letterSpacing: 0.5,
            fontFamily: "pacifico",
          },
        }}
      >
        {isGuest ? (
          <Stack.Screen
            name="GuestProfile"
            options={{ title: "Guest Profile", headerTitleAlign: "center" }} // Consistent title
          >
            {/* Pass the received actionHandler down as onExitGuestMode prop */}
            {(props) => (
              <GuestProfileScreen {...props} onExitGuestMode={actionHandler} />
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen
            name="ProfileScreen"
            options={{ title: "Profile", headerTitleAlign: "center" }}
          >
            {/* Pass the received actionHandler down as signoutHandler prop */}
            {(props) => (
              <ProfileScreen
                {...props}
                signoutHandler={actionHandler}
                user={user}
              />
            )}
          </Stack.Screen>
        )}

        {/* Other screens reachable from Profile/Guest screens */}
        <Stack.Screen
          name="LinkScreen"
          component={LinksScreen}
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
          name="cntct"
          component={ContactUsForm}
          options={{ title: "Contact Us", headerTitleAlign: "center" }}
        />
      </Stack.Navigator>
    </TasksContextProvider>
  );
};

export default ProfileNavigator;

// Removed StyleSheet as it wasn't used here

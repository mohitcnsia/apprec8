import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Colors } from "../config/colors";
import ProfileScreen from "../screens/quiz/ProfileScreen";
import DummyScreen from "../screens/DummyScreen";
import LinksScreen from "../screens/LinksScreen";
import ContactUsForm from "../components/input/ContactUsForm";
import Tasks from "../screens/task/Tasks";
import TaskDetails from "../screens/task/TaskDetails";
import TaskEditor from "../screens/task/TaskEditor";
import TasksContextProvider from "../store/tasks-context";
import GuestProfileScreen from "../screens/profile/GuestProfileScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen"; // Import the new screen

const Stack = createStackNavigator();

const ProfileNavigator = ({ isGuest, actionHandler, user }) => {
  return (
    <TasksContextProvider>
      <Stack.Navigator
        // ... (initialRouteName logic remains the same)
        initialRouteName={isGuest ? "GuestProfile" : "ProfileScreen"}
        screenOptions={{
          // ... (screenOptions remain the same)
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
          // ... (GuestProfile screen remains the same)
          <Stack.Screen
            name="GuestProfile"
            options={{ title: "Guest Profile", headerTitleAlign: "center" }} // Consistent title
          >
            {(props) => (
              <GuestProfileScreen {...props} onExitGuestMode={actionHandler} />
            )}
          </Stack.Screen>
        ) : (
          // --- Authenticated User Screens ---
          <>
            <Stack.Screen
              name="ProfileScreen"
              options={{ title: "Profile", headerTitleAlign: "center" }}
            >
              {(props) => (
                <ProfileScreen
                  {...props}
                  signoutHandler={actionHandler}
                  user={user}
                />
              )}
            </Stack.Screen>
            {/* --- Add EditProfile Screen --- */}
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{ title: "Edit Profile", headerTitleAlign: "center" }}
            />
          </>
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

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Colors } from "../config/colors";
import { StyleSheet } from "react-native";
import ProfileScreen from "../screens/quiz/ProfileScreen";
import DummyScreen from "../screens/DummyScreen";
import LinksScreen from "../screens/LinksScreen";
import ContactUsForm from "../components/input/ContactUsForm";
import Tasks from "../screens/task/Tasks";
import TaskDetails from "../screens/task/TaskDetails";
import TaskEditor from "../screens/task/TaskEditor";
import TasksContextProvider from "../store/tasks-context";
import GuestProfileScreen from "../screens/profile/GuestProfileScreen";
import AuthScreen from "../screens/auth/AuthScreen";

const Stack = createStackNavigator();

const ProfileNavigator = ({ isGuest, signoutHandler }) => {
  return (
    <TasksContextProvider>
      <Stack.Navigator
        initialRouteName={isGuest ? "GuestProfile" : "ProfileScreen"}
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.primaryDarkMaroon, // Set your preferred background color for the header
          },
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
            children={() => (
              <GuestProfileScreen signoutHandler={signoutHandler} />
            )}
            options={{
              title: "GuestProfile",
              headerTitleAlign: "center",
            }}
          ></Stack.Screen>
        ) : (
          <Stack.Screen
            name="ProfileScreen"
            children={(props) => (
              <ProfileScreen {...props} signoutHandler={signoutHandler} />
            )}
            options={{
              title: "Profile",
              headerTitleAlign: "center",
            }}
          />
        )}

        <Stack.Screen
          name="LinkScreen"
          component={LinksScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Tasks" component={Tasks} options={{}} />
        <Stack.Screen name="TaskDetails" component={TaskDetails} options={{}} />
        <Stack.Screen name="TaskEditor" component={TaskEditor} options={{}} />
        <Stack.Screen
          name="DummyScreen"
          component={DummyScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="cntct"
          component={ContactUsForm}
          options={{
            title: "Contact Us",
            headerTitleAlign: "center",
          }}
        />
      </Stack.Navigator>
    </TasksContextProvider>
  );
};

export default ProfileNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

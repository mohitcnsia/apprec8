// navigators/ProfileNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "../context/ThemeContext"; // Adjust path as per your project

// Screen Imports
// Me tab (2026-11-04) replaces the old screens/quiz/ProfileScreen.js; the route name stays "ProfileScreen".
import MeScreen from "../screens/profile/MeScreen";
import AdminToolsScreen from "../screens/admin/AdminToolsScreen";
import GuestProfileScreen from "../screens/profile/GuestProfileScreen"; // Adjust path
import EditProfileScreen from "../screens/profile/EditProfileScreen"; // Adjust path
import DeleteAccountConfirmationScreen from "../screens/profile/DeleteAccountConfirmationScreen"; // Adjust path
import LinksScreen from "../screens/LinksScreen"; // Adjust path
import ContactUsForm from "../components/input/ContactUsForm"; // Adjust path
import Tasks from "../screens/task/Tasks"; // Adjust path
import TaskDetails from "../screens/task/TaskDetails"; // Adjust path
import TaskEditor from "../screens/task/TaskEditor"; // Adjust path
// TasksContextProvider now wraps all tabs (BottomTabNavigator), so Home shows the same reminders.
import DummyScreen from "../screens/DummyScreen"; // << ENSURE THIS IMPORT IS CORRECT AND UNCOMMENTED
import MessageCenterScreen from "../screens/profile/MessageCenterScreen";
import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import AdminKidDetailScreen from "../screens/admin/AdminKidDetailScreen";

// Import other screens like Apprec8Reader, Quiz if they are part of this stack
// For example:
// import Apprec8Reader from "../screens/reader/Apprec8Reader"; // Adjust path
// import QuizScreen from "../screens/quiz/QuizScreen"; // Adjust path

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
            headerShown: false,
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
              <MeScreen {...props} signoutHandler={actionHandler} user={user} />
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
          {/* Admin dashboard v0 (admin only; button on Profile). No header: Android back. */}
          <Stack.Screen name="AdminTools" component={AdminToolsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AdminKidDetail" component={AdminKidDetailScreen} options={{ headerShown: false }} />
          <Stack.Screen
            name="MessageCenter"
            component={MessageCenterScreen}
            options={{ title: "My Messages" }} // Set the header title
          />
          <Stack.Screen
            name="DeleteAccountConfirmation"
            component={DeleteAccountConfirmationScreen}
            options={{
              title: "Confirm Deletion",
              headerShown: false,
              headerBackTitle: "Profile",
            }}
          />
          {/* Screens specific to authenticated users can also go here */}
          {/* For example, if Apprec8Reader and Quiz are only for logged-in users: */}
          {/*
          <Stack.Screen name="Apprec8Reader" component={Apprec8Reader} options={{ headerShown: false }} />
          <Stack.Screen name="Quiz" component={QuizScreen} options={{ headerShown: false }} />
          */}
        </>
      )}

      {/* Common Screens (available to both guest and authenticated users) */}
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
        options={{
          title: "Contact Us",
          headerShown: false,
        }}
      />
      <Stack.Screen // << ENSURE DummyScreen IS REGISTERED HERE
        name="DummyScreen"
        component={DummyScreen}
        options={({ route }) => ({
          // Make title dynamic based on params
          title: route.params?.title || "Information",
          headerShown: false,
        })}
      />
      {/* If Apprec8Reader and Quiz are common, define them here instead of in the authenticated block */}
    </Stack.Navigator>
  );
};

// Main Exported Navigator Component
const ProfileNavigator = ({ isGuest, actionHandler, user }) => {
  return <ThemedStack isGuest={isGuest} actionHandler={actionHandler} user={user} />;
};

export default ProfileNavigator;

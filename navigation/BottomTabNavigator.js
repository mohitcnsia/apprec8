// navigation/BottomTabNavigator.js (Pass correct handler down)

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons"; // Keep Ionicons if used elsewhere
import MaterialIcons from "@expo/vector-icons/MaterialIcons"; // Import if needed for other icons
import { Colors } from "../config/colors";
import StudyNavigator from "./StudyNavigator";
import HomeNavigator from "./HomeNavigator";
import ProfileNavigator from "./ProfileNavigator";

const Tab = createBottomTabNavigator();

// Receive exitGuestModeHandler from App.js
function BottomTabNavigator({
  isGuest,
  signoutHandler,
  exitGuestModeHandler,
  user,
}) {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primaryDarkMaroon },
          headerTintColor: "#ffffff",
          sceneContainerStyle: { backgroundColor: Colors.primaryDarkMaroon },
          tabBarActiveTintColor: Colors.primaryDarkMaroon,
          tabBarStyle: { backgroundColor: Colors.primaryLightGray },
        }}
      >
        {/* Home Tab */}
        <Tab.Screen
          name="Apprec8"
          component={HomeNavigator}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontSize: 18,
              letterSpacing: 0.5,
              fontFamily: "pacifico",
            },
          }}
        />
        {/* Study Tab */}
        <Tab.Screen
          name="Study"
          component={StudyNavigator}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="book" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        {/* Profile Tab */}
        <Tab.Screen
          name="Profile"
          // initialParams={{ title: "Profile" }} // Can remove if using component function
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" color={color} size={size} />
            ),
            headerShown: false,
          }}
        >
          {/* Use a component function to pass props down */}
          {() => (
            <ProfileNavigator
              isGuest={isGuest}
              // Pass the *correct* handler based on guest status
              // Use a consistent prop name like onButtonPress or actionHandler
              actionHandler={isGuest ? exitGuestModeHandler : signoutHandler}
              user={user}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default BottomTabNavigator;

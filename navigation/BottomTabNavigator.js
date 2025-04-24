// navigation/BottomTabNavigator.js

import React from "react"; // Import React
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { NavigationContainer } from "@react-navigation/native"; // <<< REMOVE THIS LINE
import Ionicons from "@expo/vector-icons/Ionicons";
// import { Colors } from "../config/colors"; // <<< REMOVE THIS LINE
import StudyNavigator from "./StudyNavigator";
import HomeNavigator from "./HomeNavigator";
import ProfileNavigator from "./ProfileNavigator";
import { useTheme } from "../context/ThemeContext"; // <<< KEEP THIS

const Tab = createBottomTabNavigator();

// Props received from AppContent (remain the same)
function BottomTabNavigator({
  isGuest,
  signoutHandler,
  exitGuestModeHandler,
  user,
}) {
  const { theme } = useTheme(); // Get theme object

  return (
    // <<< REMOVE NavigationContainer wrapper >>>
    // <NavigationContainer>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Use function form to access route
        headerShown: false, // Keep headers hidden for tabs
        // --- CORRECTED Tab Bar Styling ---
        tabBarStyle: {
          backgroundColor: theme.tabBarBackground, // Use specific theme key
          borderTopColor: theme.border || "transparent", // Use theme border color (or transparent)
          // Add other styles like height if needed
        },
        tabBarActiveTintColor: theme.tabBarActiveTint, // Use specific theme key
        tabBarInactiveTintColor: theme.tabBarInactiveTint, // Use specific theme key
        // --- End Corrected Tab Bar Styling ---

        // Scene background (keep this)
        sceneContainerStyle: { backgroundColor: theme.background },

        // --- Optional: Remove or theme unused header styles ---
        // headerStyle: { backgroundColor: theme.headerBackground }, // Example if header shown
        // headerTintColor: theme.headerTint, // Example if header shown
        // --- End Optional ---

        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          // Determine icon based on route name (ensure names match Tab.Screen names)
          if (route.name === "Apprec8") {
            // Changed from 'HomeTab'/'HomeRoot' to match actual Screen name
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Study") {
            // Changed from 'StudyTab'/'StudyRoot'
            iconName = focused ? "book" : "book-outline";
          } else if (route.name === "Profile") {
            // Changed from 'ProfileTab'/'ProfileRoot'
            iconName = focused ? "person-circle" : "person-circle-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Home Tab */}
      <Tab.Screen
        name="Apprec8" // Ensure this name is used in tabBarIcon logic
        component={HomeNavigator}
        options={{
          title: "Home", // Sets the label below the icon
          // tabBarIcon is handled in screenOptions
        }}
      />
      {/* Study Tab */}
      <Tab.Screen
        name="Study" // Ensure this name is used in tabBarIcon logic
        component={StudyNavigator}
        options={{
          title: "Study", // Sets the label
          // tabBarIcon is handled in screenOptions
        }}
      />
      {/* Profile Tab */}
      <Tab.Screen
        name="Profile" // Ensure this name is used in tabBarIcon logic
        options={{
          title: "Profile", // Sets the label
          // tabBarIcon is handled in screenOptions
        }}
        // Children function to pass props (this part is correct)
      >
        {() => (
          <ProfileNavigator
            isGuest={isGuest}
            actionHandler={isGuest ? exitGuestModeHandler : signoutHandler}
            user={user}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
    // </NavigationContainer> // <<< REMOVE NavigationContainer wrapper >>>
  );
}

export default BottomTabNavigator;

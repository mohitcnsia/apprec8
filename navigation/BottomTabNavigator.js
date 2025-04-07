import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../config/colors";
import StudyNavigator from "./StudyNavigator";
import HomeNavigator from "./HomeNavigator";
import ProfileNavigator from "./ProfileNavigator";

const Tab = createBottomTabNavigator();

function BottomTabNavigator({ isGuest, signoutHandler, user }) {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.primaryDarkMaroon, // Set your preferred background color for the header
          },
          headerTintColor: "#ffffff", // Change text color in the header (like the back button)
          sceneContainerStyle: { backgroundColor: Colors.primaryDarkMaroon },
          tabBarActiveTintColor: Colors.primaryDarkMaroon,
          tabBarStyle: { backgroundColor: Colors.primaryLightGray },
        }}
      >
        <Tab.Screen
          name="Apprec8"
          component={HomeNavigator}
          initialParams={{ title: "Home Screen" }}
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
        {/* <Tab.Screen
          name="Stats"
          component={StatsScreen}
          initialParams={{ title: "Leaderboard" }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="leaderboard" color={color} size={size} />
            ),
          }}
        /> */}
        <Tab.Screen
          name="Profile"
          initialParams={{ title: "Profile" }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" color={color} size={size} />
            ),
            headerShown: false,
          }}
        >
          {() => (
            <ProfileNavigator
              isGuest={isGuest}
              signoutHandler={signoutHandler}
              user={user}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default BottomTabNavigator;

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "../config/colors";
import QuizNavigator from "./QuizNavigator";
import ProfileScreen from "../screens/quiz/ProfileScreen";
import StatsScreen from "../screens/quiz/StatsScreen";
import StudyNavigator from "./StudyNavigator";
import HomeNavigator from "./HomeNavigator";

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
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
        <Tab.Screen
          name="Topics"
          component={QuizNavigator}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="thunderstorm" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Stats"
          component={StatsScreen}
          initialParams={{ title: "Leaderboard" }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="leaderboard" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          initialParams={{ title: "Profile Screen" }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default BottomTabNavigator;

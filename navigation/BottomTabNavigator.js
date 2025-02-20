import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DrawerScreen from "../screens/DummyScreen";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../config/colors";

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
          name="Home"
          component={DrawerScreen}
          initialParams={{ title: "Home Screen" }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={DrawerScreen}
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

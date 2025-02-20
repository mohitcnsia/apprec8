import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import DummyScreen from "../screens/DummyScreen";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <NavigationContainer
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primaryDarkMaroon, // Set your preferred background color for the header
        },
        headerTintColor: "#ffffff", // Change text color in the header (like the back button)
        sceneContainerStyle: { backgroundColor: Colors.primaryDarkMaroon },
      }}
    >
      <Drawer.Navigator>
        <Drawer.Screen
          name="Inbox"
          component={DummyScreen}
          initialParams={{ title: "Inbox" }}
        />
        <Drawer.Screen
          name="Favourites"
          component={DummyScreen}
          initialParams={{ title: "Favourites" }}
        />
        <Drawer.Screen
          name="Leaderboard"
          component={DummyScreen}
          initialParams={{ title: "Leaderboard" }}
        />
        <Drawer.Screen
          name="Settings"
          component={DummyScreen}
          initialParams={{ title: "Settings" }}
        />
        <Drawer.Screen
          name="Account"
          component={DummyScreen}
          initialParams={{ title: "Account" }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default DrawerNavigator;

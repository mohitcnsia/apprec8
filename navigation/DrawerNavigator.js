import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import DrawerScreen from "../screens/drawer/DrawerScreen";

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
        <Drawer.Screen name="Inbox" component={DrawerScreen} />
        <Drawer.Screen name="Favourites" component={DrawerScreen} />
        <Drawer.Screen name="Leaderboard" component={DrawerScreen} />
        <Drawer.Screen name="Settings" component={DrawerScreen} />
        <Drawer.Screen name="Account" component={DrawerScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default DrawerNavigator;

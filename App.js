import { StatusBar, StyleSheet, Text, View } from "react-native";
import { Colors } from "./config/colors";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ManageExpenses from "./screens/ManageExpenses";
import RecentExpenses from "./screens/RecentExpenses";
import AllExpenses from "./screens/AllExpenses";

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

function ExpensesOverview() {
  return <BottomTabs.Navigator>
    <BottomTabs.Screen name="Recent Expenses" component={RecentExpenses} />
    <BottomTabs.Screen name="AllExpenses" component={AllExpenses} />
  </BottomTabs.Navigator>
}

export default function App() {
  return (
    <>
    <StatusBar style='auto'/>
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Expense Overview" component={ExpensesOverview} />
        <Stack.Screen name="ManageExpenses" component={ManageExpenses} />
      </Stack.Navigator>
    </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the View fills the entire screen
    backgroundColor: Colors.primaryDarkMaroon, // Your desired background color
    justifyContent: 'center'
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.primaryBrightYellow,
    textAlign: "center",
  },
});

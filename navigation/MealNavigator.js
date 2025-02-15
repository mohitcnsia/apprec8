import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MealsOverviewScreen from "../screens/MealsOverviewScreen";
import CategoriesScreen from "../screens/CategoriesScreen";

const Stack = createStackNavigator();

const MealNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Meal Categories" component={CategoriesScreen} />
        <Stack.Screen
          name="Meal Overview"
          component={MealsOverviewScreen}
          options={({ route }) => {
            const catName = route.params.categoryName;
            return { title: catName };
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MealNavigator;

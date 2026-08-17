import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MealPlannerStackParamList } from "./types";
import { MealPlannerScreen } from "../screens/MealPlannerScreen";
import { MealPlanHistoryScreen } from "../screens/MealPlanHistoryScreen";

const Stack = createNativeStackNavigator<MealPlannerStackParamList>();

export function MealPlannerStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MealPlannerHome" component={MealPlannerScreen} />
      <Stack.Screen name="MealPlanHistory" component={MealPlanHistoryScreen} />
    </Stack.Navigator>
  );
}

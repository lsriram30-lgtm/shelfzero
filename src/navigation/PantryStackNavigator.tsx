import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PantryStackParamList } from "./types";
import { PantryScreen } from "../screens/pantry/PantryScreen";
import { PantryStatsScreen } from "../screens/pantry/PantryStatsScreen";
import { AddPantryItemScreen } from "../screens/pantry/AddPantryItemScreen";
import { ScanScreen } from "../screens/pantry/ScanScreen";

const Stack = createNativeStackNavigator<PantryStackParamList>();

export function PantryStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Pantry" component={PantryScreen} />
      <Stack.Screen name="PantryStats" component={PantryStatsScreen} />
      <Stack.Screen
        name="AddPantryItem"
        component={AddPantryItemScreen}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen name="Scan" component={ScanScreen} options={{ presentation: "modal" }} />
    </Stack.Navigator>
  );
}

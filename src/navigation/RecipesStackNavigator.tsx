import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RecipesStackParamList } from "./types";
import { RecipesScreen } from "../screens/recipes/RecipesScreen";
import { RecipeDetailScreen } from "../screens/recipes/RecipeDetailScreen";

const Stack = createNativeStackNavigator<RecipesStackParamList>();

export function RecipesStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Recipes" component={RecipesScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
    </Stack.Navigator>
  );
}

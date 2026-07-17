import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { MainTabParamList } from "./types";
import { useTheme } from "../context/ThemeContext";
import { DashboardScreen } from "../screens/DashboardScreen";
import { PantryStackNavigator } from "./PantryStackNavigator";
import { RecipesStackNavigator } from "./RecipesStackNavigator";
import { MealPlannerScreen } from "../screens/MealPlannerScreen";
import { HouseholdStackNavigator } from "./HouseholdStackNavigator";

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
  Dashboard: "home-outline",
  PantryTab: "basket-outline",
  RecipesTab: "restaurant-outline",
  MealPlanner: "calendar-outline",
  HouseholdTab: "people-outline",
};

export function TabNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONS[route.name as keyof MainTabParamList]} color={color} size={size} />
        ),
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="PantryTab" component={PantryStackNavigator} options={{ title: "Pantry" }} />
      <Tab.Screen name="RecipesTab" component={RecipesStackNavigator} options={{ title: "Recipes" }} />
      <Tab.Screen name="MealPlanner" component={MealPlannerScreen} options={{ title: "Meal Plan" }} />
      <Tab.Screen
        name="HouseholdTab"
        component={HouseholdStackNavigator}
        options={{ title: "Household" }}
      />
    </Tab.Navigator>
  );
}

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HouseholdStackParamList } from "./types";
import { HouseholdHubScreen } from "../screens/household/HouseholdHubScreen";
import { ProfileScreen } from "../screens/household/ProfileScreen";
import { InviteFlowScreen } from "../screens/household/InviteFlowScreen";

const Stack = createNativeStackNavigator<HouseholdStackParamList>();

export function HouseholdStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HouseholdHub" component={HouseholdHubScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name="InviteFlow"
        component={InviteFlowScreen}
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}

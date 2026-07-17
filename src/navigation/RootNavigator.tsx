import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import { TabNavigator } from "./TabNavigator";
import { OnboardingScreen } from "../screens/onboarding/OnboardingScreen";
import { JoinScreen } from "../screens/JoinScreen";
import { useOnboarding } from "../context/OnboardingContext";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isComplete } = useOnboarding();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isComplete && <Stack.Screen name="Onboarding" component={OnboardingScreen} />}
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen
        name="Join"
        component={JoinScreen}
        options={{ presentation: "modal", headerShown: false }}
      />
    </Stack.Navigator>
  );
}

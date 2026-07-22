import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import { TabNavigator } from "./TabNavigator";
import { AuthStackNavigator } from "./AuthStackNavigator";
import { OnboardingScreen } from "../screens/onboarding/OnboardingScreen";
import { JoinScreen } from "../screens/JoinScreen";
import { useOnboarding } from "../context/OnboardingContext";
import { useAuth } from "../context/AuthContext";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isComplete } = useOnboarding();
  const { isSignedIn, isLoading } = useAuth();

  if (isLoading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isSignedIn ? (
        <Stack.Screen name="Auth" component={AuthStackNavigator} />
      ) : (
        <>
          {!isComplete && <Stack.Screen name="Onboarding" component={OnboardingScreen} />}
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen
            name="Join"
            component={JoinScreen}
            options={{ presentation: "modal", headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

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
  const { isComplete, isLoading: onboardingLoading } = useOnboarding();
  const { isSignedIn, isLoading: authLoading } = useAuth();

  if (authLoading || onboardingLoading) return null;

  // Sign-up now lives inside the questionnaire itself (its first question),
  // so a brand-new user goes straight to Onboarding. The Auth stack is only
  // for a returning user who signed out and needs to sign back in — someone
  // who already finished the questionnaire once shouldn't have to redo it.
  const showAuth = !isSignedIn && isComplete;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {showAuth ? (
        <Stack.Screen name="Auth" component={AuthStackNavigator} />
      ) : !isComplete ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <>
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

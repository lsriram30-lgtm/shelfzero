import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import { TabNavigator } from "./TabNavigator";
import { AuthStackNavigator } from "./AuthStackNavigator";
import { OnboardingScreen } from "../screens/onboarding/OnboardingScreen";
import { JoinScreen } from "../screens/JoinScreen";
import { ResetPasswordScreen } from "../screens/ResetPasswordScreen";
import { RemovedFromHouseholdScreen } from "../screens/RemovedFromHouseholdScreen";
import { useOnboarding } from "../context/OnboardingContext";
import { useAuth } from "../context/AuthContext";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isComplete, isLoading: onboardingLoading } = useOnboarding();
  const { isSignedIn, isLoading: authLoading, removedFromHousehold } = useAuth();

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
      ) : removedFromHousehold ? (
        <Stack.Screen name="RemovedFromHousehold" component={RemovedFromHouseholdScreen} />
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
      {/* Mounted regardless of auth/onboarding state: a password-reset link
          arrives by email and has to work no matter what screen the app
          would otherwise land on. */}
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ presentation: "modal", headerShown: false }}
      />
    </Stack.Navigator>
  );
}

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OnboardingProfile } from "../types";

const STORAGE_KEY = "shelfzero.onboardingProfile";

interface OnboardingContextValue {
  profile: OnboardingProfile | null;
  isComplete: boolean;
  isLoading: boolean;
  completeOnboarding: (profile: OnboardingProfile) => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) setProfile(JSON.parse(stored));
      })
      .finally(() => setIsLoading(false));
  }, []);

  const completeOnboarding = async (next: OnboardingProfile) => {
    setProfile(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const resetOnboarding = async () => {
    setProfile(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({ profile, isComplete: !!profile, isLoading, completeOnboarding, resetOnboarding }),
    [profile, isLoading]
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within an OnboardingProvider");
  return ctx;
}

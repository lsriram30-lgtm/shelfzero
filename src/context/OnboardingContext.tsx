import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OnboardingProfile } from "../types";
import { useAuth } from "./AuthContext";
import { storageKeyFor } from "../utils/onboardingStorageKey";
import { clearOnboardingDraft } from "../utils/onboardingDraftCache";

interface OnboardingContextValue {
  profile: OnboardingProfile | null;
  isComplete: boolean;
  isLoading: boolean;
  completeOnboarding: (profile: OnboardingProfile) => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { currentEmail, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for AuthContext to resolve the real signed-in email first, so
    // this doesn't briefly load the "anonymous" key and then swap to the
    // right one a moment later.
    if (authLoading) return;
    let cancelled = false;
    setIsLoading(true);
    AsyncStorage.getItem(storageKeyFor(currentEmail))
      .then((stored) => {
        if (cancelled) return;
        setProfile(stored ? JSON.parse(stored) : null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [currentEmail, authLoading]);

  const completeOnboarding = async (next: OnboardingProfile) => {
    const previous = profile;
    setProfile(next);
    try {
      await AsyncStorage.setItem(storageKeyFor(currentEmail), JSON.stringify(next));
    } catch (err) {
      setProfile(previous);
      throw err;
    }
  };

  const resetOnboarding = async () => {
    setProfile(null);
    await AsyncStorage.removeItem(storageKeyFor(currentEmail)).catch(() => {});
    await clearOnboardingDraft(currentEmail);
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

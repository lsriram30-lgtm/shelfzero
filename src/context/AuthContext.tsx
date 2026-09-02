import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { authApi } from "../api/auth";
import { householdApi } from "../api/household";
import { AUTH_TOKEN_KEY, setSessionExpiredHandler } from "../api/client";

const AUTH_EMAIL_KEY = "shelfzero.authEmail";

async function ensureHousehold(householdName: string) {
  try {
    const me = await householdApi.me();
    if (!me.householdId) {
      await householdApi.create(householdName);
    }
  } catch {
    // Best-effort: if this fails, screens that need a household will
    // surface their own error, and it can be retried later.
  }
}

interface AuthContextValue {
  isSignedIn: boolean;
  isLoading: boolean;
  currentEmail: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      SecureStore.getItemAsync(AUTH_TOKEN_KEY),
      SecureStore.getItemAsync(AUTH_EMAIL_KEY),
    ])
      .then(([token, email]) => {
        setIsSignedIn(!!token);
        setCurrentEmail(email);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // A 401 elsewhere in the app means the token client.ts just deleted was
  // no longer valid — drop back to signed-out state so RootNavigator sends
  // the user to the sign-in screen instead of leaving them on a screen that
  // just keeps 401ing.
  useEffect(() => {
    setSessionExpiredHandler(() => setIsSignedIn(false));
    return () => setSessionExpiredHandler(null);
  }, []);

  const signIn = async (email: string, password: string) => {
    const { token } = await authApi.signIn(email, password);
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    await SecureStore.setItemAsync(AUTH_EMAIL_KEY, email);
    await ensureHousehold("My Household");
    setCurrentEmail(email);
    setIsSignedIn(true);
  };

  const signUp = async (name: string, email: string, password: string) => {
    const { token } = await authApi.signUp(name, email, password);
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    await SecureStore.setItemAsync(AUTH_EMAIL_KEY, email);
    await ensureHousehold(`${name}'s Household`);
    setCurrentEmail(email);
    setIsSignedIn(true);
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    // Deliberately not clearing AUTH_EMAIL_KEY here: OnboardingContext reads
    // it to key the cached profile by account, and a signed-out user who
    // signs back in as themselves should still see their own cached
    // profile rather than being treated as a brand-new device. It's
    // overwritten as soon as anyone (the same person or someone else)
    // actually signs in/up again.
    setIsSignedIn(false);
  };

  const value = useMemo(
    () => ({ isSignedIn, isLoading, currentEmail, signIn, signUp, signOut }),
    [isSignedIn, isLoading, currentEmail]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { authApi } from "../api/auth";
import { householdApi } from "../api/household";
import { AUTH_TOKEN_KEY } from "../api/client";

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
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync(AUTH_TOKEN_KEY)
      .then((token) => setIsSignedIn(!!token))
      .finally(() => setIsLoading(false));
  }, []);

  const signIn = async (email: string, password: string) => {
    const { token } = await authApi.signIn(email, password);
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    await ensureHousehold("My Household");
    setIsSignedIn(true);
  };

  const signUp = async (name: string, email: string, password: string) => {
    const { token } = await authApi.signUp(name, email, password);
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    await ensureHousehold(`${name}'s Household`);
    setIsSignedIn(true);
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    setIsSignedIn(false);
  };

  const value = useMemo(
    () => ({ isSignedIn, isLoading, signIn, signUp, signOut }),
    [isSignedIn, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

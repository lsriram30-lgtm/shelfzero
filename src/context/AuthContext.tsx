import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { authApi } from "../api/auth";
import { householdApi } from "../api/household";
import { AUTH_TOKEN_KEY, setSessionExpiredHandler } from "../api/client";
import { hasHadHousehold, markHasHadHousehold } from "../utils/householdMembershipCache";

const AUTH_EMAIL_KEY = "shelfzero.authEmail";

async function ensureHousehold(householdName: string, email: string | null) {
  try {
    const me = await householdApi.me();
    if (!me.householdId) {
      await householdApi.create(householdName);
    }
    await markHasHadHousehold(email);
  } catch {
    // Best-effort: if this fails, screens that need a household will
    // surface their own error, and it can be retried later.
  }
}

interface AuthContextValue {
  isSignedIn: boolean;
  isLoading: boolean;
  currentEmail: string | null;
  // True once a relaunch or a data hook detects this account no longer
  // has the household it used to (removed by someone else - there's no
  // push/websocket to learn about it any other way). RootNavigator shows
  // a clear notice instead of silently dropping them into an empty state.
  removedFromHousehold: boolean;
  acknowledgeRemoval: () => Promise<void>;
  reportRemovedFromHousehold: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [removedFromHousehold, setRemovedFromHousehold] = useState(false);

  useEffect(() => {
    Promise.all([
      SecureStore.getItemAsync(AUTH_TOKEN_KEY),
      SecureStore.getItemAsync(AUTH_EMAIL_KEY),
    ])
      .then(async ([token, email]) => {
        setIsSignedIn(!!token);
        setCurrentEmail(email);
        if (!token) return;
        // Re-check household state on every relaunch, not just at
        // sign-in/sign-up - someone can be removed from their household
        // while this device's app isn't running, and there's no
        // push/websocket to learn about it any other way.
        try {
          const me = await householdApi.me();
          if (me.householdId) {
            await markHasHadHousehold(email);
          } else if (await hasHadHousehold(email)) {
            setRemovedFromHousehold(true);
          }
        } catch {
          // Best-effort - a real screen will surface its own error if this
          // turns out to be something other than a "no household" state.
        }
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
    await ensureHousehold("My Household", email);
    setCurrentEmail(email);
    setIsSignedIn(true);
  };

  const signUp = async (name: string, email: string, password: string) => {
    const { token } = await authApi.signUp(name, email, password);
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    await SecureStore.setItemAsync(AUTH_EMAIL_KEY, email);
    await ensureHousehold(`${name}'s Household`, email);
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

  // Called once the removed-from-household notice has been shown and
  // acknowledged - re-provisions a fresh, empty household, the same as
  // "Leave household" already does.
  const acknowledgeRemoval = async () => {
    await ensureHousehold("My Household", currentEmail);
    setRemovedFromHousehold(false);
  };

  // Lets a data hook (usePantry, useShoppingList, ...) report the same
  // condition if it's hit mid-session instead of only at the cold-start
  // check above - e.g. someone removes you while the app is already open.
  const reportRemovedFromHousehold = () => setRemovedFromHousehold(true);

  const value = useMemo(
    () => ({
      isSignedIn,
      isLoading,
      currentEmail,
      removedFromHousehold,
      acknowledgeRemoval,
      reportRemovedFromHousehold,
      signIn,
      signUp,
      signOut,
    }),
    [isSignedIn, isLoading, currentEmail, removedFromHousehold]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

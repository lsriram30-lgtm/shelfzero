import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  cancelExpiryReminders,
  requestNotificationPermission,
} from "../notifications/expiryNotifications";
import { useAuth } from "./AuthContext";
import { accountScopedKey } from "../utils/accountScopedKey";

const STORAGE_KEY_PREFIX = "shelfzero.notificationPreferences";

interface NotificationPreferences {
  notifyExpiry: boolean;
  notifyInvites: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  notifyExpiry: true,
  notifyInvites: true,
};

interface NotificationPreferencesContextValue extends NotificationPreferences {
  isLoading: boolean;
  setNotifyExpiry: (value: boolean) => void;
  setNotifyInvites: (value: boolean) => void;
}

const NotificationPreferencesContext = createContext<
  NotificationPreferencesContextValue | undefined
>(undefined);

export function NotificationPreferencesProvider({ children }: { children: React.ReactNode }) {
  const { currentEmail, isLoading: authLoading } = useAuth();
  const storageKey = accountScopedKey(STORAGE_KEY_PREFIX, currentEmail);
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    setIsLoading(true);
    AsyncStorage.getItem(storageKey)
      .then((stored) => {
        setPreferences(stored ? { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) } : DEFAULT_PREFERENCES);
      })
      .finally(() => setIsLoading(false));
  }, [storageKey, authLoading]);

  useEffect(() => {
    if (isLoading) return;
    if (preferences.notifyExpiry || preferences.notifyInvites) {
      requestNotificationPermission().catch(() => {});
    }
  }, [isLoading, preferences.notifyExpiry, preferences.notifyInvites]);

  const updatePreferences = (next: NotificationPreferences) => {
    setPreferences(next);
    AsyncStorage.setItem(storageKey, JSON.stringify(next)).catch(() => {});
  };

  const setNotifyExpiry = (value: boolean) => {
    updatePreferences({ ...preferences, notifyExpiry: value });
    if (!value) cancelExpiryReminders().catch(() => {});
  };

  const setNotifyInvites = (value: boolean) => {
    updatePreferences({ ...preferences, notifyInvites: value });
  };

  const value = useMemo(
    () => ({ ...preferences, isLoading, setNotifyExpiry, setNotifyInvites }),
    [preferences, isLoading]
  );

  return (
    <NotificationPreferencesContext.Provider value={value}>
      {children}
    </NotificationPreferencesContext.Provider>
  );
}

export function useNotificationPreferences() {
  const ctx = useContext(NotificationPreferencesContext);
  if (!ctx) {
    throw new Error(
      "useNotificationPreferences must be used within a NotificationPreferencesProvider"
    );
  }
  return ctx;
}

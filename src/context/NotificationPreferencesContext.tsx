import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "shelfzero.notificationPreferences";

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
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) setPreferences({ ...DEFAULT_PREFERENCES, ...JSON.parse(stored) });
      })
      .finally(() => setIsLoading(false));
  }, []);

  const updatePreferences = (next: NotificationPreferences) => {
    setPreferences(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  };

  const setNotifyExpiry = (value: boolean) => {
    updatePreferences({ ...preferences, notifyExpiry: value });
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

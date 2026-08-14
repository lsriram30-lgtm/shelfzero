import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DonationRecord } from "../types";
import { useAuth } from "./AuthContext";
import { accountScopedKey } from "../utils/accountScopedKey";

const STORAGE_KEY_PREFIX = "shelfzero.donationHistory";

interface DonationContextValue {
  history: DonationRecord[];
  totalItemsDonated: number;
  isLoading: boolean;
  recordDonation: (record: Omit<DonationRecord, "id" | "date">) => Promise<void>;
}

const DonationContext = createContext<DonationContextValue | undefined>(undefined);

export function DonationProvider({ children }: { children: React.ReactNode }) {
  const { currentEmail, isLoading: authLoading } = useAuth();
  const storageKey = accountScopedKey(STORAGE_KEY_PREFIX, currentEmail);
  const [history, setHistory] = useState<DonationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for AuthContext to resolve the real signed-in email first, so
    // this doesn't load once under the "anonymous" key and then swap to a
    // different account's history a moment later.
    if (authLoading) return;
    setIsLoading(true);
    AsyncStorage.getItem(storageKey)
      .then((stored) => {
        setHistory(stored ? JSON.parse(stored) : []);
      })
      .finally(() => setIsLoading(false));
  }, [storageKey, authLoading]);

  const recordDonation = async (record: Omit<DonationRecord, "id" | "date">) => {
    const next: DonationRecord = {
      ...record,
      id: `${Date.now()}`,
      date: new Date().toISOString(),
    };
    const updated = [next, ...history];
    setHistory(updated);
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (err) {
      setHistory(history);
      throw err;
    }
  };

  const totalItemsDonated = useMemo(
    () => history.reduce((sum, record) => sum + record.itemNames.length, 0),
    [history]
  );

  const value = useMemo(
    () => ({ history, totalItemsDonated, isLoading, recordDonation }),
    [history, totalItemsDonated, isLoading]
  );

  return <DonationContext.Provider value={value}>{children}</DonationContext.Provider>;
}

export function useDonations() {
  const ctx = useContext(DonationContext);
  if (!ctx) throw new Error("useDonations must be used within a DonationProvider");
  return ctx;
}

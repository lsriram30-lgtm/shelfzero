import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DonationRecord } from "../types";

const STORAGE_KEY = "shelfzero.donationHistory";

interface DonationContextValue {
  history: DonationRecord[];
  totalItemsDonated: number;
  isLoading: boolean;
  recordDonation: (record: Omit<DonationRecord, "id" | "date">) => Promise<void>;
}

const DonationContext = createContext<DonationContextValue | undefined>(undefined);

export function DonationProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<DonationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) setHistory(JSON.parse(stored));
      })
      .finally(() => setIsLoading(false));
  }, []);

  const recordDonation = async (record: Omit<DonationRecord, "id" | "date">) => {
    const next: DonationRecord = {
      ...record,
      id: `${Date.now()}`,
      date: new Date().toISOString(),
    };
    const updated = [next, ...history];
    setHistory(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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

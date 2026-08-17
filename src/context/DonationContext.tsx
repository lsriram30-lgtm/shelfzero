import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DonationRecord } from "../types";
import { useAuth } from "./AuthContext";
import { donationsApi } from "../api/donations";

interface DonationContextValue {
  history: DonationRecord[];
  totalItemsDonated: number;
  isLoading: boolean;
  recordDonation: (record: Omit<DonationRecord, "id" | "date">) => Promise<void>;
  refresh: () => Promise<void>;
}

const DonationContext = createContext<DonationContextValue | undefined>(undefined);

export function DonationProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoading: authLoading } = useAuth();
  const [history, setHistory] = useState<DonationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    setIsLoading(true);
    try {
      const data = await donationsApi.list();
      setHistory(data);
    } catch {
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isSignedIn) {
      setHistory([]);
      setIsLoading(false);
      return;
    }
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isSignedIn]);

  const recordDonation = async (record: Omit<DonationRecord, "id" | "date">) => {
    await donationsApi.create(record);
    await refresh();
  };

  const totalItemsDonated = useMemo(
    () => history.reduce((sum, record) => sum + record.itemNames.length, 0),
    [history]
  );

  const value = useMemo(
    () => ({ history, totalItemsDonated, isLoading, recordDonation, refresh }),
    [history, totalItemsDonated, isLoading]
  );

  return <DonationContext.Provider value={value}>{children}</DonationContext.Provider>;
}

export function useDonations() {
  const ctx = useContext(DonationContext);
  if (!ctx) throw new Error("useDonations must be used within a DonationProvider");
  return ctx;
}

import { apiClient } from "./client";
import { DonationRecord } from "../types";

export const donationsApi = {
  // Defensive unwrap for the same reason as recipes.ts/favorites.ts - this
  // backend has repeatedly wrapped list responses (`{ items: [...] }`) where
  // a bare array was implied.
  list: async (): Promise<DonationRecord[]> => {
    const data = await apiClient.get<DonationRecord[] | { donations?: DonationRecord[]; items?: DonationRecord[] }>(
      "/api/donations"
    );
    if (Array.isArray(data)) return data;
    return data?.donations ?? data?.items ?? [];
  },
  create: (record: Omit<DonationRecord, "id" | "date">) =>
    apiClient.post<unknown>("/api/donations", record),
};

import { apiClient } from "./client";

export type CurrentUser = {
  householdId: string | null;
};

export const householdApi = {
  me: () => apiClient.get<CurrentUser>("/api/me"),
  create: (name: string) =>
    apiClient.post<{ householdId: string }>("/api/household/create", { name }),
};

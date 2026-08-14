import { apiClient } from "./client";

export type CurrentUser = {
  householdId: string | null;
  role?: "owner" | "member";
};

export const householdApi = {
  me: () => apiClient.get<CurrentUser>("/api/me"),
  create: (name: string) =>
    apiClient.post<{ householdId: string }>("/api/household/create", { name }),
  deleteAccount: () => apiClient.delete<{ ok: boolean }>("/api/me"),
  removeMember: (id: string) => apiClient.delete<void>(`/api/household/members/${id}`),
  leave: () => apiClient.post<void>("/api/household/leave"),
};

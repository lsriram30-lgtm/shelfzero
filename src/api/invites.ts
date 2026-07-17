import { apiClient } from "./client";
import { HouseholdInvite, NewInvite } from "../types";

export const invitesApi = {
  list: () => apiClient.get<HouseholdInvite[]>("/api/invites"),
  create: (invite: NewInvite) => apiClient.post<HouseholdInvite>("/api/invites", invite),
  accept: (token: string) => apiClient.post<{ ok: boolean }>("/api/invites/accept", { token }),
  cancel: (id: string) => apiClient.delete<void>(`/api/invites/${id}`),
};

import { apiClient } from "./client";
import { NewPantryItem, PantryItem, UpdatePantryItem } from "../types";

export const pantryApi = {
  list: () => apiClient.get<PantryItem[]>("/api/pantry"),
  create: (item: NewPantryItem) => apiClient.post<PantryItem>("/api/pantry", item),
  update: (id: string, item: UpdatePantryItem) =>
    apiClient.put<PantryItem>(`/api/pantry/${id}`, item),
  remove: (id: string) => apiClient.delete<void>(`/api/pantry/${id}`),
};

import { apiClient } from "./client";
import { NewShoppingListItem, ShoppingListItem } from "../types";

export const shoppingListApi = {
  list: () => apiClient.get<{ items: ShoppingListItem[] }>("/api/shopping-list"),
  create: (item: NewShoppingListItem) =>
    apiClient.post<ShoppingListItem>("/api/shopping-list", item),
  setChecked: (id: string, checked: boolean) =>
    apiClient.patch<ShoppingListItem>(`/api/shopping-list/${id}`, { checked }),
  remove: (id: string) => apiClient.delete<void>(`/api/shopping-list/${id}`),
};

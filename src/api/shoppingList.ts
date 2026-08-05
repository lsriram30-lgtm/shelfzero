import { apiClient } from "./client";
import { NewShoppingListItem, ShoppingListItem } from "../types";

// The backend returns qty as a JSON string (e.g. "9"), not a number —
// normalize it once here so the rest of the app can trust the type.
type RawShoppingListItem = Omit<ShoppingListItem, "qty"> & { qty: number | string };

function normalize(raw: RawShoppingListItem): ShoppingListItem {
  return { ...raw, qty: Number(raw.qty) };
}

export const shoppingListApi = {
  list: async () => {
    const data = await apiClient.get<{ items: RawShoppingListItem[] }>("/api/shopping-list");
    return { items: data.items.map(normalize) };
  },
  create: async (item: NewShoppingListItem) => {
    const data = await apiClient.post<{ item: RawShoppingListItem }>("/api/shopping-list", item);
    return normalize(data.item);
  },
  setChecked: (id: string, checked: boolean) =>
    apiClient.patch<{ success: boolean }>(`/api/shopping-list/${id}`, { checked }),
  setQuantity: (id: string, qty: number) =>
    apiClient.patch<{ success: boolean }>(`/api/shopping-list/${id}`, { qty }),
  remove: (id: string) => apiClient.delete<void>(`/api/shopping-list/${id}`),
};

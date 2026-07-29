import { useCallback, useEffect, useState } from "react";
import { shoppingListApi } from "../api";
import { NewShoppingListItem, ShoppingListItem } from "../types";

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await shoppingListApi.list();
      setItems(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load shopping list");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = useCallback(async (item: NewShoppingListItem) => {
    const created = await shoppingListApi.create(item);
    setItems((prev) => [created, ...prev]);
    return created;
  }, []);

  const toggleChecked = useCallback(async (id: string, checked: boolean) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, checked } : i)));
    try {
      await shoppingListApi.setChecked(id, checked);
    } catch (err) {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, checked: !checked } : i)));
      throw err;
    }
  }, []);

  const removeItem = useCallback(async (id: string) => {
    await shoppingListApi.remove(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearChecked = useCallback(async () => {
    const checkedItems = items.filter((i) => i.checked);
    if (checkedItems.length === 0) return [];
    await Promise.all(checkedItems.map((i) => shoppingListApi.remove(i.id)));
    setItems((prev) => prev.filter((i) => !i.checked));
    return checkedItems;
  }, [items]);

  const setAllChecked = useCallback(
    async (checked: boolean) => {
      const targetIds = new Set(
        items.filter((i) => i.checked !== checked).map((i) => i.id)
      );
      if (targetIds.size === 0) return;
      setItems((prev) => prev.map((i) => (targetIds.has(i.id) ? { ...i, checked } : i)));
      try {
        await Promise.all(
          Array.from(targetIds).map((id) => shoppingListApi.setChecked(id, checked))
        );
      } catch (err) {
        setItems((prev) => prev.map((i) => (targetIds.has(i.id) ? { ...i, checked: !checked } : i)));
        throw err;
      }
    },
    [items]
  );

  return {
    items,
    loading,
    error,
    refresh,
    addItem,
    toggleChecked,
    removeItem,
    clearChecked,
    setAllChecked,
  };
}

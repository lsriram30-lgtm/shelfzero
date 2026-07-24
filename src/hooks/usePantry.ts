import { useCallback, useEffect, useRef, useState } from "react";
import { pantryApi, shoppingListApi } from "../api";
import { NewPantryItem, PantryItem, UpdatePantryItem } from "../types";

export function usePantry() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsRef = useRef<PantryItem[]>([]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pantryApi.list();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load pantry items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = useCallback(async (item: NewPantryItem) => {
    const created = await pantryApi.create(item);
    setItems((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateItem = useCallback(async (id: string, item: UpdatePantryItem) => {
    const previous = itemsRef.current.find((existing) => existing.id === id);
    const updated = await pantryApi.update(id, item);
    setItems((prev) => prev.map((existing) => (existing.id === id ? updated : existing)));

    const ranOut = updated.quantity <= 0 && (!previous || previous.quantity > 0);
    if (ranOut) {
      try {
        await shoppingListApi.create({ name: updated.name, qty: 1 });
      } catch {
        // Best-effort: don't block the pantry update if the shopping list add fails.
      }
    }

    return updated;
  }, []);

  const removeItem = useCallback(async (id: string) => {
    await pantryApi.remove(id);
    setItems((prev) => prev.filter((existing) => existing.id !== id));
  }, []);

  return { items, loading, error, refresh, addItem, updateItem, removeItem };
}

import { useCallback, useEffect, useState } from "react";
import { pantryApi } from "../api";
import { NewPantryItem, PantryItem, UpdatePantryItem } from "../types";

export function usePantry() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    const updated = await pantryApi.update(id, item);
    setItems((prev) => prev.map((existing) => (existing.id === id ? updated : existing)));
    return updated;
  }, []);

  const removeItem = useCallback(async (id: string) => {
    await pantryApi.remove(id);
    setItems((prev) => prev.filter((existing) => existing.id !== id));
  }, []);

  return { items, loading, error, refresh, addItem, updateItem, removeItem };
}

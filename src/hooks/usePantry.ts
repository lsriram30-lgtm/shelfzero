import { useCallback, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { pantryApi, shoppingListApi } from "../api";
import { NewPantryItem, PantryItem, UpdatePantryItem } from "../types";

const CACHE_KEY = "shelfzero.pantryCache";

export function usePantry() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
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
      setIsOffline(false);
      AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data)).catch(() => {});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load pantry items");
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
          setItems(JSON.parse(cached) as PantryItem[]);
          setIsOffline(true);
        }
      } catch {
        // No usable cache — fall through and let the caller show the error state.
      }
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

  return { items, loading, error, isOffline, refresh, addItem, updateItem, removeItem };
}

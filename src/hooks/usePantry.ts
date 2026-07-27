import { useCallback, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { pantryApi, shoppingListApi } from "../api";
import { NewPantryItem, PantryItem, UpdatePantryItem } from "../types";
import { withAutoAddOptOut } from "../screens/pantry/pantryLogic";

const CACHE_KEY = "shelfzero.pantryCache";
const AUTO_ADD_OPT_OUT_KEY = "shelfzero.autoAddOptOutIds";

async function loadAutoAddOptOutIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(AUTO_ADD_OPT_OUT_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

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
      const optOutIds = await loadAutoAddOptOutIds();
      if (!optOutIds.includes(id)) {
        try {
          await shoppingListApi.create({ name: updated.name, qty: 1 });
        } catch {
          // Best-effort: don't block the pantry update if the shopping list add fails.
        }
      }
    }

    return updated;
  }, []);

  const removeItem = useCallback(async (id: string) => {
    await pantryApi.remove(id);
    setItems((prev) => prev.filter((existing) => existing.id !== id));
  }, []);

  const isAutoAddOptedOut = useCallback(async (id: string) => {
    const ids = await loadAutoAddOptOutIds();
    return ids.includes(id);
  }, []);

  const setAutoAddOptOut = useCallback(async (id: string, optedOut: boolean) => {
    const ids = await loadAutoAddOptOutIds();
    const next = withAutoAddOptOut(ids, id, optedOut);
    await AsyncStorage.setItem(AUTO_ADD_OPT_OUT_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  return {
    items,
    loading,
    error,
    isOffline,
    refresh,
    addItem,
    updateItem,
    removeItem,
    isAutoAddOptedOut,
    setAutoAddOptOut,
  };
}

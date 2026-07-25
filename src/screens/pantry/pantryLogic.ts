import { PantryItem } from "../../types";

const DAY_MS = 24 * 60 * 60 * 1000;

export function groupByCategory(items: PantryItem[]): Record<string, PantryItem[]> {
  return items.reduce<Record<string, PantryItem[]>>((groups, item) => {
    const key = item.category || "Uncategorized";
    groups[key] = groups[key] ? [...groups[key], item] : [item];
    return groups;
  }, {});
}

export function sortByExpiry(items: PantryItem[]): PantryItem[] {
  return [...items].sort((a, b) => {
    if (!a.expiresAt && !b.expiresAt) return 0;
    if (!a.expiresAt) return 1;
    if (!b.expiresAt) return -1;
    return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
  });
}

export function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / DAY_MS);
}

export function filterByName(items: PantryItem[], query: string): PantryItem[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return items;
  return items.filter((item) => item.name.toLowerCase().includes(trimmed));
}

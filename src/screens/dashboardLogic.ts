import { PantryItem } from "../types";

const DAY_MS = 24 * 60 * 60 * 1000;

export function computeHealth(items: PantryItem[]): number {
  if (items.length === 0) return 100;
  const now = Date.now();
  const healthy = items.filter((item) => {
    if (!item.expiresAt) return true;
    const expires = new Date(item.expiresAt).getTime();
    return expires - now > 3 * DAY_MS;
  });
  return Math.round((healthy.length / items.length) * 100);
}

export function soonToExpire(items: PantryItem[]): PantryItem[] {
  const now = Date.now();
  return items
    .filter((item) => item.expiresAt && new Date(item.expiresAt).getTime() - now <= 3 * DAY_MS)
    .sort((a, b) => new Date(a.expiresAt!).getTime() - new Date(b.expiresAt!).getTime());
}

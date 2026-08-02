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

export function withAutoAddOptOut(ids: string[], itemId: string, optedOut: boolean): string[] {
  const next = new Set(ids);
  if (optedOut) next.add(itemId);
  else next.delete(itemId);
  return Array.from(next);
}

const CATEGORY_KEYWORDS: { category: string; keywords: string[] }[] = [
  // Checked before Dairy so "ice cream" doesn't match on "cream".
  { category: "Frozen", keywords: ["frozen", "ice cream", "popsicle"] },
  {
    category: "Produce",
    keywords: [
      "apple", "banana", "orange", "lettuce", "spinach", "kale", "tomato",
      "potato", "onion", "carrot", "pepper", "cucumber", "broccoli",
      "avocado", "lemon", "lime", "grape", "berry", "watermelon",
      "cantaloupe", "garlic", "mushroom", "celery", "corn",
    ],
  },
  { category: "Meat", keywords: ["chicken", "beef", "pork", "turkey", "bacon", "sausage", "fish", "salmon", "shrimp", "steak"] },
  { category: "Bakery", keywords: ["bread", "bagel", "muffin", "croissant", "tortilla", "baguette", "cake"] },
  { category: "Beverages", keywords: ["juice", "soda", "coffee", "tea", "wine", "beer", "water"] },
  { category: "Dairy", keywords: ["milk", "cheese", "yogurt", "butter", "cream", "egg"] },
  {
    category: "Pantry",
    keywords: [
      "rice", "pasta", "flour", "sugar", "salt", "oil", "beans", "cereal",
      "sauce", "soup", "spice", "honey", "cracker", "peanut butter",
    ],
  },
];

export function suggestCategory(name: string): string | null {
  const trimmed = name.trim().toLowerCase();
  if (!trimmed) return null;
  const words = trimmed.split(/\s+/);

  // Multi-word keywords (e.g. "peanut butter", "ice cream") take priority
  // over single-word matches, since they'd otherwise lose to a category
  // whose single-word keyword happens to be one of their words (e.g. "butter").
  for (const { category, keywords } of CATEGORY_KEYWORDS) {
    if (keywords.some((keyword) => keyword.includes(" ") && trimmed.includes(keyword))) {
      return category;
    }
  }
  for (const { category, keywords } of CATEGORY_KEYWORDS) {
    if (keywords.some((keyword) => !keyword.includes(" ") && words.includes(keyword))) {
      return category;
    }
  }
  return null;
}

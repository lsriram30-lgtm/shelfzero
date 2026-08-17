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

export function formatExpiryLabel(days: number): string {
  if (days < 0) return "Expired";
  if (days === 0) return "Expires today";
  return `${days}d left`;
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

const DIET_EXCLUDED_TAGS: Record<string, string[]> = {
  Vegetarian: ["meat"],
  Vegan: ["meat", "dairy", "egg"],
  Pescatarian: ["meat"],
};

function excludedTagsForPrefs(dietaryPrefs: string[]): Set<string> {
  const excluded = new Set<string>();
  for (const pref of dietaryPrefs) {
    for (const tag of DIET_EXCLUDED_TAGS[pref] ?? []) {
      excluded.add(tag);
    }
  }
  return excluded;
}

export function filterByDietaryPrefs<T extends { dietTags?: string[] }>(
  items: T[],
  dietaryPrefs: string[]
): T[] {
  const excluded = excludedTagsForPrefs(dietaryPrefs);
  if (excluded.size === 0) return items;
  return items.filter((item) => !(item.dietTags ?? []).some((tag) => excluded.has(tag)));
}

export function filterCategoriesByDietaryPrefs(
  categories: string[],
  dietaryPrefs: string[]
): string[] {
  const excluded = excludedTagsForPrefs(dietaryPrefs);
  if (!excluded.has("meat")) return categories;
  return categories.filter((category) => category !== "Meat");
}

// Standard allergy options that map to a broader ingredient category, e.g.
// a milk allergy should also hide butter, not just an item literally named
// "Milk". Anything else (a standard option we don't have a tag for yet, or
// a free-text custom allergy like "Bananas") falls back to matching the
// staple's name directly.
const ALLERGY_EXCLUDED_TAGS: Record<string, string[]> = {
  Milk: ["dairy"],
  Eggs: ["egg"],
  Wheat: ["wheat"],
};

export function filterByAllergies<T extends { name: string; dietTags?: string[] }>(
  items: T[],
  allergies: string[]
): T[] {
  if (allergies.length === 0) return items;
  const excludedTags = new Set<string>();
  const excludedNames = new Set<string>();
  for (const allergy of allergies) {
    for (const tag of ALLERGY_EXCLUDED_TAGS[allergy] ?? []) {
      excludedTags.add(tag);
    }
    excludedNames.add(allergy.trim().toLowerCase());
  }
  return items.filter((item) => {
    if ((item.dietTags ?? []).some((tag) => excludedTags.has(tag))) return false;
    return !excludedNames.has(item.name.trim().toLowerCase());
  });
}

// CATEGORY_KEYWORDS is singular-only ("egg", not "eggs") - this reverses
// common English plural endings on the input so "Eggs"/"Tomatoes"/
// "Berries" still match, without having to duplicate every keyword in
// its plural form. Deliberately simple (not a real stemmer): covers the
// common cases in a grocery list, not every irregular plural.
function singularize(word: string): string {
  if (word.endsWith("ies") && word.length > 3) return word.slice(0, -3) + "y"; // berries -> berry
  if (word.endsWith("oes")) return word.slice(0, -2); // tomatoes -> tomato
  if (/(ch|sh|x|s)es$/.test(word)) return word.slice(0, -2); // dishes -> dish
  if (word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1); // eggs -> egg
  return word;
}

export function suggestCategory(name: string): string | null {
  const trimmed = name.trim().toLowerCase();
  if (!trimmed) return null;
  const words = trimmed.split(/\s+/).map(singularize);

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

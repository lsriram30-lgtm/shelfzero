import { suggestCategory } from "../pantry/pantryLogic";

// Groups shopping list items the same way Pantry groups its own items -
// reusing the exact same keyword-based category guesser, since the
// shopping list has no category field of its own. Sorted alphabetically,
// matching how PantryScreen orders its own category groups
// (Object.keys(grouped).sort()).
export function groupShoppingListByCategory<T extends { name: string }>(
  items: T[]
): { category: string; items: T[] }[] {
  const groups: Record<string, T[]> = {};
  for (const item of items) {
    const category = suggestCategory(item.name) ?? "Uncategorized";
    groups[category] = groups[category] ? [...groups[category], item] : [item];
  }
  return Object.keys(groups)
    .sort()
    .map((category) => ({ category, items: groups[category] }));
}

// Finds an existing unchecked item with the same name (case/whitespace
// insensitive) so adding it again can bump its quantity instead of
// creating a second row. Deliberately excludes checked items — one
// already picked up represents a finished need, not a duplicate of a new
// one, so adding "Milk" again after checking off "Milk" should start a
// fresh entry, not silently bump the already-checked one.
export function findMatchingUnchecked<T extends { name: string; checked: boolean }>(
  items: T[],
  name: string
): T | undefined {
  const normalized = name.trim().toLowerCase();
  return items.find((item) => !item.checked && item.name.trim().toLowerCase() === normalized);
}

export function toggleSelection(selected: Set<string>, id: string): Set<string> {
  const next = new Set(selected);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

export function toggleSelectAll(allIds: string[], selected: Set<string>): Set<string> {
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.has(id));
  return allSelected ? new Set() : new Set(allIds);
}

export function formatShoppingListForShare(
  items: { name: string; qty: number; checked: boolean }[]
): string {
  if (items.length === 0) return "Shopping list is empty.";
  const lines = items.map((item) => {
    const prefix = item.checked ? "[x]" : "[ ]";
    const qty = item.qty > 1 ? ` (${item.qty})` : "";
    return `${prefix} ${item.name}${qty}`;
  });
  return ["Shopping List:", ...lines].join("\n");
}

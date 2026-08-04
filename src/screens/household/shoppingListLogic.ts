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
  items: { name: string; quantity: number; checked: boolean }[]
): string {
  if (items.length === 0) return "Shopping list is empty.";
  const lines = items.map((item) => {
    const prefix = item.checked ? "[x]" : "[ ]";
    const qty = item.quantity > 1 ? ` (${item.quantity})` : "";
    return `${prefix} ${item.name}${qty}`;
  });
  return ["Shopping List:", ...lines].join("\n");
}

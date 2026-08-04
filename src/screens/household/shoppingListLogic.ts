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

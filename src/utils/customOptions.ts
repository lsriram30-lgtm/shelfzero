// Case/whitespace-insensitive membership check for a typed custom value
// against the full current selection (base pills + already-added custom
// values combined) — not just the custom subset, which would miss a
// collision with a value already selected via a base pill.
export function isDuplicateOption(value: string, existing: string[]): boolean {
  const normalized = value.trim().toLowerCase();
  return existing.some((item) => item.trim().toLowerCase() === normalized);
}

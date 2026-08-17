import { NewPantryItem, ScannedItem } from "../../types";

// The backend doesn't return a unit at all (unlike the rest of the app's
// pantry model, which always has one) - defaulting to "count" rather than
// leaving it blank, since every add/edit form already lets this be
// corrected via the "Other" free-text fallback.
const DEFAULT_UNIT = "count";

export function scannedItemToPantryItem(item: ScannedItem): NewPantryItem {
  const quantity = Number(item.quantity);
  return {
    name: item.name,
    category: item.category,
    quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
    unit: DEFAULT_UNIT,
    expiresAt: item.expiresAt || undefined,
  };
}

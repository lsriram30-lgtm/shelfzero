import { BarcodeProduct, NewPantryItem } from "../../types";

// A barcode lookup only ever returns a name/category, never a quantity or
// unit - defaults match how a manually-added item starts out.
export function barcodeProductToPantryItem(product: BarcodeProduct): NewPantryItem {
  return {
    name: product.name,
    category: product.category,
    quantity: 1,
    unit: "count",
  };
}

// Maps the barcode endpoint's documented error codes to plain-English
// messages, distinct enough that a user knows whether retrying, adding
// manually, or just trying a different item is the right next step.
export function barcodeLookupErrorMessage(code: string | undefined, fallback: string): string {
  switch (code) {
    case "INVALID_BARCODE":
      return "That doesn't look like a valid barcode. Try again or add the item manually.";
    case "BARCODE_NOT_FOUND":
      return "We couldn't find that product. Try adding it manually instead.";
    case "BARCODE_LOOKUP_UNAVAILABLE":
      return "Barcode lookup is temporarily unavailable. Try again in a moment, or add the item manually.";
    default:
      return fallback;
  }
}

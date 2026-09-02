import { barcodeLookupErrorMessage, barcodeProductToPantryItem } from "./scanLogic";

describe("barcodeProductToPantryItem", () => {
  it("maps name and category, defaulting quantity to 1 and unit to count", () => {
    expect(
      barcodeProductToPantryItem({
        barcode: "049000028911",
        name: "Diet Coke Soft Drink",
        category: "Beverages",
        brand: "Coke",
        source: "Open Food Facts",
      })
    ).toEqual({
      name: "Diet Coke Soft Drink",
      category: "Beverages",
      quantity: 1,
      unit: "count",
    });
  });
});

describe("barcodeLookupErrorMessage", () => {
  it("returns a specific message for INVALID_BARCODE", () => {
    expect(barcodeLookupErrorMessage("INVALID_BARCODE", "fallback")).toBe(
      "That doesn't look like a valid barcode. Try again or add the item manually."
    );
  });

  it("returns a specific message for BARCODE_NOT_FOUND", () => {
    expect(barcodeLookupErrorMessage("BARCODE_NOT_FOUND", "fallback")).toBe(
      "We couldn't find that product. Try adding it manually instead."
    );
  });

  it("returns a specific message for BARCODE_LOOKUP_UNAVAILABLE", () => {
    expect(barcodeLookupErrorMessage("BARCODE_LOOKUP_UNAVAILABLE", "fallback")).toBe(
      "Barcode lookup is temporarily unavailable. Try again in a moment, or add the item manually."
    );
  });

  it("falls back for an unrecognized or missing code", () => {
    expect(barcodeLookupErrorMessage("SOMETHING_ELSE", "fallback")).toBe("fallback");
    expect(barcodeLookupErrorMessage(undefined, "fallback")).toBe("fallback");
  });
});

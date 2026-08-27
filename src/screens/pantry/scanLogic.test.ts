import { scannedItemToPantryItem } from "./scanLogic";
import { ScannedItem } from "../../types";

function scannedItem(overrides: Partial<ScannedItem>): ScannedItem {
  return {
    id: "1",
    rawText: "MILK 2% GAL",
    name: "Milk",
    quantity: "1",
    category: "Dairy",
    expiresAt: "",
    confidence: 0.9,
    selected: true,
    ...overrides,
  };
}

describe("scannedItemToPantryItem", () => {
  it("carries name and category through as-is", () => {
    const result = scannedItemToPantryItem(scannedItem({ name: "Eggs", category: "Dairy" }));
    expect(result.name).toBe("Eggs");
    expect(result.category).toBe("Dairy");
  });

  it("parses a numeric quantity string into a number", () => {
    expect(scannedItemToPantryItem(scannedItem({ quantity: "3" })).quantity).toBe(3);
  });

  it("falls back to 1 for a non-numeric quantity", () => {
    expect(scannedItemToPantryItem(scannedItem({ quantity: "a couple" })).quantity).toBe(1);
  });

  it("falls back to 1 for a zero or negative quantity", () => {
    expect(scannedItemToPantryItem(scannedItem({ quantity: "0" })).quantity).toBe(1);
    expect(scannedItemToPantryItem(scannedItem({ quantity: "-2" })).quantity).toBe(1);
  });

  it("defaults unit to count, since the backend doesn't return one", () => {
    expect(scannedItemToPantryItem(scannedItem({})).unit).toBe("count");
  });

  it("carries a real expiresAt through, but converts an empty string to undefined", () => {
    expect(scannedItemToPantryItem(scannedItem({ expiresAt: "2026-09-01" })).expiresAt).toBe(
      "2026-09-01"
    );
    expect(scannedItemToPantryItem(scannedItem({ expiresAt: "" })).expiresAt).toBeUndefined();
  });
});

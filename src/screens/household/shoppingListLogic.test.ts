import { formatShoppingListForShare, toggleSelectAll, toggleSelection } from "./shoppingListLogic";

describe("toggleSelection", () => {
  it("adds an id that isn't selected", () => {
    expect(toggleSelection(new Set(), "a")).toEqual(new Set(["a"]));
  });

  it("removes an id that's already selected", () => {
    expect(toggleSelection(new Set(["a", "b"]), "a")).toEqual(new Set(["b"]));
  });

  it("does not mutate the original set", () => {
    const original = new Set(["a"]);
    toggleSelection(original, "b");
    expect(original).toEqual(new Set(["a"]));
  });
});

describe("toggleSelectAll", () => {
  it("selects every id when none are selected", () => {
    expect(toggleSelectAll(["a", "b", "c"], new Set())).toEqual(new Set(["a", "b", "c"]));
  });

  it("selects every id when only some are selected", () => {
    expect(toggleSelectAll(["a", "b", "c"], new Set(["a"]))).toEqual(new Set(["a", "b", "c"]));
  });

  it("deselects all when every id is already selected", () => {
    expect(toggleSelectAll(["a", "b"], new Set(["a", "b"]))).toEqual(new Set());
  });

  it("returns an empty set when there are no ids", () => {
    expect(toggleSelectAll([], new Set())).toEqual(new Set());
  });
});

describe("formatShoppingListForShare", () => {
  it("says the list is empty when there are no items", () => {
    expect(formatShoppingListForShare([])).toBe("Shopping list is empty.");
  });

  it("formats an unchecked item without a quantity suffix when qty is 1", () => {
    expect(formatShoppingListForShare([{ name: "Milk", qty: 1, checked: false }])).toBe(
      "Shopping List:\n[ ] Milk"
    );
  });

  it("adds a quantity suffix when qty is greater than 1", () => {
    expect(formatShoppingListForShare([{ name: "Eggs", qty: 12, checked: false }])).toBe(
      "Shopping List:\n[ ] Eggs (12)"
    );
  });

  it("marks checked items differently from unchecked ones", () => {
    expect(formatShoppingListForShare([{ name: "Bread", qty: 1, checked: true }])).toBe(
      "Shopping List:\n[x] Bread"
    );
  });

  it("joins multiple items on separate lines in order", () => {
    const result = formatShoppingListForShare([
      { name: "Milk", qty: 1, checked: false },
      { name: "Eggs", qty: 12, checked: true },
    ]);
    expect(result).toBe("Shopping List:\n[ ] Milk\n[x] Eggs (12)");
  });
});

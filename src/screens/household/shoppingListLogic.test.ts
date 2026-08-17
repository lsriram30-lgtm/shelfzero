import {
  findMatchingUnchecked,
  formatShoppingListForShare,
  groupShoppingListByCategory,
  toggleSelectAll,
  toggleSelection,
} from "./shoppingListLogic";

describe("findMatchingUnchecked", () => {
  it("finds an unchecked item with an exact name match", () => {
    const items = [{ name: "Milk", checked: false }];
    expect(findMatchingUnchecked(items, "Milk")).toBe(items[0]);
  });

  it("matches case-insensitively", () => {
    const items = [{ name: "Milk", checked: false }];
    expect(findMatchingUnchecked(items, "milk")).toBe(items[0]);
  });

  it("ignores leading/trailing whitespace on both sides", () => {
    const items = [{ name: "  Milk ", checked: false }];
    expect(findMatchingUnchecked(items, "Milk")).toBe(items[0]);
  });

  it("does not match a checked item — a picked-up item is a finished need, not a duplicate", () => {
    const items = [{ name: "Milk", checked: true }];
    expect(findMatchingUnchecked(items, "Milk")).toBeUndefined();
  });

  it("returns undefined when there's no match at all", () => {
    const items = [{ name: "Eggs", checked: false }];
    expect(findMatchingUnchecked(items, "Milk")).toBeUndefined();
  });

  it("prefers an unchecked match even if a checked duplicate also exists", () => {
    const uncheckedMilk = { name: "Milk", checked: false };
    const items = [{ name: "Milk", checked: true }, uncheckedMilk];
    expect(findMatchingUnchecked(items, "Milk")).toBe(uncheckedMilk);
  });
});

describe("groupShoppingListByCategory", () => {
  it("groups items into the same categories Pantry would suggest for them", () => {
    const items = [{ name: "Milk" }, { name: "Chicken Breast" }, { name: "Cheese" }];
    expect(groupShoppingListByCategory(items)).toEqual([
      { category: "Dairy", items: [{ name: "Milk" }, { name: "Cheese" }] },
      { category: "Meat", items: [{ name: "Chicken Breast" }] },
    ]);
  });

  it("sorts categories alphabetically", () => {
    const items = [{ name: "Bread" }, { name: "Apple" }];
    const result = groupShoppingListByCategory(items);
    expect(result.map((g) => g.category)).toEqual(["Bakery", "Produce"]);
  });

  it("falls back to Uncategorized for a name with no keyword match", () => {
    expect(groupShoppingListByCategory([{ name: "Xyzzy" }])).toEqual([
      { category: "Uncategorized", items: [{ name: "Xyzzy" }] },
    ]);
  });

  it("returns an empty array for an empty list", () => {
    expect(groupShoppingListByCategory([])).toEqual([]);
  });

  it("preserves each item's relative order within its category", () => {
    const first = { name: "Milk" };
    const second = { name: "Cheese" };
    const result = groupShoppingListByCategory([first, second]);
    expect(result[0].items).toEqual([first, second]);
  });
});

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

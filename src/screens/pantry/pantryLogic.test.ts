import {
  daysUntil,
  filterByAllergies,
  filterByDietaryPrefs,
  filterByName,
  filterCategoriesByDietaryPrefs,
  formatExpiryLabel,
  groupByCategory,
  sortByExpiry,
  suggestCategory,
  withAutoAddOptOut,
} from "./pantryLogic";
import { PantryItem } from "../../types";

function item(overrides: Partial<PantryItem>): PantryItem {
  return {
    id: "1",
    name: "Milk",
    category: "Dairy",
    quantity: 1,
    unit: "carton",
    expiresAt: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("groupByCategory", () => {
  it("groups items under their category", () => {
    const items = [
      item({ id: "1", category: "Dairy" }),
      item({ id: "2", category: "Produce" }),
      item({ id: "3", category: "Dairy" }),
    ];
    const grouped = groupByCategory(items);
    expect(Object.keys(grouped).sort()).toEqual(["Dairy", "Produce"]);
    expect(grouped.Dairy.map((i) => i.id)).toEqual(["1", "3"]);
    expect(grouped.Produce.map((i) => i.id)).toEqual(["2"]);
  });

  it("falls back to Uncategorized when category is empty", () => {
    const grouped = groupByCategory([item({ category: "" })]);
    expect(Object.keys(grouped)).toEqual(["Uncategorized"]);
  });

  it("returns an empty object for an empty list", () => {
    expect(groupByCategory([])).toEqual({});
  });
});

describe("sortByExpiry", () => {
  it("sorts soonest-expiring items first", () => {
    const items = [
      item({ id: "later", expiresAt: "2026-03-01T00:00:00.000Z" }),
      item({ id: "soonest", expiresAt: "2026-01-15T00:00:00.000Z" }),
      item({ id: "middle", expiresAt: "2026-02-01T00:00:00.000Z" }),
    ];
    expect(sortByExpiry(items).map((i) => i.id)).toEqual(["soonest", "middle", "later"]);
  });

  it("pushes items with no expiry date to the end", () => {
    const items = [
      item({ id: "no-date", expiresAt: null }),
      item({ id: "has-date", expiresAt: "2026-01-15T00:00:00.000Z" }),
    ];
    expect(sortByExpiry(items).map((i) => i.id)).toEqual(["has-date", "no-date"]);
  });

  it("does not mutate the original array", () => {
    const items = [
      item({ id: "a", expiresAt: "2026-03-01T00:00:00.000Z" }),
      item({ id: "b", expiresAt: "2026-01-01T00:00:00.000Z" }),
    ];
    const original = [...items];
    sortByExpiry(items);
    expect(items).toEqual(original);
  });
});

describe("daysUntil", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2026-01-10T00:00:00.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns null when there's no date", () => {
    expect(daysUntil(null)).toBeNull();
  });

  it("returns a positive count for a future date", () => {
    expect(daysUntil("2026-01-13T00:00:00.000Z")).toBe(3);
  });

  it("returns a negative count for a past date", () => {
    expect(daysUntil("2026-01-05T00:00:00.000Z")).toBe(-5);
  });

  it("returns 0 for today", () => {
    expect(daysUntil("2026-01-10T00:00:00.000Z")).toBe(0);
  });
});

describe("formatExpiryLabel", () => {
  it("says Expired for a negative count", () => {
    expect(formatExpiryLabel(-1)).toBe("Expired");
    expect(formatExpiryLabel(-5)).toBe("Expired");
  });

  it("says Expires today for exactly 0", () => {
    expect(formatExpiryLabel(0)).toBe("Expires today");
  });

  it("says Nd left for a positive count", () => {
    expect(formatExpiryLabel(1)).toBe("1d left");
    expect(formatExpiryLabel(5)).toBe("5d left");
  });
});

describe("filterByName", () => {
  const items = [
    item({ id: "1", name: "Whole milk" }),
    item({ id: "2", name: "Almond milk" }),
    item({ id: "3", name: "Cheddar cheese" }),
  ];

  it("returns all items when the query is blank", () => {
    expect(filterByName(items, "")).toEqual(items);
    expect(filterByName(items, "   ")).toEqual(items);
  });

  it("matches a substring anywhere in the name", () => {
    expect(filterByName(items, "milk").map((i) => i.id)).toEqual(["1", "2"]);
  });

  it("is case-insensitive", () => {
    expect(filterByName(items, "MILK").map((i) => i.id)).toEqual(["1", "2"]);
  });

  it("ignores leading/trailing whitespace in the query", () => {
    expect(filterByName(items, "  cheese  ").map((i) => i.id)).toEqual(["3"]);
  });

  it("returns an empty array when nothing matches", () => {
    expect(filterByName(items, "banana")).toEqual([]);
  });
});

describe("withAutoAddOptOut", () => {
  it("adds an id when opting out", () => {
    expect(withAutoAddOptOut([], "a", true)).toEqual(["a"]);
  });

  it("removes an id when opting back in", () => {
    expect(withAutoAddOptOut(["a", "b"], "a", false)).toEqual(["b"]);
  });

  it("does not duplicate an id already opted out", () => {
    expect(withAutoAddOptOut(["a"], "a", true)).toEqual(["a"]);
  });

  it("is a no-op removing an id that isn't present", () => {
    expect(withAutoAddOptOut(["a"], "b", false)).toEqual(["a"]);
  });
});

describe("suggestCategory", () => {
  it("matches an exact keyword", () => {
    expect(suggestCategory("milk")).toBe("Dairy");
  });

  it("matches a keyword with a modifier word around it", () => {
    expect(suggestCategory("Whole Milk")).toBe("Dairy");
    expect(suggestCategory("Almond Milk")).toBe("Dairy");
  });

  it("is case-insensitive", () => {
    expect(suggestCategory("CHEDDAR CHEESE")).toBe("Dairy");
  });

  it("returns null for a blank or unrecognized name", () => {
    expect(suggestCategory("")).toBeNull();
    expect(suggestCategory("   ")).toBeNull();
    expect(suggestCategory("xyzzy")).toBeNull();
  });

  it("matches a multi-word keyword", () => {
    expect(suggestCategory("Peanut Butter")).toBe("Pantry");
  });

  it("prefers Frozen over Dairy for ice cream", () => {
    expect(suggestCategory("Vanilla Ice Cream")).toBe("Frozen");
  });

  it("does not mistake watermelon for a beverage via the word 'water'", () => {
    expect(suggestCategory("Watermelon")).toBe("Produce");
  });
});

describe("filterByDietaryPrefs", () => {
  const staples = [
    { name: "Milk", dietTags: ["dairy"] },
    { name: "Eggs", dietTags: ["egg"] },
    { name: "Bread" },
    { name: "Chicken Breast", dietTags: ["meat"] },
  ];

  it("returns everything unfiltered when there are no dietary prefs", () => {
    expect(filterByDietaryPrefs(staples, [])).toEqual(staples);
  });

  it("excludes meat for vegetarians but keeps dairy and eggs", () => {
    const result = filterByDietaryPrefs(staples, ["Vegetarian"]).map((s) => s.name);
    expect(result).toEqual(["Milk", "Eggs", "Bread"]);
  });

  it("excludes meat, dairy, and eggs for vegans", () => {
    const result = filterByDietaryPrefs(staples, ["Vegan"]).map((s) => s.name);
    expect(result).toEqual(["Bread"]);
  });

  it("excludes meat for pescatarians", () => {
    const result = filterByDietaryPrefs(staples, ["Pescatarian"]).map((s) => s.name);
    expect(result).toEqual(["Milk", "Eggs", "Bread"]);
  });

  it("ignores unrecognized preferences like 'No restrictions'", () => {
    expect(filterByDietaryPrefs(staples, ["No restrictions"])).toEqual(staples);
  });

  it("keeps items with no dietTags regardless of preference", () => {
    const result = filterByDietaryPrefs(staples, ["Vegan"]);
    expect(result.some((s) => s.name === "Bread")).toBe(true);
  });
});

describe("filterCategoriesByDietaryPrefs", () => {
  const categories = ["Produce", "Dairy", "Meat", "Pantry"];

  it("returns everything unfiltered when there are no dietary prefs", () => {
    expect(filterCategoriesByDietaryPrefs(categories, [])).toEqual(categories);
  });

  it("hides Meat for vegetarians", () => {
    expect(filterCategoriesByDietaryPrefs(categories, ["Vegetarian"])).toEqual([
      "Produce",
      "Dairy",
      "Pantry",
    ]);
  });

  it("hides Meat for vegans", () => {
    expect(filterCategoriesByDietaryPrefs(categories, ["Vegan"])).toEqual([
      "Produce",
      "Dairy",
      "Pantry",
    ]);
  });

  it("hides Meat for pescatarians", () => {
    expect(filterCategoriesByDietaryPrefs(categories, ["Pescatarian"])).toEqual([
      "Produce",
      "Dairy",
      "Pantry",
    ]);
  });

  it("keeps Meat for preferences that don't exclude it", () => {
    expect(filterCategoriesByDietaryPrefs(categories, ["Keto"])).toEqual(categories);
  });
});

describe("filterByAllergies", () => {
  const staples = [
    { name: "Milk", dietTags: ["dairy"] },
    { name: "Eggs", dietTags: ["egg"] },
    { name: "Bread", dietTags: ["wheat"] },
    { name: "Rice" },
    { name: "Bananas" },
  ];

  it("returns everything unfiltered when there are no allergies", () => {
    expect(filterByAllergies(staples, [])).toEqual(staples);
  });

  it("hides dairy items (not just the one literally named Milk) for a Milk allergy", () => {
    const result = filterByAllergies(
      [...staples, { name: "Butter", dietTags: ["dairy"] }],
      ["Milk"]
    ).map((s) => s.name);
    expect(result).toEqual(["Eggs", "Bread", "Rice", "Bananas"]);
  });

  it("hides wheat items for a Wheat allergy", () => {
    const result = filterByAllergies(staples, ["Wheat"]).map((s) => s.name);
    expect(result).toEqual(["Milk", "Eggs", "Rice", "Bananas"]);
  });

  it("matches a free-text custom allergy by item name", () => {
    const result = filterByAllergies(staples, ["Bananas"]).map((s) => s.name);
    expect(result).toEqual(["Milk", "Eggs", "Bread", "Rice"]);
  });

  it("matches a free-text custom allergy case-insensitively", () => {
    const result = filterByAllergies(staples, ["rice"]).map((s) => s.name);
    expect(result).toEqual(["Milk", "Eggs", "Bread", "Bananas"]);
  });

  it("combines multiple allergies", () => {
    const result = filterByAllergies(staples, ["Wheat", "Bananas"]).map((s) => s.name);
    expect(result).toEqual(["Milk", "Eggs", "Rice"]);
  });
});

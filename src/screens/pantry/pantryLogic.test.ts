import {
  daysUntil,
  filterByName,
  groupByCategory,
  sortByExpiry,
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

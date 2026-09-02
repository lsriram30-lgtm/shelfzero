import { computeLatestActivityByMember } from "./householdActivity";
import { DonationRecord, HouseholdMember, PantryItem, ShoppingListItem } from "../../types";

const members: HouseholdMember[] = [
  { id: "user-1", name: "Jamie", role: "owner" },
  { id: "user-2", name: "Sam", role: "member" },
];

function pantryItem(overrides: Partial<PantryItem>): PantryItem {
  return {
    id: "p1",
    name: "Eggs",
    category: "Dairy",
    quantity: 1,
    unit: "ct",
    expiresAt: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function shoppingItem(overrides: Partial<ShoppingListItem>): ShoppingListItem {
  return {
    id: "s1",
    name: "Milk",
    checked: false,
    qty: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function donation(overrides: Partial<DonationRecord>): DonationRecord {
  return {
    id: "d1",
    date: "2026-01-01T00:00:00.000Z",
    partnerId: "food-pantry",
    partnerName: "Community Food Pantry",
    itemNames: ["Canned Soup"],
    ...overrides,
  };
}

describe("computeLatestActivityByMember", () => {
  it("attributes a pantry addition to the member by their real account id", () => {
    const result = computeLatestActivityByMember(
      members,
      [pantryItem({ addedBy: "user-1", name: "Eggs", createdAt: "2026-01-02T00:00:00.000Z" })],
      [],
      []
    );
    expect(result["user-1"]).toEqual({
      memberId: "user-1",
      blurb: "+ Eggs",
      timestamp: "2026-01-02T00:00:00.000Z",
    });
  });

  it("attributes a shopping list addition by matching addedBy's name, not an id", () => {
    const result = computeLatestActivityByMember(
      members,
      [],
      [shoppingItem({ addedBy: "Sam", name: "Milk", createdAt: "2026-01-02T00:00:00.000Z" })],
      []
    );
    expect(result["user-2"]).toEqual({
      memberId: "user-2",
      blurb: "+ Milk",
      timestamp: "2026-01-02T00:00:00.000Z",
    });
  });

  it("matches a shopping list addedBy name case/whitespace-insensitively", () => {
    const result = computeLatestActivityByMember(
      members,
      [],
      [shoppingItem({ addedBy: "  sam  ", createdAt: "2026-01-02T00:00:00.000Z" })],
      []
    );
    expect(result["user-2"]).toBeDefined();
  });

  it("attributes a donation with a heart blurb", () => {
    const result = computeLatestActivityByMember(
      members,
      [],
      [],
      [donation({ donatedBy: "user-1", date: "2026-01-02T00:00:00.000Z" })]
    );
    expect(result["user-1"]).toEqual({
      memberId: "user-1",
      blurb: "❤️ Donated",
      timestamp: "2026-01-02T00:00:00.000Z",
    });
  });

  it("picks the most recent activity across all three sources for one member", () => {
    const result = computeLatestActivityByMember(
      members,
      [pantryItem({ addedBy: "user-1", name: "Eggs", createdAt: "2026-01-01T00:00:00.000Z" })],
      [],
      [donation({ donatedBy: "user-1", date: "2026-01-03T00:00:00.000Z" })]
    );
    expect(result["user-1"].blurb).toBe("❤️ Donated");
  });

  it("skips an item with no addedBy/donatedBy at all", () => {
    const result = computeLatestActivityByMember(
      members,
      [pantryItem({ addedBy: undefined })],
      [],
      []
    );
    expect(result).toEqual({});
  });

  it("skips a shopping addedBy name that doesn't match any real member", () => {
    const result = computeLatestActivityByMember(
      members,
      [],
      [shoppingItem({ addedBy: "Someone Else" })],
      []
    );
    expect(result).toEqual({});
  });

  it("returns an empty object when there's no activity at all", () => {
    expect(computeLatestActivityByMember(members, [], [], [])).toEqual({});
  });
});

import { buildExpiringSoonBriefing, computeHealth, soonToExpire } from "./dashboardLogic";
import { PantryItem } from "../types";

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

describe("computeHealth", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2026-01-10T00:00:00.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns 100 for an empty pantry", () => {
    expect(computeHealth([])).toBe(100);
  });

  it("treats items with no expiry date as healthy", () => {
    expect(computeHealth([item({ expiresAt: null }), item({ expiresAt: null })])).toBe(100);
  });

  it("counts items expiring within 3 days as unhealthy", () => {
    const items = [
      item({ id: "a", expiresAt: "2026-01-11T00:00:00.000Z" }), // 1 day out
      item({ id: "b", expiresAt: "2026-02-01T00:00:00.000Z" }), // far out
    ];
    expect(computeHealth(items)).toBe(50);
  });

  it("rounds to the nearest whole percent", () => {
    const items = [
      item({ id: "a", expiresAt: "2026-02-01T00:00:00.000Z" }),
      item({ id: "b", expiresAt: "2026-02-01T00:00:00.000Z" }),
      item({ id: "c", expiresAt: "2026-01-11T00:00:00.000Z" }),
    ];
    expect(computeHealth(items)).toBe(67);
  });
});

describe("soonToExpire", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2026-01-10T00:00:00.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("excludes items with no expiry date", () => {
    expect(soonToExpire([item({ expiresAt: null })])).toEqual([]);
  });

  it("excludes items expiring more than 3 days out", () => {
    expect(soonToExpire([item({ expiresAt: "2026-02-01T00:00:00.000Z" })])).toEqual([]);
  });

  it("includes and sorts items expiring within 3 days, soonest first", () => {
    const soon1 = item({ id: "later", expiresAt: "2026-01-13T00:00:00.000Z" });
    const soon2 = item({ id: "soonest", expiresAt: "2026-01-11T00:00:00.000Z" });
    const far = item({ id: "far", expiresAt: "2026-02-01T00:00:00.000Z" });
    expect(soonToExpire([soon1, far, soon2]).map((i) => i.id)).toEqual(["soonest", "later"]);
  });
});

describe("buildExpiringSoonBriefing", () => {
  it("uses singular wording for exactly one item", () => {
    expect(buildExpiringSoonBriefing(1)).toBe(
      "1 item expiring soon — use it up before it goes to waste."
    );
  });

  it("uses plural wording for more than one item", () => {
    expect(buildExpiringSoonBriefing(3)).toBe(
      "3 items expiring soon — use them up before they go to waste."
    );
  });

  it("shows the all-clear message when nothing is expiring", () => {
    expect(buildExpiringSoonBriefing(0)).toBe(
      "Your pantry is in great shape today. Nothing is close to expiring."
    );
  });
});

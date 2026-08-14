import { accountScopedKey } from "./accountScopedKey";

describe("accountScopedKey", () => {
  it("keys by email when signed in", () => {
    expect(accountScopedKey("shelfzero.pantryCache", "person@example.com")).toBe(
      "shelfzero.pantryCache.person@example.com"
    );
  });

  it("is case-insensitive, so the same account never gets two keys", () => {
    expect(accountScopedKey("shelfzero.pantryCache", "Person@Example.com")).toBe(
      accountScopedKey("shelfzero.pantryCache", "person@example.com")
    );
  });

  it("falls back to a shared anonymous key when no email is known yet", () => {
    expect(accountScopedKey("shelfzero.pantryCache", null)).toBe("shelfzero.pantryCache.anonymous");
  });

  it("gives different accounts different keys for the same prefix", () => {
    expect(accountScopedKey("shelfzero.pantryCache", "a@example.com")).not.toBe(
      accountScopedKey("shelfzero.pantryCache", "b@example.com")
    );
  });

  it("gives different prefixes different keys for the same account", () => {
    expect(accountScopedKey("shelfzero.pantryCache", "a@example.com")).not.toBe(
      accountScopedKey("shelfzero.mealPlan", "a@example.com")
    );
  });
});

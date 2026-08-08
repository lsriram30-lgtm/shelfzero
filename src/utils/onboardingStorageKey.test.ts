import { storageKeyFor } from "./onboardingStorageKey";

describe("storageKeyFor", () => {
  it("keys by email when signed in", () => {
    expect(storageKeyFor("person@example.com")).toBe("shelfzero.onboardingProfile.person@example.com");
  });

  it("is case-insensitive, so the same account never gets two keys", () => {
    expect(storageKeyFor("Person@Example.com")).toBe(storageKeyFor("person@example.com"));
  });

  it("falls back to a shared anonymous key when no email is known yet", () => {
    expect(storageKeyFor(null)).toBe("shelfzero.onboardingProfile.anonymous");
  });

  it("gives different accounts different keys — the actual bug this fixes", () => {
    expect(storageKeyFor("a@example.com")).not.toBe(storageKeyFor("b@example.com"));
  });
});

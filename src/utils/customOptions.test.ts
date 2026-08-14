import { isDuplicateOption } from "./customOptions";

describe("isDuplicateOption", () => {
  it("detects a duplicate against a base (non-custom) selected option", () => {
    // This is the real bug: typing "Italian" when it's already selected
    // via a base pill (not a custom one) must still be caught.
    expect(isDuplicateOption("Italian", ["Italian", "Thai"])).toBe(true);
  });

  it("matches case-insensitively", () => {
    expect(isDuplicateOption("italian", ["Italian"])).toBe(true);
  });

  it("ignores leading/trailing whitespace on both sides", () => {
    expect(isDuplicateOption("  Italian ", ["Italian"])).toBe(true);
  });

  it("returns false when the value isn't in the list at all", () => {
    expect(isDuplicateOption("Georgian", ["Italian", "Thai"])).toBe(false);
  });

  it("returns false for an empty existing list", () => {
    expect(isDuplicateOption("Italian", [])).toBe(false);
  });
});

import { isValidEmail } from "./validation";

describe("isValidEmail", () => {
  it("accepts a normal email", () => {
    expect(isValidEmail("person@example.com")).toBe(true);
  });

  it("trims surrounding whitespace before validating", () => {
    expect(isValidEmail("  person@example.com  ")).toBe(true);
  });

  it("rejects a string with no @", () => {
    expect(isValidEmail("personexample.com")).toBe(false);
  });

  it("rejects a string with no domain", () => {
    expect(isValidEmail("person@")).toBe(false);
  });

  it("rejects a string with spaces in the middle", () => {
    expect(isValidEmail("person @example.com")).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });
});

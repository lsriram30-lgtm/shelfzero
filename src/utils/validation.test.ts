import { isValidEmail, isValidPhone } from "./validation";

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

describe("isValidPhone", () => {
  it("accepts a standard US format", () => {
    expect(isValidPhone("(555) 123-4567")).toBe(true);
  });

  it("accepts a plain digit string with no punctuation", () => {
    expect(isValidPhone("5551234567")).toBe(true);
  });

  it("accepts an international format with a country code", () => {
    expect(isValidPhone("+44 20 7946 0958")).toBe(true);
  });

  it("rejects a string with too few digits", () => {
    expect(isValidPhone("12345")).toBe(false);
  });

  it("rejects letters typed into the field", () => {
    expect(isValidPhone("not a phone number")).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(isValidPhone("")).toBe(false);
  });
});

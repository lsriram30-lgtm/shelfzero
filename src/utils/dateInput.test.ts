import { fromIsoDate, isDateComplete, isDateEmpty, onlyDigits, toIsoDate } from "./dateInput";

describe("toIsoDate", () => {
  it("combines valid month/day/year into an ISO date", () => {
    expect(toIsoDate({ month: "3", day: "5", year: "2026" })).toBe("2026-03-05");
  });

  it("zero-pads single-digit month and day", () => {
    expect(toIsoDate({ month: "1", day: "9", year: "2026" })).toBe("2026-01-09");
  });

  it("returns null when any part is missing", () => {
    expect(toIsoDate({ month: "", day: "5", year: "2026" })).toBeNull();
    expect(toIsoDate({ month: "3", day: "", year: "2026" })).toBeNull();
    expect(toIsoDate({ month: "3", day: "5", year: "" })).toBeNull();
  });

  it("returns null for a month greater than 12", () => {
    expect(toIsoDate({ month: "13", day: "1", year: "2026" })).toBeNull();
  });

  it("returns null for a month of 0", () => {
    expect(toIsoDate({ month: "0", day: "1", year: "2026" })).toBeNull();
  });

  it("returns null for Feb 30th (doesn't exist)", () => {
    expect(toIsoDate({ month: "2", day: "30", year: "2026" })).toBeNull();
  });

  it("accepts Feb 29th on a leap year", () => {
    expect(toIsoDate({ month: "2", day: "29", year: "2028" })).toBe("2028-02-29");
  });

  it("returns null for Feb 29th on a non-leap year", () => {
    expect(toIsoDate({ month: "2", day: "29", year: "2026" })).toBeNull();
  });

  it("returns null for a day of 0 or 32", () => {
    expect(toIsoDate({ month: "1", day: "0", year: "2026" })).toBeNull();
    expect(toIsoDate({ month: "1", day: "32", year: "2026" })).toBeNull();
  });

  it("returns null when the year isn't 4 digits", () => {
    expect(toIsoDate({ month: "1", day: "1", year: "26" })).toBeNull();
  });
});

describe("fromIsoDate", () => {
  it("splits an ISO date into parts", () => {
    expect(fromIsoDate("2026-03-05")).toEqual({ month: "03", day: "05", year: "2026" });
  });

  it("returns empty parts for null/undefined", () => {
    expect(fromIsoDate(null)).toEqual({ month: "", day: "", year: "" });
    expect(fromIsoDate(undefined)).toEqual({ month: "", day: "", year: "" });
  });

  it("returns empty parts for a malformed string", () => {
    expect(fromIsoDate("not-a-date")).toEqual({ month: "", day: "", year: "" });
  });
});

describe("isDateComplete / isDateEmpty", () => {
  it("is complete only when all three parts are present", () => {
    expect(isDateComplete({ month: "1", day: "1", year: "2026" })).toBe(true);
    expect(isDateComplete({ month: "1", day: "", year: "2026" })).toBe(false);
  });

  it("is empty only when all three parts are blank", () => {
    expect(isDateEmpty({ month: "", day: "", year: "" })).toBe(true);
    expect(isDateEmpty({ month: "1", day: "", year: "" })).toBe(false);
  });
});

describe("onlyDigits", () => {
  it("strips non-digit characters", () => {
    expect(onlyDigits("1a2b3", 5)).toBe("123");
  });

  it("truncates to the max length", () => {
    expect(onlyDigits("12345", 2)).toBe("12");
  });
});

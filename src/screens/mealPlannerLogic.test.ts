import { buildMealPlanPreferences, hasPantryChanged } from "./mealPlannerLogic";
import { OnboardingProfile } from "../types";

function profile(overrides: Partial<OnboardingProfile>): OnboardingProfile {
  return {
    name: "Jamie",
    location: "Austin, TX",
    householdAdults: 2,
    householdKids: 0,
    cuisinePrefs: [],
    dietaryPrefs: [],
    allergies: [],
    goals: [],
    ...overrides,
  };
}

describe("buildMealPlanPreferences", () => {
  it("returns undefined when there's no profile", () => {
    expect(buildMealPlanPreferences(null)).toBeUndefined();
  });

  it("returns undefined when the profile has no prefs set", () => {
    expect(buildMealPlanPreferences(profile({}))).toBeUndefined();
  });

  it("includes only the fields that have values", () => {
    expect(buildMealPlanPreferences(profile({ cuisinePrefs: ["Italian"] }))).toEqual({
      cuisines: ["Italian"],
    });
  });

  it("includes cuisines, dietary, and allergies together when all are set", () => {
    expect(
      buildMealPlanPreferences(
        profile({
          cuisinePrefs: ["Italian", "Thai"],
          dietaryPrefs: ["Vegan"],
          allergies: ["Peanuts"],
        })
      )
    ).toEqual({
      cuisines: ["Italian", "Thai"],
      dietary: ["Vegan"],
      allergies: ["Peanuts"],
    });
  });
});

describe("hasPantryChanged", () => {
  it("returns false when the lists are identical", () => {
    expect(hasPantryChanged(["Milk", "Eggs"], ["Milk", "Eggs"])).toBe(false);
  });

  it("returns false when the lists match regardless of order", () => {
    expect(hasPantryChanged(["Eggs", "Milk"], ["Milk", "Eggs"])).toBe(false);
  });

  it("returns true when an item was added", () => {
    expect(hasPantryChanged(["Milk", "Eggs", "Bread"], ["Milk", "Eggs"])).toBe(true);
  });

  it("returns true when an item was used up/removed", () => {
    expect(hasPantryChanged(["Milk"], ["Milk", "Eggs"])).toBe(true);
  });

  it("returns true when the same count but different items", () => {
    expect(hasPantryChanged(["Milk", "Bread"], ["Milk", "Eggs"])).toBe(true);
  });

  it("returns false for two empty lists", () => {
    expect(hasPantryChanged([], [])).toBe(false);
  });
});

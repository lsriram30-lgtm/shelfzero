import {
  buildGenerationFailureMessage,
  buildMealPlanPreferences,
  formatIngredientLabel,
  hasEnoughPantryItems,
  hasPantryChanged,
  MIN_PANTRY_ITEMS_FOR_PLAN,
  missingIngredients,
  parseIngredientQuantity,
  replaceDayInPlan,
} from "./mealPlannerLogic";
import { MealPlanDay, OnboardingProfile } from "../types";

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

describe("hasEnoughPantryItems", () => {
  it("returns false for an empty pantry", () => {
    expect(hasEnoughPantryItems(0)).toBe(false);
  });

  it("returns false when below the minimum", () => {
    expect(hasEnoughPantryItems(MIN_PANTRY_ITEMS_FOR_PLAN - 1)).toBe(false);
  });

  it("returns true at exactly the minimum", () => {
    expect(hasEnoughPantryItems(MIN_PANTRY_ITEMS_FOR_PLAN)).toBe(true);
  });

  it("returns true above the minimum", () => {
    expect(hasEnoughPantryItems(MIN_PANTRY_ITEMS_FOR_PLAN + 5)).toBe(true);
  });
});

describe("missingIngredients", () => {
  it("returns an empty array when there are no ingredients", () => {
    expect(missingIngredients(undefined)).toEqual([]);
  });

  it("returns only ingredients explicitly marked not in pantry", () => {
    const ingredients = [
      { name: "chicken breast", inPantry: false },
      { name: "rice", inPantry: true },
      { name: "garlic", inPantry: false },
    ];
    expect(missingIngredients(ingredients)).toEqual([
      { name: "chicken breast", inPantry: false },
      { name: "garlic", inPantry: false },
    ]);
  });

  it("treats a missing inPantry flag as not-missing (unknown, not assumed absent)", () => {
    expect(missingIngredients([{ name: "salt" }])).toEqual([]);
  });

  it("returns an empty array when everything is already in the pantry", () => {
    expect(missingIngredients([{ name: "rice", inPantry: true }])).toEqual([]);
  });
});

describe("parseIngredientQuantity", () => {
  it("parses a plain number", () => {
    expect(parseIngredientQuantity("3")).toBe(3);
  });

  it("parses the leading number out of a unit string", () => {
    expect(parseIngredientQuantity("2 cloves")).toBe(2);
    expect(parseIngredientQuantity("1 lb")).toBe(1);
    expect(parseIngredientQuantity("1.5 cups")).toBe(1.5);
  });

  it("falls back to 1 when there's no leading number", () => {
    expect(parseIngredientQuantity("a pinch")).toBe(1);
    expect(parseIngredientQuantity("")).toBe(1);
    expect(parseIngredientQuantity(undefined)).toBe(1);
  });

  it("falls back to 1 for a zero or negative leading number", () => {
    expect(parseIngredientQuantity("0 cups")).toBe(1);
    expect(parseIngredientQuantity("-1 cups")).toBe(1);
  });
});

describe("formatIngredientLabel", () => {
  it("includes the quantity in parentheses when present", () => {
    expect(formatIngredientLabel({ name: "garlic", quantity: "2 cloves" })).toBe(
      "garlic (2 cloves)"
    );
  });

  it("falls back to just the name when there's no quantity", () => {
    expect(formatIngredientLabel({ name: "salt" })).toBe("salt");
  });
});

describe("buildGenerationFailureMessage", () => {
  it("returns just the error message when nothing succeeded", () => {
    expect(buildGenerationFailureMessage(0, 7, "Server timed out.")).toBe("Server timed out.");
  });

  it("names how many days succeeded and points at per-day regenerate", () => {
    expect(buildGenerationFailureMessage(3, 7, "Server timed out.")).toBe(
      "Generated 3 of 7 days before this failed: Server timed out. You can regenerate the " +
        "missing days individually below."
    );
  });
});

function day(label: string, mealTitle: string): MealPlanDay {
  return { day: label, meals: [{ label: "Dinner", title: mealTitle }] };
}

describe("replaceDayInPlan", () => {
  const original = [day("Monday", "Pasta"), day("Tuesday", "Tacos"), day("Wednesday", "Soup")];

  it("replaces only the matching day, leaving the rest untouched", () => {
    const fresh = [day("Tuesday", "Stir Fry")];
    const result = replaceDayInPlan(original, "Tuesday", fresh);
    expect(result.map((d) => d.meals[0].title)).toEqual(["Pasta", "Stir Fry", "Soup"]);
  });

  it("only needs the target day to be present in the fresh plan, not the full week", () => {
    const fresh = [day("Monday", "Omelet"), day("Tuesday", "Stir Fry"), day("Wednesday", "Curry")];
    const result = replaceDayInPlan(original, "Tuesday", fresh);
    expect(result.map((d) => d.meals[0].title)).toEqual(["Pasta", "Stir Fry", "Soup"]);
  });

  it("returns the original days unchanged if the fresh plan has no matching day label", () => {
    const fresh = [day("SomeOtherLabel", "Mystery Dish")];
    expect(replaceDayInPlan(original, "Tuesday", fresh)).toEqual(original);
  });

  it("does not mutate the original array", () => {
    const before = [...original];
    replaceDayInPlan(original, "Monday", [day("Monday", "Omelet")]);
    expect(original).toEqual(before);
  });
});

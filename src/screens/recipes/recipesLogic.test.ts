import { filterByMealType, uniqueMealTypes } from "./recipesLogic";
import { Recipe } from "../../types";

function recipe(overrides: Partial<Recipe>): Recipe {
  return {
    id: "1",
    title: "Test recipe",
    ...overrides,
  };
}

describe("uniqueMealTypes", () => {
  it("returns distinct meal types in first-seen order", () => {
    const recipes = [
      recipe({ id: "1", mealType: "Breakfast" }),
      recipe({ id: "2", mealType: "Lunch" }),
      recipe({ id: "3", mealType: "Breakfast" }),
      recipe({ id: "4", mealType: "Dinner" }),
    ];
    expect(uniqueMealTypes(recipes)).toEqual(["Breakfast", "Lunch", "Dinner"]);
  });

  it("skips recipes with no meal type", () => {
    const recipes = [recipe({ id: "1", mealType: undefined }), recipe({ id: "2", mealType: "Lunch" })];
    expect(uniqueMealTypes(recipes)).toEqual(["Lunch"]);
  });

  it("returns an empty array when nothing has a meal type", () => {
    expect(uniqueMealTypes([recipe({ mealType: undefined })])).toEqual([]);
  });
});

describe("filterByMealType", () => {
  const recipes = [
    recipe({ id: "1", mealType: "Breakfast" }),
    recipe({ id: "2", mealType: "Lunch" }),
    recipe({ id: "3", mealType: "Dinner" }),
    recipe({ id: "4", mealType: undefined }),
  ];

  it("returns all recipes when mealType is null", () => {
    expect(filterByMealType(recipes, null)).toEqual(recipes);
  });

  it("returns only recipes matching the given meal type", () => {
    expect(filterByMealType(recipes, "Lunch").map((r) => r.id)).toEqual(["2"]);
  });

  it("excludes recipes with no meal type when a filter is active", () => {
    expect(filterByMealType(recipes, "Breakfast").map((r) => r.id)).toEqual(["1"]);
  });

  it("returns an empty array when nothing matches", () => {
    expect(filterByMealType(recipes, "Snack")).toEqual([]);
  });
});

import {
  buildRecipesEmptyMessage,
  filterByCuisine,
  filterByMealType,
  filterByTitle,
  sortByMatchScore,
  uniqueCuisines,
  uniqueMealTypes,
} from "./recipesLogic";
import { Recipe } from "../../types";

function recipe(overrides: Partial<Recipe>): Recipe {
  return {
    id: "1",
    title: "Test recipe",
    ...overrides,
  };
}

describe("sortByMatchScore", () => {
  it("sorts descending by match score", () => {
    const recipes = [
      recipe({ id: "1", matchScore: 40 }),
      recipe({ id: "2", matchScore: 95 }),
      recipe({ id: "3", matchScore: 70 }),
    ];
    expect(sortByMatchScore(recipes).map((r) => r.id)).toEqual(["2", "3", "1"]);
  });

  it("sorts recipes with no score after every scored recipe", () => {
    const recipes = [
      recipe({ id: "1", matchScore: undefined }),
      recipe({ id: "2", matchScore: 50 }),
    ];
    expect(sortByMatchScore(recipes).map((r) => r.id)).toEqual(["2", "1"]);
  });

  it("preserves relative order among recipes that all lack a score", () => {
    const recipes = [recipe({ id: "1" }), recipe({ id: "2" }), recipe({ id: "3" })];
    expect(sortByMatchScore(recipes).map((r) => r.id)).toEqual(["1", "2", "3"]);
  });

  it("does not mutate the original array", () => {
    const recipes = [recipe({ id: "1", matchScore: 10 }), recipe({ id: "2", matchScore: 90 })];
    const before = [...recipes];
    sortByMatchScore(recipes);
    expect(recipes).toEqual(before);
  });
});

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

describe("uniqueCuisines", () => {
  it("returns distinct cuisines in first-seen order", () => {
    const recipes = [
      recipe({ id: "1", cuisine: "Italian" }),
      recipe({ id: "2", cuisine: "Thai" }),
      recipe({ id: "3", cuisine: "Italian" }),
      recipe({ id: "4", cuisine: "Mexican" }),
    ];
    expect(uniqueCuisines(recipes)).toEqual(["Italian", "Thai", "Mexican"]);
  });

  it("skips recipes with no cuisine", () => {
    const recipes = [recipe({ id: "1", cuisine: undefined }), recipe({ id: "2", cuisine: "Thai" })];
    expect(uniqueCuisines(recipes)).toEqual(["Thai"]);
  });

  it("returns an empty array when nothing has a cuisine", () => {
    expect(uniqueCuisines([recipe({ cuisine: undefined })])).toEqual([]);
  });
});

describe("filterByCuisine", () => {
  const recipes = [
    recipe({ id: "1", cuisine: "Italian" }),
    recipe({ id: "2", cuisine: "Thai" }),
    recipe({ id: "3", cuisine: "Mexican" }),
    recipe({ id: "4", cuisine: undefined }),
  ];

  it("returns all recipes when cuisine is null", () => {
    expect(filterByCuisine(recipes, null)).toEqual(recipes);
  });

  it("returns only recipes matching the given cuisine", () => {
    expect(filterByCuisine(recipes, "Thai").map((r) => r.id)).toEqual(["2"]);
  });

  it("excludes recipes with no cuisine when a filter is active", () => {
    expect(filterByCuisine(recipes, "Italian").map((r) => r.id)).toEqual(["1"]);
  });

  it("returns an empty array when nothing matches", () => {
    expect(filterByCuisine(recipes, "Japanese")).toEqual([]);
  });
});

describe("buildRecipesEmptyMessage", () => {
  it("names the search query alone when no filter is active", () => {
    expect(buildRecipesEmptyMessage("pasta", null, null)).toBe('No recipes match "pasta".');
  });

  it("names the meal type alone when there's a filter but no query", () => {
    expect(buildRecipesEmptyMessage("", "Breakfast", null)).toBe(
      "No Breakfast recipes right now — try a different filter."
    );
  });

  it("names the cuisine alone when there's a filter but no query", () => {
    expect(buildRecipesEmptyMessage("", null, "Thai")).toBe(
      "No Thai recipes right now — try a different filter."
    );
  });

  it("combines cuisine and meal type when both are active with no query", () => {
    expect(buildRecipesEmptyMessage("", "Breakfast", "Thai")).toBe(
      "No Thai Breakfast recipes right now — try a different filter."
    );
  });

  it("combines cuisine, meal type, and query when all three are active", () => {
    expect(buildRecipesEmptyMessage("pasta", "Dinner", "Italian")).toBe(
      'No Italian Dinner recipes match "pasta".'
    );
  });

  it("combines just the query and meal type when cuisine isn't active", () => {
    expect(buildRecipesEmptyMessage("pasta", "Dinner", null)).toBe(
      'No Dinner recipes match "pasta".'
    );
  });

  it("combines just the query and cuisine when meal type isn't active", () => {
    expect(buildRecipesEmptyMessage("pasta", null, "Italian")).toBe(
      'No Italian recipes match "pasta".'
    );
  });

  it("falls back to a generic message when nothing is active", () => {
    expect(buildRecipesEmptyMessage("", null, null)).toBe("No recipes match these filters.");
  });
});

describe("filterByTitle", () => {
  const recipes = [
    recipe({ id: "1", title: "Chicken Stir Fry" }),
    recipe({ id: "2", title: "Vegetable Soup" }),
    recipe({ id: "3", title: "Chicken Noodle Soup" }),
  ];

  it("returns all recipes when the query is empty", () => {
    expect(filterByTitle(recipes, "")).toEqual(recipes);
  });

  it("returns all recipes when the query is only whitespace", () => {
    expect(filterByTitle(recipes, "   ")).toEqual(recipes);
  });

  it("matches a substring anywhere in the title, case-insensitively", () => {
    expect(filterByTitle(recipes, "chicken").map((r) => r.id)).toEqual(["1", "3"]);
  });

  it("trims the query before matching", () => {
    expect(filterByTitle(recipes, "  soup  ").map((r) => r.id)).toEqual(["2", "3"]);
  });

  it("returns an empty array when nothing matches", () => {
    expect(filterByTitle(recipes, "pizza")).toEqual([]);
  });
});

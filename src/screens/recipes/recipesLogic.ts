import { Recipe } from "../../types";

export function uniqueMealTypes(recipes: Recipe[]): string[] {
  const seen = new Set<string>();
  const types: string[] = [];
  recipes.forEach((recipe) => {
    if (recipe.mealType && !seen.has(recipe.mealType)) {
      seen.add(recipe.mealType);
      types.push(recipe.mealType);
    }
  });
  return types;
}

export function filterByMealType(recipes: Recipe[], mealType: string | null): Recipe[] {
  if (!mealType) return recipes;
  return recipes.filter((recipe) => recipe.mealType === mealType);
}

export function uniqueCuisines(recipes: Recipe[]): string[] {
  const seen = new Set<string>();
  const cuisines: string[] = [];
  recipes.forEach((recipe) => {
    if (recipe.cuisine && !seen.has(recipe.cuisine)) {
      seen.add(recipe.cuisine);
      cuisines.push(recipe.cuisine);
    }
  });
  return cuisines;
}

export function filterByCuisine(recipes: Recipe[], cuisine: string | null): Recipe[] {
  if (!cuisine) return recipes;
  return recipes.filter((recipe) => recipe.cuisine === cuisine);
}

// Builds the "No matching recipes" empty-state message, covering every
// combination of the search query, meal-type filter, and cuisine filter -
// extending the meal-type-only version to also name a cuisine mismatch
// instead of just going generic once a second filter axis exists.
export function buildRecipesEmptyMessage(
  trimmedQuery: string,
  mealTypeFilter: string | null,
  cuisineFilter: string | null
): string {
  const filterLabel = [cuisineFilter, mealTypeFilter].filter(Boolean).join(" ");

  if (trimmedQuery) {
    return filterLabel
      ? `No ${filterLabel} recipes match "${trimmedQuery}".`
      : `No recipes match "${trimmedQuery}".`;
  }
  return filterLabel
    ? `No ${filterLabel} recipes right now — try a different filter.`
    : "No recipes match these filters.";
}

// There's no backend recipe search/catalog endpoint (see README's "Known
// gaps"), so this only ever filters whatever's already been suggested from
// the current pantry + favorited — not a real search across all possible
// recipes. Same pattern as the Pantry screen's filterByName.
export function filterByTitle(recipes: Recipe[], query: string): Recipe[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return recipes;
  return recipes.filter((recipe) => recipe.title.toLowerCase().includes(trimmed));
}

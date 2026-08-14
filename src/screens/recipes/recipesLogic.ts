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

// There's no backend recipe search/catalog endpoint (see README's "Known
// gaps"), so this only ever filters whatever's already been suggested from
// the current pantry + favorited — not a real search across all possible
// recipes. Same pattern as the Pantry screen's filterByName.
export function filterByTitle(recipes: Recipe[], query: string): Recipe[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return recipes;
  return recipes.filter((recipe) => recipe.title.toLowerCase().includes(trimmed));
}

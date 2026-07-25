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

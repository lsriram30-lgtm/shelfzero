import { useCallback, useState } from "react";
import { mealPlanApi } from "../api/mealPlan";
import { usePantry } from "./usePantry";
import { Recipe, MealPlanDay } from "../types";
import { MEAL_LABELS, parseMealPlanDays } from "../screens/mealPlannerLogic";

// The backend has no standalone recipe-list endpoint, so suggestions are
// derived from the meal-plan generator (POST /api/meal-plan) using current
// pantry contents. Swap this out once a dedicated /api/recipes endpoint exists.
//
// Requesting the full default week (no scoping at all) always timed out -
// worse than the single-day case that needed day-scoping, since this sends
// every one of the 21 meals in one call. Suggestions don't need a whole
// week's structure, just some real recipes, so this scopes down to one
// day's 3 meals (one call per meal, matching the meal-plan generator's own
// fix) instead of a full 7-day/21-meal sweep - bounded and fast rather than
// maximally varied, since this fires automatically on mount/focus/retry,
// not from an explicit button press with a progress indicator.
export function useSuggestedRecipes() {
  const { items: pantryItems } = usePantry();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pantryItemNames = pantryItems.map((item) => item.name);
      const meals: MealPlanDay["meals"] = [];
      for (const mealLabel of MEAL_LABELS) {
        const raw = await mealPlanApi.generate({
          pantryItems: pantryItemNames,
          days: 1,
          dayIndex: 0,
          mealLabel,
        });
        const parsedDays = parseMealPlanDays(raw);
        if (parsedDays[0]) meals.push(...parsedDays[0].meals);
      }
      const seen = new Set<string>();
      const derived: Recipe[] = [];
      meals.forEach((meal) => {
        if (seen.has(meal.title)) return;
        seen.add(meal.title);
        derived.push({
          id: `${meal.label}-${meal.title}`.toLowerCase().replace(/\s+/g, "-"),
          title: meal.title,
          ingredients: meal.description ? [meal.description] : undefined,
          mealType: meal.label || undefined,
          cuisine: meal.cuisine || undefined,
        });
      });
      setRecipes(derived);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load recipe suggestions");
    } finally {
      setLoading(false);
    }
  }, [pantryItems]);

  return { recipes, loading, error, generate };
}

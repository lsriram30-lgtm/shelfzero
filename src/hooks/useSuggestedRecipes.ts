import { useCallback, useState } from "react";
import { mealPlanApi } from "../api/mealPlan";
import { usePantry } from "./usePantry";
import { Recipe } from "../types";
import { parseMealPlanDays } from "../screens/mealPlannerLogic";

// The backend has no standalone recipe-list endpoint, so suggestions are
// derived from the meal-plan generator (POST /api/meal-plan) using current
// pantry contents. Swap this out once a dedicated /api/recipes endpoint exists.
//
// Requesting the full default week (no scoping at all) always timed out
// (~22s, confirmed live 8/31) - this scopes down to a single day (dayIndex:
// 0) the same way the meal-plan generator's day-scoped calls already do,
// which was separately confirmed fast (~7-15s across several days).
// mealLabel (meal-level scoping) was tried first and reverted - live-tested
// and confirmed the backend doesn't actually honor it (an invalid value
// still returned a full 3-meal day), so day-scoping is both correct and
// sufficient; looping it per-meal would have just tripled the calls for no
// benefit.
export function useSuggestedRecipes() {
  const { items: pantryItems } = usePantry();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const raw = await mealPlanApi.generate({
        pantryItems: pantryItems.map((item) => item.name),
        days: 1,
        dayIndex: 0,
      });
      const parsedDays = parseMealPlanDays(raw);
      const seen = new Set<string>();
      const derived: Recipe[] = [];
      parsedDays.forEach((day) => {
        day.meals.forEach((meal) => {
          if (seen.has(meal.title)) return;
          seen.add(meal.title);
          derived.push({
            id: `${day.day}-${meal.label}-${meal.title}`.toLowerCase().replace(/\s+/g, "-"),
            title: meal.title,
            ingredients: meal.description ? [meal.description] : undefined,
            mealType: meal.label || undefined,
            cuisine: meal.cuisine || undefined,
          });
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

import {
  MealIngredient,
  MealPlanDay,
  MealSlotLabel,
  OnboardingProfile,
  RawMealPlanApiResponse,
} from "../types";

const MEAL_TYPE_LABELS: { key: MealSlotLabel; label: string }[] = [
  { key: "breakfast", label: "Breakfast" },
  { key: "lunch", label: "Lunch" },
  { key: "dinner", label: "Dinner" },
];

// Matches the backend's documented mealLabel values for requesting one
// specific meal of a day at a time (in addition to dayIndex/startDay
// already scoping down to one day).
export const MEAL_LABELS: MealSlotLabel[] = MEAL_TYPE_LABELS.map((m) => m.key);

// Converts the real `POST /api/meal-plan` wire shape into the MealPlanDay[]
// shape the rest of the app is built around - see the comment on
// RawMealPlanApiResponse for why this is needed at all. Missing days or an
// unrecognized meals shape resolve to an empty array rather than throwing,
// since a generation request that returns nothing usable should read as
// "no days came back" to the caller, not crash the screen.
export function parseMealPlanDays(raw: RawMealPlanApiResponse): MealPlanDay[] {
  const rawDays = raw?.plan?.days;
  if (!Array.isArray(rawDays)) return [];

  return rawDays.map((day) => ({
    day: day.day,
    meals: MEAL_TYPE_LABELS.filter(({ key }) => day.meals?.[key]).map(({ key, label }) => {
      const meal = day.meals[key]!;
      return {
        label,
        title: meal.name,
        description: meal.description,
        ingredients: meal.ingredients,
        cuisine: meal.cuisine,
      };
    }),
  }));
}

// The backend doesn't document a minimum pantry size for generating a
// 7-day plan, so this is a client-side heuristic to catch the obvious
// case (an empty or near-empty pantry) before wasting a request on it.
export const MIN_PANTRY_ITEMS_FOR_PLAN = 3;

// Matches the backend's documented dayIndex mapping (0-6, Monday-Sunday)
// for requesting one specific day of a plan at a time.
export const WEEKDAY_LABELS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function hasEnoughPantryItems(itemCount: number): boolean {
  return itemCount >= MIN_PANTRY_ITEMS_FOR_PLAN;
}

export function buildMealPlanPreferences(
  profile: OnboardingProfile | null
): Record<string, string[]> | undefined {
  if (!profile) return undefined;

  const preferences: Record<string, string[]> = {};
  if (profile.cuisinePrefs.length > 0) preferences.cuisines = profile.cuisinePrefs;
  if (profile.dietaryPrefs.length > 0) preferences.dietary = profile.dietaryPrefs;
  if (profile.allergies.length > 0) preferences.allergies = profile.allergies;

  return Object.keys(preferences).length > 0 ? preferences : undefined;
}

export function hasPantryChanged(current: string[], cached: string[]): boolean {
  if (current.length !== cached.length) return true;
  const currentSet = new Set(current);
  return cached.some((name) => !currentSet.has(name));
}

// Only the 1-2 things actually missing are worth adding to the shopping
// list - most of a suggested meal's ingredients should already be on hand,
// since the plan was generated from the current pantry in the first place.
export function missingIngredients(
  ingredients: MealIngredient[] | undefined
): MealIngredient[] {
  if (!ingredients) return [];
  return ingredients.filter((ingredient) => ingredient.inPantry === false);
}

// Ingredient quantities are free-text like "2 cloves" or "1 lb" - only the
// leading number is usable as a shopping-list qty, the rest ("cloves",
// "lb") is display-only context, shown separately via
// formatIngredientLabel below.
export function parseIngredientQuantity(quantity: string | undefined): number {
  if (!quantity) return 1;
  const match = quantity.match(/^\s*(\d+(?:\.\d+)?)/);
  if (!match) return 1;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function formatIngredientLabel(ingredient: MealIngredient): string {
  return ingredient.quantity ? `${ingredient.name} (${ingredient.quantity})` : ingredient.name;
}

// Building a week out of 7 sequential single-day requests means a
// mid-week failure shouldn't discard the days that already succeeded -
// this summarizes what happened so the partial result and the failure
// are both clear, and points at per-day regenerate for the rest.
export function buildGenerationFailureMessage(
  successCount: number,
  totalCount: number,
  errorMessage: string
): string {
  if (successCount === 0) return errorMessage;
  return `Generated ${successCount} of ${totalCount} days before this failed: ${errorMessage} You can regenerate the missing days individually below.`;
}

// "Regenerate one day" builds a fresh single day (3 meal-scoped calls,
// stitched together the same way full-week generation is) and splices
// just that day into the existing cached week, leaving the rest
// untouched. If the fresh day's label doesn't happen to match, the
// original days are returned unchanged rather than silently dropping it.
export function replaceDayInPlan(
  days: MealPlanDay[],
  dayLabel: string,
  freshDays: MealPlanDay[]
): MealPlanDay[] {
  const replacement = freshDays.find((d) => d.day === dayLabel);
  if (!replacement) return days;
  return days.map((d) => (d.day === dayLabel ? replacement : d));
}

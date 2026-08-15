import { MealIngredient, MealPlanDay, OnboardingProfile } from "../types";

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

// The backend only ever generates a full 7-day plan - there's no per-day
// endpoint - so "regenerate one day" works by generating a whole fresh
// plan and splicing just the requested day out of it, leaving the rest of
// the cached week untouched. If the fresh plan doesn't happen to include a
// day with a matching label, the original days are returned unchanged
// rather than silently dropping that day.
// Only the 1-2 things actually missing are worth adding to the shopping
// list - most of a suggested meal's ingredients should already be on hand,
// since the plan was generated from the current pantry in the first place.
export function missingIngredients(
  ingredients: MealIngredient[] | undefined
): MealIngredient[] {
  if (!ingredients) return [];
  return ingredients.filter((ingredient) => ingredient.inPantry === false);
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

export function replaceDayInPlan(
  days: MealPlanDay[],
  dayLabel: string,
  freshDays: MealPlanDay[]
): MealPlanDay[] {
  const replacement = freshDays.find((d) => d.day === dayLabel);
  if (!replacement) return days;
  return days.map((d) => (d.day === dayLabel ? replacement : d));
}

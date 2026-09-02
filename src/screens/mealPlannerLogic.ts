import { MealIngredient, MealPlanDay, OnboardingProfile, RawMealPlanApiResponse } from "../types";
import { singularize } from "./pantry/pantryLogic";

const MEAL_TYPE_LABELS: { key: "breakfast" | "lunch" | "dinner"; label: string }[] = [
  { key: "breakfast", label: "Breakfast" },
  { key: "lunch", label: "Lunch" },
  { key: "dinner", label: "Dinner" },
];

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

function normalizedWords(text: string): string[] {
  return text
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(singularize);
}

// The backend's own per-ingredient `inPantry` flag turned out to be
// unreliable when live-tested - it marked "olive oil" as not in the pantry
// even when "olive oil" was one of the exact pantry item names sent in the
// same request, and every ingredient across an entire generated day came
// back `inPantry: false` regardless of overlap with the real pantry. So
// this recomputes it client-side against the actual current pantry names
// instead of trusting that flag - "chicken" in the pantry correctly
// matches a "cooked chicken breast" ingredient, "olive oil" matches
// "olive oil", etc. Every word of the pantry item name has to appear in
// the ingredient name (not just a raw substring), so a pantry item like
// "egg" doesn't false-positive match an ingredient like "eggplant".
// Known honest gap: a vague pantry entry like "Veggies" won't match a
// recipe's specific "broccoli" or "carrots" - there's no way to know
// what a generic name like that actually refers to from the string alone.
export function ingredientInPantry(ingredientName: string, pantryItemNames: string[]): boolean {
  const ingredientWords = new Set(normalizedWords(ingredientName));
  return pantryItemNames.some((pantryName) => {
    const pantryWords = normalizedWords(pantryName);
    return pantryWords.length > 0 && pantryWords.every((word) => ingredientWords.has(word));
  });
}

// Only the 1-2 things actually missing are worth adding to the shopping
// list - most of a suggested meal's ingredients should already be on hand,
// since the plan was generated from the current pantry in the first place.
export function missingIngredients(
  ingredients: MealIngredient[] | undefined,
  pantryItemNames: string[]
): MealIngredient[] {
  if (!ingredients) return [];
  return ingredients.filter((ingredient) => !ingredientInPantry(ingredient.name, pantryItemNames));
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

// "Regenerate one day" builds a fresh single day-scoped call and splices
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

// Maps JS Date.getDay() (0=Sunday..6=Saturday) onto WEEKDAY_LABELS' own
// Monday-indexed scheme (0=Monday..6=Sunday).
export function currentWeekdayIndex(now: Date = new Date()): number {
  return (now.getDay() + 6) % 7;
}

// Building a full week out of 7 back-to-back calls is what was tripping
// the backend's rate limit - this builds it up one day at a time instead,
// starting from today and wrapping forward through the week, so a day
// only ever gets requested when the user actually asks for the next one.
// Returns null once every day of the week is already present.
export function nextWeekdayIndex(days: MealPlanDay[], now: Date = new Date()): number | null {
  const present = new Set(days.map((d) => d.day));
  const start = currentWeekdayIndex(now);
  for (let offset = 0; offset < WEEKDAY_LABELS.length; offset++) {
    const idx = (start + offset) % WEEKDAY_LABELS.length;
    if (!present.has(WEEKDAY_LABELS[idx])) return idx;
  }
  return null;
}

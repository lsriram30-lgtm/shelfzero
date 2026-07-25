import { OnboardingProfile } from "../types";

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

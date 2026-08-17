import AsyncStorage from "@react-native-async-storage/async-storage";
import { MealPlanDay } from "../types";
import { accountScopedKey } from "./accountScopedKey";

const MEAL_PLAN_CACHE_KEY_PREFIX = "shelfzero.mealPlan";
const MEAL_PLAN_HISTORY_KEY_PREFIX = "shelfzero.mealPlanHistory";

// Caps unbounded AsyncStorage growth - roughly 3 months of weekly
// generations, more than enough for "what did we eat a few weeks ago."
const MAX_HISTORY_ENTRIES = 12;

export interface CachedMealPlan {
  days: MealPlanDay[];
  pantryItemNames: string[];
}

export interface MealPlanHistoryEntry extends CachedMealPlan {
  id: string;
  savedAt: string;
}

// email comes from the caller's useAuth().currentEmail — these are plain
// functions, not hooks, so they can't read auth state themselves. Keyed
// by account for the same reason as the pantry offline cache: a second
// account signing in on the same device shouldn't see the first account's
// cached meal plan.
export async function getCachedMealPlan(email: string | null): Promise<CachedMealPlan | null> {
  try {
    const raw = await AsyncStorage.getItem(accountScopedKey(MEAL_PLAN_CACHE_KEY_PREFIX, email));
    return raw ? (JSON.parse(raw) as CachedMealPlan) : null;
  } catch {
    return null;
  }
}

export async function setCachedMealPlan(plan: CachedMealPlan, email: string | null): Promise<void> {
  await AsyncStorage.setItem(
    accountScopedKey(MEAL_PLAN_CACHE_KEY_PREFIX, email),
    JSON.stringify(plan)
  ).catch(() => {});
}

export async function getMealPlanHistory(email: string | null): Promise<MealPlanHistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(accountScopedKey(MEAL_PLAN_HISTORY_KEY_PREFIX, email));
    return raw ? (JSON.parse(raw) as MealPlanHistoryEntry[]) : [];
  } catch {
    return [];
  }
}

// Deliberately separate from setCachedMealPlan (the "current plan" cache,
// also updated by single-day regenerates and "keep as is") - only a full
// fresh week actually deserves its own history entry, not every tweak to
// the current one.
export async function saveMealPlanToHistory(
  plan: CachedMealPlan,
  email: string | null
): Promise<void> {
  try {
    const existing = await getMealPlanHistory(email);
    const entry: MealPlanHistoryEntry = {
      ...plan,
      id: `${Date.now()}`,
      savedAt: new Date().toISOString(),
    };
    const updated = [entry, ...existing].slice(0, MAX_HISTORY_ENTRIES);
    await AsyncStorage.setItem(
      accountScopedKey(MEAL_PLAN_HISTORY_KEY_PREFIX, email),
      JSON.stringify(updated)
    );
  } catch {
    // Best-effort, same as setCachedMealPlan - losing history isn't worth
    // surfacing an error over.
  }
}

import AsyncStorage from "@react-native-async-storage/async-storage";
import { MealPlanDay } from "../types";
import { accountScopedKey } from "./accountScopedKey";

const MEAL_PLAN_CACHE_KEY_PREFIX = "shelfzero.mealPlan";

export interface CachedMealPlan {
  days: MealPlanDay[];
  pantryItemNames: string[];
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

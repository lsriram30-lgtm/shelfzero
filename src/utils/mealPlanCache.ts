import AsyncStorage from "@react-native-async-storage/async-storage";
import { MealPlanDay } from "../types";

export const MEAL_PLAN_CACHE_KEY = "shelfzero.mealPlan";

export interface CachedMealPlan {
  days: MealPlanDay[];
  pantryItemNames: string[];
}

export async function getCachedMealPlan(): Promise<CachedMealPlan | null> {
  try {
    const raw = await AsyncStorage.getItem(MEAL_PLAN_CACHE_KEY);
    return raw ? (JSON.parse(raw) as CachedMealPlan) : null;
  } catch {
    return null;
  }
}

export async function setCachedMealPlan(plan: CachedMealPlan): Promise<void> {
  await AsyncStorage.setItem(MEAL_PLAN_CACHE_KEY, JSON.stringify(plan)).catch(() => {});
}

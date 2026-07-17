import { apiClient } from "./client";
import { MealPlanRequest, MealPlanResponse } from "../types";

export const mealPlanApi = {
  generate: (payload: MealPlanRequest) =>
    apiClient.post<MealPlanResponse>("/api/meal-plan", payload),
};

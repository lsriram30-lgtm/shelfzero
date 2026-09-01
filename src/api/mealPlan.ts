import { apiClient } from "./client";
import { MealPlanRequest, RawMealPlanApiResponse } from "../types";

export const mealPlanApi = {
  generate: (payload: MealPlanRequest) =>
    apiClient.post<RawMealPlanApiResponse>("/api/meal-plan", payload),
};

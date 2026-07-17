import { apiClient } from "./client";
import { Recipe } from "../types";

export const favoritesApi = {
  list: () => apiClient.get<Recipe[]>("/api/favorites"),
  add: (recipeId: string) => apiClient.post<void>("/api/favorites", { recipeId }),
};

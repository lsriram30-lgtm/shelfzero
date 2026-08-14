import { apiClient } from "./client";
import { Recipe } from "../types";

export const recipesApi = {
  // Response shape hasn't bitten us yet the way /api/favorites and
  // /api/meal-plan's did, but both of those turned out to be wrapped
  // (`{ item: {...} }`, `{ items: [...] }`) when the docs implied a bare
  // array - parsing defensively here for the same reason.
  search: async (query: string): Promise<Recipe[]> => {
    const data = await apiClient.get<Recipe[] | { recipes?: Recipe[]; items?: Recipe[] }>(
      `/api/recipes?q=${encodeURIComponent(query)}`
    );
    if (Array.isArray(data)) return data;
    return data?.recipes ?? data?.items ?? [];
  },
};

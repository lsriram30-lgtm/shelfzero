import { NavigatorScreenParams } from "@react-navigation/native";
import { Recipe } from "../types";

export type PantryStackParamList = {
  Pantry: undefined;
  PantryStats: undefined;
  AddPantryItem: { prefill?: { name?: string; category?: string; quantity?: number; unit?: string } } | undefined;
  Scan: undefined;
};

export type RecipesStackParamList = {
  Recipes: undefined;
  RecipeDetail: { recipe: Recipe };
};

export type HouseholdStackParamList = {
  HouseholdHub: undefined;
  Profile: undefined;
  InviteFlow: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  PantryTab: NavigatorScreenParams<PantryStackParamList>;
  RecipesTab: NavigatorScreenParams<RecipesStackParamList>;
  MealPlanner: undefined;
  HouseholdTab: NavigatorScreenParams<HouseholdStackParamList>;
};

export type RootStackParamList = {
  Onboarding: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  Join: { token: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

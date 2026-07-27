import { NavigatorScreenParams } from "@react-navigation/native";
import { PantryItem, Recipe } from "../types";

export type PantryStackParamList = {
  Pantry: { category?: string } | undefined;
  PantryStats: undefined;
  AddPantryItem:
    | {
        prefill?: { name?: string; category?: string; quantity?: number; unit?: string };
        item?: PantryItem;
      }
    | undefined;
  Scan: undefined;
};

export type RecipesStackParamList = {
  Recipes: undefined;
  RecipeDetail: { recipe: Recipe };
};

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type HouseholdStackParamList = {
  HouseholdHub: undefined;
  Profile: undefined;
  EditProfile: undefined;
  InviteFlow: undefined;
  Donate: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  PantryTab: NavigatorScreenParams<PantryStackParamList>;
  RecipesTab: NavigatorScreenParams<RecipesStackParamList>;
  MealPlanner: undefined;
  HouseholdTab: NavigatorScreenParams<HouseholdStackParamList>;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Onboarding: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  Join: { token: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

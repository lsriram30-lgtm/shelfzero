import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { RootStackParamList } from "./types";

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/"), "https://shelfzero.app", "shelfzero://"],
  config: {
    screens: {
      Join: "join/:token",
      Main: {
        screens: {
          Dashboard: "dashboard",
          PantryTab: {
            screens: {
              Pantry: "pantry",
              PantryStats: "pantry/stats",
              AddPantryItem: "pantry/add",
              Scan: "pantry/scan",
            },
          },
          RecipesTab: {
            screens: {
              Recipes: "recipes",
              RecipeDetail: "recipes/:recipeId",
            },
          },
          MealPlanner: "meal-plan",
          HouseholdTab: {
            screens: {
              HouseholdHub: "household",
              Profile: "profile",
              InviteFlow: "household/invite",
            },
          },
        },
      },
      Onboarding: "onboarding",
    },
  },
};

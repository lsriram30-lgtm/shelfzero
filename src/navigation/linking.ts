import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { RootStackParamList } from "./types";

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/"), "https://shelfzero.app", "shelfzero://"],
  config: {
    screens: {
      Join: "join/:token",
      ResetPassword: "reset-password",
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
              // No RecipeDetail deep link: that screen requires a full
              // Recipe object passed via in-app navigation params, and
              // there's no GET /api/recipes/:id to hydrate one from just an
              // ID in a URL. A "recipes/:recipeId" entry here would always
              // land on a broken/empty screen, so recipe links resolve to
              // the list instead (RecipeDetailScreen still guards against
              // a missing recipe param defensively either way).
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

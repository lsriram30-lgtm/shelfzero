import { OnboardingProfile } from "../../types";

export type OnboardingDraft = OnboardingProfile;

export const initialOnboardingDraft: OnboardingDraft = {
  name: "",
  location: "",
  householdSize: 1,
  livingSituation: "",
  cuisinePrefs: [],
  dietaryPrefs: [],
  allergies: [],
  goals: [],
};

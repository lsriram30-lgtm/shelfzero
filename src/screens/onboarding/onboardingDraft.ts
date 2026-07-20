import { OnboardingProfile } from "../../types";

export type OnboardingDraft = OnboardingProfile;

export const initialOnboardingDraft: OnboardingDraft = {
  name: "",
  location: "",
  householdAdults: 1,
  householdKids: 0,
  cuisinePrefs: [],
  dietaryPrefs: [],
  allergies: [],
  goals: [],
};

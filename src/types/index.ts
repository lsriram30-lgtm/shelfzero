export interface PantryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiresAt: string | null;
  imageSlot?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type NewPantryItem = {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiresAt?: string | null;
  notes?: string | null;
};

export type UpdatePantryItem = Partial<NewPantryItem>;

export interface ShoppingListItem {
  id: string;
  name: string;
  checked: boolean;
  qty: number;
  notes?: string | null;
  addedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type NewShoppingListItem = {
  name: string;
  qty: number;
  addedBy?: string;
};

export type InviteRole = "adult" | "teen" | "child" | "guest";
export type InviteStatus = "pending" | "accepted" | "cancelled";
export type ContactType = "phone" | "email" | "link";

export interface HouseholdMember {
  id: string;
  name: string;
  role: "owner" | "member";
}

export interface HouseholdInvite {
  id: string;
  token: string;
  name: string;
  role: string;
  contact: string | null;
  contact_type: ContactType;
  status: InviteStatus;
  created_at: string;
}

export type NewInvite = {
  name: string;
  role: string;
  contact: string;
  contactType: ContactType;
};

export interface Recipe {
  id: string;
  title: string;
  image?: string;
  matchScore?: number;
  isFavorite?: boolean;
  servings?: number;
  ingredients?: string[];
  steps?: string[];
  mealType?: string;
  cuisine?: string;
}

export interface MealPlanRequest {
  pantryItems: string[];
  preferences?: Record<string, unknown>;
  // Requests a subset of the week instead of the default full 7 days -
  // added because a full 7-day/21-meal generation was too slow for one
  // request. dayIndex (0-6, Monday-Sunday) targets a specific day for
  // building a week out of several fast calls; startDay (a weekday name
  // already present in a previously-generated plan) targets regenerating
  // one specific existing day.
  days?: number;
  dayIndex?: number;
  startDay?: string;
}

export interface MealIngredient {
  name: string;
  quantity?: string;
  inPantry?: boolean;
}

export interface MealPlanDay {
  day: string;
  meals: {
    label: string;
    title: string;
    description?: string;
    ingredients?: MealIngredient[];
    cuisine?: string;
  }[];
}

// The actual `POST /api/meal-plan` wire shape - confirmed live 2026-08-30.
// Doesn't match MealPlanDay at all: the real day list is nested under
// `plan.days` (the top-level `days` field is just an echo of the request's
// day count), and each day's `meals` is an object keyed by meal type
// (`breakfast`/`lunch`/`dinner`) with a `name` field, not an array of
// `{label, title}` like the rest of the app expects. See
// `parseMealPlanDays` in `mealPlannerLogic.ts` for the conversion.
export interface RawRecipeMeal {
  name: string;
  description?: string;
  cuisine?: string;
  ingredients?: MealIngredient[];
}

export interface RawMealPlanDay {
  day: string;
  meals: {
    breakfast?: RawRecipeMeal;
    lunch?: RawRecipeMeal;
    dinner?: RawRecipeMeal;
  };
}

export interface RawMealPlanApiResponse {
  plan?: {
    days?: RawMealPlanDay[];
  };
}

export interface ScanResult {
  items: NewPantryItem[];
  raw?: unknown;
}

export interface OnboardingProfile {
  name: string;
  location: string;
  householdAdults: number;
  householdKids: number;
  cuisinePrefs: string[];
  dietaryPrefs: string[];
  allergies: string[];
  goals: string[];
}

export interface DonationPartner {
  id: string;
  name: string;
  description: string;
}

export interface DonationRecord {
  id: string;
  date: string;
  partnerId: string;
  partnerName: string;
  itemNames: string[];
}

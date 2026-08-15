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

export interface MealPlanResponse {
  days: MealPlanDay[];
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

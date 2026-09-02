import AsyncStorage from "@react-native-async-storage/async-storage";
import { accountScopedKey } from "./accountScopedKey";

const HAS_HAD_HOUSEHOLD_KEY_PREFIX = "shelfzero.hasHadHousehold";

// Tracks whether this account has ever had a real household, so a null
// householdId on relaunch can be told apart from "brand-new account that
// hasn't been set up yet" (expected) vs. "was removed from a household
// while the app wasn't running" (needs a clear notice, not a silent
// auto-recreate) - see AuthContext's removedFromHousehold check.
export async function hasHadHousehold(email: string | null): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(accountScopedKey(HAS_HAD_HOUSEHOLD_KEY_PREFIX, email));
    return raw === "true";
  } catch {
    return false;
  }
}

export async function markHasHadHousehold(email: string | null): Promise<void> {
  await AsyncStorage.setItem(accountScopedKey(HAS_HAD_HOUSEHOLD_KEY_PREFIX, email), "true").catch(
    () => {}
  );
}

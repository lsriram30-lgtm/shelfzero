import AsyncStorage from "@react-native-async-storage/async-storage";
import { accountScopedKey } from "./accountScopedKey";
import { OnboardingDraft } from "../screens/onboarding/onboardingDraft";

const ONBOARDING_DRAFT_KEY_PREFIX = "shelfzero.onboardingDraft";

export interface CachedOnboardingDraft {
  draft: OnboardingDraft;
  stepIndex: number;
}

// email comes from the caller's useAuth().currentEmail — these are plain
// functions, not hooks. Keyed by account, same reason as the completed
// onboarding profile (onboardingStorageKey.ts): a second account signing in
// on the same device shouldn't resume into the first account's in-progress
// answers. Only ever populated once an account exists (step 0, AccountStep,
// doesn't collect any draft fields), so there's nothing to key under
// "anonymous" in practice.
export async function getOnboardingDraft(
  email: string | null
): Promise<CachedOnboardingDraft | null> {
  try {
    const raw = await AsyncStorage.getItem(accountScopedKey(ONBOARDING_DRAFT_KEY_PREFIX, email));
    return raw ? (JSON.parse(raw) as CachedOnboardingDraft) : null;
  } catch {
    return null;
  }
}

export async function saveOnboardingDraft(
  draft: OnboardingDraft,
  stepIndex: number,
  email: string | null
): Promise<void> {
  await AsyncStorage.setItem(
    accountScopedKey(ONBOARDING_DRAFT_KEY_PREFIX, email),
    JSON.stringify({ draft, stepIndex })
  ).catch(() => {});
}

export async function clearOnboardingDraft(email: string | null): Promise<void> {
  await AsyncStorage.removeItem(accountScopedKey(ONBOARDING_DRAFT_KEY_PREFIX, email)).catch(
    () => {}
  );
}

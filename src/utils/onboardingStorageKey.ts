const STORAGE_KEY_PREFIX = "shelfzero.onboardingProfile";

// Keyed by the signed-in account's email (captured client-side at sign-in/
// sign-up - there's no backend user ID exposed to the client) so a second
// account signing in on the same device doesn't inherit the first
// account's cached profile and skip onboarding. Falls back to a shared key
// for the (should-be-rare) case where this runs before any email is known.
export function storageKeyFor(email: string | null): string {
  return email ? `${STORAGE_KEY_PREFIX}.${email.toLowerCase()}` : `${STORAGE_KEY_PREFIX}.anonymous`;
}

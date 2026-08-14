// Generic version of the pattern already used for the onboarding profile
// cache (see onboardingStorageKey.ts): keys local-only AsyncStorage data by
// the signed-in account's email so a second account signing in on the same
// device doesn't inherit the first account's cached data. There's no
// backend user ID exposed to the client, so email (captured client-side at
// sign-in/sign-up) is what's available to key by. Falls back to a shared
// "anonymous" key for the brief window before AuthContext resolves the
// real signed-in email.
export function accountScopedKey(prefix: string, email: string | null): string {
  return email ? `${prefix}.${email.toLowerCase()}` : `${prefix}.anonymous`;
}
